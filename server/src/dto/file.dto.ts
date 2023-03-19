import { PickDto, Rule, RuleType } from '@midwayjs/validate';
import { SelectCommonDTO } from './common.dto';

export class FileGroupAddDTO {
  @Rule(RuleType.string().max(45).required())
  groupName: string;

  @Rule(RuleType.string().max(10).required())
  groupType: 'file' | 'richtext';
}

export class FileGroupUpdateDTO extends FileGroupAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class FileGroupDelDTO extends PickDto(FileGroupUpdateDTO, ['id']) {}

export class FileAddDTO {
  @Rule(RuleType.string().max(45).required())
  fileName: string;

  @Rule(RuleType.number().required())
  fileSize: number;

  @Rule(RuleType.string().max(200).required())
  fileLink: string;

  @Rule(RuleType.string().max(20).required())
  suffix: string;

  @Rule(RuleType.number().empty(''))
  groupId?: number;
}

export class FileUpdateDTO extends FileAddDTO {
  @Rule(RuleType.number().required())
  id: number;
}

export class FileDelDTO {
  @Rule(RuleType.string().required())
  ids: string;
}

export class FileListDTO extends SelectCommonDTO {
  @Rule(RuleType.number().empty(''))
  groupId?: number;
}

export class FileMoveToGroupDTO extends FileDelDTO {
  @Rule(RuleType.number().required())
  groupId: number;
}
