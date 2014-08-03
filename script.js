var done = false
  , players = []
  , current_id;

var examples = [
  {
    videoId: '5R0_FJ4r73s',
    startTime: 26,
    endTime: 30
  }, {
    videoId: '8eSrdgTHhK0',
    startTime: 25,
    endTime: 30
  }, {
    videoId: '4lPW1lTO4OI',
    startTime: 24,
    endTime: 30
  }
];

function formVideoId(videoId) { return 'player-' + videoId; };

// start-point
function onYouTubeIframeAPIReady() {
  var $players = $('#players');
  var index = -1;
  var base_events = {'onStateChange': cueFunc, 'onReady': onPlayerReady};

  examples.forEach(function(item) {
    // generate video div
    item.i = ++index;
    $players.append($("<div>", {id: formVideoId(item.videoId), 'data-start': item.startTime, 'data-end': item.endTime}));

    players.push({
      meta: item,
      video: new YT.Player(formVideoId(item.videoId), {
        height: '390',
        width: '640',
        playerVars: {
          enablejsapi: 1,
          controls: 0,
          showInfo: 0,
          modestBranding: 1
        },
        videoId: item.videoId,
        events: base_events,
      })
    });

    $('#' + formVideoId(item.videoId)).hide();
  });
};

function findMetaPair(videoId) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].meta.videoId == videoId) {
      return players[i];
    }
  }
}

function onPlayerReady(e) {
  var videoId = e.target.o.videoData.video_id;

  var pair = findMetaPair(videoId);
  var video = pair.video;

  // start buffering that shit up
  video.mute();
  video.seekTo(pair.meta.startTime);
}

var loaded = [];

var cueFunc = function(e) {
  if (e.data == 1) {
    var id = e.target.o.videoData.video_id
      , meta = findMetaPair(id);

    if (loaded[meta.meta.i] == true) return;

    e.target.pauseVideo();
    e.target.seekTo(meta.meta.startTime);

    loaded[meta.meta.i] = true;

    if (allLoaded()) {
      beginOne(players, 0);
    }
  }
};

function allLoaded() {
  if (loaded.length == examples.length) {
    for (var i = 0; i < loaded.length; i++) {
      if (!loaded[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

var added_delay = 0;

function beginOne(players, index) {
  if (index > players.length - 1) return;

  var current_meta   = players[index].meta // Metadata for the current video
    , current_video  = players[index].video // YouTube API object
    , current_player = $('#' + formVideoId(current_meta.videoId)) // The DOM-node that is playing the video
    , duration       = current_meta.endTime - current_meta.startTime; // The duration of the video that we're playing

  current_video.addEventListener('onStateChange', function (e) {
    if (e.data == 1) {
      current_video.unMute();
      current_player.show();

      setTimeout(function() {
        // Start the next video
        beginOne(players, index + 1);

        // And kill the "current" video
        current_video.stopVideo();
        current_player.hide();
      }, (duration * 1000) + added_delay);
    }
  });

  current_video.playVideo();
}
