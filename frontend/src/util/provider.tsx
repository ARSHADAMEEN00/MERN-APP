import * as React from 'react';
import { Note } from 'models/note';
import { User } from 'models/user';

export type ContextType = {
    notes: Note[],
    addToNote: (note: Note) => void
    saveNote: (note: Note[]) => void
    updateNote: (note: Note) => void
    deleteNote: (id: string) => void
    user: User | undefined,
    setUser: (user: User) => void,
    setChangeMobileNav: (tab: string) => void,
    mobileNav: string
}

interface IProps {
    children: React.ReactNode;
}

export const Context = React.createContext<ContextType | null>(null);

const DataProvider = ({ children }: IProps) => {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [user, setUser] = React.useState<User>();
    const [mobileNav, setChangeMobileNav] = React.useState<string>('recent');

    const saveNote = (notes: Note[]) => {
        setNotes(notes);
    };

    const addToNote = (note: Note) => {
        const newNote: Note = note
        setNotes([...notes, newNote]);
    };

    const updateNote = (newNote: Note) => {
        const updatedNote = notes.map((note: Note) => note._id === newNote?._id ? { ...note, ...newNote } : note);

        setNotes(updatedNote)
    };

    const deleteNote = (id: number | string) => {
        setNotes(notes.filter((note: Note) => note._id !== id))
    }



    return <Context.Provider value={{ notes, saveNote, addToNote, updateNote, deleteNote, setUser, user, setChangeMobileNav, mobileNav }}>{children}</Context.Provider>;
};

export default DataProvider;