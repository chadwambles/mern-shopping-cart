import express from 'express'
import productController from '../controllers/productController'
import authController from '../controllers/authController'
import shopController from '../controllers/shopController'

const router = express.Router()

router.route('/api/products/by/:shopId')
  .post(authController.requireSignin, shopController.isOwner, productController.create)
  .get(productController.filterByShop)

router.route('/api/products/latest')
  .get(productController.filterByLatest)

router.route('/api/products/related/:productId')
  .get(productController.filterByRelated)

router.route('/api/products/categories')
  .get(productController.filterByCategories)

router.route('/api/products')
  .get(productController.list)

router.route('/api/products/:productId')
  .get(productController.read)

router.route('/api/product/image/:productId')
  .get(productController.photo)

router.route('/api/product/:shopId/:productId')
  .put(authController.requireSignin, shopController.isOwner, productController.update)
  .delete(authController.requireSignin, shopController.isOwner, productController.remove)

router.param('shopId', shopController.shopByID)
router.param('productId', productController.productByID)

export default router
