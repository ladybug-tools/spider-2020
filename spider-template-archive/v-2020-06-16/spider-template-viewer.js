
const version = "v-2020-06-16";

aGithub.href = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";

const description = document.head.querySelector( "[ name=description ]" ).content;

//const urlDefault = "README.md";

function init() {

	divDescription.innerHTML = description;

	aTitle.innerHTML += ` ${version}`;

	THR.init();
	THR.animate();

	THR.addLights();
	THR.addGround();

	THR.group = THR.setSceneNew( new THREE.Group() );

	THR.addMeshes(100);

	THR.updateScene();

	FOO.init();

};

