// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/threejs-hamburger/
// 2020-02-27
/* globals FJSNdivGithubFolderFiles, FJSNdivMenuItems, FJSNdivFileInfo */
// jshint esversion: 6
// jshint loopfunc: true


const FJSN = {};


FJSN.items = [
/*
	{
		"user": "GreenBuildingXML",
		"repo": "/Sample-gbXML-Files",
		"pathRepo": "",
		"type": ".xml",
		"title": "gbXML.org sample files",
		"subTitle":
			`Files from the
		<a href="https://github.com/GreenBuildingXML/Sample_gbXML_Files" target="_blank">gbXML.org Sample Files</a>
		repository on GitHub.
		Includes a variety of gbXML files from various vendors and organizations.`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider",
		"pathRepo": "gbxml-sample-files/",
		"type": ".xml",
		"title": "Spider gbXML files",
		"subTitle":
			`Ladybug Tools / Spider
		<a href = "https://www.ladybug.tools/spider/#gbxml-sample-files/" target = "_blank" >sample files</a >
		on GitHub from a variety of sources`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider",
		"pathRepo": "gbxml-sample-files/samples-2/",
		"type": ".xml",
		"title": "Spider gbXML files #2",
		"subTitle":
			`Ladybug Tools / Spider gbXML Viewer
			<a href = "https://www.ladybug.tools/spider/#gbxml-sample-files-2/" target = "_blank" >sample files #2</a >
			on GitHub from a variety of sources`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider",
		"pathRepo": "cookbook/07-create-exportable-buildings/test-gbxml-files/",
		"type": ".xml",
		"title": "Build Well gbXML",
		"subTitle":
			`Parametrically created gbXML files from the Spider
		<a href="https://www.ladybug.tools/spider/#build-well/README.md" target="_blank">Build Well</a>
		 contributions to the
		<a href="https://speedwiki.io/" target="_blank">PerKins and Will SPEED</a>
	 	project`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider",
		"pathRepo": "gbxml-sample-files/zip/",
		"type": ".zip",
		"title": "Spider gbXML ZIP files",
		"subTitle":
			`Ladybug Tools / Spider gbXML
		<a href="https://www.ladybug.tools/spider/#gbxml-sample-files/README.md" target="_blank">sample gbXML data in ZIP files</a>
	 	on GitHub from a variety of sources`
	}
*/


	{
		"user": "ladybug-tools",
		"repo": "/honeybee-schema",
		"pathRepo": "samples/model/",
		"type": ".json",
		"title": "Honeybee Schema JSON",
		"subTitle":
			`Ladybug Tools / Honeybee Schema
		<a href="https://github.com/ladybug-tools/honeybee-schema" target="_blank">sample data JSON files</a>
	 	on GitHub`
	},
	{
		"user": "ladybug-tools",
		"repo": "/spider",
		"pathRepo": "sandbox/honeybee-schema-builder/honeybee-json-schema-sample-files-by-javascipt/",
		"type": ".json",
		"title": "Honeybee Builder JSON",
		"subTitle":
			`Ladybug Tools / Honeybee Builder
		<a href="https://www.ladybug.tools/spider/#README.md" target="_blank">sample data JSON files</a>
	 	on GitHub`
	},
	{
		"user": "ladybug-tools",
		"repo": "/dragonfly-schema",
		"pathRepo": "samples/",
		"type": ".json",
		"title": "Dragonfly Schema JSON",
		"subTitle":
			`Ladybug Tools / Dragonfly Schem
		<a href="https://www.ladybug.tools/dragonfly-schema/#README.md" target="_blank">sample data JSON files</a>
	 	on GitHub`
	}

/*,
	{
		"user": "ladybug-tools",
		"repo": "/3d-models",
		"pathRepo": "quaternius/ultimate-nature-pack/",
		"branch": "gh-pages/",
		"type": ".obj",
		"title": "Ultimate Nature Pack",
		"subTitle":
			`Free, usable and good-looking OBJ files from
		<a href="https://quaternius.com" target="_blank">Quaternius</a>
	 	on GitHub`
	},
	{
		"user": "ladybug-tools",
		"repo": "/3d-models",
		"pathRepo": "quaternius/public-transport/",
		"branch": "gh-pages/",
		"type": ".obj",
		"title": "Public Transport",
		"subTitle":
			`Free, usable and good-looking OBJ files from
		<a href="https://quaternius.com" target="_blank">Quaternius</a>
	 	on GitHub`
	},
	{
		"user": "ladybug-tools",
		"repo": "/3d-models",
		"pathRepo": "content/obj/vehicles/",
		"branch": "gh-pages/",
		"type": ".obj",
		"title": "vehicles",
		"subTitle":
			`Free, usable and good-looking OBJ files from FreeCAD`
	}
*/

];

