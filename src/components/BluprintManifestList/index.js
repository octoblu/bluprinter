import _ from 'lodash'
import React, { PropTypes } from 'react'
import List, { ListItem } from 'zooid-list'

const propTypes = {
  manifest: PropTypes.array,
}

const defaultProps = {}

const BluprintManifestList = ({ manifest }) => {
  if (_.isEmpty(manifest)) return null

  const items = _.map(manifest, (node) => {
    return (
      <ListItem key={node.id}>
        <a href={node.documentation} targe="_blank">{node.name}</a>
      </ListItem>
    )
  })

  return <List>{items}</List>
}

BluprintManifestList.propTypes    = propTypes
BluprintManifestList.defaultProps = defaultProps

export default BluprintManifestList
