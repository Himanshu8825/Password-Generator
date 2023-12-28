const inputSlider = document.querySelector('[data-lengthSlider]');
const lengthDisplay = document.querySelector('[data-lengthNumber]');
const passwordDisplay = document.querySelector('[data-passwordDisplay]');
const copyBtn = document.querySelector('[data-copy]');
const copyMsg = document.querySelector('[data-copyMsg]');
const upperCaseCheck = document.querySelector('#uppercase');
const lowerCaseCheck = document.querySelector('#lowercase');
const numbersCheck = document.querySelector('#numbers');
const symbolsCheck = document.querySelector('#symbols');
const indicator = document.querySelector('[data-indicator]');
const generateBtn = document.querySelector('.generaterButton');
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '~`!@#$%^&*()_+={[]}|;:"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//! Set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

//! Set Indicator
function setIndicator(color) {
    indicator.style.backgroundColor = color;
}

//! Random Integer
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//! Random Number
function generateRandomNumber() {
    return getRndInteger(0, 9);
}

//! LowerCase
function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

//! UpperCase
function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

//! Symbols
function generateSymbols() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

//! Calculate Strength
function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;

    if (upperCaseCheck.checked) hasUpper = true;
    if (lowerCaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator('#0f0');
    } else if ((hasLower || hasUpper) && (hasNumber || hasSymbol) && passwordLength >= 6) {
        setIndicator('#ff0');
    } else {
        setIndicator('#f00');
    }
}

//! Copy Content
async function copyContent() {
    try {
        await navigator.clipboard.writeText(password);
        copyMsg.innerText = 'copied';
    } catch (error) {
        copyMsg.innerText = 'failed';
    }

    copyMsg.classList.add('active');

    setTimeout(() => {
        copyMsg.classList.remove('active');
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleBoxchange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    // Special Case
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleBoxchange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (password) {
        copyContent();
    }
});

generateBtn.addEventListener('click', () => {
    // None of the checkboxes are selected
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    // Let's start the journey to find a new password

    // Remove old password
    password = "";

    // Let's put the stuff mentioned by checkboxes
    let funcArr = [];

    if (upperCaseCheck.checked) {
        funcArr.push(generateUpperCase);
    }

    if (lowerCaseCheck.checked) {
        funcArr.push(generateLowercase);
    }

    if (numbersCheck.checked) {
        funcArr.push(generateRandomNumber);
    }

    if (symbolsCheck.checked) {
        funcArr.push(generateSymbols);
    }

    // Compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    // Remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;

    // Calculate strength
    calcStrength();
});
