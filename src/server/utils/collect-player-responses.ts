import Remo from "@rbxts/remo";
import { Players } from "@rbxts/services";
import { once } from "shared/utils/once";
import { getPlayers, PlayerOrIdGroup } from "shared/utils/player-or-id";

type CollectionOptions<R> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	collectionEvent: Remo.ServerRemote<any[]>;
	players: PlayerOrIdGroup;
	timeout: number;
	validator?: (data: R) => boolean;
	initialization: (player: Player) => void;
};

export async function collectPlayerResponses<R>(opts: CollectionOptions<R>) {
	const { collectionEvent, initialization, validator, timeout } = opts;
	const players = getPlayers(opts.players);
	const responses = new Map<Player, R | undefined>();
	const pending = new Set([...players]);

	await new Promise<void>((resolve) => {
		const finish = once(() => {
			collectionConn();
			playerLeaveConn.Disconnect();
			resolve();
		});

		const collectionConn = collectionEvent.connect((player, result: R) => {
			if (!pending.has(player)) return;

			// TODO: Still need additional validators, ex. check if player has specified card
			if (validator && validator(result) !== true) return;

			pending.delete(player);
			responses.set(player, result);
			if (pending.size() === 0) finish();
		});

		const playerLeaveConn = Players.PlayerRemoving.Connect((player) => {
			if (!pending.has(player)) return;
			pending.delete(player);
			responses.set(player, undefined);
			if (pending.size() === 0) finish();
		});

		players.forEach((player) => initialization(player));
		Promise.delay(timeout).andThen(finish);
	});
	return { responses, pending };
}
