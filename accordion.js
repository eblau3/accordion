/**
 * アコーディオン機能をグループごとに設定
 * @param {HTMLElement} groupEl - アコーディオン項目をまとめる親要素
 */
const setupAccordionGroup = (groupEl) => {
  const accordionItemEls = groupEl.querySelectorAll(".js-accordion");
  const ACTIVE_CLASS = "is-active";

  /**
   * アコーディオン項目を閉じる
   * @param {HTMLElement} itemEl - アコーディオン項目要素
   * @param {HTMLElement} buttonEl - ボタン要素
   * @param {HTMLElement} contentEl - コンテンツ要素
   */
  const closeAccordionItem = (itemEl, buttonEl, contentEl) => {
    itemEl.classList.remove(ACTIVE_CLASS);
    buttonEl.setAttribute("aria-expanded", "false");
    contentEl.style.maxHeight = "0";
    contentEl.setAttribute("aria-hidden", "true");
  };

  /**
   * アコーディオン項目を開く
   * @param {HTMLElement} itemEl - アコーディオン項目要素
   * @param {HTMLElement} buttonEl - ボタン要素
   * @param {HTMLElement} contentEl - コンテンツ要素
   */
  const openAccordionItem = (itemEl, buttonEl, contentEl) => {
    itemEl.classList.add(ACTIVE_CLASS);
    buttonEl.setAttribute("aria-expanded", "true");
    contentEl.style.maxHeight = contentEl.scrollHeight + "px";
    contentEl.setAttribute("aria-hidden", "false");
  };

  // データ属性からアコーディオンの動作モードを読み込む
  const isSingleOpenMode = groupEl.dataset.accordionSingleOpen === "true";
  const isInitialOpenFirstMode = groupEl.dataset.accordionInitialOpenFirst === "true";

  accordionItemEls.forEach((accordionItem, index) => {
    const buttonEl = accordionItem.querySelector(".js-accordion-button");
    const contentEl = accordionItem.querySelector(".js-accordion-content");

    // 必須要素がなければ警告を出して処理を中断
    if (!buttonEl || !contentEl) {
      console.warn(
        "警告: アコーディオン項目に必須のボタン要素またはコンテンツ要素が見つかりません。",
        accordionItem,
      );
      return;
    }

    // --- IDとARIA属性の自動設定 ---
    // IDの一意性を保証するため、グループID（あれば）またはページ内の出現順序をサフィックスに使用
    const groupSuffix = groupEl.id
      ? `-${groupEl.id}`
      : `-group${Array.from(document.querySelectorAll(".js-accordion-group")).indexOf(groupEl)}`;

    // IDを設定
    if (!buttonEl.id) {
      buttonEl.id = `accordion-toggle${groupSuffix}-item${index}`;
    }
    if (!contentEl.id) {
      contentEl.id = `accordion-content${groupSuffix}-item${index}`;
    }

    // ARIA属性を設定
    buttonEl.setAttribute("aria-controls", contentEl.id);
    contentEl.setAttribute("aria-labelledby", buttonEl.id);
    contentEl.setAttribute("role", "region");

    // --- 初期状態の制御 ---
    // 優先順位: 1. HTMLのis-activeクラス > 2. data-accordion-initial-open-first > 3. デフォルトで閉じる
    if (accordionItem.classList.contains(ACTIVE_CLASS)) {
      openAccordionItem(accordionItem, buttonEl, contentEl);
    } else if (isInitialOpenFirstMode && index === 0) {
      openAccordionItem(accordionItem, buttonEl, contentEl);
    } else {
      closeAccordionItem(accordionItem, buttonEl, contentEl);
    }

    // --- クリックイベントリスナー ---
    buttonEl.addEventListener("click", () => {
      const isCurrentlyActive = accordionItem.classList.contains(ACTIVE_CLASS);

      // シングルオープンモードで、かつクリックした項目が現在閉じている場合
      if (isSingleOpenMode && !isCurrentlyActive) {
        // 他の開いているアコーディオン項目をすべて閉じる
        accordionItemEls.forEach((otherItem) => {
          const otherButtonEl = otherItem.querySelector(".js-accordion-button");
          const otherContentEl = otherItem.querySelector(".js-accordion-content");

          if (otherItem !== accordionItem && otherItem.classList.contains(ACTIVE_CLASS)) {
            closeAccordionItem(otherItem, otherButtonEl, otherContentEl);
          }
        });
      }

      // クリックした項目の開閉状態を切り替える
      if (!isCurrentlyActive) {
        openAccordionItem(accordionItem, buttonEl, contentEl);
      } else {
        closeAccordionItem(accordionItem, buttonEl, contentEl);
      }
    });
  });

  // --- 外部からすべての項目を閉じるためのメソッド ---
  // (例: タブ切り替え時など、アコーディオン全体をリセットしたい場合に利用)
  groupEl.closeAllAccordionItems = () => {
    accordionItemEls.forEach((item) => {
      const itemButtonEl = item.querySelector(".js-accordion-button");
      const itemContentEl = item.querySelector(".js-accordion-content");

      if (item.classList.contains(ACTIVE_CLASS)) {
        closeAccordionItem(item, itemButtonEl, itemContentEl);
      }
    });
  };
};

/**
 * アコーディオンを初期化
 */
window.addEventListener("DOMContentLoaded", () => {
  const accordionGroupEls = document.querySelectorAll(".js-accordion-group");

  if (accordionGroupEls.length > 0) {
    accordionGroupEls.forEach((groupEl, index) => {
      // グループ要素にIDがなければユニークなIDを自動付与 (ID生成の基準として使用)
      if (!groupEl.id) {
        groupEl.id = `accordion-group-${index}`;
      }
      setupAccordionGroup(groupEl);
    });
  }
});
