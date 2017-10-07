import React, { Component } from 'react';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import s from '../styles/Menu.scss';

class MenuPage extends Component {

    render() {
        return (
            <div>
                <Navbar router={this.props.router}/>
                <p>Menu Page</p>
                { this.props.children }
            </div>
        );
    }
}

export default MenuPage;

