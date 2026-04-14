# Clinical Documentation Agent (Backend)

Node.js + Express backend for a modular Clinical Documentation Agent pipeline.

## Tech Stack

- Backend: Node.js + Express
- AI Model: Google Gemini API
- Database (next phase): Supabase
- Frontend integration (next phase): React + Web Speech API transcript submission

## Implemented Architecture

```text
agent/
	agentController.js
	agentBrain.js
	inputProcessor.js
	geminiService.js
	medicalExtractor.js
	soapFormatter.js
	reviewHandler.js
routes/
	agentRoutes.js
server.js
```

## Setup

1. Install dependencies:

	 npm install

2. Create environment file:

	 Copy `.env.example` to `.env` and set values.

3. Start server:

	 npm start

## Environment Variables

- `PORT` (default: `3000`)
- `GEMINI_API_KEY` (required for live Gemini calls)
- `GEMINI_MODEL` (default: `gemini-1.5-flash`)
- `ALLOW_MOCK_GEMINI` (`true/false`, optional local fallback)

## API

### Health

- `GET /health`

### Process Transcript

- `POST /api/agent/process`
- Body:

```json
{
	"transcript": "patient has fever since 2 days"
}
```

- Response contains:
	- original + cleaned transcript
	- structured clinical JSON including entities, SOAP, confidence, and review flags

## Notes

- The current pipeline is: Input Preprocessing -> Gemini Reasoning -> Structured JSON output.
- Doctor approval workflow and Supabase persistence are scaffolded for next iteration via modular files.
