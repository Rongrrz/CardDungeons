import Remo from "@rbxts/remo";
import { Players } from "@rbxts/services";
import { once } from "shared/utils/once";
import { getPlayers, PlayerOrIdGroup } from "shared/utils/player-or-id";

type CollectionOptions = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	collectionEvent: Remo.ServerRemote<any[]>;
	players: PlayerOrIdGroup;
	timeout: number;
	initialization: (player: Player) => void;
};

export async function collectPlayerResponses(opts: CollectionOptions) {
	const { collectionEvent, initialization, timeout } = opts;
	const players = getPlayers(opts.players);
	const responses = new Map<Player, unknown[]>();
	const pending = new Set([...players]);

	await new Promise<void>((resolve) => {
		const finish = once(() => {
			collectionConn();
			playerLeaveConn.Disconnect();
			resolve();
		});

		const collectionConn = collectionEvent.connect((player, ...args) => {
			if (!pending.has(player)) return;

			// TODO: Still need additional validators, ex. check if player has specified card
			pending.delete(player);
			responses.set(player, [...args]);
			if (pending.size() === 0) finish();
		});

		const playerLeaveConn = Players.PlayerRemoving.Connect((player) => {
			if (!pending.has(player)) return;
			pending.delete(player);
			responses.set(player, []);
			if (pending.size() === 0) finish();
		});

		players.forEach((player) => initialization(player));
		Promise.delay(timeout).andThen(finish);
	});
	return { responses, pending };
}
