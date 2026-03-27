(function () {
  const data = window.OPTICS_DASHBOARD_DATA;
  const requestedTicker = new URLSearchParams(window.location.search).get("ticker");
  const noteCache = new Map();
  let noteRequestToken = 0;
  let activeModalRow = null;

  if (!data || !Array.isArray(data.rows)) {
    document.getElementById("segments").innerHTML = '<div class="empty">Dashboard data is not available yet.</div>';
    document.getElementById("detail-top").innerHTML = '<div class="empty">No row selected.</div>';
    return;
  }

  const state = {
    search: "",
    sortKey: "oneYearReturn",
    sortDirection: "desc",
    status: "all",
    selectedTicker: pickInitialTicker(data.rows, requestedTicker)
  };

  const elements = {
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
  render();

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
        (row) => row.marketMetrics.marketCap,
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
        return row.marketMetrics.oneYearReturn;
      case "relativeStrength":
        return row.relativeStrength;
      case "currentPrice":
        return row.marketMetrics.currentPrice;
      case "marketCap":
        return row.marketMetrics.marketCap;
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
    const visibleAvgReturn = average(filteredRows.map((row) => row.marketMetrics.oneYearReturn));
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
        note: "Computed from the embedded Yahoo Finance yearly chart snapshot."
      },
      {
        label: "Avg Optics %",
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
      ? " Choking power uses a 25-point rubric: structure, moat durability, optics purity, and pricing power; ties break on optics exposure and market cap."
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
        const avgReturn = average(group.rows.map((row) => row.marketMetrics.oneYearReturn));
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
                <span class="badge">Avg optics ${avgOptics == null ? "n/a" : `${avgOptics.toFixed(0)}%`}</span>
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
                    <th>Optics %</th>
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
    const currentPrice = formatPrice(row.marketMetrics.currentPrice, row.marketMetrics.currency);
    const marketCap = formatMarketCap(row.marketMetrics.marketCap, row.marketMetrics.currency);
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
        <td class="mono">${escapeHtml(formatRatio(row.marketMetrics.priceToSales))}</td>
        <td class="mono">${escapeHtml(formatRatio(row.marketMetrics.trailingPE))}</td>
        <td>${renderSparkline(row.marketMetrics.sparkline)}</td>
        <td>${renderMetricPill(row.marketMetrics.oneMonthReturn)}</td>
        <td>${renderMetricPill(row.marketMetrics.ytdReturn)}</td>
        <td>${renderMetricPill(row.marketMetrics.oneYearReturn)}</td>
        <td>${renderMetricPill(row.marketMetrics.distanceFromHigh, { invert: true })}</td>
        <td>${renderStrength(row.relativeStrength)}</td>
        <td>${renderTrend(row.marketMetrics.above20Sma)}</td>
        <td>${renderTrend(row.marketMetrics.above50Sma)}</td>
        <td>${renderTrend(row.marketMetrics.above200Sma)}</td>
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
          <span class="value">${escapeHtml(formatPrice(row.marketMetrics.currentPrice, row.marketMetrics.currency))}</span>
          <span class="small">${escapeHtml(formatMarketCap(row.marketMetrics.marketCap, row.marketMetrics.currency))}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Optics Exposure</span>
          <span class="value">${row.opticsPct == null ? "n/a" : `${escapeHtml(row.opticsPct.toFixed(0))}%`}</span>
          <span class="small">${escapeHtml(row.share || row.market || "n/a")}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Momentum</span>
          <span class="value">${escapeHtml(formatPercent(row.marketMetrics.oneYearReturn))}</span>
          <span class="small">1M ${escapeHtml(formatPercent(row.marketMetrics.oneMonthReturn))} / YTD ${escapeHtml(formatPercent(row.marketMetrics.ytdReturn))}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Choking Power</span>
          <span class="value">${row.chokepointScore == null ? "n/a" : `${escapeHtml(row.chokepointScore.toFixed(1))}/25`}</span>
          <span class="small">${escapeHtml(row.chokepointTier || "n/a")} / ${escapeHtml(row.chokepointStructure || "n/a")}</span>
        </article>
        <article class="detail-stat">
          <span class="label">Trend Setup</span>
          <span class="value">${escapeHtml(renderTrendLabel(row))}</span>
          <span class="small">RS ${row.relativeStrength == null ? "n/a" : `${row.relativeStrength}/100`} / optics ${row.opticsPct == null ? "n/a" : `${row.opticsPct.toFixed(0)}%`}</span>
        </article>
      </div>
      <div class="detail-copy">
        ${row.oneLiner ? `<p class="note"><strong>Research view:</strong> ${escapeHtml(row.oneLiner)}</p>` : ""}
        ${row.thesis ? `<p class="note"><strong>Thesis:</strong> ${escapeHtml(row.thesis)}</p>` : ""}
        ${row.catalystShort ? `<p class="note"><strong>Catalyst:</strong> ${escapeHtml(row.catalystShort)}</p>` : ""}
        <p class="note"><strong>Choking power:</strong> ${row.chokepointScore == null ? "n/a" : `${escapeHtml(row.chokepointScore.toFixed(1))}/25`} (${escapeHtml(row.chokepointTier || "n/a")}). <strong>Structure:</strong> ${escapeHtml(row.chokepointStructure || "n/a")}. <strong>Moat:</strong> ${escapeHtml(row.moat || "n/a")}.</p>
        ${row.chokepointBreakdown ? `<p class="note"><strong>Rubric:</strong> structure ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.structuralControl))}/12, moat ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.moatDurability))}/5, optics ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.opticsPurity))}/5, pricing ${escapeHtml(formatBreakdownValue(row.chokepointBreakdown.pricingPower))}/3.</p>` : ""}
        <p class="note"><strong>Risk:</strong> ${escapeHtml(row.riskLevel || "n/a")}. <strong>CHIPS status:</strong> ${escapeHtml(row.chipsStatus || "n/a")}${row.chipsDetail ? ` - ${escapeHtml(row.chipsDetail)}` : ""}</p>
      </div>
    `;

    renderLocalChart(row);
  }

  function openNoteModal(row) {
    activeModalRow = row;
    elements.noteModal.classList.add("open");
    elements.noteModal.setAttribute("aria-hidden", "false");
    elements.noteModalTitle.textContent = `${row.ticker} Research Note`;
    elements.noteModalSubtitle.textContent = row.name;
    elements.noteModalLink.href = row.reportPath || "#";
    renderResearchNote(row);
  }

  function closeNoteModal() {
    elements.noteModal.classList.remove("open");
    elements.noteModal.setAttribute("aria-hidden", "true");
  }

  async function renderResearchNote(row) {
    if (!row.reportPath) {
      elements.researchNotePanel.innerHTML = `
        <h3>Research Note</h3>
        <div class="loading">No local research note is linked to this company yet.</div>
      `;
      return;
    }

    const requestToken = ++noteRequestToken;
    elements.researchNotePanel.innerHTML = `
      <h3>Research Note</h3>
      <div class="loading">Loading ${escapeHtml(row.reportPath)}...</div>
    `;

    if (noteCache.has(row.reportPath)) {
      if (requestToken === noteRequestToken) {
        const markdown = noteCache.get(row.reportPath);
        if (activeModalRow?.ticker !== row.ticker) {
          return;
        }
        elements.researchNotePanel.innerHTML = renderResearchNoteMarkup(markdown, row);
      }
      return;
    }

    try {
      const response = await fetch(row.reportPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const markdown = await response.text();
      noteCache.set(row.reportPath, markdown);

      if (requestToken === noteRequestToken) {
        if (activeModalRow?.ticker !== row.ticker) {
          return;
        }
        elements.researchNotePanel.innerHTML = renderResearchNoteMarkup(markdown, row);
      }
    } catch (error) {
      if (requestToken === noteRequestToken) {
        elements.researchNotePanel.innerHTML = `
          <h3>Research Note</h3>
          <div class="loading">Could not load ${escapeHtml(row.reportPath)}. Use the research note link above.</div>
        `;
      }
    }
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
      <div class="report-body">${blocks.join("")}</div>
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
    const values = row.marketMetrics.sparkline || [];
    if (!values.length) {
      elements.chartHost.innerHTML = `
        <div class="fallback-chart">
          <div class="empty">No Yahoo snapshot is available for this ticker yet.</div>
          <div class="fallback-caption">Use the Yahoo or TradingView buttons above for the full external page.</div>
        </div>
      `;
      return;
    }

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
          Local 1-year chart built from the embedded Yahoo Finance snapshot. Use the buttons above to open the full Yahoo or TradingView page.
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
    const labels = [];
    labels.push(`20D ${row.marketMetrics.above20Sma ? "UP" : row.marketMetrics.above20Sma == null ? "n/a" : "DN"}`);
    labels.push(`50D ${row.marketMetrics.above50Sma ? "UP" : row.marketMetrics.above50Sma == null ? "n/a" : "DN"}`);
    labels.push(`200D ${row.marketMetrics.above200Sma ? "UP" : row.marketMetrics.above200Sma == null ? "n/a" : "DN"}`);
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
