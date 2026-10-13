(() => {
  "use strict";
  const keys = ["library", "characters", "scenes", "addCharacter", "addScene", "name", "description",
    "image", "upload", "remove", "defaultScene", "inherit", "generate", "frameMode", "existing", "references", "hint"];
  const messages = {
    en: ["Visual consistency", "Characters", "Scenes", "Add character", "Add scene", "Name", "Appearance / clothing / layout / lighting", "Reference image", "Upload image", "Remove", "Project scene", "Inherit project scene", "Generate opening frames by default", "Opening frame mode", "Manual frame / previous ending", "Generate from references", "Up to 12 characters and 12 scenes; select up to 4 characters per shot. FLUX.2 Klein composes a real opening frame from selected images, then the video model uses it. This replaces manual/previous-frame conditioning for that shot. Requires enabled FLUX and image-capable video models; FastH3 is unsupported. Improves consistency, not an identity guarantee."],
    "zh-CN": ["人物与场景一致性", "人物", "场景", "添加人物", "添加场景", "名称", "外貌／服装／布局／光线描述", "参考图片", "上传图片", "移除", "项目统一场景", "沿用项目场景", "默认生成参考图首帧", "首帧方式", "手动首帧／前镜尾帧", "依据参考图生成首帧", "最多12个人物、12个场景，每镜最多选4个人物。FLUX.2 Klein使用所选参考图生成真实构图首帧，再由视频模型生成；该镜会替代手动首帧／前镜尾帧条件。须启用FLUX及支持图片的视频模型，FastH3不支持。可增强一致性，但不保证外貌完全相同。"],
    "zh-TW": ["人物與場景一致性", "人物", "場景", "新增人物", "新增場景", "名稱", "外貌／服裝／布局／光線描述", "參考圖片", "上傳圖片", "移除", "專案統一場景", "沿用專案場景", "預設生成參考圖首幀", "首幀方式", "手動首幀／前鏡尾幀", "依參考圖生成首幀", "最多12個人物、12個場景，每鏡最多選4個人物。FLUX.2 Klein以所選參考圖生成真實構圖首幀，再生成影片；此鏡將取代手動／前鏡尾幀條件。須啟用FLUX及支援圖片的影片模型，FastH3不支援。增強一致性但不保證外貌完全相同。"],
    fr: ["Cohérence visuelle", "Personnages", "Décors", "Ajouter un personnage", "Ajouter un décor", "Nom", "Apparence / tenue / disposition / lumière", "Image de référence", "Importer une image", "Retirer", "Décor du projet", "Hériter du décor", "Générer les images initiales par défaut", "Mode d’image initiale", "Image manuelle / fin précédente", "Générer depuis les références", "12 personnages et 12 décors maximum, 4 personnages par plan. FLUX.2 Klein compose une vraie image initiale depuis les références avant la vidéo, remplaçant l’image manuelle/précédente. FLUX activé et vidéo avec images requis ; FastH3 non compatible. Cohérence améliorée, identité non garantie."],
    de: ["Visuelle Konsistenz", "Figuren", "Schauplätze", "Figur hinzufügen", "Schauplatz hinzufügen", "Name", "Aussehen / Kleidung / Aufbau / Licht", "Referenzbild", "Bild hochladen", "Entfernen", "Projekt-Schauplatz", "Projekt-Schauplatz übernehmen", "Startbilder standardmäßig generieren", "Startbildmodus", "Manuelles Bild / vorheriges Ende", "Aus Referenzen generieren", "Maximal 12 Figuren und 12 Schauplätze, 4 Figuren pro Szene. FLUX.2 Klein erzeugt aus Referenzen ein echtes Startbild vor dem Video; ersetzt manuelles/vorheriges Bild. Aktiviertes FLUX und bildfähiges Videomodell erforderlich, kein FastH3. Mehr Konsistenz, keine Identitätsgarantie."],
    ja: ["人物・場面の一貫性", "人物", "場面", "人物を追加", "場面を追加", "名前", "外見／衣装／配置／照明", "参照画像", "画像をアップロード", "削除", "共通場面", "共通場面を継承", "参照画像から開始フレームを既定生成", "開始フレーム方式", "手動画像／前ショットの最終フレーム", "参照画像から生成", "人物・場面は各12件、1ショット4人物まで。FLUX.2 Kleinで参照から実際の開始画像を生成して動画化します。手動／前ショット画像を置換します。FLUXと画像対応動画モデルが必要、FastH3非対応。一貫性を高めますが同一外見を保証しません。"],
    ko: ["인물·장면 일관성", "인물", "장면", "인물 추가", "장면 추가", "이름", "외모 / 의상 / 배치 / 조명", "참조 이미지", "이미지 업로드", "제거", "공통 장면", "프로젝트 장면 사용", "참조 기반 첫 프레임 기본 생성", "첫 프레임 방식", "수동 이미지 / 이전 마지막 프레임", "참조 이미지로 생성", "인물·장면 각각 최대 12개, 샷당 인물 4명. FLUX.2 Klein이 참조로 실제 첫 프레임을 생성한 후 영상화하며 수동/이전 프레임을 대체합니다. FLUX 활성화와 이미지 지원 영상 모델 필요, FastH3 미지원. 일관성을 높이지만 동일 외모를 보장하지 않습니다."],
    es: ["Coherencia visual", "Personajes", "Escenarios", "Añadir personaje", "Añadir escenario", "Nombre", "Aspecto / ropa / disposición / luz", "Imagen de referencia", "Subir imagen", "Eliminar", "Escenario del proyecto", "Heredar escenario", "Generar fotogramas iniciales por defecto", "Modo de fotograma inicial", "Imagen manual / final anterior", "Generar desde referencias", "Hasta 12 personajes y 12 escenarios, 4 personajes por plano. FLUX.2 Klein compone un fotograma real antes del vídeo, sustituyendo la imagen manual/anterior. Requiere FLUX habilitado y vídeo con imágenes; no FastH3. Mejora la coherencia sin garantizar la identidad."],
    pt: ["Consistência visual", "Personagens", "Cenários", "Adicionar personagem", "Adicionar cenário", "Nome", "Aparência / roupa / disposição / luz", "Imagem de referência", "Enviar imagem", "Remover", "Cenário do projeto", "Herdar cenário", "Gerar quadros iniciais por padrão", "Modo do quadro inicial", "Imagem manual / fim anterior", "Gerar com referências", "Até 12 personagens e 12 cenários, 4 personagens por cena. FLUX.2 Klein compõe um quadro real antes do vídeo, substituindo a imagem manual/anterior. Requer FLUX ativo e vídeo com imagens; FastH3 incompatível. Melhora a consistência, sem garantir identidade."],
    tr: ["Görsel tutarlılık", "Karakterler", "Mekânlar", "Karakter ekle", "Mekân ekle", "Ad", "Görünüm / kıyafet / düzen / ışık", "Referans görsel", "Görsel yükle", "Kaldır", "Proje mekânı", "Proje mekânını kullan", "Başlangıç karelerini varsayılan üret", "Başlangıç karesi modu", "Elle görsel / önceki son kare", "Referanslardan üret", "En çok 12 karakter, 12 mekân; çekim başına 4 karakter. FLUX.2 Klein referanslardan gerçek başlangıç karesi üretir, elle/önceki kareyi değiştirir. Etkin FLUX ve görsel destekli video gerekir; FastH3 desteklenmez. Tutarlılık artar, kimlik garantisi yoktur."],
    ar: ["اتساق الشخصيات والمشاهد", "الشخصيات", "المشاهد", "إضافة شخصية", "إضافة مشهد", "الاسم", "المظهر / الملابس / التخطيط / الإضاءة", "صورة مرجعية", "رفع صورة", "إزالة", "مشهد المشروع", "استخدام مشهد المشروع", "توليد الإطار الأول افتراضياً", "طريقة الإطار الأول", "صورة يدوية / نهاية اللقطة السابقة", "توليد من المراجع", "حتى 12 شخصية و12 مشهداً، و4 شخصيات لكل لقطة. يؤلف FLUX.2 Klein إطاراً أولاً حقيقياً من المراجع ثم يولد الفيديو، بدلاً من الصورة اليدوية/السابقة. يتطلب FLUX مفعلاً ونموذج فيديو يدعم الصور؛ FastH3 غير مدعوم. يعزز الاتساق دون ضمان الهوية."],
    vi: ["Nhất quán nhân vật và cảnh", "Nhân vật", "Bối cảnh", "Thêm nhân vật", "Thêm bối cảnh", "Tên", "Ngoại hình / trang phục / bố cục / ánh sáng", "Ảnh tham chiếu", "Tải ảnh lên", "Xóa", "Bối cảnh dự án", "Dùng bối cảnh dự án", "Mặc định tạo khung hình đầu", "Chế độ khung hình đầu", "Ảnh thủ công / khung cuối trước", "Tạo từ tham chiếu", "Tối đa 12 nhân vật và 12 bối cảnh, 4 nhân vật mỗi cảnh. FLUX.2 Klein tạo khung đầu thực từ ảnh rồi tạo video, thay ảnh thủ công/khung trước. Cần bật FLUX và mô hình video hỗ trợ ảnh; không hỗ trợ FastH3. Tăng nhất quán, không đảm bảo nhận dạng."],
    id: ["Konsistensi karakter dan adegan", "Karakter", "Latar", "Tambah karakter", "Tambah latar", "Nama", "Penampilan / pakaian / tata letak / cahaya", "Gambar referensi", "Unggah gambar", "Hapus", "Latar proyek", "Gunakan latar proyek", "Buat bingkai awal secara default", "Mode bingkai awal", "Gambar manual / akhir sebelumnya", "Buat dari referensi", "Maksimal 12 karakter dan 12 latar, 4 karakter per adegan. FLUX.2 Klein menyusun bingkai awal nyata lalu video, menggantikan gambar manual/sebelumnya. Perlu FLUX aktif dan video pendukung gambar; FastH3 tidak didukung. Meningkatkan konsistensi, bukan jaminan identitas."],
    ru: ["Единый облик и окружение", "Персонажи", "Локации", "Добавить персонажа", "Добавить локацию", "Имя", "Внешность / одежда / планировка / свет", "Референс", "Загрузить изображение", "Удалить", "Общая локация", "Локация проекта", "Генерировать начальные кадры по умолчанию", "Режим начального кадра", "Ручное изображение / конец предыдущего", "Создать по референсам", "До 12 персонажей и 12 локаций, 4 персонажа в кадре. FLUX.2 Klein создаёт настоящий начальный кадр по референсам, заменяя ручной/предыдущий кадр, затем видео. Нужны включённый FLUX и видеомодель с изображениями; FastH3 не поддерживается. Улучшает согласованность без гарантии идентичности."],
  };
  const libraries = new Map();
  const previewErrors = {
    en: "Reference image could not be loaded. Reselect it or upload it again.",
    "zh-CN": "参考图片加载失败，请重新选择或上传图片。",
    "zh-TW": "參考圖片載入失敗，請重新選擇或上傳圖片。",
    fr: "Impossible de charger l’image de référence. Sélectionnez-la ou importez-la à nouveau.",
    de: "Referenzbild konnte nicht geladen werden. Erneut auswählen oder hochladen.",
    ja: "参照画像を読み込めません。再選択または再アップロードしてください。",
    ko: "참조 이미지를 불러올 수 없습니다. 다시 선택하거나 업로드하세요.",
    es: "No se pudo cargar la imagen de referencia. Selecciónala o súbela de nuevo.",
    pt: "Não foi possível carregar a imagem de referência. Selecione ou envie novamente.",
    tr: "Referans görsel yüklenemedi. Yeniden seçin veya yükleyin.",
    ar: "تعذر تحميل الصورة المرجعية. أعد اختيارها أو رفعها.",
    vi: "Không tải được ảnh tham chiếu. Hãy chọn hoặc tải ảnh lên lại.",
    id: "Gambar referensi tidak dapat dimuat. Pilih atau unggah kembali.",
    ru: "Не удалось загрузить изображение. Выберите или загрузите его повторно."
  };
  const previewError = () => previewErrors[window.MiniMuvMVHost?.state().language] || previewErrors.en;
  let fieldSequence = 0;
  const text = key => (messages[window.MiniMuvMVHost?.state().language] || messages.en)[keys.indexOf(key)];
  const empty = () => ({characters: [], scenes: [], default_scene: "", generate_frames: false});
  const element = (tag, key) => {
    const node = document.createElement(tag);
    if (key) {node.dataset.visualLabel = key; node.textContent = text(key);}
    return node;
  };
  function field(parent, key, input) {
    const label = element("label");
    input.id = `visual-field-${++fieldSequence}`;
    label.htmlFor = input.id;
    label.append(element("span", key), input); parent.append(label);
  }
  function imageUrl(scope, id, urls = {}) {
    return imageUrls(scope, id, urls)[0];
  }
  function imageUrls(scope, id, urls = {}) {
    const explicit = urls[id] || libraries.get(scope)?.urls[id];
    if (Array.isArray(explicit)) return explicit;
    if (typeof explicit === "string" && explicit) return [explicit];
    const history = window.MiniMuvMVHost?.state().images.find(image => image.id === id);
    if (history?.image_views?.length === 3 && history.image_urls?.length === 3) return history.image_urls;
    return [history?.image_url || `/api/first-frames/${id}`];
  }
  function referencePreview(image, scope, id, urls = {}) {
    const wrapper = element("div"); wrapper.className = "visual-reference-media";
    const status = element("p"); status.className = "workflow-message error";
    status.setAttribute("role", "status"); status.setAttribute("aria-live", "polite"); status.hidden = true;
    image.addEventListener("error", () => {
      image.hidden = true;
      status.dataset.visualPreviewError = "";
      status.textContent = previewError(); status.hidden = false;
    });
    image.addEventListener("load", () => {
      image.hidden = false; status.hidden = true;
    });
    wrapper.append(image, status);
    if (id) image.src = imageUrl(scope, id, urls);
    return {wrapper, status};
  }
  function notify(scope) {
    const root = libraries.get(scope).root;
    root.dispatchEvent(new Event("input", {bubbles: true}));
    root.dispatchEvent(new Event("visualchange", {bubbles: true}));
  }
  function payload(scope) {
    const state = libraries.get(scope);
    if (!state) return empty();
    return {
      characters: readRows(state.root.querySelector("[data-visual-list=characters]")),
      scenes: readRows(state.root.querySelector("[data-visual-list=scenes]")),
      default_scene: state.root.querySelector("[data-visual-default]").value,
      generate_frames: state.root.querySelector("[data-visual-generate]").checked,
    };
  }
  function readRows(list) {
    return [...list.children].map(row => ({
      id: row.dataset.referenceId, name: row.querySelector("[data-visual-name]").value.trim(),
      description: row.querySelector("[data-visual-description]").value.trim(),
      image_id: row.dataset.imageId || "",
    }));
  }
  function refreshChoices(scope) {
    const state = libraries.get(scope), data = payload(scope);
    const select = state.root.querySelector("[data-visual-default]"), previous = select.value;
    select.replaceChildren(new Option(text("inherit"), ""), ...data.scenes.map(row => new Option(row.name, row.id)));
    select.value = data.scenes.some(row => row.id === previous) ? previous : "";
    document.querySelectorAll(`[data-visual-shot="${scope}"]`).forEach(panel => {
      if (scope === "mv") return;
      const card = panel.closest?.(".workflow-shot") || panel.parentElement || panel.parent;
      const chosen = shotPayload(card).visual;
      attachShot(card, scope, chosen, data);
    });
  }
  function addRow(scope, kind, value = {id: crypto.randomUUID(), name: "", description: "", image_id: ""}) {
    const state = libraries.get(scope), list = state.root.querySelector(`[data-visual-list=${kind}]`);
    if (list.children.length >= 12) return;
    const row = element("section"); row.className = "visual-reference-row";
    row.dataset.referenceId = value.id; row.dataset.imageId = value.image_id;
    const name = element("input"); name.type = "text"; name.dataset.visualName = ""; name.maxLength = 120; name.required = true; name.value = value.name;
    const description = element("textarea"); description.dataset.visualDescription = ""; description.maxLength = 600;
    description.rows = 2; description.value = value.description;
    field(row, "name", name); field(row, "description", description);
    const image = element("select");
    image.append(new Option("—", ""));
    for (const item of window.MiniMuvMVHost?.state().images || []) image.append(new Option(item.name || item.id, item.id));
    if (value.image_id && ![...image.options].some(option => option.value === value.image_id)) image.append(new Option(text("image"), value.image_id));
    image.value = value.image_id;
    field(row, "image", image);
    const preview = element("img"); preview.className = "visual-reference-preview";
    const media = referencePreview(preview, scope);
    const extras = element("div"); extras.className = "visual-reference-media visual-reference-set";
    const showPreview = () => {
      const id = row.dataset.imageId;
      media.status.hidden = true;
      preview.alt = name.value || text("image"); preview.hidden = !id;
      extras.replaceChildren();
      if (!id) {
        preview.removeAttribute("src");
        return;
      }
      const urls = imageUrls(scope, id);
      preview.src = urls[0];
      for (const [index, url] of urls.slice(1).entries()) {
        const extra = element("img"); extra.className = "visual-reference-preview";
        extra.alt = `${name.value || text("image")} ${index + 2}`;
        extras.append(referencePreview(extra, scope, "", {[id]: url}).wrapper);
        extra.src = url;
      }
    };
    image.addEventListener("change", () => {row.dataset.imageId = image.value; showPreview(); notify(scope);});
    const upload = element("input"); upload.type = "file"; upload.accept = "image/png,image/jpeg,image/webp";
    field(row, "upload", upload);
    const status = element("p"); status.className = "workflow-message"; status.setAttribute("role", "status"); status.hidden = true;
    upload.addEventListener("change", async () => {
      const file = upload.files[0]; if (!file) return;
      const controls = [...row.querySelectorAll("input,textarea,select,button")];
      const disabled = controls.map(control => control.disabled);
      controls.forEach(control => {control.disabled = true;});
      state.uploading++; notify(scope);
      status.hidden = false; status.textContent = text("upload"); status.classList.remove("error");
      try {
        if (!file.size || file.size > 20 * 1024 * 1024) throw new Error("first_frame_too_large");
        const response = await fetch("/api/first-frames", {
          method: "POST", headers: {"Content-Type": "application/octet-stream"}, body: file,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || data.error);
        if (typeof data.id !== "string" || data.image_url !== `/api/first-frames/${data.id}`) throw new Error("invalid_upload_response");
        row.dataset.imageId = data.id;
        image.append(new Option(file.name, data.id)); image.value = data.id;
        showPreview(); status.textContent = file.name;
      } catch (error) {status.textContent = error.message; status.classList.add("error");}
      finally {
        state.uploading--; controls.forEach((control, index) => {control.disabled = disabled[index];});
        upload.value = ""; notify(scope);
      }
    });
    const remove = element("button", "remove"); remove.type = "button"; remove.className = "workflow-secondary";
    remove.addEventListener("click", () => {row.remove(); refreshChoices(scope); notify(scope);});
    name.addEventListener("input", () => {showPreview(); refreshChoices(scope);});
    row.append(media.wrapper, extras, status, remove); list.append(row); showPreview(); refreshChoices(scope);
  }
  function mount(scope, parent) {
    if (!parent) return;
    const collapsible = scope === "video" || scope === "workflow" || scope === "mv";
    const container = collapsible ? element("details") : parent;
    if (collapsible) {
      container.className = "workflow-collapsible";
      const summary = element("summary");
      const fold = element("span", "fold");
      fold.className = "music-fold-icon";
      fold.setAttribute("aria-hidden", "true");
      summary.append(element("span", "library"), fold);
      container.append(summary);
      container.open = false;
    }
    const root = element("fieldset"); root.className = "workflow-soundtrack visual-references";
    root.dataset.visualLibrary = scope;
    const hint = element("p", "hint"); hint.className = "workflow-note";
    root.append(element("legend", "library"), hint);
    libraries.set(scope, {root, urls: {}, uploading: 0});
    for (const [kind, key] of [["characters", "addCharacter"], ["scenes", "addScene"]]) {
      const heading = element("strong", kind); heading.className = "visual-reference-heading"; root.append(heading);
      const list = element("div"); list.dataset.visualList = kind; root.append(list);
      const button = element("button", key); button.type = "button"; button.className = "workflow-secondary";
      button.addEventListener("click", () => {addRow(scope, kind); notify(scope);});
      root.append(button);
    }
    const scene = element("select"); scene.dataset.visualDefault = ""; scene.append(new Option(text("inherit"), ""));
    field(root, "defaultScene", scene);
    const generate = element("input"); generate.type = "checkbox"; generate.dataset.visualGenerate = "";
    field(root, "generate", generate);
    scene.addEventListener("change", () => refreshChoices(scope));
    root.addEventListener("visualchange", () => window.MiniMuvMVHost?.updateAvailability());
    if (collapsible) {
      container.append(root);
      const slot = document.querySelector(`#${scope}-visual-references-slot`);
      if (slot?.parentElement) slot.parentElement.insertBefore(container, slot);
      else parent.append(container);
    } else parent.append(root);
  }
  function load(scope, data, urls = {}) {
    const state = libraries.get(scope); if (!state) return;
    state.urls = urls;
    const value = data || empty();
    for (const kind of ["characters", "scenes"]) {
      state.root.querySelector(`[data-visual-list=${kind}]`).replaceChildren();
      for (const row of value[kind] || []) addRow(scope, kind, row);
    }
    state.root.querySelector("[data-visual-default]").value = value.default_scene || "";
    state.root.querySelector("[data-visual-generate]").checked = value.generate_frames === true;
  }
  function setShotChoices(panel, data, selected) {
    const characters = panel.querySelector("[data-visual-characters]");
    characters.replaceChildren(...data.characters.map((row, index) => new Option(
      row.name || `${text("characters")} ${index + 1}`, row.id, false, selected.characters.includes(row.id))));
    const scene = panel.querySelector("[data-visual-scene]");
    scene.replaceChildren(new Option(text("inherit"), ""), ...data.scenes.map((row, index) =>
      new Option(row.name || `${text("scenes")} ${index + 1}`, row.id)));
    scene.value = selected.scene || "";
  }
  function insertBefore(parent, child, target) {
    if (!target) {
      parent.append(child);
      return;
    }
    if (typeof parent.insertBefore === "function") {
      parent.insertBefore(child, target);
      return;
    }
    const index = parent.children.indexOf(target);
    child.parent = parent;
    parent.children.splice(index < 0 ? parent.children.length : index, 0, child);
  }
  function attachShot(card, scope, selected, references, onChange, urls = {}) {
    const previousPanel = card.querySelector("[data-visual-shot]");
    const previousContainer = previousPanel?.parentElement || previousPanel?.parent;
    const wasOpen = previousContainer?.matches?.("details") ? previousContainer.open : false;
    if (previousContainer?.matches?.("details")) previousContainer.remove();
    else previousPanel?.remove();
    card.querySelector("[data-visual-mode-field]")?.remove();
    const data = references || payload(scope);
    const panel = element("fieldset"); panel.className = "workflow-soundtrack"; panel.dataset.visualShot = scope;
    panel.append(element("legend", "library"));
    const characters = element("select"); characters.multiple = true; characters.size = 3; characters.dataset.visualCharacters = "";
    field(panel, "characters", characters);
    const scene = element("select"); scene.dataset.visualScene = ""; field(panel, "scenes", scene);
    const mode = element("select"); mode.dataset.visualMode = "";
    const existing = new Option(text("existing"), "existing"); existing.dataset.visualLabel = "existing";
    const generate = new Option(text("references"), "references"); generate.dataset.visualLabel = "references";
    mode.append(existing, generate);
    const value = selected || {characters: data.characters.slice(0, 4).map(row => row.id), scene: "", frame_mode: data.generate_frames ? "references" : "existing"};
    mode.value = value.frame_mode;
    if (scope === "video") {
      field(panel, "frameMode", mode);
    } else {
      const modeField = element("div");
      modeField.dataset.visualModeField = "";
      modeField.className = "visual-frame-mode";
      field(modeField, "frameMode", mode);
      const frameField = card.querySelector("[data-shot-frame-wrapper]") ||
        card.querySelector("[data-field=frame]")?.parentElement;
      insertBefore(card, modeField, frameField);
    }
    setShotChoices(panel, data, value);
    const previews = element("div"); previews.className = "visual-reference-previews";
    const updatePreviews = () => {
      const ids = [...characters.selectedOptions].map(option => option.value);
      const sceneId = scene.value || data.default_scene;
      previews.replaceChildren(...[...data.characters.filter(row => ids.includes(row.id)),
        ...data.scenes.filter(row => row.id === sceneId)].filter(row => row.image_id).flatMap(row =>
        imageUrls(scope, row.image_id, urls).map((url, index) => {
          const img = element("img"); img.className = "visual-reference-preview";
          img.alt = `${row.name} ${index + 1}`;
          return referencePreview(img, scope, row.image_id, {[row.image_id]: url}).wrapper;
        })));
    };
    panel.append(previews); updatePreviews();
    panel.addEventListener("change", () => {
      characters.setCustomValidity(characters.selectedOptions.length > 4 ? text("hint") : "");
      updatePreviews();
      onChange?.();
    });
    if (scope === "video") {
      card.append(panel);
      return;
    }
    const container = element("details");
    container.className = "workflow-collapsible visual-shot-collapsible";
    container.open = wasOpen;
    const summary = element("summary");
    const fold = element("span", "fold");
    fold.className = "music-fold-icon";
    fold.setAttribute("aria-hidden", "true");
    summary.append(element("span", "library"), fold);
    container.append(summary, panel);
    const generateButton = card.querySelector("[data-shot-generate]") ||
      card.querySelector("button");
    const actionRow = generateButton?.parentElement?.classList?.contains?.("workflow-actions")
      ? generateButton.parentElement : generateButton;
    insertBefore(card, container, actionRow);
  }
  function shotPayload(card) {
    const panel = card.querySelector("[data-visual-shot]");
    if (!panel) return {};
    return {visual: {
      characters: [...panel.querySelector("[data-visual-characters]").selectedOptions].map(option => option.value),
      scene: panel.querySelector("[data-visual-scene]").value,
      frame_mode: panel.querySelector("[data-visual-mode]").value,
    }};
  }
  function localize() {
    document.querySelectorAll("[data-visual-label]").forEach(node => {node.textContent = text(node.dataset.visualLabel);});
    document.querySelectorAll("[data-visual-preview-error]").forEach(node => {node.textContent = previewError();});
    document.querySelectorAll("[data-visual-default], [data-visual-scene]").forEach(select => {
      if (select.options[0]) select.options[0].textContent = text("inherit");
    });
  }
  mount("video", document.querySelector("#video-controls"));
  attachShot(document.querySelector("#video-visual-selection"), "video");
  mount("workflow", document.querySelector("#workflow-storyboard-settings"));
  mount("mv", document.querySelector("#mv-storyboard-settings"));
  window.MiniMuvVisualReferences = {payload, load, attachShot, shotPayload, localize,
    busy: () => [...libraries.values()].some(state => state.uploading > 0)};
  load("mv", window.MiniMuvMVHost?.state().project?.visual_references);
  for (const card of document.querySelector("#workflow-shots")?.children || []) attachShot(card, "workflow");
})();
