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
  res.send('Meal Mosaic API');
});

module.exports = { app };
