import { v as vue_cjs_prod, s as serverRenderer } from '../renderer.mjs';
import { hasProtocol, isEqual, withBase, withQuery, joinURL } from 'file:///Users/achufam/Documents/SparklingFm/node_modules/ufo/dist/index.mjs';
import Butter from 'file:///Users/achufam/Documents/SparklingFm/node_modules/buttercms/lib/butter.js';
import { u as useRuntimeConfig$1 } from '../nitro/nitro-prerenderer.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/h3/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/unenv/runtime/mock/proxy.mjs';
import 'stream';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/node-fetch-native/dist/polyfill.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/ohmyfetch/dist/node.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/destr/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/radix3/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/unenv/runtime/fetch/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/hookable/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/scule/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/ohash/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/achufam/Documents/SparklingFm/node_modules/unstorage/dist/drivers/fs.mjs';

var vueRouter_cjs = {};

/*!
  * vue-router v4.0.15
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */

(function (exports) {

	Object.defineProperty(exports, '__esModule', { value: true });

	var vue = vue_cjs_prod;

	const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
	const PolySymbol = (name) => 
	// vr = vue router
	hasSymbol
	    ? Symbol('[vue-router]: ' + name )
	    : ('[vue-router]: ' ) + name;
	// rvlm = Router View Location Matched
	/**
	 * RouteRecord being rendered by the closest ancestor Router View. Used for
	 * `onBeforeRouteUpdate` and `onBeforeRouteLeave`. rvlm stands for Router View
	 * Location Matched
	 *
	 * @internal
	 */
	const matchedRouteKey = /*#__PURE__*/ PolySymbol('router view location matched' );
	/**
	 * Allows overriding the router view depth to control which component in
	 * `matched` is rendered. rvd stands for Router View Depth
	 *
	 * @internal
	 */
	const viewDepthKey = /*#__PURE__*/ PolySymbol('router view depth' );
	/**
	 * Allows overriding the router instance returned by `useRouter` in tests. r
	 * stands for router
	 *
	 * @internal
	 */
	const routerKey = /*#__PURE__*/ PolySymbol('router' );
	/**
	 * Allows overriding the current route returned by `useRoute` in tests. rl
	 * stands for route location
	 *
	 * @internal
	 */
	const routeLocationKey = /*#__PURE__*/ PolySymbol('route location' );
	/**
	 * Allows overriding the current route used by router-view. Internally this is
	 * used when the `route` prop is passed.
	 *
	 * @internal
	 */
	const routerViewLocationKey = /*#__PURE__*/ PolySymbol('router view location' );

	function isESModule(obj) {
	    return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module');
	}
	const assign = Object.assign;
	function applyToParams(fn, params) {
	    const newParams = {};
	    for (const key in params) {
	        const value = params[key];
	        newParams[key] = Array.isArray(value) ? value.map(fn) : fn(value);
	    }
	    return newParams;
	}
	const noop = () => { };

	function warn(msg) {
	    // avoid using ...args as it breaks in older Edge builds
	    const args = Array.from(arguments).slice(1);
	    console.warn.apply(console, ['[Vue Router warn]: ' + msg].concat(args));
	}

	const TRAILING_SLASH_RE = /\/$/;
	const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, '');
	/**
	 * Transforms an URI into a normalized history location
	 *
	 * @param parseQuery
	 * @param location - URI to normalize
	 * @param currentLocation - current absolute location. Allows resolving relative
	 * paths. Must start with `/`. Defaults to `/`
	 * @returns a normalized history location
	 */
	function parseURL(parseQuery, location, currentLocation = '/') {
	    let path, query = {}, searchString = '', hash = '';
	    // Could use URL and URLSearchParams but IE 11 doesn't support it
	    const searchPos = location.indexOf('?');
	    const hashPos = location.indexOf('#', searchPos > -1 ? searchPos : 0);
	    if (searchPos > -1) {
	        path = location.slice(0, searchPos);
	        searchString = location.slice(searchPos + 1, hashPos > -1 ? hashPos : location.length);
	        query = parseQuery(searchString);
	    }
	    if (hashPos > -1) {
	        path = path || location.slice(0, hashPos);
	        // keep the # character
	        hash = location.slice(hashPos, location.length);
	    }
	    // no search and no query
	    path = resolveRelativePath(path != null ? path : location, currentLocation);
	    // empty path means a relative query or hash `?foo=f`, `#thing`
	    return {
	        fullPath: path + (searchString && '?') + searchString + hash,
	        path,
	        query,
	        hash,
	    };
	}
	/**
	 * Stringifies a URL object
	 *
	 * @param stringifyQuery
	 * @param location
	 */
	function stringifyURL(stringifyQuery, location) {
	    const query = location.query ? stringifyQuery(location.query) : '';
	    return location.path + (query && '?') + query + (location.hash || '');
	}
	/**
	 * Strips off the base from the beginning of a location.pathname in a non
	 * case-sensitive way.
	 *
	 * @param pathname - location.pathname
	 * @param base - base to strip off
	 */
	function stripBase(pathname, base) {
	    // no base or base is not found at the beginning
	    if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
	        return pathname;
	    return pathname.slice(base.length) || '/';
	}
	/**
	 * Checks if two RouteLocation are equal. This means that both locations are
	 * pointing towards the same {@link RouteRecord} and that all `params`, `query`
	 * parameters and `hash` are the same
	 *
	 * @param a - first {@link RouteLocation}
	 * @param b - second {@link RouteLocation}
	 */
	function isSameRouteLocation(stringifyQuery, a, b) {
	    const aLastIndex = a.matched.length - 1;
	    const bLastIndex = b.matched.length - 1;
	    return (aLastIndex > -1 &&
	        aLastIndex === bLastIndex &&
	        isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) &&
	        isSameRouteLocationParams(a.params, b.params) &&
	        stringifyQuery(a.query) === stringifyQuery(b.query) &&
	        a.hash === b.hash);
	}
	/**
	 * Check if two `RouteRecords` are equal. Takes into account aliases: they are
	 * considered equal to the `RouteRecord` they are aliasing.
	 *
	 * @param a - first {@link RouteRecord}
	 * @param b - second {@link RouteRecord}
	 */
	function isSameRouteRecord(a, b) {
	    // since the original record has an undefined value for aliasOf
	    // but all aliases point to the original record, this will always compare
	    // the original record
	    return (a.aliasOf || a) === (b.aliasOf || b);
	}
	function isSameRouteLocationParams(a, b) {
	    if (Object.keys(a).length !== Object.keys(b).length)
	        return false;
	    for (const key in a) {
	        if (!isSameRouteLocationParamsValue(a[key], b[key]))
	            return false;
	    }
	    return true;
	}
	function isSameRouteLocationParamsValue(a, b) {
	    return Array.isArray(a)
	        ? isEquivalentArray(a, b)
	        : Array.isArray(b)
	            ? isEquivalentArray(b, a)
	            : a === b;
	}
	/**
	 * Check if two arrays are the same or if an array with one single entry is the
	 * same as another primitive value. Used to check query and parameters
	 *
	 * @param a - array of values
	 * @param b - array of values or a single value
	 */
	function isEquivalentArray(a, b) {
	    return Array.isArray(b)
	        ? a.length === b.length && a.every((value, i) => value === b[i])
	        : a.length === 1 && a[0] === b;
	}
	/**
	 * Resolves a relative path that starts with `.`.
	 *
	 * @param to - path location we are resolving
	 * @param from - currentLocation.path, should start with `/`
	 */
	function resolveRelativePath(to, from) {
	    if (to.startsWith('/'))
	        return to;
	    if (!from.startsWith('/')) {
	        warn(`Cannot resolve a relative location without an absolute path. Trying to resolve "${to}" from "${from}". It should look like "/${from}".`);
	        return to;
	    }
	    if (!to)
	        return from;
	    const fromSegments = from.split('/');
	    const toSegments = to.split('/');
	    let position = fromSegments.length - 1;
	    let toPosition;
	    let segment;
	    for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
	        segment = toSegments[toPosition];
	        // can't go below zero
	        if (position === 1 || segment === '.')
	            continue;
	        if (segment === '..')
	            position--;
	        // found something that is not relative path
	        else
	            break;
	    }
	    return (fromSegments.slice(0, position).join('/') +
	        '/' +
	        toSegments
	            .slice(toPosition - (toPosition === toSegments.length ? 1 : 0))
	            .join('/'));
	}

	var NavigationType;
	(function (NavigationType) {
	    NavigationType["pop"] = "pop";
	    NavigationType["push"] = "push";
	})(NavigationType || (NavigationType = {}));
	var NavigationDirection;
	(function (NavigationDirection) {
	    NavigationDirection["back"] = "back";
	    NavigationDirection["forward"] = "forward";
	    NavigationDirection["unknown"] = "";
	})(NavigationDirection || (NavigationDirection = {}));
	/**
	 * Starting location for Histories
	 */
	const START = '';
	// Generic utils
	/**
	 * Normalizes a base by removing any trailing slash and reading the base tag if
	 * present.
	 *
	 * @param base - base to normalize
	 */
	function normalizeBase(base) {
	    if (!base) {
	        {
	            base = '/';
	        }
	    }
	    // ensure leading slash when it was removed by the regex above avoid leading
	    // slash with hash because the file could be read from the disk like file://
	    // and the leading slash would cause problems
	    if (base[0] !== '/' && base[0] !== '#')
	        base = '/' + base;
	    // remove the trailing slash so all other method can just do `base + fullPath`
	    // to build an href
	    return removeTrailingSlash(base);
	}
	// remove any character before the hash
	const BEFORE_HASH_RE = /^[^#]+#/;
	function createHref(base, location) {
	    return base.replace(BEFORE_HASH_RE, '#') + location;
	}
	const computeScrollPosition = () => ({
	    left: window.pageXOffset,
	    top: window.pageYOffset,
	});
	// TODO: RFC about how to save scroll position
	/**
	 * ScrollBehavior instance used by the router to compute and restore the scroll
	 * position when navigating.
	 */
	// export interface ScrollHandler<ScrollPositionEntry extends HistoryStateValue, ScrollPosition extends ScrollPositionEntry> {
	//   // returns a scroll position that can be saved in history
	//   compute(): ScrollPositionEntry
	//   // can take an extended ScrollPositionEntry
	//   scroll(position: ScrollPosition): void
	// }
	// export const scrollHandler: ScrollHandler<ScrollPosition> = {
	//   compute: computeScroll,
	//   scroll: scrollToPosition,
	// }

	let createBaseLocation = () => location.protocol + '//' + location.host;
	/**
	 * Creates a normalized history location from a window.location object
	 * @param location -
	 */
	function createCurrentLocation(base, location) {
	    const { pathname, search, hash } = location;
	    // allows hash bases like #, /#, #/, #!, #!/, /#!/, or even /folder#end
	    const hashPos = base.indexOf('#');
	    if (hashPos > -1) {
	        let slicePos = hash.includes(base.slice(hashPos))
	            ? base.slice(hashPos).length
	            : 1;
	        let pathFromHash = hash.slice(slicePos);
	        // prepend the starting slash to hash so the url starts with /#
	        if (pathFromHash[0] !== '/')
	            pathFromHash = '/' + pathFromHash;
	        return stripBase(pathFromHash, '');
	    }
	    const path = stripBase(pathname, base);
	    return path + search + hash;
	}
	function useHistoryListeners(base, historyState, currentLocation, replace) {
	    let listeners = [];
	    let teardowns = [];
	    // TODO: should it be a stack? a Dict. Check if the popstate listener
	    // can trigger twice
	    let pauseState = null;
	    const popStateHandler = ({ state, }) => {
	        const to = createCurrentLocation(base, location);
	        const from = currentLocation.value;
	        const fromState = historyState.value;
	        let delta = 0;
	        if (state) {
	            currentLocation.value = to;
	            historyState.value = state;
	            // ignore the popstate and reset the pauseState
	            if (pauseState && pauseState === from) {
	                pauseState = null;
	                return;
	            }
	            delta = fromState ? state.position - fromState.position : 0;
	        }
	        else {
	            replace(to);
	        }
	        // console.log({ deltaFromCurrent })
	        // Here we could also revert the navigation by calling history.go(-delta)
	        // this listener will have to be adapted to not trigger again and to wait for the url
	        // to be updated before triggering the listeners. Some kind of validation function would also
	        // need to be passed to the listeners so the navigation can be accepted
	        // call all listeners
	        listeners.forEach(listener => {
	            listener(currentLocation.value, from, {
	                delta,
	                type: NavigationType.pop,
	                direction: delta
	                    ? delta > 0
	                        ? NavigationDirection.forward
	                        : NavigationDirection.back
	                    : NavigationDirection.unknown,
	            });
	        });
	    };
	    function pauseListeners() {
	        pauseState = currentLocation.value;
	    }
	    function listen(callback) {
	        // setup the listener and prepare teardown callbacks
	        listeners.push(callback);
	        const teardown = () => {
	            const index = listeners.indexOf(callback);
	            if (index > -1)
	                listeners.splice(index, 1);
	        };
	        teardowns.push(teardown);
	        return teardown;
	    }
	    function beforeUnloadListener() {
	        const { history } = window;
	        if (!history.state)
	            return;
	        history.replaceState(assign({}, history.state, { scroll: computeScrollPosition() }), '');
	    }
	    function destroy() {
	        for (const teardown of teardowns)
	            teardown();
	        teardowns = [];
	        window.removeEventListener('popstate', popStateHandler);
	        window.removeEventListener('beforeunload', beforeUnloadListener);
	    }
	    // setup the listeners and prepare teardown callbacks
	    window.addEventListener('popstate', popStateHandler);
	    window.addEventListener('beforeunload', beforeUnloadListener);
	    return {
	        pauseListeners,
	        listen,
	        destroy,
	    };
	}
	/**
	 * Creates a state object
	 */
	function buildState(back, current, forward, replaced = false, computeScroll = false) {
	    return {
	        back,
	        current,
	        forward,
	        replaced,
	        position: window.history.length,
	        scroll: computeScroll ? computeScrollPosition() : null,
	    };
	}
	function useHistoryStateNavigation(base) {
	    const { history, location } = window;
	    // private variables
	    const currentLocation = {
	        value: createCurrentLocation(base, location),
	    };
	    const historyState = { value: history.state };
	    // build current history entry as this is a fresh navigation
	    if (!historyState.value) {
	        changeLocation(currentLocation.value, {
	            back: null,
	            current: currentLocation.value,
	            forward: null,
	            // the length is off by one, we need to decrease it
	            position: history.length - 1,
	            replaced: true,
	            // don't add a scroll as the user may have an anchor and we want
	            // scrollBehavior to be triggered without a saved position
	            scroll: null,
	        }, true);
	    }
	    function changeLocation(to, state, replace) {
	        /**
	         * if a base tag is provided and we are on a normal domain, we have to
	         * respect the provided `base` attribute because pushState() will use it and
	         * potentially erase anything before the `#` like at
	         * https://github.com/vuejs/router/issues/685 where a base of
	         * `/folder/#` but a base of `/` would erase the `/folder/` section. If
	         * there is no host, the `<base>` tag makes no sense and if there isn't a
	         * base tag we can just use everything after the `#`.
	         */
	        const hashIndex = base.indexOf('#');
	        const url = hashIndex > -1
	            ? (location.host && document.querySelector('base')
	                ? base
	                : base.slice(hashIndex)) + to
	            : createBaseLocation() + base + to;
	        try {
	            // BROWSER QUIRK
	            // NOTE: Safari throws a SecurityError when calling this function 100 times in 30 seconds
	            history[replace ? 'replaceState' : 'pushState'](state, '', url);
	            historyState.value = state;
	        }
	        catch (err) {
	            {
	                warn('Error with push/replace State', err);
	            }
	            // Force the navigation, this also resets the call count
	            location[replace ? 'replace' : 'assign'](url);
	        }
	    }
	    function replace(to, data) {
	        const state = assign({}, history.state, buildState(historyState.value.back, 
	        // keep back and forward entries but override current position
	        to, historyState.value.forward, true), data, { position: historyState.value.position });
	        changeLocation(to, state, true);
	        currentLocation.value = to;
	    }
	    function push(to, data) {
	        // Add to current entry the information of where we are going
	        // as well as saving the current position
	        const currentState = assign({}, 
	        // use current history state to gracefully handle a wrong call to
	        // history.replaceState
	        // https://github.com/vuejs/router/issues/366
	        historyState.value, history.state, {
	            forward: to,
	            scroll: computeScrollPosition(),
	        });
	        if (!history.state) {
	            warn(`history.state seems to have been manually replaced without preserving the necessary values. Make sure to preserve existing history state if you are manually calling history.replaceState:\n\n` +
	                `history.replaceState(history.state, '', url)\n\n` +
	                `You can find more information at https://next.router.vuejs.org/guide/migration/#usage-of-history-state.`);
	        }
	        changeLocation(currentState.current, currentState, true);
	        const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
	        changeLocation(to, state, false);
	        currentLocation.value = to;
	    }
	    return {
	        location: currentLocation,
	        state: historyState,
	        push,
	        replace,
	    };
	}
	/**
	 * Creates an HTML5 history. Most common history for single page applications.
	 *
	 * @param base -
	 */
	function createWebHistory(base) {
	    base = normalizeBase(base);
	    const historyNavigation = useHistoryStateNavigation(base);
	    const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
	    function go(delta, triggerListeners = true) {
	        if (!triggerListeners)
	            historyListeners.pauseListeners();
	        history.go(delta);
	    }
	    const routerHistory = assign({
	        // it's overridden right after
	        location: '',
	        base,
	        go,
	        createHref: createHref.bind(null, base),
	    }, historyNavigation, historyListeners);
	    Object.defineProperty(routerHistory, 'location', {
	        enumerable: true,
	        get: () => historyNavigation.location.value,
	    });
	    Object.defineProperty(routerHistory, 'state', {
	        enumerable: true,
	        get: () => historyNavigation.state.value,
	    });
	    return routerHistory;
	}

	/**
	 * Creates a in-memory based history. The main purpose of this history is to handle SSR. It starts in a special location that is nowhere.
	 * It's up to the user to replace that location with the starter location by either calling `router.push` or `router.replace`.
	 *
	 * @param base - Base applied to all urls, defaults to '/'
	 * @returns a history object that can be passed to the router constructor
	 */
	function createMemoryHistory(base = '') {
	    let listeners = [];
	    let queue = [START];
	    let position = 0;
	    base = normalizeBase(base);
	    function setLocation(location) {
	        position++;
	        if (position === queue.length) {
	            // we are at the end, we can simply append a new entry
	            queue.push(location);
	        }
	        else {
	            // we are in the middle, we remove everything from here in the queue
	            queue.splice(position);
	            queue.push(location);
	        }
	    }
	    function triggerListeners(to, from, { direction, delta }) {
	        const info = {
	            direction,
	            delta,
	            type: NavigationType.pop,
	        };
	        for (const callback of listeners) {
	            callback(to, from, info);
	        }
	    }
	    const routerHistory = {
	        // rewritten by Object.defineProperty
	        location: START,
	        // TODO: should be kept in queue
	        state: {},
	        base,
	        createHref: createHref.bind(null, base),
	        replace(to) {
	            // remove current entry and decrement position
	            queue.splice(position--, 1);
	            setLocation(to);
	        },
	        push(to, data) {
	            setLocation(to);
	        },
	        listen(callback) {
	            listeners.push(callback);
	            return () => {
	                const index = listeners.indexOf(callback);
	                if (index > -1)
	                    listeners.splice(index, 1);
	            };
	        },
	        destroy() {
	            listeners = [];
	            queue = [START];
	            position = 0;
	        },
	        go(delta, shouldTrigger = true) {
	            const from = this.location;
	            const direction = 
	            // we are considering delta === 0 going forward, but in abstract mode
	            // using 0 for the delta doesn't make sense like it does in html5 where
	            // it reloads the page
	            delta < 0 ? NavigationDirection.back : NavigationDirection.forward;
	            position = Math.max(0, Math.min(position + delta, queue.length - 1));
	            if (shouldTrigger) {
	                triggerListeners(this.location, from, {
	                    direction,
	                    delta,
	                });
	            }
	        },
	    };
	    Object.defineProperty(routerHistory, 'location', {
	        enumerable: true,
	        get: () => queue[position],
	    });
	    return routerHistory;
	}

	/**
	 * Creates a hash history. Useful for web applications with no host (e.g.
	 * `file://`) or when configuring a server to handle any URL is not possible.
	 *
	 * @param base - optional base to provide. Defaults to `location.pathname +
	 * location.search` If there is a `<base>` tag in the `head`, its value will be
	 * ignored in favor of this parameter **but note it affects all the
	 * history.pushState() calls**, meaning that if you use a `<base>` tag, it's
	 * `href` value **has to match this parameter** (ignoring anything after the
	 * `#`).
	 *
	 * @example
	 * ```js
	 * // at https://example.com/folder
	 * createWebHashHistory() // gives a url of `https://example.com/folder#`
	 * createWebHashHistory('/folder/') // gives a url of `https://example.com/folder/#`
	 * // if the `#` is provided in the base, it won't be added by `createWebHashHistory`
	 * createWebHashHistory('/folder/#/app/') // gives a url of `https://example.com/folder/#/app/`
	 * // you should avoid doing this because it changes the original url and breaks copying urls
	 * createWebHashHistory('/other-folder/') // gives a url of `https://example.com/other-folder/#`
	 *
	 * // at file:///usr/etc/folder/index.html
	 * // for locations with no `host`, the base is ignored
	 * createWebHashHistory('/iAmIgnored') // gives a url of `file:///usr/etc/folder/index.html#`
	 * ```
	 */
	function createWebHashHistory(base) {
	    // Make sure this implementation is fine in terms of encoding, specially for IE11
	    // for `file://`, directly use the pathname and ignore the base
	    // location.pathname contains an initial `/` even at the root: `https://example.com`
	    base = location.host ? base || location.pathname + location.search : '';
	    // allow the user to provide a `#` in the middle: `/base/#/app`
	    if (!base.includes('#'))
	        base += '#';
	    if (!base.endsWith('#/') && !base.endsWith('#')) {
	        warn(`A hash base must end with a "#":\n"${base}" should be "${base.replace(/#.*$/, '#')}".`);
	    }
	    return createWebHistory(base);
	}

	function isRouteLocation(route) {
	    return typeof route === 'string' || (route && typeof route === 'object');
	}
	function isRouteName(name) {
	    return typeof name === 'string' || typeof name === 'symbol';
	}

	/**
	 * Initial route location where the router is. Can be used in navigation guards
	 * to differentiate the initial navigation.
	 *
	 * @example
	 * ```js
	 * import { START_LOCATION } from 'vue-router'
	 *
	 * router.beforeEach((to, from) => {
	 *   if (from === START_LOCATION) {
	 *     // initial navigation
	 *   }
	 * })
	 * ```
	 */
	const START_LOCATION_NORMALIZED = {
	    path: '/',
	    name: undefined,
	    params: {},
	    query: {},
	    hash: '',
	    fullPath: '/',
	    matched: [],
	    meta: {},
	    redirectedFrom: undefined,
	};

	const NavigationFailureSymbol = /*#__PURE__*/ PolySymbol('navigation failure' );
	/**
	 * Enumeration with all possible types for navigation failures. Can be passed to
	 * {@link isNavigationFailure} to check for specific failures.
	 */
	exports.NavigationFailureType = void 0;
	(function (NavigationFailureType) {
	    /**
	     * An aborted navigation is a navigation that failed because a navigation
	     * guard returned `false` or called `next(false)`
	     */
	    NavigationFailureType[NavigationFailureType["aborted"] = 4] = "aborted";
	    /**
	     * A cancelled navigation is a navigation that failed because a more recent
	     * navigation finished started (not necessarily finished).
	     */
	    NavigationFailureType[NavigationFailureType["cancelled"] = 8] = "cancelled";
	    /**
	     * A duplicated navigation is a navigation that failed because it was
	     * initiated while already being at the exact same location.
	     */
	    NavigationFailureType[NavigationFailureType["duplicated"] = 16] = "duplicated";
	})(exports.NavigationFailureType || (exports.NavigationFailureType = {}));
	// DEV only debug messages
	const ErrorTypeMessages = {
	    [1 /* MATCHER_NOT_FOUND */]({ location, currentLocation }) {
	        return `No match for\n ${JSON.stringify(location)}${currentLocation
	            ? '\nwhile being at\n' + JSON.stringify(currentLocation)
	            : ''}`;
	    },
	    [2 /* NAVIGATION_GUARD_REDIRECT */]({ from, to, }) {
	        return `Redirected from "${from.fullPath}" to "${stringifyRoute(to)}" via a navigation guard.`;
	    },
	    [4 /* NAVIGATION_ABORTED */]({ from, to }) {
	        return `Navigation aborted from "${from.fullPath}" to "${to.fullPath}" via a navigation guard.`;
	    },
	    [8 /* NAVIGATION_CANCELLED */]({ from, to }) {
	        return `Navigation cancelled from "${from.fullPath}" to "${to.fullPath}" with a new navigation.`;
	    },
	    [16 /* NAVIGATION_DUPLICATED */]({ from, to }) {
	        return `Avoided redundant navigation to current location: "${from.fullPath}".`;
	    },
	};
	function createRouterError(type, params) {
	    // keep full error messages in cjs versions
	    {
	        return assign(new Error(ErrorTypeMessages[type](params)), {
	            type,
	            [NavigationFailureSymbol]: true,
	        }, params);
	    }
	}
	function isNavigationFailure(error, type) {
	    return (error instanceof Error &&
	        NavigationFailureSymbol in error &&
	        (type == null || !!(error.type & type)));
	}
	const propertiesToLog = ['params', 'query', 'hash'];
	function stringifyRoute(to) {
	    if (typeof to === 'string')
	        return to;
	    if ('path' in to)
	        return to.path;
	    const location = {};
	    for (const key of propertiesToLog) {
	        if (key in to)
	            location[key] = to[key];
	    }
	    return JSON.stringify(location, null, 2);
	}

	// default pattern for a param: non greedy everything but /
	const BASE_PARAM_PATTERN = '[^/]+?';
	const BASE_PATH_PARSER_OPTIONS = {
	    sensitive: false,
	    strict: false,
	    start: true,
	    end: true,
	};
	// Special Regex characters that must be escaped in static tokens
	const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
	/**
	 * Creates a path parser from an array of Segments (a segment is an array of Tokens)
	 *
	 * @param segments - array of segments returned by tokenizePath
	 * @param extraOptions - optional options for the regexp
	 * @returns a PathParser
	 */
	function tokensToParser(segments, extraOptions) {
	    const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
	    // the amount of scores is the same as the length of segments except for the root segment "/"
	    const score = [];
	    // the regexp as a string
	    let pattern = options.start ? '^' : '';
	    // extracted keys
	    const keys = [];
	    for (const segment of segments) {
	        // the root segment needs special treatment
	        const segmentScores = segment.length ? [] : [90 /* Root */];
	        // allow trailing slash
	        if (options.strict && !segment.length)
	            pattern += '/';
	        for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
	            const token = segment[tokenIndex];
	            // resets the score if we are inside a sub segment /:a-other-:b
	            let subSegmentScore = 40 /* Segment */ +
	                (options.sensitive ? 0.25 /* BonusCaseSensitive */ : 0);
	            if (token.type === 0 /* Static */) {
	                // prepend the slash if we are starting a new segment
	                if (!tokenIndex)
	                    pattern += '/';
	                pattern += token.value.replace(REGEX_CHARS_RE, '\\$&');
	                subSegmentScore += 40 /* Static */;
	            }
	            else if (token.type === 1 /* Param */) {
	                const { value, repeatable, optional, regexp } = token;
	                keys.push({
	                    name: value,
	                    repeatable,
	                    optional,
	                });
	                const re = regexp ? regexp : BASE_PARAM_PATTERN;
	                // the user provided a custom regexp /:id(\\d+)
	                if (re !== BASE_PARAM_PATTERN) {
	                    subSegmentScore += 10 /* BonusCustomRegExp */;
	                    // make sure the regexp is valid before using it
	                    try {
	                        new RegExp(`(${re})`);
	                    }
	                    catch (err) {
	                        throw new Error(`Invalid custom RegExp for param "${value}" (${re}): ` +
	                            err.message);
	                    }
	                }
	                // when we repeat we must take care of the repeating leading slash
	                let subPattern = repeatable ? `((?:${re})(?:/(?:${re}))*)` : `(${re})`;
	                // prepend the slash if we are starting a new segment
	                if (!tokenIndex)
	                    subPattern =
	                        // avoid an optional / if there are more segments e.g. /:p?-static
	                        // or /:p?-:p2
	                        optional && segment.length < 2
	                            ? `(?:/${subPattern})`
	                            : '/' + subPattern;
	                if (optional)
	                    subPattern += '?';
	                pattern += subPattern;
	                subSegmentScore += 20 /* Dynamic */;
	                if (optional)
	                    subSegmentScore += -8 /* BonusOptional */;
	                if (repeatable)
	                    subSegmentScore += -20 /* BonusRepeatable */;
	                if (re === '.*')
	                    subSegmentScore += -50 /* BonusWildcard */;
	            }
	            segmentScores.push(subSegmentScore);
	        }
	        // an empty array like /home/ -> [[{home}], []]
	        // if (!segment.length) pattern += '/'
	        score.push(segmentScores);
	    }
	    // only apply the strict bonus to the last score
	    if (options.strict && options.end) {
	        const i = score.length - 1;
	        score[i][score[i].length - 1] += 0.7000000000000001 /* BonusStrict */;
	    }
	    // TODO: dev only warn double trailing slash
	    if (!options.strict)
	        pattern += '/?';
	    if (options.end)
	        pattern += '$';
	    // allow paths like /dynamic to only match dynamic or dynamic/... but not dynamic_something_else
	    else if (options.strict)
	        pattern += '(?:/|$)';
	    const re = new RegExp(pattern, options.sensitive ? '' : 'i');
	    function parse(path) {
	        const match = path.match(re);
	        const params = {};
	        if (!match)
	            return null;
	        for (let i = 1; i < match.length; i++) {
	            const value = match[i] || '';
	            const key = keys[i - 1];
	            params[key.name] = value && key.repeatable ? value.split('/') : value;
	        }
	        return params;
	    }
	    function stringify(params) {
	        let path = '';
	        // for optional parameters to allow to be empty
	        let avoidDuplicatedSlash = false;
	        for (const segment of segments) {
	            if (!avoidDuplicatedSlash || !path.endsWith('/'))
	                path += '/';
	            avoidDuplicatedSlash = false;
	            for (const token of segment) {
	                if (token.type === 0 /* Static */) {
	                    path += token.value;
	                }
	                else if (token.type === 1 /* Param */) {
	                    const { value, repeatable, optional } = token;
	                    const param = value in params ? params[value] : '';
	                    if (Array.isArray(param) && !repeatable)
	                        throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
	                    const text = Array.isArray(param) ? param.join('/') : param;
	                    if (!text) {
	                        if (optional) {
	                            // if we have more than one optional param like /:a?-static and there are more segments, we don't need to
	                            // care about the optional param
	                            if (segment.length < 2 && segments.length > 1) {
	                                // remove the last slash as we could be at the end
	                                if (path.endsWith('/'))
	                                    path = path.slice(0, -1);
	                                // do not append a slash on the next iteration
	                                else
	                                    avoidDuplicatedSlash = true;
	                            }
	                        }
	                        else
	                            throw new Error(`Missing required param "${value}"`);
	                    }
	                    path += text;
	                }
	            }
	        }
	        return path;
	    }
	    return {
	        re,
	        score,
	        keys,
	        parse,
	        stringify,
	    };
	}
	/**
	 * Compares an array of numbers as used in PathParser.score and returns a
	 * number. This function can be used to `sort` an array
	 *
	 * @param a - first array of numbers
	 * @param b - second array of numbers
	 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
	 * should be sorted first
	 */
	function compareScoreArray(a, b) {
	    let i = 0;
	    while (i < a.length && i < b.length) {
	        const diff = b[i] - a[i];
	        // only keep going if diff === 0
	        if (diff)
	            return diff;
	        i++;
	    }
	    // if the last subsegment was Static, the shorter segments should be sorted first
	    // otherwise sort the longest segment first
	    if (a.length < b.length) {
	        return a.length === 1 && a[0] === 40 /* Static */ + 40 /* Segment */
	            ? -1
	            : 1;
	    }
	    else if (a.length > b.length) {
	        return b.length === 1 && b[0] === 40 /* Static */ + 40 /* Segment */
	            ? 1
	            : -1;
	    }
	    return 0;
	}
	/**
	 * Compare function that can be used with `sort` to sort an array of PathParser
	 *
	 * @param a - first PathParser
	 * @param b - second PathParser
	 * @returns 0 if both are equal, < 0 if a should be sorted first, > 0 if b
	 */
	function comparePathParserScore(a, b) {
	    let i = 0;
	    const aScore = a.score;
	    const bScore = b.score;
	    while (i < aScore.length && i < bScore.length) {
	        const comp = compareScoreArray(aScore[i], bScore[i]);
	        // do not return if both are equal
	        if (comp)
	            return comp;
	        i++;
	    }
	    // if a and b share the same score entries but b has more, sort b first
	    return bScore.length - aScore.length;
	    // this is the ternary version
	    // return aScore.length < bScore.length
	    //   ? 1
	    //   : aScore.length > bScore.length
	    //   ? -1
	    //   : 0
	}

	const ROOT_TOKEN = {
	    type: 0 /* Static */,
	    value: '',
	};
	const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
	// After some profiling, the cache seems to be unnecessary because tokenizePath
	// (the slowest part of adding a route) is very fast
	// const tokenCache = new Map<string, Token[][]>()
	function tokenizePath(path) {
	    if (!path)
	        return [[]];
	    if (path === '/')
	        return [[ROOT_TOKEN]];
	    if (!path.startsWith('/')) {
	        throw new Error(`Route paths should start with a "/": "${path}" should be "/${path}".`
	            );
	    }
	    // if (tokenCache.has(path)) return tokenCache.get(path)!
	    function crash(message) {
	        throw new Error(`ERR (${state})/"${buffer}": ${message}`);
	    }
	    let state = 0 /* Static */;
	    let previousState = state;
	    const tokens = [];
	    // the segment will always be valid because we get into the initial state
	    // with the leading /
	    let segment;
	    function finalizeSegment() {
	        if (segment)
	            tokens.push(segment);
	        segment = [];
	    }
	    // index on the path
	    let i = 0;
	    // char at index
	    let char;
	    // buffer of the value read
	    let buffer = '';
	    // custom regexp for a param
	    let customRe = '';
	    function consumeBuffer() {
	        if (!buffer)
	            return;
	        if (state === 0 /* Static */) {
	            segment.push({
	                type: 0 /* Static */,
	                value: buffer,
	            });
	        }
	        else if (state === 1 /* Param */ ||
	            state === 2 /* ParamRegExp */ ||
	            state === 3 /* ParamRegExpEnd */) {
	            if (segment.length > 1 && (char === '*' || char === '+'))
	                crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
	            segment.push({
	                type: 1 /* Param */,
	                value: buffer,
	                regexp: customRe,
	                repeatable: char === '*' || char === '+',
	                optional: char === '*' || char === '?',
	            });
	        }
	        else {
	            crash('Invalid state to consume buffer');
	        }
	        buffer = '';
	    }
	    function addCharToBuffer() {
	        buffer += char;
	    }
	    while (i < path.length) {
	        char = path[i++];
	        if (char === '\\' && state !== 2 /* ParamRegExp */) {
	            previousState = state;
	            state = 4 /* EscapeNext */;
	            continue;
	        }
	        switch (state) {
	            case 0 /* Static */:
	                if (char === '/') {
	                    if (buffer) {
	                        consumeBuffer();
	                    }
	                    finalizeSegment();
	                }
	                else if (char === ':') {
	                    consumeBuffer();
	                    state = 1 /* Param */;
	                }
	                else {
	                    addCharToBuffer();
	                }
	                break;
	            case 4 /* EscapeNext */:
	                addCharToBuffer();
	                state = previousState;
	                break;
	            case 1 /* Param */:
	                if (char === '(') {
	                    state = 2 /* ParamRegExp */;
	                }
	                else if (VALID_PARAM_RE.test(char)) {
	                    addCharToBuffer();
	                }
	                else {
	                    consumeBuffer();
	                    state = 0 /* Static */;
	                    // go back one character if we were not modifying
	                    if (char !== '*' && char !== '?' && char !== '+')
	                        i--;
	                }
	                break;
	            case 2 /* ParamRegExp */:
	                // TODO: is it worth handling nested regexp? like :p(?:prefix_([^/]+)_suffix)
	                // it already works by escaping the closing )
	                // https://paths.esm.dev/?p=AAMeJbiAwQEcDKbAoAAkP60PG2R6QAvgNaA6AFACM2ABuQBB#
	                // is this really something people need since you can also write
	                // /prefix_:p()_suffix
	                if (char === ')') {
	                    // handle the escaped )
	                    if (customRe[customRe.length - 1] == '\\')
	                        customRe = customRe.slice(0, -1) + char;
	                    else
	                        state = 3 /* ParamRegExpEnd */;
	                }
	                else {
	                    customRe += char;
	                }
	                break;
	            case 3 /* ParamRegExpEnd */:
	                // same as finalizing a param
	                consumeBuffer();
	                state = 0 /* Static */;
	                // go back one character if we were not modifying
	                if (char !== '*' && char !== '?' && char !== '+')
	                    i--;
	                customRe = '';
	                break;
	            default:
	                crash('Unknown state');
	                break;
	        }
	    }
	    if (state === 2 /* ParamRegExp */)
	        crash(`Unfinished custom RegExp for param "${buffer}"`);
	    consumeBuffer();
	    finalizeSegment();
	    // tokenCache.set(path, tokens)
	    return tokens;
	}

	function createRouteRecordMatcher(record, parent, options) {
	    const parser = tokensToParser(tokenizePath(record.path), options);
	    // warn against params with the same name
	    {
	        const existingKeys = new Set();
	        for (const key of parser.keys) {
	            if (existingKeys.has(key.name))
	                warn(`Found duplicated params with name "${key.name}" for path "${record.path}". Only the last one will be available on "$route.params".`);
	            existingKeys.add(key.name);
	        }
	    }
	    const matcher = assign(parser, {
	        record,
	        parent,
	        // these needs to be populated by the parent
	        children: [],
	        alias: [],
	    });
	    if (parent) {
	        // both are aliases or both are not aliases
	        // we don't want to mix them because the order is used when
	        // passing originalRecord in Matcher.addRoute
	        if (!matcher.record.aliasOf === !parent.record.aliasOf)
	            parent.children.push(matcher);
	    }
	    return matcher;
	}

	/**
	 * Creates a Router Matcher.
	 *
	 * @internal
	 * @param routes - array of initial routes
	 * @param globalOptions - global route options
	 */
	function createRouterMatcher(routes, globalOptions) {
	    // normalized ordered array of matchers
	    const matchers = [];
	    const matcherMap = new Map();
	    globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
	    function getRecordMatcher(name) {
	        return matcherMap.get(name);
	    }
	    function addRoute(record, parent, originalRecord) {
	        // used later on to remove by name
	        const isRootAdd = !originalRecord;
	        const mainNormalizedRecord = normalizeRouteRecord(record);
	        // we might be the child of an alias
	        mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
	        const options = mergeOptions(globalOptions, record);
	        // generate an array of records to correctly handle aliases
	        const normalizedRecords = [
	            mainNormalizedRecord,
	        ];
	        if ('alias' in record) {
	            const aliases = typeof record.alias === 'string' ? [record.alias] : record.alias;
	            for (const alias of aliases) {
	                normalizedRecords.push(assign({}, mainNormalizedRecord, {
	                    // this allows us to hold a copy of the `components` option
	                    // so that async components cache is hold on the original record
	                    components: originalRecord
	                        ? originalRecord.record.components
	                        : mainNormalizedRecord.components,
	                    path: alias,
	                    // we might be the child of an alias
	                    aliasOf: originalRecord
	                        ? originalRecord.record
	                        : mainNormalizedRecord,
	                    // the aliases are always of the same kind as the original since they
	                    // are defined on the same record
	                }));
	            }
	        }
	        let matcher;
	        let originalMatcher;
	        for (const normalizedRecord of normalizedRecords) {
	            const { path } = normalizedRecord;
	            // Build up the path for nested routes if the child isn't an absolute
	            // route. Only add the / delimiter if the child path isn't empty and if the
	            // parent path doesn't have a trailing slash
	            if (parent && path[0] !== '/') {
	                const parentPath = parent.record.path;
	                const connectingSlash = parentPath[parentPath.length - 1] === '/' ? '' : '/';
	                normalizedRecord.path =
	                    parent.record.path + (path && connectingSlash + path);
	            }
	            if (normalizedRecord.path === '*') {
	                throw new Error('Catch all routes ("*") must now be defined using a param with a custom regexp.\n' +
	                    'See more at https://next.router.vuejs.org/guide/migration/#removed-star-or-catch-all-routes.');
	            }
	            // create the object before hand so it can be passed to children
	            matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
	            if (parent && path[0] === '/')
	                checkMissingParamsInAbsolutePath(matcher, parent);
	            // if we are an alias we must tell the original record that we exist
	            // so we can be removed
	            if (originalRecord) {
	                originalRecord.alias.push(matcher);
	                {
	                    checkSameParams(originalRecord, matcher);
	                }
	            }
	            else {
	                // otherwise, the first record is the original and others are aliases
	                originalMatcher = originalMatcher || matcher;
	                if (originalMatcher !== matcher)
	                    originalMatcher.alias.push(matcher);
	                // remove the route if named and only for the top record (avoid in nested calls)
	                // this works because the original record is the first one
	                if (isRootAdd && record.name && !isAliasRecord(matcher))
	                    removeRoute(record.name);
	            }
	            if ('children' in mainNormalizedRecord) {
	                const children = mainNormalizedRecord.children;
	                for (let i = 0; i < children.length; i++) {
	                    addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
	                }
	            }
	            // if there was no original record, then the first one was not an alias and all
	            // other alias (if any) need to reference this record when adding children
	            originalRecord = originalRecord || matcher;
	            // TODO: add normalized records for more flexibility
	            // if (parent && isAliasRecord(originalRecord)) {
	            //   parent.children.push(originalRecord)
	            // }
	            insertMatcher(matcher);
	        }
	        return originalMatcher
	            ? () => {
	                // since other matchers are aliases, they should be removed by the original matcher
	                removeRoute(originalMatcher);
	            }
	            : noop;
	    }
	    function removeRoute(matcherRef) {
	        if (isRouteName(matcherRef)) {
	            const matcher = matcherMap.get(matcherRef);
	            if (matcher) {
	                matcherMap.delete(matcherRef);
	                matchers.splice(matchers.indexOf(matcher), 1);
	                matcher.children.forEach(removeRoute);
	                matcher.alias.forEach(removeRoute);
	            }
	        }
	        else {
	            const index = matchers.indexOf(matcherRef);
	            if (index > -1) {
	                matchers.splice(index, 1);
	                if (matcherRef.record.name)
	                    matcherMap.delete(matcherRef.record.name);
	                matcherRef.children.forEach(removeRoute);
	                matcherRef.alias.forEach(removeRoute);
	            }
	        }
	    }
	    function getRoutes() {
	        return matchers;
	    }
	    function insertMatcher(matcher) {
	        let i = 0;
	        while (i < matchers.length &&
	            comparePathParserScore(matcher, matchers[i]) >= 0 &&
	            // Adding children with empty path should still appear before the parent
	            // https://github.com/vuejs/router/issues/1124
	            (matcher.record.path !== matchers[i].record.path ||
	                !isRecordChildOf(matcher, matchers[i])))
	            i++;
	        matchers.splice(i, 0, matcher);
	        // only add the original record to the name map
	        if (matcher.record.name && !isAliasRecord(matcher))
	            matcherMap.set(matcher.record.name, matcher);
	    }
	    function resolve(location, currentLocation) {
	        let matcher;
	        let params = {};
	        let path;
	        let name;
	        if ('name' in location && location.name) {
	            matcher = matcherMap.get(location.name);
	            if (!matcher)
	                throw createRouterError(1 /* MATCHER_NOT_FOUND */, {
	                    location,
	                });
	            name = matcher.record.name;
	            params = assign(
	            // paramsFromLocation is a new object
	            paramsFromLocation(currentLocation.params, 
	            // only keep params that exist in the resolved location
	            // TODO: only keep optional params coming from a parent record
	            matcher.keys.filter(k => !k.optional).map(k => k.name)), location.params);
	            // throws if cannot be stringified
	            path = matcher.stringify(params);
	        }
	        else if ('path' in location) {
	            // no need to resolve the path with the matcher as it was provided
	            // this also allows the user to control the encoding
	            path = location.path;
	            if (!path.startsWith('/')) {
	                warn(`The Matcher cannot resolve relative paths but received "${path}". Unless you directly called \`matcher.resolve("${path}")\`, this is probably a bug in vue-router. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/router.`);
	            }
	            matcher = matchers.find(m => m.re.test(path));
	            // matcher should have a value after the loop
	            if (matcher) {
	                // TODO: dev warning of unused params if provided
	                // we know the matcher works because we tested the regexp
	                params = matcher.parse(path);
	                name = matcher.record.name;
	            }
	            // location is a relative path
	        }
	        else {
	            // match by name or path of current route
	            matcher = currentLocation.name
	                ? matcherMap.get(currentLocation.name)
	                : matchers.find(m => m.re.test(currentLocation.path));
	            if (!matcher)
	                throw createRouterError(1 /* MATCHER_NOT_FOUND */, {
	                    location,
	                    currentLocation,
	                });
	            name = matcher.record.name;
	            // since we are navigating to the same location, we don't need to pick the
	            // params like when `name` is provided
	            params = assign({}, currentLocation.params, location.params);
	            path = matcher.stringify(params);
	        }
	        const matched = [];
	        let parentMatcher = matcher;
	        while (parentMatcher) {
	            // reversed order so parents are at the beginning
	            matched.unshift(parentMatcher.record);
	            parentMatcher = parentMatcher.parent;
	        }
	        return {
	            name,
	            path,
	            params,
	            matched,
	            meta: mergeMetaFields(matched),
	        };
	    }
	    // add initial routes
	    routes.forEach(route => addRoute(route));
	    return { addRoute, resolve, removeRoute, getRoutes, getRecordMatcher };
	}
	function paramsFromLocation(params, keys) {
	    const newParams = {};
	    for (const key of keys) {
	        if (key in params)
	            newParams[key] = params[key];
	    }
	    return newParams;
	}
	/**
	 * Normalizes a RouteRecordRaw. Creates a copy
	 *
	 * @param record
	 * @returns the normalized version
	 */
	function normalizeRouteRecord(record) {
	    return {
	        path: record.path,
	        redirect: record.redirect,
	        name: record.name,
	        meta: record.meta || {},
	        aliasOf: undefined,
	        beforeEnter: record.beforeEnter,
	        props: normalizeRecordProps(record),
	        children: record.children || [],
	        instances: {},
	        leaveGuards: new Set(),
	        updateGuards: new Set(),
	        enterCallbacks: {},
	        components: 'components' in record
	            ? record.components || {}
	            : { default: record.component },
	    };
	}
	/**
	 * Normalize the optional `props` in a record to always be an object similar to
	 * components. Also accept a boolean for components.
	 * @param record
	 */
	function normalizeRecordProps(record) {
	    const propsObject = {};
	    // props does not exist on redirect records but we can set false directly
	    const props = record.props || false;
	    if ('component' in record) {
	        propsObject.default = props;
	    }
	    else {
	        // NOTE: we could also allow a function to be applied to every component.
	        // Would need user feedback for use cases
	        for (const name in record.components)
	            propsObject[name] = typeof props === 'boolean' ? props : props[name];
	    }
	    return propsObject;
	}
	/**
	 * Checks if a record or any of its parent is an alias
	 * @param record
	 */
	function isAliasRecord(record) {
	    while (record) {
	        if (record.record.aliasOf)
	            return true;
	        record = record.parent;
	    }
	    return false;
	}
	/**
	 * Merge meta fields of an array of records
	 *
	 * @param matched - array of matched records
	 */
	function mergeMetaFields(matched) {
	    return matched.reduce((meta, record) => assign(meta, record.meta), {});
	}
	function mergeOptions(defaults, partialOptions) {
	    const options = {};
	    for (const key in defaults) {
	        options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
	    }
	    return options;
	}
	function isSameParam(a, b) {
	    return (a.name === b.name &&
	        a.optional === b.optional &&
	        a.repeatable === b.repeatable);
	}
	/**
	 * Check if a path and its alias have the same required params
	 *
	 * @param a - original record
	 * @param b - alias record
	 */
	function checkSameParams(a, b) {
	    for (const key of a.keys) {
	        if (!key.optional && !b.keys.find(isSameParam.bind(null, key)))
	            return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" should have the exact same param named "${key.name}"`);
	    }
	    for (const key of b.keys) {
	        if (!key.optional && !a.keys.find(isSameParam.bind(null, key)))
	            return warn(`Alias "${b.record.path}" and the original record: "${a.record.path}" should have the exact same param named "${key.name}"`);
	    }
	}
	function checkMissingParamsInAbsolutePath(record, parent) {
	    for (const key of parent.keys) {
	        if (!record.keys.find(isSameParam.bind(null, key)))
	            return warn(`Absolute path "${record.record.path}" should have the exact same param named "${key.name}" as its parent "${parent.record.path}".`);
	    }
	}
	function isRecordChildOf(record, parent) {
	    return parent.children.some(child => child === record || isRecordChildOf(record, child));
	}

	/**
	 * Encoding Rules ␣ = Space Path: ␣ " < > # ? { } Query: ␣ " < > # & = Hash: ␣ "
	 * < > `
	 *
	 * On top of that, the RFC3986 (https://tools.ietf.org/html/rfc3986#section-2.2)
	 * defines some extra characters to be encoded. Most browsers do not encode them
	 * in encodeURI https://github.com/whatwg/url/issues/369, so it may be safer to
	 * also encode `!'()*`. Leaving unencoded only ASCII alphanumeric(`a-zA-Z0-9`)
	 * plus `-._~`. This extra safety should be applied to query by patching the
	 * string returned by encodeURIComponent encodeURI also encodes `[\]^`. `\`
	 * should be encoded to avoid ambiguity. Browsers (IE, FF, C) transform a `\`
	 * into a `/` if directly typed in. The _backtick_ (`````) should also be
	 * encoded everywhere because some browsers like FF encode it when directly
	 * written while others don't. Safari and IE don't encode ``"<>{}``` in hash.
	 */
	// const EXTRA_RESERVED_RE = /[!'()*]/g
	// const encodeReservedReplacer = (c: string) => '%' + c.charCodeAt(0).toString(16)
	const HASH_RE = /#/g; // %23
	const AMPERSAND_RE = /&/g; // %26
	const SLASH_RE = /\//g; // %2F
	const EQUAL_RE = /=/g; // %3D
	const IM_RE = /\?/g; // %3F
	const PLUS_RE = /\+/g; // %2B
	/**
	 * NOTE: It's not clear to me if we should encode the + symbol in queries, it
	 * seems to be less flexible than not doing so and I can't find out the legacy
	 * systems requiring this for regular requests like text/html. In the standard,
	 * the encoding of the plus character is only mentioned for
	 * application/x-www-form-urlencoded
	 * (https://url.spec.whatwg.org/#urlencoded-parsing) and most browsers seems lo
	 * leave the plus character as is in queries. To be more flexible, we allow the
	 * plus character on the query but it can also be manually encoded by the user.
	 *
	 * Resources:
	 * - https://url.spec.whatwg.org/#urlencoded-parsing
	 * - https://stackoverflow.com/questions/1634271/url-encoding-the-space-character-or-20
	 */
	const ENC_BRACKET_OPEN_RE = /%5B/g; // [
	const ENC_BRACKET_CLOSE_RE = /%5D/g; // ]
	const ENC_CARET_RE = /%5E/g; // ^
	const ENC_BACKTICK_RE = /%60/g; // `
	const ENC_CURLY_OPEN_RE = /%7B/g; // {
	const ENC_PIPE_RE = /%7C/g; // |
	const ENC_CURLY_CLOSE_RE = /%7D/g; // }
	const ENC_SPACE_RE = /%20/g; // }
	/**
	 * Encode characters that need to be encoded on the path, search and hash
	 * sections of the URL.
	 *
	 * @internal
	 * @param text - string to encode
	 * @returns encoded string
	 */
	function commonEncode(text) {
	    return encodeURI('' + text)
	        .replace(ENC_PIPE_RE, '|')
	        .replace(ENC_BRACKET_OPEN_RE, '[')
	        .replace(ENC_BRACKET_CLOSE_RE, ']');
	}
	/**
	 * Encode characters that need to be encoded on the hash section of the URL.
	 *
	 * @param text - string to encode
	 * @returns encoded string
	 */
	function encodeHash(text) {
	    return commonEncode(text)
	        .replace(ENC_CURLY_OPEN_RE, '{')
	        .replace(ENC_CURLY_CLOSE_RE, '}')
	        .replace(ENC_CARET_RE, '^');
	}
	/**
	 * Encode characters that need to be encoded query values on the query
	 * section of the URL.
	 *
	 * @param text - string to encode
	 * @returns encoded string
	 */
	function encodeQueryValue(text) {
	    return (commonEncode(text)
	        // Encode the space as +, encode the + to differentiate it from the space
	        .replace(PLUS_RE, '%2B')
	        .replace(ENC_SPACE_RE, '+')
	        .replace(HASH_RE, '%23')
	        .replace(AMPERSAND_RE, '%26')
	        .replace(ENC_BACKTICK_RE, '`')
	        .replace(ENC_CURLY_OPEN_RE, '{')
	        .replace(ENC_CURLY_CLOSE_RE, '}')
	        .replace(ENC_CARET_RE, '^'));
	}
	/**
	 * Like `encodeQueryValue` but also encodes the `=` character.
	 *
	 * @param text - string to encode
	 */
	function encodeQueryKey(text) {
	    return encodeQueryValue(text).replace(EQUAL_RE, '%3D');
	}
	/**
	 * Encode characters that need to be encoded on the path section of the URL.
	 *
	 * @param text - string to encode
	 * @returns encoded string
	 */
	function encodePath(text) {
	    return commonEncode(text).replace(HASH_RE, '%23').replace(IM_RE, '%3F');
	}
	/**
	 * Encode characters that need to be encoded on the path section of the URL as a
	 * param. This function encodes everything {@link encodePath} does plus the
	 * slash (`/`) character. If `text` is `null` or `undefined`, returns an empty
	 * string instead.
	 *
	 * @param text - string to encode
	 * @returns encoded string
	 */
	function encodeParam(text) {
	    return text == null ? '' : encodePath(text).replace(SLASH_RE, '%2F');
	}
	/**
	 * Decode text using `decodeURIComponent`. Returns the original text if it
	 * fails.
	 *
	 * @param text - string to decode
	 * @returns decoded string
	 */
	function decode(text) {
	    try {
	        return decodeURIComponent('' + text);
	    }
	    catch (err) {
	        warn(`Error decoding "${text}". Using original value`);
	    }
	    return '' + text;
	}

	/**
	 * Transforms a queryString into a {@link LocationQuery} object. Accept both, a
	 * version with the leading `?` and without Should work as URLSearchParams

	 * @internal
	 *
	 * @param search - search string to parse
	 * @returns a query object
	 */
	function parseQuery(search) {
	    const query = {};
	    // avoid creating an object with an empty key and empty value
	    // because of split('&')
	    if (search === '' || search === '?')
	        return query;
	    const hasLeadingIM = search[0] === '?';
	    const searchParams = (hasLeadingIM ? search.slice(1) : search).split('&');
	    for (let i = 0; i < searchParams.length; ++i) {
	        // pre decode the + into space
	        const searchParam = searchParams[i].replace(PLUS_RE, ' ');
	        // allow the = character
	        const eqPos = searchParam.indexOf('=');
	        const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
	        const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
	        if (key in query) {
	            // an extra variable for ts types
	            let currentValue = query[key];
	            if (!Array.isArray(currentValue)) {
	                currentValue = query[key] = [currentValue];
	            }
	            currentValue.push(value);
	        }
	        else {
	            query[key] = value;
	        }
	    }
	    return query;
	}
	/**
	 * Stringifies a {@link LocationQueryRaw} object. Like `URLSearchParams`, it
	 * doesn't prepend a `?`
	 *
	 * @internal
	 *
	 * @param query - query object to stringify
	 * @returns string version of the query without the leading `?`
	 */
	function stringifyQuery(query) {
	    let search = '';
	    for (let key in query) {
	        const value = query[key];
	        key = encodeQueryKey(key);
	        if (value == null) {
	            // only null adds the value
	            if (value !== undefined) {
	                search += (search.length ? '&' : '') + key;
	            }
	            continue;
	        }
	        // keep null values
	        const values = Array.isArray(value)
	            ? value.map(v => v && encodeQueryValue(v))
	            : [value && encodeQueryValue(value)];
	        values.forEach(value => {
	            // skip undefined values in arrays as if they were not present
	            // smaller code than using filter
	            if (value !== undefined) {
	                // only append & with non-empty search
	                search += (search.length ? '&' : '') + key;
	                if (value != null)
	                    search += '=' + value;
	            }
	        });
	    }
	    return search;
	}
	/**
	 * Transforms a {@link LocationQueryRaw} into a {@link LocationQuery} by casting
	 * numbers into strings, removing keys with an undefined value and replacing
	 * undefined with null in arrays
	 *
	 * @param query - query object to normalize
	 * @returns a normalized query object
	 */
	function normalizeQuery(query) {
	    const normalizedQuery = {};
	    for (const key in query) {
	        const value = query[key];
	        if (value !== undefined) {
	            normalizedQuery[key] = Array.isArray(value)
	                ? value.map(v => (v == null ? null : '' + v))
	                : value == null
	                    ? value
	                    : '' + value;
	        }
	    }
	    return normalizedQuery;
	}

	/**
	 * Create a list of callbacks that can be reset. Used to create before and after navigation guards list
	 */
	function useCallbacks() {
	    let handlers = [];
	    function add(handler) {
	        handlers.push(handler);
	        return () => {
	            const i = handlers.indexOf(handler);
	            if (i > -1)
	                handlers.splice(i, 1);
	        };
	    }
	    function reset() {
	        handlers = [];
	    }
	    return {
	        add,
	        list: () => handlers,
	        reset,
	    };
	}

	function registerGuard(record, name, guard) {
	    const removeFromList = () => {
	        record[name].delete(guard);
	    };
	    vue.onUnmounted(removeFromList);
	    vue.onDeactivated(removeFromList);
	    vue.onActivated(() => {
	        record[name].add(guard);
	    });
	    record[name].add(guard);
	}
	/**
	 * Add a navigation guard that triggers whenever the component for the current
	 * location is about to be left. Similar to {@link beforeRouteLeave} but can be
	 * used in any component. The guard is removed when the component is unmounted.
	 *
	 * @param leaveGuard - {@link NavigationGuard}
	 */
	function onBeforeRouteLeave(leaveGuard) {
	    if (!vue.getCurrentInstance()) {
	        warn('getCurrentInstance() returned null. onBeforeRouteLeave() must be called at the top of a setup function');
	        return;
	    }
	    const activeRecord = vue.inject(matchedRouteKey, 
	    // to avoid warning
	    {}).value;
	    if (!activeRecord) {
	        warn('No active route record was found when calling `onBeforeRouteLeave()`. Make sure you call this function inside of a component child of <router-view>. Maybe you called it inside of App.vue?');
	        return;
	    }
	    registerGuard(activeRecord, 'leaveGuards', leaveGuard);
	}
	/**
	 * Add a navigation guard that triggers whenever the current location is about
	 * to be updated. Similar to {@link beforeRouteUpdate} but can be used in any
	 * component. The guard is removed when the component is unmounted.
	 *
	 * @param updateGuard - {@link NavigationGuard}
	 */
	function onBeforeRouteUpdate(updateGuard) {
	    if (!vue.getCurrentInstance()) {
	        warn('getCurrentInstance() returned null. onBeforeRouteUpdate() must be called at the top of a setup function');
	        return;
	    }
	    const activeRecord = vue.inject(matchedRouteKey, 
	    // to avoid warning
	    {}).value;
	    if (!activeRecord) {
	        warn('No active route record was found when calling `onBeforeRouteUpdate()`. Make sure you call this function inside of a component child of <router-view>. Maybe you called it inside of App.vue?');
	        return;
	    }
	    registerGuard(activeRecord, 'updateGuards', updateGuard);
	}
	function guardToPromiseFn(guard, to, from, record, name) {
	    // keep a reference to the enterCallbackArray to prevent pushing callbacks if a new navigation took place
	    const enterCallbackArray = record &&
	        // name is defined if record is because of the function overload
	        (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
	    return () => new Promise((resolve, reject) => {
	        const next = (valid) => {
	            if (valid === false)
	                reject(createRouterError(4 /* NAVIGATION_ABORTED */, {
	                    from,
	                    to,
	                }));
	            else if (valid instanceof Error) {
	                reject(valid);
	            }
	            else if (isRouteLocation(valid)) {
	                reject(createRouterError(2 /* NAVIGATION_GUARD_REDIRECT */, {
	                    from: to,
	                    to: valid,
	                }));
	            }
	            else {
	                if (enterCallbackArray &&
	                    // since enterCallbackArray is truthy, both record and name also are
	                    record.enterCallbacks[name] === enterCallbackArray &&
	                    typeof valid === 'function')
	                    enterCallbackArray.push(valid);
	                resolve();
	            }
	        };
	        // wrapping with Promise.resolve allows it to work with both async and sync guards
	        const guardReturn = guard.call(record && record.instances[name], to, from, canOnlyBeCalledOnce(next, to, from) );
	        let guardCall = Promise.resolve(guardReturn);
	        if (guard.length < 3)
	            guardCall = guardCall.then(next);
	        if (guard.length > 2) {
	            const message = `The "next" callback was never called inside of ${guard.name ? '"' + guard.name + '"' : ''}:\n${guard.toString()}\n. If you are returning a value instead of calling "next", make sure to remove the "next" parameter from your function.`;
	            if (typeof guardReturn === 'object' && 'then' in guardReturn) {
	                guardCall = guardCall.then(resolvedValue => {
	                    // @ts-expect-error: _called is added at canOnlyBeCalledOnce
	                    if (!next._called) {
	                        warn(message);
	                        return Promise.reject(new Error('Invalid navigation guard'));
	                    }
	                    return resolvedValue;
	                });
	                // TODO: test me!
	            }
	            else if (guardReturn !== undefined) {
	                // @ts-expect-error: _called is added at canOnlyBeCalledOnce
	                if (!next._called) {
	                    warn(message);
	                    reject(new Error('Invalid navigation guard'));
	                    return;
	                }
	            }
	        }
	        guardCall.catch(err => reject(err));
	    });
	}
	function canOnlyBeCalledOnce(next, to, from) {
	    let called = 0;
	    return function () {
	        if (called++ === 1)
	            warn(`The "next" callback was called more than once in one navigation guard when going from "${from.fullPath}" to "${to.fullPath}". It should be called exactly one time in each navigation guard. This will fail in production.`);
	        // @ts-expect-error: we put it in the original one because it's easier to check
	        next._called = true;
	        if (called === 1)
	            next.apply(null, arguments);
	    };
	}
	function extractComponentsGuards(matched, guardType, to, from) {
	    const guards = [];
	    for (const record of matched) {
	        for (const name in record.components) {
	            let rawComponent = record.components[name];
	            {
	                if (!rawComponent ||
	                    (typeof rawComponent !== 'object' &&
	                        typeof rawComponent !== 'function')) {
	                    warn(`Component "${name}" in record with path "${record.path}" is not` +
	                        ` a valid component. Received "${String(rawComponent)}".`);
	                    // throw to ensure we stop here but warn to ensure the message isn't
	                    // missed by the user
	                    throw new Error('Invalid route component');
	                }
	                else if ('then' in rawComponent) {
	                    // warn if user wrote import('/component.vue') instead of () =>
	                    // import('./component.vue')
	                    warn(`Component "${name}" in record with path "${record.path}" is a ` +
	                        `Promise instead of a function that returns a Promise. Did you ` +
	                        `write "import('./MyPage.vue')" instead of ` +
	                        `"() => import('./MyPage.vue')" ? This will break in ` +
	                        `production if not fixed.`);
	                    const promise = rawComponent;
	                    rawComponent = () => promise;
	                }
	                else if (rawComponent.__asyncLoader &&
	                    // warn only once per component
	                    !rawComponent.__warnedDefineAsync) {
	                    rawComponent.__warnedDefineAsync = true;
	                    warn(`Component "${name}" in record with path "${record.path}" is defined ` +
	                        `using "defineAsyncComponent()". ` +
	                        `Write "() => import('./MyPage.vue')" instead of ` +
	                        `"defineAsyncComponent(() => import('./MyPage.vue'))".`);
	                }
	            }
	            // skip update and leave guards if the route component is not mounted
	            if (guardType !== 'beforeRouteEnter' && !record.instances[name])
	                continue;
	            if (isRouteComponent(rawComponent)) {
	                // __vccOpts is added by vue-class-component and contain the regular options
	                const options = rawComponent.__vccOpts || rawComponent;
	                const guard = options[guardType];
	                guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
	            }
	            else {
	                // start requesting the chunk already
	                let componentPromise = rawComponent();
	                if (!('catch' in componentPromise)) {
	                    warn(`Component "${name}" in record with path "${record.path}" is a function that does not return a Promise. If you were passing a functional component, make sure to add a "displayName" to the component. This will break in production if not fixed.`);
	                    componentPromise = Promise.resolve(componentPromise);
	                }
	                guards.push(() => componentPromise.then(resolved => {
	                    if (!resolved)
	                        return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
	                    const resolvedComponent = isESModule(resolved)
	                        ? resolved.default
	                        : resolved;
	                    // replace the function with the resolved component
	                    record.components[name] = resolvedComponent;
	                    // __vccOpts is added by vue-class-component and contain the regular options
	                    const options = resolvedComponent.__vccOpts || resolvedComponent;
	                    const guard = options[guardType];
	                    return guard && guardToPromiseFn(guard, to, from, record, name)();
	                }));
	            }
	        }
	    }
	    return guards;
	}
	/**
	 * Allows differentiating lazy components from functional components and vue-class-component
	 *
	 * @param component
	 */
	function isRouteComponent(component) {
	    return (typeof component === 'object' ||
	        'displayName' in component ||
	        'props' in component ||
	        '__vccOpts' in component);
	}

	// TODO: we could allow currentRoute as a prop to expose `isActive` and
	// `isExactActive` behavior should go through an RFC
	function useLink(props) {
	    const router = vue.inject(routerKey);
	    const currentRoute = vue.inject(routeLocationKey);
	    const route = vue.computed(() => router.resolve(vue.unref(props.to)));
	    const activeRecordIndex = vue.computed(() => {
	        const { matched } = route.value;
	        const { length } = matched;
	        const routeMatched = matched[length - 1];
	        const currentMatched = currentRoute.matched;
	        if (!routeMatched || !currentMatched.length)
	            return -1;
	        const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
	        if (index > -1)
	            return index;
	        // possible parent record
	        const parentRecordPath = getOriginalPath(matched[length - 2]);
	        return (
	        // we are dealing with nested routes
	        length > 1 &&
	            // if the parent and matched route have the same path, this link is
	            // referring to the empty child. Or we currently are on a different
	            // child of the same parent
	            getOriginalPath(routeMatched) === parentRecordPath &&
	            // avoid comparing the child with its parent
	            currentMatched[currentMatched.length - 1].path !== parentRecordPath
	            ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2]))
	            : index);
	    });
	    const isActive = vue.computed(() => activeRecordIndex.value > -1 &&
	        includesParams(currentRoute.params, route.value.params));
	    const isExactActive = vue.computed(() => activeRecordIndex.value > -1 &&
	        activeRecordIndex.value === currentRoute.matched.length - 1 &&
	        isSameRouteLocationParams(currentRoute.params, route.value.params));
	    function navigate(e = {}) {
	        if (guardEvent(e)) {
	            return router[vue.unref(props.replace) ? 'replace' : 'push'](vue.unref(props.to)
	            // avoid uncaught errors are they are logged anyway
	            ).catch(noop);
	        }
	        return Promise.resolve();
	    }
	    return {
	        route,
	        href: vue.computed(() => route.value.href),
	        isActive,
	        isExactActive,
	        navigate,
	    };
	}
	const RouterLinkImpl = /*#__PURE__*/ vue.defineComponent({
	    name: 'RouterLink',
	    props: {
	        to: {
	            type: [String, Object],
	            required: true,
	        },
	        replace: Boolean,
	        activeClass: String,
	        // inactiveClass: String,
	        exactActiveClass: String,
	        custom: Boolean,
	        ariaCurrentValue: {
	            type: String,
	            default: 'page',
	        },
	    },
	    useLink,
	    setup(props, { slots }) {
	        const link = vue.reactive(useLink(props));
	        const { options } = vue.inject(routerKey);
	        const elClass = vue.computed(() => ({
	            [getLinkClass(props.activeClass, options.linkActiveClass, 'router-link-active')]: link.isActive,
	            // [getLinkClass(
	            //   props.inactiveClass,
	            //   options.linkInactiveClass,
	            //   'router-link-inactive'
	            // )]: !link.isExactActive,
	            [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, 'router-link-exact-active')]: link.isExactActive,
	        }));
	        return () => {
	            const children = slots.default && slots.default(link);
	            return props.custom
	                ? children
	                : vue.h('a', {
	                    'aria-current': link.isExactActive
	                        ? props.ariaCurrentValue
	                        : null,
	                    href: link.href,
	                    // this would override user added attrs but Vue will still add
	                    // the listener so we end up triggering both
	                    onClick: link.navigate,
	                    class: elClass.value,
	                }, children);
	        };
	    },
	});
	// export the public type for h/tsx inference
	// also to avoid inline import() in generated d.ts files
	/**
	 * Component to render a link that triggers a navigation on click.
	 */
	const RouterLink = RouterLinkImpl;
	function guardEvent(e) {
	    // don't redirect with control keys
	    if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
	        return;
	    // don't redirect when preventDefault called
	    if (e.defaultPrevented)
	        return;
	    // don't redirect on right click
	    if (e.button !== undefined && e.button !== 0)
	        return;
	    // don't redirect if `target="_blank"`
	    // @ts-expect-error getAttribute does exist
	    if (e.currentTarget && e.currentTarget.getAttribute) {
	        // @ts-expect-error getAttribute exists
	        const target = e.currentTarget.getAttribute('target');
	        if (/\b_blank\b/i.test(target))
	            return;
	    }
	    // this may be a Weex event which doesn't have this method
	    if (e.preventDefault)
	        e.preventDefault();
	    return true;
	}
	function includesParams(outer, inner) {
	    for (const key in inner) {
	        const innerValue = inner[key];
	        const outerValue = outer[key];
	        if (typeof innerValue === 'string') {
	            if (innerValue !== outerValue)
	                return false;
	        }
	        else {
	            if (!Array.isArray(outerValue) ||
	                outerValue.length !== innerValue.length ||
	                innerValue.some((value, i) => value !== outerValue[i]))
	                return false;
	        }
	    }
	    return true;
	}
	/**
	 * Get the original path value of a record by following its aliasOf
	 * @param record
	 */
	function getOriginalPath(record) {
	    return record ? (record.aliasOf ? record.aliasOf.path : record.path) : '';
	}
	/**
	 * Utility class to get the active class based on defaults.
	 * @param propClass
	 * @param globalClass
	 * @param defaultClass
	 */
	const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null
	    ? propClass
	    : globalClass != null
	        ? globalClass
	        : defaultClass;

	const RouterViewImpl = /*#__PURE__*/ vue.defineComponent({
	    name: 'RouterView',
	    // #674 we manually inherit them
	    inheritAttrs: false,
	    props: {
	        name: {
	            type: String,
	            default: 'default',
	        },
	        route: Object,
	    },
	    // Better compat for @vue/compat users
	    // https://github.com/vuejs/router/issues/1315
	    compatConfig: { MODE: 3 },
	    setup(props, { attrs, slots }) {
	        warnDeprecatedUsage();
	        const injectedRoute = vue.inject(routerViewLocationKey);
	        const routeToDisplay = vue.computed(() => props.route || injectedRoute.value);
	        const depth = vue.inject(viewDepthKey, 0);
	        const matchedRouteRef = vue.computed(() => routeToDisplay.value.matched[depth]);
	        vue.provide(viewDepthKey, depth + 1);
	        vue.provide(matchedRouteKey, matchedRouteRef);
	        vue.provide(routerViewLocationKey, routeToDisplay);
	        const viewRef = vue.ref();
	        // watch at the same time the component instance, the route record we are
	        // rendering, and the name
	        vue.watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
	            // copy reused instances
	            if (to) {
	                // this will update the instance for new instances as well as reused
	                // instances when navigating to a new route
	                to.instances[name] = instance;
	                // the component instance is reused for a different route or name so
	                // we copy any saved update or leave guards. With async setup, the
	                // mounting component will mount before the matchedRoute changes,
	                // making instance === oldInstance, so we check if guards have been
	                // added before. This works because we remove guards when
	                // unmounting/deactivating components
	                if (from && from !== to && instance && instance === oldInstance) {
	                    if (!to.leaveGuards.size) {
	                        to.leaveGuards = from.leaveGuards;
	                    }
	                    if (!to.updateGuards.size) {
	                        to.updateGuards = from.updateGuards;
	                    }
	                }
	            }
	            // trigger beforeRouteEnter next callbacks
	            if (instance &&
	                to &&
	                // if there is no instance but to and from are the same this might be
	                // the first visit
	                (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
	                (to.enterCallbacks[name] || []).forEach(callback => callback(instance));
	            }
	        }, { flush: 'post' });
	        return () => {
	            const route = routeToDisplay.value;
	            const matchedRoute = matchedRouteRef.value;
	            const ViewComponent = matchedRoute && matchedRoute.components[props.name];
	            // we need the value at the time we render because when we unmount, we
	            // navigated to a different location so the value is different
	            const currentName = props.name;
	            if (!ViewComponent) {
	                return normalizeSlot(slots.default, { Component: ViewComponent, route });
	            }
	            // props from route configuration
	            const routePropsOption = matchedRoute.props[props.name];
	            const routeProps = routePropsOption
	                ? routePropsOption === true
	                    ? route.params
	                    : typeof routePropsOption === 'function'
	                        ? routePropsOption(route)
	                        : routePropsOption
	                : null;
	            const onVnodeUnmounted = vnode => {
	                // remove the instance reference to prevent leak
	                if (vnode.component.isUnmounted) {
	                    matchedRoute.instances[currentName] = null;
	                }
	            };
	            const component = vue.h(ViewComponent, assign({}, routeProps, attrs, {
	                onVnodeUnmounted,
	                ref: viewRef,
	            }));
	            return (
	            // pass the vnode to the slot as a prop.
	            // h and <component :is="..."> both accept vnodes
	            normalizeSlot(slots.default, { Component: component, route }) ||
	                component);
	        };
	    },
	});
	function normalizeSlot(slot, data) {
	    if (!slot)
	        return null;
	    const slotContent = slot(data);
	    return slotContent.length === 1 ? slotContent[0] : slotContent;
	}
	// export the public type for h/tsx inference
	// also to avoid inline import() in generated d.ts files
	/**
	 * Component to display the current route the user is at.
	 */
	const RouterView = RouterViewImpl;
	// warn against deprecated usage with <transition> & <keep-alive>
	// due to functional component being no longer eager in Vue 3
	function warnDeprecatedUsage() {
	    const instance = vue.getCurrentInstance();
	    const parentName = instance.parent && instance.parent.type.name;
	    if (parentName &&
	        (parentName === 'KeepAlive' || parentName.includes('Transition'))) {
	        const comp = parentName === 'KeepAlive' ? 'keep-alive' : 'transition';
	        warn(`<router-view> can no longer be used directly inside <transition> or <keep-alive>.\n` +
	            `Use slot props instead:\n\n` +
	            `<router-view v-slot="{ Component }">\n` +
	            `  <${comp}>\n` +
	            `    <component :is="Component" />\n` +
	            `  </${comp}>\n` +
	            `</router-view>`);
	    }
	}

	/**
	 * Creates a Router instance that can be used by a Vue app.
	 *
	 * @param options - {@link RouterOptions}
	 */
	function createRouter(options) {
	    const matcher = createRouterMatcher(options.routes, options);
	    const parseQuery$1 = options.parseQuery || parseQuery;
	    const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
	    const routerHistory = options.history;
	    if (!routerHistory)
	        throw new Error('Provide the "history" option when calling "createRouter()":' +
	            ' https://next.router.vuejs.org/api/#history.');
	    const beforeGuards = useCallbacks();
	    const beforeResolveGuards = useCallbacks();
	    const afterGuards = useCallbacks();
	    const currentRoute = vue.shallowRef(START_LOCATION_NORMALIZED);
	    let pendingLocation = START_LOCATION_NORMALIZED;
	    const normalizeParams = applyToParams.bind(null, paramValue => '' + paramValue);
	    const encodeParams = applyToParams.bind(null, encodeParam);
	    const decodeParams = 
	    // @ts-expect-error: intentionally avoid the type check
	    applyToParams.bind(null, decode);
	    function addRoute(parentOrRoute, route) {
	        let parent;
	        let record;
	        if (isRouteName(parentOrRoute)) {
	            parent = matcher.getRecordMatcher(parentOrRoute);
	            record = route;
	        }
	        else {
	            record = parentOrRoute;
	        }
	        return matcher.addRoute(record, parent);
	    }
	    function removeRoute(name) {
	        const recordMatcher = matcher.getRecordMatcher(name);
	        if (recordMatcher) {
	            matcher.removeRoute(recordMatcher);
	        }
	        else {
	            warn(`Cannot remove non-existent route "${String(name)}"`);
	        }
	    }
	    function getRoutes() {
	        return matcher.getRoutes().map(routeMatcher => routeMatcher.record);
	    }
	    function hasRoute(name) {
	        return !!matcher.getRecordMatcher(name);
	    }
	    function resolve(rawLocation, currentLocation) {
	        // const objectLocation = routerLocationAsObject(rawLocation)
	        // we create a copy to modify it later
	        currentLocation = assign({}, currentLocation || currentRoute.value);
	        if (typeof rawLocation === 'string') {
	            const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
	            const matchedRoute = matcher.resolve({ path: locationNormalized.path }, currentLocation);
	            const href = routerHistory.createHref(locationNormalized.fullPath);
	            {
	                if (href.startsWith('//'))
	                    warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
	                else if (!matchedRoute.matched.length) {
	                    warn(`No match found for location with path "${rawLocation}"`);
	                }
	            }
	            // locationNormalized is always a new object
	            return assign(locationNormalized, matchedRoute, {
	                params: decodeParams(matchedRoute.params),
	                hash: decode(locationNormalized.hash),
	                redirectedFrom: undefined,
	                href,
	            });
	        }
	        let matcherLocation;
	        // path could be relative in object as well
	        if ('path' in rawLocation) {
	            if ('params' in rawLocation &&
	                !('name' in rawLocation) &&
	                // @ts-expect-error: the type is never
	                Object.keys(rawLocation.params).length) {
	                warn(`Path "${
	                // @ts-expect-error: the type is never
	                rawLocation.path}" was passed with params but they will be ignored. Use a named route alongside params instead.`);
	            }
	            matcherLocation = assign({}, rawLocation, {
	                path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path,
	            });
	        }
	        else {
	            // remove any nullish param
	            const targetParams = assign({}, rawLocation.params);
	            for (const key in targetParams) {
	                if (targetParams[key] == null) {
	                    delete targetParams[key];
	                }
	            }
	            // pass encoded values to the matcher so it can produce encoded path and fullPath
	            matcherLocation = assign({}, rawLocation, {
	                params: encodeParams(rawLocation.params),
	            });
	            // current location params are decoded, we need to encode them in case the
	            // matcher merges the params
	            currentLocation.params = encodeParams(currentLocation.params);
	        }
	        const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
	        const hash = rawLocation.hash || '';
	        if (hash && !hash.startsWith('#')) {
	            warn(`A \`hash\` should always start with the character "#". Replace "${hash}" with "#${hash}".`);
	        }
	        // decoding them) the matcher might have merged current location params so
	        // we need to run the decoding again
	        matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
	        const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
	            hash: encodeHash(hash),
	            path: matchedRoute.path,
	        }));
	        const href = routerHistory.createHref(fullPath);
	        {
	            if (href.startsWith('//')) {
	                warn(`Location "${rawLocation}" resolved to "${href}". A resolved location cannot start with multiple slashes.`);
	            }
	            else if (!matchedRoute.matched.length) {
	                warn(`No match found for location with path "${'path' in rawLocation ? rawLocation.path : rawLocation}"`);
	            }
	        }
	        return assign({
	            fullPath,
	            // keep the hash encoded so fullPath is effectively path + encodedQuery +
	            // hash
	            hash,
	            query: 
	            // if the user is using a custom query lib like qs, we might have
	            // nested objects, so we keep the query as is, meaning it can contain
	            // numbers at `$route.query`, but at the point, the user will have to
	            // use their own type anyway.
	            // https://github.com/vuejs/router/issues/328#issuecomment-649481567
	            stringifyQuery$1 === stringifyQuery
	                ? normalizeQuery(rawLocation.query)
	                : (rawLocation.query || {}),
	        }, matchedRoute, {
	            redirectedFrom: undefined,
	            href,
	        });
	    }
	    function locationAsObject(to) {
	        return typeof to === 'string'
	            ? parseURL(parseQuery$1, to, currentRoute.value.path)
	            : assign({}, to);
	    }
	    function checkCanceledNavigation(to, from) {
	        if (pendingLocation !== to) {
	            return createRouterError(8 /* NAVIGATION_CANCELLED */, {
	                from,
	                to,
	            });
	        }
	    }
	    function push(to) {
	        return pushWithRedirect(to);
	    }
	    function replace(to) {
	        return push(assign(locationAsObject(to), { replace: true }));
	    }
	    function handleRedirectRecord(to) {
	        const lastMatched = to.matched[to.matched.length - 1];
	        if (lastMatched && lastMatched.redirect) {
	            const { redirect } = lastMatched;
	            let newTargetLocation = typeof redirect === 'function' ? redirect(to) : redirect;
	            if (typeof newTargetLocation === 'string') {
	                newTargetLocation =
	                    newTargetLocation.includes('?') || newTargetLocation.includes('#')
	                        ? (newTargetLocation = locationAsObject(newTargetLocation))
	                        : // force empty params
	                            { path: newTargetLocation };
	                // @ts-expect-error: force empty params when a string is passed to let
	                // the router parse them again
	                newTargetLocation.params = {};
	            }
	            if (!('path' in newTargetLocation) &&
	                !('name' in newTargetLocation)) {
	                warn(`Invalid redirect found:\n${JSON.stringify(newTargetLocation, null, 2)}\n when navigating to "${to.fullPath}". A redirect must contain a name or path. This will break in production.`);
	                throw new Error('Invalid redirect');
	            }
	            return assign({
	                query: to.query,
	                hash: to.hash,
	                params: to.params,
	            }, newTargetLocation);
	        }
	    }
	    function pushWithRedirect(to, redirectedFrom) {
	        const targetLocation = (pendingLocation = resolve(to));
	        const from = currentRoute.value;
	        const data = to.state;
	        const force = to.force;
	        // to could be a string where `replace` is a function
	        const replace = to.replace === true;
	        const shouldRedirect = handleRedirectRecord(targetLocation);
	        if (shouldRedirect)
	            return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
	                state: data,
	                force,
	                replace,
	            }), 
	            // keep original redirectedFrom if it exists
	            redirectedFrom || targetLocation);
	        // if it was a redirect we already called `pushWithRedirect` above
	        const toLocation = targetLocation;
	        toLocation.redirectedFrom = redirectedFrom;
	        let failure;
	        if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
	            failure = createRouterError(16 /* NAVIGATION_DUPLICATED */, { to: toLocation, from });
	            // trigger scroll to allow scrolling to the same anchor
	            handleScroll();
	        }
	        return (failure ? Promise.resolve(failure) : navigate(toLocation, from))
	            .catch((error) => isNavigationFailure(error)
	            ? // navigation redirects still mark the router as ready
	                isNavigationFailure(error, 2 /* NAVIGATION_GUARD_REDIRECT */)
	                    ? error
	                    : markAsReady(error) // also returns the error
	            : // reject any unknown error
	                triggerError(error, toLocation, from))
	            .then((failure) => {
	            if (failure) {
	                if (isNavigationFailure(failure, 2 /* NAVIGATION_GUARD_REDIRECT */)) {
	                    if (// we are redirecting to the same location we were already at
	                        isSameRouteLocation(stringifyQuery$1, resolve(failure.to), toLocation) &&
	                        // and we have done it a couple of times
	                        redirectedFrom &&
	                        // @ts-expect-error: added only in dev
	                        (redirectedFrom._count = redirectedFrom._count
	                            ? // @ts-expect-error
	                                redirectedFrom._count + 1
	                            : 1) > 10) {
	                        warn(`Detected an infinite redirection in a navigation guard when going from "${from.fullPath}" to "${toLocation.fullPath}". Aborting to avoid a Stack Overflow. This will break in production if not fixed.`);
	                        return Promise.reject(new Error('Infinite redirect in navigation guard'));
	                    }
	                    return pushWithRedirect(
	                    // keep options
	                    assign(locationAsObject(failure.to), {
	                        state: data,
	                        force,
	                        replace,
	                    }), 
	                    // preserve the original redirectedFrom if any
	                    redirectedFrom || toLocation);
	                }
	            }
	            else {
	                // if we fail we don't finalize the navigation
	                failure = finalizeNavigation(toLocation, from, true, replace, data);
	            }
	            triggerAfterEach(toLocation, from, failure);
	            return failure;
	        });
	    }
	    /**
	     * Helper to reject and skip all navigation guards if a new navigation happened
	     * @param to
	     * @param from
	     */
	    function checkCanceledNavigationAndReject(to, from) {
	        const error = checkCanceledNavigation(to, from);
	        return error ? Promise.reject(error) : Promise.resolve();
	    }
	    // TODO: refactor the whole before guards by internally using router.beforeEach
	    function navigate(to, from) {
	        let guards;
	        const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
	        // all components here have been resolved once because we are leaving
	        guards = extractComponentsGuards(leavingRecords.reverse(), 'beforeRouteLeave', to, from);
	        // leavingRecords is already reversed
	        for (const record of leavingRecords) {
	            record.leaveGuards.forEach(guard => {
	                guards.push(guardToPromiseFn(guard, to, from));
	            });
	        }
	        const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
	        guards.push(canceledNavigationCheck);
	        // run the queue of per route beforeRouteLeave guards
	        return (runGuardQueue(guards)
	            .then(() => {
	            // check global guards beforeEach
	            guards = [];
	            for (const guard of beforeGuards.list()) {
	                guards.push(guardToPromiseFn(guard, to, from));
	            }
	            guards.push(canceledNavigationCheck);
	            return runGuardQueue(guards);
	        })
	            .then(() => {
	            // check in components beforeRouteUpdate
	            guards = extractComponentsGuards(updatingRecords, 'beforeRouteUpdate', to, from);
	            for (const record of updatingRecords) {
	                record.updateGuards.forEach(guard => {
	                    guards.push(guardToPromiseFn(guard, to, from));
	                });
	            }
	            guards.push(canceledNavigationCheck);
	            // run the queue of per route beforeEnter guards
	            return runGuardQueue(guards);
	        })
	            .then(() => {
	            // check the route beforeEnter
	            guards = [];
	            for (const record of to.matched) {
	                // do not trigger beforeEnter on reused views
	                if (record.beforeEnter && !from.matched.includes(record)) {
	                    if (Array.isArray(record.beforeEnter)) {
	                        for (const beforeEnter of record.beforeEnter)
	                            guards.push(guardToPromiseFn(beforeEnter, to, from));
	                    }
	                    else {
	                        guards.push(guardToPromiseFn(record.beforeEnter, to, from));
	                    }
	                }
	            }
	            guards.push(canceledNavigationCheck);
	            // run the queue of per route beforeEnter guards
	            return runGuardQueue(guards);
	        })
	            .then(() => {
	            // NOTE: at this point to.matched is normalized and does not contain any () => Promise<Component>
	            // clear existing enterCallbacks, these are added by extractComponentsGuards
	            to.matched.forEach(record => (record.enterCallbacks = {}));
	            // check in-component beforeRouteEnter
	            guards = extractComponentsGuards(enteringRecords, 'beforeRouteEnter', to, from);
	            guards.push(canceledNavigationCheck);
	            // run the queue of per route beforeEnter guards
	            return runGuardQueue(guards);
	        })
	            .then(() => {
	            // check global guards beforeResolve
	            guards = [];
	            for (const guard of beforeResolveGuards.list()) {
	                guards.push(guardToPromiseFn(guard, to, from));
	            }
	            guards.push(canceledNavigationCheck);
	            return runGuardQueue(guards);
	        })
	            // catch any navigation canceled
	            .catch(err => isNavigationFailure(err, 8 /* NAVIGATION_CANCELLED */)
	            ? err
	            : Promise.reject(err)));
	    }
	    function triggerAfterEach(to, from, failure) {
	        // navigation is confirmed, call afterGuards
	        // TODO: wrap with error handlers
	        for (const guard of afterGuards.list())
	            guard(to, from, failure);
	    }
	    /**
	     * - Cleans up any navigation guards
	     * - Changes the url if necessary
	     * - Calls the scrollBehavior
	     */
	    function finalizeNavigation(toLocation, from, isPush, replace, data) {
	        // a more recent navigation took place
	        const error = checkCanceledNavigation(toLocation, from);
	        if (error)
	            return error;
	        // only consider as push if it's not the first navigation
	        const isFirstNavigation = from === START_LOCATION_NORMALIZED;
	        const state = {} ;
	        // change URL only if the user did a push/replace and if it's not the initial navigation because
	        // it's just reflecting the url
	        if (isPush) {
	            // on the initial navigation, we want to reuse the scroll position from
	            // history state if it exists
	            if (replace || isFirstNavigation)
	                routerHistory.replace(toLocation.fullPath, assign({
	                    scroll: isFirstNavigation && state && state.scroll,
	                }, data));
	            else
	                routerHistory.push(toLocation.fullPath, data);
	        }
	        // accept current navigation
	        currentRoute.value = toLocation;
	        handleScroll();
	        markAsReady();
	    }
	    let removeHistoryListener;
	    // attach listener to history to trigger navigations
	    function setupListeners() {
	        // avoid setting up listeners twice due to an invalid first navigation
	        if (removeHistoryListener)
	            return;
	        removeHistoryListener = routerHistory.listen((to, _from, info) => {
	            // cannot be a redirect route because it was in history
	            const toLocation = resolve(to);
	            // due to dynamic routing, and to hash history with manual navigation
	            // (manually changing the url or calling history.hash = '#/somewhere'),
	            // there could be a redirect record in history
	            const shouldRedirect = handleRedirectRecord(toLocation);
	            if (shouldRedirect) {
	                pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
	                return;
	            }
	            pendingLocation = toLocation;
	            const from = currentRoute.value;
	            navigate(toLocation, from)
	                .catch((error) => {
	                if (isNavigationFailure(error, 4 /* NAVIGATION_ABORTED */ | 8 /* NAVIGATION_CANCELLED */)) {
	                    return error;
	                }
	                if (isNavigationFailure(error, 2 /* NAVIGATION_GUARD_REDIRECT */)) {
	                    // Here we could call if (info.delta) routerHistory.go(-info.delta,
	                    // false) but this is bug prone as we have no way to wait the
	                    // navigation to be finished before calling pushWithRedirect. Using
	                    // a setTimeout of 16ms seems to work but there is not guarantee for
	                    // it to work on every browser. So Instead we do not restore the
	                    // history entry and trigger a new navigation as requested by the
	                    // navigation guard.
	                    // the error is already handled by router.push we just want to avoid
	                    // logging the error
	                    pushWithRedirect(error.to, toLocation
	                    // avoid an uncaught rejection, let push call triggerError
	                    )
	                        .then(failure => {
	                        // manual change in hash history #916 ending up in the URL not
	                        // changing but it was changed by the manual url change, so we
	                        // need to manually change it ourselves
	                        if (isNavigationFailure(failure, 4 /* NAVIGATION_ABORTED */ |
	                            16 /* NAVIGATION_DUPLICATED */) &&
	                            !info.delta &&
	                            info.type === NavigationType.pop) {
	                            routerHistory.go(-1, false);
	                        }
	                    })
	                        .catch(noop);
	                    // avoid the then branch
	                    return Promise.reject();
	                }
	                // do not restore history on unknown direction
	                if (info.delta)
	                    routerHistory.go(-info.delta, false);
	                // unrecognized error, transfer to the global handler
	                return triggerError(error, toLocation, from);
	            })
	                .then((failure) => {
	                failure =
	                    failure ||
	                        finalizeNavigation(
	                        // after navigation, all matched components are resolved
	                        toLocation, from, false);
	                // revert the navigation
	                if (failure) {
	                    if (info.delta) {
	                        routerHistory.go(-info.delta, false);
	                    }
	                    else if (info.type === NavigationType.pop &&
	                        isNavigationFailure(failure, 4 /* NAVIGATION_ABORTED */ | 16 /* NAVIGATION_DUPLICATED */)) {
	                        // manual change in hash history #916
	                        // it's like a push but lacks the information of the direction
	                        routerHistory.go(-1, false);
	                    }
	                }
	                triggerAfterEach(toLocation, from, failure);
	            })
	                .catch(noop);
	        });
	    }
	    // Initialization and Errors
	    let readyHandlers = useCallbacks();
	    let errorHandlers = useCallbacks();
	    let ready;
	    /**
	     * Trigger errorHandlers added via onError and throws the error as well
	     *
	     * @param error - error to throw
	     * @param to - location we were navigating to when the error happened
	     * @param from - location we were navigating from when the error happened
	     * @returns the error as a rejected promise
	     */
	    function triggerError(error, to, from) {
	        markAsReady(error);
	        const list = errorHandlers.list();
	        if (list.length) {
	            list.forEach(handler => handler(error, to, from));
	        }
	        else {
	            {
	                warn('uncaught error during route navigation:');
	            }
	            console.error(error);
	        }
	        return Promise.reject(error);
	    }
	    function isReady() {
	        if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
	            return Promise.resolve();
	        return new Promise((resolve, reject) => {
	            readyHandlers.add([resolve, reject]);
	        });
	    }
	    function markAsReady(err) {
	        if (!ready) {
	            // still not ready if an error happened
	            ready = !err;
	            setupListeners();
	            readyHandlers
	                .list()
	                .forEach(([resolve, reject]) => (err ? reject(err) : resolve()));
	            readyHandlers.reset();
	        }
	        return err;
	    }
	    // Scroll behavior
	    function handleScroll(to, from, isPush, isFirstNavigation) {
	        return Promise.resolve();
	    }
	    const go = (delta) => routerHistory.go(delta);
	    const installedApps = new Set();
	    const router = {
	        currentRoute,
	        addRoute,
	        removeRoute,
	        hasRoute,
	        getRoutes,
	        resolve,
	        options,
	        push,
	        replace,
	        go,
	        back: () => go(-1),
	        forward: () => go(1),
	        beforeEach: beforeGuards.add,
	        beforeResolve: beforeResolveGuards.add,
	        afterEach: afterGuards.add,
	        onError: errorHandlers.add,
	        isReady,
	        install(app) {
	            const router = this;
	            app.component('RouterLink', RouterLink);
	            app.component('RouterView', RouterView);
	            app.config.globalProperties.$router = router;
	            Object.defineProperty(app.config.globalProperties, '$route', {
	                enumerable: true,
	                get: () => vue.unref(currentRoute),
	            });
	            const reactiveRoute = {};
	            for (const key in START_LOCATION_NORMALIZED) {
	                // @ts-expect-error: the key matches
	                reactiveRoute[key] = vue.computed(() => currentRoute.value[key]);
	            }
	            app.provide(routerKey, router);
	            app.provide(routeLocationKey, vue.reactive(reactiveRoute));
	            app.provide(routerViewLocationKey, currentRoute);
	            const unmountApp = app.unmount;
	            installedApps.add(app);
	            app.unmount = function () {
	                installedApps.delete(app);
	                // the router is not attached to an app anymore
	                if (installedApps.size < 1) {
	                    // invalidate the current navigation
	                    pendingLocation = START_LOCATION_NORMALIZED;
	                    removeHistoryListener && removeHistoryListener();
	                    removeHistoryListener = null;
	                    currentRoute.value = START_LOCATION_NORMALIZED;
	                    ready = false;
	                }
	                unmountApp();
	            };
	        },
	    };
	    return router;
	}
	function runGuardQueue(guards) {
	    return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
	}
	function extractChangingRecords(to, from) {
	    const leavingRecords = [];
	    const updatingRecords = [];
	    const enteringRecords = [];
	    const len = Math.max(from.matched.length, to.matched.length);
	    for (let i = 0; i < len; i++) {
	        const recordFrom = from.matched[i];
	        if (recordFrom) {
	            if (to.matched.find(record => isSameRouteRecord(record, recordFrom)))
	                updatingRecords.push(recordFrom);
	            else
	                leavingRecords.push(recordFrom);
	        }
	        const recordTo = to.matched[i];
	        if (recordTo) {
	            // the type doesn't matter because we are comparing per reference
	            if (!from.matched.find(record => isSameRouteRecord(record, recordTo))) {
	                enteringRecords.push(recordTo);
	            }
	        }
	    }
	    return [leavingRecords, updatingRecords, enteringRecords];
	}

	/**
	 * Returns the router instance. Equivalent to using `$router` inside
	 * templates.
	 */
	function useRouter() {
	    return vue.inject(routerKey);
	}
	/**
	 * Returns the current route location. Equivalent to using `$route` inside
	 * templates.
	 */
	function useRoute() {
	    return vue.inject(routeLocationKey);
	}

	exports.RouterLink = RouterLink;
	exports.RouterView = RouterView;
	exports.START_LOCATION = START_LOCATION_NORMALIZED;
	exports.createMemoryHistory = createMemoryHistory;
	exports.createRouter = createRouter;
	exports.createRouterMatcher = createRouterMatcher;
	exports.createWebHashHistory = createWebHashHistory;
	exports.createWebHistory = createWebHistory;
	exports.isNavigationFailure = isNavigationFailure;
	exports.matchedRouteKey = matchedRouteKey;
	exports.onBeforeRouteLeave = onBeforeRouteLeave;
	exports.onBeforeRouteUpdate = onBeforeRouteUpdate;
	exports.parseQuery = parseQuery;
	exports.routeLocationKey = routeLocationKey;
	exports.routerKey = routerKey;
	exports.routerViewLocationKey = routerViewLocationKey;
	exports.stringifyQuery = stringifyQuery;
	exports.useLink = useLink;
	exports.useRoute = useRoute;
	exports.useRouter = useRouter;
	exports.viewDepthKey = viewDepthKey;
} (vueRouter_cjs));

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
    payload: vue_cjs_prod.reactive(__spreadValues({
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
  const vm = vue_cjs_prod.getCurrentInstance();
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
const wrapInRef = (value) => vue_cjs_prod.isRef(value) ? value : vue_cjs_prod.ref(value);
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
  const instance = vue_cjs_prod.getCurrentInstance();
  if (instance && !instance._nuxtOnBeforeMountCbs) {
    const cbs = instance._nuxtOnBeforeMountCbs = [];
    if (instance && false) {
      vue_cjs_prod.onBeforeMount(() => {
        cbs.forEach((cb) => {
          cb();
        });
        cbs.splice(0, cbs.length);
      });
      vue_cjs_prod.onUnmounted(() => cbs.splice(0, cbs.length));
    }
  }
  const useInitialCache = () => options.initialCache && nuxt.payload.data[key] !== void 0;
  const asyncData = {
    data: wrapInRef((_d = nuxt.payload.data[key]) != null ? _d : options.default()),
    pending: vue_cjs_prod.ref(!useInitialCache()),
    error: vue_cjs_prod.ref((_e = nuxt.payload._errors[key]) != null ? _e : null)
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
      asyncData.data.value = vue_cjs_prod.unref(options.default());
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
    vue_cjs_prod.onServerPrefetch(() => promise);
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
  const state2 = vue_cjs_prod.toRef(nuxt.payload.state, key);
  if (state2.value === void 0 && init) {
    const initialValue = init();
    if (vue_cjs_prod.isRef(initialValue)) {
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
  return vue_cjs_prod.defineComponent({
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
      const to = vue_cjs_prod.computed(() => {
        checkPropConflicts(props, "to", "href");
        return props.to || props.href || "";
      });
      const isExternal = vue_cjs_prod.computed(() => {
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
          return vue_cjs_prod.h(vue_cjs_prod.resolveComponent("RouterLink"), {
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
        return vue_cjs_prod.h("a", { href, rel, target }, (_c = slots.default) == null ? void 0 : _c.call(slots));
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
  const resolvedMeta = isFunction_1(meta2) ? vue_cjs_prod.computed(meta2) : meta2;
  useNuxtApp()._useHead(resolvedMeta);
}
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
function componentsPlugin_4b45847d(nuxtApp) {
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
const vueuseHead_63c2c03b = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  nuxtApp.vueApp.use(head);
  nuxtApp.hooks.hookOnce("app:mounted", () => {
    vue_cjs_prod.watchEffect(() => {
      head.updateDOM();
    });
  });
  const titleTemplate = vue_cjs_prod.ref();
  nuxtApp._useHead = (_meta) => {
    const meta2 = vue_cjs_prod.ref(_meta);
    if ("titleTemplate" in meta2.value) {
      titleTemplate.value = meta2.value.titleTemplate;
    }
    const headObj = vue_cjs_prod.computed(() => {
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
const Script = vue_cjs_prod.defineComponent({
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
const Link = vue_cjs_prod.defineComponent({
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
const Base = vue_cjs_prod.defineComponent({
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
const Title = vue_cjs_prod.defineComponent({
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
const Meta = vue_cjs_prod.defineComponent({
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
const Style = vue_cjs_prod.defineComponent({
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
const Head = vue_cjs_prod.defineComponent({
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
const Html = vue_cjs_prod.defineComponent({
  name: "Html",
  inheritAttrs: false,
  props: __spreadProps(__spreadValues({}, globalProps), {
    manifest: String,
    version: String,
    xmlns: String
  }),
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
const Body = vue_cjs_prod.defineComponent({
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
    const instance = vue_cjs_prod.getCurrentInstance();
    if (!instance) {
      return;
    }
    const options = instance.type;
    if (!options || !("head" in options)) {
      return;
    }
    const nuxtApp = useNuxtApp();
    const source = typeof options.head === "function" ? vue_cjs_prod.computed(() => options.head(nuxtApp)) : options.head;
    useHead(source);
  }
};
const _6c3e4e2f = defineNuxtPlugin((nuxtApp) => {
  useHead(vue_cjs_prod.markRaw(metaConfig.globalMeta));
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
  return { default: () => props ? vue_cjs_prod.h(component, props === true ? {} : props, slots) : vue_cjs_prod.h(Fragment, {}, slots) };
};
const isNestedKey = Symbol("isNested");
const NuxtPage = vue_cjs_prod.defineComponent({
  name: "NuxtPage",
  props: {
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props) {
    const nuxtApp = useNuxtApp();
    const isNested = vue_cjs_prod.inject(isNestedKey, false);
    vue_cjs_prod.provide(isNestedKey, true);
    return () => {
      return vue_cjs_prod.h(vueRouter_cjs.RouterView, {}, {
        default: (routeProps) => {
          var _a;
          return routeProps.Component && _wrapIf(vue_cjs_prod.Transition, (_a = routeProps.route.meta.pageTransition) != null ? _a : defaultPageTransition, wrapInKeepAlive(routeProps.route.meta.keepalive, isNested && nuxtApp.isHydrating ? vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) : vue_cjs_prod.h(vue_cjs_prod.Suspense, {
            onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
            onResolve: () => nuxtApp.callHook("page:finish", routeProps.Component)
          }, { default: () => vue_cjs_prod.h(routeProps.Component, { key: generateRouteKey(props.pageKey, routeProps) }) }))).default();
        }
      });
    };
  }
});
const defaultPageTransition = { name: "page", mode: "out-in" };
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const meta$c = void 0;
const meta$b = void 0;
const meta$a = void 0;
const meta$9 = void 0;
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
const _sfc_main$z = {
  name: "BlogHeader",
  __ssrInlineRender: true,
  props: ["heading", "links", "text"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
      _push(`<section${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        id: "blog-roll",
        class: "blog-roll-nav"
      }, _attrs))} data-v-aadde774><div class="container" data-v-aadde774><div class="row justify-content-center" data-v-aadde774><div class="col-12" data-v-aadde774><div class="section-title text-center" data-v-aadde774><h2 data-v-aadde774>${serverRenderer.exports.ssrInterpolate(__props.heading)}</h2><ul class="breadcrumb-nav" data-v-aadde774><!--[-->`);
      serverRenderer.exports.ssrRenderList(__props.links, (link) => {
        _push(`<li data-v-aadde774>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
          to: link.to
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(link.text)}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(link.text), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--><li data-v-aadde774>${serverRenderer.exports.ssrInterpolate(__props.text)}</li></ul></div></div></div></div></section>`);
    };
  }
};
const _sfc_setup$z = _sfc_main$z.setup;
_sfc_main$z.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
      const _component_Html = vue_cjs_prod.resolveComponent("Html");
      const _component_Head = vue_cjs_prod.resolveComponent("Head");
      const _component_Title = vue_cjs_prod.resolveComponent("Title");
      const _component_Meta = vue_cjs_prod.resolveComponent("Meta");
      const _component_Link = vue_cjs_prod.resolveComponent("Link");
      _push(serverRenderer.exports.ssrRenderComponent(_component_Html, _attrs, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_Head, null, {
              default: vue_cjs_prod.withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Title, null, {
                    default: vue_cjs_prod.withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${serverRenderer.exports.ssrInterpolate(__props.title)}`);
                      } else {
                        return [
                          vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Meta, {
                    name: "description",
                    content: __props.description
                  }, null, _parent3, _scopeId2));
                  if (__props.image) {
                    _push3(serverRenderer.exports.ssrRenderComponent(_component_Meta, {
                      name: "image",
                      content: __props.image
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(serverRenderer.exports.ssrRenderComponent(_component_Link, {
                    rel: "icon",
                    href: "https://i.ibb.co/QrC7C7b/logo.png"
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    vue_cjs_prod.createVNode(_component_Title, null, {
                      default: vue_cjs_prod.withCtx(() => [
                        vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.title), 1)
                      ]),
                      _: 1
                    }),
                    vue_cjs_prod.createVNode(_component_Meta, {
                      name: "description",
                      content: __props.description
                    }, null, 8, ["content"]),
                    __props.image ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Meta, {
                      key: 0,
                      name: "image",
                      content: __props.image
                    }, null, 8, ["content"])) : vue_cjs_prod.createCommentVNode("", true),
                    vue_cjs_prod.createVNode(_component_Link, {
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
              vue_cjs_prod.createVNode(_component_Head, null, {
                default: vue_cjs_prod.withCtx(() => [
                  vue_cjs_prod.createVNode(_component_Title, null, {
                    default: vue_cjs_prod.withCtx(() => [
                      vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.title), 1)
                    ]),
                    _: 1
                  }),
                  vue_cjs_prod.createVNode(_component_Meta, {
                    name: "description",
                    content: __props.description
                  }, null, 8, ["content"]),
                  __props.image ? (vue_cjs_prod.openBlock(), vue_cjs_prod.createBlock(_component_Meta, {
                    key: 0,
                    name: "image",
                    content: __props.image
                  }, null, 8, ["content"])) : vue_cjs_prod.createCommentVNode("", true),
                  vue_cjs_prod.createVNode(_component_Link, {
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
  const ssrContext = vue_cjs_prod.useSSRContext();
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
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div class="sidebar blog-grid-page"><div class="widget search-widget"><h5 class="widget-title">Search This Site</h5><form action="/blog/search/" method="get"><input type="text" name="q" placeholder="Search Here..."><button type="submit"><i class="lni lni-search-alt"></i></button></form></div></div><div class="widget categories-widget"><h5 class="widget-title">Categories</h5><ul class="categories-list"><!--[-->`);
      serverRenderer.exports.ssrRenderList(__props.categories, (category) => {
        _push(`<li>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
          to: `/blog/category/${category.slug}/`
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(category.name)}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(category.name), 1)
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/BlogWidget.vue");
  return _sfc_setup$x ? _sfc_setup$x(props, ctx) : void 0;
};
let butterCMS = void 0;
const butterCMS_159cd5cb = defineNuxtPlugin((nuxtApp) => {
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
const state = vue_cjs_prod.reactive({
  error: null
});
const useMenuItems = () => {
  const items = vue_cjs_prod.ref([]);
  const loading = vue_cjs_prod.ref(true);
  butterCMS == null ? void 0 : butterCMS.content.retrieve(["navigation_menu"]).then((response) => {
    items.value = response.data.data.navigation_menu[0].menu_items;
  }).catch((e) => state.error = e).finally(() => loading.value = false);
  return { items, loading };
};
const useCategories = () => {
  const categories = vue_cjs_prod.ref([]);
  butterCMS == null ? void 0 : butterCMS.category.list().then((response) => {
    categories.value = response == null ? void 0 : response.data.data;
  });
  return { categories };
};
const useApiError = () => {
  const setError = (error) => {
    state.error = error;
  };
  return __spreadProps(__spreadValues({}, vue_cjs_prod.toRefs(state)), { setError });
};
const _sfc_main$w = {
  name: "BlogContentContainer",
  __ssrInlineRender: true,
  setup(__props) {
    const { categories } = useCategories();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "blog-posts" }, _attrs))}><div class="container"><div class="row justify-content-center"><div class="col-12 col-lg-8 blog-roll-cards">`);
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div><aside class="col-12 col-lg-4">`);
      _push(serverRenderer.exports.ssrRenderComponent(_sfc_main$x, { categories: vue_cjs_prod.unref(categories) }, null, _parent));
      _push(`</aside></div></div></section>`);
    };
  }
};
const _sfc_setup$w = _sfc_main$w.setup;
_sfc_main$w.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/BlogContentContainer.vue");
  return _sfc_setup$w ? _sfc_setup$w(props, ctx) : void 0;
};
const meta$7 = void 0;
const placeholder = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATkAAAE5CAMAAADcP6fDAAABKVBMVEUAAADf3/fa2vTZ2fLa2vLZ2/Pa3fba3fXZ3Pba3Pba2/XZ3PXa3PXb2/PPz+/Y2/Tb3fTa3PXX1+/a2vTb3ffa3fXZ2fXa3/bY2/ba3fXb3fba2/bX2/Pa3PXc3/fb3fXb3PXa2u/U2vTZ3/fZ2/XZ3PLb3fTe5v/a3PTf3+/Y3PTW2fLb3fXY2/Xa3PPP0enExt25u9G/wdfKy+PZ2vSpq72IiZmDhJOen7G0tcqusMSkpbeOj5/V1++Zmqupq76ztcq5u9C/wdajpbevsMSUlaW0tsrJy+ONj5+TlKWYmqupqr3KzOOIipnExtza3PWjpbikpbien7KeoLG6u9DKy+Kqq76+wNbX1/edn7HY3fTX2vTZ3PbPz//a3PTa2/ba3fTX3/fX2vL1kGjlAAAAY3RSTlMAIDBQYICPn6+/z9//QBBw758gYH/fUG9wz4+PQO9ff68wMF+AUM8fvxCQUO+wkP//////oP//////////////////////////////////3///////////IP9wYN8QYM/PIGCpDvBvAAAJ2klEQVR4AezZBZbkIBSFYSpOuBCl3Xv/e5wj496vBLvfEn7kcRIVkUNVN23XD3o0xuALY4zWQ9+2ja2cou+5QzP1g8H/GHXX1pWiQ90OBh83DgX3c3WnZxxj1q11pVVrOoPTGJd6LaWalVf7cz2nMneY9Iyz0NuqsmV3jXMa20pl6LAbnJ/fV5UVN2lcypjRsbUalzXUKgNul4wEnlqrEcpiVbo2jZD8VtIxZTtZN154sm5sJ+zGdrJuvO+uPATYzmrEyq8qXm5BzJZo213PiJu/UTGytxDgkXV3SMO9U1GxHqnwGzec1OK44YT8g4rCHdKzq/DWW6TIr3zDCT3ecDSk+D5ZPSR4Yp9mpO1xU0E8Q4Iz1r0gB4PjFZfIZffqkQv/xtkg9c7ZILUzXOTpFuTnnuGkFnVu7hZ5Gh3DydMxnDwdw8nTMVxU6W6Ru5HPEamFv7giSveMMuwMF0m6J4jwo9MrCvL4xk/nwT+wO4+yeKdO4wWlGYKOVQ7YDSIcsOuMEj2uoaYDp8QdRPhT5xrluuElF+Kq8yjZyJfcxa86i9I98EFy2afJgtJ9Yt8OVhoGgjiMi1JkZRjRsCCye5HV1dT6/o/nwaNI65ccv9+9t5nMfyYp7NclBPqV96r9+hxC/foY+tHMwNCd+yr15CsbqKdRDnpwPFDN8QAVtwfqxpKDqiVHDRMJ1NNDMDQsOainJQcNWHLqCUtOA2Y59YRZTgOWnDotOS2w5FTo5xBq8BSsQk/B+iuYHIIxmNRADCavoXMa/JOSCp0PSrg/6P7qt7fQecVmpSYMcxqGub1eWl/HZdRgs2rAyapCJ6umMXiXMPweQu36ERdTT3hgUoMvILTCTKJKM4kSPua0wMecVviYU6VpTgk/J9ERXpi0urRuXF0/43/U6SFdE+ZgHeGA0AF+iaOTG8SmLQL8UAlHqyYcrVocrRteHX6B3+kWbq06wVCiaiihPAhTE8Y5vXhKx9eSb3bOQsduHIzCy/iLFkSLohVWdgrxrGPnMqXM7fu/yG4cpbZP7pwBX6l4RLfOF/ri/CF3vpLr5FN+vuaN8Kd8fRJzSlfVTV3KXyPqZlXpWwV8yUec21IYfac2Q86OyPi3NsbmfEN4FaY5n7W50KYA9VVbmxDXKMH4mTFGZy1z4Mvybel7zYUzSRoPVtu+1TIeshycSpJVaFqCmXVtkqxxs8JUTfjS3Ch7+PKtybPxcNxzc4ryIcM826TXwjJCds6EgApYjWZ8Yb4vM6fMkP2hq03I3exERXP3Rr4beSuYQ998X+Wr2GCfmixomXQvY9DcfMI/KP7T1g+lJP3B7eah42hn+vjxKMfuZQl/309LXdoZ/TlFroc67eOZ2Y6TlrF7acqX5ddCcw+M0/kuL2SINWiO81jq7qYn71Iw1nQ6LrSPSg4Omgu8ynn/ds3JwkOJsom5evsoNnF+WuoeBNycw/gtnuA6Mef0Pm1CPky8VWpOTpcFmHvsBcxhv8GJWOqUi0WO5FFurrYiaC5LO0wsyynNzdOrot1okUuYCzxEjZUIixwzcWv8xxMlYI7w74a5p+kGhd3l5tpYno6Wuu06FjmaXrSTbMXMnIr8u2HumcEN4ubCjVonRzPD6wtLEDyTLMxc4O27Ys7rlemjuDnk64zHUjeo5VFVCw9sYI7wb92ceZN6IdQc56eljhc5HQjAiDnCv21zrZIrmTsj27/EWzJmznrh5jj/9s2ZRhFznMcs4CGJmnPrq5lz23fNnHHPqbkpr05wtvI6d5zflNe5h1Ic1UfPHewBmOM8xr2pAMJXvNOPHHJoDvm3/tyKWYEmMMd4zOwq74NUUPGAm+P8WzEHLzDuM3OcxyJn4wMsT3iEf0LNTfnHpeb+kcLgTZgi5iiPRa4Tf6ClLiZglzfngX8LbzbpkzQ3R54f4+OqgldpzJyh5qb8/VJzf0tRPPahq5g7gLmsyIWb5G0sdWS9HkygOeTVCfrcjcJvXwun8N26J+YIj0VuJiGrc0rdqlEwx4GaCzw+MZfk28KBh86Y5lZ2yeqEmAu8Inz8cCjkbXqQfv/F2KjrqBrNRd6tc377Nr5UQ/fY3JlX1bypTfp2vGn7DBbCTwv8WcbjnRy8+m6xyw2ttqqqeWvSdwe+DQlth/Dz5VHeqVJzX0lBGoOZxYMOeTy+wQMesoavhlDqol7INvYuyILw18/PhUPT7UQEMUd46MWP8QqMpU49moig5pCvA1+S30vHz6lHyeHstBBzlMeREHzERFhQnSxoJ9QcuuvUCcbPvZLS6Pmq+z+reeZhbiFLzg9ZBHQHt/zj/BBtX3dd93o1T6V6i3lO+YL/hCP/tXcGqm2CURQ+CD+lU5ACDAYGpCCo6wKADyPzt2ny/g8x2Fg3yErrSeIS/b5HONx7z7nX5u/qsZCsxRU+mT/ShHvJXiJ4PeJ7Bk4QlhWF4atkxRJ45FUmE4lY4oYSYonFN94rMQm8keNbK+Zq8chbYB4b3p8zudcvthkYBmFYBBS87eofhMUW4W0QDDqLB/3EOTSRgxl0Fr3EoPPHHIPOGnOvFJkDY05qnNWVNOevrvy/Lz4dTmHQK+6NjkxCu7qZhI8RzoWJXGIe0qeuERAl2tX/Z8u+u+KsvrvirH4YJgZ7RzqalXY1/hJHRDrvwHTMUzYBwpwR6QhztkfgD3iE8QHC8AgoJKfoIOpthmwC7A9mMKHk/GBCyU348ErJOUVHCnaKDmIvt+goObfoKDmz6Cg5t+goObvoyHLvE7NpkOVk/CaHkrNPJpQcdzrjFHxMl8FHTsEkEzuRHJNnv4Fck/iSTQB7sE0Cezj6QRO0mkoTsyyDOEry+5XtgX41oxz9avSqBf1ayGTLIfhdyMP/IMqnX/P+uul1Ajn7qsuW5cGkiQQSRp035HwGti6XQJJzKVcnXKnz0ETcwaSPfLIxSVZlsIksMNhnnZWArboEhHPp2FaR7m06WXDn3OkyNEuXbjdqRukQDulM4ZDOFA7pTOEIJ51mYItwLoGVC+lOEY6j0+ZZM5LExQgXE81KHzmdmzTlIoQrR81PwBtchie8waSPjDiT5pb3iXbU/yS/1Y7d5HKgY3e9HPDYVldBcWtlFwtdCU2HNbgMcekFRz7xCg6T3RW6RvJIhjPpr9spHkYZ0LJ1IQNcNn6WAdptgm6CPsQr022UhHbz6IZ2nm7MO083tKsH3S5FR347deDRpgZVSbm59MPLfLLlRrnRtWnYa4Ek4bKVV4dCi6Uf6gtZQp3vtXDGqjt36aVtMWod9OdTL20Po9bFWIR6c2KHttWolZJUoXSqLy1DtRckVWjrlw9Kdpcf9qP+BsakOIRwV9Z1mqZ/tErTl7q8a8OhSva6Hn4AEjITTzZk9hIAAAAASUVORK5CYII=";
const _sfc_main$v = {
  name: "SingleArticle",
  __ssrInlineRender: true,
  props: ["article"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "single-post" }, _attrs))} data-v-4391404c><div class="single-post-meta" data-v-4391404c><h2 class="single-post-header" data-v-4391404c>${serverRenderer.exports.ssrInterpolate(__props.article.title)}</h2><ul class="single-post-meta-info" data-v-4391404c>`);
      if (__props.article.author) {
        _push(`<li data-v-4391404c><a href="#" data-v-4391404c><img${serverRenderer.exports.ssrRenderAttr("src", __props.article.author.profile_image || vue_cjs_prod.unref(placeholder))} alt="#" data-v-4391404c> ${serverRenderer.exports.ssrInterpolate(__props.article.author.first_name)} ${serverRenderer.exports.ssrInterpolate(__props.article.author.last_name)}</a></li>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<li data-v-4391404c><a href="#" data-v-4391404c><i class="lni lni-calendar" data-v-4391404c></i> ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatTime)(__props.article.published))}</a></li><li data-v-4391404c><!--[-->`);
      serverRenderer.exports.ssrRenderList(__props.article.tags, (tag) => {
        _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
          key: tag.slug,
          to: `/blog/tag/${tag.slug}/`,
          class: "tag"
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<i class="lni lni-tag" data-v-4391404c${_scopeId}></i> ${serverRenderer.exports.ssrInterpolate(tag.name)}`);
            } else {
              return [
                vue_cjs_prod.createVNode("i", { class: "lni lni-tag" }),
                vue_cjs_prod.createTextVNode(" " + vue_cjs_prod.toDisplayString(tag.name), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></li></ul></div>`);
      if (__props.article.featured_image) {
        _push(`<div class="single-post-thumbnail" data-v-4391404c><img${serverRenderer.exports.ssrRenderAttr("src", __props.article.featured_image)}${serverRenderer.exports.ssrRenderAttr("alt", __props.article.featured_image_alt)} data-v-4391404c></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="single-post-body" data-v-4391404c>${__props.article.body}</div></div>`);
    };
  }
};
const _sfc_setup$v = _sfc_main$v.setup;
_sfc_main$v.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BlogSections/SingleArticle.vue");
  return _sfc_setup$v ? _sfc_setup$v(props, ctx) : void 0;
};
const SingleArticle = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["__scopeId", "data-v-4391404c"]]);
const meta$6 = void 0;
const _sfc_main$u = {
  name: "ZeroData"
};
function _sfc_ssrRender$5(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<p${serverRenderer.exports.ssrRenderAttrs(_attrs)}>Sorry,No posts found matching this search.</p>`);
}
const _sfc_setup$u = _sfc_main$u.setup;
_sfc_main$u.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ZeroData.vue");
  return _sfc_setup$u ? _sfc_setup$u(props, ctx) : void 0;
};
const ZeroData = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["ssrRender", _sfc_ssrRender$5]]);
const _sfc_main$t = {
  name: "BlogPostsList",
  __ssrInlineRender: true,
  props: ["blogPosts"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "row" }, _attrs))} data-v-021c4334>`);
      if (__props.blogPosts.length === 0) {
        _push(serverRenderer.exports.ssrRenderComponent(ZeroData, null, null, _parent));
      } else {
        _push(`<!--[-->`);
        serverRenderer.exports.ssrRenderList(__props.blogPosts, (post) => {
          _push(`<div class="col-12 col-lg-6" data-v-021c4334><div class="blog-roll-card" data-v-021c4334><div class="blog-roll-card-meta" data-v-021c4334><h2 class="blog-roll-card-header" data-v-021c4334>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
            to: `/blog/${post.slug}/`
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${serverRenderer.exports.ssrInterpolate(post.title)}`);
              } else {
                return [
                  vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(post.title), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</h2><ul class="blog-roll-card-meta-info" data-v-021c4334><li data-v-021c4334><a href="#" data-v-021c4334><img${serverRenderer.exports.ssrRenderAttr("src", post.author.profile_image || vue_cjs_prod.unref(placeholder))} alt="#" data-v-021c4334> ${serverRenderer.exports.ssrInterpolate(post.author.first_name)} ${serverRenderer.exports.ssrInterpolate(post.author.last_name)}</a></li><li data-v-021c4334><a href="#" data-v-021c4334><i class="lni lni-calendar" data-v-021c4334></i> ${serverRenderer.exports.ssrInterpolate(vue_cjs_prod.unref(formatTime)(post.published))}</a></li><li data-v-021c4334><!--[-->`);
          serverRenderer.exports.ssrRenderList(post.tags, (tag) => {
            _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
              key: tag.slug,
              to: `/blog/tag/${tag.slug}/`,
              class: "tag"
            }, {
              default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<i class="lni lni-tag" data-v-021c4334${_scopeId}></i> ${serverRenderer.exports.ssrInterpolate(tag.name)}`);
                } else {
                  return [
                    vue_cjs_prod.createVNode("i", { class: "lni lni-tag" }),
                    vue_cjs_prod.createTextVNode(" " + vue_cjs_prod.toDisplayString(tag.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></li></ul></div>`);
          if (post.featured_image) {
            _push(`<div class="single-post-thumbnail" data-v-021c4334><img${serverRenderer.exports.ssrRenderAttr("src", post.featured_image)}${serverRenderer.exports.ssrRenderAttr("alt", post.featured_image_alt)} data-v-021c4334></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="blog-roll-card-body" data-v-021c4334><p data-v-021c4334>${serverRenderer.exports.ssrInterpolate(post.summary)}</p></div><div class="blog-roll-card-footer text-center" data-v-021c4334>`);
          _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
            to: `/blog/${post.slug}/`,
            class: "main-btn btn-hover"
          }, {
            default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Read More`);
              } else {
                return [
                  vue_cjs_prod.createTextVNode("Read More")
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
  const ssrContext = vue_cjs_prod.useSSRContext();
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
const _sfc_main$s = {
  name: "HeroSection",
  __ssrInlineRender: true,
  props: ["fields"],
  setup(__props) {
    vue_cjs_prod.onMounted(() => {
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
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "body" }, _attrs))} data-v-1e22d8ee><div class="hero" data-v-1e22d8ee><div class="hero-article" data-v-1e22d8ee><div class="hero-text" data-v-1e22d8ee><h1 class="lg-text" data-v-1e22d8ee>Relax and Enjoy the<br data-v-1e22d8ee> <span class="colored-text" data-v-1e22d8ee> Best FM </span> on the<br data-v-1e22d8ee> planet earth...</h1><h1 class="mobile-text" data-v-1e22d8ee>Relax and Enjoy the <span class="colored-text" data-v-1e22d8ee> Best FM </span> on the planet earth...</h1></div><div class="hero-para" data-v-1e22d8ee><p data-v-1e22d8ee>Listen to exciting talks about sport, recent<br data-v-1e22d8ee> news, dramas, relationships and many more on<br data-v-1e22d8ee> sparkling FM</p></div><div class="hero-links" data-v-1e22d8ee><a style="${serverRenderer.exports.ssrRenderStyle({ "background-color": "rgba(229, 137, 70, 1)" })}" href="#C4" class="listen nuxt-link-exact-active" id="listen" data-v-1e22d8ee>Listen Live</a>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        class: "second-link",
        to: "/blog/"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Read our Articles`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("Read our Articles")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="hero-img" data-v-1e22d8ee><div class="w3-content w3-section" style="${serverRenderer.exports.ssrRenderStyle({ "max-width": "500px" })}" data-v-1e22d8ee><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/7YSxyHk/Group-1.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>1 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/pb2yV0w/Whats-App-Image-2022-09-14-at-12-07-26-PM.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>2 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/8DzWQ7x/Whats-App-Image-2022-09-14-at-12-06-39-PM.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>3 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/YcFM8Mz/Whats-App-Image-2022-09-14-at-12-07-27-PM-2.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>4 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/xHkj6LM/slide5.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>5 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/sWsJbMH/slide3.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>6 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/BV3R1Vx/slide6.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>7 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/H21tZh1/slide4.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>8 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/zQxGmKc/slide8.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>9 / 10</h1></div><div class="mySlides slideshow-container" data-v-1e22d8ee><img src="https://i.ibb.co/x8x0TS7/slide9.jpg" style="${serverRenderer.exports.ssrRenderStyle({ "width": "100%" })}" data-v-1e22d8ee><h1 class="numbertext" data-v-1e22d8ee>10 / 10</h1></div></div></div></div><div class="iframe" id="C4" data-v-1e22d8ee><div data-v-1e22d8ee><iframe loading="lazy" src="https://mixlr.com/users/2614208/embed" width="100%" height="180px" frameborder="no" marginwidth="0" marginheight="0" scrolling="no" data-v-1e22d8ee></iframe></div></div></div>`);
    };
  }
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HomepageSections/HeroSection.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const HeroSection = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-1e22d8ee"]]);
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
      const _component_router_link = vue_cjs_prod.resolveComponent("router-link");
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "col-lg-4 col-md-8 col-sm-10" }, _attrs))}><div class="single-blog">`);
      if (__props.featured_image) {
        _push(`<div class="blog-header"><img class="img-fluid" loading="lazy"${serverRenderer.exports.ssrRenderAttr("src", __props.featured_image)}${serverRenderer.exports.ssrRenderAttr("alt", __props.featured_image_alt)}></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="blog-body"><h5 class="package-name">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
        to: `/blog/${__props.slug}/`
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.title)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h5><p>${serverRenderer.exports.ssrInterpolate(__props.summary)}</p></div><div class="blog-footer">`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_router_link, {
        to: `/blog/${__props.slug}/`,
        class: "main-btn btn-hover"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Read More`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("Read More")
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
  const ssrContext = vue_cjs_prod.useSSRContext();
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
      _push(`<section${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        id: "blog",
        class: "blog-section"
      }, _attrs))}><div class="container"><div class="row justify-content-center"><div class="col-lg-6 col-md-10"><div class="section-title text-center"><h2>Latest News</h2><p></p></div></div></div><div class="row justify-content-center"><!--[-->`);
      serverRenderer.exports.ssrRenderList(__props.blogPosts, (blogPost, index2) => {
        _push(serverRenderer.exports.ssrRenderComponent(_sfc_main$r, vue_cjs_prod.mergeProps({ key: index2 }, blogPost), null, _parent));
      });
      _push(`<!--]--></div><p>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        class: "main-btn btn-hover mt-5",
        to: "/blog/"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View All News `);
          } else {
            return [
              vue_cjs_prod.createTextVNode(" View All News ")
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HomepageSections/BlogSection.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
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
    vue_cjs_prod.inject("layout");
    const { data, refresh } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(async () => useAsyncData("home-data", async () => {
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
    vue_cjs_prod.onMounted(refresh);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)} data-v-2c8d904c>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$y), vue_cjs_prod.unref(data).pageData.fields.seo, null, _parent));
      _push(`<!--[-->`);
      serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(data).pageData.fields.body, (item, index2) => {
        _push(`<div data-v-2c8d904c>`);
        if (item.type === "hero") {
          _push(serverRenderer.exports.ssrRenderComponent(HeroSection, {
            key: index2,
            fields: item.fields
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      _push(serverRenderer.exports.ssrRenderComponent(_sfc_main$q, {
        "blog-posts": vue_cjs_prod.unref(data).blogPosts
      }, null, _parent));
      _push(`<section class="category" data-v-2c8d904c><div class="widget categories-widget" data-v-2c8d904c><h5 class="widget-title" data-v-2c8d904c>Categories</h5><ul class="categories-list" data-v-2c8d904c><!--[-->`);
      serverRenderer.exports.ssrRenderList(vue_cjs_prod.unref(categories), (category) => {
        _push(`<li data-v-2c8d904c>`);
        _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
          to: `/blog/category/${category.slug}/`
        }, {
          default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${serverRenderer.exports.ssrInterpolate(category.name)}`);
            } else {
              return [
                vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(category.name), 1)
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
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    file: "/Users/achufam/Documents/SparklingFm/pages/About/index.vue",
    children: [],
    meta: meta$c,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$b;
    })
  },
  {
    name: "Contact",
    path: "/Contact",
    file: "/Users/achufam/Documents/SparklingFm/pages/Contact/index.vue",
    children: [],
    meta: meta$b,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$9;
    })
  },
  {
    name: "Oap",
    path: "/Oap",
    file: "/Users/achufam/Documents/SparklingFm/pages/Oap/index.vue",
    children: [],
    meta: meta$a,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$7;
    })
  },
  {
    name: "Program",
    path: "/Program",
    file: "/Users/achufam/Documents/SparklingFm/pages/Program/index.vue",
    children: [],
    meta: meta$9,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$5;
    })
  },
  {
    name: "Shows",
    path: "/Shows",
    file: "/Users/achufam/Documents/SparklingFm/pages/Shows/index.vue",
    children: [],
    meta: meta$8,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index$3;
    })
  },
  {
    path: "/blog",
    file: "/Users/achufam/Documents/SparklingFm/pages/blog.vue",
    children: [
      {
        name: "blog-post",
        path: ":post",
        file: "/Users/achufam/Documents/SparklingFm/pages/blog/[post].vue",
        children: [],
        meta: meta$6,
        alias: [],
        component: () => Promise.resolve().then(function() {
          return _post_;
        })
      },
      {
        name: "blog-category-category",
        path: "category/:category",
        file: "/Users/achufam/Documents/SparklingFm/pages/blog/category/[category].vue",
        children: [],
        meta: meta$5,
        alias: [],
        component: () => Promise.resolve().then(function() {
          return _category_;
        })
      },
      {
        name: "blog",
        path: "",
        file: "/Users/achufam/Documents/SparklingFm/pages/blog/index.vue",
        children: [],
        meta: meta$4,
        alias: [],
        component: () => Promise.resolve().then(function() {
          return index$1;
        })
      },
      {
        name: "blog-search",
        path: "search",
        file: "/Users/achufam/Documents/SparklingFm/pages/blog/search.vue",
        children: [],
        meta: meta$3,
        alias: [],
        component: () => Promise.resolve().then(function() {
          return search;
        })
      },
      {
        name: "blog-tag-tag",
        path: "tag/:tag",
        file: "/Users/achufam/Documents/SparklingFm/pages/blog/tag/[tag].vue",
        children: [],
        meta: meta$2,
        alias: [],
        component: () => Promise.resolve().then(function() {
          return _tag_;
        })
      }
    ],
    meta: meta$7,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return blog;
    })
  },
  {
    name: "index",
    path: "/",
    file: "/Users/achufam/Documents/SparklingFm/pages/index.vue",
    children: [],
    meta: meta$1,
    alias: [],
    component: () => Promise.resolve().then(function() {
      return index;
    })
  },
  {
    name: "landing-page-slug",
    path: "/landing-page/:slug",
    file: "/Users/achufam/Documents/SparklingFm/pages/landing-page/[slug].vue",
    children: [],
    meta,
    alias: [],
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
const _3c168e16 = defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.component("NuxtPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtNestedPage", NuxtPage);
  nuxtApp.vueApp.component("NuxtChild", NuxtPage);
  const baseURL2 = useRuntimeConfig().app.baseURL;
  const routerHistory = vueRouter_cjs.createMemoryHistory(baseURL2);
  const initialURL = nuxtApp.ssrContext.url;
  const router = vueRouter_cjs.createRouter(__spreadProps(__spreadValues({}, routerOptions), {
    history: routerHistory,
    routes
  }));
  nuxtApp.vueApp.use(router);
  const previousRoute = vue_cjs_prod.shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const route = {};
  for (const key in router.currentRoute.value) {
    route[key] = vue_cjs_prod.computed(() => router.currentRoute.value[key]);
  }
  const _activeRoute = vue_cjs_prod.shallowRef(router.resolve(initialURL));
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
    activeRoute[key] = vue_cjs_prod.computed(() => _activeRoute.value[key]);
  }
  nuxtApp._route = vue_cjs_prod.reactive(route);
  nuxtApp._activeRoute = vue_cjs_prod.reactive(activeRoute);
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
    to.meta = vue_cjs_prod.reactive(to.meta);
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
const scroll_3e337f8e = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.$router.options.scrollBehavior = () => {
    return { left: 0, top: 0, behavior: "auto" };
  };
});
const _plugins = [
  preload,
  componentsPlugin_4b45847d,
  vueuseHead_63c2c03b,
  _6c3e4e2f,
  _3c168e16,
  butterCMS_159cd5cb,
  scroll_3e337f8e
];
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
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-011aae6d><div class="fixed left-0 right-0 spotlight z-10" data-v-011aae6d></div><div class="max-w-520px text-center z-20" data-v-011aae6d><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-011aae6d>${serverRenderer.exports.ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-011aae6d>${serverRenderer.exports.ssrInterpolate(__props.description)}</p><div class="w-full flex items-center justify-center" data-v-011aae6d>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "gradient-border text-md sm:text-xl py-2 px-4 sm:py-3 sm:px-6 cursor-pointer"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${serverRenderer.exports.ssrInterpolate(__props.backHome)}`);
          } else {
            return [
              vue_cjs_prod.createTextVNode(vue_cjs_prod.toDisplayString(__props.backHome), 1)
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-404.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const Error404 = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-011aae6d"]]);
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
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "font-sans antialiased bg-white dark:bg-black text-black dark:text-white grid min-h-screen place-content-center overflow-hidden" }, _attrs))} data-v-6aee6495><div class="fixed -bottom-1/2 left-0 right-0 h-1/2 spotlight" data-v-6aee6495></div><div class="max-w-520px text-center" data-v-6aee6495><h1 class="text-8xl sm:text-10xl font-medium mb-8" data-v-6aee6495>${serverRenderer.exports.ssrInterpolate(__props.statusCode)}</h1><p class="text-xl px-8 sm:px-0 sm:text-4xl font-light mb-16 leading-tight" data-v-6aee6495>${serverRenderer.exports.ssrInterpolate(__props.description)}</p></div></div>`);
    };
  }
};
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/@nuxt/ui-templates/dist/templates/error-500.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const Error500 = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-6aee6495"]]);
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
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(ErrorTemplate), vue_cjs_prod.mergeProps({ statusCode: vue_cjs_prod.unref(statusCode), statusMessage: vue_cjs_prod.unref(statusMessage), description: vue_cjs_prod.unref(description), stack: vue_cjs_prod.unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    vue_cjs_prod.onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        callWithNuxt(nuxtApp, throwError, [err]);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_App = vue_cjs_prod.resolveComponent("App");
      serverRenderer.exports.ssrRenderSuspense(_push, {
        default: () => {
          if (vue_cjs_prod.unref(error)) {
            _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$l), { error: vue_cjs_prod.unref(error) }, null, _parent));
          } else {
            _push(serverRenderer.exports.ssrRenderComponent(_component_App, null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const layouts = {
  default: vue_cjs_prod.defineAsyncComponent(() => Promise.resolve().then(function() {
    return _default;
  }))
};
const defaultLayoutTransition = { name: "layout", mode: "out-in" };
const __nuxt_component_0 = vue_cjs_prod.defineComponent({
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
      const layout = (_b = (_a = vue_cjs_prod.isRef(props.name) ? props.name.value : props.name) != null ? _a : route.meta.layout) != null ? _b : "default";
      const hasLayout = layout && layout in layouts;
      return _wrapIf(vue_cjs_prod.Transition, hasLayout && ((_c = route.meta.layoutTransition) != null ? _c : defaultLayoutTransition), _wrapIf(layouts[layout], hasLayout, context.slots)).default();
    };
  }
});
const _sfc_main$j = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
  _push(serverRenderer.exports.ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          vue_cjs_prod.createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const vueApp = vue_cjs_prod.createApp(_sfc_main$k);
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
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
    class: "header",
    id: "hero-top"
  }, _attrs))} data-v-13c46378><section data-v-13c46378><h1 data-v-13c46378>ABOUT US</h1><p data-v-13c46378>Sparkling 92.3 fm is a radio station in the heart of Calabar, Cross River state, Nigeria. It was launched in 2018 to capture the thought, heart and mood of a diverse audience through our broad based but specific programming and music playlist. Our shows present you, the listener, with a full treat of what is happening in the news from our local scene to the international stage while we also have a good dose of politics, sports and business contents to pick from and it is very engaging and interactive. Your day has never been better. Our music is second to one because we play the latest afrobeats tunes, down to the old but gold Nigerian songs of the sixties, seventies, eighties and nineties. We never miss the trend when it comes to music and promoting the craft. You can always trust us to provide affordable advert rates to meet your advertising needs. You can check out our programmes and presenters.</p></section><div class="d-flex justify-content-center" id="link" data-v-13c46378>`);
  _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, { to: "/Program" }, {
    default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Check our Programmes`);
      } else {
        return [
          vue_cjs_prod.createTextVNode("Check our Programmes")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="download" data-v-13c46378><a href="../assets/files/advert.pdf" download="Advert" data-v-13c46378>Download our Adverts Rate</a></div></div></div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "header" }, _attrs))} data-v-0d66a924><section data-v-0d66a924><div data-v-0d66a924><h2 data-v-0d66a924>Contact Sparkling FM</h2><div data-v-0d66a924><h4 data-v-0d66a924><b data-v-0d66a924>Address:</b></h4><p data-v-0d66a924> Sparkling Towers, Lemna Ikot Effangha Calabar, Cross River state, Nigeria </p></div><div data-v-0d66a924><h4 data-v-0d66a924><b data-v-0d66a924>Email:</b></h4><p data-v-0d66a924>sparkling923fm@gmail.com</p></div></div><div data-v-0d66a924><h2 data-v-0d66a924>For Marketing Enquiries</h2><section data-v-0d66a924><div data-v-0d66a924><h5 data-v-0d66a924>Joshua Moses</h5><p data-v-0d66a924>General Manager</p><p data-v-0d66a924>Joshuamose89@gmail.com</p><p data-v-0d66a924>07032404903</p></div><div data-v-0d66a924><h5 data-v-0d66a924>Peace Nsemo</h5><p data-v-0d66a924>Marketing Manager</p><p data-v-0d66a924>nsemopeace@gmail.com</p><p data-v-0d66a924>08035505348</p></div></section></div></section><div class="download" data-v-0d66a924><a href="../assets/files/advert.pdf" download="Advert" data-v-0d66a924>Advertisments? Click here -&gt;</a></div></div>`);
}
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "header" }, _attrs))} data-v-47c451fa><div class="header" data-v-47c451fa><div data-v-47c451fa><div class="heading" id="hero-top" data-v-47c451fa><h1 class="text-center" style="${serverRenderer.exports.ssrRenderStyle({ "font": "size 2.5rem" })}" data-v-47c451fa>OAPs</h1></div><section class="flexbox" data-v-47c451fa><div class="card" id="sell-crypto" data-v-47c451fa><a href="https://ibb.co/MVvvdjG" data-v-47c451fa><img src="https://i.ibb.co/QNgg0qC/Whats-App-Image-2022-08-11-at-18-13-57.jpg" width="100%" alt="Whats-App-Image-2022-08-11-at-18-13-57" border="0" data-v-47c451fa></a><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Cinie Williams Ojeka</b></h4><p data-v-47c451fa>He&#39;s a dynamic presenter that speaks multiple Nigerian language. He is the host of The Sparkling Morning Show and Sports Cruise. </p></div></div><div class="card" id="borrow-crypto" data-v-47c451fa><img src="https://i.ibb.co/9VsQ2Lq/IMG-20220802-WA0000.jpg" width="100%" alt="IMG-20220802-WA0000" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Gloria Umoh</b></h4><p data-v-47c451fa>She is the host of our flagship Efik show Mkpon Editi. She is also a great reporter that has passion for stories empowering women to aspire to leadership position.</p></div></div><div class="card" id="sell-crypto" data-v-47c451fa><img src="https://i.ibb.co/LvVbWY9/Whats-App-Image-2022-08-11-at-18-13-58-1.jpg" width="100%" alt="Whats-App-Image-2022-08-11-at-18-13-58-1" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Essien Okon Essien</b></h4><p data-v-47c451fa>Essien is a cornerstone of our Efik show Mkpo Editi. He is concerned about promoting the Efik culture and he is a community leader.</p></div></div><div class="card socials" data-v-47c451fa><img src="https://i.ibb.co/kQTXp4C/JPEG-image-117-2.jpg" width="100%" alt="JPEG-image-117-2" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Miracle George</b></h4><p data-v-47c451fa>Popularly referred to a &quot;George Talent&quot;. He is the host of our flagship pidgin belt &quot;kpon kpo do&quot;. He also hosts the &quot;Saturday Morning Show&quot;. <br data-v-47c451fa> George is a comedian and events host.</p></div></div><div class="card" id="sell-crypto" data-v-47c451fa><img src="https://i.ibb.co/zx1w9w1/Screenshot-20220806-133652-Facebook-2-1.jpg" width="100%" alt="Screenshot-20220806-133652-Facebook-2-1" border="0" data-v-47c451fa><div class="container" data-v-47c451fa><h4 data-v-47c451fa><b data-v-47c451fa>Ukamaka Richards</b></h4><p data-v-47c451fa>Co-Host of the Sparkling Morning Show.Lead Anchor of the flagship program on the station \u201CLET\u2019S TALK NIGERIA\u2019\u2019 a daily 60 minutes audience participatory program dedicated to engaging with policy makers and analyzing topical issues affecting the Nigerian state at various levels with an aim to effect change. News Anchor on World news @7am on weekdays &amp; Sundays @7am &amp; @12noon.Anchor of the station&#39;s rural based health programme which airs every Saturdays by 10am. Host, Church On Radio \u{1F4FB}</p></div></div></section></div></div></div>`);
}
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const openTab = vue_cjs_prod.ref(1);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "header" }, _attrs))} data-v-129554f0><div class="flex items-center justify-center lg:my-20 lg:mx-20" data-v-129554f0><div class="w-full" data-v-129554f0><ul class="flex mb-0 list-none space-y-2 justify-between" id="tab-btn" data-v-129554f0><div class="d-flex flex-row space-x-1 justify-center" data-v-129554f0><li class="flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 1, "active-tab": openTab.value === 1 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Mondays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 2, "active-tab": openTab.value === 2 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Tuesdays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 3, "active-tab": openTab.value === 3 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Wednesday </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 4, "active-tab": openTab.value === 4 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Thursday </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 5, "active-tab": openTab.value === 5 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Fridays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 6, "active-tab": openTab.value === 6 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Saturdays </a></li><li class="last:mr-0 flex-auto text-center" data-v-129554f0><a class="${serverRenderer.exports.ssrRenderClass([{ "inactivetab": openTab.value !== 7, "active-tab": openTab.value === 7 }, "text-xs font-extrabold px-5 py-3 shadow-lg rounded block leading-normal"])}" data-v-129554f0> Sundays </a></li></div></ul><div class="tab-content tab-space w-full table" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 1, "active": openTab.value === 1 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0> News Update<br data-v-129554f0><b data-v-129554f0>The Mid-Morning Show</b><br data-v-129554f0> Headline<br data-v-129554f0> News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Business show<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World <br data-v-129554f0> Efik Show<br data-v-129554f0> Talk Your Own(BBC)<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> The Night Zone<br data-v-129554f0> Real life tales<br data-v-129554f0> Good night kisses<br data-v-129554f0></td></tr></table></div><div data-v-129554f0><div class="tab-content tab-space w-full" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 2, "active": openTab.value === 2 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0><b data-v-129554f0>News Update</b> <br data-v-129554f0> The Mid-Morning Show<br data-v-129554f0> Headline News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Interpret d law<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World <br data-v-129554f0> Efik Show<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> Double Dose<br data-v-129554f0> Family Table<br data-v-129554f0> Good night kisses<br data-v-129554f0></td></tr></table></div></div><div data-v-129554f0><div class="tab-content tab-space w-full" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 3, "active": openTab.value === 3 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0> News Update<br data-v-129554f0><b data-v-129554f0>Musical Wednesday</b><br data-v-129554f0> Headline<br data-v-129554f0> News<br data-v-129554f0><b data-v-129554f0>COVID 19 TALKS</b><br data-v-129554f0> The Newsroom<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Musical Wednesday</b><br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News<br data-v-129554f0> Sound Box<br data-v-129554f0> Musical Wednesday<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> Musical Wednesday </td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 4, "active": openTab.value === 4 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0><b data-v-129554f0>News Update</b> <br data-v-129554f0> The Mid-Morning Show<br data-v-129554f0> Headline News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Interpret d law<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News<br data-v-129554f0> Efik Show<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> Nostalgia <br data-v-129554f0> Dating gist<br data-v-129554f0> Hook up show<br data-v-129554f0> Good night kisses<br data-v-129554f0></td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 5, "active": openTab.value === 5 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><th data-v-129554f0>5am - 10 am</th><th data-v-129554f0><b data-v-129554f0>THE SPARKLING MORNING SHOW</b> <br data-v-129554f0> MUSIC/MOTIVATION<br data-v-129554f0> Area Talk<br data-v-129554f0> World News<br data-v-129554f0> Sports Trail<br data-v-129554f0> Newspaper Review<br data-v-129554f0> Sparkling Business 360<br data-v-129554f0> Let\u2019s Talk NIGERIA<br data-v-129554f0></th></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>10am -2pm</td><td data-v-129554f0><b data-v-129554f0>News Update</b> <br data-v-129554f0> The Mid-Morning Show<br data-v-129554f0> Headline News<br data-v-129554f0> The Newsroom<br data-v-129554f0> Lunch time oldies<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>3</td><td data-v-129554f0>2pm-5pm</td><td data-v-129554f0><b data-v-129554f0>Pidgin Belt</b><br data-v-129554f0> Kponkporo<br data-v-129554f0> My Domot<br data-v-129554f0> Transcorps 360<br data-v-129554f0> Football Tori<br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News<br data-v-129554f0> Eckankar half hour<br data-v-129554f0> Upper Room Half hour </td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>9pm -12am</td><td data-v-129554f0> MUSIC </td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 6, "active": openTab.value === 6 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><td data-v-129554f0>5am - 12pm</td><td data-v-129554f0><b data-v-129554f0>THE SATURDAY EXPERIENCE</b> <br data-v-129554f0> Good morning Calabar <br data-v-129554f0> World News <br data-v-129554f0> Paper Review <br data-v-129554f0> CR Times <br data-v-129554f0> Banter Show <br data-v-129554f0> Health Show <br data-v-129554f0> Yala Show <br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>12pm - 5pm</td><td data-v-129554f0> News in Retrospect <br data-v-129554f0><b data-v-129554f0>Sports Cruise</b></td></tr><tr data-v-129554f0><td data-v-129554f0> 3 </td><td data-v-129554f0>5pm - 6pm</td><td data-v-129554f0> Music </td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News <br data-v-129554f0><b data-v-129554f0>Dunamis</b></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>Music</td><td data-v-129554f0>Music</td></tr></table></div></div><div class="tab-content tab-space w-full" data-v-129554f0><div class="${serverRenderer.exports.ssrRenderClass({ " inactive": openTab.value !== 7, "active": openTab.value === 7 })}" data-v-129554f0><table data-v-129554f0><tr data-v-129554f0><th data-v-129554f0>#</th><th data-v-129554f0>Time</th><th data-v-129554f0>Programmes</th></tr><tr data-v-129554f0><td data-v-129554f0>1</td><td data-v-129554f0>5am - 12pm</td><td data-v-129554f0><b data-v-129554f0>CHURCH ON RADIO</b> <br data-v-129554f0> MUSIC <br data-v-129554f0> World News <br data-v-129554f0> Prayer Time <br data-v-129554f0> Gospel Chit Chat <br data-v-129554f0> Praise Jam <br data-v-129554f0> Sparkling mail <br data-v-129554f0> Country music </td></tr><tr data-v-129554f0><td data-v-129554f0>2</td><td data-v-129554f0>12pm - 5pm</td><td data-v-129554f0> World News <br data-v-129554f0><b data-v-129554f0>Sunday Afternoon Experience</b> <br data-v-129554f0> Efik Show </td></tr><tr data-v-129554f0><td data-v-129554f0> 3 </td><td data-v-129554f0>6pm - 8pm</td><td data-v-129554f0> World News <br data-v-129554f0> Sparkling Request show <br data-v-129554f0> Upper Room <br data-v-129554f0></td></tr><tr data-v-129554f0><td data-v-129554f0>4</td><td data-v-129554f0>8pm - 12pm</td><td data-v-129554f0> Music <br data-v-129554f0><b data-v-129554f0>Upper Room HALF HOUR</b></td></tr><tr data-v-129554f0><td data-v-129554f0>5</td><td data-v-129554f0>Music</td><td data-v-129554f0>Music</td></tr></table></div></div></div></div></div></div></div><div class="download" data-v-129554f0><a href="../assets/files/advert.pdf" download="Advert" data-v-129554f0>Download our Adverts Rate</a></div></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
  _push(`<div${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "header" }, _attrs))} data-v-0156eaf8><h1 class="text-center" data-v-0156eaf8>No shows yet!</h1></div>`);
}
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const heading = vue_cjs_prod.inject("heading");
    const headerText = vue_cjs_prod.inject("headerText");
    const route = useRoute();
    const { $butterCMS } = useNuxtApp();
    const { data, refresh } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(async () => useAsyncData("article", async () => {
      const slug = route.params.post;
      const response = await $butterCMS.post.retrieve(slug);
      const article = response.data.data;
      heading.value = headerText.value = article.title;
      return { article };
    })), __temp = await __temp, __restore(), __temp);
    vue_cjs_prod.onMounted(refresh);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_seo = _sfc_main$y;
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(SingleArticle), {
        article: vue_cjs_prod.unref(data).article
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_component_seo, {
        title: vue_cjs_prod.unref(data).article.title,
        description: vue_cjs_prod.unref(data).article.meta_description,
        image: vue_cjs_prod.unref(data).article.featured_image
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    vue_cjs_prod.inject("heading");
    const seoTitle = vue_cjs_prod.inject("seoTitle");
    const headerText = vue_cjs_prod.inject("headerText");
    const { data, refresh } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(async () => useAsyncData("tag", async () => {
      const filter = { category_slug: slug };
      const response = await ($butterCMS == null ? void 0 : $butterCMS.post.list(filter));
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    vue_cjs_prod.onMounted(refresh);
    getBlogCategory(slug).then((category) => {
      headerText.value = "Category: " + category.name;
      seoTitle.value = "category: " + category.name;
    }).catch((e) => setError(e));
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(BlogPostsList), vue_cjs_prod.mergeProps({
        "blog-posts": vue_cjs_prod.unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const heading = vue_cjs_prod.inject("heading");
    const headerText = vue_cjs_prod.inject("headerText");
    heading.value = headerText.value = "All News";
    const { $butterCMS } = useNuxtApp();
    const { data, refresh } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(async () => useAsyncData("tag", async () => {
      const response = await ($butterCMS == null ? void 0 : $butterCMS.post.list({}));
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    vue_cjs_prod.onMounted(refresh);
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(BlogPostsList), vue_cjs_prod.mergeProps({
        "blog-posts": vue_cjs_prod.unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const heading = vue_cjs_prod.inject("heading");
    const seoTitle = vue_cjs_prod.inject("seoTitle");
    const headerText = vue_cjs_prod.inject("headerText");
    const filter = String(route.query["q"]);
    seoTitle.value = `search results for ${filter}`;
    heading.value = "Search Results";
    headerText.value = "Search: " + filter;
    const { data } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(async () => useAsyncData("search", async () => {
      const response = await butterCMS.post.search(filter);
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(BlogPostsList), vue_cjs_prod.mergeProps({
        "blog-posts": vue_cjs_prod.unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const heading = vue_cjs_prod.inject("heading");
    const seoTitle = vue_cjs_prod.inject("seoTitle");
    const headerText = vue_cjs_prod.inject("headerText");
    const { data, refresh } = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(async () => useAsyncData("tag", async () => {
      const filter = { tag_slug: slug };
      const response = await ($butterCMS == null ? void 0 : $butterCMS.post.list(filter));
      return {
        posts: response.data.data
      };
    })), __temp = await __temp, __restore(), __temp);
    vue_cjs_prod.onMounted(refresh);
    try {
      const tag = ([__temp, __restore] = vue_cjs_prod.withAsyncContext(() => getBlogTag(slug)), __temp = await __temp, __restore(), __temp);
      heading.value = tag.name;
      headerText.value = "Tag: " + tag.name;
      seoTitle.value = "tag: " + tag.name;
    } catch (e) {
      setError(e);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(BlogPostsList), vue_cjs_prod.mergeProps({
        "blog-posts": vue_cjs_prod.unref(data).posts
      }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
    const route = vueRouter_cjs.useRoute();
    const headerText = vue_cjs_prod.ref("");
    const heading = vue_cjs_prod.ref("");
    const headerLinks = vue_cjs_prod.ref(basicBlogLinks);
    const seoTitle = vue_cjs_prod.ref("");
    vue_cjs_prod.provide("heading", heading);
    vue_cjs_prod.provide("headerText", headerText);
    vue_cjs_prod.provide("headerLinks", headerLinks);
    vue_cjs_prod.provide("seoTitle", seoTitle);
    const isMainBlogPage = vue_cjs_prod.computed(() => Object.keys(route.params).length === 0 && Object.keys(route.query).length === 0);
    const resolveBlogLinks = () => {
      if (isMainBlogPage.value) {
        headerLinks.value = [basicBlogLinks[0]];
        seoTitle.value = `All Posts`;
      } else
        headerLinks.value = basicBlogLinks;
    };
    vue_cjs_prod.watch(route, resolveBlogLinks);
    resolveBlogLinks();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = vue_cjs_prod.resolveComponent("NuxtPage");
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}>`);
      _push(serverRenderer.exports.ssrRenderComponent(BlogHeader, {
        heading: heading.value,
        links: headerLinks.value,
        text: headerText.value
      }, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$w), null, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(serverRenderer.exports.ssrRenderComponent(_component_NuxtPage, {
              params: vue_cjs_prod.unref(route).params
            }, null, _parent2, _scopeId));
          } else {
            return [
              vue_cjs_prod.createVNode(_component_NuxtPage, {
                params: vue_cjs_prod.unref(route).params
              }, null, 8, ["params"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(_sfc_main$y, {
        title: `SparklingFm - ${seoTitle.value}`,
        description: `A Radio station at the heart of Calabar, showing ${seoTitle.value}`
      }, null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(HomeView), _attrs, null, _parent));
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
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
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(HomeView), {
        slug: vue_cjs_prod.unref(route).params.slug
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/landing-page/[slug].vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main$6
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main$5 = {
  name: "Header",
  __ssrInlineRender: true,
  props: ["menuItems", "activeLink"],
  setup(__props) {
    const isSticky = vue_cjs_prod.ref(true);
    const isTogglerActive = vue_cjs_prod.ref(false);
    const headerNavbar = vue_cjs_prod.ref(null);
    const onScroll = () => {
      if (headerNavbar.value) {
        const sticky = headerNavbar.value.offsetTop;
        isSticky.value = window.scrollY > sticky;
      }
    };
    vue_cjs_prod.onMounted(() => {
      onScroll();
      window.document.addEventListener("scroll", onScroll, { passive: true });
      return () => window.document.removeEventListener("scroll", onScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<header${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "header" }, _attrs))} data-v-78d7123e><div class="${serverRenderer.exports.ssrRenderClass([{ sticky: isSticky.value }, "navbar-area"])}" data-v-78d7123e><div class="container" data-v-78d7123e><div class="row align-items-center" data-v-78d7123e><div class="col-lg-12" data-v-78d7123e><nav class="navbar navbar-expand-lg" data-v-78d7123e><a class="navbar-brand" href="/" data-v-78d7123e><img src="https://i.ibb.co/QrC7C7b/logo.png" alt="" class="img-fluid" data-v-78d7123e></a><button class="${serverRenderer.exports.ssrRenderClass([{ active: isTogglerActive.value }, "navbar-toggler"])}" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" data-v-78d7123e><span class="toggler-icon" data-v-78d7123e></span><span class="toggler-icon" data-v-78d7123e></span><span class="toggler-icon" data-v-78d7123e></span></button><div class="${serverRenderer.exports.ssrRenderClass([{ show: isTogglerActive.value }, "collapse navbar-collapse sub-menu-bar"])}" id="navbarSupportedContent" data-v-78d7123e><div class="ms-auto" data-v-78d7123e><ul id="nav" class="navbar-nav ms-auto" data-v-78d7123e><li data-v-78d7123e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/",
        class: "nuxt-link-exact-active"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Home`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        tag: "li",
        to: "/About",
        class: "nuxt-link-exact-active"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`About`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("About")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        tag: "li",
        to: "/Oap",
        class: "nuxt-link-exact-active"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`OAPs`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("OAPs")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/blog/",
        class: "nuxt-link-exact-active"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`News`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("News")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li tag="li" data-v-78d7123e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/Program",
        class: "nuxt-link-exact-active"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Programmes`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("Programmes")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li data-v-78d7123e>`);
      _push(serverRenderer.exports.ssrRenderComponent(_component_nuxt_link, {
        to: "/Contact",
        class: "nuxt-link-exact-active"
      }, {
        default: vue_cjs_prod.withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact`);
          } else {
            return [
              vue_cjs_prod.createTextVNode("Contact")
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
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Header.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-78d7123e"]]);
const _sfc_main$4 = {
  name: "Footer",
  __ssrInlineRender: true,
  props: ["menuItems", "activeLink"],
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({ class: "footer pt-120 absolute bottom-0" }, _attrs))} data-v-58f1df96><div class="container" data-v-58f1df96><div class="row" data-v-58f1df96><div class="col-xl-3 col-lg-4 col-md-6 col-sm-10" data-v-58f1df96><div class="footer-widget" data-v-58f1df96><div class="logo" data-v-58f1df96><a href="#" data-v-58f1df96><img src="https://i.ibb.co/QrC7C7b/logo.png" width="130px" alt="logo" border="0" data-v-58f1df96></a></div><p class="desc" data-v-58f1df96> Your radio,your shine! </p><ul class="social-links" data-v-58f1df96><li data-v-58f1df96><a href="https://m.facebook.com/sparkling92.3fm" data-v-58f1df96><i class="lni lni-facebook" data-v-58f1df96></i></a></li><li data-v-58f1df96><a href="#0" data-v-58f1df96><i class="lni lni-instagram" data-v-58f1df96></i></a></li><li data-v-58f1df96><a href="#0" data-v-58f1df96><i class="lni lni-twitter" data-v-58f1df96></i></a></li></ul></div></div><div class="col-xl-5 col-lg-4 col-md-12 col-sm-12 offset-xl-1 contact" data-v-58f1df96><div class="footer-widget text-center" data-v-58f1df96><h2 data-v-58f1df96>Contact Us</h2><ul class="links" data-v-58f1df96><li data-v-58f1df96><b data-v-58f1df96>Address:</b>Sparkling Towers Royal Farm Estate Water intake road off Lemma road Ikot Effanga, Calabar,Nigeria </li><li data-v-58f1df96><b data-v-58f1df96>Email:</b>Sparkling923fm@gmail.com</li><div data-v-58f1df96><li data-v-58f1df96><b data-v-58f1df96>Telephone: </b>07037404903</li></div><li class="butter-logo" data-v-58f1df96><a href="https://buttercms.com" data-v-58f1df96><a href="https://buttercms.com/" data-v-58f1df96><img src="https://i.ibb.co/GTmKBYX/butter-b.png" width="200px" alt="butter-b" border="0" data-v-58f1df96></a></a></li></ul></div></div><div class="col-xl-3 col-lg-4 col-md-6" data-v-58f1df96><div class="footer-widget" data-v-58f1df96><h3 data-v-58f1df96>Subscribe Newsletter</h3><form action="#" data-v-58f1df96><input type="email" placeholder="Email" data-v-58f1df96><button class="main-btn btn-hover" data-v-58f1df96>Subscribe</button></form></div></div></div></div><div class="copyright" data-v-58f1df96><p class="text-center" data-v-58f1df96>\xA9 Copyright 2022 - SPARKLING FM CALABAR</p> <p class="slash" data-v-58f1df96>| </p><p data-v-58f1df96>Powered by <a href="#0" style="${serverRenderer.exports.ssrRenderStyle({ "color": "orange" })}" data-v-58f1df96>1DEV</a></p></div></footer>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Footer.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-58f1df96"]]);
const _sfc_main$3 = {
  name: "ScrollToTop",
  __ssrInlineRender: true,
  setup(__props) {
    const isVisible = vue_cjs_prod.ref(false);
    vue_cjs_prod.onMounted(() => {
      const onScroll = (event) => {
        isVisible.value = document.body.scrollTop > 50 || document.documentElement.scrollTop > 50;
      };
      window.document.addEventListener("scroll", onScroll, { passive: true });
      return () => window.document.removeEventListener("scroll", onScroll);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<a${serverRenderer.exports.ssrRenderAttrs(vue_cjs_prod.mergeProps({
        href: "#",
        class: ["scroll-top btn-hover d-flex", { "d-none": !isVisible.value }]
      }, _attrs))}><i class="lni lni-chevron-up"></i></a>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ScrollToTop.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main = {
  name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const activeLink = vue_cjs_prod.ref("");
    const route = vueRouter_cjs.useRoute();
    const { items, loading } = useMenuItems();
    useApiError();
    const config = useRuntimeConfig();
    !!config.API_KEY;
    vue_cjs_prod.onMounted(() => {
      window.addEventListener("load", scrollToSection);
      window.document.addEventListener("scroll", onScroll, { passive: true });
    });
    vue_cjs_prod.onUnmounted(() => {
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
      await vue_cjs_prod.nextTick();
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
    vue_cjs_prod.provide("layout", {
      handleMounted
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${serverRenderer.exports.ssrRenderAttrs(_attrs)}><div>`);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Header), {
        "menu-items": vue_cjs_prod.unref(items),
        "active-link": activeLink.value
      }, null, _parent));
      serverRenderer.exports.ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(_sfc_main$3), null, null, _parent));
      _push(serverRenderer.exports.ssrRenderComponent(vue_cjs_prod.unref(Footer), {
        "menu-items": vue_cjs_prod.unref(items),
        "active-link": activeLink.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue_cjs_prod.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  "default": _sfc_main
}, Symbol.toStringTag, { value: "Module" }));

export { entry$1 as default };
//# sourceMappingURL=server.mjs.map
