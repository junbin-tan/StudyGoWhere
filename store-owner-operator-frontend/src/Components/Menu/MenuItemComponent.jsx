import React from "react";
import MenuImageComponent from "./MenuImageComponent";
import DeleteMenuItemButton from "./DeleteMenuItemButton";
import UpdateMenuItemButton from "./UpdateMenuItemButton";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import TagClassSets from "../../utilities/TagClassSets";

const MenuItemComponent = ({ menuSection }) => {
  console.log(menuSection);
  return (
    <div className="h-auto">
      {menuSection?.menuItems?.map((menuItem, index) => (
        <div
          key={index}
          className="bg-custom-yellow bg-opacity-10 hover:bg-white hover:border-custom-red border-2 border-gray-200 rounded-lg mb-3 py-7 px-5 h-[275px] duration-300 ease-in"
        >
          <div className="flex justify-between h-[200px]">
            <div className="flex flex-row gap-10 items-center">
              <div className="">
                <MenuImageComponent imagePath={menuItem.imageURL} />
              </div>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col font-medium">
                    <FieldLabel>Menu Item Name</FieldLabel>
                    <p className="text-xl font-bold text-custom-yellow">
                      {menuItem?.menuItemName || " "}
                    </p>
                  </div>
                  <div className="flex flex-col ">
                    <FieldLabel>Menu Description</FieldLabel>
                    <p className="text-gray-700 text-lg">
                      {menuItem?.menuItemDescription || " "}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row gap-5">
                  <div className="flex flex-col gap-1 text-center items-center">
                    <FieldLabel>Cost Price: </FieldLabel>
                    <p className={TagClassSets.default2}>
                      ${menuItem?.costPrice || "0"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-center items-center">
                    <FieldLabel>Selling Price: </FieldLabel>
                    <p className={TagClassSets.default2}>
                      ${menuItem?.sellingPrice || "0"}
                    </p>
                  </div>
                  {/* <div className="flex flex-col gap-1 text-center items-center">
                    <FieldLabel>Enabled: </FieldLabel>
                    <span
                      className={`${
                        menuItem?.enabled
                          ? TagClassSets.true
                          : TagClassSets.false
                      }`}
                    >
                      {menuItem?.enabled ? "True" : "False"}
                    </span>
                  </div> */}
                </div>
              </div>
            </div>
            <div className="flex flex-row gap-2">
              <DeleteMenuItemButton menuItem={menuItem} />
              <UpdateMenuItemButton menuItem={menuItem} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuItemComponent;
