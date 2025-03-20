async function fetchVideos() {
  const url = `https://api.freeapi.app/api/v1/public/youtube/videos`;

  const options = { method: "GET", headers: { accept: "application/json" } };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.data || !Array.isArray(data.data.data)) {
      console.error("Invalid API response structure:", data.data);
      return;
    }

    allVideos = data.data.data;
    displayVideos(allVideos);
  } catch (error) {
    console.error("Error fetching videos:", error);
  }
}

function displayVideos(videos) {
  const container = document.getElementById("video-list");
  container.innerHTML = "";

  videos.forEach((video) => {
    const item = video.items;
    if (!item || !item.snippet) return;

    // We are trying to get the medium-sized thumbnail image URL here

    const thumbnailUrl =
      item.snippet &&
      item.snippet.thumbnails &&
      item.snippet.thumbnails.medium &&
      item.snippet.thumbnails.medium.url
        ? item.snippet.thumbnails.medium.url
        : "fallback.webp";

    const title = item.snippet.title || "No title available";
    const channel = item.snippet.channelTitle || "Unknown channel";

    // creating a fallback to redirect to the default page

    const videoId = item.id || "#";

    const videoElement = document.createElement("div");
    videoElement.classList.add("video");

    // The format for a youTube video is this followed by video id : https://www.youtube.com/watch?v=
    videoElement.innerHTML = `
      <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">  
        <img src="${thumbnailUrl}" alt="${title}">
      </a>
      <h3>${title}</h3>
      <p>${channel}</p>
    `;

    container.appendChild(videoElement);
  });
}

// Add an event listener to the search input field
document.getElementById("search").addEventListener("input", function () {
  const query = this.value.trim();

  // we only want search to begin when the user has input atlesat 4 characters
  if (query.length > 3) {
    const filteredVideos = allVideos.filter(
      (video) =>
        video.items.snippet.title.toLowerCase().includes(query.toLowerCase()) ||
        video.items.snippet.channelTitle
          .toLowerCase()
          .includes(query.toLowerCase())
    );
    displayVideos(filteredVideos);
  } else {
    displayVideos(allVideos);
  }
});

let allVideos = [];
fetchVideos();
