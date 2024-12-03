import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.services';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalizes';
import { RolesService } from 'src/roles/roles.service';
import { OrganizationsService } from 'src/organization/organization.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // const roleService = new RolesService(this.prismaService);
    // await roleService.findOne(createUserDto.role_id);

    const organizationService = new OrganizationsService(this.prismaService);
    await organizationService.findOne(createUserDto.organization_id);

    const roleObj = await this.prismaService.role.findFirst({
      where: { name: createUserDto.role},
    });

    if(!roleObj) {
      throw new NotFoundException(
        'Unable to find the role ${createuserDto.role}',
      );
    }

    const { role, ...rest} = createUserDto;

    rest.name = capitalizeFirstLetterOfEachWordInAPhrase(rest.name);

    if (await this.checkIfEmailExist(rest.email)) {
      throw new BadRequestException('This email has alredy been taken');
    }

    if (await this.checkIfMobileExist(rest.mobile)) {
      throw new BadRequestException('This mobile has alredy been taken');
    }

    rest.password = await hash(rest.password,10);

    return this.prismaService.user.create({ data: rest });

    // createUserDto.password = await hash(createUserDto.password, 10);
    // return this.prismaService.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prismaService.user.findMany();
  }

  async findOne(id: number) {
    return this.getUserById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.getUserById(id);

    const roleService = new RolesService(this.prismaService);
    const organizationService = new OrganizationsService(this.prismaService);

    await roleService.findOne(updateUserDto.role_id);
    await organizationService.findOne(updateUserDto.organization_id);

    updateUserDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      updateUserDto.name,
    );

    if (updateUserDto.name) {
      updateUserDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
        updateUserDto.name,
      );
    }

    const { role,...rest } = updateUserDto;
    if (!(await this.checkIfEmailExist(updateUserDto.email,id))) {
      throw new BadRequestException(
      `User ${updateUserDto.email}has alrready been taken`,
     );
    }

    if (!(await this.checkIfMobileExist(updateUserDto.mobile, id))) {
      throw new BadRequestException(
        `User${updateUserDto.mobile} has alrready been taken`,
      );
    }

    if (updateUserDto.password) {
      updateUserDto.password = await hash(updateUserDto.password, 10);
    }

    return this.prismaService.user.update({
      where: { id },
      data: rest,
    });
  }

  async remove(id: number) {
    await this.getUserById(id);
    return this.prismaService.user.deleteMany({ where: { id } });
  }

  private async getUserById(id: number) {
    const user = await this.prismaService.user.findFirst({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ${id} does not exist`);
    }
    return user;
  }

  private async checkIfEmailExist(
    email: string,
    id?: number,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (id) {
      return user ? user.id === id : true;
    }

    return !!user;
  }

  private async checkIfMobileExist(
    mobile: string,
    id?: number,
  ): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: { mobile },
    });

    if (id) {
      return user ? user.id === id : true;
    }

    return !!user;
  }

  private async checkIfUserExist (name: string, id?: number): Promise<boolean> {
    const user = await this.prismaService.user.findFirst({
      where: { name },
    });

    if (id) {
      return user ? user.id === id : true;
    }
    return !!user;
  }
}

