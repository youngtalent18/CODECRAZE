
from flask import Flask, render_template, request, jsonify
import secrets
import string

app = Flask(__name__)

def generate_password(length=16, use_upper=True, use_lower=True, use_digits=True, use_special=True):
    """
    Generate a password using cryptographically secure randomness
    """
    chars = ''
    if use_upper:
        chars += string.ascii_uppercase
    if use_lower:
        chars += string.ascii_lowercase
    if use_digits:
        chars += string.digits
    if use_special:
        chars += string.punctuation

    if not chars:
        # return characters as default
        return "You must choose at least a character"

    password = ''.join(secrets.choice(chars) for _ in range(length))
    return password

@app.route('/')
def index():
    return render_template('password.html')

@app.route('/api/generate', methods=['POST'])
def api_generate():
    data = request.json or {}

    length = data.get('length', 16)
    use_upper = data.get('use_upper', True)
    use_lower = data.get('use_lower', True)
    use_digits = data.get('use_digits', True)
    use_special = data.get('use_special', True)

    # Validate length
    try:
        length = int(length)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid length"}), 400

    if length < 4 or length > 128:
        return jsonify({"error": "Length must be between 4 and 128"}), 400

    pwd = generate_password(length, use_upper, use_lower, use_digits, use_special)
    return jsonify({"password": pwd})

if __name__ == '__main__':
    # For development only
    app.run(debug=True)
