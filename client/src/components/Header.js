import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Header extends Component {
  render() {
    return (
      <header>
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/transactions/2017/9'>Transactions 2017/9</Link>
        </nav>
      </header>
    );
  }
}

export default Header;
