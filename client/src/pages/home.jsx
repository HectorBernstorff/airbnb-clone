import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import Propertie from '../components/Propertie';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// ...

function Home() {
  const [properties, setProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Make an HTTP GET request to fetch property data
    axios.get('http://localhost:5000/properties') // Replace with the correct endpoint
      .then((response) => {
        // Set the properties from the response data
        setProperties(response.data.hosts);
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
      });
  }, []);

  function handlePropertyClick(propertyData) {
    // Navigate to the PropertiePage and pass the property data as state
    navigate(`/PropertiePage/${propertyData.hostName}`, { state: { propertyData } });
  }

  return (
    <>
      <Header />
      <main>
        {properties.map((property, index) => (
          <a key={index} onClick={() => handlePropertyClick(property)}>
            <Propertie title={property.hostProperties[0].title} location={property.hostProperties[0].location} price={property.hostProperties[0].price} />
          </a>
        ))}
      </main>
      <footer></footer>
    </>
  );
}

export default Home;

