import _ from 'lodash'
import React, { PropTypes } from 'react'
import TextTruncate from 'react-text-truncate'
import Button from 'zooid-button'
import Card from 'zooid-card'
import DeviceIcon from 'zooid-device-icon'
import Heading from 'zooid-heading'

import styles from './styles.css'

const propTypes = {
  manifest: PropTypes.array,
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
}

const defaultProps = {}

const BluprintManifestList = ({ manifest, expanded, onChange }) => {
  if (_.isEmpty(manifest)) return null

  let manifestList = null

  if (expanded) {
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

    manifestList = (
      <div className={styles.GridList}>
        {items}
      </div>
    )
  }

  return (
    <div>
      <Heading className={styles.ManifestHeader} level={5}>
        Things Manifest
        <Button
          kind="no-style"
          size="small"
          onClick={onChange}
        >
          {expanded ? 'Hide' : 'Show'}
        </Button>
      </Heading>

      {manifestList}
    </div>
  )
}

BluprintManifestList.propTypes    = propTypes
BluprintManifestList.defaultProps = defaultProps

export default BluprintManifestList
