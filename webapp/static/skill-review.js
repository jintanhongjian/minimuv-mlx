const skillReviewKeys = [
  "title", "boundary", "drafts", "new", "refresh", "name", "model", "origin", "revision",
  "import", "folder", "missingRefs", "limits", "source", "prepare", "convert", "licenseHelp", "result", "validate",
  "save", "delete", "pending", "valid", "invalid", "stale", "saved", "busy", "error",
  "discard", "deleteConfirm", "empty", "conflict", "bindings", "evidence", "removed",
  "warnings", "blockers", "close"
];
const skillReviewTranslations = {
  en: ["Skill review", "Review drafts only: no installation, activation or creative injection. Validation is not human approval.", "Local drafts", "New", "Refresh", "Draft name", "Local text model", "Source origin (label, not fetched)", "Pinned revision", "Import UTF-8 text files", "Import a folder (reads every UTF-8 text file)", "Missing referenced files", "Up to 16 files, 24,000 characters each, 128 KiB per request. JSON source: [{\"path\":\"SKILL.md\",\"content\":\"text\"}]. Import replaces the source; files are never executed.", "Source files (editable JSON)", "Prepare source", "Convert", "Unknown/restricted licenses block conversion. Only the operator's local license review list can verify licensing.", "Candidate JSON (editable)", "Revalidate", "Save draft", "Delete draft", "Unvalidated / edits invalidate prior checks", "Schema and host bindings valid; human review still required", "Validation failed", "Snapshot changed. Prepare again and reconvert; old candidates remain unvalidated.", "Draft saved privately; reopening requires revalidation", "Working…", "Operation failed", "Discard unsaved changes?", "Permanently delete this draft?", "No saved drafts", "Draft changed elsewhere. Your edits are preserved; reopen before overwriting.", "Bindings / instructions", "Evidence / original source", "Removed material", "Warnings", "Blockers", "Close"],
  "zh-CN": ["Skill 审阅", "仅审阅草稿：不安装、不启用、不注入创作。校验不等于人工批准。", "本机草稿", "新建", "刷新", "草稿名称", "本地文本模型", "来源标识（不会联网获取）", "固定版本", "导入 UTF-8 文本文件", "导入文件夹（读取所有 UTF-8 文本文件）", "缺少被引用的文件", "最多16个文件，每个24000字符，请求128 KiB。源文件 JSON：[{\"path\":\"SKILL.md\",\"content\":\"正文\"}]。导入替换原文，不执行文件。", "源文件（可编辑 JSON）", "准备原文", "转换", "未知或受限许可阻止转换。只有操作者的本机许可审核清单能核实许可。", "候选 JSON（可编辑）", "重新校验", "保存草稿", "删除草稿", "未校验 / 修改使旧校验失效", "Schema 与宿主绑定通过；仍需人工审阅", "校验失败", "快照已变更。重新准备并转换；旧候选保持未校验。", "已私密保存；重新打开后需重新校验", "处理中…", "操作失败", "放弃未保存的修改？", "永久删除此草稿？", "暂无保存的草稿", "草稿已被其他操作修改。你的编辑已保留，请重新打开后再覆盖。", "用途绑定 / 指令", "证据 / 原文对照", "移除内容", "警告", "阻断项", "关闭"],
  "zh-TW": ["Skill 審閱", "僅審閱草稿：不安裝、不啟用、不注入創作。校驗不等於人工批准。", "本機草稿", "新增", "重新整理", "草稿名稱", "本機文字模型", "來源標識（不會連網取得）", "固定版本", "匯入 UTF-8 文字檔", "匯入資料夾（讀取所有 UTF-8 文字檔）", "缺少被引用的檔案", "最多16個檔案，每個24000字元，請求128 KiB。原文 JSON：[{\"path\":\"SKILL.md\",\"content\":\"正文\"}]。匯入取代原文，不執行檔案。", "原始檔案（可編輯 JSON）", "準備原文", "轉換", "未知或受限授權阻止轉換。僅操作者的本機授權審核清單可核實授權。", "候選 JSON（可編輯）", "重新校驗", "儲存草稿", "刪除草稿", "未校驗 / 修改使舊校驗失效", "Schema 與宿主綁定通過；仍需人工審閱", "校驗失敗", "快照已變更。重新準備並轉換；舊候選維持未校驗。", "已私密儲存；重新開啟後須重新校驗", "處理中…", "操作失敗", "捨棄未儲存的修改？", "永久刪除此草稿？", "尚無草稿", "草稿已被其他操作修改。編輯已保留，請重新開啟再覆寫。", "用途綁定 / 指令", "證據 / 原文對照", "移除內容", "警告", "阻斷項", "關閉"],
  fr: ["Révision des Skills", "Brouillons uniquement : aucune installation, activation ou injection créative. La validation n'est pas une approbation humaine.", "Brouillons locaux", "Nouveau", "Actualiser", "Nom du brouillon", "Modèle de texte local", "Origine (libellé, sans téléchargement)", "Révision fixe", "Importer des textes UTF-8", "Importer un dossier (lit tous les textes UTF-8)", "Fichiers référencés manquants", "16 fichiers maximum, 24 000 caractères chacun, 128 KiB par requête. JSON : [{\"path\":\"SKILL.md\",\"content\":\"texte\"}]. L'import remplace la source ; aucun fichier n'est exécuté.", "Sources (JSON modifiable)", "Préparer", "Convertir", "Une licence inconnue ou restreinte bloque la conversion. Seule la liste locale de l'opérateur vérifie la licence.", "JSON candidat (modifiable)", "Revalider", "Enregistrer", "Supprimer", "Non validé / toute modification annule les contrôles", "Schema et liaisons valides ; révision humaine nécessaire", "Validation échouée", "Instantané modifié. Préparez et reconvertissez ; l'ancien candidat reste non validé.", "Enregistré en privé ; revalidation à la réouverture", "En cours…", "Échec de l'opération", "Abandonner les modifications ?", "Supprimer définitivement ce brouillon ?", "Aucun brouillon", "Brouillon modifié ailleurs. Vos modifications sont conservées ; rouvrez avant de remplacer.", "Liaisons / instructions", "Preuves / source originale", "Contenu retiré", "Avertissements", "Blocages", "Fermer"],
  de: ["Skill-Prüfung", "Nur Entwürfe prüfen: keine Installation, Aktivierung oder kreative Einbindung. Validierung ist keine menschliche Freigabe.", "Lokale Entwürfe", "Neu", "Aktualisieren", "Entwurfsname", "Lokales Textmodell", "Quelle (Bezeichnung, kein Abruf)", "Feste Revision", "UTF-8-Texte importieren", "Ordner importieren (liest alle UTF-8-Texte)", "Fehlende referenzierte Dateien", "Maximal 16 Dateien, je 24.000 Zeichen, 128 KiB pro Anfrage. JSON: [{\"path\":\"SKILL.md\",\"content\":\"Text\"}]. Import ersetzt die Quelle; Dateien werden nie ausgeführt.", "Quelldateien (JSON bearbeiten)", "Vorbereiten", "Konvertieren", "Unbekannte/eingeschränkte Lizenzen blockieren die Konvertierung. Nur die lokale Prüfliste des Betreibers bestätigt Lizenzen.", "Kandidaten-JSON (bearbeitbar)", "Erneut prüfen", "Entwurf speichern", "Entwurf löschen", "Ungeprüft / Änderungen verwerfen frühere Prüfungen", "Schema und Bindungen gültig; menschliche Prüfung erforderlich", "Validierung fehlgeschlagen", "Snapshot geändert. Erneut vorbereiten und konvertieren; alte Kandidaten bleiben ungeprüft.", "Privat gespeichert; beim Öffnen erneut prüfen", "In Bearbeitung…", "Vorgang fehlgeschlagen", "Ungespeicherte Änderungen verwerfen?", "Diesen Entwurf endgültig löschen?", "Keine Entwürfe", "Entwurf anderweitig geändert. Ihre Änderungen bleiben erhalten; vor Überschreiben erneut öffnen.", "Bindungen / Anweisungen", "Belege / Originalquelle", "Entfernter Inhalt", "Warnungen", "Blockaden", "Schließen"],
  ja: ["Skill レビュー", "草稿の確認のみ：インストール・有効化・創作への注入は行いません。検証は人による承認ではありません。", "ローカル草稿", "新規", "更新", "草稿名", "ローカルテキストモデル", "出典（ラベルのみ・取得しません）", "固定リビジョン", "UTF-8 テキストを読込", "フォルダを読込（全 UTF-8 テキストを取得）", "参照先ファイルが見つかりません", "最大16ファイル、各24000文字、リクエスト128 KiB。JSON: [{\"path\":\"SKILL.md\",\"content\":\"本文\"}]。読込は原文を置換し、ファイルを実行しません。", "原文ファイル（JSON編集可）", "原文を準備", "変換", "不明・制限付きライセンスは変換を阻止します。操作者のローカル審査リストのみがライセンスを確認します。", "候補JSON（編集可）", "再検証", "草稿を保存", "草稿を削除", "未検証 / 編集で以前の検証は失効", "Schemaとホストの紐付けは有効；人による確認が必要", "検証失敗", "スナップショット変更。再準備して変換してください。旧候補は未検証のままです。", "非公開で保存；再開時に再検証が必要", "処理中…", "操作失敗", "未保存の変更を破棄しますか？", "この草稿を永久に削除しますか？", "保存された草稿はありません", "他の操作で草稿が変更されました。編集は保持されています。上書き前に再開してください。", "用途 / 指示", "根拠 / 原文", "削除内容", "警告", "阻止項目", "閉じる"],
  ko: ["Skill 검토", "초안 검토만: 설치, 활성화, 창작 주입을 하지 않습니다. 검증은 사람의 승인이 아닙니다.", "로컬 초안", "새로 만들기", "새로 고침", "초안 이름", "로컬 텍스트 모델", "출처 (표시만, 가져오지 않음)", "고정 버전", "UTF-8 텍스트 가져오기", "폴더 가져오기 (모든 UTF-8 텍스트 읽기)", "참조된 파일 누락", "최대 16파일, 각 24000자, 요청 128 KiB. JSON: [{\"path\":\"SKILL.md\",\"content\":\"본문\"}]. 가져오기는 원문을 교체하며 파일을 실행하지 않습니다.", "원본 파일 (JSON 편집)", "원문 준비", "변환", "알 수 없거나 제한된 라이선스는 변환을 차단합니다. 운영자의 로컬 검토 목록만 라이선스를 확인합니다.", "후보 JSON (편집 가능)", "재검증", "초안 저장", "초안 삭제", "미검증 / 편집 시 이전 검증 무효", "Schema 및 호스트 바인딩 유효; 사람의 검토 필요", "검증 실패", "스냅샷 변경. 다시 준비하고 변환하세요. 기존 후보는 미검증 상태입니다.", "비공개 저장됨; 다시 열면 재검증 필요", "처리 중…", "작업 실패", "저장하지 않은 변경을 버릴까요?", "이 초안을 영구 삭제할까요?", "저장된 초안 없음", "다른 작업에서 초안을 수정했습니다. 편집은 유지됩니다. 덮어쓰기 전에 다시 여세요.", "바인딩 / 지시", "근거 / 원문", "삭제 내용", "경고", "차단 항목", "닫기"],
  es: ["Revisión de Skills", "Solo borradores: sin instalación, activación ni inyección creativa. Validar no es aprobar.", "Borradores locales", "Nuevo", "Actualizar", "Nombre", "Modelo de texto local", "Origen (etiqueta, sin descarga)", "Revisión fija", "Importar textos UTF-8", "Importar carpeta (lee todos los textos UTF-8)", "Faltan archivos referenciados", "Máximo 16 archivos, 24 000 caracteres cada uno, 128 KiB por solicitud. JSON: [{\"path\":\"SKILL.md\",\"content\":\"texto\"}]. Importar sustituye el origen; nunca se ejecutan archivos.", "Archivos de origen (JSON editable)", "Preparar", "Convertir", "Licencias desconocidas o restringidas bloquean la conversión. Solo la lista local del operador verifica licencias.", "JSON candidato (editable)", "Revalidar", "Guardar", "Eliminar", "Sin validar / editar anula verificaciones anteriores", "Schema y enlaces válidos; requiere revisión humana", "Validación fallida", "Instantánea cambiada. Prepare y convierta de nuevo; candidatos antiguos siguen sin validar.", "Guardado privado; revalidar al abrir", "Procesando…", "Operación fallida", "¿Descartar cambios sin guardar?", "¿Eliminar permanentemente este borrador?", "No hay borradores", "Borrador cambiado en otro lugar. Sus cambios se conservan; reabra antes de sobrescribir.", "Enlaces / instrucciones", "Evidencias / origen", "Contenido eliminado", "Advertencias", "Bloqueos", "Cerrar"],
  pt: ["Revisão de Skills", "Somente rascunhos: sem instalação, ativação ou injeção criativa. Validar não é aprovar.", "Rascunhos locais", "Novo", "Atualizar", "Nome", "Modelo de texto local", "Origem (rótulo, sem download)", "Revisão fixa", "Importar textos UTF-8", "Importar pasta (lê todos os textos UTF-8)", "Arquivos referenciados ausentes", "Até 16 arquivos, 24.000 caracteres cada, 128 KiB por solicitação. JSON: [{\"path\":\"SKILL.md\",\"content\":\"texto\"}]. A importação substitui a origem; arquivos nunca são executados.", "Arquivos de origem (JSON editável)", "Preparar", "Converter", "Licenças desconhecidas ou restritas bloqueiam a conversão. Apenas a lista local do operador verifica licenças.", "JSON candidato (editável)", "Revalidar", "Salvar", "Excluir", "Não validado / edições invalidam verificações", "Schema e vínculos válidos; requer revisão humana", "Falha na validação", "Snapshot alterado. Prepare e converta novamente; candidatos antigos continuam não validados.", "Salvo em privado; revalidar ao abrir", "Processando…", "Operação falhou", "Descartar alterações não salvas?", "Excluir este rascunho permanentemente?", "Nenhum rascunho", "Rascunho alterado em outro lugar. Suas edições foram preservadas; reabra antes de substituir.", "Vínculos / instruções", "Evidências / origem", "Conteúdo removido", "Avisos", "Bloqueios", "Fechar"],
  tr: ["Skill inceleme", "Yalnız taslak: kurulum, etkinleştirme veya yaratıcı enjeksiyon yok. Doğrulama insan onayı değildir.", "Yerel taslaklar", "Yeni", "Yenile", "Taslak adı", "Yerel metin modeli", "Kaynak (etiket, indirilmez)", "Sabit sürüm", "UTF-8 metinleri içe aktar", "Klasör içe aktar (tüm UTF-8 metinleri okur)", "Referans verilen dosyalar eksik", "En fazla 16 dosya, her biri 24000 karakter, istek başına 128 KiB. JSON: [{\"path\":\"SKILL.md\",\"content\":\"metin\"}]. İçe aktarma kaynağı değiştirir; dosyalar çalıştırılmaz.", "Kaynak dosyalar (JSON)", "Hazırla", "Dönüştür", "Bilinmeyen/kısıtlı lisanslar dönüşümü engeller. Yalnız operatörün yerel inceleme listesi lisansı doğrular.", "Aday JSON (düzenlenebilir)", "Yeniden doğrula", "Kaydet", "Sil", "Doğrulanmadı / düzenleme eski kontrolleri geçersiz kılar", "Schema ve bağlar geçerli; insan incelemesi gerekli", "Doğrulama başarısız", "Anlık görüntü değişti. Yeniden hazırlayıp dönüştürün; eski adaylar doğrulanmamış kalır.", "Özel kaydedildi; açarken yeniden doğrulayın", "İşleniyor…", "İşlem başarısız", "Kaydedilmemiş değişiklikler atılsın mı?", "Bu taslak kalıcı silinsin mi?", "Taslak yok", "Taslak başka yerde değişti. Düzenlemeleriniz korundu; üzerine yazmadan yeniden açın.", "Bağlar / talimatlar", "Kanıt / kaynak", "Çıkarılan içerik", "Uyarılar", "Engeller", "Kapat"],
  ar: ["مراجعة Skill", "مسودات فقط: لا تثبيت أو تفعيل أو حقن في الإبداع. التحقق ليس موافقة بشرية.", "مسودات محلية", "جديد", "تحديث", "اسم المسودة", "نموذج النص المحلي", "المصدر (تسمية، دون جلب)", "إصدار ثابت", "استيراد نصوص UTF-8", "استيراد مجلد (قراءة كل نصوص UTF-8)", "ملفات مرجعية مفقودة", "حتى 16 ملفاً، 24000 حرف لكل ملف، 128 KiB لكل طلب. JSON: [{\"path\":\"SKILL.md\",\"content\":\"نص\"}]. الاستيراد يستبدل المصدر؛ لا يتم تنفيذ الملفات.", "ملفات المصدر (JSON قابل للتحرير)", "تحضير", "تحويل", "التراخيص المجهولة أو المقيدة تمنع التحويل. قائمة المراجعة المحلية للمشغل فقط تتحقق من الترخيص.", "JSON المرشح (قابل للتحرير)", "إعادة التحقق", "حفظ", "حذف", "غير متحقق / التعديل يلغي الفحوص السابقة", "Schema وروابط المضيف صحيحة؛ المراجعة البشرية مطلوبة", "فشل التحقق", "تغيرت اللقطة. أعد التحضير والتحويل؛ المرشح القديم يبقى دون تحقق.", "تم الحفظ محلياً بخصوصية؛ إعادة التحقق عند الفتح", "جارٍ العمل…", "فشلت العملية", "تجاهل التغييرات غير المحفوظة؟", "حذف هذه المسودة نهائياً؟", "لا توجد مسودات", "تغيرت المسودة في مكان آخر. تعديلاتك محفوظة؛ أعد الفتح قبل الاستبدال.", "الروابط / التعليمات", "الأدلة / المصدر", "المحتوى المحذوف", "تحذيرات", "عوائق", "إغلاق"],
  vi: ["Duyệt Skill", "Chỉ bản nháp: không cài đặt, kích hoạt hoặc đưa vào sáng tạo. Xác thực không phải phê duyệt của con người.", "Bản nháp cục bộ", "Mới", "Làm mới", "Tên bản nháp", "Mô hình văn bản cục bộ", "Nguồn (nhãn, không tải)", "Phiên bản cố định", "Nhập văn bản UTF-8", "Nhập thư mục (đọc mọi văn bản UTF-8)", "Thiếu tệp được tham chiếu", "Tối đa 16 tệp, 24000 ký tự mỗi tệp, 128 KiB mỗi yêu cầu. JSON: [{\"path\":\"SKILL.md\",\"content\":\"văn bản\"}]. Nhập thay thế nguồn; không thực thi tệp.", "Tệp nguồn (JSON sửa được)", "Chuẩn bị", "Chuyển đổi", "Giấy phép chưa rõ/bị hạn chế chặn chuyển đổi. Chỉ danh sách duyệt cục bộ của người vận hành xác minh giấy phép.", "JSON ứng viên (sửa được)", "Xác thực lại", "Lưu", "Xóa", "Chưa xác thực / sửa làm mất hiệu lực kiểm tra cũ", "Schema và liên kết hợp lệ; vẫn cần duyệt thủ công", "Xác thực thất bại", "Ảnh chụp đã đổi. Chuẩn bị và chuyển đổi lại; ứng viên cũ vẫn chưa xác thực.", "Đã lưu riêng tư; xác thực lại khi mở", "Đang xử lý…", "Thao tác thất bại", "Bỏ thay đổi chưa lưu?", "Xóa vĩnh viễn bản nháp này?", "Chưa có bản nháp", "Bản nháp đã đổi ở nơi khác. Nội dung sửa được giữ; mở lại trước khi ghi đè.", "Liên kết / chỉ dẫn", "Bằng chứng / nguồn", "Nội dung loại bỏ", "Cảnh báo", "Mục chặn", "Đóng"],
  id: ["Tinjau Skill", "Hanya draf: tanpa pemasangan, aktivasi atau injeksi kreatif. Validasi bukan persetujuan manusia.", "Draf lokal", "Baru", "Segarkan", "Nama draf", "Model teks lokal", "Asal (label, tidak diambil)", "Revisi tetap", "Impor teks UTF-8", "Impor folder (baca semua teks UTF-8)", "File referensi hilang", "Maksimal 16 berkas, 24000 karakter per berkas, 128 KiB per permintaan. JSON: [{\"path\":\"SKILL.md\",\"content\":\"teks\"}]. Impor mengganti sumber; berkas tidak dieksekusi.", "Berkas sumber (JSON)", "Siapkan", "Konversi", "Lisensi tidak diketahui/terbatas memblokir konversi. Hanya daftar tinjauan lokal operator yang memverifikasi lisensi.", "JSON kandidat (dapat diedit)", "Validasi ulang", "Simpan", "Hapus", "Belum divalidasi / edit membatalkan pemeriksaan lama", "Schema dan ikatan valid; tinjauan manusia tetap perlu", "Validasi gagal", "Snapshot berubah. Siapkan dan konversi ulang; kandidat lama belum divalidasi.", "Disimpan privat; validasi ulang saat dibuka", "Memproses…", "Operasi gagal", "Buang perubahan yang belum disimpan?", "Hapus draf ini permanen?", "Tidak ada draf", "Draf berubah di tempat lain. Edit Anda dipertahankan; buka ulang sebelum menimpa.", "Ikatan / instruksi", "Bukti / sumber asli", "Materi dihapus", "Peringatan", "Penghalang", "Tutup"],
  ru: ["Проверка Skills", "Только черновики: без установки, активации или внедрения в творчество. Проверка не означает одобрение человеком.", "Локальные черновики", "Новый", "Обновить", "Название", "Локальная текстовая модель", "Источник (метка, без загрузки)", "Фиксированная версия", "Импорт текстов UTF-8", "Импорт папки (чтение всех UTF-8 текстов)", "Отсутствуют указанные файлы", "До 16 файлов, по 24000 символов, 128 KiB на запрос. JSON: [{\"path\":\"SKILL.md\",\"content\":\"текст\"}]. Импорт заменяет источник; файлы не выполняются.", "Исходные файлы (JSON)", "Подготовить", "Преобразовать", "Неизвестные/ограниченные лицензии блокируют преобразование. Лицензию подтверждает только локальный список оператора.", "JSON кандидата (редактируемый)", "Проверить снова", "Сохранить", "Удалить", "Не проверено / изменения отменяют прежние проверки", "Schema и привязки верны; нужна проверка человеком", "Проверка не пройдена", "Снимок изменился. Подготовьте и преобразуйте снова; старые кандидаты остаются непроверенными.", "Сохранено приватно; повторная проверка при открытии", "Обработка…", "Ошибка операции", "Отменить несохранённые изменения?", "Удалить черновик навсегда?", "Нет черновиков", "Черновик изменён в другом месте. Ваши правки сохранены; откройте снова перед перезаписью.", "Привязки / инструкции", "Доказательства / источник", "Удалённый материал", "Предупреждения", "Блокировки", "Закрыть"]
};

