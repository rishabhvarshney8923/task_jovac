# Tagged — Product Catalog (Listing → Detail → Cart)

A small e-commerce front-end built with plain HTML/CSS/JS, using the
[DummyJSON](https://dummyjson.com/) products API.

## What's inside

| Task | File | Notes |
|---|---|---|
| 1. Listing page | `index.html` | Fetches `GET /products?limit=194`, shows a searchable, filterable, paginated grid with "Add to cart" |
| 2. Product detail page | `product.html` | On click, navigates to `product.html?id=<id>` and fetches `GET /products/:id` for full details, image gallery, qty selector |
| 3. Cart page | `cart.html` | Reads cart from `localStorage`, lets you change quantity / remove items, shows a full bill summary (subtotal, discount savings, tax, total) |
| — | `app.js` | Shared cart logic (localStorage) + small helpers, used by all three pages |
| — | `style.css` | Shared "price-tag / receipt" visual theme |

No build step, no framework — just open `index.html` in a browser, or serve the folder with any static server.

## Run locally

```bash
# any static server works, e.g.:
npx serve .
# or
python3 -m http.server 5500
```

Then open `http://localhost:5500` (or whichever port) in your browser.

## How the cart persists

Cart contents are stored in `localStorage` under the key `tagged_cart_v1`, so it survives
page reloads and navigating between `index.html` → `product.html` → `cart.html`.

## Bill summary logic (Task 3)

```
unit price   = price - (price * discountPercentage / 100)
subtotal     = sum(unit price * qty) for all cart items
savings      = sum(original price * qty) - subtotal
tax          = subtotal * 8%
total        = subtotal + tax
```

## Submitting on GitHub

1. Create a new **public** repo on GitHub (e.g. `tagged-product-catalog`).
2. From this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Listing, product detail, and cart pages using DummyJSON API"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. (Optional but recommended) Enable **GitHub Pages**: repo → Settings → Pages →
   Deploy from branch → `main` / root. You'll get a live URL like
   `https://<your-username>.github.io/<repo-name>/` to submit alongside the repo link.
4. Submit the repo URL (and Pages URL, if enabled).

## APIs used

- Listing: `https://dummyjson.com/products?limit=194`
- Product detail: `https://dummyjson.com/products/:id`
