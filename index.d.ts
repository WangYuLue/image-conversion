export = ImageConversion;
export as namespace ImageConversion;

declare namespace ImageConversion {
  const canvastoDataURL: (canvas: HTMLCanvasElement, quality: number, type: EImageType) => Promise<string>;
  const canvastoFile: (canvas: HTMLCanvasElement, quality: number, type: EImageType) => Promise<Blob>;
  const dataURLtoFile: (dataURL: string, type: EImageType) => Promise<Blob>;
  const dataURLtoImage: (dataURL: string) => Promise<HTMLImageElement>;
  const downloadFile: (file: File, fileName: string) => void;
  const filetoDataURL: (file: Blob) => Promise<string>;
  const imagetoCanvas: (image: HTMLImageElement, config: Image2CanvasConfig) => Promise<HTMLCanvasElement>;
  const urltoBlob: (url: string) => Promise<Blob>;
  const urltoImage: (url: string) => Promise<HTMLImageElement>;
  const compress: (file: File, config: ICompressConfig) => Promise<Blob>;
  const compressAccurately: (file: Blob, config: compressAccuratelyConfig) => Promise<Blob>;
}

declare enum EImageType {
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
