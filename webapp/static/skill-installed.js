const installedSkillKeys = ["installed", "install", "reviewer", "execution", "capabilities", "fidelity", "contracts", "licensing", "enable", "disable", "delete", "confirm", "selection", "hint", "empty", "stale", "limit", "saved", "error"];
const installedSkillTranslations = {
  en: ["Installed Skills", "Approve & install (disabled)", "Reviewer name", "I checked: no execution, networking or prompt injection.", "I checked: no unsupported capabilities.", "I checked: faithful editing / intended story adaptation.", "I checked: output and timing contracts are preserved.", "I checked: license, attribution and notices can be preserved.", "Enable", "Disable", "Delete", "Approve this exact candidate and install it disabled?", "Optional Skills", "Select up to 4 enabled Skills; numbers show injection order. Results remain editable; no media generation starts automatically.", "No matching enabled Skills", "Snapshot changed: reconvert and review.", "Select at most 4 Skills.", "Installed disabled; enable separately.", "Skill operation failed"],
  "zh-CN": ["已安装 Skill", "批准并安装（默认禁用）", "审核者姓名", "已审核：无执行、联网或提示词注入。", "已审核：无虚构或不支持的能力。", "已审核：忠实优化或预期故事改编。", "已审核：保持输出和时长合同。", "已审核：可保留许可、署名与通知义务。", "启用", "禁用", "删除", "批准此精确候选并安装为禁用状态？", "可选 Skill", "最多选择4个已启用Skill；编号表示注入顺序。结果仍可编辑，不会自动开始媒体生成。", "没有匹配的已启用Skill", "快照已变更：重新转换和审阅。", "最多选择4个Skill。", "已安装为禁用状态；需单独启用。", "Skill操作失败"],
  "zh-TW": ["已安裝 Skill", "批准並安裝（預設停用）", "審核者姓名", "已審核：無執行、連網或提示詞注入。", "已審核：無虛構或不支援的能力。", "已審核：忠實最佳化或預期故事改編。", "已審核：保持輸出與時長契約。", "已審核：可保留授權、署名與通知義務。", "啟用", "停用", "刪除", "批准此精確候選並安裝為停用狀態？", "可選 Skill", "最多選擇4個已啟用Skill；編號表示注入順序。結果仍可編輯，不會自動開始媒體生成。", "沒有符合的已啟用Skill", "快照已變更：重新轉換與審閱。", "最多選擇4個Skill。", "已安裝為停用狀態；需單獨啟用。", "Skill操作失敗"],
  fr: ["Skills installés", "Approuver et installer (désactivé)", "Nom du réviseur", "Vérifié : aucune exécution, réseau ou injection.", "Vérifié : aucune capacité non prise en charge.", "Vérifié : fidélité / adaptation prévue.", "Vérifié : contrats de sortie et durée préservés.", "Vérifié : licence, attribution et avis conservables.", "Activer", "Désactiver", "Supprimer", "Approuver ce candidat exact et l'installer désactivé ?", "Skills facultatifs", "Choisissez jusqu'à 4 Skills actifs ; numéros = ordre d'injection. Résultats modifiables, aucune génération automatique.", "Aucun Skill actif compatible", "Instantané modifié : reconvertir et réviser.", "4 Skills maximum.", "Installé désactivé ; activation séparée.", "Échec de l'opération Skill"],
  de: ["Installierte Skills", "Genehmigen und installieren (inaktiv)", "Name des Prüfers", "Geprüft: keine Ausführung, Netzwerke oder Prompt-Injektion.", "Geprüft: keine unbelegten Fähigkeiten.", "Geprüft: treue Bearbeitung / geplante Adaption.", "Geprüft: Ausgabe- und Zeitverträge bleiben erhalten.", "Geprüft: Lizenz, Namensnennung und Hinweise bleiben erhalten.", "Aktivieren", "Deaktivieren", "Löschen", "Diesen exakten Kandidaten genehmigen und inaktiv installieren?", "Optionale Skills", "Bis zu 4 aktive Skills auswählen; Nummern zeigen die Reihenfolge. Ergebnisse bleiben editierbar; keine automatische Generierung.", "Keine passenden aktiven Skills", "Snapshot geändert: neu konvertieren und prüfen.", "Höchstens 4 Skills.", "Inaktiv installiert; separat aktivieren.", "Skill-Vorgang fehlgeschlagen"],
  ja: ["インストール済みSkill", "承認してインストール（無効）", "確認者名", "確認済み：実行・通信・プロンプト注入なし。", "確認済み：未対応の能力を主張しない。", "確認済み：忠実な編集／意図した物語の脚色。", "確認済み：出力と時間の契約を維持。", "確認済み：ライセンス・帰属・通知を保持可能。", "有効化", "無効化", "削除", "この正確な候補を承認し、無効でインストールしますか？", "任意のSkill", "有効なSkillを最大4個選択。番号は注入順です。結果は編集可能で、メディア生成は自動開始しません。", "適合する有効なSkillなし", "スナップショット変更：再変換して確認。", "Skillは最大4個です。", "無効でインストール済み。別途有効化してください。", "Skill操作に失敗"],
  ko: ["설치된 Skill", "승인 및 설치 (비활성)", "검토자 이름", "검토 완료: 실행, 네트워크, 프롬프트 주입 없음.", "검토 완료: 미지원 기능 주장 없음.", "검토 완료: 충실한 편집 / 의도한 이야기 각색.", "검토 완료: 출력 및 시간 계약 유지.", "검토 완료: 라이선스, 저작자, 고지 보존 가능.", "활성화", "비활성화", "삭제", "이 정확한 후보를 승인하고 비활성으로 설치할까요?", "선택적 Skill", "활성 Skill을 최대 4개 선택하세요. 번호는 주입 순서입니다. 결과는 편집 가능하며 미디어 생성은 자동 시작되지 않습니다.", "일치하는 활성 Skill 없음", "스냅샷 변경: 다시 변환하고 검토하세요.", "Skill은 최대 4개입니다.", "비활성으로 설치됨. 별도로 활성화하세요.", "Skill 작업 실패"],
  es: ["Skills instalados", "Aprobar e instalar (inactivo)", "Nombre del revisor", "Revisado: sin ejecución, red ni inyección.", "Revisado: sin capacidades no admitidas.", "Revisado: edición fiel / adaptación prevista.", "Revisado: contratos de salida y duración conservados.", "Revisado: licencia, atribución y avisos conservables.", "Activar", "Desactivar", "Eliminar", "¿Aprobar este candidato exacto e instalarlo inactivo?", "Skills opcionales", "Elige hasta 4 Skills activos; los números indican el orden. Resultados editables, sin generación automática.", "No hay Skills activos compatibles", "Instantánea cambiada: reconvertir y revisar.", "Máximo 4 Skills.", "Instalado inactivo; activar por separado.", "Error de operación Skill"],
  pt: ["Skills instalados", "Aprovar e instalar (inativo)", "Nome do revisor", "Revisto: sem execução, rede ou injeção.", "Revisto: sem capacidades não suportadas.", "Revisto: edição fiel / adaptação prevista.", "Revisto: contratos de saída e duração mantidos.", "Revisto: licença, atribuição e avisos preserváveis.", "Ativar", "Desativar", "Excluir", "Aprovar este candidato exato e instalar inativo?", "Skills opcionais", "Selecione até 4 Skills ativos; números indicam a ordem. Resultados editáveis, sem geração automática.", "Nenhum Skill ativo compatível", "Instantâneo alterado: reconverter e rever.", "Máximo de 4 Skills.", "Instalado inativo; ative separadamente.", "Falha na operação Skill"],
  tr: ["Yüklü Skill'ler", "Onayla ve yükle (devre dışı)", "İnceleyen adı", "İncelendi: yürütme, ağ veya istem enjeksiyonu yok.", "İncelendi: desteklenmeyen yetenek iddiası yok.", "İncelendi: sadık düzenleme / amaçlanan uyarlama.", "İncelendi: çıktı ve süre sözleşmeleri korunuyor.", "İncelendi: lisans, atıf ve bildirimler korunabilir.", "Etkinleştir", "Devre dışı bırak", "Sil", "Bu tam adayı onaylayıp devre dışı yükle?", "İsteğe bağlı Skill'ler", "En fazla 4 etkin Skill seçin; sayılar sıralamayı gösterir. Sonuçlar düzenlenebilir, medya otomatik üretilmez.", "Uyumlu etkin Skill yok", "Anlık görüntü değişti: dönüştürüp inceleyin.", "En fazla 4 Skill.", "Devre dışı yüklendi; ayrıca etkinleştirin.", "Skill işlemi başarısız"],
  ar: ["Skills المثبتة", "موافقة وتثبيت (معطّل)", "اسم المراجع", "راجعت: لا تنفيذ أو شبكة أو حقن تعليمات.", "راجعت: لا قدرات غير مدعومة.", "راجعت: تحرير أمين أو اقتباس القصة المقصود.", "راجعت: حفظ عقد المخرجات والمدة.", "راجعت: يمكن حفظ الترخيص والنسب والإشعارات.", "تفعيل", "تعطيل", "حذف", "الموافقة على هذا المرشح بالضبط وتثبيته معطلاً؟", "Skills اختيارية", "اختر حتى 4 Skills مفعّلة؛ الأرقام ترتيب الإدراج. النتائج قابلة للتحرير ولا يبدأ توليد الوسائط تلقائياً.", "لا Skills مفعّلة متوافقة", "تغيّرت اللقطة: أعد التحويل والمراجعة.", "الحد 4 Skills.", "ثُبّت معطلاً؛ التفعيل مستقل.", "فشلت عملية Skill"],
  vi: ["Skill đã cài", "Duyệt và cài (tắt)", "Tên người duyệt", "Đã kiểm tra: không thực thi, mạng hay chèn lệnh.", "Đã kiểm tra: không tuyên bố khả năng không hỗ trợ.", "Đã kiểm tra: chỉnh sửa trung thực / chuyển thể dự kiến.", "Đã kiểm tra: giữ hợp đồng đầu ra và thời lượng.", "Đã kiểm tra: giữ giấy phép, ghi công và thông báo.", "Bật", "Tắt", "Xóa", "Duyệt đúng ứng viên này và cài ở trạng thái tắt?", "Skill tùy chọn", "Chọn tối đa 4 Skill đang bật; số chỉ thứ tự chèn. Kết quả vẫn sửa được, không tự tạo phương tiện.", "Không có Skill đang bật phù hợp", "Ảnh chụp đã đổi: chuyển đổi và duyệt lại.", "Tối đa 4 Skill.", "Đã cài ở trạng thái tắt; bật riêng.", "Thao tác Skill thất bại"],
  id: ["Skill terpasang", "Setujui dan pasang (nonaktif)", "Nama peninjau", "Ditinjau: tanpa eksekusi, jaringan atau injeksi.", "Ditinjau: tanpa klaim kemampuan tak didukung.", "Ditinjau: suntingan setia / adaptasi yang dimaksud.", "Ditinjau: kontrak keluaran dan durasi terjaga.", "Ditinjau: lisensi, atribusi dan pemberitahuan terjaga.", "Aktifkan", "Nonaktifkan", "Hapus", "Setujui kandidat persis ini dan pasang nonaktif?", "Skill opsional", "Pilih maksimal 4 Skill aktif; angka menunjukkan urutan. Hasil tetap dapat disunting, tanpa generasi otomatis.", "Tidak ada Skill aktif yang cocok", "Snapshot berubah: konversi dan tinjau ulang.", "Maksimal 4 Skill.", "Terpasang nonaktif; aktifkan terpisah.", "Operasi Skill gagal"],
  ru: ["Установленные Skills", "Одобрить и установить (выключено)", "Имя проверяющего", "Проверено: нет выполнения, сети или инъекций.", "Проверено: нет неподдерживаемых возможностей.", "Проверено: верная правка / задуманная адаптация.", "Проверено: сохранены контракты вывода и длительности.", "Проверено: можно сохранить лицензию, авторство и уведомления.", "Включить", "Выключить", "Удалить", "Одобрить именно этот кандидат и установить выключенным?", "Необязательные Skills", "Выберите до 4 включённых Skills; числа — порядок добавления. Результат редактируемый; нет автоматической генерации.", "Нет подходящих включённых Skills", "Снимок изменился: повторить преобразование и проверку.", "Не более 4 Skills.", "Установлено выключенным; включите отдельно.", "Ошибка операции Skill"]
};
const skillInstallLabels = {
  en: ["Install draft (disabled)", "Install this draft after automatic validation? Enable separately."],
  "zh-CN": ["安装草稿（默认禁用）", "自动校验后安装此草稿？安装后需单独启用。"],
  "zh-TW": ["安裝草稿（預設停用）", "自動校驗後安裝此草稿？安裝後須單獨啟用。"],
  fr: ["Installer le brouillon (désactivé)", "Installer après validation automatique ? Activez séparément."],
  de: ["Entwurf installieren (inaktiv)", "Nach automatischer Prüfung installieren? Separat aktivieren."],
  ja: ["草稿をインストール（無効）", "自動検証後に草稿をインストールしますか？有効化は別途行ってください。"],
  ko: ["초안 설치 (비활성)", "자동 검증 후 초안을 설치할까요? 활성화는 별도로 하세요."],
  es: ["Instalar borrador (inactivo)", "¿Instalar tras la validación automática? Activa por separado."],
  pt: ["Instalar rascunho (inativo)", "Instalar após validação automática? Ative separadamente."],
  tr: ["Taslağı yükle (devre dışı)", "Otomatik doğrulama sonrası yükle? Ayrı etkinleştirin."],
  ar: ["تثبيت المسودة (معطلة)", "تثبيت بعد التحقق التلقائي؟ فعّل بشكل منفصل."],
  vi: ["Cài bản nháp (tắt)", "Cài sau kiểm tra tự động? Bật riêng sau đó."],
  id: ["Instal draf (nonaktif)", "Instal setelah validasi otomatis? Aktifkan terpisah."],
  ru: ["Установить черновик (выключено)", "Установить после автоматической проверки? Включите отдельно."]
};
for (const [language, values] of Object.entries(skillInstallLabels)) {
  installedSkillTranslations[language][installedSkillKeys.indexOf("install")] = values[0];
  installedSkillTranslations[language][installedSkillKeys.indexOf("confirm")] = values[1];
}
const installedCategoryKeys = ["categories", "saveCategories", "video", "image", "music", "long-video", "mv", "categoryHint"];
const installedCategoryTranslations = {
  en: ["Skill categories (multiple)", "Save categories", "Video", "Image", "Music", "Long video", "MV creation", "Categories only filter calling panels; no added capabilities."],
  "zh-CN": ["Skill 类别（可多选）", "保存类别", "视频", "图像", "音乐", "长视频", "MV生成", "类别仅用于筛选，不增加能力。"],
  "zh-TW": ["Skill 類別（可多選）", "儲存類別", "影片", "圖像", "音樂", "長影片", "MV生成", "類別僅用於篩選，不增加能力。"],
  fr: ["Catégories de Skill (multiples)", "Enregistrer les catégories", "Vidéo", "Image", "Musique", "Vidéo longue", "Création MV", "Les catégories filtrent uniquement les panneaux."],
  de: ["Skill-Kategorien (Mehrfachauswahl)", "Kategorien speichern", "Video", "Bild", "Musik", "Langvideo", "MV-Erstellung", "Kategorien dienen nur zum Filtern."],
  ja: ["Skillの分類（複数選択可）", "分類を保存", "動画", "画像", "音楽", "長編動画", "MV制作", "分類は絞り込み用で、能力は追加されません。"],
  ko: ["Skill 분류 (복수 선택)", "분류 저장", "동영상", "이미지", "음악", "긴 동영상", "MV 제작", "분류는 필터링용이며 기능을 추가하지 않습니다."],
  es: ["Categorías de Skill (múltiples)", "Guardar categorías", "Vídeo", "Imagen", "Música", "Vídeo largo", "Creación de MV", "Las categorías solo filtran la selección."],
  pt: ["Categorias de Skill (múltiplas)", "Salvar categorias", "Vídeo", "Imagem", "Música", "Vídeo longo", "Criação de MV", "As categorias servem apenas para filtragem."],
  tr: ["Skill kategorileri (çoklu)", "Kategorileri kaydet", "Video", "Görsel", "Müzik", "Uzun video", "MV oluşturma", "Kategoriler sadece seçimleri filtreler."],
  ar: ["فئات Skill (اختيار متعدد)", "حفظ الفئات", "فيديو", "صورة", "موسيقى", "فيديو طويل", "إنشاء MV", "الفئات للتصفية فقط ولا تضيف قدرات."],
  vi: ["Danh mục Skill (chọn nhiều)", "Lưu danh mục", "Video", "Hình ảnh", "Âm nhạc", "Video dài", "Tạo MV", "Danh mục chỉ dùng để lọc lựa chọn."],
  id: ["Kategori Skill (pilihan ganda)", "Simpan kategori", "Video", "Gambar", "Musik", "Video panjang", "Pembuatan MV", "Kategori hanya untuk memfilter pilihan."],
  ru: ["Категории Skill (несколько)", "Сохранить категории", "Видео", "Изображение", "Музыка", "Длинное видео", "Создание MV", "Категории служат только для фильтрации."]
};
const presetManagerKeys = ["installed", "selection", "confirm", "saved", "hint"];
const presetManagerTranslations = {
  en: ["Available presets / legacy Skills", "Creative presets", "Publish this draft as an enabled, selectable preset? No media generation will start.", "Preset available; select it in a task.", "Select up to 4 compatible presets in order. Methods are optional references; results remain editable. No automatic media generation."],
  "zh-CN": ["可用预设 / 兼容旧Skill", "创作预设", "将此草稿发布为可选预设？发布后已启用，不会开始媒体生成。", "预设已可用；请在任务中选择。", "按顺序选择最多4个适用预设。方法是可选参考，结果仍可编辑，不自动生成媒体。"],
  "zh-TW": ["可用預設 / 相容舊Skill", "創作預設", "將此草稿發布為可選預設？發布後已啟用，不會開始媒體生成。", "預設已可用；請在任務中選擇。", "按順序選擇最多4個適用預設。方法是可選參考，結果仍可編輯，不自動生成媒體。"],
  fr: ["Préréglages disponibles / anciens Skills", "Préréglages créatifs", "Publier ce brouillon comme préréglage actif sélectionnable, sans génération média ?", "Préréglage disponible ; sélectionnez-le dans une tâche.", "Choisissez jusqu'à 4 préréglages compatibles dans l'ordre. Références facultatives, résultats modifiables, sans génération automatique."],
  de: ["Verfügbare Vorlagen / bisherige Skills", "Kreativvorlagen", "Entwurf als aktive wählbare Vorlage veröffentlichen, ohne Mediengenerierung?", "Vorlage verfügbar; in einer Aufgabe auswählen.", "Bis zu 4 passende Vorlagen der Reihe nach wählen. Optionale Referenzen, editierbare Ergebnisse, keine automatische Generierung."],
  ja: ["利用可能なプリセット / 旧Skill", "創作プリセット", "草稿を有効な選択可能プリセットとして公開しますか？メディア生成は開始しません。", "プリセットが利用可能です。タスクで選択してください。", "対応プリセットを順番に最大4個選択できます。任意の参考であり、結果は編集可能です。自動生成はしません。"],
  ko: ["사용 가능한 프리셋 / 기존 Skill", "창작 프리셋", "초안을 활성 선택 프리셋으로 게시할까요? 미디어 생성은 시작하지 않습니다.", "프리셋 사용 가능; 작업에서 선택하세요.", "호환 프리셋을 순서대로 최대 4개 선택하세요. 선택적 참고이며 결과 편집이 가능합니다. 자동 생성하지 않습니다."],
  es: ["Preajustes disponibles / Skills anteriores", "Preajustes creativos", "¿Publicar este borrador como preajuste activo seleccionable sin generar medios?", "Preajuste disponible; selecciónalo en una tarea.", "Elige hasta 4 preajustes compatibles en orden. Referencias opcionales, resultados editables, sin generación automática."],
  pt: ["Predefinições disponíveis / Skills antigos", "Predefinições criativas", "Publicar como predefinição ativa selecionável, sem gerar mídia?", "Predefinição disponível; selecione numa tarefa.", "Selecione até 4 predefinições compatíveis em ordem. Referências opcionais, resultados editáveis, sem geração automática."],
  tr: ["Kullanılabilir önayarlar / eski Skill'ler", "Yaratıcı önayarlar", "Taslak etkin seçilebilir önayar olarak yayımlansın mı? Medya üretilmez.", "Önayar hazır; görevde seçin.", "Sırayla en fazla 4 uyumlu önayar seçin. İsteğe bağlı kaynaklardır, sonuçlar düzenlenebilir; otomatik üretim yoktur."],
  ar: ["إعدادات متاحة / Skills سابقة", "إعدادات إبداعية", "نشر المسودة كإعداد مفعّل قابل للاختيار دون توليد وسائط؟", "الإعداد متاح؛ اختره في مهمة.", "اختر حتى 4 إعدادات متوافقة بالترتيب. مراجع اختيارية ونتائج قابلة للتحرير دون توليد تلقائي."],
  vi: ["Mẫu có sẵn / Skill cũ", "Mẫu sáng tạo", "Xuất bản nháp thành mẫu đang bật để chọn, không tạo phương tiện?", "Mẫu sẵn sàng; chọn trong tác vụ.", "Chọn tối đa 4 mẫu tương thích theo thứ tự. Tham khảo tùy chọn, kết quả có thể sửa; không tạo tự động."],
  id: ["Preset tersedia / Skill lama", "Preset kreatif", "Terbitkan draf sebagai preset aktif yang dapat dipilih tanpa membuat media?", "Preset tersedia; pilih dalam tugas.", "Pilih hingga 4 preset kompatibel secara berurutan. Referensi opsional, hasil dapat diedit; tanpa pembuatan otomatis."],
  ru: ["Доступные пресеты / прежние Skills", "Творческие пресеты", "Опубликовать черновик как активный выбираемый пресет без создания медиа?", "Пресет доступен; выберите в задаче.", "Выберите до 4 совместимых пресетов по порядку. Необязательные справки, редактируемые результаты, без автоматической генерации."]
};
function installedSkillText(key, language) {
  if (presetManagerKeys.includes(key)) return (presetManagerTranslations[language] || presetManagerTranslations.en)[presetManagerKeys.indexOf(key)];
  const categoryValidationHints = {
    en: "Validate candidate to unlock categories.",
    "zh-CN": "校验后解锁类别。",
    "zh-TW": "校驗後解鎖類別。",
    fr: "Validez pour débloquer les catégories.",
    de: "Zur Freischaltung zuerst validieren.",
    ja: "検証後に分類が解放されます。",
    ko: "검증 후 분류가 잠금 해제됩니다.",
    es: "Valida para desbloquear categorías.",
    pt: "Valide para liberar categorias.",
    tr: "Kategorileri açmak için doğrulayın.",
    ar: "تحقق أولاً لإتاحة الفئات.",
    vi: "Xác thực để mở khóa danh mục.",
    id: "Validasi untuk membuka kategori.",
    ru: "Проверьте для открытия категорий."
  };
  if (installedCategoryKeys.includes(key)) {
    const label = (installedCategoryTranslations[language] || installedCategoryTranslations.en)[installedCategoryKeys.indexOf(key)];
    return key === "categoryHint" ? `${categoryValidationHints[language] || categoryValidationHints.en} ${label}` : label;
  }
  return (installedSkillTranslations[language] || installedSkillTranslations.en)[installedSkillKeys.indexOf(key)];
}

