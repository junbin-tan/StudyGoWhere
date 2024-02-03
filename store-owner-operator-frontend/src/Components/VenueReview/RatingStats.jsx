import StarRateIcon from '@mui/icons-material/StarRate';
import { renderStars } from './RenderMethods';
import { ReviewAPI } from '../../FunctionsAndContexts/ReviewAPI';
import { useParams } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import useEncodedToken from '../../FunctionsAndContexts/useEncodedToken';
import { BACKEND_PREFIX } from '../../FunctionsAndContexts/serverPrefix';
const r = {
    average : 0,
    count : {
      1 : 0,
      2 : 0,
      3 : 0,
      4 : 0,
      5 : 0
    }
}

const RatingStats = () => {
    const [rating, setRating] = useState({...r});
    const {id} = useParams();
    const { encodedToken } = useEncodedToken();
    useEffect(() => {
        if (id && encodedToken) {
            ReviewAPI.getReviewStatistics(id, encodedToken)
            .then(res => {
                setRating(res);
            }).catch(error => {
                console.log(error)
            })
        }
    }, [id])

    return (
                <div className=" bg-white shadow-md rounded-xl p-8 text-center ">
                    <h1 className="text-4xl font-bold">{rating.average ? Math.round(rating.average * 100) / 100 : 0}/5</h1>
                    <div className="relative flex-1 w-full my-8">
                    <div className="h-3 rounded-full border border-gray-200 bg-lightgray-70" />
                        <div
                            className="absolute inset-y-0 rounded-full border border-custom-yellow bg-custom-yellow"
                            style={{ width: `calc(${rating.average / 5 }* 100%)` }}
                        />
                    </div>
                    {[5,4,3,2,1].map(r => {
                        return (<div className="grid grid-cols-3 items-center justify-center py-4" key={r}>
                            <div> 
                            <span className="font-bold"> {rating.count[r] ? rating.count[r] : 0} </span> ratings
                            </div>
                            <div className="col-span-2">
                            {renderStars(<StarRateIcon color="warning"/>, (num) => num <= r)}
                            {renderStars(<StarRateIcon color="disabled"/>, (num) => num <= (5 - r))}
                            </div>
                        </div>
                        );
                    })}
                </div>);
}
export default RatingStats;