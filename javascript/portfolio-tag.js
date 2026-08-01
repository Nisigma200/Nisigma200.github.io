/**
 * カードのタグに合わせて表示・非表示を切り替える
 * @param {string} target - フィルタリングするカテゴリ名
 */
function filterSelection(target) {
    const cards = Array.from(document.querySelectorAll(".card-blog-a"));
    const normalizedTarget = (target || "all").toLowerCase();

    cards.forEach((card, index) => {
        const tags = (card.dataset.tags || "")
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
        const matches = normalizedTarget === "all" || tags.includes(normalizedTarget);

        card.style.setProperty("--card-delay", `${index * 45}ms`);

        if (matches) {
            card.classList.remove("is-hidden");
            requestAnimationFrame(() => {
                card.classList.add("is-visible");
            });
        } else {
            card.classList.remove("is-visible");
            card.classList.add("is-hidden");
        }
    });
}

/**
 * フィルタボタンのアクティブ表示（色など）を更新する
 * @param {HTMLElement} activeBtn - クリックされたボタン
 */
const updateButtonUI = (activeBtn) => {
    const allButtons = document.querySelectorAll(".filter-btn");
    allButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
    });

    activeBtn.classList.add("active");
    activeBtn.setAttribute("aria-pressed", "true");
};

/** 文書の読み込み完了時に実行する初期設定 */
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".card-blog-a");

    cards.forEach((card) => {
        card.classList.remove("is-hidden");
        card.classList.add("is-visible");
    });

    filterButtons.forEach((btn) => {
        btn.setAttribute("type", "button");
        btn.setAttribute("aria-pressed", btn.classList.contains("active") ? "true" : "false");

        btn.addEventListener("click", () => {
            const target = btn.dataset.target || "all";
            filterSelection(target);
            updateButtonUI(btn);
        });
    });
});
