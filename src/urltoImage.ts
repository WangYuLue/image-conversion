/**
 * 通过一个图片的url加载所需要的image对象
 *
 * @param {string} url - 图片URL
 * @returns {Promise(Image)}
 */
export default function urltoImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('urltoImage(): Image failed to load, please check the image URL'));
    img.src = url;
  });
};