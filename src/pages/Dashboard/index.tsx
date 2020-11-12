import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    api.get('/transactions').then(response => {
      const rawTransactions = response.data.transactions as Transaction[];
      const formattedTransactions: Transaction[] = [];
      rawTransactions.map(transaction => {
        const {
          id,
          category,
          created_at,
          formattedDate,
          formattedValue,
          title,
          type,
          value,
        } = transaction;
        formattedTransactions.push({
          id,
          category,
          created_at,
          title,
          type,
          value,
          formattedValue: formatValue(value),
          formattedDate: '',
        });
      });

      const { income, outcome, total } = response.data.balance as Balance;
      const formattedBalance: Balance = {
        income: formatValue(Number(income)),
        outcome: formatValue(Number(outcome)),
        total: formatValue(Number(total)),
      }
      setTransactions(formattedTransactions);
      setBalance(formattedBalance);
    });
  }, []);

  return (
    <>
      <Header />
      <Container>
        {balance && (
          <CardContainer>
            <Card>
              <header>
                <p>Income</p>
                <img src={income} alt="Income" />
              </header>
              <h1 data-testid="balance-income">
                {balance.income}
              </h1>
            </Card>
            <Card>
              <header>
                <p>Outcome</p>
                <img src={outcome} alt="Outcome" />
              </header>
              <h1 data-testid="balance-outcome">
                {balance.outcome}
              </h1>
            </Card>
            <Card total>
              <header>
                <p>Total</p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">
                {balance.total}
              </h1>
            </Card>
          </CardContainer>
        )}


        <TableContainer>
          {transactions && (
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td
                      className={
                        transaction.type === 'income' ? 'income' : 'outcome'
                      }
                    >
                      {transaction.type === 'outcome' ? '-' : ''}  {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{transaction.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
