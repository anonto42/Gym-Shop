
export interface IResponse<T = any> {
    isError: boolean;
    status: number;
    message: string;
    data?: T | null;
}
