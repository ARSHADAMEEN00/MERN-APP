import { Note } from "models/note";
import { API_URL } from "./http";
import { User } from "models/user";
import * as http from "network/http"

async function fetchData(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(`${API_URL}${input}`, init)
    if (response.ok) {
        return response;
    } else {
        const errorBody = await response.json();
        const errorMessage = errorBody.error
        throw Error(errorMessage)
    }
}

//user
export async function getLoggedInUser(): Promise<User> {
    const response = await http.get('/api/users', { withCredentials: true })
    return response
}

export interface SignUpCredentials {
    username: string, email: string, password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
    const response = await http.post('/api/users/signup', credentials,)

    // fetchData("/api/users/signup",
    //     {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(credentials),
    //     })
    return response
}

export interface LoginCredentials {
    username: string, password: string,
}

export async function login(credentials: LoginCredentials): Promise<User> {
    const response = await http.post("/api/users/login", credentials)
    //  fetchData("/api/users/login",
    //     {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(credentials),
    //     })
    return response
}

export async function logout() {
    await fetchData("/api/users/logout", { method: "POST" });
}





//notes
export async function fetchNotes(): Promise<Note[]> {
    const response = await http.get('/api/notes')
    //  fetchData("/api/notes", { method: "GET" })
    return response
}

export interface NoteInput {
    title: string, text?: string,
}


export async function createNote(note: NoteInput): Promise<Note> {
    const response = await http.post('/api/notes', note)
    // fetchData("/api/notes", {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(note),
    // })
    return response

}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await http.put(`/api/notes/${noteId}`, note)

    // fetchData("/api/notes/" + noteId, {
    //     method: "PUT",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(note),
    // })
    return response
}

export async function deleteNote(noteId: string) {
    await http.del(`/api/notes/${noteId}`)
    // fetchData("/api/notes/" + noteId, {
    //     method: "DELETE",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    // })
    return noteId
}

