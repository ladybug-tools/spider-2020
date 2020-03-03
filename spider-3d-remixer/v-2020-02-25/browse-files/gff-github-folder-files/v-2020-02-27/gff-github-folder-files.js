// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/threejs-hamburger/
// 2020-02-27
/* globals GFFdivGithubFolderFiles, GFFdivMenuItems, GFFdivFileInfo */
// jshint esversion: 6
// jshint loopfunc: true


const GFF = {};


GFF.items = [
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
	},
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
	},
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
];

GFF.iconInfo = `<img src="assets/github-mark-32.png" height=18 style=opacity:0.5;>`;



GFF.init = function () {

	GFFdivGithubFolderFiles.innerHTML = GFF.getMenu();

};



GFF.getMenu = function () {

	const htm = `
<details id=GFFdet ontoggle=GFF.getMenuItems() >

	<summary>

		Sample files

		<span class="couponcode">?? <span class="coupontooltip">
		Uses the GitHub Developer API to obtain lists of files in GitHub repositories.
		</span></span>

	</summary>

	<p>SampleL files you can load, view and experiment with</p>

	<div id=GFFdivMenuItems ></div>

	<div id=GFFdivFileInfo></div>

	<div id="GATdivGithubAccessToken"></div>

</details>`;

	return htm;

};



GFF.getMenuItems = function () {

	const htm = GFF.items.map( ( item, index ) =>
		`
		<details id=GFFdet${ index } ontoggle="GFFdivFolderFiles${ index }.innerHTML=GFF.getGithubFolderFiles(${index});" >

			<summary id=GFFsumSurfaces >${ index + 1} - ${item.title}</summary>

			<div id=GFFdivFolderFiles${ index} ></div>

		</details>
	`
	).join( "" );

	GFFdivMenuItems.innerHTML = htm;

};



GFF.getGithubFolderFiles = function ( index ) {

	const item = GFF.items[ index ];

	// drop the pathRepo var to get all the files and use tree recursive??
	item.urlGitHubApiContents = 'https://api.github.com/repos/' + item.user + item.repo + '/contents/' + item.pathRepo;

	GFF.index = index;

	const htm =
		`
		<p><i>${ item.subTitle}</i></p>

		<div id=GFFdivGallery${ index} ></div>

		<p>Click any ${ GFF.iconInfo} icon to view file source code on GitHub.</p>

		<p>Click any file title to view the file in this script.</p>

		<p>Click any ❐ icon to go full screen & get link to individual file.</p>

		<p>Tool tips provide file size.

		<hr>

	`;

	GFF.requestFile( item.urlGitHubApiContents, GFF.callbackGitHubMenu, index );

	return htm;

};



GFF.requestFile = function ( url, callback, index ) {

	GFF.index = index;

	const xhr = new XMLHttpRequest();
	xhr.crossOrigin = 'anonymous';
	xhr.open( 'GET', url, true );
	xhr.onerror = xhr => console.log( 'error:', xhr );
	xhr.onprogress = onRequestFileProgress;
	xhr.onload = callback;
	xhr.send( null );


	function onRequestFileProgress ( xhr ) {

		let name = xhr.target.responseURL.split( '/' ).pop();

		const item = GFF.items[ GFF.index ];

		name = name ? item.user + '/' + name : `${item.user}  ${item.repo} `;

		GFFdivFileInfo.innerHTML =`
<p>
	Files from: ${ name}<br>
	Bytes loaded: ${ xhr.loaded.toLocaleString()}<br>
</p>`;

	}

};



GFF.callbackGitHubMenu = function ( xhr ) {

	const response = xhr.target.response;
	files = JSON.parse( response );

	let htm = '';
	GFF.files = [];

	const item = GFF.items[ GFF.index ];
	//console.log( 'item', item );

	const branch = item.branch || "master/";

	item.urlGitHubPage = 'https://cdn.jsdelivr.net/gh/' + item.user + item.repo + '@' + branch + item.pathRepo;

	item.urlGitHubSource = "https://github.com/" + item.user + item.repo + "/blob/" + branch + item.pathRepo;

	item.threeDefaultFile = "#";

	for ( let file of files ) {

		if ( file.name.toLowerCase().endsWith( item.type ) === false ) { continue; }

		GFF.files.push( file );

		const fileName = encodeURI( file.name );

		//browse-files/gff-github-folder-files/v-2020-02-25/gff-basic-html-2020-01-17.html
		htm +=

			`<div style=margin:4px 0; >

			<a href=${ item.urlGitHubSource + fileName} title="Edit me" >${GFF.iconInfo}</a>

			<a href=#${ item.urlGitHubPage + fileName} title="${file.size.toLocaleString()} bytes" >${file.name}</a>

			<a href=${ item.threeDefaultFile}${item.urlGitHubPage}${fileName} title="Link to just this file" target="_blank" >&#x2750;</a>

		</div>`;

	}

	const divGallery = GFFdivGithubFolderFiles.querySelectorAll( "#GFFdivGallery" + GFF.index )[ 0 ];
	//console.log( 'divGallery', divGallery );

	divGallery.innerHTML = htm;

	//console.log( 'files', GFF.files );

};



GFF.init();