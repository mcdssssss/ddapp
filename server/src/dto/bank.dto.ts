import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class BankAddDTO {
  @Rule(RuleType.string())
  cardNo: string;

  @Rule(RuleType.string())
  realname: string;

  @Rule(RuleType.string())
  bankName: string;
}

export class BankUpdateDTO extends BankAddDTO {
  @Rule(RuleType.string())
  bankNo: string;
}

export class BankDelDTO extends PickDto(BankUpdateDTO, ['bankNo']) {}
export class BankListDTO extends SelectCommonDTO {
  @Rule(RuleType.string().empty(''))
  bankNo?: string;

  @Rule(RuleType.string().empty(''))
  realname?: string;

  @Rule(RuleType.string().empty(''))
  cardNo?: string;

  @Rule(RuleType.string().empty(''))
  bankName?: string;
}
