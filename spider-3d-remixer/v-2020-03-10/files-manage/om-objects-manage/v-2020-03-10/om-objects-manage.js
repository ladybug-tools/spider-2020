// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-03-10
/* globals divContent */
// jshint esversion: 6
// jshint loopfunc: true


const OM = {};



OM.init = function () {

	OMdivObjectsManage.innerHTML = OM.getMenu();

	OM.reset();



};


OM.reset = function () {

	OM.objects = [];
	OMselObjects.innerHTML = "";

};



OM.getMenu = function () {

	const htm = `
<details id=OMdet >

	<summary class="sumMenuTertiary" title="om-objects-manage.js" >

		File manage objects

		<span class="couponcode">??<span class="coupontooltip">select and edit objects</span></span>

	</summary>

	<p><select id=OMselObjects oninput=OM.selectObject() size=10 style=width:100%; ></select></p>

	<p><button onclick=OM.getObjectsData(); >get objects data</button></p>

	<div id=OMdivMessage ></div>

	<p><button onclick=OM.saveFile() >save file</button></p>

	<p><button onclick=OM.requestFile("composition-3d-01.json") >open composition-3d.json</button></p>


</details>`;

	return htm;

};


OM.selectObject = function () {

	console.log( 'OMselObjects', OMselObjects.value );

};


OM.getObjectsData = function () {

	const gbx = THR.group.getObjectByName( "gbx" );

	const objText = OM.objects.map( obj =>
		`{ "url": "${ obj.userData.url }", "fileName: "${ obj.name }", "px": "${ obj.position.x }", "py": "${ obj.position.y }", "pz": "${ obj.position.z }", "rx": "${ obj.rotation.x }", "ry": "${ obj.rotation.y }", "rz": "${ obj.rotation.z }", "sx": "${ obj.scale.x }", "sy": "${ obj.scale.y }", "sz": "${ obj.scale.z }" }\n` ) .join( "" );


	const txt = `${ objText }`;

	OMdivMessage.innerText = txt;

};



OM.saveFile = function () {

	let blob = new Blob( [ OMdivMessage.innerText ] );
	let a = document.body.appendChild( document.createElement( 'a' ) );
	a.href = window.URL.createObjectURL( blob );
	a.download = 'composition-3d.json';
	a.click();
	//delete a;
	a = null;

};




OM.init();