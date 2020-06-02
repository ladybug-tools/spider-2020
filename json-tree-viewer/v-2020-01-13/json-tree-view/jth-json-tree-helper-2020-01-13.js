const JTH = {}


JTH.init = function () {


	JTVpButtons.innerHTML += JTH.getMenu();

	window.addEventListener( "onloadglf", JTH.onLoad, false );

}


JTH.getMenu = function() {

	const htm =
	`
		<button onclick=JTH.addPopupHelp() >add popup help</button>
	`;

	return htm
};


JTH.onLoad = function () {

	JTH.addPopupHelp();

	const details = Array.from( JTVdivJsonTree.querySelectorAll( "details" ) ).filter( det => det.children.length < 10 );

	console.log( 'details', details );
	//details[ 0 ].open = true;

};


JTH.addPopupHelp = function () {

	let id = 0;

	detailsArray = Array.from( JTVdivJsonTree.querySelectorAll( "details" ) ).filter( det => det.children.length < 10 && !det.innerText.includes( "model" ) );


	detailsArray.forEach( (details, index ) => {

		details.childNodes[ 1 ].title = index;



	} );


	// for ( tree of trees ) {

	// 	const size = tree.size;

	// 	console.log( 'size', tree, size );

	// 	// for ( let face of faces ) {

	// 	// 	face.id = id;

	// 	// 	face.button = `<button onclick=console.log(this.value);JTH.addHighLight(this.value); value=${ id++ } >faces</button>`;

	// 	// }
	// }

	//JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, GFL.json, 0 );

	//htm = `<button onclick=console.log(this.value); value=23 >faces</button>`;

	//JTVdivJsonTree.innerHTML = JTVdivJsonTree.innerHTML.replace( /xxxx/g, htm );
};


JTH.init();