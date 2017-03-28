import React, { PropTypes } from 'react';

import Header from '../../components/header/header.component';

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
