import AvailabilityPeriodClassSets from "./AvailabilityPeriodClassSets";

export default function NewAvailabilityPeriodInterval({children, availabilityPeriod,
                                                       intervalStartGrid = 1,
                                                       intervalEndGrid = 1,
                                                       colorOne="snow", colorTwo="papayawhip"}) {

    return (<button key={intervalStartGrid}
                    className={AvailabilityPeriodClassSets.primary +
                        " overflow-visible "
                        // `col-[span_${intervalUnits}]`
                        // "col-[span_8]"
                        // `col-[span_${intervalUnits}]`
                        // `${colStartAndEndClass}`
                    }
                    style={ {gridColumnStart: intervalStartGrid, gridColumnEnd: intervalEndGrid} }
    >
        {/*{console.log("intervalLength", intervalLength)}*/}
        {/*<p> New Period </p>*/}
    </button>)
}
