import React, { PropTypes } from 'react'
import _ from 'lodash'
import styles from './styles.css'
import Alert from 'zooid-alert'

const propTypes = {
  sharedDevices: PropTypes.array,
}

const defaultProps = {
  sharedDevices: null,
}

const ShareDevices = ({ sharedDevices }) => {
  if (_.isEmpty(sharedDevices)) {
    return null
  }

  return (
    <div className={styles.root}>
      <Alert dismissable type="info">By sharing an existing device, you are modifying its
       permissions to allow it receive messages from other devices.
      </Alert>
    </div>
  )
}

ShareDevices.propTypes    = propTypes
ShareDevices.defaultProps = defaultProps

export default ShareDevices
