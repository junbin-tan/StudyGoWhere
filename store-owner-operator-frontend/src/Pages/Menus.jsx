import React, { useContext, useEffect, useState } from "react";
import PageStructure from "../Components/PageStructure/PageStructure";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Breadcrumbs, Card } from "@mui/material";
import { LoginTokenContext } from "../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../FunctionsAndContexts/OwnerVenuesContext";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import Api from "../FunctionsAndContexts/Api";
import Box from "@mui/material/Box";
import ButtonClassSets from "../utilities/ButtonClassSets";
import { DataGrid } from "@mui/x-data-grid";
import MenuDropDownButton from "../Components/Menu/MenuDropDownButton";
import StripedDataGrid from "../utilities/StripedDataGrid";

const Menus = () => {
  const [token, setToken, encodedToken] = useContext(LoginTokenContext);
  const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
  const [menus, setMenus] = useState([]);

  const navigate = useNavigate();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (ownerData.userId) {
      fetchMenues();
    }
  }, [ownerData.userId]);

  const fetchMenues = () => {
    Api.getAllMenues(ownerData.userId, encodedToken)
      .then((data) => data.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const processedMenu = data.map((menuData) => ({
            id: menuData.menuId,
            menuName: menuData.menuName,
            menuDescription: menuData.menuDescription,
            menuSections: menuData.menuSections,
          }));
          setMenus(processedMenu);
        } else {
          console.log("Error in fetching menus");
        }
      })
      .catch((error) => {
        console.error("Error fetching menus:", error);
      });
  };

  console.log(menus);

  function ActiveLastBreadcrumb({}) {
    return (
      <div role="presentation">
        <Breadcrumbs aria-label="breadcrumb">
          <Link underline="hover" className="text-lightgray-100" to="/menus">
            Home
          </Link>
          <Link underline="hover" className="text-custom-yellow" to="/menus">
            Menus
          </Link>
        </Breadcrumbs>
      </div>
    );
  }

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "menuName",
      headerName: "Menu Name",
      flex: 1,
      headerAlign: "center",
      align: "center",
      cellClassName: "name-column-cell",
    },
    {
      field: "menuDescription",
      headerName: "Description",
      headerAlign: "center",
      align: "center",
      flex: 2,
      cellClassName: "name-column-cell",
    },

    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <MenuDropDownButton menuHere={params.row} />,
    },
  ];

  return (
    <>
      <PageStructure
        icon={<MenuBookIcon size="2.5rem" />}
        title={"Menus"}
        breadcrumbs={<ActiveLastBreadcrumb />}
      >
        <div className="flex flex-col">
          <div className="mb-4 flex justify-end items-center">
            <button
              onClick={() => {
                navigate("/add-menu");
              }}
              className={ButtonClassSets.primary}
            >
              Add Menu
            </button>
          </div>

          <div className="">
            <div className="items-center align-middle justify-center rounded-lg shadow-lg">
              <div className="">
                <Box sx={{ height: "100%", width: "100%" }}>
                  <StripedDataGrid
                    rows={menus}
                    columns={columns}
                    pageSizeOptions={[5, 10, 15, 20]}
                    checkboxSelection={false}
                    disableRowSelectionOnClick
                    sx={{
                      backgroundColor: "#ffffff",
                      borderRadius: "10px",
                      border: "1px solid #E0E0E0",
                    }}
                    getRowClassName={(params) =>
                      params.indexRelativeToCurrentPage % 2 === 0
                        ? "even"
                        : "odd"
                    }
                  />
                </Box>
              </div>
            </div>
          </div>
        </div>
      </PageStructure>
    </>
  );
};

export default Menus;
