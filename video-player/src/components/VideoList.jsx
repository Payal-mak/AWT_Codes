function VideoList({ videos, currentVideoId, onSelect }) {
    return (
        <div className="list">
            {videos.map((video) => (
                <button
                    key={video.id}
                    className={`video-item ${currentVideoId === video.id ? "active" : ""}`}
                    onClick={() => onSelect(video)}
                    type="button"
                >
                    <span className="video-item-title">{video.title}</span>
                </button>
            ))}
        </div>
    );
}

export default VideoList;