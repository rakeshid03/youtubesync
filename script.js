gun = Gun();
  const linkNode = gun.get("youtubeLink"); // Shared link node
  const inputBox = document.getElementById("youtubeInput");

  let player;

  // Extract YouTube ID from full URL or short form
  function extractYouTubeVideoId(url) {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|.*[?&]v=))([^&?/]+)/;
    const match = url.match(regex);
    return match ? match[1] : url; // fallback to raw input
  }

  function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    videoId: '', // blank initially
    events: {
      'onReady': () => {
        // Get the last shared YouTube link
        linkNode.once(data => {
          if (data && data.url) {
            inputBox.value = data.url;
            const videoId = extractYouTubeVideoId(data.url);
            if (videoId) {
              player.loadVideoById(videoId);
              player.playVideo();
            }
          }
        });

        // Realtime sync
        linkNode.on(data => {
          if (data && data.url) {
            inputBox.value = data.url;
          }
        });
      }
    }
  });
}
  // When user presses Play
  function loadVideo() {
    const rawInput = inputBox.value.trim();
    const videoId = extractYouTubeVideoId(rawInput);
    const cleanUrl = `https://youtu.be/${videoId}`;

    linkNode.put({ url: cleanUrl }); // sync to all users
    player.loadVideoById(videoId);
  }