const skillLicenseKeys = ["licenseLabel", "licenseConfirm", "licenseHint", "licenseMissing", "licenseConfirmed", "licenseChoose"];
const skillLicenseTranslations = {
  en: ["Detected license", "Confirm license for this source", "License text is pinned evidence, not automatic approval. Review it and confirm; this only unlocks a conversion draft.", "No recognizable license was found; conversion remains blocked.", "License confirmed for this exact source snapshot.", "Select a detected license"],
  "zh-CN": ["检测到的许可", "确认此来源的许可", "许可原文已绑定到固定版本，但不代表自动批准。请审阅并确认；此操作仅解锁转换草稿。", "未识别到许可；转换仍会被阻止。", "已确认此精确来源快照的许可。", "选择检测到的许可"],
  "zh-TW": ["偵測到的授權", "確認此來源的授權", "授權原文已綁定固定版本，但不代表自動核准。請審閱並確認；此操作僅解鎖轉換草稿。", "未識別到授權；轉換仍會遭到阻止。", "已確認此精確來源快照的授權。", "選擇偵測到的授權"],
  fr: ["Licence détectée", "Confirmer la licence de cette source", "Le texte de licence est une preuve liée au commit, pas une approbation automatique. Examinez-le et confirmez ; cela déverrouille uniquement un brouillon.", "Aucune licence reconnaissable ; la conversion reste bloquée.", "Licence confirmée pour cet instantané précis.", "Choisir une licence détectée"],
  de: ["Erkannte Lizenz", "Lizenz für diese Quelle bestätigen", "Der Lizenztext ist an den Commit gebunden, aber keine automatische Freigabe. Prüfen und bestätigen; dadurch wird nur ein Entwurf freigeschaltet.", "Keine erkennbare Lizenz gefunden; die Konvertierung bleibt gesperrt.", "Lizenz für genau diesen Quell-Snapshot bestätigt.", "Erkannte Lizenz auswählen"],
  ja: ["検出されたライセンス", "このソースのライセンスを確認", "ライセンス文は固定コミットに紐づく証拠であり、自動承認ではありません。内容を確認して確定してください。変換草稿のみが有効になります。", "認識可能なライセンスが見つからないため、変換はブロックされます。", "この正確なソーススナップショットのライセンスを確認しました。", "検出されたライセンスを選択"],
  ko: ["감지된 라이선스", "이 소스의 라이선스 확인", "라이선스 텍스트는 고정된 커밋의 근거일 뿐 자동 승인이 아닙니다. 검토 후 확인하세요. 변환 초안만 잠금 해제됩니다.", "인식 가능한 라이선스가 없어 변환이 계속 차단됩니다.", "정확한 소스 스냅샷의 라이선스를 확인했습니다.", "감지된 라이선스 선택"],
  es: ["Licencia detectada", "Confirmar la licencia de esta fuente", "El texto está vinculado al commit fijado, pero no supone aprobación automática. Revíselo y confirme; solo habilita un borrador.", "No se encontró una licencia reconocible; la conversión sigue bloqueada.", "Licencia confirmada para esta instantánea exacta.", "Elegir una licencia detectada"],
  pt: ["Licença detectada", "Confirmar a licença desta fonte", "O texto está vinculado ao commit fixado, mas não é aprovação automática. Revise e confirme; isso libera apenas um rascunho.", "Nenhuma licença reconhecível; a conversão continua bloqueada.", "Licença confirmada para este snapshot exato.", "Escolher uma licença detectada"],
  tr: ["Algılanan lisans", "Bu kaynak için lisansı onayla", "Lisans metni sabit commit'e bağlı kanıttır, otomatik onay değildir. İnceleyip onaylayın; yalnızca bir taslağın dönüşümünü açar.", "Tanınabilir lisans bulunamadı; dönüşüm engelli kalır.", "Bu tam kaynak anlık görüntüsü için lisans onaylandı.", "Algılanan lisansı seç"],
  ar: ["الترخيص المكتشف", "تأكيد ترخيص هذا المصدر", "نص الترخيص دليل مرتبط بإصدار commit ثابت، وليس موافقة تلقائية. راجعه وأكّده؛ هذا يتيح مسودة التحويل فقط.", "لم يُعثر على ترخيص معروف؛ سيظل التحويل محظورًا.", "تم تأكيد الترخيص لهذه اللقطة المصدرية المحددة.", "اختر ترخيصًا مكتشفًا"],
  vi: ["Giấy phép được phát hiện", "Xác nhận giấy phép cho nguồn này", "Văn bản giấy phép được gắn với commit cố định, không phải phê duyệt tự động. Hãy xem và xác nhận; thao tác này chỉ mở khóa bản nháp.", "Không tìm thấy giấy phép nhận dạng được; chuyển đổi vẫn bị chặn.", "Đã xác nhận giấy phép cho snapshot nguồn chính xác này.", "Chọn giấy phép đã phát hiện"],
  id: ["Lisensi terdeteksi", "Konfirmasi lisensi untuk sumber ini", "Teks lisensi terikat pada commit tetap, bukan persetujuan otomatis. Tinjau dan konfirmasi; ini hanya membuka draf konversi.", "Lisensi yang dikenali tidak ditemukan; konversi tetap diblokir.", "Lisensi dikonfirmasi untuk snapshot sumber yang tepat ini.", "Pilih lisensi yang terdeteksi"],
  ru: ["Обнаруженная лицензия", "Подтвердить лицензию этого источника", "Текст лицензии привязан к зафиксированному commit, но не является автоматическим одобрением. Проверьте и подтвердите; это откроет только черновик.", "Распознаваемая лицензия не найдена; преобразование заблокировано.", "Лицензия подтверждена для этого точного снимка источника.", "Выберите обнаруженную лицензию"]
};

const skillFlowKeys = ["flow", "budget"];
const skillFlowTranslations = {
  en: ["Find files and license → confirm license → select and read Skill text → convert/save or delete draft → choose categories → review and install (disabled initially). License evidence is separate; edits require reconfirmation. The input budget includes system/schema; reserve 8,192 output tokens in the model context.", "Skill input token budget (skill_input_token_budget)"],
  "zh-CN": ["查找源文件和许可证 → 确认许可 → 选择并读取 Skill 正文 → 转换/保存或删除草稿 → 选择类别 → 审阅后安装（默认禁用）。许可证据独立展示；编辑后须重新确认。输入预算包含系统提示和 Schema；模型上下文还须预留 8192 输出 tokens。", "Skill 输入 token 预算（skill_input_token_budget）"],
  "zh-TW": ["尋找原始檔案及授權 → 確認授權 → 選取並讀取 Skill 正文 → 轉換/儲存或刪除草稿 → 選擇類別 → 審閱後安裝（預設停用）。授權證據獨立顯示；編輯後須重新確認。輸入預算含系統提示及 Schema；模型上下文須預留 8192 輸出 tokens。", "Skill 輸入 token 預算（skill_input_token_budget）"],
  fr: ["Trouver sources et licence → confirmer → sélectionner et lire le Skill → convertir/enregistrer ou supprimer → choisir les catégories → vérifier et installer (désactivé). Licence séparée ; modifications à reconfirmer. Budget incluant système/schema, avec 8 192 tokens de sortie à réserver.", "Budget de tokens d’entrée Skill (skill_input_token_budget)"],
  de: ["Quellen und Lizenz finden → bestätigen → Skill wählen und lesen → konvertieren/speichern oder löschen → Kategorien wählen → prüfen und installieren (deaktiviert). Lizenz separat; Änderungen erneut bestätigen. Eingabebudget mit System/Schema; 8.192 Ausgabetokens reservieren.", "Skill-Eingabetokenbudget (skill_input_token_budget)"],
  ja: ["原文とライセンスを検索 → 確認 → Skill を選択して読込 → 変換・保存または草稿削除 → カテゴリ選択 → 審査してインストール（初期無効）。ライセンスは別表示。編集後は再確認。入力予算は system/schema を含み、出力8192 tokensを確保。", "Skill 入力 token 予算（skill_input_token_budget）"],
  ko: ["소스와 라이선스 찾기 → 확인 → Skill 선택 및 읽기 → 변환/저장 또는 초안 삭제 → 분류 선택 → 검토 후 설치(기본 비활성). 라이선스 별도 표시, 편집 후 재확인. 입력 예산은 시스템/schema 포함, 출력 8192 tokens 확보.", "Skill 입력 token 예산 (skill_input_token_budget)"],
  es: ["Buscar fuentes y licencia → confirmar → seleccionar y leer Skill → convertir/guardar o eliminar → categorías → revisar e instalar (desactivado). Licencia separada; reconfirmar cambios. Presupuesto con sistema/schema; reservar 8192 tokens de salida.", "Presupuesto de tokens de entrada Skill (skill_input_token_budget)"],
  pt: ["Buscar fontes e licença → confirmar → selecionar e ler Skill → converter/salvar ou excluir → categorias → revisar e instalar (desativado). Licença separada; reconfirmar alterações. Orçamento inclui sistema/schema; reservar 8192 tokens de saída.", "Orçamento de tokens de entrada Skill (skill_input_token_budget)"],
  tr: ["Kaynak ve lisans bul → onayla → Skill seç ve oku → dönüştür/kaydet veya sil → kategori seç → incele ve yükle (devre dışı). Lisans ayrı; düzenleme sonrası yeniden onay. Bütçe sistem/schema içerir; çıktı için 8192 token ayırın.", "Skill giriş token bütçesi (skill_input_token_budget)"],
  ar: ["العثور على المصادر والترخيص ← التأكيد ← اختيار وقراءة Skill ← التحويل/الحفظ أو الحذف ← الفئات ← المراجعة والتثبيت (معطل). الترخيص منفصل؛ أعد تأكيد التعديلات. الميزانية تشمل النظام/schema؛ احتفظ بـ8192 token للإخراج.", "ميزانية رموز إدخال Skill (skill_input_token_budget)"],
  vi: ["Tìm nguồn và giấy phép → xác nhận → chọn và đọc Skill → chuyển đổi/lưu hoặc xóa nháp → chọn danh mục → xem xét và cài đặt (tắt). Giấy phép riêng; xác nhận lại chỉnh sửa. Ngân sách gồm hệ thống/schema; dành 8192 token đầu ra.", "Ngân sách token đầu vào Skill (skill_input_token_budget)"],
  id: ["Cari sumber dan lisensi → konfirmasi → pilih dan baca Skill → konversi/simpan atau hapus → kategori → tinjau dan instal (nonaktif). Lisensi terpisah; konfirmasi ulang perubahan. Anggaran mencakup sistem/schema; sisakan 8192 token keluaran.", "Anggaran token masukan Skill (skill_input_token_budget)"],
  ru: ["Найти источники и лицензию → подтвердить → выбрать и прочитать Skill → преобразовать/сохранить или удалить → категории → проверить и установить (отключено). Лицензия отдельно; изменения подтвердить заново. Бюджет с системой/schema; резерв 8192 токенов вывода.", "Бюджет входных токенов Skill (skill_input_token_budget)"]
};

