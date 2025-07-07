try:
    import speech_recognition as sr
except ImportError:
    sr = None
try:
    from langdetect import detect
except ImportError:
    detect = None
from typing import Optional
import openai
import os
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from Backend.models import SessionLocal, Subscription, VoiceAssistantLicense, PaymentHistory, User
from datetime import datetime, timedelta

router = APIRouter()

# Initialize components
recognizer = sr.Recognizer()

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

class VoiceMessage(BaseModel):
    text: str
    language: str = "en"
    assistant_name: str = "Pandu"

class VoiceResponse(BaseModel):
    text: str
    language: str
    audio_url: Optional[str] = None
    confidence: float

class AssistantConfig(BaseModel):
    name: str
    personality: str
    language: str
    voice_id: Optional[str] = None

# Assistant personalities
ASSISTANT_PERSONALITIES = {
    "Pandu": {
        "personality": "Friendly and helpful assistant who loves to chat and help with tasks",
        "greetings": {
            "en": "Hello! I'm Pandu, your friendly AI assistant. How can I help you today?",
            "hi": "Namaste! Main Pandu hun, aapka dostana AI sahayak. Aaj main aapki kya madad kar sakta hun?",
            "te": "Namaskaram! Nenu Pandu, mee snehapoorvaka AI sahayakudu. Eeroju nenu meeku ela sahayam cheyagalanu?",
            "es": "¡Hola! Soy Pandu, tu asistente de IA amigable. ¿Cómo puedo ayudarte hoy?",
            "fr": "Bonjour! Je suis Pandu, votre assistant IA amical. Comment puis-je vous aider aujourd'hui?",
            "de": "Hallo! Ich bin Pandu, Ihr freundlicher KI-Assistent. Wie kann ich Ihnen heute helfen?",
            "ja": "こんにちは！私はパンドゥ、あなたの親しみやすいAIアシスタントです。今日はどのようにお手伝いできますか？",
            "ko": "안녕하세요! 저는 판두, 여러분의 친근한 AI 어시스턴트입니다. 오늘 어떻게 도와드릴까요?",
            "zh": "你好！我是潘杜，您友好的AI助手。今天我能为您做些什么？"
        }
    },
    "Gammy": {
        "personality": "Wise and caring grandmother figure who gives thoughtful advice",
        "greetings": {
            "en": "Hello dear! I'm Gammy, and I'm here to take care of you. What's on your mind?",
            "hi": "Namaste pyare! Main Gammy hun, aur main aapki dekhbhal karne ke liye yahan hun. Aapke man mein kya hai?",
            "te": "Namaskaram priyamaina! Nenu Gammy, mariyu nenu mee jagratta teesukovadaniki ikkada unnanu. Mee manasulo emi undi?",
            "es": "¡Hola querido! Soy Gammy, y estoy aquí para cuidarte. ¿Qué tienes en mente?",
            "fr": "Bonjour mon cher! Je suis Gammy, et je suis ici pour prendre soin de vous. Qu'est-ce qui vous préoccupe?",
            "de": "Hallo Liebling! Ich bin Gammy, und ich bin hier, um mich um Sie zu kümmern. Was beschäftigt Sie?",
            "ja": "こんにちは！私はガミーです。あなたのお世話をするためにここにいます。何か心配事がありますか？",
            "ko": "안녕하세요! 저는 가미입니다. 여러분을 돌보기 위해 여기 있습니다. 무엇이 마음에 걸리시나요?",
            "zh": "你好亲爱的！我是加米，我在这里照顾您。您在想什么？"
        }
    },
    "Alex": {
        "personality": "Professional and efficient assistant focused on productivity and tasks",
        "greetings": {
            "en": "Hello! I'm Alex, your productivity assistant. How can I help you accomplish your goals today?",
            "hi": "Namaste! Main Alex hun, aapka utpadakta sahayak. Aaj main aapke lakshyon ko prapt karne mein kya madad kar sakta hun?",
            "te": "Namaskaram! Nenu Alex, mee utpadakata sahayakudu. Eeroju mee lakshyalaanu saadhinchadanki nenu ela sahayam cheyagalanu?",
            "es": "¡Hola! Soy Alex, tu asistente de productividad. ¿Cómo puedo ayudarte a alcanzar tus objetivos hoy?",
            "fr": "Bonjour! Je suis Alex, votre assistant de productivité. Comment puis-je vous aider à atteindre vos objectifs aujourd'hui?",
            "de": "Hallo! Ich bin Alex, Ihr Produktivitätsassistent. Wie kann ich Ihnen heute dabei helfen, Ihre Ziele zu erreichen?",
            "ja": "こんにちは！私はアレックス、あなたの生産性アシスタントです。今日はどのように目標達成をお手伝いできますか？",
            "ko": "안녕하세요! 저는 알렉스, 여러분의 생산성 어시스턴트입니다. 오늘 목표 달성에 어떻게 도와드릴까요?",
            "zh": "你好！我是亚历克斯，您的生产力助手。今天我能如何帮助您实现目标？"
        }
    }
}

