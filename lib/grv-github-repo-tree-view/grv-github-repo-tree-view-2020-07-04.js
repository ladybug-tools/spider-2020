const GRV = {};

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
		.map(item => `<div><a href="#${item}" >${item.split("/").pop()}</a></div>`);

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
		<details style="margin: 0 0 0 1rem;" >
			<summary>${subtreeTitle}</summary>
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
		.map(item => `<div><a href="#${item}" >${item.split("/").pop()}</a></div>`);

	return filtered;
};
