(function () {
  /**
   * game-card.js
   * Responsible for rendering an individual game card and wiring simple interactions.
   *
   * Depends on global:
   * - CONFIG (for STATUS_CYCLE)
   * - ICONS or Icon(name)
   *
   * Exposes window.GameCard.create(game, handlers)
   *
   * handlers: {
   *   onStatusChange(gameId, newStatus),
   *   onToggleFavorite(gameId),
   *   onEdit(gameId)
   * }
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

  function getIconElement(name) {
    // Try common patterns: global ICONS object or Icon(name) function
    if (window.ICONS && window.ICONS[name]) {
      const wrap = document.createElement("div");
      wrap.className = "gc-icon-svg";
      wrap.innerHTML = window.ICONS[name];
      return wrap;
    }
    if (typeof window.Icon === "function") {
      try {
        return window.Icon({ name });
      } catch (e) {}
    }
    // fallback: emoji or blank
    const span = el("span", { class: "gc-icon-emoji", text: name || "🎮" });
    return span;
  }

  function cycleStatus(current) {
    const cycle = (window.CONFIG && window.CONFIG.STATUS_CYCLE) || ["not_downloaded", "downloaded", "playing", "completed", "favorite"];
    const idx = cycle.indexOf(current);
    return cycle[(idx + 1) % cycle.length];
  }

  function create(game = {}, handlers = {}) {
    const root = el("article", { class: "gc-game-card", "data-id": game.id });

    // header: icon + title + fps
    const header = el("div", { class: "gc-game-card-header" }, [
      getIconElement(game.icon || "gamepad"),
      el("div", { class: "gc-game-meta" }, [
        el("h3", { class: "gc-game-title", text: game.name || "Untitled" }),
        el("div", { class: "gc-game-sub", text: `${game.genre || ""} • ${game.fps || ""}` }),
      ]),
    ]);

    // description
    const desc = el("p", { class: "gc-game-desc", text: game.desc || "" });

    // footer: hours, priority, status button, actions
    const hours = el("span", { class: "gc-badge gc-badge-hours", text: game.hours || "" });
    const priority = el("span", { class: `gc-badge gc-priority-${(game.priority || "low").toLowerCase()}`, text: (game.priority || "").toUpperCase() });

    const statusBtn = el("button", {
      class: `gc-btn gc-status-btn gc-status-${game.status || "not_downloaded"}`,
      text: (game.status || "not_downloaded"),
      onclick: () => {
        const newStatus = cycleStatus(game.status || "");
        game.status = newStatus;
        statusBtn.textContent = newStatus;
        statusBtn.className = `gc-btn gc-status-btn gc-status-${newStatus}`;
        if (typeof handlers.onStatusChange === "function") handlers.onStatusChange(game.id, newStatus);
      },
    });

    const favoriteBtn = el("button", {
      class: `gc-btn gc-btn-ghost gc-fav-btn ${game.favorite ? "is-fav" : ""}`,
      text: game.favorite ? "★" : "☆",
      onclick: () => {
        game.favorite = !game.favorite;
        favoriteBtn.textContent = game.favorite ? "★" : "☆";
        favoriteBtn.classList.toggle("is-fav", !!game.favorite);
        if (typeof handlers.onToggleFavorite === "function") handlers.onToggleFavorite(game.id);
      },
    });

    const editBtn = el("button", {
      class: `gc-btn gc-btn-ghost gc-edit-btn`,
      text: "Edit",
      onclick: () => {
        if (typeof handlers.onEdit === "function") handlers.onEdit(game.id);
      },
    });

    const footer = el("div", { class: "gc-game-card-footer" }, [hours, priority, statusBtn, favoriteBtn, editBtn]);

    root.appendChild(header);
    root.appendChild(desc);
    root.appendChild(footer);

    return root;
  }

  window.GameCard = {
    create,
  };
})();
