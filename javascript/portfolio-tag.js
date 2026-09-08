document.addEventListener("DOMContentLoaded", () => {
    // DOM要素の取得
    /** タグダイアログを表示するボタン */
    const tagDialogBtn = document.getElementById("tag-dialog-btn"); // ドキュメント内からIDが "tag-dialog-btn" である要素を取得して変数に代入する
    /** タグ選択用のダイアログ */
    const tagDialog = document.getElementById("tag-dialog"); // ドキュメント内からIDが "tag-dialog" である要素を取得して変数に代入する
    /** タグダイアログ内の選択肢コンテナ */
    const tagDialogOptions = document.getElementById("tag-dialog-options"); // ドキュメント内からIDが "tag-dialog-options" である要素を取得して変数に代入する
    /** タグダイアログを閉じるボタン */
    const closeTagDialogBtn = document.getElementById("close-tag-dialog"); // ドキュメント内からIDが "close-tag-dialog" である要素を取得して変数に代入する
    /** 現在選択中のタグ名を表示するラベル */
    const currentTagLabel = document.getElementById("current-tag-label"); // ドキュメント内からIDが "current-tag-label" である要素を取得して変数に代入する

    /** ソートダイアログを表示するボタン */
    const sortDialogBtn = document.getElementById("sort-dialog-btn"); // ドキュメント内からIDが "sort-dialog-btn" である要素を取得して変数に代入する
    /** ソート選択用のダイアログ */
    const sortDialog = document.getElementById("sort-dialog"); // ドキュメント内からIDが "sort-dialog" である要素を取得して変数に代入する
    /** ソートダイアログを閉じるボタン */
    const closeSortDialogBtn = document.getElementById("close-sort-dialog"); // ドキュメント内からIDが "close-sort-dialog" である要素を取得して変数に代入する
    /** 現在選択中のソート順を表示するラベル */
    const currentSortLabel = document.getElementById("current-sort-label"); // ドキュメント内からIDが "current-sort-label" である要素を取得して変数に代入する

    /** フィルタボタン群 */
    const filterButtons = document.querySelectorAll("#filter-buttons .filter-btn"); // 指定したセレクタに一致するすべての要素を取得して変数に代入する
    /** ポートフォリオカードのリスト */
    const cards = Array.from(document.querySelectorAll(".card-grid .card-blog-a")); // 取得したNodeListを配列に変換して変数に代入する
    /** カードが配置されるグリッドコンテナ */
    const cardGrid = document.querySelector(".card-grid"); // 指定したセレクタに一致する最初の要素を取得して変数に代入する

    /** 除外対象とするカテゴリ名のリスト */
    const categoryValues = ["all", "dev", "design", "management", "calligraphy"]; // カテゴリ名を表す文字列の配列を代入する

    // URLパラメータの解析と初期値の取得
    /** 現在のURLのクエリパラメータ */
    const urlParams = new URLSearchParams(window.location.search); // 現在のURLのクエリ文字列を解析するオブジェクトを生成して変数に代入する
    /** URLから取得した初期カテゴリ */
    const initialCategory = urlParams.get("category"); // クエリパラメータから "category" の値を取得して変数に代入する
    /** URLから取得した初期タグ */
    const initialTag = urlParams.get("tag"); // クエリパラメータから "tag" の値を取得して変数に代入する

    /** 現在選択されているカテゴリフィルタ */
    let currentFilter = initialCategory && categoryValues.includes(initialCategory.toLowerCase()) ? initialCategory : "all"; // 初期カテゴリが存在し定義済みリストに含まれていればその値を、含まれなければ "all" を代入する
    /** 現在選択されているタグフィルタ */
    let currentTag = initialTag || ""; // 初期タグが存在すればその値を、存在しなければ空文字を代入する
    /** 現在選択されているソート順（desc: 新しい順, asc: 古い順） */
    let currentSort = "desc"; // 初期値として降順を表す "desc" を代入する

    // --- 初期表示時のボタン状態の同期 ---
    if (currentFilter !== "all") { // 現在のフィルタが "all" でない場合に処理を行う
        filterButtons.forEach((btn) => { // フィルタボタンの配列をループ処理する
            if (btn.dataset.target === currentFilter) { // ボタンのデータ属性 target が現在のフィルタと一致するか判定する
                btn.classList.add("active"); // 一致する場合は "active" クラスを追加する
            } else { // 一致しない場合の処理
                btn.classList.remove("active"); // 一致しない場合は "active" クラスを削除する
            }
        });
    }

    // --- タグダイアログの初期化 ---
    if (tagDialogOptions) { // タグダイアログのコンテナが存在する場合に処理を行う
        /** 存在するすべてのタグを保持する集合 */
        const allTags = new Set(); // 重複を防ぐための Set オブジェクトを生成して変数に代入する

        // 各カードの .card-tags エリア内からのみタグを抽出
        cards.forEach((card) => { // カード要素の配列をループ処理する
            /** カード内の純粋なタグ要素群 */
            const tagElements = card.querySelectorAll(".card-tags .tag-label"); // カード要素内からタグ要素を取得して変数に代入する
            tagElements.forEach((tagEl) => { // 取得したタグ要素群をループ処理する
                /** タグ文字列 */
                const tagName = tagEl.getAttribute("data-tag") || tagEl.textContent.trim(); // 属性値またはテキストを取得して余白を除去した値を代入する
                // カテゴリ名に含まれない場合のみ追加
                if (tagName && !categoryValues.includes(tagName.toLowerCase())) { // タグ名が存在し、かつカテゴリ値リストに含まれていないか判定する
                    allTags.add(tagName); // 条件を満たす場合に集合にタグ名を追加する
                }
            });
        });

        // 抽出したタグから選択ボタンを動的に生成
        allTags.forEach((tag) => { // 集合に含まれるすべてのタグをループ処理する
            /** タグ選択肢用ボタン */
            const btn = document.createElement("button"); // 新しい button 要素を生成して変数に代入する
            btn.type = "button"; // ボタンの type 属性に "button" を設定する
            btn.className = "tag-option-btn"; // ボタンのクラス名に "tag-option-btn" を設定する
            if (tag === currentTag) { // タグが現在選択中のタグと一致するか判定する
                btn.classList.add("active"); // 一致する場合は "active" クラスを追加する
            }
            btn.dataset.value = tag; // ボタンのデータ属性 value にタグ名をセットする
            btn.textContent = tag; // ボタンの表示テキストにタグ名をセットする
            tagDialogOptions.appendChild(btn); // 生成したボタン要素をダイアログコンテナの子要素として追加する
        });

        if (currentTag && currentTagLabel) { // 現在のタグとラベル要素の両方が存在する場合に処理を行う
            currentTagLabel.textContent = currentTag; // ラベルの表示テキストを現在のタグ名に更新する
        }
    }

    /** タグの選択肢ボタン群 */
    const tagOptionBtns = document.querySelectorAll(".tag-option-btn"); // 指定したセレクタに一致するすべてのタグ選択ボタンを取得して変数に代入する
    /** ソートの選択肢ボタン群 */
    const sortOptionBtns = document.querySelectorAll(".sort-option-btn"); // 指定したセレクタに一致するすべてのソート選択ボタンを取得して変数に代入する

    // --- URLパラメータの更新処理 ---
    /**
     * 現在のフィルタ状態をURLパラメータに反映させる
     */
    function updateURLParams() { // URLのクエリパラメータを書き換える関数を定義する
        /** 新しいURLSearchParamsオブジェクト */
        const params = new URLSearchParams(); // パラメータ操作用のオブジェクトを生成して変数に代入する

        if (currentFilter && currentFilter !== "all") { // 現在のフィルタが存在し "all" 以外の場合に処理を行う
            params.set("category", currentFilter); // パラメータに "category" キーと値をセットする
        }
        if (currentTag) { // 現在のタグが存在する場合に処理を行う
            params.set("tag", currentTag); // パラメータに "tag" キーと値をセットする
        }

        /** 生成されたクエリ文字列 */
        const queryString = params.toString(); // パラメータオブジェクトを文字列に変換して変数に代入する
        /** 新しいURL文字列 */
        const newUrl = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname; // クエリ文字列がある場合は記号を付与したパスを作成し、ない場合はパスのみを代入する

        window.history.replaceState(null, "", newUrl); // 履歴を追加せずに現在のURL表現を更新する
    }

    // --- ダイアログ開閉イベントの設定 ---
    if (tagDialogBtn && tagDialog) { // タグダイアログボタンとダイアログ要素が存在する場合に処理を行う
        tagDialogBtn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            if (sortDialog && sortDialog.open) { // ソートダイアログが存在し開いているか判定する
                sortDialog.close(); // ソートダイアログを閉じる
            }
            if (tagDialog.open) { // タグダイアログが開いているか判定する
                tagDialog.close(); // 開いている場合は閉じる
            } else { // 閉じている場合の処理
                tagDialog.show(); // 閉じている場合は開く
            }
        });
    }

    if (closeTagDialogBtn && tagDialog) { // タグを閉じるボタンとダイアログ要素が存在する場合に処理を行う
        closeTagDialogBtn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            tagDialog.close(); // タグダイアログを閉じる
        });
    }

    if (sortDialogBtn && sortDialog) { // ソートダイアログボタンとダイアログ要素が存在する場合に処理を行う
        sortDialogBtn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            if (tagDialog && tagDialog.open) { // タグダイアログが存在し開いているか判定する
                tagDialog.close(); // タグダイアログを閉じる
            }
            if (sortDialog.open) { // ソートダイアログが開いているか判定する
                sortDialog.close(); // 開いている場合は閉じる
            } else { // 閉じている場合の処理
                sortDialog.show(); // 閉じている場合は開く
            }
        });
    }

    if (closeSortDialogBtn && sortDialog) { // ソートを閉じるボタンとダイアログ要素が存在する場合に処理を行う
        closeSortDialogBtn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            sortDialog.close(); // ソートダイアログを閉じる
        });
    }

    // ダイアログ外のクリックで閉じる処理
    document.addEventListener("click", (e) => { // ドキュメント全体に対するクリックイベント処理を登録する
        if (tagDialog && tagDialog.open && !tagDialog.contains(e.target) && !tagDialogBtn.contains(e.target)) { // タグダイアログが開いておりクリック位置がダイアログおよび起動ボタンの外側か判定する
            tagDialog.close(); // 条件を満たす場合はタグダイアログを閉じる
        }
        if (sortDialog && sortDialog.open && !sortDialog.contains(e.target) && !sortDialogBtn.contains(e.target)) { // ソートダイアログが開いておりクリック位置がダイアログおよび起動ボタンの外側か判定する
            sortDialog.close(); // 条件を満たす場合はソートダイアログを閉じる
        }
    });

    // --- 絞り込み＆ソート処理 ---
    /**
     * 現在のフィルタ・タグ・ソート状態に基づいてカードの表示と並び順を更新する
     */
    function updateDisplay() { // 画面上の表示更新を行う関数を定義する
        // 1. フィルタリング処理
        cards.forEach((card) => { // すべてのカード要素をループ処理する
            /** カードのカテゴリ（開発, デザインなど） */
            const cardCategories = card.dataset.tags ? card.dataset.tags.split(",") : []; // データ属性 tags からカテゴリ配列を生成して変数に代入する

            // カード内のタグ要素のみからタグ一覧を取得
            const cardTagElements = card.querySelectorAll(".card-tags .tag-label"); // カード内のタグ要素群を取得して変数に代入する
            /** カードに含まれるタグ配列 */
            const cardTags = Array.from(cardTagElements).map((el) => el.getAttribute("data-tag") || el.textContent.trim()); // 各要素のタグ名を取り出して配列を生成し変数に代入する

            /** カテゴリ条件の判定 */
            const matchFilter = currentFilter === "all" || cardCategories.includes(currentFilter); // フィルタが "all" であるか、カードのカテゴリに含まれているか判定する
            /** タグ条件の判定 */
            const matchTag = currentTag === "" || cardTags.includes(currentTag); // タグが未選択であるか、カードのタグに含まれているか判定する

            // 両方の条件を満たす場合は表示、満たさない場合は非表示
            if (matchFilter && matchTag) { // カテゴリとタグの両方の条件に一致するか判定する
                card.classList.remove("is-hidden"); // "is-hidden" クラスを削除する
                card.classList.add("is-visible"); // "is-visible" クラスを追加する
            } else { // 一致しない場合の処理
                card.classList.remove("is-visible"); // "is-visible" クラスを削除する
                card.classList.add("is-hidden"); // "is-hidden" クラスを追加する
            }
        });

        // 2. ソート処理
        /** 表示対象のカードのみをソート対象として抽出 */
        const visibleCards = cards.filter((card) => !card.classList.contains("is-hidden")); // 非表示クラスを持たないカードのみを抽出した配列を生成して変数に代入する

        visibleCards.sort((a, b) => { // 表示対象のカード配列を並び替える
            /** カードAの日付 */
            const dateA = new Date(a.dataset.date); // カードAのデータ属性 date から Date オブジェクトを生成して変数に代入する
            /** カードBの日付 */
            const dateB = new Date(b.dataset.date); // カードBのデータ属性 date から Date オブジェクトを生成して変数に代入する

            if (currentSort === "asc") { // ソート順が昇順（古い順）か判定する
                // 古い順
                return dateA - dateB; // 日付の昇順比較結果を返す
            } else { // 降順（新しい順）の場合の処理
                // 新しい順
                return dateB - dateA; // 日付の降順比較結果を返す
            }
        });

        // DOM上のカード順序を並び替え結果に合わせて更新
        visibleCards.forEach((card) => { // ソート済みのカード配列をループ処理する
            cardGrid.appendChild(card); // グリッドコンテナの末尾にカードを再追加して並び替えを実行する
        });

        // URLパラメータの同期
        updateURLParams(); // URLパラメータを更新する関数を呼び出す
    }

    // --- イベントリスナーの設定 ---

    // カテゴリフィルタボタンの切り替え
    filterButtons.forEach((btn) => { // フィルタボタンの配列をループ処理する
        btn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            filterButtons.forEach((b) => b.classList.remove("active")); // すべてのフィルタボタンから "active" クラスを削除する
            btn.classList.add("active"); // クリックされたボタンに "active" クラスを追加する
            currentFilter = btn.dataset.target; // クリックされたボタンのデータ属性 target の値を現在のフィルタに代入する
            updateDisplay(); // 表示更新関数を呼び出す
        });
    });

    // タグ選択肢の切り替え
    tagOptionBtns.forEach((btn) => { // タグ選択ボタンの配列をループ処理する
        btn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            tagOptionBtns.forEach((b) => b.classList.remove("active")); // すべてのタグ選択ボタンから "active" クラスを削除する
            btn.classList.add("active"); // クリックされたボタンに "active" クラスを追加する
            currentTag = btn.dataset.value; // クリックされたボタンのデータ属性 value の値を現在のタグに代入する

            // ボタンラベルの更新
            if (currentTagLabel) { // ラベル要素が存在する場合に処理を行う
                currentTagLabel.textContent = currentTag === "" ? "すべてのタグ" : currentTag; // タグが空文字の場合はデフォルトテキストを、そうでない場合はタグ名をセットする
            }

            if (tagDialog) { // タグダイアログ要素が存在する場合に処理を行う
                tagDialog.close(); // タグダイアログを閉じる
            }
            updateDisplay(); // 表示更新関数を呼び出す
        });
    });

    // ソート選択肢の切り替え
    sortOptionBtns.forEach((btn) => { // ソート選択ボタンの配列をループ処理する
        btn.addEventListener("click", () => { // ボタンがクリックされた時のイベント処理を登録する
            sortOptionBtns.forEach((b) => b.classList.remove("active")); // すべてのソート選択ボタンから "active" クラスを削除する
            btn.classList.add("active"); // クリックされたボタンに "active" クラスを追加する
            currentSort = btn.dataset.value; // クリックされたボタンのデータ属性 value の値を現在のソート順に代入する

            // ボタンラベルの更新
            if (currentSortLabel) { // ラベル要素が存在する場合に処理を行う
                currentSortLabel.textContent = currentSort === "asc" ? "古い順" : "新しい順"; // ソート順に応じて適切なラベルテキストをセットする
            }

            if (sortDialog) { // ソートダイアログ要素が存在する場合に処理を行う
                sortDialog.close(); // ソートダイアログを閉じる
            }
            updateDisplay(); // 表示更新関数を呼び出す
        });
    });

    // カード内の直接クリック可能なタグ・カテゴリへのイベント付与
    document.addEventListener("click", (e) => { // ドキュメント全体に対するクリックイベント処理を登録する
        /** クリックされたフィルタラベル要素 */
        const clickableFilter = e.target.closest(".card-filters .clickable-tag"); // クリックされた要素の親を遡りカテゴリ要素を取得して変数に代入する
        /** クリックされたタグ要素 */
        const clickableTag = e.target.closest(".card-tags .clickable-tag"); // クリックされた要素の親を遡りタグ要素を取得して変数に代入する

        if (clickableFilter) { // カテゴリ要素がクリックされた場合に処理を行う
            e.preventDefault(); // イベントのデフォルト動作をキャンセルする
            e.stopPropagation(); // イベントのバブリングを停止する

            /** 選択されたカテゴリ名 */
            const filterValue = clickableFilter.getAttribute("data-tag") || clickableFilter.textContent.trim(); // 属性値またはテキストからカテゴリ名を取得して変数に代入する
            currentFilter = filterValue; // 現在のフィルタにカテゴリ名を代入する

            filterButtons.forEach((btn) => { // フィルタボタンの配列をループ処理する
                if (btn.dataset.target === filterValue) { // ボタンのデータ属性 target が選択された値と一致するか判定する
                    btn.classList.add("active"); // 一致する場合は "active" クラスを追加する
                } else { // 一致しない場合の処理
                    btn.classList.remove("active"); // 一致しない場合は "active" クラスを削除する
                }
            });

            updateDisplay(); // 表示更新関数を呼び出す
        } else if (clickableTag) { // タグ要素がクリックされた場合に処理を行う
            e.preventDefault(); // イベントのデフォルト動作をキャンセルする
            e.stopPropagation(); // イベントのバブリングを停止する

            /** 選択されたタグ名 */
            const tagValue = clickableTag.getAttribute("data-tag") || clickableTag.textContent.trim(); // 属性値またはテキストからタグ名を取得して変数に代入する

            if (categoryValues.includes(tagValue.toLowerCase())) { // タグ名がカテゴリ値リストに含まれているか判定する
                return; // 含まれている場合は処理を中断する
            }

            currentTag = tagValue; // 現在のタグに取得したタグ名を代入する

            // タグダイアログ内のアクティブ状態を同期
            tagOptionBtns.forEach((btn) => { // タグ選択ボタンの配列をループ処理する
                if (btn.dataset.value === tagValue) { // ボタンのデータ属性 value が選択されたタグ名と一致するか判定する
                    btn.classList.add("active"); // 一致する場合は "active" クラスを追加する
                } else { // 一致しない場合の処理
                    btn.classList.remove("active"); // 一致しない場合は "active" クラスを削除する
                }
            });

            // ボタンラベルの更新
            if (currentTagLabel) { // ラベル要素が存在する場合に処理を行う
                currentTagLabel.textContent = tagValue; // ラベルのテキストを選択されたタグ名に更新する
            }

            updateDisplay(); // 表示更新関数を呼び出す
        }
    });

    // 初期表示の更新実行
    updateDisplay(); // ページの読み込み完了時に表示更新関数を実行する
});
