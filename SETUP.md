# Environment Setup Guide

## 🔒 Security Configuration

All sensitive credentials have been moved to environment variables for security.

## Setup Instructions

### 1. Install Dependencies

```powershell
npm install dotenv
```

### 2. Environment Variables

The `.env` file has been created with your Firebase credentials. **NEVER commit this file to Git!**

**Files to keep private:**
- `.env` - Contains all your secrets
- `serviceAccountKey.json` - Firebase service account (if you have it)
- `agentSecrets.json` - Agent credentials

These files are now in `.gitignore` and won't be committed.

### 3. How It Works

#### Frontend (Vite + React)
The `src/firebase/config.ts` now uses Vite environment variables:
```typescript
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

#### Backend (Node.js Scripts)
The `bulkUpload.js` script uses standard environment variables:
```javascript
FIREBASE_PROJECT_ID
FIREBASE_PRIVATE_KEY
FIREBASE_CLIENT_EMAIL
... etc
```

### 4. Running Your App

```powershell
# Development
npm run dev

# Build
npm run build

# Run bulk upload script
node bulkUpload.js
```

### 5. For New Developers

1. Copy `.env.example` to `.env`
2. Fill in your Firebase credentials
3. Never commit `.env` to version control

## 🚨 Important Notes

- **`.env`** is in `.gitignore` - it will NOT be pushed to GitHub
- **`.env.example`** is a template with dummy values - safe to commit
- Always keep your credentials secure
- For production, use your hosting provider's environment variable system

## Committing Changes

Now you can safely commit your code without exposing secrets:

```powershell
git status
git add .
git commit -m "Refactor: Move all secrets to environment variables"
git push origin main
```

The sensitive files will be ignored automatically! 🎉
