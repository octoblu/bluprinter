import React from 'react'
import cookie from 'react-cookie'
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
    window.location = '/'
  }

  render() {
    return <Spinner size="large" />
  }
}

Logout.propTypes    = propTypes
Logout.defaultProps = defaultProps

export default Logout
