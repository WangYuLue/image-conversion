export const canvastoDataURL: (canvas: HTMLCanvasElement, quality?: number, type?: EImageType) => Promise<string>;
export const canvastoFile: (canvas: HTMLCanvasElement, quality?: number, type?: EImageType) => Promise<Blob>;
export const dataURLtoFile: (dataURL: string, type?: EImageType) => Promise<Blob>;
export const dataURLtoImage: (dataURL: string) => Promise<HTMLImageElement>;
export const downloadFile: (file: Blob, fileName: string) => void;
export const filetoDataURL: (file: Blob) => Promise<string>;
export const imagetoCanvas: (image: HTMLImageElement, config?: Image2CanvasConfig) => Promise<HTMLCanvasElement>;
export const urltoBlob: (url: string) => Promise<Blob>;
export const urltoImage: (url: string) => Promise<HTMLImageElement>;
export const compress: (file: Blob, config?: ICompressConfig | number) => Promise<Blob>;
export const compressAccurately: (file: Blob, config?: compressAccuratelyConfig | number) => Promise<Blob>;
export enum EImageType {
  'PNG' = 'image/png',
  'JPEG' = 'image/jpeg',
  'GIF' = 'image/gif'
}

interface IBaseConfig {
  [key: string]: any;
}

interface Image2CanvasConfig extends IBaseConfig {
  width?: number,
  height?: number,
  scale?: number,
  orientation?: number,
}

interface ICompressConfig extends Image2CanvasConfig {
  quality?: number,
  type?: EImageType,
}

interface compressAccuratelyConfig extends Image2CanvasConfig {
  size?: number,
  accuracy?: number,
  type?: EImageType,
}
