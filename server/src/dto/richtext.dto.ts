import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class RichtextAddDTO {
  @Rule(RuleType.string().max(50).required())
  richTitle: string;

  @Rule(RuleType.string().max(200).required())
  richImage: string;

  @Rule(RuleType.string().required())
  richContent: string;

  @Rule(RuleType.number().empty(''))
  groupId?: number;
}

export class RichtextUpdateDTO extends RichtextAddDTO {
  @Rule(RuleType.string().length(16).required())
  richNo: string;
}
export class RichtextDelDTO {
  @Rule(RuleType.string().required())
  ids: string;
}
export class RichtextInfoDTO extends PickDto(RichtextUpdateDTO, ['richNo']) {}

export class RichtextListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  richTitle?: string;

  @Rule(RuleType.number().empty(''))
  groupId?: number;
}
