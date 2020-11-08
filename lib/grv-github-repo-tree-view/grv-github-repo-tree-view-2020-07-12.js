const GRV = {};

// GRV.urlApi = "https://api.github.com/repos/ladybug-tools/spider-2020/git/trees/master?recursive=1";
// GRV.urlSource = "https://github.com/ladybug-tools/spider-2020/tree/master/";
// GRV.urlViewer = "https://www.ladybug.tools/spider-2020/";

GRV.urlApi = "https://api.github.com/repos/theo-armour/2020/git/trees/master?recursive=1";
GRV.urlSource = "https://github.com/theo-armour/2020/tree/master/";
GRV.urlViewer = "https://theo-armour.github.io/2020/";


GRV.iconOctoCat = `<img width=14 src="${ GRV.urlViewer }assets/icons/octicon.svg">`;

GRV.link = `<img width=14 src="${ GRV.urlViewer }assets/icons/icon-link-external.svg">`;


GRV.init = function() {
	
	GRV.requestFile( GRV.urlApi, GRV.onLoadTree );

}


GRV.requestFile = function( url = "https://example.com" , callback = onLoad ) {

	const xhr = new XMLHttpRequest();
	xhr.open( "GET", url, true );
	xhr.responseType = "json";
	xhr.onerror = ( xhr ) => console.log( "error:", xhr  );
	//xhr.onprogress = ( xhr ) => console.log( "bytes loaded:", xhr.loaded );
	xhr.onload = ( xhr ) => callback( xhr.target.response );
	xhr.send( null );

};


GRV.onLoadTree = function (json) {
	//console.log( "json", json );

	const tree = json.tree.slice();

	const subtrees = tree.filter(obj => obj.type === "tree").map(subtree => subtree.path.split("/"));
	//console.log( "subtrees", subtrees );

	const files = tree.filter(obj => obj.type === "blob").map(subtree => subtree.path);
	//console.log( "files", files );

	const htm = GRV.subtreesToDetails(subtrees, files);

	const filesRoot = files
		.filter(file => !file.includes("/"))
		.map( ( item, i ) => `
		<div class=GRVdiv >
			<a href="${ GRV.urlSource }${item}"  title="Source code on GitHub. Edit me!" >
			${ GRV.iconOctoCat }</a>
			${ i + 1 } <a href="#${item}" >${item.split("/").pop()}</a>
			<a href="${ GRV.urlViewer }${item}"title="Link to just this file. Open file in new tab."  target="_blank" >${ GRV.link }</a>
		</div>`);

	GRVdivGitHubRepoTreeView.innerHTML = filesRoot.join("") + htm.join("");

	window.addEventListener("hashchange", GRV.onHashChange, false);

	GRV.onHashChange();
};

GRV.onHashChange = function () {
	if (!GRV.links) {
		GRV.links = Array.from(GRVdivGitHubRepoTreeView.querySelectorAll("a"));
	}

	GRV.links.forEach(link => link.parentNode.classList.remove("highlight"));

	const str = location.hash ? location.hash.slice(1) : "README.md";

	item = GRV.links.find(a => a.getAttribute("href").includes(str));
	//console.log("item", item);

	item.parentNode.classList.add("highlight");

	item.parentNode.parentNode.open = true;

	item.parentNode.parentNode.parentNode.open = true;

	item.scrollIntoView();
};

GRV.subtreesToDetails = function (subtrees, files) {
	let lengthSlicePrevious = 0;

	const htmArr = subtrees.map((subtree, index) => {
		//let closer = "</details>";
		let closer = "";

		const subtreeTitle = subtree.slice(-1);
		const subtreeSlice = subtree.slice(0, -1);
		const subtreeSliceJson = JSON.stringify(subtreeSlice);

		if (subtreeSlice.length === lengthSlicePrevious) {
			closer = "</details>";
			//console.log( "len same", subtreeSlice   );
		}

		if (subtreeSlice.length < lengthSlicePrevious) {
			const diff = lengthSlicePrevious - subtreeSlice.length + 1;
			closer = Array(diff).fill("</details>").join("");
			//console.log( "len shorter", subtreeTitle, diff, subtreeSlice, subtreeSlice.length, lengthSlicePrevious );
		}

		lengthSlicePrevious = subtreeSlice.length;

		const filesHtm = GRV.getFiles(subtree, files);

		return `
		${closer}
		<details class="GRVdet" >
			<summary class="GRVsum" >${subtreeTitle}</summary>
			${filesHtm.join("")}
		`;
	});

	//console.log( "htmArr", htmArr );

	return htmArr;
};

GRV.getFiles = function (subtree, files) {
	const str = subtree.join("/");


	const filtered = files
		.filter(file => file.slice(0, file.lastIndexOf("/")) === str)
		.map(item => `
		<div>
			<a href="${ GRV.urlSource }${item}" title="Source code on GitHub" >
      ${ GRV.iconOctoCat }</a>
			<a href="#${item}" title="">${item.split("/").pop()}</a>
			<a href="${ GRV.urlViewer}${item}" title="Open file in new tab"  target="_blank" >
			${ GRV.link }</a>
		</div>`);

	return filtered;
};
