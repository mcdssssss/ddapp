import { EggAppConfig, PowerPartial } from 'egg';

export type DefaultConfig = PowerPartial<EggAppConfig>;

export default {
  keys: '_1647247784657_5669',
  egg: {
    port: 8001,
  },
  orm: {
    /**
     * 单数据库实例
     */
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'ddrunv2-free',
    synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: false,
  },
  redis: {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0,
    },
  },
  security: {
    csrf: { enable: false },
  },
  jwt: {
    privateKey: 'rn89yfdfKLa59H8di9', //秘钥
    expiresIn: '168h', // 过期时间
  },

  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 10mb
    fileSize: '200mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: ['.jpg', '.jpeg', '.png', '.webp'],
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
  },
  bodyParser: {
    enableTypes: ['json', 'form', 'text', 'xml'],
    formLimit: '1mb',
    jsonLimit: '1mb',
    textLimit: '1mb',
  },

  task: {
    redis: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
    },
    prefix: 'ddrunfree-task', // 这些任务存储的 key，都是 midway-task 开头，以便区分用户原有redis 里面的配置。
    defaultJobOptions: {
      repeat: {
        tz: 'Asia/Shanghai', // Task 等参数里面设置的比如（0 0 0 * * *）本来是为了0点执行，但是由于时区不对，所以国内用户时区设置一下。
      },
    },
  },
  bull: {
    defaultQueueOptions: {
      redis: {
        port: 6379,
        host: '127.0.0.1',
        password: '',
      },
    },
  },
} as any;
