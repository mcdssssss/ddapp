import { PickDto, Rule, RuleType } from '@midwayjs/validate';

export class OrderReceiveDTO {
  @Rule(RuleType.string().required())
  orderNo: string;
  @Rule(RuleType.string().required())
  riderNo: string;
}

export class OrderDeliverDTO extends PickDto(OrderReceiveDTO, ['orderNo']) {}

export class OrderCancelDTO extends PickDto(OrderReceiveDTO, ['orderNo']) {
  @Rule(RuleType.string())
  cancelReason?: string;
}
