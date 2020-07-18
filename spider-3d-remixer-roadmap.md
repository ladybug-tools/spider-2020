<span style="display:none;">
  <a href="https://ladybug-tools.github.io/spider-2020/" title="View file as a web page.">You are now in a GitHub source code view - click this link to view Read Me file as a web page</a>
</span>

<div><input type=button onclick=window.top.location.href="https://github.com/ladybug-tools/spider-2020/blob/master/spider-3d-remixer-roadmap.md/"
value='You are now in a GitHub web page view - Click this button to view this read me file as source code' ></div>


# Spider 2020 Road Map

<mark>2020-07-14: This page is due for a serious update! There are many new accomplishments to discuss and new ideas arising from this progress.</mark>

# Work-in-progress: [Spider 3D Re-mixer](https://ladybug.tools/spider-2020/spider-3d-remixer/ "Architecture is frozen music")

- image from one of the dev streams in obscure repository. Remixed gbXML and OBJ files

<img style=width:100% src=https://user-images.githubusercontent.com/547626/75589643-2c840100-5a30-11ea-98ae-ad386b27d106.png >

## Concept

- Build a unified 3D model visualization and "re-mixing" platform

### For the developer

- A single app for building and testing the many issues of dealing with visualizing and analyzing multiple data formats in 3D

### For the advanced designer

- Re-mix multiple 3D models from various sources for visualizing and analyzing

### For the normal worker

- Industry- or format- or task- specific versions that are simplified subsets of the master app are spawned

## Management questions

--------------------------------------------------------------------------------

_The following are loose summaries of the objectives for the various modules_

# Sample files on Github browser

- Concept make it easy to access and view sample files of 3D model data hosted on GitHub
- Access and list of names of folders and files in GitHub repositories using GitHub API
- Sample files of the following types currently supported

  - gbXML
  - Honeybee Schema JSON
  - Dragonfly Schema
  - OBJ

- To be added: Other 3D in JSON formats"," RAD"," STL"," GLTF"," FBX and perhaps more
- Updates the browser `window.location hash` which triggers a standard JavaScript event

## Status

## Open and save files

- Open XML"," JSON"," text files
- Listen for and respond to:

  - location hash events
  - fileReader events
  - Drag and drop events
  - Fetch files if suitable name indicated location.hash text

- Provide access to the `FileReader` to open local files
- Respond to drag and drop events
- Decompress ZIP files
- Save Files to disk
- Compress and save files to disk
- Provide statistics on time to load"," file sizes"," progress indicators

# Create assemblies of 3D files

- Enables opening"," displaying and saving assemblies of all the above file types
- Enable to loading of multiple files
- Allow for URL"," position"," rotation scale and other meta data parameters for each of the files
- Load and save assemblies details in JSON lines format

# Embellish and augment the data

- Enable projects to look pretty or to look more physically accurate
- Access maps"," images"," terrain data and adjacent building data and add to assemblies
- Enable toggles between "pretty" views and physically accurate views

--------------------------------------------------------------------------------

# Solar calculator and weather data visualization

- Add Sun path"," Sun range"," analemmas and and similar visualizations
- Add access to EPW and DDY data
- Add output of useful statistics
- Read latitude and longitude as embedded in model data files

# Allow for differences and changes

Diffs

- Compare and display differences in 3D between two or more 3D data files
- Add Git or Git-like capabilities to all files
- Emit change event notifications and/or messaging
- See working demo: [gbXML diff engine](https://www.ladybug.tools/spider/cookbook/gbxml-diff-engine/v-0-01-00/gbxml-diff-engine.html)

Changes

- Allow for building changes such as openings"," roofs and shades being open or closed
- Tree foliage in summer or winter
- Temporary tents and structures

# Add colors"," bitmaps (textures)"," videos and other visual effects

- Allow for coloring"," texturing and animating any surface using data supplied by engineering apps
- Allow for saving and re-presenting such visualizations

# All access by normal people

- "Mobile first" - enable access on phone"," tablet or computer
- "Don't make me wait" - runs and displays data NOW!
- "Don't make me think" - I look at it and I know how to use it
- "Don't make me change" - Let ****me**** decide when to switch to a new upgrade

# Encourage use of data simplifications

- Pollination data"," gbXML files"," RAD files are generally simplifications of far more complicated CAD files
- The CAD files often contain large amounts of proprietary intellectual data that offices do not wish to be made public
- The simplifications may be useful in a variety of instances

  - for envisaging piping"," escape routes"," signage etc
  - Providing a level of detail small enough to be useful at city scale rendering
  - Providing a structure for AR and XR uses

# Generate new data files as parametric components

- Ability to generate objects for all supported 3D file formats parametrically
- Provide sample files of procedurally generated structures

# Seamless data access

- Provide seamless linking two way between 3D models and JSON or other source data
- Enable mouseover and click/touch interaction

# Visualization options

- Choice of cameras and camera controls including WebXR
- Generate stills and videos by algorithm
- Add `Shader` capabilities
