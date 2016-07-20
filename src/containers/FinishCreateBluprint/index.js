import React, { PropTypes } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { getBluprint } from '../../actions/bluprint'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import Page from 'zooid-page'
import styles from './styles.css'
import CreateBluprintSteps from '../../components/CreateBluprintSteps'

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
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(getBluprint(params.bluprintUuid))
  }

  render() {
    const { bluprint } = this.props
    const { device, error, fetching } = bluprint

    if (fetching) return <Page className={styles.FinishCreateBluprintPage} loading />
    if (_.isEmpty(device)) return null
    const { name } = device

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

        {error && <Alert type="error">{error.message}</Alert>}
      </div>
      </Page>

    )
  }
}

FinishCreateBluprint.propTypes    = propTypes
const mapStateToProps = ({ bluprint, flow, schemas }) => {
  return { bluprint, flow, schemas }
}
export default connect(mapStateToProps)(FinishCreateBluprint)
