import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Organization } from "src/organization/entities/organization.entity";

export class CreateUserDto {
    @IsNotEmpty()
    @IsNumber()
    role_id: number;

    @IsNotEmpty()
    @IsNumber()
    organization_id: number;

    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    email:string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(15)
    mobile: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
