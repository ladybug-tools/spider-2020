let group, axesHelper, lightDirectional, cameraHelper;
let renderer, camera, controls, scene;

const THR = {

	group, axesHelper, lightDirectional, cameraHelper, renderer, camera, controls, scene

};

THR.center = new THREE.Vector3( 0, 0, 0 );
THR.radius = 50;

THR.init = function () {

	camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(-100, -100, 100);
	camera.up.set(0, 0, 1);

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xcce0ff);
	scene.fog = new THREE.Fog( 0xcce0ff, 550, 800 );
	scene.add(camera);

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	renderer.outputEncoding = THREE.sRGBEncoding;
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	
	document.body.appendChild(renderer.domElement);
	
	controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.minDistance = 1;
	controls.maxDistance = 500;
	controls.autoRotate = true;
	controls.enableDamping = true;
	controls.dampingFactor = 0.08;
	controls.enablePan = true;
	controls.autoRotateSpeed = 5;

	axesHelper = new THREE.AxesHelper(100);
	axesHelper.name = "axesHelper";
	scene.add(axesHelper);


	window.addEventListener("resize", THR.onWindowResize, false);
	window.addEventListener("orientationchange", THR.onWindowResize, false);

	window.addEventListener("keydown", THR.onStart);
	renderer.domElement.addEventListener("click", THR.onStart);
	renderer.domElement.addEventListener("touchstart", THR.onStart);
	renderer.domElement.addEventListener("touchmove", THR.onStart);
	renderer.domElement.addEventListener("touchend", THR.onStart);
	renderer.domElement.addEventListener( "wheel", THR.onStart );

	THR.camera = camera;
	THR.controls = controls;
	THR.renderer = renderer;
	THR.scene = scene;

	THR.axesHelper = axesHelper;


	let event = new Event( "onloadthree", { "bubbles": true, "cancelable": false, detail: true } );

	window.addEventListener( "onloadthree", THR.onLoad, false );

	window.dispatchEvent( event );
};

THR.onStart = function () {
	controls.autoRotate = false;

	window.removeEventListener("keydown", THR.onStart);
	renderer.domElement.removeEventListener("click", THR.onStart);
	renderer.domElement.removeEventListener("touchstart", THR.onStart);
	renderer.domElement.removeEventListener("touchmove", THR.onStart);
	renderer.domElement.removeEventListener("touchend", THR.onStart);
	renderer.domElement.removeEventListener("wheel", THR.onStart);

};

THR.zzzonLoad = function ( event ) {

	//console.log( 'event thr', event );

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew( new THREE.Group() );

	//THR.updateGroup( THR.group );

};

THR.setSceneNew = function (group = new THREE.Group()) {

	scene.remove(group);

	group = new THREE.Group();

	THR.scene.add(group);

	return group;
};

THR.updateGroup = function ( group ) {

	//console.log( "group", group );

	if ( ! group.children.length ) { return; }

	THR.zoomObjectBoundingSphere(group);

	RAY.intersectObjects = group.children;

	RAY.addMouseMove();
};

THR.zoomObjectBoundingSphere = function (obj = group) {
	//console.log( "obj", obj );

	//console.log( "obj", obj );

	let center = new THREE.Vector3(0, 0, 0);
	let radius = 50;

	const bbox = new THREE.Box3().setFromObject(obj);
	//console.log( 'bbox', bbox );

	if (bbox.max.x !== Infinity) {
		const sphere = bbox.getBoundingSphere(new THREE.Sphere());

		center = sphere.center;
		radius = sphere.radius;
		//console.log( "sphere", sphere )
	}

	controls.target.copy(center); // needed because model may be far from origin
	controls.maxDistance = 50 * radius;

	//const delta = camera.position.clone().sub(controls.target).normalize();
	//console.log( 'delta', delta );

	//position = controls.target.clone().add(delta.multiplyScalar(2 * radius));
	//console.log( 'position', position );

	//const distance = controls.target.distanceTo(camera.position);

	//camera.zoom = distance / (  * radius ) ;

	camera.position.copy(center.clone().add(new THREE.Vector3(-2 * radius, -2 * radius, 1.0 * radius)));
	camera.near = 0.001 * radius; //2 * camera.position.length();
	camera.far = 50 * radius; //2 * camera.position.length();
	camera.updateProjectionMatrix();

	THR.scene.fog.near = radius * 7;
	THR.scene.fog.far = radius * 8;

	THR.axesHelper.position.copy(center);

	THR.ground.position.set(center.x, center.y, center.z - radius);

	if ( window.HRT ) { HRT.heart.position.set( center.x, center.y, center.z - 2 * radius ); }

	if (THR.lightDirectional) {
		THR.lightDirectional.position.copy(
			center.clone().add(new THREE.Vector3( 1.5 * radius, 1.5 * radius, 1.5 * radius))
		);
		THR.lightDirectional.shadow.camera.scale.set(0.2 * radius, 0.2 * radius, 0.2 * radius);

		THR.lightDirectional.target = THR.axesHelper;

		scene.remove(cameraHelper);
		cameraHelper = new THREE.CameraHelper(THR.lightDirectional.shadow.camera);
		scene.add(cameraHelper);
	}

	let event = new Event("onresetthree", { bubbles: true, cancelable: false, detail: true });

	//window.addEventListener( "onrresetthree", doThings, false );

	// listening: or-object-rotation-xx.js
	// listening: dss-display-scene-settings-xx.js

	window.dispatchEvent(event);
};



