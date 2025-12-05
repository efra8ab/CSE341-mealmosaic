const express = require('express');
const recipesController = require('../controllers/recipesController');

const router = express.Router();

router.get(
  '/',
  /* 
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Retrieve all recipes'
    #swagger.responses[200] = {
      description: 'A list of recipes',
      schema: [{ $ref: '#/definitions/Recipe' }]
    }
  */
  recipesController.getAll
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Retrieve a single recipe'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the recipe'
    }
    #swagger.responses[200] = {
      description: 'Recipe that matches the provided id',
      schema: { $ref: '#/definitions/Recipe' }
    }
  */
  recipesController.getOne
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Create a new recipe'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewRecipe' }
    }
    #swagger.responses[201] = {
      description: 'The created recipe',
      schema: { $ref: '#/definitions/Recipe' }
    }
  */
  recipesController.createRecipe
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Update a recipe'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the recipe'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewRecipe' }
    }
    #swagger.responses[200] = {
      description: 'Updated recipe',
      schema: { $ref: '#/definitions/Recipe' }
    }
  */
  recipesController.updateRecipe
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Recipes']
    #swagger.summary = 'Delete a recipe'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the recipe'
    }
    #swagger.responses[204] = {
      description: 'Recipe removed successfully'
    }
  */
  recipesController.deleteRecipe
);

module.exports = router;