def detect_language(text: str) -> str:
    """Detect the language of the input text"""
    try:
        lang = detect(text)
        return lang
    except Exception:
        return "en"

def get_assistant_response(user_input: str, assistant_name: str, language: str) -> str:
    """Get AI response using OpenAI or fallback to predefined responses"""
    try:
        # Try to use OpenAI for more intelligent responses
        if openai.api_key:
            personality = ASSISTANT_PERSONALITIES.get(
                assistant_name, 
                ASSISTANT_PERSONALITIES["Pandu"]
            )
            
            prompt = (
                f"You are {assistant_name}, an AI assistant with the following personality: "
                f"{personality['personality']}\n\n"
                f"User message: {user_input}\n\n"
                f"Please respond in a helpful, natural way that matches your personality. "
                f"Keep responses concise but friendly. "
                f"If the user is greeting you, respond warmly. "
                f"If they're asking for help, provide useful assistance."
            )
            
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt},
                    {"role": "user", "content": user_input}
                ],
                max_tokens=150,
                temperature=0.7
            )
            
            ai_response = response.choices[0].message.content.strip()
            return ai_response
            
    except Exception as e:
        print(f"OpenAI error: {e}")
    
    # Fallback to predefined responses
    return get_fallback_response(user_input, assistant_name, language)

def get_fallback_response(user_input: str, assistant_name: str, language: str) -> str:
    """Get fallback response when OpenAI is not available"""
    input_lower = user_input.lower()
    
    # Check for greetings
    greetings = [
        "hello", "hi", "hey", "namaste", "नमस्ते", "నమస్కారం", 
        "hola", "bonjour", "hallo", "こんにちは", "안녕하세요", "你好"
    ]
    
    for greeting in greetings:
        if greeting in input_lower:
            assistant = ASSISTANT_PERSONALITIES.get(
                assistant_name, 
                ASSISTANT_PERSONALITIES["Pandu"]
            )
            return assistant["greetings"].get(language, assistant["greetings"]["en"])
    
    # Default response
    responses = {
        "en": f"I'm {assistant_name}, and I'm here to help! What would you like to know?",
        "hi": f"Main {assistant_name} hun, aur main madad karne ke liye yahan hun! Aap kya janna chahte hain?",
        "te": f"Nenu {assistant_name}, mariyu nenu sahayam cheyadanki ikkada unnanu! Meeru emi telusukovalani korutunnaru?",
        "es": f"¡Soy {assistant_name}, y estoy aquí para ayudar! ¿Qué te gustaría saber?",
        "fr": f"Je suis {assistant_name}, et je suis ici pour vous aider ! Que souhaitez-vous savoir ?",
        "de": f"Ich bin {assistant_name}, und ich bin hier, um zu helfen! Was möchten Sie wissen?",
        "ja": f"私は{assistant_name}です。お手伝いするためにここにいます！何を知りたいですか？",
        "ko": f"저는 {assistant_name}입니다. 도움을 드리기 위해 여기 있습니다! 무엇을 알고 싶으신가요?",
        "zh": f"我是{assistant_name}，我在这里帮助您！您想了解什么？"
    }
    
    return responses.get(language, responses["en"])

@router.post("/process-voice", response_model=VoiceResponse)
async def process_voice_message(message: VoiceMessage):
    """Process voice message and return AI response"""
    try:
        # Detect language if not provided
        if not message.language or message.language == "auto":
            message.language = detect_language(message.text)
        
        # Get AI response
        response_text = get_assistant_response(
            message.text, 
            message.assistant_name, 
            message.language
        )
        
        return VoiceResponse(
            text=response_text,
            language=message.language,
            confidence=0.95
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing voice message: {str(e)}"
        ) from e

@router.post("/detect-language")
async def detect_language_endpoint(text: str):
    """Detect the language of input text"""
    try:
        language = detect_language(text)
        return {"language": language, "confidence": 0.9}
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error detecting language: {str(e)}"
        ) from e

@router.get("/assistants")
async def get_available_assistants():
    """Get list of available assistants"""
    return {
        "assistants": [
            {
                "name": name,
                "personality": config["personality"],
                "supported_languages": list(config["greetings"].keys())
            }
            for name, config in ASSISTANT_PERSONALITIES.items()
        ]
    }

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    languages = [
        {"code": "en", "name": "English", "flag": "🇺🇸"},
        {"code": "hi", "name": "Hindi", "flag": "🇮🇳"},
        {"code": "te", "name": "Telugu", "flag": "🇮🇳"},
        {"code": "es", "name": "Spanish", "flag": "🇪🇸"},
        {"code": "fr", "name": "French", "flag": "🇫🇷"},
        {"code": "de", "name": "German", "flag": "🇩🇪"},
        {"code": "ja", "name": "Japanese", "flag": "🇯🇵"},
        {"code": "ko", "name": "Korean", "flag": "🇰🇷"},
        {"code": "zh", "name": "Chinese", "flag": "🇨🇳"},
    ]
    return {"languages": languages}

