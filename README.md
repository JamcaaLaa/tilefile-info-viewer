# 简介

偶尔会有拆解单个 3DTiles 瓦片的需求，但是每次都要费劲写程序读字节码，就很不爽。

幸好瓦片通常是单个二进制文件存在（i3dm 和 glb 瓦片例外），文件上传解析做起来不难，就写了这么个简单的页面。

这个是纯客户端解析，不会有网络偷跑，解析完成后会输出瓦片头信息（JSON格式）到页面的代码区，并自动弹出下载，下载一个 zip 文件，文件内根据瓦片的格式不同会有不同的内容。

```
zip/
  - featureTable.json 
  - featureTableBinary.bin [不一定存在]
  - batchTable.json [不一定存在]
  - batchTableBinary.bin [不一定存在]
  - model.glb [b3dm/i3dm才存在]

```


# 当前提供的功能

- 解析常规 b3dm、i3dm、pnts 成上述压缩包格式

# TODO

- 进一步解析 glb
- 解析 cmpt 格式瓦片
- 检测瓦片内的扩展情况
- 尝试解析 3DTiles Next
- 使用 ThreeJS 可视化单个瓦片
