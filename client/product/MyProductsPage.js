import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import IconButton from '@material-ui/core/IconButton'
import Icon from '@material-ui/core/Icon'
import Edit from '@material-ui/icons/Edit'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Typography from '@material-ui/core/Typography'
import {Link} from 'react-router-dom'
import Divider from '@material-ui/core/Divider'
import {filterByShop} from './api'
import DeleteProductPage from './DeleteProductPage'

const useStyles = makeStyles(theme => ({
  products: {
    padding: '24px'
  },
  addButton:{
    float:'right'
  },
  leftIcon: {
    marginRight: "8px"
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.title,
    fontSize: '1.2em'
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.title
  },
  cover: {
    width: 110,
    height: 100,
    margin: '8px'
  },
  details: {
    padding: '10px'
  },
}))

export default function MyProductsPage (props){
  const cssprops = useStyles()
  const [products, setProducts] = useState([])
  
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    filterByShop({
      shopId: props.shopId
    }, signal).then((data)=>{
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
    return function cleanup(){
      abortController.abort()
    }
  }, [])

  const removeProduct = (product) => {
    const updatedProducts = [...products]
    const index = updatedProducts.indexOf(product)
    updatedProducts.splice(index, 1)
    setProducts(updatedProducts)
  }

    return (
      <Card className={cssprops.products}>
        <Typography type="title" className={cssprops.title}>
          Products 
          <span className={cssprops.addButton}>
            <Link to={"/seller/"+props.shopId+"/products/new"}>
              <Button  variant="contained">
                <Icon className={cssprops.leftIcon}>add_box</Icon>  New Product
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
        {products.map((product, i) => {
            return <span key={i}>
              <ListItem>
                <CardMedia
                  className={cssprops.cover}
                  image={'/api/product/image/'+product._id+"?" + new Date().getTime()}
                  title={product.name}
                />
                <div className={cssprops.details}>
                  <Typography type="headline" component="h2"  className={cssprops.productTitle}>
                    {product.name}
                  </Typography>
                  <Typography type="subheading" component="h4" className={cssprops.subheading}>
                    Quantity: {product.quantity} | Price: ${product.price}
                  </Typography>
                </div>
                <ListItemSecondaryAction>
                  <Link to={"/seller/"+product.shop._id+"/"+product._id+"/edit"}>
                    <IconButton aria-label="Edit" >
                      <Edit/>
                    </IconButton>
                  </Link>
                  <DeleteProductPage
                    product={product}
                    shopId={props.shopId}
                    onRemove={removeProduct}/>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider/></span>})}
        </List>
      </Card>)
}
MyProductsPage.propTypes = {
  shopId: PropTypes.string.isRequired
}

