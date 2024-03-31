from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient

app = FastAPI()

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['user_database']
collection = db['users']

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],  # Adjust this according to your frontend URL
    allow_credentials=True,
    allow_methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allow_headers=['*'],
)


class User(BaseModel):
    username: str
    password: str
    email: str
    phoneNumber: str


@app.post("/register/")
async def register_user(user: User):
    # Check if the username already exists
    existing_user = collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Check if the email already exists
    existing_email = collection.find_one({"email": user.email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already exists")

    # Check if the phone number already exists
    existing_phone_number = collection.find_one({"phoneNumber": user.phoneNumber})
    if existing_phone_number:
        raise HTTPException(status_code=400, detail="Phone number already exists")

    # Validate other constraints
    if len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    # Insert the user into the database
    user_dict = user.model_dump()
    collection.insert_one(user_dict)
    return {"message": "User registered successfully"}
