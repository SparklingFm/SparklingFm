globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'http';
import { Server } from 'https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, createError, createApp, createRouter, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ohmyfetch';
import { createRouter as createRouter$1 } from 'radix3';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import { hash } from 'ohash';
import { createStorage } from 'unstorage';
import { withQuery, withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"routes":{},"envPrefix":"NUXT_"},"API_KEY":"d698cf74eb3035d88339a60f76e7be046256d9ed","PREVIEW":"true","public":{"API_KEY":"d698cf74eb3035d88339a60f76e7be046256d9ed","PREVIEW":"true"}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]);
};
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const globalTiming = globalThis.__timing__ || {
  start: () => 0,
  end: () => 0,
  metrics: []
};
function timingMiddleware(_req, res, next) {
  const start = globalTiming.start();
  const _end = res.end;
  res.end = (data, encoding, callback) => {
    const metrics = [["Generate", globalTiming.end(start)], ...globalTiming.metrics];
    const serverTiming = metrics.map((m) => `-;dur=${m[1]};desc="${encodeURIComponent(m[0])}"`).join(", ");
    if (!res.headersSent) {
      res.setHeader("Server-Timing", serverTiming);
    }
    _end.call(res, data, encoding, callback);
  };
  next();
}

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  async function get(key, resolver) {
    const cacheKey = [opts.base, group, name, key].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl;
    const _resolve = async () => {
      if (!pending[key]) {
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      entry.mtime = Date.now();
      entry.integrity = integrity;
      delete pending[key];
      useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return Promise.resolve(entry);
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const key = (opts.getKey || getKey)(...args);
    const entry = await get(key, () => fn(...args));
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length ? hash(args, {}) : "";
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: (event) => {
      return event.req.originalUrl || event.req.url;
    },
    group: opts.group || "nitro/handlers",
    integrity: [
      opts.integrity,
      handler
    ]
  };
  const _cachedHandler = cachedFunction(async (incomingEvent) => {
    const reqProxy = cloneWithProxy(incomingEvent.req, { headers: {} });
    const resHeaders = {};
    const resProxy = cloneWithProxy(incomingEvent.res, {
      statusCode: 200,
      getHeader(name) {
        return resHeaders[name];
      },
      setHeader(name, value) {
        resHeaders[name] = value;
        return this;
      },
      getHeaderNames() {
        return Object.keys(resHeaders);
      },
      hasHeader(name) {
        return name in resHeaders;
      },
      removeHeader(name) {
        delete resHeaders[name];
      },
      getHeaders() {
        return resHeaders;
      }
    });
    const event = createEvent(reqProxy, resProxy);
    event.context = incomingEvent.context;
    const body = await handler(event);
    const headers = event.res.getHeaders();
    headers.Etag = `W/"${hash(body)}"`;
    headers["Last-Modified"] = new Date().toUTCString();
    const cacheControl = [];
    if (opts.swr) {
      if (opts.maxAge) {
        cacheControl.push(`s-maxage=${opts.maxAge}`);
      }
      if (opts.staleMaxAge) {
        cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
      } else {
        cacheControl.push("stale-while-revalidate");
      }
    } else if (opts.maxAge) {
      cacheControl.push(`max-age=${opts.maxAge}`);
    }
    if (cacheControl.length) {
      headers["Cache-Control"] = cacheControl.join(", ");
    }
    const cacheEntry = {
      code: event.res.statusCode,
      headers,
      body
    };
    return cacheEntry;
  }, _opts);
  return defineEventHandler(async (event) => {
    const response = await _cachedHandler(event);
    if (event.res.headersSent || event.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["Last-Modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.res.statusCode = response.code;
    for (const name in response.headers) {
      event.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const plugins = [
  
];

function hasReqHeader(req, header, includes) {
  const value = req.headers[header];
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event.req, "accept", "application/json") || hasReqHeader(event.req, "user-agent", "curl/") || hasReqHeader(event.req, "user-agent", "httpie/") || event.req.url?.endsWith(".json") || event.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = process.cwd();
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Route Not Found" : "Internal Server Error");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(_error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(_error);
  const errorObject = {
    url: event.req.url,
    statusCode,
    statusMessage,
    message,
    description: "",
    data: _error.data
  };
  event.res.statusCode = errorObject.statusCode;
  event.res.statusMessage = errorObject.statusMessage;
  if (errorObject.statusCode !== 404) {
    console.error("[nuxt] [request error]", errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.res.setHeader("Content-Type", "application/json");
    event.res.end(JSON.stringify(errorObject));
    return;
  }
  const url = withQuery("/__nuxt_error", errorObject);
  const html = await $fetch(url).catch((error) => {
    console.error("[nitro] Error while generating error response", error);
    return errorObject.statusMessage;
  });
  event.res.setHeader("Content-Type", "text/html;charset=UTF-8");
  event.res.end(html);
});

const assets = {
  "/_nuxt/BlogPostsList-75c5e1e7.mjs": {
    "type": "application/javascript",
    "etag": "\"82c-zVhfvzHGVZQoEhMJ5OgTQQ3w+fk\"",
    "mtime": "2022-12-05T20:42:07.751Z",
    "path": "../public/_nuxt/BlogPostsList-75c5e1e7.mjs"
  },
  "/_nuxt/BlogWidget-e969c42e.mjs": {
    "type": "application/javascript",
    "etag": "\"3e5-MkfGYg8Y8o/KJ5kiCMkFfVpYdVc\"",
    "mtime": "2022-12-05T20:42:07.751Z",
    "path": "../public/_nuxt/BlogWidget-e969c42e.mjs"
  },
  "/_nuxt/HomeView-dc0ff5d3.mjs": {
    "type": "application/javascript",
    "etag": "\"1ecf-6qdrtxkhfNUVRAKCq7AmdVEOZAQ\"",
    "mtime": "2022-12-05T20:42:07.750Z",
    "path": "../public/_nuxt/HomeView-dc0ff5d3.mjs"
  },
  "/_nuxt/LineIcons.0608c818.woff2": {
    "type": "font/woff2",
    "etag": "\"f44c-jDGQDsGQDRGuuo2RJONUMr3uwW8\"",
    "mtime": "2022-12-05T20:42:07.750Z",
    "path": "../public/_nuxt/LineIcons.0608c818.woff2"
  },
  "/_nuxt/LineIcons.0f4707ff.ttf": {
    "type": "font/ttf",
    "etag": "\"21fe0-MzA6D83lAz0ff8EM99TmU4+xpBw\"",
    "mtime": "2022-12-05T20:42:07.747Z",
    "path": "../public/_nuxt/LineIcons.0f4707ff.ttf"
  },
  "/_nuxt/LineIcons.182b2455.eot": {
    "type": "application/vnd.ms-fontobject",
    "etag": "\"2208c-IkjAVSvr4ufL65IaJKQxblZB5Vs\"",
    "mtime": "2022-12-05T20:42:07.744Z",
    "path": "../public/_nuxt/LineIcons.182b2455.eot"
  },
  "/_nuxt/LineIcons.2f006ab4.woff": {
    "type": "font/woff",
    "etag": "\"12a8c-5KHqknsOgrFsjhsqUA6X8t+ThlE\"",
    "mtime": "2022-12-05T20:42:07.741Z",
    "path": "../public/_nuxt/LineIcons.2f006ab4.woff"
  },
  "/_nuxt/LineIcons.e49a4d51.svg": {
    "type": "image/svg+xml",
    "etag": "\"90e67-htKWpPhnbzL09AILFasWHsfm1dQ\"",
    "mtime": "2022-12-05T20:42:07.730Z",
    "path": "../public/_nuxt/LineIcons.e49a4d51.svg"
  },
  "/_nuxt/Seo-3884c79f.mjs": {
    "type": "application/javascript",
    "etag": "\"2e2-KWJhyW1yCL4ZQaWx3b4GPafc/eg\"",
    "mtime": "2022-12-05T20:42:07.723Z",
    "path": "../public/_nuxt/Seo-3884c79f.mjs"
  },
  "/_nuxt/_category_-fc461b74.mjs": {
    "type": "application/javascript",
    "etag": "\"4ae-hjn9NAIr+TAqf0ZDH4fqr/dEEaU\"",
    "mtime": "2022-12-05T20:42:07.722Z",
    "path": "../public/_nuxt/_category_-fc461b74.mjs"
  },
  "/_nuxt/_post_-d38e86fb.mjs": {
    "type": "application/javascript",
    "etag": "\"a11-q3CyWc9bJXykSH21IdjYnWgnClY\"",
    "mtime": "2022-12-05T20:42:07.722Z",
    "path": "../public/_nuxt/_post_-d38e86fb.mjs"
  },
  "/_nuxt/_slug_-05c96cea.mjs": {
    "type": "application/javascript",
    "etag": "\"22f-oIin31SH2m69hI+SSxDQD2wIPIE\"",
    "mtime": "2022-12-05T20:42:07.722Z",
    "path": "../public/_nuxt/_slug_-05c96cea.mjs"
  },
  "/_nuxt/_tag_-e54377b5.mjs": {
    "type": "application/javascript",
    "etag": "\"47f-dC7gNCnMklL4t/b8ipQha5gbrLk\"",
    "mtime": "2022-12-05T20:42:07.721Z",
    "path": "../public/_nuxt/_tag_-e54377b5.mjs"
  },
  "/_nuxt/asyncData-7f185d24.mjs": {
    "type": "application/javascript",
    "etag": "\"8c9-1NMxveSG/+QD3VRclDDo2LUGtv4\"",
    "mtime": "2022-12-05T20:42:07.721Z",
    "path": "../public/_nuxt/asyncData-7f185d24.mjs"
  },
  "/_nuxt/blog-b4d0d4dd.mjs": {
    "type": "application/javascript",
    "etag": "\"ab6-8763jC9bTGJ9mp30kN6nk+DaYlU\"",
    "mtime": "2022-12-05T20:42:07.720Z",
    "path": "../public/_nuxt/blog-b4d0d4dd.mjs"
  },
  "/_nuxt/common-bg.ab1f4e22.svg": {
    "type": "image/svg+xml",
    "etag": "\"228-MPuzPNROrUvzk2nmpZFBbOm/LMU\"",
    "mtime": "2022-12-05T20:42:07.720Z",
    "path": "../public/_nuxt/common-bg.ab1f4e22.svg"
  },
  "/_nuxt/default-de11caaf.mjs": {
    "type": "application/javascript",
    "etag": "\"22ae-W32jYvLe87utdRkX+jFe9BsMSds\"",
    "mtime": "2022-12-05T20:42:07.720Z",
    "path": "../public/_nuxt/default-de11caaf.mjs"
  },
  "/_nuxt/default.15e6ec36.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"605-z3oT52ZdXx1TL+zcVcj5m5pYUcE\"",
    "mtime": "2022-12-05T20:42:07.718Z",
    "path": "../public/_nuxt/default.15e6ec36.css"
  },
  "/_nuxt/entry-d3620292.mjs": {
    "type": "application/javascript",
    "etag": "\"2d14a-Usz/XIt+6HLBRAFhF8dgVcMMxJ4\"",
    "mtime": "2022-12-05T20:42:07.718Z",
    "path": "../public/_nuxt/entry-d3620292.mjs"
  },
  "/_nuxt/entry.a6778b90.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"22bda-wujikOk5MfYKvlZO6R4vKmyPHIA\"",
    "mtime": "2022-12-05T20:42:07.714Z",
    "path": "../public/_nuxt/entry.a6778b90.css"
  },
  "/_nuxt/index-35ff7a69.mjs": {
    "type": "application/javascript",
    "etag": "\"626-V5kvZcIHnUAif8FgU4N7X7U8ABY\"",
    "mtime": "2022-12-05T20:42:07.710Z",
    "path": "../public/_nuxt/index-35ff7a69.mjs"
  },
  "/_nuxt/index-923f802e.mjs": {
    "type": "application/javascript",
    "etag": "\"c3-nC0beteL+vV+xHPQ7vKat1x5XCE\"",
    "mtime": "2022-12-05T20:42:07.710Z",
    "path": "../public/_nuxt/index-923f802e.mjs"
  },
  "/_nuxt/index-adaa3774.mjs": {
    "type": "application/javascript",
    "etag": "\"145-yBtj2J+lVZHpb9s3fKJRW/6no90\"",
    "mtime": "2022-12-05T20:42:07.709Z",
    "path": "../public/_nuxt/index-adaa3774.mjs"
  },
  "/_nuxt/index-b57c26d8.mjs": {
    "type": "application/javascript",
    "etag": "\"364f-7GMH0RFzoBtRz5sojx4GkyOXyHE\"",
    "mtime": "2022-12-05T20:42:07.708Z",
    "path": "../public/_nuxt/index-b57c26d8.mjs"
  },
  "/_nuxt/index-bd9fe10a.mjs": {
    "type": "application/javascript",
    "etag": "\"4f1-vPuMUcJ8BTfje2JK0dLuH/IYhC0\"",
    "mtime": "2022-12-05T20:42:07.708Z",
    "path": "../public/_nuxt/index-bd9fe10a.mjs"
  },
  "/_nuxt/index-c188d25f.mjs": {
    "type": "application/javascript",
    "etag": "\"d47-Rr//Yg2oAC3LrcMUHS+BJGkJzp8\"",
    "mtime": "2022-12-05T20:42:07.708Z",
    "path": "../public/_nuxt/index-c188d25f.mjs"
  },
  "/_nuxt/index-e765f47e.mjs": {
    "type": "application/javascript",
    "etag": "\"353-S1BXmxckxjU5pdQnNtGmBvAk8Ac\"",
    "mtime": "2022-12-05T20:42:07.707Z",
    "path": "../public/_nuxt/index-e765f47e.mjs"
  },
  "/_nuxt/index-ef4afbd4.mjs": {
    "type": "application/javascript",
    "etag": "\"1b4-KEJJE9AnTYZNv9vDATBtQFMhTTs\"",
    "mtime": "2022-12-05T20:42:07.707Z",
    "path": "../public/_nuxt/index-ef4afbd4.mjs"
  },
  "/_nuxt/manifest.json": {
    "type": "application/json",
    "etag": "\"1781-9mh2GwJmXTs7GGj4i7tma38WwEw\"",
    "mtime": "2022-12-05T20:42:07.706Z",
    "path": "../public/_nuxt/manifest.json"
  },
  "/_nuxt/placeholder-733c4eac.mjs": {
    "type": "application/javascript",
    "etag": "\"fcf-XvudcqLH2wVsaltfJrjw3pdhBmY\"",
    "mtime": "2022-12-05T20:42:07.706Z",
    "path": "../public/_nuxt/placeholder-733c4eac.mjs"
  },
  "/_nuxt/search-cdb7fd40.mjs": {
    "type": "application/javascript",
    "etag": "\"38d-/9DANPqWOCqaCtHgufBBvHwcMp0\"",
    "mtime": "2022-12-05T20:42:07.705Z",
    "path": "../public/_nuxt/search-cdb7fd40.mjs"
  },
  "/_nuxt/service-93c2c932.mjs": {
    "type": "application/javascript",
    "etag": "\"a9-thypAV8XQd4515bRd9uePYC96v8\"",
    "mtime": "2022-12-05T20:42:07.703Z",
    "path": "../public/_nuxt/service-93c2c932.mjs"
  },
  "/_nuxt/testimonial-bg.c6477629.svg": {
    "type": "image/svg+xml",
    "etag": "\"457-Eg5Rd/lWD6pEg8p0Tf1+vE2e608\"",
    "mtime": "2022-12-05T20:42:07.702Z",
    "path": "../public/_nuxt/testimonial-bg.c6477629.svg"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = ["/_nuxt"];

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return
  }
  for (const base of publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const _152570 = eventHandler(async (event) => {
  if (event.req.method && !METHODS.includes(event.req.method)) {
    return;
  }
  let id = decodeURIComponent(withLeadingSlash(withoutTrailingSlash(parseURL(event.req.url).pathname)));
  let asset;
  for (const _id of [id, id + "/index.html"]) {
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
      break;
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.res.statusCode = 304;
    event.res.end("Not Modified (etag)");
    return;
  }
  const ifModifiedSinceH = event.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      event.res.statusCode = 304;
      event.res.end("Not Modified (mtime)");
      return;
    }
  }
  if (asset.type) {
    event.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    event.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    event.res.setHeader("Last-Modified", asset.mtime);
  }
  const contents = await readAsset(id);
  event.res.end(contents);
});

const _lazy_820075 = () => import('../handlers/renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _152570, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_820075, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_820075, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  h3App.use(config.app.baseURL, timingMiddleware);
  const router = createRouter();
  const routerOptions = createRouter$1({ routes: config.nitro.routes });
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    const referenceRoute = h.route.replace(/:\w+|\*\*/g, "_");
    const routeOptions = routerOptions.lookup(referenceRoute) || {};
    if (routeOptions.swr) {
      handler = cachedEventHandler(handler, {
        group: "nitro/routes"
      });
    }
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(/\/+/g, "/");
      h3App.use(middlewareBase, handler);
    } else {
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const localCall = createCall(h3App.nodeHandler);
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({ fetch: localFetch, Headers, defaults: { baseURL: config.app.baseURL } });
  globalThis.$fetch = $fetch;
  const app = {
    hooks,
    h3App,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, nitroApp.h3App.nodeHandler) : new Server$1(nitroApp.h3App.nodeHandler);
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const hostname = process.env.NITRO_HOST || process.env.HOST || "0.0.0.0";
server.listen(port, hostname, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  console.log(`Listening on ${protocol}://${hostname}:${port}${useRuntimeConfig().app.baseURL}`);
});
{
  process.on("unhandledRejection", (err) => console.error("[nitro] [dev] [unhandledRejection] " + err));
  process.on("uncaughtException", (err) => console.error("[nitro] [dev] [uncaughtException] " + err));
}
const nodeServer = {};

export { nodeServer as n, useRuntimeConfig as u };
//# sourceMappingURL=node-server.mjs.map
