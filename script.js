'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2022-04-28T09:15:04.904Z',
    '2022-07-01T10:17:24.185Z',
    '2022-07-08T14:11:59.604Z',
    '2022-07-18T17:01:17.194Z',
    '2022-07-20T23:36:17.929Z',
    '2022-07-21T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

///////////////////////////////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  // const day = `${date.getDate()} `.padStart(2, 0);
  // const month = `${date.getMonth() + 1} `.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${month} /${day}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formatedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formatedMov}</div>
      </div >
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};

// displayMovements(account1.movements);

// Balance formula with reduce function
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};
// calcDisplayBalance(account1.movements);


const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(outcomes, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};
// calcDisplaySummary(account1.movements);

const createUSernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUSernames(accounts);

const updateUI = function (currentAccount) {
  // Display movements
  displayMovements(currentAccount);

  // Display balance
  calcDisplayBalance(currentAccount);

  // display summary
  calcDisplaySummary(currentAccount);
}

const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // In each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;

    // When 0 seconds, stop timer and log out user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }

    // Decrease 1s
    time--;
  }
  // Set time to 5 minutes
  let time = 120;

  // Call the timer every second
  tick();
  const timer = setInterval(tick, 1000);

  return timer;
}

// 158. Implementing Login
// Event Handlers
let currentAccount, timer;

// Fake date always loggd in
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;
////////////////////////////////////

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submiting
  e.preventDefault();

  // console.log('Login');
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  // console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]} `;
    containerApp.style.opacity = 100;

    //Create current date and time vanilla JS
    // const now = new Date();
    // const day = `${now.getDate()} `.padStart(2, 0);
    // const month = `${now.getMonth() + 1} `.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${month} /${day}/${year}, ${hour}:${minutes} `;

    //Create current date and time using Intl date time formater
    const now = new Date()
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(currentAccount.locale, options).format(now);

    // Clear input filds
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);

    console.log('Login');

  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  // console.log(amount, receiverAcc);

  // Clear input filds
  inputTransferAmount.value = inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (amount > 0 && receiverAcc && currentAccount.balance >= amount && receiverAcc?.username !== currentAccount.username) {
    // console.log('Transfer Valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(+amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// 161. Some and Every
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // console.log('loand requested');
  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {// Add the move
      currentAccount.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 2500);

    // Reset timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// 160. The findIndex Method
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(accounts);

  if (currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)) {
    // console.log('Checked');
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete Account
    // console.log(index);

    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = inputClosePin.value = '';
  }
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(acc, !sorted);
  sorted = !sorted;
})

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// Movements for excersices below
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//Simple Array Methods
/*
let arr = ['a', 'b', 'c', 'd', 'e'];

//SLICE
console.log(arr.slice(2));
console.log(arr.slice(2, 4));
console.log(arr.slice(-2));
console.log(arr.slice(-1));
console.log(arr.slice(1, -2));
console.log(arr.slice());
console.log([...arr]);

// SPLICE
// console.log(arr.splice(2));
arr.splice(-1);
console.log(arr);
arr.splice(1, 2);
console.log(arr);

//REVERSE
arr = ['a', 'b', 'c', 'd', 'e'];
const arr2 = ['h', 'i', 'j', 'k', 'l']
console.log(arr2.reverse());
console.log(arr2);

//CONCAT
const letters = arr.concat(arr2);
console.log(letters);
console.log([...arr, ...arr2]);

//JOIN
console.log(letters.join(' - '));
*/

// The New Method
/*
const arr = [23, 11, 64];
console.log(arr[0]);
console.log(arr.at(0));

console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));
console.log(arr.at(-2));

console.log('Nestor'.at(0));
console.log('Nestor'.at(-1));
*/

// Looping Arrays: forEach
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

for (const movement of movements) {
  if (movement > 0) {
    console.log(`You deposited ${ movement } `);
  } else {
    console.log(`You withdraw ${ Math.abs(movement) } `);
  }
}

for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${ i + 0 }: You deposited ${ movement } `);
  } else {
    console.log(`Movement ${ i + 0 }: You withdraw ${ Math.abs(movement) } `);
  }
}

console.log('--- ForEach ---');
movements.forEach(function (movement) {
  if (movement > 0) {
    console.log(`You deposited ${ movement } `);
  } else {
    console.log(`You withdraw ${ Math.abs(movement) } `);
  }
});

movements.forEach(function (movement, i) {
  if (movement > 0) {
    console.log(`Movement ${ i + 0 }: You deposited ${ movement } `);
  } else {
    console.log(`Movement ${ i + 0 }: You withdraw ${ Math.abs(movement) } `);
  }
});
*/

//For Each with Maps and Sets
/*
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${ key }: ${ value } `);
});

