import React, {useState, useEffect}  from 'react'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import Grid from '@material-ui/core/Grid'
import {makeStyles} from '@material-ui/core/styles'
import {read, filterByRelated} from './api'
import {Link} from 'react-router-dom'
import Recommendations from './Recommendations'
import AddToCart from '../cart/AddToCart'

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  flex:{
    display:'flex'
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '24px',
    color: theme.palette.title
  },
  price: {
    padding: '16px',
    margin: '16px 0px',
    display: 'flex',
    backgroundColor: '#93c5ae3d',
    fontSize: '1.3em',
    color: theme.palette.title,
  },
  media: {
    height: 200,
    display: 'inline-block',
    width: '50%',
    marginLeft: '24px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  link:{
    color: theme.palette.title,
    fontSize: '0.9em'
  },
  addCart: {
    width: '35px',
    height: '35px',
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b'
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  }
}))

export default function ProductPage ({match}) {
  const cssprops = useStyles()
  const [product, setProduct] = useState({shop:{}})
  const [recommendations, setRecommendations] = useState([])
  const [error, setError] = useState('')
    useEffect(() => {
      const abortController = new AbortController()
      const signal = abortController.signal
  
      read({productId: match.params.productId}, signal).then((data) => {
        if (data.error) {
          setError(data.error)
        } else {
          setProduct(data)
        }
      })
    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.productId])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

        filterByRelated({
          productId: match.params.productId}, signal).then((data) => {
          if (data.error) {
            setError(data.error)
          } else {
            setRecommendations(data)
          }
        })
  return function cleanup(){
    abortController.abort()
  }
}, [match.params.productId])

    const imageUrl = product._id
          ? `/api/product/image/${product._id}?${new Date().getTime()}`
          : '/api/product/defaultphoto'
    return (
        <div className={cssprops.root}>
          <Grid container spacing={10}>
            <Grid item xs={7} sm={7}>
              <Card className={cssprops.card}>
                <CardHeader
                  title={product.name}
                  subheader={product.quantity > 0? 'In Stock': 'Out of Stock'}
                  action={
                    <span className={cssprops.action}>
                      <AddToCart cartStyle={cssprops.addCart} item={product}/>
                    </span>
                  }
                />
                <div className={cssprops.flex}>
                  <CardMedia
                    className={cssprops.media}
                    image={imageUrl}
                    title={product.name}
                  />
                  <Typography component="p" variant="subtitle1" className={cssprops.subheading}>
                    {product.description}<br/>
                    <span className={cssprops.price}>$ {product.price}</span>
                    <Link to={'/shops/'+product.shop._id} className={cssprops.link}>
                      <span>
                        <Icon className={cssprops.icon}>shopping_basket</Icon> {product.shop.name}
                      </span>
                    </Link>
                  </Typography>

                </div>
              </Card>
            </Grid>
            {recommendations.length > 0 &&
              (<Grid item xs={5} sm={5}>
                <Recommendations  products={recommendations} title='Related Products'/>
              </Grid>)}
          </Grid>
        </div>)
}
