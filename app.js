require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');
const passport = require('passport');
const swaggerDocument = require('./swagger-output.json');
const recipesRoute = require('./routes/recipesRoute');
const mealPlansRoute = require('./routes/mealPlansRoute');
const usersRoute = require('./routes/usersRoute');
const shoppingListsRoute = require('./routes/shoppingListsRoute');
const buildAuthRouter = require('./routes/authRoute');
const { configurePassport } = require('./middleware/passport');

const app = express();
const PORT = process.env.PORT || 8080;

const parseRenderUrl = (url) => {
  if (!url) return {};
  try {
    const parsed = new URL(url);
    return {
      host: parsed.host,
      scheme: parsed.protocol.replace(':', ''),
    };
  } catch {
    return {};
  }
};

const { host: renderHost, scheme: renderScheme } = parseRenderUrl(process.env.RENDER_EXTERNAL_URL);
const swaggerHost = process.env.SWAGGER_HOST || renderHost || `localhost:${PORT}`;
const swaggerScheme = process.env.SWAGGER_SCHEME || renderScheme || (process.env.NODE_ENV === 'production' ? 'https' : 'http');
swaggerDocument.host = swaggerHost;
swaggerDocument.schemes = [swaggerScheme];

app.set('trust proxy', 1);
app.use(express.json());
app.use((req, res, next) => {
  const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

configurePassport(passport);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/auth', buildAuthRouter(passport));

app.use('/recipes', recipesRoute);
app.use('/meal-plans', mealPlansRoute);
app.use('/users', usersRoute);
app.use('/shopping-lists', shoppingListsRoute);

app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Meal Mosaic API</title>
        <style>
          :root {
            --bg: linear-gradient(135deg, #0f172a, #1e293b);
            --card: rgba(255, 255, 255, 0.06);
            --text: #e2e8f0;
            --accent: #34d399;
            --accent-2: #60a5fa;
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: "Inter", system-ui, -apple-system, sans-serif;
            background-image: var(--bg);
            color: var(--text);
            padding: 24px;
          }
          .card {
            width: min(720px, 100%);
            padding: 32px;
            background: var(--card);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 18px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(10px);
          }
          h1 { margin: 0 0 12px; letter-spacing: -0.01em; }
          p { margin: 0 0 16px; line-height: 1.5; color: #cbd5e1; }
          .pill {
            display: inline-flex;
            gap: 8px;
            align-items: center;
            padding: 6px 12px;
            border-radius: 999px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.1);
            font-size: 13px;
            margin-right: 8px;
          }
          .actions {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 18px;
          }
          a.button {
            text-decoration: none;
            padding: 12px 16px;
            border-radius: 12px;
            font-weight: 600;
            color: #0b1224;
            background: var(--accent);
            transition: transform 0.15s ease, box-shadow 0.15s ease;
          }
          a.button.secondary {
            background: transparent;
            color: var(--text);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          a.button:hover { transform: translateY(-1px); box-shadow: 0 10px 30px rgba(52, 211, 153, 0.25); }
          .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
          .chip { padding: 6px 10px; border-radius: 10px; background: rgba(255, 255, 255, 0.08); font-size: 12px; }
        </style>
      </head>
      <body>
        <main class="card">
          <div class="pill">
            <span>✨</span>
            <span>Meal Mosaic API</span>
          </div>
          <h1>Recipes, Plans, Users & Lists</h1>
          <p>
            Explore the CRUD API for recipes, meal plans, users, and shopping lists.
            Swagger docs are live, and write routes are secured with GitHub OAuth.
          </p>
          <div class="chips">
            <div class="chip">Express + MongoDB</div>
            <div class="chip">Swagger UI</div>
            <div class="chip">GitHub OAuth</div>
            <div class="chip">Session Auth</div>
          </div>
          <div class="actions">
            <a class="button" href="/api-docs">Open API Docs</a>
            <a class="button secondary" href="/auth/github">Login with GitHub</a>
            <a class="button secondary" href="/auth/me">Check Session</a>
          </div>
        </main>
      </body>
    </html>
  `);
});

module.exports = { app };
