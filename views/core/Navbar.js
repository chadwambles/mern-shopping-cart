import React from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import HomeIcon from '@material-ui/icons/Home'
import Button from '@material-ui/core/Button'
import auth from './../auth/tool'
import {Link, withRouter} from 'react-router-dom'
import CartIcon from '@material-ui/icons/ShoppingCart'
import Badge from '@material-ui/core/Badge'
import shoppingCart from '../cart/tool'
import SwapHorizontalCircleIcon from '@material-ui/icons/SwapHorizontalCircle';
import { orange } from "@material-ui/core/colors";

const isActive = (history, path) => {
  if (history.location.pathname == path)
    return {color: '#e55100'}
  else
    return {color: '#fff'}
}
const isPartActive = (history, path) => {
  if (history.location.pathname.includes(path))
    return {color: '#e55100'}
  else
    return {color: '#fff'}
}
const Navbar = withRouter(({history}) => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6" style={{color:orange[400]}}>
        Town <SwapHorizontalCircleIcon style={{color:'#e55100'}}/> Square
      </Typography>
      <div>
        <Link to="/">
          <IconButton aria-label="Home" style={isActive(history, "/")}>
            <HomeIcon/>
          </IconButton>
        </Link>
        <Link to="/shops/all">
          <Button style={isActive(history, "/shops/all")}>All Shops</Button>
        </Link>
        <Link to="/cart">
          <Button style={isActive(history, "/cart")}>
            <Badge color="secondary" invisible={false} badgeContent={shoppingCart.itemTotal()} style={{'marginLeft': '7px'}}>
              <CartIcon />
            </Badge>
          </Button>
        </Link>      
      </div>
      <div style={{'position':'absolute', 'right': '10px'}}><span style={{'float': 'right'}}>
      {
        !auth.isAuth() && (<span>
          <Link to="/signup">
            <Button style={isActive(history, "/signup")}>Sign up
            </Button>
          </Link>
          <Link to="/signin">
            <Button style={isActive(history, "/signin")}>Sign In
            </Button>
          </Link>
        </span>)
      }
      {
        auth.isAuth() && (<span>
          {auth.isAuth().user.seller && (<Link to="/seller/shops"><Button style={isPartActive(history, "/seller/")}>My Shops</Button></Link>)}
          <Link to={"/user/" + auth.isAuth().user._id}>
            <Button style={isActive(history, "/user/" + auth.isAuth().user._id)}>My Profile</Button>
          </Link>
          <Button color="inherit" onClick={() => {
              auth.clearJWT(() => history.push('/'))
            }}>Sign out</Button>
        </span>)
      }
      </span></div>
    </Toolbar>
  </AppBar>
))

export default Navbar
