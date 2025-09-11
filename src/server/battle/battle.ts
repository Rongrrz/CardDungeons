import { toastPlayers } from "server/toast/toast";
import { Combatant, PlayerCombatant } from "./combatant";
import { CardController, isCardController } from "./controllers/card-controller";
import { collectPlayerResponses } from "server/utils/collect-player-responses";
import { ReplicatedStorage } from "@rbxts/services";
import { BF_INIT_TIME, PLAYER_TURN_TIME } from "server/constants/battle";
import { BattleClient } from "shared/types/battle";
import { remotes } from "shared/remotes/remo";

export class Battle {
	// Metadata
	private participants = new Array<Player>();

	private playerTeam = new Array<Combatant>();
	private enemyTeam = new Array<Combatant>();

	private turn = 0;

	public constructor(playerTeam: Array<Combatant>, enemyTeam: Array<Combatant>) {
		this.playerTeam = playerTeam;
		this.enemyTeam = enemyTeam;

		// Populate participants
		for (const entity of playerTeam) {
			if (entity.controller instanceof CardController) {
				this.participants.push(entity.controller.owner);
			}
		}
	}

	private toClientRepresentation(): BattleClient {
		return {
			turn: this.turn,
			players: this.playerTeam.map((e) => e.toClientRepresentation()),
			enemies: this.enemyTeam.map((e) => e.toClientRepresentation()),
		};
	}

	public isBattleOver(): boolean {
		return false;
	}

	private endBattle() {
		// TODO: Fill
	}

	public async startBattle() {
		await this.processInitialize();
		while (!this.isBattleOver()) {
			await this.takeTurn();
		}
		this.endBattle();
	}

	private processInitialize() {
		toastPlayers(this.participants, "Initializing battle...");
		const initializer = remotes.SendBattleSnapshot;
		const receiver = remotes.ReceiveBattleInitialized;
		return collectPlayerResponses({
			players: this.participants,
			collectionEvent: receiver,
			timeout: BF_INIT_TIME,
			initialization: (player) => initializer.fire(player, this.toClientRepresentation()),
		});
	}

	private async takeTurn() {
		this.turn++;
		const { responses, pending } = await this.collectInputs();
		await this.calculateInputs();
		await this.replicateInputs();
	}

	// TODO: This function should also process entity and enemy inputs
	private collectInputs() {
		toastPlayers(this.participants, "Collecting inputs...");
		const initializer = remotes.SendReadyForPlayerInput;
		const receiver = remotes.ReceivePlayerInput;
		return collectPlayerResponses({
			players: this.participants,
			collectionEvent: receiver,
			timeout: PLAYER_TURN_TIME,
			initialization: (player) => {
				const combatant = this.playerTeam.find(
					(c): c is PlayerCombatant =>
						isCardController(c.controller) && c.controller.owner === player,
				);
				if (combatant === undefined) return print("Player combatant not found");
				const playerHand = combatant.controller.getHand();
				initializer.fire(player, playerHand);
			},
		});
	}

	private calculateInputs() {
		toastPlayers(this.participants, "Calculating turn...");
		task.wait(2);
	}

	private replicateInputs() {
		toastPlayers(this.participants, "Replicating turn fx...");
		task.wait(2);
	}
}
