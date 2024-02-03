import React from "react";
import AddMenuItemButton from "./AddMenuItemButton";
import MenuItemComponent from "./MenuItemComponent";
import DeleteMenuSectionButton from "./DeleteMenuSectionButton";
import UpdateMenuSectionButton from "./UpadateMenuSectionButton";
import FieldLabel from "../CommonComponents/Form/FieldLabel";
import FieldInfo from "../CommonComponents/Form/FieldInfo";

const MenuSectionComponent = ({ menu }) => {
  // console.log(menu);
  return (
    <>
      <div className="flex flex-col mt-2">
        <div className="flex flex-col justify-center">
          {menu?.menuSections?.map((menuSection) => (
            <div
              key={menuSection.menuSectionId}
              className="flex flex-col border border-solid border-gray-300 hover:bg-custom-yellow hover:bg-opacity-10 shadow-md p-5 rounded-xl my-2 duration-300 ease-in"
            >
              {/* title and buttons */}
              <div className="flex justify-between mb-2 items-center">
                <h1 className="text-xl font-semibold ">
                  <span className="text-custom-yellow ">
                    '
                    {menuSection?.menuSectionName
                      ? menuSection.menuSectionName
                      : " "}
                    '
                  </span>{" "}
                  Section
                </h1>
                <div className="flex flex-row gap-2">
                  <DeleteMenuSectionButton menuSection={menuSection} />
                  <UpdateMenuSectionButton menuSection={menuSection} />
                  <AddMenuItemButton menuSection={menuSection} />
                </div>
              </div>

              {/* Section description and num of menu item*/}

              <div className="flex flex-col gap-2 mb-5">
                <div className="flex flex-row gap-2 ">
                  <FieldLabel>No. of Menu Item(s):</FieldLabel>

                  {menuSection?.menuItems ? menuSection.menuItems.length : "0"}
                </div>
                <div className="flex flex-col ">
                  <FieldLabel>Section Description</FieldLabel>
                  <p className="px-3 text-gray-500 border-2 border-gray-300 bg-white bg-opacity-50 py-2 rounded w-[680px]">
                    {menuSection?.menuSectionDescription
                      ? menuSection.menuSectionDescription
                      : " "}
                  </p>
                </div>
              </div>
              {menuSection?.menuItems != null &&
              menuSection.menuItems.length > 0 ? (
                <MenuItemComponent menuSection={menuSection} />
              ) : (
                <FieldInfo>
                  There's no menu item for this section yet. <br /> Start adding
                  a menu item!
                </FieldInfo>
              )}
            </div>
          ))}
        </div>
        <div></div>
        {/* </div> */}
      </div>
    </>
  );
};

export default MenuSectionComponent;
