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

const BluprintList = ({bluprints}) => {
  if(_.isEmpty(bluprints)) return null
  const bluprintListItems = _.map(bluprints, (bluprint) => <BluprintListItem bluprint={bluprint} />)

  return <div>{bluprintListItems}</div>

}

BluprintList.propTypes    = propTypes
BluprintList.defaultProps = defaultProps

export default BluprintList
