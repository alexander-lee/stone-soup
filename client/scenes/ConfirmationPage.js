import React from 'react';
import s from '../styles/ConfirmationPage.scss';

function ConfirmationPage(props) {
  return (
    <div className={s.container}>
      <div className={s.imageContainer}>
        <img src="/images/girl.svg" />
      </div>
      <div className={s.redContainer}>
        <h1>{props.params.name}</h1>
        <p>This ticket redemption has been successful!</p>
      </div>
    </div>
  );
}

export default ConfirmationPage;
