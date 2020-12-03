
const source = "https://github.com/theo-armour/2020/tree/master/lib-template-viewer/";

const version = "v-2020-11-28";

const description = document.head.querySelector( "[ name=description ]" ).content;

//const urlDefault = "README.md";

function init () {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;


	THR.init();

	THR.animate();

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	//THRU.addMeshes(100);

	//THRR.updateScene();

	// FOO.init();

	// FOO.extension = "json";
	// FOO.responseType = "json";
	// //FOO.onLoadFile = PP.onLoadJson;

	// path = "../../assets/json/";

	// FOO.requestFile( path + "lab_building_result.json" );

	// JTV.init();

	HRT.init();

};



FOO.onLoadFile = function () {

	//console.log( "FOO.string", FOO.string.slice( 0, 50 ) );

	const jsonArr = FOO.string;

	let x = 0;
	const half = jsonArr.length / 24;

	const dataPoints = jsonArr.map( ( item, index ) => {

		//console.log( "item", item );

		x = ( index % 12 === 0 ) ? ++x : x;

		const geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
		const material = new THREE.MeshNormalMaterial();
		const mesh = new THREE.Mesh( geometry, material );
		mesh.position.set( ( x - half ) * 3, item.month * 5, item.surface_inside_face_temperature );
		mesh.scale.z = ( item.surface_outside_face_temperature - item.surface_inside_face_temperature );

		return mesh;

	} );

	THR.group.add( ...dataPoints );

	//console.log( "", dataPoints );

	THR.updateScene();

	THRR.updateScene();

	THR.camera.position.set( -100, -100, 100 );

	if ( window.divPopUp ) {

		divPopUp.hidden = false;
		//divPopUp.innerText = "FOO.string\n" + FOO.string.slice( 0, 50 );

	}

};



THRR.vvvgetHtm = function () {

	//console.log( "xxxx intersected", THRR.intersected );
	const mesh = THRR.intersected.object;

	const index = THR.group.children.indexOf( mesh );

	const item = FOO.string[ index ];

	//console.log( "item", item );

	const htm = `
	<div>
		index: ${ index }<br>
		identifier: ${ item.identifier }<br>
		year: ${ item.year } month: ${ item.month } day: ${ item.day }</br>
		hour: ${ item.hour } minute: ${ item.minute }</br>
		inside temperature: ${ item.surface_inside_face_temperature.toLocaleString() }</br>
		outside temperature: ${ item.surface_outside_face_temperature.toLocaleString() }</br>

	</div>`;

	return htm;
};



const MNU = {};

MNU.toggleDarkMode = function ( button ) {

	if ( butDark.innerHTML === "dark" ) {

		//root.style.backgroundColor = "#1e1f23";
		document.body.style.color = "#aaa";
		navMenu.style.backgroundColor = "#555";

		THR.scene.background = new THREE.Color( 0x222222 );
		THR.scene.fog.far = 999999;

		//const summaries = document.querySelectorAll(".summary-secondary");
		//console.log( "", summaries );

		Array.from( document.querySelectorAll( "a" ) )
			.forEach( a => a.style.color = "#ccc" );

		Array.from( document.querySelectorAll( "input,select,option" ) )
			.forEach( iso => iso.style.backgroundColor = "#bbb" );

		document.documentElement.style.setProperty( "--color-2-background", "#888" );
		Array.from( document.querySelectorAll( ".summary-primary" ) )
			.forEach( sum => sum.style.backgroundColor = "#888" );

		document.documentElement.style.setProperty( "--color-3-background", "#bbb" );
		Array.from( document.querySelectorAll( ".summary-secondary" ) )
			.forEach( sum => sum.style.backgroundColor = "#bbb" );


		divPopUp.style.backgroundColor = "#333";

		butDark.innerHTML = "light";

		return;

	}

	//root.style.backgroundColor = "#1e1f23";
	document.body.style.color = "teal";
	navMenu.style.backgroundColor = "#fafffa";

	THR.scene.background = new THREE.Color( 0xcce0ff );
	THR.scene.fog.far = THR.radius * 8;

	const summaries = document.querySelectorAll( ".summary-primary" );
	Array.from( summaries ).forEach( sum => sum.style.backgroundColor = "#eee" );

	divPopUp.style.backgroundColor = "#eee";

	butDark.innerHTML = "dark";

};
