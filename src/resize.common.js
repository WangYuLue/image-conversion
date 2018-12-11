/**
 * @file Describe the file
 * @author wangyulue(wangyulue@gmail.com)
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.imageResizeTools = factory());
}(this, (function () {
	'use strict';

	const methods = {};

	/**
	 * 通过一个图片的url加载所需要的image对象
	 *
	 * @param {string} url 图片URL
	 * @param {requestCallback} fn fn为回调函数，包含一个image对象
	 *
	 * @callback requestCallback
	 * @param {image} image image对象
	 */
	methods.urltoImage = function (url, fn) {
		const img = new Image();
		img.src = url;
		img.onload = function () {
			fn && fn(img);
		}
	};

	/**
	 * 通过一个图片的url加载所需要的File（Blob）对象
	 *
	 * @param {string} url 图片URL
	 * @param {requestCallback} fn fn为回调函数，包含一个File（Blob）对象
	 *
	 * @callback requestCallback
	 * @param {Blob} file
	 */
	methods.urltoBlob = function (url, fn) {
		fetch(url).then(function (response) {
				return response.blob()
			})
			.then(function (blob) {
				fn && fn(blob);
			});
	}

	/**
	 * 将一个image对象转变为一个canvas对象
	 *
	 * @param {image} image
	 *
	 * @typedef {Object} config 转变为canvas时的一些参数配置
	 * 		@param {number} width canvas图像的宽度，默认为image的宽度
	 * 		@param {number} height canvas图像的高度，默认为image的高度
	 * 		@param {number} scale 相对于image的缩放比例，默认不缩放；
	 * 			设置config.scale后会覆盖config.width和config.height的设置；
	 * @type {config}
	 *
	 * @returns {canvas}
	 */
	methods.imagetoCanvas = function (image, config = {}) {
		const cvs = document.createElement("canvas");
		const ctx = cvs.getContext('2d');
		let height, width;
		//设置宽高
		if (!config.scale) {
			width = config.width || image.width;
			height = config.height || image.height;
		} else {
			width = image.width * config.scale;
			height = image.height * config.scale;
		}
		//当顺时针或者逆时针旋转90时，需要交换canvas的宽高
		if ([5, 6, 7, 8].some(i => i === config.orientation)) {
			cvs.height = width;
			cvs.width = height;
		} else {
			cvs.height = height;
			cvs.width = width;
		}
		//设置方向
		switch (config.orientation) {
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

	/**
	 * 将一个canvas对象转变为一个File（Blob）对象
	 * 该方法可以做压缩处理
	 *
	 * @param {canvas} canvas
	 * @param {number} quality 传入范围 0-1，表示图片压缩质量
	 * @param {requestCallback} fn fn为回调函数，包含一个File（Blob）对象
	 *
	 * @callback requestCallback
	 * @param {Blob} file
	 */
	methods.canvasResizetoFile = function (canvas, quality, fn) {
		canvas.toBlob(function (blob) {
			fn && fn(blob);
		}, 'image/jpeg', quality);
	};

	/**
	 * 将一个Canvas对象转变为一个dataURL字符串
	 * 该方法可以做压缩处理
	 *
	 * @param {canvas} canvas
	 * @param {number} quality 传入范围 0-1，表示图片压缩质量
	 * @returns {srting} 返回一个dataURL字符串
	 */
	methods.canvasResizetoDataURL = function (canvas, quality) {
		return canvas.toDataURL({
			type: 'image/jpeg'
		}, quality);
	};

	/**
	 * 将File（Blob）对象转变为一个dataURL字符串
	 *
	 * @param {Blob} file
	 * @param {requestCallback} fn fn为回调函数，包含一个dataURL字符串
	 *
	 * @callback requestCallback
	 * @param {string} dataURL dataURL字符串
	 */
	methods.filetoDataURL = function (file, fn) {
		const reader = new FileReader();
		reader.onloadend = function (e) {
			fn && fn(e.target.result);
		};
		reader.readAsDataURL(file);
	};

	/**
	 * 将dataURL字符串转变为image对象
	 *
	 * @param {srting} dataURL dataURL字符串
	 * @param {requestCallback} fn fn为回调函数，包含一个image对象
	 *
	 * @callback requestCallback
	 * @param {image} image image对象
	 */
	methods.dataURLtoImage = function (dataURL, fn) {
		const img = new Image();
		img.onload = function () {
			fn && fn(img);
		};
		img.src = dataURL;
	};

	/**
	 * 将一个dataURL字符串转变为一个File（Blob）对象
	 * 转变时可以确定File对象的类型
	 *
	 * @param {string} dataURL
	 * @param {string} type type参数确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
	 */
	methods.dataURLtoFile = function (dataURL, type) {
		let arr = dataURL.split(','),
			mime = arr[0].match(/:(.*?);/)[1],
			bstr = atob(arr[1]),
			n = bstr.length,
			u8arr = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {
			type: type || mime
		});
	};

	/**
	 * 将图片下载到本地
	 *
	 * @param {Blob} file 一个File（Blob）对象
	 * @param {string=} fileName 下载后的文件名（可选参数，不传以时间戳命名文件）
	 */
	methods.downloadFile = function (file, fileName) {
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(file);
		link.download = fileName || Date.now().toString(36);
		document.body.appendChild(link);
		const evt = document.createEvent("MouseEvents");
		evt.initEvent("click", false, false);
		link.dispatchEvent(evt);
		document.body.removeChild(link);
	};

	/***以下是进一步封装***/

	/**
	 * 压缩File（Blob）对象
	 * @param {Blob} file 一个File（Blob）对象
	 * @param {number} quality 传入范围 0-1，表示图片压缩质量
	 * @param {requestCallback} fn fn为回调函数，包含一个压缩后的File（Blob）对象
	 *
	 * @callback requestCallback
	 * @param {Blob} file
	 */
	methods.fileResizetoFile = function (file, quality, fn) {
		methods.filetoDataURL(file, function (dataURL) {
			const mime = dataURL.split(',')[0].match(/:(.*?);/)[1];
			methods.dataURLtoImage(dataURL, function (image) {
				const canvas = methods.imagetoCanvas(image);
				const dataURL = methods.canvasResizetoDataURL(canvas, quality);
				const file = methods.dataURLtoFile(dataURL, mime);
				fn && fn(file);
			})
		})
	};

	return methods;
})));