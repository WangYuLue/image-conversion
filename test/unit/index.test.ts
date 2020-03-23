import {
  canvastoDataURL,
  canvastoFile,
  dataURLtoFile,
  dataURLtoImage,
  filetoDataURL,
  imagetoCanvas,
  urltoBlob,
  urltoImage,
  compress,
  compressAccurately,
  EImageType
} from '../../index';
import { expect } from 'chai';

const isImage = (image: HTMLImageElement) => image.tagName === 'IMG';
const isCanvas = (canvas: HTMLCanvasElement) => canvas.tagName === 'CANVAS';
const isDataURL = (string: string) => string.startsWith('data:');
const isFile = (file: Blob) => file.size > 0;
const compressAccuratelySuccess = (file: Blob, size: number) => Math.abs(file.size / size - 1) < 0.05;

describe('canvastoDataURL', function () {
  let canvas: HTMLCanvasElement;
  beforeEach(function () {
    canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
  });
  it('canvas -> dataURL ', async () => {
    const dataURL = await canvastoDataURL(canvas);
    expect(isDataURL(dataURL)).to.be.equal(true);
  });
  it('conversion to PNG', async () => {
    const dataURL = await canvastoDataURL(canvas, 1, EImageType.PNG);
    expect(dataURL.startsWith(`data:${EImageType.PNG}`)).to.be.equal(true);
  });
  it('conversion to JPEG', async () => {
    const dataURL = await canvastoDataURL(canvas, 1, EImageType.JPEG);
    expect(dataURL.startsWith(`data:${EImageType.JPEG}`)).to.be.equal(true);
  });
  it('conversion to GIF', async () => {
    // Warning: can't compress PNG picture
    const dataURL = await canvastoDataURL(canvas, 1, EImageType.GIF);
    expect(dataURL.startsWith(`data:${EImageType.PNG}`)).to.be.equal(true);
  });
  it('compress JPEG quality', async () => {
    const dataURL1 = await canvastoDataURL(canvas, 1, EImageType.JPEG);
    const dataURL2 = await canvastoDataURL(canvas, 0.8, EImageType.JPEG);
    expect(dataURL1.length > dataURL2.length).to.be.equal(true);
  });
  it('compress PNG quality', async () => {
    // Warning: can't compress PNG picture
    const dataURL1 = await canvastoDataURL(canvas, 1, EImageType.PNG);
    const dataURL2 = await canvastoDataURL(canvas, 0.8, EImageType.PNG);
    expect(dataURL1.length === dataURL2.length).to.be.equal(true);
  });
  it('compress GIF quality', async () => {
    // Warning: can't compress GIF picture
    const dataURL1 = await canvastoDataURL(canvas, 1, EImageType.GIF);
    const dataURL2 = await canvastoDataURL(canvas, 0.8, EImageType.GIF);
    expect(dataURL1.length === dataURL2.length).to.be.equal(true);
  });
});

describe('canvastoFile', function () {
  let canvas: HTMLCanvasElement;
  beforeEach(function () {
    canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
  });
  it('canvas -> file ', async () => {
    const file = await canvastoFile(canvas);
    expect(file.size > 1).to.be.equal(true);
  });
  it('conversion to PNG', async () => {
    const file = await canvastoFile(canvas, 1, EImageType.PNG);
    expect(file.type).to.be.equal(EImageType.PNG);
  });
  it('conversion to JPEG', async () => {
    const file = await canvastoFile(canvas, 1, EImageType.JPEG);
    expect(file.type).to.be.equal(EImageType.JPEG);
  });
  it('conversion to GIF', async () => {
    // Warning: set gif but file type is png
    const file = await canvastoFile(canvas, 1, EImageType.GIF);
    expect(file.type).to.be.equal(EImageType.PNG);
  });
  it('compress JPEG quality', async () => {
    const file1 = await canvastoFile(canvas, 1, EImageType.JPEG);
    const file2 = await canvastoFile(canvas, 0.8, EImageType.JPEG);
    expect(file1.size > file2.size).to.be.equal(true);
  });
  it('compress PNG quality', async () => {
    // Warning: can't compress PNG picture
    const file1 = await canvastoFile(canvas, 1, EImageType.PNG);
    const file2 = await canvastoFile(canvas, 0.1, EImageType.PNG);
    expect(file1.size === file2.size).to.be.equal(true);
  });
  it('compress GIF quality', async () => {
    // Warning: can't compress GIF picture
    const file1 = await canvastoFile(canvas, 1, EImageType.PNG);
    const file2 = await canvastoFile(canvas, 0.8, EImageType.PNG);
    expect(file1.size === file2.size).to.be.equal(true);
  });
});

