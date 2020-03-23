import { EImageType } from '@models';
import { checkImageType } from '@utils';

/**
 * 将一个Canvas对象转变为一个dataURL字符串
 * 该方法可以做压缩处理
 *
 * @param {canvas} canvas
 * @param {number=} quality - 传入范围 0-1，表示图片压缩质量，默认0.92
 * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif",默认"image/jpeg"
 * @returns {Promise(string)} Promise含有一个dataURL字符串参数
 */
export default async function canvastoDataURL(canvas: HTMLCanvasElement, quality: number = 0.92, type: EImageType = EImageType.JPEG): Promise<string> {
  if (!checkImageType(type)) {
    type = EImageType.JPEG;
  }
  return canvas.toDataURL(type, quality);
};