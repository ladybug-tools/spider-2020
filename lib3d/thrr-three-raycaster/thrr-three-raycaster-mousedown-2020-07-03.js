////////// Interacting between DOM and 3D

/* global renderer, divPopUp */

const THRR = {
	// three.js mouse interaction with scene

	raycaster: new THREE.Raycaster(),
	mouse: new THREE.Vector2(),
	intersectObjects: [],
};


THRR.updateScene = function () {

	THRR.intersectObjects = THR.group.children;

	THRR.addMouseDown();

};

THRR.addMouseDown = function () {
	renderer.domElement.addEventListener("mousedown", THRR.onMouseDown);
	renderer.domElement.addEventListener("touchstart", THRR.onMouseDown);
	renderer.domElement.addEventListener("touchmove", THRR.onMouseDown);

	//divInfo.innerHTML = "";
};

THRR.onMouseDown = function (event) {
	if (event.type === "touchmove" || event.type === "touchstart") {
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
	}

	THRR.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	THRR.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	THRR.raycaster.setFromCamera(THRR.mouse, camera);

	let intersects = THRR.raycaster.intersectObjects(THRR.intersectObjects);

	//console.log( "int", intersects );

	if (intersects.length) {
		THRR.intersected = intersects[0];

		//if ( intersected.instanceId ) {
		//console.log( "intersected", THRR.intersected );

		divPopUp.hidden = false;
		divPopUp.style.left = event.clientX + 0 + "px";
		divPopUp.style.top = event.clientY + "px";
		divPopUp.innerHTML = THRR.getHtm(THRR.intersected);

		renderer.domElement.addEventListener("click", THRR.onClick);

		//}
	} else {
		if (["touchstart", "touchmove", "mousedown"].includes(event.type)) {
			divPopUp.hidden = true;
		}

		THRR.intersected = undefined;
	}
};

THRR.onClick = function () {
	if (!THRR.intersected) {
		divPopUp.hidden = true;
	}

	renderer.domElement.removeEventListener("click", THRR.onClick);
};

THRR.getHtm = function (intersected) {
	//const htm = JSON.stringify( intersected.object, null, "<br>" ).slice( 1, - 1 ).replace( /[",]/g, "");

	const htm = JSON.stringify(intersected.object, null, "\t").replace(/[",]/g, "");

	// htm = `
	// 	<a href="https://en.wikipedia.org/wiki/${ name }" target="_blank">${ name }</a><br>
	// 	${ ( + country[ 6 ] ).toLocaleString() } people
	// 	`;

	return htm;
};

THRR.getHtm = function (intersected) {
	console.log("intersected", THRR.intersected);
	const mesh = THRR.intersected.object;

	const htm = `
	<div>
		id: ${THR.group.children.indexOf( mesh ) }<br>
		geometry: ${ mesh.geometry.type }<br>
		name: ${ mesh.name }</br>
		uuid: ${mesh.uuid}<br>
		<button onclick=THRR.getMeshData(${THR.group.children.indexOf( mesh )}); >view mesh data</button>
	</div>`;

	return htm;
};

THRR.getMeshData = function (index) {

	console.log( "index", index );

	JTV.init();

	JTV.onLoad( index );

	detNavMenu.open = true;
	detData.open = true;

};
