import React from 'react';
import PropTypes from 'prop-types';
import s from '../styles/Navbar.scss';


const Navbar = ({ router }) => {

    const handleClick = () => {
        router.push('/profile/edit')
    }

    return (
        <div className={s.navbar}>
            <div className={s.logo}>
                <p>Stone Soup</p>
                <img src="images/stonesoup.svg"/>
            </div>
            <img
                src="/images/settings.svg"
                className={s.editProfile}
                onClick={handleClick}
            />
        </div>
    )
}

Navbar.propTypes = {
    router: PropTypes.object.isRequired,
};

export default Navbar;