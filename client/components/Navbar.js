import React from 'react';
import PropTypes from 'prop-types';
import s from '../styles/Navbar.scss';


const Navbar = ({ redirectTo }) => {
  return (
    <div className={s.navbar}>
      <div
        className={s.logo}
        onClick={() => redirectTo('/menu')}
      >
        <img src="/images/stonesoup.svg"/>
        <h1>Stone Soup</h1>
      </div>
      <div
        className={s.navbarItem}
        onClick={() => window.location.href = '/logout'}
      >
        <i className="fa fa-sign-out" />
        <p>Logout</p>
      </div>
    </div>
  )
}

Navbar.propTypes = {
  redirectTo: PropTypes.func.isRequired,
};

export default Navbar;
