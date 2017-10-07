import React from 'react';
import s from '../styles/Menu.scss';

const MenuItem = ({ name, servings, handleDeleteClick, handleNameEdit, handleServingsEdit }) => {
  return (
    <div className={s.menuItem}>
      <div className={s.deleteButton}>
        <i className="fa fa-times-circle" onClick={handleDeleteClick}/>
      </div>
      <input
        className={s.name}
        value={name}
        onChange={(e) => handleNameEdit(e.target.value)}
      />
      <input
        className={s.servings}
        value={servings}
        onChange={(e) => handleServingsEdit(e.target.value)}
      />
    </div>
  );
};

export default MenuItem;
