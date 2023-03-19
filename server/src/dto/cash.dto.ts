import { Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class CashRegisterDTO {
  @Rule(RuleType.number())
  amount: number;

  @Rule(RuleType.string())
  bankNo: string;
}

export class CashListDTO extends SelectCommonDTO {
  @Rule(RuleType.string())
  cashBy?: 'rider' | 'user' | 'agent';

  @Rule(RuleType.string())
  cashNo?: string;

  @Rule(RuleType.number())
  status?: number;

  @Rule(RuleType.string())
  bankName?: string;

  @Rule(RuleType.string())
  cardNo?: string;

  @Rule(RuleType.string())
  realname?: string;
}

export class CashSuccessDTO {
  @Rule(RuleType.string().required())
  cashNo: string;
}

export class CashFailDTO extends CashSuccessDTO {
  @Rule(RuleType.string().required())
  reason: string;
}

export class CashAlipayExportExcelDTO {
  @Rule(RuleType.number().required())
  count: number;
}
