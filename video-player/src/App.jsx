import { useState } from "react";
import videos from "./data";
import VideoPlayer from "./components/VideoPlayer";
import VideoList from "./components/VideoList";
import "./App.css";

function App() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  return (
    <div className="container">
      <h1 className="title">YouTube Clone</h1>
      <p className="subtitle">Video Player</p>

      <VideoPlayer video={currentVideo} />

      <VideoList
        videos={videos}
        currentVideoId={currentVideo.id}
        onSelect={setCurrentVideo}
      />
    </div>
  );
}

export default App;