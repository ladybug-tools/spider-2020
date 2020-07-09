
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";

const version = "v-2020-07-09";

const description = document.head.querySelector( "[ name=description ]" ).content;

//const urlDefault = "README.md";

function init() {

	aGithub.href = source;

	spnVersion.innerHTML = version;

	divDescription.innerHTML = description;


	THR.init();
	
	THR.animate();

	THR.addLights();

	THR.addGround();

	THR.group = THR.setSceneNew();

	THRU.addMeshes(100);

	THR.updateScene();

	THRR.updateScene();

	FOO.init();

	HRT.init()

};