const skillSimpleKeys = ["title", "boundary", "valid", "saved", "flow", "memory"];
const skillSimpleTranslations = {
  en: ["Skill conversion", "Confirm the license, convert with a local model, save automatically, then install. No additional human review; automatic checks are not a content-safety guarantee.", "Automatic format and source checks passed; ready to install.", "Draft saved; install it after choosing categories.", "Confirm license → read source → convert and auto-save → choose categories → install, then enable.", "Text model memory unavailable (HTTP 507). Wait for media generation to finish, close memory-heavy apps, or select a smaller text model. Your source is preserved."],
  "zh-CN": ["Skill 转换", "确认许可后，由本地模型转换并自动保存草稿，再安装使用。无需额外人工审阅；自动检查不保证内容安全。", "自动格式与来源校验通过，可直接安装。", "草稿已保存；选择类别后即可安装。", "确认许可 → 读取原文 → 转换并自动保存 → 选择类别 → 安装后启用。", "文本模型内存不足（HTTP 507）。请等待媒体生成结束、关闭占用内存的应用，或选择更小的文本模型。原文已保留。"],
  "zh-TW": ["Skill 轉換", "確認授權後，由本機模型轉換並自動儲存草稿，再安裝使用。無需額外人工審閱；自動檢查不保證內容安全。", "自動格式與來源校驗通過，可直接安裝。", "草稿已儲存；選擇類別後即可安裝。", "確認授權 → 讀取原文 → 轉換並自動儲存 → 選擇類別 → 安裝後啟用。", "文字模型記憶體不足（HTTP 507）。請等待媒體生成結束、關閉高用量應用，或選擇較小模型。原文已保留。"],
  fr: ["Conversion Skill", "Confirmez la licence, convertissez localement et enregistrez automatiquement, puis installez. Sans revue humaine supplémentaire ; les contrôles ne garantissent pas la sécurité du contenu.", "Format et sources vérifiés automatiquement ; installation possible.", "Brouillon enregistré ; choisissez les catégories et installez.", "Licence → source → conversion et sauvegarde automatique → catégories → installation, puis activation.", "Mémoire insuffisante (HTTP 507). Attendez la fin de la génération média, fermez les applications lourdes ou choisissez un modèle plus petit. Source conservée."],
  de: ["Skill-Konvertierung", "Lizenz bestätigen, lokal konvertieren und automatisch speichern, dann installieren. Keine zusätzliche manuelle Prüfung; automatische Prüfungen garantieren keine Inhaltssicherheit.", "Format und Quelle automatisch geprüft; bereit zur Installation.", "Entwurf gespeichert; Kategorien wählen und installieren.", "Lizenz → Quelle → Konvertierung und Autospeichern → Kategorien → Installation, dann Aktivierung.", "Zu wenig Modellspeicher (HTTP 507). Mediengenerierung abwarten, große Apps schließen oder kleineres Modell wählen. Quelle bleibt erhalten."],
  ja: ["Skill 変換", "ライセンス確認後、ローカルモデルで変換・自動保存してインストール。追加の手動審査は不要。自動検証は内容の安全性を保証しません。", "形式と出典の自動検証が完了。インストールできます。", "草稿を保存しました。カテゴリ選択後にインストールできます。", "ライセンス確認 → 原文読込 → 変換・自動保存 → カテゴリ選択 → インストール後に有効化。", "モデルのメモリ不足（HTTP 507）。メディア生成終了を待つか、大きなアプリを閉じるか、小さなモデルを選択してください。原文は保持されます。"],
  ko: ["Skill 변환", "라이선스 확인 후 로컬 모델로 변환하고 자동 저장한 뒤 설치합니다. 추가 수동 검토는 필요 없으며 자동 검사가 콘텐츠 안전을 보장하지는 않습니다.", "형식 및 출처 자동 검증 완료. 설치할 수 있습니다.", "초안 저장 완료. 분류 선택 후 설치하세요.", "라이선스 → 원문 → 변환 및 자동 저장 → 분류 → 설치 후 활성화.", "모델 메모리 부족(HTTP 507). 미디어 생성 완료를 기다리거나 큰 앱을 닫거나 더 작은 모델을 선택하세요. 원문은 유지됩니다."],
  es: ["Conversión Skill", "Confirma la licencia, convierte localmente y guarda automáticamente; después instala. Sin revisión humana adicional; los controles no garantizan la seguridad del contenido.", "Formato y fuente verificados automáticamente; listo para instalar.", "Borrador guardado; elige categorías e instala.", "Licencia → fuente → conversión y guardado automático → categorías → instalar y activar.", "Memoria insuficiente (HTTP 507). Espera a que termine la generación, cierra aplicaciones pesadas o elige un modelo menor. Fuente conservada."],
  pt: ["Conversão Skill", "Confirme a licença, converta localmente e salve automaticamente; depois instale. Sem revisão humana adicional; os controles não garantem conteúdo seguro.", "Formato e fonte verificados automaticamente; pronto para instalar.", "Rascunho salvo; escolha categorias e instale.", "Licença → fonte → conversão e salvamento automático → categorias → instalar e ativar.", "Memória insuficiente (HTTP 507). Aguarde a geração terminar, feche apps pesados ou escolha um modelo menor. Fonte preservada."],
  tr: ["Skill dönüşümü", "Lisansı onaylayın, yerel modelle dönüştürüp otomatik kaydedin ve yükleyin. Ek insan incelemesi yok; otomatik kontroller içerik güvenliğini garanti etmez.", "Biçim ve kaynak otomatik doğrulandı; yüklenebilir.", "Taslak kaydedildi; kategorileri seçip yükleyin.", "Lisans → kaynak → dönüşüm ve otomatik kayıt → kategoriler → yükleme ve etkinleştirme.", "Model belleği yetersiz (HTTP 507). Medya üretiminin bitmesini bekleyin, büyük uygulamaları kapatın veya küçük model seçin. Kaynak korunur."],
  ar: ["تحويل Skill", "أكد الترخيص ثم حوّل محليًا واحفظ تلقائيًا وثبّت. لا مراجعة بشرية إضافية؛ الفحوص التلقائية لا تضمن سلامة المحتوى.", "تم التحقق تلقائيًا من التنسيق والمصدر؛ جاهز للتثبيت.", "حُفظت المسودة؛ اختر الفئات وثبّت.", "الترخيص ← المصدر ← التحويل والحفظ التلقائي ← الفئات ← التثبيت ثم التفعيل.", "ذاكرة النموذج غير كافية (HTTP 507). انتظر انتهاء توليد الوسائط أو أغلق التطبيقات الكبيرة أو اختر نموذجًا أصغر. المصدر محفوظ."],
  vi: ["Chuyển đổi Skill", "Xác nhận giấy phép, chuyển đổi cục bộ và tự lưu rồi cài đặt. Không cần duyệt thủ công thêm; kiểm tra tự động không bảo đảm nội dung an toàn.", "Đã tự kiểm tra định dạng và nguồn; sẵn sàng cài đặt.", "Đã lưu nháp; chọn danh mục rồi cài đặt.", "Giấy phép → nguồn → chuyển đổi và tự lưu → danh mục → cài đặt rồi bật.", "Thiếu bộ nhớ mô hình (HTTP 507). Chờ tạo media xong, đóng ứng dụng nặng hoặc chọn mô hình nhỏ hơn. Nguồn được giữ lại."],
  id: ["Konversi Skill", "Konfirmasi lisensi, konversi lokal dan simpan otomatis lalu instal. Tanpa tinjauan manual tambahan; pemeriksaan otomatis tidak menjamin keamanan konten.", "Format dan sumber diperiksa otomatis; siap diinstal.", "Draf tersimpan; pilih kategori lalu instal.", "Lisensi → sumber → konversi dan simpan otomatis → kategori → instal lalu aktifkan.", "Memori model tidak cukup (HTTP 507). Tunggu pembuatan media selesai, tutup aplikasi besar atau pilih model lebih kecil. Sumber tetap tersimpan."],
  ru: ["Преобразование Skill", "Подтвердите лицензию, преобразуйте локально с автосохранением и установите. Дополнительная ручная проверка не нужна; автоматическая проверка не гарантирует безопасность содержания.", "Формат и источник проверены автоматически; можно установить.", "Черновик сохранён; выберите категории и установите.", "Лицензия → источник → преобразование и автосохранение → категории → установка и включение.", "Недостаточно памяти модели (HTTP 507). Дождитесь окончания генерации, закройте тяжёлые приложения или выберите меньшую модель. Источник сохранён."]
};
for (const [language, values] of Object.entries(skillSimpleTranslations)) {
  for (const key of ["title", "boundary", "valid", "saved"])
    skillReviewTranslations[language][skillReviewKeys.indexOf(key)] = values[skillSimpleKeys.indexOf(key)];
  skillFlowTranslations[language][0] = values[skillSimpleKeys.indexOf("flow")];
}
const skillStageKeys = ["source", "license", "prepare", "save", "edit", "apply"];
const skillStageTranslations = {
  en: ["Source", "License", "Extract", "Save draft", "Edit & preview", "Apply"],
  "zh-CN": ["取源", "确认许可", "提取子预设", "保存草稿", "编辑与预览", "应用"],
  "zh-TW": ["取源", "確認授權", "提取子預設", "儲存草稿", "編輯與預覽", "套用"],
  fr: ["Source", "Licence", "Extraire", "Enregistrer", "Modifier & aperçu", "Appliquer"],
  de: ["Quelle", "Lizenz", "Extrahieren", "Entwurf speichern", "Bearbeiten & Vorschau", "Anwenden"],
  ja: ["原文", "ライセンス", "抽出", "草稿保存", "編集・プレビュー", "適用"],
  ko: ["소스", "라이선스", "추출", "초안 저장", "편집·미리보기", "적용"],
  es: ["Fuente", "Licencia", "Extraer", "Guardar", "Editar y vista previa", "Aplicar"],
  pt: ["Fonte", "Licença", "Extrair", "Salvar", "Editar e pré-visualizar", "Aplicar"],
  tr: ["Kaynak", "Lisans", "Çıkar", "Taslağı kaydet", "Düzenle ve önizle", "Uygula"],
  ar: ["المصدر", "الترخيص", "استخراج", "حفظ المسودة", "تحرير ومعاينة", "تطبيق"],
  vi: ["Nguồn", "Giấy phép", "Trích xuất", "Lưu nháp", "Sửa và xem trước", "Áp dụng"],
  id: ["Sumber", "Lisensi", "Ekstrak", "Simpan draf", "Edit & pratinjau", "Terapkan"],
  ru: ["Источник", "Лицензия", "Извлечь", "Сохранить", "Правка и просмотр", "Применить"]
};
function skillStageText(key, language) {
  const index = skillStageKeys.indexOf(key);
  if (index === -1) return key;
  return (skillStageTranslations[language] || skillStageTranslations.en)[index];
}
const skillBatchKeys = ["batchConvert", "batchInstall", "batchHint", "batchSelection", "batchDone"];
const skillBatchTranslations = {
  en: ["Convert selected sub-Skills", "Install selected drafts", "Select each SKILL.md and optional files in its directory. Each sub-Skill is converted and saved separately. Batch installation uses all supported categories and stays disabled.", "Select SKILL.md for every selected directory; at most 15 documents per sub-Skill.", "Completed"],
  "zh-CN": ["转换所选子 Skill", "安装所选草稿", "勾选各目录的 SKILL.md 及所需参考文档；每个子 Skill 独立转换保存。批量安装使用各自支持的全部类别，默认禁用。", "请为每个选中的目录勾选 SKILL.md；每个子 Skill 最多15份正文。", "已完成"],
  "zh-TW": ["轉換所選子 Skill", "安裝所選草稿", "勾選各目錄的 SKILL.md 及所需參考文檔；每個子 Skill 獨立轉換儲存。批次安裝使用各自支援的全部類別，預設停用。", "請為各目錄勾選 SKILL.md；每個子 Skill 最多15份正文。", "已完成"],
  fr: ["Convertir les sous-Skills choisis", "Installer les brouillons choisis", "Sélectionnez chaque SKILL.md et ses références. Conversion et sauvegarde séparées. Installation avec toutes les catégories compatibles, désactivée.", "Sélectionnez SKILL.md pour chaque dossier ; 15 documents maximum par Skill.", "Terminé"],
  de: ["Gewählte Unter-Skills konvertieren", "Gewählte Entwürfe installieren", "SKILL.md und Referenzen je Ordner wählen. Separat konvertieren und speichern. Installation in allen unterstützten Kategorien, inaktiv.", "SKILL.md je gewähltem Ordner auswählen; höchstens 15 Dokumente pro Skill.", "Abgeschlossen"],
  ja: ["選択した子Skillを変換", "選択した草稿をインストール", "各SKILL.mdと必要な参考文書を選択。個別に変換・保存します。一括インストールは全対応カテゴリを使用し、初期無効です。", "各ディレクトリのSKILL.mdを選択。子Skillごとに文書は最大15件。", "完了"],
  ko: ["선택한 하위 Skill 변환", "선택한 초안 설치", "각 SKILL.md와 참고 문서를 선택하세요. 개별 변환 및 저장합니다. 일괄 설치는 모든 지원 분류를 사용하며 기본 비활성입니다.", "각 폴더의 SKILL.md를 선택하세요. Skill당 문서는 최대 15개입니다.", "완료"],
  es: ["Convertir sub-Skills seleccionados", "Instalar borradores seleccionados", "Elige cada SKILL.md y sus referencias. Conversión y guardado separados. Instalación con todas las categorías compatibles, inactiva.", "Elige SKILL.md por carpeta; máximo 15 documentos por Skill.", "Completado"],
  pt: ["Converter sub-Skills selecionados", "Instalar rascunhos selecionados", "Escolha cada SKILL.md e referências. Conversão e salvamento separados. Instalação com todas as categorias suportadas, desativada.", "Escolha SKILL.md por pasta; máximo de 15 documentos por Skill.", "Concluído"],
  tr: ["Seçili alt Skill'leri dönüştür", "Seçili taslakları yükle", "Her SKILL.md ve referansları seçin. Ayrı dönüşüm ve kayıt. Toplu yükleme tüm desteklenen kategorileri kullanır, devre dışı kalır.", "Her klasör için SKILL.md seçin; Skill başına en fazla 15 belge.", "Tamamlandı"],
  ar: ["تحويل Skills الفرعية المحددة", "تثبيت المسودات المحددة", "اختر كل SKILL.md ومراجعه. تحويل وحفظ منفصلان. التثبيت بجميع الفئات المدعومة، معطل افتراضيًا.", "اختر SKILL.md لكل مجلد؛ حتى 15 مستندًا لكل Skill.", "اكتمل"],
  vi: ["Chuyển đổi Skill con đã chọn", "Cài bản nháp đã chọn", "Chọn mỗi SKILL.md và tài liệu tham khảo. Chuyển đổi và lưu riêng. Cài mọi danh mục hỗ trợ, mặc định tắt.", "Chọn SKILL.md cho từng thư mục; tối đa 15 tài liệu mỗi Skill.", "Hoàn tất"],
  id: ["Konversi sub-Skill terpilih", "Instal draf terpilih", "Pilih tiap SKILL.md dan referensi. Konversi dan simpan terpisah. Instal semua kategori didukung, nonaktif.", "Pilih SKILL.md tiap folder; maksimal 15 dokumen per Skill.", "Selesai"],
  ru: ["Преобразовать выбранные под-Skills", "Установить выбранные черновики", "Выберите каждый SKILL.md и ссылки. Отдельное преобразование и сохранение. Установка во все поддержанные категории, выключено.", "Выберите SKILL.md каждой папки; до 15 документов на Skill.", "Готово"]
};
function skillSourceGroups(files, selectedPaths) {
  const anchors = files.filter(file => file.skill && !file.license).map(file => ({
    path: file.path, prefix: file.path.includes("/") ? file.path.slice(0, file.path.lastIndexOf("/") + 1) : ""
  })).sort((a, b) => b.prefix.length - a.prefix.length);
  if (new Set(anchors.map(item => item.prefix)).size !== anchors.length ||
      new Set(selectedPaths).size !== selectedPaths.length) throw new Error("batchSelection");
  const groups = new Map(anchors.filter(item => selectedPaths.includes(item.path))
    .map(item => [item.path, {path: item.path, paths: [item.path]}]));
  if (!groups.size) throw new Error("batchSelection");
  for (const path of selectedPaths) {
    const file = files.find(item => item.path === path && !item.license);
    const owner = anchors.find(item => path.startsWith(item.prefix));
    if (!file || !owner || !groups.has(owner.path)) throw new Error("batchSelection");
    if (path !== owner.path) groups.get(owner.path).paths.push(path);
  }
  const result = [...groups.values()];
  if (result.some(group => group.paths.length > 15)) throw new Error("batchSelection");
  return result;
}
const skillPresetKeys = ["title", "flow", "boundary", "editor", "preview", "apply", "applied", "advanced", "batchInstall", "saved", "valid"];
const skillPresetTranslations = {
  en: ["Creative presets", "GitHub link → confirm license → extract sub-presets → save drafts → edit and preview → apply.", "Optional methods, not executable Skills or global system overrides. Applying publishes a selectable preset; it never starts media generation. Automatic checks do not guarantee semantic safety.", "Method guidance (editable)", "Application preview", "Apply preset", "Preset available; select it in a creative task.", "Advanced JSON / source evidence", "Apply selected drafts", "Draft saved; edit, preview and apply.", "Format and source checks passed; ready to apply."],
  "zh-CN": ["创作预设", "GitHub链接 → 确认许可 → 提取多个子预设 → 保存草稿 → 编辑与预览 → 应用。", "可选创作方法，不执行Skill、不覆盖全局系统规则。应用后成为任务可选预设，不自动生成媒体；自动校验不保证语义安全。", "方法指导（可编辑）", "应用预览", "应用预设", "预设已可用；请在创作任务中选择。", "高级JSON / 来源证据", "应用所选草稿", "草稿已保存；可编辑、预览并应用。", "格式与来源校验通过，可应用。"],
  "zh-TW": ["創作預設", "GitHub連結 → 確認授權 → 提取多個子預設 → 儲存草稿 → 編輯與預覽 → 套用。", "可選創作方法，不執行Skill、不覆寫全域系統規則。套用後成為任務可選預設，不自動生成媒體；自動校驗不保證語義安全。", "方法指引（可編輯）", "套用預覽", "套用預設", "預設已可用；請在創作任務中選擇。", "進階JSON / 來源證據", "套用所選草稿", "草稿已儲存；可編輯、預覽並套用。", "格式與來源校驗通過，可套用。"],
  fr: ["Préréglages créatifs", "Lien GitHub → licence → sous-préréglages → brouillons → édition et aperçu → appliquer.", "Méthodes facultatives, sans exécution ni remplacement des règles système. L'application publie un préréglage sélectionnable, sans génération média. Les contrôles ne garantissent pas la sécurité sémantique.", "Méthode (modifiable)", "Aperçu d'application", "Appliquer", "Préréglage disponible ; sélectionnez-le dans une tâche.", "JSON avancé / sources", "Appliquer les brouillons", "Brouillon enregistré ; modifier, prévisualiser et appliquer.", "Format et sources vérifiés ; prêt à appliquer."],
  de: ["Kreativvorlagen", "GitHub-Link → Lizenz → Untervorlagen → Entwürfe → Bearbeiten und Vorschau → Anwenden.", "Optionale Methoden ohne Ausführung oder Systemüberschreibung. Anwenden veröffentlicht eine wählbare Vorlage, startet keine Mediengenerierung. Prüfungen garantieren keine semantische Sicherheit.", "Methodenhinweise (editierbar)", "Anwendungsvorschau", "Vorlage anwenden", "Vorlage verfügbar; in einer Kreativaufgabe auswählen.", "Erweitertes JSON / Quellen", "Ausgewählte Entwürfe anwenden", "Entwurf gespeichert; bearbeiten, prüfen und anwenden.", "Format und Quellen geprüft; bereit zur Anwendung."],
  ja: ["創作プリセット", "GitHubリンク → ライセンス確認 → 子プリセット抽出 → 草稿保存 → 編集とプレビュー → 適用。", "任意の創作方法です。実行やシステム規則の上書きはしません。適用は選択可能なプリセットを公開し、メディア生成を開始しません。自動検証は意味的安全性を保証しません。", "方法ガイド（編集可）", "適用プレビュー", "プリセットを適用", "プリセットが利用可能です。創作タスクで選択してください。", "詳細JSON / 原文証拠", "選択した草稿を適用", "草稿を保存しました。編集・確認して適用できます。", "形式と原文の検証完了。適用できます。"],
  ko: ["창작 프리셋", "GitHub 링크 → 라이선스 확인 → 하위 프리셋 추출 → 초안 저장 → 편집 및 미리보기 → 적용.", "선택적 창작 방법이며 실행하거나 시스템 규칙을 덮어쓰지 않습니다. 적용은 선택 가능한 프리셋을 게시하며 미디어 생성을 시작하지 않습니다. 자동 검사는 의미적 안전을 보장하지 않습니다.", "방법 안내 (편집 가능)", "적용 미리보기", "프리셋 적용", "프리셋 사용 가능; 창작 작업에서 선택하세요.", "고급 JSON / 원본 근거", "선택한 초안 적용", "초안 저장됨; 편집, 미리보기 후 적용하세요.", "형식과 원본 검사 통과; 적용 가능."],
  es: ["Preajustes creativos", "Enlace GitHub → licencia → subpreajustes → borradores → editar y previsualizar → aplicar.", "Métodos opcionales sin ejecución ni cambios de reglas del sistema. Aplicar publica un preajuste seleccionable, sin generar medios. Los controles no garantizan seguridad semántica.", "Guía del método (editable)", "Vista previa", "Aplicar preajuste", "Preajuste disponible; selecciónalo en una tarea.", "JSON avanzado / fuentes", "Aplicar borradores seleccionados", "Borrador guardado; editar, previsualizar y aplicar.", "Formato y fuentes verificados; listo para aplicar."],
  pt: ["Predefinições criativas", "Link GitHub → licença → subpredefinições → rascunhos → editar e visualizar → aplicar.", "Métodos opcionais, sem execução nem alteração das regras do sistema. Aplicar publica uma predefinição selecionável, sem gerar mídia. Verificações não garantem segurança semântica.", "Orientação do método (editável)", "Prévia da aplicação", "Aplicar predefinição", "Predefinição disponível; selecione numa tarefa.", "JSON avançado / fontes", "Aplicar rascunhos selecionados", "Rascunho salvo; editar, visualizar e aplicar.", "Formato e fontes verificados; pronto para aplicar."],
  tr: ["Yaratıcı önayarlar", "GitHub bağlantısı → lisans → alt önayarlar → taslaklar → düzenle ve önizle → uygula.", "İsteğe bağlı yöntemlerdir; yürütme veya sistem kuralı değişikliği yoktur. Uygulama seçilebilir önayarı yayımlar, medya üretmez. Kontroller anlamsal güvenliği garanti etmez.", "Yöntem rehberi (düzenlenebilir)", "Uygulama önizlemesi", "Önayarı uygula", "Önayar hazır; yaratıcı görevde seçin.", "Gelişmiş JSON / kaynak", "Seçili taslakları uygula", "Taslak kaydedildi; düzenleyin, önizleyin ve uygulayın.", "Biçim ve kaynak kontrolü geçti; uygulanabilir."],
  ar: ["إعدادات إبداعية مسبقة", "رابط GitHub ← تأكيد الترخيص ← استخراج إعدادات فرعية ← حفظ المسودات ← تحرير ومعاينة ← تطبيق.", "أساليب اختيارية دون تنفيذ أو تجاوز قواعد النظام. التطبيق ينشر إعداداً قابلاً للاختيار ولا يبدأ توليد الوسائط. الفحص الآلي لا يضمن السلامة الدلالية.", "إرشادات الأسلوب (قابلة للتحرير)", "معاينة التطبيق", "تطبيق الإعداد", "الإعداد متاح؛ اختره في مهمة إبداعية.", "JSON متقدم / أدلة المصدر", "تطبيق المسودات المحددة", "تم حفظ المسودة؛ حرر وعاين ثم طبق.", "اجتاز فحص التنسيق والمصدر؛ جاهز للتطبيق."],
  vi: ["Mẫu sáng tạo", "Liên kết GitHub → giấy phép → trích xuất mẫu con → lưu nháp → sửa và xem trước → áp dụng.", "Phương pháp tùy chọn, không thực thi hay ghi đè quy tắc hệ thống. Áp dụng xuất bản mẫu để chọn, không tạo phương tiện. Kiểm tra tự động không đảm bảo an toàn ngữ nghĩa.", "Hướng dẫn phương pháp (có thể sửa)", "Xem trước áp dụng", "Áp dụng mẫu", "Mẫu đã sẵn sàng; chọn trong tác vụ sáng tạo.", "JSON nâng cao / bằng chứng nguồn", "Áp dụng nháp đã chọn", "Đã lưu nháp; sửa, xem trước và áp dụng.", "Đã kiểm tra định dạng và nguồn; có thể áp dụng."],
  id: ["Preset kreatif", "Tautan GitHub → lisensi → ekstrak subpreset → simpan draf → edit dan pratinjau → terapkan.", "Metode opsional tanpa eksekusi atau penggantian aturan sistem. Penerapan menerbitkan preset yang dapat dipilih, tidak membuat media. Pemeriksaan otomatis tidak menjamin keamanan semantik.", "Panduan metode (dapat diedit)", "Pratinjau penerapan", "Terapkan preset", "Preset tersedia; pilih dalam tugas kreatif.", "JSON lanjutan / bukti sumber", "Terapkan draf terpilih", "Draf tersimpan; edit, pratinjau dan terapkan.", "Format dan sumber diperiksa; siap diterapkan."],
  ru: ["Творческие пресеты", "Ссылка GitHub → лицензия → извлечение пресетов → черновики → правка и просмотр → применить.", "Необязательные методы без выполнения и замены системных правил. Применение публикует выбираемый пресет, не создаёт медиа. Проверки не гарантируют семантическую безопасность.", "Методические указания (редактируемые)", "Предпросмотр применения", "Применить пресет", "Пресет доступен; выберите его в творческой задаче.", "Расширенный JSON / источники", "Применить выбранные черновики", "Черновик сохранён; правка, просмотр и применение.", "Формат и источники проверены; можно применить."]
};

