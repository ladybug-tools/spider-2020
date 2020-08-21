/* Globals THREE, THR */
let alcatraz = "latitude=37.8270&longitude=-122.423&zoom=16&offsetUTC=-420";
let coit = "latitude=37.8024&longitude=-122.4058&zoom=16&offsetUTC=-420";


const MAP = {};


//alcatraz;
// MAP.latitude = 37.8270;
// MAP.longitude = -122.423;

// San Francisco Bay
MAP.latitude = 37.796;
MAP.longitude = -122.398;


MAP.rows = 4;
MAP.cols = 4;
MAP.zoom = 11;
MAP.heightScale = 50;
MAP.deltaX = 0;
MAP.deltaY = 0;

MAP.defaultRows = 4;
MAP.defaultCols = 4;
MAP.defaultZoom = 11;
MAP.defaultHeightScale = 50;

MAP.pixelsPerTile = 256;
MAP.unitsPerTile = 50;

MAP.mapOverlays = [

	[ 'Google Maps', 'https://mt1.google.com/vt/x=' ],
	[ 'Google Maps Terrain', 'https://mt1.google.com/vt/lyrs=t&x=' ],
	[ 'Google Maps Satellite', 'https://mt1.google.com/vt/lyrs=s&x=' ],
	[ 'Google Maps Hybrid', 'https://mt1.google.com/vt/lyrs=y&x=' ],
	[ 'Open Street Map', 'https://tile.openstreetmap.org/' ],
	//[ 'Open Street Map topo', 'http://tile.opentopomap.org/' ],
	[ 'Open Cycle Map', 'http://tile.opencyclemap.org/cycle/' ],
	//		['MapQuest OSM', 'https://otile3.mqcdn.com/tiles/1.0.0/osm/'],
	//		['MapQuest Satellite', 'https://otile3.mqcdn.com/tiles/1.0.0/sat/'],
	[ 'Stamen terrain background', 'http://tile.stamen.com/terrain-background/' ],
	[ 'Esri Satellite', 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/' ]

];

MAP.metersPerPixelPerZoom = [ 156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19.093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298 ];
MAP.mbptoken = 'pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg';

MAP.tileBitmapsLoaded = 0;
MAP.tileHeightMapsLoaded = 0;

MAP.init = function () {

	// @ts-ignore
	THR.scene.traverse( child => {

		if ( child.isMesh || child.isLine || child.isSprite ) {

			child.geometry.dispose();
			child.material.dispose();

		}

	} );

	if ( MAP.geometry ) {

		MAP.geometry.dispose();
		MAP.geometry = undefined;

		MAP.material.dispose();
		MAP.material = undefined;
	}

	THR.scene.remove( THR.group );
	THR.group = new THREE.Group();
	THR.scene.add( THR.group );


	MAP.tileBitmapsLoaded = 0;
	MAP.tileHeightMapsLoaded = 0;


	MAP.tileCenterX = MAP.lonToTile( MAP.longitude, MAP.zoom ) + MAP.deltaX;
	MAP.tileCenterY = MAP.latToTile( MAP.latitude, MAP.zoom ) + MAP.deltaY;

	MAP.tileStartX = MAP.tileCenterX - Math.floor( MAP.cols / 2 );
	MAP.tileStartY = MAP.tileCenterY - Math.floor( MAP.rows / 2 );

	MAP.getTilesBitmaps();

	MAP.getTilesHeightMaps();

};


MAP.getTilesBitmaps = function () {

	if ( !MAP.canvasBitmap ) {

		MAP.canvasBitmap = document.createElement( 'canvas' );
	}

	MAP.canvasBitmap.width = MAP.pixelsPerTile * MAP.cols;
	MAP.canvasBitmap.height = MAP.pixelsPerTile * MAP.rows;
	MAP.canvasBitmap.style.cssText = "width:256px;";
	MAP.contextBitmap = MAP.canvasBitmap.getContext( "2d" );

	const zoom = MAP.zoom;

	for ( let i = 0; i < MAP.cols; i++ ) {

		for ( let j = 0; j < MAP.rows; j++ ) {

			//const url = `https://mt1.google.com/vt/x=${ MAP.tileStartX + i }&y=${ MAP.tileStartY + j }&z=${ zoom }`;

			let url;

			if ( MAP.overlayIndex < 4 ) {

				url = `${ MAP.mapOverlays[ MAP.overlayIndex ][ 1 ]}${ MAP.tileStartX + i }&y=${ MAP.tileStartY + j }&z=${ zoom }`;

			} else if ( MAP.overlayIndex === 7 ) {

			// 	loadImage( baseURL + zoom + '/' + ( y + tileY ) + '/' + ( x + tileX ) + '.jpg', x, y );
			// 	//console.log( 'esri', baseURL + zoom + '/' + ( y + tileY ) + '/' + ( x + tileX ) + '.jpg' );
				url = `${ MAP.mapOverlays[ MAP.overlayIndex ][ 1 ] }${ zoom }/${ MAP.tileStartY + j }/${ MAP.tileStartX + i }.jpg`;

			} else {

			// 	loadImage( baseURL + zoom + '/' + ( x + tileX ) + '/' + ( y + tileY ) + '.png', x, y );
			// 	//console.log( '', selectedIndex, baseURL + zoom + '/' + ( x + tileX ) + '/' + ( y + tileY ) + '.png' );

				url = `${ MAP.mapOverlays[ MAP.overlayIndex ][ 1 ] }${ zoom }/${ MAP.tileStartX + i }/${ MAP.tileStartY + j }.png?access_token=${ MAP.mbptoken}`;

			}

			MAP.fetchTileBitmap( url, i, j );

		}

	}

};



MAP.fetchTileBitmap = function ( url = "", col = 0, row = 0 ) {

	fetch( new Request( url, { mode: "cors" }) )
		.then( response => response.blob() )
		.then( blob => MAP.onLoadTileBitmap( URL.createObjectURL( blob ), col, row ) );

};



MAP.onLoadTileBitmap = function ( src, col, row ) {

	const img = new Image(); //document.createElement( "img" );

	img.onload = function () {

		MAP.contextBitmap.drawImage( img, 0, 0, MAP.pixelsPerTile, MAP.pixelsPerTile, col * MAP.pixelsPerTile, row * MAP.pixelsPerTile, MAP.pixelsPerTile, MAP.pixelsPerTile );

		MAP.tileBitmapsLoaded++;

		if ( MAP.tileBitmapsLoaded >= MAP.rows * MAP.cols ) {

			MAP.onLoadBitmaps( MAP.canvasBitmap );

		}

	};

	img.src = src;

};



MAP.onLoadBitmaps = function ( canvas ) {

	const texture = new THREE.Texture( canvas );
	//texture.minFilter = texture.magFilter = THREE.NearestFilter;
	texture.needsUpdate = true;

	MAP.material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, side: 2, transparent: true } );

	MAP.getMesh();

};


