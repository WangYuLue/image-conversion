### 加载压缩文件依赖
npm install

### 压缩文件
gulp

### 七个方法

![Alt text](./image/xmind.png?raw=true)

### 使用示例

```js
var file = document.getElementById('demo').files[0];

imageResizeTool.fileResizetoFile(file,0.6,function(res){
    //回调中的res是一个压缩后的Blob类型（可以当做File类型看待）文件；
    console.log(res);
    //做出你要上传的操作；
})
```

### 说明文档

[王玉略的个人网站](http://www.wangyulue.com/2017/11/13/JS%E4%B8%AD%E5%9B%BE%E7%89%87%E5%8E%8B%E7%BC%A9%E7%9A%84%E4%B8%80%E8%88%AC%E6%96%B9%E6%B3%95/#more)
