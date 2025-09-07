import { peek, subscribe } from "@rbxts/charm";
import { produce } from "@rbxts/immut";
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
import { remotes } from "shared/remotes/remo";
import { BattleClient } from "shared/types/battle";
import { Card } from "shared/types/cards";

const mouse = Players.LocalPlayer.GetMouse();
const field = {
	players: new Array<{ model: Model; slot: number; ownerUserId?: number }>(),
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
			const userModel = field.players.find((entity) => {
				return entity.ownerUserId === Players.LocalPlayer.UserId;
			});
			cardTargets([{ ...userModel!, selected: Selected.NotSelected }]);
			break;
		}
		case CardTargetType.AllEnemyTeam:
		case CardTargetType.SingleEnemy: {
			cardTargets(
				field.enemies.map((entity) => {
					return { ...entity, selected: Selected.NotSelected };
				}),
			);
			break;
		}
		case CardTargetType.AllUserTeam:
		case CardTargetType.SingleUserTeam: {
			cardTargets(
				field.players.map((entity) => {
					return { ...entity, selected: Selected.NotSelected };
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
				const newIsSelected = hoveringValidTarget
					? isTargetingAll(cardInfo.targetType)
						? Selected.Selected
						: hoveringValidTarget === entry.model
							? Selected.Selected
							: Selected.NotSelected
					: Selected.NotSelected;
				if (entry.selected !== newIsSelected) {
					changed = true;
					return produce(entry, (draft) => {
						draft.selected = newIsSelected;
					});
				}
				return entry;
			});
			return changed ? updated : prev;
		});
	});

	// Once finish
	// inputtingAtom(false);
}

function handleInitializeBattleVisuals(battle: BattleClient) {
	battle.enemies.forEach((entity) => {
		const model = ReplicatedStorage.Models[entity.model];
		const clone = model.Clone();

		clone.Name = tostring(entity.slot);
		const node = Workspace.Battlefield.Enemy.FindFirstChild(entity.slot) as unknown as Part;
		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.mul(new CFrame(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattleEnemies;

		field.enemies.push({
			model: clone,
			slot: entity.slot,
		});
	});

	battle.players.forEach((entity) => {
		const clone = playerModel.Clone();
		clone.Name = tostring(entity.slot);

		const node = Workspace.Battlefield.Player.FindFirstChild(entity.slot) as unknown as Part;
		const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
		clone.PivotTo(node.CFrame.add(new Vector3(0, yBump.Y, 0)));
		clone.Parent = Workspace.Temporary.BattlePlayers;

		field.players.push({
			model: clone,
			slot: entity.slot,
			ownerUserId: entity.ownerUserId,
		});
	});
	remotes.ReceiveBattleInitialized.fire(); // Tells the player that we have finished initializing
}

remotes.SendBattleSnapshot.connect(handleInitializeBattleVisuals);
remotes.SendReadyForPlayerInput.connect(handleReceivePlayerInput);
