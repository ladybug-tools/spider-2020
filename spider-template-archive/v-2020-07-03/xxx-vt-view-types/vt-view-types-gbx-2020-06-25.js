const VT = {};


VT.init = function () {

	console.log( "JTV.json", JTV.json );

	VT.surfaces = JTV.json.Campus.Surface;

	const typesArr = VT.surfaces.map( surface => surface[ "@attributes" ].surfaceType );
	VT.surfaceTypes = [ ... new Set( typesArr ) ];
	
	VT.spaces = [].concat( JTV.json.Campus.Building.Space );
	VT.spaceNames = VT.spaces.map( space => space.Name["#text"] );
	VT.storeyNames = JTV.json.Campus.Building.BuildingStorey.map( storey => storey.Name["#text"] );
	VT.zones = [].concat( JTV.json.Zone ); // ? JTV.json.Zone : [ JTV.json.Zone ];
	VT.zoneNames = VT.zones.map( zone => zone.Name["#text"] );


	const htm = `
    <p>
        Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
	<p>
		All surfaces (<span>${ VT.surfaceTypes.length }</span> visible):
		<select id=selTypes oninput=VT.showTypes(this.selectedOptions); size=${ VT.surfaceTypes.length < 10 ? VT.surfaceTypes.length : 10 } 
		style=resize:vertical;width:100%; multiple>
		${ VT.surfaceTypes.map(( name, index) => `<option value=${index} >${name}</option>`)}
		</select>
	</p>
	<p>
		All spaces (<span>${ VT.spaceNames.length }</span> visible):
		<select id=selSpaces oninput=VT.showSpaces(this.selectedOptions); size=${ VT.spaceNames.length < 10 ? VT.spaceNames.length : 10 } style=resize:vertical;width:100%; multiple>
			${ VT.spaceNames.map(( name, index) => `<option value=${index} >${name}</option>`) }
		</select>
	</p>

	<p>
		All storeys (<span>${ VT.storeyNames.length }</span> visible):
		<select id=selStoreys oninput=VT.showNames(this); size=${ VT.storeyNames.length < 10 ? VT.storeyNames.length : 10 } style=resize:vertical;width:100%; multiple>
			${ VT.storeyNames.map(( name, index) => `<option value=${index} >${name}</option>`) }
		</select>
	</p>
	<p>
		All zones (<span>${ VT.zoneNames.length }</span> visible):
		<select id=selzones oninput=VT.showZones(this.selectedOptions); size=${ VT.zoneNames.length < 10 ? VT.zoneNames.length : 10 } style=resize:vertical;width:100%; multiple>
			${ VT.zoneNames.map(( name, index) => `<option value=${index} >${name}</option>`) }}
		</select>
	</p>
    <p>
        <button onclick="VT.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
    </p>`;

	return htm;
};

VT.showTypes = function (selectedOptions) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		VT.surfaces.filter( surface => surface[ "@attributes" ].surfaceType === option.innerText )
			.map( surface => VT.surfaces.indexOf( surface ) )
			.forEach( index => THR.group.children[ index ].visible = true );

	}
};

VT.showSpaces = function (selectedOptions) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {

		VT.spaces[ option.value ].SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )
			.map( id => VT.surfaces.find( surface => surface["@attributes"].id === id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );
	}
};


VT.showZones = function (selectedOptions) {

	//console.log( "sel", selectedOptions  );
	THR.group.children.forEach(mesh => mesh.visible = false );

	let visibles;

	visibles = Array.from( selectedOptions ).flatMap( option => {

		const zoneId = VT.zones[ option.value ]["@attributes"].id
		//console.log( "zoneId", zoneId );
		
		return VT.spaces.filter( space => space["@attributes"] )
		.filter( space => space["@attributes"].zoneIdRef === zoneId)
		.map( space => VT.spaces.indexOf( space ) )
		
		
	} )
	
	console.log( "visibles", visibles );

	for (let visible of visibles) {

		console.log( "visible", visible );

		VT.spaces[ visible ].SpaceBoundary.map( item => item["@attributes"].surfaceIdRef )
			.map( id => VT.surfaces.find( surface => surface["@attributes"].id === id ) )
			.map( item => VT.surfaces.indexOf( item))
			.forEach( index => THR.group.children[ index ].visible = true );
	}


};

VT.showNames = function( objs ) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {
		const type = objs[option.value];

		THR.group.children.forEach(
			mesh => (mesh.visible = mesh.userData.type === type ? true : mesh.visible )
		);

		VTspnCount.innerText = THR.group.children.filter( mesh => mesh.visible ).length;

	}

};

VT.setAllVisible = function () {
	THR.group.children.forEach(mesh => (mesh.visible = true));

	VTspnCount.innerText = THR.group.children.length;
};


