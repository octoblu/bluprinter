import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Alert from 'zooid-alert'
import Spinner from 'zooid-spinner'

import { getFlow } from '../actions/flow/'
import { setBluprintManifest } from '../actions/bluprint/'
import CreateBluprintForm from '../components/CreateBluprintForm/'
import { setBreadcrumbs } from '../modules/Breadcrumbs'

const propTypes = {
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  isLoading: PropTypes.bool,
  params: PropTypes.object,
  routeParams: PropTypes.object,
}

class CreateBluprint extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props

    dispatch(getFlow(params.flowUuid)).then(() => {
      const { flow } = this.props
      dispatch(setBluprintManifest(flow.device.draft.nodes))
    })
  }

  render() {
    const { flow, isLoading }  = this.props
    const { error } = flow

    if (isLoading) return <Spinner />
    if (error) return <Alert type="error">{error}</Alert>
    if (_.isEmpty(flow.device)) return <Alert>Flow not found.</Alert>
    return (
      <CreateBluprintForm flowId={flow.device.uuid} />
    )
  }
}

const mapStateToProps = ({ bluprint, flow }) => {
  return {
    flow,
    isLoading: bluprint.settingManifest || flow.fetching,
  }
}

CreateBluprint.propTypes = propTypes

export default connect(mapStateToProps)(CreateBluprint)
