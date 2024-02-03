import React, {useState} from "react";
import PageStructure from "../Components/PageStructure/PageStructure";
import {Button} from "@mui/material";
import ButtonClassSets from "../utilities/ButtonClassSets";
import BodyCard from "../Components/CommonComponents/Card/BodyCard";
import {PencilIcon} from "lucide-react";
import './TestingPage.css';
import {InsertPhoto} from "@mui/icons-material";

function RegisterButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = () => {
        setIsLoading(true);

        // Perform the registration logic here, and handle the response.
        // When the response is received, setIsLoading(false).
    };

    return (
        <button className={(isLoading ? "register-button loading" : "register-button")} onClick={handleClick}>
            Testoo {isLoading && <span className="loader"></span>}
        </button>
    );
}
export default function TestingPage() {

    const [testClass, setTestClass] = useState("");
    const [testDisabled, setTestDisabled] = useState(false);
    const setDisabledForAWhile = () => {
        setTestClass("disabled bg-gray-400");
        setTestDisabled(true);
        setTimeout(() => {
            setTestClass("");
            setTestDisabled(false)
        }, 1000);
        console.log("is this logged before color change back")
    }

    return (
        <PageStructure>
            <BodyCard>
                <p>This page is to test stuff out</p>

                <p>This button disables itself and changes colour after clicking, and after a certain delay it enables itself again.</p>
                <Button disabled={testDisabled} type={"button"} className={ButtonClassSets.primary + " " + testClass} onClick={setDisabledForAWhile}>
                    Redeem
                </Button>

                <p>This button is for the spinning</p>
                <RegisterButton/>


                <div className={"h-48 w-96 bg-amber-300"}>
                    <InsertPhoto className={"w-full h-full"}/>
                </div>
            </BodyCard>
        </PageStructure>
    )
}
