var done = false
  , players = []
  , current_id;

var examples = [
  {
    videoId: '5R0_FJ4r73s',
    startTime: 26,
    endTime: 750
  }, {
    videoId: '8eSrdgTHhK0',
    startTime: 25,
    endTime: 750
  }, {
    videoId: '4lPW1lTO4OI',
    startTime: 24,
    endTime: 750
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

    players.push(new YT.Player(formVideoId(item.videoId), {
      height: '390',
      width: '640',
      playerVars: {
        enablejsapi: 1,
      },
      videoId: item.videoId,
      events: base_events
    }));
  });
};

function onPlayerReady(e) {
  // store off the videoid
  var videoId = e.target.o.videoData.video_id;
  
  // find the meta
  var videoMeta;
  for (var i = 0; i < examples.length; i++) {
    if (examples[i].videoId == videoId) {
      videoMeta = examples[i];
      videoMeta.i = i;
      break;
    }
  }

  // cue it at the start time
  e.target.cueVideoById(videoId, videoMeta.startTime);

  var last = i + 1 == examples.length;
  if (last) beginAll();
}

function beginAll() {
  
}
