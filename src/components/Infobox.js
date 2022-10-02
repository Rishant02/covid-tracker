import { Card, CardContent, Typography } from '@mui/material';
import React from 'react';
import './Infobox.css'
const Infobox = ({ isRed, isActive, title, cases, total, ...props }) => {
    return (
        <Card
            className={`infoBox ${isActive && "infoBox--selected"} ${isRed && "infoBox--red"}`}
            onClick={props.onClick}
        >
            <CardContent>
                <Typography className="infoBox__title" color="textSecondary">{title}</Typography>
                <h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>{cases}</h2>
                <Typography className='infoBox__total' color="textSecondary">{total} Total </Typography>
            </CardContent>
        </Card>
    )
}
export default Infobox;