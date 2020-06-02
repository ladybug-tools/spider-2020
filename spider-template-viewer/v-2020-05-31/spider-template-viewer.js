
const version = "v-2020-05-31";
const description = document.head.querySelector( "[ name=description ]" ).content;

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";




function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	THR.init();
	THR.animate();
	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	THR.addMeshes();

    THR.updateGroup( THR.group );
    
}

THR.onLoad = function ( event ) {

	//console.log( 'event thr', event );

	FO.init();
	
	FO.extension = "=1"
	FO.responseType = "json";

	//FOT.fileType = "json"; // for testing
	//FOT.init();

	//FOZ.init();

	const target = window.self === window.top ? window : window.parent;

	url = "https://api.github.com/repos/ladybug-tools/spider-2020/git/trees/master?recursive=1"

	target.location.hash = url;

	HRT.init();
	
};


FO.callback = function ( json ) {

	console.log( 'json', json );

	FO.onProgress( 23, "Load complete" );
	FO.lines = [];
	FO.dirsRoot = [];

	getDirs( json.tree )

	//console.log( "lines", FO.lines );
	divView.innerHTML = FO.lines.join( "");

};


function getDirs( items ) {

	//console.log( "items", items );

	const arr = [];

	for( item of items ) {

		itemsNew = [];

		if ( item.type === "tree" ) {

			path = item.path;

			const dirs = path.split( "/");

			const shift = dirs.shift();

			//console.log( "shift", shift );

			if ( FO.dirsRoot.includes( shift ) === false ) {

				FO.dirsRoot.push( shift )
				FO.lines.push( `<h3>${ shift }</h3>`)

			}

			
			if ( arr.includes( shift ) === false ) {
	
				arr.push( shift );
				console.log( "includes", arr, shift );
				//FO.lines.push( `<h4>${ shift }</h4>`)
				
							
			} else {

				dir = Array.isArray( dirs ) ? dirs.pop() : dirs;
				//console.log( "dir", dir );
				FO.lines.push( `<h4>${ dir }</h4>`)

				itemsNew.push( item );
				
			}
			
		} else {

			FO.lines.push(`<div>${ item.path.split( "/").pop()  }</div>`)
		}
		

		getDirs( itemsNew );


		//console.log( "arr", arr);

	}
}