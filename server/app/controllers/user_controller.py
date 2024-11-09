from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional

import bcrypt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.constants import ACCESS_TOKEN_EXPIRE_IN_MINUTES, ALGORITHM, SECRET_KEY
from app.dependencies.auth import get_current_user, oauth2_scheme
from app.dependencies.database import get_db
from app.models import User
from app.schemas import (ExerciseLogRead, ExerciseRead, SimpleResultMessage,
                         Token, UserCreate, UserRead, UserUpdate)

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


async def create_access_token(
    data: Dict[str, Any], expires_delta: Optional[timedelta] = None
) -> str:
    to_encode = data.copy()
    if expires_delta is not None:
        expire = datetime.utcnow() + expires_delta
    else:
        expires_delta = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def verify_password(plain_password: str, hashed_password: str):
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )
    except ValueError:
        return False


async def get_password_hash(password: str):
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


@router.get("/check-token")
async def check_token(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token is invalid or expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        return {"message": "Token is valid"}
    except JWTError:
        raise credentials_exception


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    user_db = db.query(User).filter(User.email == form_data.username).first()
    if user_db is None or not await verify_password(
        form_data.password, user_db.hashed_password
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_IN_MINUTES)
    access_token = await create_access_token(
        data={"sub": user_db.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/", response_model=Token)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = await get_password_hash(user.password)

    user_db = User(name=user.name, email=user.email, hashed_password=hashed_password)

    db.add(user_db)
    db.commit()
    db.refresh(user_db)

    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_IN_MINUTES)

    access_token = await create_access_token(
        data={"sub": user_db.email}, expires_delta=expires_delta
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/", response_model=List[UserRead])
async def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()


@router.get("/me", response_model=UserRead)
async def get_current_logged_user(
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return current_user


@router.get("/{user_id}", response_model=UserRead)
async def read_user(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return user_db


@router.get("/{user_id}/exercises", response_model=List[ExerciseRead])
def get_exercises_by_user_id(
    user_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_db = db.query(User).filter(User.id == user_id).first()

    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user_db.exercises


@router.get("/{user_id}/exercise-logs", response_model=List[ExerciseLogRead])
def get_exercise_logs_by_user_id(
    user_id: int,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_db = db.query(User).filter(User.id == user_id).first()

    if not user_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return current_user.exercise_logs


@router.put("/", response_model=UserRead)
async def update_user(
    user_data: UserUpdate,
    current_user: UserRead = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_data_dict = user_data.dict(exclude_unset=True)
    for key, value in user_data_dict.items():
        if key == "password":
            key, value = "hashed_password", await get_password_hash(value)
        setattr(current_user, key, value)
    if not current_user.has_provided_info:
        current_user.has_provided_info = all(
            [
                user_data.gender,
                user_data.age,
                user_data.height,
                user_data.weight,
                user_data.activity_level,
                user_data.goal_type,
            ]
        )
    db.commit()
    db.refresh(current_user)
    return current_user


@router.delete("/", response_model=SimpleResultMessage)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_db = db.query(User).filter(User.id == user_id).first()
    if user_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    db.delete(user_db)
    db.commit()
    return {"message": "User deleted successfully"}


@router.get("/me/has-provided-physiology-information", response_model=Dict[str, bool])
async def check_physiology_information(
    current_user: UserRead = Depends(get_current_user),
):
    return {"result": current_user.has_physiology_information}