function skillReviewText(key, language) {
  if (key === "draftSaved" || key === "draftInstalled" || key === "deleteDraft" || key === "deleteSelected") {
    const labels = {
      draftSaved: {
        en: "Saved", "zh-CN": "已保存", "zh-TW": "已儲存", fr: "Enregistré",
        de: "Gespeichert", ja: "保存済み", ko: "저장됨", es: "Guardado",
        pt: "Salvo", tr: "Kaydedildi", ar: "محفوظ", vi: "Đã lưu", id: "Tersimpan", ru: "Сохранено"
      },
      draftInstalled: {
        en: "Installed", "zh-CN": "已安装", "zh-TW": "已安裝", fr: "Installé",
        de: "Installiert", ja: "インストール済み", ko: "설치됨", es: "Instalado",
        pt: "Instalado", tr: "Yüklendi", ar: "مثبّت", vi: "Đã cài đặt", id: "Terpasang", ru: "Установлено"
      },
      deleteDraft: {
        en: "Delete", "zh-CN": "删除", "zh-TW": "刪除", fr: "Supprimer",
        de: "Löschen", ja: "削除", ko: "삭제", es: "Eliminar",
        pt: "Excluir", tr: "Sil", ar: "حذف", vi: "Xóa", id: "Hapus", ru: "Удалить"
      },
      deleteSelected: {
        en: "Delete selected", "zh-CN": "删除所选草稿", "zh-TW": "刪除所選草稿", fr: "Supprimer la sélection",
        de: "Auswahl löschen", ja: "選択した草稿を削除", ko: "선택한 초안 삭제", es: "Eliminar seleccionados",
        pt: "Excluir selecionados", tr: "Seçilenleri sil", ar: "حذف المسودات المحددة", vi: "Xóa bản nháp đã chọn",
        id: "Hapus draf terpilih", ru: "Удалить выбранные черновики"
      }
    };
    return labels[key]?.[language] || labels[key]?.en || key;
  }
  if (key === "restart") {
    const labels = {
      en: "Preset publishing requires the updated backend. Restart only after active generation finishes; drafts can still be edited and saved.",
      "zh-CN": "预设发布需要新版后端。请在当前生成结束后重启服务；现在仍可编辑、预览和保存草稿。",
      "zh-TW": "預設發布需要新版後端。請在目前生成結束後重啟服務；現在仍可編輯、預覽及儲存草稿。",
      fr: "La publication nécessite le nouveau serveur. Redémarrez après la génération active ; les brouillons restent modifiables et enregistrables.",
      de: "Veröffentlichen benötigt den neuen Server. Erst nach der laufenden Generierung neu starten; Entwürfe können bearbeitet und gespeichert werden.",
      ja: "公開には新しいバックエンドが必要です。生成終了後に再起動してください。草稿の編集・確認・保存は可能です。",
      ko: "게시하려면 새 백엔드가 필요합니다. 생성 완료 후 재시작하세요. 초안 편집, 미리보기, 저장은 가능합니다.",
      es: "Publicar requiere el nuevo servidor. Reinicia al terminar la generación activa; puedes editar y guardar borradores.",
      pt: "Publicar requer o novo servidor. Reinicie após a geração ativa; pode editar e salvar rascunhos.",
      tr: "Yayımlama yeni sunucu gerektirir. Üretim bittikten sonra yeniden başlatın; taslaklar düzenlenip kaydedilebilir.",
      ar: "النشر يحتاج الخادم المحدّث. أعد التشغيل بعد انتهاء التوليد؛ يمكن تحرير المسودات ومعاينتها وحفظها.",
      vi: "Xuất bản cần máy chủ mới. Khởi động lại sau khi tạo xong; vẫn có thể sửa, xem trước và lưu nháp.",
      id: "Penerbitan memerlukan server baru. Mulai ulang setelah pembuatan selesai; draf tetap dapat diedit dan disimpan.",
      ru: "Для публикации нужен новый сервер. Перезапустите после генерации; черновики можно править, просматривать и сохранять."
    };
    return labels[language] || labels.en;
  }
  if (skillPresetKeys.includes(key)) return (skillPresetTranslations[language] || skillPresetTranslations.en)[skillPresetKeys.indexOf(key)];
  if (skillBatchKeys.includes(key)) return (skillBatchTranslations[language] || skillBatchTranslations.en)[skillBatchKeys.indexOf(key)];
  if (key === "memory") return (skillSimpleTranslations[language] || skillSimpleTranslations.en)[5];
  if (skillFlowKeys.includes(key)) {
    return (skillFlowTranslations[language] || skillFlowTranslations.en)[skillFlowKeys.indexOf(key)];
  }
  if (skillLicenseKeys.includes(key)) {
    return (skillLicenseTranslations[language] || skillLicenseTranslations.en)[skillLicenseKeys.indexOf(key)];
  }
  if (key === "boundary" && typeof installedSkillText === "function") return installedSkillText("hint", language);
  const value = (skillReviewTranslations[language] || skillReviewTranslations.en)[skillReviewKeys.indexOf(key)];
  return key === "limits" ? value.replace(/24[., ]?000/g, "96000").replace(/128/g, "512") : value;
}

