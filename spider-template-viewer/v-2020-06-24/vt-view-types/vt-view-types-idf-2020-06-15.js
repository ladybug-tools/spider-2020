const VT = {};


VT.init = function () { // called by html > view menu > ontoggle

	VT.parseAttributes();

	const htm = `
    <p>
        Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
	<p>
		All surfaces (<span id=VTspnCount >${ THR.group.children.length }</span> visible):
        <select id=selTypes oninput=VT.showTypes(this.selectedOptions); size=10 style=resize:vertical;width:100%; multiple>${VT.getTypes()}</select>
    </p>
    <p>
        <button onclick="VT.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
	</p>
	
	<hr>
	`;
	
	return htm;
};

VT.getTypes = function () { 

	VT.meshTypes = THR.group.children.map(mesh => mesh.userData.type );

	VT.types = [...new Set(VT.meshTypes)];

	const options = VT.types.map((type, index) => `<option value=${index} >${type}</option>`);

	return options;
};


VT.parseAttributes = function() {

	meshes = THR.group.children.filter(mesh => mesh.userData.text && mesh.userData.type !== "shade" && mesh.userData.type !== "window");

	keys = [];
	for ( let i = 0; i < 5; i++ ) {

		//lines = meshes[ i ].userData.text.split( "\n");

		matches = meshes[ i ].userData.text.match( /\!-(.*?)[\r?\n]/gi );

		matches.forEach(  key => {
			
			if ( ! keys.includes ( key.slice( 3) ) && !key.includes( "Vert" )) {

				keys.push( key.slice( 3 ) )
			}

		} )

	};


	texts = meshes.map( mesh => mesh.userData.text );

	options = keys.map( ( key, index ) => {

		const valuesAll = texts.map( text => {
			const regex = new RegExp( `  (.*?),.*!- ${ key }`, "i" );
			let matches = text.match( regex );
			matches = matches ? matches[ 1 ] : "";
			return matches;
		} );
		
		const valueUniques = [ ... new Set( valuesAll )];

		return valueUniques.map(  value => `<option>${ value }</option>` )

	} );

	htm = keys.map( ( key, index ) => `

${ key }: <div><select id=VTsel${ index } oninput=VT.showAttributes(this) style=height:100%;resize:vertical;width:100%; multiple >${ options[ index ] }</select>
</div>` );


	VTdivAttributes.innerHTML = "Surfaces in 'BuildingSurface:Detailed` - work-in-progress<br>" + htm.join( "");

};



VT.showAttributes = function (select) {

	THR.group.children.forEach(mesh => mesh.visible = false );

	for (let option of select.selectedOptions) {

		THR.group.children.forEach(
			mesh => (mesh.visible = mesh.userData.text && mesh.userData.text.includes( option.value ) ? true : mesh.visible)
		);
	}
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

VT.setAllVisible = function () {
	THR.group.children.forEach(mesh => (mesh.visible = true));

	VTspnCount.innerText = THR.group.children.length;
};


