import React, { PropTypes } from 'react'

import classNames from 'classnames'
import Heading from 'zooid-heading'
import RunPageActions from '../RunPageActions'

import styles from './styles.css'

const propTypes = {
  device: PropTypes.object.isRequired,
  onStop: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
}

const defaultProps = {}

const RunPageHeader = ({device, onStop, onStart }) => {
  let onlineTag = (<span className={styles.offlineLabel}>Offline</span>)
  if (device.online) onlineTag = (<span className={styles.onlineLabel}>Online</span>)

  return (
    <div className={styles.PageHeader}>
      <div className={styles.DeviceHeader}>
        <Heading level={4} className={styles.PageHeaderText}>
          <img src={device.logo} alt={device.name} />
          <div>
            <div>{device.name}</div>
            {onlineTag}
          </div>
        </Heading>

      </div>
      <RunPageActions
        onStop={onStop}
        onStart={onStart}
        online={device.online}
      />
    </div>
  )
}

RunPageHeader.propTypes    = propTypes
RunPageHeader.defaultProps = defaultProps

export default RunPageHeader
