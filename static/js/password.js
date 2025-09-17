document.addEventListener('DOMContentLoaded', () => {
    const resultDiv = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const lengthSlider = document.getElementById('length');
    const lengthDisplay = document.getElementById('length-container');
    const generateBtn = document.getElementById('generate-btn'); // NEW

    // Show length value live
    lengthSlider.addEventListener('input', () => {
        lengthDisplay.textContent = lengthSlider.value;
    });

    generateBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const length = document.getElementById('length').value;
        const use_upper = document.getElementById('uppercase').checked;
        const use_lower = document.getElementById('lowercase').checked;
        const use_digits = document.getElementById('numbers').checked;
        const use_special = document.getElementById('symbols').checked;

        const payload = {
            length,
            use_upper,
            use_lower,
            use_digits,
            use_special
        };

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                resultDiv.value = "Error: " + (err.error || "Could not generate password");
                return;
            }

            const data = await response.json();
            resultDiv.value = data.password;
        } catch (error) {
            resultDiv.value = "Error: " + error.message;
        }
    });

    // Copy password
    copyBtn.addEventListener("click", () => {
        const password = resultDiv.value;
        if (!password) return;

        navigator.clipboard.writeText(password)
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
});
