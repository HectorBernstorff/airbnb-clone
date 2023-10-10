import React, { Component } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

class MapContainer extends Component {
  render() {
    const { google, properties } = this.props;

    return (
      <Map
        google={google}
        zoom={10}
        initialCenter={{
          lat: 45.5017, // Replace with your initial latitude
          lng: -73.5673, // Replace with your initial longitude
        }}
      >
        {properties.map((property, index) => (
          <Marker
            key={index}
            position={{
              lat: parseFloat(property.hostProperties[0].latitude),
              lng: parseFloat(property.hostProperties[0].longitude),
            }}
          />
        ))}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBzDdIC9UxGveoyzvDFluOemP3SqZjcdqc',
})(MapContainer);
