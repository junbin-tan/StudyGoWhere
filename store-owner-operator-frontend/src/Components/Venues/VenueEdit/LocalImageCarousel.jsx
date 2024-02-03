import React, {useEffect, useState} from 'react';
import Carousel from 'react-material-ui-carousel'
import { Paper, Button } from '@mui/material'
import ConfirmModalV2 from '../../CommonComponents/Modal/ConfirmModalV2';
import ButtonStyles from "../../../utilities/ButtonStyles";

export default function LocalImageCarousel({items, onDelete})
{
    return (
        <Carousel autoPlay={false} animation='slide' navButtonsProps={{style: { backgroundColor: "rgba(200,174,125,1)"}}}
                  navButtonsAlwaysVisible height={undefined}>
            {
                items.map( (item, i) => <Item key={i} item={item} onDelete={onDelete} /> )
            }
        </Carousel>
    )
}

function Item(props)
{
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    return (
        <div className='text-center'>
            {/* <h2>{props.item.name}</h2> */}
            <img className="max-h-96 mx-auto" src={props.item.imageURL} alt="Image"/>
            {/* <Button className="CheckButton">
                Check it out!
            </Button> */}
        </div>
    )
}