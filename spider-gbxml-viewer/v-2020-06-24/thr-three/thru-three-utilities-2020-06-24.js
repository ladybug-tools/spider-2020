const THRU = {};


THRU.group = new THREE.Group()

THRU.toggleBoundingBoxHelper = function( { group = THR.group, visible = undefined } = {} ) {

	if ( !THRU.boundingBoxHelper ) {

		const bbox = new THREE.Box3().setFromObject( group );

		THRU.boundingBoxHelper = new THREE.Box3Helper( bbox, 0xff0000 );
		THRU.boundingBoxHelper.geometry.computeBoundingBox();
		THRU.boundingBoxHelper.name = "boundingBoxHelper";
		THRU.group.add( THRU.boundingBoxHelper );

	 } else {

		THRU.boundingBoxHelper.visible = visible || !THRU.boundingBoxHelper.visible;

	}

};



THRU.toggleWireframe = function( obj = THR.group ) {

	obj.traverse( child => {

		if ( child instanceof THREE.Mesh ) {

			child.material.wireframe = !child.material.wireframe;

		}

	} );

};



THRU.toggleMeshEdges = function( obj = THR.group) {

	if ( !THR.group.userData.edges ) {

		const lineMaterial = new THREE.LineBasicMaterial( { color: 0x000000 } );

		for ( let mesh of obj.children ) {

			if ( !mesh.geometry ) { continue; }

			const edgesGeometry = new THREE.EdgesGeometry( mesh.geometry );
			const surfaceEdge = new THREE.LineSegments( edgesGeometry, lineMaterial );
			//surfaceEdge.rotation.copy( mesh.rotation );
			//surfaceEdge.position.copy( mesh.position );
			mesh.add( surfaceEdge );

		}

		THR.group.userData.edges = true

		return;

	}


	obj.traverse( child => {

		if ( child instanceof THREE.Line ) {

			child.visible = !child.visible;

		}

	} );

};


// not

THRU.toggleSurfaceNormalsVisible = function( obj = THR.group ) {

	
	let material = new THREE.MeshNormalMaterial();
	
	const types = [ 'BoxBufferGeometry', 'BufferGeometry', 'ConeBufferGeometry', 'CylinderBufferGeometry',
	'ShapeBufferGeometry', 'SphereBufferGeometry' ];
	
	if ( THR.scene.children.includes( THRU.helperNormalsFaces ) ) {
		
		THR.scene.remove( THRU.helperNormalsFaces );
		
	} else {
		
		
		THRU.helperNormalsFaces = new THREE.Group();
		
		obj.traverse( function ( child ) {
			
			if ( child instanceof THREE.Mesh && child.visible ) {
				
				if ( child.geometry.type === 'ShapeGeometry' ) {
					
					child.geometry.computeFaceNormals();
					
					const helperNormalsFace = new THREE.FaceNormalsHelper( child, 2, 0xff00ff, 3 );
					THRU.helperNormalsFaces.add( helperNormalsFace );
					//THRU.helperNormalsFaces.visible = false;
					console.log( 'helperNormalsFace', helperNormalsFace );
					
				} else if ( types.includes( child.geometry.type ) === true ) {
					console.log( "", 23 ); 

					const geometry = new THREE.Geometry();
					const geo = geometry.fromBufferGeometry( child.geometry );
					const mesh = new THREE.Mesh( geo, material );
					mesh.rotation.copy( child.rotation );
					mesh.position.copy( child.position );

					const helperNormalsFace = new THREE.FaceNormalsHelper( mesh, 0.05 * THRU.radius, 0xff00ff, 3 );
					helperNormalsFace.userData.index = child.userData.index;

					THRU.helperNormalsFaces.add( helperNormalsFace );
					//THRU.helperNormalsFaces.visible = false;

				} else {

					console.log( 'child.geometry.type', child.geometry.type );

				}

			}

		} );

		THRU.helperNormalsFaces.name = 'helperNormalsFaces';

		THR.scene.add( THRU.helperNormalsFaces );

	}

};

////////// Material handling

THRU.setObjectOpacity = function( obj = THR.group, range = THRrngOpacity ) {

	const opacity = parseInt( range.value, 10 );
	//outOpacity.value = opacity + "%";

	//console.log( "opacity", opacity );

	obj.traverse( child => {

		if ( child instanceof THREE.Mesh ) {

			child.material.opacity = opacity / 100;

		}

	} );

};


THRU.addText = function( text = "Hello world!\n123", position = new THREE.Vector3() ) {

	textMesh = new troika_3d_text.TextMesh();
	//textMesh.font = "../../assets/Inconsolata-Regular.ttf";
	textMesh.text = text;
	textMesh.fontSize = 0.1 * THR.radius;
	textMesh.rotation.x = 0.5 * Math.PI;
	textMesh.position.copy( position );
	textMesh.castShadow = true;
	textMesh.color = "maroon";
	
	THRU.group.add(textMesh);

	// be sure to call sync() after all properties are set to update the rendering:
	//textMesh.sync();

  }