import React, { PropTypes } from 'react';

import Header from '../../components/header/header.component';

import './app.container.scss';

export default function App(props) {
  const { children } = props;

  return (
    <div>
      <Header />
      {children}
    </div>
  );
}

App.propTypes = {
  children: PropTypes.node.isRequired,
};
