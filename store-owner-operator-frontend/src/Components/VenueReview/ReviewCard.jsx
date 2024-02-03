import StarRateIcon from '@mui/icons-material/StarRate';
import CustomButton from '../../utilities/CustomButton';
import ReplyIcon from '@mui/icons-material/Reply';
import { renderStars } from './RenderMethods';
import TextArea from '../../utilities/TextArea';
import EditReview from './EditReview';
export default function ReviewCard({review, reviewDispatch, saveReviewReply, searchReviews}) {
    const handleReplyChange = (e) => {
        if (review.reviewId) {
            reviewDispatch({type : "EDIT_OPEN", id : review.reviewId})
        }
    }
    return (<div className="m-4 shadow-lg w-full">
                <div className=" bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
                    <div className="mb-6">
                        <div className="text-sm text-gray-600 flex mb-4">
                            {renderStars(<StarRateIcon color="warning"/>, (num) => num <= review?.starRating)}
                            {renderStars(<StarRateIcon color="disabled"/>, (num) => num <= (5 - review?.starRating))}
                            <span className='px-2'>By {review.student ? review.student : "Anonymous"}</span>
                            <span className='ml-auto'>{review?.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                        </div>
                        <div className="text-gray-900 font-bold text-xl mb-2">{review.subject}</div>
                        <div className="text-gray-900 text-md mb-2">{review.description}</div>
                        <div className="text-gray-900 text-md mb-2">
                            <span className='font-semibold'>Reply : </span>{review.ownerReply}
                        </div>

                    </div>
                    <div className="flex flex-col items-center">

                        {!review?.editMode ?    <CustomButton label={review?.ownerReply ? "Edit Reply" : "Reply to Review"}
                                                    onClick={handleReplyChange}
                                                    childIcon={<ReplyIcon fontSize="small" sx={{marginBottom:"0.3rem"}}></ReplyIcon>}>
                                                </CustomButton> :
                                                <EditReview review={review} 
                                                reviewDispatch={reviewDispatch}
                                                saveReviewReply={saveReviewReply}
                                                searchReviews={searchReviews}
                                                />
                        }

                    </div>
                </div>
            </div>);
}