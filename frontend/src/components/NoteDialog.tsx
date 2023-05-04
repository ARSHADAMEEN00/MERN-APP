import React, { useEffect } from 'react'
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as NoteApi from "network/api_helper"

import { useForm, SubmitHandler } from "react-hook-form";

import { Context, ContextType } from 'util/provider';
import { Note } from 'models/note';

const style = {
    width: 500,
    margin: "auto"
};

type Inputs = {
    title: string,
    text: string,
    letterCount: number
};

interface props {
    open: boolean,
    handleClose: () => void,
    noteToEdit?: Note
}

const NoteDialog = ({ noteToEdit, open, handleClose }: props) => {
    const { addToNote, updateNote } = React.useContext(Context) as ContextType;

    const { register, handleSubmit, reset, formState: {
        // errors,
        isSubmitting,
    } } = useForm<Inputs>({
        defaultValues: {
            text: noteToEdit?.text as string || "",
            title: noteToEdit?.title as string || ""
        }
    });

    const onSubmit: SubmitHandler<Inputs> = async value => {
        if (noteToEdit?._id) {
            try {
                const note = await NoteApi.updateNote(noteToEdit?._id, { ...value, letterCount: value?.text?.length ? value?.text?.length : 0 })
                if (note?._id) {
                    updateNote(note)
                    reset()
                    handleClose()
                }
            } catch (error) {
                console.error(error);
                alert(error);
            }
        } else
            try {
                const note = await NoteApi.createNote({ ...value, letterCount: value?.text?.length ? value?.text?.length : 0 })
                if (note?._id) {
                    addToNote(note)
                    reset()
                    handleClose()
                }
            } catch (error) {
                console.error(error);
                alert(error);
            }
    };

    useEffect(() => {
        if (noteToEdit?._id) {
            reset(formValues => ({
                ...formValues,
                text: noteToEdit.text as string,
                title: noteToEdit.title as string
            }))
        } else {
            reset(formValues => ({
                ...formValues,
                text: "",
                title: ""
            }))
        }
    }, [noteToEdit?._id, noteToEdit?.text, noteToEdit?.title, reset]);

    return <Dialog sx={style} open={open} onClose={handleClose}>
        <DialogTitle sx={{ paddingBottom: 1 }}>{noteToEdit?._id ? 'Edit' : "Create"} Notes</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogContent>
                <DialogContentText sx={{ fontSize: "14px", paddingBottom: 2 }}>
                    To subscribe to new notes, please enter details and save. We
                    will updates your notes occasionally.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    size='small'
                    required
                    {...register('title', { required: true })}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="text"
                    type="text"
                    fullWidth
                    variant="outlined"
                    multiline
                    minRows={3}
                    size='small'
                    {...register('text', { required: true })}
                />
            </DialogContent>
            <DialogActions>
                <Button type='button' sx={{ color: "gray" }} onClick={handleClose}>Cancel</Button>
                <Button type='submit' color='success' disabled={isSubmitting}>Save</Button>
            </DialogActions>
        </form>
    </Dialog>;
}

export default NoteDialog