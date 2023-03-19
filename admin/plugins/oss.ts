import Vue from 'vue';
import OSS from 'ali-oss';
import api from './api';
export const putFile = async (name: string, file: any) => {
  const credentialsResult = (await api.userSTS()) as any;
  if (credentialsResult.code !== 200) {
    return false;
  }
  const credentials = credentialsResult.data;
  const client = new OSS({
    // yourRegion填写Bucket所在地域。以华东1（杭州）为例，yourRegion填写为oss-cn-hangzhou。
    region: credentials.oss.region,
    // 从STS服务获取的临时访问密钥（AccessKey ID和AccessKey Secret）。
    accessKeyId: credentials.AccessKeyId,
    accessKeySecret: credentials.AccessKeySecret,
    // 从STS服务获取的安全令牌（SecurityToken）。
    stsToken: credentials.SecurityToken,
    // 填写Bucket名称。
    bucket: credentials.oss.bucket,
    secure: true
  });

  try {
    const result = await client.put(name, file);
    return result.url;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Vue.prototype.$message.error(`上传有误`);
    return false;
  }
};

/**
 * base64 转文件
 * @param base64Data
 */
export const convertBase64UrlToBlob = (urlData: string) => {
  // 去掉url的头，并转换为byte
  const bytes = window.atob(urlData.split(',')[1]);
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  return new Blob([ab], {
    type: 'image/jpeg'
  });
};

// 居中裁剪
export const imageCenterCrop = (url: string, width: number, height: number, quality = 90) => {
  if (!url) {
    return url;
  }
  return `${url}?x-oss-process=image/auto-orient,1/resize,m_fill,w_${width}${
    height ? ',h_' + height : ''
  }/quality,q_${quality}`;
};