describe('dataURLtoFile', function () {
  let dataURL: string;
  beforeEach(function () {
    dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANRSURBVGhD7dlZqE1RHMfxa0ghhExRxkRIUkiGMmTIgyFTtxCZXkiSEIqSN0SRJA+SFA9CMhTxICFTUQqZJfM8+/6us2u17//cu9c5e917Zf/q073nnH3+a5+z917DPiVZsmSp9jRFvb///htphRnYjYt4i9+Ob7iNg1iK3qgxqYUxOIofcHc8iRtYgoaotgzCJVg76OsFFqEuqiwNsAO/YO1UMS6jG4KnPa7D2om0vMcEBEt3PILVeNp0vc1F6mmHh7AaDUWnbilSi66J0KdTPl/RD6lkO6xGZCaGYBUe557zpSO9EuoF5+Sec91DYxSVwcjXO6nLdKPRex1+ItrmEx7gau7vZ0SvaTtt7476GpfeINomsgkFR0UrGiduwcpUzEanskfl0wW6kKeUPSqfO4i39R1dUVDGIl7QdRchkq9T0dSnoGjaYRWMaO6U9kis08w9NV1f0AxeaQ0dTqugK7UeJZeBsNqJzINXNIu1Crmeog3SjMYrdSJWe3IYXtH5aBVyjUOIqBOw2pPXqI3E0XrCKhS5gFBRb3kNVrui+V7ixBdFcYsRMsthtSsjkSj6RqwCLo3CITMCVrsyHYnSBFYBV0+ETF9Y7UriWbEupsqWrUMRMqNgtSuTkTjPYRWJ6OZByKyG1a4MQ+LopoBVJBK616po2dALibMfVhHXJITILFjtyUd43SObD6uQS9Ntr28nQfpDO2u1J6fhlc6wCsW9xHikkWmobPxaA+/chFXMchLDUQc+0fajcQZWXZdmxVrLeEfL2HgxdctaR8efj2jCtxfLMABWNJhq5N4HHVGrjuU4Coouqidwi51Ac+x0nrNcQUtY6Qifox3RkSs4CxAvuAXKZsRfk1doi4qiU0Q34qz3W7TIKyrq00/BLaqbEX2g16wjswJJshbx91p0wyLf+t8rOhXi394uRNHPCT2gRZHugSWNjlq+Za1LZ0Vq0WzUvcj1wRqh2NyHu9Nx25B6dGPZnUwegs8RsHIe7o67DsC3O08cTUvcQesZ9mBjju9pcA7uzkfUkQT7EFH0+0W+SaV2zCfxD/IBC1Fl0U9l6xHvBIr5IMfQAdUS3Q7ainco5IOcxRGoM6kRqY+J2FD2KHla5P5myZIly3+VkpI/CXqqzeTbW68AAAAASUVORK5CYII=';
  });
  it('dataURL -> file', async () => {
    const file = await dataURLtoFile(dataURL);
    expect(file.type).to.be.equal(EImageType.PNG);
    expect(file.size > 1).to.be.equal(true);
  });
  it('conversion to PNG', async () => {
    const file = await dataURLtoFile(dataURL, EImageType.PNG);
    expect(file.type).to.be.equal(EImageType.PNG);
    expect(file.size > 1).to.be.equal(true);
  });
  it('conversion to JPEG', async () => {
    const file = await dataURLtoFile(dataURL, EImageType.JPEG);
    expect(file.type).to.be.equal(EImageType.JPEG);
    expect(file.size > 1).to.be.equal(true);
  });
  it('conversion to GIF', async () => {
    const file = await dataURLtoFile(dataURL, EImageType.GIF);
    expect(file.type).to.be.equal(EImageType.GIF);
    expect(file.size > 1).to.be.equal(true);
  });
});

