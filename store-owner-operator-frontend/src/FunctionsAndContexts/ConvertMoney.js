const ConvertMoney = {
    centsToDollars: (cents) => {
        return (cents / 100).toFixed(2);
    },

    dollarsToCents: (dollars) => {
        return (dollars * 100).toFixed(0);
    }
}

export default ConvertMoney;