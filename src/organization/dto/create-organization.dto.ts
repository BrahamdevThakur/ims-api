import { IsEnum, IsNotEmpty, IsOptional, IsString, Max } from "class-validator";
import { Organization } from "../entities/organization.entity";
import { OrganizationType} from "@prisma/client";

export class CreateOrganizationDto {
@IsNotEmpty()
@IsString()
name: string;

@IsNotEmpty()
@IsEnum(OrganizationType)
type: OrganizationType

@IsOptional()
@IsString()
address: string;

@IsOptional()
@IsString()
@Max(15)
phone: string;
}