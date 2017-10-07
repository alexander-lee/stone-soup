import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import SaveButton from '../components/SaveButton';
import { connect } from 'react-redux';
import { editMenu } from '../actions/restaurant-actions.js';
import s from '../styles/Menu.scss';

class MenuPage extends Component {

    static defaultProps = {
        menu: [
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
        menu: PropTypes.arrayOf(PropTypes.object).isRequired,
        editMenu: PropTypes.func.isRequired,
    };

    state = {
        isDirty: false,
        menu: this.props.menu,
    };


    handleSaveClick = () => {
        // PUT here
        console.log('Save');
        this.props.editMenu('59d8caf9cead366086cf7280', this.state.menu);
    };

    handleDeleteClick = (index) => {
        const newItems = [...this.state.menu];
        newItems.splice(index, 1);
        this.setState({
            menu: newItems,
            isDirty: true,
        });
    };

    handleServingsEdit = (servings, index) => {
        console.log(servings);
        console.log(index);
        const newItems = [...this.state.menu];
        newItems[index].servings = servings;
        this.setState({
            menu: newItems,
            isDirty: true,
        });
    }

    renderMenuItems = () => {
        return this.state.menu.map((item, index) => {
            return (
                <MenuItem
                    name={item.name}
                    servings={item.servings}
                    key={index}
                    handleDeleteClick={() => this.handleDeleteClick(index)}
                    handleServingsEdit={(quantity) => this.handleServingsEdit(quantity, index)}
                />
            );
        });
    };

    render() {

        return (
            <div>
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

const mapStateToProps = (state) => {
    return state;
}

const mapDispatchToProps = (dispatch) => {
    return {
        editMenu: (id, menu) => {
            dispatch(editMenu(id, menu));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);


