import React, { useState } from "react";
import { Button } from "@mui/material";
import ButtonStyles from "../../../utilities/ButtonStyles";
import CopyFromModal from "./CopyFromModal/CopyFromModal";
import ContentCard from "../../CommonComponents/Card/ContentCard";
import CopyToModal from "./CopyToModal/CopyToModal";
import ButtonClassSets from "../../../utilities/ButtonClassSets";
import DuplicateModal from "./DuplicateModal/DuplicateModal";
import {BsBoxArrowInDownLeft, BsBoxArrowUpRight} from "react-icons/bs";
import {BiSolidDuplicate} from "react-icons/bi";
import {HiClipboardCopy} from "react-icons/hi";

export default function CopyFromToBar({ hasUnsavedChanges = undefined, renderParts = {duplicate: true, copyFrom: true, copyTo: true}}) {
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isCopyFromModalOpen, setIsCopyFromModalOpen] = useState(false);
  const [isCopyToModalOpen, setIsCopyToModalOpen] = useState(false);

  // we can convert this into a more MUI style?
  return (
    <>
      <div
        className={
          "flex flex-row items-center justify-between px-1 py-0.5 gap-8"
        }
        style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
      >
        <div id={"Left Side"} className={"text-red-500"}>
          {hasUnsavedChanges && <p> Unsaved changes! </p>}
        </div>
        <div id={"Right Side"} className={"flex gap-8"}>
          {renderParts.duplicate &&
              <Button
                  onClick={() => setIsDuplicateModalOpen(true)}
                  className={ButtonClassSets.primary}
              >
                  <BiSolidDuplicate />
                Duplicate venue
              </Button>
          }
          {renderParts.copyFrom &&
              <Button
                  onClick={() => setIsCopyFromModalOpen(true)}
                  className={ButtonClassSets.primary}
              >
                  {/*<HiClipboardCopy />*/}
                Copy venue data from...
              </Button>
          }
          {renderParts.copyTo &&
              <Button
                  onClick={() => setIsCopyToModalOpen(true)}
                  className={ButtonClassSets.primary}
              >
                  {/*<BsBoxArrowUpRight />*/}
                Copy this venue data to...
              </Button>
          }
        </div>

        {/* technically don't need to set the rendering checks for modals, because even if they are rendered
        they are hidden without the button to show them*/}

        {renderParts.duplicate &&
            <DuplicateModal
                open={isDuplicateModalOpen}
                onClose={() => setIsDuplicateModalOpen(false)}
                handleBackButton={() => setIsDuplicateModalOpen(false)}
                handleConfirmButton={() => setIsDuplicateModalOpen(false)} // will change this sometime later i guess
            />
        }

        {renderParts.copyFrom &&
        <CopyFromModal
            open={isCopyFromModalOpen}
            onClose={() => setIsCopyFromModalOpen(false)}
            handleBackButton={() => setIsCopyFromModalOpen(false)}
            handleConfirmButton={() => setIsCopyFromModalOpen(false)} // will change this sometime later i guess
        />
        }

        {renderParts.copyTo &&
        <CopyToModal
            open={isCopyToModalOpen}
            onClose={() => setIsCopyToModalOpen(false)}
            handleBackButton={() => setIsCopyToModalOpen(false)}
            handleConfirmButton={() => setIsCopyToModalOpen(false)} // will change this sometime later i guess
        />
        }
      </div>
    </>
  );
}
