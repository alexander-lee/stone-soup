import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import s from '../styles/Menu.scss';

const SaveButton = ({ inProp, handleSaveClick }) => {

  const duration = 300;

  const defaultStyle = {
    transition: `all ${duration}ms ease-in-out`,
    opacity: 0,
  }

  const transitionStyles = {
    entering: { opacity: 1 },
    entered:  { opacity: 1 },
  };

  return (
    <Transition in={inProp} timeout={duration}>
      {(state) => (
        <button
          style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}
          className={s.saveButton}
          onClick={handleSaveClick}
        >
          Save Changes
        </button>
      )}
    </Transition>
  );
};

export default SaveButton;
