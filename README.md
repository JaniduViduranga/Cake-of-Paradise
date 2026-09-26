# Cake-of-Paradise
Full-stack e-commerce web application for Cake of Paradise shop in Walimada, Sri lanka built with React, Node.js, and Tailwind CSS.

## 💰 Dynamic Pricing Architecture

Prices are dynamically calculated in real time based on active configurations stored in MongoDB Atlas (`pricings` collection), taking into account cake classification, weight/tier scale, and premium flavor surcharges.

### 1. Standard & Birthday Cakes
Calculated using the base price plus the scaled weight and flavor surcharge:

$$\text{Total Price} = \text{Base Price} + \Big(\text{Weight (kg)} \times (\text{Price per kg} + \text{Flavor Surcharge})\Big)$$

* **Base Price:** Fixed starting fee per category (e.g., Rs. 2,000 for Standard, Rs. 2,500 for Birthday).
* **Flavor Surcharge:** Basic flavors (e.g., Butter) add Rs. 0; premium flavors (e.g., Chocolate, Ribbon, Date, Fruit) incur an added per-kg surcharge.

---

### 2. Cupcakes
Calculated using pack tier rates scaled by the flavor add-on:

$$\text{Total Price} = \text{Pack Price} + \Big(\text{Flavor Surcharge} \times \frac{\text{Pack Quantity}}{6}\Big)$$

* **Pack Options:** 6 Pack, 12 Pack, or 24 Pack fixed rates.
* **Flavor Scaling:** Surcharge scales proportionately with the quantity selected relative to a standard 6-pack.

---

### 3. Wedding Cakes
Calculated using the structure framework, optional floral arrangements, and the edible cake portion:

$$\text{Total Price} = \text{Base Price} + \text{Tier Structure Cost} + \text{Floral Add-on} + \Big(\text{Real Cake Weight} \times (\text{Price per kg} + \text{Flavor Surcharge})\Big)$$

* **Base Setup:** Fixed baseline fee (Rs. 15,000).
* **Tier Structures:** Tier-based structure rates (2, 3, or 4 tiers).
* **Add-ons:** Optional fresh flower decoration charges.
* **Edible Portion:** Scales with the requested weight and selected flavor.