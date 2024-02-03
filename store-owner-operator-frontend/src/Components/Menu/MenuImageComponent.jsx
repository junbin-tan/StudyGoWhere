import React, { useState, useEffect } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import storage from "../../firebase";
import defaultCoffee from "../../Assets/image/menuItemDefault.jpg";

const MenuImageComponent = ({ imagePath }) => {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (imagePath) {
      const fetchImage = async () => {
        try {
          const imageRef = ref(storage, imagePath);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
          setImageError(false);
        } catch (error) {
          console.error("Error fetching image URL:", error);
          setImageError(true);
        }
      };

      fetchImage();
    }
  }, [imagePath]);

  if (imageError) {
    return <div>Error loading image</div>;
  }

  if (!imageUrl) {
    return (
      <img
        src={defaultCoffee}
        alt="Menu Item"
        className="rounded-lg object-cover w-[300px] max-w-[350px] h-[200px]"
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt="Menu Item"
      className="rounded-lg object-cover w-[300px] max-w-[350px] h-[200px]"
    />
  );
};

export default MenuImageComponent;
