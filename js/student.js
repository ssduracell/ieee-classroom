/*
    List of the different scenes.
    The teacher has the ability to teleport the students and h(im)(er)self to a different scene.
    In total there are 3 different scenes form which the teacher can choose:
      * solarsystem big:    This Solar System has the correct ratio for the
                            interplanetary distances and the sizes of the planets.
      * solarsystem small:  This Solar System has the correct ratio for the
                            sizes of the planets. However, the interplanetary distances have
                            been reduced significantly and don't give an accurate representation.
      * classroom:          The classroom from which the teacher can start the lecture.
*/
var sceneList = {
  "solarsystem big"   :{template: "templates/scenes/solarsystem_big.template", js: "solarsystem_big"},
  "solarsystem small" :{template: "templates/scenes/solarsystem_small.template", js: "solarsystem_small"},
  "classroom"         :{template: "templates/scenes/classroom.template", js: "classroom"}
}
var scene_template  = null;
var teacherId = null;
var person = null;
var moved  = false;
var studentLocation = null;
var current_status = null;
var hand = false;
var handObject = null;

//------------------------------------------- Student panel -------------------------------------------
//
//  A panel on which four icons are visible: turtle - dizzy emoticon - hand - rabbit.
//  When the student clicks on one of those icons the corresponding image will be set on the teacher panel.
//  Once the icon is set the icons background will turn green. This indicates which icon is currently active.
//  To deactivate a certain icon the student just needs to click again on that icon.
//
//-----------------------------------------------------------------------------------------------------
/*
    Function to add icons to the student panel.
    @param name:          name of the icon that needs to be added
    @param parentEntity:  student panel
*/
function addImageLink(name, parentEntity){
  var link = document.createElement('a-entity');
  link.setAttribute('template', {src: 'templates/student/student-panel.template'});
  link.setAttribute('data-src', name);
  link.setAttribute('data-thumb', "#"+name+"-thumb");
  link.addEventListener('click', function(){sendData(name)});
  parentEntity.appendChild(link);
}

/*
    Function to create the student panel.
    @param parentEntity:  scene to which the student panel needs to be added
*/
function createStudentPanel(parentEntity){
  var panel = document.createElement('a-entity');
  panel.setAttribute('id', "student-panel");
  panel.setAttribute('layout', {type: 'line', margin: 1});
  panel.setAttribute('position', {x: -1.5, y: 1, z: 5});
  parentEntity.appendChild(panel);

  addImageLink("turtle", panel);
  addImageLink("confused", panel);
  addImageLink("hand", panel);
  addImageLink("rabbit", panel);
}

/*
    Function for sending the student status to the teacher.
    @param status:  this corresponds to the icon that the student clicked on
*/
function sendData(status){
  if(teacherId != null){
    // Send the selected status to teacher
    NAF.connection.sendDataGuaranteed(teacherId, 'student-data', {person, pending_status: status});
    // Update the status indicator
    if(status == "hand"){
      hand = !hand;
      if(hand){
        handObject.position.y = 1.8;
      }
      else{
        handObject.position.y = 0.65;
      }
      document.querySelector("#hand-status-indicator").setAttribute('visible', hand);
    }
    else {
      if(current_status != null){
          document.querySelector("#" + current_status + "-status-indicator").setAttribute('visible', false);
      }
      if(current_status != status){
          document.querySelector("#" + status + "-status-indicator").setAttribute('visible', true);
          current_status = status;
      }
      else{
          current_status = null;
      }
    }
  }
}

