import { PickDto, Rule, RuleType } from '@midwayjs/validate';

export class WxSubscribeAddTemplateDTO {
  @Rule(RuleType.string().required())
  tid: string;

  @Rule(RuleType.array().required())
  kidList: number[];

  @Rule(RuleType.string())
  sceneDesc?: string;
}

export class WxSubscribeDelTemplateDTO {
  @Rule(RuleType.string().required())
  priTmplId: string;
}

export class WxSubscribeTmpKeyDTO extends PickDto(WxSubscribeAddTemplateDTO, [
  'tid',
]) {}

export class WxGetpubtemplatetitlesDTO {
  @Rule(RuleType.string().required())
  ids: string;
  @Rule(RuleType.number().required())
  start: number;
  @Rule(RuleType.number().required())
  limit: number;
}

export class WxSubscribeSendDTO {
  @Rule(RuleType.string().required())
  touser: string;
  @Rule(RuleType.string().required())
  template_id: string;
  @Rule(RuleType.string())
  page?: string;
  @Rule(RuleType.object().required())
  data: any;
  @Rule(RuleType.string())
  miniprogram_state?: string;
  @Rule(RuleType.string())
  lang?: string;
}
