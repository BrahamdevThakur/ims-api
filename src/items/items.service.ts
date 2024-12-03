import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'src/prisma/prisma.services';
import { capitalizeFirstLetterOfEachWordInAPhrase } from 'src/helpers/capitalizes';
import { Item } from './entities/item.entity';
import { DiscountType } from '@prisma/client';
import { Organization } from 'src/organization/entities/organization.entity';

@Injectable()
export class ItemsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createItemDto: CreateItemDto) {
    createItemDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      createItemDto.name,
    );

    return this.prismaService.$transaction(async (tx) => {
      const item = await this.prismaService.items.upsert({
        where: {
          name: createItemDto.name,
        },
        update: {},
        create: {
          name: createItemDto.name,
          quantity: createItemDto.quantity,
          price: createItemDto.price,

          ...(createItemDto.description && {
            description: createItemDto.description,
          }),
          ...(createItemDto.discount && {
            discount: createItemDto.discount,
          }),
          ...(createItemDto.Discount_type && {
            discount_type: createItemDto.Discount_type,
          }),
          ...(createItemDto.tax && {
            tax: createItemDto.tax,
          }),
        },
      });

      const itemOrganization =
        await this.prismaService.itemOrganization.findFirst({
          where: {
            item_id: item.id,
            organization_id: createItemDto.organization_id,
          },
        });

      if (itemOrganization) {
        throw new ConflictException('This item has already been added!');
      }

      await this.prismaService.itemOrganization.create({
        data: {
          item_id: item.id,
          organization_id: createItemDto.organization_id,
        },
      });

      return item;
    });
  }

  async findAll(organization_Id: number) {
    return this.prismaService.itemOrganization.findMany({
      where: {
        organization_id: organization_Id,
      },
      include: {
        item: true,
      },
    });
  }

  async findOne(id: number, organization_Id: number) {
    return this.getitemById(id, organization_Id);
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const itemOrganization = await this.getitemById(
      id,
      updateItemDto.organization_id,
    );

    updateItemDto.name = capitalizeFirstLetterOfEachWordInAPhrase(
      updateItemDto.name,
    );
    return this.prismaService.items.update({
      where: {
        id: itemOrganization.item_id,
      },
      data: {
        ...(updateItemDto.name && {
          name: capitalizeFirstLetterOfEachWordInAPhrase(updateItemDto.name),
        }),
        ...(updateItemDto.quantity && { quantity: updateItemDto.quantity }),
        ...(updateItemDto.Discount_type && {
          discount_type: updateItemDto.Discount_type,
        }),
        ...(updateItemDto.description && {
          description: updateItemDto.description,
        }),
        ...(updateItemDto.discount && { discount: updateItemDto.discount }),
        ...(updateItemDto.price && { price: updateItemDto.price }),
        ...(updateItemDto.tax && { tax: updateItemDto.tax }),
      },
    });
  }

  async remove(id: number, organization_id: number) {
    await this.getitemById(id, organization_id);
    return this.prismaService.items.delete({ where: { id } });
  }

  private async getitemById(id: number, organization_Id: number) {
    const item = await this.prismaService.itemOrganization.findFirst({
      where: {
        item_id: id,
        organization_id: organization_Id,
      },
      include: {
        item: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`item with id ${id} does not exist`);
    }

    return item;
  }
}
