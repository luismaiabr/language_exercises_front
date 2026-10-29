# AI-Driven German Exercise Platform - Frontend

High-contrast monochromatic client application for solving daily German exercises with instant client-side multiple-choice validation and real-time runtime AI evaluation for written prompts.

## Design Aesthetic
- **Monochromatic palette**: Deep Black (`#0A0A0A`) and Dark Charcoal (`#141414`)
- **Accents**: Cyan (`#00E5FF`) for focus and the rotating loading arch; Gold (`#FFD700`) for mastery score highlights
- **Referrer suppression**: `<meta name="referrer" content="no-referrer">`

## Features
- **Capability Magic Link routing**: `/lesson/:token`
- **Session Expired 410 state**: Intercepts expired tokens and prevents unauthorized answer evaluation
- **100% Client-Side Instant Multiple Choice**: Instant feedback with per-option explanations, automatically highlighting the correct choice if wrong
- **Dynamic AI Written Evaluation**: Shows rotating cyan loading arch while querying the backend and OpenRouter Gemini Flash

## Running the Frontend
```powershell
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build production bundle
npm run build
```
Vite runs at `http://localhost:5173` and proxies `/api` calls to the FastAPI backend at `http://localhost:8000`.