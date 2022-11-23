var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
import { getCurrentInstance, reactive, isRef, ref, onBeforeMount, onUnmounted, onServerPrefetch, unref, toRef, defineComponent, computed, h, resolveComponent, watchEffect, markRaw, inject, provide, Suspense, Transition, mergeProps, withCtx, createTextVNode, toDisplayString as toDisplayString$1, useSSRContext, createVNode, openBlock, createBlock, createCommentVNode, toRefs, onMounted, withAsyncContext, shallowRef, onErrorCaptured, defineAsyncComponent, createApp, watch, nextTick } from "vue";
import { withBase, withQuery, joinURL, hasProtocol, isEqual } from "ufo";
import { RouterView, createMemoryHistory, createRouter, useRoute as useRoute$1 } from "vue-router";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrRenderStyle, ssrRenderSuspense, ssrRenderClass } from "vue/server-renderer";
import { useRuntimeConfig as useRuntimeConfig$1 } from "#internal/nitro";
import Butter from "buttercms";
const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^["[{]|^-?\d[\d.]{0,14}$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor") {
    return;
  }
  return value;
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  const _lval = value.toLowerCase();
  if (_lval === "true") {
    return true;
  }
  if (_lval === "false") {
    return false;
  }
  if (_lval === "null") {
    return null;
  }
  if (_lval === "nan") {
    return Number.NaN;
  }
  if (_lval === "infinity") {
    return Number.POSITIVE_INFINITY;
  }
  if (_lval === "undefined") {
    return void 0;
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}
class FetchError extends Error {
  constructor() {
    super(...arguments);
    this.name = "FetchError";
  }
}
function createFetchError(request, error, response) {
  let message = "";
  if (request && response) {
    message = `${response.status} ${response.statusText} (${request.toString()})`;
  }
  if (error) {
    message = `${error.message} (${message})`;
  }
  const fetchError = new FetchError(message);
  Object.defineProperty(fetchError, "request", { get() {
    return request;
  } });
  Object.defineProperty(fetchError, "response", { get() {
    return response;
  } });
  Object.defineProperty(fetchError, "data", { get() {
    return response && response._data;
  } });
  Object.defineProperty(fetchError, "status", { get() {
    return response && response.status;
  } });
  Object.defineProperty(fetchError, "statusText", { get() {
    return response && response.statusText;
  } });
  Object.defineProperty(fetchError, "statusCode", { get() {
    return response && response.status;
  } });
  Object.defineProperty(fetchError, "statusMessage", { get() {
    return response && response.statusText;
  } });
  return fetchError;
}
const payloadMethods = new Set(Object.freeze(["PATCH", "POST", "PUT", "DELETE"]));
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(val) {
  if (val === void 0) {
    return false;
  }
  const t = typeof val;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(val)) {
    return true;
  }
  return val.constructor && val.constructor.name === "Object" || typeof val.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*`\-.^~]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift();
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  409,
  425,
  429,
  500,
  502,
  503,
  504
]);
function createFetch(globalOptions) {
  const { fetch: fetch2, Headers: Headers2 } = globalOptions;
  function onError(ctx) {
    const isAbort = ctx.error && ctx.error.name === "AbortError" || false;
    if (ctx.options.retry !== false && !isAbort) {
      const retries = typeof ctx.options.retry === "number" ? ctx.options.retry : isPayloadMethod(ctx.options.method) ? 0 : 1;
      const responseCode = ctx.response && ctx.response.status || 500;
      if (retries > 0 && retryStatusCodes.has(responseCode)) {
        return $fetchRaw(ctx.request, __spreadProps(__spreadValues({}, ctx.options), {
          retry: retries - 1
        }));
      }
    }
    const err = createFetchError(ctx.request, ctx.error, ctx.response);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(err, $fetchRaw);
    }
    throw err;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _opts = {}) {
    const ctx = {
      request: _request,
      options: __spreadValues(__spreadValues({}, globalOptions.defaults), _opts),
      response: void 0,
      error: void 0
    };
    if (ctx.options.onRequest) {
      await ctx.options.onRequest(ctx);
    }
    if (typeof ctx.request === "string") {
      if (ctx.options.baseURL) {
        ctx.request = withBase(ctx.request, ctx.options.baseURL);
      }
      if (ctx.options.query || ctx.options.params) {
        ctx.request = withQuery(ctx.request, __spreadValues(__spreadValues({}, ctx.options.params), ctx.options.query));
      }
      if (ctx.options.body && isPayloadMethod(ctx.options.method)) {
        if (isJSONSerializable(ctx.options.body)) {
          ctx.options.body = typeof ctx.options.body === "string" ? ctx.options.body : JSON.stringify(ctx.options.body);
          ctx.options.headers = new Headers2(ctx.options.headers);
          if (!ctx.options.headers.has("content-type")) {
            ctx.options.headers.set("content-type", "application/json");
          }
          if (!ctx.options.headers.has("accept")) {
            ctx.options.headers.set("accept", "application/json");
          }
        }
      }
    }
    ctx.response = await fetch2(ctx.request, ctx.options).catch(async (error) => {
      ctx.error = error;
      if (ctx.options.onRequestError) {
        await ctx.options.onRequestError(ctx);
      }
      return onError(ctx);
    });
    const responseType = (ctx.options.parseResponse ? "json" : ctx.options.responseType) || detectResponseType(ctx.response.headers.get("content-type") || "");
    if (responseType === "json") {
      const data = await ctx.response.text();
      const parseFn = ctx.options.parseResponse || destr;
      ctx.response._data = parseFn(data);
    } else if (responseType === "stream") {
      ctx.response._data = ctx.response.body;
    } else {
      ctx.response._data = await ctx.response[responseType]();
    }
    if (ctx.options.onResponse) {
      await ctx.options.onResponse(ctx);
    }
    if (ctx.response.status >= 400 && ctx.response.status < 600) {
      if (ctx.options.onResponseError) {
        await ctx.options.onResponseError(ctx);
      }
      return onError(ctx);
    }
    return ctx.response;
  };
  const $fetch2 = function $fetch22(request, opts) {
    return $fetchRaw(request, opts).then((r) => r._data);
  };
  $fetch2.raw = $fetchRaw;
  $fetch2.create = (defaultOptions = {}) => createFetch(__spreadProps(__spreadValues({}, globalOptions), {
    defaults: __spreadValues(__spreadValues({}, globalOptions.defaults), defaultOptions)
  }));
  return $fetch2;
}
const _globalThis$2 = function() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("unable to locate global object");
}();
const fetch = _globalThis$2.fetch || (() => Promise.reject(new Error("[ohmyfetch] global.fetch is not supported!")));
const Headers = _globalThis$2.Headers;
const $fetch = createFetch({ fetch, Headers });
const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const buildAssetsDir = () => appConfig.buildAssetsDir;
const buildAssetsURL = (...path) => joinURL(publicAssetsURL(), buildAssetsDir(), ...path);
const publicAssetsURL = (...path) => {
  const publicBase = appConfig.cdnURL || appConfig.baseURL;
  return path.length ? joinURL(publicBase, ...path) : publicBase;
};
function flatHooks(configHooks, hooks = {}, parentName) {
  for (const key in configHooks) {
    const subHook = configHooks[key];
    const name = parentName ? `${parentName}:${key}` : key;
    if (typeof subHook === "object" && subHook !== null) {
      flatHooks(subHook, hooks, name);
    } else if (typeof subHook === "function") {
      hooks[name] = subHook;
    }
  }
  return hooks;
}
function serialCaller(hooks, args) {
  return hooks.reduce((promise, hookFn) => promise.then(() => hookFn.apply(void 0, args)), Promise.resolve(null));
}
function parallelCaller(hooks, args) {
  return Promise.all(hooks.map((hook) => hook.apply(void 0, args)));
}
class Hookable {
  constructor() {
    this._hooks = {};
    this._deprecatedHooks = {};
    this.hook = this.hook.bind(this);
    this.callHook = this.callHook.bind(this);
    this.callHookWith = this.callHookWith.bind(this);
  }
  hook(name, fn) {
    if (!name || typeof fn !== "function") {
      return () => {
      };
    }
    const originalName = name;
    let deprecatedHookObj;
    while (this._deprecatedHooks[name]) {
      const deprecatedHook = this._deprecatedHooks[name];
      if (typeof deprecatedHook === "string") {
        deprecatedHookObj = { to: deprecatedHook };
      } else {
        deprecatedHookObj = deprecatedHook;
      }
      name = deprecatedHookObj.to;
    }
    if (deprecatedHookObj) {
      if (!deprecatedHookObj.message) {
        console.warn(`${originalName} hook has been deprecated` + (deprecatedHookObj.to ? `, please use ${deprecatedHookObj.to}` : ""));
      } else {
        console.warn(deprecatedHookObj.message);
      }
    }
    this._hooks[name] = this._hooks[name] || [];
    this._hooks[name].push(fn);
    return () => {
      if (fn) {
        this.removeHook(name, fn);
        fn = null;
      }
    };
  }
  hookOnce(name, fn) {
    let _unreg;
    let _fn = (...args) => {
      _unreg();
      _unreg = null;
      _fn = null;
      return fn(...args);
    };
    _unreg = this.hook(name, _fn);
    return _unreg;
  }
  removeHook(name, fn) {
    if (this._hooks[name]) {
      const idx = this._hooks[name].indexOf(fn);
      if (idx !== -1) {
        this._hooks[name].splice(idx, 1);
      }
      if (this._hooks[name].length === 0) {
        delete this._hooks[name];
      }
    }
  }
  deprecateHook(name, deprecated) {
    this._deprecatedHooks[name] = deprecated;
  }
  deprecateHooks(deprecatedHooks) {
    Object.assign(this._deprecatedHooks, deprecatedHooks);
  }
  addHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    const removeFns = Object.keys(hooks).map((key) => this.hook(key, hooks[key]));
    return () => {
      removeFns.splice(0, removeFns.length).forEach((unreg) => unreg());
    };
  }
  removeHooks(configHooks) {
    const hooks = flatHooks(configHooks);
    for (const key in hooks) {
      this.removeHook(key, hooks[key]);
    }
  }
  callHook(name, ...args) {
    return serialCaller(this._hooks[name] || [], args);
  }
  callHookParallel(name, ...args) {
    return parallelCaller(this._hooks[name] || [], args);
  }
  callHookWith(caller, name, ...args) {
    return caller(this._hooks[name] || [], args);
  }
}
function createHooks() {
  return new Hookable();
}
function createContext() {
  let currentInstance = null;
  let isSingleton = false;
  const checkConflict = (instance) => {
    if (currentInstance && currentInstance !== instance) {
      throw new Error("Context conflict");
    }
  };
  return {
    use: () => currentInstance,
    set: (instance, replace) => {
      if (!replace) {
        checkConflict(instance);
      }
      currentInstance = instance;
      isSingleton = true;
    },
    unset: () => {
      currentInstance = null;
      isSingleton = false;
    },
    call: (instance, cb) => {
      checkConflict(instance);
      currentInstance = instance;
      try {
        return cb();
      } finally {
        if (!isSingleton) {
          currentInstance = null;
        }
      }
    },
    async callAsync(instance, cb) {
      currentInstance = instance;
      const onRestore = () => {
        currentInstance = instance;
      };
      const onLeave = () => currentInstance === instance ? onRestore : void 0;
      asyncHandlers.add(onLeave);
      try {
        const r = cb();
        if (!isSingleton) {
          currentInstance = null;
        }
        return await r;
      } finally {
        asyncHandlers.delete(onLeave);
      }
    }
  };
}
function createNamespace() {
  const contexts = {};
  return {
    get(key) {
      if (!contexts[key]) {
        contexts[key] = createContext();
      }
      contexts[key];
      return contexts[key];
    }
  };
}
const _globalThis$1 = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof global !== "undefined" ? global : {};
const globalKey = "__unctx__";
const defaultNamespace = _globalThis$1[globalKey] || (_globalThis$1[globalKey] = createNamespace());
const getContext = (key) => defaultNamespace.get(key);
const asyncHandlersKey = "__unctx_async_handlers__";
const asyncHandlers = _globalThis$1[asyncHandlersKey] || (_globalThis$1[asyncHandlersKey] = /* @__PURE__ */ new Set());
function createMock(name, overrides = {}) {
  const fn = function() {
  };
  fn.prototype.name = name;
  const props = {};
  return new Proxy(fn, {
    get(_target, prop) {
      if (prop === "caller") {
        return null;
      }
      if (prop === "__createMock__") {
        return createMock;
      }
      if (prop in overrides) {
        return overrides[prop];
      }
      return props[prop] = props[prop] || createMock(`${name}.${prop.toString()}`);
    },
    apply(_target, _this, _args) {
      return createMock(`${name}()`);
    },
    construct(_target, _args, _newT) {
      return createMock(`[${name}]`);
    },
    enumerate(_target) {
      return [];
    }
  });
}
const mockContext = createMock("mock");
function mock(warning) {
  console.warn(warning);
  return mockContext;
}
const unsupported = /* @__PURE__ */ new Set([
  "store",
  "spa",
  "fetchCounters"
]);
const todo = /* @__PURE__ */ new Set([
  "isHMR",
  "base",
  "payload",
  "from",
  "next",
  "error",
  "redirect",
  "redirected",
  "enablePreview",
  "$preview",
  "beforeNuxtRender",
  "beforeSerialize"
]);
const routerKeys = ["route", "params", "query"];
const staticFlags = {
  isClient: false,
  isServer: true,
  isDev: false,
  isStatic: void 0,
  target: "server",
  modern: false
};
const legacyPlugin = (nuxtApp) => {
  nuxtApp._legacyContext = new Proxy(nuxtApp, {
    get(nuxt, p) {
      if (unsupported.has(p)) {
        return mock(`Accessing ${p} is not supported in Nuxt 3.`);
      }
      if (todo.has(p)) {
        return mock(`Accessing ${p} is not yet supported in Nuxt 3.`);
      }
      if (routerKeys.includes(p)) {
        if (!("$router" in nuxtApp)) {
          return mock("vue-router is not being used in this project.");
        }
        switch (p) {
          case "route":
            return nuxt.$router.currentRoute.value;
          case "params":
          case "query":
            return nuxt.$router.currentRoute.value[p];
        }
      }
      if (p === "$config" || p === "env") {
        return useRuntimeConfig();
      }
      if (p in staticFlags) {
        return staticFlags[p];
      }
      if (p === "ssrContext") {
        return nuxt._legacyContext;
      }
      if (nuxt.ssrContext && p in nuxt.ssrContext) {
        return nuxt.ssrContext[p];
      }
      if (p === "nuxt") {
        return nuxt.payload;
      }
      if (p === "nuxtState") {
        return nuxt.payload.data;
      }
      if (p in nuxtApp.vueApp) {
        return nuxtApp.vueApp[p];
      }
      if (p in nuxtApp) {
        return nuxtApp[p];
      }
      return mock(`Accessing ${p} is not supported in Nuxt3.`);
    }
  });
};
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  const nuxtApp = __spreadValues({
    provide: void 0,
    globalName: "nuxt",
    payload: reactive(__spreadValues({
      data: {},
      state: {},
      _errors: {}
    }, { serverRendered: true })),
    isHydrating: false,
    _asyncDataPromises: {}
  }, options);
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  if (nuxtApp.ssrContext) {
    nuxtApp.ssrContext.nuxt = nuxtApp;
  }
  {
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    nuxtApp.ssrContext.payload = nuxtApp.payload;
  }
  {
    nuxtApp.payload.config = {
      public: options.ssrContext.runtimeConfig.public,
      app: options.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      var _a;
      if (prop === "public") {
        return target.public;
      }
      return (_a = target[prop]) != null ? _a : target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  let needsLegacyContext = false;
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return () => {
      };
    }
    if (isLegacyPlugin(plugin)) {
      needsLegacyContext = true;
      return (nuxtApp) => plugin(nuxtApp._legacyContext, nuxtApp.provide);
    }
    return plugin;
  });
  if (needsLegacyContext) {
    plugins2.unshift(legacyPlugin);
  }
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function isLegacyPlugin(plugin) {
  return !plugin[NuxtPluginIndicator];
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const vm = getCurrentInstance();
  if (!vm) {
    const nuxtAppInstance = nuxtAppCtx.use();
    if (!nuxtAppInstance) {
      throw new Error("nuxt instance unavailable");
    }
    return nuxtAppInstance;
  }
  return vm.appContext.app.$nuxt;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const wrapInRef = (value) => isRef(value) ? value : ref(value);
const getDefault = () => null;
function useAsyncData(key, handler, options = {}) {
  var _a, _b, _c, _d, _e;
  if (typeof key !== "string") {
    throw new TypeError("asyncData key must be a string");
  }
  if (typeof handler !== "function") {
    throw new TypeError("asyncData handler must be a function");
  }
  options = __spreadValues({ server: true, default: getDefault }, options);
  if (options.defer) {
    console.warn("[useAsyncData] `defer` has been renamed to `lazy`. Support for `defer` will be removed in RC.");
  }
  options.lazy = (_b = (_a = options.lazy) != null ? _a : options.defer) != null ? _b : false;
  options.initialCache = (_c = options.initialCache) != null ? _c : true;
  const nuxt = useNuxtApp();
  const instance = getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const useInitialCache = () => options.initialCache && nuxt.payload.data[key] !== void 0;
  const asyncData = {
    data: wrapInRef((_d = nuxt.payload.data[key]) != null ? _d : options.default()),
    pending: ref(!useInitialCache()),
    error: ref((_e = nuxt.payload._errors[key]) != null ? _e : null)
  };
  asyncData.refresh = (opts = {}) => {
    if (nuxt._asyncDataPromises[key]) {
      return nuxt._asyncDataPromises[key];
    }
    if (opts._initial && useInitialCache()) {
      return nuxt.payload.data[key];
    }
    asyncData.pending.value = true;
    nuxt._asyncDataPromises[key] = Promise.resolve(handler(nuxt)).then((result) => {
      if (options.transform) {
        result = options.transform(result);
      }
      if (options.pick) {
        result = pick(result, options.pick);
      }
      asyncData.data.value = result;
      asyncData.error.value = null;
    }).catch((error) => {
      asyncData.error.value = error;
      asyncData.data.value = unref(options.default());
    }).finally(() => {
      asyncData.pending.value = false;
      nuxt.payload.data[key] = asyncData.data.value;
      if (asyncData.error.value) {
        nuxt.payload._errors[key] = true;
      }
      delete nuxt._asyncDataPromises[key];
    });
    return nuxt._asyncDataPromises[key];
  };
  const initialFetch = () => asyncData.refresh({ _initial: true });
  const fetchOnServer = options.server !== false && nuxt.payload.serverRendered;
  if (fetchOnServer) {
    const promise = initialFetch();
    onServerPrefetch(() => promise);
  }
  const asyncDataPromise = Promise.resolve(nuxt._asyncDataPromises[key]).then(() => asyncData);
  Object.assign(asyncDataPromise, asyncData);
  return asyncDataPromise;
}
function pick(obj, keys) {
  const newObj = {};
  for (const key of keys) {
    newObj[key] = obj[key];
  }
  return newObj;
}
const useState = (key, init) => {
  const nuxt = useNuxtApp();
  const state2 = toRef(nuxt.payload.state, key);
  if (state2.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state2.value = initialValue;
  }
  return state2;
};
const useError = () => {
  const nuxtApp = useNuxtApp();
  return useState("error", () => nuxtApp.ssrContext.error);
};
const throwError = (_err) => {
  const nuxtApp = useNuxtApp();
  useError();
  const err = typeof _err === "string" ? new Error(_err) : _err;
  nuxtApp.callHook("app:error", err);
  {
    nuxtApp.ssrContext.error = nuxtApp.ssrContext.error || err;
  }
  return err;
};
const MIMES = {
  html: "text/html",
  json: "application/json"
};
const defer = typeof setImmediate !== "undefined" ? setImmediate : (fn) => fn();
function send(event, data, type) {
  if (type) {
    defaultContentType(event, type);
  }
  return new Promise((resolve) => {
    defer(() => {
      event.res.end(data);
      resolve(void 0);
    });
  });
}
function defaultContentType(event, type) {
  if (type && !event.res.getHeader("Content-Type")) {
    event.res.setHeader("Content-Type", type);
  }
}
function sendRedirect(event, location, code = 302) {
  event.res.statusCode = code;
  event.res.setHeader("Location", location);
  return send(event, "Redirecting to " + location, MIMES.html);
}
class H3Error extends Error {
  constructor() {
    super(...arguments);
    this.statusCode = 500;
    this.statusMessage = "H3Error";
  }
}
function createError(input) {
  var _a;
  if (input instanceof H3Error) {
    return input;
  }
  const err = new H3Error((_a = input.message) != null ? _a : input.statusMessage);
  if (input.statusCode) {
    err.statusCode = input.statusCode;
  }
  if (input.statusMessage) {
    err.statusMessage = input.statusMessage;
  }
  if (input.data) {
    err.data = input.data;
  }
  return err;
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options = {}) => {
  if (!to) {
    to = "/";
  }
  if (isProcessingMiddleware()) {
    return to;
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      const redirectLocation = joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, options.redirectCode || 301));
    }
  }
  return options.replace ? router.replace(to) : router.push(to);
};
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options) {
  const componentName = options.componentName || "NuxtLink";
  const checkPropConflicts = (props, main2, sub) => {
  };
  return defineComponent({
    name: componentName,
    props: {
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        checkPropConflicts(props, "to", "href");
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      return () => {
        var _a, _b, _c;
        if (!isExternal.value) {
          return h(resolveComponent("RouterLink"), {
            to: to.value,
            activeClass: props.activeClass || options.activeClass,
            exactActiveClass: props.exactActiveClass || options.exactActiveClass,
            replace: props.replace,
            ariaCurrentValue: props.ariaCurrentValue
          }, slots.default);
        }
        const href = typeof to.value === "object" ? (_b = (_a = router.resolve(to.value)) == null ? void 0 : _a.href) != null ? _b : null : to.value || null;
        const target = props.target || null;
        checkPropConflicts(props, "noRel", "rel");
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        return h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
      };
    }
  });
}
const __nuxt_component_0$1 = defineNuxtLink({ componentName: "NuxtLink" });
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var shared_cjs_prod = {};
Object.defineProperty(shared_cjs_prod, "__esModule", { value: true });
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const PatchFlagNames = {
  [1]: `TEXT`,
  [2]: `CLASS`,
  [4]: `STYLE`,
  [8]: `PROPS`,
  [16]: `FULL_PROPS`,
  [32]: `HYDRATE_EVENTS`,
  [64]: `STABLE_FRAGMENT`,
  [128]: `KEYED_FRAGMENT`,
  [256]: `UNKEYED_FRAGMENT`,
  [512]: `NEED_PATCH`,
  [1024]: `DYNAMIC_SLOTS`,
  [2048]: `DEV_ROOT_FRAGMENT`,
  [-1]: `HOISTED`,
  [-2]: `BAIL`
};
const slotFlagsText = {
  [1]: "STABLE",
  [2]: "DYNAMIC",
  [3]: "FORWARDED"
};
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const range = 2;
function generateCodeFrame(source, start = 0, end = source.length) {
  let lines = source.split(/(\r?\n)/);
  const newlineSequences = lines.filter((_, idx) => idx % 2 === 1);
  lines = lines.filter((_, idx) => idx % 2 === 0);
  let count = 0;
  const res = [];
  for (let i = 0; i < lines.length; i++) {
    count += lines[i].length + (newlineSequences[i] && newlineSequences[i].length || 0);
    if (count >= start) {
      for (let j = i - range; j <= i + range || end > count; j++) {
        if (j < 0 || j >= lines.length)
          continue;
        const line = j + 1;
        res.push(`${line}${" ".repeat(Math.max(3 - String(line).length, 0))}|  ${lines[j]}`);
        const lineLength = lines[j].length;
        const newLineSeqLength = newlineSequences[j] && newlineSequences[j].length || 0;
        if (j === i) {
          const pad = start - (count - (lineLength + newLineSeqLength));
          const length = Math.max(1, end > count ? lineLength - pad : end - start);
          res.push(`   |  ` + " ".repeat(pad) + "^".repeat(length));
        } else if (j > i) {
          if (end > count) {
            const length = Math.max(Math.min(end - count, lineLength), 1);
            res.push(`   |  ` + "^".repeat(length));
          }
          count += lineLength + newLineSeqLength;
        }
      }
      break;
    }
  }
  return res.join("\n");
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
const isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const unsafeAttrCharRE = /[>/="'\u0009\u000a\u000c\u0020]/;
const attrValidationCache = {};
function isSSRSafeAttrName(name) {
  if (attrValidationCache.hasOwnProperty(name)) {
    return attrValidationCache[name];
  }
  const isUnsafe = unsafeAttrCharRE.test(name);
  if (isUnsafe) {
    console.error(`unsafe attribute name: ${name}`);
  }
  return attrValidationCache[name] = !isUnsafe;
}
const propsToAttrMap = {
  acceptCharset: "accept-charset",
  className: "class",
  htmlFor: "for",
  httpEquiv: "http-equiv"
};
const isNoUnitNumericStyleProp = /* @__PURE__ */ makeMap(`animation-iteration-count,border-image-outset,border-image-slice,border-image-width,box-flex,box-flex-group,box-ordinal-group,column-count,columns,flex,flex-grow,flex-positive,flex-shrink,flex-negative,flex-order,grid-row,grid-row-end,grid-row-span,grid-row-start,grid-column,grid-column-end,grid-column-span,grid-column-start,font-weight,line-clamp,line-height,opacity,order,orphans,tab-size,widows,z-index,zoom,fill-opacity,flood-opacity,stop-opacity,stroke-dasharray,stroke-dashoffset,stroke-miterlimit,stroke-opacity,stroke-width`);
const isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
const isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function stringifyStyle(styles) {
  let ret = "";
  if (!styles || isString(styles)) {
    return ret;
  }
  for (const key in styles) {
    const value = styles[key];
    const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
    if (isString(value) || typeof value === "number" && isNoUnitNumericStyleProp(normalizedKey)) {
      ret += `${normalizedKey}:${value};`;
    }
  }
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistanceLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
const VOID_TAGS = "area,base,br,col,embed,hr,img,input,link,meta,param,source,track,wbr";
const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
const isVoidTag = /* @__PURE__ */ makeMap(VOID_TAGS);
const escapeRE = /["'&<>]/;
function escapeHtml(string) {
  const str = "" + string;
  const match = escapeRE.exec(str);
  if (!match) {
    return str;
  }
  let html = "";
  let escaped;
  let index2;
  let lastIndex = 0;
  for (index2 = match.index; index2 < str.length; index2++) {
    switch (str.charCodeAt(index2)) {
      case 34:
        escaped = "&quot;";
        break;
      case 38:
        escaped = "&amp;";
        break;
      case 39:
        escaped = "&#39;";
        break;
      case 60:
        escaped = "&lt;";
        break;
      case 62:
        escaped = "&gt;";
        break;
      default:
        continue;
    }
    if (lastIndex !== index2) {
      html += str.slice(lastIndex, index2);
    }
    lastIndex = index2 + 1;
    html += escaped;
  }
  return lastIndex !== index2 ? html + str.slice(lastIndex, index2) : html;
}
const commentStripRE = /^-?>|<!--|-->|--!>|<!-$/g;
function escapeHtmlComment(src) {
  return src.replace(commentStripRE, "");
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject$1(a);
  bValidType = isObject$1(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof commonjsGlobal !== "undefined" ? commonjsGlobal : {});
};
const identRE = /^[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*$/;
function genPropsAccessExp(name) {
  return identRE.test(name) ? `__props.${name}` : `__props[${JSON.stringify(name)}]`;
}
shared_cjs_prod.EMPTY_ARR = EMPTY_ARR;
shared_cjs_prod.EMPTY_OBJ = EMPTY_OBJ;
shared_cjs_prod.NO = NO;
shared_cjs_prod.NOOP = NOOP;
shared_cjs_prod.PatchFlagNames = PatchFlagNames;
shared_cjs_prod.camelize = camelize;
shared_cjs_prod.capitalize = capitalize;
shared_cjs_prod.def = def;
shared_cjs_prod.escapeHtml = escapeHtml;
shared_cjs_prod.escapeHtmlComment = escapeHtmlComment;
shared_cjs_prod.extend = extend;
shared_cjs_prod.genPropsAccessExp = genPropsAccessExp;
shared_cjs_prod.generateCodeFrame = generateCodeFrame;
shared_cjs_prod.getGlobalThis = getGlobalThis;
shared_cjs_prod.hasChanged = hasChanged;
shared_cjs_prod.hasOwn = hasOwn;
shared_cjs_prod.hyphenate = hyphenate;
shared_cjs_prod.includeBooleanAttr = includeBooleanAttr;
shared_cjs_prod.invokeArrayFns = invokeArrayFns;
shared_cjs_prod.isArray = isArray;
shared_cjs_prod.isBooleanAttr = isBooleanAttr;
shared_cjs_prod.isBuiltInDirective = isBuiltInDirective;
shared_cjs_prod.isDate = isDate;
var isFunction_1 = shared_cjs_prod.isFunction = isFunction;
shared_cjs_prod.isGloballyWhitelisted = isGloballyWhitelisted;
shared_cjs_prod.isHTMLTag = isHTMLTag;
shared_cjs_prod.isIntegerKey = isIntegerKey;
shared_cjs_prod.isKnownHtmlAttr = isKnownHtmlAttr;
shared_cjs_prod.isKnownSvgAttr = isKnownSvgAttr;
shared_cjs_prod.isMap = isMap;
shared_cjs_prod.isModelListener = isModelListener;
shared_cjs_prod.isNoUnitNumericStyleProp = isNoUnitNumericStyleProp;
shared_cjs_prod.isObject = isObject$1;
shared_cjs_prod.isOn = isOn;
shared_cjs_prod.isPlainObject = isPlainObject;
shared_cjs_prod.isPromise = isPromise;
shared_cjs_prod.isReservedProp = isReservedProp;
shared_cjs_prod.isSSRSafeAttrName = isSSRSafeAttrName;
shared_cjs_prod.isSVGTag = isSVGTag;
shared_cjs_prod.isSet = isSet;
shared_cjs_prod.isSpecialBooleanAttr = isSpecialBooleanAttr;
shared_cjs_prod.isString = isString;
shared_cjs_prod.isSymbol = isSymbol;
shared_cjs_prod.isVoidTag = isVoidTag;
shared_cjs_prod.looseEqual = looseEqual;
shared_cjs_prod.looseIndexOf = looseIndexOf;
shared_cjs_prod.makeMap = makeMap;
shared_cjs_prod.normalizeClass = normalizeClass;
shared_cjs_prod.normalizeProps = normalizeProps;
shared_cjs_prod.normalizeStyle = normalizeStyle;
shared_cjs_prod.objectToString = objectToString;
shared_cjs_prod.parseStringStyle = parseStringStyle;
shared_cjs_prod.propsToAttrMap = propsToAttrMap;
shared_cjs_prod.remove = remove;
shared_cjs_prod.slotFlagsText = slotFlagsText;
shared_cjs_prod.stringifyStyle = stringifyStyle;
shared_cjs_prod.toDisplayString = toDisplayString;
shared_cjs_prod.toHandlerKey = toHandlerKey;
shared_cjs_prod.toNumber = toNumber;
shared_cjs_prod.toRawType = toRawType;
shared_cjs_prod.toTypeString = toTypeString;
function useHead(meta2) {
  const resolvedMeta = isFunction_1(meta2) ? computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
const bootstrap_min = "";
const main = "";
const lineicons = "";
const tinySlider = "";
const preload = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.mixin({
    beforeCreate() {
      const { _registeredComponents } = this.$nuxt.ssrContext;
      const { __moduleIdentifier } = this.$options;
      _registeredComponents.add(__moduleIdentifier);
    }
  });
});
const components = {};
function componentsPlugin_6d20bcd1(nuxtApp) {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
}
var __defProp2 = Object.defineProperty;
var __defProps2 = Object.defineProperties;
var __getOwnPropDescs2 = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp2.call(b, prop))
      __defNormalProp2(a, prop, b[prop]);
  if (__getOwnPropSymbols2)
    for (var prop of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop))
        __defNormalProp2(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps2 = (a, b) => __defProps2(a, __getOwnPropDescs2(b));
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var SELF_CLOSING_TAGS = ["meta", "link", "base"];
var createElement = (tag, attrs, document2) => {
  const el = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el.textContent = value;
    } else {
      el.setAttribute(key, value);
    }
  }
  return el;
};
var htmlEscape = (str) => str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
var stringifyAttrs = (attributes) => {
  const handledAttributes = [];
  for (let [key, value] of Object.entries(attributes)) {
    if (key === "children" || key === "key") {
      continue;
    }
    if (value === false || value == null) {
      continue;
    }
    let attribute = htmlEscape(key);
    if (value !== true) {
      attribute += `="${htmlEscape(String(value))}"`;
    }
    handledAttributes.push(attribute);
  }
  return handledAttributes.length > 0 ? " " + handledAttributes.join(" ") : "";
};
function isEqualNode(oldTag, newTag) {
  if (oldTag instanceof HTMLElement && newTag instanceof HTMLElement) {
    const nonce = newTag.getAttribute("nonce");
    if (nonce && !oldTag.getAttribute("nonce")) {
      const cloneTag = newTag.cloneNode(true);
      cloneTag.setAttribute("nonce", "");
      cloneTag.nonce = nonce;
      return nonce === oldTag.nonce && oldTag.isEqualNode(cloneTag);
    }
  }
  return oldTag.isEqualNode(newTag);
}
var getTagKey = (props) => {
  const names = ["key", "id", "name", "property"];
  for (const n of names) {
    const value = typeof props.getAttribute === "function" ? props.hasAttribute(n) ? props.getAttribute(n) : void 0 : props[n];
    if (value !== void 0) {
      return { name: n, value };
    }
  }
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el, attrs) => {
  const existingAttrs = el.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      if (!(key in attrs)) {
        el.removeAttribute(key);
      }
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var updateElements = (document2 = window.document, type, tags) => {
  var _a;
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = (j == null ? void 0 : j.previousElementSibling) || null) {
      if (((_a = j == null ? void 0 : j.tagName) == null ? void 0 : _a.toLowerCase()) === type) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  let newElements = tags.map((tag) => createElement(tag.tag, tag.props, document2));
  newElements = newElements.filter((newEl) => {
    for (let i = 0; i < oldElements.length; i++) {
      const oldEl = oldElements[i];
      if (isEqualNode(oldEl, newEl)) {
        oldElements.splice(i, 1);
        return false;
      }
    }
    return true;
  });
  oldElements.forEach((t) => {
    var _a2;
    return (_a2 = t.parentNode) == null ? void 0 : _a2.removeChild(t);
  });
  newElements.forEach((t) => {
    head.insertBefore(t, headCountEl);
  });
  headCountEl.setAttribute("content", "" + (headCount - oldElements.length + newElements.length));
};
var createHead = () => {
  let allHeadObjs = [];
  let previousTags = /* @__PURE__ */ new Set();
  const head = {
    install(app) {
      app.config.globalProperties.$head = head;
      app.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base" || tag.tag === "script") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2 = window.document) {
      let title;
      let htmlAttrs = {};
      let bodyAttrs = {};
      const actualTags = {};
      for (const tag of head.headTags) {
        if (tag.tag === "title") {
          title = tag.props.children;
          continue;
        }
        if (tag.tag === "htmlAttrs") {
          Object.assign(htmlAttrs, tag.props);
          continue;
        }
        if (tag.tag === "bodyAttrs") {
          Object.assign(bodyAttrs, tag.props);
          continue;
        }
        actualTags[tag.tag] = actualTags[tag.tag] || [];
        actualTags[tag.tag].push(tag);
      }
      if (title !== void 0) {
        document2.title = title;
      }
      setAttrs(document2.documentElement, htmlAttrs);
      setAttrs(document2.body, bodyAttrs);
      const tags = /* @__PURE__ */ new Set([...Object.keys(actualTags), ...previousTags]);
      for (const tag of tags) {
        updateElements(document2, tag, actualTags[tag] || []);
      }
      previousTags.clear();
      Object.keys(actualTags).forEach((i) => previousTags.add(i));
    }
  };
  return head;
};
var tagToString = (tag) => {
  let attrs = stringifyAttrs(tag.props);
  if (SELF_CLOSING_TAGS.includes(tag.tag)) {
    return `<${tag.tag}${attrs}>`;
  }
  return `<${tag.tag}${attrs}>${tag.props.children || ""}</${tag.tag}>`;
};
var renderHeadToString = (head) => {
  const tags = [];
  let titleTag = "";
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of head.headTags) {
    if (tag.tag === "title") {
      titleTag = tagToString(tag);
    } else if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
    } else if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
    } else {
      tags.push(tagToString(tag));
    }
  }
  tags.push(`<meta name="${HEAD_COUNT_KEY}" content="${tags.length}">`);
  return {
    get headTags() {
      return titleTag + tags.join("");
    },
    get htmlAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, htmlAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(htmlAttrs).join(",")
      }));
    },
    get bodyAttrs() {
      return stringifyAttrs(__spreadProps2(__spreadValues2({}, bodyAttrs), {
        [HEAD_ATTRS_KEY]: Object.keys(bodyAttrs).join(",")
      }));
    }
  };
};
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
const defu = createDefu();
const vueuseHead_04557d67 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    watchEffect(() => {
      head.updateDOM();
    });
  });
  const titleTemplate = ref();
  nuxtApp._useHead = (_meta) => {
    const meta2 = ref(_meta);
    if ("titleTemplate" in meta2.value) {
      titleTemplate.value = meta2.value.titleTemplate;
    }
    const headObj = computed(() => {
      const overrides = { meta: [] };
      if (titleTemplate.value && "title" in meta2.value) {
        overrides.title = typeof titleTemplate.value === "function" ? titleTemplate.value(meta2.value.title) : titleTemplate.value.replace(/%s/g, meta2.value.title);
      }
      if (meta2.value.charset) {
        overrides.meta.push({ key: "charset", charset: meta2.value.charset });
      }
      if (meta2.value.viewport) {
        overrides.meta.push({ name: "viewport", content: meta2.value.viewport });
      }
      return defu(overrides, meta2.value);
    });
    head.addHeadObjs(headObj);
    {
      return;
    }
  };
  {
    nuxtApp.ssrContext.renderMeta = () => renderHeadToString(head);
  }
});
const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory(__spreadValues(__spreadValues({}, removeUndefinedProps(props)), ctx.attrs), ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: String,
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
const Script = defineComponent({
  name: "Script",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    async: Boolean,
    crossorigin: {
      type: [Boolean, String],
      default: void 0
    },
    defer: Boolean,
    integrity: String,
    nomodule: Boolean,
    nonce: String,
    referrerpolicy: String,
    src: String,
    type: String,
    charset: String,
    language: String
  }),
  setup: setupForUseMeta((script) => ({
    script: [script]
  }))
});
const Link = defineComponent({
  name: "Link",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    as: String,
    crossorigin: String,
    disabled: Boolean,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    methods: String,
    target: String
  }),
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
const Base = defineComponent({
  name: "Base",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    href: String,
    target: String
  }),
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = defineComponent({
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = defineComponent({
  name: "Meta",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    charset: String,
    content: String,
    httpEquiv: String,
    name: String
  }),
  setup: setupForUseMeta((meta2) => ({
    meta: [meta2]
  }))
});
const Style = defineComponent({
  name: "Style",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    type: String,
    media: String,
    nonce: String,
    title: String,
    scoped: {
      type: Boolean,
      default: void 0
    }
  }),
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = __spreadValues({}, props);
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = defineComponent({
  name: "Body",
  inheritAttrs: false,
  props: globalProps,
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const Components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Script,
  Link,
  Base,
  Title,
  Meta,
  Style,
  Head,
  Html,
  Body
}, Symbol.toStringTag, { value: "Module" }));
const metaConfig = { "globalMeta": { "charset": "utf-8", "viewport": "width=device-width, initial-scale=1", "meta": [], "link": [], "style": [], "script": [] } };
const metaMixin = {
  created() {
    const instance = getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const _352e394a = defineNuxtPlugin((nuxtApp) => {
  useHead(markRaw(metaConfig.globalMeta));
  nuxtApp.vueApp.mixin(metaMixin);
  for (const name in Components) {
    nuxtApp.vueApp.component(name, Components[name]);
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (override, routeProps) => {
  var _a;
  const matchedRoute = routeProps.route.matched.find((m) => m.components.default === routeProps.Component.type);
  const source = (_a = override != null ? override : matchedRoute == null ? void 0 : matchedRoute.meta.key) != null ? _a : interpolatePath(routeProps.route, matchedRoute);
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const Fragment = {
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
};
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = defineComponent({
  name: "NuxtPage",
  props: {
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props) {
    const nuxtApp = useNuxtApp();
    const isNested = inject(isNestedKey, false);
    provide(isNestedKey, true);
    return () => {
      return h(RouterView, {}, {
        default: (routeProps) => {
          var _a;
          return routeProps.Component && _wrapIf(Transition, (_a = routeProps.route.meta.pageTransition) != null ? _a : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, isNested && nuxtApp.isHydrating ? h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) : h(Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const index_vue_vue_type_style_index_0_scoped_true_lang$4 = "";
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const meta$c = void 0;
const index_vue_vue_type_style_index_0_scoped_true_lang$3 = "";
const meta$b = void 0;
const index_vue_vue_type_style_index_0_scoped_true_lang$2 = "";
const meta$a = void 0;
const index_vue_vue_type_style_index_0_scoped_true_lang$1 = "";
const meta$9 = void 0;
const index_vue_vue_type_style_index_0_scoped_true_lang = "";
const meta$8 = void 0;
const basicBlogLinks = [
  {
    to: "/",
    text: "Home"
  },
  {
    to: "/blog/",
    text: "Blog"
  },
  {
    to: "/Oap",
    text: "Oap"
  },
  {
    to: "/About",
    text: "About"
  },
  {
    to: "/Program",
    text: "Program"
  }
];
const formatTime = (time) => new Date(time).toLocaleString();
const BlogHeader_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$z = {
  name: "BlogHeader",
  __ssrInlineRender: true,
  props: ["heading", "links", "text"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "blog-roll",
        class: "blog-roll-nav"
      }, _attrs))} data-v-aadde774><div class="container" data-v-aadde774><div class="row justify-content-center" data-v-aadde774><div class="col-12" data-v-aadde774><div class="section-title text-center" data-v-aadde774><h2 data-v-aadde774>${ssrInterpolate(__props.heading)}</h2><ul class="breadcrumb-nav" data-v-aadde774><!--[-->`);
      ssrRenderList(__props.links, (link) => {
        _push(`<li data-v-aadde774>`);
        _push(ssrRenderComponent(_component_router_link, {
          to: link.to
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(link.text)}`);
            } else {
              return [
                createTextVNode(toDisplayString$1(link.text), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li data-v-aadde774>${ssrInterpolate(__props.text)}</li></ul></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/BlogHeader.vue");
  return _sfc_setup$z ? _sfc_setup$z(props, ctx) : void 0;
};
const BlogHeader = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["__scopeId", "data-v-aadde774"]]);
const _sfc_main$y = {
  name: "Seo",
  __ssrInlineRender: true,
  props: ["title", "description", "image"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Html = resolveComponent("Html");
      const _component_Head = resolveComponent("Head");
      const _component_Title = resolveComponent("Title");
      const _component_Meta = resolveComponent("Meta");
      const _component_Link = resolveComponent("Link");
      _push(ssrRenderComponent(_component_Html, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_Head, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Title, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.title)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString$1(__props.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Meta, {
                    name: "description",
                    content: __props.description
                  }, null, _parent3, _scopeId2));
                  if (__props.image) {
                    _push3(ssrRenderComponent(_component_Meta, {
                      name: "image",
                      content: __props.image
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(ssrRenderComponent(_component_Link, {
                    rel: "icon",
                    href: "https://i.ibb.co/QrC7C7b/logo.png"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Title, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString$1(__props.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(_component_Meta, {
                      name: "description",
                      content: __props.description
                    }, null, 8, ["content"]),
                    __props.image ? (openBlock(), createBlock(_component_Meta, {
                      key: 0,
                      name: "image",
                      content: __props.image
                    }, null, 8, ["content"])) : createCommentVNode("", true),
                    createVNode(_component_Link, {
                      rel: "icon",
                      href: "https://i.ibb.co/QrC7C7b/logo.png"
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_Head, null, {
                default: withCtx(() => [
                  createVNode(_component_Title, null, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString$1(__props.title), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Meta, {
                    name: "description",
                    content: __props.description
                  }, null, 8, ["content"]),
                  __props.image ? (openBlock(), createBlock(_component_Meta, {
                    key: 0,
                    name: "image",
                    content: __props.image
                  }, null, 8, ["content"])) : createCommentVNode("", true),
                  createVNode(_component_Link, {
                    rel: "icon",
                    href: "https://i.ibb.co/QrC7C7b/logo.png"
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$y = _sfc_main$y.setup;
_sfc_main$y.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Seo.vue");
  return _sfc_setup$y ? _sfc_setup$y(props, ctx) : void 0;
};
const _sfc_main$x = {
  name: "BlogWidget",
  __ssrInlineRender: true,
  props: ["categories"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="sidebar blog-grid-page"><div class="widget search-widget"><h5 class="widget-title">Search This Site</h5><form action="/blog/search/" method="get"><input type="text" name="q" placeholder="Search Here..."><button type="submit"><i class="lni lni-search-alt"></i></button></form></div></div><div class="widget categories-widget"><h5 class="widget-title">Categories</h5><ul class="categories-list"><!--[-->`);
      ssrRenderList(__props.categories, (category) => {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: `/blog/category/${category.slug}/`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(category.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString$1(category.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></div>`);
    };
  }
};
const _sfc_setup$x = _sfc_main$x.setup;
_sfc_main$x.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/BlogWidget.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
let butterCMS = void 0;
const butterCMS_a1f8d812 = defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  try {
    const apiKey = String(config.API_KEY);
    const preview = config.PREVIEW !== "false";
    butterCMS = Butter(apiKey, preview);
  } catch (error) {
    console.error(error);
  }
  nuxtApp.provide("butterCMS", butterCMS);
});
const state = reactive({
  error: null
});
const useMenuItems = () => {
  const items = ref([]);
  const loading = ref(true);
  butterCMS == null ? void 0 : butterCMS.content.retrieve(["navigation_menu"]).then((response) => {
    items.value = response.data.data.navigation_menu[0].menu_items;
  }).catch((e) => state.error = e).finally(() => loading.value = false);
  return { items, loading };
};
const useCategories = () => {
  const categories = ref([]);
  butterCMS == null ? void 0 : butterCMS.category.list().then((response) => {
    categories.value = response == null ? void 0 : response.data.data;
  });
  return { categories };
};
const useApiError = () => {
  const setError = (error) => {
    state.error = error;
  };
  return __spreadProps(__spreadValues({}, toRefs(state)), { setError });
};
const _sfc_main$w = {
  name: "BlogContentContainer",
  __ssrInlineRender: true,
  setup(__props) {
    const { categories } = useCategories();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "blog-posts" }, _attrs))}><div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-8 blog-roll-cards">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div><aside class="col-12 col-lg-4">`);
      _push(ssrRenderComponent(_sfc_main$x, { categories: unref(categories) }, null, _parent));
      _push(`</aside></div></div></section>`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/BlogContentContainer.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const meta$7 = void 0;
const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATkAAAE5CAMAAADcP6fDAAABKVBMVEUAAADf3/fa2vTZ2fLa2vLZ2/Pa3fba3fXZ3Pba3Pba2/XZ3PXa3PXb2/PPz+/Y2/Tb3fTa3PXX1+/a2vTb3ffa3fXZ2fXa3/bY2/ba3fXb3fba2/bX2/Pa3PXc3/fb3fXb3PXa2u/U2vTZ3/fZ2/XZ3PLb3fTe5v/a3PTf3+/Y3PTW2fLb3fXY2/Xa3PPP0enExt25u9G/wdfKy+PZ2vSpq72IiZmDhJOen7G0tcqusMSkpbeOj5/V1++Zmqupq76ztcq5u9C/wdajpbevsMSUlaW0tsrJy+ONj5+TlKWYmqupqr3KzOOIipnExtza3PWjpbikpbien7KeoLG6u9DKy+Kqq76+wNbX1/edn7HY3fTX2vTZ3PbPz//a3PTa2/ba3fTX3/fX2vL1kGjlAAAAY3RSTlMAIDBQYICPn6+/z9//QBBw758gYH/fUG9wz4+PQO9ff68wMF+AUM8fvxCQUO+wkP//////oP//////////////////////////////////3///////////IP9wYN8QYM/PIGCpDvBvAAAJ2klEQVR4AezZBZbkIBSFYSpOuBCl3Xv/e5wj496vBLvfEn7kcRIVkUNVN23XD3o0xuALY4zWQ9+2ja2cou+5QzP1g8H/GHXX1pWiQ90OBh83DgX3c3WnZxxj1q11pVVrOoPTGJd6LaWalVf7cz2nMneY9Iyz0NuqsmV3jXMa20pl6LAbnJ/fV5UVN2lcypjRsbUalzXUKgNul4wEnlqrEcpiVbo2jZD8VtIxZTtZN154sm5sJ+zGdrJuvO+uPATYzmrEyq8qXm5BzJZo213PiJu/UTGytxDgkXV3SMO9U1GxHqnwGzec1OK44YT8g4rCHdKzq/DWW6TIr3zDCT3ecDSk+D5ZPSR4Yp9mpO1xU0E8Q4Iz1r0gB4PjFZfIZffqkQv/xtkg9c7ZILUzXOTpFuTnnuGkFnVu7hZ5Gh3DydMxnDwdw8nTMVxU6W6Ru5HPEamFv7giSveMMuwMF0m6J4jwo9MrCvL4xk/nwT+wO4+yeKdO4wWlGYKOVQ7YDSIcsOuMEj2uoaYDp8QdRPhT5xrluuElF+Kq8yjZyJfcxa86i9I98EFy2afJgtJ9Yt8OVhoGgjiMi1JkZRjRsCCye5HV1dT6/o/nwaNI65ccv9+9t5nMfyYp7NclBPqV96r9+hxC/foY+tHMwNCd+yr15CsbqKdRDnpwPFDN8QAVtwfqxpKDqiVHDRMJ1NNDMDQsOainJQcNWHLqCUtOA2Y59YRZTgOWnDotOS2w5FTo5xBq8BSsQk/B+iuYHIIxmNRADCavoXMa/JOSCp0PSrg/6P7qt7fQecVmpSYMcxqGub1eWl/HZdRgs2rAyapCJ6umMXiXMPweQu36ERdTT3hgUoMvILTCTKJKM4kSPua0wMecVviYU6VpTgk/J9ERXpi0urRuXF0/43/U6SFdE+ZgHeGA0AF+iaOTG8SmLQL8UAlHqyYcrVocrRteHX6B3+kWbq06wVCiaiihPAhTE8Y5vXhKx9eSb3bOQsduHIzCy/iLFkSLohVWdgrxrGPnMqXM7fu/yG4cpbZP7pwBX6l4RLfOF/ri/CF3vpLr5FN+vuaN8Kd8fRJzSlfVTV3KXyPqZlXpWwV8yUec21IYfac2Q86OyPi3NsbmfEN4FaY5n7W50KYA9VVbmxDXKMH4mTFGZy1z4Mvybel7zYUzSRoPVtu+1TIeshycSpJVaFqCmXVtkqxxs8JUTfjS3Ch7+PKtybPxcNxzc4ryIcM826TXwjJCds6EgApYjWZ8Yb4vM6fMkP2hq03I3exERXP3Rr4beSuYQ998X+Wr2GCfmixomXQvY9DcfMI/KP7T1g+lJP3B7eah42hn+vjxKMfuZQl/309LXdoZ/TlFroc67eOZ2Y6TlrF7acqX5ddCcw+M0/kuL2SINWiO81jq7qYn71Iw1nQ6LrSPSg4Omgu8ynn/ds3JwkOJsom5evsoNnF+WuoeBNycw/gtnuA6Mef0Pm1CPky8VWpOTpcFmHvsBcxhv8GJWOqUi0WO5FFurrYiaC5LO0wsyynNzdOrot1okUuYCzxEjZUIixwzcWv8xxMlYI7w74a5p+kGhd3l5tpYno6Wuu06FjmaXrSTbMXMnIr8u2HumcEN4ubCjVonRzPD6wtLEDyTLMxc4O27Ys7rlemjuDnk64zHUjeo5VFVCw9sYI7wb92ceZN6IdQc56eljhc5HQjAiDnCv21zrZIrmTsj27/EWzJmznrh5jj/9s2ZRhFznMcs4CGJmnPrq5lz23fNnHHPqbkpr05wtvI6d5zflNe5h1Ic1UfPHewBmOM8xr2pAMJXvNOPHHJoDvm3/tyKWYEmMMd4zOwq74NUUPGAm+P8WzEHLzDuM3OcxyJn4wMsT3iEf0LNTfnHpeb+kcLgTZgi5iiPRa4Tf6ClLiZglzfngX8LbzbpkzQ3R54f4+OqgldpzJyh5qb8/VJzf0tRPPahq5g7gLmsyIWb5G0sdWS9HkygOeTVCfrcjcJvXwun8N26J+YIj0VuJiGrc0rdqlEwx4GaCzw+MZfk28KBh86Y5lZ2yeqEmAu8Inz8cCjkbXqQfv/F2KjrqBrNRd6tc377Nr5UQ/fY3JlX1bypTfp2vGn7DBbCTwv8WcbjnRy8+m6xyw2ttqqqeWvSdwe+DQlth/Dz5VHeqVJzX0lBGoOZxYMOeTy+wQMesoavhlDqol7INvYuyILw18/PhUPT7UQEMUd46MWP8QqMpU49moig5pCvA1+S30vHz6lHyeHstBBzlMeREHzERFhQnSxoJ9QcuuvUCcbPvZLS6Pmq+z+reeZhbiFLzg9ZBHQHt/zj/BBtX3dd93o1T6V6i3lO+YL/hCP/tXcGqm2CURQ+CD+lU5ACDAYGpCCo6wKADyPzt2ny/g8x2Fg3yErrSeIS/b5HONx7z7nX5u/qsZCsxRU+mT/ShHvJXiJ4PeJ7Bk4QlhWF4atkxRJ45FUmE4lY4oYSYonFN94rMQm8keNbK+Zq8chbYB4b3p8zudcvthkYBmFYBBS87eofhMUW4W0QDDqLB/3EOTSRgxl0Fr3EoPPHHIPOGnOvFJkDY05qnNWVNOevrvy/Lz4dTmHQK+6NjkxCu7qZhI8RzoWJXGIe0qeuERAl2tX/Z8u+u+KsvrvirH4YJgZ7RzqalXY1/hJHRDrvwHTMUzYBwpwR6QhztkfgD3iE8QHC8AgoJKfoIOpthmwC7A9mMKHk/GBCyU348ErJOUVHCnaKDmIvt+goObfoKDmz6Cg5t+goObvoyHLvE7NpkOVk/CaHkrNPJpQcdzrjFHxMl8FHTsEkEzuRHJNnv4Fck/iSTQB7sE0Cezj6QRO0mkoTsyyDOEry+5XtgX41oxz9avSqBf1ayGTLIfhdyMP/IMqnX/P+uul1Ajn7qsuW5cGkiQQSRp035HwGti6XQJJzKVcnXKnz0ETcwaSPfLIxSVZlsIksMNhnnZWArboEhHPp2FaR7m06WXDn3OkyNEuXbjdqRukQDulM4ZDOFA7pTOEIJ51mYItwLoGVC+lOEY6j0+ZZM5LExQgXE81KHzmdmzTlIoQrR81PwBtchie8waSPjDiT5pb3iXbU/yS/1Y7d5HKgY3e9HPDYVldBcWtlFwtdCU2HNbgMcekFRz7xCg6T3RW6RvJIhjPpr9spHkYZ0LJ1IQNcNn6WAdptgm6CPsQr022UhHbz6IZ2nm7MO083tKsH3S5FR347deDRpgZVSbm59MPLfLLlRrnRtWnYa4Ek4bKVV4dCi6Uf6gtZQp3vtXDGqjt36aVtMWod9OdTL20Po9bFWIR6c2KHttWolZJUoXSqLy1DtRckVWjrlw9Kdpcf9qP+BsakOIRwV9Z1mqZ/tErTl7q8a8OhSva6Hn4AEjITTzZk9hIAAAAASUVORK5CYII=";
const SingleArticle_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$v = {
  name: "SingleArticle",
  __ssrInlineRender: true,
  props: ["article"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "single-post" }, _attrs))} data-v-4391404c><div class="single-post-meta" data-v-4391404c><h2 class="single-post-header" data-v-4391404c>${ssrInterpolate(__props.article.title)}</h2><ul class="single-post-meta-info" data-v-4391404c>`);
      if (__props.article.author) {
        _push(`<li data-v-4391404c><a href="#" data-v-4391404c><img${ssrRenderAttr("src", __props.article.author.profile_image || unref(placeholder))} alt="#" data-v-4391404c> ${ssrInterpolate(__props.article.author.first_name)} ${ssrInterpolate(__props.article.author.last_name)}</a></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<li data-v-4391404c><a href="#" data-v-4391404c><i class="lni lni-calendar" data-v-4391404c></i> ${ssrInterpolate(unref(formatTime)(__props.article.published))}</a></li><li data-v-4391404c><!--[-->`);
      ssrRenderList(__props.article.tags, (tag) => {
        _push(ssrRenderComponent(_component_router_link, {
          key: tag.slug,
          to: `/blog/tag/${tag.slug}/`,
          class: "tag"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="lni lni-tag" data-v-4391404c${_scopeId}></i> ${ssrInterpolate(tag.name)}`);
            } else {
              return [
                createVNode("i", { class: "lni lni-tag" }),
                createTextVNode(" " + toDisplayString$1(tag.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></li></ul></div>`);
      if (__props.article.featured_image) {
        _push(`<div class="single-post-thumbnail" data-v-4391404c><img${ssrRenderAttr("src", __props.article.featured_image)}${ssrRenderAttr("alt", __props.article.featured_image_alt)} data-v-4391404c></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="single-post-body" data-v-4391404c>${__props.article.body}</div></div>`);
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/SingleArticle.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const SingleArticle = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-4391404c"]]);
const meta$6 = void 0;
const _sfc_main$u = {
  name: "ZeroData"
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<p${ssrRenderAttrs(_attrs)}>Sorry,No posts found matching this search.</p>`);
}
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ZeroData.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const ZeroData = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["ssrRender", _sfc_ssrRender$5]]);
const BlogPostsList_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$t = {
  name: "BlogPostsList",
  __ssrInlineRender: true,
  props: ["blogPosts"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "row" }, _attrs))} data-v-021c4334>`);
      if (__props.blogPosts.length === 0) {
        _push(ssrRenderComponent(ZeroData, null, null, _parent));
      } else {
        _push(`<!--[-->`);
        ssrRenderList(__props.blogPosts, (post) => {
          _push(`<div class="col-12 col-lg-6" data-v-021c4334><div class="blog-roll-card" data-v-021c4334><div class="blog-roll-card-meta" data-v-021c4334><h2 class="blog-roll-card-header" data-v-021c4334>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: `/blog/${post.slug}/`
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(post.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString$1(post.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</h2><ul class="blog-roll-card-meta-info" data-v-021c4334><li data-v-021c4334><a href="#" data-v-021c4334><img${ssrRenderAttr("src", post.author.profile_image || unref(placeholder))} alt="#" data-v-021c4334> ${ssrInterpolate(post.author.first_name)} ${ssrInterpolate(post.author.last_name)}</a></li><li data-v-021c4334><a href="#" data-v-021c4334><i class="lni lni-calendar" data-v-021c4334></i> ${ssrInterpolate(unref(formatTime)(post.published))}</a></li><li data-v-021c4334><!--[-->`);
          ssrRenderList(post.tags, (tag) => {
            _push(ssrRenderComponent(_component_nuxt_link, {
              key: tag.slug,
              to: `/blog/tag/${tag.slug}/`,
              class: "tag"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="lni lni-tag" data-v-021c4334${_scopeId}></i> ${ssrInterpolate(tag.name)}`);
                } else {
                  return [
                    createVNode("i", { class: "lni lni-tag" }),
                    createTextVNode(" " + toDisplayString$1(tag.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></li></ul></div>`);
          if (post.featured_image) {
            _push(`<div class="single-post-thumbnail" data-v-021c4334><img${ssrRenderAttr("src", post.featured_image)}${ssrRenderAttr("alt", post.featured_image_alt)} data-v-021c4334></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="blog-roll-card-body" data-v-021c4334><p data-v-021c4334>${ssrInterpolate(post.summary)}</p></div><div class="blog-roll-card-footer text-center" data-v-021c4334>`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: `/blog/${post.slug}/`,
            class: "main-btn btn-hover"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Read More`);
              } else {
                return [
                  createTextVNode("Read More")
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></div>`);
        });
        _push(`<!--]-->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$t = _sfc_main$t.setup;
_sfc_main$t.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/BlogPostsList.vue");
  return _sfc_setup$t ? _sfc_setup$t(props, ctx) : void 0;
};
const BlogPostsList = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-021c4334"]]);
const getBlogCategory = async (categorySlug) => {
  const response = await butterCMS.category.retrieve(categorySlug);
  return response.data.data;
};
const getBlogTag = async (tagSlug) => {
  const response = await butterCMS.tag.retrieve(tagSlug);
  return response.data.data;
};
const meta$5 = void 0;
const meta$4 = void 0;
const meta$3 = void 0;
const meta$2 = void 0;
const _imports_0 = buildAssetsURL("hero-img.92aa856d.png");
const _imports_1 = buildAssetsURL("slide.10ed1bb6.jpeg");
const _imports_2 = buildAssetsURL("slide2.a5c19d15.jpeg");
const _imports_3 = buildAssetsURL("slide3.26d5218d.jpeg");
const _imports_4 = buildAssetsURL("slide4.feb7b007.jpeg");
const _imports_5 = buildAssetsURL("slide5.5bb337e2.jpeg");
const _imports_6 = buildAssetsURL("slide6.07b2f0ae.jpeg");
const _imports_7 = buildAssetsURL("slide7.f8348cad.jpeg");
const _imports_8 = buildAssetsURL("slide8.309a0ad2.jpeg");
const _imports_9 = buildAssetsURL("slide9.a20924d3.jpeg");
const HeroSection_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$s = {
  name: "HeroSection",
  __ssrInlineRender: true,
  props: ["fields"],
  setup(__props) {
    onMounted(() => {
      var myIndex = 0;
      carousel();
      function carousel() {
        var i;
        var x = document.getElementsByClassName("mySlides");
        for (i = 0; i < x.length; i++) {
          x[i].style.display = "none";
        }
        myIndex++;
        if (myIndex > x.length) {
          myIndex = 1;
        }
        x[myIndex - 1].style.display = "block";
        setTimeout(carousel, 9e3);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "body" }, _attrs))} data-v-7b834702><div class="hero" data-v-7b834702><div class="hero-article" data-v-7b834702><div class="hero-text" data-v-7b834702><h1 class="lg-text" data-v-7b834702>Relax and Enjoy the<br data-v-7b834702> <span class="colored-text" data-v-7b834702> Best FM </span> on the<br data-v-7b834702> planet earth...</h1><h1 class="mobile-text" data-v-7b834702>Relax and Enjoy the <span class="colored-text" data-v-7b834702> Best FM </span> on the planet earth...</h1></div><div class="hero-para" data-v-7b834702><p data-v-7b834702>Listen to exciting talks about sport, recent<br data-v-7b834702> news, dramas, relationships and many more on<br data-v-7b834702> sparkling FM</p></div><div class="hero-links" data-v-7b834702><a style="${ssrRenderStyle({ "background-color": "rgba(229, 137, 70, 1)" })}" href="#C4" class="listen nuxt-link-exact-active" id="listen" data-v-7b834702>Listen Live</a>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        class: "second-link",
        to: "/blog/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Read our Articles`);
          } else {
            return [
              createTextVNode("Read our Articles")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="hero-img" data-v-7b834702><div class="w3-content w3-section" style="${ssrRenderStyle({ "max-width": "500px" })}" data-v-7b834702><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_0)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>1 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_1)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>2 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_2)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>3 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_3)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>4 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_4)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>5 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_5)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>6 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_6)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>7 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_7)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>8 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_8)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>9 / 10</h1></div><div class="mySlides slideshow-container" data-v-7b834702><img${ssrRenderAttr("src", _imports_9)} style="${ssrRenderStyle({ "width": "100%" })}" data-v-7b834702><h1 class="numbertext" data-v-7b834702>10 / 10</h1></div></div></div></div><div class="iframe" id="C4" data-v-7b834702><div data-v-7b834702><iframe loading="lazy" src="https://mixlr.com/users/2614208/embed" width="100%" height="180px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no" data-v-7b834702></iframe></div></div></div>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HomepageSections/HeroSection.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-7b834702"]]);
