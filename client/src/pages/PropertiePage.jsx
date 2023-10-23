import '../styles/PropertiePage.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import AddIcon from '../assets/svg/AddIcon';
import CloseIcon from '../assets/svg/CloseIcon';
import DeleteIcon from '../assets/svg/DeleteIcon';
import EditIcon from '../assets/svg/EditIcon';
import RatingIcon from '../assets/svg/RatingIcon';
import ShareIcon from '../assets/svg/ShareIcon';
import SaveIcon from '../assets/svg/SaveIcon';

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
    const [startDate] = useState(location.state.startDate);  // Start date state
    const [endDate] = useState(location.state.endDate);  // End date state

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
            setIsEditMode(false);
    
            // Check if a file is selected
            if (file) {
                // Upload the file
                handleSubmit();
            }
        } catch (error) {
            console.error('Error updating property data:', error);
        }
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
                                            <AddIcon />
                                            <input id="file-upload" type="file" onChange={handleFileChange}></input>
                                        </label>
                                        {imageFileNames.map((imageName, index) => (
                                            <div className='imageWrapper' key={index}>
                                                <p onClick={() => handleDeleteImage(imageName)}>
                                                    <CloseIcon />
                                                </p>
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
                                                <DeleteIcon />
                                            </button>
                                        </div>
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
                                    <EditIcon />
                                </button>
                            </div>
                            <div className='titleInfo'>
                                <div className='titleBottom'>
                                    <span className='ratingSection'>
                                        <RatingIcon />
                                        {propertyData.hostProperties[0].rating}
                                    </span>
                                    <div>
                                        <span className='location'>{propertyData.hostProperties[0].location}</span>
                                    </div>
                                </div>
                                <div>
                                    <span className='titleShareSave'>
                                        <ShareIcon />
                                        <span>Share</span>
                                    </span>
                                    <span className='titleShareSave'>
                                        <SaveIcon />
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
                                    <RatingIcon />
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