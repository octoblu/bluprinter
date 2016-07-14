import React, { PropTypes } from 'react'
import styles from './styles.css'

const propTypes = {}
const defaultProps = {}

const CreateBluprintSteps = () => {
  return (
    <nav className={styles.root}>
      <div className={styles.activeStep}>Create a Bluprint</div>
      <div className={styles.step}>Configure</div>
      <div className={styles.step}>Finish</div>
    </nav>
  )
}

CreateBluprintSteps.propTypes    = propTypes
CreateBluprintSteps.defaultProps = defaultProps

export default CreateBluprintSteps
