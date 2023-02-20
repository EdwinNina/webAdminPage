import { OmitType } from "@nestjs/mapped-types";
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RegisterDto{
   @IsNotEmpty()
   @IsString()
   username: string;

   @IsEmail()
   email: string;

   @IsString()
   @MinLength(8, {
      message: 'La contraseña debe tener minimo 8 caracteres'
   })
   @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'La contraseña debe tener al menos letras mayusculas, minusculas y numeros'
   })
   password: string;
}

export class LoginDto extends OmitType(RegisterDto, ['username']) {}