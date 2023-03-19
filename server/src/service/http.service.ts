import { Provide } from '@midwayjs/decorator';
import axios from 'axios';
const queryString = require('query-string');
import request = require('request');
import { createWriteStream } from 'fs';
import { join } from 'path';

const axios_instance = axios.create({
  baseURL: '',
  timeout: 120000,
});

axios_instance.interceptors.response.use(
  result => {
    const { data } = result;
    return data;
  },
  error => {
    console.error('加载失败');
    return Promise.reject(error);
  }
);

@Provide()
export class HttpService {
  async get(url: string, params: any, headers?: any) {
    const params_str = queryString.stringify(params);
    let fullUrl = url;
    if (params_str) {
      if (url.indexOf('?') > -1) {
        fullUrl += '&' + params_str;
      } else {
        fullUrl += '?' + params_str;
      }
    }
    return axios_instance.get(fullUrl, { headers });
  }

  async del(url: string, params: any) {
    return axios_instance.delete(url, {
      data: params,
    });
  }

  async post(url: string, params: any, headers?: any) {
    return axios_instance.post(url, params, { headers });
  }

  async forcePost(url: string, params: any) {
    return axios.post(url, params);
  }

  async request(options) {
    return new Promise((resolve: any) => {
      request(options, (err, res, body) => {
        if (err) {
          console.error(err);
        }
        if (res.statusCode === 200) {
          resolve(body);
        } else {
          console.log(res.statusCode);
        }
      });
    });
  }

  async pipe(url: string, dirPath: string, fileName: string) {
    return new Promise(resolve => {
      const stream = createWriteStream(join(dirPath, fileName));
      request(url)
        .pipe(stream)
        .on('close', (err: Error) => {
          if (err) {
            resolve(false);
            console.error(err.message);
          }
          console.log('文件[' + fileName + ']下载完毕');
          resolve(true);
        });
    });
  }
}
