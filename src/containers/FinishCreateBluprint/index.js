import React, { PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import Alert from 'zooid-alert'
import Heading from 'zooid-heading'
import Page from 'zooid-page'

import { getBluprint } from '../../actions/bluprint'
import {getSharedDevices} from '../../modules/SharedDevices'
import CreateBluprintSteps from '../../components/CreateBluprintSteps'
import UpdateSharedDevicesAlert from '../../components/UpdateSharedDevicesAlert'

import styles from './styles.css'
const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  params: PropTypes.object,
}

class FinishCreateBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }
  componentWillMount() {
    const { params } = this.props
    this.props.dispatch(getBluprint(params.bluprintUuid))
  }
  componentWillReceiveProps(nextProps) {
    const { bluprint, sharedDevices } = nextProps
    const {device} = bluprint
    if (bluprint === this.props.bluprint) return
    if (_.isEmpty(device)) return
    if (_.isEmpty(sharedDevices.devices)) {
      const {bluprint: bluprintDevice} = device
      this.props.dispatch(getSharedDevices(bluprintDevice.sharedDevices))
      return
    }
  }

  render() {
    const { bluprint, sharedDevices } = this.props
    const { device, error, fetching, } = bluprint

    if (fetching) return <Page className={styles.FinishCreateBluprintPage} loading />
    if (_.isEmpty(device)) return null

    let sharedDevicesAlert = null
    if (!sharedDevices.fetching) {
      sharedDevicesAlert = <UpdateSharedDevicesAlert sharedDevices={sharedDevices.devices} />
    }
    const steps = [
      { label: 'Create a Bluprint', state: 'COMPLETED' },
      { label: 'Configure', state: 'COMPLETED' },
      { label: 'Finish', state: 'ACTIVE' },
    ]
    return (
      <Page className={styles.NewBluprintPage}>
        <CreateBluprintSteps steps={steps} />

        <div className={styles.root}>
          <Heading level={4}>Bluprint: {name}</Heading>
          {sharedDevicesAlert}
          {error && <Alert type="error">{error.message}</Alert>}
        </div>
      </Page>
    )
  }
}

FinishCreateBluprint.propTypes    = propTypes

const mapStateToProps = ({ bluprint,  sharedDevices }) => {
  return { bluprint, sharedDevices }
}
export default connect(mapStateToProps)(FinishCreateBluprint)
