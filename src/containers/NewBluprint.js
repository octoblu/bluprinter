import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Page from 'zooid-page'

import CreateBluprintSteps from '../components/CreateBluprintSteps'
import { getFlow } from '../actions/flow/'

import styles from './styles.css'

const propTypes = {
  children: PropTypes.node,
  dispatch: PropTypes.func,
  flow: PropTypes.object,
  params: PropTypes.object,
  routeParams: PropTypes.object,
}

class NewBluprint extends React.Component {
  componentDidMount() {
    const { dispatch, params } = this.props
    dispatch(getFlow(params.flowUuid))
  }

  render() {
    const { children, flow }  = this.props
    const { error, fetching } = flow

    if (fetching) return <Page loading className={styles.NewBluprintPage} />
    if (error) return <Page error={error} className={styles.NewBluprintPage} />

    const steps = [
      { label: 'Create a Bluprint', state: 'ACTIVE' },
      { label: 'Configure' },
      { label: 'Finish' },
    ]

    return (
      <Page className={styles.NewBluprintPage}>
        <CreateBluprintSteps steps={steps} />
        {children}
      </Page>
    )
  }
}

const mapStateToProps = ({ flow }) => {
  return { flow }
}

NewBluprint.propTypes = propTypes

export default connect(mapStateToProps)(NewBluprint)
