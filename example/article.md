# JS中通过指定大小来压缩图片

前不久王二写了一个[图片处理库](https://juejin.im/post/5a097b2ff265da43231a79fa)，可以指定图片质量压缩图片，调用的是javaScript的原生方法 `toDataURL` 和 `toBlob`，库里有如下这些方法：

![Alt text](https://github.com/WangYuLue/pic_of_blog/blob/master/1812/2.png?raw=true)

但是通过质量压缩图片有一些不足之处：**无法确定压缩后图片的大小**；

比如下图，王二随机选了三张图片做测试(感兴趣的小伙伴可以[戳这里](http://www.wangyulue.com/assets/image-comversion/example/test.html)自行测试)，图中x轴是图片压缩质量，取值0~1,y轴是图片的压缩比：

![Alt text](https://github.com/WangYuLue/pic_of_blog/blob/master/1812/1.png?raw=true)

可以看到，在设置相同的压缩图片质量下，每张图片的压缩比率都有所不同；

而在实际开发中，我们可能会有这样的需求：**指定图片大小来压缩图片**。王二在github找了一圈，没发现有实现此方法的js库,于是王二在原来库的基础上又做了一些修改，实现了这个功能。

下图是新库的方法地图：

![Alt text](https://github.com/WangYuLue/pic_of_blog/blob/master/1812/3.png?raw=true)

新库做了如下优化：

* 支持png,gif,jpeg类型图片压缩
* 添加`downloadFile()`方法
* 可以设置压缩后图片的长宽，图片比例
* 可以设置压缩后图片旋转方向
* **通过指定大小来压缩文件**
* eslint
* 用promise，sync/await异步调用

这时候指定大小来压缩图片的方法就会变的非常简单，如下：

```js
//将图片压缩到100KB
imageConversion.compressAccurately(file,100);

//还可以加上其他选项，指定压缩图片的精确度、类型、宽度、高度、旋转方向、缩放
imageConversion.compressAccurately(file,{
  size: 100,    //The compressed image size is 100kb
  accuracy: 0.9,//the accuracy of image compression size,range 0.8-0.99,default 0.95;
                //this means if the picture size is set to 1000Kb and the
                //accuracy is 0.9, the image with the compression result
                //of 900Kb-1100Kb is considered acceptable;
  type: "image/png",
  width: 300,
  height: 200,
  orientation:2,
  scale: 0.5,
})
```
可以参考[github](https://github.com/WangYuLue/image-conversion)了解更加详细的使用方法。

实现`compressAccurately`方法的原理其实很简单，就是 **通过二分法来找到最接近指定大小的那个图片质量**。

如果想亲手体验一下，可以[戳这里](http://www.wangyulue.com/assets/image-comversion/example/index.html)在线体验。如果使用有什么问题，及时提issue给我。

如果觉得还不错，别忘了来[github](https://github.com/WangYuLue/image-conversion)star一下哦。