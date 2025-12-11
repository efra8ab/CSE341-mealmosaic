const express = require('express');
const shoppingListsController = require('../controllers/shoppingListsController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  /* 
    #swagger.tags = ['Shopping Lists']
    #swagger.summary = 'Retrieve all shopping lists'
    #swagger.responses[200] = {
      description: 'Shopping lists',
      schema: [{ $ref: '#/definitions/ShoppingList' }]
    }
  */
  shoppingListsController.getAll
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Shopping Lists']
    #swagger.summary = 'Retrieve a single shopping list'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the shopping list'
    }
    #swagger.responses[200] = {
      description: 'Shopping list that matches the provided id',
      schema: { $ref: '#/definitions/ShoppingList' }
    }
  */
  shoppingListsController.getOne
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Shopping Lists']
    #swagger.summary = 'Create a new shopping list'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewShoppingList' }
    }
    #swagger.responses[201] = {
      description: 'The created shopping list',
      schema: { $ref: '#/definitions/ShoppingList' }
    }
  */
  requireAuth,
  shoppingListsController.createShoppingList
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Shopping Lists']
    #swagger.summary = 'Update a shopping list'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the shopping list'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewShoppingList' }
    }
    #swagger.responses[200] = {
      description: 'Updated shopping list',
      schema: { $ref: '#/definitions/ShoppingList' }
    }
  */
  requireAuth,
  shoppingListsController.updateShoppingList
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Shopping Lists']
    #swagger.summary = 'Delete a shopping list'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the shopping list'
    }
    #swagger.responses[204] = {
      description: 'Shopping list removed successfully'
    }
  */
  requireAuth,
  shoppingListsController.deleteShoppingList
);

module.exports = router;
