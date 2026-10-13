const promptSettingKeys = [
  "title", "intro", "profile", "enhancement", "video", "image", "music", "storyboard",
  "role", "task", "rules", "output", "roleHelp", "taskHelp", "rulesHelp", "outputHelp",
  "inherited", "count", "preview", "previewNote", "contract", "reset", "cancel", "save",
  "saving", "saved", "error", "conflict", "discard", "resetConfirm"
];
const promptSettingTranslations = {
  en: ["Prompt settings", "Edit instructions sent to the local text model, not your story or generation prompt. Saved in system_prompts.json; changes apply to the next request without restarting.", "Purpose", "Shared prompt-editing rules", "Video prompt editing", "Image prompt editing", "Music prompt editing", "Automatic storyboard", "Role", "Task", "Rules and boundaries", "Output format", "Who the model should act as.", "What to do with the user's source.", "What to preserve, avoid or prioritize.", "Keep the JSON field names expected by the app.", "This task appends to the shared prompt-editing rules. Edit the shared rules to change role, boundaries or output for all three modes.", "Keep {shot_count} exactly once; the requested shot count replaces it automatically.", "Full system prompt preview", "Unsaved preview. Storyboard preview uses 8 shots; real requests use the selected count.", "Editing instructions does not change backend JSON validation, field limits or supported durations. Invalid model responses are still rejected.", "Restore this purpose's defaults", "Cancel", "Save prompts", "Saving…", "Saved. New requests now use these prompts.", "Could not load or save prompts", "The file changed elsewhere. Close and reopen to load the latest version; your edits were not saved.", "Discard unsaved prompt changes?", "Replace this purpose's edits with defaults? Save to apply."],
  "zh-CN": ["提示词设置", "编辑发送给本地文本模型的后台指令，不是故事或生成内容。保存到 system_prompts.json；无需重启，下次请求即生效。", "用途分类", "提示词优化 · 共用规则", "视频提示词优化", "图像提示词优化", "音乐提示词优化", "自动分镜", "角色定位", "任务目标", "规则与边界", "输出格式", "模型应扮演什么角色。", "如何处理用户提供的原始内容。", "应保留、避免或优先考虑什么。", "请保留应用需要的 JSON 字段名称。", "此任务会追加在共用规则之后。角色、边界和输出格式请在共用规则中修改，对三种优化模式同时生效。", "保留且仅使用一次 {shot_count}；后台会自动替换为用户指定的分镜数量。", "完整系统提示词预览", "预览包含未保存修改。分镜示例为 8 镜，实际使用用户选择的数量。", "编辑提示词不会改变后台 JSON 校验、字段长度或可用时长；模型返回格式错误时仍会明确拒绝。", "恢复当前用途默认值", "取消", "保存提示词", "正在保存…", "已保存，新的请求将使用这些提示词。", "提示词加载或保存失败", "文件已在其他位置修改。请关闭后重新打开加载最新版本；本次修改尚未保存。", "放弃未保存的提示词修改？", "将当前用途的修改替换为默认值？保存后才会生效。"],
  "zh-TW": ["提示詞設定", "編輯傳送給本機文字模型的後台指令，不是故事或生成內容。儲存到 system_prompts.json；無需重啟，下次請求即生效。", "用途分類", "提示詞優化 · 共用規則", "影片提示詞優化", "圖像提示詞優化", "音樂提示詞優化", "自動分鏡", "角色定位", "任務目標", "規則與邊界", "輸出格式", "模型應扮演什麼角色。", "如何處理使用者提供的原始內容。", "應保留、避免或優先考慮什麼。", "請保留應用需要的 JSON 欄位名稱。", "此任務會附加在共用規則之後。角色、邊界和輸出格式請在共用規則中修改，對三種優化模式同時生效。", "保留且僅使用一次 {shot_count}；後台會替換為指定的分鏡數量。", "完整系統提示詞預覽", "预覽包含未儲存修改。分鏡示例為 8 鏡，實際使用選擇的數量。", "編輯提示詞不會改變後台 JSON 驗證、欄位長度或可用時長；錯誤回應仍會拒絕。", "恢復目前用途預設值", "取消", "儲存提示詞", "正在儲存…", "已儲存，新請求將使用這些提示詞。", "提示詞載入或儲存失敗", "檔案已在其他位置修改。請關閉後重新開啟；本次修改尚未儲存。", "放棄未儲存的提示詞修改？", "以預設值取代目前用途的修改？儲存後才生效。"],
  fr: ["Réglages des prompts", "Modifiez les instructions du modèle de texte local, pas votre récit. Enregistrées dans system_prompts.json et appliquées à la prochaine requête sans redémarrage.", "Usage", "Règles communes d’optimisation", "Optimisation vidéo", "Optimisation image", "Optimisation musicale", "Découpage automatique", "Rôle", "Objectif", "Règles et limites", "Format de sortie", "Le rôle du modèle.", "Comment traiter le texte source.", "Ce qu’il faut préserver, éviter ou privilégier.", "Conservez les noms des champs JSON attendus.", "Cette tâche suit les règles communes. Modifiez celles-ci pour changer le rôle, les limites et le format des trois modes.", "Gardez {shot_count} une seule fois ; il sera remplacé par le nombre de plans demandé.", "Aperçu du prompt complet", "Aperçu non enregistré. Exemple de 8 plans ; la requête utilise le nombre choisi.", "Les contrôles JSON, les limites et les durées restent inchangés. Les réponses invalides sont rejetées.", "Rétablir les valeurs par défaut de cet usage", "Annuler", "Enregistrer", "Enregistrement…", "Enregistré. Les prochaines requêtes utiliseront ces prompts.", "Chargement ou enregistrement impossible", "Le fichier a changé ailleurs. Fermez et rouvrez pour le recharger ; vos modifications ne sont pas enregistrées.", "Abandonner les modifications non enregistrées ?", "Remplacer les modifications de cet usage par les valeurs par défaut ? Enregistrez pour appliquer."],
  de: ["Prompt-Einstellungen", "Bearbeiten Sie Anweisungen für das lokale Textmodell, nicht Ihre Geschichte. Speicherung in system_prompts.json; ab der nächsten Anfrage ohne Neustart wirksam.", "Verwendung", "Gemeinsame Optimierungsregeln", "Video-Prompt optimieren", "Bild-Prompt optimieren", "Musik-Prompt optimieren", "Automatisches Storyboard", "Rolle", "Aufgabe", "Regeln und Grenzen", "Ausgabeformat", "Welche Rolle das Modell übernimmt.", "Wie der Ausgangstext verarbeitet wird.", "Was erhalten, vermieden oder priorisiert wird.", "Die erwarteten JSON-Feldnamen beibehalten.", "Diese Aufgabe folgt den gemeinsamen Regeln. Dort ändern Sie Rolle, Grenzen und Ausgabe für alle drei Modi.", "{shot_count} genau einmal beibehalten; es wird durch die gewünschte Szenenzahl ersetzt.", "Vorschau des gesamten System-Prompts", "Ungespeicherte Vorschau mit 8 Szenen; Anfragen verwenden die gewählte Anzahl.", "JSON-Prüfung, Feldgrenzen und erlaubte Dauer bleiben unverändert. Ungültige Antworten werden abgewiesen.", "Standardwerte dieser Verwendung", "Abbrechen", "Prompts speichern", "Wird gespeichert…", "Gespeichert. Neue Anfragen verwenden diese Prompts.", "Prompts konnten nicht geladen oder gespeichert werden", "Die Datei wurde anderweitig geändert. Schließen und erneut öffnen; Ihre Änderungen wurden nicht gespeichert.", "Ungespeicherte Änderungen verwerfen?", "Änderungen dieser Verwendung durch Standardwerte ersetzen? Zum Anwenden speichern."],
  ja: ["プロンプト設定", "ローカルテキストモデルへの指示を編集します。物語や生成内容ではありません。system_prompts.json に保存され、再起動せず次のリクエストから適用されます。", "用途", "プロンプト最適化の共通ルール", "動画プロンプト最適化", "画像プロンプト最適化", "音楽プロンプト最適化", "自動絵コンテ", "役割", "タスク", "ルールと制約", "出力形式", "モデルの役割を指定します。", "原文の処理方法を指定します。", "維持・回避・優先する事項。", "必要な JSON フィールド名を維持してください。", "このタスクは共通ルールの後に追加されます。役割・制約・出力は共通ルールで変更すると3モードに適用されます。", "{shot_count} を1回だけ残してください。指定したショット数に置換されます。", "完全なシステムプロンプトのプレビュー", "未保存のプレビューです。例は8ショット、実際は選択した数です。", "JSON 検証・文字数制限・対応時間は変わりません。不正な応答は拒否されます。", "この用途を初期値に戻す", "キャンセル", "保存", "保存中…", "保存しました。新しいリクエストから適用されます。", "読み込みまたは保存に失敗しました", "ファイルが別の場所で変更されました。閉じて開き直してください。変更は未保存です。", "未保存の変更を破棄しますか？", "この用途を初期値に戻しますか？保存すると適用されます。"],
  ko: ["프롬프트 설정", "이야기나 생성 내용이 아닌 로컬 텍스트 모델의 지침을 편집합니다. system_prompts.json에 저장되며 재시작 없이 다음 요청부터 적용됩니다.", "용도", "프롬프트 최적화 공통 규칙", "동영상 프롬프트 최적화", "이미지 프롬프트 최적화", "음악 프롬프트 최적화", "자동 스토리보드", "역할", "작업 목표", "규칙과 제한", "출력 형식", "모델이 맡을 역할입니다.", "원본 내용을 처리하는 방법입니다.", "유지·회피·우선할 사항입니다.", "앱에서 요구하는 JSON 필드 이름을 유지하세요.", "이 작업은 공통 규칙 뒤에 추가됩니다. 공통 규칙의 역할·제한·출력 변경은 세 모드에 적용됩니다.", "{shot_count}를 정확히 한 번 유지하세요. 선택한 장면 수로 대체됩니다.", "전체 시스템 프롬프트 미리보기", "저장 전 미리보기입니다. 예시는 8장면, 실제 요청은 선택한 수를 사용합니다.", "JSON 검증, 필드 제한, 지원 길이는 변경되지 않습니다. 잘못된 응답은 거부됩니다.", "현재 용도의 기본값 복원", "취소", "프롬프트 저장", "저장 중…", "저장되었습니다. 새 요청부터 적용됩니다.", "프롬프트 로드 또는 저장 실패", "다른 곳에서 파일이 변경되었습니다. 닫고 다시 여세요. 변경 사항은 저장되지 않았습니다.", "저장하지 않은 변경을 버릴까요?", "현재 용도의 변경을 기본값으로 바꿀까요? 저장해야 적용됩니다."],
  es: ["Ajustes de prompts", "Edita las instrucciones del modelo de texto local, no tu historia. Se guardan en system_prompts.json y se aplican a la siguiente solicitud sin reiniciar.", "Uso", "Reglas comunes de optimización", "Optimización de vídeo", "Optimización de imagen", "Optimización de música", "Guion gráfico automático", "Rol", "Tarea", "Reglas y límites", "Formato de salida", "El papel que debe asumir el modelo.", "Cómo procesar el texto original.", "Qué conservar, evitar o priorizar.", "Conserva los nombres de campos JSON esperados.", "Esta tarea se añade a las reglas comunes. Cambia allí el rol, los límites y la salida para los tres modos.", "Mantén {shot_count} exactamente una vez; se sustituirá por el número de planos solicitado.", "Vista previa del prompt completo", "Vista sin guardar con 8 planos de ejemplo; se usará la cantidad seleccionada.", "La validación JSON, los límites y las duraciones no cambian. Se rechazan respuestas inválidas.", "Restaurar valores de este uso", "Cancelar", "Guardar prompts", "Guardando…", "Guardado. Las nuevas solicitudes usan estos prompts.", "No se pudieron cargar o guardar los prompts", "El archivo cambió en otro lugar. Cierra y vuelve a abrir; los cambios no se guardaron.", "¿Descartar cambios sin guardar?", "¿Reemplazar este uso por los valores predeterminados? Guarda para aplicar."],
  pt: ["Configurações de prompts", "Edite as instruções do modelo de texto local, não sua história. Salvas em system_prompts.json e aplicadas à próxima solicitação sem reiniciar.", "Uso", "Regras comuns de otimização", "Otimização de vídeo", "Otimização de imagem", "Otimização de música", "Storyboard automático", "Papel", "Tarefa", "Regras e limites", "Formato de saída", "O papel do modelo.", "Como processar o texto original.", "O que preservar, evitar ou priorizar.", "Mantenha os nomes dos campos JSON esperados.", "Esta tarefa é adicionada às regras comuns. Altere nelas o papel, os limites e a saída dos três modos.", "Mantenha {shot_count} exatamente uma vez; será substituído pelo número de cenas solicitado.", "Prévia do prompt completo", "Prévia não salva com 8 cenas de exemplo; será usada a quantidade selecionada.", "A validação JSON, os limites e as durações não mudam. Respostas inválidas são rejeitadas.", "Restaurar padrões deste uso", "Cancelar", "Salvar prompts", "Salvando…", "Salvo. Novas solicitações usam estes prompts.", "Não foi possível carregar ou salvar os prompts", "O arquivo mudou em outro lugar. Feche e reabra; as alterações não foram salvas.", "Descartar alterações não salvas?", "Substituir este uso pelos padrões? Salve para aplicar."],
  tr: ["İstem ayarları", "Hikâyenizi değil, yerel metin modeli talimatlarını düzenleyin. system_prompts.json dosyasına kaydedilir; yeniden başlatmadan sonraki isteğe uygulanır.", "Amaç", "Ortak iyileştirme kuralları", "Video istemi iyileştirme", "Görsel istemi iyileştirme", "Müzik istemi iyileştirme", "Otomatik sahne planı", "Rol", "Görev", "Kurallar ve sınırlar", "Çıktı biçimi", "Modelin üstleneceği rol.", "Kaynak metnin nasıl işleneceği.", "Korunacak, kaçınılacak veya öncelikli konular.", "Beklenen JSON alan adlarını koruyun.", "Bu görev ortak kurallara eklenir. Üç modun rolünü, sınırlarını ve çıktısını ortak kurallardan değiştirin.", "{shot_count} tam bir kez bulunmalıdır; istenen sahne sayısıyla değiştirilir.", "Tam sistem istemi önizlemesi", "Kaydedilmemiş önizleme 8 sahne kullanır; gerçek istek seçilen sayıyı kullanır.", "JSON doğrulaması, alan sınırları ve süreler değişmez. Geçersiz yanıtlar reddedilir.", "Bu amacın varsayılanlarını geri yükle", "İptal", "İstemleri kaydet", "Kaydediliyor…", "Kaydedildi. Yeni istekler bu istemleri kullanır.", "İstemler yüklenemedi veya kaydedilemedi", "Dosya başka yerde değişti. Kapatıp yeniden açın; değişiklikleriniz kaydedilmedi.", "Kaydedilmemiş değişiklikler atılsın mı?", "Bu amacın değişiklikleri varsayılanlarla değiştirilsin mi? Uygulamak için kaydedin."],
  ar: ["إعدادات التعليمات", "عدّل تعليمات نموذج النص المحلي، وليس قصتك. تُحفظ في system_prompts.json وتُطبق على الطلب التالي دون إعادة تشغيل.", "الغرض", "قواعد تحسين مشتركة", "تحسين تعليمات الفيديو", "تحسين تعليمات الصورة", "تحسين تعليمات الموسيقى", "تقسيم المشاهد تلقائياً", "الدور", "المهمة", "القواعد والحدود", "تنسيق المخرجات", "الدور الذي يؤديه النموذج.", "كيفية معالجة النص الأصلي.", "ما يجب الحفاظ عليه أو تجنبه أو إعطاؤه الأولوية.", "حافظ على أسماء حقول JSON المطلوبة.", "تُضاف هذه المهمة إلى القواعد المشتركة. عدّل الدور والحدود والمخرجات للأنماط الثلاثة في القواعد المشتركة.", "احتفظ بـ {shot_count} مرة واحدة فقط؛ يُستبدل بعدد المشاهد المطلوب.", "معاينة التعليمات الكاملة", "معاينة غير محفوظة بمثال من 8 مشاهد؛ يستخدم الطلب العدد المحدد.", "لا تتغير قواعد JSON أو حدود الحقول أو المدد المدعومة. تُرفض الردود غير الصالحة.", "استعادة القيم الافتراضية لهذا الغرض", "إلغاء", "حفظ التعليمات", "جارٍ الحفظ…", "تم الحفظ. تستخدم الطلبات الجديدة هذه التعليمات.", "تعذّر تحميل التعليمات أو حفظها", "تغيّر الملف في مكان آخر. أغلق وأعد فتحه؛ لم تُحفظ تعديلاتك.", "تجاهل التعديلات غير المحفوظة؟", "استبدال تعديلات هذا الغرض بالقيم الافتراضية؟ احفظ لتطبيقها."],
  vi: ["Cài đặt lời nhắc", "Chỉnh sửa chỉ dẫn cho mô hình văn bản cục bộ, không phải câu chuyện. Lưu trong system_prompts.json và áp dụng cho yêu cầu tiếp theo, không cần khởi động lại.", "Mục đích", "Quy tắc tối ưu chung", "Tối ưu lời nhắc video", "Tối ưu lời nhắc ảnh", "Tối ưu lời nhắc nhạc", "Phân cảnh tự động", "Vai trò", "Nhiệm vụ", "Quy tắc và giới hạn", "Định dạng đầu ra", "Vai trò của mô hình.", "Cách xử lý nội dung gốc.", "Điều cần giữ, tránh hoặc ưu tiên.", "Giữ nguyên tên trường JSON yêu cầu.", "Nhiệm vụ này được thêm sau quy tắc chung. Sửa vai trò, giới hạn và đầu ra chung cho cả ba chế độ.", "Giữ {shot_count} đúng một lần; sẽ thay bằng số cảnh yêu cầu.", "Xem trước toàn bộ lời nhắc", "Bản xem trước chưa lưu với ví dụ 8 cảnh; yêu cầu thật dùng số đã chọn.", "Không thay đổi kiểm tra JSON, giới hạn trường hay thời lượng hỗ trợ. Phản hồi sai vẫn bị từ chối.", "Khôi phục mặc định mục đích này", "Hủy", "Lưu lời nhắc", "Đang lưu…", "Đã lưu. Yêu cầu mới dùng các lời nhắc này.", "Không thể tải hoặc lưu lời nhắc", "Tệp đã thay đổi ở nơi khác. Đóng và mở lại; thay đổi chưa được lưu.", "Bỏ thay đổi chưa lưu?", "Thay đổi mục đích này về mặc định? Lưu để áp dụng."],
  id: ["Pengaturan prompt", "Edit instruksi model teks lokal, bukan cerita Anda. Disimpan di system_prompts.json dan berlaku pada permintaan berikutnya tanpa memulai ulang.", "Tujuan", "Aturan optimasi bersama", "Optimasi prompt video", "Optimasi prompt gambar", "Optimasi prompt musik", "Storyboard otomatis", "Peran", "Tugas", "Aturan dan batasan", "Format keluaran", "Peran yang dijalankan model.", "Cara memproses teks sumber.", "Hal yang dipertahankan, dihindari atau diprioritaskan.", "Pertahankan nama kolom JSON yang diperlukan.", "Tugas ini ditambahkan setelah aturan bersama. Edit peran, batasan dan keluaran bersama untuk ketiga mode.", "Pertahankan {shot_count} tepat sekali; diganti dengan jumlah adegan yang diminta.", "Pratinjau prompt lengkap", "Pratinjau belum disimpan dengan contoh 8 adegan; permintaan memakai jumlah pilihan.", "Validasi JSON, batas kolom dan durasi tidak berubah. Respons tidak valid tetap ditolak.", "Pulihkan default tujuan ini", "Batal", "Simpan prompt", "Menyimpan…", "Tersimpan. Permintaan baru memakai prompt ini.", "Tidak dapat memuat atau menyimpan prompt", "Berkas berubah di tempat lain. Tutup dan buka kembali; perubahan belum disimpan.", "Buang perubahan yang belum disimpan?", "Ganti perubahan tujuan ini dengan default? Simpan untuk menerapkan."],
  ru: ["Настройки промптов", "Редактируйте инструкции локальной текстовой модели, а не сюжет. Сохраняются в system_prompts.json и применяются к следующему запросу без перезапуска.", "Назначение", "Общие правила оптимизации", "Оптимизация видео", "Оптимизация изображений", "Оптимизация музыки", "Автоматическая раскадровка", "Роль", "Задача", "Правила и ограничения", "Формат ответа", "Роль, которую выполняет модель.", "Как обрабатывать исходный текст.", "Что сохранять, избегать или приоритизировать.", "Сохраните ожидаемые имена полей JSON.", "Эта задача добавляется к общим правилам. Роль, ограничения и формат трёх режимов меняются в общих правилах.", "Оставьте {shot_count} ровно один раз; он заменится запрошенным числом кадров.", "Просмотр полного системного промпта", "Несохранённый пример с 8 кадрами; запрос использует выбранное число.", "Проверка JSON, ограничения полей и длительности не меняются. Некорректные ответы отклоняются.", "Восстановить значения для этого назначения", "Отмена", "Сохранить", "Сохранение…", "Сохранено. Новые запросы используют эти промпты.", "Не удалось загрузить или сохранить промпты", "Файл изменён в другом месте. Закройте и откройте снова; ваши изменения не сохранены.", "Отменить несохранённые изменения?", "Заменить изменения этого назначения значениями по умолчанию? Сохраните для применения."]
};

