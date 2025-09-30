import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString({message: "Name must be a string"})
    name: string;

    @IsString({message: "Email must be a string"})
    @IsEmail()
    email: string;

    @IsString({message: "Password must be a string"})
    @MinLength(6, {message: "Password must be at least 6 characters long"})
    @MaxLength(20, {message: "Password must be at most 20 characters long"})
    password: string;
}
