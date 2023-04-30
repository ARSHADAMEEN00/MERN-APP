import { Alert, AlertColor, Box, Button, Slide, SlideProps, Snackbar, SnackbarContent, } from '@mui/material';


interface snackBarProp {
    color: AlertColor, open: boolean, message: string, btnText?: string, btnFun: () => void, transition: string, handleClose: () => void,
    position: {
        vertical: any,
        horizontal: any,
    },
    isStatic: boolean
}


type TransitionProps = Omit<SlideProps, 'direction'>;

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}

function TransitionUp(props: TransitionProps) {
    return <Slide {...props} direction="up" />;
}

function TransitionRight(props: TransitionProps) {
    return <Slide {...props} direction="right" />;
}

function TransitionDown(props: TransitionProps) {
    return <Slide {...props} direction="down" />;
}

function SnackbarComp({ open, message, btnText, btnFun, transition, handleClose, color, position, isStatic }: snackBarProp) {

    const handleTransition = () => {
        switch (transition) {
            case "up":
                return TransitionUp

            case "left":
                return TransitionLeft

            case "right":
                return TransitionRight

            case "down":
                return TransitionDown

            default:
                return TransitionLeft
        }
    }


    return (
        <>
            {isStatic ?
                <SnackbarContent sx={{ width: "95%", margin: "auto", marginTop: 2, }} message={message} action={<Button color="warning" size="small" onClick={btnFun}>
                    {btnText && btnText}
                </Button>} /> :
                <Snackbar
                    open={open}
                    onClose={handleClose}
                    TransitionComponent={handleTransition()}
                    key={handleTransition() ? handleTransition().name : ''}
                    anchorOrigin={{ vertical: position.vertical, horizontal: position.horizontal, }}
                >
                    <Box>
                        <Alert onClose={handleClose} severity={color} sx={{ width: '100%' }}>
                            {message}
                        </Alert>
                    </Box>
                </Snackbar>
            }

        </>

    )
}

export default SnackbarComp