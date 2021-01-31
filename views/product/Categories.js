import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'
import {makeStyles} from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import Icon from '@material-ui/core/Icon'
import {list} from './api'
import ProductsList from './ProductsList'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    background: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    width:'100%',
    transform: 'translateZ(0)',
  },
  tileTitle: {
    verticalAlign: 'middle',
    lineHeight: 2.5,
    textAlign: 'center',
    fontSize: '1.35em',
    margin: '0 4px 0 0',
  },
  card: {
    margin: 'auto',
    marginTop: 20
  },
  title: {
    padding:`${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(2)}px`,
    color: '#fff',
    backgroundColor: '#e55100',
    fontSize: '1.1em'
  },
  icon: {
    verticalAlign: 'sub',
    color: '#eeffff',
    fontSize: '0.9em'
  },
  link: {
    color: '#000',
    textShadow: '0px 2px 12px #ffffff',
    cursor:'pointer'
  }
}))

export default function Categories(props){
  const cssprops = useStyles()
  const [products, setProducts] = useState([])
  const [selected, setSelected] = useState(props.categories[0])

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    list({
      category: props.categories[0]
    }).then((data) => {
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

  const listbyCategory = category => event => {
    setSelected(category)
    list({
      category: category
    }).then((data) => {
      if (data.error) {
        console.log(data.error)
      } else {
        setProducts(data)
      }
    })
  }

    return (
      <div>
        <Card className={cssprops.card}>
          <Typography type="title" className={cssprops.title}>
            Search by category
          </Typography>
          <div className={cssprops.root}>
            <GridList className={cssprops.gridList} cols={4}>
              {props.categories.map((tile, i) => (
                <GridListTile key={i} className={cssprops.tileTitle} style={{height: '64px', backgroundColor: selected == tile? '#e55100':'#fff'}}>
                  <span className={cssprops.link} onClick={listbyCategory(tile)}>{tile}  <Icon className={cssprops.icon}>{selected == tile && 'arrow_drop_down'}</Icon></span>
                </GridListTile>
              ))}
            </GridList>
          </div>
          <Divider/>
          <ProductsList products={products} searched={false}/>
        </Card>
      </div>
    )
}
Categories.propTypes = {
  categories: PropTypes.array.isRequired
}
