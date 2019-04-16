/*
    List of the different planets.
    Each planet has a z-coordinate which is used as the teacher offset in the big Solar System.
    This ensures that when the teacher moves to a planet she/he will always appear on the left
    side of the planet.
*/
var planetList = {
  Neptune: {z: 105720.00},
  Uranus:  {z: 67559.15},
  Saturn:  {z: 33725.88},
  Jupiter: {z: 18316.25},
  Mars:    {z: 5361.49},
  Earth:   {z: 3520.14},
  Venus:   {z: 2546.47},
  Mercury: {z: 1363.33},
  Sun:     {z: 34.22},
}
//var position = null;
var planetPanelPosition = null;
var planetPanelObject = null;

//------------------------------------------- Planet assets -------------------------------------------
//
//    The planet assets are the planets .obj file and the corresponding .mtl file.
//    There is a uniform format for accessing these assets which is:
//      * obj = assets/PLANET_TO_BE_LOADED/PLANET.obj
//      * mtl = assets/PLANET_TO_BE_LOADED/PLANET.mtl
//
//-----------------------------------------------------------------------------------------------------

/*
    Function to load the different assets for each planet.
    These assets are the planets .obj file and the according .mtl file.
    @param planet:  planet that needs to be loaded
    @param scene:   scene to which the asset needs to be appended
    @param assets:  a-assets tag
*/
function loadPlanetAssets(planet, scene, assets){
    if(!assets){
      assets = document.createElement('a-assets');
      console.log("create a-assets");
      scene.appendChild(assets);
    }

    var planetObject = document.createElement('a-asset-item');
    planetObject.setAttribute('id', planet);
    planetObject.setAttribute('src', 'assets/' + planet + '/' + planet + '.obj');
    assets.appendChild(planetObject);

    var planetMaterial = document.createElement('a-asset-item');
    planetMaterial.setAttribute('id', planet + '_material');
    planetMaterial.setAttribute('src', 'assets/' + planet + '/' + planet + '.mtl');
    assets.appendChild(planetMaterial);
}

/*
    Function to remove the different assets for each planet.
    @param planet: planet that needs to be removed
*/
function removePlanetAssets(planet){
      var planetObj = document.querySelector('#' + planet);
      var planetMaterial = document.querySelector('#' + planet + '_material');

      if(planetObj)
        planetObj.parentNode.removeChild(planetObj);
      if(planetMaterial)
        planetMaterial.parentNode.removeChild(planetMaterial);
}

//------------------------------------------- Planet panel -------------------------------------------
//
//  A panel on which images of the different planets of the Solar System are visible.
//  When the teacher clicks on one of those images (s)he will be teleported to the corresponding planet.
//  Once teleported the planet will be visible on the right-hand side of the teacher.
//  This panel is only available in the big Solar System. In the small Solar System the teacher can
//  teleport by using the VR pointing device.
//
//-----------------------------------------------------------------------------------------------------
/*
    Function to add a planet, in the form of a clickable image, to the planet panel.
    @param planet:        planet for which a clickable image needs to be added to the planet panel
    @param parentEntity:  planet panel
*/
function addToPlanetPanel(planet, parentEntity){
  var planetLink = document.createElement('a-entity');
  planetLink.setAttribute('id', planet + '-template');
  planetLink.setAttribute('template', {src: 'templates/student/student-panel.template'});
  planetLink.setAttribute('data-src', planet);
  planetLink.setAttribute('data-thumb', "pictures/solarsystem/"+planet+".jpg");
  planetLink.addEventListener('click', function(){moveToPlanet(planet)});
  parentEntity.appendChild(planetLink);
}
/*
    Function to remove a planet from the planet panel.
    @param planet:  planet whose clickable image needs to be removed from the planet panel
*/
function removeFromPlanetPanel(planet){
  var planetLink = document.querySelector('#' + planet + '-template');
  if(planetLink)
    planetLink.parentNode.removeChild(planetLink);
}

/*
    Function to create the planet panel.
    @param parentEntity:  scene to which the planet panel needs to be added
*/
function createPlanetPanel(parentEntity){
  var panel = document.createElement('a-entity');
  panel.setAttribute('id', "planet-panel");
  panel.setAttribute('layout', {type: 'line', margin: 0.55});
  panel.setAttribute('position', {x: 2, y: 1, z: planetList["Earth"].z+1});
  panel.setAttribute('rotation', {x: -45, y: 90, z: 0});
  panel.setAttribute('scale', {x: 0.5, y: 0.5, z: 0.5});
  parentEntity.appendChild(panel);

  for (var planet in planetList){
      addToPlanetPanel(planet, panel);
  }
}

/*
    Function to remove the planet panel from the current scene.
*/
function removePlanetPanel(){
  for (var planet in planetList){
    removeFromPlanetPanel(planet);
  }

  var panel = document.querySelector('#planet-panel');
  if(panel)
    panel.parentNode.removeChild(panel);
}

//------------------------------------------- Move To planet -------------------------------------------
//
//    When the teacher clicks on one of the planets represented in the planet panel (s)he
//    needs to be teleported to a new location close to the selected planet.
//
//-------------------------------------------------------------------------------------------------------
/*
      Function to move the teacher close to the selected planet.
      @param planet:  planet to which the teacher needs to be teleported
*/
function moveToPlanet(planet){
  teacherLocation.z = planetList[planet].z;
  planetPanelPosition.z = planetList[planet].z+1;
  moveTeacherPanels(null);
}

//------------------------------------------- Solarsystem component -------------------------------------------
AFRAME.registerComponent('solarsystem', {
  schema: {
    system      : {type: 'string', default: "big"},
    teacher     : {type: 'boolean', default: false}
  },

  init: function () {
    if(this.data.system == "big" && this.data.teacher){
      createPlanetPanel(this.el.sceneEl);
      planetPanelPosition = document.querySelector('#planet-panel').object3D.position;
      planetPanelObject   = document.querySelector('#planet-panel').object3D;
    }

    this.el.sceneEl.object3D.background = new THREE.Color( 0x000000 );

    for(planet in planetList){
        loadPlanetAssets(planet, this.el.sceneEl, document.querySelector('a-assets'));
    }

  },

  update: function(){
    if(this.data.system == 'big' && this.data.teacher){
        createPlanetPanel(this.el.sceneEl);
        planetPanelPosition = document.querySelector('#planet-panel').object3D.position;
    }
    else if(this.data.system == 'small' && this.data.teacher)
      removePlanetPanel();
  },

  remove: function(){
      if(this.data.system == 'big' && this.data.teacher)
        removePlanetPanel();

      for( var planet in planetList){
        removePlanetAssets(planet);
      }
  }
});
