/* =========================================================
 * tb.api.v1.tb.js  (TB Group API Library)
 * - Group: TB_ (lodging + auth/searches/wishlist)
 * - Lodging base: {URI}/api/v1/lodging (legacy: {URI}/api/lodging)
 * - Features base: {URI}/api/v1
 * ========================================================= */
(function (w) {
  "use strict";
  if (!w.$) throw new Error("jQuery($) not found.");

  const API = (w.API = w.API || {});
  API.V1 = API.V1 || {};

  const LS_KEY_URI = "api.v1.uri";
  const defaultOrigin = (w.location && w.location.origin) ? w.location.origin : "";
  API.V1.URI =
    (w.API_V1_URI && String(w.API_V1_URI).trim()) ||
    (w.localStorage && w.localStorage.getItem(LS_KEY_URI)) ||
    defaultOrigin;

  API.V1.setURI = API.V1.setURI || ((uri) => {
    API.V1.URI = String(uri || "").replace(/\/+$|\s+/g, "");
    try { w.localStorage && w.localStorage.setItem(LS_KEY_URI, API.V1.URI); } catch (_) {}
    return API.V1.URI;
  });

  const qs = (q) => {
    if (!q) return "";
    const parts = [];
    Object.keys(q).forEach((k) => {
      const v = q[k];
      if (v === undefined || v === null || v === "") return;
      parts.push(encodeURIComponent(k) + "=" + encodeURIComponent(String(v)));
    });
    return parts.length ? ("?" + parts.join("&")) : "";
  };

  const applyParams = (path, params) => {
    let out = path;
    const p = params || {};
    Object.keys(p).forEach((k) => {
      out = out.replace(new RegExp(":" + k + "\\b", "g"), encodeURIComponent(String(p[k])));
    });
    return out;
  };

  API.V1.request = API.V1.request || (({ method, url, data, headers }) =>
    $.ajax({
      method,
      url,
      data: data ? JSON.stringify(data) : undefined,
      contentType: data ? "application/json" : undefined,
      dataType: "json",
      headers: headers || {},
      })
  );

  const TB = (API.V1.TB = API.V1.TB || {});
  TB.BASE = API.V1.URI.replace(/\/+$|\s+/g, "") + "/api/v1";
  TB.LODGING_BASE_MODE = TB.LODGING_BASE_MODE || "v1";
  TB.getLodgingBase = () => {
    const uri = API.V1.URI.replace(/\/+$|\s+/g, "");
    return (TB.LODGING_BASE_MODE === "legacy") ? (uri + "/api/lodging") : (uri + "/api/v1/lodging");
  };
  TB.setLodgingBaseMode = (mode) => {
    TB.LODGING_BASE_MODE = (String(mode || "v1").toLowerCase() === "legacy") ? "legacy" : "v1";
    return TB.LODGING_BASE_MODE;
  };

  TB.API = {
    AUTH_CHECK_ID: "/auth/check-login-id",
    AUTH_SIGNUP: "/auth/signup",
    AUTH_LOGIN: "/auth/login",
    WISHLIST_TOGGLE: "/wishlist/toggle",
    WISHLIST_LIST: "/wishlist",
    SEARCHES_CREATE: "/searches",
    SEARCHES_LIST: "/searches",
    LOD_PROPERTIES: "/properties",
    LOD_CITIES: "/cities",
    LOD_DISTRICTS: "/districts",
    LOD_CITY_COUNTS: "/city-counts",
    LOD_PROPERTY: "/properties/:propertyId",
    LOD_RATING_SUMMARY: "/properties/:propertyId/rating-summary",
    LOD_ROOMS: "/properties/:propertyId/rooms",
    LOD_REVIEWS: "/properties/:propertyId/reviews",
    LOD_PAYLOAD: "/payload",
  }

  // ---------------------------------------------------------
  // TB API SPEC (method + path + params)
  // - Lodging base: /api/v1/lodging  (legacy: /api/lodging)
  // - Features base: /api/v1 (auth, wishlist, searches)
  // ---------------------------------------------------------
  TB.SPEC = [
    // TB Auth (base: /api/v1)
    { group: "TB", id: "TB-AUTH-1", method: "GET",  path: "/auth/check-login-id", query: ["loginId"], body: [] },
    { group: "TB", id: "TB-AUTH-2", method: "POST", path: "/auth/signup",         query: [], body: ["loginId","password","displayName","email?"] },
    { group: "TB", id: "TB-AUTH-3", method: "POST", path: "/auth/login",          query: [], body: ["loginId","password"] },

    // Wishlist (base: /api/v1)
    { group: "TB", id: "TB-WISH-1", method: "POST", path: "/wishlist/toggle", query: [], body: ["memberId","propertyId"] },
    { group: "TB", id: "TB-WISH-2", method: "GET",  path: "/wishlist",        query: ["memberId","page","pageSize"], body: [] },

    // Search log (base: /api/v1)
    { group: "TB", id: "TB-SEA-1",  method: "POST", path: "/searches", query: [], body: ["memberId?","keyword","city?"] },
    { group: "TB", id: "TB-SEA-2",  method: "GET",  path: "/searches", query: ["memberId?","keyword?","page","pageSize"], body: [] },

    // Lodging (base: /api/v1/lodging)
    { group: "TB", id: "TB-LOD-1", method: "GET", path: "/lodging/properties",
      query: ["city?","district?","q?","minPrice?","maxPrice?","amenities?","hasPool?","hasWifi?","hasParking?","hasBbq?","hasPets?","hasBreakfast?","sort?","order?","limit?","offset?","page?","pageSize?"],
      body: []
    },
    { group: "TB", id: "TB-LOD-2", method: "GET", path: "/lodging/cities", body: [], query: [] },
    { group: "TB", id: "TB-LOD-3", method: "GET", path: "/lodging/districts", query: ["city"], body: [] },
    { group: "TB", id: "TB-LOD-4", method: "GET", path: "/lodging/city-counts", query: [], body: [] },
    { group: "TB", id: "TB-LOD-5", method: "GET", path: "/lodging/properties/:propertyId", query: [], body: [] },
    { group: "TB", id: "TB-LOD-6", method: "GET", path: "/lodging/properties/:propertyId/rating-summary", query: [], body: [] },
    { group: "TB", id: "TB-LOD-7", method: "GET", path: "/lodging/properties/:propertyId/rooms", query: [], body: [] },
    { group: "TB", id: "TB-LOD-8", method: "GET", path: "/lodging/properties/:propertyId/reviews", query: ["limit?","offset?"], body: [] },
    { group: "TB", id: "TB-LOD-9", method: "GET", path: "/lodging/payload", query: ["city?"], body: [] },
  ];
;

  TB.url = (apiPath, params, query) => TB.BASE + applyParams(apiPath, params) + qs(query);
  TB.lodgingUrl = (apiPath, params, query) => TB.getLodgingBase() + applyParams(apiPath, params) + qs(query);

  TB.Auth = {
    checkLoginId: (q) => API.V1.request({ method: "GET", url: TB.url(TB.API.AUTH_CHECK_ID, null, q) }),
    signup: (body) => API.V1.request({ method: "POST", url: TB.url(TB.API.AUTH_SIGNUP), data: body }),
    login: (body) => API.V1.request({ method: "POST", url: TB.url(TB.API.AUTH_LOGIN), data: body }),
  };

  TB.Wishlist = {
    toggle: (body) => API.V1.request({ method: "POST", url: TB.url(TB.API.WISHLIST_TOGGLE), data: body }),
    list: (q) => API.V1.request({ method: "GET", url: TB.url(TB.API.WISHLIST_LIST, null, q) }),
  };

  TB.Searches = {
    create: (body) => API.V1.request({ method: "POST", url: TB.url(TB.API.SEARCHES_CREATE), data: body }),
    list: (q) => API.V1.request({ method: "GET", url: TB.url(TB.API.SEARCHES_LIST, null, q) }),
  };

  TB.Lodging = {
    properties: (q) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_PROPERTIES, null, q) }),
    cities: () => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_CITIES) }),
    districts: (q) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_DISTRICTS, null, q) }),
    cityCounts: () => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_CITY_COUNTS) }),
    property: (propertyId) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_PROPERTY, { propertyId }) }),
    ratingSummary: (propertyId) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_RATING_SUMMARY, { propertyId }) }),
    rooms: (propertyId) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_ROOMS, { propertyId }) }),
    reviews: (propertyId, q) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_REVIEWS, { propertyId }, q) }),
    payload: (q) => API.V1.request({ method: "GET", url: TB.lodgingUrl(TB.API.LOD_PAYLOAD, null, q) }),
  };

  TB.Examples = {
    async authFlow({ loginId = "tb_test11", password = "1234", displayName = "TB테스트" } = {}) {
      const check = await TB.Auth.checkLoginId({ loginId });
      if (!check?.exists) await TB.Auth.signup({ loginId, password, displayName });
      return TB.Auth.login({ loginId, password });
    },
    async lodgingChain() {
      const list = await TB.Lodging.properties({
        // server supports many filters:
        city: "",
        district: "",
        q: "",
        minPrice: "",
        maxPrice: "",
        amenities: "", // e.g. "수영장,무료WiFi"
        hasPool: "",
        hasWifi: "",
        hasParking: "",
        hasBbq: "",
        hasPets: "",
        hasBreakfast: "",
        sort: "rating",   // rating | priceAsc | priceDesc  (router also supports sort=price + order=asc|desc)
        order: "desc",    // asc|desc (used when sort=price)
        limit: 5,
        offset: 0,
        page: "",
        pageSize: "",
      });
      const first = list?.items?.[0];
      if (!first) return { ok: true, message: "no properties" };
      const propertyId = first.PROPERTY_ID || first.propertyId || first.id;
      return {
        list,
        detail: await TB.Lodging.property(propertyId),
        rooms: await TB.Lodging.rooms(propertyId),
        reviews: await TB.Lodging.reviews(propertyId, { limit: 5, offset: 0 }),
      };
    },
    wishlistDemo: ({ memberId = "U000000001" } = {}) => TB.Wishlist.list({ memberId, page: 1, pageSize: 20 }),
    async searchLogDemo({ memberId = "U000000001", keyword = "부산", city = "부산" } = {}) {
      await TB.Searches.create({ memberId, keyword, city });
      return TB.Searches.list({ memberId, page: 1, pageSize: 20 });
    },
  };
})(window);
