pubnub = PUBNUB.init({
	publish_key   : 'pub-e61d5355-10d9-4b7f-9d81-7421fdd9ab17',
	subscribe_key : 'sub-d1e4d8cc-ff9d-11e1-be8d-cdb493626ec7',
	ssl           : false,
	origin        : 'pubsub.pubnub.com'
});

pubnub.subscribe({
	channel: "wikigame",      // CONNECT TO THIS CHANNEL.
	restore: true,              // STAY CONNECTED, EVEN WHEN BROWSER IS CLOSED OR WHEN PAGE CHANGES.
	callback: function(message) { // RECEIVED A MESSAGE.
		console.log("received a message");
		my_username = localStorage.wg_user;
		$("#wg_click_display").hide();
		$("#wg_start_word").html(localStorage.wg_start_word);
		$("#wg_end_word").html(localStorage.wg_last_word);
		$("#wg_click_count").html(localStorage.wg_clicks);
		$("#wg_click_display").show();
		if(window.location.href.indexOf(localStorage.wg_last_word) > -1 || document.title.indexOf(localStorage.wg_last_word) > -1){
			pubnub.publish({ 
				channel : "wikigame",
				message : {"wg_user": localStorage.wg_user, "wg_event": "game_over", "wg_user_status": "winner"}
			});
			console.log("You are the winner!");
		}
		if ((message.wg_user == my_username && message.wg_clicks) || message.wg_clicks) {
			localStorage.wg_clicks = message.wg_clicks;
		}
		if(message.wg_event == "new_game"){
			console.log('Start word is: ' + message.wg_start_word);
			localStorage.wg_start_word = message.wg_start_word;
			localStorage.wg_last_word = message.wg_last_word;
			localStorage.wg_clicks = 0;
		}
		if(message.wg_event == "extension_restart"){
			localStorage.wg_start_word = "undefined";
			localStorage.wg_last_word = "undefined";
			localStorage.wg_clicks = 0;
		}
	},
	connect: function() {        // CONNECTION ESTABLISHED.
		console.log("connected front");
	},
	error: function(e){
		console.log(e);
	}
});

$(function(){
	$("<div id='wg_toolbar'><div id='wg_click_display'>Current game is <span id='wg_start_word'>"+localStorage.wg_start_word+"</span> to <span id='wg_end_word'>"+localStorage.wg_last_word+"</span>. You have clicked <span id='wg_click_count'>"+localStorage.wg_clicks+"</span> links.</div><span id='wg_title'>The Wiki Game</span></div>").appendTo(document.body);
	var wg_ypos = window.pageYOffset;
	if (wg_ypos > 0){
		$("#wg_toolbar").css("position","fixed");
		$("#wg_toolbar").css("top","0");
	}
	$(window).scroll(function(){
		if (window.pageYOffset > 0){
			$("#wg_toolbar").css("position","fixed");
			$("#wg_toolbar").css("top","0");
		}
	});
	$('a[href^="/wiki/"]').click(function(e){
		pubnub.publish({             // SEND A MESSAGE.
			channel : "wikigame",
			message : {"wg_user": "ef2k", "wg_event": "link_click"}
		});
		localStorage.wg_clicks++;
	});
});