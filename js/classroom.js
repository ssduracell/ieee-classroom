/*
    List of the different assets needed for representing the classroom.
    Empty on initialization. Used by loadClassroomAssets() and removeClassroomAssets().
*/
var classroomAssetsList = {
  classroom:      {},
  chair:          {},
  teacherDesk:    {},
  studentTable:   {},
  wallClock:      {},
}

//------------------------------------------- Classroom assets -------------------------------------------
/*
    Function to load the different classroom assets defined in classroomAssetsList.
    @param classroomAsset:  asset that needs to be loaded
    @param scene:   scene to which the asset needs to be appended
    @param assets:  a-assets tag
*/
function loadClassroomAssets(classroomAsset, scene, assets){
    if(!assets){
      assets = document.createElement('a-assets');
      console.log("create a-assets");
      scene.appendChild(assets);
    }

    console.log("Load classroomAsset");

    var classObject = document.createElement('a-asset-item');
    classObject.setAttribute('id', classroomAsset + "_obj");
    classObject.setAttribute('src', 'assets/Classroom/' + classroomAsset + '/' + classroomAsset + '.obj');
    assets.appendChild(classObject);

    var classMaterial = document.createElement('a-asset-item');
    classMaterial.setAttribute('id', classroomAsset + "_mat");
    classMaterial.setAttribute('src', 'assets/Classroom/' + classroomAsset + '/' + classroomAsset + '.mtl');
    assets.appendChild(classMaterial);
}

/*
    Function to remove the different classroom assets defined in classroomAssetsList.
    @param classroomAsset:  asset that needs to be removed
*/
function removeClassroomAssets(classroomAsset){
      var classObj = document.querySelector('#' + classroomAsset + "_obj");
      var classMaterial = document.querySelector('#' + classroomAsset + "_mat");

      if(classObj)
        classObj.parentNode.removeChild(classObj);
      if(classMaterial)
        classMaterial.parentNode.removeChild(classMaterial);
}


//------------------------------------------- Classroom component -------------------------------------------
AFRAME.registerComponent('classroom', {

  init: function () {
    console.log("init classroom");
    for(var classroomAsset in classroomAssetsList){
        loadClassroomAssets(classroomAsset, this.el.sceneEl, document.querySelector('a-assets'));
    }

  },

  update: function(){
    console.log("update classroom");
  },

  remove: function(){
      for(var classroomAsset in classroomAssetsList){
        removeClassroomAssets(classroomAsset);
      }
  }
});
