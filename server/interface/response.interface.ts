
export interface IResponse<T = unknown> {
    isError: boolean;
    status: number;
    message: string;
    data?: T | null;
}
