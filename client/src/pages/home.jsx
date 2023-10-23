import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Property from '../components/Property';
import logo from '../assets/Images/logo.png';
import logoSmall from '../assets/Images/logoSmall.png';
import '../styles/home.css';
import SearchIcon from '../assets/svg/SearchIcon';
import GlobeIcon from '../assets/svg/GlobeIcon'
import MenuIcon from '../assets/svg/MenuIcon';
import ProfileIcon from '../assets/svg/ProfileIcon';

function Home() {
    const navigate = useNavigate();

    // State variables for managing properties and filters
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        startDate: '',
        endDate: '',
    });

    // Destructure filter values
    const { location, startDate, endDate } = filters;

    // Format start and end dates for display
    const formattedStartDate = filters.startDate ? formatDate(filters.startDate) : '';
    const formattedEndDate = filters.endDate ? formatDate(filters.endDate) : '';

    // Fetch properties data from the server on component mount
    useEffect(() => {
        axios.get('http://localhost:5000/properties')
            .then((response) => {
                setProperties(response.data.hosts);
                setFilteredProperties(response.data.hosts);
            })
            .catch((error) => {
                console.error('Error fetching property data:', error);
            });
    }, []);

    // Function to apply filters to the property list
    function applyFilters(property) {
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
        return property.hostProperties[0].location.toLowerCase().includes(location.toLowerCase());
    }

    // Handle applying filters
    function handleApplyFilter() {
        const filtered = properties.filter(applyFilters);
        setFilteredProperties(filtered);
    }

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

    // Handle filter input changes
    // It updates the 'filters' state by creating a new object that combines the
    // existing state with the changed filter property defined by 'name'.
    function handleFilterChange(event) {
        const { name, value } = event.target;
        setFilters({
            ...filters,
            [name]: value,
        });
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

    // Handle logo click to navigate to the homepage
    function logoClick() {
        navigate(`/`);
    }

    return (
        <div className="homeWrapper">
            <header>
                <div className="headerTop">
                    <div className="innerHeaderTop">
                        <span onClick={logoClick} className="spanImg">
                            <img className="regularLogo" src={logo} alt="" />
                            <img className="smallerLogo" src={logoSmall} alt="" />
                        </span>
                        <div className="searchWrapper">
                            <div id="search">
                                <div className="fields" id="locationSection">
                                    <label htmlFor="location">Where</label>
                                    <input
                                        id="location"
                                        type="text"
                                        name="location"
                                        placeholder="Search destinations"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="fields">
                                    <label htmlFor="checkIn">Check in</label>
                                    <input
                                        id="checkIn"
                                        type="date"
                                        name="startDate"
                                        placeholder="Start Date"
                                        value={filters.startDate}
                                        min={getTodayDate()}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                                <div className="fields">
                                    <label htmlFor="checkOut">Check out</label>
                                    <input
                                        id="checkOut"
                                        type="date"
                                        name="endDate"
                                        placeholder="End Date"
                                        value={filters.endDate}
                                        min={getTodayDate()}
                                        onChange={handleFilterChange}
                                    />
                                </div>
                            </div>
                            <button onClick={handleApplyFilter}><SearchIcon /></button>
                        </div>
                        <div className="profileSection">
                            <div className="hideElement">
                                <span>Airbnb your home</span>
                                <GlobeIcon />
                            </div>
                            <div className="profileWrapper">
                                <MenuIcon />
                                <ProfileIcon />
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
            </header>
            <main>
                {filteredProperties.map((property, index) => (
                    <Property
                        key={index}
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
    );
}

export default Home;
