# Xetra AI Chatbot - Frontend

React-based frontend for Xetra AI Chatbot with a modern UI and responsive design.

## Prerequisites

- Node.js 16+
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

The app will be available at `http://localhost:3000`

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Add environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to a Git repository
2. Import the repository to Netlify
3. Set the build command: `npm run build` or `yarn build`
4. Set the publish directory: `build`
5. Add environment variables in the Netlify dashboard
6. Deploy!

## Environment Variables

- `REACT_APP_API_URL`: URL of the backend API (default: http://localhost:8000)
- `REACT_APP_ENV`: Environment (development/production)

## Available Scripts

- `npm start`: Start development server
- `npm test`: Run tests
- `npm run build`: Create production build
- `npm run eject`: Eject from create-react-app

## Features

- Dark/Light mode
- Responsive design
- Multiple AI personas
- Real-time chat interface
- Message history persistence
- Smooth animations
