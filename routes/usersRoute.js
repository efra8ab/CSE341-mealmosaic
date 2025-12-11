const express = require('express');
const usersController = require('../controllers/usersController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Retrieve all users'
    #swagger.responses[200] = {
      description: 'A list of users',
      schema: [{ $ref: '#/definitions/User' }]
    }
  */
  usersController.getAll
);

router.get(
  '/:id',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Retrieve a single user'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the user'
    }
    #swagger.responses[200] = {
      description: 'User that matches the provided id',
      schema: { $ref: '#/definitions/User' }
    }
  */
  usersController.getOne
);

router.post(
  '/',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Create a new user'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewUser' }
    }
    #swagger.responses[201] = {
      description: 'The created user',
      schema: { $ref: '#/definitions/User' }
    }
  */
  requireAuth,
  usersController.createUser
);

router.put(
  '/:id',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Update a user'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the user'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: { $ref: '#/definitions/NewUser' }
    }
    #swagger.responses[200] = {
      description: 'Updated user',
      schema: { $ref: '#/definitions/User' }
    }
  */
  requireAuth,
  usersController.updateUser
);

router.delete(
  '/:id',
  /* 
    #swagger.tags = ['Users']
    #swagger.summary = 'Delete a user'
    #swagger.security = [{ OAuth2: [] }]
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'string',
      description: 'MongoDB identifier for the user'
    }
    #swagger.responses[204] = {
      description: 'User removed successfully'
    }
  */
  requireAuth,
  usersController.deleteUser
);

module.exports = router;
