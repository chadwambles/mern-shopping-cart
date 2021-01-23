import React from 'react'
import {Route, Switch} from 'react-router-dom'
import HomePage from './core/HomePage'
import UsersList from './user/UsersList'
import SignupPage from './user/SignupPage'
import SigninPage from './auth/SigninPage'
import EditProfilePage from './user/EditProfilePage'
import ProfilePage from './user/ProfilePage'
import PvtRoute from './auth/PvtRoute'
import Navbar from './core/Navbar'
import NewShopPage from './shop/NewShopPage'
import ShopsList from './shop/ShopsList'
import MyShopsPage from './shop/MyShopsPage'
import ShopPage from './shop/ShopPage'
import EditShopPage from './shop/EditShopPage'
import NewProductPage from './product/NewProductPage'
import EditProductPage from './product/EditProductPage'
import ProductPage from './product/ProductPage'
import Cart from './cart/Cart'
import StripeConnect from './user/StripeConnect'
import ShopOrdersList from './order/ShopOrdersList'
import OrderPage from './order/OrderPage'

const MainRouter = () => {
  return (<div>
      <Navbar/>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/users" component={UsersList}/>
        <Route path="/signup" component={SignupPage}/>
        <Route path="/signin" component={SigninPage}/>
        <PvtRoute path="/user/edit/:userId" component={EditProfilePage}/>
        <Route path="/user/:userId" component={ProfilePage}/>

        <Route path="/cart" component={Cart}/>
        <Route path="/product/:productId" component={ProductPage}/>
        <Route path="/shops/all" component={ShopsList}/>
        <Route path="/shops/:shopId" component={ShopPage}/>

        <Route path="/order/:orderId" component={OrderPage}/>
        <PvtRoute path="/seller/orders/:shop/:shopId" component={ShopOrdersList}/>

        <PvtRoute path="/seller/shops" component={MyShopsPage}/>
        <PvtRoute path="/seller/shop/new" component={NewShopPage}/>
        <PvtRoute path="/seller/shop/edit/:shopId" component={EditShopPage}/>
        <PvtRoute path="/seller/:shopId/products/new" component={NewProductPage}/>
        <PvtRoute path="/seller/:shopId/:productId/edit" component={EditProductPage}/>

        <Route path="/seller/stripe/connect" component={StripeConnect}/>
      </Switch>
    </div>)
}

export default MainRouter
