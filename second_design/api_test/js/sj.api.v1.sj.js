/* =========================================================
 * sj.api.v1.sj.js  (SJ Group API Library)
 * - Group: SJ_ (board)
 * - Base:  {URI}/api/v1/sj
 * ========================================================= */
(function (w) {
  "use strict";
  if (!w.$) throw new Error("jQuery($) not found.");

  const API = (w.API = w.API || {});
  API.V1 = API.V1 || {};

  const LS_KEY_URI = "api.v1.uri";
  const defaultOrigin = (w.location && w.location.origin) ? w.location.origin : "";
  API.V1.TIMEOUT_MS = API.V1.TIMEOUT_MS || 8000; // default ajax timeout (ms)
  API.V1.DEBUG = (API.V1.DEBUG != null) ? API.V1.DEBUG : true;

  API.V1.URI =
    (w.API_V1_URI && String(w.API_V1_URI).trim()) ||
    (w.localStorage && w.localStorage.getItem(LS_KEY_URI)) ||
    defaultOrigin;

  API.V1.setURI = API.V1.setURI || ((uri) => {
    API.V1.TIMEOUT_MS = API.V1.TIMEOUT_MS || 8000; // default ajax timeout (ms)
  API.V1.DEBUG = (API.V1.DEBUG != null) ? API.V1.DEBUG : true;

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

  API.V1.request = API.V1.request || (({ method, url, data, headers, timeout }) =>
    $.ajax({
      method,
      url,
      data: data ? JSON.stringify(data) : undefined,
      contentType: data ? "application/json" : undefined,
      dataType: "json",
      headers: headers || {},
      timeout: timeout != null ? timeout : API.V1.TIMEOUT_MS,
      beforeSend: function () {
        if (API.V1.DEBUG) console.log(`[REQ] ${method} ${url}`);
      },
    })
  );

  const SJ = (API.V1.SJ = API.V1.SJ || {});
  SJ.BASE = API.V1.URI.replace(/\/+$|\s+/g, "") + "/api/v1/sj";

  SJ.API = {
    AUTH_CHECK_ID: "/auth/check-login-id",
    AUTH_SIGNUP: "/auth/signup",
    AUTH_LOGIN: "/auth/login",
    POSTS_LIST: "/posts",
    POSTS_DETAIL: "/posts/:postId",
    POSTS_CREATE: "/posts",
    POSTS_UPDATE: "/posts/:postId",
    POSTS_DELETE: "/posts/:postId",
    POSTS_VIEW: "/posts/:postId/view",
    COMMENTS_LIST: "/posts/:postId/comments",
    COMMENTS_CREATE: "/posts/:postId/comments",
    COMMENTS_UPDATE: "/comments/:commentId",
    COMMENTS_DELETE: "/comments/:commentId",
  };

  SJ.url = (apiPath, params, query) => SJ.BASE + applyParams(apiPath, params) + qs(query);

  SJ.Auth = {
    checkLoginId: (q) => API.V1.request({ method: "GET", url: SJ.url(SJ.API.AUTH_CHECK_ID, null, q) }),
    signup: (body) => API.V1.request({ method: "POST", url: SJ.url(SJ.API.AUTH_SIGNUP), data: body }),
    login: (body) => API.V1.request({ method: "POST", url: SJ.url(SJ.API.AUTH_LOGIN), data: body }),
  };

  SJ.Posts = {
    list: (q) => API.V1.request({ method: "GET", url: SJ.url(SJ.API.POSTS_LIST, null, q) }),
    get: (postId) => API.V1.request({ method: "GET", url: SJ.url(SJ.API.POSTS_DETAIL, { postId }) }),
    create: (body) => API.V1.request({ method: "POST", url: SJ.url(SJ.API.POSTS_CREATE), data: body }),
    update: (postId, body) => API.V1.request({ method: "PUT", url: SJ.url(SJ.API.POSTS_UPDATE, { postId }), data: body }),
    remove: (postId) => API.V1.request({ method: "DELETE", url: SJ.url(SJ.API.POSTS_DELETE, { postId }) }),
    addView: (postId) => API.V1.request({ method: "POST", url: SJ.url(SJ.API.POSTS_VIEW, { postId }) }),
  };

  SJ.Comments = {
    list: (postId, q) => API.V1.request({ method: "GET", url: SJ.url(SJ.API.COMMENTS_LIST, { postId }, q) }),
    create: (postId, body) => API.V1.request({ method: "POST", url: SJ.url(SJ.API.COMMENTS_CREATE, { postId }), data: body }),
    update: (commentId, body) => API.V1.request({ method: "PUT", url: SJ.url(SJ.API.COMMENTS_UPDATE, { commentId }), data: body }),
    remove: (commentId) => API.V1.request({ method: "DELETE", url: SJ.url(SJ.API.COMMENTS_DELETE, { commentId }) }),
  };

  SJ.Examples = {
    async authFlow({ loginId = "sj_test11", password = "1234", displayName = "SJ테스트" } = {}) {
      const check = await SJ.Auth.checkLoginId({ loginId });
      if (!check?.exists) await SJ.Auth.signup({ loginId, password, displayName });
      return SJ.Auth.login({ loginId, password });
    },
    async postsAndComments() {
      const list = await SJ.Posts.list({ limit: 5, offset: 0 });
      const first = list?.items?.[0] || list?.posts?.[0];
      if (!first) return { ok: true, message: "no posts" };
      const postId = first.POST_ID || first.postId || first.id;
      await SJ.Posts.addView(postId);
      return { list, detail: await SJ.Posts.get(postId), comments: await SJ.Comments.list(postId, { limit: 5, offset: 0 }) };
    },
  };
})(window);