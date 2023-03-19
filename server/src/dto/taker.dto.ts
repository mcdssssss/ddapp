import { Rule, RuleType } from '@midwayjs/validate';
import { CardImage } from '../entity/taker.entity';
import { SelectCommonDTO } from './common.dto';

export class TakerAddDTO {
  @Rule(RuleType.string().max(45).required())
  realName: string;

  @Rule(RuleType.string().max(18).required())
  idCard: string;

  @Rule(RuleType.object().required())
  cardImages: CardImage;
}

export class AdminTakerAddDTO extends TakerAddDTO {
  @Rule(RuleType.string().length(16).required())
  userNo: string;
}

export class AdminTakerListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  realName?: string;

  @Rule(RuleType.string().empty(''))
  idCard?: string;

  @Rule(RuleType.string().empty(''))
  userNo?: string;

  @Rule(RuleType.string().empty(''))
  takerNo?: string;

  @Rule(RuleType.number())
  status?: 0 | -1 | 1;
}

export class AgentTakerListDTO extends AdminTakerListDTO {
  @Rule(RuleType.string().required())
  schoolType: 'school' | 'community';
}

export class AdminTakerPassDTO {
  @Rule(RuleType.string().required())
  takerNo: string;
}

export class AdminTakerRefuseDTO extends AdminTakerPassDTO {
  @Rule(RuleType.string().required())
  refuseMsg: string;
}
