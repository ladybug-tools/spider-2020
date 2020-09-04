<span style=display:none; >[You are now in a GitHub source code view - click this link to view Read Me file as a web page]( https://www.ladybug.tools/spider-2020/spider-gbxml-viewer/readme.html "View file as a web page." ) </span>

<div><input type=button onclick=window.top.location.href="https://github.com/ladybug-tools/spider-2020/tree/master/spider-gbxml-viewer/"
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# [Spider gbXML Viewer Read Me]( https://www.ladybug.tools/spider-2020/#spider-gbxml-viewer/README.md )

<!--@@@
<iframe src=https://www.ladybug.tools/spider-2020/spider-gbxml-viewer/ class=iframe-resize></iframe>
_Spider gbXML Viewer in a resizable window. One finger to rotate. Two to zoom._
@@@-->

### Full Screen: [Spider gbXML Viewer]( https://www.ladybug.tools/spider-2020/spider-gbxml-viewer/ )

* Latest stable version
* Objective 1: All the features and more of previous versions - with simpler, faster more intuitive user experience

After Objective 1 is complete

* Objective 2: Find and fix all issues of all types with just a few clicks


#### Full Screen: [Spider gbXML Viewer LT]( https://www.ladybug.tools/spider-2020/spider-gbxml-viewer-lt/ )

* Core version - no menus - very useful sample for embedding views of models in your web pages

#### Single page view [ Gallery gbXML Files]( https://www.ladybug.tools/spider-2020/spider-gbxml-viewer-lt/gallery-gbxml-files.html )

* View many models in a single web page

#### Earlier versions [Spider gbXML Archive]( https://www.ladybug.tools/spider-2020/spider-gbxml-archive/ )

* All stable versions are always available and runnable with a single click. Stick to your favorite. Or try them all!



## Concept


### The current issues / the problems to be solved


[Green Building XML (gbXML)]( https://en.wikipedia.org/wiki/Green_Building_XML ) as described by its authors:

> gbXML allows disparate 3D [building information models (BIM)]( https://en.wikipedia.org/wiki/Building_information_modeling ) and architectural/engineering analysis software to share information with each other

The current set of [BIM authoring and CAD software tools]( http://www.gbxml.org/Software_Tools_that_Support_GreenBuildingXML_gbXML ) for gbXML include various proprietary, closed-source applications that you must download and install.

GbXML being open source, it would also be nice to be able to view gbXML files in 3D in your browser with no fees and with open source code.

The Ladybug Tools/Spider gbXML Viewer scripts are first steps toward making gbXML viewers readily available.

### Mission

gbXML Viewer is a collection of modular experiments for viewing, examining and validating gbXML files in 3D in your browser.

#### General objectives

* Open and display gbXML files almost instantly
* Non-modal interface
* Fast effective insightful workflow: get things done faster
* Fully interactive 3D

#### Visualization Objectives

* Open and display any file in three seconds
	* On very large files at least some usable data should start appearing in three seconds
* Display the data in a highly attractive, accessible and informing manner
* "Meta" data such as surface types, spaces, storey and zones are vieawable with in a click or two

#### Identifying and fixing issues Objectives

* Be able to identify and fix 99% of RP-1810 issues
* Be able to display the before and after differences
* Be able to reduce the complexity of a file
* Be able to identify and fix manifold/"watertight" issues

#### Sun Path etc

* Sun path
* Draw Google maps
* Add terrain
* Add buildings


#### Vision and engineering objectives

* Help students, clients and non-AEC peeps gain access to BIM data easily, quickly and freely
* Help engineers, researchers and designers gain deeper insights into the issues of projects
* Facilitating the transfer of data between design programs and analysis programs

#### Coding objectives

* Files are no more than a few hundred lines
* Code is simple, plain-vanilla JavaScript
* Every JavaScript file has its own name space so you can quickly identify the location of variables and functions
* Every module has a descriptive read me file
* Every JavaScript file has an accompanying standalone HTML file for testing purposes
* All revisions are always available and runnable via GitHub pages with a click of a button

#### Previous releases always available to run and view in your browser

* [Spider gbXML Viewer Previous Releases]( https://www.ladybug.tools/spider/index.html#gbxml-viewer/previous-releases.md )
	* Load and run every release of the gbXML Viewer since the first commit
    * Use the release that works best for you
	* Watch the development process of a project unfold over the years


## Features

### File menu

File sources
    * Open gbXML files using your operating system dialog box
    * Open gbXML files using a [RESTful API]( https://en.wikipedia.org/wiki/Representational_state_transfer ) - [REST API Tutorial]( https://restfulapi.net/ )

File menu types
    * Open both .XML and .GBXML files ( the latter is required by the [Autodesk Viewer]( https://viewer.autodesk.com/designviews ))
    * Handle both 8-bit and 16-bit data
    * Open gbXML files inside compressed .ZIP files - asynchronously (first file only)

File menu reports
    * Provide feedback on the name of the opened file, its size, the length of time it took to load and more

To Do

* Drag and drop support
* Reload most recently loaded local file
* Display the names of all the files in a compressed folder and enable de-compressing and opening a selected file

_Following are a work-in-progress_

### Sample files gallery

* Access extensive library with dozens of samples files
* Use [GitHub Developer API]( https://developer.github.com/v3/ ) to obtain a list of files in a GitHub repo
* Read data from selected GitHub repositories, folders and files and display as links in details/summary that update location.hash
* Build menu tree view system to access the files


### View menu

* Follows standard Spider Viewer menu protocols


### Data menu

* Uses Spider JSON Tree Viewer
* Converts XML data to JSON
* Reasonably fast and produces nice-looking output
* Complete gbXML data for entire file
* All data accessible with just a few clicks
* Search the entire contents using a text string

### Quick access icons

* Select dark or light mode



## To do and wish list

* Data menu: button to highlight 3D surfaces
* Data menu: more data exposed to reduce need to click. Hover to open or view?
* View menu: add context menus to select boxes
* Footer > model icon > surface types: vertical || exposed to Sun etc
* Links from JSON to schema



## Issues

* Better timing feedback with large files and progress indicators would be nice
* gbXML parser: fix mis-triangulation
* Fix issues when toggling between light and dark mode



## Links of interest

Many previous versions of the Spider gbXML Viewer. See

* https://ladybug.tools/spider-2020/spider-gbxml-archive/
* https://ladybug.tools/spider/
* https://ladybug.tools/spider-gbxml-tools/


### gbXML Home Page

* <http://www.gbxml.org/>

> gbXML is an industry supported schema for sharing building information between disparate building design software tools.


### gbXML GitHub Presence

* <https://github.com/GreenBuildingXML>
	* <https://github.com/GreenBuildingXML/gbXML-Schema>
	* <https://github.com/GreenBuildingXML/Sample-gbXML-Files>
	* [Spider gbXML Viewer fork]( https://github.com/GreenBuildingXML/spider )

> Repositories for all things gbXML including the schema, validator source code, test cases, and a fork of the Spider gbXML Viewer


### gbXML Schema as a document

* <http://gbxml.org/schema_doc/6.01/GreenBuildingXML_Ver6.01.html>

> Schema GreenBuildingXML_Ver6.01.xsd / the core definition of gbXML in a format that is easier to read than the source code.


### More gbXML References

* <https://en.wikipedia.org/wiki/Green_Building_XML>

> The Green Building XML schema (gbXML) is an open schema developed to facilitate transfer of building data stored in Building Information Models (BIM) to engineering analysis tools. gbXML is being integrated into a range of software CAD and engineering tools and supported by leading 3D BIM vendors. gbXML is streamlined to transfer building properties to and from engineering analysis tools to reduce the interoperability issues and eliminate plan take-off time.


* <https://twitter.com/gbXML>
* The gbXML open schema helps facilitate the transfer of building properties stored in 3D building information models (BIM) to engineering analysis tools.


### DOE / NREL / OpenStudio

* [US Department of Energy]( https://www.energy.gov/ )
* [National Renewable Energy Laboratory]( https://www.nrel.gov/ )
	* The National Renewable Energy Laboratory is a national laboratory of the U.S. Department of Energy, Office of Energy Efficiency and Renewable Energy, operated by the Alliance for Sustainable Energy, LLC.
	* https://github.com/NREL
* [OpenStudio]( https://www.openstudio.net/ )
	* OpenStudio is a cross-platform collection of software tools to support whole building energy modeling using EnergyPlus and advanced daylight analysis using Radiance.
	* https://github.com/NREL/OpenStudio

### OpenStudio User Docs / Advanced Tutorials / Working with gbXML

* [OpenStudio User Documentation]( https://nrel.github.io/OpenStudio-user-documentation/ )

* [Working with gbXML]( https://nrel.github.io/OpenStudio-user-documentation/tutorials/tutorial_gbxmlimport/ )

> gbXML is an industry supported file format for sharing building information between disparate building design software tools. The OpenStudio Application can import and export gbXML files through the File->Import and File->Export menus.

NREL include a very basic version of the Spider gbXML Viewer in current releases of OpenStudio. The Ladybug Tools / Spider team is proud to be included in the project and makes best efforts to support users.

<img src="https://www.ladybug.tools/spider-gbxml-tools/images/openstudio-imported-gbxml.jpg" width=800 >

_Screen capture NREL tutorial on Spider gbXML Viewer running in OpenStudio_



### Other Spider gbXML Resources

#### [Spider gbXML Sample Files]( https://www.ladybug.tools/spider/index.html#gbxml-sample-files/README.md)

Access to gbXML files from a variety of sources either available by URL or availble to download or both

#### [Spider gbXML User Guide]( https://www.ladybug.tools/spider/gbxml-user-guide/gbxml-user-guide.html )

A work-in-progress


#### [Spider Build Well]( https://www.ladybug.tools/spider/index.html#build-well/README.md )

Create 3D building data in a variety of shapes parametrically and export in gbXML format


#### [Spider gbXML to OpenStudio Report]( https://www.ladybug.tools/spider-gbxml-tools/#gbxml-to-openstudio-report.md )


The goal of the scripts in this project is to enable you to transfer data from a CAD progran to an analysis program with as few steps of human intervention as possible.




## Change log

_see also read me files in the daily builds folders_


### 2020-07-15

* Add fork more text from older read me files
* Add Spider gbXML Viewer LT links

### 2020-05-29

* First commit of read me



***

<center title="hello! Click me to go up to the top" ><a href=javascript:window.scrollTo(0,0); > <img width=24 src="https://ladybug.tools/artwork/icons_bugs/ico/spider.ico" > </a></center>

