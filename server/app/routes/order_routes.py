from flask import Blueprint, request, jsonify
from app.db import db
from app.models.order import Order

order_bp = Blueprint('order_bp', __name__)

# POST Endpoint: React sends order data here
@order_bp.route('/', methods=['POST'])
def place_order():
    data = request.get_json()
    
    if not data:
        return jsonify({"success": False, "error": "No order data provided"}), 400

    try:
        # Create a new Order record instance
        new_order = Order(
            order_type=data.get('orderType', 'Standard'),
            flavor=data.get('flavor', 'Butter Cake'),
            cake_weight=data.get('weight'),
            cupcake_quantity=data.get('cupcakeQuantity'),
            wedding_package_type=data.get('weddingPackageType'),
            structure_setup=data.get('structureSetup'),
            structure_tiers=data.get('structureTiers'),
            include_fresh_flowers=data.get('includeFreshFlowers', False),
            custom_message=data.get('customMessage'),
            delivery_date=data.get('deliveryDate', ''),
            delivery_time_slot=data.get('deliveryTimeSlot', ''),
            total_price=float(data.get('totalPrice', 0))
        )
        
        # Save to MySQL
        db.session.add(new_order)
        db.session.commit()
        
        return jsonify({
            "success": True,
            "message": "Cake order placed successfully!",
            "order": new_order.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

# GET Endpoint: Fetch all orders for admin/profile view
@order_bp.route('/', methods=['GET'])
def get_all_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    return jsonify({
        "success": True,
        "orders": [order.to_dict() for order in orders]
    }), 200