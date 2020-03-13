import { EImageType } from '@models';
import { checkImageType } from '@utils';

/**
 * 将一个dataURL字符串转变为一个File（Blob）对象
 * 转变时可以确定File对象的类型
 *
 * @param {string} dataURL
 * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
 * @returns {Promise(Blob)}
 */
export default async function dataURLtoFile(dataURL: string, type: EImageType): Promise<Blob> {
  const arr = dataURL.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  if (checkImageType(type)) {
    mime = type;
  }
  return new Blob([u8arr], {
    type: mime,
  });
};