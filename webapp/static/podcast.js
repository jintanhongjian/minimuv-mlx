(() => {
  "use strict";
  const keys = ["title", "note", "new", "refresh", "projects", "name", "voices", "voiceHint",
    "addVoice", "script", "addSegment", "parameters", "speed", "temperature", "save", "generate",
    "assemble", "cancel", "download", "logs", "voiceName", "referenceText", "consent", "upload",
    "remove", "character", "purpose", "text", "gap", "import", "up", "down", "restart", "ready",
    "unavailable", "unsaved", "saved", "error", "discard", "importHint", "referenceReady",
    "queued", "running", "completed", "failed", "cancelled", "pending", "previewError",
    "modelLabel", "voiceDescription"];
  const messages = {
    en: ["Podcast", "Local Fish Audio spoken narration, not singing. Each subtitle covers one segment using its actual audio duration. Split sentences for finer timing.", "New project", "Refresh", "Saved projects", "Project name", "Characters & voices", "Authorized WAV only: up to 60 seconds / 100 MiB. Supply its accurate transcript. References remain local.", "Add character", "Script & audio order", "Add segment", "Speech parameters", "Speed", "Temperature", "Save project", "Generate speech", "Assemble audio", "Cancel", "Download WAV", "Logs", "Character name", "Reference transcript", "I own this voice or have permission to clone it", "Upload reference WAV", "Remove", "Character", "Purpose", "Spoken text", "Silence after (s)", "Import WAV", "Move up", "Move down", "New backend required. Restart after the current generation ends.", "Fish Audio is ready", "Fish model or runtime unavailable; existing audio can still be assembled.", "Unsaved", "Saved", "Operation failed", "Discard unsaved edits?", "Imported WAV does not require a voice. Text is optional and user supplied; blank text creates no subtitle.", "Reference saved", "Queued", "Generating", "Completed", "Failed", "Cancelled", "Pending", "Audio preview failed"],
    "zh-CN": ["播客制作", "本地 Fish Audio 生成口播，不是歌唱。字幕按每段实际音频时长标记；拆成短句可获得更细时间边界。", "新建项目", "刷新", "已保存项目", "项目名称", "人物与声音", "仅上传有权使用的 WAV，最长60秒／100MiB，并填写准确转写。参考音频仅保存在本机。", "添加人物", "台词与音频顺序", "添加语音段", "语音参数", "语速", "采样温度", "保存项目", "生成语音", "合成音频", "取消", "下载 WAV", "运行日志", "人物名称", "参考音频转写", "我拥有此声音或已获得克隆授权", "上传参考 WAV", "移除", "人物", "用途", "口播台词", "段后静音（秒）", "导入 WAV", "上移", "下移", "需要新版后端，请等待当前生成结束后重启服务。", "Fish Audio 已就绪", "Fish 模型或环境未就绪，仍可合成已有音频。", "未保存", "已保存", "操作失败", "放弃未保存的编辑？", "导入 WAV 不需要人物声音；字幕文本可选，须自行填写，留空不生成字幕。", "参考音频已保存", "排队中", "生成中", "已完成", "失败", "已取消", "待生成", "音频预览失败"],
    "zh-TW": ["播客製作", "本機 Fish Audio 生成口播，不是歌唱。字幕按每段實際音訊時長標記；拆成短句可取得更細時間邊界。", "新增專案", "重新整理", "已儲存專案", "專案名稱", "人物與聲音", "僅上傳有權使用的 WAV，最長60秒／100MiB，並填寫準確轉寫。參考音訊僅儲存在本機。", "新增人物", "台詞與音訊順序", "新增語音段", "語音參數", "語速", "取樣溫度", "儲存專案", "生成語音", "合成音訊", "取消", "下載 WAV", "執行記錄", "人物名稱", "參考音訊轉寫", "我擁有此聲音或已獲得複製授權", "上傳參考 WAV", "移除", "人物", "用途", "口播台詞", "段後靜音（秒）", "匯入 WAV", "上移", "下移", "需要新版後端，請等待目前生成結束後重新啟動服務。", "Fish Audio 已就緒", "Fish 模型或環境未就緒，仍可合成既有音訊。", "未儲存", "已儲存", "操作失敗", "捨棄未儲存的編輯？", "匯入 WAV 不需要人物聲音；字幕可選，須自行填寫，留空不生成字幕。", "參考音訊已儲存", "排隊中", "生成中", "已完成", "失敗", "已取消", "待生成", "音訊預覽失敗"],
    fr: ["Podcast", "Narration locale Fish Audio, pas de chant. Sous-titres par segment selon la durée réelle. Utilisez des phrases courtes pour affiner le minutage.", "Nouveau projet", "Actualiser", "Projets enregistrés", "Nom du projet", "Personnages et voix", "WAV autorisé uniquement : 60 s / 100 Mio maximum, avec transcription exacte. Références locales.", "Ajouter un personnage", "Script et ordre audio", "Ajouter un segment", "Paramètres vocaux", "Vitesse", "Température", "Enregistrer", "Générer la voix", "Assembler l’audio", "Annuler", "Télécharger WAV", "Journal", "Nom du personnage", "Transcription de référence", "Je possède cette voix ou ai l’autorisation de la cloner", "Importer la référence WAV", "Retirer", "Personnage", "Usage", "Texte parlé", "Silence après (s)", "Importer WAV", "Monter", "Descendre", "Nouveau serveur requis. Redémarrez après la génération en cours.", "Fish Audio prêt", "Modèle ou environnement Fish indisponible ; assemblage audio possible.", "Non enregistré", "Enregistré", "Échec", "Abandonner les modifications ?", "Le WAV importé ne nécessite pas de voix. Texte facultatif fourni par vous ; sans texte, pas de sous-titre.", "Référence enregistrée", "En attente", "Génération", "Terminé", "Échec", "Annulé", "À générer", "Échec de lecture audio"],
    de: ["Podcast", "Lokale Fish-Audio-Sprache, kein Gesang. Untertitel je Segment nach echter Audiodauer. Kurze Sätze erlauben feinere Zeitgrenzen.", "Neues Projekt", "Aktualisieren", "Gespeicherte Projekte", "Projektname", "Figuren und Stimmen", "Nur autorisierte WAV: bis 60 s / 100 MiB mit genauem Transkript. Referenzen bleiben lokal.", "Figur hinzufügen", "Skript und Audioreihenfolge", "Segment hinzufügen", "Sprachparameter", "Tempo", "Temperatur", "Speichern", "Sprache erzeugen", "Audio zusammenfügen", "Abbrechen", "WAV herunterladen", "Protokoll", "Figurenname", "Referenztranskript", "Ich besitze diese Stimme oder darf sie klonen", "Referenz-WAV hochladen", "Entfernen", "Figur", "Zweck", "Sprechtext", "Stille danach (s)", "WAV importieren", "Nach oben", "Nach unten", "Neues Backend erforderlich. Nach laufender Generierung neu starten.", "Fish Audio bereit", "Fish-Modell oder Laufzeit fehlt; vorhandenes Audio kann zusammengefügt werden.", "Ungespeichert", "Gespeichert", "Vorgang fehlgeschlagen", "Ungespeicherte Änderungen verwerfen?", "Importierte WAV benötigt keine Stimme. Optionalen Text selbst angeben; ohne Text kein Untertitel.", "Referenz gespeichert", "Warteschlange", "Generierung", "Fertig", "Fehlgeschlagen", "Abgebrochen", "Ausstehend", "Audiovorschau fehlgeschlagen"],
    ja: ["ポッドキャスト", "ローカルFish Audioの読み上げで、歌唱ではありません。字幕は各区間の実音声長に基づきます。短文に分けると境界が細かくなります。", "新規プロジェクト", "更新", "保存済み", "プロジェクト名", "人物と声", "許可されたWAVのみ。最大60秒／100MiB。正確な書き起こしを入力。参照音声はローカル保存。", "人物を追加", "台詞と音声の順序", "区間を追加", "音声設定", "速度", "温度", "保存", "音声生成", "音声を結合", "キャンセル", "WAVを保存", "ログ", "人物名", "参照音声の書き起こし", "この声を所有、または複製の許可を得ています", "参照WAVをアップロード", "削除", "人物", "用途", "読み上げ台詞", "後の無音（秒）", "WAVを取り込む", "上へ", "下へ", "新しいバックエンドが必要です。現在の生成終了後に再起動してください。", "Fish Audio準備完了", "Fishモデルまたは環境が利用不可。既存音声の結合は可能です。", "未保存", "保存済み", "操作失敗", "未保存の編集を破棄しますか？", "取り込むWAVに人物の声は不要です。字幕は任意の手入力で、空欄なら字幕なし。", "参照音声保存済み", "待機", "生成中", "完了", "失敗", "中止", "未生成", "音声プレビュー失敗"],
    ko: ["팟캐스트", "로컬 Fish Audio 낭독이며 노래가 아닙니다. 자막은 구간의 실제 길이를 사용합니다. 짧은 문장으로 나누면 더 세밀합니다.", "새 프로젝트", "새로 고침", "저장된 프로젝트", "프로젝트 이름", "인물과 목소리", "허가된 WAV만: 최대 60초 / 100MiB, 정확한 전사 제공. 참조는 로컬 저장됩니다.", "인물 추가", "대사와 오디오 순서", "구간 추가", "음성 매개변수", "속도", "온도", "저장", "음성 생성", "오디오 결합", "취소", "WAV 다운로드", "로그", "인물 이름", "참조 전사", "이 목소리 소유자이거나 복제 허가를 받았습니다", "참조 WAV 업로드", "제거", "인물", "용도", "낭독 대사", "뒤의 무음(초)", "WAV 가져오기", "위로", "아래로", "새 백엔드가 필요합니다. 현재 생성이 끝난 후 재시작하세요.", "Fish Audio 준비됨", "Fish 모델 또는 환경이 없습니다. 기존 오디오 결합은 가능합니다.", "미저장", "저장됨", "작업 실패", "저장하지 않은 편집을 버릴까요?", "WAV 가져오기에 목소리는 필요 없습니다. 자막은 선택적 수동 입력이며 비우면 자막이 없습니다.", "참조 저장됨", "대기 중", "생성 중", "완료", "실패", "취소됨", "미생성", "오디오 미리보기 실패"],
    es: ["Pódcast", "Narración local Fish Audio, no canto. Subtítulos por segmento según duración real. Divide en frases cortas para mayor precisión.", "Nuevo proyecto", "Actualizar", "Proyectos guardados", "Nombre del proyecto", "Personajes y voces", "Solo WAV autorizado: máximo 60 s / 100 MiB y transcripción exacta. Referencias locales.", "Añadir personaje", "Guion y orden de audio", "Añadir segmento", "Parámetros de voz", "Velocidad", "Temperatura", "Guardar", "Generar voz", "Unir audio", "Cancelar", "Descargar WAV", "Registro", "Nombre del personaje", "Transcripción de referencia", "Poseo esta voz o tengo permiso para clonarla", "Subir referencia WAV", "Quitar", "Personaje", "Uso", "Texto hablado", "Silencio posterior (s)", "Importar WAV", "Subir", "Bajar", "Se requiere nuevo servidor. Reinicia al terminar la generación actual.", "Fish Audio listo", "Modelo o entorno Fish no disponible; puedes unir audio existente.", "Sin guardar", "Guardado", "Operación fallida", "¿Descartar cambios sin guardar?", "El WAV importado no requiere voz. Texto opcional manual; vacío no genera subtítulos.", "Referencia guardada", "En cola", "Generando", "Completado", "Fallido", "Cancelado", "Pendiente", "Error de vista previa"],
    pt: ["Podcast", "Narração local Fish Audio, não canto. Legendas por segmento com duração real. Use frases curtas para limites mais precisos.", "Novo projeto", "Atualizar", "Projetos salvos", "Nome do projeto", "Personagens e vozes", "Apenas WAV autorizado: até 60 s / 100 MiB com transcrição exata. Referências locais.", "Adicionar personagem", "Roteiro e ordem de áudio", "Adicionar segmento", "Parâmetros de voz", "Velocidade", "Temperatura", "Salvar", "Gerar voz", "Unir áudio", "Cancelar", "Baixar WAV", "Registro", "Nome do personagem", "Transcrição de referência", "Possuo esta voz ou tenho autorização para cloná-la", "Enviar referência WAV", "Remover", "Personagem", "Uso", "Texto falado", "Silêncio após (s)", "Importar WAV", "Subir", "Descer", "Novo servidor necessário. Reinicie após a geração atual.", "Fish Audio pronto", "Modelo ou ambiente Fish indisponível; áudios existentes podem ser unidos.", "Não salvo", "Salvo", "Operação falhou", "Descartar alterações não salvas?", "WAV importado não exige voz. Texto manual opcional; vazio não cria legenda.", "Referência salva", "Na fila", "Gerando", "Concluído", "Falhou", "Cancelado", "Pendente", "Falha na prévia"],
    tr: ["Podcast", "Yerel Fish Audio konuşması, şarkı söylemez. Altyazılar gerçek bölüm süresine dayanır. Daha hassas zamanlama için kısa cümleler kullanın.", "Yeni proje", "Yenile", "Kayıtlı projeler", "Proje adı", "Karakterler ve sesler", "Yalnızca izinli WAV: 60 sn / 100 MiB ve doğru metin. Referanslar yereldir.", "Karakter ekle", "Metin ve ses sırası", "Bölüm ekle", "Ses parametreleri", "Hız", "Sıcaklık", "Kaydet", "Ses üret", "Sesleri birleştir", "İptal", "WAV indir", "Günlük", "Karakter adı", "Referans metni", "Bu ses bana ait veya klonlama iznim var", "Referans WAV yükle", "Kaldır", "Karakter", "Amaç", "Konuşma metni", "Sonraki sessizlik (sn)", "WAV içe aktar", "Yukarı", "Aşağı", "Yeni sunucu gerekli. Mevcut üretim bitince yeniden başlatın.", "Fish Audio hazır", "Fish modeli veya ortamı yok; mevcut sesler birleştirilebilir.", "Kaydedilmedi", "Kaydedildi", "İşlem başarısız", "Kaydedilmemiş değişiklikler silinsin mi?", "İçe aktarılan WAV ses gerektirmez. Metin isteğe bağlıdır; boşsa altyazı yok.", "Referans kaydedildi", "Sırada", "Üretiliyor", "Tamamlandı", "Başarısız", "İptal edildi", "Bekliyor", "Ses önizlemesi başarısız"],
    ar: ["إنتاج البودكاست", "سرد محلي عبر Fish Audio وليس غناءً. ترجمة لكل مقطع وفق مدته الفعلية. استخدم جملاً قصيرة لدقة أكبر.", "مشروع جديد", "تحديث", "المشاريع المحفوظة", "اسم المشروع", "الشخصيات والأصوات", "WAV مصرح به فقط: حتى 60 ثانية / 100 MiB مع نص دقيق. المراجع محلية.", "إضافة شخصية", "النص وترتيب الصوت", "إضافة مقطع", "إعدادات الصوت", "السرعة", "الحرارة", "حفظ", "توليد الصوت", "دمج الصوت", "إلغاء", "تنزيل WAV", "السجل", "اسم الشخصية", "نص الصوت المرجعي", "أملك هذا الصوت أو لدي إذن لاستنساخه", "رفع WAV مرجعي", "إزالة", "الشخصية", "الغرض", "النص المنطوق", "صمت بعد المقطع (ث)", "استيراد WAV", "للأعلى", "للأسفل", "يلزم خادم جديد. أعد التشغيل بعد انتهاء التوليد الحالي.", "Fish Audio جاهز", "نموذج أو بيئة Fish غير متاح؛ يمكن دمج الصوت الموجود.", "غير محفوظ", "محفوظ", "فشلت العملية", "تجاهل التعديلات غير المحفوظة؟", "لا يحتاج WAV المستورد إلى صوت شخصية. النص اختياري يدوي؛ لا ترجمة عند تركه فارغاً.", "حُفظ المرجع", "في الانتظار", "جارٍ التوليد", "مكتمل", "فشل", "ملغى", "معلق", "فشلت معاينة الصوت"],
    vi: ["Podcast", "Fish Audio đọc lời cục bộ, không hát. Phụ đề mỗi đoạn dựa trên thời lượng thật. Chia câu ngắn để có mốc chi tiết.", "Dự án mới", "Làm mới", "Dự án đã lưu", "Tên dự án", "Nhân vật và giọng", "Chỉ WAV được phép: tối đa 60 giây / 100 MiB, có bản chép chính xác. Lưu cục bộ.", "Thêm nhân vật", "Lời thoại và thứ tự âm thanh", "Thêm đoạn", "Tham số giọng", "Tốc độ", "Nhiệt độ", "Lưu", "Tạo giọng", "Ghép âm thanh", "Hủy", "Tải WAV", "Nhật ký", "Tên nhân vật", "Bản chép tham chiếu", "Tôi sở hữu giọng này hoặc được phép sao chép", "Tải WAV tham chiếu", "Xóa", "Nhân vật", "Mục đích", "Lời đọc", "Im lặng sau (giây)", "Nhập WAV", "Lên", "Xuống", "Cần máy chủ mới. Khởi động lại sau khi tạo hiện tại kết thúc.", "Fish Audio sẵn sàng", "Mô hình hoặc môi trường Fish chưa sẵn sàng; vẫn có thể ghép âm thanh.", "Chưa lưu", "Đã lưu", "Thao tác thất bại", "Bỏ chỉnh sửa chưa lưu?", "WAV nhập không cần giọng. Văn bản tùy chọn do bạn nhập; trống không tạo phụ đề.", "Đã lưu tham chiếu", "Đang chờ", "Đang tạo", "Hoàn tất", "Thất bại", "Đã hủy", "Chưa tạo", "Lỗi nghe trước"],
    id: ["Podcast", "Narasi lokal Fish Audio, bukan nyanyian. Subtitel per segmen memakai durasi nyata. Kalimat pendek memberi batas lebih rinci.", "Proyek baru", "Segarkan", "Proyek tersimpan", "Nama proyek", "Karakter dan suara", "Hanya WAV berizin: hingga 60 dtk / 100 MiB dengan transkrip akurat. Referensi lokal.", "Tambah karakter", "Naskah dan urutan audio", "Tambah segmen", "Parameter suara", "Kecepatan", "Temperatur", "Simpan", "Buat suara", "Gabungkan audio", "Batal", "Unduh WAV", "Log", "Nama karakter", "Transkrip referensi", "Saya memiliki suara ini atau izin untuk mengkloningnya", "Unggah referensi WAV", "Hapus", "Karakter", "Tujuan", "Teks ucapan", "Hening setelah (dtk)", "Impor WAV", "Naik", "Turun", "Backend baru diperlukan. Mulai ulang setelah generasi saat ini selesai.", "Fish Audio siap", "Model atau runtime Fish tidak tersedia; audio yang ada tetap dapat digabung.", "Belum disimpan", "Tersimpan", "Operasi gagal", "Buang perubahan belum tersimpan?", "WAV impor tidak membutuhkan suara. Teks opsional diisi sendiri; kosong tanpa subtitel.", "Referensi tersimpan", "Antrean", "Membuat", "Selesai", "Gagal", "Dibatalkan", "Menunggu", "Pratinjau audio gagal"],
    ru: ["Подкаст", "Локальная речь Fish Audio, не пение. Субтитры по реальной длительности сегмента. Короткие предложения дают более точные границы.", "Новый проект", "Обновить", "Сохранённые проекты", "Название проекта", "Персонажи и голоса", "Только разрешённый WAV: до 60 с / 100 МиБ с точным текстом. Всё локально.", "Добавить персонажа", "Текст и порядок аудио", "Добавить сегмент", "Параметры речи", "Скорость", "Температура", "Сохранить", "Создать речь", "Объединить аудио", "Отмена", "Скачать WAV", "Журнал", "Имя персонажа", "Текст эталона", "Я владею голосом или имею разрешение на клонирование", "Загрузить эталон WAV", "Удалить", "Персонаж", "Назначение", "Текст речи", "Тишина после (с)", "Импорт WAV", "Вверх", "Вниз", "Нужен новый сервер. Перезапустите после текущей генерации.", "Fish Audio готов", "Модель или среда Fish недоступна; имеющееся аудио можно объединить.", "Не сохранено", "Сохранено", "Ошибка операции", "Отменить несохранённые изменения?", "Импорт WAV не требует голоса. Текст вводится вручную; пустой текст — без субтитров.", "Эталон сохранён", "В очереди", "Генерация", "Готово", "Ошибка", "Отменено", "Ожидание", "Ошибка предпросмотра"],
  };
  const modelMessages = {
    en: ["Speech model", "Describe this character's voice (tone, age, accent, and delivery). Fish Audio uses an authorized reference WAV and its transcript; VoxCPM2 and Qwen3-TTS use this description.", "Voice description"],
    "zh-CN": ["语音模型", "填写人物声音描述（音色、年龄感、口音和表达方式）。Fish Audio 使用已获授权的参考 WAV 及其转写；VoxCPM2 和 Qwen3-TTS 使用此描述生成。", "声音描述"],
    "zh-TW": ["語音模型", "填寫人物聲音描述（音色、年齡感、口音和表達方式）。Fish Audio 使用已獲授權的參考 WAV 及其轉寫；VoxCPM2 和 Qwen3-TTS 使用此描述生成。", "聲音描述"],
    fr: ["Modèle vocal", "Décrivez la voix (timbre, âge, accent et interprétation). Fish Audio utilise un WAV de référence autorisé et sa transcription ; VoxCPM2 et Qwen3-TTS utilisent cette description.", "Description de la voix"],
    de: ["Sprachmodell", "Beschreiben Sie die Stimme (Klang, Alter, Akzent und Vortrag). Fish Audio nutzt eine autorisierte Referenz-WAV samt Transkript; VoxCPM2 und Qwen3-TTS verwenden diese Beschreibung.", "Stimmbeschreibung"],
    ja: ["音声モデル", "声の特徴（声質、年齢感、アクセント、話し方）を記述してください。Fish Audio は許可済みの参照 WAV と文字起こしを使用し、VoxCPM2 と Qwen3-TTS はこの説明から生成します。", "声の説明"],
    ko: ["음성 모델", "목소리 특징(음색, 연령대, 억양, 말투)을 설명하세요. Fish Audio는 허가된 참조 WAV와 대본을 사용하고, VoxCPM2와 Qwen3-TTS는 이 설명으로 생성합니다.", "목소리 설명"],
    es: ["Modelo de voz", "Describe la voz (timbre, edad, acento e interpretación). Fish Audio usa un WAV de referencia autorizado y su transcripción; VoxCPM2 y Qwen3-TTS usan esta descripción.", "Descripción de voz"],
    pt: ["Modelo de voz", "Descreva a voz (timbre, idade, sotaque e interpretação). Fish Audio usa um WAV de referência autorizado e sua transcrição; VoxCPM2 e Qwen3-TTS usam esta descrição.", "Descrição da voz"],
    tr: ["Ses modeli", "Sesi tanımlayın (tını, yaş, aksan ve anlatım). Fish Audio izinli bir referans WAV ve dökümünü kullanır; VoxCPM2 ve Qwen3-TTS bu açıklamayı kullanır.", "Ses açıklaması"],
    ar: ["نموذج الصوت", "صف الصوت (النبرة والعمر واللهجة وطريقة الإلقاء). يستخدم Fish Audio ملف WAV مرجعياً مصرحاً به ونصه؛ ويستخدم VoxCPM2 وQwen3-TTS هذا الوصف.", "وصف الصوت"],
    vi: ["Mô hình giọng nói", "Mô tả giọng (âm sắc, độ tuổi, giọng vùng miền và cách đọc). Fish Audio dùng WAV tham chiếu được phép cùng bản chép; VoxCPM2 và Qwen3-TTS dùng mô tả này.", "Mô tả giọng"],
    id: ["Model suara", "Jelaskan suara (warna, usia, aksen, dan gaya bicara). Fish Audio memakai WAV referensi berizin dan transkripnya; VoxCPM2 dan Qwen3-TTS memakai deskripsi ini.", "Deskripsi suara"],
    ru: ["Голосовая модель", "Опишите голос (тембр, возраст, акцент и манеру речи). Fish Audio использует разрешённый WAV-образец и расшифровку; VoxCPM2 и Qwen3-TTS используют это описание.", "Описание голоса"],
  };
  for (const [language, row] of Object.entries(modelMessages)) {
    messages[language].push(row[0], row[2]);
    messages[language][7] = row[1];
  }
  const modelNotes = {
    en: "Local speech synthesis. Choose Fish Audio for authorized reference-voice cloning, or VoxCPM2 / Qwen3-TTS for voice design from a description. Subtitles follow each segment's actual audio duration.",
    "zh-CN": "本地语音合成。可选择 Fish Audio 使用已获授权的参考声音克隆，或选择 VoxCPM2／Qwen3-TTS 根据声音描述生成。字幕按每段实际音频时长标记。",
    "zh-TW": "本機語音合成。可選擇 Fish Audio 使用已獲授權的參考聲音複製，或選擇 VoxCPM2／Qwen3-TTS 根據聲音描述生成。字幕按每段實際音訊時長標記。",
    fr: "Synthèse vocale locale. Fish Audio clone une voix à partir d'un WAV autorisé ; VoxCPM2 et Qwen3-TTS créent une voix depuis sa description. Sous-titres selon la durée réelle.",
    de: "Lokale Sprachsynthese. Fish Audio klont eine Stimme aus einer autorisierten Referenz; VoxCPM2 und Qwen3-TTS entwerfen sie anhand einer Beschreibung. Untertitel nach tatsächlicher Dauer.",
    ja: "ローカル音声合成です。Fish Audio は許可済みの参照音声から声を複製し、VoxCPM2／Qwen3-TTS は声の説明から生成します。字幕は実際の音声長に基づきます。",
    ko: "로컬 음성 합성입니다. Fish Audio는 허가된 참조 음성으로 복제하고, VoxCPM2와 Qwen3-TTS는 목소리 설명으로 생성합니다. 자막은 실제 오디오 길이를 따릅니다.",
    es: "Síntesis de voz local. Fish Audio clona desde una referencia autorizada; VoxCPM2 y Qwen3-TTS diseñan la voz a partir de su descripción. Subtítulos según la duración real.",
    pt: "Síntese de voz local. Fish Audio clona uma voz de uma referência autorizada; VoxCPM2 e Qwen3-TTS criam a voz a partir da descrição. Legendas conforme a duração real.",
    tr: "Yerel konuşma sentezi. Fish Audio izinli referans sesten klonlar; VoxCPM2 ve Qwen3-TTS ses açıklamasından üretir. Altyazılar gerçek süreyi izler.",
    ar: "توليد صوت محلي. يستنسخ Fish Audio صوتاً من مرجع مصرح به؛ وينشئ VoxCPM2 وQwen3-TTS الصوت من وصفه. تتبع الترجمة المدة الفعلية.",
    vi: "Tổng hợp giọng nói cục bộ. Fish Audio nhân bản từ âm thanh tham chiếu được phép; VoxCPM2 và Qwen3-TTS tạo giọng từ mô tả. Phụ đề theo thời lượng thực tế.",
    id: "Sintesis suara lokal. Fish Audio meniru dari referensi berizin; VoxCPM2 dan Qwen3-TTS merancang suara dari deskripsi. Subtitel mengikuti durasi audio sebenarnya.",
    ru: "Локальный синтез речи. Fish Audio клонирует голос по разрешённому образцу; VoxCPM2 и Qwen3-TTS создают голос по описанию. Субтитры соответствуют реальной длительности.",
  };
  for (const [language, note] of Object.entries(modelNotes)) messages[language][1] = note;
  const modelStates = {
    en: ["Local model is ready", "Local model or runtime is unavailable"],
    "zh-CN": ["本地模型已就绪", "本地模型或运行环境未就绪"],
    "zh-TW": ["本機模型已就緒", "本機模型或執行環境未就緒"],
    fr: ["Le modèle local est prêt", "Le modèle local ou son environnement est indisponible"],
    de: ["Lokales Modell ist bereit", "Lokales Modell oder Laufzeit ist nicht verfügbar"],
    ja: ["ローカルモデルの準備が完了しました", "ローカルモデルまたは実行環境を利用できません"],
    ko: ["로컬 모델이 준비되었습니다", "로컬 모델 또는 런타임을 사용할 수 없습니다"],
    es: ["El modelo local está listo", "El modelo local o su entorno no está disponible"],
    pt: ["O modelo local está pronto", "O modelo local ou o ambiente não está disponível"],
    tr: ["Yerel model hazır", "Yerel model veya çalışma ortamı kullanılamıyor"],
    ar: ["النموذج المحلي جاهز", "النموذج المحلي أو بيئة التشغيل غير متاحة"],
    vi: ["Mô hình cục bộ đã sẵn sàng", "Mô hình cục bộ hoặc môi trường chạy chưa sẵn sàng"],
    id: ["Model lokal siap", "Model lokal atau runtime tidak tersedia"],
    ru: ["Локальная модель готова", "Локальная модель или среда выполнения недоступна"],
  };
  const sourceKeys = ["source", "fishSource", "audioSource", "musicHistory", "useMusic", "musicEmpty", "musicFailed"];
  const sourceMessages = {
    en: ["Audio source", "Fish Audio · Generate", "Existing audio", "Saved music", "Add selected music", "No saved music yet. Generate music first, then refresh here, or upload a WAV.", "Music history could not be loaded. You can still upload a WAV."],
    "zh-CN": ["音频来源", "Fish Audio · 台词生成", "已有音频", "已生成的音乐", "加入所选音乐", "暂无已保存的音乐。先生成音乐后在此刷新，或直接上传 WAV。", "音乐历史加载失败，仍可直接上传 WAV。"],
    "zh-TW": ["音訊來源", "Fish Audio · 台詞生成", "既有音訊", "已生成的音樂", "加入所選音樂", "尚無已儲存的音樂。先生成音樂後在此重新整理，或直接上傳 WAV。", "音樂歷史載入失敗，仍可直接上傳 WAV。"],
    fr: ["Source audio", "Fish Audio · Générer", "Audio existant", "Musique enregistrée", "Ajouter la musique choisie", "Aucune musique enregistrée. Générez puis actualisez, ou importez un WAV.", "Impossible de charger la musique. Vous pouvez importer un WAV."],
    de: ["Audioquelle", "Fish Audio · Erzeugen", "Vorhandenes Audio", "Gespeicherte Musik", "Gewählte Musik hinzufügen", "Keine gespeicherte Musik. Erst erzeugen und aktualisieren oder WAV hochladen.", "Musik konnte nicht geladen werden. WAV-Upload bleibt möglich."],
    ja: ["音声ソース", "Fish Audio · 台詞生成", "既存の音声", "保存済みの音楽", "選択した音楽を追加", "保存済みの音楽はありません。生成後に更新するか、WAVをアップロードしてください。", "音楽履歴を読み込めません。WAVのアップロードは可能です。"],
    ko: ["오디오 소스", "Fish Audio · 대사 생성", "기존 오디오", "저장된 음악", "선택한 음악 추가", "저장된 음악이 없습니다. 음악 생성 후 새로 고치거나 WAV를 업로드하세요.", "음악 기록을 불러오지 못했습니다. WAV 업로드는 가능합니다."],
    es: ["Fuente de audio", "Fish Audio · Generar", "Audio existente", "Música guardada", "Añadir música elegida", "No hay música guardada. Genere y actualice, o suba un WAV.", "No se pudo cargar la música. Puede subir un WAV."],
    pt: ["Fonte de áudio", "Fish Audio · Gerar", "Áudio existente", "Música salva", "Adicionar música escolhida", "Nenhuma música salva. Gere e atualize, ou envie um WAV.", "Não foi possível carregar a música. Você pode enviar um WAV."],
    tr: ["Ses kaynağı", "Fish Audio · Üret", "Hazır ses", "Kayıtlı müzik", "Seçili müziği ekle", "Kayıtlı müzik yok. Müzik üretip yenileyin veya WAV yükleyin.", "Müzik geçmişi yüklenemedi. WAV yükleyebilirsiniz."],
    ar: ["مصدر الصوت", "Fish Audio · توليد", "صوت جاهز", "الموسيقى المحفوظة", "إضافة الموسيقى المحددة", "لا توجد موسيقى محفوظة. ولّد الموسيقى ثم حدّث، أو ارفع WAV.", "تعذر تحميل سجل الموسيقى. يمكنك رفع WAV."],
    vi: ["Nguồn âm thanh", "Fish Audio · Tạo lời", "Âm thanh có sẵn", "Nhạc đã lưu", "Thêm nhạc đã chọn", "Chưa có nhạc đã lưu. Tạo nhạc rồi làm mới hoặc tải WAV lên.", "Không tải được lịch sử nhạc. Bạn vẫn có thể tải WAV lên."],
    id: ["Sumber audio", "Fish Audio · Buat", "Audio tersedia", "Musik tersimpan", "Tambah musik pilihan", "Belum ada musik tersimpan. Buat lalu segarkan atau unggah WAV.", "Riwayat musik gagal dimuat. Anda tetap dapat mengunggah WAV."],
    ru: ["Источник аудио", "Fish Audio · Генерация", "Готовое аудио", "Сохранённая музыка", "Добавить выбранную музыку", "Нет сохранённой музыки. Создайте и обновите список или загрузите WAV.", "Не удалось загрузить музыку. Загрузка WAV доступна."],
  };
  const generatedLabels = {
    en: "Generate speech", "zh-CN": "生成语音", "zh-TW": "生成語音", fr: "Générer la voix",
    de: "Sprache erzeugen", ja: "音声を生成", ko: "음성 생성", es: "Generar voz",
    pt: "Gerar voz", tr: "Konuşma üret", ar: "توليد الكلام", vi: "Tạo giọng nói",
    id: "Buat suara", ru: "Создать речь",
  };
  for (const [language, label] of Object.entries(generatedLabels)) sourceMessages[language][1] = label;
  keys.push(...sourceKeys);
  for (const [language, row] of Object.entries(messages)) row.push(...sourceMessages[language]);
  const purposes = {
    en: ["Introduction", "Monologue", "Ending", "Story", "Dialogue"],
    "zh-CN": ["开场", "独白", "结尾", "故事", "角色对话"], "zh-TW": ["開場", "獨白", "結尾", "故事", "角色對話"],
    fr: ["Introduction", "Monologue", "Conclusion", "Histoire", "Dialogue"],
    de: ["Einleitung", "Monolog", "Schluss", "Geschichte", "Dialog"],
    ja: ["開場", "独白", "結び", "物語", "対話"], ko: ["시작", "독백", "마무리", "이야기", "대화"],
    es: ["Introducción", "Monólogo", "Final", "Historia", "Diálogo"],
    pt: ["Introdução", "Monólogo", "Final", "História", "Diálogo"],
    tr: ["Açılış", "Monolog", "Kapanış", "Hikâye", "Diyalog"],
    ar: ["افتتاح", "مونولوج", "ختام", "قصة", "حوار"],
    vi: ["Mở đầu", "Độc thoại", "Kết thúc", "Câu chuyện", "Đối thoại"],
    id: ["Pembukaan", "Monolog", "Penutup", "Cerita", "Dialog"],
    ru: ["Вступление", "Монолог", "Концовка", "История", "Диалог"],
  };
  const purposeIds = ["intro", "monologue", "outro", "story", "dialogue"];
    const errorMessages = {
      en: {
        podcast_segment_audio_missing: "A segment has no audio yet. Import or generate its audio first.",
        podcast_reference_required: "This character needs a reference voice before generating.",
        podcast_reference_text_required: "This character needs a reference transcript.",
        podcast_voice_description_required: "This character needs a voice description.",
        podcast_segment_character_required: "A segment has no character assigned.",
        podcast_segment_text_required: "A segment has no spoken text.",
        podcast_segments_required: "Add at least one segment before generating.",
        podcast_consent_required: "Confirm voice ownership or permission before cloning.",
        podcast_conflict: "The project changed elsewhere. Reload and try again.",
        podcast_not_found: "Project not found.",
        podcast_limit: "Project limit reached.",
        podcast_character_not_found: "Character not found.",
        podcast_busy: "The project is busy.",
        local_model_not_ready: "The selected model is not ready.",
        job_already_running: "Another generation is already running.",
        podcast_import_limit: "Imported audio exceeds the size or duration limit.",
        podcast_export_not_found: "No assembled audio to download yet.",
        podcast_export_too_large: "The assembled audio is too large to export.",
        podcast_media_not_found: "A segment's audio file is missing.",
        podcast_segment_not_found: "Segment not found.",
      },
      "zh-CN": {
        podcast_segment_audio_missing: "有语音段还没有音频，请先导入或生成该段音频。",
        podcast_reference_required: "该人物生成前需要参考声音。",
        podcast_reference_text_required: "该人物需要参考音频转写。",
        podcast_voice_description_required: "该人物需要声音描述。",
        podcast_segment_character_required: "有语音段未指定人物。",
        podcast_segment_text_required: "有语音段没有口播台词。",
        podcast_segments_required: "生成前请至少添加一个语音段。",
        podcast_consent_required: "克隆前请确认拥有该声音或已获授权。",
        podcast_conflict: "项目已在别处变更，请重新加载后再试。",
        podcast_not_found: "未找到项目。",
        podcast_limit: "项目数量已达上限。",
        podcast_character_not_found: "未找到人物。",
        podcast_busy: "项目正在处理中。",
        local_model_not_ready: "所选模型尚未就绪。",
        job_already_running: "已有其他生成任务正在运行。",
        podcast_import_limit: "导入音频超出大小或时长限制。",
        podcast_export_not_found: "还没有可下载的合成音频。",
        podcast_export_too_large: "合成音频过大，无法导出。",
        podcast_media_not_found: "某语音段的音频文件缺失。",
        podcast_segment_not_found: "未找到语音段。",
      },
      "zh-TW": {
        podcast_segment_audio_missing: "有語音段還沒有音訊，請先匯入或產生該段音訊。",
        podcast_reference_required: "該人物產生前需要參考聲音。",
        podcast_reference_text_required: "該人物需要參考音訊轉寫。",
        podcast_voice_description_required: "該人物需要聲音描述。",
        podcast_segment_character_required: "有語音段未指定人物。",
        podcast_segment_text_required: "有語音段沒有口播台詞。",
        podcast_segments_required: "產生前請至少新增一個語音段。",
        podcast_consent_required: "複製前請確認擁有該聲音或已獲授權。",
        podcast_conflict: "專案已在別處變更，請重新載入後再試。",
        podcast_not_found: "找不到專案。",
        podcast_limit: "專案數量已達上限。",
        podcast_character_not_found: "找不到人物。",
        podcast_busy: "專案正在處理中。",
        local_model_not_ready: "所選模型尚未就緒。",
        job_already_running: "已有其他產生工作正在執行。",
        podcast_import_limit: "匯入音訊超出大小或時長限制。",
        podcast_export_not_found: "尚無可下載的合成音訊。",
        podcast_export_too_large: "合成音訊過大，無法匯出。",
        podcast_media_not_found: "某語音段的音訊檔案遺失。",
        podcast_segment_not_found: "找不到語音段。",
      },
      fr: {
        podcast_segment_audio_missing: "Un segment n'a pas encore d'audio. Importez ou générez-le d'abord.",
        podcast_reference_required: "Ce personnage a besoin d'une voix de référence avant la génération.",
        podcast_reference_text_required: "Ce personnage a besoin d'une transcription de référence.",
        podcast_voice_description_required: "Ce personnage a besoin d'une description de voix.",
        podcast_segment_character_required: "Un segment n'a pas de personnage assigné.",
        podcast_segment_text_required: "Un segment n'a pas de texte parlé.",
        podcast_segments_required: "Ajoutez au moins un segment avant de générer.",
        podcast_consent_required: "Confirmez la propriété ou l'autorisation avant le clonage.",
        podcast_conflict: "Le projet a changé ailleurs. Rechargez et réessayez.",
        podcast_not_found: "Projet introuvable.",
        podcast_limit: "Limite de projets atteinte.",
        podcast_character_not_found: "Personnage introuvable.",
        podcast_busy: "Le projet est occupé.",
        local_model_not_ready: "Le modèle sélectionné n'est pas prêt.",
        job_already_running: "Une autre génération est déjà en cours.",
        podcast_import_limit: "L'audio importé dépasse la limite de taille ou de durée.",
        podcast_export_not_found: "Aucun audio assemblé à télécharger.",
        podcast_export_too_large: "L'audio assemblé est trop volumineux à exporter.",
        podcast_media_not_found: "Le fichier audio d'un segment est manquant.",
        podcast_segment_not_found: "Segment introuvable.",
      },
      de: {
        podcast_segment_audio_missing: "Ein Segment hat noch kein Audio. Importieren oder erzeugen Sie es zuerst.",
        podcast_reference_required: "Diese Figur braucht vor der Erzeugung eine Referenzstimme.",
        podcast_reference_text_required: "Diese Figur braucht ein Referenztranskript.",
        podcast_voice_description_required: "Diese Figur braucht eine Stimmbeschreibung.",
        podcast_segment_character_required: "Ein Segment hat keine zugewiesene Figur.",
        podcast_segment_text_required: "Ein Segment hat keinen Sprechtext.",
        podcast_segments_required: "Fügen Sie vor der Erzeugung mindestens ein Segment hinzu.",
        podcast_consent_required: "Bestätigen Sie Eigentum oder Erlaubnis vor dem Klonen.",
        podcast_conflict: "Das Projekt wurde andernorts geändert. Neu laden und erneut versuchen.",
        podcast_not_found: "Projekt nicht gefunden.",
        podcast_limit: "Projektlimit erreicht.",
        podcast_character_not_found: "Figur nicht gefunden.",
        podcast_busy: "Das Projekt ist beschäftigt.",
        local_model_not_ready: "Das gewählte Modell ist nicht bereit.",
        job_already_running: "Eine andere Erzeugung läuft bereits.",
        podcast_import_limit: "Importiertes Audio überschreitet Größen- oder Dauerlimit.",
        podcast_export_not_found: "Noch kein zusammengesetztes Audio zum Herunterladen.",
        podcast_export_too_large: "Das zusammengesetzte Audio ist zu groß für den Export.",
        podcast_media_not_found: "Die Audiodatei eines Segments fehlt.",
        podcast_segment_not_found: "Segment nicht gefunden.",
      },
      ja: {
        podcast_segment_audio_missing: "音声のない区間があります。先に音声を読み込むか生成してください。",
        podcast_reference_required: "この人物は生成前に参照音声が必要です。",
        podcast_reference_text_required: "この人物は参照音声の書き起こしが必要です。",
        podcast_voice_description_required: "この人物は声の説明が必要です。",
        podcast_segment_character_required: "人物が割り当てられていない区間があります。",
        podcast_segment_text_required: "台詞のない区間があります。",
        podcast_segments_required: "生成前に区間を1つ以上追加してください。",
        podcast_consent_required: "複製前に声の所有または許可を確認してください。",
        podcast_conflict: "プロジェクトが他で変更されました。再読み込みして再試行してください。",
        podcast_not_found: "プロジェクトが見つかりません。",
        podcast_limit: "プロジェクト数の上限に達しました。",
        podcast_character_not_found: "人物が見つかりません。",
        podcast_busy: "プロジェクトは処理中です。",
        local_model_not_ready: "選択したモデルは準備できていません。",
        job_already_running: "別の生成がすでに実行中です。",
        podcast_import_limit: "読み込んだ音声がサイズまたは長さの上限を超えています。",
        podcast_export_not_found: "ダウンロードできる合成音声がありません。",
        podcast_export_too_large: "合成音声が大きすぎて書き出せません。",
        podcast_media_not_found: "区間の音声ファイルがありません。",
        podcast_segment_not_found: "区間が見つかりません。",
      },
      ko: {
        podcast_segment_audio_missing: "오디오가 없는 구간이 있습니다. 먼저 가져오거나 생성하세요.",
        podcast_reference_required: "이 인물은 생성 전에 참조 음성이 필요합니다.",
        podcast_reference_text_required: "이 인물은 참조 전사가 필요합니다.",
        podcast_voice_description_required: "이 인물은 목소리 설명이 필요합니다.",
        podcast_segment_character_required: "인물이 지정되지 않은 구간이 있습니다.",
        podcast_segment_text_required: "대사가 없는 구간이 있습니다.",
        podcast_segments_required: "생성 전에 구간을 하나 이상 추가하세요.",
        podcast_consent_required: "복제 전에 음성 소유 또는 허가를 확인하세요.",
        podcast_conflict: "프로젝트가 다른 곳에서 변경되었습니다. 다시 불러와 재시도하세요.",
        podcast_not_found: "프로젝트를 찾을 수 없습니다.",
        podcast_limit: "프로젝트 수 한도에 도달했습니다.",
        podcast_character_not_found: "인물을 찾을 수 없습니다.",
        podcast_busy: "프로젝트가 처리 중입니다.",
        local_model_not_ready: "선택한 모델이 준비되지 않았습니다.",
        job_already_running: "다른 생성 작업이 이미 실행 중입니다.",
        podcast_import_limit: "가져온 오디오가 크기 또는 길이 한도를 초과했습니다.",
        podcast_export_not_found: "다운로드할 합성 오디오가 없습니다.",
        podcast_export_too_large: "합성 오디오가 너무 커서 내보낼 수 없습니다.",
        podcast_media_not_found: "구간의 오디오 파일이 없습니다.",
        podcast_segment_not_found: "구간을 찾을 수 없습니다.",
      },
      es: {
        podcast_segment_audio_missing: "Un segmento aún no tiene audio. Impórtalo o genéralo primero.",
        podcast_reference_required: "Este personaje necesita una voz de referencia antes de generar.",
        podcast_reference_text_required: "Este personaje necesita una transcripción de referencia.",
        podcast_voice_description_required: "Este personaje necesita una descripción de voz.",
        podcast_segment_character_required: "Un segmento no tiene personaje asignado.",
        podcast_segment_text_required: "Un segmento no tiene texto hablado.",
        podcast_segments_required: "Añade al menos un segmento antes de generar.",
        podcast_consent_required: "Confirma la propiedad o el permiso antes de clonar.",
        podcast_conflict: "El proyecto cambió en otro lugar. Recarga e inténtalo de nuevo.",
        podcast_not_found: "Proyecto no encontrado.",
        podcast_limit: "Límite de proyectos alcanzado.",
        podcast_character_not_found: "Personaje no encontrado.",
        podcast_busy: "El proyecto está ocupado.",
        local_model_not_ready: "El modelo seleccionado no está listo.",
        job_already_running: "Ya hay otra generación en curso.",
        podcast_import_limit: "El audio importado supera el límite de tamaño o duración.",
        podcast_export_not_found: "Aún no hay audio ensamblado para descargar.",
        podcast_export_too_large: "El audio ensamblado es demasiado grande para exportar.",
        podcast_media_not_found: "Falta el archivo de audio de un segmento.",
        podcast_segment_not_found: "Segmento no encontrado.",
      },
      pt: {
        podcast_segment_audio_missing: "Um segmento ainda não tem áudio. Importe ou gere primeiro.",
        podcast_reference_required: "Este personagem precisa de uma voz de referência antes de gerar.",
        podcast_reference_text_required: "Este personagem precisa de uma transcrição de referência.",
        podcast_voice_description_required: "Este personagem precisa de uma descrição de voz.",
        podcast_segment_character_required: "Um segmento não tem personagem atribuído.",
        podcast_segment_text_required: "Um segmento não tem texto falado.",
        podcast_segments_required: "Adicione ao menos um segmento antes de gerar.",
        podcast_consent_required: "Confirme a propriedade ou permissão antes de clonar.",
        podcast_conflict: "O projeto mudou em outro lugar. Recarregue e tente novamente.",
        podcast_not_found: "Projeto não encontrado.",
        podcast_limit: "Limite de projetos atingido.",
        podcast_character_not_found: "Personagem não encontrado.",
        podcast_busy: "O projeto está ocupado.",
        local_model_not_ready: "O modelo selecionado não está pronto.",
        job_already_running: "Outra geração já está em andamento.",
        podcast_import_limit: "O áudio importado excede o limite de tamanho ou duração.",
        podcast_export_not_found: "Ainda não há áudio montado para baixar.",
        podcast_export_too_large: "O áudio montado é grande demais para exportar.",
        podcast_media_not_found: "Falta o arquivo de áudio de um segmento.",
        podcast_segment_not_found: "Segmento não encontrado.",
      },
      tr: {
        podcast_segment_audio_missing: "Bir bölümün henüz sesi yok. Önce içe aktarın veya oluşturun.",
        podcast_reference_required: "Bu karakterin oluşturmadan önce referans sese ihtiyacı var.",
        podcast_reference_text_required: "Bu karakterin referans metnine ihtiyacı var.",
        podcast_voice_description_required: "Bu karakterin ses açıklamasına ihtiyacı var.",
        podcast_segment_character_required: "Bir bölüme karakter atanmamış.",
        podcast_segment_text_required: "Bir bölümde konuşma metni yok.",
        podcast_segments_required: "Oluşturmadan önce en az bir bölüm ekleyin.",
        podcast_consent_required: "Klonlamadan önce ses sahipliğini veya izni onaylayın.",
        podcast_conflict: "Proje başka yerde değişti. Yeniden yükleyip tekrar deneyin.",
        podcast_not_found: "Proje bulunamadı.",
        podcast_limit: "Proje sınırına ulaşıldı.",
        podcast_character_not_found: "Karakter bulunamadı.",
        podcast_busy: "Proje meşgul.",
        local_model_not_ready: "Seçilen model hazır değil.",
        job_already_running: "Başka bir oluşturma zaten çalışıyor.",
        podcast_import_limit: "İçe aktarılan ses boyut veya süre sınırını aşıyor.",
        podcast_export_not_found: "İndirilecek birleştirilmiş ses yok.",
        podcast_export_too_large: "Birleştirilmiş ses dışa aktarmak için çok büyük.",
        podcast_media_not_found: "Bir bölümün ses dosyası eksik.",
        podcast_segment_not_found: "Bölüm bulunamadı.",
      },
      ar: {
        podcast_segment_audio_missing: "يوجد مقطع بلا صوت بعد. استورده أو أنشئه أولاً.",
        podcast_reference_required: "تحتاج هذه الشخصية إلى صوت مرجعي قبل الإنشاء.",
        podcast_reference_text_required: "تحتاج هذه الشخصية إلى نص مرجعي.",
        podcast_voice_description_required: "تحتاج هذه الشخصية إلى وصف للصوت.",
        podcast_segment_character_required: "يوجد مقطع بلا شخصية معيّنة.",
        podcast_segment_text_required: "يوجد مقطع بلا نص منطوق.",
        podcast_segments_required: "أضف مقطعاً واحداً على الأقل قبل الإنشاء.",
        podcast_consent_required: "أكّد ملكية الصوت أو الإذن قبل الاستنساخ.",
        podcast_conflict: "تغيّر المشروع في مكان آخر. أعد التحميل وحاول مجدداً.",
        podcast_not_found: "المشروع غير موجود.",
        podcast_limit: "تم بلوغ حد المشاريع.",
        podcast_character_not_found: "الشخصية غير موجودة.",
        podcast_busy: "المشروع مشغول.",
        local_model_not_ready: "النموذج المحدد غير جاهز.",
        job_already_running: "يوجد إنشاء آخر قيد التشغيل.",
        podcast_import_limit: "الصوت المستورد يتجاوز حد الحجم أو المدة.",
        podcast_export_not_found: "لا يوجد صوت مجمّع للتنزيل بعد.",
        podcast_export_too_large: "الصوت المجمّع أكبر من أن يُصدَّر.",
        podcast_media_not_found: "ملف صوت مقطع مفقود.",
        podcast_segment_not_found: "المقطع غير موجود.",
      },
      vi: {
        podcast_segment_audio_missing: "Có đoạn chưa có âm thanh. Hãy nhập hoặc tạo trước.",
        podcast_reference_required: "Nhân vật này cần giọng tham chiếu trước khi tạo.",
        podcast_reference_text_required: "Nhân vật này cần bản ghi tham chiếu.",
        podcast_voice_description_required: "Nhân vật này cần mô tả giọng.",
        podcast_segment_character_required: "Có đoạn chưa gán nhân vật.",
        podcast_segment_text_required: "Có đoạn chưa có lời thoại.",
        podcast_segments_required: "Thêm ít nhất một đoạn trước khi tạo.",
        podcast_consent_required: "Xác nhận quyền sở hữu hoặc được phép trước khi nhân bản.",
        podcast_conflict: "Dự án đã thay đổi ở nơi khác. Tải lại và thử lại.",
        podcast_not_found: "Không tìm thấy dự án.",
        podcast_limit: "Đã đạt giới hạn dự án.",
        podcast_character_not_found: "Không tìm thấy nhân vật.",
        podcast_busy: "Dự án đang bận.",
        local_model_not_ready: "Mô hình đã chọn chưa sẵn sàng.",
        job_already_running: "Đã có tác vụ tạo khác đang chạy.",
        podcast_import_limit: "Âm thanh nhập vượt giới hạn kích thước hoặc thời lượng.",
        podcast_export_not_found: "Chưa có âm thanh ghép để tải.",
        podcast_export_too_large: "Âm thanh ghép quá lớn để xuất.",
        podcast_media_not_found: "Thiếu tệp âm thanh của một đoạn.",
        podcast_segment_not_found: "Không tìm thấy đoạn.",
      },
      id: {
        podcast_segment_audio_missing: "Ada segmen yang belum punya audio. Impor atau buat dulu.",
        podcast_reference_required: "Karakter ini butuh suara referensi sebelum membuat.",
        podcast_reference_text_required: "Karakter ini butuh transkrip referensi.",
        podcast_voice_description_required: "Karakter ini butuh deskripsi suara.",
        podcast_segment_character_required: "Ada segmen tanpa karakter.",
        podcast_segment_text_required: "Ada segmen tanpa teks ucapan.",
        podcast_segments_required: "Tambahkan setidaknya satu segmen sebelum membuat.",
        podcast_consent_required: "Konfirmasi kepemilikan atau izin sebelum mengkloning.",
        podcast_conflict: "Proyek berubah di tempat lain. Muat ulang dan coba lagi.",
        podcast_not_found: "Proyek tidak ditemukan.",
        podcast_limit: "Batas proyek tercapai.",
        podcast_character_not_found: "Karakter tidak ditemukan.",
        podcast_busy: "Proyek sedang sibuk.",
        local_model_not_ready: "Model yang dipilih belum siap.",
        job_already_running: "Pembuatan lain sedang berjalan.",
        podcast_import_limit: "Audio yang diimpor melebihi batas ukuran atau durasi.",
        podcast_export_not_found: "Belum ada audio gabungan untuk diunduh.",
        podcast_export_too_large: "Audio gabungan terlalu besar untuk diekspor.",
        podcast_media_not_found: "File audio segmen hilang.",
        podcast_segment_not_found: "Segmen tidak ditemukan.",
      },
      ru: {
        podcast_segment_audio_missing: "У сегмента ещё нет аудио. Сначала импортируйте или создайте его.",
        podcast_reference_required: "Этому персонажу нужен эталонный голос перед генерацией.",
        podcast_reference_text_required: "Этому персонажу нужна эталонная расшифровка.",
        podcast_voice_description_required: "Этому персонажу нужно описание голоса.",
        podcast_segment_character_required: "У сегмента не назначен персонаж.",
        podcast_segment_text_required: "У сегмента нет произносимого текста.",
        podcast_segments_required: "Добавьте хотя бы один сегмент перед генерацией.",
        podcast_consent_required: "Подтвердите владение голосом или разрешение перед клонированием.",
        podcast_conflict: "Проект изменился в другом месте. Перезагрузите и повторите.",
        podcast_not_found: "Проект не найден.",
        podcast_limit: "Достигнут лимит проектов.",
        podcast_character_not_found: "Персонаж не найден.",
        podcast_busy: "Проект занят.",
        local_model_not_ready: "Выбранная модель не готова.",
        job_already_running: "Другая генерация уже выполняется.",
        podcast_import_limit: "Импортированное аудио превышает лимит размера или длительности.",
        podcast_export_not_found: "Собранного аудио для скачивания ещё нет.",
        podcast_export_too_large: "Собранное аудио слишком велико для экспорта.",
        podcast_media_not_found: "Аудиофайл сегмента отсутствует.",
        podcast_segment_not_found: "Сегмент не найден.",
      },
    };
    const $ = id => document.querySelector(`#podcast-${id}`);
    const lang = () => document.querySelector("#language").value;
    const text = key => (messages[lang()] || messages.en)[keys.indexOf(key)] || key;
    const errorText = code => (errorMessages[lang()] || errorMessages.en)[code] || code;
    const statusText = status => text(({draft: "saved", idle: "saved", loading: "queued", assembling: "running",
      cancelling: "cancel", ready: "completed"})[status] || status || "unsaved");
  const activeStates = ["queued", "loading", "running", "cancelling"];
  let project = null, dirty = false, working = false, available = false, modelReady = false;
  let speechModels = [];
  let musicLibrary = [];
  let musicLibraryError = "";
  let timer = null;
  const audioPlayers = new Map();
  const musicSelections = new Map();
  const active = () => working || activeStates.includes(project?.status);
  const externalBusy = () => Boolean(window.MiniMuvMVHost?.state().externalBusy) ||
    Boolean(window.MiniMuvMVGeneration?.active()) || Boolean(window.MiniMuvMVHost?.state().analysisBusy);
  const sourceOf = segment => segment?.source === "imported" ? "imported" : "generated";
  const hasSegmentAudio = segment => Boolean(segment?.media || segment?.audio_url);
  function message(value, error = false) {
    $("message").textContent = value;
    $("message").hidden = !value;
    $("message").classList.toggle("error", error);
  }
  async function request(url, body, headers = {}) {
    const response = await fetch(url, body === undefined ? {cache: "no-store"} : {
      method: "POST", headers: body instanceof Blob ? headers : {"Content-Type": "application/json", ...headers},
      body: body instanceof Blob ? body : JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(errorText(data.error) || data.detail || `HTTP ${response.status}`);
    return data;
  }
  function changed() {
    dirty = true;
    $("state").textContent = text("unsaved");
    updateControls();
  }
  function updateControls() {
    const selectedModel = project?.settings?.model || "fish-s2-pro-8bit";
    modelReady = speechModels.some(model => model.id === selectedModel && model.ready);
    const locked = active() || !available;
    const segments = project?.segments || [];
    const missingGeneratedAudio = segments.some(segment =>
      sourceOf(segment) === "generated" && !hasSegmentAudio(segment));
    const canAssemble = segments.length > 0 && segments.every(hasSegmentAudio);
    $("form").querySelectorAll("input, textarea, select, button").forEach(el => { el.disabled = locked; });
    $("model").disabled = locked;
    $("cancel").disabled = !available || working || !activeStates.includes(project?.status);
    $("generate").disabled = locked || externalBusy() || !modelReady ||
      !(missingGeneratedAudio || (dirty && segments.some(segment => sourceOf(segment) === "generated")));
    $("assemble").disabled = locked || externalBusy() || !canAssemble;
    $("project").disabled = active() || !available;
    $("new").disabled = active() || !available;
    $("refresh").disabled = working;
    $("add-character").disabled ||= (project?.characters?.length || 0) >= 12;
    $("add-segment").disabled ||= (project?.segments?.length || 0) >= 100;
    const states = modelStates[lang()] || modelStates.en;
    $("availability").textContent = !available ? text("restart") : states[modelReady ? 0 : 1];
    $("model-notice").classList.toggle("ready", available && modelReady);
    $("segments").querySelectorAll("[data-move]").forEach(el => {
      const index = project.segments.findIndex(segment => segment.id === el.dataset.id);
      el.disabled ||= index + Number(el.dataset.move) < 0 || index + Number(el.dataset.move) >= project.segments.length;
    });
    $("segments").querySelectorAll("[data-podcast-import-music]").forEach(el => {
      el.disabled = locked || Boolean(musicLibraryError) || musicLibrary.length === 0;
    });
  }
  function localize() {
    document.querySelectorAll("[data-podcast-i18n]").forEach(el => { el.textContent = text(el.dataset.podcastI18n); });
    $("segments").querySelectorAll("[data-source-group]").forEach(el => {
      el.setAttribute("aria-label", text("source"));
    });
    updateMusicOptions();
    $("panel").querySelectorAll("[data-purpose]").forEach(select => {
      Array.from(select.options).forEach((option, i) => { option.textContent = (purposes[lang()] || purposes.en)[i]; });
    });
    $("panel").querySelectorAll("[data-status]").forEach(el => { el.textContent = statusText(el.dataset.status); });
    $("state").textContent = dirty ? text("unsaved") : projectState();
    updateControls();
  }
  function updateMusicOptions() {
    $("segments").querySelectorAll("[data-music-select]").forEach(select => {
      const id = select.dataset.musicSelect;
      const previous = musicSelections.get(id);
      const selected = musicLibrary.some(item => item.id === previous) ? previous : musicLibrary[0]?.id || "";
      select.replaceChildren(...musicLibrary.map(item => new Option(item.label, item.id)));
      select.value = selected;
      musicSelections.set(id, selected);
      select.hidden = musicLibrary.length === 0 || Boolean(musicLibraryError);
    });
    $("segments").querySelectorAll("[data-music-state]").forEach(hint => {
      hint.hidden = !musicLibraryError && musicLibrary.length > 0;
      hint.textContent = text(musicLibraryError ? "musicFailed" : "musicEmpty") +
        (musicLibraryError ? ` ${musicLibraryError}` : "");
      hint.classList.toggle("error", Boolean(musicLibraryError));
    });
  }
  function updateSpeechModelOptions() {
    const select = $("model");
    const current = project?.settings?.model || "fish-s2-pro-8bit";
    const options = speechModels.map(model => new Option(
      `${model.name || model.id}${model.ready ? "" : ` — ${text("unavailable")}`}`, model.id));
    if (!speechModels.some(model => model.id === current)) options.unshift(new Option(current, current));
    select.replaceChildren(...options);
    select.value = current;
    const selected = Array.from(select.options).find(option => option.value === current);
    $("model-summary").textContent = selected?.textContent || selected?.text || current;
    const fish = current === "fish-s2-pro-8bit";
    $("speed-control").hidden = !fish;
    $("temperature-control").hidden = current === "voxcpm2-4bit";
    renderSpeechModelInfo();
  }
  function renderSpeechModelInfo() {
    const current = project?.settings?.model || "fish-s2-pro-8bit";
    const model = speechModels.find(item => item.id === current) || {id: current};
    const ready = model.ready === true;
    const states = modelStates[lang()] || modelStates.en;
    $("availability").textContent = states[ready ? 0 : 1];
    $("model-description").textContent = [
      model.model_path, model.model_error, model.runtime_error
    ].filter(Boolean).join(" · ");
    const download = model.download_state ? model : {
      ...model,
      download_state: model.model_ready ? "completed" : "not_started",
      download_percent: model.model_ready ? 100 : null,
    };
    window.renderLocalModelDownload?.(download, "podcast-model-download-info");
    const source = $("model-source");
    source.hidden = !model.model_download_url;
    source.textContent = `${model.name || model.id} ↗`;
    if (model.model_download_url) source.href = model.model_download_url;
    else source.removeAttribute("href");
  }
  function field(card, key, id, value, kind = "text") {
    const label = document.createElement("label");
    label.className = "field-label"; label.htmlFor = id;
    label.dataset.podcastI18n = key;
    const input = document.createElement(kind === "textarea" ? "textarea" : "input");
    input.id = id;
    if (kind !== "textarea") input.type = kind;
    if (kind === "checkbox") input.checked = value;
    else input.value = value ?? "";
    card.append(label, input);
    return input;
  }
  function button(card, key, action) {
    const el = document.createElement("button");
    el.type = "button"; el.className = "workflow-secondary"; el.dataset.podcastI18n = key;
    el.addEventListener("click", action); card.append(el);
    return el;
  }
  function selectField(card, key, id, options, value) {
    const label = document.createElement("label");
    label.className = "field-label"; label.htmlFor = id; label.dataset.podcastI18n = key;
    const select = document.createElement("select");
    select.id = id; select.replaceChildren(...options.map(([name, val]) => new Option(name, val)));
    select.value = value || "";
    card.append(label, select); return select;
  }
  function syncAudio(player, url) {
    if (url && player.getAttribute("src") !== url) player.src = url;
    if (!url) { player.pause(); player.removeAttribute("src"); }
    player.hidden = !url;
  }
  function render() {
    audioPlayers.forEach(player => player.pause());
    audioPlayers.clear();
    $("characters").replaceChildren();
    $("segments").replaceChildren();
    $("name").value = project?.name || "";
    updateSpeechModelOptions();
    $("model").value = project?.settings?.model || "fish-s2-pro-8bit";
    $("speed").value = project?.settings?.speed ?? 1;
    $("temperature").value = project?.settings?.temperature ?? 0.7;
    for (const voice of project?.characters || []) {
      const card = document.createElement("article"); card.className = "podcast-card";
      const name = field(card, "voiceName", `voice-name-${voice.id}`, voice.name); name.maxLength = 120;
      name.addEventListener("input", () => {
        voice.name = name.value; changed();
        $("segments").querySelectorAll("select[data-character]").forEach(select => {
          Array.from(select.options).forEach(option => { if (option.value === voice.id) option.textContent = voice.name; });
        });
      });
      const transcript = field(card, "referenceText", `voice-text-${voice.id}`, voice.reference_text, "textarea");
      transcript.maxLength = 8000; transcript.rows = 3;
      transcript.addEventListener("input", () => { voice.reference_text = transcript.value; changed(); });
      const fishModel = (project?.settings?.model || "fish-s2-pro-8bit") === "fish-s2-pro-8bit";
      transcript.hidden = !fishModel;
      transcript.previousElementSibling.hidden = !fishModel;
      const voiceDescription = field(card, "voiceDescription", `voice-description-${voice.id}`,
        voice.voice_description || "", "textarea");
      voiceDescription.maxLength = 8000; voiceDescription.rows = 3;
      voiceDescription.hidden = fishModel;
      voiceDescription.previousElementSibling.hidden = fishModel;
      voiceDescription.addEventListener("input", () => { voice.voice_description = voiceDescription.value; changed(); });
      const consent = field(card, "consent", `voice-consent-${voice.id}`, voice.consent, "checkbox");
      consent.hidden = !fishModel;
      consent.previousElementSibling.hidden = !fishModel;
      consent.addEventListener("change", () => { voice.consent = consent.checked; changed(); });
      const actions = document.createElement("div"); actions.className = "workflow-actions";
      const upload = document.createElement("input");
      upload.type = "file"; upload.accept = ".wav,audio/wav"; upload.hidden = true;
      upload.setAttribute("aria-label", text("upload"));
      const uploadButton = button(actions, "upload", () => {
        if (!voice.consent || !voice.reference_text.trim()) {
          message(`${text("error")}: ${text("voiceHint")} ${text("consent")}`, true); return;
        }
        upload.click();
      });
      uploadButton.hidden = !fishModel;
      upload.addEventListener("change", () => uploadAudio(upload, `references/${voice.id}`, 100 * 1024 * 1024));
      button(actions, "remove", () => {
        project.characters = project.characters.filter(item => item.id !== voice.id);
        project.segments.forEach(segment => { if (segment.character_id === voice.id) segment.character_id = null; });
        changed(); render();
      });
      actions.append(upload); card.append(actions);
      if (voice.reference) {
        const hint = document.createElement("p"); hint.className = "field-hint";
        hint.dataset.podcastI18n = "referenceReady"; hint.hidden = !fishModel; card.append(hint);
      }
      const referenceUrl = voice.reference?.audio_url || voice.reference_url;
      if (referenceUrl) {
        const preview = document.createElement("audio");
        preview.controls = true; preview.preload = "none"; preview.src = referenceUrl; preview.hidden = !fishModel;
        preview.addEventListener("error", () => message(text("previewError"), true));
        card.append(preview); audioPlayers.set(`reference-${voice.id}`, preview);
      }
      $("characters").append(card);
    }
    for (const [index, segment] of (project?.segments || []).entries()) {
      const card = document.createElement("article");
      card.className = "podcast-card"; card.dataset.segmentId = segment.id;
      const heading = document.createElement("div"); heading.className = "workflow-heading";
      const number = document.createElement("strong"); number.textContent = String(index + 1);
      const status = document.createElement("span"); status.className = "status-chip";
      status.dataset.status = segment.status || "pending"; heading.append(number, status); card.append(heading);
      const sourceActions = document.createElement("div"); sourceActions.className = "podcast-source-switch";
      sourceActions.dataset.sourceGroup = "";
      sourceActions.setAttribute("role", "group");
      const sourceButtons = new Map();
      const syncSourceButtons = () => {
        for (const [name, el] of sourceButtons.entries()) {
          const selected = sourceOf(segment) === name;
          el.classList.toggle("active", selected);
          el.setAttribute("aria-pressed", selected ? "true" : "false");
        }
      };
      for (const [name, key] of [["generated", "fishSource"], ["imported", "audioSource"]]) {
        const sourceButton = button(sourceActions, key, () => {
          if (sourceOf(segment) === name) return;
          segment.source = name;
          if (name === "imported") segment.character_id = null;
          else if (!segment.character_id && project.characters[0]?.id) segment.character_id = project.characters[0].id;
          segment.status = "pending";
          segment.error = null;
          segment.media = null;
          segment.audio_url = null;
          segment.srt_url = null;
          segment.vtt_url = null;
          changed();
          render();
        });
        sourceButton.dataset.source = name;
        sourceButtons.set(name, sourceButton);
      }
      card.append(sourceActions);
      const character = selectField(card, "character", `segment-voice-${segment.id}`,
        [[text("import"), ""], ...project.characters.map(voice => [voice.name, voice.id])], segment.character_id);
      character.dataset.character = "";
      character.addEventListener("change", () => { segment.character_id = character.value || null; changed(); });
      character.hidden = sourceOf(segment) !== "generated";
      card.querySelector(`label[for="segment-voice-${segment.id}"]`).hidden = sourceOf(segment) !== "generated";
      const purpose = selectField(card, "purpose", `segment-purpose-${segment.id}`,
        purposeIds.map((id, i) => [(purposes[lang()] || purposes.en)[i], id]), segment.purpose);
      purpose.dataset.purpose = "";
      purpose.addEventListener("change", () => { segment.purpose = purpose.value; changed(); });
      const script = field(card, "text", `segment-text-${segment.id}`, segment.text, "textarea");
      script.rows = 4; script.maxLength = 8000;
      script.addEventListener("input", () => { segment.text = script.value; changed(); });
      const gap = field(card, "gap", `segment-gap-${segment.id}`, segment.gap_seconds, "number");
      gap.min = "0"; gap.max = "30"; gap.step = "0.1";
      gap.addEventListener("input", () => { segment.gap_seconds = Number(gap.value); changed(); });
      const actions = document.createElement("div"); actions.className = "workflow-actions";
      for (const [key, move] of [["up", -1], ["down", 1]]) {
        const el = button(actions, key, () => {
          const target = index + move;
          if (target < 0 || target >= project.segments.length) return;
          [project.segments[index], project.segments[target]] = [project.segments[target], project.segments[index]];
          changed(); render();
        });
        el.dataset.move = String(move); el.dataset.id = segment.id;
      }
      const upload = document.createElement("input");
      upload.type = "file"; upload.accept = ".wav,audio/wav"; upload.hidden = true;
      upload.setAttribute("aria-label", text("import"));
      upload.addEventListener("change", () => uploadAudio(upload, `imports/${segment.id}`, 100 * 1024 * 1024));
      const uploadButton = button(actions, "import", () => upload.click());
      uploadButton.hidden = sourceOf(segment) !== "imported";
      const musicSection = document.createElement("div"); musicSection.className = "podcast-music-picker";
      musicSection.hidden = sourceOf(segment) !== "imported";
      const musicLabel = document.createElement("label");
      musicLabel.className = "field-label"; musicLabel.dataset.podcastI18n = "musicHistory";
      const musicSelect = document.createElement("select");
      musicSelect.id = `segment-music-${segment.id}`; musicLabel.htmlFor = musicSelect.id;
      musicSelect.dataset.musicSelect = segment.id;
      const selectedMusic = musicSelections.get(segment.id) || musicLibrary[0]?.id || "";
      musicSelect.replaceChildren(
        ...musicLibrary.map(item => new Option(item.label, item.id)),
      );
      if (musicSelect.options.length > 0) musicSelect.value = selectedMusic;
      musicSelections.set(segment.id, musicSelect.value || "");
      musicSelect.addEventListener("change", () => { musicSelections.set(segment.id, musicSelect.value); });
      const fromMusic = document.createElement("button");
      fromMusic.type = "button";
      fromMusic.className = "workflow-secondary";
      fromMusic.dataset.podcastImportMusic = "";
      fromMusic.dataset.podcastI18n = "useMusic";
      fromMusic.disabled = musicSelect.options.length === 0;
      fromMusic.addEventListener("click", () => importHistoryAudio(segment.id, musicSelect.value));
      button(actions, "remove", () => {
        project.segments = project.segments.filter(item => item.id !== segment.id);
        musicSelections.delete(segment.id);
        changed(); render();
      });
      const musicState = document.createElement("p");
      musicState.className = "field-hint"; musicState.dataset.musicState = "";
      musicState.setAttribute("role", "status");
      musicSection.append(musicLabel, musicSelect, fromMusic, musicState);
      actions.append(upload); card.append(actions, musicSection);
      const hint = document.createElement("p"); hint.className = "field-hint";
      hint.dataset.podcastI18n = "importHint"; card.append(hint);
      hint.hidden = sourceOf(segment) !== "imported";
      const player = document.createElement("audio");
      player.controls = true; player.preload = "none";
      player.addEventListener("error", () => message(text("previewError"), true));
      syncAudio(player, segment.audio_url);
      card.append(player); audioPlayers.set(segment.id, player);
      const downloads = document.createElement("div");
      downloads.className = "workflow-actions";
      for (const kind of ["audio", "srt", "vtt"]) {
        const link = document.createElement("a");
        link.className = "model-source-link"; link.download = "";
        link.dataset.download = kind;
        if (kind === "audio") link.dataset.podcastI18n = "download";
        else link.textContent = kind === "srt" ? "SRT" : "WebVTT";
        downloads.append(link);
      }
      const detail = document.createElement("p");
      detail.className = "field-hint error"; detail.dataset.segmentError = "";
      card.append(downloads, detail);
      $("segments").append(card);
      syncSourceButtons();
    }
    updateResults(); localize();
  }
  let historyProjects = [];
  function updateResults() {
    for (const segment of project?.segments || []) {
      const card = Array.from($("segments").children).find(el => el.dataset.segmentId === segment.id);
      if (card) {
        const status = card.querySelector("[data-status]");
        status.dataset.status = segment.status || "pending"; status.textContent = statusText(status.dataset.status);
        const player = audioPlayers.get(segment.id);
        if (player) syncAudio(player, segment.audio_url);
        card.querySelectorAll("[data-download]").forEach(link => {
          const url = segment[`${link.dataset.download}_url`];
          if (url) link.href = url; else link.removeAttribute("href");
          link.hidden = !url;
        });
        const detail = card.querySelector("[data-segment-error]");
        if (detail) { detail.textContent = segment.error || ""; detail.hidden = !segment.error; }
      }
    }
    const exports = project?.exports;
    $("exports").hidden = !exports?.audio_url;
    if (project?.id) {
      historyProjects = [project, ...historyProjects.filter(item => item.id !== project.id)];
    }
    window.refreshResultPreview?.();
    window.renderHistory?.();
    for (const kind of ["audio", "srt", "vtt"]) {
      const el = $(`download-${kind}`), url = exports?.[`${kind}_url`];
      if (url) el.href = url; else el.removeAttribute("href");
    }
    $("logs").textContent = (project?.logs || []).join("\n");
    $("state").textContent = dirty ? text("unsaved") : projectState();
    if (project?.error) message(`${text("error")}: ${project.error}`, true);
    updateControls();
  }
  function projectState() {
    const progress = project?.progress;
    return statusText(project?.status) + (progress?.total ?
      ` · ${progress.completed}/${progress.total}` : "");
  }
  function payload() {
    return {
      name: $("name").value.trim(), settings: {...(project?.settings || {}),
        model: $("model").value || "fish-s2-pro-8bit",
        speed: Number($("speed").value), temperature: Number($("temperature").value)},
      characters: (project?.characters || []).map(({id, name, reference_text, voice_description, consent}) =>
        ({id, name, reference_text, voice_description: voice_description || "", consent})),
      segments: (project?.segments || []).map(({id, character_id, text, purpose, gap_seconds, source}) =>
        ({id, character_id, text, purpose, gap_seconds, source: sourceOf({source})})),
    };
  }
  async function save() {
    const body = payload();
    if (!body.name || !Number.isFinite(body.settings.speed) || body.settings.speed < 0.5 ||
      body.settings.speed > 2 || !Number.isFinite(body.settings.temperature) ||
      body.settings.temperature < 0 || body.settings.temperature > 2 ||
      body.segments.some(segment => !Number.isFinite(segment.gap_seconds) ||
        segment.gap_seconds < 0 || segment.gap_seconds > 30)) throw new Error(text("error"));
    const data = await request(project?.id ? `/api/podcasts/${project.id}/save` : "/api/podcasts",
      {...body, ...(project?.id ? {revision: project.revision} : {})});
    project = data.project; dirty = false; render();
    const exists = Array.from($("project").options).some(option => option.value === project.id);
    if (!exists) $("project").append(new Option(project.name, project.id));
    $("project").value = project.id;
    message(text("saved")); return project;
  }
  async function operation(action) {
    if (active() || !available) return;
    working = true; message(""); updateControls(); updateGenerateAvailability();
    try { await action(); } catch (error) { message(`${text("error")}: ${error.message}`, true); }
    finally { working = false; updateControls(); updateGenerateAvailability(); }
  }
  async function uploadAudio(input, route, limit) {
    const file = input.files[0];
    if (!file) return;
    await operation(async () => {
      if (!file.size || file.size > limit) throw new Error(text("voiceHint"));
      await save();
      const data = await request(`/api/podcasts/${project.id}/${route}`, file,
        {"Content-Type": "audio/wav", "X-Podcast-Revision": String(project.revision)});
      project = data.project; dirty = false; render(); message(text("saved"));
    });
    input.value = "";
  }
  async function importHistoryAudio(segmentId, itemId) {
    if (!itemId) return;
    await operation(async () => {
      const selected = musicLibrary.find(item => item.id === itemId);
      if (!selected?.audio_url) throw new Error(text("error"));
      await save();
      const fetched = await fetch(selected.audio_url, {cache: "no-store"});
      if (!fetched.ok) throw new Error(`HTTP ${fetched.status}`);
      const blob = await fetched.blob();
      if (!blob.size || blob.size > 100 * 1024 * 1024) throw new Error(text("voiceHint"));
      const data = await request(`/api/podcasts/${project.id}/imports/${segmentId}`, blob,
        {"Content-Type": "audio/wav", "X-Podcast-Revision": String(project.revision)});
      project = data.project; dirty = false; render(); message(text("saved"));
    });
  }
  function schedule() {
    clearTimeout(timer);
    if (activeStates.includes(project?.status)) timer = setTimeout(poll, 1500);
  }
  async function poll() {
    const id = project?.id;
    if (!id) return;
    try {
      const data = await request(`/api/podcasts/${id}`);
      if (id !== project?.id) return;
      project = data.project; updateResults(); updateGenerateAvailability(); schedule();
    } catch (error) {
      message(`${text("error")}: ${error.message}`, true);
      if (id === project?.id) timer = setTimeout(poll, 3000);
    }
  }
  async function refresh() {
    const response = await fetch("/api/podcasts", {cache: "no-store"});
    if (response.status === 404) { available = false; localize(); return; }
    const data = await response.json();
    if (!response.ok) throw new Error(errorText(data.error) || data.detail);
    try {
      const historyResponse = await fetch("/api/history", {cache: "no-store"});
      const history = await historyResponse.json();
      if (!historyResponse.ok) throw new Error(history.detail || history.error || `HTTP ${historyResponse.status}`);
      if (!Array.isArray(history.items)) throw new Error("Invalid music history response");
      musicLibrary = (history.items || []).filter(item => item.kind === "music" && item.audio_url).map(item => ({
        id: item.id,
        audio_url: item.audio_url,
        label: item.name || item.prompt || item.id,
      }));
      musicLibraryError = "";
    } catch (error) {
      musicLibrary = [];
      musicLibraryError = error.message;
    }
    available = data.available === true;
    speechModels = data.models || (data.model ? [data.model] : []);
    updateSpeechModelOptions();
    historyProjects = data.items || [];
    window.renderHistory?.();
    modelReady = data.model?.ready === true;
    const selected = project?.id || "";
    $("project").replaceChildren(new Option(text("new"), ""),
      ...(data.items || []).map(item => new Option(item.name, item.id)));
    $("project").value = selected; localize();
  }
  function fresh() {
    clearTimeout(timer); project = {name: "", characters: [], segments: [], settings: {model: "fish-s2-pro-8bit"}};
    dirty = false; render(); message(""); $("project").value = "";
  }
  async function openProject(id) {
    if (active() || working || (dirty && !confirm(text("discard")))) return;
    await operation(async () => {
      const data = await request(`/api/podcasts/${id}`);
      project = data.project; dirty = false;
      activeMode = "podcast"; localStorage.setItem("h3-mode", activeMode);
      updateModeUI(); render(); message(""); schedule();
    });
    $("project").value = project?.id || "";
  }
  $("name").addEventListener("input", () => { project.name = $("name").value; changed(); });
  $("model").addEventListener("change", () => {
    project.settings = {...project.settings, model: $("model").value};
    changed(); render();
  });
  for (const key of ["speed", "temperature"]) $(key).addEventListener("input", () => {
    project.settings = {...project.settings, [key]: Number($(key).value)};
    changed();
  });
  $("form").addEventListener("submit", event => { event.preventDefault(); operation(save); });
  $("new").addEventListener("click", () => { if (!dirty || confirm(text("discard"))) fresh(); });
  $("refresh").addEventListener("click", async () => {
    if (working) return;
    working = true; updateControls();
    try { await refresh(); } catch (error) { message(`${text("error")}: ${error.message}`, true); }
    finally { working = false; updateControls(); }
  });
  $("project").addEventListener("change", async () => {
    const id = $("project").value;
    if (!id) {
      if (!dirty || confirm(text("discard"))) fresh();
      else $("project").value = project?.id || "";
      return;
    }
    await openProject(id);
  });
  $("add-character").addEventListener("click", () => {
    project.characters.push({id: crypto.randomUUID(), name: "", reference_text: "", voice_description: "", consent: false});
    changed(); render();
  });
  $("add-segment").addEventListener("click", () => {
    project.segments.push({id: crypto.randomUUID(), character_id: project.characters[0]?.id || null,
      text: "", purpose: "story", gap_seconds: 0, source: "generated"});
    changed(); render();
  });
  for (const action of ["generate", "assemble"]) $(action).addEventListener("click", () => operation(async () => {
    await save();
    const data = await request(`/api/podcasts/${project.id}/${action}`, {revision: project.revision});
    project = data.project; render(); schedule();
  }));
  $("cancel").addEventListener("click", async () => {
    if (working || !project?.id) return;
    working = true; updateControls();
    try {
      const data = await request(`/api/podcasts/${project.id}/cancel`, {});
      project = data.project; updateResults(); schedule();
    } catch (error) { message(`${text("error")}: ${error.message}`, true); }
    finally { working = false; updateControls(); }
  });
  document.querySelector("#audio-result").addEventListener("error", () => {
    if (activeMode === "podcast") message(text("previewError"), true);
  });
  window.MiniMuvPodcast = {active, localize, updateControls, open: openProject,
    history: () => historyProjects,
    preview: () => project && ({id: project.id, status: project.status,
      audio_url: project.exports?.audio_url}),
    canLeave: () => !dirty || confirm(text("discard"))};
  for (const [language, row] of Object.entries(messages)) {
    Object.assign(translations[language], {modePodcast: row[0], podcastNote: row[1]});
  }
  document.querySelector("#podcast-mode-button").addEventListener("click", () => {
    activeMode = "podcast"; localStorage.setItem("h3-mode", activeMode); updateModeUI();
  });
  document.querySelector("#podcast-mode-button").disabled = false;
  window.addEventListener("beforeunload", event => {
    if (dirty) { event.preventDefault(); event.returnValue = ""; }
  });
  fresh(); updateModeUI();
  refresh().catch(error => { message(`${text("error")}: ${error.message}`, true); localize(); });
})();
