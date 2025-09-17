import { subscribe } from "@rbxts/charm";
import { produce } from "@rbxts/immut";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import {
	cardTargets,
	isCardContainerIn,
	playerHand,
	selectedCardSlotAtom,
} from "client/atoms/battle-inputting";
import { playerModel } from "client/constants/battle";
import { Selected } from "client/constants/selected";
import { cards } from "shared/data/cards";
import { CardTargetType, isTargetingAll } from "shared/data/cards/card-target";
import { remotes } from "shared/remotes/remo";
import { BattleClient } from "shared/types/battle";
import { Card } from "shared/types/cards";

const mouse = Players.LocalPlayer.GetMouse();
const field = {
	players: new Array<{ model: Model; slot: number; ownerUserId?: number }>(),
	enemies: new Array<{ model: Model; slot: number }>(),
};
let prevTarget: Instance | undefined = undefined;

const trove = new Trove();

subscribe(selectedCardSlotAtom, (newSlot, oldSlot) => {
	if (newSlot === undefined) return cardTargets([]);

	const hand = playerHand();
	const newCard = cards[hand[newSlot].card];
	const oldCard = oldSlot !== undefined ? cards[hand[oldSlot].card] : undefined;
	if (newCard.cardTarget === oldCard?.cardTarget) return; // No need to change targets if same

	switch (newCard.cardTarget) {
		case CardTargetType.All: {
			const playerTeam = field.players.map((entity) => {
				return { ...entity, selected: Selected.NotSelected };
			});
			const enemyTeam = field.enemies.map((entity) => {
				return { ...entity, selected: Selected.NotSelected };
			});
			cardTargets([...playerTeam, ...enemyTeam]);
			break;
		}
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

function cleanPlayerInput() {
	trove.clean();
	selectedCardSlotAtom(undefined);
	isCardContainerIn(false);
}

// TODO: Change server-side receiver to be RemoteFunction, for invalid player input
function handleReceivePlayerInput(hand: Array<Card>) {
	cleanPlayerInput();
	playerHand(hand);
	isCardContainerIn(true);

	const mouseConnection = mouse.Move.Connect(() => {
		// Discontinue if no card is selected
		const cardSlot = selectedCardSlotAtom();
		if (cardSlot === undefined) return;

		// If we are hovering onto the same thing, no need to do anything either
		const mouseTarget = mouse.Target;
		if (mouseTarget === undefined || mouseTarget === prevTarget) return;

		const targetModels = cardTargets();
		const hoveringValidTarget = targetModels.find((m) => {
			return mouseTarget.IsDescendantOf(m.model);
		})?.model;

		// If both are the same (undefined), we have already cleared selection in previous cycle
		if (prevTarget === hoveringValidTarget) return;
		prevTarget = mouseTarget;

		const cardInfo = cards[playerHand()[cardSlot].card];
		cardTargets((prev) => {
			let changed = false;
			const updated = prev.map((entry) => {
				// TODO: Refurbish this piece of junk
				const newIsSelected = hoveringValidTarget
					? isTargetingAll(cardInfo.cardTarget)
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

	const clickConnection = mouse.Button1Up.Connect(() => {
		const currentlySelectedCard = selectedCardSlotAtom();
		if (currentlySelectedCard === undefined) return;

		const mouseTarget = mouse.Target;
		if (mouseTarget === undefined) return;

		const targetModels = cardTargets();
		const hoveringValidTarget = targetModels.find((m) => {
			return mouseTarget.IsDescendantOf(m.model);
		})?.model;

		if (hoveringValidTarget === undefined) return;
		const targets = cardTargets();

		for (const t of targets) {
			if (hoveringValidTarget !== t.model) continue;
			const card = playerHand()[currentlySelectedCard];
			remotes.ReceivePlayerInput.fire({
				kind: "PlayCard",
				cardUsed: card,
				targetSlot: t.slot,
			});
			cleanPlayerInput();
			return;
		}
	});

	const endTurnConnection = ReplicatedStorage.Remotes.EndTurnClicked.Event.Connect(() => {
		remotes.ReceivePlayerInput.fire({ kind: "EndTurn" });
		cleanPlayerInput();
	});

	trove.add(mouseConnection);
	trove.add(clickConnection);
	trove.add(endTurnConnection);
}

function handleInitializeBattleVisuals(battle: BattleClient) {
	battle.enemies.forEach((entity) => {
		const model = ReplicatedStorage.Models[entity.model];
		const clone = model.Clone();

		clone.Name = `e-${entity.slot}`;
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
		clone.Name = `p-${entity.slot}`;

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
