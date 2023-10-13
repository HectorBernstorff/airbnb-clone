import '../styles/PropertiePage.css';  // Importing CSS styles
import Header from '../components/Header';  // Importing Header component
import React, { useState, useEffect } from 'react';  // Importing React and its hooks
import { useLocation } from 'react-router-dom';  // Using the useLocation hook from react-router-dom
import axios from 'axios';  // Importing Axios for making HTTP requests
import { useParams } from 'react-router-dom';  // Using the useParams hook from react-router-dom
import { useNavigate } from 'react-router-dom';  // Using the useNavigate hook from react-router-dom

export default function PropertiePage() {
    // Define the properties and states needed for the component
    const location = useLocation();  // Getting the current location
    const [isEditMode, setIsEditMode] = useState(false);  // State for edit mode
    const [propertyData, setPropertyData] = useState(location.state.propertyData);  // Property data state
    const { hostname } = useParams();  // Extracting the hostname from URL params
    const [title, setTitle] = useState(propertyData.hostProperties[0].title);  // Title state
    const [locations, setLocation] = useState(propertyData.hostProperties[0].location);  // Location state
    const [guests, setGuests] = useState(propertyData.hostProperties[0].guests);  // Guests state
    const [bedrooms, setBedrooms] = useState(propertyData.hostProperties[0].bedrooms);  // Bedrooms state
    const [beds, setBeds] = useState(propertyData.hostProperties[0].beds);  // Beds state
    const [baths, setBaths] = useState(propertyData.hostProperties[0].baths);  // Baths state
    const [price, setPrice] = useState(propertyData.hostProperties[0].price);  // Price state
    const [description, setDescription] = useState(propertyData.hostProperties[0].description);  // Description state
    const [imageFileNames, setImageFileNames] = useState(propertyData.hostProperties[0].pictures);  // Image file names state
    const navigate = useNavigate();  // Navigation function
    const [startDate, setStartDate] = useState(location.state.startDate);  // Start date state
    const [endDate, setEndDate] = useState(location.state.endDate);  // End date state

    // Effect hook to update start and end dates when they change in the URL
    useEffect(() => {
        setStartDate(location.state.startDate);
        setEndDate(location.state.endDate);
    }, [location.state.startDate, location.state.endDate]);

    // Effect hook to load property data from the server
    useEffect(() => {
        // Load data only if propertyData is defined
        if (propertyData) {
            fetchData();
        }
    }, [propertyData]);

    // Function to fetch property data from the server
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/properties/${hostname}`);
            const data = response.data;
            setPropertyData(data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    // Function to enable edit mode
    const handleEdit = () => {
        setIsEditMode(true);
    };

    // Function to save property data after editing
    const handleSave = async (hostName, propertyTitle) => {
        // Create a new propertyData object with the updated values
        const updatedPropertyData = {
            hostName,
            hostProperties: propertyData.hostProperties.map((property) => {
                if (property.title === propertyTitle) {
                    return {
                        ...property,
                        title,
                        location: locations,
                        guests,
                        bedrooms,
                        beds,
                        baths,
                        price,
                        description,
                    };
                }
                return property;
            }),
        };

        try {
            // Send a POST request to update the JSON data on the server
            await axios.post(`http://localhost:5000/updateProperty/${hostname}`, updatedPropertyData);

            // Update the local propertyData state with the new values
            setPropertyData(updatedPropertyData);

            // Disable edit mode
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating property data:', error);
        }

        handleSubmit();
    };

    // Function to cancel editing
    const handleCancel = () => {
        // Reload the original data or disable edit mode without saving
        fetchData();
        setIsEditMode(false);
    };

    // State to store the selected file
    const [file, setFile] = useState(null);

    // Function to handle file input change
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Function to submit the selected file
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('uploadedFile', file);

        try {
            await axios.post(`http://localhost:5000/upload/${hostname}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // After a successful upload, update the imageFileNames state with the new filename
            setImageFileNames([...imageFileNames, file.name]);

            setIsEditMode(true);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    // Function to delete an image
    const handleDeleteImage = async (imageName) => {
        try {
            await axios.delete(`http://localhost:5000/deleteImage/${hostname}/${imageName}`);
            // After a successful deletion, update the imageFileNames state by filtering out the deleted image
            setImageFileNames((prevImageFileNames) => prevImageFileNames.filter((name) => name !== imageName));
        } catch (error) {
            console.error('Error deleting image:', error);
        };
    };

    // Function to handle clicking on property images
    function handlePictureClick(propertyData) {
        // Navigate to the PropertiePage and pass the property data as state
        navigate(`/PropertiePage/${propertyData.hostName}/pictures`, { state: { propertyData } });
        window.scrollTo(0, 0);
    }

    // Function to check if a date is disabled (booked)
    const isDateDisabled = (date) => {
        if (propertyData) {
            // Check if the given date falls in any booked date range
            for (const bookedDates of propertyData.hostProperties[0].bookedDates) {
                const startDate = new Date(bookedDates[0]);
                const endDate = new Date(bookedDates[bookedDates.length - 1]);
                if (date >= startDate && date <= endDate) {
                    return true; // Date is booked
                }
            }
        }
        return false; // Date is available
    };

    // Function to get consecutive available dates
    const getAvailableDates = () => {
        const checkInDate = new Date();
        let consecutiveAvailableDates = [];
        let found = false;

        while (!found) {
            if (!isDateDisabled(checkInDate)) {
                consecutiveAvailableDates.push(new Date(checkInDate));
                if (consecutiveAvailableDates.length === 5) {
                    found = true;
                }
            } else {
                consecutiveAvailableDates = [];
            }

            checkInDate.setDate(checkInDate.getDate() + 1);
        }

        return consecutiveAvailableDates;
    };

    // Get available dates
    const availableDates = getAvailableDates();

    // Set check-in and check-out dates
    const checkInDate = availableDates[0];
    const checkOutDate = availableDates[4];

    // Function to calculate the price
    const calculatePrice = () => {
        if (startDate || endDate !== "") {
            const start = new Date(startDate);
            const end = new Date(endDate);

            const timeDiff = end - start;
            const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000)) + 1;
            return price * (days - 1);
        } else {
            return price * 4;
        }
    };

    // Function to delete the property
    const handleDeleteProperty = async () => {
        try {
            await axios.delete(`http://localhost:5000/deleteProperty/${hostname}`);
            navigate('/');
        } catch (error) {
            console.error('Error deleting property:', error);
        }
    };

    // Render the component
    return (
        <>
            <div className='propertyPageWrapper'>
                <Header />
                <div>
                    {isEditMode ? (
                        <>
                            <div className='editWrapper'>
                                <div className='box'>
                                    <div id='edit-image-grid'>
                                        <label className='addPictureButton' htmlFor="file-upload">
                                            <svg width="3rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <input id="file-upload" type="file" onChange={handleFileChange}></input>
                                        </label>
                                        {imageFileNames.map((imageName, index) => (
                                            <div className='imageWrapper' key={index}>
                                                <svg
                                                    onClick={() => handleDeleteImage(imageName)}
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <img
                                                    key={index}
                                                    src={`http://localhost:5000/uploads/${imageName}`}
                                                    alt={`Property Image ${index + 1}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className='inputAreaWrapper'>
                                        <div id='inputNumbers'>
                                            <div className='inputArea'>
                                                <label htmlFor="title">Title</label>
                                                <input id='title' type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                            </div>
                                            <div className='inputArea'>
                                                <label htmlFor="location">Location</label>
                                                <input id='location' type="text" value={locations} onChange={(e) => setLocation(e.target.value)} />
                                            </div>
                                        </div>
                                        <div id='inputNumbers'>
                                            <div className='inputArea'>
                                                <label htmlFor="guests">Guest</label>
                                                <input id='guests' type="text" value={guests} onChange={(e) => setGuests(e.target.value)} />
                                            </div>
                                            <div className='inputArea'>
                                                <label htmlFor="bedrooms">Bedroom</label>
                                                <input id='bedrooms' type="text" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                                            </div>
                                        </div>
                                        <div id='inputNumbers'>
                                            <div className='inputArea'>
                                                <label htmlFor="beds">Bed</label>
                                                <input id='beds' type="text" value={beds} onChange={(e) => setBeds(e.target.value)} />
                                            </div>
                                            <div className='inputArea'>
                                                <label htmlFor="baths">Bath</label>
                                                <input id='baths' type="text" value={baths} onChange={(e) => setBaths(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className='inputArea'>
                                            <label htmlFor="price">Price</label>
                                            <input id='price' type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                                        </div>
                                        <div className='inputArea'>
                                            <label htmlFor="descriptionTextArea">Description</label>
                                            <textarea id='descriptionTextArea' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                        </div>
                                        <div id='inputNumbers'>
                                            <button onClick={() => handleSave(propertyData.hostName, propertyData.hostProperties[0].title)}>Save</button>
                                            <button className='cancelButton' onClick={handleCancel}>Cancel</button>
                                            <button className='deleteButton' onClick={handleDeleteProperty}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        </div>
                                        <button className='close' onClick={handleCancel}>X</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
                <div className='propertyWrapper'>
                    <div className='propertire-main'>
                        <div className='propertieTitle'>
                            <div>
                                <h2 className='title'>{propertyData.hostProperties[0].title}</h2>
                                <button onClick={handleEdit}>
                                    <svg width="1.25rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                    </svg>
                                </button>
                            </div>
                            <div className='titleInfo'>
                                <div className='titleBottom'>
                                    <span className='ratingSection'>
                                        <svg width="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                        {propertyData.hostProperties[0].rating}
                                    </span>
                                    <div>
                                        <span className='location'>{propertyData.hostProperties[0].location}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className='titleShareSave'>
                                        <svg width="16px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                        <span>Share</span>
                                    </span>
                                    <span className='titleShareSave'>
                                        <svg width="16px" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span>Save</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='propertie-image-grid-wrapper'>
                            <div className='propertie-image-grid'>
                                {imageFileNames.slice(0, 5).map((imageName, index) => (
                                    <img
                                        onClick={() => handlePictureClick(propertyData)}
                                        key={index}
                                        src={`http://localhost:5000/uploads/${imageName}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='infosWrapper'>
                        <div className='description'>
                            <div className='infoBelow'>
                                <h3>Entire cottage hosted by {hostname}</h3>
                                <div>
                                    <span className='guest'>{propertyData.hostProperties[0].guests} guests</span>
                                    <span>·</span>
                                    <span className='bedroom'>{propertyData.hostProperties[0].bedrooms} bedrooms</span>
                                    <span>·</span>
                                    <span className='bed'>{propertyData.hostProperties[0].beds} beds</span>
                                    <span>·</span>
                                    <span className='bath'>{propertyData.hostProperties[0].baths} baths</span>
                                </div>
                            </div>
                            <hr />
                            <div>
                                <span className=''>
                                    {propertyData.hostProperties[0].description}
                                </span>
                            </div>
                        </div>
                        <div className='priceDetails'>
                           <div className='priceTitle'>
                               <div><span className='priceNight'>${propertyData.hostProperties[0].price} CAD </span><span>night</span></div>
                               <div className='ratingSection'>
                                   <svg width="1rem" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                       <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                   </svg>
                                   <span className='rating'>{propertyData.hostProperties[0].rating}</span>
                               </div>
                           </div>
                           <div className='dateDetails'>
                               <div>
                                   {startDate.length != "" ? (
                                        // Render content when startDate is not null
                                        <div id='borderLeft' className='lineBreak'>
                                            <span>Checkin</span>
                                            <span className='checkIn'>{startDate}</span>
                                        </div>
                                    ) : (
                                        // Render content when startDate is null
                                        <div id='borderLeft' className='lineBreak'>
                                            <span>Checkin</span>
                                            <span className='checkIn'>{checkInDate.toDateString()}</span>
                                        </div>
                                    )}

                                    {endDate.length != "" ? (
                                        // Render content when startDate is not null
                                        <div id='borderRight' className='lineBreak'>
                                            <span>Checkout</span>
                                            <span className='checkIn'>{endDate}</span>
                                        </div>
                                    ) : (
                                        // Render content when startDate is null
                                        <div id='borderRight' className='lineBreak'>
                                            <span>Checkout</span>
                                            <span className='checkIn'>{checkOutDate.toDateString()}</span>
                                        </div>
                                    )}

                                </div>

                            </div>
                            <div className='reserveSection'>
                                <button>Reserve</button>
                                <span>You won't be charged yet</span>
                            </div>
                            <hr />
                            <div className='priceTotal'>
                                <span>Total</span>
                                <span>${calculatePrice()}  CAD</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}