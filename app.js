document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search");
  const status = document.getElementById("search-status");
  const buildings = Array.from(document.querySelectorAll("#building-list li"));

  if (!form || !input || !status || buildings.length === 0) {
    return;
  }

  const normalize = (value) =>
    value
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const compact = (value) => value.replace(/\s+/g, "");

  const applyFilter = () => {
    const keyword = normalize(input.value);
    const compactKeyword = compact(keyword);
    let visibleCount = 0;

    buildings.forEach((item) => {
      const name = normalize(item.dataset.name || "");
      const keywords = normalize(item.dataset.keywords || "");
      const searchable = `${name} ${keywords}`;
      const compactSearchable = compact(searchable);
      const matched =
        !keyword ||
        searchable.includes(keyword) ||
        compactSearchable.includes(compactKeyword);

      item.hidden = !matched;
      item.classList.toggle("matched", matched && keyword.length > 0);

      if (matched) {
        visibleCount += 1;
      }
    });

    if (!keyword) {
      status.textContent = "キーワードを入力すると候補を絞り込めます。";
      return;
    }

    if (visibleCount === 0) {
      status.textContent = `「${input.value}」に一致する施設は見つかりませんでした。`;
      return;
    }

    status.textContent = `「${input.value.trim()}」に一致する施設: ${visibleCount}件`;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilter();
  });

  input.addEventListener("input", applyFilter);

  applyFilter();
});