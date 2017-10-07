import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import SaveButton from '../components/SaveButton';
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
        isDirty: false,
        menuItems: this.props.menuItems,
    };


    handleSaveClick = () => {
        // PUT here
        console.log('Save');
    };

    handleDeleteClick = (index) => {
        const newItems = [...this.state.menuItems];
        newItems.splice(index, 1);
        this.setState({
            menuItems: newItems,
            isDirty: true,
        });
    }

    handleEditProfile = () => {
        this.props.router.push('/profile/edit');
    };

    renderMenuItems = () => {
        return this.state.menuItems.map((item, index) => {
            return (
                <MenuItem
                    name={item.name}
                    servings={item.servings}
                    key={index}
                    handleDeleteClick={() => this.handleDeleteClick(index)}
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
                <div className={s.saveButtonContainer}>
                    <SaveButton
                        inProp={this.state.isDirty}
                        handleSaveClick={this.handleSaveClick}
                    />
                </div>
            </div>
        );
    }
}

export default MenuPage;

