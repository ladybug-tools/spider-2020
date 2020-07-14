// https://davidwalsh.name/convert-xml-json
// with see tjumyk comment additions 
// https://davidwalsh.name/convert-xml-json#comment-50753

const XTJ = {};


// Changes XML to JSON
XTJ.xmlToJson = function (xml) {
	// Create the return object
	let obj = {};

	if (xml.nodeType === 1) {
		// element
		// do attributes
		if (xml.attributes.length > 0) {
			obj["@attributes"] = {};
			for (let j = 0; j < xml.attributes.length; j++) {
				const attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) {
		// text
		obj = xml.nodeValue.trim();
	}

    // do children

	if (xml.hasChildNodes()) {
		for (let i = 0; i < xml.childNodes.length; i++) {
			const item = xml.childNodes.item(i);
			const nodeName = item.nodeName;
			if (typeof obj[nodeName] === "undefined") {
                const tmp = XTJ.xmlToJson(item);
                if(tmp !== "") // if not empty string
					obj[nodeName] = tmp;
			} else {
				if (typeof obj[nodeName].push === "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(XTJ.xmlToJson(item));
			}
		}
	}
	return obj;
};

XTJ.init = function() {

	if ( !JTV.json ) {
		
		const xmlNode = new DOMParser().parseFromString( FOO.string, "text/xml");
		json = XTJ.xmlToJson(xmlNode);
	
		JTV.json = json.gbXML;
	
		divPopUp.innerHTML = "gbXML parsed to JSON successfully!";
	
		JTVdivJsonTree.innerHTML = JTV.parseJson( JTV.root, JTV.json, 0 );
	
		JTV.details = JTVdivJsonTree.querySelectorAll( "details" );
	
		JTV.details[ 0 ].open = true;
	
	}
} 