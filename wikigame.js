var my_username;
var my_clicks = 0;
var wg_toolbar_start_word;
var wg_toolbar_last_word;

pubnub = PUBNUB.init({
    publish_key   : 'pub-e61d5355-10d9-4b7f-9d81-7421fdd9ab17',
    subscribe_key : 'sub-d1e4d8cc-ff9d-11e1-be8d-cdb493626ec7',
    ssl           : false,
    origin        : 'pubsub.pubnub.com'
});

pubnub.subscribe({
    channel: "wikigame",      // CONNECT TO THIS CHANNEL.
    restore: true,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED
                                     // OR WHEN PAGE CHANGES.
    callback: function(message) { // RECEIVED A MESSAGE.
		my_username = localStorage.wg_user;
        if (message.wg_user == my_username) {
			if(message.wg_event == "link_click"){
				localStorage.wg_clicks = parseInt(localStorage.wg_clicks)+1;
				pubnub.publish({             // SEND A MESSAGE.
					channel : "wikigame",
					message : {"wg_user": localStorage.wg_user, "wg_clicks": localStorage.wg_clicks, "wg_start_word": localStorage.wg_start_word, "wg_last_word": localStorage.wg_last_word}
				});
			}
        }
    },
    connect: function() {        // CONNECTION ESTABLISHED.
        console.log("connected back");
    },
    error: function(e){
		console.log(e);
    }
});

pubnub.publish({
	channel : "wikigame",
	message : {"wg_event": "extension_restart", "wg_clicks": 0}
});

console.log("restarting game...");
