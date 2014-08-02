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

  var base_events = {'onReady': onPlayerReady};

  examples.forEach(function(item) {
    // generate video div
    $players.append($("<div>", {id: formVideoId(item.videoId), 'data-start': item.startTime, 'data-end': item.endTime}));

    players.push({meta: item, video: new YT.Player(formVideoId(item.videoId), {
      height: '390',
      width: '640',
      playerVars: {
        enablejsapi: 1,
      },
      videoId: item.videoId,
      events: base_events,
    })});
  });
};

function onPlayerReady(e) {
  // store off the videoid
  var videoId = e.target.o.videoData.video_id;

  var index;
  for (var i = 0; i < players.length; i++) {
    var playerHash = players[i];
    if (playerHash.video == e.target) {
      playerHash.video.cueVideoById(videoId, playerHash.meta.startTime);
      index = i;
      break;
    }
  }

  var last = index + 1 == players.length;
  if (last) beginAll();
}

function beginAll() {
  var currentTime = 0;
  players.forEach(function(playerHash) {
    var duration = playerHash.meta.endTime - playerHash.meta.startTime;

    setTimeout(function(hash) {
      hash.video.playVideo();
    }, currentTime * 1000, playerHash);

    currentTime += duration;

    setTimeout(function(hash) {
      hash.video.stopVideo();
    }, currentTime * 1000, playerHash);
  });
}
