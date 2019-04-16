/*
    List of the students. Each student has several properties which are:
      * x, z:       the x- and z-coordinate which corresponds to their position inside the classroom.
      * id:         a unique id that can be used by the teacher for communication.
      * status:     indicates if the student raised h(is)(er) hand and/or set the turtle, dizzy emoticon or rabbit.
      * connected:  indicates if the student is connected or not.
      * moved:      indicates if the student is moved outside the group to answer a question.
*/
var studentList = {
  "James":   { x: -2.40,   z: 0.35, id: null, status: null, hand: false, connected: false, moved: false },
  "Lisa" :   { x: 1.60,    z: 0.35, id: null, status: null, hand: false, connected: false, moved: false },
  "Sarah":   { x: 4.30,    z: 0.35, id: null, status: null, hand: false, connected: false, moved: false },
  "David":   { x: -3.70,   z: 2.85, id: null, status: null, hand: false, connected: false, moved: false },
  "Karen":   { x: 0.30,    z: 2.85, id: null, status: null, hand: false, connected: false, moved: false },
  "Brian":   { x: 5.60,    z: 2.85, id: null, status: null, hand: false, connected: false, moved: false },
  "Laura":   { x: 1.60,    z: 5.35, id: null, status: null, hand: false, connected: false, moved: false },
  "Jason":   { x: 4.30,    z: 5.35, id: null, status: null, hand: false, connected: false, moved: false },
  "Mark" :   { x: -2.40,   z: 7.85, id: null, status: null, hand: false, connected: false, moved: false },
  "Helen":   { x: 4.30,    z: 7.85, id: null, status: null, hand: false, connected: false, moved: false },
  defaultValue: { x: 20,    z: 20, id: null, status: null, hand: false, connected: false, moved: false  }
}
/*
    List of the different scenes.
    The teacher has the ability to teleport the class to a different scene.
    In total there are 3 different scenes form which the teacher can chose:
      * solarsystem big:    This Solar System has the correct ratio for the
                            interplanetary distances and the sizes of the planets.
      * solarsystem small:  This Solar System has the correct ratio for the
                            sizes of the planets. However, the interplanetary distances have
                            been reduced significantly and don't give an accurate representation.
      * classroom:          The classroom from which the teacher can start its lecture.
*/
var sceneList={
  "solarsystem big"   :{template: "templates/scenes/solarsystem_big.template", js: "solarsystem_big"},
  "solarsystem small" :{template: "templates/scenes/solarsystem_small.template", js: "solarsystem_small"},
  "classroom"         :{template: "templates/scenes/classroom.template", js: "classroom"}
}
var scene_template  = null;
var teacherObject   = null;
var teacherLocation = null;
var counter = 0;
var numberOfStudents  = 0;
var onstudentPanelPosition   = { x: -0.85, y: 1.6,  z: 0.001};
var studentPanelOffset       = {x: -2.5,   y: 1.2,  z: 0};
var scenePanelPosition       = {x: 0.75,   y: 1,    z: 1};
var current_scene            = null;

function recallAll() {
  teacherLocation = teacherObject.position;
  NAF.connection.broadcastDataGuaranteed( 'move', {x: teacherLocation.x, y: teacherLocation.y+1.2, z: teacherLocation.z+5} );
}

