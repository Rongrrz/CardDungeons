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

	const awaiting = new Set<Player>([...players]);
	const responses = new Map<Player, R>();
	const ditched = new Set<Player>();

	await new Promise<void>((resolve) => {
		const finish = once(() => {
			collectionConn();
			playerLeaveConn.Disconnect();
			resolve();
		});

		// TODO: Return boolean, and make collectionEvent remote function
		const collectionConn = collectionEvent.connect((player, result: R) => {
			if (!awaiting.has(player)) return;
			if (validator && validator(result) === false) {
				warn("Validator received an invalid input");
				return;
			}

			awaiting.delete(player);
			responses.set(player, result);
			if (awaiting.size() === 0) finish();
		});

		const playerLeaveConn = Players.PlayerRemoving.Connect((player) => {
			if (!awaiting.has(player)) return;
			awaiting.delete(player);
			ditched.add(player);
			if (awaiting.size() === 0) finish();
		});

		players.forEach((player) => initialization(player));
		Promise.delay(timeout).andThen(finish);
	});

	return { responses, pending: [...ditched, ...awaiting] };
}
