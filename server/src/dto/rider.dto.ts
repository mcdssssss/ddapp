import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class RiderRegisterDTO {
  @Rule(RuleType.string().required())
  realname: string;
  @Rule(RuleType.string().length(18).required())
  idCardNo: string;
  @Rule(RuleType.string().required())
  avatarFaceImage: string;
  @Rule(RuleType.string().required())
  nationalFaceImage: string;
  @Rule(RuleType.string().required())
  cityNo: string;
}

export class SimulationRiderAddDTO extends RiderRegisterDTO {
  @Rule(RuleType.string().required())
  userNo: string;

  @Rule(RuleType.number().required())
  status: 0 | 1 | 2;
}

export class RiderPassDTO extends PickDto(SimulationRiderAddDTO, ['userNo']) {}

export class RiderRefuseDTO extends RiderPassDTO {
  @Rule(RuleType.string().required())
  refuseReason: string;
}

export class RiderRegisterListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  userNo?: string;

  @Rule(RuleType.number())
  status?: 0 | 1 | 2;
}

export class RiderListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  mobileNumber?: string;
  @Rule(RuleType.string())
  idCardNo?: string;
  @Rule(RuleType.string())
  realname?: string;
  @Rule(RuleType.string())
  riderNo?: string;
}

export class RiderReceiveDTO {
  @Rule(RuleType.boolean().required())
  startReceive: boolean;

  @Rule(RuleType.string().required())
  riderNo: string;
}

export class RiderUpdateDTO {
  @Rule(RuleType.boolean())
  startReceive?: boolean;

  @Rule(RuleType.string())
  cityNo?: string;
}

export class RiderOptOrderDTO {
  @Rule(RuleType.string())
  orderNo: string;
}
export class RiderOptOrderCancelDTO extends RiderOptOrderDTO {
  @Rule(RuleType.string())
  cancelReason?: string;
}
