import React, { PropTypes } from 'react'
import _ from 'lodash'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import  List, { ListItem } from 'zooid-list'


const propTypes = {
  onUpdatePermissions: PropTypes.func,
  sharedDevices: PropTypes.array,
}

const defaultProps = {
  onUpdatePermissions: _.noop,
  sharedDevices: null,
}

const UpdateSharedDevicesAlert = ({ sharedDevices, onUpdatePermissions}) => {
  if (_.isEmpty(sharedDevices)) return null
  const items = _.map(sharedDevices, (device) => {
    return (
      <ListItem key={device.uuid}>
        <div>
          <p>{device.name}</p>
          <p>{device.uuid}</p>
          <p>{device.type}</p>
        </div>
      </ListItem>
    )
  })
  return (
    <div>
      <Heading level={4}>Almost Done!</Heading>
      <Heading level={5}>
        Choosing to share an existing device, requires you to
        update it's messaging permissions.
      </Heading>

      <div>
        <Button kind="no-style" size="small">Details</Button>
        <p>
          The message received permission needs to be updated to
          allow the device to receive messages from other devices.
        </p>
      </div>

      <List>{items}</List>

      <Button
        kind="hollow-primary"
        onClick={onUpdatePermissions}
        block
        name="updatePermissions"
      >
        Update Permissions
      </Button>
    </div>
  )
}

UpdateSharedDevicesAlert.propTypes    = propTypes
UpdateSharedDevicesAlert.defaultProps = defaultProps
export default UpdateSharedDevicesAlert