const promptTaskKeys = ["mv", "storyboard", "mv_storyboard", "skill_conversion", "inherited", "previewNote"];
const promptTaskTranslations = {
  en: ["MV visual prompt optimization", "Long-video story storyboard", "Music MV visual storyboard", "Skill knowledge conversion", "Appended to the shared optimization rules. Shared rules apply to video, MV, image and music.", "Configured instructions preview (8 sample shots). Runtime timing, reference IDs and selected Skills are appended by the host; the Skill conversion contract and Schema are fixed."],
  "zh-CN": ["MV 画面提示词优化", "长视频故事分镜", "音乐 MV 画面分镜", "Skill 知识转换", "追加到共用优化规则后；共用规则适用于视频、MV、图像和音乐四类优化。", "预览当前配置（示例为 8 镜）。宿主另外追加实际时序、参考身份和所选 Skill；Skill 转换合同与 Schema 固定不可编辑。"],
  "zh-TW": ["MV 畫面提示詞最佳化", "長影片故事分鏡", "音樂 MV 畫面分鏡", "Skill 知識轉換", "附加至共用最佳化規則；共用規則適用於影片、MV、圖像和音樂四類。", "預覽目前設定（範例為 8 鏡）。宿主另加實際時序、參考身分及所選 Skill；Skill 轉換合約與 Schema 固定不可編輯。"],
  fr: ["Optimisation visuelle MV", "Storyboard narratif longue vidéo", "Storyboard visuel MV musical", "Conversion des connaissances Skill", "Ajout aux règles communes de vidéo, MV, image et musique.", "Aperçu configuré (8 plans). L’hôte ajoute les durées, références et Skills choisis. Le contrat et le Schema de conversion Skill sont fixes."],
  de: ["MV-Bildprompt optimieren", "Storyboard für lange Videos", "Visuelles Musik-MV-Storyboard", "Skill-Wissen konvertieren", "Ergänzt die gemeinsamen Regeln für Video, MV, Bild und Musik.", "Konfigurierte Vorschau (8 Szenen). Laufzeit, Referenzen und gewählte Skills ergänzt der Host. Skill-Vertrag und Schema sind fest."],
  ja: ["MV映像プロンプト最適化", "長編動画の物語絵コンテ", "音楽MV映像絵コンテ", "Skill知識変換", "動画・MV・画像・音楽の共通最適化ルールに追加されます。", "設定のプレビュー（8カットの例）。実際の時間・参照ID・選択Skillはホストが追加します。Skill変換契約とSchemaは固定です。"],
  ko: ["MV 시각 프롬프트 최적화", "장편 영상 이야기 스토리보드", "음악 MV 시각 스토리보드", "Skill 지식 변환", "영상·MV·이미지·음악의 공통 최적화 규칙 뒤에 추가됩니다.", "설정 미리보기(8장면). 실제 시간·참조 ID·선택 Skill은 호스트가 추가합니다. Skill 변환 계약과 Schema는 고정입니다."],
  es: ["Optimización visual MV", "Storyboard narrativo de vídeo largo", "Storyboard visual de MV musical", "Conversión de conocimientos Skill", "Se añade a las reglas comunes de vídeo, MV, imagen y música.", "Vista de configuración (8 planos). El anfitrión añade tiempos, referencias y Skills elegidos. El contrato y Schema de conversión Skill son fijos."],
  pt: ["Otimização visual MV", "Storyboard narrativo de vídeo longo", "Storyboard visual de MV musical", "Conversão de conhecimento Skill", "Acrescentado às regras comuns de vídeo, MV, imagem e música.", "Prévia configurada (8 cenas). O host acrescenta tempos, referências e Skills escolhidos. O contrato e Schema de conversão Skill são fixos."],
  tr: ["MV görsel istem optimizasyonu", "Uzun video hikâye planı", "Müzik MV görsel sahne planı", "Skill bilgi dönüşümü", "Video, MV, görsel ve müzik ortak kurallarına eklenir.", "Yapılandırma önizlemesi (8 sahne). Süreleri, referansları ve seçili Skills’i sunucu ekler. Skill dönüşüm sözleşmesi ve Schema sabittir."],
  ar: ["تحسين التعليمات المرئية لـ MV", "مشاهد قصة فيديو طويل", "مشاهد مرئية لـ MV موسيقي", "تحويل معرفة Skill", "تُضاف إلى القواعد المشتركة للفيديو وMV والصور والموسيقى.", "معاينة الإعدادات (8 مشاهد). يضيف المضيف التوقيت والمراجع وSkills المختارة. عقد تحويل Skill وSchema ثابتان."],
  vi: ["Tối ưu lời nhắc hình ảnh MV", "Phân cảnh truyện video dài", "Phân cảnh hình ảnh MV âm nhạc", "Chuyển đổi kiến thức Skill", "Thêm vào quy tắc chung cho video, MV, ảnh và nhạc.", "Xem trước cấu hình (8 cảnh). Máy chủ thêm thời gian, tham chiếu và Skill đã chọn. Hợp đồng và Schema chuyển đổi Skill là cố định."],
  id: ["Optimasi prompt visual MV", "Storyboard cerita video panjang", "Storyboard visual MV musik", "Konversi pengetahuan Skill", "Ditambahkan ke aturan bersama untuk video, MV, gambar dan musik.", "Pratinjau konfigurasi (8 adegan). Host menambahkan waktu, referensi dan Skill pilihan. Kontrak dan Schema konversi Skill tetap."],
  ru: ["Оптимизация визуального промпта MV", "Сюжетная раскадровка длинного видео", "Визуальная раскадровка музыкального MV", "Преобразование знаний Skill", "Дополняет общие правила для видео, MV, изображений и музыки.", "Предпросмотр настроек (8 кадров). Хост добавляет время, ссылки и выбранные Skills. Контракт и Schema преобразования Skill фиксированы."]
};

