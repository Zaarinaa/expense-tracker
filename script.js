const balance = document.querySelector('#balance');
const money_plus = document.querySelector('#money-plus');
const money_minus = document.querySelector('#money-minus');
const list = document.querySelector('#list');
const text = document.querySelector('#text');
const amount = document.querySelector('#amount');
const form = document.querySelector('#form');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// add new Transactions
function addTransaction(e) {
  e.preventDefault();
  if (text.value === '' || amount.value === '') {
    alert('Please add a text and amount');
  } else {
    const transaction = {
      id: generateId(),
      text: text.value,
      amount: Number(amount.value),
    };
    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
  }
  text.value = '';
  amount.value = '';
}

// update LocalStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function generateId() {
  return Math.random() * 1000000;
}

// add existing transactions to DOM list
function addTransactionDOM(transaction) {
  const listItem = document.createElement('li');

  const sign = transaction.amount < 0 ? '-' : '+';
  listItem.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  listItem.innerHTML = `
    ${transaction.text}
    <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(listItem);
}

// calculate values
function updateValues() {
  let total = 0;
  let income = 0;
  let expense = 0;

  for (let i = 0; i < transactions.length; i++) {
    const { amount } = transactions[i];
    if (amount > 0) {
      income += amount;
    } else {
      expense += amount;
    }
    total += amount;
  }

  balance.innerText = `$${total.toFixed(2)}`;
  money_plus.innerText = `$${income.toFixed(2)}`;
  money_minus.innerText = `$${expense.toFixed(2)}`;
}

// Remove Transaction
function removeTransaction(id) {
  const filteredTransactions = [];
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].id !== id) {
      filteredTransactions.push(transactions[i]);
    }
  }
  transactions = filteredTransactions;
  updateLocalStorage();
  init();
}

function init() {
  list.innerHTML = '';
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    addTransactionDOM(transaction);
  }
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);
