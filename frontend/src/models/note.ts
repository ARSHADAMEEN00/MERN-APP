export interface Note {
    _id: string,
    title: String,
    text?: String,
    letterCount?: Number,
    isSaved?: Boolean,
    isArchived?: Boolean,
    createdAt: string,
    updatedAt: string,
}
