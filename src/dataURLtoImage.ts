/**
 * 将dataURL字符串转变为image对象
 *
 * @param {srting} dataURL - dataURL字符串
 * @returns {Promise(Image)}
 */
export default function dataURLtoImage(dataURL: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('dataURLtoImage(): dataURL is illegal'));
    img.src = dataURL;
  });
};