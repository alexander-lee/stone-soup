import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getMenu } from '../actions/user-actions';
import { connect } from 'react-redux';

class TicketPage extends Component {

  static propTypes = {
    id: PropTypes.string,
    getMenu: PropTypes.func.isRequired,
    menu: PropTypes.array,
    numServings: PropTypes.number,
  };

  componentDidMount() {
    const { id } = this.props;
    if (id) {
      this.props.getMenu(id);
    }
  }

  render() {
    return (
      <div>Ticket Page</div>
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
    getMenu: (id) => {
      dispatch(getMenu(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TicketPage);
