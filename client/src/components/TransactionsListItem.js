import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class TransactionsListItem extends Component {
  render() {
    const { _id, description, category, amount } = this.props.transaction;
    
    return (
      <li className='transaction'>
        <Link to={`/transaction/${_id}`}>
          <span className='transaction__name'>{description}</span>
          <span className='transaction__amount'>
            <span className='transaction__pill' style={{ backgroundColor: category.color }}>{amount}</span>
          </span>
        </Link>
      </li>
    );
  }
}

export default TransactionsListItem;
