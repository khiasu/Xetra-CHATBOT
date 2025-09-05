from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI
app = FastAPI(
    title="Xetra AI Chatbot Backend",
    version="1.0.0",
    description="Backend API for Xetra AI Chatbot",
    docs_url="/docs",
    redoc_url=None
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://xetra-ai-chatbot.vercel.app",
    "https://xetra-ai-chatbot.vercel.app/*",
    "https://*.vercel.app",
    "https://*.vercel.app/*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Environment variables
API_BASE_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
DEBUG = os.getenv("DEBUG", "false").lower() == "true"

class ChatRequest(BaseModel):
    message: str
    tone: str
    temperature: float
    persona: str

@app.get("/")
async def root():
    return {"message": "Welcome to Xetra AI Chatbot"}

@app.post("/chat")
async def chat(request: ChatRequest):
    """
    Process chat messages and return AI responses.
    
    Args:
        request (ChatRequest): The chat request containing message, tone, temperature, and persona.
        
    Returns:
        dict: The AI's response or an error message.
    """
    try:
        # Construct the prompt with persona and tone
        prompt = f"You are {request.persona}. Respond in a {request.tone} tone: {request.message}"
        
        # Prepare the request data
        data = {
            "model": "llama2",
            "messages": [{"role": "user", "content": prompt}],
            "stream": False,
            "options": {"temperature": request.temperature}
        }
        
        # Make the API request
        api_url = f"{API_BASE_URL}/api/chat"
        if DEBUG:
            print(f"Sending request to {api_url} with data:", data)
            
        response = requests.post(api_url, json=data, timeout=30)
        response.raise_for_status()
        
        # Process the response
        result = response.json()
        if DEBUG:
            print("Received response:", result)
            
        return {
            "response": result.get("message", {}).get("content", "No response generated"),
            "model": result.get("model", "llama2"),
            "tokens_used": result.get("eval_count", 0)
        }
        
    except requests.exceptions.Timeout:
        raise HTTPException(status_code=504, detail="Request to AI service timed out")
    except requests.exceptions.RequestException as e:
        if DEBUG:
            print(f"Request error: {str(e)}")
        raise HTTPException(
            status_code=502,
            detail=f"Error communicating with AI service: {str(e)}"
        )
    except Exception as e:
        if DEBUG:
            print(f"Unexpected error: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )
