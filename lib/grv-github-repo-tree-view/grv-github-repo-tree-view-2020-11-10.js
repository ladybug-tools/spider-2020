const GRV = {};

GRV.ignoreFolders = [];
GRV.defaultFile = "README.md";

GRV.init = function () {

	GRV.requestFile( GRV.urlApi, GRV.onLoadTree );

};


GRV.requestFile = function ( url = "https://example.com", callback = onLoad ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};

GRV.onHashChange = function () {

	if ( !GRV.links ) {

		GRV.links = Array.from( GRVdivGitHubRepoTreeView.querySelectorAll( "a" ) );
	}

	GRV.links.forEach( link => link.parentNode.classList.remove( "highlight" ) );

	const str = location.hash ? location.hash.slice( 1 ) : GRV.defaultFile;

	const item = GRV.links.find( a => a.getAttribute( "href" ).includes( str ) );
	//console.log("item", item);

	item.parentNode.classList.add( "highlight" );

	item.parentNode.parentNode.open = true;

	item.parentNode.parentNode.parentNode.open = true;

	//item.scrollIntoView();
};


GRV.onLoadTree = function ( json ) {
	//console.log( "json", json );

	const tree = json.tree.slice();

	const subtrees = tree.filter( item => item.type === "tree" )
		.map( subtree => subtree.path.split( "/" ) );
	//console.log( "subtrees", subtrees );

	const folders = [];

	for ( let path of subtrees ) {

		let count = 0;

		for ( let ignore of GRV.ignoreFolders ) {

			if ( path[ 0 ] === ignore  ) { count++; }

		}

		if ( count === 0 ) { folders.push( path ); }

	}

	const files = tree.filter( obj => obj.type === "blob" ).map( subtree => subtree.path );
	//console.log( "files", files );

	const htm = `
	<div id=GRVdivFolders >
		<!-- <p>Use right-click menu to open or close all folders</p> -->
		${ GRV.subtreesToDetails( folders, files ).join( "" ) }
	</div>`;

	// const filesRoot = files
	// 	.filter( file => !file.includes( "/" ) )
	// 	.filter( file => file.endsWith( ".md" ) )
	// 	.map( ( item, i ) => `
	// 	<div class=GRVdiv >
	// 		<a href="${ GRV.urlSource }${ item }"  title="Source code on GitHub. Edit me!" >
	// 		${ GRV.iconOctoCat }</a>
	// 		${ i + 1 } <a href="#${ item }" >${ item.split( "/" ).pop() }</a>
	// 		<a href="${ GRV.urlViewer }${ item }" title="Link to just this file. Open file in new tab."  target="_blank" >${ GRV.link }</a>
	// 	</div>`);

	const filesRoot = files
		.filter( file => !file.includes( "/" ) )
		.filter( file => file.endsWith( ".md" ) )
		.map( ( item, i ) => `
		<div class=GRVdiv >

			<a href="#${ item }" >Home</a>
		</div>`);

	GRVdivGitHubRepoTreeView.innerHTML = filesRoot.join( "" ) + htm;

	window.addEventListener( "hashchange", GRV.onHashChange, false );

	//GRVdivFolders.addEventListener( "contextmenu", GRV.onContextMenu );

	GRV.onHashChange();

};