//------------------------------------------- Student panel -------------------------------------------
//
//    This is the student panel from the teacher which should not be confused with the student panel from the students.
//    This panel is a long rectangular panel placed on the right-hand side of the teacher on which every students name is visible.
//    The color of the students name indicates their status:
//      * White = disconnected
//      * Black = connected
//      * Green = placed outside the group
//    If a student raises h(is)(er) hand then a hand icon is visible before this students name.
//    If a student clicks on the turtle, dizzy emoticon or rabbit then this is visualized after the students name.
//    Depending on the scene clicking on the title "Student name" or an actual students name on the panel has a different meaning:
//      * "Student name"
//        - classroom                 = all students are placed on their predefined position inside the classroom.
//        - (big)(small) Solar System = all students are placed on the same spot on a predefined offset from the teachers location.
//      * an actual students name
//        - classroom                 = nothing happens
//        - (big)(small) Solar System = the students name turns green and the student is placed outside the group on a predefined offset from the teachers location.
//
//------------------------------------------------------------------------------------------------------
/*
    Function to add a student to the student panel.
    @param name:  name of the student that needs to be added to the student panel
*/
function addToStudentPanel(name){
  var studentData = document.createElement('a-entity');
  studentData.setAttribute('id', name.split(' ').join('-'));
  studentData.setAttribute('template', {src: 'templates/teacher/student-data.template'});
  studentData.setAttribute('position', onstudentPanelPosition.x + ", " + (onstudentPanelPosition.y-counter*0.25) + ", " + onstudentPanelPosition.z);
  studentData.setAttribute('data-name', name);
  studentData.setAttribute('data-name_concatenated', name.split(' ').join('-'));
  studentData.addEventListener('click', function(){moveStudent(name)});
  document.querySelector('#student-panel').appendChild(studentData);
  counter++;
}
/*
    Function for creating an image label for a panel.
    @param identity:      label id
    @param source:        template source
    @param image:         label image
    @param p:             label position
    @param parentEntity:  panel to which the image label needs to be applied
*/
function createImageLabel(identity, source, image, p, parentEntity){
  var label = document.createElement('a-entity');
  label.setAttribute('id', identity);
  label.setAttribute('template', {src: source});
  label.setAttribute('data-thumb', image);
  label.setAttribute('position', {x: p.x, y: p.y, z: p.z});
  parentEntity.appendChild(label);
}
/*
    Function for creating a text label for a panel.
    The text label exists out of a small rectangular plane in the same color
    as the student panel. This allows us to make the text label clickable by
    making the rectangular plane clickable.
    @param identity:      label id
    @param text:          label text
    @param source:        template source
    @param pText:         text position on the label
    @param p:             label position
    @param parentEntity:  panel to which the text label needs to be applied
*/
function createTextLabel(identity, text, source, pText, p, parentEntity){
  var textLabel = document.createElement('a-entity');
  textLabel.setAttribute('id', identity);
  textLabel.setAttribute('template', {src: source});
  textLabel.setAttribute('data-id', identity);
  textLabel.setAttribute('data-text', text);
  textLabel.setAttribute('data-color', "black");
  textLabel.setAttribute('data-text_position', pText.x + "," + pText.y + "," + pText.z);
  textLabel.setAttribute('position', {x: p.x, y: p.y, z: p.z});
  parentEntity.appendChild(textLabel);
}
/*
    Function to create a student planel.
    @param parentEntity:  scene to which the student panel needs to be added
*/
function createStudentPanel(parentEntity){
  var studentPanel = document.createElement('a-entity');
  studentPanel.setAttribute('id', "student-panel");
  studentPanel.setAttribute('geometry', {primitive: 'plane', height: 4, width: 2});
  studentPanel.setAttribute('position', {x: teacherLocation.x + studentPanelOffset.x, y: teacherLocation.y + studentPanelOffset.y, z: teacherLocation.z + studentPanelOffset.z});
  studentPanel.setAttribute('rotation', {x: 0, y: 90, z: 0});
  studentPanel.setAttribute('material', {color: '#C0C0C0', shader: 'flat'});
  parentEntity.appendChild(studentPanel);

  createImageLabel("hand-down-label", "templates/teacher/image_link.template", "#hand-down-thumb", {x: -0.85, y: 1.85, z: 0.001}, studentPanel);
  createImageLabel("status-label", "templates/teacher/image_holder.template", "#status-thumb", {x: 0.85, y: 1.85, z: 0.001}, studentPanel);
  createTextLabel("name-label", "Name student", "templates/teacher/text_link.template", {x: 1.07, y: 0, z: 0}, {x: 0, y: 1.85, z: 0.001}, studentPanel);
}

