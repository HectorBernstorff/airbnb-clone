import React, { useState, useRef } from 'react'; // Import React and required hooks
import '../styles/Propertie.css'; // Import the Propertie component's CSS

export default function Propertie({ location, title, rating, price, images, onClickFunction, startDate, endDate }) {
    const containerRef = useRef(null); // Create a ref for the image container
    const [scrollPosition, setScrollPosition] = useState(0); // Create state for scroll position
    const [activeIndex, setActiveIndex] = useState(0); // Create state for active image index

    // Function to scroll to the next image
    const scrollToNext = () => {
        const containerWidth = containerRef.current.offsetWidth; // Get container width
        const maxScroll = containerRef.current.scrollWidth - containerWidth; // Calculate max scroll position
        let newPosition = Math.min(scrollPosition + containerWidth, maxScroll); // Calculate new position

        newPosition = Math.round(newPosition / containerWidth) * containerWidth; // Round to the nearest image
        const newIndex = Math.floor(newPosition / containerWidth); // Calculate the new active index

        setScrollPosition(newPosition); // Update scroll position
        setActiveIndex(newIndex); // Update active index
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' }); // Scroll to the new position
    };

    // Function to scroll to the previous image
    const scrollToPrev = () => {
        const containerWidth = containerRef.current.offsetWidth; // Get container width
        let newPosition = Math.max(scrollPosition - containerWidth, 0); // Calculate new position

        newPosition = Math.round(newPosition / containerWidth) * containerWidth; // Round to the nearest image
        const newIndex = Math.floor(newPosition / containerWidth); // Calculate the new active index

        setScrollPosition(newPosition); // Update scroll position
        setActiveIndex(newIndex); // Update active index
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' }); // Scroll to the new position
    };

    const numImages = images.length; // Get the number of images
    const dots = Array.from({ length: numImages }, (_, index) => index); // Create an array of dot indicators

    // Function to handle dot indicator click
    const handleDotClick = (dotIndex) => {
        const newPosition = dotIndex * containerRef.current.offsetWidth; // Calculate new position based on the clicked dot
        setScrollPosition(newPosition); // Update scroll position
        setActiveIndex(dotIndex); // Update active index
        containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' }); // Scroll to the new position
    };

    const isFirstDot = activeIndex === 0; // Check if the first dot is active
    const isLastDot = activeIndex === numImages - 1; // Check if the last dot is active

    return (
        <div className="wrapper">
            <div className="propertie-card-wrapper">
                <div className="propertie-card" ref={containerRef}>
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${image}`}
                            alt={`Property Image ${index + 1}`}
                            onClick={onClickFunction}
                        />
                    ))}
                </div>

                {/* Display the previous button if not on the first image */}
                {!isFirstDot && (
                    <button className="prev-button" onClick={scrollToPrev}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                )}

                {/* Display the next button if not on the last image */}
                {!isLastDot && (
                    <button className="next-button" onClick={scrollToNext}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                )}

                <div className="dot-indicators-wrapper">
                    <div className="dot-indicators">
                        {dots.map((dotIndex) => (
                            <div
                                key={dotIndex}
                                className={`dot ${activeIndex === dotIndex ? 'active' : ''}`}
                                onClick={() => handleDotClick(dotIndex)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Display property information section */}
            <div className="propertieInfo" onClick={onClickFunction}>
                <div className="innerInfo">
                    <div>
                        <span>{location}</span>
                        <span className="ratingInfo">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.610l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                            </svg>
                            {rating}
                        </span>
                    </div>
                    <span className="infoTitle">{title}</span>

                    {/* Display start and end dates if available */}
                    {startDate.length + endDate.length > 10 && (
                        <span className="infoTitle">
                            {startDate + " - " + endDate}
                        </span>
                    )}
                </div>
                <div>
                    <span className="price">${price} CAD</span>
                    <span>night</span>
                </div>
            </div>
        </div>
    );
}
