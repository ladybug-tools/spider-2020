// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-01-27
/* THREE, THR, THRdivMessage, divContent */
// jshint esversion: 6
// jshint loopfunc: true


const THRM = {};



THRM.init = function () {

	//divContent.innerHTML += THRM.getMenu();

	document.addEventListener( 'mousemove', THRM.onDocumentMouseMove, false );
	document.addEventListener( 'touchstart', THRM.onDocumentTouchStart, false );

};



THRM.getMenu = function () {

	const htm = `
<details open>

	<summary>

		Intersects

		<span class="couponcode">??? <span class="coupontooltip">highlight objects when there is a mouse over</span></span>

	</summary>

	<div id=THRMdivMessage ></div>

</details>`;

	return htm;

};



THRM.onDocumentTouchStart = function ( event ) {

	//event.preventDefault();

	event.clientX = event.touches[ 0 ].clientX;
	event.clientY = event.touches[ 0 ].clientY;

	THRM.onDocumentMouseMove( event );

};



THRM.onDocumentMouseMove = function ( event ) {

	//event.preventDefault();

	const mouse = new THREE.Vector2();
	mouse.x = ( event.clientX / THR.renderer.domElement.clientWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / THR.renderer.domElement.clientHeight ) * 2 + 1;

	const raycaster = new THREE.Raycaster();
	raycaster.setFromCamera( mouse, THR.camera );

	const intersects = raycaster.intersectObjects( THR.group.children );

	if ( intersects.length > 0 ) {

		if ( THRM.intersected !== intersects[ 0 ].object ) {

			if ( THRM.intersected ) { THRM.intersected.material.emissive.setHex( 0x000000 ); }

			THRM.intersected = intersects[ 0 ].object;

			//THRM.intersected.rotation.y += 0.1;
			//THRM.intersected.scale.set( 1.3, 1.3, 1.3 );
			THRM.intersected.material.emissive.setHex( 0xff0000 );

			THRMdivMessage.innerHTML = `
mesh ID: ${THRM.intersected.id }<br>
mesh UUID: ${THRM.intersected.uuid }<br>
face name: ${THRM.intersected.name }<br>
`;

		}

	} else {

		if ( THRM.intersected ) {

			THRM.intersected.scale.set( 1, 1, 1 );
			THRM.intersected.material.emissive.setHex( 0x000000 );

		}

		THRM.intersected = null;
		THRMdivMessage.innerHTML = 'No cube selected';

	}

};


//THRM.init();