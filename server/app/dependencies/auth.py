from datetime import datetime
from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.constants import ALGORITHM, SECRET_KEY
from app.dependencies.database import get_db
from app.models import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def verify_token(token: str) -> Dict[str, Any] | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        exp = payload.get("exp")
        if exp and datetime.utcnow() >= datetime.utcfromtimestamp(exp):
            return None

        return payload
    except JWTError:
        return None


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = verify_token(token)

    if not payload or not (email := payload.get("sub")):
        raise credentials_exception

    user_db = db.query(User).filter(User.email == email).first()

    if not user_db:
        raise credentials_exception

    return user_db