const skillSourceKeys = ["github", "discover", "fetch", "note"];
const skillSourceTranslations = {
  en: ["GitHub file, Skill directory or repository URL", "Find documents", "Read selected files", "Public repositories only. Pin to a commit before reading; select SKILL.md and related text/license files. No execution, installation or license approval. Branch names containing / require a commit URL."],
  "zh-CN": ["GitHub 文件、Skill 目录或仓库地址", "查找源文件", "读取选中文件", "仅公开仓库。先固定 commit，再选择 SKILL.md 及相关文字/许可文件。不执行、不安装、不自动批准许可。含 / 的分支名请使用 commit 地址。"],
  "zh-TW": ["GitHub 檔案、Skill 目錄或儲存庫網址", "尋找原始檔案", "讀取選取檔案", "僅公開儲存庫。先固定 commit，再選取 SKILL.md 與相關文字/授權檔案。不執行、不安裝、不自動核准授權。含 / 的分支請使用 commit 網址。"],
  fr: ["URL GitHub : fichier, dossier Skill ou dépôt", "Trouver les documents", "Lire la sélection", "Dépôts publics uniquement. Commit fixe, puis sélection de SKILL.md et textes/licences. Sans exécution, installation ni approbation. Branche avec / : utilisez un commit."],
  de: ["GitHub-Datei-, Skill-Ordner- oder Repository-URL", "Dokumente finden", "Auswahl lesen", "Nur öffentliche Repositories. Fester Commit, dann SKILL.md und Texte/Lizenzen wählen. Keine Ausführung, Installation oder Freigabe. Branch mit /: Commit-URL verwenden."],
  ja: ["GitHub ファイル・Skill ディレクトリ・リポジトリ URL", "文書を検索", "選択したファイルを読込", "公開リポジトリのみ。commit を固定して SKILL.md と関連文書・ライセンスを選択。実行・インストール・承認なし。/ を含むブランチは commit URL を使用。"],
  ko: ["GitHub 파일, Skill 디렉터리 또는 저장소 URL", "문서 찾기", "선택 파일 읽기", "공개 저장소만. commit을 고정하고 SKILL.md 및 관련 문서/라이선스 선택. 실행, 설치, 승인 없음. / 포함 브랜치는 commit URL 사용."],
  es: ["URL GitHub de archivo, carpeta Skill o repositorio", "Buscar documentos", "Leer selección", "Solo repositorios públicos. Commit fijo; seleccione SKILL.md y textos/licencias. Sin ejecución, instalación ni aprobación. Rama con /: use URL de commit."],
  pt: ["URL GitHub de arquivo, pasta Skill ou repositório", "Buscar documentos", "Ler seleção", "Somente repositórios públicos. Commit fixo; selecione SKILL.md e textos/licenças. Sem execução, instalação ou aprovação. Branch com /: use URL de commit."],
  tr: ["GitHub dosya, Skill dizini veya depo URL'si", "Belgeleri bul", "Seçili dosyaları oku", "Yalnız açık depolar. Sabit commit; SKILL.md ve metin/lisans seçin. Çalıştırma, kurulum veya onay yok. / içeren dal için commit URL kullanın."],
  ar: ["رابط ملف GitHub أو مجلد Skill أو المستودع", "البحث عن المستندات", "قراءة الملفات المحددة", "مستودعات عامة فقط. تثبيت commit ثم اختيار SKILL.md والنصوص والتراخيص. دون تنفيذ أو تثبيت أو موافقة. فرع يحتوي /: استخدم رابط commit."],
  vi: ["URL GitHub của tệp, thư mục Skill hoặc kho", "Tìm tài liệu", "Đọc tệp đã chọn", "Chỉ kho công khai. Cố định commit; chọn SKILL.md và văn bản/giấy phép. Không thực thi, cài đặt hay phê duyệt. Nhánh có /: dùng URL commit."],
  id: ["URL GitHub berkas, direktori Skill atau repositori", "Cari dokumen", "Baca pilihan", "Hanya repositori publik. Commit tetap; pilih SKILL.md dan teks/lisensi. Tanpa eksekusi, pemasangan atau persetujuan. Cabang dengan /: gunakan URL commit."],
  ru: ["URL файла, каталога Skill или репозитория GitHub", "Найти документы", "Прочитать выбранное", "Только открытые репозитории. Фиксированный commit; выберите SKILL.md и тексты/лицензии. Без выполнения, установки и одобрения. Ветка с /: используйте URL commit."]
};

function skillSourcePayload(model, origin, revision, text) {
  const files = JSON.parse(text);
  if (!Array.isArray(files) || !files.length || files.length > 16) throw new Error("invalid_skill_source_files");
  for (const file of files) {
    if (!file || typeof file.path !== "string" || typeof file.content !== "string" ||
        Object.keys(file).sort().join(",") !== "content,path" ||
        !file.content.trim() || Array.from(file.content).length > 96000 || file.content.includes("\0")) {
      throw new Error("invalid_skill_source_file");
    }
  }
  const payload = { model, source: { origin, revision, files } };
  skillRequestBody(payload);
  return payload;
}

function skillRequestBody(payload) {
  const body = JSON.stringify(payload);
  if (new TextEncoder().encode(body).length > 512 * 1024) throw new Error("invalid_skill_request_size");
  return body;
}

const skillSourceErrorKeys = ["github_rate_limit_or_forbidden", "github_connection_failed", "github_not_found_or_private", "github_http_failed", "github_tree_incomplete", "github_no_supported_text_files", "github_too_many_documents_use_skill_directory", "github_too_many_licenses_use_skill_directory", "github_invalid_commit", "github_default_branch_unavailable", "github_selected_file_unavailable", "github_invalid_utf8_blob", "github_response_too_large", "invalid_github_url", "invalid_github_path", "invalid_github_snapshot", "invalid_github_file_selection", "invalid_license_selection", "skill_license_confirmation_required", "skill_license_scope_mismatch", "skill_license_evidence_changed", "skill_reference_budget_exceeded"];
const skillSourceErrorTranslations = {
  en: ["GitHub API rate limit reached or access forbidden. Wait for the limit to reset, or set a GITHUB_TOKEN to raise the limit.", "Could not reach GitHub. Check the network and retry.", "Repository not found or private. Use a public repository URL.", "GitHub returned an unexpected error. Retry later.", "The repository tree is too large or incomplete. Use a Skill directory URL.", "No supported text files found. Select a SKILL.md or text/license file.", "Too many documents. Use a Skill directory URL instead of the whole repository.", "Too many license files. Use a Skill directory URL.", "Could not resolve the commit. Use a commit URL.", "Could not determine the default branch. Use a commit URL.", "A selected file is no longer available at the pinned commit.", "A selected file is not valid UTF-8 text.", "GitHub response was too large.", "Invalid GitHub URL.", "Invalid GitHub path.", "Invalid GitHub snapshot.", "Invalid file selection.", "Invalid license selection.", "Confirm the license before reading documents.", "The license does not cover the selected files.", "The license evidence changed; reconfirm it.", "Referenced documents exceed the per-Skill file limit. Select fewer files or a Skill directory URL."],
  "zh-CN": ["GitHub API 限流或访问被拒。请等待限流重置，或设置 GITHUB_TOKEN 提升限额。", "无法连接 GitHub，请检查网络后重试。", "仓库不存在或为私有，请使用公开仓库地址。", "GitHub 返回异常错误，请稍后重试。", "仓库树过大或不完整，请使用 Skill 目录地址。", "未找到支持的文本文件，请选择 SKILL.md 或文本/许可文件。", "文档过多，请使用 Skill 目录地址而非整个仓库。", "许可文件过多，请使用 Skill 目录地址。", "无法解析 commit，请使用 commit 地址。", "无法确定默认分支，请使用 commit 地址。", "所选文件在固定 commit 下已不可用。", "所选文件不是有效的 UTF-8 文本。", "GitHub 响应过大。", "GitHub 地址无效。", "GitHub 路径无效。", "GitHub 快照无效。", "文件选择无效。", "许可选择无效。", "读取文档前请先确认许可。", "该许可不覆盖所选文件。", "许可证据已变更，请重新确认。", "被引用的文档超出每个 Skill 的文件上限。请减少文件或使用 Skill 目录地址。"],
  "zh-TW": ["GitHub API 限流或存取被拒。請等待限流重置，或設定 GITHUB_TOKEN 提升限額。", "無法連線 GitHub，請檢查網路後重試。", "儲存庫不存在或為私有，請使用公開儲存庫網址。", "GitHub 傳回異常錯誤，請稍後重試。", "儲存庫樹過大或不完整，請使用 Skill 目錄網址。", "找不到支援的文字檔，請選擇 SKILL.md 或文字/授權檔。", "文件過多，請使用 Skill 目錄網址而非整個儲存庫。", "授權檔過多，請使用 Skill 目錄網址。", "無法解析 commit，請使用 commit 網址。", "無法確定預設分支，請使用 commit 網址。", "所選檔案在固定 commit 下已不可用。", "所選檔案不是有效的 UTF-8 文字。", "GitHub 回應過大。", "GitHub 網址無效。", "GitHub 路徑無效。", "GitHub 快照無效。", "檔案選擇無效。", "授權選擇無效。", "讀取文件前請先確認授權。", "該授權不涵蓋所選檔案。", "授權證據已變更，請重新確認。", "被引用的文件超出每個 Skill 的檔案上限。請減少檔案或使用 Skill 目錄網址。"],
  fr: ["Limite GitHub atteinte ou accès refusé. Attendez la réinitialisation ou définissez GITHUB_TOKEN.", "Impossible de joindre GitHub. Vérifiez le réseau et réessayez.", "Dépôt introuvable ou privé. Utilisez une URL publique.", "GitHub a renvoyé une erreur inattendue. Réessayez plus tard.", "Arborescence trop grande ou incomplète. Utilisez une URL de dossier Skill.", "Aucun texte pris en charge. Sélectionnez SKILL.md ou un texte/licence.", "Trop de documents. Utilisez une URL de dossier Skill.", "Trop de licences. Utilisez une URL de dossier Skill.", "Commit introuvable. Utilisez une URL de commit.", "Branche par défaut introuvable. Utilisez une URL de commit.", "Un fichier sélectionné n'est plus disponible au commit fixé.", "Un fichier sélectionné n'est pas du texte UTF-8 valide.", "Réponse GitHub trop volumineuse.", "URL GitHub invalide.", "Chemin GitHub invalide.", "Instantané GitHub invalide.", "Sélection de fichiers invalide.", "Sélection de licence invalide.", "Confirmez la licence avant de lire les documents.", "La licence ne couvre pas les fichiers sélectionnés.", "La preuve de licence a changé ; reconfirmez-la.", "Les documents référencés dépassent la limite par Skill. Réduisez la sélection ou utilisez une URL de dossier."],
  de: ["GitHub-Limit erreicht oder Zugriff verweigert. Warten Sie oder setzen Sie GITHUB_TOKEN.", "GitHub nicht erreichbar. Netzwerk prüfen und erneut versuchen.", "Repository nicht gefunden oder privat. Öffentliche URL verwenden.", "GitHub gab einen unerwarteten Fehler zurück. Später erneut versuchen.", "Baum zu groß oder unvollständig. Skill-Ordner-URL verwenden.", "Keine unterstützten Textdateien. SKILL.md oder Text/Lizenz wählen.", "Zu viele Dokumente. Skill-Ordner-URL verwenden.", "Zu viele Lizenzen. Skill-Ordner-URL verwenden.", "Commit nicht auflösbar. Commit-URL verwenden.", "Standardbranch nicht bestimmbar. Commit-URL verwenden.", "Eine ausgewählte Datei ist beim fixierten Commit nicht mehr verfügbar.", "Eine ausgewählte Datei ist kein gültiger UTF-8-Text.", "GitHub-Antwort zu groß.", "Ungültige GitHub-URL.", "Ungültiger GitHub-Pfad.", "Ungültiger GitHub-Snapshot.", "Ungültige Dateiauswahl.", "Ungültige Lizenzauswahl.", "Lizenz vor dem Lesen bestätigen.", "Die Lizenz deckt die Dateien nicht ab.", "Lizenzbeleg geändert; erneut bestätigen.", "Referenzierte Dokumente überschreiten das Dateilimit pro Skill. Weniger Dateien oder Skill-Ordner-URL verwenden."],
  ja: ["GitHub API の制限到達またはアクセス拒否。リセットを待つか GITHUB_TOKEN を設定してください。", "GitHub に接続できません。ネットワークを確認して再試行してください。", "リポジトリが見つからないか非公開です。公開 URL を使用してください。", "GitHub が予期しないエラーを返しました。後で再試行してください。", "ツリーが大きすぎるか不完全です。Skill ディレクトリ URL を使用してください。", "対応するテキストがありません。SKILL.md またはテキスト/ライセンスを選択してください。", "文書が多すぎます。Skill ディレクトリ URL を使用してください。", "ライセンスが多すぎます。Skill ディレクトリ URL を使用してください。", "commit を解決できません。commit URL を使用してください。", "デフォルトブランチを特定できません。commit URL を使用してください。", "選択したファイルは固定 commit で利用できません。", "選択したファイルは有効な UTF-8 テキストではありません。", "GitHub の応答が大きすぎます。", "GitHub URL が無効です。", "GitHub パスが無効です。", "GitHub スナップショットが無効です。", "ファイル選択が無効です。", "ライセンス選択が無効です。", "文書を読む前にライセンスを確認してください。", "ライセンスが選択ファイルをカバーしていません。", "ライセンス証拠が変更されました。再確認してください。", "参照ドキュメントが Skill ごとの上限を超えています。ファイルを減らすか Skill ディレクトリ URL を使用してください。"],
  ko: ["GitHub API 한도 도달 또는 접근 거부. 재설정을 기다리거나 GITHUB_TOKEN을 설정하세요.", "GitHub에 연결할 수 없습니다. 네트워크를 확인하고 다시 시도하세요.", "저장소를 찾을 수 없거나 비공개입니다. 공개 URL을 사용하세요.", "GitHub가 예기치 않은 오류를 반환했습니다. 나중에 다시 시도하세요.", "트리가 너무 크거나 불완전합니다. Skill 디렉터리 URL을 사용하세요.", "지원되는 텍스트가 없습니다. SKILL.md 또는 텍스트/라이선스를 선택하세요.", "문서가 너무 많습니다. Skill 디렉터리 URL을 사용하세요.", "라이선스가 너무 많습니다. Skill 디렉터리 URL을 사용하세요.", "commit을 확인할 수 없습니다. commit URL을 사용하세요.", "기본 브랜치를 확인할 수 없습니다. commit URL을 사용하세요.", "선택한 파일이 고정 commit에서 더 이상 사용할 수 없습니다.", "선택한 파일이 유효한 UTF-8 텍스트가 아닙니다.", "GitHub 응답이 너무 큽니다.", "GitHub URL이 잘못되었습니다.", "GitHub 경로가 잘못되었습니다.", "GitHub 스냅샷이 잘못되었습니다.", "파일 선택이 잘못되었습니다.", "라이선스 선택이 잘못되었습니다.", "문서를 읽기 전에 라이선스를 확인하세요.", "라이선스가 선택 파일을 포함하지 않습니다.", "라이선스 증거가 변경되었습니다. 다시 확인하세요.", "참조 문서가 Skill별 파일 한도를 초과합니다. 파일을 줄이거나 Skill 디렉터리 URL을 사용하세요."],
  es: ["Límite de GitHub alcanzado o acceso denegado. Espere o defina GITHUB_TOKEN.", "No se pudo conectar con GitHub. Revise la red y reintente.", "Repositorio no encontrado o privado. Use una URL pública.", "GitHub devolvió un error inesperado. Reintente más tarde.", "Árbol demasiado grande o incompleto. Use una URL de carpeta Skill.", "No hay texto compatible. Seleccione SKILL.md o texto/licencia.", "Demasiados documentos. Use una URL de carpeta Skill.", "Demasiadas licencias. Use una URL de carpeta Skill.", "No se pudo resolver el commit. Use una URL de commit.", "No se pudo determinar la rama por defecto. Use una URL de commit.", "Un archivo seleccionado ya no está disponible en el commit fijado.", "Un archivo seleccionado no es texto UTF-8 válido.", "Respuesta de GitHub demasiado grande.", "URL de GitHub inválida.", "Ruta de GitHub inválida.", "Instantánea de GitHub inválida.", "Selección de archivos inválida.", "Selección de licencia inválida.", "Confirme la licencia antes de leer los documentos.", "La licencia no cubre los archivos seleccionados.", "La evidencia de licencia cambió; reconfírmela.", "Los documentos referenciados superan el límite por Skill. Reduce la selección o usa una URL de carpeta."],
  pt: ["Limite do GitHub atingido ou acesso negado. Aguarde ou defina GITHUB_TOKEN.", "Não foi possível conectar ao GitHub. Verifique a rede e tente novamente.", "Repositório não encontrado ou privado. Use uma URL pública.", "O GitHub retornou um erro inesperado. Tente mais tarde.", "Árvore muito grande ou incompleta. Use uma URL de pasta Skill.", "Nenhum texto compatível. Selecione SKILL.md ou texto/licença.", "Documentos demais. Use uma URL de pasta Skill.", "Licenças demais. Use uma URL de pasta Skill.", "Não foi possível resolver o commit. Use uma URL de commit.", "Não foi possível determinar o branch padrão. Use uma URL de commit.", "Um arquivo selecionado não está mais disponível no commit fixado.", "Um arquivo selecionado não é texto UTF-8 válido.", "Resposta do GitHub muito grande.", "URL do GitHub inválida.", "Caminho do GitHub inválido.", "Snapshot do GitHub inválido.", "Seleção de arquivos inválida.", "Seleção de licença inválida.", "Confirme a licença antes de ler os documentos.", "A licença não cobre os arquivos selecionados.", "A evidência de licença mudou; reconfirme.", "Os documentos referenciados excedem o limite por Skill. Reduza a seleção ou use uma URL de pasta."],
  tr: ["GitHub limitine ulaşıldı veya erişim reddedildi. Bekleyin veya GITHUB_TOKEN tanımlayın.", "GitHub'a bağlanılamadı. Ağı kontrol edip yeniden deneyin.", "Depo bulunamadı veya özel. Genel URL kullanın.", "GitHub beklenmeyen bir hata döndürdü. Sonra tekrar deneyin.", "Ağaç çok büyük veya eksik. Skill dizini URL'si kullanın.", "Desteklenen metin yok. SKILL.md veya metin/lisans seçin.", "Çok fazla belge. Skill dizini URL'si kullanın.", "Çok fazla lisans. Skill dizini URL'si kullanın.", "commit çözümlenemedi. commit URL'si kullanın.", "Varsayılan dal belirlenemedi. commit URL'si kullanın.", "Seçili dosya sabit commit'te artık yok.", "Seçili dosya geçerli UTF-8 metin değil.", "GitHub yanıtı çok büyük.", "Geçersiz GitHub URL'si.", "Geçersiz GitHub yolu.", "Geçersiz GitHub anlık görüntüsü.", "Geçersiz dosya seçimi.", "Geçersiz lisans seçimi.", "Belgeleri okumadan önce lisansı onaylayın.", "Lisans seçili dosyaları kapsamıyor.", "Lisans kanıtı değişti; yeniden onaylayın.", "Referans verilen belgeler Skill başına dosya sınırını aşıyor. Seçimi azaltın veya klasör URL'si kullanın."],
  ar: ["تم بلوغ حد GitHub أو رفض الوصول. انتظر إعادة التعيين أو عيّن GITHUB_TOKEN.", "تعذر الاتصال بـ GitHub. تحقق من الشبكة وأعد المحاولة.", "المستودع غير موجود أو خاص. استخدم رابطاً عاماً.", "أعاد GitHub خطأً غير متوقع. أعد المحاولة لاحقاً.", "الشجرة كبيرة جداً أو غير مكتملة. استخدم رابط دليل Skill.", "لا توجد نصوص مدعومة. اختر SKILL.md أو نصاً/ترخيصاً.", "مستندات كثيرة جداً. استخدم رابط دليل Skill.", "تراخيص كثيرة جداً. استخدم رابط دليل Skill.", "تعذر حل الـ commit. استخدم رابط commit.", "تعذر تحديد الفرع الافتراضي. استخدم رابط commit.", "ملف محدد لم يعد متاحاً عند الـ commit المثبت.", "ملف محدد ليس نص UTF-8 صالحاً.", "استجابة GitHub كبيرة جداً.", "رابط GitHub غير صالح.", "مسار GitHub غير صالح.", "لقطة GitHub غير صالحة.", "اختيار ملفات غير صالح.", "اختيار ترخيص غير صالح.", "أكّد الترخيص قبل قراءة المستندات.", "الترخيص لا يغطي الملفات المحددة.", "تغيّر دليل الترخيص؛ أعد تأكيده.", "تتجاوز المستندات المرجعية حد الملفات لكل Skill. قلّل التحديد أو استخدم رابط مجلد."],
  vi: ["Đã đạt giới hạn GitHub hoặc bị từ chối truy cập. Chờ đặt lại hoặc đặt GITHUB_TOKEN.", "Không kết nối được GitHub. Kiểm tra mạng và thử lại.", "Kho không tồn tại hoặc riêng tư. Dùng URL công khai.", "GitHub trả về lỗi bất ngờ. Thử lại sau.", "Cây quá lớn hoặc không đầy đủ. Dùng URL thư mục Skill.", "Không có văn bản hỗ trợ. Chọn SKILL.md hoặc văn bản/giấy phép.", "Quá nhiều tài liệu. Dùng URL thư mục Skill.", "Quá nhiều giấy phép. Dùng URL thư mục Skill.", "Không phân giải được commit. Dùng URL commit.", "Không xác định được nhánh mặc định. Dùng URL commit.", "Tệp đã chọn không còn khả dụng ở commit cố định.", "Tệp đã chọn không phải văn bản UTF-8 hợp lệ.", "Phản hồi GitHub quá lớn.", "URL GitHub không hợp lệ.", "Đường dẫn GitHub không hợp lệ.", "Ảnh chụp GitHub không hợp lệ.", "Chọn tệp không hợp lệ.", "Chọn giấy phép không hợp lệ.", "Xác nhận giấy phép trước khi đọc tài liệu.", "Giấy phép không bao phủ các tệp đã chọn.", "Bằng chứng giấy phép đã thay đổi; xác nhận lại.", "Tài liệu được tham chiếu vượt giới hạn tệp mỗi Skill. Hãy giảm lựa chọn hoặc dùng URL thư mục."],
  id: ["Batas GitHub tercapai atau akses ditolak. Tunggu reset atau setel GITHUB_TOKEN.", "Tidak dapat terhubung ke GitHub. Periksa jaringan dan coba lagi.", "Repositori tidak ditemukan atau privat. Gunakan URL publik.", "GitHub mengembalikan kesalahan tak terduga. Coba lagi nanti.", "Pohon terlalu besar atau tidak lengkap. Gunakan URL direktori Skill.", "Tidak ada teks yang didukung. Pilih SKILL.md atau teks/lisensi.", "Terlalu banyak dokumen. Gunakan URL direktori Skill.", "Terlalu banyak lisensi. Gunakan URL direktori Skill.", "Tidak dapat menyelesaikan commit. Gunakan URL commit.", "Tidak dapat menentukan cabang default. Gunakan URL commit.", "File terpilih tidak lagi tersedia pada commit tetap.", "File terpilih bukan teks UTF-8 yang valid.", "Respons GitHub terlalu besar.", "URL GitHub tidak valid.", "Jalur GitHub tidak valid.", "Snapshot GitHub tidak valid.", "Pemilihan file tidak valid.", "Pemilihan lisensi tidak valid.", "Konfirmasi lisensi sebelum membaca dokumen.", "Lisensi tidak mencakup file terpilih.", "Bukti lisensi berubah; konfirmasi ulang.", "Dokumen referensi melebihi batas file per Skill. Kurangi pilihan atau gunakan URL direktori."],
  ru: ["Достигнут лимит GitHub или доступ запрещён. Подождите сброса или задайте GITHUB_TOKEN.", "Не удалось подключиться к GitHub. Проверьте сеть и повторите.", "Репозиторий не найден или приватный. Используйте публичный URL.", "GitHub вернул неожиданную ошибку. Повторите позже.", "Дерево слишком большое или неполное. Используйте URL каталога Skill.", "Нет поддерживаемого текста. Выберите SKILL.md или текст/лицензию.", "Слишком много документов. Используйте URL каталога Skill.", "Слишком много лицензий. Используйте URL каталога Skill.", "Не удалось разрешить commit. Используйте URL commit.", "Не удалось определить ветку по умолчанию. Используйте URL commit.", "Выбранный файл больше недоступен на зафиксированном commit.", "Выбранный файл не является корректным UTF-8 текстом.", "Ответ GitHub слишком велик.", "Неверный URL GitHub.", "Неверный путь GitHub.", "Неверный снимок GitHub.", "Неверный выбор файлов.", "Неверный выбор лицензии.", "Подтвердите лицензию перед чтением документов.", "Лицензия не покрывает выбранные файлы.", "Доказательство лицензии изменилось; подтвердите заново.", "Ссылочные документы превышают лимит файлов на Skill. Сократите выбор или используйте URL каталога."]
};
function skillSourceError(code, language) {
  const index = skillSourceErrorKeys.indexOf(code);
  if (index === -1) return code;
  return (skillSourceErrorTranslations[language] || skillSourceErrorTranslations.en)[index];
}

