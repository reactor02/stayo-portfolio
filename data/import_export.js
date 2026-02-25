/**
 * data/import_export.js
 * - 목적: localStorage를 DB처럼 사용하기 위한 Import/Export 도구
 * - 범위: 지역별 숙소/객실 + 회원 + 리뷰/별점/댓글 + 예약 + 검색어 + 태그
 *
 * [KR] 이 파일은 '툴' 성격이라, 기존 화면 로직과 분리했습니다.
 * [EN] Tooling script for importing/exporting a localStorage "DB".
 */
(() => {
  const NS = "jungseoks_childs.db";
  const KEY = {
    meta: `${NS}.meta`,
    properties: `${NS}.properties`,       // 숙소
    rooms: `${NS}.rooms`,                 // 객실
    members: `${NS}.members`,             // 회원
    reviews: `${NS}.reviews`,             // 리뷰/별점/댓글
    reservations: `${NS}.reservations`,   // 예약
    searches: `${NS}.searches`,           // 검색어 로그
    tags: `${NS}.tags`,                   // 태그(숙소별 태그)
  };

  const TABLES = [
    { name: "properties", key: KEY.properties, pk: (r) => r.propertyId ?? r.id },
    { name: "rooms", key: KEY.rooms, pk: (r) => r.roomId ?? r.id },
    { name: "members", key: KEY.members, pk: (r) => r.memberId ?? r.userId ?? r.id ?? r.email },
    { name: "reviews", key: KEY.reviews, pk: (r) => r.reviewId ?? r.id },
    { name: "reservations", key: KEY.reservations, pk: (r) => r.reservationId ?? r.id },
    { name: "searches", key: KEY.searches, pk: (r) => r.searchId ?? r.id },
    // tags: 숙소별 태그 묶음 (propertyId가 PK)
    { name: "tags", key: KEY.tags, pk: (r) => r.propertyId ?? r.id },
  ];

  const nowISO = () => new Date().toISOString();
  const safeJSON = (x, fallback) => {
    try { return JSON.parse(x); } catch { return fallback; }
  };

  // --- Storage helpers -------------------------------------------------------
  const getJSON = (k, fallback) => {
    try {
      const raw = localStorage.getItem(k);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("getJSON parse failed:", k, e);
      return fallback;
    }
  };

  const setJSON = (k, v) => {
    try {
      localStorage.setItem(k, JSON.stringify(v));
      return true;
    } catch (e) {
      console.error("setJSON failed:", k, e);
      alert("localStorage 저장 실패(용량 초과 가능): " + (e?.name || e));
      return false;
    }
  };

  const removeKey = (k) => localStorage.removeItem(k);

  // --- Bundle helpers --------------------------------------------------------
  const exportBundle = () => {
    const tables = {};
    TABLES.forEach(t => (tables[t.name] = getJSON(t.key, [])));

    return {
      meta: {
        version: getJSON(KEY.meta, { version: "unknown" })?.version || "unknown",
        exportedAt: nowISO(),
      },
      tables
    };
  };

  const clearAll = () => {
    removeKey(KEY.meta);
    TABLES.forEach(t => removeKey(t.key));
  };

  // --- Import normalization --------------------------------------------------
  const normalizeRowsForTable = (table, rows) => {
    if (!Array.isArray(rows)) return [];

    // tags: allow {propertyId, tag:"가성비"} rows -> convert to {propertyId, tags:[...]}
    if (table === "tags") {
      // Case A: already {propertyId, tags:[...]}
      const hasTagsArray = rows.some(r => r && Array.isArray(r.tags) && (r.propertyId || r.id));
      if (hasTagsArray) return rows.map(r => ({ propertyId: r.propertyId ?? r.id, tags: Array.isArray(r.tags) ? r.tags : [] }));

      // Case B: {propertyId, tag} 형태면 묶어서 변환
      const grouped = {};
      rows.forEach(r => {
        const pid = r?.propertyId ?? r?.id;
        const tag = r?.tag ?? r?.name;
        if (!pid || !tag) return;
        (grouped[pid] ??= new Set()).add(String(tag));
      });
      return Object.entries(grouped).map(([propertyId, set]) => ({ propertyId, tags: Array.from(set) }));
    }

    // searches: ensure minimal shape
    if (table === "searches") {
      return rows.map(r => ({
        searchId: r.searchId ?? r.id ?? null,
        memberId: r.memberId ?? null,
        keyword: r.keyword ?? r.q ?? r.query ?? "",
        createdAt: r.createdAt ?? nowISO(),
        ...r
      }));
    }

    return rows;
  };

  const inferTableFromRows = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return null;
    const r = rows.find(Boolean);
    if (!r || typeof r !== "object") return null;

    // tags: {propertyId,tags:[...]} OR {propertyId,tag:"..."}
    if ((r.propertyId && Array.isArray(r.tags)) || (r.propertyId && (r.tag || r.tags))) return "tags";

    // searches
    if (r.keyword || r.query || r.q) return "searches";

    // reservations
    if (r.checkIn || r.checkOut || r.reservationId) return "reservations";

    // reviews
    if (r.rating != null || r.comment != null || r.reviewId) return "reviews";

    // members
    if (r.email || r.memberId || r.userId) return "members";

    // rooms
    if (r.roomId && r.propertyId) return "rooms";

    // properties
    if ((r.propertyId || r.id) && (r.name || r.city || r.district)) return "properties";

    return null;
  };

  const parseImportJSON = (jsonObj, fallbackFilename = "") => {
    // Bundle
    if (jsonObj && typeof jsonObj === "object" && jsonObj.tables && typeof jsonObj.tables === "object") {
      return { type: "bundle", bundle: jsonObj };
    }

    // Table payload
    if (jsonObj && typeof jsonObj === "object" && jsonObj.meta && jsonObj.meta.table && Array.isArray(jsonObj.rows)) {
      return { type: "table", table: String(jsonObj.meta.table), rows: jsonObj.rows, meta: jsonObj.meta };
    }

    // Array-only
    if (Array.isArray(jsonObj)) {
      // optional table hint from filename like reviews_2026-02-25.json
      const hint = (fallbackFilename || "").toLowerCase();
      const tableHint =
        hint.includes("review") ? "reviews" :
        hint.includes("reservation") ? "reservations" :
        hint.includes("member") ? "members" :
        hint.includes("search") ? "searches" :
        hint.includes("tag") ? "tags" :
        hint.includes("room") ? "rooms" :
        hint.includes("propert") ? "properties" :
        null;

      const table = tableHint || inferTableFromRows(jsonObj);
      return { type: "table", table, rows: jsonObj, meta: { table, inferred: true, filename: fallbackFilename } };
    }

    return { type: "unknown" };
  };

  // --- Merge / Replace -------------------------------------------------------
  const upsertMerge = (tableName, currentRows, incomingRows) => {
    const t = TABLES.find(x => x.name === tableName);
    if (!t) return currentRows;

    const pk = t.pk;
    const map = new Map();
    const keepOrder = [];

    // current
    (Array.isArray(currentRows) ? currentRows : []).forEach(r => {
      const id = pk(r);
      if (!id) return;
      map.set(String(id), r);
      keepOrder.push(String(id));
    });

    // incoming (upsert)
    (Array.isArray(incomingRows) ? incomingRows : []).forEach(r => {
      const id = pk(r);
      if (!id) {
        // no pk -> append as-is with random id for some tables? keep simple: append with generated id if possible
        // reviews/searches/reservations often need an id; for tool, allow null id rows appended
        const gen = `${tableName}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
        if (tableName === "reviews") r.id = r.id ?? gen;
        if (tableName === "reservations") r.id = r.id ?? gen;
        if (tableName === "searches") r.id = r.id ?? gen;
        map.set(gen, r);
        keepOrder.push(gen);
        return;
      }
      const key = String(id);
      if (!map.has(key)) keepOrder.push(key);
      map.set(key, r);
    });

    return keepOrder.map(k => map.get(k)).filter(Boolean);
  };

  const applyTableImport = (tableName, rows, mode) => {
    if (!tableName) return { ok: false, msg: "테이블 추론 실패" };
    const t = TABLES.find(x => x.name === tableName);
    if (!t) return { ok: false, msg: `지원하지 않는 테이블: ${tableName}` };

    const incoming = normalizeRowsForTable(tableName, rows);

    if (mode === "merge") {
      const current = getJSON(t.key, []);
      const merged = upsertMerge(tableName, current, incoming);
      if (!setJSON(t.key, merged)) return { ok: false, msg: "저장 실패" };
      return { ok: true, msg: `merge 완료 (${tableName}: +${incoming.length})` };
    }

    // replace
    if (!setJSON(t.key, incoming)) return { ok: false, msg: "저장 실패" };
    return { ok: true, msg: `replace 완료 (${tableName}: ${incoming.length})` };
  };

  const importBundle = (bundle, mode = "replace") => {
    if (!bundle || !bundle.tables) return { ok: false, msg: "번들 형식 오류(tables 없음)" };

    const meta = bundle.meta || { version: "imported" };
    if (!setJSON(KEY.meta, { ...meta, importedAt: nowISO() })) return { ok: false, msg: "meta 저장 실패" };

    // tables apply
    for (const t of TABLES) {
      const incoming = Array.isArray(bundle.tables[t.name]) ? bundle.tables[t.name] : [];
      const res = applyTableImport(t.name, incoming, mode);
      if (!res.ok) return res;
    }
    return { ok: true, msg: "번들 Import 완료" };
  };

  // --- UI helpers ------------------------------------------------------------
  const downloadJSON = (filename, obj) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result || ""));
      r.onerror = reject;
      r.readAsText(file, "utf-8");
    });

  const fmtInt = (n) => (Number.isFinite(n) ? n.toLocaleString() : String(n));

  const updateStats = () => {
    const $body = $("#statsBody").empty();

    TABLES.forEach(t => {
      const arr = getJSON(t.key, []);
      const count = Array.isArray(arr) ? arr.length : 0;

      const rowHtml = `
        <tr>
          <td><b>${t.name}</b></td>
          <td class="kpi">${fmtInt(count)}</td>
          <td>
            <div class="row">
              <select class="selMode" data-table="${t.name}">
                <option value="merge">merge</option>
                <option value="replace">replace</option>
              </select>
              <input class="fileTable" data-table="${t.name}" type="file" accept=".json,application/json" />
              <button class="btn primary btnImportTable" data-table="${t.name}">Import</button>
            </div>
            <div class="muted">해당 테이블 JSON만 골라서 Import 가능</div>
          </td>
          <td>
            <div class="row">
              <button class="btn btnView" data-table="${t.name}">보기</button>
              <button class="btn" data-export="${t.name}">Export</button>
              <button class="btn danger btnClearTable" data-table="${t.name}">Clear</button>
            </div>
          </td>
        </tr>
      `;
      $body.append($(rowHtml));
    });
  };

  // --- Modal preview ---------------------------------------------------------
  const modal = {
    open: (title, sub, obj) => {
      $("#modalTitle").text(title);
      $("#modalSub").text(sub);
      $("#modalBg").data("json", obj).css("display", "flex").attr("aria-hidden", "false");
      modal.render();
    },
    close: () => {
      $("#modalBg").css("display", "none").attr("aria-hidden", "true");
    },
    render: () => {
      const obj = $("#modalBg").data("json");
      const limit = Number($("#selPreviewLimit").val() || 50);

      let view = obj;
      if (Array.isArray(obj)) view = obj.slice(0, limit);

      const txt = JSON.stringify(view, null, 2);
      $("#modalPre").text(txt);
    }
  };

  const collectDbStats = () => {
    const stats = {};
    TABLES.forEach(t => {
      const arr = getJSON(t.key, []);
      stats[t.name] = Array.isArray(arr) ? arr.length : 0;
    });
    return stats;
  };

  // --- Seed Import (full regional + small seeds) -----------------------------
  const seedImportFull = async () => {
    // 1) 지역 전체 숙소/객실
    const payload = await fetch("/storage/korea_lodging_payload_city50.json").then(r => r.json());
    const props = Array.isArray(payload.properties) ? payload.properties : [];
    const rooms = Array.isArray(payload.rooms) ? payload.rooms : [];

    // 2) 기타 seed (members/reviews/reservations)
    const seed = await fetch("/storage/db_seed_bundle.json").then(r => r.json());
    const tables = seed.tables || {};

    // 3) tags seed: properties 기반으로 가볍게 생성 (숙소당 2~4개)
    const tagPool = [
      "가성비", "가족", "커플", "비즈니스", "감성숙소", "조식", "주차", "수영장",
      "스파", "피트니스", "바다뷰", "시티뷰", "자연뷰", "반려동물", "키즈", "파티",
      "공항근처", "역세권", "한옥", "신상"
    ];

    const tags = props.map(p => {
      const base = new Set();
      // amenities가 있으면 힌트로 추가
      (p.amenities || []).forEach(a => {
        const s = String(a).toLowerCase();
        if (s.includes("parking")) base.add("주차");
        if (s.includes("pool")) base.add("수영장");
        if (s.includes("spa")) base.add("스파");
        if (s.includes("gym")) base.add("피트니스");
        if (s.includes("breakfast")) base.add("조식");
      });

      // 랜덤 보강 (항상 동일하게 나오도록 seed-ish)
      const pickCount = 2 + (Number(String(p.propertyId || "").slice(-1)) % 3); // 2~4
      while (base.size < pickCount) {
        const idx = (Number(String(p.propertyId || "").replace(/\D/g,"").slice(-4)) + base.size * 7) % tagPool.length;
        base.add(tagPool[idx]);
      }

      return { propertyId: p.propertyId, tags: Array.from(base) };
    });

    const bundle = {
      meta: { version: payload.version || "seed", importedAt: nowISO() },
      tables: {
        properties: props,
        rooms: rooms,
        members: Array.isArray(tables.members) ? tables.members : [],
        reviews: Array.isArray(tables.reviews) ? tables.reviews : [],
        reservations: Array.isArray(tables.reservations) ? tables.reservations : [],
        searches: Array.isArray(tables.searches) ? tables.searches : [],
        tags: tags,
      }
    };

    return importBundle(bundle, "replace");
  };

  // --- Bind ------------------------------------------------------------------
  $(async () => {
    $("#header").load("/partials/header.html");
    updateStats();

    $("#btnRefresh").on("click", updateStats);

    // Modal controls
    $("#btnModalClose").on("click", modal.close);
    $("#modalBg").on("click", (e) => { if (e.target === e.currentTarget) modal.close(); });
    $("#selPreviewLimit").on("change", modal.render);
    $("#btnCopyJSON").on("click", async () => {
      const obj = $("#modalBg").data("json");
      const limit = Number($("#selPreviewLimit").val() || 50);
      const view = Array.isArray(obj) ? obj.slice(0, limit) : obj;
      const txt = JSON.stringify(view, null, 2);
      try {
        await navigator.clipboard.writeText(txt);
        alert("복사 완료");
      } catch {
        alert("복사 실패(브라우저 권한 확인)");
      }
    });

    // Seed import full
    $("#btnSeedFull").on("click", async () => {
      try {
        const res = await seedImportFull();
        alert(res.ok ? "Seed Import 완료" : ("Seed Import 실패: " + res.msg));
        updateStats();
      } catch (e) {
        console.error(e);
        alert("Seed Import 실패: 경로/서버 확인 필요");
      }
    });

    // Clear all
    $("#btnClearAll").on("click", () => {
      if (!confirm("정말 전체 데이터를 삭제할까요?")) return;
      clearAll();
      alert("삭제 완료");
      updateStats();
    });

    // Export all
    $("#btnExportAll").on("click", () => {
      const bundle = exportBundle();
      const ts = nowISO().replace(/[:.]/g, "-");
      downloadJSON(`jungseoks_childs_db_bundle_${ts}.json`, bundle);
    });

    // Import all (multi files)
    $("#btnImportAll").on("click", async () => {
      const files = $("#fileAll")[0]?.files;
      if (!files || files.length === 0) return alert("Import 할 JSON 파일을 선택하세요.");
      const mode = $("#selModeAll").val() || "merge";

      const results = [];
      for (const file of files) {
        try {
          const txt = await readFileAsText(file);
          const jsonObj = safeJSON(txt, null);
          if (!jsonObj) { results.push(`${file.name}: JSON 파싱 실패`); continue; }

          const parsed = parseImportJSON(jsonObj, file.name);
          if (parsed.type === "bundle") {
            const res = importBundle(parsed.bundle, mode);
            results.push(`${file.name}: ${res.ok ? "OK" : "FAIL"} - ${res.msg}`);
          } else if (parsed.type === "table") {
            const res = applyTableImport(parsed.table, parsed.rows, mode);
            results.push(`${file.name}: ${res.ok ? "OK" : "FAIL"} - ${res.msg}`);
          } else {
            results.push(`${file.name}: 지원하지 않는 형식`);
          }
        } catch (e) {
          console.error(e);
          results.push(`${file.name}: Import 실패`);
        }
      }

      alert("Import 결과\n\n" + results.join("\n"));
      updateStats();
    });

    // per-table export
    $(document).on("click", "button[data-export]", function () {
      const table = $(this).data("export");
      const target = TABLES.find(t => t.name === table);
      if (!target) return;

      const payload = {
        meta: { table, exportedAt: nowISO() },
        rows: getJSON(target.key, [])
      };
      const ts = nowISO().replace(/[:.]/g, "-");
      downloadJSON(`jungseoks_childs_${table}_${ts}.json`, payload);
    });

    // per-table import
    $(document).on("click", ".btnImportTable", async function () {
      const table = $(this).data("table");
      const $file = $(`.fileTable[data-table="${table}"]`);
      const file = $file[0]?.files?.[0];
      if (!file) return alert("Import 할 JSON 파일을 선택하세요.");
      const mode = $(`.selMode[data-table="${table}"]`).val() || "merge";

      try {
        const txt = await readFileAsText(file);
        const jsonObj = safeJSON(txt, null);
        if (!jsonObj) return alert("JSON 파싱 실패");

        const parsed = parseImportJSON(jsonObj, file.name);

        // table 강제 적용 (추론/메타보다 우선)
        if (parsed.type === "bundle") {
          // bundle을 table에만 적용
          const incoming = parsed.bundle?.tables?.[table] || [];
          const res = applyTableImport(table, incoming, mode);
          alert(res.ok ? res.msg : ("실패: " + res.msg));
        } else if (parsed.type === "table") {
          const res = applyTableImport(table, parsed.rows, mode);
          alert(res.ok ? res.msg : ("실패: " + res.msg));
        } else {
          alert("지원하지 않는 형식");
        }
        updateStats();
      } catch (e) {
        console.error(e);
        alert("파일 Import 실패");
      }
    });

    // per-table clear
    $(document).on("click", ".btnClearTable", function () {
      const table = $(this).data("table");
      const target = TABLES.find(t => t.name === table);
      if (!target) return;
      if (!confirm(`${table} 테이블을 삭제할까요?`)) return;
      removeKey(target.key);
      updateStats();
    });

    // view modal
    $(document).on("click", ".btnView", function () {
      const table = $(this).data("table");
      const target = TABLES.find(t => t.name === table);
      if (!target) return;
      const rows = getJSON(target.key, []);
      const sub = `count=${Array.isArray(rows) ? rows.length : 0} / key=${target.key}`;
      modal.open(`테이블: ${table}`, sub, Array.isArray(rows) ? rows : []);
    });
  });

  // expose minimal API (optional)
  window.JSKidsDB = {
    KEY,
    exportBundle,
    importBundle,
    clearAll,
    applyTableImport,
    collectDbStats,
  };
})();
