
const MNU = {};

MNU.init = function () {


	if ( window.innerWidth < 640 || window.innerHeight < 500 ) {

	} else {

		detNavMenu.open = true;

	}

	MNUdivHeader.innerHTML = `
<header>

	<h2>
		<a id=aGithub target="_top" title="Source code on GitHub">
			<img src="../../../lib/assets/icons/mark-github.svg">
		</a>

		<a href="" title="Click to reload this page">
			<span id=spnTitle>Basic Viewer</span>
			<span id=spnVersion></span>
		</a>
		&nbsp;
		<span class="info">
			<img class=infoImg src="../../../lib/assets/icons/noun_Information_585560.svg">
			<span id="spnDescription" class="infoTooltip gmd-5">
			</span>
		</span>

	</h2>

</header>`;


	MNUdivFooter.innerHTML = `
<footer>

	<center>
		<a class=aDingbat id=aMenuIcon href="href=javascript:sumNavMenu.scrollIntoView();" title="Scroll to top" >❦</a>
	</center>

</footer>`;


};