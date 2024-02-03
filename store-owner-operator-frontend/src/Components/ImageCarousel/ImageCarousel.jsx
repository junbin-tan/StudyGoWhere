import React, { useState, useEffect } from 'react';
import Carousel from 'react-material-ui-carousel'
import FirebaseFunctions from "../../FunctionsAndContexts/FirebaseFunctions";

export default function ImageCarousel({downloadURLs, emptyMessage = "No images uploaded!"})
{

    // useEffect(() => {
    //     FirebaseFunctions.convertPathsToDownloadURLs(venueImageRelativePaths)
    //         .then((downloadURLs) => {
    //             setDownloadURLs(downloadURLs)
    //             console.log("DOWNLOAD URLS IS ", downloadURLs);
    //         });
    // }, [venueImageRelativePaths])

    // do we want to assume this is loading or they have no images? hmmm...
    if (!downloadURLs) return (<div>Loading...</div>)
    else if (downloadURLs.length == 0) return (<div> {emptyMessage} </div>)

    return (
        <Carousel autoPlay={false} animation='slide' navButtonsProps={{style: { backgroundColor: "rgba(200,174,125,1)"}, height: "100%"}}
                  navButtonsAlwaysVisible>
            {
                downloadURLs.map((url, i) => <Item key={i} item={{url}} /> )
            }
        </Carousel>
    )
}

// item is to make stuff more extensible i guess, can include other info about each individual image
function Item({item})
{
    return (
        <div className='text-center'>
            {/* <h2>{props.item.name}</h2> */}
            <img className="max-h-96 mx-auto" src={item.url} alt="Image"/>
        </div>
    )
}
