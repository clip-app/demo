var done = false
  , players = []
  , current_id;

function formVideoId(videoId, index) { return 'player-' + videoId + '-' + index; };

// start-point
function onYouTubeIframeAPIReady() {
  var $players = $('#players');
  var base_events = {'onStateChange': cueFunc, 'onReady': onPlayerReady};

  examples.forEach(function(item) {
    // generate video div
    $players.append($("<div style='position: absolute, top: 0, left: 0, z-index:" + -id + "'>", {id: formVideoId(item.video_id, item.id), 'data-index': item.id}));

    players.push({
      meta: item,
      video: new YT.Player(formVideoId(item.video_id, item.id), {
        height: '390',
        width: '640',
        playerVars: {
          enablejsapi: 1,
          controls: 0,
          showInfo: 0,
          modestBranding: 1
        },
        videoId: item.video_id,
        events: base_events,
      })
    });

    $('#' + formVideoId(item.video_id, item.id)).hide();
  });
};

function findMetaPair(videoId) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].meta.video_id == videoId) {
      return players[i];
    }
  }
}

function onPlayerReady(e) {
  var video_id = e.target.o.videoData.video_id;

  var pair = players[$(e.target.a).attr('data-index')];
  var video = pair.video;

  // start buffering that shit up
  video.mute();
  video.seekTo(pair.meta.start);
}

var loaded = [];

var cueFunc = function(e) {
  if (e.data == 1) {
    var id   = e.target.o.videoData.video_id
      , meta = examples[$(e.target.a).attr('data-index')]; //findMetaPair(id); // here is the problem

    if (loaded[meta.id] == true) return;

    e.target.pauseVideo();
    e.target.seekTo(meta.start);

    loaded[meta.id] = true;

    if (allLoaded()) {
      beginOne(players, 0);
    }
  }
};

function allLoaded() {
  if (loaded.length == examples.length) {
    for (var i = 0; i < loaded.length; i++) {
      if (! loaded[i]) {
        return false;
      }
    }
    return true;
  }
  return false;
}

var delayBetweenWords = 50;

function beginOne(players, index) {
  if (index > players.length - 1) return;

  var current_meta   = players[index].meta // Metadata for the current video
    , current_video  = players[index].video // YouTube API object
    , current_player = $('#' + formVideoId(current_meta.video_id, index)) // The DOM-node that is playing the video
    , duration       = current_meta.end - current_meta.start; // The duration of the video that we're playing

  current_video.addEventListener('onStateChange', function (e) {
    if (e.data == 1) {
      current_video.unMute();
      current_player.show();

      setTimeout(function() {
        // And kill the "current" video
        current_video.mute();
        // current_player.show();
        setTimeout(function() {

          current_video.stopVideo();
          // Start the next video
          beginOne(players, index + 1);
        }, delayBetweenWords);
      }, (duration * 1000));
    }
  });

  current_video.playVideo();
}
