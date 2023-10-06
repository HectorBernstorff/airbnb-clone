import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import Propertie from '../components/Propertie';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

// ...

function Home() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    title: '',
    location: '',
    guests: '',
    bedrooms: '',
    beds: '',
    baths: '',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
  });
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Make an HTTP GET request to fetch property data
    axios.get('http://localhost:5000/properties') // Replace with the correct endpoint
      .then((response) => {
        // Set the properties from the response data
        setProperties(response.data.hosts);
        setFilteredProperties(response.data.hosts); // Initialize filteredProperties with all properties
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
      });
  }, []);

  function handlePropertyClick(propertyData) {
    // Navigate to the PropertiePage and pass the property data as state
    navigate(`/PropertiePage/${propertyData.hostName}`, { state: { propertyData } });
  }

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  }

  function applyFilters(property) {
    const {
      title,
      location,
      guests,
      bedrooms,
      beds,
      baths,
      minPrice,
      maxPrice,
      startDate,
      endDate,
    } = filters;

    const propertyPrice = parseFloat(property.hostProperties[0].price);

    // Check if the property matches the date criteria
    const bookedDates = property.hostProperties[0].bookedDates;
    const isAvailable = !bookedDates.some((bookedDate) => {
      return (
        (startDate && endDate && (
          bookedDate >= startDate && bookedDate <= endDate
        )) ||
        (startDate && !endDate && bookedDate >= startDate) ||
        (!startDate && endDate && bookedDate <= endDate)
      );
    });

    return (
      property.hostProperties[0].title.toLowerCase().includes(title.toLowerCase()) &&
      property.hostProperties[0].location.toLowerCase().includes(location.toLowerCase()) &&
      String(property.hostProperties[0].guests).includes(guests) &&
      String(property.hostProperties[0].bedrooms).includes(bedrooms) &&
      String(property.hostProperties[0].beds).includes(beds) &&
      String(property.hostProperties[0].baths).includes(baths) &&
      (!minPrice || propertyPrice >= parseFloat(minPrice)) &&
      (!maxPrice || propertyPrice <= parseFloat(maxPrice)) &&
      isAvailable
    );
  }

  function handleApplyFilter() {
    const filtered = properties.filter(applyFilters);
    setFilteredProperties(filtered);
  }

  return (
    <>
      <Header />
      <main>
        <div className="filters">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={filters.title}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={filters.location}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="guests"
            placeholder="Guests"
            value={filters.guests}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="bedrooms"
            placeholder="Bedrooms"
            value={filters.bedrooms}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="beds"
            placeholder="Beds"
            value={filters.beds}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="baths"
            placeholder="Baths"
            value={filters.baths}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="minPrice"
            placeholder="Min Price"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <input
            type="text"
            name="maxPrice"
            placeholder="Max Price"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
          <button onClick={handleApplyFilter}>Apply Filter</button>
        </div>
        {filteredProperties.map((property, index) => (
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
