import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'

import Navbar from '../components/Navbar';
import MenuItem from '../components/MenuItem';
import SaveButton from '../components/SaveButton';

import { editMenu, getMenu } from '../actions/restaurant-actions.js';
import s from '../styles/Menu.scss';

class MenuPage extends Component {
  static defaultProps = {
    menu: [],
  };

  static propTypes = {
    menu: PropTypes.arrayOf(PropTypes.object),
    editMenu: PropTypes.func.isRequired,
    userId: PropTypes.string,
    getMenu: PropTypes.func.isRequired,
  };

  state = {
    isDirty: false,
    menu: this.props.menu,
  };

  componentDidMount() {
    if (this.props.userId) {
      this.props.getMenu(this.props.userId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.userId && nextProps.userId) {
      this.props.getMenu(nextProps.userId);
    }
    if (this.props.menu.length !== nextProps.menu.length) {
      this.setState({ menu: nextProps.menu });
    }
  }

  handleSaveClick = () => {
    // PUT here
    console.log(`Saving data for ${this.props.userId}`);
    this.props.editMenu(this.props.userId, this.state.menu);
  };

  handleAddClick = () => {
    const newItems = this.state.menu;
    newItems.push({ name: 'Food', servings: 1 });

    this.setState({
      menu: newItems,
      isDirty: true,
    });
  }

  handleDeleteClick = (index) => {
    const newItems = [...this.state.menu];
    newItems.splice(index, 1);
    this.setState({
      menu: newItems,
      isDirty: true,
    });
  };

  handleNameEdit = (name, index) => {
    const newItems = [...this.state.menu];
    newItems[index].name = name;
    this.setState({
      menu: newItems,
      isDirty: true,
    });
  }

  handleServingsEdit = (servings, index) => {
    const newItems = [...this.state.menu];
    newItems[index].servings = servings;
    this.setState({
      menu: newItems,
      isDirty: true,
    });
  }

  renderMenuItems = () => {
    const menuItems = this.state.menu.map((item, index) => {
      return (
        <MenuItem
          name={item.name}
          servings={item.servings}
          key={`${index}-menu-item`}
          handleDeleteClick={() => this.handleDeleteClick(index)}
          handleNameEdit={(name) => this.handleNameEdit(name, index)}
          handleServingsEdit={(quantity) => this.handleServingsEdit(quantity, index)}
        />
      );
    });

    return [
      <div className={s.menuHeader} key="header">
        <div>Name</div>
        <div>Servings</div>
      </div>
    ].concat(menuItems)
  };

  render() {
    return (
      <div className={s.container}>
        <div className={s.banner}>
          <h1 className={s.menuPageHeader}>Menu</h1>
        </div>
        <div className={s.menuItemContainer}>
          { this.renderMenuItems() }
        </div>
        <button
          className={s.addButton}
          onClick={this.handleAddClick}
        >
          +
        </button>
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
  return {
    userId: state.app.user.id,
    menu: state.app.user.menu
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    editMenu: (id, menu) => {
      dispatch(editMenu(id, menu));
    },
    getMenu: (id) => {
      dispatch(getMenu(id));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuPage);
