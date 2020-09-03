const VT = {};


VT.init = function () {

	GBX.setSurfacesMetadata();

	console.log( "", 23 );

	THR.group.children.forEach( surface => surface.userData.positionStart = surface.position.clone() );

	const htm = `
	<p>
		Select multiple items to view. Use cursor keys to scroll through the lists.<br>
	</p>
	<p>
		<button onclick="VT.resetAll();" title="Show all surfaces">&sdotb; reset visibility & position</button>
	</p>

	<div id=VTdivSurfaceTypes>${ this.innerHTML = VT.getElementSelect( GBX.surfaceTypes, "surfaceType", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link1A8" target = "_blank" > Surface</a> Types') }</div>

	<div id=VTdivSpaces>${ this.innerHTML = VT.getElementSelect( GBX.spaceNames, "spaceName", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link19D" target="_blank">Spaces</a>' ) }</div>

	<div id=VTdivStoreys>${ this.innerHTML = VT.getElementSelect( GBX.storeyNames, "storeyName", "Storeys" ) }</div>

	<div id=VTdivZones>${ this.innerHTML = VT.getElementSelect( GBX.zoneNames, "zoneName", "Zones" ) }</div>

	<div id=VTdivCadObjects>${ this.innerHTML = VT.getElementSelect( GBX.CADObjects, "cadObject", "CAD Objects" ) }</div>

	`;

	VTdivViewTypes.innerHTML = htm;

};



VT.getElementSelect = function ( element = [], dataType = "surfaceType", title = "element" ) {

	const htm = `
		<p>
			${ title } (<span>${ element.length }</span>):
			<select id=VTsel${ dataType }  oninput=VT.showTypes(this.selectedOptions,"${ dataType }");
				size=${ element.length < 10 ? element.length : 10 }
				style=resize:vertical;width:100%; multiple>
				${ element.map( ( name, index ) => `<option value=${ index } >${ name }</option>` ) }
			</select>

			<label>
				explode: <output id=VTout${ dataType } >1</output>
				<input type=range
				oninput=VT.setGbxSurfaceExplode(this.value,"${ dataType }");VTout${ dataType }.value=this.value value=1 >
			</label>
		</p>`;

	return htm;

};



VT.showTypes = function ( selectedOptions = "", dataType = "" ) {
	//console.log( "type", dataType, selectedOptions );

	GBX.meshes.forEach( mesh => mesh.visible = false );

	for ( let option of selectedOptions ) {

		GBX.meshes.filter( surface => surface.userData[ dataType ] === option.innerText )
			.forEach( surface => surface.visible = !surface.visible );

	}

};




VT.setGbxSurfaceExplode = function ( value, dataType = "" ) {

	THRU.removeLines();

	GBX.toggleSpaceTitles();

	let items = GBX.surfaceTypes;
	items = dataType === "spaceName" ? GBX.spaceNames : items;
	items = dataType === "storeyName" ? GBX.storeyNames : items;
	items = dataType === "zoneName" ? GBX.zoneNames : items;
	items = dataType === "cadObject" ? GBX.CADObjects : items;
	//console.log( "items", items );

	items.forEach( ( item, i ) => {

		GBX.meshes.filter( surface => surface.userData[ dataType ] === item )
			.forEach( surface => surface.position.z = i * value / 5 );

	} );


};



VT.resetAll = function () {

	THRU.removeLines();

	THR.group.children.forEach( mesh => {

		mesh.visible = true;
		mesh.position.copy( mesh.userData.positionStart );
	} );

	//VTspnCount.innerText = THR.group.children.length;
};