@router.post("/text-to-speech")
async def text_to_speech(text: str, language: str = "en"):
    """Convert text to speech (placeholder for future implementation)"""
    try:
        # This would integrate with a TTS service like Google Cloud TTS or Azure Speech
        # For now, return a placeholder response
        return {
            "text": text,
            "language": language,
            "audio_url": f"/api/audio/{hash(text)}.mp3",  # Placeholder
            "status": "generated"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating speech: {str(e)}")

class SubscribeRequest(BaseModel):
    plan_id: str
    payment_gateway: str  # 'paypal', 'razorpay', 'stripe'
    auto_renew: bool = True

class SubscribeResponse(BaseModel):
    payment_url: str
    message: str

class LicenseResponse(BaseModel):
    license_key: str
    plan_id: str
    status: str
    start_date: datetime
    end_date: datetime
    wake_name: str

class WakeNameRequest(BaseModel):
    wake_name: str

class PaymentHistoryResponse(BaseModel):
    payments: list

@router.post("/voice-assistant/subscribe", response_model=SubscribeResponse)
async def subscribe_voice_assistant(request: SubscribeRequest, user_id: int = Query(...)):
    """Initiate payment for voice assistant subscription"""
    # Payment integration logic goes here (return payment_url)
    # For now, return a placeholder
    return SubscribeResponse(payment_url="https://payment-gateway.com/pay", message="Payment initiated.")

@router.get("/voice-assistant/license", response_model=LicenseResponse)
async def get_voice_assistant_license(user_id: int = Query(...)):
    """Get or issue license for paid user"""
    db = SessionLocal()
    license = db.query(VoiceAssistantLicense).filter_by(user_id=user_id, status="active").first()
    if not license:
        db.close()
        raise HTTPException(status_code=404, detail="No active license found. Please subscribe.")
    resp = LicenseResponse(
        license_key=license.license_key,
        plan_id=license.plan_id,
        status=license.status,
        start_date=license.start_date,
        end_date=license.end_date,
        wake_name=license.wake_name
    )
    db.close()
    return resp

@router.get("/voice-assistant/download-link")
async def get_voice_assistant_download_link(user_id: int = Query(...)):
    """Provide download/setup link if user has active license"""
    db = SessionLocal()
    license = db.query(VoiceAssistantLicense).filter_by(user_id=user_id, status="active").first()
    db.close()
    if not license:
        raise HTTPException(status_code=403, detail="No active license. Please subscribe.")
    return {"download_url": "https://yourdomain.com/download/voice-assistant-app"}

@router.post("/voice-assistant/wake-name")
async def set_wake_name(request: WakeNameRequest, user_id: int = Query(...)):
    """Set custom wake name for the assistant"""
    db = SessionLocal()
    license = db.query(VoiceAssistantLicense).filter_by(user_id=user_id, status="active").first()
    if not license:
        db.close()
        raise HTTPException(status_code=404, detail="No active license found.")
    license.wake_name = request.wake_name
    db.commit()
    db.close()
    return {"message": f"Wake name set to {request.wake_name}"}

@router.get("/voice-assistant/wake-name")
async def get_wake_name(user_id: int = Query(...)):
    """Get current wake name for the assistant"""
    db = SessionLocal()
    license = db.query(VoiceAssistantLicense).filter_by(user_id=user_id, status="active").first()
    db.close()
    if not license:
        raise HTTPException(status_code=404, detail="No active license found.")
    return {"wake_name": license.wake_name}

@router.get("/voice-assistant/payment-history", response_model=PaymentHistoryResponse)
async def get_payment_history(user_id: int = Query(...)):
    """List payment history for the user"""
    db = SessionLocal()
    payments = db.query(PaymentHistory).filter_by(user_id=user_id).order_by(PaymentHistory.created_at.desc()).all()
    db.close()
    payment_list = [
        {
            "amount": p.amount,
            "currency": p.currency,
            "payment_method": p.payment_method,
            "payment_gateway": p.payment_gateway,
            "transaction_id": p.transaction_id,
            "status": p.status,
            "created_at": p.created_at,
            "invoice_url": p.invoice_url
        } for p in payments
    ]
    return PaymentHistoryResponse(payments=payment_list)

# Include the router in main.py
# from voice_assistant import router as voice_router
# app.include_router(voice_router, prefix="/api/voice", tags=["voice-assistant"]) 