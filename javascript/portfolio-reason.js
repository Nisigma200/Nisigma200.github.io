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
}
