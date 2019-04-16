var playerColor = "red";
var player = null;
var playerHead = null;
var cursor = null;

function changePlayerColor( color ) {
  playerColor = color;
  playerHead.setAttribute("material", "color", color);
  cursor.setAttribute("color", color);
}

function changePlayerPosition( x, y, z ) {
  console.log('changePlayerPosition to ('+x+','+y+','+z+')');
  player.object3D.position.x = x;
  player.object3D.position.y = y;
  player.object3D.position.z = z;
}

AFRAME.registerComponent('clickable', {
  schema: {
  },

  init: function () {
    var el = this.el;

    el.addEventListener('click', function(evt){
      var target = evt.currentTarget;
      if( target.parentElement.firstUpdateData ) {
        clickedNetworkId = target.parentElement.firstUpdateData.owner;//networkId;
        console.log('I clicked id: ', clickedNetworkId);
        onClickAvatar( clickedNetworkId );
      } else {
        console.log('I was clicked at: ', evt.detail.intersection.point);
        changePlayerPosition( target.object3D.position.x, 0, target.object3D.position.z );
        randomizePosition( target.object3D );
      }
    });
  }

});

AFRAME.registerComponent('handle-clicked', {
  schema: {
  },

  init: function () {
    playerHead = this.el;
    player = document.querySelector("#player");//document.getElementById("player");
    cursor = document.querySelector("#cursor");//document.getElementById("cursor");
    NAF.connection.subscribeToDataChannel( 'tag', function ( senderId, dataType, data, targetId ) {
      onTag( senderId, data );
    } );
  }
});

AFRAME.registerComponent('random-location', {
  schema: {
  },

  init: function () {
    randomizePosition( this.el.object3D );
  }
});

function randomizePosition( object ) {
    object.position.x = randomFloat(100, 105);
    object.position.z = randomFloat(0, 5);
}

function randomInt( min, max ) {
  return Math.floor( randomFloat( min, max ) );
}

function randomFloat( min, max ) {
  return ( Math.random() * ( max - min ) ) + min;
}

function visiblityLocators( visible ) {
  var locators = document.querySelectorAll( ".locator" );

  locators.forEach( function( locator ) {
    locator.setAttribute( "visible", visible );
  });
}
