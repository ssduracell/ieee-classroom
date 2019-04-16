function tag( playerId ) {
  NAF.connection.sendDataGuaranteed( playerId, 'tag', playerColor );
}

function onClickAvatar( playerId ) {
    tag( playerId );
}

function onTag( playerId, color ) {
  console.log('I got tagged '+color+' by id: ', playerId);
  if( color == "grey" ) {
    tag( playerId );
  }
  changePlayerColor( color );
  visiblityLocators( playerColor != "grey" );
}

function playTagger() {
  console.log('Play tagger');
  changePlayerColor( "red" );
  onClickAvatar = function( playerId ) {
    if( playerColor == "grey" ) {
      tag( playerId );
    }
  }
  NAF.connection.subscribeToDataChannel( 'tagger.welcome', function ( senderId, dataType, data, targetId ) {
    if( data == "red" ) {
      changePlayerColor( "grey" );
      visiblityLocators( false );
    }
  } );
  NAF.connection.subscribeToDataChannel( 'tagger.join', function ( senderId, dataType, data, targetId ) {
    console.log('Greetings player :', senderId);
    NAF.connection.sendDataGuaranteed( senderId, 'tagger.welcome', playerColor );
  } );
  NAF.connection.subscribeToDataChannel( 'tagger.stop', function ( senderId, dataType, data, targetId ) {
    NAF.connection.unsubscribeToDataChannel( 'tagger.welcome' );
    NAF.connection.unsubscribeToDataChannel( 'tagger.join' );
    NAF.connection.unsubscribeToDataChannel( 'tagger.stop' );
    NAF.connection.subscribeToDataChannel( 'tagger.start', function ( senderId, dataType, data, targetId ) {
      playTagger();
      NAF.connection.unsubscribeToDataChannel( 'tagger.start' );
    } );
    changePlayerColor( studentColor );
  } );
  NAF.connection.broadcastDataGuaranteed( 'tagger.join', "hello" );
  randomizePosition( player.object3D );
}

var reds = 0;
var blues = 0;
function playPolitics() {
  console.log('Play politics');
  NAF.connection.subscribeToDataChannel( 'politics.welcome', function ( senderId, dataType, data, targetId ) {
    if( data == "red" ) {
      reds++;
    }
    if( data == "blue" ) {
      blues++;
    }
    if( reds < blues ) {
      changePlayerColor( "red" );
    } else {
      changePlayerColor( "blue" );
    }
  } );
  NAF.connection.subscribeToDataChannel( 'politics.join', function ( senderId, dataType, data, targetId ) {
    console.log('Greetings player :', senderId);
    NAF.connection.sendDataGuaranteed( senderId, 'politics.welcome', playerColor );
  } );
  NAF.connection.subscribeToDataChannel( 'politics.stop', function ( senderId, dataType, data, targetId ) {
    NAF.connection.unsubscribeToDataChannel( 'politics.welcome' );
    NAF.connection.unsubscribeToDataChannel( 'politics.join' );
    NAF.connection.unsubscribeToDataChannel( 'politics.stop' );
    NAF.connection.subscribeToDataChannel( 'politics.start', function ( senderId, dataType, data, targetId ) {
      playPolitics();
      NAF.connection.unsubscribeToDataChannel( 'politics.start' );
    } );
    changePlayerColor( studentColor );
  } );
  NAF.connection.broadcastDataGuaranteed( 'politics.join', "hello" );
  randomizePosition( player.object3D );
}

function startCTF() {
  console.log('Start CTF');
  onTag = function( playerId, color ) {
    console.log('I got tagged '+color+' by id: ', playerId);
    if( color == playerColor ) {
      //boost
    } else {
      //reset
    }
  }
  NAF.connection.subscribeToDataChannel( 'CTF.welcome', function ( senderId, dataType, data, targetId ) {
    if( data == "red" ) {
      reds++;
    }
    if( data == "blue" ) {
      blues++;
    }
    if( reds < blues ) {
      changePlayerColor( "red" );
    } else {
      changePlayerColor( "blue" );
    }
  } );
  NAF.connection.subscribeToDataChannel( 'CTF.join', function ( senderId, dataType, data, targetId ) {
    console.log('Greetings player :', senderId);
    NAF.connection.sendDataGuaranteed( senderId, 'CTF.welcome', playerColor );
  } );
  NAF.connection.broadcastDataGuaranteed( 'CTF.join', "hello" );
  randomizePosition( player.object3D );
}

function stopAllMiniGames() {
  NAF.connection.broadcastDataGuaranteed( 'politics.stop', "bye" );
  NAF.connection.broadcastDataGuaranteed( 'tagger.stop', "bye" );
}

function stopMiniGames( studentId ) {
  NAF.connection.sendDataGuaranteed( studentId, 'politics.stop' );
  NAF.connection.sendDataGuaranteed( studentId, 'tagger.stop' );
}

function startTagger() {
  NAF.connection.broadcastDataGuaranteed( 'tagger.start', "go" );
}

function startPolitics() {
  NAF.connection.broadcastDataGuaranteed( 'politics.start', "go" );
}
