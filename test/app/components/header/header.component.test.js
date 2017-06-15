import React from 'react';
import renderer from 'react-test-renderer';
import { StaticRouter } from 'react-router';

import Header from '../../../../app/components/header/header.component';

describe('The Header component', () => {
  it('should render correctly', () => {
    const tree = renderer.create(
      <StaticRouter context={{}}>
        <Header />
      </StaticRouter>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
