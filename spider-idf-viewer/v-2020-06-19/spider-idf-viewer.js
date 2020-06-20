const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-idf-viewer/";

const version = "v-2020-06-19";

const description = document.head.querySelector( "[ name=description ]" ).content;

const path = "https://www.ladybug.tools/spider-2020/spider-idf-viewer/idf-sample-files/";

const files = [
	"RefBldgFullServiceRestaurantNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgHospitalNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgLargeHotelNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgLargeOfficeNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgMediumOfficeNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgMidriseApartmentNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgOutPatientNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgPrimarySchoolNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgQuickServiceRestaurantNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSecondarySchoolNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSmallHotelNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSmallOfficeNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgStand-aloneRetailNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgStripMallNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgSuperMarketNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	"RefBldgWarehouseNew2004_v1.4_7.2_3B_USA_NV_LAS_VEGAS.idf",
	//"test.zip",
	"test-case-2020-06-08.zip",
	//"test-case-2020-06-13.zip",
];

const urlDefault = "https://www.ladybug.tools/spider-2020/spider-idf-viewer/idf-sample-files/theoretical-office-building-tel-aviv-2020-06-15.zip"



GFF.extension = ".idf";

GFF.items = [
	{
		user: "ladybug-tools",
		repo: "/spider-2020",
		pathRepo: "spider-idf-viewer/idf-sample-files/",
		title: "Selected sample files",
		subTitle: `Files from the
		<a href="https://www.energy.gov/eere/buildings/commercial-reference-buildings" target="_blank">DOE</a> and other sample files.`,
	},
	{
		user: "nrel",
		repo: "/EnergyPlus",
		pathRepo: "testfiles/",
		branch: "develop",
		title: "EnergyPlus sample files",
		subTitle: `Files from the
		<a href="" target="_blank">NREL</a>
		repository on GitHub.`,
	},
];

function init() {

	aGithub.href = source;

	aTitle.innerHTML += ` ${version}`;

	divDescription.innerHTML = description;


	THR.init();
	THR.animate();

	THR.addLights();
	THR.addGround();

	THR.group = THR.setSceneNew();

	FOO.init();
	

	FOO.doNext = IDF.callback;

	JTH.init();


	if ( ! location.hash ) {

		FOO.requestFile( urlDefault );

	} 


}

function openAll() {
	THR.group = THR.setSceneNew(new THREE.Group());

	FOO.responseType = "text";

	FOO.doNext = FOO.callback2;

	count = 0;
	deltaX = -180;
	deltaY = 180;
	openFile(0);
}

FOO.callback2 = () => {
	THR.campus = new THREE.Group();

	THR.group.add(THR.campus);

	const surfaces = IDF.parseType();
	//console.log( "walls", walls );

	
	THR.campus.add(...surfaces.lines, ...surfaces.meshes);
	
	ItoJ.checkZones();

	THR.campus.position.x = count * 50 - 100;

	if (count % 4 === 0) {
		deltaY -= 60;
		deltaX = -180;
	} else {
		deltaX += 80;
	}

	

	THR.campus.position.set(deltaX, deltaY, 0);

	if (count < files.length) {
		openFile(count++);
	} else {

		THR.zoomObjectBoundingSphere();

		RAY.intersectObjects = THR.group.children.flatMap(group =>
			group.children.filter(child => child.type === "Mesh")
		);

		
	}
};

function openFile(index = 0) {
	FOO.requestFile(path + files[index]);
}


//////////

const ItoJ = {};


ItoJ.init = function() {

	ItoJ.strings = ItoJ.split( FOO.string ).map( item => item.split(/\n/g) );
	//console.log( "strings", ItoJ.strings.slice( 0, 15 ) );

	ItoJ.parents = ItoJ.getParents( ItoJ.strings );
	//console.log( "ItoJ.parents", ItoJ.parents );


	htm = ItoJ.parents.keys.map( ( key, index ) => `
	<details ontoggle=ItoJ.parseValues(${ index })><summary>${ key }</summary>
		<div id=ItoJdiv${ index } ></div>
	</details>` ).join( "");
	
	JTVdivJsonTree.innerHTML = "<p>JSON Tree View</p>" + htm;

	JTF.init();

	

};


