# Backend

Express API with MongoDB using Mongoose.

## Setup

1. Install dependencies (requires internet access):

```bash
npm install
```

2. Configure environment variables:

- `MONGO_URI` – MongoDB connection string
- `PORT` – port to run the server (default `3000`)

3. Start the server:

```bash
npm start
```

## Routes

- `GET /products` – list products
- `POST /products` – create product
- `GET /products/:id` – get product
- `PUT /products/:id` – update product
- `DELETE /products/:id` – delete product
- `GET /products/:id/average-rating` – average rating for a product

- `GET /reviews` – list reviews
- `POST /reviews` – create review
- `GET /reviews/:id` – get review
- `PUT /reviews/:id` – update review
- `DELETE /reviews/:id` – delete review
