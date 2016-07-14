import React, { PropTypes } from 'react'

import Button from 'zooid-button'
import styles from './styles.css'

const propTypes = {
  cancelText: PropTypes.string,
  confirmText: PropTypes.string,
  body: PropTypes.string.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  showDialog: PropTypes.bool.isRequired,
}
const defaultProps = {
  cancelText: 'Cancel',
  confirmText: 'Okay',
  showDialog: false,
}

const Dialog = ({ body, cancelText, confirmText, onCancel, onConfirm, showDialog }) => {
  if (!showDialog) return null
  return (
    <dialog open={showDialog} className={styles.dialog}>
      {body}
      <div className={styles.actionButtons}>
        <Button
          size="small"
          kind="hollow-danger"
          onClick={onCancel}
        >
            {cancelText}
        </Button>
        <Button size="small" kind="hollow-primary" onClick={onConfirm} className={styles.confirm}>
          {confirmText}
        </Button>
      </div>
    </dialog>)
}

Dialog.propTypes    = propTypes
Dialog.defaultProps = defaultProps

export default Dialog
