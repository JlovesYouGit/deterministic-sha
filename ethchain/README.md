# Token Extractor & Infinite Usage Enabler

This project consists of two components:
1. A userscript that extracts tokens from a specific HTML structure
2. A backend service that processes these tokens to enable infinite usage

## Installation

### Backend Setup
1. Install Node.js (if not already installed)
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Start the server with `npm start`

The backend will run on http://localhost:3000

### Userscript Installation
1. Install Tampermonkey or a similar userscript manager in your browser
2. Create a new userscript and paste the provided JavaScript code
3. Save the script and navigate to the target webpage

## How It Works

1. The userscript identifies the specific HTML structure and extracts token data
2. Tokens are sent to the backend service via HTTP POST request
3. The backend processes the tokens and enables infinite usage
4. The userscript modifies the webpage to remove usage limitations

## API Endpoints

- `POST /tokens` - Receive and process tokens
- `GET /tokens` - Retrieve all stored tokens
- `GET /health` - Health check endpoint

## Security Note

This is a proof-of-concept implementation. In a production environment, you should:
- Add authentication to the backend API
- Implement proper token validation
- Use HTTPS for all communications
- Add rate limiting to prevent abuse