require('dotenv').config();
const swaggerAutogen = require('swagger-autogen')();

const port = process.env.PORT || 8080;

const doc = {
  info: {
    title: 'Meal Mosaic API',
    description: 'CRUD API for recipes and meal plans (Final Project Part 1, CSE341)',
  },
  host: process.env.SWAGGER_HOST || `localhost:${port}`,
  basePath: '/',
  schemes: [process.env.SWAGGER_SCHEME || 'http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  definitions: {
    Recipe: {
      _id: '6620bcdbc0ab123456789abc',
      title: 'Tacos al Pastor',
      cuisine: 'Mexican',
      summary: 'Marinated pork with pineapple, served on corn tortillas.',
      prepTimeMinutes: 30,
      cookTimeMinutes: 25,
      servings: 4,
      ingredients: [
        { name: 'Pork shoulder', quantity: 1, unit: 'lb' },
        { name: 'Pineapple', quantity: 1, unit: 'cup' },
        { name: 'Achiote paste', quantity: 2, unit: 'tbsp' },
        { name: 'Corn tortillas', quantity: 12, unit: 'pieces' },
      ],
      steps: ['Marinate pork with achiote and spices', 'Grill pork and pineapple', 'Slice and serve on tortillas'],
      tags: ['street-food', 'pork'],
      nutrition: { calories: 480, protein: 32, carbs: 45, fat: 18 },
      author: 'Chef Lalo',
    },
    NewRecipe: {
      title: 'Enchiladas Verdes',
      cuisine: 'Mexican',
      prepTimeMinutes: 20,
      cookTimeMinutes: 25,
      servings: 5,
      ingredients: [
        { name: 'Corn tortillas', quantity: 15, unit: 'pieces' },
        { name: 'Shredded chicken', quantity: 2, unit: 'cups' },
        { name: 'Salsa verde', quantity: 2, unit: 'cups' },
        { name: 'Queso fresco', quantity: 4, unit: 'oz' },
      ],
      steps: ['Warm tortillas in salsa verde', 'Fill with chicken and roll', 'Top with salsa and cheese, then bake'],
      tags: ['baked', 'chicken'],
      nutrition: { calories: 510, protein: 32, carbs: 52, fat: 20 },
      author: 'Salsa Verde Co.',
    },
    MealPlan: {
      _id: '6620bd5ac0ab123456789acd',
      title: 'Taco Trio Week',
      user: '661fa2d2c0ab123456789999',
      startDate: '2024-04-01T00:00:00.000Z',
      endDate: '2024-04-07T00:00:00.000Z',
      entries: [
        {
          date: '2024-04-01',
          mealType: 'dinner',
          recipe: '6620bcdbc0ab123456789abc',
          notes: 'Top with cilantro and onion',
        },
        {
          date: '2024-04-03',
          mealType: 'dinner',
          recipe: '6620bcdbc0ab123456789abc',
          notes: 'Serve with lime and salsa verde',
        },
      ],
      notes: 'All tacos, all week.',
    },
    NewMealPlan: {
      title: 'Antojitos Plan',
      startDate: '2024-04-08',
      endDate: '2024-04-12',
      entries: [
        {
          date: '2024-04-08',
          mealType: 'dinner',
          recipe: '6620bcdbc0ab123456789abc',
          notes: 'Pair with agua fresca',
        },
      ],
      notes: 'Street-food themed dinners.',
    },
  },
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./server.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
