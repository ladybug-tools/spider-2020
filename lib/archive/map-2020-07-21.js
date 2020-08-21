/* global THR */

const MAP = {};


//alcatraz;
MAP.latitude = 37.8270;
MAP.longitude = -122.423;

//Me
// MAP.latitude = 37.796;
// MAP.longitude = -122.398;

//Burning Man
// MAP.latitude = 40.786944;
// MAP.longitude = -119.204444;

MAP.zoom = 9;
MAP.offsetUTC = -420;

MAP.groundSides = 2; // Three.js material parameter
MAP.groundSize = 100;  // size in units of Three.js plane geometry
MAP.tilesPerSide = 2;
MAP.pixelsPerTile = 256;
MAP.metersPerPixelPerZoom = [ 156412, 78206, 39103, 19551, 9776, 4888, 2444, 1222, 610.984, 305.492, 152.746, 76.373, 38.187, 19.093, 9.547, 4.773, 2.387, 1.193, 0.596, 0.298 ];
MAP.heightScale = 10;

MAP.mbptoken = 'pk.eyJ1IjoidGhlb2EiLCJhIjoiY2o1YXFra3V2MGIzbzJxb2lneDUzaWhtZyJ9.7bYFAQabMXiYmcqW8NLfwg';


MAP.init = function () {

	MAPdivMenu.innerHTML = `

	<details id = detTerrain open >

		<summary>Calculations</summary>

		<div id=MAPdivCalculations></div>

	</details>

	<details open >

		<summary>Heightmap</summary>

		<div id=MAPdivHeightmap ></div>

	</details>
		
		
	<details open >

		<summary>Bitmap</summary>
		
		<div id=MAPdivBitmap ></div>

	</details>`;

	MAP.getCalcs();
};



MAP.getCalcs = function () {

	//console.log( 'MAP', MAP );

	let tileX, tileY;
	let latMin, latMax, lonMin, lonMax;
	let latDelta, lonDelta;
	//let latitude, longitude, zoom;

	const latitude = MAP.latitude;
	const longitude = MAP.longitude;
	const zoom = MAP.zoom;

	MAP.x = tileX = MAP.lon2tile(longitude, zoom);
	MAP.y = tileY = MAP.lat2tile(latitude, zoom);

	latMin = MAP.tile2lat(tileY + 1, zoom);
	latMax = MAP.tile2lat(tileY, zoom);

	lonMin = MAP.tile2lon(tileX, zoom);
	lonMax = MAP.tile2lon(tileX + 1, zoom);

	latDelta = (latMax - latMin);
	lonDelta = (lonMax - lonMin);

	// tile pixels - not screen pixels

	latDegreesPerPixel = latDelta / MAP.pixelsPerTile;
	lonDegreesPerPixel = lonDelta / MAP.pixelsPerTile;

	latPixelsPerDegree = MAP.pixelsPerTile / latDelta;
	lonPixelsPerDegree = MAP.pixelsPerTile / lonDelta;

	MAP.metersPerPixel = MAP.metersPerPixelPerZoom[ zoom ];
	MAP.metersPerTile = MAP.metersPerPixel * 256;

	MAP.latDelta = latDelta;
	MAP.lonDelta = lonDelta;

	MAP.scaleX = MAP.groundSize / lonDelta;
	MAP.scaleZ = MAP.groundSize / latDelta;

	// center the desired lat/lon within a 4x4 grid of image tiles.
	latDeltaTarget = latitude - latMin;
	lonDeltaTarget = longitude - lonMin;

	latDiff = latDeltaTarget / latDelta;
	lonDiff = lonDeltaTarget / lonDelta;

	//need more wiggle room here / not wired to 4x4
	if (latDiff < 0.25) { MAP.titleOffsetY = 3; }
	else if (latDiff < 0.5) { MAP.titleOffsetY = 2; }
	else if (latDiff < 0.75) { MAP.titleOffsetY = 1; }
	else { MAP.titleOffsetY = 0; }

	if (lonDiff < 0.25) { MAP.titleOffsetX = 0; }
	else if (lonDiff < 0.5) { MAP.titleOffsetX = 1; }
	else if (lonDiff < 0.75) { MAP.titleOffsetX = 2; }
	else { MAP.titleOffsetX = 3; }

	//console.log( 'MAP.titleOffsetX', MAP.titleOffsetX, lonDiff.toFixed( 2 ) );
	// console.log( 'MAP.titleOffsetY', MAP.titleOffsetY, latDiff.toFixed( 2 ) );

	/*
			d = new Date();
			MAP.month = d.getUTCMonth();
			MAP.date = d.getUTCDate();
			MAP.hours =  d.getUTCHours();
			MAP.minutes = d.getUTCMinutes();
	*/

	MAPdivCalculations.innerHTML = `<br>
<div>Latitude: ${ latitude.toFixed(4)} </div>
<div>Longitude: ${ longitude.toFixed(4)} </div>
<div>UTC Offset: ${ MAP.offsetUTC} </div>
<div>zoom: ${ zoom} tile X: ${tileX} tile Y: ${tileY} </div>
<br>
<div>lat Min: ${ latMin.toFixed(4)} - latMax: ${latMax.toFixed(4)} </div>
<div>lon Min: ${ lonMin.toFixed(4)} - lonMax: ${lonMax.toFixed(4)} </div>
<div>Delta: lat: ${ latDelta.toFixed(6)} lon: ${lonDelta.toFixed(6)} </div>
<div>scaleX: ${ MAP.scaleX} </div>
<div>scaleZ: ${ MAP.scaleZ} </div>
<br>
<div>Degrees/pixel: lat: ${ latDegreesPerPixel.toFixed(6)} lon: ${lonDegreesPerPixel.toFixed(6)} </div>
<div>Pixels/degree: lat: ${ latPixelsPerDegree.toFixed(1)} lon: ${lonPixelsPerDegree.toFixed(1)} </div>
<div>Meters/pixel: ${ MAP.metersPerPixel.toFixed(4)} </div>
<div>Meters/tile: ${ MAP.metersPerTile.toFixed(4)} </div>
<br>`;

	MAP.drawTerrain();

};



