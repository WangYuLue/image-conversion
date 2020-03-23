import canvastoDataURL from './canvastoDataURL';
import canvastoFile from './canvastoFile';
import dataURLtoFile from './dataURLtoFile';
import dataURLtoImage from './dataURLtoImage';
import downloadFile from './downloadFile';
import filetoDataURL from './filetoDataURL';
import imagetoCanvas from './imagetoCanvas';
import urltoBlob from './urltoBlob';
import urltoImage from './urltoImage';
import { checkImageType } from '@utils';
import { EImageType, ICompressConfig, compressAccuratelyConfig } from '@models';

/**
 * 压缩File（Blob）对象
 * @param {Blob} file - 一个File（Blob）对象
 * @param {(number|object)} config - 如果传入是number类型，传入范围 0-1，表示图片压缩质量,默认0.92；也可以传入object类型，以便更详细的配置
 * @example
 * 		imageConversion.compress(file,0.8)
 *
 * 		imageConversion.compress(file,{
 * 			quality: 0.8, //图片压缩质量
 * 			type："image/png", //转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
 * 			width: 300, //生成图片的宽度
 * 			height：200， //生产图片的高度
 * 			scale: 0.5， //相对于原始图片的缩放比率,设置config.scale后会覆盖config.width和config.height的设置；
 * 			orientation:2, //图片旋转方向
 * 		})
 *
 * @returns {Promise(Blob)}
 */
async function compress(file: File, config: ICompressConfig = {}): Promise<Blob> {
  if (!(file instanceof Blob)) {
    throw new Error('compress(): First arg must be a Blob object or a File object.');
  }
  if (typeof config !== 'object') {
    config = Object.assign({
      quality: config,
    });
  }
  config.quality = Number(config.quality);
  if (Number.isNaN(config.quality)) {
    return file;
  }
  const dataURL = await filetoDataURL(file);
  let originalMime = dataURL.split(',')[0].match(/:(.*?);/)[1] as EImageType; // 原始图像图片类型
  let mime = EImageType.JPEG; // 默认压缩类型
  if (checkImageType(config.type)) {
    mime = config.type;
    originalMime = config.type;
  }
  const image = await dataURLtoImage(dataURL);
  const canvas = await imagetoCanvas(image, Object.assign({}, config));
  const compressDataURL = await canvastoDataURL(canvas, config.quality, mime);
  const compressFile = await dataURLtoFile(compressDataURL, originalMime);
  if (compressFile.size > file.size) {
    return file;
  }
  return compressFile;
};

/**
 * 根据体积压缩File（Blob）对象
 *
 * @param {Blob} file - 一个File（Blob）对象
 * @param {(number|object)} config - 如果传入是number类型，则指定压缩图片的体积,单位Kb;也可以传入object类型，以便更详细的配置
 * 		@param {number} size - 指定压缩图片的体积,单位Kb
 * 		@param {number} accuracy - 相对于指定压缩体积的精确度，范围0.8-0.99，默认0.95；
 *        如果设置 图片体积1000Kb,精确度0.9，则压缩结果为900Kb-1100Kb的图片都算合格；
 * @example
 *  	imageConversion.compress(file,100) //压缩后图片大小为100kb
 *
 * 		imageConversion.compress(file,{
 * 			size: 100, //图片压缩体积，单位Kb
 * 			accuracy: 0.9, //图片压缩体积的精确度，默认0.95
 * 			type："image/png", //转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
 * 			width: 300, //生成图片的宽度
 * 			height: 200, //生产图片的高度
 * 			scale: 0.5, //相对于原始图片的缩放比率,设置config.scale后会覆盖config.width和config.height的设置；
 * 			orientation:2, //图片旋转方向
 * 		})
 *
 * @returns {Promise(Blob)}
 */
async function compressAccurately(file: Blob, config: compressAccuratelyConfig = {}): Promise<Blob> {
  if (!(file instanceof Blob)) {
    throw new Error('compressAccurately(): First arg must be a Blob object or a File object.');
  }
  if (typeof config !== 'object') {
    config = Object.assign({
      size: config,
    });
  }
  // 如果指定体积不是数字或者数字字符串，则不做处理
  config.size = Number(config.size);
  if (Number.isNaN(config.size)) {
    return file;
  }
  // 如果指定体积大于原文件体积，则不做处理；
  if (config.size * 1024 > file.size) {
    return file;
  }
  config.accuracy = Number(config.accuracy);
  if (!config.accuracy
    || config.accuracy < 0.8
    || config.accuracy > 0.99) {
    config.accuracy = 0.95; // 默认精度0.95
  }
  const resultSize = {
    max: config.size * (2 - config.accuracy) * 1024,
    accurate: config.size * 1024,
    min: config.size * config.accuracy * 1024,
  };
  const dataURL = await filetoDataURL(file);
  let originalMime = dataURL.split(',')[0].match(/:(.*?);/)[1] as EImageType; // 原始图像图片类型
  let mime = EImageType.JPEG;
  if (checkImageType(config.type)) {
    mime = config.type;
    originalMime = config.type;
  }
  const image = await dataURLtoImage(dataURL);
  const canvas = await imagetoCanvas(image, Object.assign({}, config));
  /**
   * 经过测试发现，blob.size与dataURL.length的比值约等于0.75
   * 这个比值可以同过dataURLtoFile这个方法来测试验证
   * 这里为了提高性能，直接通过这个比值来计算出blob.size
   */
  const proportion = 0.75;
  let imageQuality = 0.5;
  let compressDataURL;
  const tempDataURLs: string[] = [null, null];
  /**
   * HTMLCanvasElement.toBlob()以及HTMLCanvasElement.toDataURL()压缩参数
   * 的最小细粒度为0.01，而2的7次方为128，即只要循环7次，则会覆盖所有可能性
   */
  for (let x = 1; x <= 7; x++) {
    compressDataURL = await canvastoDataURL(canvas, imageQuality, mime);
    const CalculationSize = compressDataURL.length * proportion;
    // 如果到循环第七次还没有达到精确度的值，那说明该图片不能达到到此精确度要求
    // 这时候最后一次循环出来的dataURL可能不是最精确的，需要取其周边两个dataURL三者比较来选出最精确的；
    if (x === 7) {
      if (resultSize.max < CalculationSize || resultSize.min > CalculationSize) {
        compressDataURL = [compressDataURL, ...tempDataURLs]
          .filter(i => i) // 去除null
          .sort((a, b) => Math.abs(a.length * proportion - resultSize.accurate)
            - Math.abs(b.length * proportion - resultSize.accurate))[0];
      }
      break;
    }
    if (resultSize.max < CalculationSize) {
      tempDataURLs[1] = compressDataURL;
      imageQuality -= 0.5 ** (x + 1);
    } else if (resultSize.min > CalculationSize) {
      tempDataURLs[0] = compressDataURL;
      imageQuality += 0.5 ** (x + 1);
    } else {
      break;
    }
  }
  const compressFile = await dataURLtoFile(compressDataURL, originalMime);
  // 如果压缩后体积大于原文件体积，则返回源文件；
  if (compressFile.size > file.size) {
    return file;
  }
  return compressFile;
};

export {
  canvastoDataURL,
  canvastoFile,
  dataURLtoFile,
  dataURLtoImage,
  downloadFile,
  filetoDataURL,
  imagetoCanvas,
  urltoBlob,
  urltoImage,
  compress,
  compressAccurately
};

export {
  EImageType
};