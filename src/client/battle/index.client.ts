import { peek, subscribe } from "@rbxts/charm";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import {
	cardContainerCards,
	cardTargets,
	isCardContainerIn,
	selectedCardSlotAtom,
} from "client/atoms/battle-inputting";
import { playerModel } from "client/constants/battle";
import { Selected } from "client/constants/selected";
import { cards } from "shared/data/cards";
import { CardTargetType, isTargetingAll } from "shared/data/cards/target-type";
import { enemyModels } from "shared/data/enemies/models";
import { Battle } from "shared/types/battle";
import { Card } from "shared/types/cards";

const receivePlayerInput = ReplicatedStorage.Remotes.ReceivePlayerInput;
const initializeBattleVisuals = ReplicatedStorage.Remotes.InitializeBattleVisuals;

const mouse = Players.LocalPlayer.GetMouse();
const field = {
	players: new Array<{ model: Model; id: string }>(),
	enemies: new Array<{ model: Model; slot: number }>(),
};
let prevTarget: Instance | undefined = undefined;

let usedCards = new Array<Card>(); // Cards used for the current player-input cycle
let localHand = new Array<Card>(); // Cards players have for the current player-input cycle

subscribe(selectedCardSlotAtom, (newSlot, oldSlot) => {
	if (newSlot === undefined) return cardTargets([]);

	const newCard = cards[localHand[newSlot].card];
	const oldCard = oldSlot !== undefined ? cards[localHand[oldSlot].card] : undefined;
	if (newCard.targetType === oldCard?.targetType) return; // No need to change targets if same

	switch (newCard.targetType) {
		case CardTargetType.None:
			cardTargets([]);
			break;
		case CardTargetType.User: {
			const userModel = field.players.find((player) => {
				return player.id === tostring(Players.LocalPlayer.UserId);
			});
			cardTargets([{ ...userModel!, selected: Selected.NotSelected }]);
			break;
		}
		case CardTargetType.AllEnemyTeam:
		case CardTargetType.SingleEnemy: {
			cardTargets(
				field.enemies.map((e) => {
					return { ...e, selected: Selected.NotSelected };
				}),
			);
			break;
		}
		case CardTargetType.AllUserTeam:
		case CardTargetType.SingleUserTeam: {
			cardTargets(
				field.players.map((p) => {
					return { ...p, selected: Selected.NotSelected };
				}),
			);
			break;
		}
	}
});

// TODO: Change server-side receiver to be RemoteFunction, for invalid player input
function handleReceivePlayerInput(hand: Array<Card>) {
	cardContainerCards(hand); // Populate the inputting GUI
	isCardContainerIn(true);

	localHand = hand;
	usedCards = [];

	const mouseConnection = mouse.Move.Connect(() => {
		// Discontinue if no card is selected
		const cardSlot = peek(selectedCardSlotAtom);
		if (cardSlot === undefined) return;

		// If we are hovering onto the same thing, no need to do anything either
		const mouseTarget = mouse.Target;
		if (mouseTarget === undefined || mouseTarget === prevTarget) return;

		const targetModels = peek(cardTargets);
		const hoveringValidTarget = targetModels.find((m) => {
			return mouseTarget.IsDescendantOf(m.model);
		})?.model;

		// If both are the same (undefined), we have already cleared selection in previous cycle
		if (prevTarget === hoveringValidTarget) return;
		prevTarget = mouseTarget;

		const cardInfo = cards[localHand[cardSlot].card];
		cardTargets((prev) => {
			let changed = false;
			const updated = prev.map((entry) => {
				// TODO: Refurbish this piece of junk
				const isSelected = hoveringValidTarget
					? isTargetingAll(cardInfo.targetType)
						? Selected.Selected
						: hoveringValidTarget === entry.model
							? Selected.Selected
							: Selected.NotSelected
					: Selected.NotSelected;
				if (entry.selected !== isSelected) {
					changed = true;
					return { ...entry, selected: isSelected };
				}
				return entry;
			});
			return changed ? updated : prev;
		});
	});

	// Once finish
	// inputtingAtom(false);
}

function handleInitializeBattleVisuals(battle: Omit<Battle, "enemyData">) {
	battle.enemies.forEach((enemy, index) => {
		const model = enemyModels[enemy.name] ?? enemyModels.greenSlime;
		const clone = model.Clone();
		clone.Name = `${index + 1}`;
		const node = Workspace.Battlefield.Enemy.FindFirstChild(index + 1) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.mul(new CFrame(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattleEnemies;

		field.enemies.push({
			model: clone,
			slot: index,
		});
	});

	let index = 0;
	battle.players.forEach((player, id) => {
		const clone = playerModel.Clone();
		clone.Name = tostring(id);
		const node = Workspace.Battlefield.Player.FindFirstChild(++index) as unknown as Part;

		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.add(new Vector3(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattlePlayers;

		field.players.push({
			model: clone,
			id: tostring(id),
		});
	});
	initializeBattleVisuals.FireServer(); // Tells the player that we have finished initializing
}

receivePlayerInput.OnClientEvent.Connect(handleReceivePlayerInput);
initializeBattleVisuals.OnClientEvent.Connect(handleInitializeBattleVisuals);
