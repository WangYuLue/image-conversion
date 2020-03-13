export enum EImageType {
  'PNG' = 'image/png',
  'JPEG' = 'image/jpeg',
  'GIF' = 'image/gif'
}

interface IBaseConfig {
  [key: string]: any;
}

export interface Image2CanvasConfig extends IBaseConfig {
  width?: number,
  height?: number,
  scale?: number,
  orientation?: number,
}

export interface ICompressConfig extends Image2CanvasConfig {
  quality?: number,
  type?: EImageType,
}

export interface compressAccuratelyConfig extends Image2CanvasConfig {
  size?: number,
  accuracy?: number,
  type?: EImageType,
}