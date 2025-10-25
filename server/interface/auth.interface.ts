

export interface ISignUpInput extends FormData {
    email: string;
    password: string;
    name: string;
}

export interface ISignInInput extends FormData {
    email: string;
    password: string;
}
