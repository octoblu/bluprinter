import _ from 'lodash'
import React, { PropTypes } from 'react'

const propTypes = {
  bluprint: PropTypes.object,
  onSelected: PropTypes.func,
}

const defaultProps = {}

const BluprintListItem = ({bluprint}) => {
  console.log(bluprint)

  if(_.isEmpty(bluprint)) return null
  return <h3>{bluprint.name}</h3>
}

BluprintListItem.propTypes    = propTypes
BluprintListItem.defaultProps = defaultProps

export default BluprintListItem
