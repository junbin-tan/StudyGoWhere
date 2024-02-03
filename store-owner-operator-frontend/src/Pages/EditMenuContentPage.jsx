import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import Api from "../FunctionsAndContexts/Api";
import PageStructure from "../Components/PageStructure/PageStructure";
import { Link } from "react-router-dom";
import { Breadcrumbs, Menu } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AddMenuSectionsButton from "../Components/Menu/AddMenuSectionsButton";
import MenuSectionComponent from "../Components/Menu/MenuSectionComponent";
import DeleteMenuButton from "../Components/Menu/DeleteMenuButton";
import UpdateMenuButton from "../Components/Menu/UpdateMenuButton";
import FieldInfo from "../Components/CommonComponents/Form/FieldInfo";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import FieldLabel from "../Components/CommonComponents/Form/FieldLabel";

const EditMenuContentPage = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);

  const { id } = useParams();
  const [menu, setMenu] = useState(null);

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/menus">
            Home
          </Link>
          <Link underline="hover" className="text-lightgray-100" to="/menus">
            Menus
          </Link>
          <Link underline="hover" className="text-custom-yellow" to="/menus">
            Edit Menu
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  useEffect(() => {
    Api.getMenuByMenuId(id, encodedToken)
      .then((response) => response.json())
      .then((data) => {
        setMenu(data);
      });
  }, [id]);

  console.log(menu);

  return (
    <>
      <PageStructure
        icon={<MenuBookIcon size="2.5rem" />}
        title={"Edit Menu"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <div className="flex flex-col">
          {/* HEADER COMPONENT */}
          <div className="card border border-solid border-gray-300 px-5 py-8 rounded-lg shadow-sm bg-lightgray-80 ">
            <div className="header flex flex-row gap-2 justify-between mb-5 items-center">
              <h1 className="text-xl font-semibold ">
                <span className="text-custom-yellow">
                  '{menu?.menuName ? menu.menuName : " "}'
                </span>{" "}
                Menu Details
              </h1>

              <div className="flex flex-row gap-2">
                <DeleteMenuButton menu={menu} />
                <UpdateMenuButton menu={menu} />

                <AddMenuSectionsButton menu={menu} />
              </div>
            </div>

            <FieldLabel>
              No. of Sections:{" "}
              <span className="px-3">
                {menu?.menuSections ? menu.menuSections.length : "0"}
              </span>
            </FieldLabel>

            <div className="flex flex-col">
              <FieldLabel>Menu Description</FieldLabel>
              <p className="px-3 text-gray-500 border-2 border-gray-300 bg-white bg-opacity-50 py-2 rounded w-[700px]">
                {menu?.menuDescription ? menu.menuDescription : ""}
              </p>
            </div>

            {/* <table className="border border-separate border-gray-300 rounded-lg">
              <tr>
                <th className="border-r border-gray-300">ID</th>
                <td>{menu?.menuId ? menu.menuId : "0"}</td>
              </tr>
              <tr>
                <th className="border-r border-gray-300">Menu Name</th>
                <td>{menu?.menuName ? menu.menuName : " "}</td>
              </tr>
              <tr>
                <th className="border-r border-gray-300">Number of Sections</th>
                <td>{menu?.menuSections ? menu.menuSections.length : "0"}</td>
              </tr>
              <tr>
                <th className="border-r border-gray-300 ">Description</th>
                <td className="min-w-[500px]">
                  {menu?.menuDescription ? menu.menuDescription : ""}
                </td>
              </tr>
            </table> */}
          </div>

          <BodyCard>
            {menu?.menuSections != null && menu?.menuSections?.length < 1 ? (
              <FieldInfo className="py-5">
                Start crafting your menu details by adding a Menu Section!
              </FieldInfo>
            ) : (
              ""
            )}

            <MenuSectionComponent menu={menu} />
          </BodyCard>
        </div>
      </PageStructure>
    </>
  );
};

export default EditMenuContentPage;
