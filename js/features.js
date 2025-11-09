(function () {
  /**
   * features.js
   * Implements search, filter and basic add-game wiring.
   *
   * Relies on:
   * - Storage APIs (adapted at runtime)
   * - UI area ids:
   *   - #gc-search-container
   *   - #gc-filters
   *   - #gc-games-list
   *
   * Exposes window.Features.init(options)
   *
   * options:
   *  - getState(): ()=>state object { games: [...] }
   *  - setState(newState): ()=>Promise
   *  - render(): ()=>void  (called after filters change)
   */

  function safeCall(fn) {
    try {
      return fn();
    } catch (e) {
      console.warn("features.js safeCall error", e);
    }
  }

  function createSearchInput(onChange) {
    const input = document.createElement("input");
    input.type = "search";
    input.placeholder = "Search games...";
    input.className = "gc-search";
    input.addEventListener("input", (e) => onChange(e.target.value));
    return input;
  }

  function extractGenres(games) {
    const set = new Set();
    (games || []).forEach((g) => {
      if (g.genre) set.add(g.genre);
    });
    return Array.from(set).sort();
  }

  function init({ getState, setState, render }) {
    const searchContainer = document.getElementById("gc-search-container");
    const filtersContainer = document.getElementById("gc-filters");
    const gamesList = document.getElementById("gc-games-list");

    let currentQuery = "";
    let currentTier = "";
    let currentGenre = "";
    let currentSort = "default";

    function applyFilters(games) {
      let out = (games || []).slice();
      if (currentQuery) {
        const q = currentQuery.toLowerCase();
        out = out.filter((g) => (g.name || "").toLowerCase().includes(q) || (g.desc || "").toLowerCase().includes(q));
      }
      if (currentTier) out = out.filter((g) => g.tier === currentTier);
      if (currentGenre) out = out.filter((g) => g.genre === currentGenre);

      if (currentSort === "name") out.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      else if (currentSort === "hours") out.sort((a, b) => parseFloat(a.hours) - parseFloat(b.hours));
      else if (currentSort === "priority") out.sort((a, b) => {
        const map = { HIGH: 1, MEDIUM: 2, LOW: 3 };
        return (map[a.priority] || 99) - (map[b.priority] || 99);
      });

      return out;
    }

    // mount search
    if (searchContainer) {
      const input = createSearchInput((value) => {
        currentQuery = value;
        safeCall(render);
      });
      searchContainer.innerHTML = "";
      searchContainer.appendChild(input);
    }

    // mount filters (tier and genre selects are expected to exist)
    if (filtersContainer) {
      // If filters created by UIComponents are present, wire events
      const tierEl = document.getElementById("gc-filter-tier");
      const genreEl = document.getElementById("gc-filter-genre");
      const sortEl = document.getElementById("gc-sort-by");

      if (tierEl) tierEl.addEventListener("change", (e) => {
        currentTier = e.target.value || "";
        safeCall(render);
      });
      if (genreEl) genreEl.addEventListener("change", (e) => {
        currentGenre = e.target.value || "";
        safeCall(render);
      });
      if (sortEl) sortEl.addEventListener("change", (e) => {
        currentSort = e.target.value || "default";
        safeCall(render);
      });

      // Provide a method to populate genres dynamically
      window.Features = window.Features || {};
      window.Features.populateGenres = function () {
        const state = getState();
        const genres = extractGenres(state.games || []);
        const genreSel = document.getElementById("gc-filter-genre");
        if (!genreSel) return;
        // clear existing (keep first option)
        const first = genreSel.querySelector("option");
        genreSel.innerHTML = "";
        if (first) genreSel.appendChild(first);
        genres.forEach((g) => genreSel.appendChild(Object.assign(document.createElement("option"), { value: g, textContent: g })));
      };
    }

    // expose quick filter application
    window.Features = Object.assign(window.Features || {}, {
      applyFiltersTo(games) {
        return applyFilters(games);
      },
      getCurrentFilters() {
        return { q: currentQuery, tier: currentTier, genre: currentGenre, sort: currentSort };
      },
      setQuery(q) {
        currentQuery = q || "";
        safeCall(render);
      },
      reset() {
        currentQuery = "";
        currentTier = "";
        currentGenre = "";
        currentSort = "default";
        const tierEl = document.getElementById("gc-filter-tier");
        const genreEl = document.getElementById("gc-filter-genre");
        const sortEl = document.getElementById("gc-sort-by");
        if (tierEl) tierEl.value = "";
        if (genreEl) genreEl.value = "";
        if (sortEl) sortEl.value = "default";
        safeCall(render);
      },
    });

    // basic add-game form (non-serialized, simple UI)
    // If #gc-add-game exists, wire it
    const addForm = document.getElementById("gc-add-game");
    if (addForm) {
      addForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(addForm);
        const newGame = {
          id: Date.now(),
          name: fd.get("name"),
          genre: fd.get("genre"),
          fps: fd.get("fps") || "",
          tier: fd.get("tier") || "",
          priority: fd.get("priority") || "LOW",
          trailer: fd.get("trailer") || "",
          desc: fd.get("desc") || "",
          hours: fd.get("hours") || "",
          icon: fd.get("icon") || "gamepad",
          status: "not_downloaded",
        };
        const state = getState();
        state.games = state.games || [];
        state.games.push(newGame);
        setState(state).then(() => {
          if (window.Features.populateGenres) window.Features.populateGenres();
          safeCall(render);
          addForm.reset();
        });
      });
    }
  }

  window.Features = window.Features || {};
  window.Features.init = init;
})();
