# image-resize-tools

## Development Setup

```bash
# install deps
npm i image-resize-tools --save

# compress files
npm install
npm run compress
```

## Seven methods in tools

![Alt text](./image/xmind.png?raw=true)

## Include the library

in the browser:
```html
<script src="http://www.wangyulue.com/assets/js/image_resize_tools/resize.common.js"></script>
```
in the node:
```js
const imageResizeTools = require("image-resize-tools")
```

## Use examples

```html
<input id="demo" type="file" onchange="view()">
```

```js
function view(){
    var file = document.getElementById('demo').files[0];
    console.log(file);
    imageResizeTools.fileResizetoFile(file,0.6,function(res){
        //回调中的res是一个压缩后的Blob类型（可以当做File类型看待）文件；
        //The res in the callback is a compressed Blob type (which can be treated as a File type) file;
        console.log(res);
        //do something
    })
}
```

## Use Promise

Use too many callback functions does not look elegant,as follows:

```js
var canvas = imageResizeTools.imagetoCanvas(img);
imageResizeTools.canvasResizetoFile(canvas,quality,file=>{
    imageResizeTools.filetoDataURL(file,data=>{
        imageResizeTools.dataURLtoImage(data,img=>{
            //do something
        })
    })
})
```

So, we recommend use `resize.promise.js` ,as follows:

in the browser, we change the script:
```html
<script src="http://www.wangyulue.com/assets/js/image_resize_tools/resize.promise.js"></script>
```

use like this:

```js
imageResizeTools.imagetoCanvas(img)
    .then(canvas => imageResizeTools.canvasResizetoFile(canvas,quality))
    .then(file => imageResizeTools.filetoDataURL(file))
    .then(data => imageResizeTools.dataURLtoImage(data))
    .then(img => {
        //do something
    })
})
```

## Description document

[王玉略的个人网站](http://www.wangyulue.com/2017/11/13/JS%E4%B8%AD%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9%E7%9A%84%E4%B8%80%E8%88%AC%E6%96%B9%E6%B3%95/#more)

## License


[MIT](http://opensource.org/licenses/MIT)
