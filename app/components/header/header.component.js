import React from 'react';
import { Link } from 'react-router-dom';

import style from './header.component.scss';

export default function Header() {
  return (
    <header>
      <div className={style.links}>
        <Link to="/">Home</Link>
        <Link to="/page1">Page 1</Link>
        <Link to="/page2">Page 2</Link>
      </div>
    </header>
  );
}
