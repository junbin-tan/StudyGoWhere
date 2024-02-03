const BookingUtility = {
    numberToDayOfWeek: (number) => {
        const daysOfWeek = ["mon", "tue", "ted", "thu", "fri", "sat", "sun"];
        if (number >= 0 && number < daysOfWeek.length) {
            return daysOfWeek[number];
        } else {
            return "Invalid day";
        }
    },

}

export default BookingUtility;