//Set
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${ value }: ${ value } `);
})
*/

// PROJECT: Bankist App
// This was video 146, explaining the app that we are creating on this section

/*
// 147. Creating DOM Elements
// NOTE Code was copied here from the top of the file.
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
  < div class="movements__row" >
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </ >
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};

displayMovements(account1.movements);
*/

// 149. Data Transformations: map, filter, reduce
// 150. The map method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const eruToUsd = 1.1;

// // const movementsUSD = movements.map(function (mov) {
// //   return mov * eruToUsd;
// });

const movementsUSDfor = [];
for (const mov of movements) movementsUSDfor.push(mov * eruToUsd);
console.log(movementsUSDfor);

const movementsUSD = movements.map(mov => (mov * eruToUsd));

console.log(movements);
console.log(movementsUSD);

const movementDescriptions = movements.map((mov, i) => {
  return `Movement ${ i + 1 }: You ${ mov > 0 ? "deposited" : "withdrew" } ${ Math.abs(mov) } `;

  // Replaced byt the line above
  // if (mov > 0) {
  //   return `Movement ${ i + 1 }: You deposited ${ mov } `;
  // } else {
  //   return `Movement ${ i + 1 }: You withdrew ${ Math.abs(mov) } `;
  // }
});
console.log(movementDescriptions);
*/

// 151. Computing Usernames
/*
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
  < div class="movements__row" >
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </ >
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);

  });
};

displayMovements(account1.movements);

const createUSernames = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUSernames(accounts);
console.log(accounts);
*/

// 152. The filter method
/*
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

const withdrawals = movements.filter(mov => mov < 0);

console.log(movements);
console.log(deposits);
console.log(withdrawals);
*/

/*
// 153. The reduce method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log(movements);

//accumulator is like a snowball
const balance = movements.reduce(function (accumulator, currentValue, i, arr) {
  console.log(`Iteration ${ i }: ${ accumulator } `);
  return accumulator + currentValue;
}, 0);
console.log(balance);

// Maximum value normal
const max = movements.reduce((acc, curr) => {
  if (acc > curr)
    return acc;
  else
    return curr;
}, movements[0]);

// Maximum value using ternary value
const maxTernary = movements.reduce((acc, curr) => (acc > curr) ? acc : curr, movements[0]);

console.log(max);
console.log(maxTernary);
*/

/*
// 155. The magic of chinning
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const eurToUSd = 1.1;
const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map((mov, i, arr) => {
    // console.log(arr);
    return mov * eurToUSd;
  })
  // .map(mov => mov * eurToUSd)
  .reduce((acc, mov) => acc + mov, 0);
console.log(totalDepositUSD);
*/

/*
// 157. The find method
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);
console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);
*/

// 158. Implementing Login
// This lcture is on main containerApp, look up on top

// 160. The findIndex Method
// This lcture is on main containerApp, look up on top

/*
// 161. Some and Every
// This lcture is on main containerApp, look up on top
console.log(movements);

// Equality
console.log(movements.includes(-130));

// SOME: Condition
console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY:
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
*/

/*
// 162. Flat and flatMap
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
console.log(arrDeep.flat(2));

// flat
// Original Sequence
// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
// const allMovements = accountMovements.flat();
// console.log(allMovements);
// const overalBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// Sequence using chaining
const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

// flatMap
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance2);
*/

/*
// 163. Sorting Arrays
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);
// The line below doe snot work
console.log(movements.sort());

// return < 0, A, B
// return > 0, B, A
// Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   else return -1
// });

// Improvement
movements.sort((a, b) => a - b);
console.log(movements);

// Descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   else return 1
// });

// Improvement
movements.sort((a, b) => b - a);
console.log(movements);
*/

/*
// 164. More ways of Creating and Filling arrays
const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

const x = new Array(7);
console.log(x);
// console.log(x.map(() => 5));

// x.fill(1);
x.fill(1, 3, 5);
console.log(x);

arr.fill(23, 2, 6);
console.log(arr);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(z);


labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), el => Number(el.textContent.replace('€', '')));
  console.log(movementsUI);

  const movementsUI2 = [...document.querySelectorAll('movements__value')];
  console.log(movementsUI2);
});
*/
