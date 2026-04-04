import { useState } from "react";
import "./Carousel.css";

const images = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1400&q=80"
];

export default function Carousel() {
    const [index, setIndex] = useState(0);
    const prevSlide = () => setIndex((index - 1 + images.length) % images.length);
    const nextSlide = () => setIndex((index + 1) % images.length);

    return (
        <div className="carousel">
            <h2>Featured Banners</h2>
            <img src={images[index]} alt="banner" />
            <div className="carousel-controls">
                <button type="button" onClick={prevSlide} aria-label="Previous slide">
                    ◀ Prev
                </button>
                <span>{index + 1} / {images.length}</span>
                <button type="button" onClick={nextSlide} aria-label="Next slide">
                    Next ▶
                </button>
            </div>
        </div>
    );
}