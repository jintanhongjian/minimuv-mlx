(() => {
  "use strict";
  const messages = {
    en: ["Negative prompt", "Native CFG. Blank means no negative conditioning.", "Native negative prompts require LTX 2.3 Dev Q4. Other models do not apply this text.", "Inherit project negative prompt", "Clear", "Negative prompt must be text of at most 4000 characters.", "Dev uses native CFG (3.0), with 30 steps recommended; it is slower than Distilled."],
    "zh-CN": ["反向提示词", "原生 CFG；留空表示不设置负向条件。", "原生反向提示词需要 LTX 2.3 Dev Q4；其他模型不会应用此文本。", "继承项目反向提示词", "清空", "反向提示词应为不超过 4000 字的文本。", "Dev 使用原生 CFG（3.0），建议 30 步；耗时高于 Distilled。"],
    "zh-TW": ["反向提示詞", "原生 CFG；留空表示不設定負向條件。", "原生反向提示詞需要 LTX 2.3 Dev Q4；其他模型不會套用此文字。", "繼承專案反向提示詞", "清空", "反向提示詞應為不超過 4000 字的文字。", "Dev 使用原生 CFG（3.0），建議 30 步；耗時高於 Distilled。"],
    fr: ["Prompt négatif", "CFG natif. Vide : aucune condition négative.", "Les prompts négatifs natifs nécessitent LTX 2.3 Dev Q4. Les autres modèles n'appliquent pas ce texte.", "Hériter du prompt négatif du projet", "Effacer", "Le prompt négatif doit contenir au plus 4000 caractères.", "Dev utilise le CFG natif (3.0), avec 30 étapes recommandées ; plus lent que Distilled."],
    de: ["Negativer Prompt", "Natives CFG. Leer bedeutet keine negative Konditionierung.", "Native negative Prompts benötigen LTX 2.3 Dev Q4. Andere Modelle verwenden diesen Text nicht.", "Negativen Projekt-Prompt übernehmen", "Leeren", "Der negative Prompt darf höchstens 4000 Zeichen enthalten.", "Dev nutzt natives CFG (3.0), empfohlen sind 30 Schritte; langsamer als Distilled."],
    ja: ["ネガティブプロンプト", "ネイティブ CFG。空欄なら負の条件は指定しません。", "ネイティブ対応には LTX 2.3 Dev Q4 が必要です。他のモデルには適用されません。", "プロジェクトのネガティブプロンプトを継承", "消去", "ネガティブプロンプトは 4000 文字以内で入力してください。", "Dev はネイティブ CFG（3.0）を使用。30 ステップ推奨、Distilled より低速です。"],
    ko: ["네거티브 프롬프트", "네이티브 CFG. 비워 두면 부정 조건을 지정하지 않습니다.", "네이티브 네거티브 프롬프트는 LTX 2.3 Dev Q4가 필요합니다. 다른 모델에는 적용되지 않습니다.", "프로젝트 네거티브 프롬프트 상속", "비우기", "네거티브 프롬프트는 4000자 이하의 텍스트여야 합니다.", "Dev는 네이티브 CFG(3.0)를 사용하며 30단계를 권장합니다. Distilled보다 느립니다."],
    es: ["Prompt negativo", "CFG nativo. Vacío: sin condición negativa.", "Los prompts negativos nativos requieren LTX 2.3 Dev Q4. Los demás modelos no aplican este texto.", "Heredar el prompt negativo del proyecto", "Borrar", "El prompt negativo debe tener como máximo 4000 caracteres.", "Dev usa CFG nativo (3.0), con 30 pasos recomendados; es más lento que Distilled."],
    pt: ["Prompt negativo", "CFG nativo. Vazio: sem condicionamento negativo.", "Prompts negativos nativos exigem LTX 2.3 Dev Q4. Outros modelos não aplicam este texto.", "Herdar o prompt negativo do projeto", "Limpar", "O prompt negativo deve ter no máximo 4000 caracteres.", "Dev usa CFG nativo (3.0), com 30 passos recomendados; é mais lento que Distilled."],
    tr: ["Negatif istem", "Yerel CFG. Boş bırakılırsa negatif koşul uygulanmaz.", "Yerel negatif istemler için LTX 2.3 Dev Q4 gerekir. Diğer modeller bu metni uygulamaz.", "Projenin negatif istemini devral", "Temizle", "Negatif istem en fazla 4000 karakter olmalıdır.", "Dev yerel CFG (3.0) kullanır; 30 adım önerilir ve Distilled'dan daha yavaştır."],
    ar: ["الموجّه السلبي", "CFG أصلي. الحقل الفارغ يعني عدم استخدام شرط سلبي.", "الموجّهات السلبية الأصلية تتطلب LTX 2.3 Dev Q4. النماذج الأخرى لا تطبّق هذا النص.", "وراثة الموجّه السلبي للمشروع", "مسح", "يجب ألا يتجاوز الموجّه السلبي 4000 حرف.", "يستخدم Dev ‏CFG أصليًا (3.0)، ويوصى بـ30 خطوة؛ وهو أبطأ من Distilled."],
    vi: ["Lời nhắc phủ định", "CFG gốc. Để trống nghĩa là không dùng điều kiện phủ định.", "Lời nhắc phủ định gốc cần LTX 2.3 Dev Q4. Các mô hình khác không áp dụng văn bản này.", "Kế thừa lời nhắc phủ định của dự án", "Xóa", "Lời nhắc phủ định phải là văn bản không quá 4000 ký tự.", "Dev dùng CFG gốc (3.0), khuyến nghị 30 bước; chậm hơn Distilled."],
    id: ["Prompt negatif", "CFG asli. Kosong berarti tanpa kondisi negatif.", "Prompt negatif asli memerlukan LTX 2.3 Dev Q4. Model lain tidak menerapkan teks ini.", "Warisi prompt negatif proyek", "Hapus", "Prompt negatif harus berupa teks maksimal 4000 karakter.", "Dev menggunakan CFG asli (3.0), disarankan 30 langkah; lebih lambat dari Distilled."],
    ru: ["Негативный промпт", "Нативный CFG. Пустое поле: без негативного условия.", "Нативные негативные промпты требуют LTX 2.3 Dev Q4. Другие модели не применяют этот текст.", "Наследовать негативный промпт проекта", "Очистить", "Негативный промпт должен содержать не более 4000 символов.", "Dev использует нативный CFG (3.0); рекомендуются 30 шагов. Медленнее Distilled."]
  };
  const language = () => messages[localStorage.getItem("h3-language") || "zh-CN"] || messages.en;
  const dev = model => model === "ltx-2.3-dev-q4";
  let currentModel = "";
  let busy = false;
  function localize() {
    const text = language();
    document.querySelectorAll("[data-native-negative]").forEach(box => {
      box.querySelector("[data-negative-label]").textContent = text[0];
      box.querySelector("[data-negative-hint]").textContent = text[dev(box.dataset.model) ? 1 : 2];
      box.querySelector("[data-negative-clear]").textContent = text[4];
      const label = box.querySelector("[data-negative-inherit-label]");
      if (label) label.textContent = text[3];
    });
  }
  function sync(model = currentModel, locked = busy) {
    currentModel = model;
    busy = locked;
    document.querySelectorAll("[data-native-negative]").forEach(box => {
      if (box.dataset.scope || box.closest("#workflow-shots")) box.dataset.model = model;
      const inherit = box.querySelector("[data-negative-inherit]");
      const supported = dev(box.dataset.model);
      box.querySelector("[data-negative-value]").disabled = busy || !supported || Boolean(inherit?.checked);
      box.querySelector("[data-negative-clear]").disabled = busy;
      if (inherit) inherit.disabled = busy || !supported;
    });
    localize();
  }
  function create(parent, value, scope, model, onChange = () => {}) {
    const box = document.createElement(scope ? "details" : "div");
    box.className = "field native-negative-field";
    box.dataset.nativeNegative = "";
    box.dataset.model = model || currentModel;
    if (scope) box.dataset.scope = scope;
    const content = scope ? document.createElement("div") : box;
    if (scope) {
      const summary = document.createElement("summary");
      const title = document.createElement("span");
      title.dataset.negativeLabel = "";
      const icon = document.createElement("span");
      icon.className = "music-fold-icon";
      icon.setAttribute("aria-hidden", "true");
      summary.append(title, icon);
      box.append(summary, content);
      box.open = false;
    }
    const label = document.createElement("label");
    label.className = "field-label";
    const title = document.createElement("span");
    title.dataset.negativeLabel = "";
    const input = document.createElement("textarea");
    input.dataset.negativeValue = "";
    input.maxLength = 4000;
    input.rows = 2;
    input.value = value || "";
    label.append(title, input);
    content.append(label);
    if (!scope) {
      const inheritance = document.createElement("label");
      inheritance.className = "visual-frame-toggle";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.dataset.negativeInherit = "";
      checkbox.checked = value == null;
      const span = document.createElement("span");
      span.dataset.negativeInheritLabel = "";
      inheritance.append(checkbox, span);
      content.append(inheritance);
      checkbox.addEventListener("change", () => { sync(); onChange(); });
    }
    const hint = document.createElement("p");
    hint.className = "field-hint";
    hint.dataset.negativeHint = "";
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "workflow-secondary";
    clear.dataset.negativeClear = "";
    clear.addEventListener("click", () => {
      input.value = "";
      const inherit = box.querySelector("[data-negative-inherit]");
      if (inherit) inherit.checked = false;
      sync();
      onChange();
    });
    input.addEventListener("input", onChange);
    content.append(hint, clear);
    const slot = scope && document.querySelector(`#${scope}-negative-prompt-slot`);
    if (slot?.parentElement) slot.parentElement.insertBefore(box, slot);
    else parent.append(box);
    sync();
    return box;
  }
  const root = scope => document.querySelector(`[data-native-negative][data-scope="${scope}"]`);
  function setMode(mode) {
    const box = root("video");
    if (box) box.hidden = mode !== "video";
  }
  function payload(scope) {
    const box = root(scope);
    return box ? {negative_prompt: box.querySelector("[data-negative-value]").value.trim()} : {};
  }
  function load(scope, value = "") {
    const box = root(scope);
    if (box) box.querySelector("[data-negative-value]").value = value;
    sync();
  }
  function attachShot(card, shot, model, onChange) {
    card.querySelector("[data-native-negative]")?.remove();
    create(card, shot.negative_prompt, null, model, onChange);
  }
  function shotPayload(card) {
    const box = card.querySelector("[data-native-negative]");
    if (!box) return {};
    return {negative_prompt: box.querySelector("[data-negative-inherit]").checked
      ? null : box.querySelector("[data-negative-value]").value.trim()};
  }
  for (const [scope, selector] of [
    ["video", "#video-controls"], ["workflow", "#workflow-storyboard-settings"],
    ["mv", "#mv-storyboard-settings"]
  ]) {
    const parent = document.querySelector(selector);
    if (parent) create(parent, "", scope);
  }
  window.MiniMuvVideoPrompts = {
    payload, load, attachShot, shotPayload, sync, localize, setMode,
    note: () => language()[6],
    error: code => code === "negative_prompt_unsupported" ? language()[2]
      : code === "invalid_negative_prompt" ? language()[5] : ""
  };
  const modelChoice = document.querySelector("#video-model-choice");
  modelChoice?.addEventListener("change", () => sync(modelChoice.value));
  sync(modelChoice?.value || "");
  setMode(["image", "music", "workflow", "mv", "podcast"].includes(localStorage.getItem("h3-mode"))
    ? localStorage.getItem("h3-mode") : "video");
  if (typeof updateVideoModelNotes === "function") updateVideoModelNotes();
})();