describe('dataURLtoImage', function () {
  let dataURL: string;
  beforeEach(function () {
    dataURL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANRSURBVGhD7dlZqE1RHMfxa0ghhExRxkRIUkiGMmTIgyFTtxCZXkiSEIqSN0SRJA+SFA9CMhTxICFTUQqZJfM8+/6us2u17//cu9c5e917Zf/q073nnH3+a5+z917DPiVZsmSp9jRFvb///htphRnYjYt4i9+Ob7iNg1iK3qgxqYUxOIofcHc8iRtYgoaotgzCJVg76OsFFqEuqiwNsAO/YO1UMS6jG4KnPa7D2om0vMcEBEt3PILVeNp0vc1F6mmHh7AaDUWnbilSi66J0KdTPl/RD6lkO6xGZCaGYBUe557zpSO9EuoF5+Sec91DYxSVwcjXO6nLdKPRex1+ItrmEx7gau7vZ0SvaTtt7476GpfeINomsgkFR0UrGiduwcpUzEanskfl0wW6kKeUPSqfO4i39R1dUVDGIl7QdRchkq9T0dSnoGjaYRWMaO6U9kis08w9NV1f0AxeaQ0dTqugK7UeJZeBsNqJzINXNIu1Crmeog3SjMYrdSJWe3IYXtH5aBVyjUOIqBOw2pPXqI3E0XrCKhS5gFBRb3kNVrui+V7ixBdFcYsRMsthtSsjkSj6RqwCLo3CITMCVrsyHYnSBFYBV0+ETF9Y7UriWbEupsqWrUMRMqNgtSuTkTjPYRWJ6OZByKyG1a4MQ+LopoBVJBK616po2dALibMfVhHXJITILFjtyUd43SObD6uQS9Ntr28nQfpDO2u1J6fhlc6wCsW9xHikkWmobPxaA+/chFXMchLDUQc+0fajcQZWXZdmxVrLeEfL2HgxdctaR8efj2jCtxfLMABWNJhq5N4HHVGrjuU4Coouqidwi51Ac+x0nrNcQUtY6Qifox3RkSs4CxAvuAXKZsRfk1doi4qiU0Q34qz3W7TIKyrq00/BLaqbEX2g16wjswJJshbx91p0wyLf+t8rOhXi394uRNHPCT2gRZHugSWNjlq+Za1LZ0Vq0WzUvcj1wRqh2NyHu9Nx25B6dGPZnUwegs8RsHIe7o67DsC3O08cTUvcQesZ9mBjju9pcA7uzkfUkQT7EFH0+0W+SaV2zCfxD/IBC1Fl0U9l6xHvBIr5IMfQAdUS3Q7ainco5IOcxRGoM6kRqY+J2FD2KHla5P5myZIly3+VkpI/CXqqzeTbW68AAAAASUVORK5CYII=';
  });
  it('dataURL -> image', async () => {
    const image = await dataURLtoImage(dataURL);
    expect(isImage(image)).to.be.equal(true);
  });
});

// describe('downloadFile', function () {
//   it('', async () => {
//   });
// });

describe('filetoDataURL', function () {
  it('file -> dataURL', async () => {
    const file = await urltoBlob('../images/demo.png');
    const dataURL = await filetoDataURL(file);
    expect(isDataURL(dataURL)).to.be.equal(true);
  });
});

describe('imagetoCanvas', function () {
  let image: HTMLImageElement;
  beforeEach(async function () {
    image = await urltoImage('../images/demo.png');
  });
  it('image -> canvas', async () => {
    const canvas = await imagetoCanvas(image);
    expect(isCanvas(canvas)).to.be.equal(true);
  });
  it('set canvas width & heigth', async () => {
    const canvas = await imagetoCanvas(image, {
      width: 300,
      height: 500
    });
    expect(canvas.width).to.be.equal(300);
    expect(canvas.height).to.be.equal(500);
  });
  it('set canvas scale', async () => {
    const canvas = await imagetoCanvas(image, {
      scale: 2,
    });
    expect(canvas.width).to.be.equal(image.width * 2);
    expect(canvas.height).to.be.equal(image.height * 2);
  });
  it('scale option will override the width and height option', async () => {
    const canvas = await imagetoCanvas(image, {
      width: 1,
      height: 1,
      scale: 2,
    });
    expect(canvas.width).to.be.equal(image.width * 2);
    expect(canvas.height).to.be.equal(image.height * 2);
  });
  it('set canvas orientation', async () => {
    const canvas = await imagetoCanvas(image, {
      orientation: 8
    });
    expect(canvas.width).to.be.equal(image.height);
    expect(canvas.height).to.be.equal(image.width);
  });
});

describe('urltoBlob', function () {
  it('load png image', async () => {
    const file = await urltoBlob('../images/demo.png');
    expect(file.type).to.be.equal(EImageType.PNG);
    expect(file.size > 1).to.be.equal(true);
  });
  it('load by URL', async () => {
    const file = await urltoBlob('https://avatars3.githubusercontent.com/in/29110');
    expect(file.size > 1).to.be.equal(true);
  }).timeout(5000);
});

describe('urltoImage', function () {
  it('url -> image', async () => {
    const image = await urltoImage('../images/demo.png');
    expect(isImage(image)).to.be.equal(true);
  });
});

