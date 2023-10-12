import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Propertie from '../components/Propertie';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import logo from '../assets/Images/logo.png'
import logoSmall from '../assets/Images/logoSmall.png'
import '../Style/home.css';



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
    // document.body.classList.remove('hideScroll');
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

  // function handlePropertyClick(propertyData) {
  //   // Navigate to the PropertiePage and pass the property data as state
  //   navigate(`/PropertiePage/${propertyData.hostName}`, { state: { propertyData } });
  //   window.scrollTo(0, 0);
  // }

  function handlePropertyClick(propertyData) {
    // Pass startDate and endDate along with propertyData when navigating to PropertiePage
    navigate(`/PropertiePage/${propertyData.hostName}`, {
      state: {
        propertyData,
        startDate: filters.startDate,
        endDate: filters.endDate,
      },
    });
    window.scrollTo(0, 0);
  }
  

  function logoClick() {
    navigate(`/`);
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

    // Flatten the bookedDates arrays into a single array of date strings
    const bookedDates = property.hostProperties[0].bookedDates.flat();

    if (startDate && endDate) {
      // Convert startDate and endDate to Date objects
      const startDateObject = new Date(startDate);
      const endDateObject = new Date(endDate);

      for (let currentDate = startDateObject; currentDate <= endDateObject; currentDate.setDate(currentDate.getDate() + 1)) {
        const currentDateStr = currentDate.toISOString().split('T')[0];

        if (bookedDates.includes(currentDateStr)) {
          // Property is booked for at least one day within the date range
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



  function handleApplyFilter() {
    const filtered = properties.filter(applyFilters);
    setFilteredProperties(filtered);
  }

  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = (today.getMonth() + 1).toString();
    let day = today.getDate().toString();

    // Pad month and day with a leading zero if needed
    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }

    return `${year}-${month}-${day}`;
  }

  function formatDate(dateStr) {
    if (dateStr) {
      const date = new Date(dateStr);
      date.setDate(date.getDate() + 1); // Add one day to adjust for the time zone
      const month = date.toLocaleString('default', { month: 'short' });
      const day = date.getDate();
      return `${month}. ${day}`;
    }
    return '';
  }


  const formattedStartDate = filters.startDate ? formatDate(filters.startDate) : '';
  const formattedEndDate = filters.endDate ? formatDate(filters.endDate) : '';


  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => {
    setIsFocused(true);
    inputRef.current.click(); // Trigger a click event to open the date picker
  };

  const handleBlur = () => {
    setIsFocused(false);
  };





  return (
    <>
      <div className='homeWrapper'>
        <header>

          <div className='headerTop'>
            <div className='innerHeaderTop'>
              <span onClick={logoClick} className='spanImg' id=''>
                <img className='regularLogo'  src={logo} alt="" />
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
                {/* <span>Start your Search</span> */}
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
            <Propertie
              title={property.hostProperties[0].title}
              location={property.hostProperties[0].location}
              price={property.hostProperties[0].price}
              images={property.hostProperties[0].pictures}
              rating={property.hostProperties[0].rating}
              startDate={formattedStartDate} // Pass formatted start date
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