ItoJ.checkZones = function() {

	const index = ItoJ.parents.keys.indexOf( "  Zone" )

	//console.log( "zones", index,  ItoJ.parents.values[ index + 1]);

	const zonesArr = ItoJ.parents.values[ index + 1].map( item => item[ 1 ])

	//console.log( "zones", zonesArr );

	if ( zonesArr.length < 2 ) { return; }

	const names = zonesArr.map( zone => zone[ 1 ].trim().split( "," ).shift() );

	//console.log( "names", names );

	const deltaArrays = zonesArr.map( zone => zone.slice( 3, 6 ).map( item => + item.trim().split( "," ).shift() ));

	const deltas = deltaArrays.map( delta => new THREE.Vector3().fromArray(  delta ) );

	//console.log( "deltas", deltas );

	for ( let i = 0; i < deltas.length; i++ ) {

		const delta = deltas[ i ];
		//console.log( "len", delta.length() );

		if ( delta.length() === 0 ) { continue }

		const name = names[ i ];

		for ( let child of THR.group.children ) {

			childName = "";

			if ( child.userData.text && child.userData.text.includes( name + "," ) ) {

				child.position.add( delta ); 

				childName = child.userData.text.split(/\n/g)[ 1 ].trim().split( ",")[ 0 ];
				//console.log( "name", childName );
			}

			if ( !childName ) { continue; }

			for ( let child2 of THR.group.children ) {

				if ( ["door", "glassdoor", "window"].includes( child2.userData.type) && 
					child2.userData.text.includes( childName ) && !child2.moved ) {

					//console.log( "item",  child );
					child2.position.add( delta ); 

					child2.moved = true;

				}

			}




		}
			
	}

	if ( !zonesArr[ 0 ][ 7 ] )  { return; }

	//const multiplierArray = zonesArr.map( zone => + zone[ 7 ].trim().split( "," ).shift() );

	//console.log( "multiplierArray", multiplierArray );

};


ItoJ.parseValues = function( index ) {

	div = JTVdivJsonTree.querySelector( "#ItoJdiv" + index );

	//console.log( "value", ItoJ.parents.values[ index + 1].slice( 1 ) )

	let arrs = ItoJ.parents.values[ index + 1];

	let htm = "";

	if ( arrs.length === 1 ) {

		const arr = arrs[ 0 ].slice( 1 )[ 0 ].slice( 1 )
		const items = arr.map( item => item.split( "!- " ) )

		htm = items.map( item => `<div><small><b>${ item[ 1 ] }:</b></small> <span class=value >${ item[ 0 ].trim().replace( /[,;]/, "") }</span></div>` ).join( "");

	} else {
	
		//console.log( "arrs", arrs );

		htm = arrs.map( arr => {

			arr = arr.slice( 1 )[ 0 ].slice( 1 );
			//console.log( "arr", arr );

			const items = arr.map( item => item.split( "!- " ) )
			//console.log( "item", items );

			const htm = items.map( item =>
				`<div><small><b>${ item[ 1 ] }:</b></small> <span class=value >${ item[ 0 ].trim().replace( /[,;]/, "")}</span></div>` );
			//console.log( "htm", htm.join( "") );
			
			return htm.join( "") ;

		} ).join( "<hr>");

		//console.log( "htm", htm);

	}

	div.innerHTML = htm;

}


ItoJ.getParents = function( items ) {

	const keys = [];
	const values = [];
	let value = ["undefined"];


	for ( let i = 0; i < items.length; i++ ) {

		const item = items[ i ];
		
		let key = item[ 0 ];

		key = key.length === 1 ? "Version" : key.replace( ",", "");

		if ( key.startsWith( "!" ) ) { continue; }

		if ( ! keys.includes( key )){ 

			keys.push( key );

			values.push( value );

			value = [ [key, item ] ];

		} else {

			value.push( [ key, item ] )
		}
	}

	return { keys, values }

};


ItoJ.split = function( string ) {

	let arr = string.split(/\n\n/g);
	
	if ( arr.length < 3 ) {
		
		arr = string.split(/\r\n\r\n/g);

	}
	
	return arr;
};






//////////

RAY.getHtm = function (intersected) {
	console.log("intersected", RAY.intersected);

	const obj = RAY.intersected.object;
	const index = obj.userData.index;
	const mesh = THR.group.children[index];
	console.log( "obj", obj );
	const htm = `
	<div>
		file: ${obj.userData.fileName}<br>
		type: ${obj.userData.type}<br>
		id: ${index}<br>
		uuid: ${obj.uuid}<br>
		<button onclick=RAY.getMeshData(); >view surface data</button>
	</div>`;

	return htm;
};

//////////

RAY.getMeshData = function () {
	detNavMenu.open = true;
	detData.open = true;

	const obj = RAY.intersected.object;

	const data = obj.userData;

	const lines = data.text
		.split(/\n/g)
		.map(line => line.split(/!-/))
		.filter(arr => arr.length > 1)
		.map(arr => `<b><sub>${arr[1]}:</sup></b><br>${arr.slice(0, -1)}<br>`)
		.join("");
	// console.log( "lines", lines );

	const htm = `
	<p><b><sub>File name:</b></sub><br>${data.fileName}<br>
	${lines}</p>
	`;

	RAYdivMeshData.innerHTML = htm;
	RAYdivMeshData.scrollIntoView();
};
