from app import create_app, db

app = create_app()

if __name__ == '__main__':
    with app.app_context():
        # Automatically creates the 'orders' table in MySQL if it doesn't exist
        db.create_all()
        print("✅ Database tables checked/created successfully!")
        
    print("🚀 Flask Server running at: http://127.0.0.1:5000")
    app.run(debug=True, port=5000)