/////



MAP.getTilesHeightMaps = function () {

	if ( !MAP.canvasHeightMaps ) {

		MAP.canvasHeightMaps = document.createElement( "canvas" );

	}

	MAP.canvasHeightMaps.width = MAP.cols * MAP.pixelsPerTile;
	MAP.canvasHeightMaps.height = MAP.rows * MAP.pixelsPerTile;
	MAP.canvasHeightMaps.style.cssText = "width:256px;";
	MAP.contextHeightMaps = MAP.canvasHeightMaps.getContext( "2d" );


	for ( let i = 0; i < MAP.cols; i++ ) {

		for ( let j = 0; j < MAP.rows; j++ ) {

			const url = `https://api.mapbox.com/v4/mapbox.terrain-rgb/${ MAP.zoom }/${ MAP.tileStartX + i }/${ MAP.tileStartY + j }.pngraw?access_token=${ MAP.mbptoken }`;

			MAP.fetchTileHeightMap( url, i, j );

		}

	}

};


MAP.fetchTileHeightMap = function ( url = "", col = 0, row = 0 ) {

	fetch( new Request( url ) )
		.then( response => response.blob() )
		.then( blob => MAP.onLoadTileHeightMap( URL.createObjectURL( blob ), col, row ) );

};


MAP.onLoadTileHeightMap = function ( src, col = 0, row = 0 ) {

	const img = new Image(); //document.createElement( "img" );
	const size = 256;

	img.onload = function () {

		MAP.contextHeightMaps.drawImage( img, 0, 0, size, size, col * size, row * size, size, size );

		MAP.tileHeightMapsLoaded++;

		if ( MAP.tileHeightMapsLoaded >= MAP.rows * MAP.cols ) {

			MAP.onLoadHeightMaps( MAP.contextHeightMaps );

		}

	};

	img.src = src;

};



