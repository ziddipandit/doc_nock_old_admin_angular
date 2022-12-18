export interface LoginInterface {
    email: string,
    password: string
}

export interface ForgotInterface {
    email: string
}

export interface ResetInterface {
    token: string,
    password: string,
    confirm_password: string
}

export interface ValidateToken {
    token: string
}

export interface ApiResponse {
    status: string,
    messageID: number,
    message: string,
    data: any
}

export enum ResultType {
    SUCCESS = 200,
    ISSUE = 500,
    ERROR = 500
}

export interface UserInfo {
    _id: string,
    name: string,
    email: string,
    role: string,
    iat?: number,
    exp?: number,
    image?: string
}