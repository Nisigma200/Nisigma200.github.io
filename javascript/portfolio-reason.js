// スライド操作用インプット要素を取得する
/** スライド操作を行うレンジインプット要素 */
const sliderRange = document.getElementById("shodoSliderRange");

// スライダーの親コンテナ要素を取得する
/** 画像を重ね合わせて制御する親コンテナ要素 */
const sliderContainer = document.querySelector(".shodo-slider-container");

// 操作要素と親コンテナ要素が存在することを確認する
if (sliderRange && sliderContainer) {
    // レンジインプットの値が変更された際の処理を設定する
    sliderRange.addEventListener("input", (event) => {
        /** 操作によって取得した現在のスライダー位置の値 */
        const currentPosition = event.target.value;

        // 親コンテナのカスタムプロパティを書き換えて切り抜き位置を変更する
        sliderContainer.style.setProperty("--position", `${currentPosition}%`);
    });

    // トラック部分のクリックによる直接ジャンプを無効化し、ハンドル（丸部分）のドラッグ操作のみに制限する処理
    sliderRange.addEventListener("mousedown", (event) => {
        /** レンジインプット要素の寸法と位置情報を取得する */
        const rect = sliderRange.getBoundingClientRect();
        /** マウスがクリックされた水平方向の相対位置 */
        const clickX = event.clientX - rect.left;
        /** レンジインプット全体の横幅 */
        const width = rect.width;

        /** 最小値 */
        const min = parseFloat(sliderRange.min) || 0;
        /** 最大値 */
        const max = parseFloat(sliderRange.max) || 100;
        /** 現在の値 */
        const val = parseFloat(sliderRange.value) || 0;

        /** 現在の値に対応するハンドルの中心ピクセル位置を計算する */
        const handleX = width * ((val - min) / (max - min));

        /** ハンドルのおおよその半径ピクセルサイズ */
        const handleRadius = 20;

        // クリックされた位置がハンドル周辺の許容範囲外（トラック部分）である場合は操作を防止する
        if (Math.abs(clickX - handleX) > handleRadius) {
            event.preventDefault();
        }
    });
}
