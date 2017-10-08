import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import cx from 'classnames';

import { editUser } from '../actions/user-actions.js';
import s from '../styles/Restaurant.scss';

function PreviousArrow(props) {
  return (
    <div
      className={cx({[s.disabled]: props.className.indexOf('slick-disabled') !== -1}, s.arrow)}
      onClick={props.onClick}
    >
      <i className="fa fa-chevron-left"/>
    </div>
  );
}

function NextArrow(props) {
  return (
    <div
      className={cx({[s.disabled]: props.className.indexOf('slick-disabled') !== -1}, s.arrow)}
      onClick={props.onClick}
    >
      <i className="fa fa-chevron-right"/>
    </div>
  );
}


class CreateRestaurant extends Component {
  static propTypes = {
    editUser: PropTypes.func.isRequired,
    editUserSuccess: PropTypes.bool
  };

  state = {
    name: '',
    location: '',
    pickupTimes: [...Array(7).keys()].map(i => {
      return {
        startDate: moment().hour(17).minute(0).format('HH:mm').toString(),
        endDate: moment().hour(17).minute(30).format('HH:mm').toString()
      }
    }),
    dietaryRestrictions: {
      vegan: false,
      peanut: false,
      glutenfree: false,
      milk: false,
      egg: false,
      seafood: false,
    },
  };

  dietaryRestrictionsMap = {
    'Vegan': 'vegan',
    'Peanut': 'peanut',
    'Gluten-Free': 'glutenfree',
    'Milk': 'milk',
    'Egg': 'egg',
    'Seafood': 'seafood'
  }

  componentDidMount() {
    // Means a restaurant was already initialized
    if (this.props.name) {
      this.props.push('/menu');
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.name || nextProps.editUserSuccess) {
      this.props.push('/menu');
    }
  }

  // dayOfweek: [0 -> 6], represents index of day of week
  // index: 0 or 1. 0 === start, 1 === end
  handleDateSelection = (value, dayOfWeek, index) => {
    if (!value) return;

    const { pickupTimes } = this.state;
    const newTimes = [...pickupTimes];
    let accessor = index === 0 ? 'startDate' : 'endDate';
    newTimes[dayOfWeek][accessor] = value.format('HH:mm').toString();
    this.setState({ pickupTimes: newTimes });
  };

  handleChange = (e, inputField) => {
    this.setState({
      [inputField]: e.target.value,
    });
  };

  handleSubmit = () => {
    const { location, name, pickupTimes, dietaryRestrictions } = this.state;
    const id = this.props.id;
    this.props.editUser(id, location, name, pickupTimes, dietaryRestrictions);
  };

  addDietaryConcern = (concern) => {
    const { dietaryRestrictions } = this.state;
    const restriction = this.dietaryRestrictionsMap[concern]
    dietaryRestrictions[restriction] = !dietaryRestrictions[restriction];

    this.setState({ dietaryRestrictions });
  }

  renderTimeSlots = () => {
    const start = moment().hour(17).minute(30);
    const format = 'h:mm a';

    return ['Sun','Mon','Tues','Wed','Thu','Fri','Sat'].map((item, index) => {
      return (
        <div key={index} className={s.inputTimeslot}>
          <p className={s.weekday}>{ item }</p>
          <TimePicker
            showSecond={false}
            defaultValue={moment().hour(17).minute(0)}
            className="xxx"
            onChange={(value) => this.handleDateSelection(value, index, 0)}
            format={format}
            use12Hours
          />
          <div className={s.divider}></div>
          <TimePicker
            showSecond={false}
            defaultValue={moment().hour(17).minute(30)}
            className="xxx"
            onChange={(value) => this.handleDateSelection(value, index, 1)}
            format={format}
            use12Hours
          />
        </div>
      );
    });
  };

  renderDietaryConcerns = () => {
    const { dietaryRestrictions } = this.state;
    const dietaryConcerns = Object.keys(this.dietaryRestrictionsMap);
    return dietaryConcerns.map((item, index) => {
      return (
        <div
          key={`dietary-restriction-${index}`}
          className={cx({
            [s.selected]: dietaryRestrictions[this.dietaryRestrictionsMap[item]]
          }, s.restriction)}
          onClick={() => this.addDietaryConcern(item)}
        >
          { item }
        </div>
      );
    });
  };

  render() {
    const settings = {
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      nextArrow: <NextArrow />,
      prevArrow: <PreviousArrow />,
      className: s.slider,
      centerMode: true,
    };

    return (
      <div className={s.container}>
        <div className={s.banner}>
          <img src="/images/boy.svg" />
          <p>Let's get to know you better!</p>
        </div>
        <div className={s.carousel}>
          <Slider {...settings}>
            <div className={s.inputSection}>
              <p>What is the name of your restaurant?</p>
              <input
                className={s.inputField}
                onChange={(e) => this.handleChange(e, 'name')}
                type='text'
              />
            </div>
            <div className={s.inputSection}>
              <p>Where are you located (Zipcode)?</p>
              <input
                className={s.inputField}
                onChange={(e) => this.handleChange(e, 'location')}
                type='text'
              />
            </div>
            <div className={s.inputSection}>
              <p>What times do you prefer pickup to be?</p>
              { this.renderTimeSlots() }
            </div>
            <div className={s.inputSection}>
              <p>What are your restaurant's dietary restrictions?</p>
              <div className={s.dietaryConcerns}>
                { this.renderDietaryConcerns() }
              </div>
              <button
                onClick={this.handleSubmit}
                className={s.submitButton}
                >
                Submit
              </button>
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...state.app.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    editUser: (userId, location, name, pickupTimes, dietaryRestrictions) => {
      dispatch(editUser(userId, location, name, pickupTimes, dietaryRestrictions));
    },
    push: (url) => {
      dispatch(push(url));
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateRestaurant);
