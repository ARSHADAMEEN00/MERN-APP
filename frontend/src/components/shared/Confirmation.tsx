import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";

interface dialogProp {
    message: string, title: string, open: boolean, onClose: () => void,
    onConfirm: () => void,
}

const ConfirmDialog = ({ message, title, open, onClose, onConfirm }: dialogProp) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <Box position="absolute" top={0} right={0}>
                <IconButton>
                    <Close />
                </IconButton>
            </Box>
            <DialogContent>
                <Typography>{message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Cancel
                </Button>
                <Button color="secondary" onClick={onConfirm} variant="contained">
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmDialog;