import React, { PropTypes } from 'react'
import Page from 'zooid-page'

import CreateBluprintSteps from '../components/CreateBluprintSteps'
import styles from './styles.css'

const propTypes = {
  children: PropTypes.node,
  routeParams: PropTypes.object,
}

class NewBluprint extends React.Component {
  constructor(props) {
    super(props)
    console.log('props', props)
  }

  render() {
    const { children } = this.props
    return (
      <Page className={styles.NewBluprintPage}>
        <CreateBluprintSteps />
        {children}
      </Page>
    )
  }
}

NewBluprint.propTypes = propTypes

export default NewBluprint
