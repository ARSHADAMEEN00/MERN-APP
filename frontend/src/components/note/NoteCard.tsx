import * as React from 'react';
import { Note } from 'models/note';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import EditNoteIcon from '@mui/icons-material/EditNote';
import moment from 'moment';
import * as NoteApi from "network/api_helper"
import { Context, ContextType } from 'util/provider';
import { Box, Menu, MenuItem } from '@mui/material';
import ArchiveIcon from '@mui/icons-material/Archive';
import SaveIcon from '@mui/icons-material/Save';
import ConfirmDialog from 'components/shared/Confirmation';

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

interface NoteProp {
    note: Note,
    handleClickOpen: (note: Note) => void
}


const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

function NoteCard({ note, handleClickOpen }: NoteProp) {
    const { deleteNote, updateNote } = React.useContext(Context) as ContextType;

    const [expanded, setExpanded] = React.useState(false);
    const [confirmDialog, setConfirmDialog] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const handleDelete = async () => {
        try {
            const response = await NoteApi.deleteNote(note?._id)
            if (response) {
                deleteNote(response)
            }
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }

    const handleUpdate = async () => {
        handleClickOpen(note)
    }

    const handleClose = () => {
        setConfirmDialog(false);
    };

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSave = async () => {
        try {
            const response = await NoteApi.updateNote(note?._id, { ...note, isSaved: true })

            if (response) {
                updateNote(response)
            }
            setAnchorEl(null)
        } catch (error) {
            console.error(error);
            alert(error);
        }
    }
    const handleArchive = async () => {
        if (note?._id) {
            try {
                const response = await NoteApi.updateNote(note?._id, { ...note, isArchived: true })

                if (response) {
                    updateNote(response)
                }
                setAnchorEl(null)
            } catch (error) {
                console.error(error);
                alert(error);
            }
        }
    }

    return (
        <>
            <Card sx={{ width: { md: '256px', xs: '100%', }, margin: 1, marginBottom: 1, boxShadow: "none" }} >
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: '#009688' }} aria-label="recipe">
                            {note?.title?.slice(0, 1)}
                        </Avatar>
                    }
                    action={
                        <Box>
                            <IconButton aria-label="settings"
                                onClick={handleClick}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={() => setAnchorEl(null)}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={() => handleArchive()}>
                                    <Typography variant="body2" color="text.secondary">
                                        <ArchiveIcon color='info' sx={{ fontSize: "14px", marginBottom: "-2px" }} /> Archive
                                    </Typography>
                                </MenuItem>
                                <MenuItem onClick={() => handleSave()}>
                                    <Typography variant="body2" color="text.secondary">
                                        <SaveIcon color='info' sx={{ fontSize: "14px", marginBottom: "-2px" }} /> Save
                                    </Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                    title={note?.title}
                    subheader={moment(note?.createdAt).format('LL')}
                />
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {note?.text}
                    </Typography>
                </CardContent>

                <CardActions disableSpacing>
                    <IconButton aria-label="delete note" onClick={() => setConfirmDialog(true)}>
                        <RestoreFromTrashIcon color='warning' sx={{ fontSize: '18px' }} />
                    </IconButton>
                    <IconButton color='success' aria-label="edit note"
                        onClick={handleUpdate}
                    >
                        <EditNoteIcon />
                    </IconButton>
                    {note?.title?.length >= 50 && <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                        color='info'
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>}
                    <Typography variant="caption" color="text.secondary" sx={{
                        marginLeft: '20px'
                    }}>
                        {moment(note?.createdAt).isSame(note?.updatedAt) === true ? <>
                            Create : {moment(note?.createdAt).format('LL')}
                        </> :
                            <>
                                Updated : {moment(note?.updatedAt).format('LL')}
                            </>

                        }
                    </Typography>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography paragraph>
                            {note?.text}
                        </Typography>
                    </CardContent>
                </Collapse>
                <ConfirmDialog
                    title="Delete Confirmation"
                    message="Are you sure, you want delete this note"
                    open={confirmDialog}
                    onClose={handleClose}
                    onConfirm={handleDelete}
                />
            </Card>
        </>
    )
}

export default NoteCard