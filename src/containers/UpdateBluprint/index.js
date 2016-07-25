import React, { PropTypes } from 'react'
import {getBluprints} from '../../actions/bluprints'
import Page from 'zooid-page'
import BluprintList from '../../components/BluprintList/'
import { connect } from 'react-redux'
import _ from 'lodash'

const propTypes = {
  devices: PropTypes.array,
  dispatch: PropTypes.func,
  error: PropTypes.object,
  params: PropTypes.object,
  fetching: PropTypes.bool,
}

const defaultProps = {}

class UpdateBluprint extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(getBluprints())
  }
  render() {
    const {devices, error, fetching} = this.props
    if (fetching) return <Page loading />
    if (error) return <Page error={error} />

    if (_.isEmpty(devices)) return <Page error="No devices." />
    return (
      <Page>
        <BluprintList bluprints={devices} />
      </Page>
    )
  }
}

UpdateBluprint.propTypes    = propTypes
UpdateBluprint.defaultProps = defaultProps

const mapStateToProps = ({ bluprints}) => {
  return { devices: bluprints.devices, fetching: bluprints.fetching }
}

export default connect(mapStateToProps)(UpdateBluprint)
