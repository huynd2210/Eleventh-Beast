# The Eleventh Beast - Python Backend Setup Guide

This document explains how to run the rewritten Python backend with the frontend.

## What Was Implemented

### Python Backend (`python_backend/`)
- **game_engine.py**: Complete Python implementation of the game rules from gamerules.txt
- **main.py**: FastAPI server with REST endpoints
- **requirements.txt**: Python dependencies

### Frontend Modifications
- **lib/game-api.ts**: New API service for communicating with Python backend
- **components/game-setup.tsx**: Modified to create games via API
- **components/game-dashboard.tsx**: Updated to use API instead of internal logic
- **components/actions-panel.tsx**: Updated to call API endpoints
- **components/london-map.tsx**: Updated to use API for movement
- **app/page.tsx**: Updated to handle new API response format

## Key Changes Made

### 1. Python Game Engine
- Proper implementation of all game rules from gamerules.txt
- Correct dice rolling mechanics (1d8 for beast approach, 1d6 for movement)
- Accurate distance calculation using graph shortest path
- Proper action system (MOVE, INVESTIGATE, VERIFY, HUNT)
- Correct beast movement and hunt mechanics

### 2. API Endpoints
- `POST /api/games` - Create new game
- `GET /api/games/{session_id}` - Get game state
- `POST /api/games/action` - Perform game actions
- `GET /api/locations` - Get map data

### 3. Frontend Integration
- Game setup now creates games via API
- All game logic moved to backend
- Session-based game management
- Error handling for API failures

## How to Run

### 1. Start Python Backend
```bash
cd python_backend
pip install -r requirements.txt
python main.py
```
Backend will run on http://localhost:8000

### 2. Start Frontend
```bash
npm run dev
```
Frontend will run on http://localhost:3000

## ✅ Integration Complete

All frontend components have been successfully updated to use the Python API:

### 1. GameDashboard Component - ✅ Updated
- Replaced internal game logic with API calls
- Updated to use session_id for all actions  
- Handles async API responses with loading states
- Updates game log management via API

### 2. ActionsPanel Component - ✅ Updated
- Replaced direct game state modifications with API calls
- Handles move, investigate, verify, hunt actions via API
- Added loading states and comprehensive error handling

### 3. LondonMap Component - ✅ Updated
- Replaced internal movement logic with API calls
- Updated to use session-based location updates
- Handles action consumption via API

### 4. Game Setup and App - ✅ Updated
- Game setup creates games via Python API
- Main app handles new API response format
- Session management integrated throughout

## 🧹 Cleanup Completed

Removed unnecessary frontend files:
- Old random library (lib/random.ts) - now handled by Python backend
- All duplicate files and components

## 🚀 Ready to Use

The project is now fully integrated with a working Python backend and cleaned frontend. Follow the setup instructions below to run both servers.

The backend implements the correct game rules and provides a solid foundation. The frontend UI remains unchanged but now leverages the properly implemented backend logic.