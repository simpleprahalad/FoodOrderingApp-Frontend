import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

function StyledSnackBar(props) {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left'
            }}
            open={props.open}
            autoHideDuration={3000}
            onClose={props.onClose}
            message={props.message}
            action={
                <>
                    <IconButton
                        size='small'
                        aria-label='close'
                        color='inherit'
                        onClick={props.closeHandler}
                    >
                        <CloseIcon fontSize='small' />
                    </IconButton>
                </>
            }
        />
    )
}

export default StyledSnackBar
