(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.imageResizeTools = factory());
}(this, (function () { 'use strict';

	var methods = {} ;

	methods.urltoImage = function (url) {
        return new Promise((resolve) => {
            var img = new Image();
            img.src = url;
            img.onload = function(){
                resolve(img);
            }
        });
	};

	methods.imagetoCanvas = function (image) {
        return new Promise((resolve) => {
            var cvs = document.createElement("canvas");
            var ctx = cvs.getContext('2d');
            cvs.width = image.width;
            cvs.height = image.height;
            ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
            resolve(cvs) ;
        });
	};

	methods.canvasResizetoFile = function (canvas,quality) {
        return new Promise((resolve) => {
            canvas.toBlob(function(blob) {
                resolve(blob);
            },'image/jpeg',quality);
        });
	};

	methods.canvasResizetoDataURL = function (canvas,quality) {
        return new Promise((resolve) => {
            resolve(canvas.toDataURL('image/jpeg',quality));
        });
	};

	methods.filetoDataURL = function (file) {
        return new Promise((resolve) => {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        });
	};

	methods.dataURLtoImage = function (dataurl) {
        return new Promise((resolve) => {
            var img = new Image();
            img.onload = function() {
                resolve(img);
            };
            img.src = dataurl;
        });
	};

	methods.dataURLtoFile = function (dataurl) {
        return new Promise((resolve) => {
            var arr = dataurl.split(','), 
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), 
                n = bstr.length, 
                u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            resolve(new Blob([u8arr], {type:mime}));
        });
	};

    methods.fileResizetoFile = function (file,quality,fn) {
        methods.filetoDataURL(file)
            .then(dataurl => methods.dataURLtoImage(dataurl))
            .then(image => methods.imagetoCanvas(image))
            .then(canvas => methods.canvasResizetoFile(canvas,quality))
            .then(file => fn(file))
    };

	return methods ;
})));