
export interface IError {
    message: string | null;
    field: "name" | "email" | "password" | "confirm-password" | null;
}