import React from 'react';
import PropTypes from 'prop-types';
import s from '../styles/Navbar.scss';


const Navbar = ({ handleEditProfile }) => {



    return (
        <div className={s.navbar}>
            <div className={s.logo}>
                <p>Stone Soup</p>
                <img src="images/stonesoup.svg"/>
            </div>
            <img
                src="/images/settings.svg"
                className={s.editProfile}
                onClick={handleEditProfile}
            />
        </div>
    )
}

Navbar.propTypes = {
    handleEditProfile: PropTypes.func.isRequired,
};

export default Navbar;