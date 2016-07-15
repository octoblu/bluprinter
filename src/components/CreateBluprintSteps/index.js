import React, { PropTypes } from 'react'
import _ from 'lodash'
import styles from './styles.css'

const propTypes = {
  steps: PropTypes.array,
}
const defaultProps = {
  steps: []
}

const CreateBluprintSteps = ({steps}) => {
  const items = _.map(steps, ({ state, label }) => {
    let className = styles.step

    if (state === 'ACTIVE') className = styles.activeStep
    if (state === 'COMPLETED') className = styles.completedStep

    return React.createElement('div', { className, key: label }, label)
  })

  return <div className={styles.root}>{items}</div>
}

CreateBluprintSteps.propTypes    = propTypes
CreateBluprintSteps.defaultProps = defaultProps

export default CreateBluprintSteps
