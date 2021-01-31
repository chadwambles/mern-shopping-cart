import express from 'express'
import userController from '../controllers/userController'
import authController from '../controllers/authController'
import shopController from '../controllers/shopController'

const router = express.Router()

router.route('/api/shops')
  .get(shopController.list)

router.route('/api/shop/:shopId')
  .get(shopController.read)

router.route('/api/shops/by/:userId')
  .post(authController.requireSignin, authController.hasAuth, userController.isSeller, shopController.create)
  .get(authController.requireSignin, authController.hasAuth, shopController.filterByOwner)

router.route('/api/shops/:shopId')
  .put(authController.requireSignin, shopController.isOwner, shopController.update)
  .delete(authController.requireSignin, shopController.isOwner, shopController.remove)

router.route('/api/shops/logo/:shopId')
  .get(shopController.photo)

router.param('shopId', shopController.shopByID)
router.param('userId', userController.userByID)

export default router
