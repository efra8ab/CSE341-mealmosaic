require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const { connectDb } = require('./db/connect');
const recipesRoute = require('./routes/recipesRoute');
const mealPlansRoute = require('./routes/mealPlansRoute');

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

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/recipes', recipesRoute);
app.use('/meal-plans', mealPlansRoute);

app.get('/', (req, res) => {
  res.send('Meal Mosaic API');
});

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Failed to connect to the database', error);
    process.exit(1);
  });
