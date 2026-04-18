(function () {
  const data = window.OPTICS_DASHBOARD_DATA;
  const requestedTicker = new URLSearchParams(window.location.search).get("ticker");
  const noteCache = new Map();
  let noteRequestToken = 0;
  let activeModalRow = null;
  let detailChart = null;
  let detailChartResizeObserver = null;
  const liveState = {
    quotesBySymbol: new Map(),
    detailsBySymbol: new Map(),
    detailRequests: new Map(),
    quoteHydrated: false
  };

  if (!data || !Array.isArray(data.rows)) {
    document.getElementById("segments").innerHTML = '<div class="empty">Dashboard data is not available yet.</div>';
    document.getElementById("detail-top").innerHTML = '<div class="empty">No row selected.</div>';
    return;
  }

  const state = {
    search: "",
    sortKey: "score",
    sortDirection: "desc",
    status: "all",
    selectedTicker: pickInitialTicker(data.rows, requestedTicker),
    isResizingPanels: false
  };

  const elements = {
    layout: document.querySelector(".layout"),
    panelDivider: document.getElementById("panel-divider"),
    generatedStamp: document.getElementById("generated-stamp"),
    coverageStamp: document.getElementById("coverage-stamp"),
    summaryCards: document.getElementById("summary-cards"),
    segmentNav: document.getElementById("segment-nav"),
    boardNote: document.getElementById("board-note"),
    segments: document.getElementById("segments"),
    detailTop: document.getElementById("detail-top"),
    chartHost: document.getElementById("chart-host"),
    researchNotePanel: document.getElementById("research-note-panel"),
    noteModal: document.getElementById("note-modal"),
    noteModalTitle: document.getElementById("note-modal-title"),
    noteModalSubtitle: document.getElementById("note-modal-subtitle"),
    noteModalLink: document.getElementById("note-modal-link"),
    noteModalClose: document.getElementById("note-modal-close"),
    searchInput: document.getElementById("search-input"),
    sortSelect: document.getElementById("sort-select"),
    directionToggle: document.getElementById("direction-toggle"),
    statusButtons: Array.from(document.querySelectorAll("[data-status]"))
  };

  bindEvents();
  initializePanelSizing();
  render();
  hydrateLiveQuotes();

  function bindEvents() {
    elements.searchInput.addEventListener("input", (event) => {
      state.search = event.target.value.trim().toLowerCase();
      render();
    });

    elements.sortSelect.addEventListener("change", (event) => {
      state.sortKey = event.target.value;
      render();
    });

    elements.directionToggle.addEventListener("click", () => {
      state.sortDirection = state.sortDirection === "desc" ? "asc" : "desc";
      elements.directionToggle.textContent = state.sortDirection === "desc" ? "Desc" : "Asc";
      render();
    });

    elements.statusButtons.forEach((button) => {
      button.addEventListener("click", () => {
        state.status = button.dataset.status;
        elements.statusButtons.forEach((candidate) => candidate.classList.toggle("active", candidate === button));
        render();
      });
    });

    elements.segments.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-select-ticker]");
      if (!trigger) {
        return;
      }
      state.selectedTicker = trigger.dataset.selectTicker;
      render();
    });

    document.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-open-note]");
      if (trigger) {
        event.preventDefault();
        const row = data.rows.find((candidate) => candidate.ticker === trigger.dataset.openNote);
        if (row) {
          openNoteModal(row);
        }
        return;
      }

      if (event.target === elements.noteModal) {
        closeNoteModal();
      }
    });

    elements.noteModalClose.addEventListener("click", closeNoteModal);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elements.noteModal.classList.contains("open")) {
        closeNoteModal();
      }
    });

    if (elements.panelDivider) {
      elements.panelDivider.addEventListener("pointerdown", beginPanelResize);
    }

    window.addEventListener("resize", handleWindowResize);
  }

  function initializePanelSizing() {
    if (!elements.layout || window.innerWidth <= 1180) {
      return;
    }

    const bounds = elements.layout.getBoundingClientRect();
    const defaultWidth = Math.round(bounds.width * 0.64);
    elements.layout.style.setProperty("--left-panel-width", `${defaultWidth}px`);
  }

  function beginPanelResize(event) {
    if (!elements.layout || window.innerWidth <= 1180) {
      return;
    }

    state.isResizingPanels = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    elements.panelDivider.setPointerCapture(event.pointerId);
    elements.panelDivider.addEventListener("pointermove", resizePanels);
    elements.panelDivider.addEventListener("pointerup", endPanelResize);
    elements.panelDivider.addEventListener("pointercancel", endPanelResize);
  }

  function resizePanels(event) {
    if (!state.isResizingPanels || !elements.layout) {
      return;
    }

    const bounds = elements.layout.getBoundingClientRect();
    const minLeft = 360;
    const minRight = 320;
    const dividerWidth = 14;
    const nextWidth = Math.min(
      Math.max(event.clientX - bounds.left, minLeft),
      bounds.width - minRight - dividerWidth
    );

    elements.layout.style.setProperty("--left-panel-width", `${Math.round(nextWidth)}px`);
  }

  function endPanelResize(event) {
    state.isResizingPanels = false;
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    elements.panelDivider.releasePointerCapture(event.pointerId);
    elements.panelDivider.removeEventListener("pointermove", resizePanels);
    elements.panelDivider.removeEventListener("pointerup", endPanelResize);
    elements.panelDivider.removeEventListener("pointercancel", endPanelResize);
  }

  function handleWindowResize() {
    if (!elements.layout) {
      return;
    }

    if (window.innerWidth <= 1180) {
      elements.layout.style.removeProperty("--left-panel-width");
      return;
    }

    const bounds = elements.layout.getBoundingClientRect();
    const current = parseFloat(elements.layout.style.getPropertyValue("--left-panel-width"));
    if (!Number.isFinite(current)) {
      initializePanelSizing();
      return;
    }

    const maxWidth = bounds.width - 320 - 14;
    const clamped = Math.min(Math.max(current, 360), maxWidth);
    elements.layout.style.setProperty("--left-panel-width", `${Math.round(clamped)}px`);
  }

  function render() {
    const filteredRows = getFilteredRows();
    const groupedRows = groupRows(filteredRows);
    const selectedRow = getSelectedRow(filteredRows);

    renderSummary(filteredRows, groupedRows);
    renderSegments(groupedRows);
    renderDetail(selectedRow);
  }

  function getFilteredRows() {
    return data.rows.filter((row) => {
      if (state.status !== "all" && row.marketDataStatus !== state.status) {
        return false;
      }

      if (!state.search) {
        return true;
      }

      const haystack = [
        row.ticker,
        row.name,
        row.segment,
        row.oneLiner,
        row.thesis
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(state.search);
    });
  }

  function groupRows(rows) {
    return data.segmentOrder
      .map((segment) => {
        const segmentRows = rows
          .filter((row) => row.segment === segment)
          .sort(compareRows);

        return {
          segment,
          rows: segmentRows
        };
      })
      .filter((group) => group.rows.length > 0);
  }

  function compareRows(left, right) {
    const leftValue = getSortValue(left, state.sortKey);
    const rightValue = getSortValue(right, state.sortKey);

    const emptyLeft = leftValue == null;
    const emptyRight = rightValue == null;

    if (emptyLeft && emptyRight) {
      return left.name.localeCompare(right.name);
    }
    if (emptyLeft) {
      return 1;
    }
    if (emptyRight) {
      return -1;
    }

    if (typeof leftValue === "string" || typeof rightValue === "string") {
      const comparison = String(leftValue).localeCompare(String(rightValue));
      return state.sortDirection === "asc" ? comparison : -comparison;
    }

    if (state.sortKey === "chokepointScore") {
      const tieBreakers = [
        (row) => row.opticsPct,
        (row) => getMarketMetrics(row).marketCap,
        (row) => row.name
      ];
      const primaryComparison = leftValue - rightValue;

      if (primaryComparison !== 0) {
        return state.sortDirection === "asc" ? primaryComparison : -primaryComparison;
      }

      for (const tieBreaker of tieBreakers) {
        const leftTie = tieBreaker(left);
        const rightTie = tieBreaker(right);

        if (leftTie == null && rightTie == null) {
          continue;
        }
        if (leftTie == null) {
          return 1;
        }
        if (rightTie == null) {
          return -1;
        }

        if (typeof leftTie === "string" || typeof rightTie === "string") {
          const comparison = String(leftTie).localeCompare(String(rightTie));
          if (comparison !== 0) {
            return state.sortDirection === "asc" ? comparison : -comparison;
          }
          continue;
        }

        const comparison = leftTie - rightTie;
        if (comparison !== 0) {
          return state.sortDirection === "asc" ? comparison : -comparison;
        }
      }
      return 0;
    }

    const comparison = leftValue - rightValue;
    return state.sortDirection === "asc" ? comparison : -comparison;
  }

  function getSortValue(row, sortKey) {
    switch (sortKey) {
      case "chokepointScore":
        return row.chokepointScore;
      case "oneYearReturn":
        return getMarketMetrics(row).oneYearReturn;
      case "relativeStrength":
        return row.relativeStrength;
      case "currentPrice":
        return getMarketMetrics(row).currentPrice;
      case "marketCap":
        return getMarketMetrics(row).marketCap;
      case "opticsPct":
        return row.opticsPct;
      case "name":
        return row.name;
      case "ticker":
        return row.ticker;
      case "score":
      default:
        return row.score;
    }
  }

  function getSelectedRow(filteredRows) {
    const current = filteredRows.find((row) => row.ticker === state.selectedTicker);
    if (current) {
      return current;
    }

    const fallback = filteredRows[0] || data.rows[0] || null;
    state.selectedTicker = fallback ? fallback.ticker : null;
    return fallback;
  }

  function renderSummary(filteredRows, groupedRows) {
    const generatedAt = new Date(data.generatedAt);
    elements.generatedStamp.textContent = `Snapshot ${formatDateTime(generatedAt)}`;
    elements.coverageStamp.textContent = `${filteredRows.length} of ${data.totalCompanies} names visible`;

    const visibleSegments = groupedRows.length;
    const visibleAvgReturn = average(filteredRows.map((row) => getMarketMetrics(row).oneYearReturn));
    const liveCount = filteredRows.filter((row) => row.marketDataStatus === "ok").length;
    const avgOptics = average(filteredRows.map((row) => row.opticsPct));

    const cards = [
      {
        label: "Coverage",
        value: formatNumber(filteredRows.length),
        note: `${visibleSegments} segment groups are currently visible.`
      },
      {
        label: "Live Rows",
        value: formatNumber(liveCount),
        note: `${filteredRows.length - liveCount} names are research-only fallbacks in the current view.`
      },
      {
        label: "Avg 1Y Return",
        value: formatPercent(visibleAvgReturn),
        note: "Computed from the latest live Yahoo Finance chart payload served through the Worker."
      },
      {
        label: "Avg Exposure %",
        value: avgOptics == null ? "n/a" : `${avgOptics.toFixed(0)}%`,
        note: "Exposure share comes from the local company metrics dataset."
      }
    ];

    elements.summaryCards.innerHTML = cards
      .map((card) => `
        <article class="card">
          <span class="card-label">${escapeHtml(card.label)}</span>
          <span class="card-value">${escapeHtml(card.value)}</span>
          <p class="card-note">${escapeHtml(card.note)}</p>
        </article>
      `)
      .join("");

    elements.segmentNav.innerHTML = groupedRows
      .map((group) => `
        <a class="segment-link" href="#segment-${slugify(group.segment)}">${escapeHtml(group.segment)} (${group.rows.length})</a>
      `)
      .join("");

    const failureCount = Array.isArray(data.failures) ? data.failures.length : 0;
    const failureNote = failureCount ? ` ${failureCount} ticker${failureCount === 1 ? "" : "s"} fell back to research-only values.` : "";
    const sortNote = state.sortKey === "chokepointScore"
      ? " Choking power uses a 25-point rubric: structure, moat durability, theme purity, and pricing power; ties break on theme exposure and market cap."
      : "";
    elements.boardNote.textContent = `Showing ${filteredRows.length} names across ${visibleSegments} segments. Rows are grouped by segment and sorted inside each segment.${failureNote}${sortNote}`;
  }

  function renderSegments(groupedRows) {
    if (!groupedRows.length) {
      elements.segments.innerHTML = '<div class="empty">No companies match the current filter.</div>';
      return;
    }

    elements.segments.innerHTML = groupedRows
      .map((group) => {
        const avgReturn = average(group.rows.map((row) => getMarketMetrics(row).oneYearReturn));
        const liveCount = group.rows.filter((row) => row.marketDataStatus === "ok").length;
        const avgOptics = average(group.rows.map((row) => row.opticsPct));

        return `
          <section class="segment-card" id="segment-${slugify(group.segment)}">
            <header class="segment-header">
              <div>
                <p class="eyebrow">Segment</p>
                <h2>${escapeHtml(group.segment)}</h2>
                <p class="segment-meta">${group.rows.length} names grouped here.</p>
              </div>
              <div class="segment-badges">
                <span class="badge">${liveCount}/${group.rows.length} live</span>
                <span class="badge">Avg 1Y ${formatPercent(avgReturn)}</span>
                <span class="badge">Avg exposure ${avgOptics == null ? "n/a" : `${avgOptics.toFixed(0)}%`}</span>
              </div>
            </header>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th class="sticky-col">Ticker / Company</th>
                    <th>Price</th>
                    <th>Market Cap</th>
                    <th>P/S</th>
                    <th>P/E</th>
                    <th>Chart 1Y</th>
                    <th>1M</th>
                    <th>YTD</th>
                    <th>1Y</th>
                    <th>High Gap</th>
                    <th>RS</th>
                    <th>20D</th>
                    <th>50D</th>
                    <th>200D</th>
                    <th>Exposure %</th>
                  </tr>
                </thead>
                <tbody>
                  ${group.rows.map(renderRow).join("")}
                </tbody>
              </table>
            </div>
          </section>
        `;
      })
      .join("");
  }

  function renderRow(row) {
    const metrics = getMarketMetrics(row);
    const currentPrice = formatPrice(metrics.currentPrice, metrics.currency);
    const marketCap = formatMarketCap(metrics.marketCap, metrics.currency);
    const selected = row.ticker === state.selectedTicker;

    return `
      <tr class="${selected ? "is-selected" : ""}">
        <td class="sticky-col">
          <button class="company-button" type="button" data-select-ticker="${escapeHtml(row.ticker)}">
            <span class="ticker-dot">${escapeHtml(row.ticker.slice(0, 4))}</span>
            <span class="identity">
              <span class="ticker">${escapeHtml(row.ticker)}</span>
              <span class="company">${escapeHtml(row.name)}</span>
              <span class="subcopy">${escapeHtml(row.market || "")}</span>
            </span>
          </button>
        </td>
        <td class="mono">${escapeHtml(currentPrice)}</td>
        <td class="mono">${escapeHtml(marketCap)}</td>
        <td class="mono">${escapeHtml(formatRatio(metrics.priceToSales))}</td>
        <td class="mono">${escapeHtml(formatRatio(metrics.trailingPE))}</td>
        <td>${renderSparkline(metrics.sparkline)}</td>
        <td>${renderMetricPill(metrics.oneMonthReturn)}</td>
        <td>${renderMetricPill(metrics.ytdReturn)}</td>
        <td>${renderMetricPill(metrics.oneYearReturn)}</td>
        <td>${renderMetricPill(metrics.distanceFromHigh, { invert: true })}</td>
        <td>${renderStrength(row.relativeStrength)}</td>
        <td>${renderTrend(metrics.above20Sma)}</td>
        <td>${renderTrend(metrics.above50Sma)}</td>
        <td>${renderTrend(metrics.above200Sma)}</td>
        <td class="mono">${row.opticsPct == null ? "n/a" : `${row.opticsPct.toFixed(0)}%`}</td>
      </tr>
    `;
  }

  function renderDetail(row) {
    if (!row) {
      elements.detailTop.innerHTML = '<div class="empty">No row selected.</div>';
      elements.chartHost.innerHTML = "";
      return;
    }

    const metrics = getMarketMetrics(row);

    elements.detailTop.innerHTML = `
      <div class="detail-heading">
        <div>
          <p class="eyebrow">Selected Company</p>
          <h2>${escapeHtml(row.ticker)}</h2>
          <p>${escapeHtml(row.name)} / ${escapeHtml(row.segment)}</p>
        </div>
        <div class="detail-links">
          ${row.reportPath ? `<button class="detail-link" type="button" data-open-note="${escapeHtml(row.ticker)}">Research note</button>` : ""}
          <a class="detail-link" href="${escapeHtml(getYahooUrl(row.yahooSymbol))}" target="_blank" rel="noreferrer">Yahoo</a>
          <a class="detail-link" href="${escapeHtml(getTradingViewUrl(row.tradingViewSymbol))}" target="_blank" rel="noreferrer">TradingView</a>
        </div>
      </div>
      <div class="detail-grid">
        <article class="detail-stat">
          <span class="label">Current Price</span>
          <span class="value">${escapeHtml(formatPrice(metrics.currentPrice, metrics.currency))}</span>
          <span class="small">${escapeHtml(formatMarketCap(metrics.marketCap, metrics.currency))}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Theme Exposure</span>
          <span class="value">${row.opticsPct == null ? "n/a" : `${escapeHtml(row.opticsPct.toFixed(0))}%`}</span>
          <span class="small">${escapeHtml(row.share || row.market || "n/a")}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Momentum</span>
          <span class="value">${escapeHtml(formatPercent(metrics.oneYearReturn))}</span>
          <span class="small">1M ${escapeHtml(formatPercent(metrics.oneMonthReturn))} / YTD ${escapeHtml(formatPercent(metrics.ytdReturn))}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Choking Power</span>
          <span class="value">${row.chokepointScore == null ? "n/a" : `${escapeHtml(row.chokepointScore.toFixed(1))}/25`}</span>
          <span class="small">${escapeHtml(row.chokepointTier || "n/a")} / ${escapeHtml(row.chokepointStructure || "n/a")}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Trend Setup</span>
          <span class="value">${escapeHtml(renderTrendLabel(row))}</span>
          <span class="small">RS ${row.relativeStrength == null ? "n/a" : `${row.relativeStrength}/100`} / exposure ${row.opticsPct == null ? "n/a" : `${row.opticsPct.toFixed(0)}%`}</span>
        </article>
      </div>
      <div class="detail-copy">
        ${row.oneLiner ? `<p class="note"><strong>Research view:</strong> ${escapeHtml(row.oneLiner)}</p>` : ""}
        ${row.thesis ? `<p class="note"><strong>Thesis:</strong> ${escapeHtml(row.thesis)}</p>` : ""}
        ${renderFinancialSnapshotMarkup(row, { title: "Yahoo Financial Snapshot" })}
        ${row.catalystShort ? `<p class="note"><strong>Catalyst:</strong> ${escapeHtml(row.catalystShort)}</p>` : ""}
        <p class="note"><strong>Choking power:</strong> ${row.chokepointScore == null ? "n/a" : `${escapeHtml(row.chokepointScore.toFixed(1))}/25`} (${escapeHtml(row.chokepointTier || "n/a")}). <strong>Structure:</strong> ${escapeHtml(row.chokepointStructure || "n/a")}. <strong>Moat:</strong> ${escapeHtml(row.moat || "n/a")}.</p>
        ${row.chokepointBreakdown ? `<p class="note"><strong>Rubric:</strong> structure ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.structuralControl))}/12, moat ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.moatDurability))}/5, purity ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.opticsPurity))}/5, pricing ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.pricingPower))}/3.</p>` : ""}
        <p class="note"><strong>Risk:</strong> ${escapeHtml(row.riskLevel || "n/a")}. <strong>CHIPS status:</strong> ${escapeHtml(row.chipsStatus || "n/a")}${row.chipsDetail ? ` - ${escapeHtml(row.chipsDetail)}` : ""}</p>
      </div>
    `;

    renderLocalChart(row);
    ensureLiveDetail(row);
  }

  function openNoteModal(row) {
    activeModalRow = row;
    elements.noteModal.classList.add("open");
    elements.noteModal.setAttribute("aria-hidden", "false");
    elements.noteModalTitle.textContent = `${row.ticker} Research Note`;
    elements.noteModalSubtitle.textContent = row.name;
    const candidates = getReportCandidates(row);
    elements.noteModalLink.href = candidates[0] || "#";
    renderResearchNote(row);
  }

  function closeNoteModal() {
    elements.noteModal.classList.remove("open");
    elements.noteModal.setAttribute("aria-hidden", "true");
  }

  async function renderResearchNote(row) {
    const candidates = getReportCandidates(row);
    if (row.reportMarkdown) {
      elements.researchNotePanel.innerHTML = renderResearchNoteMarkup(row.reportMarkdown, row);
      return;
    }

    if (!candidates.length) {
      elements.researchNotePanel.innerHTML = `
        <h3>Research Note</h3>
        <div class="loading">No local research note is linked to this company yet.</div>
      `;
      return;
    }

    const requestToken = ++noteRequestToken;
    elements.researchNotePanel.innerHTML = `
      <h3>Research Note</h3>
      <div class="loading">Loading ${escapeHtml(candidates[0])}...</div>
    `;

    const cachedPath = candidates.find((candidate) => noteCache.has(candidate));
    if (cachedPath) {
      if (requestToken === noteRequestToken) {
        const markdown = noteCache.get(cachedPath);
        if (activeModalRow?.ticker !== row.ticker) {
          return;
        }
        elements.researchNotePanel.innerHTML = renderResearchNoteMarkup(markdown, row);
      }
      return;
    }

    try {
      let markdown = null;
      let resolvedPath = null;

      for (const candidate of candidates) {
        const response = await fetch(candidate);
        if (!response.ok) {
          continue;
        }

        markdown = await response.text();
        resolvedPath = candidate;
        noteCache.set(candidate, markdown);
        break;
      }

      if (!markdown || !resolvedPath) {
        throw new Error("No matching report file could be loaded");
      }

      if (requestToken === noteRequestToken) {
        if (activeModalRow?.ticker !== row.ticker) {
          return;
        }
        elements.noteModalLink.href = resolvedPath;
        elements.researchNotePanel.innerHTML = renderResearchNoteMarkup(markdown, row);
      }
    } catch (error) {
      if (requestToken === noteRequestToken) {
        elements.researchNotePanel.innerHTML = `
          <h3>Research Note</h3>
          <div class="loading">Could not load a local research note for ${escapeHtml(row.ticker)}. Use the research note link above if available.</div>
        `;
      }
    }
  }

  function getReportCandidates(row) {
    const base = window.location.href;
    const candidates = [];
    const seen = new Set();

    function pushCandidate(candidate) {
      if (!candidate) {
        return;
      }

      const resolved = new URL(candidate, base).href;
      if (seen.has(resolved)) {
        return;
      }

      seen.add(resolved);
      candidates.push(resolved);
    }

    pushCandidate(row.reportPath);

    const ticker = String(row.ticker || "").toUpperCase();
    const compactTicker = ticker.replace(/[^A-Z0-9]/g, "");
    const baseTicker = ticker.split(".")[0];

    pushCandidate(`reports/${compactTicker}.md`);
    pushCandidate(`reports/${baseTicker}.md`);

    return candidates;
  }

  function renderResearchNoteMarkup(markdown, row) {
    const lines = markdown.split(/\r?\n/);
    const blocks = [];
    let paragraph = [];
    let listItems = [];
    let orderedItems = [];
    let tableLines = [];

    function flushParagraph() {
      if (!paragraph.length) {
        return;
      }
      blocks.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
      paragraph = [];
    }

    function flushList() {
      if (!listItems.length) {
        return;
      }
      blocks.push(`<ul>${listItems.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
      listItems = [];
    }

    function flushOrderedList() {
      if (!orderedItems.length) {
        return;
      }
      blocks.push(`<ol>${orderedItems.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ol>`);
      orderedItems = [];
    }

    function flushTable() {
      if (!tableLines.length) {
        return;
      }
      blocks.push(renderMarkdownTable(tableLines));
      tableLines = [];
    }

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph();
        flushList();
        flushOrderedList();
        flushTable();
        continue;
      }

      if (trimmed.startsWith("|")) {
        flushParagraph();
        flushList();
        flushOrderedList();
        tableLines.push(trimmed);
        continue;
      }

      flushTable();

      if (trimmed.startsWith("# ")) {
        flushParagraph();
        flushList();
        flushOrderedList();
        blocks.push(`<h4>${formatInline(trimmed.slice(2))}</h4>`);
        continue;
      }

      if (trimmed.startsWith("## ")) {
        flushParagraph();
        flushList();
        flushOrderedList();
        blocks.push(`<h4>${formatInline(trimmed.slice(3))}</h4>`);
        continue;
      }

      if (trimmed.startsWith("### ")) {
        flushParagraph();
        flushList();
        flushOrderedList();
        blocks.push(`<h5>${formatInline(trimmed.slice(4))}</h5>`);
        continue;
      }

      if (/^- /.test(trimmed)) {
        flushParagraph();
        flushOrderedList();
        listItems.push(trimmed.slice(2));
        continue;
      }

      if (/^\d+\.\s/.test(trimmed)) {
        flushParagraph();
        flushList();
        orderedItems.push(trimmed.replace(/^\d+\.\s/, ""));
        continue;
      }

      flushList();
      flushOrderedList();
      paragraph.push(trimmed);
    }

    flushParagraph();
    flushList();
    flushOrderedList();
    flushTable();

    return `
      <h3>Research Note</h3>
      <div class="loading">${escapeHtml(row.ticker)} / ${escapeHtml(row.name)}</div>
      ${renderFinancialSnapshotMarkup(row, { title: "Yahoo Financial Snapshot" })}
      <div class="report-body">${blocks.join("")}</div>
    `;
  }

  function renderFinancialSnapshotMarkup(row, { title } = {}) {
    const metrics = getMarketMetrics(row);
    const valuationRows = [
      ["Share Price", formatPrice(metrics.currentPrice, metrics.currency)],
      ["Market Cap", formatMarketCap(metrics.marketCap, metrics.currency)],
      ["Enterprise Value", formatMoneyCompact(metrics.enterpriseValue, metrics.currency)],
      ["P/E", formatRatio(metrics.trailingPE)],
      ["Forward P/E", formatRatio(metrics.forwardPE)],
      ["P/B", formatRatio(metrics.priceToBook)],
      ["EV/EBITDA", formatRatio(metrics.enterpriseToEbitda)],
      ["EV/Sales", formatRatio(metrics.enterpriseToRevenue ?? metrics.priceToSales)],
      ["Gross Margin", metrics.grossMargins == null ? "n/a" : formatPercent(metrics.grossMargins, 1)],
      ["Operating Margin", metrics.operatingMargins == null ? "n/a" : formatPercent(metrics.operatingMargins, 1)],
      ["LT EPS Growth", metrics.longTermGrowth == null ? "n/a" : formatPercent(metrics.longTermGrowth, 1)],
      ["TTM Revenue", formatMoneyCompact(metrics.revenueTtm, metrics.currency)],
      ["TTM EBITDA", formatMoneyCompact(metrics.ebitdaTtm, metrics.currency)],
      ["Cash", formatMoneyCompact(metrics.totalCash, metrics.currency)],
      ["Debt", formatMoneyCompact(metrics.totalDebt, metrics.currency)]
    ].filter(([, value]) => value !== "n/a");

    const historicalRows = (metrics.historicalFinancials || []).map((entry) => [
      entry.period,
      formatMoneyCompact(entry.revenue, metrics.currency),
      formatMoneyCompact(entry.ebitda, metrics.currency),
      formatMoneyCompact(entry.netIncome, metrics.currency),
      formatRatio(entry.eps)
    ]);

    const forwardRows = (metrics.forwardFinancials || []).map((entry) => [
      entry.period,
      formatMoneyCompact(entry.revenue, metrics.currency),
      entry.revenueGrowth == null ? "n/a" : formatPercent(entry.revenueGrowth, 1),
      formatRatio(entry.eps),
      entry.epsGrowth == null ? "n/a" : formatPercent(entry.epsGrowth, 1)
    ]);

    if (!valuationRows.length && !historicalRows.length && !forwardRows.length) {
      return "";
    }

    return `
      <div class="note note-table-wrap">
        ${title ? `<strong>${escapeHtml(title)}</strong>` : ""}
        ${valuationRows.length ? renderMetricTable(["Metric", "Value"], valuationRows) : ""}
        ${historicalRows.length ? renderMetricTable(["Actual", "Revenue", "EBITDA", "Net Income", "EPS"], historicalRows) : ""}
        ${forwardRows.length ? renderMetricTable(["Street View", "Revenue", "Rev YoY", "EPS", "EPS YoY"], forwardRows) : ""}
        <div class="fallback-caption">Source: Yahoo Finance. Live quote summary overrides the embedded snapshot when available; annual financials and analyst estimates fall back to the embedded data.</div>
      </div>
    `;
  }

  function renderMetricTable(headers, rows) {
    return `
      <table class="note-table">
        <thead>
          <tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) => `<tr>${row.map((cell) => `<td class="${cell === "n/a" ? "is-dim" : ""}">${escapeHtml(cell)}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  function formatBreakdownValue(value) {
    return Number.isFinite(value) ? value.toFixed(1) : "n/a";
  }

  function formatInline(value) {
    return escapeHtml(value)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function renderMarkdownTable(lines) {
    if (lines.length < 2) {
      return `<p>${formatInline(lines.join(" "))}</p>`;
    }

    const rows = lines.map(parseMarkdownTableRow).filter((row) => row.length);
    if (rows.length < 2) {
      return `<p>${formatInline(lines.join(" "))}</p>`;
    }

    const header = rows[0];
    const body = rows.slice(2);

    return `
      <div class="report-table-wrap">
        <table class="report-table">
          <thead>
            <tr>${header.map((cell) => `<th>${formatInline(cell)}</th>`).join("")}</tr>
          </thead>
          <tbody>
            ${body.map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function parseMarkdownTableRow(line) {
    return line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim());
  }

  function renderLocalChart(row) {
    const metrics = getMarketMetrics(row);
    const series = metrics.chartSeries || [];
    const candleSeries = metrics.chartCandleSeries || [];
    const volumeSeries = metrics.chartVolumeSeries || [];
    if (!series.length) {
      elements.chartHost.innerHTML = `
        <div class="fallback-chart">
          <div class="empty">No Yahoo snapshot is available for this ticker yet.</div>
          <div class="fallback-caption">Use the Yahoo or TradingView buttons above for the full external page.</div>
        </div>
      `;
      destroyDetailChart();
      return;
    }

    if (!window.LightweightCharts || typeof window.LightweightCharts.createChart !== "function") {
      renderSvgFallbackChart(row, series.map((point) => point.value));
      return;
    }

    elements.chartHost.innerHTML = `
      <div class="fallback-chart">
        <div class="tv-chart-canvas" id="tv-chart-canvas"></div>
        <div class="fallback-caption">
          Live Yahoo Finance candles rendered locally with TradingView Lightweight Charts, including daily volume and SMA 10, 20, 50, and 200 overlays.
        </div>
      </div>
    `;

    const canvas = document.getElementById("tv-chart-canvas");
    if (!canvas) {
      return;
    }

    destroyDetailChart();

    const LightweightCharts = window.LightweightCharts;
    detailChart = LightweightCharts.createChart(canvas, {
      width: canvas.clientWidth || elements.chartHost.clientWidth || 760,
      height: canvas.clientHeight || elements.chartHost.clientHeight || 420,
      layout: {
        background: { color: "#ffffff" },
        textColor: "#625749",
        fontFamily: "\"IBM Plex Mono\", ui-monospace, monospace"
      },
      grid: {
        vertLines: { color: "#f0e7d8" },
        horzLines: { color: "#f0e7d8" }
      },
      rightPriceScale: {
        borderColor: "#e0d5c3",
        scaleMargins: {
          top: 0.08,
          bottom: 0.28
        }
      },
      timeScale: {
        borderColor: "#e0d5c3",
        timeVisible: true,
        rightOffset: 4,
        minBarSpacing: 0.35
      },
      crosshair: {
        vertLine: { color: "#9a8b74", labelBackgroundColor: "#17140f" },
        horzLine: { color: "#9a8b74", labelBackgroundColor: "#17140f" }
      }
    });

    const priceSeries = detailChart.addCandlestickSeries({
      upColor: "#0f6c4b",
      downColor: "#c64a3d",
      borderUpColor: "#0f6c4b",
      borderDownColor: "#c64a3d",
      wickUpColor: "#0f6c4b",
      wickDownColor: "#c64a3d",
      priceLineVisible: false,
      lastValueVisible: true
    });
    priceSeries.setData(candleSeries.length ? candleSeries : series.map((point) => ({
      time: point.time,
      open: point.value,
      high: point.value,
      low: point.value,
      close: point.value
    })));

    if (volumeSeries.length) {
      const histogramSeries = detailChart.addHistogramSeries({
        priceFormat: { type: "volume" },
        priceScaleId: "",
        priceLineVisible: false,
        lastValueVisible: false
      });
      histogramSeries.priceScale().applyOptions({
        scaleMargins: {
          top: 0.74,
          bottom: 0.02
        }
      });
      histogramSeries.setData(volumeSeries);
    }

    addSmaSeries(detailChart, series, 10, "#ce8b2d");
    addSmaSeries(detailChart, series, 20, "#8262d8");
    addSmaSeries(detailChart, series, 50, "#277da1");
    addSmaSeries(detailChart, series, 200, "#7a8b2e");

    detailChart.timeScale().fitContent();
    detailChartResizeObserver = new ResizeObserver(() => {
      if (!detailChart) {
        return;
      }
      detailChart.applyOptions({
        width: canvas.clientWidth || elements.chartHost.clientWidth || 760,
        height: canvas.clientHeight || elements.chartHost.clientHeight || 420
      });
      detailChart.timeScale().fitContent();
    });
    detailChartResizeObserver.observe(canvas);
  }

  function destroyDetailChart() {
    if (detailChartResizeObserver) {
      detailChartResizeObserver.disconnect();
      detailChartResizeObserver = null;
    }
    if (detailChart) {
      detailChart.remove();
      detailChart = null;
    }
  }

  function addSmaSeries(chart, series, period, color) {
    const smaSeries = computeSmaSeries(series, period);
    if (!smaSeries.length) {
      return;
    }
    const lineSeries = chart.addLineSeries({
      color,
      lineWidth: 1.5,
      priceLineVisible: false,
      lastValueVisible: false
    });
    lineSeries.setData(smaSeries);
  }

  function computeSmaSeries(series, period) {
    if (!series.length || period <= 0) {
      return [];
    }
    const output = [];
    let rollingSum = 0;

    for (let index = 0; index < series.length; index += 1) {
      rollingSum += series[index].value;
      if (index >= period) {
        rollingSum -= series[index - period].value;
      }
      if (index >= period - 1) {
        output.push({
          time: series[index].time,
          value: Number((rollingSum / period).toFixed(2))
        });
      }
    }

    return output;
  }

  function renderSvgFallbackChart(row, values) {
    const width = 760;
    const height = 320;
    const leftPad = 10;
    const topPad = 10;
    const chartWidth = width - 20;
    const chartHeight = height - 20;
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const range = max - min || 1;

    const linePoints = values
      .map((value, index) => {
        const x = leftPad + (index / Math.max(values.length - 1, 1)) * chartWidth;
        const y = topPad + chartHeight - ((value - min) / range) * chartHeight;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    const areaPoints = `${leftPad},${topPad + chartHeight} ${linePoints} ${leftPad + chartWidth},${topPad + chartHeight}`;
    const stroke = values[values.length - 1] >= values[0] ? "#0f6c4b" : "#c64a3d";

    elements.chartHost.innerHTML = `
      <div class="fallback-chart">
        <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-label="Yahoo snapshot chart for ${escapeHtml(row.ticker)}">
          <defs>
            <linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stop-color="${stroke}" stop-opacity="0.28"></stop>
              <stop offset="100%" stop-color="${stroke}" stop-opacity="0.04"></stop>
            </linearGradient>
          </defs>
          <line x1="${leftPad}" y1="${topPad}" x2="${leftPad}" y2="${topPad + chartHeight}" stroke="#e9dec8" stroke-width="1"></line>
          <line x1="${leftPad}" y1="${topPad + chartHeight}" x2="${leftPad + chartWidth}" y2="${topPad + chartHeight}" stroke="#e9dec8" stroke-width="1"></line>
          <polygon fill="url(#chart-fill)" points="${areaPoints}"></polygon>
          <polyline fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${linePoints}"></polyline>
        </svg>
        <div class="fallback-caption">
          TradingView Lightweight Charts was unavailable, so this local SVG fallback is using the latest Yahoo Finance payload instead.
        </div>
      </div>
    `;
  }

  function renderSparkline(values) {
    if (!values || !values.length) {
      return '<span class="subcopy">n/a</span>';
    }

    const width = 118;
    const height = 34;
    const min = Math.min.apply(null, values);
    const max = Math.max.apply(null, values);
    const range = max - min || 1;

    const points = values
      .map((value, index) => {
        const x = (index / Math.max(values.length - 1, 1)) * width;
        const y = height - ((value - min) / range) * (height - 4) - 2;
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

    const endValue = values[values.length - 1];
    const startValue = values[0];
    const stroke = endValue >= startValue ? "#0f6c4b" : "#c64a3d";

    return `
      <svg class="sparkline" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
        <polyline fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" points="${points}"></polyline>
      </svg>
    `;
  }

  function renderMetricPill(value, options) {
    if (value == null) {
      return '<span class="metric-pill metric-neutral">n/a</span>';
    }

    const invert = Boolean(options && options.invert);
    const positive = invert ? value >= -8 : value >= 0;
    const negative = invert ? value < -20 : value < 0;
    const className = positive ? "metric-positive" : negative ? "metric-negative" : "metric-neutral";

    return `<span class="metric-pill ${className}">${escapeHtml(formatPercent(value))}</span>`;
  }

  function renderStrength(value) {
    if (value == null) {
      return '<span class="subcopy">n/a</span>';
    }

    return `
      <div class="strength">
        <span class="mono">${escapeHtml(String(value))}</span>
        <span class="strength-bar">
          <span class="strength-fill" style="width:${Math.max(0, Math.min(100, value))}%"></span>
        </span>
      </div>
    `;
  }

  function renderTrend(flag) {
    if (flag == null) {
      return '<span class="trend trend-flat">n/a</span>';
    }
    return flag
      ? '<span class="trend trend-up">UP</span>'
      : '<span class="trend trend-down">DN</span>';
  }

  function renderTrendLabel(row) {
    const metrics = getMarketMetrics(row);
    const labels = [];
    labels.push(`20D ${metrics.above20Sma ? "UP" : metrics.above20Sma == null ? "n/a" : "DN"}`);
    labels.push(`50D ${metrics.above50Sma ? "UP" : metrics.above50Sma == null ? "n/a" : "DN"}`);
    labels.push(`200D ${metrics.above200Sma ? "UP" : metrics.above200Sma == null ? "n/a" : "DN"}`);
    return labels.join(" / ");
  }

  function pickInitialTicker(rows, requested) {
    if (requested) {
      const matched = rows.find((row) => row.ticker.toUpperCase() === requested.toUpperCase());
      if (matched) {
        return matched.ticker;
      }
    }

    const ranked = rows
      .slice()
      .sort((left, right) => (right.marketMetrics.oneYearReturn || -Infinity) - (left.marketMetrics.oneYearReturn || -Infinity));
    return ranked[0] ? ranked[0].ticker : null;
  }

  function getYahooUrl(symbol) {
    return `https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}`;
  }

  function getTradingViewUrl(symbol) {
    return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`;
  }

  function getRowSymbol(row) {
    return row.yahooSymbol || row.ticker;
  }

  function getMarketMetrics(row) {
    const symbol = getRowSymbol(row);
    const quoteMetrics = liveState.quotesBySymbol.get(symbol)?.marketMetrics || {};
    const detailMetrics = liveState.detailsBySymbol.get(symbol)?.marketMetrics || {};
    return {
      ...(row.marketMetrics || {}),
      ...quoteMetrics,
      ...detailMetrics
    };
  }

  async function hydrateLiveQuotes() {
    if (liveState.quoteHydrated) {
      return;
    }
    liveState.quoteHydrated = true;

    const symbols = Array.from(new Set(data.rows.map(getRowSymbol).filter(Boolean)));
    const chunkSize = 40;
    const requests = [];

    for (let index = 0; index < symbols.length; index += chunkSize) {
      const chunk = symbols.slice(index, index + chunkSize);
      requests.push(fetchLiveQuoteChunk(chunk));
    }

    const chunks = await Promise.allSettled(requests);
    let updated = false;

    chunks.forEach((result) => {
      if (result.status !== "fulfilled") {
        return;
      }
      result.value.forEach((entry) => {
        if (!entry?.symbol) {
          return;
        }
        liveState.quotesBySymbol.set(entry.symbol, entry);
        updated = true;
      });
    });

    if (updated) {
      render();
    }
  }

  async function fetchLiveQuoteChunk(symbols) {
    if (!symbols.length) {
      return [];
    }

    const response = await fetch(`/api/market/quotes?symbols=${encodeURIComponent(symbols.join(","))}`);
    if (!response.ok) {
      throw new Error(`Quote request failed with status ${response.status}`);
    }
    const payload = await response.json();
    return Array.isArray(payload?.results) ? payload.results : [];
  }

  async function ensureLiveDetail(row) {
    const symbol = getRowSymbol(row);
    if (!symbol || liveState.detailsBySymbol.has(symbol) || liveState.detailRequests.has(symbol)) {
      return;
    }

    const request = fetch(`/api/market/detail?symbol=${encodeURIComponent(symbol)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Detail request failed with status ${response.status}`);
        }
        return response.json();
      })
      .then((payload) => {
        liveState.detailsBySymbol.set(symbol, payload);
        if (state.selectedTicker === row.ticker) {
          render();
        }
      })
      .catch((error) => {
        console.warn(`Live market detail failed for ${symbol}`, error);
      })
      .finally(() => {
        liveState.detailRequests.delete(symbol);
      });

    liveState.detailRequests.set(symbol, request);
  }

  function formatDateTime(date) {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Hong_Kong"
    }).format(date);
  }

  function formatPrice(value, currency) {
    if (value == null) {
      return "n/a";
    }

    const decimals = currency === "JPY" ? 0 : 2;

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals
      }).format(value);
    } catch (error) {
      return `${currency || ""} ${value.toFixed(decimals)}`.trim();
    }
  }

  function formatMarketCap(value, currency) {
    if (value == null) {
      return "n/a";
    }

    const compact = new Intl.NumberFormat("en-US", {
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);

    return `${compact} ${currency || ""}`.trim();
  }

  function formatMoneyCompact(value, currency) {
    return formatMarketCap(value, currency);
  }

  function formatRatio(value) {
    return value == null ? "n/a" : value.toFixed(2);
  }

  function formatPercent(value, digits) {
    if (value == null || Number.isNaN(value)) {
      return "n/a";
    }

    const precision = typeof digits === "number" ? digits : Math.abs(value) >= 100 ? 0 : 1;
    const prefix = value > 0 ? "+" : "";
    return `${prefix}${value.toFixed(precision)}%`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-US").format(value);
  }

  function average(values) {
    const valid = values.filter((value) => typeof value === "number" && !Number.isNaN(value));
    if (!valid.length) {
      return null;
    }
    return valid.reduce((sum, value) => sum + value, 0) / valid.length;
  }

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
