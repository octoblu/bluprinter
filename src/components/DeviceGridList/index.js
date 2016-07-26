import _ from 'lodash'
import DeviceGridListItem from '../DeviceGridListItem/'
import React, { PropTypes } from 'react'

const propTypes = {
  devices: PropTypes.array,
  onSelection: PropTypes.func,
}

const defaultProps = {
  devices: null,
  onSelection: _.noop
}

const DeviceGridList = ({devices, onSelection}) => {
  if(_.isEmpty(devices)) return null
  const deviceListItems = _.map(devices, (device) => <DeviceGridListItem key={device.uuid} device={device} onSelection={onSelection} />)

  return <div>{deviceListItems}</div>
}

DeviceGridList.propTypes    = propTypes
DeviceGridList.defaultProps = defaultProps

export default DeviceGridList
