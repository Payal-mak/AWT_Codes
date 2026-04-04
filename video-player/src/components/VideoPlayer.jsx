import { useEffect, useRef, useState } from "react";

function VideoPlayer({ video }) {
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        setProgress(0);
        setCurrentTime(0);
    }, [video.src]);

    const formatTime = (timeInSeconds) => {
        const total = Math.floor(timeInSeconds || 0);
        const minutes = Math.floor(total / 60);
        const seconds = total % 60;
        return `${minutes}:${String(seconds).padStart(2, "0")}`;
    };

    const handleTimeUpdate = () => {
        const v = videoRef.current;
        if (!v || !v.duration) {
            return;
        }

        setProgress((v.currentTime / v.duration) * 100);
        setCurrentTime(v.currentTime);
    };

    const handleSeek = (e) => {
        const v = videoRef.current;
        if (!v || !v.duration) {
            return;
        }

        v.currentTime = (e.target.value / 100) * v.duration;
    };

    return (
        <div className="player">
            <h2 className="video-title">{video.title}</h2>

            <video
                ref={videoRef}
                src={video.src}
                className="video-element"
                controls
                onTimeUpdate={handleTimeUpdate}
            />

            <div className="timeline-row">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={handleSeek}
                    className="timeline"
                />
                <span className="time-label">{formatTime(currentTime)}</span>
            </div>
        </div>
    );
}

export default VideoPlayer;