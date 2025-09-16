document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pwd-form');
    const resultDiv = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const length = document.getElementById('length').value;
        const use_upper = document.getElementById('use_upper').checked;
        const use_lower = document.getElementById('use_lower').checked;
        const use_digits = document.getElementById('use_digits').checked;
        const use_special = document.getElementById('use_special').checked;

        const payload = {
            length: length,
            use_upper: use_upper,
            use_lower: use_lower,
            use_digits: use_digits,
            use_special: use_special
        };

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                resultDiv.textContent = "Error: " + (err.error || "Could not generate password");
                return;
            }

            const data = await response.json();
            resultDiv.textContent = "Generated Password: " + data.password;
        } catch (error) {
            resultDiv.textContent = "Error: " + error.message;
        }
    });
});