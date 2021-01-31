import React, {useState, useEffect} from 'react'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Icon from '@material-ui/core/Icon'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import { makeStyles } from '@material-ui/core/styles'
import auth from './../auth/tool'
import {read, update} from './api'
import {Redirect} from 'react-router-dom'

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.title
  },
  error: {
    verticalAlign: 'middle'
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2)
  },
  subheading: {
    marginTop: theme.spacing(2),
    color: theme.palette.title
  }
}))

export default function EditProfilePage({ match }) {
  const cssprops = useStyles()
  const [values, setValues] = useState({
      name: '',
      email: '',
      password: '',
      seller: false,
      redirectToProfile: false,
      error: ''
  })
  const jwt = auth.isAuth()
  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({
      userId: match.params.userId
    }, {t: jwt.token}, signal).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        setValues({...values, name: data.name, email: data.email, seller: data.seller})
      }
    })
    return function cleanup(){
      abortController.abort()
    }

  }, [match.params.userId])

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
      seller: values.seller || undefined
    }
    update({
      userId: match.params.userId
    }, {
      t: jwt.token
    }, user).then((data) => {
      if (data && data.error) {
        setValues({...values, error: data.error})
      } else {
        auth.updateUser(data, ()=>{
          setValues({...values, userId: data._id, redirectToProfile: true})
        })
      }
    })
  }
  const handleChange = name => event => {
    setValues({...values, [name]: event.target.value})
  }
  const handleCheck = (event, checked) => {
    setValues({...values, 'seller': checked})
  }

  if (values.redirectToProfile) {
    return (<Redirect to={'/user/' + values.userId}/>)
  }
    return (
      <Card className={cssprops.card}>
        <CardContent>
          <Typography variant="h6" className={cssprops.title}>
            Edit Profile
          </Typography>
          <TextField id="name" label="Name" className={cssprops.textField} value={values.name} onChange={handleChange('name')} margin="normal"/><br/>
          <TextField id="email" type="email" label="Email" className={cssprops.textField} value={values.email} onChange={handleChange('email')} margin="normal"/><br/>
          <TextField id="password" type="password" label="Password" className={cssprops.textField} value={values.password} onChange={handleChange('password')} margin="normal"/>
          <Typography variant="subtitle1" className={cssprops.subheading}>
            Seller Account
          </Typography>
          <FormControlLabel
            control={
              <Switch cssprops={{
                                checked: cssprops.checked,
                                bar: cssprops.bar,
                              }}
                      checked={values.seller}
                      onChange={handleCheck}
              />}
            label={values.seller? 'Active' : 'Inactive'}
          />
          <br/> {
            values.error && (<Typography component="p" color="error">
              <Icon color="error" className={cssprops.error}>error</Icon>
              {values.error}
            </Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={cssprops.submit}>Submit</Button>
        </CardActions>
      </Card>
    )
}
