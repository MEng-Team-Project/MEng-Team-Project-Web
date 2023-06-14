/*
Generic and nice-looking <Button /> which thematically matches the
current front-end design.
*/

import React, { useState } from 'react';

import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

import './Button.css';

const Button = props => {
    const { title, color, ...rest } = props;
    const noAdd = "noAdd" in props;
    const onClick = "onClick" in props;
    return (
        <div
            {...rest}
            onClick={(onClick) ? props.onClick : null}
            className={[
            "button",
            `button-${color}`
        ].join(" ")}>
            {(!noAdd) && (
                <div className="button__icon">
                    <AddOutlinedIcon />
                </div>
            )}
            <div className="button__label">
                {title}
            </div>
        </div>
    )
};

export default Button;