import React from 'react';
import s from '../styles/Menu.scss';

const MenuItem = ({ name, servings }) => {

    return (
        <div className={s.menuItem}>
            <div className={s.name}>{ name }</div>
            <div className={s.servings}>{ servings }</div>
        </div>
    );
};

export default MenuItem;
