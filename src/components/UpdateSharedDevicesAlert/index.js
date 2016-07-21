import React, { PropTypes } from 'react'
import _ from 'lodash'
import Alert from 'zooid-alert'
import Button from 'zooid-button'
import Heading from 'zooid-heading'
import  List, { ListItem } from 'zooid-list'


const propTypes = {
  onUpdatePermission: PropTypes.func,
  sharedDevices: PropTypes.array,
}

const defaultProps = {
  onUpdatePermission: _.noop,
  sharedDevices: null,
}

const UpdateSharedDevicesAlert = ({ sharedDevices, onUpdatePermission }) => {
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
    <Alert>
      <Heading level={5}>Almost Done!</Heading>
      <p>
        Choosing to share an existing device, requires you to
        update it's messaging permissions.
      </p>
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
        onClick={onUpdatePermission}
        block
        name="updatePermissions"
      >
        Update Permissions
      </Button>
    </Alert>
  )
}

UpdateSharedDevicesAlert.propTypes    = propTypes
UpdateSharedDevicesAlert.defaultProps = defaultProps
export default UpdateSharedDevicesAlert
