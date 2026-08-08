const pagetopBtn = document.querySelector("#page-top");
pagetopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

/** 現在の実行環境におけるフル西暦（例：2026, 2027...） */
const currentYear = new Date().getFullYear();

// 実行時の年が、あらかじめ設定した開始年よりも進んでいるかを確認する
if (currentYear > 2026) {
    /** 画面上の年を表示させたい要素（IDが copyright-year のもの） */
    const displayTargetElement = document.getElementById("copyright-year");

    // 指定した要素が存在する場合のみ、表示内容を更新する
    if (displayTargetElement) {
        // 開始年（2026）の後に、ハイフンと現在の年を連結して表示を上書きする
        displayTargetElement.textContent = " - " + currentYear;
    }
}

/** 目次生成 */
/** DOMが完全に読み込まれてから処理を実行する */
document.addEventListener("DOMContentLoaded", () => {
    /** 目次を挿入する親要素 */
    const tocContainer = document.getElementById("toc");

    /** 目次コンテナが存在しない場合は処理を終了する */
    if (!tocContainer) {
        return;
    }

    /** 本文エリア内のすべての見出し要素を取得する */
    const headings = document.querySelectorAll("h2, h3");

    if (headings.length > 0) {
        /** 目次用のリスト要素を作成する */
        const ul = document.createElement("ul");

        headings.forEach((heading, index) => {
            /** 各見出しに一意のIDが付与されていない場合、自動でIDを設定する */
            if (!heading.id) {
                heading.id = "heading-" + index;
            }

            /** リストアイテムを作成する */
            const li = document.createElement("li");

            /** リスト内にアンカータグを作成する */
            const a = document.createElement("a");
            a.href = "#" + heading.id;
            a.textContent = heading.textContent;

            /** 見出しの階層に応じたクラスを付与する */
            li.classList.add("toc-" + heading.tagName.toLowerCase());

            li.appendChild(a);
            ul.appendChild(li);
        });

        tocContainer.appendChild(ul);
    }
});
