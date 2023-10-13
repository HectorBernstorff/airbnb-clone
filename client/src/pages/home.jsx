import React, { useState, useEffect, useRef } from 'react'; // Import React and required hooks
import axios from 'axios'; // Import Axios for making HTTP requests
import Property from '../components/Property'; // Import the Propertie component
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook for navigation
import logo from '../assets/Images/logo.png'; // Import the logo image
import logoSmall from '../assets/Images/logoSmall.png'; // Import the smaller logo image
import '../styles/home.css'; // Import the Home component's CSS
import {ReactComponent as reactLogo} from '../assets/react.svg'

function Home() {
  // State variables for managing properties and filters
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const navigate = useNavigate();
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

  // Fetch properties data from the server on component mount
  useEffect(() => {
    axios.get('http://localhost:5000/properties') // Replace with the correct endpoint
      .then((response) => {
        setProperties(response.data.hosts);
        setFilteredProperties(response.data.hosts); // Initialize filteredProperties with all properties
      })
      .catch((error) => {
        console.error('Error fetching property data:', error);
      });
  }, []);

  // Handle clicking on a property card to navigate to the property details page
  function handlePropertyClick(propertyData) {
    navigate(`/PropertiePage/${propertyData.hostName}`, {
      state: {
        propertyData,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    });
    window.scrollTo(0, 0);
  }

  // Handle logo click to navigate to the homepage
  function logoClick() {
    navigate(`/`);
  }

  // Handle filter input changes
  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  }

  // Function to apply filters to the property list
  function applyFilters(property) {
    // Destructure filter values
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
    const bookedDates = property.hostProperties[0].bookedDates.flat();

    if (startDate && endDate) {
      const startDateObject = new Date(startDate);
      const endDateObject = new Date(endDate);

      for (let currentDate = startDateObject; currentDate <= endDateObject; currentDate.setDate(currentDate.getDate() + 1)) {
        const currentDateStr = currentDate.toISOString().split('T')[0];

        if (bookedDates.includes(currentDateStr)) {
          return false;
        }
      }
    }

    return (
      property.hostProperties[0].title.toLowerCase().includes(title.toLowerCase()) &&
      property.hostProperties[0].location.toLowerCase().includes(location.toLowerCase()) &&
      String(property.hostProperties[0].guests).includes(guests) &&
      String(property.hostProperties[0].bedrooms).includes(bedrooms) &&
      String(property.hostProperties[0].beds).includes(beds) &&
      String(property.hostProperties[0].baths).includes(baths) &&
      (!minPrice || propertyPrice >= parseFloat(minPrice)) &&
      (!maxPrice || propertyPrice <= parseFloat(maxPrice))
    );
  }

  // Handle applying filters
  function handleApplyFilter() {
    const filtered = properties.filter(applyFilters);
    setFilteredProperties(filtered);
  }

  // Get today's date in the format 'YYYY-MM-DD'
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();

    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  // Format a date string to 'Month DD' format
  function formatDate(dateStr) {
    if (dateStr) {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + 1);
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${month}. ${day}`;
    }
    return '';
  }

  // Format start and end dates for display
  const formattedStartDate = filters.startDate ? formatDate(filters.startDate) : '';
  const formattedEndDate = filters.endDate ? formatDate(filters.endDate) : '';

  return (
    <>
    <div>{reactLogo}</div>
      <div className='homeWrapper'>
        <header>
          <div className='headerTop'>
            <div className='innerHeaderTop'>
              <span onClick={logoClick} className='spanImg' id=''>
                <img className='regularLogo' src={logo} alt="" />
                <img className='smallerLogo' src={logoSmall} alt="" />
              </span>
              <div className='searchWrapper'>
                <div id='search'>
                  <div className='fields' id='locationSection'>
                    <label htmlFor="">Where</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="Search destinations"
                      value={filters.location}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className='fields'>
                    <label htmlFor="">Check in</label>
                    <input
                      type='date'
                      name="startDate"
                      placeholder="Start Date"
                      value={filters.startDate}
                      min={getTodayDate()}
                      onChange={handleFilterChange}
                    />
                  </div>
                  <div className='fields'>
                    <label htmlFor="">Check out</label>
                    <input
                      type="date"
                      name="endDate"
                      placeholder="End Date"
                      value={filters.endDate}
                      min={getTodayDate()}
                      onChange={handleFilterChange}
                    />
                  </div>
                </div>
                <button onClick={handleApplyFilter}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </button>
              </div>
              <div className='profileSection'>
              <div className='hideElement'>
                  <span>Airbnb your home</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <div className='profileWrapper'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                  <svg id='profileSVG' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <hr />
        </header>
        <main>
          {filteredProperties.map((property, index) => (
            <Property
              title={property.hostProperties[0].title}
              location={property.hostProperties[0].location}
              price={property.hostProperties[0].price}
              images={property.hostProperties[0].pictures}
              rating={property.hostProperties[0].rating}
              startDate={formattedStartDate}
              endDate={formattedEndDate}
              onClickFunction={() => handlePropertyClick(property)}
            />
          ))}
        </main>
        <footer></footer>
      </div>
    </>
  );
}

export default Home;
