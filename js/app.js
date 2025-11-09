(function () {
  /**
   * app.js
   * Main app bootstrap: loads data + storage, renders UI, wires features and interactions.
   *
   * This file is intentionally defensive about StorageManager API names.
   */

  function mergeData(initialGames = [], savedGames = []) {
    // Merge by id: saved values override initial
    const map = new Map();
    (initialGames || []).forEach((g) => map.set(g.id, Object.assign({}, g)));
    (savedGames || []).forEach((g) => {
      map.set(g.id, Object.assign(map.get(g.id) || {}, g));
    });
    return Array.from(map.values());
  }

  // Storage adapter: detect common methods on window.StorageManager
  const StorageAdapter = (function () {
    const S = window.StorageManager || window.storage || null;
    return {
      async loadAll() {
        if (!S) return null;
        // Try common method names
        if (typeof S.load === "function") return await S.load();
        if (typeof S.getAllGames === "function") return await S.getAllGames();
        if (typeof S.getData === "function") return await S.getData();
        if (typeof S.get === "function") return await S.get("games");
        // fallback to direct property
        if (S.savedGames) return S.savedGames;
        return null;
      },
      async saveAll(payload) {
        if (!S) {
          console.warn("No StorageManager found - skipping save");
          return;
        }
        if (typeof S.save === "function") return await S.save(payload);
        if (typeof S.setData === "function") return await S.setData(payload);
        if (typeof S.set === "function") return await S.set("games", payload);
        if (typeof S.persist === "function") return await S.persist(payload);
        // try replacing a property
        try {
          S.savedGames = payload;
          return;
        } catch (e) {
          console.warn("StorageManager save fallback failed", e);
        }
      },
    };
  })();

  function render(state) {
    const list = document.getElementById("gc-games-list");
    if (!list) return;
    list.innerHTML = "";
    const filtered = window.Features && window.Features.applyFiltersTo ? window.Features.applyFiltersTo(state.games || []) : (state.games || []);
    if (!filtered.length) {
      list.appendChild(document.createElement("p")).textContent = "No games match your filters.";
      return;
    }
    filtered.forEach((g) => {
      const card = window.GameCard.create(g, {
        onStatusChange(id, newStatus) {
          const idx = (state.games || []).findIndex((x) => x.id === id);
          if (idx >= 0) state.games[idx].status = newStatus;
          StorageAdapter.saveAll(state.games);
          updateStats(state);
        },
        onToggleFavorite(id) {
          const idx = (state.games || []).findIndex((x) => x.id === id);
          if (idx >= 0) state.games[idx].favorite = !!state.games[idx].favorite;
          StorageAdapter.saveAll(state.games);
          updateStats(state);
        },
        onEdit(id) {
          // simple inline edit via prompt (keep lightweight)
          const idx = (state.games || []).findIndex((x) => x.id === id);
          if (idx < 0) return;
          const g = state.games[idx];
          const newName = prompt("Edit game name", g.name);
          if (newName !== null) {
            g.name = newName;
            StorageAdapter.saveAll(state.games);
            render(state);
          }
        },
      });
      list.appendChild(card);
    });
  }

  function updateStats(state) {
    try {
      const totalEl = document.querySelector("#gc-stats .gc-stat:nth-child(1) .gc-stat-number");
      const completedEl = document.querySelector("#gc-stats .gc-stat:nth-child(2) .gc-stat-number");
      const playingEl = document.querySelector("#gc-stats .gc-stat:nth-child(3) .gc-stat-number");
      const favEl = document.querySelector("#gc-stats .gc-stat:nth-child(4) .gc-stat-number");
      const games = state.games || [];
      if (totalEl) totalEl.textContent = String(games.length);
      if (completedEl) completedEl.textContent = String(games.filter((g) => g.status === "completed").length);
      if (playingEl) playingEl.textContent = String(games.filter((g) => g.status === "playing").length);
      if (favEl) favEl.textContent = String(games.filter((g) => !!g.favorite).length);
    } catch (e) {
      console.warn("updateStats error", e);
    }
  }

  async function bootstrap() {
    // mount UI shell
    const app = document.getElementById("app") || document.body;
    app.innerHTML = ""; // assume index.html has an #app or simply fill body

    const header = window.UIComponents && window.UIComponents.createHeader ? window.UIComponents.createHeader() : document.createElement("header");
    const stats = window.UIComponents && window.UIComponents.createStatsContainer ? window.UIComponents.createStatsContainer() : document.createElement("section");
    const filters = window.UIComponents && window.UIComponents.createFiltersContainer ? window.UIComponents.createFiltersContainer((window.CONFIG && window.CONFIG.TIERS) || [], []) : document.createElement("section");
    const modal = window.UIComponents && window.UIComponents.createModal ? window.UIComponents.createModal() : document.createElement("div");
    const gamesList = document.createElement("section");
    gamesList.id = "gc-games-list";
    gamesList.className = "gc-games-list";

    app.appendChild(header);
    app.appendChild(stats);
    app.appendChild(filters);
    app.appendChild(gamesList);
    app.appendChild(modal);

    // load initial data from data.js (global GAMES or window.GAMES)
    const initialGames = (window.GAMES && Array.isArray(window.GAMES) ? window.GAMES : (window.DATA_GAMES || []));

    // load saved games (adapter)
    let saved = null;
    try {
      saved = await StorageAdapter.loadAll();
    } catch (e) {
      console.warn("Failed to load saved games", e);
    }

    const merged = mergeData(initialGames, saved || []);
    const state = { games: merged };

    // populate genres and tier lists in filters if possible
    const genres = Array.from(new Set((state.games || []).map((g) => g.genre).filter(Boolean)));
    // Rebuild filters container using available tiers and genres
    const newFilters = window.UIComponents && window.UIComponents.createFiltersContainer ? window.UIComponents.createFiltersContainer((window.CONFIG && window.CONFIG.TIERS ? Object.keys(window.CONFIG.TIERS).map((k) => ({ key: k, label: window.CONFIG.TIERS[k].label || k })) : []), genres) : null;
    if (newFilters) {
      const old = document.getElementById("gc-filters");
      if (old && old.parentNode) old.parentNode.replaceChild(newFilters, old);
    }

    // init features
    window.Features && window.Features.init && window.Features.init({
      getState: () => state,
      setState: async (s) => {
        if (s) {
          state.games = s.games || s;
          await StorageAdapter.saveAll(state.games);
        }
      },
      render: () => render(state),
    });

    // populate dynamic filter options
    if (window.Features && window.Features.populateGenres) window.Features.populateGenres();

    // initial render
    updateStats(state);
    render(state);

    // expose re-render for other modules
    window.App = {
      state,
      render: () => render(state),
      updateStats: () => updateStats(state),
      save: () => StorageAdapter.saveAll(state.games),
    };

    // wire install button (populated by pwa-init)
    const installBtn = document.getElementById("gc-install-btn");
    if (installBtn && window.pwaInstallPrompt) {
      installBtn.classList.remove("gc-hidden");
      installBtn.addEventListener("click", async () => {
        try {
          await window.pwaInstallPrompt.prompt();
          // After prompt, check userChoice if available
          const choice = await window.pwaInstallPrompt.userChoice;
          console.log("pwa install choice", choice);
        } catch (e) {
          console.warn("Install prompt failed", e);
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", bootstrap);
})();
