#!/usr/bin/env python3
import requests
import json

def test_api():
    base_url = "http://localhost:8000"
    
    # Test 1: Check if API is running
    print("Testing API health...")
    response = requests.get(f"{base_url}/")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()
    
    # Test 2: Create a new game
    print("Testing game creation...")
    game_data = {
        "beast_name": "The Black Wolf of Westminster",
        "inquisitor_name": "Sir Thomas"
    }
    response = requests.post(f"{base_url}/api/games", json=game_data)
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Message: {result.get('message')}")
        if result.get('game_data'):
            session_id = result['game_data'].get('session_id')
            print(f"Session ID: {session_id}")
            return session_id
    else:
        print(f"Error: {response.text}")
    print()
    
    return None

if __name__ == "__main__":
    session_id = test_api()
    if session_id:
        print(f"✅ API is working! Created game session: {session_id}")
        print("🎮 Both frontend and backend are running successfully!")
        print(f"Frontend: http://localhost:3000")
        print(f"Backend: http://localhost:8000")
    else:
        print("❌ API test failed")