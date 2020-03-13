/**
 * 通过一个图片的url加载所需要的File（Blob）对象
 *
 * @param {string} url - 图片URL
 * @returns {Promise(Blob)}
 *
 */
export default function urltoBlob(url: string): Promise<Blob> {
  return fetch(url).then(response => response.blob());
};