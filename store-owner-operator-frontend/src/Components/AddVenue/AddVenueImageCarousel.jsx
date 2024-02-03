import React, { useState } from "react";
import Carousel from "react-material-ui-carousel";
import ConfirmModalV2 from "../CommonComponents/Modal/ConfirmModalV2";
import { Button } from "@mui/material";
import ButtonStyles from "../../utilities/ButtonStyles";
import ButtonClassSets from "../../utilities/ButtonClassSets";

export default function AddVenueImageCarousel({ items, onDelete }) {
  console.log(items);
  return (
    <Carousel
      autoPlay={false}
      animation="slide"
      navButtonsProps={{
        style: { backgroundColor: "var(--custom-yellow)" },
        height: "100%",
      }}
      navButtonsAlwaysVisible
    >
      {items.map((item, i) => (
        <Item key={i} item={item} onDelete={onDelete} />
      ))}
    </Carousel>
  );
}

function Item(props) {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  return (
    <div className="text-center">
      {/* <h2>{props.item.name}</h2> */}
      <img className="max-h-96 mx-auto" src={props.item.imageURL} alt="Image" />
      <div className="flex flex-row justify-center focus:outline-none absolute top-0 right-0 m-2 gap-4">
        <Button
          type="button"
          onClick={() => setIsSuccessModalOpen(true)}
          className={ButtonClassSets.dangerRounded}
        >
          Remove Picture
        </Button>
      </div>
      <ConfirmModalV2
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onSubmit={() => setIsSuccessModalOpen(false)}
        headerText={"Delete Picture?"}
        bodyText={"Picture will be permanently removed"}
        backButtonCallbackFn={() => setIsSuccessModalOpen(false)}
        confirmButtonCallbackFn={() => {
          props.onDelete(props.item.imageURL, props.item.path);
          setIsSuccessModalOpen(false);
        }}
      />
    </div>
  );
}
