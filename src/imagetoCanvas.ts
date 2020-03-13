import { Image2CanvasConfig } from '@models';

/**
 * 将一个image对象转变为一个canvas对象
 *
 * @param {image} image
 *
 * @typedef {Object=} config - 转变为canvas时的一些参数配置
 * 		@param {number} width - canvas图像的宽度，默认为image的宽度
 * 		@param {number} height - canvas图像的高度，默认为image的高度
 * 		@param {number} scale - 相对于image的缩放比例，范围0-10，默认不缩放；
 * 			设置config.scale后会覆盖config.width和config.height的设置；
 * 		@param {number} orientation - 图片旋转参数，默认不旋转，参考如下：
 * 			参数	 旋转方向
 * 			1		0°
 * 			2		水平翻转
 * 			3		180°
 * 			4		垂直翻转
 * 			5		顺时针90°+水平翻转
 * 			6		顺时针90°
 * 			7		顺时针90°+垂直翻转
 * 			8		逆时针90°
 * @type {config}
 *
 * @returns {Promise(canvas)}
 */
export default async function imagetoCanvas(image: HTMLImageElement, config: Image2CanvasConfig = {}): Promise<HTMLCanvasElement> {
  const myConfig = { ...config };
  const cvs = document.createElement('canvas');
  const ctx = cvs.getContext('2d');
  let height;
  let width;
  for (const i in myConfig) {
    if (Object.prototype.hasOwnProperty.call(myConfig, i)) {
      myConfig[i] = Number(myConfig[i]);
    }
  }
  // 设置宽高
  if (!myConfig.scale) {
    width = myConfig.width || myConfig.height * image.width / image.height || image.width;
    height = myConfig.height || myConfig.width * image.height / image.width || image.height;
  } else {
    // 缩放比例0-10，不在此范围则保持原来图像大小
    const scale = myConfig.scale > 0 && myConfig.scale < 10 ? myConfig.scale : 1;
    width = image.width * scale;
    height = image.height * scale;
  }
  // 当顺时针或者逆时针旋转90时，需要交换canvas的宽高
  if ([5, 6, 7, 8].some(i => i === myConfig.orientation)) {
    cvs.height = width;
    cvs.width = height;
  } else {
    cvs.height = height;
    cvs.width = width;
  }
  // 设置方向
  switch (myConfig.orientation) {
    case 3:
      ctx.rotate(180 * Math.PI / 180);
      ctx.drawImage(image, -cvs.width, -cvs.height, cvs.width, cvs.height);
      break;
    case 6:
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage(image, 0, -cvs.width, cvs.height, cvs.width);
      break;
    case 8:
      ctx.rotate(270 * Math.PI / 180);
      ctx.drawImage(image, -cvs.height, 0, cvs.height, cvs.width);
      break;
    case 2:
      ctx.translate(cvs.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
      break;
    case 4:
      ctx.translate(cvs.width, 0);
      ctx.scale(-1, 1);
      ctx.rotate(180 * Math.PI / 180);
      ctx.drawImage(image, -cvs.width, -cvs.height, cvs.width, cvs.height);
      break;
    case 5:
      ctx.translate(cvs.width, 0);
      ctx.scale(-1, 1);
      ctx.rotate(90 * Math.PI / 180);
      ctx.drawImage(image, 0, -cvs.width, cvs.height, cvs.width);
      break;
    case 7:
      ctx.translate(cvs.width, 0);
      ctx.scale(-1, 1);
      ctx.rotate(270 * Math.PI / 180);
      ctx.drawImage(image, -cvs.height, 0, cvs.height, cvs.width);
      break;
    default:
      ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
  }
  return cvs;
};