import React, { useState, useEffect } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import ConfirmModalV2 from "../../CommonComponents/Modal/ConfirmModalV2";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import storage from "../../../firebase";
import ButtonStyles from "../../../utilities/ButtonStyles";
import ButtonClassSets from "../../../utilities/ButtonClassSets";

export default function DashboardImageCarousel({
  venueImageItems,
  onSetDisplayImage = false,
}) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    setItems(venueImageItems);
  }, [venueImageItems]);

  if (items == null) return <div>Loading...</div>;
  else {
    console.log("items is not null, items is: ", items);
  }

  return (
    <Carousel
      autoPlay={false}
      animation="slide"
      navButtonsProps={{
        style: { backgroundColor: "rgba(200,174,125,1)" },
        height: "100%",
      }}
      // height={"100%"}
      navButtonsAlwaysVisible
    >
      {items.map((item, i) => (
        <Item key={i} item={item} onSetDisplayImage={onSetDisplayImage} />
      ))}
    </Carousel>
  );
}

function Item({ item, onSetDisplayImage }) {
  const [isSetDisplayImageModalOpen, setIsSetDisplayImageModalOpen] =
    useState(false);
  return (
    <div className="text-center">
      {/* <h2>{props.item.name}</h2> */}
      <img className="max-h-96 mx-auto" src={item.imageURL} alt="Image" />
        <div className="flex flex-row justify-center focus:outline-none absolute top-0 right-0 m-2 gap-4">
      {onSetDisplayImage && (
        <Button // We can use <Button> as well; they will have their own styl esp. for the font (the "caps-lock" style of font)
          type="button"
          variant={"contained"}
          onClick={() => setIsSetDisplayImageModalOpen(true)}
          className={`${ButtonClassSets.primaryRounded}`}
        >
          Set as display image
        </Button>
      )}
        </div>
      <ConfirmModalV2
        open={isSetDisplayImageModalOpen}
        onClose={() => setIsSetDisplayImageModalOpen(false)}
        onSubmit={() => setIsSetDisplayImageModalOpen(false)}
        headerText={"Set this image as display image?"}
        bodyText={
          "This image will be shown as the display image for your venue."
        }
        backButtonCallbackFn={() => setIsSetDisplayImageModalOpen(false)}
        confirmButtonStyle={ButtonStyles.selected}
        confirmButtonCallbackFn={() => {
          onSetDisplayImage(item.path);
          setIsSetDisplayImageModalOpen(false);
          // window.location.reload();
        }}
      />
      {/* <Button className="CheckButton">
                Check it out!
            </Button> */}
    </div>
  );
}
