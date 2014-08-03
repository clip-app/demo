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
  var base_events = {'onReady': onPlayerReady};

  examples.forEach(function(item) {
    // generate video div
    item.i = ++index;
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

function findMetaPair(videoId) {
  for (var i = 0; i < players.length; i++) {
    if (players[i].meta.videoId == videoId) {
      return players[i];
    }
  }
}

function onPlayerReady(e) {
  // store off the videoid
  var videoId = e.target.o.videoData.video_id;

  var pair = findMetaPair(videoId);
  var video = pair.video;

  // start buffering that shit up
  video.addEventListener('onStateChange', cueFunc);
  video.cueVideoById(videoId, pair.meta.startTime);
}

var cueFunc = function(e) {
  console.log(e.data);
  if (e.data == 1) {
    e.target.removeEventListener('onStateChange', cueFunc);
    e.target.pauseVideo();
 
    console.log(findMetaPair(e.target.o.videoData.video_id).meta.index);
    if (findMetaPair(e.target.o.videoData.video_id).meta.index == examples.length - 1) {
      console.log('last1');
    }
  }
};

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
