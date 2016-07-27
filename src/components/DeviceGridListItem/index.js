import _ from 'lodash'
import React, { PropTypes } from 'react'
import Card from 'zooid-card'
import DeviceIcon from 'zooid-device-icon'

import styles from './styles.css'

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
    <Card onClick={handleOnSelected} className={styles.root}>
      <DeviceIcon type={device.type} className={styles.deviceIcon}/>
      <div className={styles.deviceName}>{device.name}</div>
    </Card>
  )
}

DeviceGridListItem.propTypes    = propTypes
DeviceGridListItem.defaultProps = defaultProps

export default DeviceGridListItem
