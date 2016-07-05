import React, { PropTypes } from 'react'
import Button from 'zooid-button'
import superagent from 'superagent'
import { FLOW_DEPLOY_URL } from 'config'


const propTypes = {
  flowId: PropTypes.string,
  status: PropTypes.bool,
  meshbluConfig: PropTypes.object,
}
const defaultProps = {}

class DeployButton extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      status: props.status
    }
  }

  stopFlow = () => {
    const {flowId, meshbluConfig, onUpdate} = this.props
    superagent
    .delete(`${FLOW_DEPLOY_URL}/flows/${flowId}/instances`)
    .set('Accept', 'application/json')
    .set('meshblu_auth_uuid', meshbluConfig.uuid)
    .set('meshblu_auth_token', meshbluConfig.token)
    .end((err, res) => {
      if (err) reject(err)
      console.log(res)
      window.location.reload()
    })
  }

  startFlow = () => {
    const {flowId, meshbluConfig, onUpdate} = this.props
    superagent
    .post(`${FLOW_DEPLOY_URL}/flows/${flowId}/instances`)
    .set('Accept', 'application/json')
    .set('meshblu_auth_uuid', meshbluConfig.uuid)
    .set('meshblu_auth_token', meshbluConfig.token)
    .end((err, res) => {
      if (err) reject(err)
      console.log(res)
      window.location.reload()
    })
  }


  render() {
    const {status} = this.state
    const {flowId} = this.props

    if(!status) return <Button onClick={this.startFlow} kind="hollow-primary" size="small">Start</Button>
    if(status) return <Button onClick={this.stopFlow} kind="hollow-danger" size="small">Stop</Button>

  }
}

DeployButton.propTypes    = propTypes
DeployButton.defaultProps = defaultProps

export default DeployButton
