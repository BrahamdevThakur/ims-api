import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalizes';
import { Organization } from './entities/organization.entity';

@Injectable()
export class OrganizationService {
  constructor(private prismaService: PrismaService){}

  async create(createOrganizationDto: CreateOrganizationDto) {
    createOrganizationDto.name = capitalizeFirstLetterOfEachWordInAPhrase(createOrganizationDto.name);

    const organization= await this.prismaService.organization.findFirst({
      where: {
        name: CreateOrganizationDto.name,
      },
    });

    if (organization) {
      throw new BadRequestException(`Organization ${createOrganizationDto.name} has already been taken`);
    }

    return this.prismaService.organization.create({ data: createOrganizationDto });
  }

 findAll() {
    return this.prismaService.organization.findMany();
  }

  async findOne(id: number) {
    return 'this action returns a #${id} organization';
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    await this.getOrganizationById(id);
  
  }

  updateOrganization.name =capitalizeFirstLetterOfEachWordInAPhrase(updateOrganizationDto.name);

  const organization = await this.prismaService.organization.findFirst({
    where: {
      name: UpdateOrganizationDto.name,
    },
  });


  if(organization && Organization.id !== id) {
    throw new BadRequestException('Organization ${update.organizationDto.name} has been already taken');

  }
  return this.prismaService.organization.update({
    where: {id} ;
    data: UpdateOrganizationDto,
  });

  remove(id: number) {
    return `This action removes a #${id} organization`;
  }
}
