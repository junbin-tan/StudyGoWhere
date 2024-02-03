import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import ConfirmModalV2 from "../../CommonComponents/Modal/ConfirmModalV2";
import ButtonStyles from "../../../utilities/ButtonStyles";
import ButtonClassSets from "../../../utilities/ButtonClassSets";

export default function EditImageCarousel({
  items,
  onDelete,
  onSetDisplayImage,
}) {
  // actually maybe the setFormData should be passed in as a prop instead of the callback, since the callback fn is
  // not prone to change (setting behaviour is fixed)
  // const carouselRef = useRef(null)
  //
  // const moveToNextImage = () => {
  //     carouselRef.current.next();
  // }

  // there is a bug when deleting the very last image in the list:
  // The carousel tries to move to the next image but there is no next image since its the last in the list
  // however it fixes itself when you click on the next image button

  return (
    <Carousel
      autoPlay={false}
      animation="slide"
      navButtonsProps={{ style: { backgroundColor: "#FB9300" } }}
      navButtonsAlwaysVisible
      height={undefined}
    >
      {items.map((item, i) => (
        <Item
          key={i}
          item={item}
          onDelete={onDelete}
          onSetDisplayImage={onSetDisplayImage}
        />
      ))}
    </Carousel>
  );
}

function Item({ item, onDelete, onSetDisplayImage }) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSetDisplayImageModalOpen, setIsSetDisplayImageModalOpen] =
    useState(false);
  return (
    <div className="text-center">
      <img className="max-h-96 mx-auto" src={item.imageURL} alt="Image" />
      {/* flexbox for the top-right corner of the carousel */}
      <div className="flex flex-row justify-center focus:outline-none absolute top-0 right-0 m-2 gap-4">
        <Button
          type="button"
          variant={"contained"}
          onClick={() => setIsDeleteModalOpen(true)}
          className={ButtonClassSets.dangerRounded}
        >
          Remove Image
        </Button>
        <Button // We can use <Button> as well; they will have their own styl esp. for the font (the "caps-lock" style of font)
          type="button"
          onClick={() => setIsSetDisplayImageModalOpen(true)}
          variant={"contained"}
          className={ButtonClassSets.primaryRounded}
        >
          Set as display image
        </Button>
      </div>
      <ConfirmModalV2
        open={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSubmit={() => setIsDeleteModalOpen(false)}
        headerText={"Delete Picture?"}
        bodyText={"Picture will be permanently removed"}
        backButtonCallbackFn={() => setIsDeleteModalOpen(false)}
        confirmButtonStyle={ButtonStyles.delete}
        confirmButtonCallbackFn={() => {
          onDelete(item.imageURL, item.path);
          setIsDeleteModalOpen(false);
        }}
      />
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
        }}
      />
    </div>
  );
}
