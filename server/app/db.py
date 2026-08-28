from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase

# Define modern base model class for SQLAlchemy 3.x
class Base(DeclarativeBase):
    pass

# Create the db instance
db = SQLAlchemy(model_class=Base)