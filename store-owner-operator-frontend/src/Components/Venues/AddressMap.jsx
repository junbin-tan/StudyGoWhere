import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import React, {useState} from 'react';

const defaultContainerStyle = {
  width: "50%",
  height: "600px",
};

const defaultCenter = {
  lat: 1.3521,
  lng: 103.8198
};

function AddressMap({containerStyle=defaultContainerStyle, selectedLatLng=defaultCenter,
                    setSelectedLatLng, draggable=true}) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
  
    // we can also set these in the GoogleMap props (it actually is set alrd)
    // but the example code (& gpt code) came with this so im keeping it
    // they say this is for clearer debugging & more complex if-else settings of props
    
    // these list down coordinates for determining the "bounds" of the map
    // const centerBounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(centerBounds);
    
    console.log("onLoad called")
    map.setCenter(selectedLatLng)
    map.setZoom(12)

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
          className=""
        mapContainerStyle={containerStyle}
        center={selectedLatLng}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <MarkerF
            // onLoad={onMarkerLoad}
            // Do not use onLoad for markers, this shit bugs stuff out even if the onload method is legit
            position={selectedLatLng}
            draggable={draggable}
            onDragEnd={(mapMouseEvent) => {
              console.log(mapMouseEvent.latLng);
              setSelectedLatLng({
                  lat: mapMouseEvent.latLng.lat(),
                  lng: mapMouseEvent.latLng.lng()
              });
            }}/>
      {/*    In google API, they have getters instead of the actual attributes, so have to make a new object */}
      </GoogleMap>
  ) : <></>
}

export default React.memo(AddressMap)