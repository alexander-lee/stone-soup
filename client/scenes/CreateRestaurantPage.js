import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import moment from 'moment';
import TimePicker from 'rc-time-picker';
import s from '../styles/Restaurant.scss';

class CreateRestaurant extends Component {

    state = {
        name: '',
        location: '',
        pickupTimes: [...Array(7).keys()].map(i => {
            return [
                moment().hour(17).minute(0).format('HH:mm').toString(),
                moment().hour(17).minute(30).format('HH:mm').toString()
            ]
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

    // dayOfweek: [0 -> 6], represents index of day of week
    // index: 0 or 1. 0 === start, 1 === end
    handleDateSelection = (value, dayOfWeek, index) => {
        const { pickupTimes } = this.state;
        const newTimes = [...pickupTimes];
        newTimes[dayOfWeek][index] = value.format('HH:mm').toString();
        this.setState({ pickupTimes: newTimes });
    };

    handleChange = (e, inputField) => {
        this.setState({
            inputField: e.target.value,
        });
    };

    renderTimeSlots = () => {
        const start = moment().hour(17).minute(30);
        const format = 'h:mm a';

        return ['S','M','T','W','Th','F','S'].map((item, index) => {
            return (
                <div key={index} className={s.inputTimeslot}>
                    <p>{ item }</p>
                    <TimePicker
                        showSecond={false}
                        defaultValue={moment().hour(17).minute(0)}
                        className="xxx"
                        onChange={(value) => this.handleDateSelection(value, index, 0)}
                        format={format}
                        use12Hours
                    />
                    <p>     to:    </p>
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

    render() {
        const settings = {
            speed: 500,
            slidesToShow: 1,
            slidesToScroll: 1
        };

        return (
            <div>
                <div className={s.header}>
                    <p>Let's figure out a little bit more about you.</p>
                </div>

                <div className={s.container}>
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
                                <p>Where are you located?</p>
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
                                <p>What dietary restrictions may be of concern to clients?</p>
                                <input></input>
                            </div>
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateRestaurant;
