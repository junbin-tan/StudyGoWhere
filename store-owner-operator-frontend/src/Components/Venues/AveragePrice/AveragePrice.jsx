import React, {useEffect} from "react";

const PriceComponent = ({ selectedAveragePrice, handleAveragePriceChange, clickable = true }) => {

  const handlePriceClick = (clickedAvgPrice) => {

    console.log("selectedAveragePrice: " + selectedAveragePrice)
    console.log("clickedAvgPrice: " + clickedAvgPrice)
    if (selectedAveragePrice !== clickedAvgPrice) {
        handleAveragePriceChange(clickedAvgPrice);
    }
  }

  // useEffect(() => { // just for testing, because my venue currentyl has no value for averagePrice
  //   if (selectedAveragePrice == undefined) {
  //       setSelectedAveragePrice(1);
  //   }
  // })

  return (
    <div>
      {[1, 2, 3, 4, 5].map((avgPrice, index) => (
        <span
          key={index}
          onClick={clickable ? () => handlePriceClick(avgPrice) : null}
          className={selectedAveragePrice >= avgPrice ? "ap-selected" :
              clickable ? "ap" : "ap-no-hover"} // quick & dirty fix to stop the change in color on hover
        >
          $
        </span>
      ))}
    </div>
  );
};

export default PriceComponent;
