import _ from 'lodash'
import React, { PropTypes } from 'react'
import DeviceGridListItem from '../DeviceGridListItem/'

import styles from './styles.css'

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

  return <div className={styles.list}>{deviceListItems}</div>
}

DeviceGridList.propTypes    = propTypes
DeviceGridList.defaultProps = defaultProps

export default DeviceGridList