MAP.drawTerrain = function () {

	// https://docs.mapbox.com/help/troubleshooting/access-elevation-data/
	

	const zoom = MAP.zoom;
	const x = MAP.x = MAP.lon2tile(MAP.longitude, zoom);
	const y = MAP.y = MAP.lat2tile(MAP.latitude, zoom);

	const urlGED = 'https://api.mapbox.com/v4/mapbox.terrain-rgb/' + zoom + '/' + x + '/' + y + '.pngraw?access_token=' + MAP.mbptoken;
	//console.log( '', urlGED ); // click to see terrain / global elevation data / GED

	const imageLoader = new THREE.ImageLoader();
	//imageLoader.crossOrigin = 'anonymous';
	imageLoader.load(urlGED, getHeightMapData);

};



function getHeightMapData (map) {

	//	height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1) - from mapbox

	console.log('hm', map);

	//		let heightmapCanvas, heightmapContext;
	//		let r, g, b;  // Note: b is a const elsewhere
	//		MAP.metersPerPixel = MAP.mPixel[ MAP.zoom ];

	const scaleTerrain = MAP.heightScale * 100 / (256 * MAP.metersPerPixel);

	const heightmapCanvas = document.createElement('canvas');

	heightmapCanvas.style.cssText = ' ';
	const size = MAP.pixelsPerTile;
	heightmapCanvas.width = size;
	heightmapCanvas.height = size;
	const heightmapContext = heightmapCanvas.getContext('2d');

	heightmapContext.drawImage(map, 0, 0, size, size, 0, 0, size, size);

	const data = heightmapContext.getImageData(0, 0, size, size).data;

	const geometry = new THREE.PlaneBufferGeometry(MAP.groundSize, MAP.groundSize, size - 1, size - 1);
	//geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-0.5 * Math.PI));
	//geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0.5 * MAP.groundSize, 0.5 * MAP.groundSize, 0) );
	const vertices = geometry.attributes.position.array;

	for (let i = 2, j = 0; i < vertices.length; i += 3) {

		const r = data[ j++ ];
		const g = data[ j++ ];
		const b = data[ j++ ];
		j++;

		vertices[ i ] = scaleTerrain * (0.1 * (r * 65536 + g * 256 + b) - 10000);

	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();
	geometry.center();

	const material = new THREE.MeshNormalMaterial({ opacity: 0.75 });

	THR.scene.remove(THR.ground);
	THR.ground = new THREE.Mesh(geometry, material);
	THR.ground.name = 'THR.ground';
	THR.ground.castShadow = true;
	THR.ground.receiveShadow = true;

	THR.scene.add(THR.ground);

	drawMapOverlay();

	MAPdivHeightmap.appendChild(heightmapCanvas);



}


function drawMapOverlay() {
	//console.log( 'drawMapOverlay', 23 );

	const opacity = 1;
	const zoom =  MAP.zoom + 2;
	const tilesPerSide = MAP.tilesPerSide + 2;
	const rasterCanvas = document.createElement( 'canvas' );
	rasterCanvas.width = rasterCanvas.height = MAP.pixelsPerTile * tilesPerSide;

	//document.body.appendChild(rasterCanvas);
	//rasterCanvas.style.cssText = "width: 512px;"
	//rasterCanvas.style.cssText = 'border: 1px solid gray; left: 0; margin: 10px auto; position: absolute; right: 0; top: 0; z-index:10;';

	const rasterContext = rasterCanvas.getContext( '2d' );

	if ( !MAP.mapType ) {

		MAP.mapType = [ 'Google Maps', 'https://mt1.google.com/vt/x=' ];
		MAP.selectedIndex = 0;

	}

	

//		const tileOffset = Math.floor( 0.5 * tilesPerSide );
	const tileX = MAP.lon2tile( MAP.longitude, zoom ) - MAP.titleOffsetX;
	const tileY = MAP.lat2tile( MAP.latitude, zoom ) - MAP.titleOffsetY;

	let count = 0;
	const baseURL = MAP.mapType[ 1 ];

	for ( let x = 0; x < tilesPerSide; x++ ) {

		for ( let y = 0; y < tilesPerSide; y++ ) {

			if ( MAP.selectedIndex < 4 ) {

				loadImage( baseURL + ( x + tileX ) + '&y=' + ( y + tileY ) + '&z=' + zoom, x, y );
				//console.log( 'google', baseURL + ( x + tileX ) + '&y=' + ( y + tileY ) + '&z=' + zoom, x, y );

			} else if ( MAP.selectedIndex === 7 ) {

				loadImage( baseURL + zoom + '/' + ( y + tileY ) + '/' + ( x + tileX ) + '.jpg', x , y );
				//console.log( 'esri', baseURL + zoom + '/' + ( y + tileY ) + '/' + ( x + tileX ) + '.jpg' );

			} else {

				loadImage( baseURL + zoom + '/' + ( x + tileX ) + '/' + ( y + tileY ) + '.png', x , y );
				//console.log( '', MAP.selectedIndex, baseURL + zoom + '/' + ( x + tileX ) + '/' + ( y + tileY ) + '.png' );

			}

		}

	}


	function loadImage( url, x, y ) {
		//console.log( 'load image', x, y );
		//scope.info.innerHTML += 'url ' + url + ' x' + x + ' y' + y + b;

		const img = document.createElement( 'img' );
		img.crossOrigin = 'anonymous';
		img.src = url;



		const texture = new THREE.Texture( rasterCanvas );
		texture.minFilter = texture.magFilter = THREE.NearestFilter;
		texture.needsUpdate = true;
		const pixelsPerTile = MAP.pixelsPerTile;
		const tilesPerSideSquared = tilesPerSide * tilesPerSide;

		img.onload = function(){

			//info.innerHTML += + count + ' ';
			rasterContext.drawImage( img, 0, 0, pixelsPerTile, pixelsPerTile, x * pixelsPerTile, y * pixelsPerTile, pixelsPerTile, pixelsPerTile );

			count++;

			if ( count >= tilesPerSideSquared ) {

				//info.innerHTML += 'ground.material.map' + texture.uuid;

				if ( THR.lightDirectional ) {
					//console.log( 'lights true', lightDirectional );

					THR.ground.material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, side: 2, opacity: opacity , transparent: true } );


				} else {
					//console.log( 'lights false', lights );

					THR.ground.material = new THREE.MeshBasicMaterial( { color: 0xffffff, map: texture, side: 2, opacity: opacity , transparent: true } );

				}

				//ground.material = new THREE.MeshPhongMaterial( { color: 0xffffff, map: texture, side: 2, opacity: opacity , transparent: true } );
				//ground.geometry.computeFaceNormals();
				//ground.geometry.computeVertexNormals();
//					ground.material.needsUpdate = true;

				//setCamera();

			}

		}

	}


}



