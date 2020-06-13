
const FOT = {};

FOT.extension = "xml";

FOT.init = function () {

    window.addEventListener("hashchange", FOT.onHashChange);

};


FOT.onHashChange = function() {

	if ( location.hash.toLowerCase().endsWith( FOT.extension ) === false ) { return; }
    //console.log( 'hash', location.hash );
    
	FO.timeStart = performance.now();

	FO.url = parent.location.hash.slice(1);

	FO.requestFile(FO.url, FOT.onLoadText);
}