(() => {
  const language = () => document.querySelector("#language").value;
  const t = key => installedSkillText(key, language());
  const choices = { prompt: [], "mv-prompt": [], storyboard: [] };
  const categoryEdits = new Map();
  let items = [];
  let selectedInstalledId = null;
  let loadError = "";
  let applyAvailable = false;
  let sequence = 0;
  const categories = ["video", "image", "music", "long-video", "mv"];
  const supported = bindings => categories.filter(category => bindings.some(binding => binding.mode === category));
  const context = scope => ({
    mode: scope === "storyboard" ? "long-video" : scope === "mv-prompt" ? "mv" : activeMode,
    target: scope === "storyboard" || scope === "mv-prompt" ? videoModelChoice.value :
      activeMode === "image" ? imageModelChoice.value : activeMode === "music" ? musicModelChoice.value : videoModelChoice.value
  });
  const matches = (item, scope) => {
    if (scope === "prompt" && activeMode === "mv") return false;
    const {mode, target} = context(scope);
    return item.enabled && item.available && (item.categories || supported(item.bindings)).includes(mode) && item.bindings.some(binding =>
      binding.mode === mode && binding.task === (scope === "storyboard" ? "storyboard" : "prompt-enhancement") &&
      (binding.target_models.includes("*") || binding.target_models.includes(target)));
  };
  const text = (tag, value) => {
    const node = document.createElement(tag);
    node.textContent = value;
    return node;
  };
  function categoryControls(bindings, selected, onChange) {
    const group = text("div", "");
    group.className = "skill-category-options";
    const allowed = supported(bindings);
    for (const category of categories) {
      const label = text("label", "");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = category;
      checkbox.disabled = !allowed.includes(category);
      checkbox.checked = !checkbox.disabled && selected.includes(category);
      checkbox.addEventListener("change", onChange);
      label.append(checkbox, text("span", t(category)));
      group.append(label);
    }
    return group;
  }
  const checkedCategories = group => Array.from(group.querySelectorAll('input[type="checkbox"]:checked'),
    checkbox => checkbox.value);
  function renderInstallCategories(bindings = []) {
    const container = document.querySelector("#skills-category-options");
    const allowed = supported(bindings);
    const signature = JSON.stringify(allowed);
    const selected = container.dataset.bindings === signature ? checkedCategories(container) : allowed;
    container.dataset.bindings = signature;
    container.replaceChildren(categoryControls(bindings, selected, () => {}));
  }
  async function api(path, payload) {
    const response = await fetch(path, payload === undefined ? {cache: "no-store"} : {
      method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || String(response.status));
    return data;
  }
  function renderSelectors() {
    for (const scope of ["prompt", "mv-prompt", "storyboard"]) {
      const container = document.querySelector(`#${scope}-skill-list`);
      container.replaceChildren();
      const available = items.filter(item => matches(item, scope));
      for (const item of available) {
        const label = text("label", "");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const selected = choices[scope].findIndex(ref => ref.id === item.id);
        checkbox.checked = selected !== -1;
        checkbox.addEventListener("change", () => {
          if (checkbox.checked) {
            if (choices[scope].length >= 4) {
              checkbox.checked = false;
              window.alert(t("limit"));
              return;
            }
            choices[scope].push({id: item.id, revision: item.revision});
          } else choices[scope] = choices[scope].filter(ref => ref.id !== item.id);
          renderSelectors();
        });
        label.append(checkbox, text("span", `${selected < 0 ? "" : `${selected + 1}. `}${item.name} ${item.version}`));
        container.append(label);
      }
      if (!available.length) container.append(text("p", t("empty")));
      if (loadError) container.append(text("p", `${t("error")}: ${loadError}`));
      if (choices[scope].some(ref => !available.some(i => i.id === ref.id && i.revision === ref.revision))) {
        const warning = text("p", t("stale"));
        const clear = text("button", t("disable"));
        clear.type = "button";
        clear.addEventListener("click", () => { choices[scope] = []; renderSelectors(); });
        container.append(warning, clear);
      }
    }
  }
  function renderManager() {
    const list = document.querySelector("#skills-installed-list");
    list.replaceChildren();
    if (selectedInstalledId && !items.some(item => item.id === selectedInstalledId)) {
      selectedInstalledId = null;
    }
    for (const item of items) {
      const card = text("div", "");
      const isSelected = selectedInstalledId === item.id;
      card.className = `skill-manager-card${isSelected ? " selected" : ""}`;
      card.tabIndex = 0;
      card.addEventListener("click", event => {
        if (event.target.closest && (event.target.closest("button") || event.target.closest("input") || event.target.closest("label"))) return;
        selectedInstalledId = selectedInstalledId === item.id ? null : item.id;
        renderManager();
      });
      card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
          if (event.target.closest && (event.target.closest("button") || event.target.closest("input") || event.target.closest("label"))) return;
          if (event.preventDefault) event.preventDefault();
          selectedInstalledId = selectedInstalledId === item.id ? null : item.id;
          renderManager();
        }
      });
      card.append(text("p", `${item.name} ${item.version} — ${t(item.enabled ? "enable" : "disable")}`),
        text("p", item.description || ""));
      if (!item.available) card.append(text("p", t("stale")));
      for (const action of ["enabled", "delete"]) {
        const button = text("button", t(action === "delete" ? "delete" : item.enabled ? "disable" : "enable"));
        button.type = "button";
        button.disabled = action === "delete" ? item.enabled : !item.available && !item.enabled;
        button.addEventListener("click", async () => {
          if (action === "delete" && !window.confirm(`${t("delete")}: ${item.name} ${item.version}?`)) return;
          card.querySelectorAll("button").forEach(control => { control.disabled = true; });
          try {
            await api(`/api/skills/installed/${item.id}/${action}`, {
              revision: item.revision, ...(action === "enabled" ? {enabled: !item.enabled} : {})
            });
            await refresh();
          } catch (error) {
            document.querySelector("#skills-installed-status").textContent = `${t("error")}: ${error.message}`;
          } finally { renderManager(); }
        });
        card.append(button);
      }
      const fieldset = text("fieldset", "");
      fieldset.className = "skill-selector skill-categories";
      fieldset.append(text("legend", t("categories")), text("p", t("categoryHint")));
      const save = text("button", t("saveCategories"));
      save.type = "button";
      const selected = item.categories || supported(item.bindings);
      const edit = categoryEdits.get(item.id);
      const currentCategories = edit?.revision === item.revision ? edit.categories : selected;
      const options = categoryControls(item.bindings, currentCategories, () => {
        const values = checkedCategories(options);
        categoryEdits.set(item.id, {revision: item.revision, categories: values});
        save.disabled = !values.length || JSON.stringify(values) === JSON.stringify(selected);
      });
      save.disabled = !currentCategories.length || JSON.stringify(currentCategories) === JSON.stringify(selected);
      save.addEventListener("click", async () => {
        const values = checkedCategories(options);
        if (save.disabled || !values.length) return;
        const states = Array.from(card.querySelectorAll("button, input"), control => [control, control.disabled]);
        states.forEach(([control]) => { control.disabled = true; });
        try {
          await api(`/api/skills/installed/${item.id}/categories`, {revision: item.revision, categories: values});
          categoryEdits.delete(item.id);
          await refresh();
        } catch (error) {
          document.querySelector("#skills-installed-status").textContent = `${t("error")}: ${error.message}`;
          states.forEach(([control, disabled]) => { control.disabled = disabled; });
        }
      });
      fieldset.append(options, save);
      card.append(fieldset);
      list.append(card);
    }
    if (loadError) list.append(text("p", `${t("error")}: ${loadError}`));
  }
  function translate() {
    const installOptions = document.querySelector("#skills-category-options");
    installOptions.querySelectorAll("label").forEach(label => {
      label.querySelector("span").textContent = t(label.querySelector("input").value);
    });
    document.querySelectorAll("[data-installed-skill-i18n]").forEach(node => {
      node.textContent = t(node.dataset.installedSkillI18n);
    });
    renderManager();
    renderSelectors();
  }
  async function refresh() {
    const current = ++sequence;
    document.querySelector("#skills-installed-storage").textContent = "";
    try {
      const data = await api("/api/skills/installed");
      if (sequence !== current) return;
      items = data.items;
      applyAvailable = data.preset_apply_available === true;
      document.querySelector("#skills-installed-storage").textContent = data.storage_path;
      loadError = "";
    } catch (error) {
      if (sequence !== current) return;
      loadError = error.message;
      items = [];
      applyAvailable = false;
      throw error;
    } finally {
      if (sequence === current) {
        renderManager(); renderSelectors();
        window.MiniMuvPresetAvailabilityChanged?.();
      }
    }
  }
  window.MiniMuvSkills = {
    text: t, refresh, renderSelectors, renderInstallCategories,
    applyAvailable: () => applyAvailable && !loadError,
    published(draftId) {
      if (loadError) throw new Error(`${t("error")}: ${loadError}`);
      return items.find(item => item.draft_id === draftId);
    },
    installCategories: () => checkedCategories(document.querySelector("#skills-category-options")),
    selection(scope) {
      if (loadError && choices[scope].length) throw new Error(`${t("error")}: ${loadError}`);
      for (const ref of choices[scope]) {
        const item = items.find(item => item.id === ref.id && item.revision === ref.revision);
        if (!item || !matches(item, scope)) throw new Error(t("stale"));
      }
      return choices[scope].length ? {skills: choices[scope].map(ref => ({...ref})), target_model: context(scope).target} : {};
    }
  };
  document.querySelector("#language").addEventListener("change", translate);
  document.querySelector("#skills-open").addEventListener("click", () => {
    refresh().catch(error => { document.querySelector("#skills-installed-status").textContent = `${t("error")}: ${error.message}`; });
  });
  document.querySelector("#skills-installed-refresh").addEventListener("click", () => {
    refresh().catch(error => { document.querySelector("#skills-installed-status").textContent = `${t("error")}: ${error.message}`; });
  });
  renderInstallCategories();
  translate();
  refresh().catch(error => { document.querySelector("#skills-installed-status").textContent = `${t("error")}: ${error.message}`; });
})();
