import React, { Component } from 'react';
import Navbar from '../components/Navbar';

class MenuPage extends Component {

    state = {

    };

    render() {
        return (
            <div>
                <Navbar router={this.props.router}/>
                <p>Menu Page</p>
            </div>
        );
    }
}

export default MenuPage;

