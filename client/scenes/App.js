import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';

class App extends Component {

  handleEditRestaurant = () => {
      this.props.router.push('/restaurant/edit');
  };

  handleHomeNavigation = () => {
      this.props.router.push('/menu');
  };

  render() {
      return (
        <div>
          <Navbar
            handleEditRestaurant={this.handleEditRestaurant}
            handleHomeNavigation={this.handleHomeNavigation}
          />
          { this.props.children }
        </div>
      );
  }
}

export default App;

