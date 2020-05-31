
function onLoadRAD( xhr ) {

	textOsm = FO.string;

	//console.log( "lines", lines );

	parseOsm( textOsm )


} 

function parseOsm( text ) {

	surfaces = [];

	txt = textOsm; //txtArea1.innerHTML;
	lines = txt.split(/\r?\n/);
	txt = '';

	while ( lines.length > 0 ) {

		line = lines.shift();

		if ( line.indexOf( 'OS:Site,' ) > -1 ) {
		
			scene.userData.siteHandle = lines.shift().split( ',' )[0].trim();
			scene.userData.siteName = lines.shift().split( ',' )[0].trim();
			scene.userData.siteLatitude = lines.shift().split( ',' )[0].trim();
			scene.userData.siteLongitude = lines.shift().split( ',' )[0].trim();
			scene.userData.siteElevation = lines.shift().split( ',' )[0].trim();
			scene.userData.siteTerrain = lines.shift().split( ',' )[0].trim();

			txt += '\nSite\n' +
				'Handle: ' + scene.userData.siteHandle + '\n' +
				'Name: ' + scene.userData.siteName + '\n' +
				'Latitude: ' + scene.userData.siteLatitude + '\n' +
				'Longitude: ' + scene.userData.siteLongitude + '\n' +
				'Elevation: ' + scene.userData.siteElevation + '\n' +
				'Terrain: ' + scene.userData.siteTerrain + '\n' +
			'';

		} else if ( line.indexOf( 'OS:Surface,' ) > -1 ) {

			txt += '\nSurface\n';
			vertices = [];
			line = lines.shift();

			while ( line.indexOf( 'OS:' ) < 0 ) {

				item = line.split( ',' )[0].trim();
				if ( line.indexOf( 'Handle' ) > -1 ) { 
					handle = item;
					txt += 'Handle: ' + handle + '\n';
				}
				if ( line.indexOf( '- Name' ) > -1 ) { 
					name = item
					txt += 'Name: ' + name + '\n';
				}
				if ( line.indexOf( 'Surface Type' ) > -1 ) { 
					surfaceType = item;
					txt += 'Surface Type: ' + surfaceType + '\n';
				}
				if ( line.indexOf( 'Space Name' ) > -1 ) { 
					spaceName = item;
					txt += 'Space Name: ' + spaceName + '\n';
				}
				if ( line.indexOf( 'Outside Boundary Condition' ) > -1 && line.indexOf( 'Outside Boundary Condition Object' ) === -1 ) { 
					outsideBoundaryCondition = item;
					txt += 'Outside Boundary Condition: ' + outsideBoundaryCondition + '\n';
				}
				if ( line.indexOf( 'Sun Exposure' ) > -1 ) { 
					sunExposure = item;
					txt += 'Sun Exposure: ' + sunExposure + '\n';
				}
				if ( line.indexOf( 'Wind Exposure' ) > -1 ) { 
					windExposure = item;
					txt += 'Wind Exposure: ' + windExposure + '\n';
				}
				if ( line.indexOf( 'X,Y,Z Vertex' ) > -1 ) { 
					verts = line.split( ',' );
					vertices.push ( new THREE.Vector3( parseFloat( verts[ 0 ] ), parseFloat( verts[ 1 ] ), parseFloat( verts[ 2 ] ) ) ); 
					txt += 'Vertices: ' + parseFloat( verts[ 0 ] ) + ' ' + parseFloat( verts[ 1 ] ) + ' ' + parseFloat( verts[ 2 ] )  + '\n';
				}

				line = lines.shift();

			}

			color = 0xeeeeee;

			if ( surfaceType === 'RoofCeiling' ) { color = 0xcc0000; }
			if ( surfaceType === 'Floor' ) { color = 0x0000cc; }
			mesh = quad( vertices, color );

			mesh.userData.handle = handle;
			mesh.userData.name = name;
			mesh.userData.surfaceType = surfaceType;
			mesh.userData.spaceName = spaceName;
			mesh.userData.outsideBoundaryCondition = outsideBoundaryCondition;
			mesh.userData.sunExposure = sunExposure;
			mesh.userData.windExposure = windExposure;
			mesh.userData.vertices = vertices;
			surfaces.push( mesh );
			THR.group.add( mesh );

		} else if ( line.indexOf( 'OS:SubSurface,' ) > -1 ) {

			txt += '\nSubSurface\n';
			vertices = [];
			line = lines.shift();

			while ( line.indexOf( 'OS:' ) < 0 ) {

				item = line.split( ',' )[0].trim();
				if ( line.indexOf( 'Handle' ) > -1 ) { 
					handle = item;
					txt += 'Handle: ' + handle + '\n';
				}
				if ( line.indexOf( '- Name' ) > -1 ) { 
					name = item
					txt += 'Name: ' + name + '\n';
				}
				if ( line.indexOf( 'Sub Surface Type' ) > -1 ) { 
					subSurfaceType = item;
					txt += 'Sub Surface Type: ' + subSurfaceType + '\n';
				}

				if ( line.indexOf( 'X,Y,Z Vertex' ) > -1 ) { 
					verts = line.split( ',' );
					vertices.push ( v3( parseFloat( verts[ 0 ] ), parseFloat( verts[ 1 ] ), parseFloat( verts[ 2 ] ) ) ); 
					txt += 'Vertices: ' + parseFloat( verts[ 0 ] ) + ' ' + parseFloat( verts[ 1 ] ) + ' ' + parseFloat( verts[ 2 ] )  + '\n';
				}

				line = lines.shift();

			}

			color = 0x444444;

			mesh = quad( vertices, color );

			mesh.userData.handle = handle;
			mesh.userData.name = name;
			mesh.userData.subSurfaceType = subSurfaceType;

			mesh.userData.vertices = vertices;
//				surfaces.push( mesh );
			THR.group.add( mesh );

		}

	}

	if ( window.self === window.top ) {

	} else {

		//parent.txtArea2.innerHTML = txt;

	}

}



