(function () {
  /**
   * ui-components.js
   * Reusable UI pieces: header, stats, filters, modals
   *
   * Exposes window.UIComponents with:
   * - createHeader()
   * - createStatsContainer()
   * - createFiltersContainer(tiers, genres)
   * - createModal()
   */

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const k in attrs) {
      if (k === "class") node.className = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else if (k.startsWith("on") && typeof attrs[k] === "function") {
        node.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
      } else node.setAttribute(k, attrs[k]);
    }
    (Array.isArray(children) ? children : [children]).forEach((c) => {
      if (c == null) return;
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else node.appendChild(c);
    });
    return node;
  }

  function createHeader(appName = (window.CONFIG && window.CONFIG.APP_NAME) || "Gaming Checklist") {
    const header = el("header", { class: "gc-header" }, [
      el("div", { class: "gc-header-left" }, [
        el("h1", { class: "gc-title", text: appName }),
        el("p", { class: "gc-subtitle", text: "Modular gaming checklist" }),
      ]),
      el("div", { class: "gc-header-right" }, [
        // Search will be mounted into this container by features.js
        el("div", { id: "gc-search-container", class: "gc-search-container" }),
        // Install PWA button placeholder
        el("button", {
          id: "gc-install-btn",
          class: "gc-btn gc-btn-primary gc-hidden",
          text: "Install",
        }),
      ]),
    ]);
    return header;
  }

  function createStatsContainer() {
    const container = el("section", { id: "gc-stats", class: "gc-stats" }, [
      el("div", { class: "gc-stats-grid" }, [
        el("div", { class: "gc-stat" }, [el("span", { class: "gc-stat-number", text: "0" }), el("span", { class: "gc-stat-label", text: "Games" })]),
        el("div", { class: "gc-stat" }, [el("span", { class: "gc-stat-number", text: "0" }), el("span", { class: "gc-stat-label", text: "Completed" })]),
        el("div", { class: "gc-stat" }, [el("span", { class: "gc-stat-number", text: "0" }), el("span", { class: "gc-stat-label", text: "Playing" })]),
        el("div", { class: "gc-stat" }, [el("span", { class: "gc-stat-number", text: "0" }), el("span", { class: "gc-stat-label", text: "Favorites" })]),
      ]),
    ]);
    return container;
  }

  function createFiltersContainer(tiers = [], genres = []) {
    // tier and genre selects + sort
    const tierSelect = el("select", { id: "gc-filter-tier", class: "gc-select" }, [el("option", { value: "", text: "All Tiers" })]);
    tiers.forEach((t) => {
      const value = typeof t === "string" ? t : t.key;
      const label = typeof t === "string" ? t : t.label || t.key;
      tierSelect.appendChild(el("option", { value, text: label }));
    });

    const genreSelect = el("select", { id: "gc-filter-genre", class: "gc-select" }, [el("option", { value: "", text: "All Genres" })]);
    genres.forEach((g) => {
      genreSelect.appendChild(el("option", { value: g, text: g }));
    });

    const sortSelect = el("select", { id: "gc-sort-by", class: "gc-select" }, [
      el("option", { value: "default", text: "Sort: Default" }),
      el("option", { value: "name", text: "Name (A → Z)" }),
      el("option", { value: "hours", text: "Hours (est.)" }),
      el("option", { value: "priority", text: "Priority" }),
    ]);

    const container = el("section", { id: "gc-filters", class: "gc-filters" }, [
      el("div", { class: "gc-filter-row" }, [tierSelect, genreSelect, sortSelect]),
    ]);
    return container;
  }

  function createModal() {
    const overlay = el("div", { class: "gc-modal-overlay gc-hidden", id: "gc-modal-overlay" });
    const dialog = el("div", { class: "gc-modal", id: "gc-modal" }, [
      el("button", { class: "gc-modal-close", id: "gc-modal-close", text: "✕" }),
      el("div", { id: "gc-modal-content" }),
    ]);
    overlay.appendChild(dialog);
    // close handling
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.classList.add("gc-hidden");
    });
    dialog.querySelector("#gc-modal-close").addEventListener("click", () => overlay.classList.add("gc-hidden"));
    return overlay;
  }

  window.UIComponents = {
    createHeader,
    createStatsContainer,
    createFiltersContainer,
    createModal,
  };
})();
