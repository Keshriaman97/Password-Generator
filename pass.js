const passwordDisplay = document.querySelector(".displey");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const inputSlider = document.querySelector("[data-lengthSlider]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>./?';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();

//set password length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;

}

function getRanInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRanInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode(getRanInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRanInteger(65, 91));
}

function generateSymbole() {
    return symbols.charAt(getRanInteger(0, symbols.length));
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.cheked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#00ff00");
    }
    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ffff00");
    }
    else {
        setIndicator("#ff0000");
    } 
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
        setTimeout(function () {
            copyMsg.innerText = "";
        }, 500);

    } catch (e) {
        copyMsg.innerText = "Failed";
    }
}

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    //array form ko string me badlane ke liye kyuki bich me coma aa jayenga 
    let str = "";
    array.forEach(function (el) {
        str += el;
    });
    return str;
}

//event listners
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach(function (checkbox) {
        if (checkbox.checked)
            checkCount++;
    });

    //special case
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach(function (checkbox) {//we can apply single check also this will change for every change
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', function (e) {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', function () {
    if (passwordDisplay.value)
        copyContent();
});


generateBtn.addEventListener('click', function () {
    //none of the checked box clicked
    if (checkCount <= 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
    //let's start the journey to find pass

    password = "";//empty old pass

    // if(uppercaseCheck.checked)
    //     password += generateUppercase();
    // if(lowercaseCheck.checked)
    //     password += generateLowercase();
    // if(numbersCheck.cheked) 
    //     password += generateRandomNumber();
    // if(symbolsCheck.checked) hasSym=true;
    //     password += generateSymbole();

    let funcArr = [];

    if (uppercaseCheck.checked)
        funcArr.push(generateUppercase);
    if (lowercaseCheck.checked)
        funcArr.push(generateLowercase);
    if (numbersCheck.checked)
        funcArr.push(generateRandomNumber);
    if (symbolsCheck.checked)
        funcArr.push(generateSymbole);

    //compulsory addition

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    //remaining element addition

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRanInteger(0, funcArr.length)
        password += funcArr[randIndex]();
    }

    //suffle the password

    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    calcStrength();


})

