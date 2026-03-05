/* =========================================================
 * dd.api.v1.dd.js  (DD Group API Library)
 * - Group: DD_ (doodle / emotion map)
 * - Base:  {URI}/api/v1/dd
 * - Depends: jQuery
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

  API.V1.setURI = (uri) => {
    API.V1.URI = String(uri || "").replace(/\/+$|\s+/g, "");
    try { w.localStorage && w.localStorage.setItem(LS_KEY_URI, API.V1.URI); } catch (_) {}
    return API.V1.URI;
  };

  const applyParams = (path, params) => {
    let out = path;
    const p = params || {};
    Object.keys(p).forEach((k) => {
      out = out.replace(new RegExp(":" + k + "\\b", "g"), encodeURIComponent(String(p[k])));
    });
    return out;
  };

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

  const DD = (API.V1.DD = API.V1.DD || {});
  DD.BASE = API.V1.URI.replace(/\/+$|\s+/g, "") + "/api/v1/dd";

  DD.API = {
    AUTH_CHECK_ID: "/auth/check-login-id",
    AUTH_SIGNUP: "/auth/signup",
    AUTH_LOGIN: "/auth/login",
    TAGS_TOP: "/tags/top",
    POSTS_LIST: "/posts",
    POSTS_DETAIL: "/posts/:postNo",
    POSTS_CREATE: "/posts",
    COMMENTS_LIST: "/posts/:postNo/comments",
    COMMENTS_CREATE: "/posts/:postNo/comments",
  }

  // ---------------------------------------------------------
  // DD API SPEC (method + path + params)
  // - 목적: API 목록/파라미터가 '파일 패치'로 사라지지 않도록 코드에 고정
  // ---------------------------------------------------------
  DD.SPEC = [
    { group: "DD", id: "DD-AUTH-1", method: "GET",  path: "/auth/check-login-id", query: ["loginId"], body: [] },
    { group: "DD", id: "DD-AUTH-2", method: "POST", path: "/auth/signup",         query: [], body: ["loginId","password","displayName"] },
    { group: "DD", id: "DD-AUTH-3", method: "POST", path: "/auth/login",          query: [], body: ["loginId","password"] },

    { group: "DD", id: "DD-TAG-1",  method: "GET",  path: "/tags/top",            query: ["limit","days"], body: [] },

    { group: "DD", id: "DD-POST-1", method: "GET",  path: "/posts",               query: ["q","minLat","maxLat","minLng","maxLng","page","pageSize"], body: [] },
    { group: "DD", id: "DD-POST-2", method: "GET",  path: "/posts/:postNo",       query: [], body: [] },
    { group: "DD", id: "DD-POST-3", method: "POST", path: "/posts",               query: [], body: ["authorNo","title","content?","latitude","longitude","tags?"] },

    { group: "DD", id: "DD-COM-1",  method: "GET",  path: "/posts/:postNo/comments", query: [], body: [] },
    { group: "DD", id: "DD-COM-2",  method: "POST", path: "/posts/:postNo/comments", query: [], body: ["authorNo","content","parentCommentNo?"] },
  ];
;

  DD.url = (apiPath, params, query) => DD.BASE + applyParams(apiPath, params) + qs(query);

  DD.Auth = {
    checkLoginId: (q) => API.V1.request({ method: "GET", url: DD.url(DD.API.AUTH_CHECK_ID, null, q) }),
    signup: (body) => API.V1.request({ method: "POST", url: DD.url(DD.API.AUTH_SIGNUP), data: body }),
    login: (body) => API.V1.request({ method: "POST", url: DD.url(DD.API.AUTH_LOGIN), data: body }),
  };

  DD.Tags = { top: (q) => API.V1.request({ method: "GET", url: DD.url(DD.API.TAGS_TOP, null, q) }) };

  DD.Posts = {
    list: (q) => API.V1.request({ method: "GET", url: DD.url(DD.API.POSTS_LIST, null, q) }),
    get: (postNo) => API.V1.request({ method: "GET", url: DD.url(DD.API.POSTS_DETAIL, { postNo }) }),
    create: (body) => API.V1.request({ method: "POST", url: DD.url(DD.API.POSTS_CREATE), data: body }),
  };

  DD.Comments = {
    list: (postNo, q) => API.V1.request({ method: "GET", url: DD.url(DD.API.COMMENTS_LIST, { postNo }, q) }),
    create: (postNo, body) => API.V1.request({ method: "POST", url: DD.url(DD.API.COMMENTS_CREATE, { postNo }), data: body }),
  };

  DD.Examples = {
    async authFlow({ loginId = "dd_test11", password = "1234", displayName = "DD테스트" } = {}) {
      const check = await DD.Auth.checkLoginId({ loginId });
      if (!check?.exists) await DD.Auth.signup({ loginId, password, displayName });
      return DD.Auth.login({ loginId, password });
    },
    postsFlow: () => DD.Posts.list({ limit: 5, offset: 0 }),
    tagsTop10: () => DD.Tags.top({ limit: 10 }),
  };
})(window);