function quad( arr, color ) {

	if ( arr.length < 4 ) {
		var faces = [
			f3( 0, 1, 2 )
		];

	} else {
		var faces = [
			f3( 0, 1, 2 ),
			f3( 0, 2, 3 ),
		];
	}

	var geometry = new THREE.Geometry();
	geometry.vertices = arr;
	geometry.faces = faces;

	geometry.computeFaceNormals();
	geometry.mergeVertices();

	var opacity;

	if ( window.self === window.top ) {

		opacity = 0.85;

	} else {

		opacity = parseFloat( parent.inpOpacity.value );

	}

	var material = new THREE.MeshPhongMaterial( { color: color, opacity: opacity, side: 2, transparent: true } );
	var mesh = new THREE.Mesh( geometry, material );

	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//edges = new THREE.EdgesHelper( mesh, 0x000000 );
	//mesh.add( edges );


	return mesh;
}


function onDocumentMouseClick( event ) {

	//		event.preventDefault();
	
			mouse.x = ( event.clientX / renderer.domElement.width ) * 2 - 1;
			mouse.y = - ( event.clientY / renderer.domElement.height ) * 2 + 1;
	
			raycaster.setFromCamera( mouse, camera );
			intersects = raycaster.intersectObjects( surfaces );
	
			if ( intersects.length > 0 ) {
	
				if ( intersected != intersects[ 0 ].object ) {
	
					if ( intersected && intersected.material.emissive ) {
	
						intersected.currentHex = intersected.material.emissive.getHex();
	
					}
	
					intersected = intersects[ 0 ].object;
					intersected.material.emissive.setHex( 0xff0000 );
	
					divPopUp.style.left = 10 + 0.5 * window.innerWidth + mouse.x * 0.5 * window.innerWidth + 'px';
					divPopUp.style.top = -10 + 0.5 * window.innerHeight - mouse.y * 0.5 * window.innerHeight + 'px';
					divPopUp.style.display = '';
	
					var txt = '<h3 style="margin:0;" >OSM Data Viewer / Three.js id:' + intersected.id + '</h3>' +
						'Handle: <small>' + intersected.userData.handle + '</small><br>' +
						'Name: ' + intersected.userData.name + '<br>' +
						'Surface Type: ' + intersected.userData.surfaceType+ '<br>' +
						'Space Name: <small>' + intersected.userData.spaceName + '</small><br>' +
						'Outside Boundary Condition: ' + intersected.userData.outsideBoundaryCondition + '<br>' +
						'Sun Exposure: ' + intersected.userData.sunExposure + '<br>' +
						'Wind Exposure: ' + intersected.userData.windExposure + '<br>' +
					'';
					divPopUp.innerHTML = txt;
	
				}
	
				document.body.style.cursor = 'pointer';
	
	
			} else {
	
				if ( intersected && intersected.material.emissive ) {
	
					intersected.material.emissive.setHex( intersected.currentHex );
	
				}
	
				intersected = null;
	
				divPopUp.style.display = 'none';
	
				document.body.style.cursor = 'auto';
	
			}
	
		}