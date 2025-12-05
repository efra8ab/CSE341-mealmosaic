require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const port = process.env.PORT || 8080;

const doc = {
  info: {
    title: 'Meal Mosaic API',
    description: 'CRUD API for recipes (Final Project Part 1, CSE341)',
  },
  host: process.env.SWAGGER_HOST || `localhost:${port}`,
  basePath: '/',
  schemes: [process.env.SWAGGER_SCHEME || 'http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  definitions: {
    Recipe: {
      _id: '6620bcdbc0ab123456789abc',
      title: 'Spicy Lentil Soup',
      cuisine: 'Mediterranean',
      summary: 'Hearty plant-based soup with warm spices.',
      prepTimeMinutes: 20,
      cookTimeMinutes: 35,
      servings: 4,
      ingredients: [
        { name: 'Red lentils', quantity: 2, unit: 'cups' },
        { name: 'Onion', quantity: 1, unit: 'medium' },
        { name: 'Smoked paprika', quantity: 1, unit: 'tsp' },
      ],
      steps: ['Rinse lentils', 'Sauté aromatics', 'Simmer until tender'],
      tags: ['vegetarian', 'gluten-free'],
      nutrition: { calories: 320, protein: 18, carbs: 45, fat: 8 },
      author: '@chef_ava',
    },
    NewRecipe: {
      title: 'Coconut Curry Chickpeas',
      cuisine: 'Thai',
      prepTimeMinutes: 15,
      cookTimeMinutes: 25,
      servings: 4,
      ingredients: [
        { name: 'Chickpeas', quantity: 2, unit: 'cups' },
        { name: 'Coconut milk', quantity: 1, unit: 'can' },
        { name: 'Red curry paste', quantity: 2, unit: 'tbsp' },
      ],
      steps: ['Toast curry paste', 'Add coconut milk', 'Simmer with chickpeas'],
      tags: ['dairy-free'],
      nutrition: { calories: 410, protein: 14, carbs: 42, fat: 20 },
      author: 'Nora',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
