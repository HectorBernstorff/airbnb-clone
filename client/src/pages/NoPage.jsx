import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NoPage() {
  const [johnDoeProperty, setJohnDoeProperty] = useState(null);

  useEffect(() => {
    // Make an HTTP GET request to fetch property data
    axios.get('http://localhost:5000/properties') // Replace with the correct endpoint
      .then((response) => {
        // Find the property owned by "John Doe"
        const johnDoeHost = response.data.hosts.find(host => host.hostName === "John Doe");
        if (johnDoeHost && johnDoeHost.hostProperties.length > 0) {
          // Assuming John Doe has only one property, you can access it here
          const johnDoeProperty = johnDoeHost.hostProperties[0];
          setJohnDoeProperty(johnDoeProperty);
        }
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
      });
  }, []);

  return (
    <div>
      {johnDoeProperty ? (
        <>
          <h2 className='title'>{johnDoeProperty.title}</h2>
          <span className='location'>{johnDoeProperty.location}</span>
          <span className='guest'>{johnDoeProperty.guests} guests</span>
          <span className='bedroom'>{johnDoeProperty.bedrooms} bedrooms</span>
          <span className='bed'>{johnDoeProperty.beds} beds</span>
          <span className='bath'>{johnDoeProperty.baths} baths</span>
          <span className='description'>{johnDoeProperty.description}</span>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
