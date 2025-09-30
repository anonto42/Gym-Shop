import { IsEmail, IsString } from "class-validator";

export class CreateAuthDto {

    @IsEmail()
    email: string;

    @IsString({message: "Password must be a string"})
    password: string;
}
