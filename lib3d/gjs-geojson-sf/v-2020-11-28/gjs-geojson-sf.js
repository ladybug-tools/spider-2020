

const GJS = {

	groupGeoJson: undefined,

}; // GeoJson lines



GJS.initGeoJson = function () {

	timeStart = performance.now();

	scene.remove( GJS.groupGeoJson );
	GJS.groupGeoJson = new THREE.Group();
	GJS.groupGeoJson.name = "geoJson";

	const pathGeoJson = "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/";


	// https://data.sfgov.org/COVID-19/COVID-19-Cases-by-Geography-and-Date/d2ef-idww
	// API > geoJson
	//const urlGeoJson = "https://data.sfgov.org/resource/d2ef-idww.geojson";
	const urlGeoJson = "../c-19.geojson";

	//const urlGeoJson = "./gz_2010_us_050_00_20m.json";

	//const urlGeoJson = "../../opendata/us-county-boundaries-ca.geojson";
	//const urlGeoJson = "./json/ca-cbsa.json";


	GJS.requestFile( urlGeoJson, GJS.onLoadGeoJson );

	//const urlJsonRegions = "ne_50m_admin_1_states_provinces_lines.geojson";

	//GJS.requestFile( urlJsonRegions, GJS.onLoadGeoJson );

	scene.add( GJS.groupGeoJson );

	//console.log( "msGeoJ", performance.now() - timeStart );

};



GJS.onLoadGeoJson = function ( string ) {

	console.log( "string", string );
	const json = string

	let geometries = json.features.filter( feature => feature.geometry ).map( feature => feature.geometry )
	console.log( "geometries", geometries );

	let points = geometries.flatMap( geometry => {

		if ( geometry && [ "MultiPolygon", "Polygon", "MultiLineString" ].includes( geometry.type ) ) {

			return [ ... geometry.coordinates ][ 0 ];

		} else if ( geometry && geometry.type === "LineString" ) {

			return [ geometry.coordinates ];

		} else {

			return [];
		}

	} );
	console.log( "points", points );

	//const vertices = points.map( pairs => pairs.flatMap( pair => GJS.latLonToXYZ( 50, pair[ 1 ], pair[ 0 ] ) ) );

	const vertices = points.map( pairs => pairs.map( pair => new THREE.Vector3( pair[ 0 ]+ 122.44, pair[ 1 ] - 37.77, 0 )  ) );
	console.log( "vertices", vertices );

	const line = GJS.addLineSegments( vertices );

	GJS.groupGeoJson.add( line );

};



GJS.onLoadGeoJsonCbsa = function ( string ) {

	geoJson = string;

	console.log( "geoJson", geoJson.records );

	//let geometries = json.features.map( feature => feature.geometry );

	let geometries = geoJson.records.map( record => record.fields.geo_shape );
	console.log( "geometries", geometries );

	let points = geometries.flatMap( geometry => {

		if ( [ "MultiPolygon", "Polygon", "MultiLineString" ].includes( geometry.type ) ) {

			return [ ... geometry.coordinates ];

		} else if ( geometry.type === "LineString" ) {

			return [ geometry.coordinates ];

		}

	} );
	console.log( "points", points );

	//const vertices = points.map( pairs => pairs.map( pair => GJS.latLonToXYZ( 50, pair[ 1 ], pair[ 0 ] ) ) );
	//console.log( "vertices", vertices );


	const vertices = points.map( pairs => pairs.map( pair => new THREE.Vector3( pair[ 0 ], pair[ 1 ], 0 )  ) );

	const line = GJS.addLineSegments( vertices );

	GJS.groupGeoJson.add( line );

};

GJS.addLineSegments = function ( segments ) {

	//console.log( "segments", segments );

	const geometry = new THREE.BufferGeometry();

	const positions = segments.flatMap( vertices =>

		vertices.slice( 0, - 1 ).flatMap( ( v0, i ) => {

			const v1 = vertices[ i + 1 ];
			return [ v0.x, v0.y, v0.z, v1.x, v1.y, v1.z ];

		} )

	);

	geometry.setAttribute( "position", new THREE.Float32BufferAttribute( positions, 3 ) );

	const material = new THREE.LineBasicMaterial( { color: 0x000ff } );

	return new THREE.LineSegments( geometry, material );

};





GJS.latLonToXYZ = function( radius = 50, lat = 0, lon = 0 ) {

	const phi = ( ( 90 - lat ) * Math.PI ) / 180;
	const theta = ( ( 180 - lon ) * Math.PI ) / 180;
	//console.log( "lat/lon", theta, phi, index);

	const x = radius * Math.sin( phi ) * Math.cos( theta );
	const y = radius * Math.sin( phi ) * Math.sin( theta );
	const z = radius * Math.cos( phi );

	return new THREE.Vector3( - x, y, z );

}


// https://threejs.org/docs/#api/en/loaders/FileLoader
// set response type to JSON

GJS.requestFile = function( url, callback ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( 'bytes loaded:', xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

}

