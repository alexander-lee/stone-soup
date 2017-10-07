import React from 'react';
import PropTypes from 'prop-types';
import s from '../styles/Navbar.scss';


const Navbar = ({ handleEditRestaurant, handleHomeNavigation }) => {
    return (
        <div className={s.navbar}>
            <div className={s.logo} onClick={handleHomeNavigation}>
                <h1>Stone Soup</h1>
                <img src="images/stonesoup.svg"/>
            </div>
            <img
                src="/images/settings.svg"
                className={s.editProfile}
                onClick={handleEditRestaurant}
            />
        </div>
    )
}

Navbar.propTypes = {
    handleEditRestaurant: PropTypes.func.isRequired,
    handleHomeNavigation: PropTypes.func.isRequired,
};

export default Navbar;
