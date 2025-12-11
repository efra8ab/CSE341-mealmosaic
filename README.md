# Meal Mosaic API

Recipes, Meal Plans, Users, and Shopping Lists with Express, MongoDB, Swagger docs at `/api-docs`, and GitHub OAuth to protect write routes.

## Live landing
- Root `/` now shows a quick visual landing with links to Swagger, GitHub login, and session check.

## Quickstart
1. `npm install`
2. Copy `.env.example` to `.env` and fill in `MONGODB_URI`, `SESSION_SECRET`, and OAuth values when ready.
3. Generate docs: `npm run swagger`
4. Run dev server: `npm run dev` (or `npm start`). Swagger UI: `http://localhost:8080/api-docs`

## Collections + Validation
- **Recipes** `/recipes`: GET all/one (public), POST/PUT/DELETE (auth). Validates required fields, ingredient names, steps, and positive times/servings.
- **Meal Plans** `/meal-plans`: GET all/one (public), POST/PUT/DELETE (auth). Validates dates, user id, meal entries, and recipe references.
- **Users** `/users`: GET all/one (public), POST/PUT/DELETE (auth). Validates username/email; duplicate username/email handled with 409s.
- **Shopping Lists** `/shopping-lists`: GET all/one (public), POST/PUT/DELETE (auth). Validates user id, non-empty items, item names, and non-negative quantities.

## OAuth (GitHub)
- Routes: `/auth/github` (login), `/auth/github/callback`, `/auth/logout`, `/auth/me`.
- Render base URL: `https://cse341-mealmosaic.onrender.com`; set `GITHUB_CALLBACK_URL=https://cse341-mealmosaic.onrender.com/auth/github/callback`.
- Local callback: `http://localhost:8080/auth/github/callback`.
- Protected routes require a GitHub session unless `AUTH_BYPASS=true` (dev/testing only).
- Create a GitHub OAuth App (GitHub Settings → Developer settings → OAuth Apps → New). Use the callback above, then drop Client ID/Secret into `.env`.

## Testing
- Jest + Supertest. Set `MONGODB_URI_TEST` (and optionally `DB_NAME_TEST`) to a throwaway database, then run `npm test`.
- Optional: set `USE_IN_MEMORY_DB=true` to run tests against `mongodb-memory-server` (requires your environment to allow spawning local Mongo on a random port).
- Tests cover GET and GET-all for all four collections.

## Files to know
- `app.js` Express app wiring (Swagger, sessions, passport).
- `db/connect.js` Mongo connection helper (accepts override URI/DB name).
- Models, controllers, routes for: recipes, meal plans, users, shopping lists.
- `middleware/passport.js` GitHub strategy; `middleware/auth.js` guards protected routes.
- `swagger.js` / `swagger-output.json` generation.
- `routes.rest` sample requests; `data/*.seed.json` sample MongoDB imports.
