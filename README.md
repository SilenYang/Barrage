<h1 align="center">
    easy-barrage
</h1>

一个简易的弹幕实现，实现了顶部居中、底部居中、彩色弹幕、无遮挡滚动、渐变色弹幕，以及其他常用功能。

## 初始化

```js
import Barrage from 'easy-barrage'
const barrage = new Barrage(options)
```

通过 `options` 可以进行一次全局的初始化，设置默认值，`options` 参数如下：

|     参数     |         参数类型         |  默认  | 描述                       |
| :----------: | :----------------------: | :----: | -------------------------- |
|      el      |        `Element`         | `null` | 弹幕容器                   |
|    color     |         `string`         | `#000` | 弹幕颜色                   |
|   fontSize   |         `Number`         |  `18`  | 字体大小                   |
|   opacity    |         `Number`         |  `1`   | 弹幕透明度                 |
|  renderArea  | enum：`full` `up` `down` | `full` | 弹幕显示区域，默认为全屏   |
| standingTime |         `Number`         |  `4`   | 固定弹幕停留时间，单位为秒 |

## `barrage` 实例

`barrage` 实例上有一些实例方法可供操作弹幕，例如发送弹幕，修改配置等

### `send`

`barrage.send(option)` 发送弹幕，`option` 参数如下：

|     参数      |          参数类型          | 描述                                                                                                              |
| :-----------: | :------------------------: | ----------------------------------------------------------------------------------------------------------------- |
|     text      |          `string`          | 弹幕内容                                                                                                          |
|    avatar     |          `string`          | 头像，若要让弹幕前带有头像，可传入头像的链接                                                                      |
|     color     |          `string`          | 弹幕颜色，若不传将使用默认值                                                                                      |
| gradientColor |          `string`          | 弹幕渐变色，要让弹幕字体颜色从左到右渐变，传入需要渐变的颜色即可，例如：`"red,yellow,green"`，该参数优先于`color` |
|  borderColor  |          `string`          | 边框颜色，需要给弹幕加上一个边框，传入该边框颜色即可，该值不影响弹幕类型                                          |
|   sendType    | enum：`normal` `up` `down` | 弹幕发送类型，默认为 `normal`，即滚动弹幕，`up`为顶部弹幕，`down`为底部弹幕                                       |
|     type      |  enum：`normal` `avatar`   | 弹幕类型，默认为 `normal`，即普通弹幕，`avatar`为头像弹幕                                                         |

### `update`

`barrage.update(option)` 改变弹幕的默认设置，参数与初始化参数相同

### `pause`

`barrage.pause()` 将滚动弹幕暂停或继续

### `dispose`

`barrage.dispose()` 清空所有弹幕
