from app.db import db
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'

    # Primary Unique ID
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    
    # Customer Selection Data
    order_type = db.Column(db.String(50), nullable=False) # Standard, Birthday, Wedding, Cupcakes
    flavor = db.Column(db.String(100), nullable=False)
    cake_weight = db.Column(db.String(20), nullable=True) # 500g, 1kg, 2kg, etc.
    cupcake_quantity = db.Column(db.Integer, nullable=True)
    
    # Wedding Structure Fields
    wedding_package_type = db.Column(db.String(50), nullable=True) # cake_only, cake_and_structure
    structure_setup = db.Column(db.String(100), nullable=True)
    structure_tiers = db.Column(db.Integer, nullable=True)
    include_fresh_flowers = db.Column(db.Boolean, default=False)
    
    # Logistics & Personalization
    custom_message = db.Column(db.String(255), nullable=True)
    delivery_date = db.Column(db.String(50), nullable=False)
    delivery_time_slot = db.Column(db.String(100), nullable=False)
    
    # Total Price & Status Tracking
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(30), default='Pending') # Pending -> Baking -> Ready -> Delivered
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Convert database row to JSON for React
    def to_dict(self):
        return {
            "id": self.id,
            "orderType": self.order_type,
            "flavor": self.flavor,
            "weight": self.cake_weight,
            "cupcakeQuantity": self.cupcake_quantity,
            "weddingPackageType": self.wedding_package_type,
            "structureSetup": self.structure_setup,
            "structureTiers": self.structure_tiers,
            "includeFreshFlowers": self.include_fresh_flowers,
            "customMessage": self.custom_message,
            "deliveryDate": self.delivery_date,
            "deliveryTimeSlot": self.delivery_time_slot,
            "totalPrice": self.total_price,
            "status": self.status,
            "createdAt": self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }