(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject$1(value) {
    return value && _typeof(value) === 'object';
  }
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  function noop() {}
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      configurable: false,
      value: value
    });
  }
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured'];
  /**
   * 策略模式的应用
   */

  var strats = {};
  /**
   * 组件属性的合并策略
   */

  function mergeAssets(parentVal, childVal) {
    var res = Object.create(parentVal);

    if (childVal) {
      for (var key in childVal) {
        res[key] = childVal[key];
      }
    }

    return res;
  }

  strats.components = mergeAssets;
  /**
   * 生命周期的合并策略
   */

  function mergeHook(parentVal, childValue) {
    if (childValue) {
      if (parentVal) {
        return parentVal.concat(childValue);
      } else {
        return [childValue];
      }
    } else {
      return parentVal;
    }
  }

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });
  /**
   * 合并用户自定义传入的options与组件的options
   */

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    }

    function mergeField(key) {
      if (key === '_base') {
        options[key] = parent[key];
        return;
      }

      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
          options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
        } else {
          if (child[key]) {
            options[key] = child[key];
            return;
          }

          options[key] = parent[key];
        }
      }
    }

    return options;
  }

  var id = 0;

  var Dep$1 = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }
    /**
     * 观察目标发布
     */


    _createClass(Dep, [{
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
      /**
       * 提供注册方法一
       */

    }, {
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
      /**
       * 提供注册方法二
       */

    }, {
      key: "depend",
      value: function depend() {
        if (Dep.target) {
          Dep.target.addDep(this); // 让watcher自己把自己存放到dep上
        }
      }
    }]);

    return Dep;
  }();
  /**
   * 使用数组模拟栈
   * 为什么还多声明了一个栈 为了接下来的计算属性✍️
   */


  var stack = [];
  function pushTarget(watcher) {
    Dep$1.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep$1.target = stack[stack.length - 1];
  }

  /**
   * Object.defineProperty 是新增和修改对象属性 ✅注意是属性
   * data对象的属性有基本类型、对象、数组
   * 属性的变化也是需要被监控到
   * 改变数组的方式 api 以及索引
   * 重写数组的那些方法 7个 push shift unshift pop reverse sort splice 会导致数组本身发生变化
   */
  var oldArrayMethods = Array.prototype;
  var arrayMethods = Object.create(oldArrayMethods);
  var methods = ['push', 'shift', 'unshift', 'pop', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      var arrInstance = this;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted;
      var ob = arrInstance.__ob__;

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          insert = args.slice(2);
      }

      if (inserted) {
        ob.observerArray(inserted);
      }

      ob.dep.notify();
      return result;
    };
  });

  /**
   * 侦测策略：
   * 对于数组侦测 侦测其方法 索引不侦测 所以如果是[[[]]] 其索引不在侦测范围内 所以依赖收集得特殊处理
   * 对于对象 会侦测所有的熟悉
   * 如果是属性对象 递归给属性绑定__ob__属性
   */

  var Observer = /*#__PURE__*/function () {
    function Observer(value) {
      _classCallCheck(this, Observer);

      /**
       * 数组的依赖收集
       * [[[]],[]]
       */
      this.dep = new Dep$1();
      /**
       * 只有是引用类型才具有这个属性
       * 所以我们经常会打印看到data的属性对象具有__ob__
       * __ob__ 就是oberver实例
       */

      def(value, '__ob__', this);

      if (Array.isArray(value)) {
        /**
         * 进行重写覆盖
         */
        value.__proto__ = arrayMethods;
        this.observerArray(value);
      } else {
        this.walk(value);
      }
    }
    /**
     * [{}]
     * 将数组元素对象进行侦测
     * 对于数组元素还是为数组我们已经重写过数组方法 侦测数组方法就是
     * 索引不进行侦测
     * 递归给属性绑定__ob__属性
     */


    _createClass(Observer, [{
      key: "observerArray",
      value: function observerArray(value) {
        value.forEach(function (obj) {
          observe(obj);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data);
        keys.forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();
  /**
   * 
   * @param {*} data 
   * @param {*} key 
   * @param {*} value data属性的值
   */


  function defineReactive(data, key, value) {
    /**
     * 每个属性都绑定一个dep实例
     */
    var dep = new Dep$1();
    var childOb = observe(value); // 递归实现深度数据侦测

    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function get() {
        /**
         * 利用闭包返回数据
         * 收集依赖 千万别data[key] 无限循环了
         */
        if (Dep$1.target) {
          /**
           * 每次访问这个数据都会触发 存在watcher才收集
           */
          dep.depend();
          /**
           * 如果访问的属性是对象
           */

          if (childOb) {
            /**
             * 收集数组的依赖
             */
            childOb.dep.depend();

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },
      set: function set(newValue) {
        console.log("setter", newValue);
        /**
         * 派发更新
         */

        if (value === newValue) {
          return;
        }
        /**
         * 修改的数据也要进行侦测
         */


        observe(newValue);
        value = newValue;
        dep.notify();
      }
    });
  }
  /**
   * 为每个数组元素添加依赖
   */

  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
  }

  function observe(data) {
    /**
     * 传递的属性不是对象
     * 则不用再继续侦测
     */
    var isObj = isObject$1(data);

    if (!isObj) {
      return;
    }

    return new Observer(data);
  }

  /**
   * dom的更新是同步在vuejs1.0的时候
   * 我们执行dom更新又不是解析HTML 不要弄混淆了
   * 事实上dom更新是也是使用nextTick
   * Vue.js2.0使用异步更新队列 
   * 变化的侦测通知只发送到组件
   * 组件内所有状态的变化都会通知到同一个watcher
   * 然后会对整个组件进行更新
   * 事实上这是没有必要的 我们可以使用异步更新 做到批量更新 反正数据都是改变好了 watcher只是通知依赖进行更新 仅此而已
   */
  var callbacks = [];

  function flushCallbacks() {
    callbacks.forEach(function (cb) {
      return cb();
    });
  }

  var timerFunc;

  if (Promise) {
    // then方法是异步的
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    // MutationObserver 也是一个异步方法
    var observe$1 = new MutationObserver(flushCallbacks); // H5的api

    var textNode = document.createTextNode(1);

    timerFunc = function timerFunc() {
      /**
       * 发布dom改变了
       */
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick(cb) {
    callbacks.push(cb);
    timerFunc();
  }

  var hash = {};
  var queue = [];

  function flushSchedulerQueue() {
    for (var i = 0; i < queue.length; i++) {
      var watcher = queue[i];
      watcher.run();
    }

    hash = {};
    queue = [];
  }

  var pending = false;
  function queuWatcher(watcher) {
    var id = watcher.id;

    if (!hash[id]) {
      /**
       * 因为异步的原因
       * 我们可以在这个时刻拿到多个相同watcher
       * 多个相同watcher合并成一个
       * 做到批量更新
       */
      hash[id] = true;
      queue.push(watcher);

      if (!pending) {
        nextTick(flushSchedulerQueue);
        pending = true;
      }
    }
  }

  var seenObjects = new Set();
  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */

  function traverse(val) {
    _traverse(val, seenObjects);

    seenObjects.clear();
  }

  function _traverse(val, seen) {
    var i, keys;
    var isA = Array.isArray(val);

    if (!isA && !isObject(val)) {
      return;
    }

    if (val.__ob__) {
      var depId = val.__ob__.dep.id;

      if (seen.has(depId)) {
        return;
      }

      seen.add(depId);
    }

    if (isA) {
      i = val.length;

      while (i--) {
        _traverse(val[i], seen);
      }
    } else {
      keys = Object.keys(val);
      i = keys.length;

      while (i--) {
        _traverse(val[keys[i]], seen);
      }
    }
  }

  var Watcher = /*#__PURE__*/function () {
    /**
     * 
     * @param {*} vm vue实例
     * @param {*} exprOrFn 触发收集依赖的前置操作
     * @param {*} callback 回调函数
     * @param {*} options 配置
     */
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      if (options) {
        this.user = !!options.user;
        this.sync = !!options.sync;
        this.lazy = !!options.lazy;
      } else {
        this.deep = this.user = this.lazy = this.sync = false;
      }

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.deps = [];
      this.depsId = new Set();

      if (typeof exprOrFn === 'function') {
        this.getter = exprOrFn;
      } else {
        /**
         * 这个时候还没有new完
         * 同时Dep.target也是null
         */
        this.getter = function () {
          var path = exprOrFn.split('.');
          var obj = vm;

          for (var i = 0; i > path.length; i++) {
            obj = obj[path[i]];
          }

          return obj;
        };
      }

      this.value = this.get();
      /**
       * this.deep=!!options.deep
       * 针对于用户watcher
       * 因为我们这样处理是一层属性
       * 如果深层的子属性
       * 也要收集watcher
       * 所以在这时候挨个访问这些变量触发依赖收集就行
       */
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this);
        var value = this.getter.call(this.vm);

        if (this.deep) {
          traverse(value);
        }

        popTarget();
        return value;
      }
    }, {
      key: "update",
      value: function update() {
        if (this.lazy) {
          this.dirty = true;
        } else if (this.sync) {
          this.run;
        } else {
          queuWatcher(this);
        }
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;
        /**
         * watcher去重
         * 一个数据多次取值
         * 所以说观察者和观察目标耦合很大
         */

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(this);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        console.log("这里");
        var value = this.get();
        var oldValue = this.value;
        this.value = value;

        if (this.user) {
          this.callback.call(this.vm, value, oldValue);
        }
      }
    }, {
      key: "evaluate",
      value: function evaluate() {
        this.value = this.get();
        this.dirty = false;
      }
    }, {
      key: "depend",
      value: function depend() {
        var i = this.deps.length;

        while (i--) {
          this.deps[i].depend();
        }
      }
    }]);

    return Watcher;
  }();

  /**
   * 什么是state:
   * 就是data+computed+watch等等
   */
  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) {
      initProps(vm);
    }

    if (opts.methods) {
      initMethods(vm);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm, opts.computed);
    }

    if (opts.watch) {
      initWatch(vm, opts.watch);
    }
  }

  function initData(vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === "function" ? data.call(vm) : data;

    for (var _key in data) {
      proxy(vm, "_data", _key);
    }

    observe(data);
  }

  function initProps(vm, propsOptions) {
    var props = vm._props = {};

    for (var _key2 in propsOptions) {
      defineReactive(props, _key2, propsOptions[_key2]);

      if (!(_key2 in vm)) {
        proxy(vm, "_props", propsOptions[_key2]);
      }
    }
  }
  /**
   * 不是让你实现
   * 而是看vue如何实现
   */


  function initMethods(vm, methods) {
    vm[key] = typeof methods[key] !== "function" ? noop : methods[key].bind(vm);
  }

  function initComputed(vm, computed) {
    /**
     * 存放计算属性的watcher
     */
    var watchers = vm._computedWatchers = {};

    for (var _key3 in computed) {
      var uerDef = computed[_key3];
      /**
       * 获取get方法
       */

      var getter = typeof userDef === "function" ? userDef : userDef.get;
      /**
       * 创建计算属性watcher
       */

      watchers[_key3] = new Watcher(vm, userDef, noop, {
        lazy: true
      });
      defineComputed(vm, _key3, userDef);
    }
  }

  var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function defineComputed(target, key, userDef) {
    if (typeof userDef === "function") {
      sharedPropertyDefinition.get = createComputedGetter(key);
    } else {
      sharedPropertyDefinition.get = createComputedGetter(userDef.get);
      sharedPropertyDefinition.set = userDef.set;
    }
    /**
     * 使用defineProperty定义
     * 我们可以通过this.getName这种形式获取得到
     */


    Object.defineProperty(target, key, sharedPropertyDefinition);
  }

  function createComputedGetter(key) {
    return function computedGetter() {
      var watcher = this._computedWatchers[key];

      if (watcher) {
        if (watcher.dirty) {
          // 如果dirty为true
          watcher.evaluate(); // 计算出新值，并将dirty 更新为false
        }
        /**
         * 在这里相当于触发了getter方法
         * 但是我们的computed watcher是data属性数据的依赖
         * computed属性本身依赖data数据 所以computed数据收集依赖实质就是data属性来收集依赖（其实就是收集渲染watcher）
         * 收集依赖
         */


        if (Dep.target) {
          // 计算属性在模板中使用 则存在Dep.target

          /**
           * 通过watcher找到该对应的观察目标 dep
           * dep把依赖（这时候是渲染watcher）收集起来
           */

          /**
           * 我们可以在业务中手动创建观察者 实现数据变化就更新
           * 但是通常这些场景都有watch代替了 而且对应的操作是cb
           */

          /**
                       * 为什么watcher要收集dep
                       * 我回答下 这就是为什么别人说观察者模式是耦合的 就是体现在这里
                       * 实例化watcher也有保存对应的dep 因为它要知道是哪些dep收集了他
                       * 第一是为了做watcher去重（watcher里面会保存一个dep Set 这种数据结构）
                       * 第二是针对于计算属性computed 实际上它就是一个计算属性watcher（观察者）
                       * 但它同时也是观察目标(因为template可能使用到它) 那么观察目标也是需要收集对应的依赖（收集watcher，这里是收集渲染watcher），
                       * 但是又回过头来说,computed属性实际是依赖于data属性变化而变化，也就是实际帮计算属性收集依赖也就是帮data属性收集依赖，这时候如何收集呢，
                       * 就是要使这个计算属性watcher保存好之前的观察目标B，这也就是为什么watcher要保存dep 此时这个观察目标B不仅收集了计算属性watcher，
                       * 而且会通过计算属性watcher来收集渲染watcher
                       */
          watcher.depend();
        }

        return watcher.value;
      }
    };
  }

  function initWatch(vm, watch) {
    /**
     * watch传入的参数多种多样
     * 统一都处理成key value形式
     */
    var keys = Object.keys(watch);
    keys.forEach(function (key) {
      var handler = watch[key];

      if (Array.isArray(handler)) {
        for (var i = 0; i > handler.length; i++) {
          /**
           * 为每个回调都创建一个watcher
           */
          createWatcher(vm, key, handler[i]);
        }
      } else {
        createWatcher(vm, key, handler);
      }
    });
  }

  function createWatcher(vm, exprOrFn, handler, options) {
    /**
     * 如果是对象则提取函数和配置
     */
    if (isObject$1(handler)) {
      options = handler;
      handler = handler.handler;
    }

    if (typeof handler === "string") {
      handler = vm[handler];
    }
    /**
     * watch的实新核心就是创建用户watcher
     * handler就是callback
     */


    return vm.$watch(exprOrFn, handler, options);
  }

  function stateMixin(Vue) {
    Vue.prototype.$watch = function (exprOrFn, cb) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      options.user = true;
      /**
       * 创建用户watcher
       */

      var watcher = new Watcher(this, exprOrFn, cb, options);

      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
    };
  }

  function vnode(tag, data, key, children, text, componentOptions) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text,
      componentOptions: componentOptions
    };
  }
  function isSameVnode(oldVnode, newVnode) {
    // 如果两个人的标签和key 一样我认为是同一个节点 虚拟节点一样我就可以复用真实节点了
    return oldVnode.tag === newVnode.tag && oldVnode.key === newVnode.key;
  }

  /**
   * 创建真实的dom方法
   * createElm创建真实的dom节点（包含文本节点）
   * createComponent 创建真实的组件dom节点
   */
  function patch(oldVnode, vnode) {
    /**
     * 判断是更新还是要渲染
     */
    if (!oldVnode) {
      return createElm(vnode);
    } else {
      /**
       * 判断是真实的dom节点
       */
      var isRealElement = oldVnode.nodeType;

      if (isRealElement) {
        var oldElm = oldVnode; // div id="app"

        var parentElm = oldElm.parentNode; // body

        var el = createElm(vnode);
        parentElm.insertBefore(el, oldElm.nextSibling);
        parentElm.removeChild(oldElm);
        return el;
      } else {
        /**
         * 两颗虚拟dom进行diff比对
                  * 边比对边更新
         */
        console.log("3s后即将开始diff更新");
        patchVnode(oldVnode, vnode);
      }
    } // 递归创建真实节点 替换掉老的节点

  }

  function createElm(vnode) {
    // 根据虚拟节点创建真实的节点
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text; // 是标签就创建标签

    if (typeof tag === "string") {
      // createElm需要返回真实节点
      if (createComponent(vnode)) {
        return vnode.componentInstance.$el;
      }

      vnode.el = document.createElement(tag);
      updateProperties(vnode);
      children.forEach(function (child) {
        // 递归创建儿子节点，将儿子节点扔到父节点中
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      /**
       * 虚拟dom上映射着真实dom  方便后续更新操作
       * 也就是在虚拟节点的el属性可以拿到其对应的真实节点
       */
      vnode.el = document.createTextNode(text);
    } // 如果不是标签就是文本


    return vnode.el;
  }
  /**
   * 
   * 创建生成新的属性或者
   * 复用标签,并且更新属性
   */


  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var newProps = vnode.data || {};
    var domElement = vnode.el; //真实DOM
    //先处理样式对象

    var oldStyle = oldProps.style || {};
    var newStyle = newProps.style || {}; //如果style属性在老的样式对象里有，新的没有，需要删除。如果老的没有，新的有要添加上

    for (var oldAttrName in oldStyle) {
      //oldStyle{color:'red',backgroundColor:'green'}
      if (!newStyle[oldAttrName]) {
        domElement.style[oldAttrName] = "";
      }
    } //把老的属性对象中的有，新的属性对象里没有的删除


    for (var oldPropName in oldProps) {
      if (!newProps[oldPropName]) {
        delete domElement[oldPropName];
      }
    } //添加的新的属性


    for (var newPropName in newProps) {
      if (newPropName === "style") {
        var styleObject = newProps.style; //拿取新的样式对象

        for (var newAttrName in styleObject) {
          domElement.style[newAttrName] = styleObject[newAttrName];
        }
      } else {
        //直接 更新 直接 拿 新的属性对象中属性的值覆盖掉真实DOM的属性
        domElement[newPropName] = newProps[newPropName];
      }
    }
  }

  function createComponent(vnode) {
    /**
     * 触发init方法
     * 生成组件的真实dom
     */
    var i = vnode.data;

    if ((i = i.hook) && (i = i.init)) {
      i(vnode);
    }

    if (vnode.componentInstance) {
      return true;
    }
  }

  function patchVnode(oldVnode, newVnode) {
    //1.如果新的虚拟DOM节点类型type不一样，直接重建
    if (oldVnode.type !== newVnode.type) {
      return oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
    } // 如果标签一致但是不存在则是文本节点


    if (!oldVnode.tag) {
      if (typeof newVnode.text !== "undefined") {
        return oldVnode.el.textContent = newVnode.text;
      }
    } //如果类型一样，要继续往下比较 1.比较属性 2比较它的儿子们
    //path就是找出新的虚拟DOM节点和老的虚拟DOM的差异，更新当前页面上的那个真实DOM


    var el = newVnode.el = oldVnode.el; //老的真实DOM节点
    //传入新的虚拟DOM节点和老的属性对象 更新老的真实DOM节点上的属性

    updateProperties(newVnode, oldVnode.data);
    var oldChildren = oldVnode.children; //老的虚拟DOM节点的儿子数组

    var newChildren = newVnode.children; //新的虚拟DOM节点儿子数组

    if (oldChildren.length > 0 && newChildren.length > 0) {
      updateChildren(el, oldChildren, newChildren);
    } else if (oldChildren.length > 0) {
      //老的有儿子，新的没儿子
      el.innerHTML = "";
    } else if (newChildren.length > 0) {
      //老的没有儿子，新的有儿子
      for (var i = 0; i < newChildren.length; i++) {
        el.appendChild(createElm(newChildren[i]));
      }
    }
  }

  function createKeyToIndexMap(children) {
    var map = {};

    for (var i = 0; i < children.length; i++) {
      var key = children[i].key;

      if (key) {
        map[key] = i;
      }
    }

    return map;
  }

  function updateChildren(parentDomElement, oldChildren, newChildren) {
    var oldStartIndex = 0,
        oldStartVnode = oldChildren[0]; //老的开始索引和老的开始节点

    var oldEndIndex = oldChildren.length - 1,
        oldEndVnode = oldChildren[oldEndIndex]; //老的结束索引和老的结束节点

    var newStartIndex = 0,
        newStartVnode = newChildren[0]; //新的开始索引和新的开始节点

    var newEndIndex = newChildren.length - 1,
        newEndVnode = newChildren[newEndIndex]; //新的结束索引和新的结束节点

    var oldKeyToIndexMap = createKeyToIndexMap(oldChildren); //两个队列都没有循环结束就要继续循环，如果有一个结束，就停止循环

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      //老的开始节点和新的开始节点进行比较
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldStartIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex];
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        //找到newStartVnode和oldStartVnode的的差异，并且更新到真实DOM上去oldStartVnode.domElement
        patchVnode(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex];
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        //老的结束和新的开始对应的把尾部的元素移动到头部
        patchVnode(oldEndVnode, newStartVnode);
        parentDomElement.insertBefore(oldEndVnode.domElement, oldStartVnode.domElement);
        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        //老的结束和新的开始对应的把尾部的元素移动到头部
        patchVnode(oldStartVnode, newEndVnode);
        parentDomElement.insertBefore(oldStartVnode.domElement, oldEndVnode.domElement.nextSi);
        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex]; //进行DOM移动 把老的开始真实DOM移动真实DOM的尾部
      } else {
        var oldIndexByKey = oldKeyToIndexMap[newStartVnode.key];

        if (oldIndexByKey == null) {
          parentDomElement.insertBefore(createElm(newStartVnode), oldStartVnode.domElement);
        } else {
          var oldVnodeToMove = oldChildren[oldIndexByKey];

          if (oldVnodeToMove.type !== newStartVnode.type) {
            /**
             * 删除重建
             */
            parentDomElement.insertBefore(createElm(newStartVnode), oldStartVnode.domElement);
          } else {
            patchVnode(oldVnodeToMove, newStartVnode);
            oldChildren[oldIndexByKey] = undefined;
            parentDomElement.insertBefore(oldVnodeToMove.domElement, oldStartVnode.domElement);
          }
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    }

    if (newStartIndex <= newEndIndex) {
      //是老的队列 处理完了，新的队列没处理完
      //我要把这个节点插入到谁的前面
      var beforeDOMElement = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].domElement;

      for (var i = newStartIndex; i <= newEndIndex; i++) {
        parentDomElement.insertBefore(createElm(newChildren[i]), beforeDOMElement);
      }
    }

    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        parentDomElement.removeChild(oldChildren[_i].domElement);
      }
    }
  }

  /**
   * 调用生命周期钩子
   */

  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      handlers.forEach(function (handler) {
        handler.call(vm);
      });
    }
  }
  function lifecyleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var prevVnode = vm._vnode;
      vm._vnode = vnode;

      if (!prevVnode) {
        /**
         * 第一次进行渲染页面不存在prevVnode
         * 直接创建真实的dom并进行挂载
         * 这个$el是真实的#app dom
         */
        vm.$el = patch(vm.$el, vnode);
      } else {
        /**
         * 更新时做diff操作
         */
        vm.$el = patch(prevVnode, vnode);
      }
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options;
    vm.$el = el;

    var updateComponent = function updateComponent() {
      vm._update(vm._render());
    };
    /**
     * 用vue开发应用
     * 这个就是由组件搭建而成的
     * 数据一变化 不是细微到更新某个dom节点
     * 而是组件级别的更新 就如updateComponent命名一样
     */


    new Watcher(vm, updateComponent, noop, true); // true表示他是一个渲染watcher
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>
  function parseHTML(html) {
    var root = null; // ast语法树的树根

    var currentParent; // 标识当前父亲是谁

    var stack = [];
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      // 遇到开始标签 就创建一个ast元素s
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 把当前元素标记成父ast树

      stack.push(element); // 将开始标签存放到栈中
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      var element = stack.pop(); // 拿到的是ast对象
      // 我要标识当前这个p是属于这个div的儿子的

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    }

    function parse(html) {
      // 不停的去解析html字符串
      while (html) {
        var textEnd = html.indexOf('<');

        if (textEnd === 0) {
          // 如果当前索引为0 肯定是一个标签 开始标签 结束标签
          var startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果 tagName,attrs

          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs); // 1解析开始标签

            continue; // 如果开始标签匹配完毕后 继续下一次 匹配
          }

          var endTagMatch = html.match(endTag);

          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]); // 2解析结束标签

            continue;
          }
        }

        var text = void 0;

        if (textEnd >= 0) {
          text = html.substring(0, textEnd);
        }

        if (text) {
          advance(text.length);
          chars(text); // 3解析文本
        }
      }

      function advance(n) {
        html = html.substring(n);
      }

      function parseStartTag() {
        var start = html.match(startTagOpen);

        if (start) {
          var match = {
            tagName: start[1],
            attrs: []
          };
          advance(start[0].length); // 将标签删除

          var _end, attr;

          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // 将属性进行解析
            advance(attr[0].length); // 将属性去掉

            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[5]
            });
          }

          if (_end) {
            // 去掉开始标签的 >
            advance(_end[0].length);
            return match;
          }
        }
      }

      return root;
    }

    return parse(html);
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    // 处理属性 拼接成属性的字符串
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          // style="color: red;fontSize:14px" => {style:{color:'red'},id:name,}
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      // 元素标签
      return generate(node);
    } else {
      var text = node.text; //   <div>a {{  name  }} b{{age}} c</div>

      var tokens = [];
      var match, index; // 每次的偏移量 buffer.split()

      var lastIndex = defaultTagRE.lastIndex = 0; // 只要是全局匹配 就需要将lastIndex每次匹配的时候调到0处

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function generate(el) {
    // [{name:'id',value:'app'},{}]  {id:app,a:1,b:2}
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")\n    ");
    return code;
  }

  function compileToFunction(template) {
    // 1) 解析html字符串 将html字符串 => ast语法树
    var root = parseHTML(template); // 需要将ast语法树生成最终的render函数  就是字符串拼接 （模板引擎）

    var code = generate(root); // 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))
    // 所有的模板引擎实现 都需要new Function + with

    /**
     * 传this是绑定作用域
     */

    var renderFn = new Function("with(this){ return ".concat(code, "}")); // vue的render 他返回的是虚拟dom

    return renderFn;
  }

  function eventsMixin(Vue) {
    /**
     * 遍历实例的所有事件
     * @param vm {Bue} bue实例
     * @param action {String} 动作类型,此处为'$on',代表绑定事件
     * @param events {Object} 事件对象,可能包含多个事件, 所以需要遍历
     */

    /**
    * Vue注册自定义事件通过$on进行注册
    * 注册事件及其回调函数到实例上
    * @param event {String} 事件名称
    * @param fn {Function} 事件对应的回调函数
    * @returns {Bue} 实例本身
    */
    Vue.prototype.$on = function (event, fn) {
      (this._events[event] || (this._events[event] = [])).push(fn);
      return this;
    };

    Vue.prototype.$emit = function (event, val) {
      var _this = this;

      var cbs = this._events[event];
      var shouldPropagate = true;

      if (cbs) {
        shouldPropagate = false; // 遍历执行事件

        var args = new Array(Array.from(arguments)[1]);
        cbs.forEach(function (cb) {
          var res = cb.apply(_this, args); // 就是这里, 决定了"只有当events事件返回true的时候, 事件才能在触发之后依然继续传播"

          if (res === true) {
            shouldPropagate = true;
          }
        });
      }

      return shouldPropagate;
    };
  }
  /**
   * 注册单个事件
   * @param vm {Bue} bue实例
   * @param action {String} 动作类型,此处为'$on',代表绑定事件
   * @param key {String} 事件名称, 比如: 'parent-name',代表从父组件那里传递了名称过来
   * @param event {Function} 触发key事件的时候, 对应的回调函数
   */

  function register(vm, action, key, event) {
    if (typeof event !== "function") return;
    vm[action](key, event);
  }

  function registerCallbacks(vm, action, events) {
    if (!events) return;

    for (var key in events) {
      var event = events[key];
      register(vm, action, key, event);
    }
  }

  function initEvents(vm) {
    vm._events = Object.create(null);
    registerCallbacks(this, "$on", vm._events);
  }

  /**
   * 初始化混入原型上的方法
   */

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      /**
       * 之所以这样写 显示知道this的指向
       */
      var vm = this;
      /**
       * 可能通过extend方式 所以使用vm.constructor.options
       * 而不直接Vue.options
       */

      vm.$options = mergeOptions(vm.constructor.options, options);
      /**
       * 初始化状态
       */

      initState(vm);
      initEvents(vm);
      callHook(vm, 'created');
      /***
       * 挂载流程
       */

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      /**
       * 单文件组件利用vue-loader会帮我们解析成render的
       */

      /**
       * vm实例的options配置
       * 一个组件也是一个vm实例
       * 所以组件生成的真实dom拿到template就行
       * <my-component>
       *    <div>
       *    </div>
       * </my-component>
       * 不要想象成上面👆这种结构 直接拿到template解析就行
       * 根本不需要考虑<my-component>
       */

      var template = options.template;
      /**
       * 如果没写template属性 去html拿
       */

      if (!template && el) {
        template = el.outerHTML;
      }
      /**
       * compileToFunction是将模板编译为JS语法
       * 执行render===>得到vnode
       */


      var render = compileToFunction(template);
      options.render = render;
      /**
       * 渲染当前的组件
       */

      mountComponent(vm, el);
    };
  }
  /**
   * 创建vue实例的时候我们同时是可以拿到真实的dom
   * 这点得知道 可以vm.$el上拿到
   */

  /**
   * 创建组件虚拟dom节点createComponent
   */

  function createComponent$1(vm, tag, data, key, children, Ctor) {
    // 获取父类构造函数
    var baseCtor = vm.$options._base;

    if (isObject$1(Ctor)) {
      Ctor = baseCtor.extend(Ctor);
    }

    data.hook = {
      // 组件的生命周期钩子
      init: function init(vnode) {
        var child = vnode.componentInstance = new Ctor({});
        /**
         * vnode.componentInstance就是vm实例
         * 执行$mount方法会将真实dom挂载在vm.$el
         * 我们可以通过vnode.componentInstance.$el拿到
         */

        child.$mount(); // 组件的挂载
      }
    };
    return vnode("vue-component-".concat(Ctor.cid, "-").concat(tag), data, key, undefined, {
      Ctor: Ctor,
      children: children
    });
  }

  /**
   * 创建虚拟dom的方法
   * createElement创建标签虚拟dom方法
   * createTextNode创建文本虚拟dom方法
   */

  function makeMap(str) {
    var map = {};
    var list = str.split(',');

    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }

    return function (key) {
      return map[key];
    };
  }

  var isReservedTag = makeMap('html,body,base,head,link,meta,style,title,' + 'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' + 'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' + 'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' + 's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' + 'embed,object,param,source,canvas,script,noscript,del,ins,' + 'caption,col,colgroup,table,thead,tbody,td,th,tr,' + 'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' + 'output,progress,select,textarea,' + 'details,dialog,menu,menuitem,summary,' + 'content,element,shadow,template,blockquote,iframe,tfoot');
  /**
   * 不用递归去创建 因为AST转化为JS语法的时候是这样调用的_c(...)
   */

  function createElement(context, tag) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    if (typeof tag === 'string') {
      if (isReservedTag(tag)) {
        return vnode(tag, data, key, children, undefined);
      } else {
        /**
         * 判断是组件
         * 如果是组件需要拿到组件定义的，通过组件的定义创造虚拟节点
         */
        var Ctor = context.$options.components[tag];
        return createComponent$1(context, tag, data, key, children, Ctor);
      }
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, [this].concat(Array.prototype.slice.call(arguments))); // tag,data,children1,children2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); // 去实例上 取值

      return vnode;
    };

    Vue.prototype.$nextTick = function (fn) {
      return nextTick(fn);
    };
  }

  function initExtend(Vue) {
    var cid = 0;

    Vue.extend = function (extendOptions) {
      var Super = this;

      var Sub = function VueComponent(options) {
        this._init(options);
      };

      Sub.cid = cid++;
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.options = mergeOptions(Super.options, extendOptions);
      return Sub;
    };
  }

  function initAssetRegisters(Vue) {
    Vue.component = function (id, definition) {
      definition.name = definition.name || id;
      /**
       * 生成一个新的组件类
       */

      definition = this.options._base.extend(definition);
      this.options['components'][id] = definition;
    };
  }

  function initMixin$1(Vue) {
    Vue.mixin = function (mixin) {
      /**
       * 这里的this指代Vue
       */

      /**
       * mergeOptions合并策略
       * 生命周期通过数组形式进行concat
       * 如果属性是对象 则合并两个对象
       * 其它则直接替代
       */

      /**
       * 之所以这样处理
       * 考虑多次调用Vue.mixin的情况
       * 然后mergeOptions也会在_init 初始化的时候调用 将Vue构造函数的options是实例化的options进行合并 
       * 合并策略是一致的
       * 这就是mixin的原理
       */
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function initGlobalAPI(Vue) {
    Vue.options = {};
    initMixin$1(Vue);
    /**
     * _base就是Vue的构造函数
     */

    Vue.options._base = Vue;
    Vue.options.components = {};
    /**
     * 注册API方法
     */

    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  function Vue(options) {
    /**
     * 进行初始化
     */
    this._init(options);
  }
  /**
   * 模块化思想
   * 拆分多个流程到不同文件上
   */


  initMixin(Vue);
  stateMixin(Vue);
  eventsMixin(Vue);
  lifecyleMixin(Vue);
  renderMixin(Vue);
  initGlobalAPI(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