THR.zoomToFitObject = function ( camera = THR.camera, controls = THR.controls, object = THR.group, fitOffset = 1.5 ) {

	const box = new THREE.Box3().setFromObject( object );

	//for ( const object of selection ) box.expandByObject( object );

	const size = box.getSize( new THREE.Vector3() );
	const center = box.getCenter( new THREE.Vector3() );

	const maxSize = Math.max( size.x, size.y, size.z );
	const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
	const fitWidthDistance = fitHeightDistance / camera.aspect;
	const distance = fitOffset * Math.max( fitHeightDistance, fitWidthDistance );

	const direction = controls.target.clone()
		.sub( camera.position )
		.normalize()
		.multiplyScalar( distance );

	controls.maxDistance = distance * 10;
	controls.target.copy( center );

	camera.near = distance / 100;
	camera.far = distance * 100;
	THR.camera.updateProjectionMatrix();

	THR.scene.fog.near = distance * 2;
	THR.scene.fog.far = distance * 2.5;

	THR.distance = distance;

	camera.position.copy( controls.target ).sub( direction );

	controls.update();

	let event = new Event( "onresetthree", { "bubbles": true, "cancelable": false, detail: true } );

	//window.addEventListener( "onrresetthree", doThings, false );

	window.dispatchEvent( event );

};


THR.setCameraPosition = function ( x = -100, y = -100, z = 100 ) {

	THR.camera.position.set( x, y, z );

	THR.camera.up.set( 0, 0, 1 );

	//THRVchkDelta.checked = false;
	//THR.cameraDelta = 0;

	THR.zoomToFitObject();

};


//////////

THR.addLights = function () {
	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	scene.add(new THREE.AmbientLight(0xaaaaaa));

	const pointLight = new THREE.PointLight(0xffffff, 1);
	pointLight.position.copy(camera.position);
	camera.add(pointLight);

	// lightDirectional = new THREE.DirectionalLight( 0xdffffff, 0 );
	// lightDirectional.position.set( -50, -200, 100 );
	// scene.add( lightDirectional );
};

THR.addLights = function () {
	//scene.add( new THREE.AmbientLight( 0x404040 ) );
	scene.add(new THREE.AmbientLight(0x666666));

	const pointLight = new THREE.PointLight(0xffffff, 0.2);
	pointLight.position.copy(camera.position);
	pointLight.shadow.radius = 2;
	//pointLight.castShadow = true;
	camera.add(pointLight);

	lightDirectional = new THREE.DirectionalLight(0xdffffff, 0.5);
	lightDirectional.position.set(-50, -200, 100);
	lightDirectional.castShadow = true;
	// lightDirectional.shadow.mapSize.width = 1024;
	// lightDirectional.shadow.mapSize.height = 1024;

	var d = 100;
	lightDirectional.shadow.camera.left = -d;
	lightDirectional.shadow.camera.right = d;
	lightDirectional.shadow.camera.top = d;
	lightDirectional.shadow.camera.bottom = -d;
	lightDirectional.shadow.camera.far = 500;
	scene.add(lightDirectional);

	//scene.add(new THREE.CameraHelper(lightDirectional.shadow.camera));

	THR.lightDirectional = lightDirectional;
};

THR.addGround = function (position = new THREE.Vector3(0, 0, -80)) {
	const geometry = new THREE.PlaneBufferGeometry(5000, 5000);
	geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( position.x, position.y, position.z ) );
	const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa, side: 0 });
	THR.ground = new THREE.Mesh(geometry, material);
	//THR.ground.position.copy(position);
	THR.ground.receiveShadow = true;

	scene.add(THR.ground);
};

THR.addMesh = function (size = 20) {
	// CylinderGeometry( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
	// SphereGeometry( radius, segmentsWidth, segmentsHeight, phiStart, phiLength, thetaStart, thetaLength )
	// TorusGeometry( radius, tube, radialSegments, tubularSegments, arc )

	const geometry = new THREE.BoxGeometry(size, size, size);

	// geometry.applyMatrix4( new THREE.Matrix4().makeRotationX( -0.5 * Math.PI ) );
	// geometry.applyMatrix4( new THREE.Matrix4().makeScale( 1, 1, 1 ) );
	// geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 0, 0 ) );

	//const material = new THREE.MeshNormalMaterial();
	const material = new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random(), specular: 0xffffff });
	mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;
	mesh.castShadow = true;

	return mesh;
};

THR.addMeshes = function (count = 100) {

	THR.group.add(
		...Array(count)
			.fill()
			.map(() => THR.addMesh())
	);

	THR.group.children.forEach( (mesh, i ) => {
		mesh.position.set(Math.random() * 100 - 50, Math.random() * 100 - 50, Math.random() * 100);
		mesh.rotation.set(0.2 * Math.random(), 0.2 * Math.random(), 0.2 * Math.random());
		mesh.userData.index = i;
	});
};

THR.setStats = function () {
	const script = document.head.appendChild(document.createElement("script"));
	script.onload = () => {
		const stats = new Stats();
		const statsDom = document.body.appendChild(stats.dom);
		statsDom.style.left = "";
		statsDom.style.right = "0px";
		requestAnimationFrame(function loop() {
			stats.update();
			requestAnimationFrame(loop);
		});
	};

	script.src = "https://mrdoob.github.io/stats.js/build/stats.min.js";

	const render = renderer.info.render;

	detFile.open = true;
	if (!window.divLog) {
		divLog = detFile.body.appendChild(document.createElement("div"));
	}
	divLog.innerHTML = `
<p>
Three.js renderer statistics<br>
Draw calls: ${render.calls}<br>
Triangles: ${render.triangles.toLocaleString()}<br>
</p>`;
};

THR.onWindowResize = function () {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
	//console.log( 'onWindowResize  window.innerWidth', window.innerWidth );
};

THR.animate = function () {
	requestAnimationFrame(THR.animate);
	renderer.render(scene, camera);
	controls.update();
};
