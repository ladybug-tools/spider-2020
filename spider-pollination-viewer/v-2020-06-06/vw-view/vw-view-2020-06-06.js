
const VW = {};

VW.colors = {

    Wall: "beige",
    Floor: "brown",
    RoofCeiling: "red",
    AirBoundary: "blue"

};

VW.init = function() {

    const htm = `
    <p>
        Select surface types to view. Use cursor keys to scroll through the list.<br>

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

    PHJ.group.children.forEach( mesh =>  mesh.visible = mesh.userData.type === type );

}; 

VW.setAllVisible = function() {

    PHJ.group.children.forEach( mesh => mesh.visible = true );

}