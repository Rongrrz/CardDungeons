import { subscribe } from "@rbxts/charm";
import Immut, { produce } from "@rbxts/immut";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import {
	fieldCombatantsAtom,
	isCardTrayOpenAtom,
	cardInHandAtom,
	selectedHandIndexAtom,
	targetMarksAtom,
} from "client/atoms/battle-inputting";
import { playerModel } from "client/constants/battle";
import { Selected } from "client/constants/selected";
import { CARD } from "shared/data/cards";
import { CardTargetType, isTargetingAll } from "shared/data/cards/card-target";
import { remotes } from "shared/remotes/remo";
import { BattleClient } from "shared/types/battle/battle";
import { Card } from "shared/types/battle/cards";
import { getCombatantModel } from "./get-combatant-model";

const mouse = Players.LocalPlayer.GetMouse();
let prevTarget: Instance | undefined = undefined;

const trove = new Trove();

subscribe(selectedHandIndexAtom, (newSlot, oldSlot) => {
	if (newSlot === undefined) return targetMarksAtom([]);

	const hand = cardInHandAtom();
	const newCard = CARD[hand[newSlot].card];
	const oldCard = oldSlot !== undefined ? CARD[hand[oldSlot].card] : undefined;
	if (newCard.cardTarget === oldCard?.cardTarget) return; // No need to change targets if same

	switch (newCard.cardTarget) {
		case CardTargetType.All: {
			targetMarksAtom(
				fieldCombatantsAtom().map((c) => {
					return { isEnemy: c.isEnemy, slot: c.slot, selected: Selected.NotSelected };
				}),
			);
			break;
		}
		case CardTargetType.User: {
			const user = fieldCombatantsAtom().find((c) => {
				return c.ownerUserId === Players.LocalPlayer.UserId;
			});
			const result = user
				? [{ isEnemy: user.isEnemy, slot: user.slot, selected: Selected.NotSelected }]
				: [];
			targetMarksAtom(result);
			break;
		}
		case CardTargetType.AllEnemyTeam:
		case CardTargetType.SingleEnemy: {
			targetMarksAtom(
				fieldCombatantsAtom()
					.filter((c) => c.isEnemy === true)
					.map((c) => {
						return { isEnemy: c.isEnemy, slot: c.slot, selected: Selected.NotSelected };
					}),
			);
			break;
		}
		case CardTargetType.AllUserTeam:
		case CardTargetType.SingleUserTeam: {
			targetMarksAtom(
				fieldCombatantsAtom()
					.filter((c) => c.isEnemy === false)
					.map((c) => {
						return { isEnemy: c.isEnemy, slot: c.slot, selected: Selected.NotSelected };
					}),
			);
			break;
		}
	}
});

function cleanPlayerInput() {
	trove.clean();
	selectedHandIndexAtom(undefined);
	isCardTrayOpenAtom(false);
}

