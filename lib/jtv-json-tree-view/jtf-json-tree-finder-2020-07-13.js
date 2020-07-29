// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-10
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const JTF = {};



JTF.init = function () {

	//window.addEventListener( "onloadJson", JTF.onLoad, false );

	JTFdivJsonTreeFinder.innerHTML = JTF.getMenu();

};



JTF.getMenu = function () {

	const htm = `
<details open>

	<summary class="summary-secondary" >

		JSON Tree Finder

		<span class="info">
		<img class=infoImg  src="https://ladybug.tools/spider-2020/lib/assets/icons/noun_Information_585560.svg">
		<span class="infoTooltip gmd-5">
			Search the JSON data for any term.
			<p>Searches are not case sensitive.
			<p>Click any button displayed to highlight the item in JSON Tree view.
		</span></span>

	</summary>

	<p>
		<label for="site-search">Search the data:<br>
	
		<input type="search" name="q" id=JTFinpSearch oninput="JTF.findStuff();" minlength=3 
			placeholder="Enter a search term" style=width:100%; >
		</label>
	</p>
	<div id=JTFdivFinds ></div>

</details>`;

	return htm;

};


JTF.onLoad = function ( event) {

	//console.log( 'ev', event );

	JTFinpSearch.value = "";

	JTFdivFinds.innerHTML = "Buttons will appear here";

};


JTF.findStuff = function () {

	JTF.divs = Array.from( JTVdivJsonTree.querySelectorAll( "div" ) );

	const find = JTFinpSearch.value.toLowerCase();

	JTF.finds = JTF.divs.filter( div => div.innerText.toLowerCase().includes( find ) );
	//console.log( 'finds', JTF.finds );

	const htm = JTF.finds.map( ( find, i ) => `<button onclick=JTF.showFind(${ i }) >${ find.innerText }</button>` ).join( "<p>" );

	JTFdivFinds.innerHTML = htm;

};


JTF.showFind = function ( index ) {

	JTH.toggleAll();

	JTF.divs.forEach( div => div.style.backgroundColor = "" )

	const find = JTF.finds[ index ];

	find.style.backgroundColor = "lightgreen";

	JTF.openParentNode( find );

	find.scrollIntoView();

};


JTF.openParentNode = function ( child ) {

	if ( child.parentNode ) {

		child.parentNode.open = true;

		JTF.openParentNode( child.parentNode );

	}

};
