// copyright 2020 Theo Armour. MIT license.
// See pushme-pullyou/templates-01/modules/template
// 2020-02-26
/* divContent */
// jshint esversion: 6
// jshint loopfunc: true


const THRF = {};



THRF.init = function () {

	THRFdivThreeFog.innerHTML = THRF.getMenu();

	//window.addEventListener( "onloadthree", THRF.onLoad, false );

};


THRF.onLoad = function () {

	THRF.toggleFog();

};


THRF.getMenu = function () {

	const htm = `
<details id=THRFdetFog >

	<summary>

		Scene fog and background

		<span class="couponcode"> ?? <span class="coupontooltip">Fog that grows linearly denser with the distance.</span></span>

	</summary>

	<p>
		<label>
			<input type="color" value="#ff00ff" id="THRFinpColorBackground"
				oninput="THR.scene.background=THR.scene.fog.color=( new THREE.Color(this.value));" >
			Select background color
		</label>
	</p>
	<p>
		<label title="Can you see me now!" >
			<input type=checkbox onchange=THRF.toggleFog() checked> fog
		</label>
	</p>

	<div id=THRFdivMessage ></div>

</details>`;

	return htm;

};



THRF.toggleFog = function () {

	//THR.scene.fog = new THREE.Fog( 0x000000, 30, 50 );
	THR.scene.fog.near = THR.scene.fog.near === 3 * THR.radius ? 999 : 2 * THR.radius;
	THR.scene.fog.far = THR.scene.fog.far === 8 * THR.radius ? 9999 : 8 * THR.radius;

};


THRF.init();