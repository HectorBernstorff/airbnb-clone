import '../Style/PropertiePage.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
// import { useParams } from 'react-router-dom';


export default function PropertiePage() {
    const location = useLocation();
    const [isEditMode, setIsEditMode] = useState(false);
    const [propertyData, setPropertyData] = useState(location.state.propertyData);
    // const { hostName } = useParams();
    const [title, setTitle] = useState(propertyData.hostProperties[0].title);
    const [locations, setLocation] = useState(propertyData.hostProperties[0].location);
    const [guests, setGuests] = useState(propertyData.hostProperties[0].guests);
    const [bedrooms, setBedrooms] = useState(propertyData.hostProperties[0].bedrooms);
    const [beds, setBeds] = useState(propertyData.hostProperties[0].beds);
    const [baths, setBaths] = useState(propertyData.hostProperties[0].baths);
    const [price, setPrice] = useState(propertyData.hostProperties[0].price);
    const [description, setDescription] = useState(propertyData.hostProperties[0].description);
    



    useEffect(() => {
        // Carregue os dados do servidor quando o componente for montado
        if (propertyData) {
            // Load data only if propertyData is defined
            fetchData();
        }
    }, [propertyData]);

    const fetchData = async () => {
        try {
            const response = await fetch('/data');
            const data = await response.json();
            setPropertyData(data); // Fix the typo here
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
            await axios.post('http://localhost:5000/updateProperty', updatedPropertyData);
    
            // Update the local propertyData state with the new values
            setPropertyData(updatedPropertyData);
    
            // Disable edit mode
            setIsEditMode(false);
        } catch (error) {
            console.error('Error updating property data:', error);
        }
    };
    
    
    
    
    
    

    const handleCancel = () => {
        // Recarregue os dados originais ou desative o modo de edição sem salvar
        fetchData();
        setIsEditMode(false);
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
                                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Location</label>
                                    <input type="text" value={locations} onChange={(e) => setLocation(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Guest</label>
                                    <input type="text" value={guests} onChange={(e) => setGuests(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Bedroom</label>
                                    <input type="text" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Bed</label>
                                    <input type="text" value={beds} onChange={(e) => setBeds(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Bath</label>
                                    <input type="text" value={baths} onChange={(e) => setBaths(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Price</label>
                                    <input type="text" value={price} onChange={(e) => setPrice(e.target.value)}/>
                                </div>
                                <div>
                                    <label htmlFor="">Description</label>
                                    <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}/>
                                </div>

                                <button onClick={() => handleSave(propertyData.hostName, propertyData.hostProperties[0].title)}>Salvar</button>



                                <button onClick={handleCancel}>Cancelar</button>

                            </div>
                        </div>

                    </>
                ) : (
                    <button onClick={handleEdit}>Editar</button>
                )}
            </div>

            <h2 className='title'>{propertyData.hostProperties[0].title}</h2>

            <span className='location'>{propertyData.hostProperties[0].location}</span>

            <span className='guest'>{propertyData.hostProperties[0].guests} guests</span>

            <span className='bedroom'>{propertyData.hostProperties[0].bedrooms} bedrooms</span>

            <span className='bed'>{propertyData.hostProperties[0].beds} beds</span>

            <span className='bath'>{propertyData.hostProperties[0].baths} baths</span>

            <span className='description'>{propertyData.hostProperties[0].description}</span>

            <span>${propertyData.hostProperties[0].price} CAD night</span>

        </>
    )
}
{/* <div className='propertire-main'>
    <div className='propertieTitle'>

        <h2 className='title'>{propertyData.hostProperties[0].title}</h2>

        <div className='titleInfo'>
            <div>
                <div>
                    <span>*</span>
                    <span>4.92</span>
                    <span>12 reviews</span>
                </div>
                <div>
                    <span>*</span>
                    <span>Superhost</span>
                </div>
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
        <div className='propertie-image-grid'>
            <img className='propertie-image-grid-col-2 propertie-image-grid-row-2' src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
        </div>
    </div>
</div>

<div className='descriptions'>
    <div>
        <div>
            <h3>Entire cottage hosted by Yanis</h3>
            <div>
                <span className='guest'>{propertyData.hostProperties[0].guest} guests</span>
                <span className='bedroom'>{propertyData.hostProperties[0].bedroom} bedrooms</span>
                <span className='bed'>{propertyData.hostProperties[0].bed} beds</span>
                <span className='bath'>{propertyData.hostProperties[0].bath} baths</span>
            </div>
            <div>
                <span>Picure</span>
            </div>
        </div>
        <hr />
        <div>
            <div>
                <span>*</span>
                <div>
                    <span>Dedicated workspace</span>
                    <span>A common area with wifi that’s well suited for working.</span>
                </div>
            </div>
            <div>
                <span>*</span>
                <div>
                    <span>Self check-in</span>
                    <span>Check yourself in with the smartlock.</span>
                </div>
            </div>
            <div>
                <span>*</span>
                <div>
                    <span>Yanis is a Superhost</span>
                    <span>Superhosts are experienced, highly rated Hosts.</span>
                </div>
            </div>
        </div>
        <hr />
        <div>
            <span className='description'>
            {propertyData.hostProperties[0].description}
            </span>
        </div>
        <hr />
    </div>

    <div className='priceDetails'>
        <div>
            <div>
                <span>$228 CAD</span>
                <span>night</span>
            </div>
            <div>
                <div>
                    <span>*</span>
                    <span>4.92</span>
                </div>
                <div>
                    <span>12 Reviwes</span>
                </div>
            </div>
        </div>

        <div className='dateDetails'>
            <div>
                <div>
                    <span>Checkin</span>
                    <span>10-23-2023</span>
                </div>
                <hr />
                <div>
                    <span>Checkout</span>
                    <span>10-28-2023</span>
                </div>
            </div>
            <hr />
            <div>
                <span>Guests</span>
                <span>1 guest</span>
            </div>
        </div>

        <span>Cencelation policies</span>
        <div className='cancelationDetails'>
            <div>
                <div>
                    <span>Non-refundable</span>
                    <span>$1,964 CAD total</span>
                </div>
                <span>*</span>
            </div>
            <hr />
            <div>
                <div>
                    <span>Non-refundable</span>
                    <span>$1,964 CAD total</span>
                </div>
                <span>*</span>
            </div>
            <span>Free cancellation before Oct. 22. Cancel before check-in on Oct. 23 for a partial refund.</span>
        </div>

        <div className='reserveSection'>
            <button>RESERVE</button>
            <span>You won't be charged yet</span>
        </div>

        <div>
            <span>Show price details</span>
        </div>
        <hr />
        <div>
            <span>total</span>
            <span>$1,964 CAD</span>
        </div>
    </div>

</div > */}
{/* <div className='propertire-main'>
    <div className='propertieTitle'>

        <h2 className='title'>{propertyData.hostProperties[0].title}</h2>

        <div className='titleInfo'>
            <div>
                <div>
                    <span>*</span>
                    <span>4.92</span>
                    <span>12 reviews</span>
                </div>
                <div>
                    <span>*</span>
                    <span>Superhost</span>
                </div>
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
        <div className='propertie-image-grid'>
            <img className='propertie-image-grid-col-2 propertie-image-grid-row-2' src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
            <img src={propertiePictures} alt='' />
        </div>
    </div>
</div>

<div className='descriptions'>
    <div>
        <div>
            <h3>Entire cottage hosted by Yanis</h3>
            <div>
                <span className='guest'>{propertyData.hostProperties[0].guest} guests</span>
                <span className='bedroom'>{propertyData.hostProperties[0].bedroom} bedrooms</span>
                <span className='bed'>{propertyData.hostProperties[0].bed} beds</span>
                <span className='bath'>{propertyData.hostProperties[0].bath} baths</span>
            </div>
            <div>
                <span>Picure</span>
            </div>
        </div>
        <hr />
        <div>
            <div>
                <span>*</span>
                <div>
                    <span>Dedicated workspace</span>
                    <span>A common area with wifi that’s well suited for working.</span>
                </div>
            </div>
            <div>
                <span>*</span>
                <div>
                    <span>Self check-in</span>
                    <span>Check yourself in with the smartlock.</span>
                </div>
            </div>
            <div>
                <span>*</span>
                <div>
                    <span>Yanis is a Superhost</span>
                    <span>Superhosts are experienced, highly rated Hosts.</span>
                </div>
            </div>
        </div>
        <hr />
        <div>
            <span className='description'>
            {propertyData.hostProperties[0].description}
            </span>
        </div>
        <hr />
    </div>

    <div className='priceDetails'>
        <div>
            <div>
                <span>$228 CAD</span>
                <span>night</span>
            </div>
            <div>
                <div>
                    <span>*</span>
                    <span>4.92</span>
                </div>
                <div>
                    <span>12 Reviwes</span>
                </div>
            </div>
        </div>

        <div className='dateDetails'>
            <div>
                <div>
                    <span>Checkin</span>
                    <span>10-23-2023</span>
                </div>
                <hr />
                <div>
                    <span>Checkout</span>
                    <span>10-28-2023</span>
                </div>
            </div>
            <hr />
            <div>
                <span>Guests</span>
                <span>1 guest</span>
            </div>
        </div>

        <span>Cencelation policies</span>
        <div className='cancelationDetails'>
            <div>
                <div>
                    <span>Non-refundable</span>
                    <span>$1,964 CAD total</span>
                </div>
                <span>*</span>
            </div>
            <hr />
            <div>
                <div>
                    <span>Non-refundable</span>
                    <span>$1,964 CAD total</span>
                </div>
                <span>*</span>
            </div>
            <span>Free cancellation before Oct. 22. Cancel before check-in on Oct. 23 for a partial refund.</span>
        </div>

        <div className='reserveSection'>
            <button>RESERVE</button>
            <span>You won't be charged yet</span>
        </div>

        <div>
            <span>Show price details</span>
        </div>
        <hr />
        <div>
            <span>total</span>
            <span>$1,964 CAD</span>
        </div>
    </div>

</div > */}