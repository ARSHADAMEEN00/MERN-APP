import * as React from 'react';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import { Button, Fab, Typography, } from '@mui/material';

import NoteCard from 'components/NoteCard';
import NoteDialog from 'components/NoteDialog';
import { Context, ContextType } from 'util/provider';
import { Note } from 'models/note';

import * as NoteApi from "network/api_helper"
import CardLoading from 'components/loading/CardLoading';
import SnackbarComp from 'util/Snackbar';

import NoNotesImage from "assets/image/no-notes.png"
import { Link } from 'react-router-dom';

interface state {
    status: boolean,
    data?: Note
}

function Notes() {
    const { notes, saveNote, user } = React.useContext(Context) as ContextType;

    const [noteDialog, setNoteDialog] = React.useState<state>({
        status: false,
    });

    const handleClickOpen = (note?: Note) => {
        setNoteDialog({
            status: true,
            data: note
        });
    };

    const handleClose = () => {
        setNoteDialog({
            status: false
        });
    };


    const [notesLoading, setNotesLoading] = React.useState(true);
    const [showNotesLoadingError, setShowNotesLoadingError] = React.useState(false)

    React.useEffect(() => {
        async function loadNotes() {
            try {
                setNotesLoading(true)
                setShowNotesLoadingError(false)
                const notes = await NoteApi.fetchNotes()
                saveNote(notes);
            } catch (error) {
                console.error(error);
                setShowNotesLoadingError(true)
            } finally {
                setNotesLoading(false)
            }
        };
        loadNotes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const [open, setOpen] = React.useState(false);

    const handleRefresh = () => {
        setOpen(false);
        window.location.reload()
    };

    return (
        <React.Fragment>
            {user ?
                <Box sx={{ height: '85vh', bgcolor: '#cfe8fc', overflowY: "scroll", }}>
                    {showNotesLoadingError && <SnackbarComp
                        isStatic={true}
                        open={open}
                        handleClose={() => setOpen(false)}
                        btnFun={handleRefresh}
                        btnText='refresh'
                        message='Something went wrong. Please refresh the page'
                        transition='up'
                        color="success"
                        position={{
                            vertical: "top",
                            horizontal: "center"
                        }}
                    />}
                    {notesLoading && <CardLoading count={4} />}

                    {!showNotesLoadingError && !notesLoading &&
                        <Box sx={{ height: notes?.length > 0 ? "auto" : '100%', padding: 2, display: "flex", alignItems: "start", justifyContent: "start", flexWrap: "wrap" }} >
                            {
                                notes?.length > 0 ? <>
                                    {notes?.map((note, pen) => (
                                        <NoteCard note={note} key={pen} handleClickOpen={(note: Note) => handleClickOpen(note)} />
                                    ))}
                                </> :
                                    <Box sx={{ height: "100%", width: "100%", flexDirection: { lg: "row", md: 'column', sm: "column", xs: 'column', }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Box sx={{ marginLeft: { xs: '40px' } }}>
                                            <img src={NoNotesImage} alt="no notes found" />
                                        </Box>
                                        <Box sx={{ marginTop: { xs: "20px" } }}>
                                            <Typography variant="body2" color="text.secondary">
                                                Please create new notes now <br />as there were none found
                                            </Typography>
                                        </Box>
                                    </Box>}

                            <Box sx={{ position: "absolute", bottom: 75, right: 50 }}
                                onClick={() => handleClickOpen()}
                            >
                                <Fab color="primary" aria-label="edit">
                                    <EditIcon />
                                </Fab>
                            </Box>
                            <NoteDialog noteToEdit={noteDialog.data} open={noteDialog.status} handleClose={handleClose} />
                        </Box>
                    }


                </Box> :
                <Box sx={{ height: '85vh', width: "100%", flexDirection: { lg: "row", md: 'column', sm: "column", xs: 'column', }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Box sx={{ marginLeft: { xs: '40px' } }}>
                        <img src={NoNotesImage} alt="no notes found" />
                    </Box>
                    <Box sx={{ marginTop: { xs: "20px" } }}>
                        <Typography variant="body2" color="text.secondary">
                            Please login to see your notes
                        </Typography>
                        <Link to={'/login'}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                color='info'

                            >
                                Login
                            </Button>
                        </Link>
                    </Box>
                </Box>
            }

        </React.Fragment >
    )
}


export default Notes




