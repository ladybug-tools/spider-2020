

// not currently used

GD = {}

GD.getMenuGetData = function() {

    // htm = 
    // `<div id=GDdivSurfaceData >
    //     <p>
    //         Selected surface data will appear here when a surface in the 3D model is clicked on or touched.
    //     </p>
    // </div>`;

    // return htm;

};

GD.getSurfaceData = function( index ){
    
    detNavMenu.open = true;
    detData.open = true;

    surfaceText = GBX.surfaces[ index ];

	const parser = new DOMParser();
	surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	console.log( "surfaceXml", surfaceXml );

	const surface = surfaceXml.getElementsByTagName("Surface")[ 0 ]; //.firstChild(); //[0].childNodes[0].nodeValue;
	console.log( "surface", surface );
    // console.log( "surfaceText", surfaceText );

    // const parser = new DOMParser();
	// const surfaceXml = parser.parseFromString( surfaceText,"text/xml");
	// //console.log( "surfaceXml", surfaceXml );

    // var xmlText = new XMLSerializer().serializeToString( surfaceXml);
    htm = surfaceText; //xmlText

    GDdivGetData.innerText = htm;
}