
const FRA = {};


FRA.init = function () {

    window.addEventListener("hashchange", FRA.onHashChange);

}


FRA.onHashChange = function() {

	if ( location.hash.toLowerCase().endsWith( "xml" ) === false ) { return; }
    //console.log( 'hash', location.hash );
    
	timeStart = performance.now();

	url = parent.location.hash.slice(1);

	FO.requestFile(url, FRA.onLoadXml);
}


FRA.onLoadXml = function (response) {
	//console.log( 'response', response );

	GBX.meshGroup = THR.setSceneNew();
	GBX.meshGroup.name = "GBX.meshGroup";

	GBX.parseResponse(response);

	THR.updateGroup(GBX.meshGroup); 

	divLog.innerHTML = `
	<p>
	File name: ${ url.split( "/" ).pop() }<br>
	File size:  ${ response.length.toLocaleString() }<br>
	Time to load: ${(
		(performance.now() - timeStart) /
		1000
	).toLocaleString()} seconds<br>

	</p>`;
}