//------------------------------------------- Scene panel -------------------------------------------
//
//    The scene panel allows the teacher to switch between different scenes.
//    In the current implementation there are 3 different scenes:
//      * classroom
//      * big Solar System
//      * small Solar System
//    When the teacher decides to switch between scenes the students will also switch scenes.
//
//----------------------------------------------------------------------------------------------------
/*
    Function to add scenes to the scene panel.
    @param scene:         scene that needs to be added to the scene planel
    @param parentEntity:  scene panel
*/
function addToScenePanel(scene, parentEntity){
  var sceneLink = document.createElement('a-entity');
  sceneLink.setAttribute('template', {src: 'templates/student/student-panel.template'});
  sceneLink.setAttribute('data-src', scene);
  sceneLink.setAttribute('data-thumb', "#"+scene.split(' ').join('-')+"-thumb");
  sceneLink.addEventListener('click', function(){moveToScene(scene)});
  parentEntity.appendChild(sceneLink);
}
/*
    Function to create scene panel.
    @param parentEntity:  scene to which the scene panel needs to be added
*/
function createScenePanel(parentEntity){
  var panel = document.createElement('a-entity');
  panel.setAttribute('id', "scene-panel");
  panel.setAttribute('layout', {type: 'line', margin: 0.55});
  panel.setAttribute('position', {x: teacherLocation.x + scenePanelPosition.x, y: teacherLocation.y + scenePanelPosition.y, z: teacherLocation.z + scenePanelPosition.z});
  panel.setAttribute('rotation', {x: -45, y: 180, z: 0});
  panel.setAttribute('scale', {x: 1.5, y: 1, z: 0});
  parentEntity.appendChild(panel);

  for (var scene in sceneList){
      addToScenePanel(scene, panel);
  }
}
/*
    Function to move between different scenes.
    @param scene: the scene to which needs to be switched
*/
function moveToScene(scene){
    if(current_scene != scene){
      if(scene == "classroom"){
        scene_template.removeAttribute('solarsystem');
        scene_template.setAttribute('scale', {x: 2, y: 2, z: 2});
        scene_template.setAttribute('classroom', {});
        teacherLocation.set(0, 0.8, -4);
        scenePanelPosition={x:0.75,  y:1,   z:1};
        studentPanelOffset={x:-2.50, y:1.2, z:0};
        document.querySelector('#player').setAttribute("rotation", {x: 0, y: 180, z: 0});
        moveTeacherPanels(3.14);
      }
      else {
        if(scene == "solarsystem big"){
            scene_template.setAttribute('solarsystem', {system: "big", teacher: true});
            teacherLocation.set(3.5, 0.4, planetList["Earth"].z);
        }
        else if(scene == "solarsystem small"){
            scene_template.setAttribute('solarsystem', {system: "small", teacher: true});
            teacherLocation.set(5, 0.4, 30);
        }
        scene_template.removeAttribute('classroom');
        scene_template.setAttribute('scale', {x: 1, y: 1, z: 1});
        scenePanelPosition={x:-1, y:0,   z:0.75};
        studentPanelOffset={x:0,  y:1.2, z:-2.50};
        document.querySelector('#player').setAttribute("rotation", {x: 0, y: 90, z: 0});
        moveTeacherPanels(1.57);
      }
      scene_template.setAttribute('template', {src: sceneList[scene].template});
      // Reposition student and load the new scene
      NAF.connection.broadcastDataGuaranteed( 'changeScene', scene);
      current_scene = scene;
      recallStudents();
    }
}
/*
    Function to place the teacher panel on the correct position after the teacher has moved.
    This can be when moving in a scene but also when moving between scenes.
    @param newRotation: the new rotational position of the teacher panel
*/
function moveTeacherPanels(newRotation){
  document.querySelector('#student-panel').object3D.position.set(
    teacherLocation.x + studentPanelOffset.x,
    teacherLocation.y + studentPanelOffset.y,
    teacherLocation.z + studentPanelOffset.z
  );
  document.querySelector('#scene-panel').object3D.position.set(
    teacherLocation.x + scenePanelPosition.x,
    teacherLocation.y + scenePanelPosition.y,
    teacherLocation.z + scenePanelPosition.z
  );
  if(newRotation != null){
    document.querySelector('#student-panel').object3D.rotation.set(0, newRotation-1.57, 0);
    document.querySelector('#scene-panel').object3D.rotation.set(-45, newRotation, 0);
  }
}

//------------------------------------------- Move student(s) -------------------------------------------
//
//    When moving between different scenes the teacher will take the students with h(im)(er).
//    The teacher has also the possibility to call students when moving through the big and small
//    Solar System. This allows the teacher to go to specific planets and have a closer look together
//    with the students.
//
//-------------------------------------------------------------------------------------------------------
/*
    Function used to place a specific student outside or back inside the group of students.
    This function can be used by clicking on a students name and works only in the big and small
    Solar System scenes.
    @param name:  name of the student that needs to be placed outside/inside the group
*/
function moveStudent(name){
  var name_concatenated =  name.split(' ').join('-');
  //Add event listener for click on student name
  if(studentList[name].connected && current_scene != "classroom"){
    if(studentList[name].moved){
      document.querySelector("#" + name_concatenated + "-name").setAttribute('text', 'color', 'black');
    }
    else{
      document.querySelector("#" + name_concatenated + "-name").setAttribute('text', 'color', 'green');
    }
    NAF.connection.sendDataGuaranteed( studentList[name].id, 'move', null );
    studentList[name].moved = !studentList[name].moved;
  }
}
/*
      Function which is called when clicked on the "Name student" label.
      This function has a different functionality based on the scene in which it is used:
        * classroom:              all students are placed on their predefined place in the classroom.
        * big/small Solar System: all students are placed on a predefined offset from the current teacher position.
*/
function recallStudents() {
  if( teacherLocation != null && current_scene != "classroom") {
    NAF.connection.broadcastDataGuaranteed( 'move', {x: teacherLocation.x-2, y: teacherLocation.y, z: teacherLocation.z+5} );
  }
  else {
    for(var name in studentList){
      stopMiniGames( studentList[name].id );
      NAF.connection.sendDataGuaranteed( studentList[name].id, 'move', new THREE.Vector3( studentList[name].x, 1, studentList[name].z ) );
    }
  }
}

