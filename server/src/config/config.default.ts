import { MidwayConfig, MidwayAppInfo } from '@midwayjs/core';

export default (appInfo: MidwayAppInfo) => {
  return {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + '_1647247784657_5669',
    upload: {
      // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
      mode: 'file',
      // fileSize: string, 最大上传文件大小，默认为 10mb
      fileSize: '200mb',
      // whitelist: string[]，文件扩展名白名单
      whitelist: [
        '.jpg',
        '.jpeg',
        '.png',
        '.webp',
        '.doc',
        '.xls',
        '.ppt',
        '.pdf',
        '.docx',
        '.xlsx',
        '.pptx',
      ],
      // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
      cleanTimeout: 5 * 60 * 1000,
    },
    bodyParser: {
      enableTypes: ['json', 'form', 'text', 'xml'],
      formLimit: '1mb',
      jsonLimit: '1mb',
      textLimit: '1mb',
      xmlLimit: '1mb',
    },
    security: {
      csrf: {
        headerName: 'x-csrf-token',
        ignore: '/api',
      },
    },
  } as MidwayConfig;
};
