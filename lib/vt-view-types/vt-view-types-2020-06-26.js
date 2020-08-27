const VT = {};


// think about: A function that runs on the second click
// https://stackoverflow.com/questions/44572859/a-function-that-runs-on-the-second-click

VT.init = function () {

	JTV.init();

	const typesArr = THR.group.children.map(mesh => mesh.userData.type );
	VT.types = [ ... new Set( typesArr ) ];
	const htm = `
    <p>
        Select multiple surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
	<p>
		All geometry types (<span id=VTspnCount >${ types.length }</span> visible):
		<select id=selTypes oninput=VT.showTypes(this.selectedOptions); size=${ VT.types.length < 10 ? VT.types.length : 10 } style=resize:vertical;width:100%; multiple>
		${VT.getTypes()}</select>
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

VT.setAllVisible = function () {
	
	THR.group.children.forEach(mesh => (mesh.visible = true));

	VTspnCount.innerText = THR.group.children.length;
};


