const CFT_SelectedFields = {
        empty: {
            venueName: false,
            address: false, // need to handle this specially to copy info wholesale
            phoneNumber: false,
            description: false,
            images: false, // need to duplicate on firebase end as well
            displayImagePath: false, // implementation is kinda crazy, need to make sure the display image isnt duplicated if user ticks both images and display image
            amenities: false,
            averagePrice: false,
            businessHours: false, // also copy wholesale
        },
}

export default CFT_SelectedFields