const _sfc_main$r = {
  name: "BlogPostTile",
  __ssrInlineRender: true,
  props: [
    "featured_image",
    "featured_image_alt",
    "slug",
    "title",
    "summary"
  ],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "col-lg-4 col-md-8 col-sm-10" }, _attrs))}><div class="single-blog">`);
      if (__props.featured_image) {
        _push(`<div class="blog-header"><img class="img-fluid" loading="lazy"${ssrRenderAttr("src", __props.featured_image)}${ssrRenderAttr("alt", __props.featured_image_alt)}></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="blog-body"><h5 class="package-name">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: `/blog/${__props.slug}/`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h5><p>${ssrInterpolate(__props.summary)}</p></div><div class="blog-footer">`);
      _push(ssrRenderComponent(_component_router_link, {
        to: `/blog/${__props.slug}/`,
        class: "main-btn btn-hover"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Read More`);
          } else {
            return [
              createTextVNode("Read More")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogPostTile.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const _sfc_main$q = {
  name: "BlogSection",
  __ssrInlineRender: true,
  props: ["blogPosts"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "blog",
        class: "blog-section"
      }, _attrs))}><div class="container"><div class="row justify-content-center"><div class="col-lg-6 col-md-10"><div class="section-title text-center"><h2>Latest News</h2><p></p></div></div></div><div class="row justify-content-center"><!--[-->`);
      ssrRenderList(__props.blogPosts, (blogPost, index2) => {
        _push(ssrRenderComponent(_sfc_main$r, mergeProps({ key: index2 }, blogPost), null, _parent));
      });
      _push(`<!--]--></div><p>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        class: "main-btn btn-hover mt-5",
        to: "/blog/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All News `);
          } else {
            return [
              createTextVNode(" View All News ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></section>`);
    };
  }
};
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HomepageSections/BlogSection.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const HomeView_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$p = {
  name: "HomeView",
  __ssrInlineRender: true,
  props: ["slug"],
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const { categories } = useCategories();
    const { $butterCMS } = useNuxtApp();
    const { setError } = useApiError();
    inject("layout");
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("home-data", async () => {
      var _a;
      const pageSlug = (_a = props.slug) != null ? _a : "landing-page-with-components";
      try {
        const page = await ($butterCMS == null ? void 0 : $butterCMS.page.retrieve("landing-page", pageSlug));
        const pageData = page == null ? void 0 : page.data.data;
        const posts = await ($butterCMS == null ? void 0 : $butterCMS.post.list({ page: 1, page_size: 3 }));
        const blogPosts = posts == null ? void 0 : posts.data.data;
        return {
          pageData,
          blogPosts
        };
      } catch (e) {
        setError(e);
        return null;
      }
    })), __temp = await __temp, __restore(), __temp);
    onMounted(refresh);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-2c8d904c>`);
      _push(ssrRenderComponent(unref(_sfc_main$y), unref(data).pageData.fields.seo, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(data).pageData.fields.body, (item, index2) => {
        _push(`<div data-v-2c8d904c>`);
        if (item.type === "hero") {
          _push(ssrRenderComponent(HeroSection, {
            key: index2,
            fields: item.fields
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_sfc_main$q, {
        "blog-posts": unref(data).blogPosts
      }, null, _parent));
      _push(`<section class="category" data-v-2c8d904c><div class="widget categories-widget" data-v-2c8d904c><h5 class="widget-title" data-v-2c8d904c>Categories</h5><ul class="categories-list" data-v-2c8d904c><!--[-->`);
      ssrRenderList(unref(categories), (category) => {
        _push(`<li data-v-2c8d904c>`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: `/blog/category/${category.slug}/`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(category.name)}`);
            } else {
              return [
                createTextVNode(toDisplayString$1(category.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul></div></section><div class="download" data-v-2c8d904c><a href="../assets/files/advert.pdf" download="Advert" data-v-2c8d904c>Advertisments? Click here -&gt;</a></div></div>`);
    };
  }
};
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/HomeView.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const HomeView = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-2c8d904c"]]);
const meta$1 = void 0;
const meta = void 0;
const routes = [
  {
    name: "About",
    path: "/About",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/About/index.vue",
    children: [],
    meta: meta$c,
    alias: (meta$c == null ? void 0 : meta$c.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$b;
    })
  },
  {
    name: "Contact",
    path: "/Contact",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/Contact/index.vue",
    children: [],
    meta: meta$b,
    alias: (meta$b == null ? void 0 : meta$b.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$9;
    })
  },
  {
    name: "Oap",
    path: "/Oap",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/Oap/index.vue",
    children: [],
    meta: meta$a,
    alias: (meta$a == null ? void 0 : meta$a.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$7;
    })
  },
  {
    name: "Program",
    path: "/Program",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/Program/index.vue",
    children: [],
    meta: meta$9,
    alias: (meta$9 == null ? void 0 : meta$9.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$5;
    })
  },
  {
    name: "Shows",
    path: "/Shows",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/Shows/index.vue",
    children: [],
    meta: meta$8,
    alias: (meta$8 == null ? void 0 : meta$8.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index$3;
    })
  },
  {
    path: "/blog",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/blog.vue",
    children: [
      {
        name: "blog-post",
        path: ":post",
        file: "/Users/achufam/Desktop/SparklingFM-main/pages/blog/[post].vue",
        children: [],
        meta: meta$6,
        alias: (meta$6 == null ? void 0 : meta$6.alias) || [],
        component: () => Promise.resolve().then(function() {
          return _post_;
        })
      },
      {
        name: "blog-category-category",
        path: "category/:category",
        file: "/Users/achufam/Desktop/SparklingFM-main/pages/blog/category/[category].vue",
        children: [],
        meta: meta$5,
        alias: (meta$5 == null ? void 0 : meta$5.alias) || [],
        component: () => Promise.resolve().then(function() {
          return _category_;
        })
      },
      {
        name: "blog",
        path: "",
        file: "/Users/achufam/Desktop/SparklingFM-main/pages/blog/index.vue",
        children: [],
        meta: meta$4,
        alias: (meta$4 == null ? void 0 : meta$4.alias) || [],
        component: () => Promise.resolve().then(function() {
          return index$1;
        })
      },
      {
        name: "blog-search",
        path: "search",
        file: "/Users/achufam/Desktop/SparklingFM-main/pages/blog/search.vue",
        children: [],
        meta: meta$3,
        alias: (meta$3 == null ? void 0 : meta$3.alias) || [],
        component: () => Promise.resolve().then(function() {
          return search;
        })
      },
      {
        name: "blog-tag-tag",
        path: "tag/:tag",
        file: "/Users/achufam/Desktop/SparklingFM-main/pages/blog/tag/[tag].vue",
        children: [],
        meta: meta$2,
        alias: (meta$2 == null ? void 0 : meta$2.alias) || [],
        component: () => Promise.resolve().then(function() {
          return _tag_;
        })
      }
    ],
    meta: meta$7,
    alias: (meta$7 == null ? void 0 : meta$7.alias) || [],
    component: () => Promise.resolve().then(function() {
      return blog;
    })
  },
  {
    name: "index",
    path: "/",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/index.vue",
    children: [],
    meta: meta$1,
    alias: (meta$1 == null ? void 0 : meta$1.alias) || [],
    component: () => Promise.resolve().then(function() {
      return index;
    })
  },
  {
    name: "landing-page-slug",
    path: "/landing-page/:slug",
    file: "/Users/achufam/Desktop/SparklingFM-main/pages/landing-page/[slug].vue",
    children: [],
    meta,
    alias: (meta == null ? void 0 : meta.alias) || [],
    component: () => Promise.resolve().then(function() {
      return _slug_;
    })
  }
];
const configRouterOptions = {};
const routerOptions = __spreadValues({}, configRouterOptions);
const ForceTrailingSlashesGlobal = defineNuxtRouteMiddleware((to, from) => {
  const redirects = [
    {
      from: "^(\\/[^\\?]*[^\\/])(\\?.*)?$"
    }
  ];
  const redirect = redirects.find((r) => {
    const re = new RegExp(r.from);
    return re.test(to.path);
  });
  if (redirect) {
    return navigateTo({ path: to.path + "/" });
  }
});
const globalMiddleware = [
  ForceTrailingSlashesGlobal
];
const namedMiddleware = {};
const _e3c66d6e = defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  const baseURL2 = useRuntimeConfig().app.baseURL;
  const routerHistory = createMemoryHistory(baseURL2);
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter(__spreadProps(__spreadValues({}, routerOptions), {
    history: routerHistory,
    routes
  }));
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = computed(() => router.currentRoute.value[key]);
  }
  const _activeRoute = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _activeRoute.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a, _b, _c, _d;
    if (((_b = (_a = to.matched[0]) == null ? void 0 : _a.components) == null ? void 0 : _b.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const activeRoute = {};
  for (const key in _activeRoute.value) {
    activeRoute[key] = computed(() => _activeRoute.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._activeRoute = reactive(activeRoute);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      await router.push(initialURL);
    }
    await router.isReady();
  } catch (error2) {
    callWithNuxt(nuxtApp, throwError, [error2]);
  }
  router.beforeEach(async (to, from) => {
    var _a;
    to.meta = reactive(to.meta);
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a = namedMiddleware[entry2]) == null ? void 0 : _a.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError({
            statusMessage: `Route navigation aborted: ${initialURL}`
          });
          return callWithNuxt(nuxtApp, throwError, [error2]);
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      callWithNuxt(nuxtApp, throwError, [createError({
        statusCode: 404,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else if (to.matched[0].name === "404" && nuxtApp.ssrContext) {
      nuxtApp.ssrContext.res.statusCode = 404;
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        await callWithNuxt(nuxtApp, navigateTo, [currentURL]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace(__spreadProps(__spreadValues({}, router.resolve(initialURL)), {
        name: void 0,
        force: true
      }));
    } catch (error2) {
      callWithNuxt(nuxtApp, throwError, [error2]);
    }
  });
  return { provide: { router } };
});
const scroll_31efdce6 = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = () => {
    return { left: 0, top: 0, behavior: "auto" };
  };
});
const _plugins = [
  preload,
  componentsPlugin_6d20bcd1,
  vueuseHead_04557d67,
  _352e394a,
  _e3c66d6e,
  butterCMS_a1f8d812,
  scroll_31efdce6
];
const error404_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$o = {
  name: "error-404",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "404"
    },
    statusMessage: {
      type: String,
      default: "Not Found"
    },
    description: {
      type: String,
      default: "Sorry, the page you are looking for could not be found."
    },
    backHome: {
      type: String,
      default: "Go back home"
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}a{color:inherit;text-decoration:inherit}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-011aae6d><div class="fixed left-0 right-0 spotlight z-10" data-v-011aae6d></div><div class="max-w-520px text-center z-20" data-v-011aae6d><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-011aae6d>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-011aae6d>${ssrInterpolate(__props.description)}</p><div class="w-full flex items-center justify-center" data-v-011aae6d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              createTextVNode(toDisplayString$1(__props.backHome), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-404.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const Error404 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-011aae6d"]]);
const error500_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$n = {
  name: "error-500",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "500"
    },
    statusMessage: {
      type: String,
      default: "Server error"
    },
    description: {
      type: String,
      default: "This page is temporarily unavailable."
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p{margin:0}h1{font-size:inherit;font-weight:inherit}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-6aee6495><div class="fixed -bottom-1/2 left-0 right-0 h-1/2 spotlight" data-v-6aee6495></div><div class="max-w-520px text-center" data-v-6aee6495><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-6aee6495>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-6aee6495>${ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-500.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const Error500 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-6aee6495"]]);
const errorDev_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$m = {
  name: "error-dev",
  __ssrInlineRender: true,
  props: {
    appName: {
      type: String,
      default: "Nuxt"
    },
    version: {
      type: String,
      default: ""
    },
    statusCode: {
      type: String,
      default: "500"
    },
    statusMessage: {
      type: String,
      default: "Server error"
    },
    description: {
      type: String,
      default: "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details."
    },
    stack: {
      type: String,
      default: ""
    }
  },
  setup(__props) {
    const props = __props;
    useHead({
      title: `${props.statusCode} - ${props.statusMessage} | ${props.appName}`,
      script: [],
      style: [
        {
          children: `*,:before,:after{-webkit-box-sizing:border-box;box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}*{--tw-ring-inset:var(--tw-empty, );--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(14, 165, 233, .5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000}:root{-moz-tab-size:4;-o-tab-size:4;tab-size:4}body{margin:0;font-family:inherit;line-height:inherit}html{-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";line-height:1.5}h1,p,pre{margin:0}h1{font-size:inherit;font-weight:inherit}pre{font-size:1em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "font-sans antialiased bg-white px-10 pt-14 dark:bg-black text-black dark:text-white min-h-screen flex flex-col" }, _attrs))} data-v-693cabb2><div class="fixed left-0 right-0 spotlight" data-v-693cabb2></div><h1 class="text-6xl sm:text-8xl font-medium mb-6" data-v-693cabb2>${ssrInterpolate(__props.statusCode)}</h1><p class="text-xl sm:text-2xl font-light mb-8 leading-tight" data-v-693cabb2>${ssrInterpolate(__props.description)}</p><div class="bg-white rounded-t-md bg-black/5 dark:bg-white/10 flex-1 overflow-y-auto h-auto" data-v-693cabb2><pre class="text-xl font-light leading-tight z-10 p-8" data-v-693cabb2>${__props.stack}</pre></div></div>`);
    };
  }
};
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-dev.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const _sfc_main$l = {
  name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    var _a;
    const props = __props;
    const error = props.error;
    (error.stack || "").split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n");
    const statusCode = String(error.statusCode || 500);
    const is404 = statusCode === "404";
    const statusMessage = (_a = error.statusMessage) != null ? _a : is404 ? "Page Not Found" : "Internal Server Error";
    const description = error.message || error.toString();
    const stack = void 0;
    const ErrorTemplate = is404 ? Error404 : Error500;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const _sfc_main$k = {
  name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const nuxtApp = useNuxtApp();
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, throwError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = resolveComponent("App");
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$l), { error: unref(error) }, null, _parent));
          } else {
            _push(ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const layouts = {
  default: defineAsyncComponent(() => Promise.resolve().then(function() {
    return _default;
  }))
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const __nuxt_component_0 = defineComponent({
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const route = useRoute();
    return () => {
      var _a, _b, _c;
      const layout = (_b = (_a = isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      return _wrapIf(Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), _wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const _sfc_main$j = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = resolveComponent("NuxtPage");
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["ssrRender", _sfc_ssrRender$4]]);
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext = {}) {
    const vueApp = createApp(_sfc_main$k);
    vueApp.component("App", AppComponent);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      ssrContext.error = ssrContext.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);
const _sfc_main$i = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  const _component_nuxt_link = __nuxt_component_0$1;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: "header",
    id: "hero-top"
  }, _attrs))} data-v-13c46378><section data-v-13c46378><h1 data-v-13c46378>ABOUT US</h1><p data-v-13c46378>Sparkling 92.3 fm is a radio station in the heart of Calabar, Cross River state, Nigeria. It was launched in 2018 to capture the thought, heart and mood of a diverse audience through our broad based but specific programming and music playlist. Our shows present you, the listener, with a full treat of what is happening in the news from our local scene to the international stage while we also have a good dose of politics, sports and business contents to pick from and it is very engaging and interactive. Your day has never been better. Our music is second to one because we play the latest afrobeats tunes, down to the old but gold Nigerian songs of the sixties, seventies, eighties and nineties. We never miss the trend when it comes to music and promoting the craft. You can always trust us to provide affordable advert rates to meet your advertising needs. You can check out our programmes and presenters.</p></section><div class="d-flex justify-content-center" id="link" data-v-13c46378>`);
  _push(ssrRenderComponent(_component_nuxt_link, { to: "/Program" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Check our Programmes`);
      } else {
        return [
          createTextVNode("Check our Programmes")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="download" data-v-13c46378><a href="../assets/files/advert.pdf" download="Advert" data-v-13c46378>Download our Adverts Rate</a></div></div></div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/About/index.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const index$a = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-13c46378"]]);
const index$b = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$h = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-0d66a924><section data-v-0d66a924><div data-v-0d66a924><h2 data-v-0d66a924>Contact Sparkling FM</h2><div data-v-0d66a924><h4 data-v-0d66a924><b data-v-0d66a924>Address:</b></h4><p data-v-0d66a924> Sparkling Towers, Lemna Ikot Effangha Calabar, Cross River state, Nigeria </p></div><div data-v-0d66a924><h4 data-v-0d66a924><b data-v-0d66a924>Email:</b></h4><p data-v-0d66a924>sparkling923fm@gmail.com</p></div></div><div data-v-0d66a924><h2 data-v-0d66a924>For Marketing Enquiries</h2><section data-v-0d66a924><div data-v-0d66a924><h5 data-v-0d66a924>Joshua Moses</h5><p data-v-0d66a924>General Manager</p><p data-v-0d66a924>Joshuamose89@gmail.com</p><p data-v-0d66a924>07032404903</p></div><div data-v-0d66a924><h5 data-v-0d66a924>Peace Nsemo</h5><p data-v-0d66a924>Marketing Manager</p><p data-v-0d66a924>nsemopeace@gmail.com</p><p data-v-0d66a924>08035505348</p></div></section></div></section><div class="download" data-v-0d66a924><a href="../assets/files/advert.pdf" download="Advert" data-v-0d66a924>Advertisments? Click here -&gt;</a></div></div>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Contact/index.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const index$8 = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-0d66a924"]]);
const index$9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$g = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-47c451fa><div class="header" data-v-47c451fa><div data-v-47c451fa><div class="heading" id="hero-top" data-v-47c451fa><h1 class="text-center" style="${ssrRenderStyle({ "font": "size 2.5rem" })}" data-v-47c451fa>OAPs</h1></div><section class="flexbox" data-v-47c451fa><div class="card" id="sell-crypto" data-v-47c451fa><a href="https://ibb.co/MVvvdjG" data-v-47c451fa><img src="https://i.ibb.co/QNgg0qC/Whats-App-Image-2022-08-11-at-18-13-57.jpg" width="100%" alt="Whats-App-Image-2022-08-11-at-18-13-57" border="0" data-v-47c451fa></a><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Cinie Williams Ojeka</b></h4><p data-v-47c451fa>He&#39;s a dynamic presenter that speaks multiple Nigerian language. He is the host of The Sparkling Morning Show and Sports Cruise. </p></div></div><div class="card" id="borrow-crypto" data-v-47c451fa><img src="https://i.ibb.co/9VsQ2Lq/IMG-20220802-WA0000.jpg" width="100%" alt="IMG-20220802-WA0000" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Gloria Umoh</b></h4><p data-v-47c451fa>She is the host of our flagship Efik show Mkpon Editi. She is also a great reporter that has passion for stories empowering women to aspire to leadership position.</p></div></div><div class="card" id="sell-crypto" data-v-47c451fa><img src="https://i.ibb.co/LvVbWY9/Whats-App-Image-2022-08-11-at-18-13-58-1.jpg" width="100%" alt="Whats-App-Image-2022-08-11-at-18-13-58-1" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Essien Okon Essien</b></h4><p data-v-47c451fa>Essien is a cornerstone of our Efik show Mkpo Editi. He is concerned about promoting the Efik culture and he is a community leader.</p></div></div><div class="card socials" data-v-47c451fa><img src="https://i.ibb.co/kQTXp4C/JPEG-image-117-2.jpg" width="100%" alt="JPEG-image-117-2" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Miracle George</b></h4><p data-v-47c451fa>Popularly referred to a &quot;George Talent&quot;. He is the host of our flagship pidgin belt &quot;kpon kpo do&quot;. He also hosts the &quot;Saturday Morning Show&quot;. <br data-v-47c451fa> George is a comedian and events host.</p></div></div><div class="card" id="sell-crypto" data-v-47c451fa><img src="https://i.ibb.co/zx1w9w1/Screenshot-20220806-133652-Facebook-2-1.jpg" width="100%" alt="Screenshot-20220806-133652-Facebook-2-1" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Ukamaka Richards</b></h4><p data-v-47c451fa>Co-Host of the Sparkling Morning Show.Lead Anchor of the flagship program on the station \u201CLET\u2019S TALK NIGERIA\u2019\u2019 a daily 60 minutes audience participatory program dedicated to engaging with policy makers and analyzing topical issues affecting the Nigerian state at various levels with an aim to effect change. News Anchor on World news @7am on weekdays &amp; Sundays @7am &amp; @12noon.Anchor of the station&#39;s rural based health programme which airs every Saturdays by 10am. Host, Church On Radio \u{1F4FB}</p></div></div></section></div></div></div>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Oap/index.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const index$6 = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-47c451fa"]]);
const index$7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$f = {
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const openTab = ref(1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-129554f0><div class="flex items-center justify-center lg:my-20 lg:mx-20" data-v-129554f0><div class="w-full" data-v-129554f0><ul class="flex mb-0 list-none space-y-2 justify-between" id="tab-btn" data-v-129554f0><div class="d-flex flex-row space-x-1 justify-center" data-v-129554f0><li class="flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 1, "active-tab": openTab.value === 1 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Mondays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 2, "active-tab": openTab.value === 2 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Tuesdays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 3, "active-tab": openTab.value === 3 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Wednesday </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 4, "active-tab": openTab.value === 4 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Thursday </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 5, "active-tab": openTab.value === 5 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Fridays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 6, "active-tab": openTab.value === 6 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Saturdays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${ssrRenderClass([{ "inactivetab": openTab.value !== 7, "active-tab": openTab.value === 7 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Sundays </a></li></div></ul><div class="tab-content tab-space w-full table" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 1, "active": openTab.value === 1 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0> News Update<br data-v-129554f0><b data-v-129554f0>The Mid-Morning Show</b><br data-v-129554f0> Headline<br data-v-129554f0> News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Business show<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World <br data-v-129554f0> Efik Show<br data-v-129554f0> Talk Your Own(BBC)<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> The Night Zone<br data-v-129554f0> Real life tales<br data-v-129554f0> Good night kisses<br data-v-129554f0></td></tr></table></div><div data-v-129554f0><div class="tab-content tab-space w-full" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 2, "active": openTab.value === 2 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0><b data-v-129554f0>News Update</b> <br data-v-129554f0> The Mid-Morning Show<br data-v-129554f0> Headline News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Interpret d law<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World <br data-v-129554f0> Efik Show<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> Double Dose<br data-v-129554f0> Family Table<br data-v-129554f0> Good night kisses<br data-v-129554f0></td></tr></table></div></div><div data-v-129554f0><div class="tab-content tab-space w-full" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 3, "active": openTab.value === 3 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0> News Update<br data-v-129554f0><b data-v-129554f0>Musical Wednesday</b><br data-v-129554f0> Headline<br data-v-129554f0> News<br data-v-129554f0><b data-v-129554f0>COVID 19 TALKS</b><br data-v-129554f0> The Newsroom<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Musical Wednesday</b><br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News<br data-v-129554f0> Sound Box<br data-v-129554f0> Musical Wednesday<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> Musical Wednesday </td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 4, "active": openTab.value === 4 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0><b data-v-129554f0>News Update</b> <br data-v-129554f0> The Mid-Morning Show<br data-v-129554f0> Headline News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Interpret d law<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News<br data-v-129554f0> Efik Show<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> Nostalgia <br data-v-129554f0> Dating gist<br data-v-129554f0> Hook up show<br data-v-129554f0> Good night kisses<br data-v-129554f0></td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 5, "active": openTab.value === 5 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0><b data-v-129554f0>News Update</b> <br data-v-129554f0> The Mid-Morning Show<br data-v-129554f0> Headline News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Transcorps 360<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News<br data-v-129554f0> Eckankar half hour<br data-v-129554f0> Upper Room Half hour </td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> MUSIC </td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 6, "active": openTab.value === 6 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><td data-v-129554f0>5am - 12pm</td><td data-v-129554f0><b data-v-129554f0>THE SATURDAY EXPERIENCE</b> <br data-v-129554f0> Good morning Calabar <br data-v-129554f0> World News <br data-v-129554f0> Paper Review <br data-v-129554f0> CR Times <br data-v-129554f0> Banter Show <br data-v-129554f0> Health Show <br data-v-129554f0> Yala Show <br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>12pm - 5pm</td><td data-v-129554f0> News in Retrospect <br data-v-129554f0><b data-v-129554f0>Sports Cruise</b></td></tr><tr data-v-129554f0><td data-v-129554f0> 3 </td><td data-v-129554f0>5pm - 6pm</td><td data-v-129554f0> Music </td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News <br data-v-129554f0><b data-v-129554f0>Dunamis</b></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>Music</td><td data-v-129554f0>Music</td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${ssrRenderClass({ " inactive": openTab.value !== 7, "active": openTab.value === 7 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><td data-v-129554f0>5am - 12pm</td><td data-v-129554f0><b data-v-129554f0>CHURCH ON RADIO</b> <br data-v-129554f0> MUSIC <br data-v-129554f0> World News <br data-v-129554f0> Prayer Time <br data-v-129554f0> Gospel Chit Chat <br data-v-129554f0> Praise Jam <br data-v-129554f0> Sparkling mail <br data-v-129554f0> Country music </td></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>12pm - 5pm</td><td data-v-129554f0> World News <br data-v-129554f0><b data-v-129554f0>Sunday Afternoon Experience</b> <br data-v-129554f0> Efik Show </td></tr><tr data-v-129554f0><td data-v-129554f0> 3 </td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News <br data-v-129554f0> Sparkling Request show <br data-v-129554f0> Upper Room <br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>8pm - 12pm</td><td data-v-129554f0> Music <br data-v-129554f0><b data-v-129554f0>Upper Room HALF HOUR</b></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>Music</td><td data-v-129554f0>Music</td></tr></table></div></div></div></div></div></div></div><div class="download" data-v-129554f0><a href="../assets/files/advert.pdf" download="Advert" data-v-129554f0>Download our Adverts Rate</a></div></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Program/index.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const index$4 = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-129554f0"]]);
const index$5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$4
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$e = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-0156eaf8><h1 class="text-center" data-v-0156eaf8>No shows yet!</h1></div>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/Shows/index.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const index$2 = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-0156eaf8"]]);
const index$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": index$2
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$d = {
  name: "[post]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const heading = inject("heading");
    const headerText = inject("headerText");
    const route = useRoute();
    const { $butterCMS } = useNuxtApp();
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("article", async () => {
      const slug = route.params.post;
      const response = await $butterCMS.post.retrieve(slug);
      const article = response.data.data;
      heading.value = headerText.value = article.title;
      return { article };
    })), __temp = await __temp, __restore(), __temp);
    onMounted(refresh);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_seo = _sfc_main$y;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(SingleArticle), {
        article: unref(data).article
      }, null, _parent));
      _push(ssrRenderComponent(_component_seo, {
        title: unref(data).article.title,
        description: unref(data).article.meta_description,
        image: unref(data).article.featured_image
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[post].vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _post_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$d
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$c = {
  name: "[category]",
  __ssrInlineRender: true,
  props: ["params"],
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { $butterCMS } = useNuxtApp();
    const slug = route.params.category;
    const { setError } = useApiError();
    inject("heading");
    const seoTitle = inject("seoTitle");
    const headerText = inject("headerText");
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("tag", async () => {
      const filter = { category_slug: slug };
      const response = await ($butterCMS == null ? void 0 : $butterCMS.post.list(filter));
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    onMounted(refresh);
    getBlogCategory(slug).then((category) => {
      headerText.value = "Category: " + category.name;
      seoTitle.value = "category: " + category.name;
    }).catch((e) => setError(e));
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(BlogPostsList), mergeProps({
        "blog-posts": unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/category/[category].vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _category_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$c
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$b = {
  name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const heading = inject("heading");
    const headerText = inject("headerText");
    heading.value = headerText.value = "All News";
    const { $butterCMS } = useNuxtApp();
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("tag", async () => {
      const response = await ($butterCMS == null ? void 0 : $butterCMS.post.list({}));
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    onMounted(refresh);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(BlogPostsList), mergeProps({
        "blog-posts": unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const index$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$b
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$a = {
  name: "search",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const heading = inject("heading");
    const seoTitle = inject("seoTitle");
    const headerText = inject("headerText");
    const filter = String(route.query["q"]);
    seoTitle.value = `search results for ${filter}`;
    heading.value = "Search Results";
    headerText.value = "Search: " + filter;
    const { data } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("search", async () => {
      const response = await butterCMS.post.search(filter);
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(BlogPostsList), mergeProps({
        "blog-posts": unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/search.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const search = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$a
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$9 = {
  name: "[tag]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { $butterCMS } = useNuxtApp();
    const route = useRoute();
    const { setError } = useApiError();
    const slug = route.params.tag;
    const heading = inject("heading");
    const seoTitle = inject("seoTitle");
    const headerText = inject("headerText");
    const { data, refresh } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData("tag", async () => {
      const filter = { tag_slug: slug };
      const response = await ($butterCMS == null ? void 0 : $butterCMS.post.list(filter));
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    onMounted(refresh);
    try {
      const tag = ([__temp, __restore] = withAsyncContext(() => getBlogTag(slug)), __temp = await __temp, __restore(), __temp);
      heading.value = tag.name;
      headerText.value = "Tag: " + tag.name;
      seoTitle.value = "tag: " + tag.name;
    } catch (e) {
      setError(e);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(BlogPostsList), mergeProps({
        "blog-posts": unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/tag/[tag].vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _tag_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$9
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$8 = {
  name: "blog",
  __ssrInlineRender: true,
  setup(__props) {
    useApiError();
    const route = useRoute$1();
    const headerText = ref("");
    const heading = ref("");
    const headerLinks = ref(basicBlogLinks);
    const seoTitle = ref("");
    provide("heading", heading);
    provide("headerText", headerText);
    provide("headerLinks", headerLinks);
    provide("seoTitle", seoTitle);
    const isMainBlogPage = computed(() => Object.keys(route.params).length === 0 && Object.keys(route.query).length === 0);
    const resolveBlogLinks = () => {
      if (isMainBlogPage.value) {
        headerLinks.value = [basicBlogLinks[0]];
        seoTitle.value = `All Posts`;
      } else
        headerLinks.value = basicBlogLinks;
    };
    watch(route, resolveBlogLinks);
    resolveBlogLinks();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = resolveComponent("NuxtPage");
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(BlogHeader, {
        heading: heading.value,
        links: headerLinks.value,
        text: headerText.value
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$w), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtPage, {
              params: unref(route).params
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtPage, {
                params: unref(route).params
              }, null, 8, ["params"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_sfc_main$y, {
        title: `SparklingFm - ${seoTitle.value}`,
        description: `A Radio station at the heart of Calabar, showing ${seoTitle.value}`
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const blog = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$8
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$7 = {
  name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(HomeView), _attrs, null, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const index = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$7
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$6 = {
  name: "[slug]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div></div>`);
      _push(ssrRenderComponent(unref(HomeView), {
        slug: unref(route).params.slug
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/landing-page/[slug].vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const Header_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$5 = {
  name: "Header",
  __ssrInlineRender: true,
  props: ["menuItems", "activeLink"],
  setup(__props) {
    const isSticky = ref(true);
    const isTogglerActive = ref(false);
    const headerNavbar = ref(null);
    const onScroll = () => {
      if (headerNavbar.value) {
        const sticky = headerNavbar.value.offsetTop;
        isSticky.value = window.scrollY > sticky;
      }
    };
    onMounted(() => {
      onScroll();
      window.document.addEventListener("scroll", onScroll, { passive: true });
      return () => window.document.removeEventListener("scroll", onScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-78d7123e><div class="${ssrRenderClass([{ sticky: isSticky.value }, "navbar-area"])}" data-v-78d7123e><div class="container" data-v-78d7123e><div class="row align-items-center" data-v-78d7123e><div class="col-lg-12" data-v-78d7123e><nav class="navbar navbar-expand-lg" data-v-78d7123e><a class="navbar-brand" href="/" data-v-78d7123e><img src="https://i.ibb.co/QrC7C7b/logo.png" alt="" class="img-fluid" data-v-78d7123e></a><button class="${ssrRenderClass([{ active: isTogglerActive.value }, "navbar-toggler"])}" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-v-78d7123e><span class="toggler-icon" data-v-78d7123e></span><span class="toggler-icon" data-v-78d7123e></span><span class="toggler-icon" data-v-78d7123e></span></button><div class="${ssrRenderClass([{ show: isTogglerActive.value }, "collapse navbar-collapse sub-menu-bar"])}" id="navbarSupportedContent" data-v-78d7123e><div class="ms-auto" data-v-78d7123e><ul id="nav" class="navbar-nav ms-auto" data-v-78d7123e><li data-v-78d7123e>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/",
        class: "nuxt-link-exact-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        tag: "li",
        to: "/About",
        class: "nuxt-link-exact-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About`);
          } else {
            return [
              createTextVNode("About")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        tag: "li",
        to: "/Oap",
        class: "nuxt-link-exact-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`OAPs`);
          } else {
            return [
              createTextVNode("OAPs")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/blog/",
        class: "nuxt-link-exact-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`News`);
          } else {
            return [
              createTextVNode("News")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li tag="li" data-v-78d7123e>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/Program",
        class: "nuxt-link-exact-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Programmes`);
          } else {
            return [
              createTextVNode("Programmes")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/Contact",
        class: "nuxt-link-exact-active"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact`);
          } else {
            return [
              createTextVNode("Contact")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div></nav></div></div></div></div></header>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-78d7123e"]]);
const Footer_vue_vue_type_style_index_0_scoped_true_lang = "";
const _sfc_main$4 = {
  name: "Footer",
  __ssrInlineRender: true,
  props: ["menuItems", "activeLink"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer pt-120 absolute bottom-0" }, _attrs))} data-v-58f1df96><div class="container" data-v-58f1df96><div class="row" data-v-58f1df96><div class="col-xl-3 col-lg-4 col-md-6 col-sm-10" data-v-58f1df96><div class="footer-widget" data-v-58f1df96><div class="logo" data-v-58f1df96><a href="#" data-v-58f1df96><img src="https://i.ibb.co/QrC7C7b/logo.png" width="130px" alt="logo" border="0" data-v-58f1df96></a></div><p class="desc" data-v-58f1df96> Your radio,your shine! </p><ul class="social-links" data-v-58f1df96><li data-v-58f1df96><a href="https://m.facebook.com/sparkling92.3fm" data-v-58f1df96><i class="lni lni-facebook" data-v-58f1df96></i></a></li><li data-v-58f1df96><a href="#0" data-v-58f1df96><i class="lni lni-instagram" data-v-58f1df96></i></a></li><li data-v-58f1df96><a href="#0" data-v-58f1df96><i class="lni lni-twitter" data-v-58f1df96></i></a></li></ul></div></div><div class="col-xl-5 col-lg-4 col-md-12 col-sm-12 offset-xl-1 contact" data-v-58f1df96><div class="footer-widget text-center" data-v-58f1df96><h2 data-v-58f1df96>Contact Us</h2><ul class="links" data-v-58f1df96><li data-v-58f1df96><b data-v-58f1df96>Address:</b>Sparkling Towers Royal Farm Estate Water intake road off Lemma road Ikot Effanga, Calabar,Nigeria </li><li data-v-58f1df96><b data-v-58f1df96>Email:</b>Sparkling923fm@gmail.com</li><div data-v-58f1df96><li data-v-58f1df96><b data-v-58f1df96>Telephone: </b>07037404903</li></div><li class="butter-logo" data-v-58f1df96><a href="https://buttercms.com" data-v-58f1df96><a href="https://buttercms.com/" data-v-58f1df96><img src="https://i.ibb.co/GTmKBYX/butter-b.png" width="200px" alt="butter-b" border="0" data-v-58f1df96></a></a></li></ul></div></div><div class="col-xl-3 col-lg-4 col-md-6" data-v-58f1df96><div class="footer-widget" data-v-58f1df96><h3 data-v-58f1df96>Subscribe Newsletter</h3><form action="#" data-v-58f1df96><input type="email" placeholder="Email" data-v-58f1df96><button class="main-btn btn-hover" data-v-58f1df96>Subscribe</button></form></div></div></div></div><div class="copyright" data-v-58f1df96><p class="text-center" data-v-58f1df96>\xA9 Copyright 2022 - SPARKLING FM CALABAR</p> <p class="slash" data-v-58f1df96>| </p><p data-v-58f1df96>Powered by <a href="#0" style="${ssrRenderStyle({ "color": "orange" })}" data-v-58f1df96>1DEV</a></p></div></footer>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-58f1df96"]]);
const _sfc_main$3 = {
  name: "ScrollToTop",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = ref(false);
    onMounted(() => {
      const onScroll = (event) => {
        isVisible.value = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
      };
      window.document.addEventListener("scroll", onScroll, { passive: true });
      return () => window.document.removeEventListener("scroll", onScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${ssrRenderAttrs(mergeProps({
        href: "#",
        class: ["scroll-top btn-hover d-flex", { "d-none": !isVisible.value }]
      }, _attrs))}><i class="lni lni-chevron-up"></i></a>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ScrollToTop.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Spinner.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  name: "NoApiKeyView"
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("views/NoApiKeyView.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const default_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const activeLink = ref("");
    const route = useRoute$1();
    const { items, loading } = useMenuItems();
    useApiError();
    const config = useRuntimeConfig();
    !!config.API_KEY;
    onMounted(() => {
      window.addEventListener("load", scrollToSection);
      window.document.addEventListener("scroll", onScroll, { passive: true });
    });
    onUnmounted(() => {
      window.removeEventListener("load", scrollToSection);
      window.document.removeEventListener("scroll", onScroll);
    });
    const onScroll = () => {
      const sections = document.querySelectorAll(".page-scroll");
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
      for (let currLink of sections) {
        const currLinkHref = currLink.getAttribute("href");
        const val = currLinkHref == null ? void 0 : currLinkHref.replace("/", "");
        const refElement = document.querySelector(String(val));
        const scrollTopMinus = scrollPos + 73;
        if (refElement && refElement.offsetTop <= scrollTopMinus && refElement.offsetTop + refElement.offsetHeight > scrollTopMinus) {
          activeLink.value = String(currLinkHref);
        }
      }
    };
    const scrollToSection = async () => {
      await nextTick();
      if (route.hash) {
        const elementToScrollId = route.hash.slice(1);
        let elem = document.getElementById(elementToScrollId);
        if (elem)
          elem.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
    };
    function handleMounted() {
      scrollToSection();
    }
    provide("layout", {
      handleMounted
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div>`);
      _push(ssrRenderComponent(unref(Header), {
        "menu-items": unref(items),
        "active-link": activeLink.value
      }, null, _parent));
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(ssrRenderComponent(unref(_sfc_main$3), null, null, _parent));
      _push(ssrRenderComponent(unref(Footer), {
        "menu-items": unref(items),
        "active-link": activeLink.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));
export { entry$1 as default };
