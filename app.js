
const form = document.querySelector('form');

const loanAmtInput = document.querySelector('#amount');
const loanTermInput = document.querySelector('#term');
const interestRateInput = document.querySelector('#rate');

const monthlyRepayEl = document.querySelector('.monthly-repayment');
const totalRepayEl = document.querySelector('.total-repayment');

const submitBtn = document.querySelector('button[type="submit"]');
const clearBtn = document.querySelector('.title button');

// Object of error messages
const errorMessages = {
    amount: document.querySelector('#amount-error'),
    term: document.querySelector('#term-error'),
    rate: document.querySelector('#rate-error')
}

loanAmtInput.addEventListener('click', () => {
    loanAmtInput.select();
})

loanTermInput.addEventListener('click', () => {
    loanTermInput.select();
})

interestRateInput.addEventListener('click', () => {
    interestRateInput.select();
})

loanAmtInput.addEventListener('input', (e) => {
    // Remove characters that aren't numbers or a decimal
    let value = e.target.value.replace(/[^0-9.]/g, '');

    let parts = value.split('.');
    // Apply commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    // Rejoin if there's a decimal part
    e.target.value = parts.join('.');
    console.log(value);

    if (value === '') {
        errorMessages.amount.style.display = 'block'
        errorMessages.amount.previousElementSibling.firstElementChild.classList.add('error');
        errorMessages.amount.innerText = 'This field is required.'
    } else if (value < 500 || value > 10000000) {
        errorMessages.amount.style.display = 'block'
        errorMessages.amount.previousElementSibling.firstElementChild.classList.add('error');
        errorMessages.amount.innerText = 'Enter amount between $500 and $10,000,000.'
    } else {
        errorMessages.amount.style.display = 'none';
        errorMessages.amount.previousElementSibling.firstElementChild.classList.remove('error');
    }
    toggleSubmitBtn();
})

loanTermInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[eE\+\-]/g, '');
    e.target.value = value;
    if (value === '') {
        errorMessages.term.style.display = 'block'
        errorMessages.term.previousElementSibling.lastElementChild.classList.add('error');
        errorMessages.term.innerText = 'This field is required.'

    } else if (value < 1 || value > 1000) {
        errorMessages.term.style.display = 'block'
        errorMessages.term.previousElementSibling.lastElementChild.classList.add('error');
        errorMessages.term.innerText = 'Enter amount between 1 and 1,000.'
    } else {
        errorMessages.term.style.display = 'none';
        errorMessages.term.previousElementSibling.lastElementChild.classList.remove('error');
    }
    toggleSubmitBtn();
})

interestRateInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[eE\+\-]/g, '');
    e.target.value = value;
    if (value === '') {
        errorMessages.rate.style.display = 'block'
        errorMessages.rate.previousElementSibling.lastElementChild.classList.add('error');
        errorMessages.rate.innerText = 'This field is required.'
    } else if (value < 1 || value > 1000) {
        errorMessages.rate.style.display = 'block'
        errorMessages.rate.previousElementSibling.lastElementChild.classList.add('error');
        errorMessages.rate.innerText = 'Enter amount between 1 and 1,000.'
    } else {
        errorMessages.rate.style.display = 'none';
        errorMessages.rate.previousElementSibling.lastElementChild.classList.remove('error');
    }
    toggleSubmitBtn();
})

clearBtn.addEventListener('click', () => {
    // Clear inputs
    loanAmtInput.value = '0';
    loanTermInput.value = '0';
    interestRateInput.value = '0';
    monthlyRepayEl.innerText = '0';
    totalRepayEl.innerText = '0';

    // Reset radio default
    document.querySelector('#repayment').checked = true;
    document.querySelector('#interest-only').checked = false;

    // Disalbe submit btn
    submitBtn.classList.add('disabled-btn');
    submitBtn.style.pointerEvents = 'none';
    submitBtn.disabled = true;
})

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Check loan type
    function type() {
        return document.querySelector('fieldset input[type="radio"]:checked')
    }

    // Remove commas
    let loanValue = +loanAmtInput.value.replace(/,/g, '');
    let interestRate = +interestRateInput.value;
    let term = +loanTermInput.value
    const selected = type();
    console.log(loanValue, interestRate, term);

    if (selected.value === 'repayment') {
        const repayment = calcLoanPayments(loanValue, interestRate, term);
        monthlyRepayEl.innerText = `$${repayment.monthlyPayment}`;
        totalRepayEl.innerText = `$${repayment.totalRepaid}`;
        console.log(repayment.monthlyPayment, repayment.totalRepaid);
    } else if (selected.value === 'interest-only') {
        const interestPayment = calcInterestPayments(loanValue, interestRate, term);
        monthlyRepayEl.innerText = `$${interestPayment.monthlyInterest}`;
        totalRepayEl.innerText = `$${interestPayment.totalInterest}`;
        console.log(interestPayment.monthlyInterest, interestPayment.totalInterest);
    }
})

function formatNumberWithCommas(num) {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function toggleSubmitBtn() {
    for (errMsg of Object.values(errorMessages)) {
        if (getComputedStyle(errMsg).display === 'block') {
            submitBtn.classList.add('disabled-btn');
            submitBtn.style.pointerEvents = 'none';
            submitBtn.disabled = true;
            return;
        }
        if (loanAmtInput.value === '0' || loanTermInput.value === '0' || interestRateInput.value === '0') {
            submitBtn.classList.add('disabled-btn');
            submitBtn.style.pointerEvents = 'none';
            submitBtn.disabled = true;
        } else {
            submitBtn.classList.remove('disabled-btn');
            submitBtn.style.pointerEvents = 'auto';
            submitBtn.disabled = false;
        }
    }
}

function calcLoanPayments(loanAmount, annualRate, termMonths) {
    const monthlyRate = annualRate / 12 / 100;
    const n = termMonths;

    // Monthly Payment
    const monthlyPayment = loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)));
    const totalRepaid = monthlyPayment * n;

    return {
        monthlyPayment: formatNumberWithCommas(monthlyPayment.toFixed(2)),
        totalRepaid: formatNumberWithCommas(totalRepaid.toFixed(2))
    };
}

function calcInterestPayments(loanAmount, annualRate, termMonths) {
    const monthlyRate = annualRate / 12 / 100;
    const n = termMonths;
    const monthlyPayment = loanAmount * (monthlyRate / (1 - Math.pow(1 + monthlyRate, -n)));

    const monthlyInterest = loanAmount * monthlyRate;
    const totalInterest = (monthlyPayment * termMonths) - loanAmount;

    return {
        monthlyInterest: formatNumberWithCommas(monthlyInterest.toFixed(2)),
        totalInterest: formatNumberWithCommas(totalInterest.toFixed(2))
    }
}