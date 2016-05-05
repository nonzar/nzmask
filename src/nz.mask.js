var NZMask = (function () {
    /*
     * 添加NZMask样式表
     * 建议该段代码放到css里
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
     */

    /*
     * mask是遮罩类,用于显示遮罩层.
     */
    var isInstallCss = false;
    var mask = function (options) {
        this.options = options;
        this.__event = {};
        this.zIndex = 999;
        this.elMasks = [];
        this.ansys = [];
        var _elMasks = document.querySelectorAll(".nzmask");
        for (var i = 0; i < _elMasks.length; i++) {
            this.elMasks.push(_elMasks[i]);
            this.ansys.push({
                url: _elMasks[i].getAttribute("data-tpl")
            });
            this.ansys[i].isLoad = (this.ansys[i].url != null && this.ansys[i].length != 0) ? false : true;
        }
        delete _elMasks;
        if(options){
            if (options["onLoad"]) {
                this.on("load", options["onLoad"]);
            }
            if (options["onShow"]) {
                this.on("show", options["onShow"]);
            }
            if (options["onHide"]) {
                this.on("hide", options["onHide"]);
            }
        }
        return this;
    }
    mask.prototype.installCSS = function () {
        if (isInstallCss)return;
        if (document.styleSheets.length == 0) {
            document.head.appendChild(document.createElement("style"));
        }
        document.styleSheets[0].addRule(".nzmask", "" +
            "background-color: rgba(0,0,0,0.8);" +
            "width: 100%;" +
            "height: 100%;" +
            "overflow: hidden;" +
            "visibility: hidden;" +
            "z-index: -1;" +
            "position: fixed;" +
            "left: 0;" +
            "top: 0;" +
            "opacity: 0;" +
            "pointer-events: none;" +
            "-webkit-transition: opacity 500ms;" +
            "");
        document.styleSheets[0].addRule(".show-nzmask", "" +
            "pointer-events: auto;" +
            "visibility: visible;" +
            "opacity: 1;" +
            "");
        return this;
    }
    /*
     * 绑定事件
     *
     */
    mask.prototype.on = function (event, listener) {
        if (!this.__event[event]) {
            this.__event[event] = [];
        }
        this.__event[event].push(listener);
    }

    /*
     * 触发事件
     *
     */
    mask.prototype.__triggerEvent = function (event, args) {
        if (this.__event[event]) {
            for (var i = 0; i < this.__event[event].length; i++) {
                this.__event[event][i](args);
            }
        }
    }
    /*
     * 根据id获取遮罩在集合中的序号
     * @param {string} [id] 遮罩的id
     * @return number
     */
    mask.prototype.getIdx = function (id) {
        if (typeof(id) != "string") throw "NZMask - id is not string.";
        if (this.elMasks && this.elMasks.length) {
            for (var i = 0; i < this.elMasks.length; i++) {
                if (this.elMasks[i].id == id) {
                    return i;
                }
            }
        }
        return -1;
    }
    /*
     * 显示遮罩(叠加显示,如要隐藏前一个,请调用hide方法)
     * @param {number} [idx] 遮罩的序号
     * @return this
     */
    mask.prototype.show = (function () {
        return function (idx, callback) {
            // debugger;
            if (typeof(idx) != "number") {
                if (typeof(idx) != "string") {
                    throw "NZMask - idx is not number or string.";
                }
                idx = this.getIdx(idx);
                if (idx == -1)return;
            }
            this.elMasks[idx].style.zIndex = ++this.zIndex;
            this.elMasks[idx].classList.add("show-nzmask");
            if (!this.ansys[idx].isLoad) {
                $(this.elMasks[idx]).load(this.ansys[idx].url, function () {
                    this.ansys[idx].isLoad = true;
                    this.__triggerEvent("load", {
                        index: idx,
                        id: this.elMasks[idx].getAttribute("id")
                    });
                    this.__triggerEvent("show", {
                        index: idx,
                        id: this.elMasks[idx].getAttribute("id")
                    });
                    if (callback && typeof(callback) == "function") {
                        callback();
                    }
                }.bind(this));
            } else {
                this.__triggerEvent("show", {
                    index: idx,
                    id: this.elMasks[idx].getAttribute("id")
                });
                if (callback && typeof(callback) == "function") {
                    callback();
                }
            }
            return this;
        }
    })();
    /*
     * 隐藏遮罩,如传入idx则隐藏该idx遮罩,否则全部隐藏
     * @param {number} [idx] 遮罩的序号
     * @return this
     */
    mask.prototype.hide = (function () {
        var idxs = [], ids = [];
        return function (idx, callback) {
            idxs.length = ids.length = 0;
            if (idx != undefined) {
                if (typeof(idx) != "number") {
                    if (typeof(idx) != "string") {
                        throw "NZMask - idx is not number or string.";
                    }
                    idx = this.getIdx(idx);
                }
                this.elMasks[idx].classList.remove("show-nzmask");
                this.elMasks[idx].style.zIndex = "-9999";
                idxs.push(idx);
                ids.push(this.elMasks[idx].getAttribute("id"));
            } else {
                for (var i = 0; i < this.elMasks.length; i++) {
                    if (this.elMasks[i].classList.contains("show-nzmask")) {
                        this.elMasks[i].classList.remove("show-nzmask");
                        this.elMasks[i].style.zIndex = "-9999";
                        idxs.push(i);
                        ids.push(this.elMasks[i].getAttribute("id"));
                    }
                }
            }
            if (idxs.length != 0) {
                this.__triggerEvent("hide", {
                    indexs: idxs,
                    ids: ids
                });
            }
            if (callback && typeof(callback) == "function") {
                callback();
            }
            return this;
        }
    })();
    mask.prototype.remove = function (idx) {
        if (typeof(idx) != "number") {
            if (typeof(idx) != "string") {
                throw "NZMask - idx is not number or string.";
            }
            idx = this.getIdx(idx);
        }
        this.elMasks[idx].parentNode.removeChild(this.elMasks[idx]);
        this.elMasks.splice(idx, 1);
        this.ansys.splice(idx, 1);
        return this;
    }
    return mask;
})();