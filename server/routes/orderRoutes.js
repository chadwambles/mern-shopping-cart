import express from "express";
import orderController from "../controllers/orderController";
import productController from "../controllers/productController";
import authController from "../controllers/authController";
import shopController from "../controllers/shopController";
import userController from "../controllers/userController";

const router = express.Router();

router
  .route("/api/orders/:userId")
  .post(
    authController.requireSignin,
    userController.stripeCustomer,
    productController.decreaseQuantity,
    orderController.create
  );

router
  .route("/api/orders/shop/:shopId")
  .get(
    authController.requireSignin,
    shopController.isOwner,
    orderController.filterByShop
  );

router
  .route("/api/orders/user/:userId")
  .get(authController.requireSignin, orderController.filterByUser);

router.route("/api/order/status_values").get(orderController.getStatusValues);

router
  .route("/api/order/:shopId/cancel/:productId")
  .put(
    authController.requireSignin,
    shopController.isOwner,
    productController.increaseQuantity,
    orderController.update
  );

router
  .route("/api/order/:orderId/charge/:userId/:shopId")
  .put(
    authController.requireSignin,
    shopController.isOwner,
    userController.createCharge,
    orderController.update
  );

router
  .route("/api/order/status/:shopId")
  .put(
    authController.requireSignin,
    shopController.isOwner,
    orderController.update
  );

router.route("/api/order/:orderId").get(orderController.read);

router.param("userId", userController.userByID);
router.param("shopId", shopController.shopByID);
router.param("productId", productController.productByID);
router.param("orderId", orderController.orderByID);

export default router;