MAP.onLoadHeightMaps = function ( context ) {

	const data = context.getImageData( 0, 0, MAP.cols * MAP.pixelsPerTile, MAP.rows * MAP.pixelsPerTile ).data;

	MAP.metersPerPixel = MAP.metersPerPixelPerZoom[ MAP.zoom ];

	MAP.scale = [ 0.00003, 0.001, 0.0001, 0.0001, 0.0002, 0.0003, 0.0005, 0.001, 0.002, 0.001, 0.005, 0.02 ];

	MAP.scaleTerrain = MAP.scale[ MAP.zoom - 7 ] * MAP.heightScale;

	console.log( "MAP.scaleTerrain", MAP.scaleTerrain );

	MAP.geometry = new THREE.PlaneBufferGeometry( MAP.cols * MAP.unitsPerTile, MAP.rows * MAP.unitsPerTile, MAP.cols * MAP.pixelsPerTile - 1, MAP.rows * MAP.pixelsPerTile - 1 );

	const vertices = MAP.geometry.attributes.position.array;
	// console.log( "vertices", vertices );

	for ( let i = 2, j = 0; i < vertices.length; i += 3 ) {

		const r = data[ j++ ];
		const g = data[ j++ ];
		const b = data[ j++ ];
		j++;

		const height = MAP.scaleTerrain * ( 0.1 * ( r * 65536 + g * 256 + b ) - 10000 );
		vertices[ i ] = height;

		// if ( height === 0 ) {
		// 	console.log( "i", i );
		// 	vertices[ i ] = MAP.scaleTerrain * ( 0.1 * ( data[ j ] * 65536 + data[ j + 1 ]* 256 + data[ j - 2 ] ) - 10000 );
		// }
	}

	MAP.geometry.computeFaceNormals();
	MAP.geometry.computeVertexNormals();

	MAP.getMesh();

};



MAP.getMesh = function () {

	//MAP.geometry = new THREE.PlaneBufferGeometry( MAP.cols * MAP.unitsPerTile, MAP.rows * MAP.unitsPerTile );
	//material = new THREE.MeshBasicMaterial( { map: texture, side: 2 } );
	//material = new THREE.MeshNormalMaterial( { side: 2 } );

	if ( MAP.geometry && MAP.material ) {

		//THR.group = THR.setSceneNew();

		const mesh = new THREE.Mesh( MAP.geometry, MAP.material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		THR.group.add( mesh );

		THR.updateScene();

		THR.lightDirectional.position.copy(
			THR.center.clone().add( new THREE.Vector3( -1.5 * THR.radius, -1.5 * THR.radius, 1.5 * THR.radius ) )
		);

		THR.camera.position.copy(
			THR.center.clone().add( new THREE.Vector3( 0 * THR.radius, -0.5 * THR.radius, 0.5 * THR.radius ) )
		);

	}

};



////////// Cartography utilities

MAP.lonToTile = function ( longitude = 0, zoom = 16 ) {

	return Math.floor( ( longitude + 180 ) / 360 * Math.pow( 2, zoom ) );

};


MAP.latToTile = function ( latitude = 51.4934, zoom = 16 ) {

	const pi = Math.PI;
	return Math.floor( ( 1 - Math.log( Math.tan( latitude * pi / 180 ) + 1 / Math.cos( latitude * pi / 180 ) ) / pi ) / 2 * Math.pow( 2, zoom ) );

};