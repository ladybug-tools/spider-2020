
const source = "https://github.com/ladybug-tools/spider-2020/tree/master/spider-template-viewer/";

const version = "v-2020-07-10";

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
	
	JTV.init();
	
	HRT.init()

};





function toggleDarkMode( button ) {

	if ( butDark.innerHTML === "dark" ) {

		//root.style.backgroundColor = "#1e1f23";
		document.body.style.color = "#aaa";
		navMenu.style.backgroundColor = "#555";

		THR.scene.background = new THREE.Color(0x222222);
		THR.scene.fog.far = 999999; 

		//const summaries = document.querySelectorAll(".summary-secondary");
		//console.log( "", summaries );

		Array.from( document.querySelectorAll("a") )
		.forEach( a => a.style.color = "#ccc" );

		Array.from( document.querySelectorAll("input,select,option") )
		.forEach( iso => iso.style.backgroundColor = "#bbb" );

		document.documentElement.style.setProperty("--color-2-background", "#888");
		Array.from( document.querySelectorAll(".summary-primary") )
		.forEach( sum => sum.style.backgroundColor = "#888" );
		
		document.documentElement.style.setProperty("--color-3-background", "#bbb");
		Array.from( document.querySelectorAll(".summary-secondary") )
		.forEach( sum => sum.style.backgroundColor = "#bbb" );


		divPopUp.style.backgroundColor = "#333";

		butDark.innerHTML = "light";          

		return;

	} 

	
	//root.style.backgroundColor = "#1e1f23";
	document.body.style.color = "teal";
	navMenu.style.backgroundColor = "#fafffa";

	THR.scene.background = new THREE.Color(0xcce0ff);
	THR.scene.fog.far = THR.radius * 8;

	const summaries = document.querySelectorAll(".summary-primary");
	Array.from( summaries ).forEach( sum => sum.style.backgroundColor = "#eee" );

	divPopUp.style.backgroundColor = "#eee";

	butDark.innerHTML = "dark";

};