FJSN.iconInfo = `<img src="assets/github-mark-32.png" height=18 style=opacity:0.5;>`;



FJSN.init = function () {

	FJSNdivFilesJson.innerHTML = FJSN.getMenu();

};



FJSN.getMenu = function () {

	const htm = `


<details id=FJSNdet ontoggle=FJSN.getMenuItems() >

	<summary class="sumMenuSecondary" title="see FJSN-github-folder-files.js" >

		Honeybee & Dragonfly samples

		<span class="couponcode">?? <span class="coupontooltip">
		Uses the GitHub Developer API to obtain lists of files in GitHub repositories containing gbXML files.

		</span></span>

	</summary>

	<p>Sample files you can load, view and experiment with</p>



	<div id=FJSNdivMenuItems ></div>

	<div id=FJSNdivFileInfo></div>

	<div id="GATdivGithubAccessToken"></div>

</details>`;

	return htm;

};



FJSN.getMenuItems = function () {

	const htm = FJSN.items.map( ( item, index ) =>
		`
		<details id=FJSNdet${ index } ontoggle="FJSNdivFolderFiles${ index }.innerHTML=FJSN.getGithubFolderFiles(${index});" >

			<summary id=FJSNsumSurfaces >${ index + 1} - ${item.title}</summary>

			<div id=FJSNdivFolderFiles${ index} ></div>

		</details>
	`
	).join( "" );

	FJSNdivMenuItems.innerHTML = htm;

};



FJSN.getGithubFolderFiles = function ( index ) {

	const item = FJSN.items[ index ];

	// drop the pathRepo var to get all the files and use tree recursive??
	item.urlGitHubApiContents = 'https://api.github.com/repos/' + item.user + item.repo + '/contents/' + item.pathRepo;

	FJSN.index = index;

	const htm =
		`
		<p><i>${ item.subTitle}</i></p>

		<div id=FJSNdivGallery${ index} ></div>

		<p>Click any ${ FJSN.iconInfo} icon to view file source code on GitHub.</p>

		<p>Click any file title to view the file in this script.</p>

		<p>Click any ❐ icon to go full screen & get link to individual file.</p>

		<p>Tool tips provide file size.

		<hr>

	`;

	FJSN.requestFile( item.urlGitHubApiContents, FJSN.callbackGitHubMenu, index );

	return htm;

};



FJSN.requestFile = function ( url, callback, index ) {

	FJSN.index = index;

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = xhr => console.log( 'error:', xhr );
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );


	function onRequestFileProgress ( xhr ) {

		let name = xhr.target.responseURL.split( '/' ).pop();

		const item = FJSN.items[ FJSN.index ];

		name = name ? item.user + '/' + name : `${item.user}  ${item.repo} `;

		FJSNdivFileInfo.innerHTML =`
<p>
	Files from: ${ name}<br>
	Bytes loaded: ${ xhr.loaded.toLocaleString()}<br>
</p>`;

	}

};



FJSN.callbackGitHubMenu = function ( xhr ) {

	const response = xhr.target.response;
	files = JSON.parse( response );

	let htm = '';
	FJSN.files = [];

	const item = FJSN.items[ FJSN.index ];
	//console.log( 'item', item );

	const branch = item.branch || "master/";

	item.urlGitHubPage = 'https://cdn.jsdelivr.net/gh/' + item.user + item.repo + '@' + branch + item.pathRepo;

	item.urlGitHubSource = "https://github.com/" + item.user + item.repo + "/blob/" + branch + item.pathRepo;

	item.threeDefaultFile = "#";

	for ( let file of files ) {

		if ( file.name.toLowerCase().endsWith( item.type ) === false ) { continue; }

		FJSN.files.push( file );

		const fileName = encodeURI( file.name );

		//browse-files/FJSN-github-folder-files/v-2020-02-25/FJSN-basic-html-2020-01-17.html
		htm +=

			`<div style=margin:4px 0; >

			<a href=${ item.urlGitHubSource + fileName} title="Edit me" >${FJSN.iconInfo}</a>

			<a href=#${ item.urlGitHubPage + fileName} title="${file.size.toLocaleString()} bytes" >${file.name}</a>

			<a href=${ item.threeDefaultFile}${item.urlGitHubPage}${fileName} title="Link to just this file" target="_blank" >&#x2750;</a>

		</div>`;

	}

	const divGallery = FJSNdivFilesJson.querySelectorAll( "#FJSNdivGallery" + FJSN.index )[ 0 ];
	//console.log( 'divGallery', divGallery );

	divGallery.innerHTML = htm;

	//console.log( 'files', FJSN.files );

};



FJSN.init();