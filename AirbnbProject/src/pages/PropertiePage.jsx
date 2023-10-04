import '../Style/PropertiePage.css';
import propertiePictures from '../assets/Images/BbackgroundPicture.jpg'
import Header from '../components/Header'

export default function PropertiePage() {
    return (
        <>
            <Header />
            <div className='propertire-main'>
                <div className='propertieTitle'>
                    <h2>Private Hot tub, Sauna, 5 min walk Lake, Free pool</h2>
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
                                <span>Mille-Isles, Quebec, Canada</span>
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

            <div className='description'>
                <div>
                    <div>
                        <h3>Entire cottage hosted by Yanis</h3>
                        <div>
                            <span>12 guests</span>
                            <span>4 bedrooms</span>
                            <span>8 beds</span>
                            <span>3 baths</span>
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
                        <span>Some info has been automatically translated. Show original language</span>
                        <span>Discover the stunning Laurentians this summer with unforgettable outdoor adventures at Chalet Heimsgard!!</span>
                        <span>-Exclusive, year-round access to our chalet's private sauna and spa.</span>
                        <span>-Fiddler Lake is a haven for water sports enthusiasts(3 minutes).</span>
                        <span>Show more...</span>
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

            </div>
        </>
    )
}