import React from 'react'
import cookie from 'react-cookie'
import { browserHistory } from 'react-router'
import { Spinner } from 'zooid-ui'

class Logout extends React.Component {
  componentDidMount() {
    cookie.remove('meshbluBearerToken', { path: '/' })
    browserHistory.push('/home')
  }

  render() {
    return <Spinner size="large" />
  }
}

export default Logout
