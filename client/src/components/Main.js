import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import TransactionsList from './TransactionsList';
import TransactionSingle from './TransactionSingle';

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path='/' component={TransactionsList} />
          <Route exact path='/dashboard' component={Dashboard} />
          <Route exact path='/transactions/:year' component={TransactionsList} />
          <Route exact path='/transactions/:year/:month' component={TransactionsList} />
          <Route exact path='/transactions/:year/:month/:category' component={TransactionsList} />
          <Route exact path='/transaction/:id' component={TransactionSingle} />
        </Switch>
      </main>
    );
  }
}

export default Main;
