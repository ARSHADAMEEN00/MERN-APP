
export interface User {
    username: string,
    email: String,
    _id: string,
}
export interface UserModel {
    user: User,
    token: string
}