// TODO: Change server-side receiver to be RemoteFunction, for invalid player input
function handleReceivePlayerInput(hand: Array<Card>) {
	cleanPlayerInput();
	cardInHandAtom(hand);
	isCardTrayOpenAtom(true);

	const mouseConnection = mouse.Move.Connect(() => {
		// Discontinue if no card is selected
		const cardSlot = selectedHandIndexAtom();
		if (cardSlot === undefined) return;

		// If we are hovering onto the same thing, no need to do anything either
		const mouseTarget = mouse.Target;
		if (mouseTarget === undefined || mouseTarget === prevTarget) return;

		const targetModels = targetMarksAtom()
			.map((c) => getCombatantModel(c.isEnemy, c.slot))
			.filterUndefined();
		const hoveringValidTarget = targetModels.find((m) => {
			return mouseTarget.IsDescendantOf(m);
		});

		// If both are the same (undefined), we have already cleared selection in previous cycle
		if (prevTarget === hoveringValidTarget) return;
		prevTarget = mouseTarget;

		const cardInfo = CARD[cardInHandAtom()[cardSlot].card];
		targetMarksAtom((prev) => {
			let changed = false;
			const updated = prev.map((entry) => {
				// TODO: Refurbish this piece of junk
				const newIsSelected = hoveringValidTarget
					? isTargetingAll(cardInfo.cardTarget)
						? Selected.Selected
						: hoveringValidTarget === getCombatantModel(entry.isEnemy, entry.slot)
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
		const currentlySelectedCard = selectedHandIndexAtom();
		if (currentlySelectedCard === undefined) return;

		const mouseTarget = mouse.Target;
		if (mouseTarget === undefined) return;

		const targetModels = targetMarksAtom()
			.map((c) => getCombatantModel(c.isEnemy, c.slot))
			.filterUndefined();
		const hoveringValidTarget = targetModels.find((m) => {
			return mouseTarget.IsDescendantOf(m);
		});

		if (hoveringValidTarget === undefined) return;
		const targets = targetMarksAtom();

		for (const t of targets) {
			// TODO: Querying Workspace excessively with getCombatantModel
			if (hoveringValidTarget !== getCombatantModel(t.isEnemy, t.slot)) continue;
			const card = cardInHandAtom()[currentlySelectedCard];
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
	battle.combatants
		.filter((c) => c.isEnemy === true)
		.forEach((combatant) => {
			const model =
				(ReplicatedStorage.Models.FindFirstChild(combatant.entity) as unknown as Model) ??
				playerModel;
			const clone = model.Clone();

			clone.Name = `e-${combatant.slot}`;
			const node = Workspace.Battlefield.Enemy.FindFirstChild(
				combatant.slot,
			) as unknown as Part;
			const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
			clone.PivotTo(node.CFrame.mul(new CFrame(0, yBump.Y, 0)));
			clone.Parent = Workspace.Temporary.BattleEnemies;

			fieldCombatantsAtom((current) =>
				produce(current, (draft) => {
					Immut.table.insert(draft, {
						model: clone,
						slot: combatant.slot,
						isEnemy: combatant.isEnemy,
						hp: combatant.stats.hp,
						maxhp: combatant.stats.maxHp,
						ownerUserId: combatant.ownerUserId,
					});
				}),
			);
		});

	battle.combatants
		.filter((c) => c.isEnemy === false)
		.forEach((combatant) => {
			const clone = playerModel.Clone();
			clone.Name = `p-${combatant.slot}`;

			const node = Workspace.Battlefield.Player.FindFirstChild(
				combatant.slot,
			) as unknown as Part;
			const yBump = new Vector3(0, clone.GetExtentsSize().Y / 2 - node.Size.Y / 2, 0);
			clone.PivotTo(node.CFrame.add(new Vector3(0, yBump.Y, 0)));
			clone.Parent = Workspace.Temporary.BattlePlayers;

			fieldCombatantsAtom((current) =>
				produce(current, (draft) => {
					Immut.table.insert(draft, {
						model: clone,
						slot: combatant.slot,
						isEnemy: combatant.isEnemy,
						hp: combatant.stats.hp,
						maxhp: combatant.stats.maxHp,
						ownerUserId: combatant.ownerUserId,
					});
				}),
			);
		});
	remotes.ReceiveBattleInitialized.fire(); // Tells the player that we have finished initializing
}

remotes.SendBattleSnapshot.connect(handleInitializeBattleVisuals);
remotes.SendReadyForPlayerInput.connect(handleReceivePlayerInput);
remotes.ReplicateCardOnUse.connect((card, targetSlot, replicationInfo) => {
	print(`Card ${card} use on slot ${targetSlot}`);
	fieldCombatantsAtom((current) =>
		produce(current, (draft) => {
			// Brute-force update HP & MaxHP
			for (const target of replicationInfo) {
				const model = draft.find(
					(m) => m.slot === target.slot && m.isEnemy === target.isEnemy,
				);
				if (model === undefined) continue;
				model.hp = target.finalHp;
				model.maxhp = target.finalMaxHp;
			}
		}),
	);
});
