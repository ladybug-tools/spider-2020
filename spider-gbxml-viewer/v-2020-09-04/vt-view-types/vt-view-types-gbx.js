const VT = {};


VT.init = function () {

	GBX.setSurfacesMetadata()

	THR.group.children.forEach( surface => surface.userData.positionStart = surface.position.clone() );

	const htm = `
	<p>
		Select multiple items to view. Use cursor keys to scroll through the lists.<br>
	</p>
	<p>
		<button onclick="VT.resetAll();" title="Show all surfaces">&sdotb; reset visibility & position</button>
	</p>

	<details ontoggle=VTdivXmlGlobal.innerHTML=VT.getXmlGlobal() >

		<summary class="summary-secondary gmd-1" >Global attributes</summary>

		<div id=VTdivXmlGlobal ></div>

	</details>

	<div id=VTdivSurfaceTypes>${ VT.getElementSelect( GBX.surfaceTypes, [], "surfaceType", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link1A8" target = "_blank" >Surface</a> Types' ) }</div>

	<div id=VTdivSpaces>${ VT.getElementSelect( GBX.spaceNames, GBX.spaceIds, "spaceName", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link19D" target="_blank">Spaces</a>' ) }</div>

	<div id=VTdivStoreys>${ VT.getElementSelect( GBX.storeyNames, GBX.storeyIds, "storeyName", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link35" target="_blank">Storeys</a>' ) }</div>

	<div id=VTdivZones>${ VT.getElementSelect( GBX.zoneNames, GBX.zoneIds, "zoneName", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link1D3" target="_blank">Zones</a>' ) }</div>

	<div id=VTdivCadObjects>${ VT.getElementSelect( GBX.CADObjects, [], "cadObject", '<a href="https://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html#Link3D" target="_blank">CAD Object</a>' ) }</div>

	`;

	VTdivViewTypes.innerHTML = htm;

};


VT.getXmlGlobal = function () {

	VT.timeStart = performance.now();

	//xml = GBX.parseElement( GBX.string );

	const parser = new DOMParser();
	const xml = parser.parseFromString( GBX.string, "application/xml" ).documentElement;

	const attributes = xml.attributes;
	//console.log( "attributes", attributes );
	const attributesHtm = Array.from( xml.attributes ).map( att => `${ att.name }: ${ att.value } <br>` ).join( "" );

	const locationXml = xml.getElementsByTagName( 'Location' )[ 0 ];
	const buildingXml = xml.getElementsByTagName( 'Building' )[ 0 ];
	//const documentXml = campusXml.getElementsByTagName( 'DocumentHistory' )[ 0 ];

	const latitude = xml.getElementsByTagName( 'Latitude' )[ 0 ].innerHTML;
	const longitude = xml.getElementsByTagName( 'Longitude' )[ 0 ].innerHTML;

	let linkToMap;

	if ( latitude && longitude ) {

		const linkG = 'https://www.google.com/maps/@' + latitude + ',' + longitude + ',17z';

		const linkW = 'http://www.wolframalpha.com/input/?i=' + latitude + '+degrees,+' + longitude + '+degrees';

		linkToMap =
			`<p>
			<b>&raquo;</b> <a href="${ linkG }" target=_blank > &#x1f310; Google Maps</a> /
			<a href="${ linkW }" target=_blank > Wolfram Alpha</a>
			</p>`;

	} else {

		linkToMap = '';

	}
	//console.log( "ccc", locationXml, buildingXml, latitude, longitude );


	console.log( "time", performance.now() - VT.timeStart );

	const htm = `

		${ linkToMap }
		<p>
			<b>gbXML Attributes</b>
			<div>${ VT.getAttributesHtml( xml ) }</div>
		</p>
		<p>
			<b>Location Attributes</b>
			<div>${ VT.getAttributesHtml( locationXml ) }</div>
		</p>
		<p>
			<b>Building Attributes</b>
			<div>${ VT.getAttributesHtml( buildingXml ) }</div>
		</p>

		<hr>
	`;

	return htm;

};




VT.getAttributesHtml = function ( obj ) {
	//console.log( 'obj', obj );

	let htm = "";

	if ( !obj ) { return htm; }

	for ( let attribute of obj.attributes ) {
		//console.log( 'attribute', attribute );

		htm +=
			`<div>
			<span class=attributeTitle >${ attribute.name }</span>:
			<span class=attributeValue >${ attribute.value }</span>
		</div>`;

	}

	const nodes = obj.childNodes;
	const numbers = [ 'Azimuth', 'Height', 'Tilt', 'Width' ];

	for ( let node of nodes ) {
		//console.log( 'node', node);

		if ( node.nodeName !== "#text" ) {
			//console.log( 'node', node.nodeName, node );

			if ( node.childElementCount > 0 ) {
				//console.log( 'node', node );

			} else if ( node.innerHTML ) {
				//console.log( 'node', node );

				const value = numbers.includes( node.nodeName ) ? Number( node.innerHTML ).toLocaleString() : node.innerHTML;

				htm +=

					`<div>
					<span class=attributeTitle >${ node.nodeName }</span>:
					<span class=attributeValue >${ value }</span>
				</div>`;

			}

		} else {

			//console.log( 'node', node );

		}

	}

	return htm;

};



VT.getElementSelect = function ( elements = [], ids = [], dataType = "surfaceType", title = "elements" ) {

	const htm = `
		<p>
			${ title } (<span>${ elements.length }</span>):
			<select id=VTsel${ dataType }  oninput=VT.showTypes(this.selectedOptions,"${ dataType }");
				size=${ elements.length < 10 ? elements.length : 10 }
				style=resize:vertical;width:100%; multiple>
				${ elements.map( ( name, index ) => `<option value=${ ids[ index ] } title="${ ids[ index ] }" >${ name }</option>` ) }
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
