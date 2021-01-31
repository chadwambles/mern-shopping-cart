import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import queryString from 'query-string'
import {stripeUpdate} from './api.js'
import auth from './../auth/tool'

const useStyles = makeStyles(theme => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(2)}px ${theme.spacing(2)}px`,
    color: theme.palette.title,
    fontSize: '1.1em'
  },
  subheading: {
    color: theme.palette.title,
    marginLeft: "24px"
  }
}))

export default function StripeConnect(props){
  const cssprops = useStyles()
  const [values, setValues] = useState({
    error: false,
    connecting: false,
    connected: false
  })
  const jwt = auth.isAuth()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    const parsed = queryString.parse(props.location.search)
    if(parsed.error){
      setValues({...values, error: true})
    }
    if(parsed.code){
      setValues({...values, connecting: true, error: false})
      //post call to stripe, get credentials and update user data
      stripeUpdate({
        userId: jwt.user._id
      }, {
        t: jwt.token
      }, parsed.code, signal).then((data) => {
        if (data.error) {
          setValues({...values, error: true, connected: false, connecting: false})
        } else {
          setValues({...values, connected: true, connecting: false, error: false})
        }
      })
    }
    return function cleanup(){
      abortController.abort()
    }

  }, [])

    return (
      <div>
        <Paper className={cssprops.root} elevation={4}>
          <Typography type="title" className={cssprops.title}>
            Connect your Stripe Account
          </Typography>
          {values.error && (<Typography type="subheading" className={cssprops.subheading}>
              Could not connect your Stripe account. Try again later.
            </Typography>)}
          {values.connecting && (<Typography type="subheading" className={cssprops.subheading}>
              Connecting your Stripe account ...
            </Typography>)}
          {values.connected && (<Typography type="subheading" className={cssprops.subheading}>
              Your Stripe account successfully connected!
            </Typography>)}
        </Paper>
      </div>
    )
}
