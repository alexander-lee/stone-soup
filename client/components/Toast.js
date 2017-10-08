import React, { Component } from 'react';
import PropTypes from 'prop-types';
import s from '../styles/Toast.scss';

class Toast extends Component {

  static propTypes = {
    message: PropTypes.string,
    shouldDisplay: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    shouldDisplay: false,
  };

  state = { isVisible: false };

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldDisplay && !this.state.isVisible) {
      this.setState({ isVisible: true });
      setTimeout(() => {
        this.setState({isVisible: false});
      }, 3000);
    }
  }

  render() {
    const className = !this.state.isVisible ? s.toast : `${s.toast} ${s.show}`;
    return (
      <div className={className}>{ this.props.message }</div>
    );
  }

}

export default Toast;
