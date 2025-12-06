# Meal Mosaic API 

Recipes + Meal Plans CRUD with Express, MongoDB, and Swagger docs at `/api-docs`.

## Quickstart
1. `npm install`
2. Generate docs: `npm run swagger`
3. Run dev server: `npm run dev` (or `npm start`). Swagger UI: `http://localhost:8080/api-docs`

## Delivered
- **Recipes**: GET all/one (public), POST/PUT/DELETE. Validates required fields, ingredient names, steps, and positive times/servings.
- **Meal Plans**: GET all/one (public), POST/PUT/DELETE. Validates dates, meal entries, and referenced recipes exist; requires a user id field (no auth yet).

## Quicklook
- `server.js` entrypoint and Swagger host handling for Render.
- `db/connect.js` Mongo connection helper.
- `models/recipe.js`, `controllers/recipesController.js`, `routes/recipesRoute.js` for recipes CRUD.
- `models/mealPlan.js`, `controllers/mealPlansController.js`, `routes/mealPlansRoute.js` for meal plans CRUD.
- `swagger.js` / `swagger-output.json` generation.
- `routes.rest` sample requests (VS Code REST Client compatible).
