import { Players } from "@rbxts/services";
import { once } from "shared/utils/once";

type CollectionOptions = {
	players: ReadonlyArray<Player>;
	collectionEvent: RemoteEvent;
	timeout: number;
	initialization: (player: Player) => void;
};

export async function collectPlayerResponses(opts: CollectionOptions) {
	const responses = new Map<Player, unknown[]>();
	const pending = new Set([...opts.players]);

	await new Promise<void>((resolve) => {
		const finish = once(() => {
			collectionConn.Disconnect();
			playerLeaveConn.Disconnect();
			resolve();
		});

		const collectionConn = opts.collectionEvent.OnServerEvent.Connect((player, ...args) => {
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

		opts.players.forEach((player) => opts.initialization(player));
		task.delay(opts.timeout, finish);
	});
	return { responses, pending };
}
