import React from 'react'
import cookie from 'react-cookie'
import { browserHistory } from 'react-router'
import { Spinner } from 'zooid-ui'

const propTypes = {}
const defaultProps = {}

class Logout extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    cookie.remove('meshbluBearerToken', { path: '/' })
    browserHistory.push('/home')
  }

  render() {
    return <Spinner size="large" />
  }
}

Logout.propTypes    = propTypes
Logout.defaultProps = defaultProps

export default Logout
