import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import s from '../styles/Menu.scss';

class MenuPage extends Component {

    handleEditProfile = () => {
        this.props.router.push('/profile/edit');
    };

    render() {
        return (
            <div>
                <Navbar handleEditProfile={this.handleEditProfile}/>
                <p>Menu Page</p>
                { this.props.children }
            </div>
        );
    }
}

export default MenuPage;

