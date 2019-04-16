// This variable stores all the connected players.
let connectedUsersList = {};

function doEval(id, string) {
    NAF.connection.sendDataGuaranteed(id, "doEval", string);
}

/*!
 * @brief This function will be called when a new ping command is ready to be sent.
 */
function resolvePing(id) {
    return new Promise(resolve => {
        let err = null;

        setTimeout(function() {
            resolve("Request timed out.")
        }, 1000);

        NAF.connection.sendDataGuaranteed(id, "ping", "ping");
        NAF.connection.subscribeToDataChannel("ping", function(senderID, dataType , data, targetId) {
            resolve("Reply from " + senderID + ":" + (Date.now() - data) + "ms");
        });
    });
}

/*!
 * @brief This function actually calls the ping command.
 *
 * @param[in] id     The ID of the target to be pinged.
 * @param[in] amount The amount of times it will ping. (default = 5)
 *
 */
async function ping(id, amount = 5) {
    /*
     * When no argument are given the HELP menu is printed.
     */
    if (arguments.length === 0) {
        console.log("Usage: ping(<id>,   <ping amount (default = 5)>)");
        console.log("       ping(<name>, <ping amount (default = 5)>)");
        console.log("/*---------------------------------------------------------------------------------------------------------*/");
        console.log("<id>          = The webRTC ID of the client that the ping has to be sent to.");
        console.log("<name>        = The username of the client that the ping has to be sent to.");
        console.log("<ping amount> = The amount of times the ping will be send before exiting. Defaults to 5.");
        console.log("<timeout>     = The amount of time in ms that will be waited before it is assumed the client did not respond.");

        return;
    }

    /*
     * Let the user know the current ping count and start the resolve cycle.
     */
    console.log("Pinging " + id + ' ' + amount + " times:");
    
    for(let i = 0; i < amount; i++) {
        let result = await resolvePing(id);
        console.log(result);
        await(new Promise(resolve => setTimeout(resolve, 1000)));
    }

    /* Too lazy to implement this...                      */
    /* console.log("--- " + id + " ping statistics ---"); */
}

/*!
 * @brief Subscribe to the "student-info" channel.
 *
 * When the get getConnectedUsers() function is called a message is pushed to the
 * "student-info" channel. This function receives the reactions to that message
 * and stores the results.
 */
NAF.connection.subscribeToDataChannel('student-info', function (senderId, dataType, data, targetId) {
    let timeOfRx = Date.now();

    connectedUsersList[senderId]      = {};
    connectedUsersList[senderId].name = data.name;
    connectedUsersList[senderId].ping = (timeOfRx - data["timeOfTx"]);

    return data;
});

/*
 * @brief Shows the help menu.
 */
function help() {
    console.log("showConnectedUsers() gives a list of connected Users (No shit sherlock)");
    console.log("showlist() gives the amount of users in showConnectedUsers");
    console.log("ping('id') pings to passed id");
}

/*
 * Shows and generates a list with connected Users.
 */
function getConnectedUsers() {
    NAF.connection.broadcastDataGuaranteed('student-info', "send user info");

    setTimeout(function() {
        console.table(connectedUsersList);
    }, 500);
}

