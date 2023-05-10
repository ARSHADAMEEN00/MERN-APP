import { Note } from "models/note";
import { API_URL } from "./http";
import { User, UserModel } from "models/user";
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
    const response = await http.get('/api/user/profile')
    return response
}

export interface SignUpCredentials {
    username: string, email: string, password: string,
}

export async function signUp(credentials: SignUpCredentials): Promise<UserModel> {
    const response = await http.post('/api/user/signup', credentials,)
    return response
}

export interface LoginCredentials {
    username: string, password: string,
}

export async function login(credentials: LoginCredentials): Promise<UserModel> {
    const response = await http.post("/api/user/login", credentials)
    return response
}

export async function logout() {
    await fetchData("/api/user/logout", { method: "POST" });
}

interface requestBody {
    limit: number, page: number, search: string,
    sort: string
}

//notes
export async function fetchNotes({ limit, page, search, sort }: requestBody): Promise<Note[]> {
    const response = await http.get(`/api/notes/${sort}?page=${page ? page : 1}&limit=${limit ? limit : 10}&search=${search ? search : ""}`)
    return response
}

export interface NoteInput {
    title: String,
    text?: String,
    letterCount?: Number,
    isSaved?: Boolean,
    isArchived?: Boolean,
    // createdAt?: Date,
    // updatedAt?: Date,
    // __v?: number,
    // _id?: string
}


export async function createNote(note: NoteInput): Promise<Note> {
    const response = await http.post('/api/notes', note)
    return response

}

export async function updateNote(noteId: string, note: NoteInput): Promise<Note> {
    const response = await http.put(`/api/notes/${noteId}`, note)
    return response
}

export async function deleteNote(noteId: string) {
    await http.del(`/api/notes/${noteId}`)
    return noteId
}

