import TextArea from "../../utilities/TextArea"
import React, {useState} from "react";
import CustomButton from "../../utilities/CustomButton";
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
export default function EditReview({review, saveReviewReply, reviewDispatch, searchReviews}) {
    const [reply, setReply] = useState(review?.ownerReply ? review?.ownerReply : "");
    const onInputChange = (field, e) => {
        setReply(e.target.value);
    }
    const handleReplyClick = (e) => {
        saveReviewReply(review.reviewId, reply)
        //searchReviews();
    }
    return <>
        <TextArea onInputChange={onInputChange}
              label="Review Reply"
              validationFunction={true}
              field="Reply"
              value={reply}/>
        <span className="space-x-8">
        <CustomButton label="Save" childIcon={<SaveIcon/>} onClick={handleReplyClick}/>     
        <CustomButton label="Cancel" childIcon={<CancelIcon/>} onClick={(e) =>  reviewDispatch({type : "EDIT_CLOSE", id : review.reviewId})}/>
        </span>
    </>
}