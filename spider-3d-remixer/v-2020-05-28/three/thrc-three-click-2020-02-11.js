

const THRC = {};

let intersected = undefined;

window.addEventListener( 'click', onClick, false );





function onClick( event ) {

	//console.log( 'click event', event );

	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, THR.camera );

	const intersects = raycaster.intersectObjects( THR.group.children );

	// for ( var i = 0; i < intersects.length; i++ ) {

	// 	//intersects[ i ].object.material.color.set( 0xff0000 );
	// 	intersects[ i ].object.material.emissive.setHex( 0xff0000 );

	// }


	if ( intersects.length > 0 ) {

		if ( intersected !== intersects[ 0 ].object ) {

			if ( intersected ) { intersected.material.emissive.setHex( 0x000000 ); }

			intersected = intersects[ 0 ].object;

			JTF.showFindString( intersected.name )


		} else {

			if ( intersected ) {

			}

			intersected = null;
			divLog.innerHTML = 'No cube selected';

		}

	}

}


