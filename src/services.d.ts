// interface Workspace extends Instance {
// 	Camera: Camera;
// 	Map: Folder & {
// 		GameTiles: Folder;
// 		Field: Folder;
// 	};

// 	Temporary: Folder & {
// 		Placement: Folder;
// 	};

// 	Field: Folder;
// }

interface ReplicatedStorage extends Instance {
	Remotes: Folder & {
		SendToastMessage: RemoteEvent;
		PlayerInputRemote: RemoteEvent;
	};
}
