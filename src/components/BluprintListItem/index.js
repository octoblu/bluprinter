import _ from 'lodash'
import React, { PropTypes } from 'react'

const propTypes = {
  bluprint: PropTypes.object,
  onSelected: PropTypes.func,
}

const defaultProps = {
  bluprint: null,
  onSelected: _.noop
}

const BluprintListItem = ({bluprint, onSelected}) => {
  const handleOnSelected = () => onSelected(bluprint)

  if(_.isEmpty(bluprint)) return null
  return <h3 onClick={handleOnSelected}>{bluprint.name}</h3>
}

BluprintListItem.propTypes    = propTypes
BluprintListItem.defaultProps = defaultProps

export default BluprintListItem
