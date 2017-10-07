import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import s from '../styles/Menu.scss';

class MenuPage extends Component {

    static defaultProps = {
        menuItems: [
            {
                name: 'Pizza',
                servings: 10,
            },
            {
                name: 'Apples',
                servings: 14,
            },
            {
                name: 'Pasta',
                servings: 2,
            },
            {
                name: 'Tacos',
                servings: 90,
            },
            {
                name: 'Babu',
                servings: 99999,
            },
        ],
    };

    static propTypes = {
        menuItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    state = {
        isEditable: false,
    };

    handleClick = () => {
        // this.props.router.push('/menu/edit');
        this.setState({
            isEditable: !this.state.isEditable,
        });
    };

    handleEditProfile = () => {
        this.props.router.push('/profile/edit');
    };

    renderMenuItems = () => {
        return this.props.menuItems.map((item, index) => {
            return (
                <MenuItem
                    name={item.name}
                    servings={item.servings}
                    key={index}
                />
            );
        });
    };

    render() {
        return (
            <div>
                <Navbar handleEditProfile={this.handleEditProfile}/>
                <p>Menu Page</p>
                <div className={s.menuItemContainer}>
                        { this.renderMenuItems() }
                </div>
                <div onClick={this.handleClick} className={s.editMenuButton}>
                    Edit Menu
                </div>
            </div>
        );
    }
}

export default MenuPage;

