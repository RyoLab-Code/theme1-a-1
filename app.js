document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search");
  const status = document.getElementById("search-status");
  const buildings = Array.from(document.querySelectorAll("#building-list li"));

  if (!form || !input || !status || buildings.length === 0) {
    return;
  }

  // 全角・半角、カタカナ・ひらがなの違いをそろえる（「コンビニ」でも「こんびに」でも見つかるように）
  const normalize = (value) =>
    value
      .normalize("NFKC")
      .trim()
      .toLowerCase()
      .replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
      .replace(/\s+/g, " ");

  const compact = (value) => value.replace(/\s+/g, "");

  const applyFilter = () => {
    const keyword = normalize(input.value);
    const compactKeyword = compact(keyword);
    let visibleCount = 0;
    let lastMatched = null;

    buildings.forEach((item) => {
      const no = item.dataset.no || "";
      // 建物名・読み方・施設名（画面に出ている文字）をまとめて検索の対象にする
      const searchable = normalize(`${item.dataset.name} ${item.dataset.keywords} ${item.textContent}`);
      const compactSearchable = compact(searchable);
      const matched =
        !keyword ||
        keyword === no ||
        (!/^\d+$/.test(keyword) && (searchable.includes(keyword) || compactSearchable.includes(compactKeyword)));

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

    status.textContent = `「${input.value.trim()}」に一致する建物: ${visibleCount}件（押すと地図に場所が出ます）`;
    // 1件だけのときは、その建物を返す
    return visibleCount === 1 ? lastMatched : null;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilter();
  });

  input.addEventListener("input", applyFilter);

  applyFilter();
});