/**
 * カテゴリの選択状態に合わせて、カードの表示・非表示クラスを切り替える
 * @param {string} target - フィルタリングするカテゴリ名
 */
function filterSelection(target) {
    const cards = Array.from(document.querySelectorAll(".card-blog-a"));
    const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden"));
    const beforeRects = getCardRects(visibleCards);

    cards.forEach((card) => {
        const tags = (card.dataset.tags || "")
            .split(",")
            .map((tag) => tag.trim().toLowerCase())
            .filter(Boolean);
        const matches = target === "all" || tags.includes(target.toLowerCase());
        card.classList.toggle("is-hidden", !matches);
    });

    const remainingCards = cards.filter((card) => !card.classList.contains("is-hidden"));
    animateCardMove(remainingCards, beforeRects);
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

/**
 * 現在のカード位置を取得する
 * @param {HTMLElement[]} cards
 * @returns {Map<HTMLElement, DOMRect>}
 */
function getCardRects(cards) {
    return new Map(cards.map((card) => [card, card.getBoundingClientRect()]));
}

/**
 * FLIP によるカード移動アニメーション
 * @param {HTMLElement[]} cards
 * @param {Map<HTMLElement, DOMRect>} beforeRects
 */
function animateCardMove(cards, beforeRects) {
    cards.forEach((card) => {
        const before = beforeRects.get(card);
        if (!before) return;

        const after = card.getBoundingClientRect();
        const deltaX = before.left - after.left;
        const deltaY = before.top - after.top;

        if (deltaX === 0 && deltaY === 0) return;

        card.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        card.style.transition = "transform 0s";

        requestAnimationFrame(() => {
            card.style.transition = "transform 0.4s ease";
            card.style.transform = "";
            const onTransitionEnd = (event) => {
                if (event.propertyName === "transform") {
                    card.style.transition = "";
                    card.removeEventListener("transitionend", onTransitionEnd);
                }
            };
            card.addEventListener("transitionend", onTransitionEnd);
        });
    });
}

/** 文書の読み込み完了時に実行する初期設定 */
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");

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
