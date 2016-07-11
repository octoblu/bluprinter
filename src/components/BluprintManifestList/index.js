import _ from 'lodash'
import React, { PropTypes } from 'react'
import TextTruncate from 'react-text-truncate'
import Card from 'zooid-card'
import DeviceIcon from 'zooid-device-icon'

import styles from './styles.css'

const propTypes = {
  manifest: PropTypes.array,
}

const defaultProps = {}

const BluprintManifestList = ({ manifest }) => {
  if (_.isEmpty(manifest)) return null

  const items = _.map(manifest, (node) => {
    return (
      <div className={styles.GridListItem} key={node.id} >
        <DeviceIcon className={styles.GridListItemImage} type={node.type} />
        <a className={styles.GridListItemName} href={node.documentation} target="_blank">
          <TextTruncate text={node.name} truncateText="..." />
        </a>
      </div>
    )
  })

  return <div className={styles.GridList}>{items}</div>
}

BluprintManifestList.propTypes    = propTypes
BluprintManifestList.defaultProps = defaultProps

export default BluprintManifestList
