////////// Interacting between DOM and 3D

/* global renderer, divPopUp */

const RAY = {
	// three.js mouse interaction with scene

	raycaster: new THREE.Raycaster(),
	mouse: new THREE.Vector2(),
	intersectObjects: [],
};

RAY.addMouseMove = function () {
	renderer.domElement.addEventListener("mousedown", RAY.onMouseMove);
	renderer.domElement.addEventListener("touchstart", RAY.onMouseMove);
	renderer.domElement.addEventListener("touchmove", RAY.onMouseMove);

	//divInfo.innerHTML = "";
};

RAY.onMouseMove = function (event) {
	if (event.type === "touchmove" || event.type === "touchstart") {
		event.clientX = event.touches[0].clientX;
		event.clientY = event.touches[0].clientY;
	}

	RAY.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	RAY.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	RAY.raycaster.setFromCamera(RAY.mouse, camera);

	let intersects = RAY.raycaster.intersectObjects(RAY.intersectObjects);

	//console.log( "intersects", intersects );

	if (intersects.length) {
		RAY.intersected = intersects[0];

		//if ( intersected.instanceId ) {

		//console.log( "intersected", RAY.intersected );

		divPopUp.hidden = false;
		divPopUp.style.left = event.clientX + 0 + "px";
		divPopUp.style.top = event.clientY + "px";
		divPopUp.innerHTML = RAY.getHtm(RAY.intersected);

		renderer.domElement.addEventListener("click", RAY.onClick);

		//}
	} else {
		if (["touchstart", "touchmove", "mousedown"].includes(event.type)) {
			divPopUp.hidden = true;
		}

		RAY.intersected = undefined;
	}
};

RAY.onClick = function () {
	if (!RAY.intersected) {
		divPopUp.hidden = true;
	}

	renderer.domElement.removeEventListener("click", RAY.onClick);
};

RAY.getHtm = function (intersected) {
	//const htm = JSON.stringify( intersected.object, null, "<br>" ).slice( 1, - 1 ).replace( /[",]/g, "");

	const htm = JSON.stringify(intersected.object, null, "\t").replace(/[",]/g, "");

	// htm = `
	// 	<a href="https://en.wikipedia.org/wiki/${ name }" target="_blank">${ name }</a><br>
	// 	${ ( + country[ 6 ] ).toLocaleString() } people
	// 	`;

	return htm;
};

RAY.getHtm = function (intersected) {
	console.log("intersected", RAY.intersected);
	const index = RAY.intersected.object.userData.index;
	const mesh = THR.group.children[index];

	const htm = `
	<div>
		id: ${index}<br>
		uuid: ${mesh.uuid}<br>
		<button onclick=RAY.getMeshData(${index}); >view mesh data</button>

	</div>`;

	return htm;
};

RAY.getMeshData = function (index) {
	detNavMenu.open = true;
	detData.open = true;

	const mesh = THR.group.children[index];

	const htm = JSON.stringify(mesh, null, "\t").replace(/[",]/g, "");

	RAYdivMeshData.innerText = htm;
};
