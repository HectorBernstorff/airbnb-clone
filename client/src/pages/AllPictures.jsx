import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/AllPictures.css'
import { useNavigate } from 'react-router-dom';

const AllPictures = () => {
    const location = useLocation();
    const [propertyData, setPropertyData] = useState(location.state.propertyData);
    const { hostname } = useParams();
    const [imageFileNames, setImageFileNames] = useState(propertyData.hostProperties[0].pictures);
    const navigate = useNavigate();

    useEffect(() => {
        if (propertyData) {
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
    return (
        <>
            <div className='allPicturesGrid'>
                <button onClick={() => navigate(-1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>

                </button>
                <div className='innerAllPicturesGrid'>
                    {imageFileNames.map((imageName, index) => (
                        <img
                            key={index}
                            src={`http://localhost:5000/uploads/${imageName}`}
                            alt={`Property Image ${index + 1}`
                            }
                        />
                    ))}
                </div>

            </div>
        </>

    );
};

export default AllPictures;
