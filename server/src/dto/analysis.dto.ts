import { Rule, RuleType } from '@midwayjs/validate';

export class AnalysisDateDTO {
  @Rule(RuleType.string().required())
  begin_date: string;
  @Rule(RuleType.string().required())
  end_date: string;
}

export class AnalysisDayDTO {
  @Rule(RuleType.string().required())
  beginDate: string;
  @Rule(RuleType.string().required())
  endDate: string;
}
