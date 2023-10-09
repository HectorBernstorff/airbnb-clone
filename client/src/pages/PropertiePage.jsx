import '../Style/PropertiePage.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import propertiePictures from '../assets/Images/BbackgroundPicture.jpg';
// import 'react-dates/initialize';
// import { SingleDatePicker } from "react-dates";
// import 'react-dates/lib/css/_datepicker.css';


export default function PropertiePage() {
    const location = useLocation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [propertyData, setPropertyData] = useState(location.state.propertyData);
    const { hostname } = useParams();
    const [title, setTitle] = useState(propertyData.hostProperties[0].title);
    const [locations, setLocation] = useState(propertyData.hostProperties[0].location);
    const [guests, setGuests] = useState(propertyData.hostProperties[0].guests);
    const [bedrooms, setBedrooms] = useState(propertyData.hostProperties[0].bedrooms);
    const [beds, setBeds] = useState(propertyData.hostProperties[0].beds);
    const [baths, setBaths] = useState(propertyData.hostProperties[0].baths);
    const [price, setPrice] = useState(propertyData.hostProperties[0].price);
    const [description, setDescription] = useState(propertyData.hostProperties[0].description);
    const bookedDates = propertyData.hostProperties[0].bookedDates.flat();
    const disabledDates = bookedDates.map(dateStr => new Date(dateStr));
    const [selectedDate, setSelectedDate] = useState('');
    const [imageFileNames, setImageFileNames] = useState(propertyData.hostProperties[0].pictures);


    const isDateDisabled = (date) => {
        const selectedDate = new Date(date);
        return disabledDates.some(disabledDate => (
            selectedDate.getFullYear() === disabledDate.getFullYear() &&
            selectedDate.getMonth() === disabledDate.getMonth() &&
            selectedDate.getDate() === disabledDate.getDate()
        ));
    };





    useEffect(() => {
        // Carregue os dados do servidor quando o componente for montado
        if (propertyData) {
            // Load data only if propertyData is defined
            fetchData();
        }
    }, [propertyData]);

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/properties/${hostname}`); // Update the endpoint to accept the hostname
            const data = response.data;
            setPropertyData(data);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };



    const handleEdit = () => {
        setIsEditMode(true);
    };

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








    const handleCancel = () => {
        // Recarregue os dados originais ou desative o modo de edição sem salvar
        fetchData();
        setIsEditMode(false);
    };


    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('uploadedFile', file);

        try {
            await axios.post(`http://localhost:5000/upload/${hostname}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <>
            <Header />
            <div>
                {isEditMode ? (
                    <>
                        <div className='editWrapper'>
                            <div className='box'>
                                <div>
                                    <label htmlFor="">Title</label>
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Location</label>
                                    <input type="text" value={locations} onChange={(e) => setLocation(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Guest</label>
                                    <input type="text" value={guests} onChange={(e) => setGuests(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Bedroom</label>
                                    <input type="text" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Bed</label>
                                    <input type="text" value={beds} onChange={(e) => setBeds(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Bath</label>
                                    <input type="text" value={baths} onChange={(e) => setBaths(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Price</label>
                                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
                                </div>
                                <div>
                                    <label htmlFor="">Description</label>
                                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                <div>
                                    <input type="file" onChange={handleFileChange} />
                                    {/* <button onClick={handleSubmit}>Upload</button> */}
                                </div>
                                <button  onClick={() => handleSave(propertyData.hostName, propertyData.hostProperties[0].title)}>Salvar</button>
                                <button onClick={handleCancel}>Cancelar</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <button onClick={handleEdit}>Editar</button>
                )}
            </div>

            <div className='propertyWrapper'>

                <div className='propertire-main'>
                    <div className='propertieTitle'>
                        <h2 className='title'>{propertyData.hostProperties[0].title}</h2>
                        <div className='titleInfo'>
                            <div>
                                <div>
                                    <span className='location'>{propertyData.hostProperties[0].location}</span>
                                </div>
                            </div>
                            <div>
                                <div>
                                    <span>*</span>
                                    <span>Share</span>
                                </div>
                                <div>
                                    <span>*</span>
                                    <span>Save</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='propertie-image-grid-wrapper'>
                        {/* <div className='propertie-image-grid'>
                            <img className='propertie-image-grid-col-2 propertie-image-grid-row-2' src={propertiePictures} alt='' />
                            <img src={propertiePictures} alt='' />
                            <img src={propertiePictures} alt='' />
                            <img src={propertiePictures} alt='' />
                            <img src={propertiePictures} alt='' />
                        </div> */}

                        <div className='propertie-image-grid'>
                            {imageFileNames.map((imageName, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:5000/uploads/${imageName}`}
                                    alt={`Property Image ${index + 1}`}
                                />
                            ))}
                        </div>





                    </div>
                </div>
                <div className='infosWrapper'>
                    <div className='description'>
                        <div className='infoBelow'>
                            <h3>Entire cottage hosted by {hostname}</h3>
                            <span className='guest'>{propertyData.hostProperties[0].guests} guests</span>
                            <span>·</span>
                            <span className='bedroom'>{propertyData.hostProperties[0].bedrooms} bedrooms</span>
                            <span>·</span>
                            <span className='bed'>{propertyData.hostProperties[0].beds} beds</span>
                            <span>·</span>
                            <span className='bath'>{propertyData.hostProperties[0].baths} baths</span>
                        </div>
                        <hr />
                        <div>
                            <span className=''>
                                {propertyData.hostProperties[0].description}
                                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?
                            </span>
                        </div>
                    </div>
                    <div className='priceDetails'>
                        <div className='priceTitle'>
                            <div><span className='priceNight'>${propertyData.hostProperties[0].price} CAD </span><span>night</span></div>
                            <span className='rating'>{propertyData.hostProperties[0].rating}</span>
                        </div>
                        <div className='dateDetails'>
                            <div>
                                <div id='borderLeft' className='lineBreak'>
                                    <span>Checkin</span>
                                    <span>10-23-2023</span>

                                </div>
                                <div id='borderRight' className='lineBreak'>
                                    <span>Checkout</span>
                                    <span>10-28-2023</span>
                                </div>
                            </div>
                            <div id='borderBottom' className='lineBreak'>
                                <span>Guests</span>
                                <span>1 guest</span>
                            </div>

                        </div>

                        <div className='reserveSection'>
                            <button>RESERVE</button>
                            <span>You won't be charged yet</span>
                        </div>
                        <hr />
                        <div className='priceTotal'>
                            <span>Total</span>
                            <span>$1,964 CAD</span>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}
