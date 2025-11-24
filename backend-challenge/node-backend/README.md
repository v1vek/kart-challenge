# Food Ordering API — Backend Challenge (Node.js)

This project implements the **Order Food Online** backend assignment using **Node.js**, fully compliant with the provided **OpenAPI 3.1 specification**.

The API provides:

- Product listing
- Product detail lookup
- Order placement with promo code validation
- API key–protected endpoints
- Complete error handling using `ApiResponse`
- Promo code dataset preprocessing (300M+ records via gzip files)
- In-memory + JSON stores (no DB)

---

# Features

### ✔ Fully implements the provided OpenAPI 3.1 spec  

### ✔ API-key authentication  

### ✔ Input validation & error handling  

### ✔ Preprocessing for massive promo datasets  

### ✔ Jest + Supertest test suite  

### ✔ Environment-based configuration  

### ✔ Clean modular architecture  

---

# 📁 Project Structure

```markdown
src/
  app.js
  index.js

  data/
    products.json
    couponbase1.gz
    couponbase2.gz
    couponbase3.gz
    valid_promos.txt

  scripts/
    preprocess_promos.sh

  stores/
    product.store.js
    promo.store.js

  services/
    promo.service.js

  controllers/
    product.controller.js
    order.controller.js

  middlewares/
    auth.js
    error.js

tests/
  product.test.js
  order.test.js
  promo.test.js
  apiKey.test.js
  
```

# Installation

```bash
git clone <your repo URL>
cd node-backend
npm install
cp .env.example .env
```

Modify .env:

```ini
API_KEY=apitest
PORT=3000
NODE_ENV=development
```

# Promo Code Preprocessing

Preprocessing the large `couponbase*.gz` files.

A promo code is **valid** if:

- Its length is between **8 and 10 characters**
- It appears in **at least 2** of the 3 gzip files

Because Node.js cannot process 300M+ lines in memory, I used a **parallelized shell script** to preprocess the datasets efficiently.

## Run preprocessing

```bash
sh src/scripts/preprocess_promos.sh
```

This creates:

```bash
src/data/valid_promos.txt
```

Your API loads this final list into a Set on startup.

# Running the Server

```bash
npm start
```

or in development:

```bash
npm run dev
```

Server runs on:

```arduino
<http://localhost:3000>
```

# Running Tests

We use Jest + Supertest for API tests.

Run:

```sh
npm test
```

Sample output:

```makefile
Tests: 2 skipped, 10 passed, 12 total
```

---

## Technical Decisions & Notes

### Why preprocess promo datasets?

- 300M+ lines cannot be loaded by Node.js.
- Preprocessing extracts only valid promo codes (~5k–20k).
- Enables fast, memory-safe in-memory validation.
