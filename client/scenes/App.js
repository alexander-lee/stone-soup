import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Navbar from '../components/Navbar';
import { connect } from 'react-redux';
import LoginPage from './LoginPage';
import { getUser } from '../actions/user-actions';

class App extends Component {


  componentDidMount() {
    this.props.getUser();
  }
  
  handleEditRestaurant = () => {
      this.props.router.push('/restaurant/edit');
  };

  handleHomeNavigation = () => {
      this.props.router.push('/menu');
  };


  renderMain = () => {
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

  render() {
    let body;
    if (!this.props.user) {
      body = <div />; // LOADING
    }
    else {
      body = this.renderMain();
    }

    return body;
  }
}


function mapStateToProps(state) {
  const user = _.get(state, 'app.user');
  return { user };
}

function mapDispatchToProps(dispatch) {
  return {
    getUser: () => {
      dispatch(getUser());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

