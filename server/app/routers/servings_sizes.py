from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.dependencies import get_db


router = APIRouter(
    prefix="/serving_sizes",
    tags=["serving_sizes"],
    responses={404: {"description": "Not found"}}
)


@router.post("/", response_model=schemas.ServingSize)
def create(serving_size_data: schemas.ServingSizeCreate, db: Session = Depends(get_db)):
    serving_size = models.ServingSize(**serving_size_data.model_dump())
    db.add(serving_size)
    db.commit()
    db.refresh(serving_size)
    return serving_size
