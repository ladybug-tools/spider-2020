const VT = {};

VT.types = [];


VT.init = function () {

	if ( !JTV.json ) { JTV.onLoad(); }

	console.log( "json", JTV.json );
	VT.meshTypes = THR.group.children.map(mesh => mesh.userData.type );
	VT.types = [...new Set(VT.meshTypes)];

	VT.roomsArray= JTV.json.rooms.map(room => room.display_name  );
	VT.rooms = [...new Set(VT.roomsArray)];

	const htm = `
    <p>
        Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
    <p>types (${ VT.types.length})
		<select id=selTypes class=selNav oninput=VT.showTypes(this.selectedOptions); 
		${ VT.types.length < 10 ? VT.types.length : 10 } multiple>
		${ VT.types.map(( name, index) => `<option value=${index} >${name}</option>`)}
		</select>
	</p>
	
	<p>rooms (${ VT.rooms.length})
	<select id=selRooms class=selNav oninput=VT.showRooms(this.selectedOptions); 
	size=${ VT.rooms.length < 10 ? VT.rooms.length : 10 } multiple>
	${ VT.rooms.map(( name, index) => `<option value=${index} >${name}</option>`)}
	</select>
</p>
    <p>
        <button onclick="VT.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
    </p>`;

	return htm;
};




VT.getRooms= function () {


	//console.log( "types", VT.types );

	const options = VT.types.map((type, index) => `<option value=${index} >${type}</option>`);

	return options;
};

VT.showTypes = function (selectedOptions) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {
		const type = VT.types[option.value];

		THR.group.children.forEach(
			mesh => (mesh.visible = mesh.userData.type === type ? true : mesh.visible)
		);
	}
};

VT.showRooms = function (selectedOptions) {

	THR.group.children.forEach(mesh => {
		
		//mesh.visible = false 

		const geometry = new THREE.Geometry().fromBufferGeometry( mesh.geometry );
		
		
		mesh.geometry = geometry;

		mesh.geometry.verticesNeedUpdate = true;
		mesh.geometry.elementsNeedUpdate = true;
		mesh.geometry.morphTargetsNeedUpdate = true;
		mesh.geometry.uvsNeedUpdate = true;
		mesh.geometry.normalsNeedUpdate = true;
		mesh.geometry.colorsNeedUpdate = true;
		mesh.geometry.tangentsNeedUpdate = true;



		console.log( "mesh", mesh );
	
	} );





	// for (let option of selectedOptions) {
	// 	const room = VT.rooms[option.value];

	// 	// VT.rooms[ option.value ].SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )

	// 	// THR.group.children.forEach(
	// 	// 	mesh => (mesh.visible = mesh.userData.type === type ? true : mesh.visible)
	// 	// );
	// }
};

VT.setAllVisible = function () {
	THR.group.children.forEach(mesh => (mesh.visible = true));
};
