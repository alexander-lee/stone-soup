import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';

class App extends Component {

  handleEditRestaurant = () => {
      this.props.router.push('/restaurant/edit');
  };

  render() {
      return (
        <div>
          <Navbar handleEditRestaurant={this.handleEditRestaurant}/>
          { this.props.children }
        </div>
      );
  }
}

export default App;

