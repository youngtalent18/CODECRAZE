const passwordInput = document.getElementById('password');
const lengthSlider = document.getElementById('length');
const lengthDisplay = document.getElementById('length-value');
const numbersChar = document.getElementById('numbers');
const symbolsChar = document.getElementById('symbols');
const uppercaseChar = document.getElementById('uppercase');
const lowercaseChar = document.getElementById('lowercase');
const copyBtn = document.getElementById('copy-btn');
const generateBtn = document.getElementById('gen-btn');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-con p');
const strengthLabel = document.getElementById('strength-label');

const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const symbols = "!@#$%^&*(){}[|]:;+=_-/<,>?";

// Display length
lengthSlider.addEventListener('input', () => {
    lengthDisplay.textContent = lengthSlider.value;
});

// Generate password on button click
generateBtn.addEventListener('click', makePassword);

// Also generate when DOM is ready
window.addEventListener("DOMContentLoaded", makePassword);

function makePassword() {
    const length = Number(lengthSlider.value);
    const includeLowercaseLetters = lowercaseChar.checked;
    const includeUppercaseLetters = uppercaseChar.checked;
    const includeNumbers = numbersChar.checked;
    const includeSymbols = symbolsChar.checked;

    if (!includeLowercaseLetters && !includeUppercaseLetters && !includeNumbers && !includeSymbols) {
        alert("You must select at least one type: lowercase, uppercase, numbers or symbols");
        return;
    }

    const newPassword = generateRandPass(
        length,
        includeLowercaseLetters,
        includeNumbers,
        includeSymbols,
        includeUppercaseLetters
    );

    passwordInput.value = newPassword;
    updateStrengthMeter(newPassword);
}

function generateRandPass(length, includeLowercaseLetters, includeNumbers, includeSymbols, includeUppercaseLetters) {
    let allChars = "";

    if (includeUppercaseLetters) allChars += uppercaseLetters;
    if (includeNumbers) allChars += numbers;
    if (includeLowercaseLetters) allChars += lowercaseLetters;
    if (includeSymbols) allChars += symbols;

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allChars.length);
        password += allChars[randomIndex];
    }
    return password;
}

function updateStrengthMeter(password) {
    const passwordLength = password.length;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()+=_\-[\]{}:;\/<,>?]/.test(password);

    let strengthScore = 0;

    strengthScore += Math.min(passwordLength * 2, 40);
    if (hasUppercase) strengthScore += 15;
    if (hasNumbers) strengthScore += 15;
    if (hasSymbols) strengthScore += 15;
    if (hasLowercase) strengthScore += 15;

    // Optionally penalize short passwords
    if (passwordLength < 8) {
        strengthScore = Math.min(strengthScore, 40);
    }

    const safeScore = Math.max(5, Math.min(100, strengthScore));
    strengthBar.style.width = safeScore + "%";

    let strengthLabelText = "";
    let barColor = "";

    if (safeScore < 40) {
        barColor = "#fc8181";  // red-ish
        strengthLabelText = "Weak";
    } else if (safeScore < 70) {
        barColor = "#fbd38d";  // yellow-ish
        strengthLabelText = "Medium";
    } else {
        barColor = "#68d391";  // green-ish
        strengthLabelText = "Strong";
    }

    strengthBar.style.backgroundColor = barColor;
    strengthLabel.textContent = strengthLabelText;
}

copyBtn.addEventListener("click", () => {
    const pwd = passwordInput.value;
    if (!pwd) return;

    navigator.clipboard.writeText(pwd)
        .then(() => showCopySuccess())
        .catch((err) => alert("Could not copy: " + err));
});

function showCopySuccess() {
    copyBtn.classList.remove("far", "fa-copy");
    copyBtn.classList.add("fas", "fa-check");
    copyBtn.style.color = "green";

    setTimeout(() => {
        copyBtn.classList.add("far", "fa-copy");
        copyBtn.classList.remove("fas", "fa-check");
        copyBtn.style.color = "";
    }, 1000);
}
