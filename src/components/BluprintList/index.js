import _ from 'lodash'
import BluprintListItem from '../BluprintListItem/'
import React, { PropTypes } from 'react'

const propTypes = {
  bluprints: PropTypes.array,
  onBluprintSelected: PropTypes.func,
}

const defaultProps = {
  bluprints: null,
  onBluprintSelected: _.noop
}

const BluprintList = ({bluprints, onBluprintSelected}) => {
  if(_.isEmpty(bluprints)) return null
  const bluprintListItems = _.map(bluprints, (bluprint) => <BluprintListItem key={bluprint.uuid} bluprint={bluprint} onSelected={onBluprintSelected} />)

  return <div>{bluprintListItems}</div>

}

BluprintList.propTypes    = propTypes
BluprintList.defaultProps = defaultProps

export default BluprintList
