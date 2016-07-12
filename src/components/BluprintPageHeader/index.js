import React, { PropTypes } from 'react'

import Heading from 'zooid-heading'
import BluprintDetailPageActions from '../BluprintDetailPageActions'

import styles from './styles.css'

const propTypes = {
  deletingBluprint: PropTypes.bool,
  device: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onImport: PropTypes.func.isRequired,
}
const defaultProps = {}

const BluprintPageHeader = ({ deletingBluprint, device, onDelete, onImport }) => {
  return (
    <div className={styles.PageHeader}>
      <Heading level={4} className={styles.PageHeaderText}>
        <img src={device.logo} alt={device.name} />
        {device.name}
      </Heading>

      <BluprintDetailPageActions
        onDeleteBluprint={onDelete}
        deleting={deletingBluprint}
        onImport={onImport}
      />
    </div>
  )
}

BluprintPageHeader.propTypes    = propTypes
BluprintPageHeader.defaultProps = defaultProps

export default BluprintPageHeader