function setCamera() {

//		if ( !ground.geometry ) { return; }

	const size = MAP.groundSize;
//		ground.geometry.computeBoundingSphere();
	const center = ground.geometry.boundingSphere.center;
	controls.target.copy( center );

	axesHelper.position.copy( center );

	//console.log( 'center', center, camera.position );

	camera.position.copy( controls.target.clone().add( new THREE.Vector3( 0, size, size ) ) );

	lightDirectional.position.copy( controls.target.clone().add( new THREE.Vector3( -size, size, size ) ) );

	lightDirectional.target = axesHelper;

}
////////// Cartography utilities

MAP.lon2tile = function (longitude, zoom) {

	return Math.floor((longitude + 180) / 360 * Math.pow(2, zoom));

};


MAP.lat2tile = function (latitude, zoom) {

	const pi = Math.PI;
	return Math.floor((1 - Math.log(Math.tan(latitude * pi / 180) + 1 / Math.cos(latitude * pi / 180)) / pi) / 2 * Math.pow(2, zoom));

};


MAP.tile2lon = function (x, zoom) {

	return (x / Math.pow(2, zoom) * 360 - 180);

};


MAP.tile2lat = function (y, zoom) {

	const pi = Math.PI;
	const n = pi - 2 * pi * y / Math.pow(2, zoom);
	return 180 / pi * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));

};
