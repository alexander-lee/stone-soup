import React from 'react';
import s from '../styles/Menu.scss';

const MenuItem = ({ name, servings, handleDeleteClick }) => {
    const className = `${s.deleteButton} fa fa-times-circle`;
    return (
        <div className={s.menuItem}>
            <div className={s.name}>{ name }</div>
            <div className={s.servings}>
                { servings }
                <i className={className} onClick={handleDeleteClick}/>
            </div>
        </div>
    );
};

export default MenuItem;
