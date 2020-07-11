
const VW = {};


VW.colors = {
	ceiling: 0xff8080,
	door: 0x00f0000,
	floor: 0x40b4ff,
	glassdoor: 0x8888ff,
	wall: 0xffb400,
	roof: 0x800000,
	window: 0x444444,
	undefined: 0x88888888
};

VW.init = function() {

    const htm = `
    <p>
        Select surface types to view. Use cursor keys to scroll through the list.<br>
    </p>
    <p>
        <select id=selPanel oninput=VW.showPanel(this.value); size=10>${ VW.getTypes() }</select>
    </p>
    <p>
        <button onclick="VW.setAllVisible();" title="Show all surfaces">&sdotb; all visible</button>
    </p>`;

    return htm;
}


VW.getTypes = function() {

    //VW.meshTypes = GBX.surfaces.map( surface => surface.match( /surfaceType="(.*?)"/ )[ 1 ] );

    VW.meshTypes = Object.keys( VW.colors );

    VW.types = [...new Set( VW.meshTypes )];

    //console.log( "types", VW.types );

    const options = VW.types.map( type => `<option>${ type }</option>`)

    return options

};


VW.showPanel = function( type) {

    THR.group.children.forEach( mesh =>  mesh.visible = mesh.userData.type === type );

}; 

VW.setAllVisible = function() {

    THR.group.children.forEach( mesh => mesh.visible = true );

};