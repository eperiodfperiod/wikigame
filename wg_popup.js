$(function(){
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
		},
		connect: function() {        // CONNECTION ESTABLISHED.
			console.log("connected front");
		},
		error: function(e){
			console.log(e);
		}
	});
	$("#wg_start_new").click(function(){
		if($("#wg_popup_start_word").val() && $("#wg_popup_last_word").val()){
			pubnub.publish({             // SEND A MESSAGE.
				channel : "wikigame",
				message : {"wg_event": "new_game", "wg_start_word": $("#wg_popup_start_word").val(), "wg_last_word": $("#wg_popup_last_word").val(), "wg_clicks": 0}
			});
			localStorage.wg_start_word = $("#wg_popup_start_word").val();
			localStorage.wg_last_word = $("#wg_popup_last_word").val();
			localStorage.wg_has_words = true;
			chrome.tabs.getSelected(null, function (tab) {
				var startPage = $("#wg_popup_start_word").val();
				chrome.tabs.update(tab.id, {url: "http://en.wikipedia.org/wiki/" + startPage});
			});
		}
	});
});