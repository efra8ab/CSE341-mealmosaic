const express = require('express');
const mealPlansController = require('../controllers/mealPlansController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  /* 
    #swagger.tags = ['Meal Plans']
    #swagger.summary = 'Retrieve all meal plans'
    #swagger.responses[200] = {
      description: 'Meal plans',
      schema: [{ $ref: '#/definitions/MealPlan' }]
    }
  */
  mealPlansController.getAll
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Meal Plans']
    #swagger.summary = 'Retrieve a single meal plan'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the meal plan'
    }
    #swagger.responses[200] = {
      description: 'Meal plan that matches the provided id',
      schema: { $ref: '#/definitions/MealPlan' }
    }
  */
  mealPlansController.getOne
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Meal Plans']
    #swagger.summary = 'Create a new meal plan'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewMealPlan' }
    }
    #swagger.responses[201] = {
      description: 'The created meal plan',
      schema: { $ref: '#/definitions/MealPlan' }
    }
  */
  requireAuth,
  mealPlansController.createMealPlan
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Meal Plans']
    #swagger.summary = 'Update a meal plan'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the meal plan'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewMealPlan' }
    }
    #swagger.responses[200] = {
      description: 'Updated meal plan',
      schema: { $ref: '#/definitions/MealPlan' }
    }
  */
  requireAuth,
  mealPlansController.updateMealPlan
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Meal Plans']
    #swagger.summary = 'Delete a meal plan'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the meal plan'
    }
    #swagger.responses[204] = {
      description: 'Meal plan removed successfully'
    }
  */
  requireAuth,
  mealPlansController.deleteMealPlan
);

module.exports = router;
