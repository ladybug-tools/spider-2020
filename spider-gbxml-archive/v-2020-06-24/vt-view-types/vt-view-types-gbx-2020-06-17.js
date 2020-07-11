const VT = {};


VT.init = function () {

	console.log( "", JTV.json.Campus.Building.Space  );

	names = JTV.json.Campus.Building.Space.map( space => space.Name["#text"] )

	console.log( "names", names );

	const htm = `
    <p>
        Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
	<p>
		All surfaces (<span id=VTspnCount >${ THR.group.children.length }</span> visible):
		<select id=selTypes oninput=VT.showTypes(this.selectedOptions); size=10 style=resize:vertical;width:100%; multiple>
		${VT.getTypes()}
		</select>
	</p>
	<p>
		All spaces (<span id=VTspnCount >${ GBX.spaces.length }</span> visible):
		<select id=selSpaces oninput=VT.showNames(this.selectedOptions); size=10 style=resize:vertical;width:100%; multiple>
			${VT.getNames(GBX.spaces)}
		</select>
	</p>

	<p>
		All storeys(<span id=VTspnCount >${ GBX.storeys.length }</span> visible):
		<select id=selStoreys oninput=VT.showNames(this.selectedOptions); size=10 style=resize:vertical;width:100%; multiple>
			${VT.getNames(GBX.storeys)}
		</select>
	</p>
	<p>
		All zones (<span id=VTspnCount >${ GBX.zones.length }</span> visible):
		<select id=selzones oninput=VT.showNames(this.selectedOptions); size=10 style=resize:vertical;width:100%; multiple>
			${VT.getNames(GBX.zones)}
		</select>
	</p>
    <p>
        <button onclick="VT.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
    </p>`;

	return htm;
};

VT.getTypes = function () {
	VT.meshTypes = THR.group.children.map(mesh => mesh.userData.type );

	VT.types = [...new Set(VT.meshTypes)];

	//console.log( "types", VT.types );

	const options = VT.types.map((type, index) => `<option value=${index} >${type}</option>`);

	return options;
};

VT.showTypes = function (selectedOptions) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of selectedOptions) {
		const type = VT.types[option.value];

		THR.group.children.forEach(
			mesh => (mesh.visible = mesh.userData.type === type ? true : mesh.visible )
		);

		VTspnCount.innerText = THR.group.children.filter( mesh => mesh.visible ).length;

	}
};


VT.getNames = function( objs ) {

	names = objs.map( obj => {

		name = obj.match( /<Name>(.*?)<\/Name>/i )[ 1 ];

		//id = obj.match( /<Name>(.*?)<\/Name>/i )[ 1 ];
		
		//console.log( "obj", name );

		return name;
	} );

	const options = names.map(( name, index) => `<option value=${index} >${name}</option>`);

	return options;

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


