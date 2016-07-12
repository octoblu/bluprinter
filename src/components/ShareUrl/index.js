import React, { PropTypes } from 'react'
import url from 'url'

import Switch from 'zooid-switch'


const propTypes = {
  onChange: PropTypes.func.isRequired,
  publicBluprint: PropTypes.bool.isRequired,
  uuid: PropTypes.string.isRequired,
}
const defaultProps = {}

const ShareUrl = ({ onChange, publicBluprint, uuid }) => {
  const { protocol, hostname, port } = window.location
  const generatedUrl = url.format({
    protocol,
    hostname,
    port,
    pathname: `/bluprints/${uuid}/import`
  })

  const shareUrl = (
    <span>
      <a href={generatedUrl}>{generatedUrl}</a>
    </span>
  )

  return (
    <div>
      <Switch label="Public" onChange={onChange} />
      {publicBluprint && shareUrl}
    </div>
  )
}

ShareUrl.propTypes    = propTypes
ShareUrl.defaultProps = defaultProps

export default ShareUrl
