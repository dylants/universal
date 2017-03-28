import React from 'react';
import { Link } from 'react-router';

export default function Header() {
  return (
    <header>
      <div>
        <Link to="/">Home</Link>
        <Link to="/page1">Page 1</Link>
        <Link to="/page2">Page 2</Link>
      </div>
    </header>
  );
}
