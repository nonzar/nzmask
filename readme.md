##简介
遮罩类,用来模拟及管理弹出层,

##使用

###添加css代码
在`css`文件里添加如下`css`代码,也可以在实例化时调用`.installCss()`方法安装.
```css
 .nzmask {
     background-color: rgba(0, 0, 0, 0.8);
     width: 100%;
     height: 100%;
     visibility: hidden;
     overflow: hidden;
     z-index: -9999;
     position: fixed;
     left: 0px;
     top: 0px;
     -webkit-transform: translate(0);
 }

 .show-nzmask {
    visibility: visible;
 }
```


---

###添加html代码
在`html`文件里添加遮罩层代码,有多少个写多少个,并配置唯一`id`,加入标识类`nzmask`.
如果该层内容需要异步加载,则添加`data-tpl`属性,并赋值模版(`html文件`)地址
```html
<section id="mask1" class="nzmask">
    //code
</section>
<section id="mask2" class="nzmask" data-tpl="tpl_mask2.html">
    //code
</section>
...
```
---
###new NZMask(options)
实例化并传入配置参数.

**parameters**:
- **`options`**: `[object]`.
  - **`onLoad`**: `[function] `预绑定`load`事件.
  - **`onShow`**: `[function] `预绑定`show`事件.
  - **`onHide`**: `[function] `预绑定`hide`事件.

**example**:
```javascript
var mask = new NZMask({
    onLoad: function (e) {
        e.index//[number] 异步加载好的层的序号.
        e.id//[string] 异步加载好的层的id.
    },
    onShow: function (e) {
        e.index//[number] 当前显示的层的序号.
        e.id//[string] 当前显示的层的id.
    },
    onHide: function (e) {
        e.indexs//[array] 目前执行隐藏的所有层的序号[number].
        e.ids//[array] 当前执行隐藏操作的所有层的id[string]
    }
});
```
---
###.installCss()
配置`css`,无论实例化多少个和执行多少次,安装最终只会执行一次.

**example**:
```javascript
var mask = new NZMask().installCSS();
//or
mask.installCSS();
```
---
###.on(event,listener)
后绑定事件,传入事件名称及监听函数.

**parameters**:
- **`event`**: `[string]` 事件名称,可选值如下:
  - **`load`**: 遮罩层异步加载完毕.
  - **`show`**: 遮罩层显示完毕.
  - **`hide`**: 遮罩层隐藏完毕.
- **`listener`**: `[function]`

**example**:

```javascript
mask.on("load",function(e){
    //code
});
mask.on("show",function(e){
    //code
});
mask.on("hide",function(e){
    //code
});
```
---

###.getIdx(id)
根据传入的id获取该遮罩层的序号.
注意,此方法返回值是`number`类型,不能链式调用.

**parameters**:
- **`id`**: `[string]` 传入id.

**return**:
- **index**: `[number]` 指定id的序号.

**example**:
```javascript
var index = mask.getIdx("mask1");//获取index.
```

---

###.show(value)
根据传入的参数**`显示`**指定的遮罩层,参数可以是`序号`或者`id`,要查询序号,请调用`.getidx()`方法.
注意,遮罩层是`叠加显示`模式(意即叠加在旧遮罩层上),如要隐藏其他遮罩层,请调用`.hide()`方法

**parameters**:
- **`value`**: `[string\number]` 传入id或者序号

**example**:
```javascript
mask.show(0);//显示第一个遮罩.
mask.show("mask1");//显示第一个遮罩.
mask.show(1);//叠加显示第二个遮罩.
```
---

###.hide(value)
根据传入的参数**`隐藏`**指定的遮罩层,参数可以是`序号`或者`id`,要查询序号,请调用`.getidx()`方法.
由于`.show()`方法是`叠加显示`模式,如要实现`替换显示`模式,执行`.show()`前先执行此方法.

**parameters**:
- **`value`**: `[string\number]` `可选` 传入id或者序号,不传则隐藏所有遮罩层.

**example**:
```javascript
mask.hide(0);//隐藏第一个遮罩.
mask.hide("mask1");//隐藏第一个遮罩.
mask.hide();//隐藏所有遮罩.
mask.hide().show("mask2");//替换显示
```
---

###.remove(value)
根据传入的参数**`移除`**指定的遮罩层,参数可以是`序号`或者`id`,要查询序号,请调用`.getidx()`方法.

**parameters**:
- **`value`**: `[string\number]` `必选` 传入id或者序号.

**example**:
```javascript
mask.remove(0);//移除第一个遮罩.
mask.remove("mask1");//移除第一个遮罩.
```
---


##支持

支持**`html5`**&**`css3`**的浏览器