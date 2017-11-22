!(function imageResizeTool (root) {
	var methods = {} ;

	/* 通过一个图片的url加载所需要的图片对象
	 * url参数传入图片的url
	 * fn为回调方法包含，一个Image对象的参数
	 */
	methods.urltoImage = function (url,fn){
		var img = new Image();
		img.src = url;
		img.onload = function(){
			fn(img);
		}
	};

	/* 将一个Image对象转变为一个Canvas类型对象
	 * image参数传入一个Image对象
	 */
	methods.imagetoCanvas = function (image){
		var cvs = document.createElement("canvas");
		var ctx = cvs.getContext('2d');
		cvs.width = image.width;
		cvs.height = image.height;
		ctx.drawImage(image, 0, 0, cvs.width, cvs.height);
		return cvs ;
	};

	/* 将一个Canvas对象压缩转变为一个Blob类型对象
	 * canvas参数传入一个Canvas对象
	 * quality参数传入一个0-1的number类型，表示图片压缩质量
	 * fn为回调方法，包含一个Blob对象的参数
	 */
	methods.canvasResizetoFile = function (canvas,quality,fn){
		canvas.toBlob(function(blob) {
			fn(blob);
		},'image/jpeg',quality);
	};

	/* 将一个Canvas对象压缩转变为一个dataURL字符串
	 * canvas参数传入一个Canvas对象
	 * quality参数传入一个0-1的number类型，表示图片压缩质量
	 */
	methods.canvasResizetoDataURL = function(canvas,quality){
		return canvas.toDataURL('image/jpeg',quality);
	};

	/* 将File（Blob）类型文件转变为dataURL字符串
	 * file参数传入一个File（Blob）类型文件
	 * fn为回调方法，包含一个dataURL字符串的参数
	 */
	methods.filetoDataURL = function(file,fn){
		var reader = new FileReader();
		reader.onloadend = function(e){
			fn(e.target.result);
		};
		reader.readAsDataURL(file);
	};

	/* 将一串dataURL字符串转变为Image类型文件
	 * dataurl参数传入一个dataURL字符串
	 * fn为回调方法，包含一个Image类型文件的参数
	 */
	methods.dataURLtoImage = function(dataurl,fn){
		var img = new Image();
		img.onload = function() {
			fn(img);
		};
		img.src = dataurl;
	};

	/* 将一串dataURL字符串转变为Blob类型对象
	 * dataurl参数传入一个dataURL字符串
	 */
	methods.dataURLtoFile = function(dataurl) {
		var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
		while(n--){
			u8arr[n] = bstr.charCodeAt(n);
		}
		return new Blob([u8arr], {type:mime});
	};

	/***以下是进一步封装***/

	/* 将File（Blob）类型文件压缩后再返回Blob类型对象
	 * file参数传入一个File（Blob）类型文件
	 * quality参数传入一个0-1的number类型，表示图片压缩质量
	 * fn为回调方法，包含一个Blob类型文件的参数
	 * 使用示例：
	 * var file = document.getElementById('demo').files[0];
	 * fileResizetoFile(file,0.6,function(res){
	 *     console.log(res);
	 *     //做出你要上传的操作；
	 * })
	 */
	methods.fileResizetoFile = function(file,quality,fn){
		methods.filetoDataURL (file,function(dataurl){
			methods.dataURLtoImage(dataurl,function(image){
				methods.canvasResizetoFile(methods.imagetoCanvas(image),quality,fn);
			})
		})
	};

	root.imageResizeTool = methods ;
}(this))