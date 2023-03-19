import { Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { ServiceData, ServiceObject } from '../entity/school.entity';
import {
  DiscountDetails,
  ErrandsPriceDetail,
  SchoolAddress,
  SchoolOrdersEntity,
} from '../entity/schoolOrders.entity';
import { DefaultError } from '../error/default.error';
import { BaseService } from './base.service';
import { MapService } from './map.service';
import { SchoolService } from './school.service';
import {
  ErrandsServicePublishDetail,
  PlayServicePublishDetail,
  PublishDTO,
  SoftwareServicePublishDetail,
} from '../dto/publish.dto';
import { TakerService } from './taker.service';
import { UserService } from './user.service';

@Provide()
export class PublishService extends BaseService {
  @InjectEntityModel(SchoolOrdersEntity)
  schoolOrderEntity: Repository<SchoolOrdersEntity>;

  @Inject()
  schoolService: SchoolService;

  @Inject()
  mapService: MapService;

  @Inject()
  takerService: TakerService;

  @Inject()
  userService: UserService;

  async calculate(dto: PublishDTO) {
    const school = await this.schoolService.getSchoolInfo();
    if (!school.serviceData) {
      throw new DefaultError('请先配置学校');
    }
    const service = this.findService(dto.serviceNanoid, school.serviceData);
    const params = {
      fee: dto.fee || 0,
      orderType: service.type,
      priceDetails: {} as ErrandsPriceDetail,
      totalPrice: dto.fee || 0,
      // 优惠详情
      discountDetails: [] as DiscountDetails[],
      totalDiscount: 0,
      startAddress: dto.startAddress as SchoolAddress,
      endAddress: dto.endAddress,
      remarks: dto.remarks,
      intoHall: !!service.intoHall,
    };

    let calculateData = { totalPrice: 0 } as { totalPrice: number } & any;
    if (service.type === 'errands') {
      calculateData = await this.errands(
        service,
        dto.serviceDetails as ErrandsServicePublishDetail
      );
    }
    if (service.type === 'play') {
      calculateData = await this.play(
        dto.serviceDetails as PlayServicePublishDetail
      );
    } else if (service.type === 'software') {
      calculateData = await this.software(
        dto.serviceDetails as SoftwareServicePublishDetail
      );
    } else if (service.type === 'express') {
      calculateData = await this.express(dto.serviceDetails);
    }
    params.priceDetails = calculateData;
    params.priceDetails.service = service;
    params.totalPrice += calculateData.totalPrice;

    return params;
  }

  /**
   * 快递代取
   * @param param0
   * @returns
   */
  async express({ expressObj, desc }: any) {
    const priceDetails = {
      expressObj,
      desc,
      subTitle: '快递代取',
      totalPrice: expressObj.price,
    };
    return priceDetails;
  }

  /**
   * 陪玩计算
   */
  async play({
    playStyle,
    playValue,
    desc,
    rewardAmount,
  }: PlayServicePublishDetail) {
    const priceDetails = {
      playStyle,
      playValue,
      subTitle: '陪玩陪练',
      desc: `${desc} `,
      totalPrice: rewardAmount,
    };
    switch (playStyle) {
      case 'matchUp':
        priceDetails.desc += `-打${playValue}局`;
        break;
      case 'time':
        priceDetails.desc += `-打${playValue}个小时`;
        break;
      case 'task':
        priceDetails.desc += `-做${playValue}个任务`;
    }
    return priceDetails;
  }

  /**
   * 计算跑腿
   */
  async errands(
    serviceContent: ServiceData,
    { weight, desc, image, images }: ErrandsServicePublishDetail
  ) {
    const priceDetails = {
      weight,
      weightPriceTotal: 0,
      image,
      images,
      weightPrice: [] as number[],
      // 重量超出部分
      weightExcessPart: [] as number[],
      // 重量超出部分价格
      weightExcessPartPrice: [] as number[],
      weightDetail: [] as string[],

      totalPrice: 0,
      subTitle: '跑腿服务',
      desc: `「${serviceContent.label}」${desc}`,
    };

    // 重量计算
    for (const item of serviceContent.weightRules) {
      if (weight > item.gt) {
        if (item.unit === 0) {
          priceDetails.weightPrice.push(item.price);
          priceDetails.weightPriceTotal += item.price;
          priceDetails.totalPrice += item.price;
          priceDetails.weightExcessPart.push(
            this.filterNumber(
              weight <= item.lte ? weight - item.gt : item.lte - weight
            )
          );
          priceDetails.weightDetail.push(
            `重量在${item.gt}~${item.lte}kg范围内，加价${item.price}元`
          );
        } else {
          let weightExcessPart = 0;
          if (weight <= item.lte) {
            weightExcessPart = this.filterNumber(weight - item.gt);
          } else {
            weightExcessPart = this.filterNumber(item.lte - item.gt);
          }
          priceDetails.weightExcessPart.push(weightExcessPart);
          const weightExcessPartPrice = this.filterNumber(
            (Math.ceil(weightExcessPart) / item.unit) * item.price
          );
          priceDetails.weightPriceTotal += weightExcessPartPrice;
          priceDetails.totalPrice += weightExcessPartPrice;
          priceDetails.weightExcessPartPrice.push(weightExcessPartPrice);
          priceDetails.weightDetail.push(
            `重量在${item.gt}~${item.lte}kg范围内且超出最小值${weightExcessPart}kg，每超出${item.unit}kg加价${item.price}元,共计加价${weightExcessPartPrice}元`
          );
        }
      }
    }

    priceDetails.totalPrice = this.filterNumber(priceDetails.totalPrice);
    return priceDetails;
  }

  /**
   * 软件安装
   */
  async software({ desc, rewardAmount }: SoftwareServicePublishDetail) {
    const priceDetails = {
      subTitle: '软件安装',
      desc,
      totalPrice: rewardAmount,
    };
    return priceDetails;
  }

  /**
   * 查询servcie
   * @param serviceNanoid
   * @param services
   * @returns
   */
  findService(serviceNanoid: string, services: ServiceObject): ServiceData {
    let service: ServiceData;
    for (const item of services.services) {
      if (item.nanoid === serviceNanoid) {
        service = item;
        break;
      }
    }
    return service;
  }

  /**
   * 查询servcie
   * @param type
   * @param services
   * @returns
   */
  findServiceByType(type: string, services: ServiceData[]): ServiceData {
    let service: ServiceData;
    for (const item of services) {
      if (item.type === type) {
        service = item;
        break;
      }
    }
    return service;
  }
}