//------------------------------------------- Teacher component -------------------------------------------
AFRAME.registerComponent('teacher', {
  init: function() {
    console.log( "Teacher ready !" );
    teacherObject         = this.el.object3D;
    teacherLocation       = teacherObject.position;
    scene_template        = document.querySelector('#scene');
    current_scene         = "classroom";

    //Create student panel
    createStudentPanel(this.el.sceneEl);
    createScenePanel(this.el.sceneEl);

    //Add all students in studentlist to student panel
    for( var student in studentList){
      if(student != "defaultValue"){
        addToStudentPanel(student);
      }
    }

    // Add student to studentlist
    NAF.connection.subscribeToDataChannel( 'hallo', function ( senderId, dataType, data, targetId ) {
      console.log( data + " (" + senderId + ") : Hallo" );
      if( ! studentList.hasOwnProperty(data) ) {
        studentList[data] = studentList.defaultValue;
      }
      document.querySelector("#" + data.split(' ').join('-') + "-name").setAttribute('text', 'color', 'black');
      studentList[data].id = senderId;
      studentList[data].connected = true;
      numberOfStudents++;
    });

    document.body.addEventListener('clientConnected', function (evt) {
        console.warn('Client connected! clientId =', evt.detail.clientId);
    });

    // Handle student data received from student
    NAF.connection.subscribeToDataChannel('student-data', function ( senderId, dataType, data, targetId ) {

        console.log(data.person);
        var pending_status = "#" + data.person.split(' ').join('-') + "-" + data.pending_status;
        var current_status = "#" + data.person.split(' ').join('-') + "-" + studentList[data.person].status;

        if(data.pending_status == "hand"){
          studentList[data.person].hand = !studentList[data.person].hand
          document.querySelector(pending_status).setAttribute('visible', studentList[data.person].hand);
        }
        else{
          if(studentList[data.person].status == null) {
            document.querySelector(pending_status).setAttribute('visible', true);
            studentList[data.person].status = data.pending_status;
          }
          else if(studentList[data.person].status == data.pending_status) {
            document.querySelector(pending_status).setAttribute('visible', false);
            studentList[data.person].status = null;
          }
          else {
            document.querySelector(current_status).setAttribute('visible', false);
            document.querySelector(pending_status).setAttribute('visible', true);
            studentList[data.person].status = data.pending_status;
          }
        }

    });

    // Welcome student
    document.body.addEventListener('clientConnected', function (evt) {
      console.log( 'student joined : ', evt.detail.clientId );
      NAF.connection.sendDataGuaranteed( evt.detail.clientId, 'welcome', null );
     });

    // Goodbye student
    document.body.addEventListener('clientDisconnected', function (evt) {
      var name = "unknown";
      for( var student in studentList ) {
        if( studentList[student].id == evt.detail.clientId ) {
          name = student;
          break;
        }
      }
      console.log( 'student ' + name +  ' left (' + evt.detail.clientId + ')' );
      if(name != "unknown"){
        var name_concatenated =  name.split(' ').join('-');
        document.querySelector("#" + name_concatenated + "-name").setAttribute('text', 'color', 'white');
        if(studentList[name].status != null){
          document.querySelector("#" + name_concatenated + "-" + studentList[name].status).setAttribute('visible', false);
          studentList[name].status = null;
        }
        if(studentList[name].hand){
          document.querySelector("#" + name_concatenated + "-hand").setAttribute('visible', false);
          studentList[name].hand = false;
        }
        studentList[name].connected = false;
        numberOfStudents--;
      }
    });

    // Event listener for when teacher teleports
    document.querySelector('#player').addEventListener('teleported', function(evt){
        teacherLocation = evt.detail.newPosition;
        moveTeacherPanels(null);
    });

    // Event listener to put all hands down
    document.querySelector('#hand-down-label').addEventListener('click', function(evt){
      NAF.connection.broadcastDataGuaranteed('hand down', null );
      for( var student in studentList){
        if(student != "defaultValue"){
          document.querySelector("#" + student.split(' ').join('-') + "-hand").setAttribute('visible', false);
        }
      }
    });

    // Event listener to place all students to their initial position
    document.querySelector("#name-label").addEventListener('click', function(evt){
        if(numberOfStudents){
          if(current_scene == "classroom"){
            recallStudents();
            NAF.connection.broadcastDataGuaranteed( 'changeScene', "classroom");
          }
          else{
            for(var student in studentList){
              stopMiniGames( studentList[student].id );    //ADDED WOUT
              if(studentList[student].moved){
                moveStudent(student);
              }
            }
            teacherLocation = teacherObject.position;
            recallStudents();
          }
        }
    });
  }
});
