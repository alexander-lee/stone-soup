import React from 'react';
import DocumentMeta from 'react-document-meta';
import s from '../styles/ErrorPage.scss';

const ErrorPage = () => {
  return (
    <div className={s.container}>
      <DocumentMeta
        title="404"
      />
      <img src="/images/404.svg" />
      <div>
        <h1>404</h1>
        <p>Uh oh! This page could not be found!</p>
      </div>
    </div>
  )
};

export default ErrorPage;
