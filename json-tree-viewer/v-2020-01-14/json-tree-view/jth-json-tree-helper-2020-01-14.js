const JTH = {}


JTH.init = function () {

	JTHdivJsonTreeHelper.innerHTML = JTH.getMenu();

	window.addEventListener( "onloadgfo", JTH.onLoad, false );

}


JTH.getMenu = function() {

	const htm =
	`
	<details open >

		<summary>
			JSON tree helper

			<span class="couponcode" >??<span class="coupontooltip" >
				JSON tree view helpers</p>
			</span></span>
		</summary>


		<p id=JTHpButtons >
			<button id=but onclick=JTV.toggleAll(); >close all</button>
			<button id=but onclick=JTV.toggleAll(true); >open all</button>
			<button id=but onclick=JTV.addUrls(); >clickable links</button>
			<button onclick=JTH.addPopupHelp() title="not useful yet, just adds a title witg is" >add popup help</button>
		</p>

	</details>
	`;

	return htm
};


JTH.onLoad = function () {

	JTH.addPopupHelp();

	const details = Array.from( JTVdivJsonTree.querySelectorAll( "details" ) ).filter( det => det.children.length < 10 );

	//console.log( 'details', details );
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