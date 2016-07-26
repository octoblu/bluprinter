import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Heading from 'zooid-heading'
import Page from 'zooid-page'
import { push } from 'react-router-redux'

import {getBluprint, setBluprintManifest} from '../../actions/bluprint'
import {getFlow} from '../../actions/flow'
import {getFlows} from '../../actions/flows'
import DeviceGridList from '../../components/DeviceGridList/'
import DeviceHeader from '../../components/DeviceHeader/'

const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  fetching: PropTypes.bool,
  flows: PropTypes.array,
  params: PropTypes.object,
}

const defaultProps = {}

class UpdateBluprint extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props

    dispatch(getBluprint(params.bluprintUuid))
    dispatch(getFlows())
  }

  handleFlowSelection = ({uuid}) => {
    const { dispatch, params }  = this.props
    dispatch(getFlow(uuid))
      .then(({payload}) => dispatch(setBluprintManifest(payload.draft.nodes)))
      .then(() => dispatch(push(`/bluprints/${params.bluprintUuid}/configure`)))
  }

  render = () => {
    const {bluprint, error, fetching, flows} = this.props

    if (fetching) return <Page loading />
    if (error) return <Page error={error} />
    if (_.isEmpty(bluprint)) return <Page error="No Bluprint found." />

    return (
      <Page>
        <DeviceHeader device={bluprint} />
        <Heading level={4}>Select the flow to update your Bluprint from.</Heading>
        <DeviceGridList devices={flows} onSelection={this.handleFlowSelection} />
      </Page>
    )
  }
}

UpdateBluprint.propTypes    = propTypes
UpdateBluprint.defaultProps = defaultProps

const mapStateToProps = ({bluprint, flows, flow}) => {
  return {
    bluprint: bluprint.device,
    errors: _.compact([flows.error, bluprint.error]),
    fetching: bluprint.fetching || flows.fetching,
    flows: flows.devices,
    flow: flow.device
  }
}

export default connect(mapStateToProps)(UpdateBluprint)
