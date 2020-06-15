<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://ladybug.tools/spider-2020/spider-idf-viewer/readme.html "View file as a web page." ) </span>

<div><input type=button class = 'btn btn-secondary btn-sm' onclick=window.location.href="https://github.com/ladybug-tools/spider-2020/tree/master/spider-idf-viewer/";
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [Spider IDF Viewer Read Me]( ./readme.html )

<!--@@@
<iframe src=./index.html width=100% height=500px ></iframe>
_Spider IDF Viewer _
@@@-->

### Full Screen: [Spider IDF Viewer]( https://www.ladybug.tools/spider-2020/spider-idf-viewer/ )


<details open >
<summary>Concept</summary>

### Spider IDF Viewer

The script enables you to open [EnergyPlus]( https://energyplus.net ) Input Data Files (IDF) from your computer or via a URL. Ths script locates all surfaces and windows data and displays them in 3D in your browser.

* You can rotate, zoom and pan the model by clicking or touching it
* Clicking on a surface allow you to display data for the surface
* Sample files menu allows you to load hundreds of EnergyPlus demo files


### [EnergyPlus]( https://energyplus.net/ )

> EnergyPlus is a whole building energy simulation program that engineers, architects, and researchers use to model both energy consumption—for heating, cooling, ventilation, lighting and plug and process loads—and water use in buildings. 

### Input Data File (IDF) format

* https://energyplus.net/quickstart
* https://bigladdersoftware.com/epx/docs/8-2/getting-started/energyplus-file-extensions.html#idf
> The input data file (IDF) is an ASCII file containing the data describing the building and HVAC system to be simulated. Many example files are installed as part of the EnergyPlus installation. Additionally, a spreadsheet file “ExampleFiles.xls” contains columnar descriptions of each file’s features.

</details>

<details open >
<summary>To do and wish list </summary>

* 2020-06-08 ~ Theo ~ add surfaces for "Shading:Fin", "Shading:Site" and "Shading:Building" parameters

</details>

<details open >
<summary>Issues </summary>

* May have issues with unzipping non-UTF-8 files
* Only displays data with X, Y and Z coordinates

</details>

<details open >
<summary>Links of interest</summary>

Ladybug Tools Forum

* https://discourse.ladybug.tools/t/spider-idf-viewer-alpha-release/10062

NREL

* https://www.energyplus.net/

Sample Files

* https://github.com/NREL/EnergyPlus/tree/develop/testfiles
    * Current
* https://www.energy.gov/eere/buildings/commercial-reference-buildings
    * From 2012

Others

* https://beopt.nrel.gov/

</details>

<details open >
<summary>Change log </summary>

_See version folders for detailed change logs_

### 2020-06-12 ~ Theo

* Moved to root folder

### 2020-06-08 ~ Theo

* Fix PopUp issues
* Add sample file file credits
* Fix a number of surface color issues
* Fix loading in iframe location hash no show
* Add working view menu - select visible by surface type


### 2020-06-07

* First commit

</details>

***

<center title="hello! Click me to go up to the top" ><a href=javascript:window.scrollTo(0,0); > <img width=24 src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" > </a></center>

