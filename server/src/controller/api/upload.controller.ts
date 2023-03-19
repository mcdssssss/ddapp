import { Controller, File, Inject, Post } from '@midwayjs/decorator';
import { BaseController } from '../base.controller';
import { OSSService } from '../../service/ali/oss.service';
@Controller('/api/upload')
export class AppUploadController extends BaseController {
  @Inject()
  uploadService: OSSService;

  @Post('/put')
  async upload(@File('file') file: File) {
    const result = await this.uploadService.put(
      file as any,
      this.ctx.headers['x-perfix'] as string
    );
    return this.responseSuccess('ok', result);
  }
}
