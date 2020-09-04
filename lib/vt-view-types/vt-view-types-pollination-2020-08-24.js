const VT = {};

VT.types = [];


VT.init = function () {

	if ( !JTV.json ) { JTV.onLoad(); }

	console.log( "json", JTV.json );

	VT.meshTypes = THR.group.children.map( mesh => mesh.userData.type );
	VT.types = [ ...new Set( VT.meshTypes ) ];


	// JTV.uniqueStoriesArray = JTV.json.unique_stories ? JTV.json.unique_stories : [];
	// JTV.uniqueStoriesArray = Array.isArray( JTV.uniqueStoriesArray ) ? JTV.uniqueStoriesArray : [ JTV.unique_storiesArray];

	// VT.uniqueStoriesNames = JTV.uniqueStoriesArray.map( story => story.display_name );
	// VT.uniqueStories = [ ...new Set( VT.uniqueStoriesNames ) ];

	VT.rooms2dsArray = JTV.json.rooms2ds ?
		JTV.json.rooms2ds.map( room => room.display_name ) : [];
	VT.rooms2ds = [ ...new Set( VT.rooms2dsArray ) ];

	const htm = `
	<p>
		Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
	</p>



	<p>
		types (${ VT.types.length })
		<select id=selTypes class=selNav oninput=VT.showTypes(this.selectedOptions);
		${ VT.types.length < 10 ? VT.types.length : 10 }
		style=resize:vertical;width:100%; multiple>
		${ VT.types.map( ( name, index ) => `<option value=${ index } >${ name }</option>` ) }
		</select>
	</p>

	<div id=VTdivRooms>${ this.innerHTML = VT.getRooms() }</div>

	<div id=VTdivStories>${ this.innerHTML = VT.getUniqueStories() }</div>

	<div id=VTdivRooms2ds>${ this.innerHTML = VT.getRooms2ds() }</div>



	<p>
		<button onclick="VT.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
	</p>`;

	//return htm;

	VTdivViewTypes.innerHTML = htm;

};


VT.getTypes = function () {

	VT.meshTypes = THR.group.children.map( mesh => mesh.userData.type );
	VT.types = [ ...new Set( VT.meshTypes ) ];


	//VT.roomsArray = JTV.json.rooms ? JTV.json.rooms.map( room => room.display_name ) : [];
	//VT.rooms = [ ...new Set( VT.roomsArray ) ];

	const options = VT.rooms.map( ( room, index ) => `<option value=${ index } >${ room }</option>` );

	const htm = VT.rooms.length ? `
	<p>
		rooms( ${ VT.rooms.length } )<br>
		<select id = selRooms class=selNav oninput = VT.showRooms(this.selectedOptions);
			size = ${ VT.rooms.length < 10 ? VT.rooms.length : 10 }
			style = "resize: vertical; width:100%;" multiple >
				${ options }
		</select>
	</p>
	` : "";

	return htm;

};

VT.getRooms = function () {

	VT.roomsArray = JTV.json.rooms ? JTV.json.rooms.map( room => room.display_name ) : [];
	VT.rooms = [ ...new Set( VT.roomsArray ) ];

	const options = VT.rooms.map( ( room, index ) => `<option value=${ index } >${ room }</option>` );

	const htm = VT.rooms.length ? `
	<p>
		rooms( ${ VT.rooms.length } )<br>
		<select id = selRooms class=selNav oninput = VT.showRooms(this.selectedOptions);
			size = ${ VT.rooms.length < 10 ? VT.rooms.length : 10 }
			style = "resize: vertical; width:100%;" multiple >
				${ options }
		</select>
	</p>
	` : "";

	return htm;

};