const skillOneClickTranslations = {
  en: "Install all presets from URL",
  "zh-CN": "一键安装全部预设",
  "zh-TW": "一鍵安裝全部預設",
  fr: "Installer tous les préréglages",
  de: "Alle Vorlagen installieren",
  ja: "すべてのプリセットを一括インストール",
  ko: "모든 프리셋 한 번에 설치",
  es: "Instalar todos los preajustes",
  pt: "Instalar todas as predefinições",
  tr: "Tüm önayarları yükle",
  ar: "تثبيت جميع الإعدادات المسبقة",
  vi: "Cài đặt tất cả cài đặt trước",
  id: "Instal semua preset",
  ru: "Установить все пресеты"
};
function skillOneClickText(language) {
  return skillOneClickTranslations[language] || skillOneClickTranslations.en;
}

function skillSourceName(files) {
  const file = files.find(item => /(^|\/)skill\.md$/i.test(item.path)) || files[0];
  if (!file) return "";
  const frontmatter = file.content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  const metadata = frontmatter?.match(/^name:\s*(.+?)\s*$/m)?.[1];
  let name = "";
  if (metadata && !/^[>|[{&*!]/.test(metadata)) {
    if (metadata.startsWith('"') && metadata.endsWith('"')) {
      try { name = JSON.parse(metadata); } catch { name = ""; }
    } else if (metadata.startsWith("'") && metadata.endsWith("'")) {
      name = metadata.slice(1, -1).replace(/''/g, "'");
    } else name = metadata.replace(/\s+#.*$/, "");
  }
  if (!name) name = file.content.match(/^#\s+(.+?)\s*#*\s*$/m)?.[1] || "";
  if (!name) {
    const parts = file.path.split("/");
    name = /^skill\.md$/i.test(parts.at(-1)) && parts.length > 1
      ? parts.at(-2) : parts.at(-1).replace(/\.[^.]+$/, "");
  }
  return name.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, 120);
}

const skillReferenceIsTarget = value => {
  const target = (value || "").trim();
  if (!target || target.length > 240 || target.startsWith("/") || target.startsWith("#") || target.startsWith("<")) return false;
  if (/^(https?:|mailto:|ftp:|file:)/i.test(target)) return false;
  if (/[?#&<>"'\t\n\r ]/.test(target)) return false;
  return /\.(md|markdown|txt)$/i.test(target);
};

function skillReferenceTargets(content) {
  const found = new Set();
  for (const match of content.matchAll(/\]\(([^)\n]+)\)/g)) {
    if (skillReferenceIsTarget(match[1])) found.add(match[1].trim());
  }
  for (const match of content.matchAll(/`([^`\n]+)`/g)) {
    if (skillReferenceIsTarget(match[1])) found.add(match[1].trim());
  }
  for (const match of content.matchAll(/(?<![\w/:])((?:\.{0,2}\/)?[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*\.(?:md|markdown|txt))(?![\w])/gi)) {
    if (skillReferenceIsTarget(match[1])) found.add(match[1].trim());
  }
  return found;
}

function skillResolveReference(basePath, reference) {
  const value = (reference || "").trim();
  if (!value || value.startsWith("/") || value.startsWith("#") || value.startsWith("<") || value.includes("%")) return null;
  if (/^(https?:|mailto:|ftp:|file:)/i.test(value)) return null;
  if (/[?#&<>"'\t\n\r ]/.test(value) || !/^[A-Za-z0-9_./-]{1,240}$/.test(value)) return null;
  const base = basePath.includes("/") ? basePath.slice(0, basePath.lastIndexOf("/") + 1) : "";
  const stack = base ? base.split("/").filter(Boolean) : [];
  for (const part of value.split("/")) {
    if (part === "" || part === ".") continue;
    if (part === "..") {
      if (!stack.length) return null;
      stack.pop();
    } else stack.push(part);
  }
  if (!stack.length) return null;
  return stack.join("/");
}

function skillMissingReferences(files) {
  const paths = new Set(files.map(file => file.path));
  const basenames = new Set(files.map(file => file.path.split("/").pop().toLowerCase()));
  const missing = [];
  const seen = new Set();
  for (const file of files) {
    if (!/\.(md|markdown|txt)$/i.test(file.path)) continue;
    for (const reference of skillReferenceTargets(file.content)) {
      const resolved = skillResolveReference(file.path, reference);
      if (resolved === null) continue;
      if (paths.has(resolved) || basenames.has(resolved.split("/").pop().toLowerCase())) continue;
      if (seen.has(resolved)) continue;
      seen.add(resolved);
      missing.push(resolved);
    }
  }
  return missing;
}

(() => {
  const $ = id => document.querySelector(`#skills-${id}`);
  const dialog = $("dialog");
  const controls = $("controls");
  const fields = ["name", "model", "origin", "revision", "source", "result"];
  let prepared = null;
  let selected = null;
  let original = "";
  let busy = false;
  let generation = 0;
  let snapshotCurrent = true;
  let validation = null;
  const batchDrafts = new Map();
  const selectedDrafts = new Set();
  let items = [];
  let githubSnapshot = null;
  let licenseCandidates = [];
  let licenseSources = [];
  let licenseFiles = [];
  let confirmedLicense = null;
  let automaticName = null;
  const isLicense = file => /^(?:licen[sc]e|copying)(?:\.(?:md|txt))?$/i.test(file.path.split("/").at(-1));
  const payload = () => {
    const value = skillSourcePayload($("model").value, $("origin").value, $("revision").value, $("source").value);
    value.source.files.push(...licenseFiles);
    skillRequestBody(value);
    return value;
  };
  function setSource(source) {
    const files = source.files.map(({path, content}) => ({path, content}));
    licenseFiles = files.filter(isLicense);
    $("origin").value = source.origin;
    $("revision").value = source.revision;
    $("source").value = JSON.stringify(files.filter(file => !isLicense(file)), null, 2);
    if (!$("name").value.trim() || $("name").value === automaticName) {
      automaticName = skillSourceName(files.filter(file => !isLicense(file)));
      $("name").value = automaticName;
    }
    renderLicenseEvidence(licenseFiles);
  }
  function renderLicenseEvidence(files) {
    $("license-evidence").replaceChildren();
    for (const file of files) {
      const details = text("details", "");
      details.append(text("summary", file.path), text("pre", file.content));
      $("license-evidence").append(details);
    }
  }
  let declarableLicenses = [];
  async function fetchDeclarableLicenses() {
    if (declarableLicenses.length) return declarableLicenses;
    const data = await api("/api/skills/license-types");
    declarableLicenses = Array.isArray(data.license_types) ? data.license_types : [];
    return declarableLicenses;
  }
  function renderLocalDocuments(files) {
    $("documents").replaceChildren();
    for (const file of files) {
      const row = text("span", `${file.path} (${Array.from(file.content).length})`);
      row.className = "skills-local-file";
      $("documents").append(row);
    }
  }
  function currentStageIndex() {
    const sourceSet = Boolean($("origin").value.trim() || $("revision").value.trim());
    if (!sourceSet) return 0;
    if (!confirmedLicense) return 1;
    if (!prepared) return 2;
    let candidate = null;
    try { candidate = JSON.parse($("result").value); } catch {}
    if (!selected && candidate?.status !== "draft") return 3;
    let installed = false;
    try { installed = Boolean(selected && window.MiniMuvSkills?.published(selected.id)); } catch {}
    return installed ? 5 : 4;
  }
  function renderFlow() {
    const container = $("flow");
    if (!container) return;
    const current = currentStageIndex();
    const language = document.querySelector("#language").value;
    container.replaceChildren();
    skillStageKeys.forEach((key, index) => {
      const stage = document.createElement("li");
      stage.className = "skills-flow-stage";
      stage.classList.toggle("done", index < current);
      stage.classList.toggle("active", index === current);
      const number = document.createElement("span");
      number.className = "skills-flow-num";
      number.textContent = index < current ? "✓" : String(index + 1);
      const label = document.createElement("span");
      label.className = "skills-flow-label";
      label.textContent = skillStageText(key, language);
      stage.append(number, label);
      if (index === current) stage.setAttribute("aria-current", "step");
      container.append(stage);
    });
  }
  const t = key => skillReviewText(key, document.querySelector("#language").value);
  const signature = () => JSON.stringify(fields.map(key => $(key).value));
  const dirty = () => signature() !== original;
  const status = (text, error = false) => {
    $("status").textContent = text;
    $("status").hidden = !text;
    $("status").classList.toggle("error", error);
  };
  const text = (tag, value) => {
    const node = document.createElement(tag);
    node.textContent = typeof value === "string" ? value : JSON.stringify(value, null, 2);
    return node;
  };
  function update() {
    controls.disabled = busy;
    for (const key of ["new", "refresh", "close"]) $(key).disabled = busy;
    $("license-confirm").disabled = busy || !licenseCandidates.length || !$("license-choice").value;
    $("convert").disabled = busy || !prepared || !snapshotCurrent;
    $("validate").disabled = busy || !prepared || !snapshotCurrent || !$("result").value.trim();
    $("save").disabled = busy || !prepared;
    $("delete").disabled = busy || !selected;
    $("fetch").disabled = busy || !githubSnapshot || !confirmedLicense;
    $("batch-convert").disabled = busy || !githubSnapshot || !confirmedLicense;
    $("one-click").disabled = busy || !$("github").value.trim() || !window.MiniMuvSkills.applyAvailable();
    const applyAvailable = window.MiniMuvSkills.applyAvailable();
    $("batch-install").disabled = busy || !selectedDrafts.size || !applyAvailable;
    if ($("batch-delete")) $("batch-delete").disabled = busy || !selectedDrafts.size;
    for (const check of $("documents").querySelectorAll("input")) check.disabled = busy || !confirmedLicense;
    let candidate;
    try { candidate = JSON.parse($("result").value); } catch { candidate = null; }
    $("install").disabled = busy || !applyAvailable || !prepared || !snapshotCurrent ||
      prepared.license_review.status !== "verified" || candidate?.status !== "draft" ||
      validation?.valid === false || !window.MiniMuvSkills.installCategories().length;
    $("availability").textContent = applyAvailable ? "" : t("restart");
    $("availability").hidden = applyAvailable;
    $("validation").textContent = !snapshotCurrent ? t("stale")
      : validation ? t(validation.valid ? "valid" : "invalid") : t("pending");
    $("snapshot").textContent = prepared
      ? `${prepared.source_sha256}\n${prepared.license_review.status}\n${prepared.license_review.license_name || ""}\n${prepared.license_review.obligations.join("\n")}` : "";
    renderList();
    renderFlow();
  }
  function clearLicenseCandidates() {
    licenseCandidates = [];
    $("license-choice").replaceChildren(new Option(t("licenseChoose"), ""));
    $("license-status").textContent = "";
  }
  function showLicenseCandidates(candidates) {
    licenseCandidates = Array.isArray(candidates) ? candidates : [];
    $("license-choice").replaceChildren(
      new Option(t("licenseChoose"), ""),
      ...candidates.map(item => new Option(
        item.declared ? item.license_name : `${item.license_name} — ${item.path}`,
        JSON.stringify(item)
      ))
    );
    $("license-choice").value = candidates.length ? JSON.stringify(candidates[0]) : "";
    $("license-status").textContent = candidates.length ? "" : t("licenseMissing");
  }
  function formatDraftTime(timestamp) {
    if (!timestamp || typeof timestamp !== "number") return "";
    try {
      const date = new Date(timestamp * 1000);
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      const h = String(date.getHours()).padStart(2, "0");
      const min = String(date.getMinutes()).padStart(2, "0");
      return `${m}-${d} ${h}:${min}`;
    } catch {
      return "";
    }
  }
  function renderList() {
    $("list").replaceChildren();
    if (!items.length) $("list").append(text("p", t("empty")));
    for (const item of items) {
      const row = text("div", "");
      const isSelected = item.id === selected?.id;
      row.className = `skills-draft-card skills-draft-row${isSelected ? " selected" : ""}`;
      const isPublished = Boolean(window.MiniMuvSkills?.published(item.id));
      const select = document.createElement("input");
      select.type = "checkbox"; select.checked = selectedDrafts.has(item.id); select.disabled = busy;
      select.setAttribute("aria-label", `${t("batchInstall")}: ${item.name}`);
      select.addEventListener("change", () => {
        if (select.checked) selectedDrafts.add(item.id); else selectedDrafts.delete(item.id);
        update();
      });
      const button = text("button", item.name);
      button.type = "button";
      button.disabled = busy;
      button.className = "skills-draft-name";
      button.setAttribute("aria-pressed", String(isSelected));
      const openDraft = () => {
        if (busy || (dirty() && !window.confirm(t("discard")))) return;
        operation(async () => {
          const data = await api(`/api/skills/drafts/${item.id}/open`, {});
          const draft = data.draft;
          selected = { id: draft.id, revision: draft.revision };
          $("name").value = draft.name;
          automaticName = null;
          selectModel(draft.model);
          githubSnapshot = null;
          licenseSources = [];
          confirmedLicense = null;
          $("documents").replaceChildren();
          $("github-snapshot").textContent = "";
          setSource(draft.source);
          renderLocalDocuments(draft.source.files);
          $("result").value = draft.result_text;
          prepared = { request: draft.request, source_sha256: draft.source_sha256, license_review: draft.license_review };
          clearLicenseCandidates();
          showLicenseCandidates(licenseFiles.length ? [{
            license_name: draft.license_review.license_name, path: licenseFiles[0].path,
          }].filter(item => item.license_name) : []);
          snapshotCurrent = data.snapshot_current;
          clearValidation();
          original = signature();
          renderReview();
          renderList();
        });
      };
      button.addEventListener("click", openDraft);
      row.addEventListener("click", event => {
        if (event.target.closest && (event.target.closest("input") || event.target.closest("button"))) return;
        openDraft();
      });
      const statusBadge = text("span", t(isPublished ? "draftInstalled" : "draftSaved"));
      statusBadge.className = `skills-draft-badge ${isPublished ? "installed" : "saved"}`;

      const meta = text("div", "");
      meta.className = "skills-draft-meta";
      const metaParts = [];
      if (item.model) metaParts.push(item.model);
      const timeStr = formatDraftTime(item.updated_at || item.created_at);
      if (timeStr) metaParts.push(timeStr);
      if (item.revision) metaParts.push(item.revision.slice(0, 8));
      meta.textContent = metaParts.join(" · ");

      row.append(select, button, statusBadge, meta);
      $("list").append(row);
    }
  }
  function selectModel(model) {
    if (![...$("model").options].some(option => option.value === model)) {
      $("model").append(new Option(model, model));
    }
    $("model").value = model;
  }
  function clearValidation() {
    validation = null;
    window.MiniMuvSkills.renderInstallCategories();
    $("findings").replaceChildren();
  }
  function reset() {
    for (const field of ["name", "origin", "revision", "result"]) $(field).value = "";
    $("source").value = '[{"path":"SKILL.md","content":""}]';
    $("files").value = "";
    prepared = null;
    selected = null;
    githubSnapshot = null;
    licenseSources = [];
    licenseFiles = [];
    confirmedLicense = null;
    automaticName = null;
    renderLicenseEvidence([]);
    clearLicenseCandidates();
    $("github").value = "";
    $("github-snapshot").textContent = "";
    $("documents").replaceChildren();
    snapshotCurrent = true;
    clearValidation();
    original = signature();
    status("");
    renderReview();
    renderList();
    update();
  }
  function renderEditor() {
    $("editor").replaceChildren();
    let candidate;
    try { candidate = JSON.parse($("result").value); } catch { return; }
    if (candidate?.status !== "draft" || !Array.isArray(candidate.package?.bindings)) return;
    candidate.package.bindings.slice(0, 4).forEach((binding, index) => {
      const label = text("label", `${window.MiniMuvSkills.text(binding.mode)} — ${t("editor")}`);
      const input = document.createElement("textarea");
      input.id = `skills-method-${index}`;
      input.rows = 7;
      input.maxLength = 6000;
      input.value = binding.instructions;
      label.setAttribute("for", input.id);
      input.addEventListener("input", () => {
        if (busy) return;
        const next = JSON.parse($("result").value);
        next.package.bindings[index].instructions = input.value;
        $("result").value = JSON.stringify(next, null, 2);
        clearValidation();
        status("");
        renderReview(false);
        update();
      });
      $("editor").append(label, input);
    });
  }
  function renderReview(editors = true) {
    if (editors) renderEditor();
    const preview = $("preview");
    preview.replaceChildren();
    let source;
    try {
      source = JSON.parse($("source").value);
    } catch {
      preview.append(text("p", t("source")));
      return;
    }
    if (Array.isArray(source)) {
      const section = text("section", "");
      const sourceDetails = text("details", "");
      sourceDetails.append(text("summary", t("evidence")));
      source.slice(0, 16).forEach((file, index) => {
        const details = text("details", "");
        details.append(text("summary", `source-${index + 1}: ${file?.path ?? ""}`), text("pre", file?.content ?? ""));
        sourceDetails.append(details);
      });
      section.append(sourceDetails);
      preview.append(section);
    }
    if (!$("result").value.trim()) return;
    let result;
    try {
      result = JSON.parse($("result").value);
    } catch {
      preview.append(text("p", t("invalid")));
      return;
    }
    const bindings = result?.package?.bindings;
    if (result?.status === "draft" && snapshotCurrent && prepared?.license_review.status === "verified" &&
        validation?.valid !== false && Array.isArray(bindings)) window.MiniMuvSkills.renderInstallCategories(bindings);
    if (Array.isArray(bindings)) {
      const section = text("section", "");
      section.append(text("h3", t("bindings")));
      for (const binding of bindings.slice(0, 4)) {
        const evidence = text("details", "");
        evidence.append(text("summary", t("evidence")), text("pre", binding?.evidence ?? []));
        section.append(text("h3", `${binding?.task ?? ""} / ${binding?.mode ?? ""}`),
          text("pre", binding?.instructions ?? ""), evidence);
      }
      preview.append(section);
    }
    for (const key of ["removed", "warnings", "blockers"]) {
      const section = text("section", "");
      section.append(text("h3", t(key)), text("pre", result?.report?.[key] ?? []));
      preview.append(section);
    }
  }
  function translate() {
    document.querySelectorAll("[data-skill-i18n]").forEach(node => {
      const translation = t(node.dataset.skillI18n);
      if (node.classList?.contains("skills-action-icon") || (typeof node.closest === "function" && node.closest(".skills-actions"))) {
        node.title = translation;
        node.setAttribute("aria-label", translation);
      } else {
        node.textContent = translation;
      }
    });
    document.querySelectorAll("[data-skill-source-i18n]").forEach(node => {
      const language = document.querySelector("#language").value;
      const translation = node.dataset.skillSourceI18n === "note" ? t("flow")
        : node.dataset.skillSourceI18n === "oneClick" ? skillOneClickText(language)
        : (skillSourceTranslations[language] || skillSourceTranslations.en)[
          skillSourceKeys.indexOf(node.dataset.skillSourceI18n)
        ];
      if (node.classList?.contains("skills-action-icon") || (typeof node.closest === "function" && node.closest(".skills-actions"))) {
        node.title = translation;
        node.setAttribute("aria-label", translation);
      } else {
        node.textContent = translation;
      }
    });
    $("close").setAttribute("aria-label", t("close"));
    $("preview").setAttribute("aria-label", t("title"));
    update();
    renderReview();
  }
  async function api(path, payload, isolated = false) {
    const response = await fetch(path, payload === undefined ? { cache: "no-store" } : {
      method: "POST", headers: { "Content-Type": "application/json" }, body: skillRequestBody(payload)
    });
    const data = await response.json();
    if (!response.ok && !(["/api/skills/validate", "/api/skills/convert"].includes(path) &&
        response.status === 422 && (data.validation || data.findings))) {
      if (!isolated && path === "/api/skills/convert" && data.result) {
        $("result").value = JSON.stringify(data.result, null, 2);
        validation = data.validation;
        renderReview();
      }
      if (data.error === "skill_draft_changed") throw new Error(t("conflict"));
      if (data.error === "skill_text_memory_unavailable") {
        const error = new Error(t("memory"));
        error.code = data.error;
        throw error;
      }
      if (data.error === "skill_snapshot_changed" && !isolated) {
        snapshotCurrent = false;
        clearValidation();
        throw new Error(t("stale"));
      }
      if (Array.isArray(data.findings) && !isolated) {
        validation = {valid: false, findings: data.findings};
        showFindings();
      }
      const localized = data.error ? skillSourceError(data.error, document.querySelector("#language").value) : "";
      if (localized !== data.error) throw new Error(localized);
      throw new Error([data.detail || data.error || String(response.status),
        ...(data.findings || []).map(item => `${item.code} ${item.path}: ${item.message}`)].join("\n"));
    }
    return data;
  }
  async function operation(work) {
    if (busy) return;
    busy = true;
    const current = generation;
    status(t("busy"));
    update();
    try {
      await work();
      if (generation === current && dialog.open && $("status").textContent === t("busy")) status("");
    } catch (error) {
      if (generation === current && dialog.open) status(`${t("error")}: ${error.message}`, true);
    } finally {
      if (generation === current) { busy = false; update(); }
    }
  }
  async function refresh() {
    $("draft-storage").textContent = "";
    const data = await api("/api/skills/drafts");
    items = data.items;
    for (const id of selectedDrafts) if (!items.some(item => item.id === id)) selectedDrafts.delete(id);
    $("draft-storage").textContent = data.storage_path;
    renderList();
  }
  $("open").addEventListener("click", () => {
    if (busy) return;
    generation++;
    dialog.showModal();
    operation(async () => {
      const results = await Promise.allSettled([api("/api/text-models"), refresh()]);
      if (results[0].status === "fulfilled") {
        const wasClean = !dirty();
        const currentModel = $("model").value;
        $("model").replaceChildren(...results[0].value.models.map(model => new Option(model.id, model.id)));
        if (currentModel) selectModel(currentModel);
        if (wasClean) original = signature();
      }
      const failures = results.filter(result => result.status === "rejected");
      if (failures.length) throw new Error(failures.map(result => result.reason.message).join("; "));
    });
  });
  function close() {
    if (busy || (dirty() && !window.confirm(t("discard")))) return;
    reset();
    generation++;
    dialog.close();
  }
  $("close").addEventListener("click", close);
  dialog.addEventListener("cancel", event => {
    if (event.target !== dialog) return;
    event.preventDefault();
    close();
  });
  $("new").addEventListener("click", () => {
    if (!busy && (!dirty() || window.confirm(t("discard")))) reset();
  });
  $("refresh").addEventListener("click", () => operation(refresh));
  for (const field of fields) {
    $(field).addEventListener(field === "model" ? "change" : "input", () => {
      if (busy) return;
      if (field === "name") automaticName = null;
      if (["model", "origin", "revision", "source"].includes(field)) {
        prepared = null;
        snapshotCurrent = true;
        clearValidation();
        if (["origin", "revision"].includes(field)) {
          licenseFiles = [];
          confirmedLicense = null;
          licenseSources = [];
          clearLicenseCandidates();
          renderLicenseEvidence([]);
        }
      } else if (field === "result") clearValidation();
      status("");
      if (["source", "result"].includes(field)) renderReview();
      update();
    });
  }
  const importLocalFiles = fileList => {
    const selected = [...fileList];
    if (!selected.length) return;
    return operation(async () => {
      if (dirty() && !window.confirm(t("discard"))) return;
      const entries = selected.map(file => {
        const relative = file.webkitRelativePath || "";
        const path = relative ? relative.split("/").slice(1).join("/") : file.name;
        return { file, path };
      }).filter(({ path }) => {
        const name = path.split("/").pop().toLowerCase();
        return /\.(md|markdown|txt|json|ya?ml)$/i.test(name) || /^(licen[sc]e|copying|notice)(\.(md|txt))?$/i.test(name);
      });
      if (!entries.length) throw new Error("invalid_skill_source_files");
      if (entries.length > 16) throw new Error("invalid_skill_source_files");
      const imported = [];
      for (const { file, path } of entries) {
        if (file.size > 384000) throw new Error("invalid_skill_source_file_size");
        const content = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(await file.arrayBuffer());
        imported.push({ path, content });
      }
      const localOrigin = `local:${entries.map(entry => entry.path).join(",")}`;
      const bytes = new TextEncoder().encode(JSON.stringify(imported));
      const hash = [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
        .map(value => value.toString(16).padStart(2, "0")).join("");
      skillSourcePayload($("model").value, localOrigin, hash, JSON.stringify(imported));
      githubSnapshot = null;
      licenseSources = [];
      confirmedLicense = null;
      setSource({origin: localOrigin, revision: hash, files: imported});
      renderLocalDocuments(imported);
      prepared = null;
      snapshotCurrent = true;
      clearValidation();
      clearLicenseCandidates();
      const detected = licenseFiles.length
        ? await api("/api/skills/licenses", {source: {
            origin: localOrigin, revision: hash, files: imported,
          }}).then(data => Array.isArray(data.detected_licenses) ? data.detected_licenses : [])
        : [];
      const declared = (await fetchDeclarableLicenses())
        .map(name => ({license_name: name, path: "", declared: true}));
      const detectedNames = new Set(detected.map(item => item.license_name));
      showLicenseCandidates([
        ...detected,
        ...declared.filter(item => !detectedNames.has(item.license_name)),
      ]);
      const missing = skillMissingReferences(imported);
      status(missing.length
        ? `${t("missingRefs")}: ${missing.slice(0, 8).join(", ")}${missing.length > 8 ? " …" : ""}` : "", missing.length > 0);
      renderReview();
    });
  };
  $("files").addEventListener("change", () => importLocalFiles($("files").files));
  $("folder").addEventListener("change", () => importLocalFiles($("folder").files));
  $("github").addEventListener("input", () => {
    githubSnapshot = null;
    licenseSources = [];
    confirmedLicense = null;
    prepared = null;
    clearValidation();
    clearLicenseCandidates();
    $("documents").replaceChildren();
    $("github-snapshot").textContent = "";
    update();
  });
  $("discover").addEventListener("click", () => operation(async () => {
    if (dirty() && !window.confirm(t("discard"))) return;
    prepared = null;
    selected = null;
    $("result").value = "";
    $("source").value = '[{"path":"SKILL.md","content":""}]';
    licenseFiles = [];
    confirmedLicense = null;
    licenseSources = [];
    clearValidation();
    renderLicenseEvidence([]);
    githubSnapshot = null;
    clearLicenseCandidates();
    $("documents").replaceChildren();
    $("github-snapshot").textContent = "";
    const data = await api("/api/skills/github/discover", {url: $("github").value.trim()});
    githubSnapshot = data;
    licenseSources = data.license_sources || [];
    const candidates = licenseSources.flatMap(item => item.detected_licenses);
    candidates.sort((a, b) => Number(b.path === data.license_path) - Number(a.path === data.license_path));
    showLicenseCandidates(candidates);
    renderLicenseEvidence(licenseSources.flatMap(item => item.source.files));
    $("github-snapshot").textContent = `${data.origin}\n${data.revision}`;
    for (const file of data.files) {
      if (file.license) continue;
      const label = text("label", "");
      const check = document.createElement("input");
      check.type = "checkbox";
      check.value = file.path;
      check.checked = file.path === data.selected_path;
      check.disabled = true;
      label.append(check, text("span", `${file.path} (${file.size} B)`));
      $("documents").append(label);
    }
  }));
  $("one-click").addEventListener("click", () => operation(async () => {
    const url = $("github").value.trim();
    if (!url) throw new Error("invalid_github_url");
    if (!window.MiniMuvSkills.applyAvailable()) throw new Error(t("restart"));
    if (dirty() && !window.confirm(t("discard"))) return;
    // 1. Discover the repository and pin the commit.
    const discovered = await api("/api/skills/github/discover", {url});
    githubSnapshot = discovered;
    licenseSources = discovered.license_sources || [];
    const candidates = licenseSources.flatMap(item => item.detected_licenses);
    candidates.sort((a, b) => Number(b.path === discovered.license_path) - Number(a.path === discovered.license_path));
    if (!candidates.length) throw new Error(t("licenseMissing"));
    // 2. Confirm the detected license for the pinned snapshot.
    const license = candidates[0];
    const selectedSource = licenseSources.find(item =>
      item.source.files.some(file => file.path === license.path));
    const licenseValue = selectedSource ? {source: {
      origin: selectedSource.source.origin, revision: selectedSource.source.revision,
      files: selectedSource.source.files.map(({path, content}) => ({path, content})),
    }} : null;
    await api("/api/skills/license-review", {
      source: licenseValue ? licenseValue.source : {origin: discovered.origin, revision: discovered.revision, files: []},
      license_name: license.license_name, license_path: license.path,
    });
    confirmedLicense = license;
    // 3. Group all sub-Skills and convert each into a draft.
    const allPaths = discovered.files.filter(file => !file.license).map(file => file.path);
    let groups;
    try { groups = skillSourceGroups(discovered.files, allPaths); }
    catch (error) { throw new Error(t(error.message)); }
    const model = $("model").value;
    $("batch-status").replaceChildren();
    let failures = 0;
    let completed = 0;
    for (const [index, group] of groups.entries()) {
      const row = text("p", `${index + 1}/${groups.length} ${group.path}: ${t("busy")}`);
      $("batch-status").append(row);
      try {
        const fetched = await api("/api/skills/github/fetch", {
          origin: discovered.origin, revision: discovered.revision, paths: group.paths,
          license_name: license.license_name, license_path: license.path
        }, true);
        const request = await api("/api/skills/requests", {
          model, source: {...fetched.source, files: fetched.source.files.map(({path, content}) => ({path, content}))}
        }, true);
        const converted = await api("/api/skills/convert", {
          request_id: request.request.trusted_context.request_id, draft_id: null, draft_revision: null,
          name: skillSourceName(fetched.source.files.filter(file => file.path === group.path))
        }, true);
        if (!converted.validation?.valid || !converted.draft) throw new Error([t("invalid"),
          ...(converted.validation?.findings || []).map(item => `${item.code} ${item.path}: ${item.message}`),
          ...(converted.result?.report?.blockers || []).map(item => item.reason)
        ].join("\n"));
        // 4. Apply (install) the draft immediately.
        await applyDraft(converted.draft, true);
        completed++;
        row.textContent = `${group.path}: ${t("applied")} — ${converted.draft.name}`;
      } catch (error) {
        failures++;
        row.textContent = `${group.path}: ${t("error")} — ${error.message}`;
        row.classList.toggle("error", true);
        if (error.code === "skill_text_memory_unavailable") break;
      }
    }
    await refresh();
    await window.MiniMuvSkills.refresh();
    status(`${t("batchDone")}: ${completed}/${groups.length}`, failures > 0);
  }));
  $("fetch").addEventListener("click", () => operation(async () => {
    if (!githubSnapshot || !confirmedLicense) throw new Error("skill_license_confirmation_required");
    if (dirty() && !window.confirm(t("discard"))) return;
    const paths = [...$("documents").querySelectorAll('input:checked')].map(input => input.value);
    const data = await api("/api/skills/github/fetch", {
      origin: githubSnapshot.origin, revision: githubSnapshot.revision, paths,
      license_name: confirmedLicense.license_name, license_path: confirmedLicense.path,
    });
    const sourceFiles = data.source.files.map(({ path, content }) => ({ path, content }));
    skillSourcePayload($("model").value, data.source.origin, data.source.revision, JSON.stringify(sourceFiles));
    setSource(data.source);
    $("result").value = "";
    selected = null;
    prepared = await api("/api/skills/requests", payload());
    snapshotCurrent = true;
    clearValidation();
    showLicenseCandidates(data.detected_licenses);
    renderReview();
  }));
  $("batch-convert").addEventListener("click", () => operation(async () => {
    if (!githubSnapshot || !confirmedLicense) throw new Error("skill_license_confirmation_required");
    const paths = [...$("documents").querySelectorAll("input:checked")].map(input => input.value);
    let groups;
    try { groups = skillSourceGroups(githubSnapshot.files, paths); }
    catch (error) { throw new Error(t(error.message)); }
    const snapshot = githubSnapshot;
    const license = confirmedLicense;
    const model = $("model").value;
    $("batch-status").replaceChildren();
    let failures = 0;
    let completed = 0;
    for (const [index, group] of groups.entries()) {
      const row = text("p", `${index + 1}/${groups.length} ${group.path}: ${t("busy")}`);
      $("batch-status").append(row);
      try {
        const key = JSON.stringify([snapshot.origin, snapshot.revision, model,
          license.path, license.license_name, group.paths]);
        let draft = batchDrafts.get(key);
        if (!draft || !items.some(item => item.id === draft.id)) {
          const fetched = await api("/api/skills/github/fetch", {
            origin: snapshot.origin, revision: snapshot.revision, paths: group.paths,
            license_name: license.license_name, license_path: license.path
          }, true);
          const request = await api("/api/skills/requests", {
            model, source: {...fetched.source, files: fetched.source.files.map(({path, content}) => ({path, content}))}
          }, true);
          const converted = await api("/api/skills/convert", {
            request_id: request.request.trusted_context.request_id, draft_id: null, draft_revision: null,
            name: skillSourceName(fetched.source.files.filter(file => file.path === group.path))
          }, true);
          if (!converted.validation?.valid || !converted.draft) throw new Error([t("invalid"),
            ...(converted.validation?.findings || []).map(item => `${item.code} ${item.path}: ${item.message}`),
            ...(converted.result?.report?.blockers || []).map(item => item.reason)
          ].join("\n"));
          draft = converted.draft;
          batchDrafts.set(key, draft);
          items.unshift(draft);
        }
        selectedDrafts.add(draft.id);
        completed++;
        row.textContent = `${group.path}: ${t("batchDone")} — ${draft.name}`;
      } catch (error) {
        failures++;
        row.textContent = `${group.path}: ${t("error")} — ${error.message}`;
        row.classList.toggle("error", true);
        if (error.code === "skill_text_memory_unavailable") break;
      }
    }
    await refresh();
    status(`${t("batchDone")}: ${completed}/${groups.length}`, failures > 0);
  }));
  $("batch-install").addEventListener("click", () => {
    if (busy || !selectedDrafts.size || !window.MiniMuvSkills.applyAvailable() ||
        !window.confirm(window.MiniMuvSkills.text("confirm"))) return;
    return operation(async () => {
      const drafts = items.filter(item => selectedDrafts.has(item.id));
      $("batch-status").replaceChildren();
      let failures = 0;
      for (const [index, draft] of drafts.entries()) {
        const row = text("p", `${index + 1}/${drafts.length} ${draft.name}: ${t("busy")}`);
        $("batch-status").append(row);
        try {
          await applyDraft(draft, true);
          selectedDrafts.delete(draft.id);
          row.textContent = `${draft.name}: ${t("applied")}`;
        } catch (error) {
          failures++;
          row.textContent = `${draft.name}: ${t("error")} — ${error.message}`;
          row.classList.toggle("error", true);
        }
      }
      await window.MiniMuvSkills.refresh();
      status(`${t("batchDone")}: ${drafts.length - failures}/${drafts.length}`, failures > 0);
    });
  });
  if ($("batch-delete")) {
    $("batch-delete").addEventListener("click", () => {
      if (busy || !selectedDrafts.size || !window.confirm(t("deleteConfirm"))) return;
      return operation(async () => {
        const toDelete = items.filter(item => selectedDrafts.has(item.id));
        let hadCurrent = false;
        let deleted = 0;
        for (const item of toDelete) {
          try {
            await api(`/api/skills/drafts/${item.id}/delete`, { revision: item.revision });
            selectedDrafts.delete(item.id);
            deleted++;
            if (selected?.id === item.id) hadCurrent = true;
          } catch (e) {}
        }
        if (hadCurrent) reset();
        await refresh();
        status(`${t("delete")}: ${deleted}/${toDelete.length}`, deleted < toDelete.length);
      });
    });
  }
  $("license-choice").addEventListener("change", () => {
    confirmedLicense = null;
    prepared = null;
    clearValidation();
    update();
  });
  $("license-confirm").addEventListener("click", () => operation(async () => {
    if ($("result").value.trim() && !window.confirm(t("discard"))) return;
    const candidate = JSON.parse($("license-choice").value);
    const selectedSource = githubSnapshot && !licenseFiles.length && licenseSources.find(item =>
      item.source.files.some(file => file.path === candidate.path)
    );
    const value = selectedSource ? {source: {
      origin: selectedSource.source.origin, revision: selectedSource.source.revision,
      files: selectedSource.source.files.map(({path, content}) => ({path, content})),
    }} : payload();
    if (candidate.declared) {
      await api("/api/skills/license-declare", {
        source: value.source, license_name: candidate.license_name,
      });
    } else {
      await api("/api/skills/license-review", {
        source: value.source, license_name: candidate.license_name, license_path: candidate.path,
      });
    }
    confirmedLicense = candidate;
    const next = selectedSource ? null : await api("/api/skills/requests", value);
    $("result").value = "";
    prepared = next;
    snapshotCurrent = true;
    clearValidation();
    renderReview();
    status(t("licenseConfirmed"));
  }));
  $("prepare").addEventListener("click", () => operation(async () => {
    if ($("result").value.trim() && !window.confirm(t("discard"))) return;
    const next = await api("/api/skills/requests", payload());
    $("result").value = "";
    prepared = next;
    snapshotCurrent = true;
    clearValidation();
    renderReview();
  }));
  $("convert").addEventListener("click", () => operation(async () => {
    if ($("result").value.trim() && !window.confirm(t("discard"))) return;
    clearValidation();
    const data = await api("/api/skills/convert", {
      request_id: prepared.request.trusted_context.request_id,
      draft_id: selected?.id ?? null, draft_revision: selected?.revision ?? null, name: $("name").value
    });
    $("result").value = JSON.stringify(data.result, null, 2);
    validation = data.validation;
    if (!$("name").value.trim() && data.result.package?.name) $("name").value = data.result.package.name;
    showFindings();
    renderReview();
    if (data.draft) {
      selected = {id: data.draft.id, revision: data.draft.revision};
      original = signature();
      status(t("saved"));
      await refresh();
    }
    if (!validation.valid) status([t("invalid"),
      ...validation.findings.map(item => `${item.code} ${item.path}: ${item.message}`)].join("\n"), true);
  }));
  function showFindings() {
    $("findings").replaceChildren();
    for (const finding of validation?.findings ?? []) {
      $("findings").append(text("p", `${finding.code} ${finding.path}: ${finding.message}`));
    }
  }
  $("validate").addEventListener("click", () => operation(async () => {
    clearValidation();
    validation = await api("/api/skills/validate", {
      request_id: prepared.request.trusted_context.request_id, result_text: $("result").value
    });
    showFindings();
    renderReview();
  }));
  $("save").addEventListener("click", () => operation(async () => {
    const data = await api("/api/skills/drafts", {
      id: selected?.id ?? null, revision: selected?.revision ?? null, name: $("name").value,
      request_id: prepared.request.trusted_context.request_id, result_text: $("result").value
    });
    selected = { id: data.draft.id, revision: data.draft.revision };
    original = signature();
    status(t("saved"));
    await refresh();
  }));
  $("category-options").addEventListener("change", update);
  async function applyDraft(draft, isolated = false) {
    if (!window.MiniMuvSkills.applyAvailable()) throw new Error(t("restart"));
    const published = window.MiniMuvSkills.published(draft.id);
    const result = await api("/api/skills/apply", {
      draft_id: draft.id, revision: draft.revision,
      published_id: published?.id ?? null, published_revision: published?.revision ?? null,
      ...(!isolated ? {categories: window.MiniMuvSkills.installCategories()} : {})
    }, isolated);
    await window.MiniMuvSkills.refresh();
    return result;
  }
  $("install").addEventListener("click", () => {
    if ($("install").disabled || !window.confirm(window.MiniMuvSkills.text("confirm"))) return;
    return operation(async () => {
      const saved = await api("/api/skills/drafts", {
        id: selected?.id ?? null, revision: selected?.revision ?? null, name: $("name").value,
        request_id: prepared.request.trusted_context.request_id, result_text: $("result").value
      });
      selected = {id: saved.draft.id, revision: saved.draft.revision};
      original = signature();
      await applyDraft(selected);
      clearValidation();
      status(t("applied"));
    });
  });
  $("delete").addEventListener("click", () => {
    if (!selected || !window.confirm(t("deleteConfirm"))) return;
    operation(async () => {
      await api(`/api/skills/drafts/${selected.id}/delete`, { revision: selected.revision });
      reset();
      await refresh();
    });
  });
  window.addEventListener("beforeunload", event => {
    if (dirty() || busy) { event.preventDefault(); event.returnValue = ""; }
  });
  document.querySelector("#language").addEventListener("change", translate);
  window.MiniMuvPresetAvailabilityChanged = update;
  original = signature();
  translate();
})();
