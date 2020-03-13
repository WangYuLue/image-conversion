/**
 * 将图片下载到本地
 *
 * @param {Blob} file - 一个File（Blob）对象
 * @param {string=} fileName - 下载后的文件名（可选参数，不传以时间戳命名文件）
 */
export default function downloadFile(file: File, fileName: string): void {
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(file);
  link.download = fileName || Date.now().toString(36);
  document.body.appendChild(link);
  const evt = document.createEvent('MouseEvents');
  evt.initEvent('click', false, false);
  link.dispatchEvent(evt);
  document.body.removeChild(link);
};
