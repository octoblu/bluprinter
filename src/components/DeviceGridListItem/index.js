import _ from 'lodash'
import React, { PropTypes } from 'react'
import DeviceIcon from 'zooid-device-icon'

const propTypes = {
  device: PropTypes.object,
  onSelection: PropTypes.func,
}

const defaultProps = {
  device: null,
  onSelection: _.noop
}

const DeviceGridListItem = ({device, onSelection}) => {
  const handleOnSelected = () => onSelection(device)

  if(_.isEmpty(device)) return null
  return (
    <div onClick={handleOnSelected}>
      <DeviceIcon type={device.type}/> 
      {device.name}
    </div>
  )
}

DeviceGridListItem.propTypes    = propTypes
DeviceGridListItem.defaultProps = defaultProps

export default DeviceGridListItem