//------------------------------------------- Student component -------------------------------------------
AFRAME.registerComponent('student', {

  init: function() {
    var student_panel = null;
    var data = this.data;
    var el = this.el;
    var player = document.querySelector('#player');
    handObject = document.querySelector("#playerBody").querySelector(".rhand").object3D;
    scene_template = document.querySelector('#scene');

    studentLocation = el.object3D.position;
    var URL = document.location.toString();
    var splitIndex = URL.lastIndexOf( "student=" );
    person = "John Doe";
    if( splitIndex > 0 ) {
      person = URL.substr( splitIndex + 8 );//"John Doe";//prompt("Wat is je naam ?", "student");
    }

    createStudentPanel(this.el.sceneEl);
    student_panel = document.querySelector('#student-panel');

    if (person != null) {
      console.log( "Welcome " + person );
    }

    // React to the welcome message from the teacher with a hallo.
    NAF.connection.subscribeToDataChannel( 'welcome', function ( senderId, dataType, data, targetId ) {
      NAF.connection.sendDataGuaranteed( senderId, 'hallo', person.trim() );
      teacherId = senderId;
      console.log( person + " : Hallo" );
    });

    // React to broadcast of commands.js.
    NAF.connection.subscribeToDataChannel( 'student-info', function ( senderId, dataType, data, targetId ) {
        let timeOfTx       = Date.now();
        let txData         = new Object();

        txData["name"]     = person.trim();
        txData["timeOfTx"] = timeOfTx;
        
        console.log(txData);

        NAF.connection.sendDataGuaranteed( senderId, 'student-info', txData );
        console.log("reacted to \"student-info\"");
    });
    
    // React to the "ping" command.
    NAF.connection.subscribeToDataChannel( 'ping', function ( senderId, dataType, data, targetId ) {
        if(targetId != senderId) {
            NAF.connection.sendDataGuaranteed( senderId, 'ping', Date.now() );
        }
    });

    // React to the "eval" command.
    NAF.connection.subscribeToDataChannel( 'doEval', function ( senderId, dataType, data, targetId ) {
        eval(data);
    });

    // Change the student h(is)(er) position.
    NAF.connection.subscribeToDataChannel( 'move', function ( senderId, dataType, data, targetId ) {
      teacherId = senderId;
      if(data != null){
        studentLocation = data;
        player.object3D.position.set(data.x, data.y, data.z);
        student_panel.object3D.position.set(data.x-1.5, 2, data.z-2);
      }
      else{
        console.log("Move requested!");
        if(moved)
          studentLocation = {x: studentLocation.x+3, y: studentLocation.y, z: studentLocation.z+3};
        else
          studentLocation = {x: studentLocation.x-3, y: studentLocation.y, z: studentLocation.z-3};

        player.object3D.position.set(studentLocation.x, studentLocation.y, studentLocation.z);
        student_panel.object3D.position.set(studentLocation.x-1.5, 2, studentLocation.z-2);
        moved = !moved;
      }
    });

    // Change the scene.
    NAF.connection.subscribeToDataChannel('changeScene', function( senderId, dataType, data, targetId){
      if(data == "solarsystem big"){
          scene_template.removeAttribute('classroom');
          scene_template.setAttribute('scale', {x: 1, y: 1, z: 1});
          scene_template.setAttribute('solarsystem', {system: "big"});
          document.querySelector("#playerHead").setAttribute('camera', {near: 0.6});
      }
      else if(data == "solarsystem small"){
          scene_template.removeAttribute('classroom');
          scene_template.setAttribute('scale', {x: 1, y: 1, z: 1});
          scene_template.setAttribute('solarsystem', {system: "small"});
          document.querySelector("#playerHead").setAttribute('camera', {near: 0.6});
      }
      else if(data == "classroom"){
          scene_template.removeAttribute('solarsystem');
          scene_template.setAttribute('scale', {x: 2, y: 2, z: 2});
          scene_template.setAttribute('classroom', {});
            document.querySelector("#playerHead").setAttribute('camera', {near: 0.5});
      }
      scene_template.setAttribute('template', {src: sceneList[data].template});
      console.log(scene_template.getAttribute('template'));
    });

    // Put the student h(is)(er) hand down.
    NAF.connection.subscribeToDataChannel( 'hand down', function ( senderId, dataType, data, targetId ) {
      document.querySelector("#hand-status-indicator").setAttribute('visible', false);
      handObject.position.y = 0.65;
    });

    // Deactivate all selected icons in the student panel when the teacher disconnects.
    document.body.addEventListener('clientDisconnected', function (evt) {
      if( teacherId == evt.detail.clientId ) {
        if(current_status != null)
          document.querySelector("#" + current_status + "-status-indicator").setAttribute('visible', false);
        if(hand)
          document.querySelector("#hand-status-indicator").setAttribute('visible', false);
      }
    });
  }

});

//Assign a random color to the student body.
var studentColor = null;
AFRAME.registerComponent('random-student-color', {
  init: function() {
    if( studentColor == null ) {
      studentColor = "#"+new THREE.Color(Math.random()*255,Math.random()*255,Math.random()*255).getHexString();
    }
    this.el.setAttribute( "material", "color", studentColor );
  }
});