describe('compress', function () {
  describe('default', () => {
    it('compress JPEG', async () => {
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compress(file, 0.8);
      expect(file.size > compressFile.size).to.be.equal(true);
    });
    it('compress PNG', async () => {
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, 0.8);
      expect(file.size > compressFile.size).to.be.equal(true);
    });
    it('compress GIF', async () => {
      const file = await urltoBlob('../images/logo.gif');
      const compressFile = await compress(file, 0.8);
      expect(file.size > compressFile.size).to.be.equal(true);
    });
    it('compress JPEG quality', async () => {
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile1 = await compress(file, 0.8);
      const compressFile2 = await compress(file, 0.6);
      expect(compressFile1.size > compressFile2.size).to.be.equal(true);
    });
    it('compress PNG quality', async () => {
      const file = await urltoBlob('../images/logo.png');
      const compressFile1 = await compress(file, 0.8);
      const compressFile2 = await compress(file, 0.6);
      expect(compressFile1.size > compressFile2.size).to.be.equal(true);
    });
    it('compress GIF quality', async () => {
      const file = await urltoBlob('../images/logo.gif');
      const compressFile1 = await compress(file, 0.8);
      const compressFile2 = await compress(file, 0.6);
      expect(compressFile1.size > compressFile2.size).to.be.equal(true);
    });
  });
  describe('normal', () => {
    it('compress JPEG', async () => {
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.JPEG
      });
      expect(file.size > compressFile.size).to.be.equal(true);
    });
    it('compress JPEG -> PNG', async () => {
      // Warning: can't compress to PNG picture
      // Warning: compressFile type also JPEG
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.PNG
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compress JPEG -> GIF', async () => {
      // Warning: can't compress to GIF picture
      // Warning: compressFile type also JPEG
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compress PNG', async () => {
      // Warning: can't compress PNG picture
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.PNG
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compress PNG -> JPEG', async () => {
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.JPEG
      });
      expect(file.size > compressFile.size).to.be.equal(true);
    });
    it('compress PNG -> GIF', async () => {
      // Warning: can't compress PNG picture
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compress GIF', async () => {
      // Warning: can't compress GIF picture
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compress GIF -> JPEG', async () => {
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.JPEG
      });
      expect(file.size > compressFile.size).to.be.equal(true);
    });
    it('compress GIF -> PNG', async () => {
      // Warning: can't compress GIF picture
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compress(file, {
        quality: 0.8,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
  });
});

describe('compressAccurately', function () {
  describe('default', () => {
    it('compressAccurately JPEG', async () => {
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compressAccurately(file, 80);
      expect(compressAccuratelySuccess(compressFile, 80 * 1024)).to.be.equal(true);
    });
    it('compressAccurately PNG', async () => {
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compressAccurately(file, 80);
      expect(compressAccuratelySuccess(compressFile, 80 * 1024)).to.be.equal(true);
    });
    it('compressAccurately GIF', async () => {
      const file = await urltoBlob('../images/logo.gif');
      const compressFile = await compressAccurately(file, 80);
      expect(compressAccuratelySuccess(compressFile, 80 * 1024)).to.be.equal(true);
    });
  });
  describe('mormal', () => {
    it('compressAccurately JPEG', async () => {
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.JPEG
      });
      expect(compressAccuratelySuccess(compressFile, 80 * 1024)).to.be.equal(true);
    });
    it('compressAccurately JPEG -> PNG', async () => {
      // Warning: can't compress to PNG picture
      // Warning: compressFile type also JPEG
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.PNG
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compressAccurately JPEG -> GIF', async () => {
      // Warning: can't compress to GIF picture
      // Warning: compressFile type also JPEG
      const file = await urltoBlob('../images/logo.jpg');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compressAccurately PNG', async () => {
      // Warning: can't compress PNG picture
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.PNG
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compressAccurately PNG -> JPEG', async () => {
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.JPEG
      });
      expect(compressAccuratelySuccess(compressFile, 80 * 1024)).to.be.equal(true);
    });
    it('compressAccurately PNG -> GIF', async () => {
      // Warning: can't compress PNG picture
      const file = await urltoBlob('../images/logo.png');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compressAccurately GIF', async () => {
      // Warning: can't compress GIF picture
      const file = await urltoBlob('../images/logo.gif');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.GIF
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
    it('compressAccurately GIF -> JPEG', async () => {
      // Warning: can't compress GIF picture
      const file = await urltoBlob('../images/logo.gif');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.JPEG
      });
      expect(compressAccuratelySuccess(compressFile, 80 * 1024)).to.be.equal(true);
    });
    it('compressAccurately GIF -> PNG', async () => {
      // Warning: can't compress GIF picture
      const file = await urltoBlob('../images/logo.gif');
      const compressFile = await compressAccurately(file, {
        size: 80,
        type: EImageType.PNG
      });
      expect(file.size > compressFile.size).to.be.equal(false);
    });
  });
});