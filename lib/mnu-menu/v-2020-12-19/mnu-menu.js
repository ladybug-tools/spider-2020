
const MNU = {}

MNU.init = function () {


	if ( window.innerWidth < 640 || window.innerHeight < 500 ) {

	} else {

		detNavMenu.open = true;

	}

}

MNU.navMenuHeader = `

	<details id=detNavMenu class="gmd-4">

		<summary id=sumNavMenu class="summary-secondary gmd-1">show || hide menu</summary>

		<nav id="navMenu" class="gmd-2">

			<header>

				<h2>
					<a id=aGithub target="_top" title="Source code on GitHub">
						<img src="../../lib/assets/icons/mark-github.svg">
					</a>

					<a href="" title="Click to reload this page">
						Basic Viewer
						<span id=spnVersion></span>
					</a>
					&nbsp;
					<span class="info">
						<img class=infoImg src="../../lib/assets/icons/noun_Information_585560.svg">
						<span id="divDescription" class="infoTooltip gmd-5">
						</span>
					</span>

				</h2>

			</header>`;

			

MNU.navMenuFooter = `
			<center>
				<a id=aMenuFooter href="javascript:navMenu.scrollTo(0,0);">a</a>
			</center>

		</nav>

	</details>`;

