import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Page from 'zooid-page'

import CreateBluprintSteps from '../components/CreateBluprintSteps'
import { setBreadcrumbs } from '../modules/Breadcrumbs'

import styles from './styles.css'

const propTypes = {
  breadcrumbs: PropTypes.array,
  children: PropTypes.node,
  dispatch: PropTypes.func,
}

class CreateBluprintWizard extends React.Component {
  constructor(props) {
    super(props)

    props.dispatch(setBreadcrumbs([
      { label: 'Create a Bluprint' },
      { label: 'Configure' },
      { label: 'Update Permissions' },
      { label: 'Finish' },
    ]))
  }

  render() {
    const { breadcrumbs, children } = this.props

    return (
      <Page className={styles.bluprintWizard}>
        <CreateBluprintSteps steps={breadcrumbs} />
        {children}
      </Page>
    )
  }
}

const mapStateToProps = ({ breadcrumbs }) => {
  return {
    breadcrumbs: breadcrumbs.steps,
  }
}

CreateBluprintWizard.propTypes = propTypes

export default connect(mapStateToProps)(CreateBluprintWizard)
