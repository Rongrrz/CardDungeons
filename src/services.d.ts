interface Workspace extends Instance {
	Camera: Camera;
	Battlefield: Folder & {
		Scene: Folder;
		Enemy: Folder;
		Player: Folder;
	};

	Temporary: Folder & {
		BattleEnemies: Folder;
		BattlePlayers: Folder;
	};
}

interface ReplicatedStorage extends Instance {
	Remotes: Folder & {
		SendToastMessage: RemoteEvent;
		ReceivePlayerInput: RemoteEvent;
		InitializeBattleVisuals: RemoteEvent;
		EndTurnClicked: BindableEvent;
	};
	Models: Folder & {
		GreenSlime: Model;
		BlueSlime: Model;
		PlayerPet: Model;
	};
}
