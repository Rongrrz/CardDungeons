import { Players } from "@rbxts/services";
import { once } from "shared/utils/once";
import { getPlayers, PlayerOrIdGroup } from "shared/utils/player-or-id";

type CollectionOptions = {
	players: PlayerOrIdGroup;
	collectionEvent: RemoteEvent;
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
			collectionConn.Disconnect();
			playerLeaveConn.Disconnect();
			resolve();
		});

		const collectionConn = collectionEvent.OnServerEvent.Connect((player, ...args) => {
			if (!pending.has(player)) return;

			// TODO: Verify data integrity; validator?
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
