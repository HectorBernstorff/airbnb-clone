import '../Style/PropertiePage.css';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useParams } from 'react-router-dom';


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
