(() => {
  const panel = document.querySelector("#image-reference-settings");
  const upload = document.querySelector("#image-reference-upload");
  const history = document.querySelector("#image-reference-history");
  const list = document.querySelector("#image-reference-list");
  const status = document.querySelector("#image-reference-status");
  const strings = {
    en: ["Reference images", "Upload references", "Add from image history", "Choose an image", "Remove", "Move up", "Move down", "Uploading…", "Reference image error", "PNG/JPEG/WebP, up to 20 MB per image. Maximum {n} images, in the order shown. Describe how to use them in the prompt; they apply to every candidate and character view."],
    "zh-CN": ["参考图输入", "上传参考图", "从历史图片添加", "选择图片", "删除", "上移", "下移", "正在上传…", "参考图错误", "PNG/JPEG/WebP，每张不超过20 MB，最多{n}张，按显示顺序输入。请在画面描述中说明参考用途；所有候选及人物视角使用同一组参考图。"],
    "zh-TW": ["參考圖輸入", "上傳參考圖", "從歷史圖片新增", "選擇圖片", "刪除", "上移", "下移", "正在上傳…", "參考圖錯誤", "PNG/JPEG/WebP，每張不超過20 MB，最多{n}張，按顯示順序輸入。請在畫面描述中說明參考用途；所有候選及人物視角使用同一組參考圖。"],
    fr: ["Images de référence", "Importer des références", "Ajouter depuis l’historique", "Choisir une image", "Supprimer", "Monter", "Descendre", "Importation…", "Erreur de référence", "PNG/JPEG/WebP, 20 Mo par image. Maximum {n} images dans l’ordre affiché. Décrivez leur usage ; elles s’appliquent à chaque variante et vue du personnage."],
    de: ["Referenzbilder", "Referenzen hochladen", "Aus Bildverlauf hinzufügen", "Bild auswählen", "Entfernen", "Nach oben", "Nach unten", "Hochladen…", "Referenzbildfehler", "PNG/JPEG/WebP, höchstens 20 MB je Bild. Maximal {n} Bilder in angezeigter Reihenfolge. Verwendung im Prompt beschreiben; alle Varianten und Figurenansichten nutzen dieselben Referenzen."],
    ja: ["参考画像", "参考画像をアップロード", "画像履歴から追加", "画像を選択", "削除", "上へ", "下へ", "アップロード中…", "参考画像エラー", "PNG/JPEG/WebP、各20 MB以下、最大{n}枚。表示順で入力します。用途をプロンプトに記述してください。全候補と人物の各方向に同じ参考画像を適用します。"],
    ko: ["참조 이미지", "참조 업로드", "이미지 기록에서 추가", "이미지 선택", "삭제", "위로", "아래로", "업로드 중…", "참조 이미지 오류", "PNG/JPEG/WebP, 이미지당 최대 20 MB, 최대 {n}장. 표시 순서대로 입력됩니다. 프롬프트에 용도를 설명하세요. 모든 후보와 인물 방향에 같은 참조가 적용됩니다."],
    es: ["Imágenes de referencia", "Subir referencias", "Añadir desde el historial", "Elegir imagen", "Eliminar", "Subir", "Bajar", "Subiendo…", "Error de referencia", "PNG/JPEG/WebP, hasta 20 MB por imagen. Máximo {n} imágenes en el orden mostrado. Describe su uso; se aplican a cada variante y vista del personaje."],
    pt: ["Imagens de referência", "Enviar referências", "Adicionar do histórico", "Escolher imagem", "Remover", "Mover para cima", "Mover para baixo", "Enviando…", "Erro de referência", "PNG/JPEG/WebP, até 20 MB por imagem. Máximo de {n} imagens na ordem exibida. Descreva o uso; aplicam-se a cada variante e vista do personagem."],
    tr: ["Referans görseller", "Referans yükle", "Görsel geçmişinden ekle", "Görsel seç", "Kaldır", "Yukarı taşı", "Aşağı taşı", "Yükleniyor…", "Referans görsel hatası", "PNG/JPEG/WebP, görsel başına en fazla 20 MB. Gösterilen sırada en fazla {n} görsel. Kullanımını istemde açıklayın; tüm adaylar ve karakter görünümleri aynı referansları kullanır."],
    ar: ["الصور المرجعية", "رفع المراجع", "إضافة من سجل الصور", "اختر صورة", "إزالة", "نقل لأعلى", "نقل لأسفل", "جارٍ الرفع…", "خطأ في الصورة المرجعية", "PNG/JPEG/WebP، حتى 20 MB للصورة. الحد الأقصى {n} صور بالترتيب المعروض. صف استخدامها في النص؛ تنطبق على جميع البدائل وزوايا الشخصية."],
    vi: ["Ảnh tham chiếu", "Tải ảnh tham chiếu", "Thêm từ lịch sử ảnh", "Chọn ảnh", "Xóa", "Lên trên", "Xuống dưới", "Đang tải…", "Lỗi ảnh tham chiếu", "PNG/JPEG/WebP, tối đa 20 MB mỗi ảnh. Tối đa {n} ảnh theo thứ tự hiển thị. Mô tả cách sử dụng trong lời nhắc; áp dụng cho mọi phương án và góc nhân vật."],
    id: ["Gambar referensi", "Unggah referensi", "Tambah dari riwayat gambar", "Pilih gambar", "Hapus", "Naik", "Turun", "Mengunggah…", "Kesalahan referensi", "PNG/JPEG/WebP, maksimal 20 MB per gambar. Maksimal {n} gambar sesuai urutan tampil. Jelaskan penggunaannya dalam prompt; berlaku untuk semua kandidat dan sudut karakter."],
    ru: ["Референсные изображения", "Загрузить референсы", "Добавить из истории", "Выбрать изображение", "Удалить", "Вверх", "Вниз", "Загрузка…", "Ошибка референса", "PNG/JPEG/WebP, до 20 MB на изображение. Не более {n} изображений в указанном порядке. Опишите их использование в запросе; применяются ко всем вариантам и ракурсам персонажа."],
  };
  let rows = [];
  let items = [];
  let pending = false;
  const sceneStrings = {
    en: ["Scene multi-view preset", "Generate front wide, side wide and overhead layout images", "HiDream / Klein only. The first view guides the other two; select the saved group as a scene reference in video, long video or MV. These are 2D images, not a 3D model; layout consistency is not guaranteed.", "Front wide", "Side wide", "Overhead layout"],
    "zh-CN": ["场景多视角快捷设置", "生成正向广角、侧向广角、俯视布局三张场景图", "仅支持HiDream和Klein。后两张参考第一张生成；保存后可在视频、长视频和MV的场景参考中选择整组。输出是二维图片，不是三维模型，不保证空间布局完全一致。", "正向广角", "侧向广角", "俯视布局"],
    "zh-TW": ["場景多視角快捷設定", "生成正向廣角、側向廣角、俯視佈局三張場景圖", "僅支援HiDream和Klein。後兩張參考第一張生成；儲存後可在影片、長影片和MV的場景參考中選擇整組。輸出是二維圖片，不是三維模型，不保證空間佈局完全一致。", "正向廣角", "側向廣角", "俯視佈局"],
    fr: ["Préréglage de scène multi-vues", "Créer trois vues : frontale, latérale et aérienne", "HiDream / Klein uniquement. La première vue guide les suivantes ; choisissez le groupe comme référence de scène pour vidéo, vidéo longue ou MV. Images 2D, pas un modèle 3D ; cohérence non garantie.", "Vue frontale large", "Vue latérale large", "Plan aérien"],
    de: ["Szenen-Mehransichten", "Frontansicht, Seitenansicht und Draufsicht erzeugen", "Nur HiDream / Klein. Das erste Bild dient den anderen als Referenz; die Gruppe ist als Szenenreferenz für Video, Langvideo und MV nutzbar. 2D-Bilder, kein 3D-Modell; Layouttreue nicht garantiert.", "Front-Weitwinkel", "Seiten-Weitwinkel", "Draufsicht"],
    ja: ["シーン複数視点設定", "正面広角・側面広角・俯瞰配置の3枚を生成", "HiDream / Kleinのみ。後の2枚は最初の画像を参考に生成します。保存した組を動画・長編動画・MVのシーン参考に選択できます。2D画像であり3Dモデルではなく、配置の一致は保証されません。", "正面広角", "側面広角", "俯瞰配置"],
    ko: ["장면 다중 시점 설정", "정면 광각·측면 광각·위에서 본 배치 3장 생성", "HiDream / Klein 전용. 첫 이미지를 참조해 다음 두 장을 생성합니다. 저장된 묶음을 동영상·긴 동영상·MV의 장면 참조로 선택하세요. 3D 모델이 아닌 2D 이미지이며 배치 일치는 보장되지 않습니다.", "정면 광각", "측면 광각", "위에서 본 배치"],
    es: ["Escena con múltiples vistas", "Generar vistas frontal, lateral y aérea", "Solo HiDream / Klein. La primera vista guía las otras; selecciona el grupo como referencia de escena en vídeo, vídeo largo o MV. Son imágenes 2D, no un modelo 3D; coherencia no garantizada.", "Frontal gran angular", "Lateral gran angular", "Plano aéreo"],
    pt: ["Cena com múltiplas vistas", "Gerar vistas frontal, lateral e aérea", "Apenas HiDream / Klein. A primeira imagem orienta as seguintes; selecione o grupo como referência de cena em vídeo, vídeo longo ou MV. São imagens 2D, não um modelo 3D; consistência não garantida.", "Frontal ampla", "Lateral ampla", "Layout aéreo"],
    tr: ["Çok açılı sahne ayarı", "Ön geniş, yan geniş ve üstten yerleşim görselleri üret", "Yalnızca HiDream / Klein. İlk görsel diğerlerine rehber olur; grubu video, uzun video veya MV sahne referansı olarak seçin. 2D görsellerdir, 3D model değildir; yerleşim tutarlılığı garanti edilmez.", "Ön geniş açı", "Yan geniş açı", "Üstten yerleşim"],
    ar: ["إعداد المشهد متعدد الزوايا", "إنشاء صور أمامية وجانبية وتخطيط علوي", "HiDream / Klein فقط. الصورة الأولى توجه الصورتين التاليتين؛ اختر المجموعة كمرجع مشهد للفيديو أو الفيديو الطويل أو MV. صور ثنائية الأبعاد وليست نموذجاً ثلاثي الأبعاد؛ تطابق التخطيط غير مضمون.", "أمامية واسعة", "جانبية واسعة", "تخطيط علوي"],
    vi: ["Thiết lập cảnh nhiều góc", "Tạo góc rộng chính diện, bên cạnh và bố cục từ trên", "Chỉ HiDream / Klein. Ảnh đầu làm tham chiếu cho hai ảnh sau; chọn nhóm đã lưu làm tham chiếu cảnh cho video, video dài hoặc MV. Đây là ảnh 2D, không phải mô hình 3D; bố cục không được bảo đảm đồng nhất.", "Chính diện rộng", "Góc bên rộng", "Bố cục từ trên"],
    id: ["Prasetel adegan multi-sudut", "Buat tampak depan lebar, samping lebar dan tata letak atas", "Hanya HiDream / Klein. Gambar pertama memandu dua berikutnya; pilih grup sebagai referensi adegan untuk video, video panjang atau MV. Gambar 2D, bukan model 3D; konsistensi tata letak tidak dijamin.", "Depan lebar", "Samping lebar", "Tata letak atas"],
    ru: ["Многовидовая сцена", "Создать фронтальный, боковой и верхний виды", "Только HiDream / Klein. Первый вид направляет следующие; выберите сохранённую группу как референс сцены для видео, длинного видео или MV. Это 2D-изображения, не 3D-модель; точность планировки не гарантирована.", "Фронтальный широкий", "Боковой широкий", "План сверху"],
  };
  const scene = document.querySelector("#image-scene-views");
  const sceneCameraHints = {
    en: "Each view must differ by at least 30 degrees of camera rotation. Side view rotates about 90 degrees to the right boundary; overhead tilts about 90 degrees straight down, with the ceiling removed for interiors. Unseen areas are inferred; models may still retain the original viewpoint.",
    "zh-CN": "每个视角至少相差 30 度机位旋转：侧视约旋转 90 度到右侧边界，俯视约下倾 90 度垂直向下，室内移除顶棚展示剖视。未见区域由模型推测；模型仍可能保留原视角。",
    "zh-TW": "每個視角至少相差 30 度機位旋轉：側視約旋轉 90 度到右側邊界，俯視約下傾 90 度垂直向下，室內移除頂棚展示剖視。未見區域由模型推測；模型仍可能保留原視角。",
    fr: "Chaque vue doit différer d'au moins 30 degrés de rotation de caméra : la vue latérale pivote d'environ 90 degrés vers le bord droit, la vue du dessus s'incline d'environ 90 degrés vers le bas, sans plafond en intérieur. Les zones cachées sont imaginées ; le modèle peut conserver le point de vue initial.",
    de: "Jede Ansicht muss sich um mindestens 30 Grad Kameradrehung unterscheiden: die Seitenansicht dreht sich um etwa 90 Grad zum rechten Rand, die Draufsicht neigt sich um etwa 90 Grad nach unten, bei entferntem Raumdach. Verdeckte Bereiche werden geschätzt; das Modell kann die ursprüngliche Perspektive beibehalten.",
    ja: "各ビューは少なくとも30度のカメラ回転差が必要です。側面は約90度右端へ回転し、俯瞰は約90度下へ傾けて真上から撮影、室内は天井を外した断面表示です。見えない領域は推測され、元の視点が残る場合もあります。",
    ko: "각 뷰는 최소 30도 카메라 회전 차이가 필요합니다. 측면은 약 90도 오른쪽 경계로 회전하고, 위쪽은 약 90도 아래로 기울여 수직으로 내려다보며 실내 천장을 제거합니다. 보이지 않는 영역은 추정하며 원래 시점이 유지될 수 있습니다.",
    es: "Cada vista debe diferir al menos 30 grados de rotación de cámara: la lateral gira unos 90 grados hacia el límite derecho, la superior se inclina unos 90 grados hacia abajo, sin techo en interiores. Las zonas ocultas se infieren; el modelo puede mantener el punto de vista original.",
    pt: "Cada vista deve diferir em pelo menos 30 graus de rotação de câmera: a lateral gira cerca de 90 graus para o limite direito, a superior inclina cerca de 90 graus para baixo, sem teto em interiores. Áreas ocultas são inferidas; o modelo pode manter o ponto de vista original.",
    tr: "Her görünüm en az 30 derece kamera dönüşü farkı içermelidir: yan görünüm yaklaşık 90 derece sağ sınıra döner, üst görünüm yaklaşık 90 derece aşağı eğilir ve iç mekânda tavan kaldırılır. Görünmeyen alanlar tahmin edilir; ilk açı korunabilir.",
    ar: "يجب أن يختلف كل منظر بما لا يقل عن 30 درجة من دوران الكاميرا: المنظر الجانبي يدور نحو 90 درجة إلى الحد الأيمن، والمنظر العلوي يميل نحو 90 درجة إلى الأسفل مع إزالة السقف للداخل. تُستنتج المناطق المخفية؛ قد يحتفظ النموذج بالزاوية الأصلية.",
    vi: "Mỗi góc nhìn phải khác nhau ít nhất 30 độ xoay máy ảnh: góc bên xoay khoảng 90 độ sang ranh giới phải, góc trên nghiêng khoảng 90 độ xuống dưới và bỏ trần với nội thất. Vùng khuất được suy đoán; mô hình vẫn có thể giữ góc gốc.",
    id: "Setiap tampilan harus berbeda setidaknya 30 derajat rotasi kamera: tampak samping berputar sekitar 90 derajat ke batas kanan, tampak atas miring sekitar 90 derajat ke bawah tanpa langit-langit untuk interior. Area tersembunyi diperkirakan; sudut awal dapat tetap dipertahankan.",
    ru: "Каждый вид должен отличаться не менее чем на 30 градусов поворота камеры: боковой поворачивается примерно на 90 градусов к правой границе, верхний наклоняется примерно на 90 градусов вниз, без потолка для интерьера. Скрытые области домысливаются; модель может сохранить исходный ракурс.",
  };
  const sceneText = () => sceneStrings[document.documentElement.lang] || sceneStrings.en;
  const text = () => strings[document.documentElement.lang] || strings.en;
  const limit = () => {
    const max = {"hidream": 3, "flux2-klein-4b": 5}[imageModelChoice.value] || 0;
    return max && scene.checked ? max - 1 : max;
  };
  const message = (value, error = false) => {
    status.hidden = !value;
    status.textContent = value;
    status.classList.toggle("error", error);
  };
  function render() {
    const labels = text();
    const max = limit();
    const locked = pending || ["queued", "loading", "running", "cancelling"].includes(currentJob?.status);
    const supported = ["hidream", "flux2-klein-4b"].includes(imageModelChoice.value);
    scene.disabled = locked || !supported;
    if (!supported) scene.checked = false;
    document.querySelector("[data-image-scene-title]").textContent = sceneText()[0];
    document.querySelector("[data-image-scene-enable]").textContent = sceneText()[1];
    document.querySelector("[data-image-scene-hint]").textContent =
      `${sceneText()[2]} ${sceneCameraHints[document.documentElement.lang] || sceneCameraHints.en}`;
    panel.hidden = max === 0;
    panel.querySelector('[data-image-reference-label="title"]').textContent = labels[0];
    panel.querySelector('[data-image-reference-label="upload"]').textContent = labels[1];
    panel.querySelector('[data-image-reference-label="history"]').textContent = labels[2];
    panel.querySelector("[data-image-reference-hint]").textContent = labels[9].replace("{n}", max);
    upload.disabled = history.disabled = locked || rows.length >= max || !max;
    history.replaceChildren(new Option(labels[3], ""), ...items.map(item =>
      new Option(item.name || item.prompt?.slice(0, 80) || item.id.slice(0, 8), item.id)));
    list.replaceChildren(...rows.map((row, index) => {
      const card = document.createElement("div");
      card.className = "image-reference-card";
      const image = document.createElement("img");
      image.src = row.url;
      image.alt = `${index + 1}. ${row.name}`;
      const caption = document.createElement("p");
      caption.textContent = image.alt;
      const actions = document.createElement("div");
      actions.className = "workflow-actions";
      for (const [label, offset] of [[4, 0], [5, -1], [6, 1]]) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "workflow-secondary";
        button.textContent = labels[label];
        button.disabled = locked || (offset < 0 && !index) || (offset > 0 && index === rows.length - 1);
        button.addEventListener("click", () => {
          if (!offset) rows.splice(index, 1);
          else [rows[index], rows[index + offset]] = [rows[index + offset], rows[index]];
          message("");
          render();
          panel.dispatchEvent(new Event("change", {bubbles: true}));
        });
        actions.append(button);
      }
      card.append(image, caption, actions);
      return card;
    }));
    if (max && rows.length > max) message(`${labels[8]}: ${labels[9].replace("{n}", max)}`, true);
  }
  async function add(sources) {
    if (pending) return;
    pending = true;
    message(text()[7]);
    updateParameterControls();
    render();
    try {
      if (sources.length + rows.length > limit()) throw new Error(text()[9].replace("{n}", limit()));
      for (const source of sources) {
        const blob = source.file || await (async () => {
          const response = await fetch(source.url);
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.blob();
        })();
        if (!blob.size || blob.size > 20 * 1024 * 1024) throw new Error(text()[9].replace("{n}", limit()));
        const response = await fetch("/api/first-frames", {
          method: "POST", headers: {"Content-Type": "application/octet-stream"}, body: blob,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
        if (typeof data.id !== "string" || data.image_url !== `/api/first-frames/${data.id}`) {
          throw new Error("invalid_upload_response");
        }
        if (rows.some(row => row.id === data.id)) throw new Error("duplicate_reference_image");
        rows.push({id: data.id, url: data.image_url, name: source.name});
      }
      message("");
    } catch (error) {
      message(`${text()[8]}: ${error.message}`, true);
    } finally {
      pending = false;
      upload.value = "";
      render();
      updateParameterControls();
      panel.dispatchEvent(new Event("change", {bubbles: true}));
    }
  }
  upload.addEventListener("change", () => add([...upload.files].map(file => ({file, name: file.name}))));
  history.addEventListener("change", () => {
    const item = items.find(item => item.id === history.value);
    if (item) add([{url: item.image_url, name: item.name || item.prompt?.slice(0, 80) || item.id}]);
  });
  languageSelect.addEventListener("change", render);
  scene.addEventListener("change", () => {
    if (scene.checked) document.querySelector("#image-turnaround").checked = false;
    updateLocalModelControls();
  });
  window.MiniMuvImageReferences = {
    render, busy: () => pending,
    viewLabel(view) {
      const index = ["scene_front", "scene_side", "scene_overview"].indexOf(view);
      return index < 0 ? "" : sceneText()[index + 3];
    },
    history(values) {
      items = values.filter(item => item.kind === "image" && item.image_url);
      render();
    },
    load(ids) {
      rows = ids.map(id => ({id, url: `/api/first-frames/${id}`, name: id.slice(0, 8)}));
      message("");
      render();
    },
    payload() {
      if (!limit()) return {};
      if (rows.length > limit()) throw new Error(text()[9].replace("{n}", limit()));
      return rows.length ? {reference_image_ids: rows.map(row => row.id)} : {};
    },
  };
  window.MiniMuvImageReferences.history(historyItems);
})();
