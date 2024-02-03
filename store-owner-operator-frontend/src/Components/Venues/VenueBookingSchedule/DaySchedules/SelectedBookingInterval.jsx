import AvailabilityPeriodClassSets from "./AvailabilityPeriodClassSets";
export default function SelectedBookingInterval({
  children,
  intervalStartGrid = 1,
  intervalEndGrid = 1,
}) {
  // i'll have the styles here, sorry Varrene
  // too lazy to abstract it out to a master classSet file, we have 1 day left xD
  return (
    <button
      key={intervalStartGrid}
      className={" bg-custom-yellow opacity-50 rounded" + " overflow-visible "}
      style={{
        gridColumnStart: intervalStartGrid,
        gridColumnEnd: intervalEndGrid,
      }}
    >
      {/* <p> Booking id? idk </p> */}
      {children}
    </button>
  );
}
