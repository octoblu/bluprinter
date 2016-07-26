import _ from 'lodash'
import React, { PropTypes } from 'react'

import {getFlow} from '../../actions/flow'
import {setBluprintManifest} from '../../actions/bluprint'
import {getBluprints, selectBluprint} from '../../actions/bluprints'

import Page from 'zooid-page'
import { push } from 'react-router-redux'
import BluprintList from '../../components/BluprintList/'
import { connect } from 'react-redux'
import Button from 'zooid-button'

const propTypes = {
  devices: PropTypes.array,
  flow: PropTypes.object,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  params: PropTypes.object,
  fetching: PropTypes.bool,
}

const defaultProps = {}

class UpdateBluprint extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(getBluprints())
    dispatch(getFlow(params.flowUuid)).then(() => {
      const { flow } = this.props
      dispatch(setBluprintManifest(flow.draft.nodes))
    })
  }

  handleBluprintSelected = (bluprint) => {
    const {dispatch} = this.props
    dispatch(selectBluprint(bluprint))
  }

  handleNext = () => {
    const {dispatch, selected} = this.props
    dispatch(push(`/bluprints/${selected.uuid}/configure`))
  }

  renderNext = (selected) => {
    if(!selected) return null
    return <Button kind="primary" onClick={this.handleNext}>Next</Button>
  }

  render = () => {
    const {devices, error, fetching, selected} = this.props
    if (fetching) return <Page loading />
    if (error) return <Page error={error} />

    if (_.isEmpty(devices)) return <Page error="No devices." />
    return (
      <Page>
        <BluprintList onBluprintSelected={this.handleBluprintSelected} bluprints={devices} />
        {this.renderNext(selected)}
      </Page>
    )
  }
}

UpdateBluprint.propTypes    = propTypes
UpdateBluprint.defaultProps = defaultProps

const mapStateToProps = ({bluprints, flow}) => {
  return { flow: flow.device, devices: bluprints.devices, fetching: bluprints.fetching, selected: bluprints.selected }
}

export default connect(mapStateToProps)(UpdateBluprint)
