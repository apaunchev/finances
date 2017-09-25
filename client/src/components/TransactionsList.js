import React, { Component } from 'react';
import axios from 'axios';
import TransactionsListItem from './TransactionsListItem';

class TransactionsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transactions: []
    };
  }

  componentDidMount() {
    const now = new Date();
    const { year, month, category } = this.props.match.params;

    // TODO: params validation
    console.log(this.props.match.params);

    axios.get('http://localhost:3000/transactions/2017/8')
      .then(res => this.setState({ transactions: res.data.transactions }));
  }

  renderGroups() {
    return (
      this.state.transactions.map(group => (
        <div key={group.date} className='transactions__group'>
          <h4 className='transactions__group__title'>
            {group.date}
            <span className='transactions__group__subtitle'>{group.dayOfWeek}</span>
            <span className='transactions__group__amount'>{group.totalAmount}</span>
          </h4>
          <ol className='transactions__list'>
            {group.transactions.map(transaction => <TransactionsListItem key={transaction._id} transaction={transaction} />)}
          </ol>
        </div>
      ))
    );
  }

  render() {
    return (
      <div>
        {this.renderGroups()}
      </div>
    );
  }
}

export default TransactionsList;
