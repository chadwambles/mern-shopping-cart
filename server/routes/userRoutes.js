import express from 'express'
import userController from '../controllers/userController'
import authController from '../controllers/authController'

const router = express.Router()

router.route('/api/users')
  .get(userController.list)
  .post(userController.create)

router.route('/api/users/:userId')
  .get(authController.requireSignin, userController.read)
  .put(authController.requireSignin, authController.hasAuth, userController.update)
  .delete(authController.requireSignin, authController.hasAuth, userController.remove)
router.route('/api/stripe_auth/:userId')
  .put(authController.requireSignin, authController.hasAuth, userController.stripe_auth, userController.update)

router.param('userId', userController.userByID)

export default router
