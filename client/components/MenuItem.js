import React from 'react';
import s from '../styles/Menu.scss';
import Input from 'muicss/lib/react/input'

const MenuItem = ({ name, servings, handleDeleteClick, handleServingsEdit }) => {
    const className = `${s.deleteButton} fa fa-times-circle`;

    return (
        <div className={s.menuItem}>
            <div className={s.name}>{ name }</div>
            <div className={s.servings}>
                <input
                    value={servings}
                    onChange={(e) => handleServingsEdit(e.target.value)}
                />
                <i className={className} onClick={handleDeleteClick}/>
            </div>
        </div>
    );
};

export default MenuItem;
