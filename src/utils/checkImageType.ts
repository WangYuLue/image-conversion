import { EImageType } from '@models';
export default function checkImageType(type: EImageType) {
  return ['image/png', 'image/jpeg', 'image/gif'].some(i => i === type);
}