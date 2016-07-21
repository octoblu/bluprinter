import React, { PropTypes } from 'react'
import _ from 'lodash'

import styles from './styles.css'

const propTypes = {
  latest: PropTypes.string.isRequired,
  versions: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
}
const defaultProps = {}

const BluprintVersionSelect = ({ latest, versions, onChange }) => {
  const versionOptions = _.map(versions, (version) => {
    return <option key={version.version} value={version.version}>{version.version}</option>
  })
  return (
    <div>
      <label htmlFor="version">Version</label>
    <select name="version" defaultValue={latest} onChange={onChange} className={styles.selector}>
        {versionOptions}
      </select>
    </div>
  )
}

BluprintVersionSelect.propTypes    = propTypes
BluprintVersionSelect.defaultProps = defaultProps

export default BluprintVersionSelect
