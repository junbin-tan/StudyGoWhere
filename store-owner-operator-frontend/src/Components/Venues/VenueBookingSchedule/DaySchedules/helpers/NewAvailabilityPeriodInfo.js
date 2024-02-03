const NewAvailabilityPeriodInfo = {
    defaultFormConstructor: (basePrice, pricePerHalfHour) => {
        return {
            id: null,
            numAvailable: 0,
            fromTime: null,
            toTime: null,
            overrideDefaultPrice: false,
            basePrice: basePrice,
            pricePerHalfHour: pricePerHalfHour,
        }
    },

    defaultFormErrorsObject: {
        id: false,
        numAvailable: false,
        fromTime: false,
        toTime: false,
        overrideDefaultPrice: false,
        basePrice: false,
        pricePerHalfHour: false,
    },

}

export default NewAvailabilityPeriodInfo;