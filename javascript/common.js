/** ページトップへ戻るためのボタン要素 */
const pagetopBtn = document.querySelector("#page-top");
// ページトップへ戻るためのボタン要素がクリックされたときの処理を設定する
pagetopBtn.addEventListener("click", () => {
    // 画面の最上部へ滑らかにスクロールさせる
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
});

/** 現在の実行環境におけるフル西暦 */
const currentYear = new Date().getFullYear();

// 現在の実行環境におけるフル西暦があらかじめ設定した開始年よりも進んでいるかを確認する
if (currentYear > 2026) {
    /** 画面上の年を表示させたい要素 */
    const displayTargetElement = document.getElementById("copyright-year");

    // 画面上の年を表示させたい要素が存在する場合のみ処理を実行する
    if (displayTargetElement) {
        // 画面上の年を表示させたい要素の表示内容を、開始年と現在の実行環境におけるフル西暦を連結した文字列で上書きする
        displayTargetElement.textContent = " - " + currentYear;
    }
}

// HTMLの文書構造が完全に読み込まれてから処理を実行する
document.addEventListener("DOMContentLoaded", () => {
    /** 目次を挿入する親要素 */
    const tocContainer = document.getElementById("toc");

    // 目次を挿入する親要素が存在しない場合は処理を終了する
    if (!tocContainer) {
        return;
    }

    /** 本文エリア内のすべての見出し要素 */
    const headings = document.querySelectorAll("h2, h3");

    // 本文エリア内のすべての見出し要素が1つ以上存在するか判定する
    if (headings.length > 0) {
        /** 目次用のリスト要素 */
        const ul = document.createElement("ul");

        // 本文エリア内のすべての見出し要素を1つずつ順番に処理する
        headings.forEach((heading, index) => {
            // 処理中の見出し要素に一意の識別子が設定されていないか判定する
            if (!heading.id) {
                // 処理中の見出し要素の識別子に、見出しの番号を付与した文字列を設定する
                heading.id = "heading-" + index;
            }

            /** リストアイテム要素 */
            const li = document.createElement("li");

            /** リスト内に配置するアンカータグ要素 */
            const a = document.createElement("a");
            // リスト内に配置するアンカータグ要素のリンク先に、処理中の見出し要素の識別子を設定する
            a.href = "#" + heading.id;
            // リスト内に配置するアンカータグ要素のテキストに、処理中の見出し要素のテキストを設定する
            a.textContent = heading.textContent;

            // リストアイテム要素のクラス名に、処理中の見出し要素のタグ名を小文字にしたものを追加する
            li.classList.add("toc-" + heading.tagName.toLowerCase());

            // リストアイテム要素の中にリスト内に配置するアンカータグ要素を追加する
            li.appendChild(a);
            // 目次用のリスト要素の中にリストアイテム要素を追加する
            ul.appendChild(li);
        });

        // 目次を挿入する親要素の中に目次用のリスト要素を追加する
        tocContainer.appendChild(ul);
    }
});

// HTMLの文書構造が完全に読み込まれてから画像の全画面表示処理を実行する
document.addEventListener("DOMContentLoaded", () => {
    /** 画像を囲む枠の内部にある画像要素群 */
    const targetImages = document.querySelectorAll(".img-frame img");

    // 画像を囲む枠の内部にある画像要素群が1つ以上存在するか判定する
    if (targetImages.length > 0) {
        /** 全画面表示を行うための背景要素 */
        const overlayElement = document.createElement("div");
        // 全画面表示を行うための背景要素を画面全体に固定表示し、黒の半透明にするための見た目を設定する
        overlayElement.style.position = "fixed";
        overlayElement.style.top = "0";
        overlayElement.style.left = "0";
        overlayElement.style.width = "100vw";
        overlayElement.style.height = "100vh";
        overlayElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
        overlayElement.style.display = "none";
        overlayElement.style.justifyContent = "center";
        overlayElement.style.alignItems = "center";
        overlayElement.style.zIndex = "9999";
        overlayElement.style.cursor = "pointer";

        /** 全画面表示を行うための画像要素 */
        const overlayImage = document.createElement("img");
        // 全画面表示を行うための画像要素が画面内に収まるように最大の幅と高さを設定する
        overlayImage.style.maxWidth = "90%";
        overlayImage.style.maxHeight = "90%";
        overlayImage.style.objectFit = "contain";

        // 全画面表示を行うための背景要素の中に全画面表示を行うための画像要素を追加する
        overlayElement.appendChild(overlayImage);
        // HTMLの本体要素の末尾に全画面表示を行うための背景要素を追加する
        document.body.appendChild(overlayElement);

        // 画像を囲む枠の内部にある画像要素群を1つずつ順番に処理する
        targetImages.forEach((imgElement) => {
            // 処理中の個別の画像要素がクリックされたときの処理を設定する
            imgElement.addEventListener("click", () => {
                // 全画面表示を行うための画像要素の画像パスに、クリックされた処理中の個別の画像要素の画像パスを設定する
                overlayImage.src = imgElement.src;
                // 全画面表示を行うための背景要素を表示状態に変更する
                overlayElement.style.display = "flex";
            });
        });

        // 全画面表示を行うための背景要素がクリックされたときの処理を設定する
        overlayElement.addEventListener("click", () => {
            // 全画面表示を行うための背景要素を非表示状態に変更する
            overlayElement.style.display = "none";
        });
    }
});
