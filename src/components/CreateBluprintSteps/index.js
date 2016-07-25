import _ from 'lodash'
import React, { PropTypes } from 'react'
import MdDone from 'react-icons/lib/md/done'
import MdRadioButtonUnchecked from 'react-icons/lib/md/radio-button-unchecked'

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
    let icon = <MdRadioButtonUnchecked />

    if (state === 'ACTIVE') className = styles.activeStep
    if (state === 'COMPLETED') {
      icon = <MdDone />
      className = styles.completedStep
    }

    return <div className={className} key={label}>{label} {icon}</div>
  })

  return (
    <div className={styles.root}>
      {items}
    </div>
  )
}

CreateBluprintSteps.propTypes    = propTypes
CreateBluprintSteps.defaultProps = defaultProps

export default CreateBluprintSteps
