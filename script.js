$(function() {
  var done = false;
  var player;
  function onYouTubeIframeAPIReady() {
      player = new YT.Player('#player', {
        height: '390',
        width: '640',
        videoId: 'PQBTd4xF6tU',
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
  }
  function onPlayerReady(evt) {
      evt.target.playVideo();
  }
  function onPlayerStateChange(evt) {
      if (evt.data == YT.PlayerState.PLAYING && !done) {
          setTimeout(stopVideo, 6000);
          done = true;
      }
  }
  function stopVideo() {
      player.stopVideo();
  }
});