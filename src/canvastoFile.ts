import { EImageType } from '@models';

/**
 * 将一个canvas对象转变为一个File（Blob）对象
 * 该方法可以做压缩处理
 *
 * @param {canvas} canvas
 * @param {number=} quality - 传入范围 0-1，表示图片压缩质量，默认0.92
 * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif",默认"image/jpeg"
 * @returns {Promise(Blob)}
 */
export default function canvastoFile(canvas: HTMLCanvasElement, quality: number = 0.92, type: EImageType = EImageType.JPEG): Promise<Blob> {
  return new Promise(resolve => canvas.toBlob(blob => resolve(blob), type, quality));
};
