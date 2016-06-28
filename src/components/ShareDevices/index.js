import React, { PropTypes } from 'react'
import _ from 'lodash'
import styles from './styles.css'

const propTypes = {
  sharedDevices: PropTypes.array,
  onShareDevices: PropTypes.func,
}

const defaultProps = {
  sharedDevices: null,
  onShareDevices: _.noop,
}

const ShareDevices = ({ sharedDevices, onShareDevices }) => {
  if (_.isEmpty(sharedDevices)) {
    return null
  }

  const handleClick = ({target}) => {
    return onShareDevices({
      shareExistingDevices: target.checked,
      sharedDevices
    })
  }

  return (
    <div>
      <label htmlFor="allowPublicMessagingForSharedDevices">
        Allow shared devices to receive global messages
      </label>
      <input
        name="allowPublicMessagingForSharedDevices"
        type="checkbox"
        onClick={handleClick}
      />
    </div>
    )
}

ShareDevices.propTypes    = propTypes
ShareDevices.defaultProps = defaultProps

export default ShareDevices
