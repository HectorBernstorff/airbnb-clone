import React from 'react';
import logo from '../assets/Images/logo.png'
import '../Style/header.css'
import { useNavigate } from 'react-router-dom';

export default function Header(props) {

    const handleApplyFilter = () => {
        props.onButtonClick();
    };

    const navigate = useNavigate();
    
    function logoClick() {
        navigate(`/`);
      }
    
    return (
        <>

        
            <header>
                <div className='headerTop'>
                    <div className='innerHeaderTop'>
                        <span onClick={logoClick} className='spanImg'><img src={logo} alt="" /></span>
                        {/* <div className='searchWrapper'>
                            <div>
                                <span><input type="text" name="" id="" placeholder='Anywhere' /></span>
                                <hr />
                                <span><input type="text" name="" id="" placeholder='Any week' /></span>
                                <hr />
                                <span><input type="text" name="" id="" placeholder='Add guests' /></span>
                            </div>

                            <button onClick={handleApplyFilter}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>

                            </button>
                        </div> */}
                        <div className='profileSection'>
                            <span>Airbnb your home</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                            </svg>

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



                {/* <div className='navBar'>
                    <div className='innerNavBar'>
                        <button>--</button>
                        <div className='items'>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                            <span>Cabins</span>
                        </div>
                        <button>++</button>
                        <button>
                            <span>icon</span>
                            <span>Filters</span>
                        </button>
                    </div>

                </div> */}
            <hr />
            </header>
        </>
    );
}
