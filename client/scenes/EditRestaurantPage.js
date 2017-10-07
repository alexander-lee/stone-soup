import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class EditRestaurauntPage extends Component {

  static propTypes = {

  };



  render() {
    return (
      <div>Edit Restauraunt Page</div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.app.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditRestaurauntPage);
