import _ from 'lodash'
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import Heading from 'zooid-heading'
import Page from 'zooid-page'

import { getBluprint } from '../../actions/bluprint'
import CreateBluprintSteps from '../../components/CreateBluprintSteps'

import styles from './styles.css'
const propTypes = {
  bluprint: PropTypes.object,
  dispatch: PropTypes.func,
  params: PropTypes.object,
}

class FinishCreateBluprint extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(getBluprint(params.bluprintUuid))
  }

  render() {
    const { bluprint }         = this.props
    const { device, fetching } = bluprint

    if (fetching) return <Page className={styles.FinishCreateBluprintPage} loading />
    if (_.isEmpty(device)) return null

    return (
      <div className={styles.root}>
        <Heading level={4}>Bluprint: {name}</Heading>
        <p>All Done!</p>
      </div>
    )
  }
}

FinishCreateBluprint.propTypes    = propTypes

const mapStateToProps = ({ bluprint,  sharedDevices }) => {
  return { bluprint, sharedDevices }
}
export default connect(mapStateToProps)(FinishCreateBluprint)
