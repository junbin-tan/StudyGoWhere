import { Card, Typography } from "@mui/material";
import React from "react";
import CustomButton from "../../utilities/CustomButton";

const OrderCard = (props) => {
  const { username, items, transactionId, handleCompletion } = props;

  return (
    <>
      <Card
        className="border border-gray-300 rounded-md p-4 flex flex-col justify-between h-full"
        key={transactionId}
      >
        <div className="flex justify-between items-center">
          <h2 className="m-3">
            Order ID:{" "}
            <span className="text-2xl font-bold">{transactionId}</span>
          </h2>
          <h2 className="m-3">
            Order made by:{" "}
            <span className="text-2xl font-bold">{username}</span>
          </h2>
        </div>
        <div className="text-center">
          <div className="flex text-center">
            <p className="w-1/5 underline text-xl">Qty</p>
            <p className="w-4/5 underline text-xl">Item</p>
          </div>
          {items.map((item) => {
            return (
              <div className="flex text-center">
                <p className="w-1/5 text-xl">{item.quantity}</p>
                <p className="w-4/5 text-xl">{item.menuItemName}</p>
              </div>
            );
          })}
        </div>
        <div className="flex-grow"></div>
        <div className="m-6 text-center flex-end">
          <CustomButton
            label={"Complete"}
            onClick={() => {
              handleCompletion(transactionId);
            }}
          />
        </div>
      </Card>
    </>
  );
};

export default OrderCard;