VT.getUniqueStories = function () {

	VT.uniqueStoriesArray = JTV.json.unique_stories ? JTV.json.unique_stories.map( story => story.display_name ) : [];
	VT.stories = [ ...new Set( VT.uniqueStoriesArray ) ];

	const options = VT.stories.map( ( story, index ) => `<option value=${ index } >${ story }</option>` );

	const htm = VT.stories.length ? `
	<p>
		Unique Stories( ${ VT.stories.length } )<br>
		<select id = selStories class=selNav oninput = VT.showstories(this.selectedOptions);
			size = ${ VT.stories.length < 10 ? VT.stories.length : 10 }
			style = "resize: vertical; width:100%;" multiple >
				${ options }
		</select>
	</p>
	` : "";

	return htm;

};



VT.getRooms2ds = function () {

	VT.rooms2ds = [];

	VT.uniqueStoriesArray = JTV.json.unique_stories ? JTV.json.unique_stories : [];
	//VT.stories = [ ...new Set( VT.uniqueStoriesArray ) ];

	for ( let story of VT.uniqueStoriesArray ) {

		console.log( "story", story );

		const rooms = story.room_2ds ? story.room_2ds.map( room2d => room2d.display_name ) : [];
		//rooms = [ ...new Set( VT.rooms2dsArray ) ];

		console.log( "rooms", rooms );

		VT.rooms2ds.push( ...rooms );


	}

	//console.log( "VT.rooms2ds", VT.rooms2ds );
	const options = VT.rooms2ds.map( ( room2d, index ) => `<option value=${ index } >${ room2d }</option>` );

	const htm = VT.rooms2ds.length ? `
	<p>
		Rooms 2D( ${ VT.rooms2ds.length } )<br>
		<select id = selrooms2ds class=selNav oninput = VT.showRooms2ds(this.selectedOptions);
			size = ${ VT.rooms2ds.length < 10 ? VT.rooms2ds.length : 10 }
			style = "resize: vertical; width:100%;" multiple >
				${ options }
		</select>
	</p>
	` : "";

	return htm;

};


VT.showTypes = function ( selectedOptions ) {

	THR.group.children.forEach( mesh => mesh.visible = false );

	for ( let option of selectedOptions ) {

		const type = VT.types[ option.value ];

		THR.group.children.forEach(
			mesh => ( mesh.visible = mesh.userData.type === type ? true : mesh.visible )
		);
	}
};

VT.showRooms = function ( selectedOptions ) {

	THR.group.children.forEach( mesh => {

		mesh.visible = false

		const geometry = new THREE.Geometry().fromBufferGeometry( mesh.geometry );

		mesh.geometry = geometry;

		mesh.geometry.verticesNeedUpdate = true;
		mesh.geometry.elementsNeedUpdate = true;
		mesh.geometry.morphTargetsNeedUpdate = true;
		mesh.geometry.uvsNeedUpdate = true;
		mesh.geometry.normalsNeedUpdate = true;
		mesh.geometry.colorsNeedUpdate = true;
		mesh.geometry.tangentsNeedUpdate = true;

		//console.log( "mesh", mesh );

	} );


	VT.rooms2ds = function ( selectedOptions ) {

		THR.group.children.forEach( mesh => mesh.visible = false );

		for ( let option of selectedOptions ) {

			console.log( "option", option );

			//const storey = VT.unique_stories[ option.value ];

			THR.group.children.forEach(
				mesh => ( mesh.visible = mesh.userData.type === type ? true : mesh.visible )
			);
		}
	};

	VT.showUniqueStoreys = function ( selectedOptions ) {

		THR.group.children.forEach( mesh => mesh.visible = false );

		for ( let option of selectedOptions ) {

			const storey = VT.unique_stories[ option.value ];

			THR.group.children.forEach(
				mesh => ( mesh.visible = mesh.userData.type === type ? true : mesh.visible )
			);
		}
	};



	for (let option of selectedOptions) {

		const room = VT.rooms[option.value];

		//VT.rooms[ option.value ].SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )

		THR.group.children.forEach(
			mesh => (mesh.visible = mesh.userData.type === room ? true : mesh.visible)
		);
	}
};

VT.setAllVisible = function () {
	THR.group.children.forEach( mesh => ( mesh.visible = true ) );
};
