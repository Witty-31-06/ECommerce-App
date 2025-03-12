import requests
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import random
# Initialize Firebase Admin SDK
cred = credentials.Certificate("./key.json")  # Update this path
firebase_admin.initialize_app(cred)

# Firestore reference
db = firestore.client()
collection_name = "products"

# Fetch total product count
total_count_url = "https://dummyjson.com/products"
total_response = requests.get(total_count_url)
if total_response.status_code != 200:
    print("❌ Failed to fetch total product count")
    exit()

total_products = total_response.json().get("total", 0)
print(f"📦 Total Products: {total_products}")

# Fetch all products in batches of 100 (DummyJSON allows max 100 per request)
batch_size = 100
skip = 0
uploaded_count = 0

while skip < total_products:
    url = f"https://dummyjson.com/products?limit={batch_size}&skip={skip}"
    response = requests.get(url)

    if response.status_code == 200:
        products = response.json().get("products", [])

        for product in products:
            created_at = product.get("meta", {}).get("createdAt")
            if created_at:
                created_at = datetime.fromisoformat(created_at.rstrip("Z"))  # Convert ISO string to datetime

            product_data = {
                "title": product["title"],
                "description": product["description"],
                "price": product["price"],
                "category": product["category"],
                "rating": product["rating"],
                "tags": product["tags"],
                "discount": product["discountPercentage"],
                "stock": product["stock"] * random.randint(3,50),  # Multiply stock by 50
                "isOnDeal": product["discountPercentage"] > 15.0,  # True if discount exists
                "addedOn": created_at,  # Current timestamp
                "image": product["images"][0],  
                "reviews": [
                    {
                        "rating": review["rating"],
                        "comment": review["comment"],
                        "reviewerName": review["reviewerName"],
                    }
                    for review in product.get("reviews", [])  # Extract required review fields
                ]
            }

            # Upload to Firestore using product ID as document ID
            doc_ref = db.collection(collection_name).document(str(product["id"]))
            doc_ref.set(product_data)
        
        uploaded_count += len(products)
        print(f"✅ Uploaded {uploaded_count}/{total_products} products...")
        skip += batch_size
    else:
        print(f"❌ Failed to fetch products at skip={skip}")
        break

print(f"🎉 Done! Uploaded {uploaded_count} products.")
