import React, { useState, useRef, useEffect } from 'react';
import '../Style/Propertie.css';
import Image from '../assets/Images/BbackgroundPicture.jpg';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate

export default function Propertie({ title, location, rating, price }) {
    const containerRef = useRef(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    // const navigate = useNavigate(); // Initialize the useNavigate hook

    useEffect(() => {
        const containerWidth = containerRef.current.offsetWidth;
        const newPosition = activeIndex * containerWidth;
        setScrollPosition(newPosition);
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    }, [activeIndex]);

    useEffect(() => {
        const containerWidth = containerRef.current.offsetWidth;
        const newIndex = Math.round(scrollPosition / containerWidth);
        setActiveIndex(newIndex);
    }, [scrollPosition]);

    const scrollToNext = () => {
        const containerWidth = containerRef.current.offsetWidth;
        const maxScroll = containerRef.current.scrollWidth - containerWidth;
        const newPosition = Math.min(scrollPosition + containerWidth, maxScroll);
        setScrollPosition(newPosition);
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    };

    const scrollToPrev = () => {
        const containerWidth = containerRef.current.offsetWidth;
        const newPosition = Math.max(scrollPosition - containerWidth, 0);
        setScrollPosition(newPosition);
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    };

    const numImages = 3;
    const dots = Array.from({ length: numImages }, (_, index) => index);

    const isAtStart = scrollPosition === 0;
    const isAtEnd =
        containerRef.current &&
        scrollPosition >= containerRef.current.scrollWidth - containerRef.current.offsetWidth;

    // const handleImageClick = () => {
    //     // Trigger navigation when the image is clicked
    //     navigate('/your-navigation-url'); // Replace with your desired navigation URL
    // };

    return (
        <div className='wrapper'>
            <div className="propertie-card-wrapper">
                <div className="propertie-card" ref={containerRef}>
                    <img src={Image} alt="" />
                    <img src={Image} alt="" />
                    <img src={Image} alt="" />
                </div>
                {!isAtStart && (
                    <button className="prev-button" onClick={scrollToPrev}>
                        &lt;
                    </button>
                )}
                {!isAtEnd && (
                    <button className="next-button" onClick={scrollToNext}>
                        &gt;
                    </button>
                )}
                <div className="dot-indicators-wrapper">
                    <div className="dot-indicators">
                        {dots.map((dotIndex) => (
                            <div
                                key={dotIndex}
                                className={`dot ${activeIndex === dotIndex ? 'active' : ''}`}
                                onClick={() => {
                                    const newPosition = dotIndex * containerRef.current.offsetWidth;
                                    setScrollPosition(newPosition);
                                    setActiveIndex(dotIndex);
                                    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className='propertieInfo'>
                <div>{location}</div>
                <div>
                    <div>
                        <span>{rating}</span>
                    </div>
                </div>
                <span className='price'>{price} CAD per night</span>
            </div>
        </div>
    );
}
