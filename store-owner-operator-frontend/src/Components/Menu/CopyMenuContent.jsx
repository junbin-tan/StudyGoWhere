import React, { useContext, useEffect, useState } from "react";
import { LoginTokenContext } from "../../FunctionsAndContexts/LoginTokenContext";
import { OwnerVenuesContext } from "../../FunctionsAndContexts/OwnerVenuesContext";
import Api from "../../FunctionsAndContexts/Api";
import StripedDataGrid from "../../utilities/StripedDataGrid";
import Box from "@mui/material/Box";
import CopyMenuActionButton from "./CopyMenuActionButton";


const CopyMenuContent = ({venue}) => {
    const [token, setToken, encodedToken] = useContext(LoginTokenContext);
    const { ownerData, setOwnerData } = useContext(OwnerVenuesContext);
    const [menus, setMenus] = useState([]);

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

    console.log(venue)
    console.log(menus)

    const columns = [
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
          renderCell: (params) => <CopyMenuActionButton menuHere={params.row} venue={venue} />,
        },
      ];
  return (
    <>
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
   
          </>
  )
}

export default CopyMenuContent