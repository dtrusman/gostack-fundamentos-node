import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

type TransactionType = 'income' | 'outcome';

interface Request {
  title: string;
  value: number;
  type: TransactionType;
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const { total } = this.transactionsRepository.getBalance();

    if (type !== 'income' && type !== 'outcome') {
      throw Error('Type field accept only income or outcome');
    }

    if (!value) {
      throw Error('Value is mandatory');
    }

    if (!title) {
      throw Error('Title is mandatory');
    }

    if (type === 'outcome' && value > total) {
      throw Error('Insufficient funds');
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