const promptAssistantKeys = ["assistant", "assistantNote", "assistantOutputHelp"];
const promptAssistantTranslations = {
  en: ["AI assistant", "The UI response language is appended automatically and shown in the preview. Write actions still require confirmation.", "How the assistant should explain plans, results and errors; JSON is not required."],
  "zh-CN": ["AI 助手", "自动追加当前界面的回复语言，预览中可查看。写操作仍需用户确认。", "助手如何说明计划、结果和错误；无需限定为 JSON。"],
  "zh-TW": ["AI 助理", "自動附加目前介面的回覆語言，可在預覽中查看。寫入操作仍需使用者確認。", "助理如何說明計畫、結果及錯誤；無需限定為 JSON。"],
  fr: ["Assistant IA", "La langue de réponse de l’interface est ajoutée à l’aperçu. Les écritures nécessitent toujours une confirmation.", "Comment expliquer les plans, résultats et erreurs ; JSON non obligatoire."],
  de: ["KI-Assistent", "Die Antwortsprache der Oberfläche wird in der Vorschau ergänzt. Schreibaktionen erfordern weiterhin Bestätigung.", "Erläuterung von Plänen, Ergebnissen und Fehlern; JSON ist nicht erforderlich."],
  ja: ["AIアシスタント", "画面の言語を応答言語として自動追加し、プレビューに表示します。書き込みには引き続き確認が必要です。", "計画・結果・エラーの説明方法。JSON形式は不要です。"],
  ko: ["AI 도우미", "화면의 응답 언어가 자동 추가되어 미리보기에 표시됩니다. 쓰기 작업은 여전히 확인이 필요합니다.", "계획·결과·오류 설명 방식. JSON 형식은 필수가 아닙니다."],
  es: ["Asistente IA", "El idioma de respuesta de la interfaz se añade a la vista previa. Las escrituras siguen requiriendo confirmación.", "Cómo explicar planes, resultados y errores; JSON no es obligatorio."],
  pt: ["Assistente IA", "O idioma de resposta da interface é acrescentado à prévia. Escritas ainda exigem confirmação.", "Como explicar planos, resultados e erros; JSON não é obrigatório."],
  tr: ["AI asistanı", "Arayüzün yanıt dili otomatik eklenir ve önizlemede gösterilir. Yazma işlemleri hâlâ onay gerektirir.", "Plan, sonuç ve hataların açıklanması; JSON zorunlu değildir."],
  ar: ["مساعد الذكاء الاصطناعي", "تُضاف لغة الرد المحددة في الواجهة تلقائيًا وتظهر في المعاينة. لا تزال عمليات الكتابة تتطلب التأكيد.", "كيفية شرح الخطط والنتائج والأخطاء؛ لا يلزم تنسيق JSON."],
  vi: ["Trợ lý AI", "Ngôn ngữ trả lời của giao diện được thêm vào bản xem trước. Thao tác ghi vẫn cần xác nhận.", "Cách giải thích kế hoạch, kết quả và lỗi; không bắt buộc JSON."],
  id: ["Asisten AI", "Bahasa respons antarmuka otomatis ditambahkan ke pratinjau. Tindakan penulisan tetap memerlukan konfirmasi.", "Cara menjelaskan rencana, hasil dan kesalahan; JSON tidak wajib."],
  ru: ["ИИ-ассистент", "Язык ответа интерфейса добавляется в предпросмотр. Операции записи по-прежнему требуют подтверждения.", "Как объяснять планы, результаты и ошибки; JSON не обязателен."]
};

