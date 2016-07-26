import React, { PropTypes } from 'react'
import Heading from 'zooid-heading'

import styles from './styles.css'

const propTypes = {
  device: PropTypes.object,
  children: PropTypes.node,
}

const defaultProps = {}

const DeviceHeader = ({ children, device  }) => {
  if (!device) return null

  return (
    <div className={styles.root}>
      <Heading level={4} className={styles.heading}>
        <img src={device.logo} alt={device.name} />
        {device.name}
      </Heading>

      <div className={styles.actions}>
        {children}
      </div>
    </div>
  )
}

DeviceHeader.propTypes    = propTypes
DeviceHeader.defaultProps = defaultProps

export default DeviceHeader