GRV.subtreesToDetails = function ( subtrees, files ) {
	//console.log( "subtrees", subtrees );

	let lengthSlicePrevious = 0;

	const htmArr = subtrees.map( ( subtree, index ) => {
		//let closer = "</details>";
		let closer = "";

		const subtreeTitle = subtree.slice( -1 );
		const subtreeSlice = subtree.slice( 0, -1 );
		const subtreeSliceJson = JSON.stringify( subtreeSlice );

		if ( subtreeSlice.length === lengthSlicePrevious ) {
			closer = "</details>";
			//console.log( "len same", subtreeSlice   );
		}

		if ( subtreeSlice.length < lengthSlicePrevious ) {
			const diff = lengthSlicePrevious - subtreeSlice.length + 1;
			closer = Array( diff ).fill( "</details>" ).join( "" );
			//console.log( "len shorter", subtreeTitle, diff, subtreeSlice, subtreeSlice.length, lengthSlicePrevious );
		}

		lengthSlicePrevious = subtreeSlice.length;

		const filesHtm = GRV.getFiles( subtree, files );

		//console.log( "subtreeTitle", subtreeTitle );

		const detOpen = subtreeTitle[ 0 ] === "pages" ? "open" : "";

		return `
		${ closer }
		<details id=GRVdet${ index } class="GRVdet" ${ detOpen } >
			<summary class="GRVsum" >${ subtreeTitle }</summary>
			${ filesHtm.join( "" ) }
		`;
	} );

	//console.log( "htmArr", htmArr );

	return htmArr;
};


GRV.getFiles = function ( subtree, files ) {

	//console.log( "subtree", subtree );

	const str = subtree.join( "/" );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		//.filter( file => file.endsWith( ".md" ) )
		.map( item => `
		<div>
			<a href="${ GRV.urlSource }${ item }" title="Source code on GitHub" >
			${ GRV.iconOctoCat }</a>
			<a href="#${ item }" title="">${ item.split( "/" ).pop() }</a>
			<a href="${ GRV.urlViewer }${ item }" title="Open file in new tab"  target="_blank" >
			${ GRV.link }</a>
		</div>`);

	return filtered;
};

GRV.getFilesSimple = function ( subtree, files ) {

	//console.log( "subtree", subtree );

	const str = subtree.join( "/" );

	const filtered = files
		.filter( file => file.slice( 0, file.lastIndexOf( "/" ) ) === str )
		//.filter( file => file.endsWith( ".md" ) )
		.map( item => `
		<div style="margin: 5px 0;" >

			<a href="#${ item }" title="" onclick="JavaScript:if(window.innerWidth<640||window.innerHeight<500){navMenuDet.open=false;}" >${ item.split( "/" ).pop().slice( 0, -3).replace( /-/g, " ") }</a>

		</div>`);

	return filtered;
};

////////////

GRV.onContextMenu = function ( event ) {

	event.preventDefault();

	console.log( "event", event.target.parentNode );

	el = event.target.parentNode;

	divPopUp.style.display = "block";
	divPopUp.style.left = event.pageX - 10 + "px";
	divPopUp.style.top = event.pageY - 10 + "px";

	const htm = `

	<div><button onclick=GRV.toggleChildren(GRVdivFolders,true); >open all</button></div>
	<div><button onclick=GRV.toggleChildren(GRVdivFolders,false); >close all</button></div>
	<hr>
	<div><button onclick=GRV.toggleChildren(${ event.target.parentNode.id },true); >open children</button></div>
	<div><button onclick=GRV.toggleChildren(${ event.target.parentNode.id },false); >close children</button></div>
	`;

	divPopUp.innerHTML = htm;

	window.addEventListener( "click", GRV.onClick );

};


GRV.toggleChildren = function ( element = GRVdivFolders, boole = false ) {

	//console.log( "el", element, element.querySelectorAll( "details" ) )

	element.open = boole;

	element.querySelectorAll( "details" ).forEach( detail => detail.open = boole );

};

GRV.onClick = function () {

	divPopUp.style.display = "";

	divPopUp.innerHTML = "";

	window.removeEventListener( "click", GRV.onClick );

};


////////////

GRV.test = function () {

	//const links = GRVdivGitHubRepoTreeView.querySelectorAll( "a" );

	console.log( "GRV.links", GRV.links );

	let i = 1;

	nextLink();

	function nextLink () {

		GRV.links[ i ].click();

		if ( i < GRV.links.length - 2 ) {

			i += 3;

			setTimeout( nextLink, 1000 );

		} else {

			console.log( "number of flies opened:", ( i - 1 ) / 3 );

		}
	}
};