function promptSettingText(key) {
  const language = document.querySelector("#language").value;
  if (promptAssistantKeys.includes(key)) {
    return (promptAssistantTranslations[language] || promptAssistantTranslations.en)[promptAssistantKeys.indexOf(key)];
  }
  if (promptTaskKeys.includes(key)) {
    return (promptTaskTranslations[language] || promptTaskTranslations.en)[promptTaskKeys.indexOf(key)];
  }
  const values = promptSettingTranslations[language] || promptSettingTranslations.en;
  return values[promptSettingKeys.indexOf(key)];
}

function compilePromptPreview(config, profile, context = {}, locale = "en") {
  const profiles = config.profiles;
  if (["video", "mv", "image", "music"].includes(profile)) {
    return [...Object.values(profiles.enhancement), profiles[profile].task].join(" ");
  }
  const instructions = Object.values(profiles[profile]).join(" ").replace("{shot_count}", "8");
  const fixed = context[profile];
  if (profile === "assistant") {
    return instructions + (fixed?.language_suffixes?.[locale] || "");
  }
  return fixed ? fixed.prefix + instructions + fixed.suffix : instructions;
}

(() => {
  const dialog = document.querySelector("#prompts-dialog");
  const controls = document.querySelector("#prompts-controls");
  const select = document.querySelector("#prompts-profile");
  const fields = document.querySelector("#prompts-fields");
  const status = document.querySelector("#prompts-status");
  let draft = null;
  let defaults = null;
  let previewContext = {};
  let revision = "";
  let original = "";
  let saving = false;
  let loaded = false;
  let loadGeneration = 0;

  function showStatus(text, error = false) {
    status.textContent = text;
    status.hidden = !text;
    status.classList.toggle("error", error);
  }

  function translate() {
    document.querySelectorAll("[data-prompt-i18n]").forEach(node => {
      node.textContent = promptSettingText(node.dataset.promptI18n);
    });
    document.querySelector("#prompts-close").setAttribute("aria-label", promptSettingText("cancel"));
    updateNote();
    preview();
  }

  function updateNote() {
    document.querySelector("#prompts-profile-note").textContent = ["storyboard", "mv_storyboard"].includes(select.value)
      ? promptSettingText("count") : ["video", "mv", "image", "music"].includes(select.value)
        ? promptSettingText("inherited") : select.value === "assistant" ? promptSettingText("assistantNote") : "";
  }

  function preview() {
    document.querySelector("#prompts-preview").textContent = draft
      ? compilePromptPreview(draft, select.value, previewContext, document.querySelector("#language").value) : "";
  }

  function renderFields() {
    fields.replaceChildren();
    for (const [key, value] of Object.entries(draft.profiles[select.value])) {
      const label = document.createElement("label");
      label.htmlFor = `prompt-field-${key}`;
      label.dataset.promptI18n = key;
      const note = document.createElement("p");
      note.id = `prompt-help-${key}`;
      note.className = "settings-field-note";
      note.dataset.promptI18n = select.value === "assistant" && key === "output"
        ? "assistantOutputHelp" : `${key}Help`;
      const input = document.createElement("textarea");
      input.id = label.htmlFor;
      input.value = value;
      input.required = true;
      input.maxLength = 6000;
      input.rows = key === "role" ? 2 : 5;
      input.setAttribute("aria-describedby", note.id);
      input.addEventListener("input", () => {
        draft.profiles[select.value][key] = input.value;
        showStatus("");
        preview();
      });
      fields.append(label, note, input);
    }
    translate();
    preview();
  }

  function dirty() {
    return loaded && JSON.stringify(draft) !== original;
  }

  function close() {
    if (!saving && (!dirty() || window.confirm(promptSettingText("discard")))) {
      loadGeneration += 1;
      dialog.close();
    }
  }

  async function open() {
    const generation = ++loadGeneration;
    loaded = false;
    draft = null;
    fields.replaceChildren();
    document.querySelector("#prompts-preview").textContent = "";
    controls.disabled = true;
    showStatus("");
    dialog.showModal();
    try {
      const response = await fetch("/api/system-prompts", { cache: "no-store" });
      const data = await response.json();
      if (generation !== loadGeneration || !dialog.open) return;
      if (!response.ok) throw new Error(data.detail || data.error);
      draft = structuredClone(data.config);
      defaults = data.defaults;
      previewContext = data.preview_context || {};
      revision = data.revision;
      original = JSON.stringify(draft);
      select.replaceChildren(...Object.keys(draft.profiles).map(key => {
        const option = new Option(promptSettingText(key), key);
        option.dataset.promptI18n = key;
        return option;
      }));
      renderFields();
      loaded = true;
      controls.disabled = false;
    } catch (error) {
      if (generation === loadGeneration && dialog.open) {
        showStatus(`${promptSettingText("error")}: ${error.message}`, true);
      }
    }
  }

  select.addEventListener("change", renderFields);
  document.querySelector("#prompts-reset").addEventListener("click", () => {
    if (window.confirm(promptSettingText("resetConfirm"))) {
      draft.profiles[select.value] = structuredClone(defaults.profiles[select.value]);
      renderFields();
      showStatus("");
    }
  });
  document.querySelector("#prompts-form").addEventListener("submit", async event => {
    event.preventDefault();
    if (!loaded || saving) return;
    saving = true;
    controls.disabled = true;
    showStatus(promptSettingText("saving"));
    try {
      const response = await fetch("/api/system-prompts", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: draft, revision })
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) throw new Error(promptSettingText("conflict"));
        if (data.error === "storyboard_task_requires_shot_count" ||
            data.error === "shot_count_only_in_storyboard_task") {
          throw new Error(promptSettingText("count"));
        }
        throw new Error(data.detail || data.error);
      }
      draft = structuredClone(data.config);
      defaults = data.defaults;
      revision = data.revision;
      original = JSON.stringify(draft);
      renderFields();
      showStatus(promptSettingText("saved"));
    } catch (error) {
      showStatus(`${promptSettingText("error")}: ${error.message}`, true);
    } finally {
      saving = false;
      controls.disabled = false;
    }
  });
  document.querySelector("#prompts-open").addEventListener("click", open);
  document.querySelector("#prompts-close").addEventListener("click", close);
  document.querySelector("#prompts-cancel").addEventListener("click", close);
  dialog.addEventListener("cancel", event => { event.preventDefault(); close(); });
  document.querySelector("#language").addEventListener("change", translate);
  translate();
})();
