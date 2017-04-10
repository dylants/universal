import React, { PropTypes } from 'react';
import { renderRoutes } from 'react-router-config';

import Header from '../../components/header/header.component';

import './app.container.scss';

export default function App(props) {
  const { route } = props;

  return (
    <div>
      <Header />
      {renderRoutes(route.routes)}
    </div>
  );
}

App.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.array.isRequired,
  }).isRequired,
};
