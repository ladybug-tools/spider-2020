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



////////// Material handling

THRU.setObjectOpacity = function( obj = THR.group, range = THRrngOpacity ) {

	const opacity = parseInt( range.value, 10 );
	//outOpacity.value = opacity + "%";

	console.log( "opacity", opacity );

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