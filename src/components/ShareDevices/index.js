import React, { PropTypes } from 'react'
import _ from 'lodash'

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

  return <input type="checkbox" onClick={handleClick} />
}

ShareDevices.propTypes    = propTypes
ShareDevices.defaultProps = defaultProps

export default ShareDevices
