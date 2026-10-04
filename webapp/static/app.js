const translations = {
  "zh-CN": {
    localOnly: "本地运行 · 私密创作", language: "语言", eyebrow: "本地视频与音频生成",
    headline: "把想象，<span>变成视听。</span>", introCopy: "用 MiniMax H3 在你的 Mac 上，将文字生成同步的视频与立体声音频。",
    createLabel: "创作工作台", newGeneration: "新建生成", describe: "描述",
    checkingModels: "正在检查本地模型…", modelReady: "H3 模型已就绪", modelMissing: "缺少 H3 基础模型文件",
    modelFoundTransformer: "已检测到本地 8-bit transformer：", modelFoundNone: "未在 ~/.omlx/models 中找到 H3 transformer。",
    modelDownload: "下载基础 checkpoint ↗", transformerDownload: "下载 8-bit transformer ↗",
    promptLabel: "描述你想看到的画面", promptHint: "细节越丰富，画面越生动",
    promptPlaceholder: "例如：雨后的东京小巷，霓虹灯倒映在湿润的路面，一只橘猫从纸灯笼下缓缓走过，电影感镜头，远处传来轻柔的雨声。",
    promptPrivacy: "提示词仅在本机处理", duration: "时长", aspectRatio: "画面比例", quality: "采样步数",
    duration5: "5 秒", duration8: "8 秒", duration10: "10 秒", duration15: "15 秒",
    aspectLandscape: "16:9 横屏", aspectPortrait: "9:16 竖屏", aspectSquare: "1:1 方形",
    stepsFast: "9 · 较快（8 次计算）", stepsBalanced: "16 · 均衡（15 次计算）", stepsDetailed: "25 · 更多细节（24 次计算）",
    seed: "随机种子", modelSettings: "模型路径设置", checkpointPath: "H3 基础 checkpoint 文件夹",
    checkpointPlaceholder: "例如：/Users/你/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "需要包含 model_index.json、text_encoder、video_vae 和 audio_vae。",
    transformerPath: "Transformer（可选，量化版）", transformerHelp: "留空则使用基础 checkpoint 内的 transformer。",
    computeNote: "H3 在 768px 短边下计算量很大。5 秒、9 步在 M3 Ultra 上约需 1.2 小时；实际时间因设备而异。",
    generate: "生成视频与音频", generating: "正在生成…", previewLabel: "生成结果", previewTitle: "预览画布",
    waiting: "等待创作", previewEmpty: "你的下一个世界<br>将在这里出现", previewEmptyHint: "输入提示词，开始生成",
    preparing: "正在准备生成…", longRunning: "生成可能需要较长时间。可安全离开此页面，任务会在本机继续。",
    cancelGeneration: "取消生成", generatedLocally: "已在本机生成", downloadVideo: "下载视频",
    downloadAudio: "下载音频", generationLog: "生成日志", footerLocal: "模型推理完全在本机运行",
    queued: "排队中", running: "生成中", cancelling: "正在取消", cancelled: "已取消", completed: "已完成", failed: "生成失败",
    errInvalidPrompt: "请输入提示词（最多 4000 个字符）。", errCheckpoint: "请提供包含 H3 基础组件的有效 checkpoint 文件夹。请查看下方模型下载地址。",
    errTransformer: "Transformer 文件夹无效；请选择含 quant_config.json 和权重文件的 H3 transformer。",
    errRunning: "已有任务正在运行。请等待完成或取消后再试。", errInvalid: "请求参数无效，请检查时长、步数、比例和随机种子。",
    errGeneric: "无法启动生成，请查看日志。", restored: "已恢复本机生成任务状态。"
  },
  en: {
    localOnly: "LOCAL · PRIVATE", language: "Language", eyebrow: "LOCAL VIDEO + AUDIO GENERATION",
    headline: "Turn imagination <span>into motion.</span>", introCopy: "Create synchronized video and stereo audio from text with MiniMax H3 on your Mac.",
    createLabel: "CREATIVE WORKSPACE", newGeneration: "New generation", describe: "DESCRIBE",
    checkingModels: "Checking local models…", modelReady: "H3 model is ready", modelMissing: "H3 base model files are missing",
    modelFoundTransformer: "Local 8-bit transformer detected: ", modelFoundNone: "No H3 transformer found in ~/.omlx/models.",
    modelDownload: "Download base checkpoint ↗", transformerDownload: "Download 8-bit transformer ↗",
    promptLabel: "Describe what you want to see", promptHint: "More detail brings the scene to life",
    promptPlaceholder: "A narrow Tokyo street after rain, neon reflected on wet pavement. An orange cat walks beneath paper lanterns; cinematic framing and soft rain in the distance.",
    promptPrivacy: "Prompt stays on this device", duration: "Duration", aspectRatio: "Aspect ratio", quality: "Sampling steps",
    duration5: "5 sec", duration8: "8 sec", duration10: "10 sec", duration15: "15 sec",
    aspectLandscape: "16:9 Landscape", aspectPortrait: "9:16 Portrait", aspectSquare: "1:1 Square",
    stepsFast: "9 · Faster (8 passes)", stepsBalanced: "16 · Balanced (15 passes)", stepsDetailed: "25 · More detail (24 passes)",
    seed: "Seed", modelSettings: "Model paths", checkpointPath: "H3 base checkpoint folder",
    checkpointPlaceholder: "e.g. /Users/you/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Must contain model_index.json, text_encoder, video_vae, and audio_vae.",
    transformerPath: "Transformer (optional, quantized)", transformerHelp: "Leave empty to use the transformer in the base checkpoint.",
    computeNote: "H3 is compute-intensive at its 768px short edge. A 5-second, 9-step run took about 1.2 hours on an M3 Ultra; times vary by device.",
    generate: "Generate video + audio", generating: "Generating…", previewLabel: "YOUR CREATION", previewTitle: "Preview canvas",
    waiting: "READY WHEN YOU ARE", previewEmpty: "Your next world<br>will appear here", previewEmptyHint: "Enter a prompt to begin",
    preparing: "Preparing generation…", longRunning: "Generation may take a while. You can leave this page; the job continues locally.",
    cancelGeneration: "Cancel generation", generatedLocally: "Generated on this device", downloadVideo: "Download video",
    downloadAudio: "Download audio", generationLog: "Generation log", footerLocal: "Inference runs entirely on your device",
    queued: "Queued", running: "Generating", cancelling: "Cancelling", cancelled: "Cancelled", completed: "Complete", failed: "Generation failed",
    errInvalidPrompt: "Enter a prompt (up to 4,000 characters).", errCheckpoint: "Provide a valid H3 base checkpoint folder. See the model links below.",
    errTransformer: "Invalid transformer folder; choose an H3 transformer with quant_config.json and weights.",
    errRunning: "A job is already running. Wait for it to finish or cancel it first.", errInvalid: "Invalid request. Check duration, steps, aspect ratio, and seed.",
    errGeneric: "Could not start generation. Check the log.", restored: "Restored the local generation status."
  },
  "zh-TW": {
    localOnly: "本機執行 · 私密創作", language: "語言", eyebrow: "本機影片與音訊生成",
    headline: "把想像，<span>變成視聽。</span>", introCopy: "使用 MiniMax H3 在 Mac 上將文字生成同步影片與立體聲音訊。",
    createLabel: "創作工作台", newGeneration: "建立生成", describe: "描述",
    checkingModels: "正在檢查本機模型…", modelReady: "H3 模型已就緒", modelMissing: "缺少 H3 基礎模型檔案",
    modelFoundTransformer: "已偵測到本機 8-bit transformer：", modelFoundNone: "在 ~/.omlx/models 中找不到 H3 transformer。",
    modelDownload: "下載基礎 checkpoint ↗", transformerDownload: "下載 8-bit transformer ↗",
    promptLabel: "描述你想看到的畫面", promptHint: "細節越豐富，畫面越生動",
    promptPlaceholder: "例如：雨後的東京小巷，霓虹映在濕潤路面，一隻橘貓從紙燈籠下緩緩走過，電影感鏡頭，遠方傳來輕柔雨聲。",
    promptPrivacy: "提示詞僅在本機處理", duration: "時長", aspectRatio: "畫面比例", quality: "取樣步數",
    duration5: "5 秒", duration8: "8 秒", duration10: "10 秒", duration15: "15 秒",
    aspectLandscape: "16:9 橫向", aspectPortrait: "9:16 直向", aspectSquare: "1:1 方形",
    stepsFast: "9 · 較快（8 次計算）", stepsBalanced: "16 · 均衡（15 次計算）", stepsDetailed: "25 · 更多細節（24 次計算）",
    seed: "隨機種子", modelSettings: "模型路徑設定", checkpointPath: "H3 基礎 checkpoint 資料夾",
    checkpointPlaceholder: "例如：/Users/你/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "需包含 model_index.json、text_encoder、video_vae 和 audio_vae。",
    transformerPath: "Transformer（選填，量化版）", transformerHelp: "留空則使用基礎 checkpoint 內的 transformer。",
    computeNote: "H3 在 768px 短邊下運算量很大。5 秒、9 步在 M3 Ultra 約需 1.2 小時；實際時間因裝置而異。",
    generate: "生成影片與音訊", generating: "正在生成…", previewLabel: "生成結果", previewTitle: "預覽畫布",
    waiting: "等待創作", previewEmpty: "你的下一個世界<br>將在這裡出現", previewEmptyHint: "輸入提示詞，開始生成",
    preparing: "正在準備生成…", longRunning: "生成可能需要較長時間。可離開此頁，任務會在本機繼續。",
    cancelGeneration: "取消生成", generatedLocally: "已在本機生成", downloadVideo: "下載影片",
    downloadAudio: "下載音訊", generationLog: "生成日誌", footerLocal: "模型推理完全在本機執行",
    queued: "排隊中", running: "生成中", cancelling: "正在取消", cancelled: "已取消", completed: "已完成", failed: "生成失敗",
    errInvalidPrompt: "請輸入提示詞（最多 4000 個字元）。", errCheckpoint: "請提供有效的 H3 基礎 checkpoint 資料夾，請參考下方下載連結。",
    errTransformer: "Transformer 資料夾無效；請選擇包含 quant_config.json 和權重的 H3 transformer。",
    errRunning: "已有任務正在執行，請等待完成或先取消。", errInvalid: "請求參數無效，請檢查時長、步數、比例和隨機種子。",
    errGeneric: "無法啟動生成，請查看日誌。", restored: "已還原本機生成任務狀態。"
  },
  fr: {
    localOnly: "LOCAL · PRIVÉ", language: "Langue", eyebrow: "GÉNÉRATION VIDÉO + AUDIO LOCALE",
    headline: "L’imagination <span>prend vie.</span>", introCopy: "Créez une vidéo synchronisée et un son stéréo avec MiniMax H3 sur votre Mac.",
    createLabel: "ESPACE CRÉATIF", newGeneration: "Nouvelle génération", describe: "DÉCRIRE",
    checkingModels: "Recherche des modèles locaux…", modelReady: "Modèle H3 prêt", modelMissing: "Fichiers du modèle H3 manquants",
    modelFoundTransformer: "Transformer 8 bits détecté : ", modelFoundNone: "Aucun transformer H3 dans ~/.omlx/models.",
    modelDownload: "Télécharger le checkpoint ↗", transformerDownload: "Télécharger le transformer 8 bits ↗",
    promptLabel: "Décrivez la scène souhaitée", promptHint: "Les détails donnent vie à la scène",
    promptPlaceholder: "Une ruelle de Tokyo après la pluie, des néons se reflètent au sol. Un chat roux passe sous des lanternes en papier, cadrage cinématographique et pluie douce au loin.",
    promptPrivacy: "Le prompt reste sur cet appareil", duration: "Durée", aspectRatio: "Format", quality: "Étapes d’échantillonnage",
    duration5: "5 s", duration8: "8 s", duration10: "10 s", duration15: "15 s",
    aspectLandscape: "16:9 Paysage", aspectPortrait: "9:16 Portrait", aspectSquare: "1:1 Carré",
    stepsFast: "9 · Rapide (8 passes)", stepsBalanced: "16 · Équilibré (15 passes)", stepsDetailed: "25 · Plus de détails (24 passes)",
    seed: "Graine", modelSettings: "Chemins des modèles", checkpointPath: "Dossier du checkpoint H3",
    checkpointPlaceholder: "ex. /Users/vous/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Doit contenir model_index.json, text_encoder, video_vae et audio_vae.",
    transformerPath: "Transformer (facultatif, quantifié)", transformerHelp: "Vide : utilise le transformer du checkpoint.",
    computeNote: "H3 est très exigeant en calcul à 768 px. 5 s et 9 étapes prennent environ 1,2 h sur M3 Ultra ; la durée varie selon l’appareil.",
    generate: "Générer vidéo + audio", generating: "Génération…", previewLabel: "VOTRE CRÉATION", previewTitle: "Aperçu",
    waiting: "EN ATTENTE", previewEmpty: "Votre prochain monde<br>apparaîtra ici", previewEmptyHint: "Saisissez un prompt pour commencer",
    preparing: "Préparation…", longRunning: "La génération peut durer. Vous pouvez quitter cette page ; la tâche continue localement.",
    cancelGeneration: "Annuler la génération", generatedLocally: "Généré sur cet appareil", downloadVideo: "Télécharger la vidéo",
    downloadAudio: "Télécharger l’audio", generationLog: "Journal", footerLocal: "L’inférence s’exécute sur votre appareil",
    queued: "En attente", running: "Génération", cancelling: "Annulation", cancelled: "Annulé", completed: "Terminé", failed: "Échec",
    errInvalidPrompt: "Saisissez un prompt (4 000 caractères maximum).", errCheckpoint: "Indiquez un checkpoint H3 valide. Consultez les liens de téléchargement.",
    errTransformer: "Dossier transformer invalide : sélectionnez un transformer H3 avec config et poids.",
    errRunning: "Une tâche est déjà en cours. Attendez ou annulez-la.", errInvalid: "Paramètres invalides : vérifiez durée, étapes, format et graine.",
    errGeneric: "Impossible de lancer la génération. Consultez le journal.", restored: "État de la tâche locale restauré."
  },
  de: {
    localOnly: "LOKAL · PRIVAT", language: "Sprache", eyebrow: "LOKALE VIDEO- UND AUDIOGENERIERUNG",
    headline: "Vorstellungen <span>werden lebendig.</span>", introCopy: "Erzeuge synchronisiertes Video und Stereo-Audio mit MiniMax H3 auf deinem Mac.",
    createLabel: "KREATIVWERKSTATT", newGeneration: "Neue Generierung", describe: "BESCHREIBEN",
    checkingModels: "Lokale Modelle werden geprüft…", modelReady: "H3-Modell ist bereit", modelMissing: "H3-Basismodell fehlt",
    modelFoundTransformer: "Lokaler 8-Bit-Transformer erkannt: ", modelFoundNone: "Kein H3-Transformer in ~/.omlx/models gefunden.",
    promptLabel: "Beschreibe die gewünschte Szene", promptHint: "Mehr Details erwecken die Szene zum Leben",
    promptPlaceholder: "Eine Gasse in Tokio nach dem Regen, Neon spiegelt sich auf dem nassen Boden. Eine orange Katze läuft unter Papierlaternen hindurch, filmische Perspektive, leiser Regen in der Ferne.",
    promptPrivacy: "Prompt bleibt auf diesem Gerät", duration: "Dauer", aspectRatio: "Seitenverhältnis", quality: "Sampling-Schritte",
    duration5: "5 Sek.", duration8: "8 Sek.", duration10: "10 Sek.", duration15: "15 Sek.",
    aspectLandscape: "16:9 Querformat", aspectPortrait: "9:16 Hochformat", aspectSquare: "1:1 Quadrat",
    stepsFast: "9 · Schnell (8 Durchläufe)", stepsBalanced: "16 · Ausgewogen (15 Durchläufe)", stepsDetailed: "25 · Mehr Details (24 Durchläufe)",
    seed: "Seed", modelSettings: "Modellpfade", checkpointPath: "H3-Basis-Checkpoint-Ordner",
    checkpointPlaceholder: "z. B. /Users/du/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Muss model_index.json, text_encoder, video_vae und audio_vae enthalten.",
    transformerPath: "Transformer (optional, quantisiert)", transformerHelp: "Leer lassen, um den Transformer des Checkpoints zu verwenden.",
    computeNote: "H3 benötigt bei 768 px kurzer Kante viel Rechenleistung. 5 s und 9 Schritte dauerten auf M3 Ultra etwa 1,2 h; je nach Gerät unterschiedlich.",
    generate: "Video + Audio erzeugen", generating: "Wird generiert…", previewLabel: "DEIN ERGEBNIS", previewTitle: "Vorschau",
    waiting: "BEREIT", previewEmpty: "Deine nächste Welt<br>erscheint hier", previewEmptyHint: "Prompt eingeben und starten",
    preparing: "Generierung wird vorbereitet…", longRunning: "Die Generierung kann dauern. Du kannst die Seite verlassen; der Auftrag läuft lokal weiter.",
    cancelGeneration: "Generierung abbrechen", generatedLocally: "Lokal generiert", downloadVideo: "Video herunterladen",
    downloadAudio: "Audio herunterladen", generationLog: "Generierungsprotokoll", footerLocal: "Inferenz läuft vollständig lokal",
    queued: "Warteschlange", running: "Generierung", cancelling: "Abbruch läuft", cancelled: "Abgebrochen", completed: "Abgeschlossen", failed: "Fehlgeschlagen",
    errInvalidPrompt: "Prompt eingeben (maximal 4.000 Zeichen).", errCheckpoint: "Gültigen H3-Basis-Checkpoint angeben. Downloadlinks siehe unten.",
    errTransformer: "Ungültiger Transformer-Ordner; H3-Transformer mit Konfiguration und Gewichten wählen.",
    errRunning: "Ein Auftrag läuft bereits. Bitte warten oder abbrechen.", errInvalid: "Ungültige Angaben: Dauer, Schritte, Format und Seed prüfen.",
    errGeneric: "Generierung konnte nicht gestartet werden. Protokoll prüfen.", restored: "Lokaler Generierungsstatus wiederhergestellt."
  },
  ja: {
    localOnly: "ローカル実行 · プライベート", language: "言語", eyebrow: "ローカル動画・音声生成",
    headline: "想像を、<span>映像に。</span>", introCopy: "Mac 上の MiniMax H3 で、テキストから映像とステレオ音声を生成します。",
    createLabel: "クリエイティブワークスペース", newGeneration: "新しい生成", describe: "説明",
    checkingModels: "ローカルモデルを確認中…", modelReady: "H3 モデルの準備完了", modelMissing: "H3 の基本モデルファイルがありません",
    modelFoundTransformer: "ローカル 8-bit transformer を検出: ", modelFoundNone: "~/.omlx/models に H3 transformer が見つかりません。",
    modelDownload: "基本 checkpoint をダウンロード ↗", transformerDownload: "8-bit transformer をダウンロード ↗",
    promptLabel: "見たいシーンを説明してください", promptHint: "細部まで書くと表現が豊かになります",
    promptPlaceholder: "雨上がりの東京の路地。濡れた路面にネオンが映り、提灯の下を茶トラ猫がゆっくり歩く。映画のような構図、遠くから優しい雨音。",
    promptPrivacy: "プロンプトはこの端末内で処理", duration: "長さ", aspectRatio: "アスペクト比", quality: "サンプリングステップ",
    duration5: "5 秒", duration8: "8 秒", duration10: "10 秒", duration15: "15 秒",
    aspectLandscape: "16:9 横向き", aspectPortrait: "9:16 縦向き", aspectSquare: "1:1 正方形",
    stepsFast: "9 · 高速（8 回）", stepsBalanced: "16 · 標準（15 回）", stepsDetailed: "25 · 高精細（24 回）",
    seed: "シード値", modelSettings: "モデルパス設定", checkpointPath: "H3 基本 checkpoint フォルダー",
    checkpointPlaceholder: "例: /Users/you/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "model_index.json、text_encoder、video_vae、audio_vae が必要です。",
    transformerPath: "Transformer（任意・量子化版）", transformerHelp: "空欄の場合は基本 checkpoint 内の transformer を使用します。",
    computeNote: "短辺 768px の H3 は計算量が大きく、M3 Ultra で 5 秒・9 ステップに約 1.2 時間かかります。時間は端末により異なります。",
    generate: "動画と音声を生成", generating: "生成中…", previewLabel: "生成結果", previewTitle: "プレビュー",
    waiting: "待機中", previewEmpty: "新しい世界が<br>ここに現れます", previewEmptyHint: "プロンプトを入力して開始",
    preparing: "生成を準備中…", longRunning: "生成には時間がかかる場合があります。ページを離れてもローカルで処理を続けます。",
    cancelGeneration: "生成をキャンセル", generatedLocally: "この端末で生成", downloadVideo: "動画をダウンロード",
    downloadAudio: "音声をダウンロード", generationLog: "生成ログ", footerLocal: "推論はすべてローカルで実行",
    queued: "待機中", running: "生成中", cancelling: "キャンセル中", cancelled: "キャンセル済み", completed: "完了", failed: "失敗",
    errInvalidPrompt: "プロンプトを入力してください（最大 4000 文字）。", errCheckpoint: "有効な H3 基本 checkpoint フォルダーを指定してください。下のリンクを参照。",
    errTransformer: "Transformer フォルダーが無効です。設定ファイルと重みを含む H3 transformer を選択してください。",
    errRunning: "別の処理が実行中です。完了またはキャンセル後に再試行してください。", errInvalid: "設定を確認してください（長さ、ステップ、比率、シード）。",
    errGeneric: "生成を開始できません。ログを確認してください。", restored: "ローカル生成の状態を復元しました。"
  },
  ko: {
    localOnly: "로컬 실행 · 비공개", language: "언어", eyebrow: "로컬 비디오 및 오디오 생성",
    headline: "상상을 <span>영상으로.</span>", introCopy: "Mac의 MiniMax H3로 텍스트에서 동기화된 비디오와 스테레오 오디오를 만드세요.",
    createLabel: "크리에이티브 작업 공간", newGeneration: "새 생성", describe: "설명",
    checkingModels: "로컬 모델 확인 중…", modelReady: "H3 모델 준비 완료", modelMissing: "H3 기본 모델 파일이 없습니다",
    modelFoundTransformer: "로컬 8-bit transformer 감지: ", modelFoundNone: "~/.omlx/models에서 H3 transformer를 찾을 수 없습니다.",
    modelDownload: "기본 checkpoint 다운로드 ↗", transformerDownload: "8-bit transformer 다운로드 ↗",
    promptLabel: "원하는 장면을 설명하세요", promptHint: "세부 묘사가 장면을 생생하게 만듭니다",
    promptPlaceholder: "비 온 뒤 도쿄 골목, 젖은 바닥에 비치는 네온. 종이 등불 아래를 천천히 걷는 주황 고양이, 영화 같은 구도와 멀리서 들리는 잔잔한 빗소리.",
    promptPrivacy: "프롬프트는 이 기기에서만 처리됩니다", duration: "길이", aspectRatio: "화면 비율", quality: "샘플링 단계",
    duration5: "5초", duration8: "8초", duration10: "10초", duration15: "15초",
    aspectLandscape: "16:9 가로", aspectPortrait: "9:16 세로", aspectSquare: "1:1 정사각형",
    stepsFast: "9 · 빠름 (8회)", stepsBalanced: "16 · 균형 (15회)", stepsDetailed: "25 · 더 세밀하게 (24회)",
    seed: "시드", modelSettings: "모델 경로 설정", checkpointPath: "H3 기본 checkpoint 폴더",
    checkpointPlaceholder: "예: /Users/you/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "model_index.json, text_encoder, video_vae, audio_vae가 있어야 합니다.",
    transformerPath: "Transformer (선택 사항, 양자화)", transformerHelp: "비워 두면 기본 checkpoint의 transformer를 사용합니다.",
    computeNote: "768px 짧은 변 기준 H3는 연산량이 큽니다. M3 Ultra에서 5초, 9단계 생성에 약 1.2시간이 걸렸으며 기기마다 다릅니다.",
    generate: "비디오 및 오디오 생성", generating: "생성 중…", previewLabel: "생성 결과", previewTitle: "미리보기",
    waiting: "대기 중", previewEmpty: "새로운 세계가<br>여기에 나타납니다", previewEmptyHint: "프롬프트를 입력해 시작하세요",
    preparing: "생성 준비 중…", longRunning: "생성에 시간이 걸릴 수 있습니다. 페이지를 나가도 작업은 로컬에서 계속됩니다.",
    cancelGeneration: "생성 취소", generatedLocally: "이 기기에서 생성됨", downloadVideo: "비디오 다운로드",
    downloadAudio: "오디오 다운로드", generationLog: "생성 로그", footerLocal: "추론은 전적으로 로컬에서 실행됩니다",
    queued: "대기열", running: "생성 중", cancelling: "취소 중", cancelled: "취소됨", completed: "완료", failed: "생성 실패",
    errInvalidPrompt: "프롬프트를 입력하세요 (최대 4,000자).", errCheckpoint: "유효한 H3 기본 checkpoint 폴더를 입력하세요. 아래 다운로드 링크를 확인하세요.",
    errTransformer: "Transformer 폴더가 올바르지 않습니다. 설정과 가중치가 있는 H3 transformer를 선택하세요.",
    errRunning: "이미 작업이 실행 중입니다. 완료 또는 취소 후 다시 시도하세요.", errInvalid: "요청 값이 올바르지 않습니다. 길이, 단계, 비율, 시드를 확인하세요.",
    errGeneric: "생성을 시작할 수 없습니다. 로그를 확인하세요.", restored: "로컬 생성 상태를 복원했습니다."
  },
  es: {
    localOnly: "LOCAL · PRIVADO", language: "Idioma", eyebrow: "GENERACIÓN LOCAL DE VÍDEO Y AUDIO",
    headline: "La imaginación <span>cobra vida.</span>", introCopy: "Crea vídeo sincronizado y audio estéreo con MiniMax H3 en tu Mac.",
    createLabel: "ESPACIO CREATIVO", newGeneration: "Nueva generación", describe: "DESCRIBIR",
    checkingModels: "Buscando modelos locales…", modelReady: "Modelo H3 listo", modelMissing: "Faltan archivos del modelo base H3",
    modelFoundTransformer: "Transformer local de 8 bits detectado: ", modelFoundNone: "No se encontró ningún transformer H3 en ~/.omlx/models.",
    modelDownload: "Descargar checkpoint base ↗", transformerDownload: "Descargar transformer de 8 bits ↗",
    promptLabel: "Describe lo que quieres ver", promptHint: "Cuantos más detalles, más viva la escena",
    promptPlaceholder: "Un callejón de Tokio tras la lluvia, neones reflejados en el suelo mojado. Un gato naranja pasa bajo farolillos; encuadre cinematográfico y lluvia suave a lo lejos.",
    promptPrivacy: "El prompt permanece en este dispositivo", duration: "Duración", aspectRatio: "Proporción", quality: "Pasos de muestreo",
    duration5: "5 s", duration8: "8 s", duration10: "10 s", duration15: "15 s",
    aspectLandscape: "16:9 Horizontal", aspectPortrait: "9:16 Vertical", aspectSquare: "1:1 Cuadrado",
    stepsFast: "9 · Rápido (8 pasadas)", stepsBalanced: "16 · Equilibrado (15 pasadas)", stepsDetailed: "25 · Más detalle (24 pasadas)",
    seed: "Semilla", modelSettings: "Rutas de modelos", checkpointPath: "Carpeta del checkpoint base H3",
    checkpointPlaceholder: "p. ej. /Users/tú/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Debe incluir model_index.json, text_encoder, video_vae y audio_vae.",
    transformerPath: "Transformer (opcional, cuantizado)", transformerHelp: "Déjalo vacío para usar el transformer del checkpoint base.",
    computeNote: "H3 requiere mucho cálculo a 768 px. 5 s y 9 pasos tardaron unas 1,2 h en un M3 Ultra; varía según el equipo.",
    generate: "Generar vídeo + audio", generating: "Generando…", previewLabel: "TU CREACIÓN", previewTitle: "Vista previa",
    waiting: "EN ESPERA", previewEmpty: "Tu próximo mundo<br>aparecerá aquí", previewEmptyHint: "Escribe un prompt para comenzar",
    preparing: "Preparando generación…", longRunning: "La generación puede tardar. Puedes salir de esta página; la tarea seguirá localmente.",
    cancelGeneration: "Cancelar generación", generatedLocally: "Generado en este dispositivo", downloadVideo: "Descargar vídeo",
    downloadAudio: "Descargar audio", generationLog: "Registro de generación", footerLocal: "La inferencia se ejecuta íntegramente aquí",
    queued: "En cola", running: "Generando", cancelling: "Cancelando", cancelled: "Cancelado", completed: "Completado", failed: "Error",
    errInvalidPrompt: "Escribe un prompt (máximo 4.000 caracteres).", errCheckpoint: "Indica una carpeta de checkpoint H3 válida. Consulta los enlaces de descarga.",
    errTransformer: "Carpeta de transformer no válida; elige un transformer H3 con configuración y pesos.",
    errRunning: "Ya hay una tarea en curso. Espera o cancélala.", errInvalid: "Solicitud no válida: revisa duración, pasos, proporción y semilla.",
    errGeneric: "No se pudo iniciar la generación. Revisa el registro.", restored: "Estado de generación local restaurado."
  },
  pt: {
    localOnly: "LOCAL · PRIVADO", language: "Idioma", eyebrow: "GERAÇÃO LOCAL DE VÍDEO E ÁUDIO",
    headline: "A imaginação <span>ganha vida.</span>", introCopy: "Crie vídeo sincronizado e áudio estéreo com MiniMax H3 no seu Mac.",
    createLabel: "ESPAÇO CRIATIVO", newGeneration: "Nova geração", describe: "DESCREVER",
    checkingModels: "Verificando modelos locais…", modelReady: "Modelo H3 pronto", modelMissing: "Arquivos do modelo base H3 ausentes",
    modelFoundTransformer: "Transformer local de 8 bits detectado: ", modelFoundNone: "Nenhum transformer H3 encontrado em ~/.omlx/models.",
    modelDownload: "Baixar checkpoint base ↗", transformerDownload: "Baixar transformer de 8 bits ↗",
    promptLabel: "Descreva a cena que deseja", promptHint: "Mais detalhes dão vida à cena",
    promptPlaceholder: "Uma rua estreita de Tóquio após a chuva, neon refletido no chão molhado. Um gato laranja passa sob lanternas de papel, enquadramento cinematográfico e chuva suave ao longe.",
    promptPrivacy: "O prompt fica neste dispositivo", duration: "Duração", aspectRatio: "Proporção", quality: "Etapas de amostragem",
    duration5: "5 s", duration8: "8 s", duration10: "10 s", duration15: "15 s",
    aspectLandscape: "16:9 Paisagem", aspectPortrait: "9:16 Retrato", aspectSquare: "1:1 Quadrado",
    stepsFast: "9 · Rápido (8 passagens)", stepsBalanced: "16 · Equilibrado (15 passagens)", stepsDetailed: "25 · Mais detalhes (24 passagens)",
    seed: "Semente", modelSettings: "Caminhos dos modelos", checkpointPath: "Pasta do checkpoint base H3",
    checkpointPlaceholder: "ex.: /Users/você/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Deve conter model_index.json, text_encoder, video_vae e audio_vae.",
    transformerPath: "Transformer (opcional, quantizado)", transformerHelp: "Deixe vazio para usar o transformer do checkpoint base.",
    computeNote: "H3 exige muito processamento em 768 px. 5 s e 9 etapas levaram cerca de 1,2 h no M3 Ultra; o tempo varia conforme o dispositivo.",
    generate: "Gerar vídeo + áudio", generating: "Gerando…", previewLabel: "SUA CRIAÇÃO", previewTitle: "Prévia",
    waiting: "AGUARDANDO", previewEmpty: "Seu próximo mundo<br>aparecerá aqui", previewEmptyHint: "Digite um prompt para começar",
    preparing: "Preparando geração…", longRunning: "A geração pode demorar. Você pode sair da página; a tarefa continua localmente.",
    cancelGeneration: "Cancelar geração", generatedLocally: "Gerado neste dispositivo", downloadVideo: "Baixar vídeo",
    downloadAudio: "Baixar áudio", generationLog: "Registro de geração", footerLocal: "A inferência é executada localmente",
    queued: "Na fila", running: "Gerando", cancelling: "Cancelando", cancelled: "Cancelado", completed: "Concluído", failed: "Falha",
    errInvalidPrompt: "Digite um prompt (até 4.000 caracteres).", errCheckpoint: "Informe uma pasta de checkpoint H3 válida. Veja os links de download.",
    errTransformer: "Pasta de transformer inválida; selecione um transformer H3 com configuração e pesos.",
    errRunning: "Já existe uma tarefa em execução. Aguarde ou cancele-a.", errInvalid: "Parâmetros inválidos: confira duração, etapas, proporção e semente.",
    errGeneric: "Não foi possível iniciar a geração. Confira o registro.", restored: "Status da geração local restaurado."
  },
  tr: {
    localOnly: "YEREL · GİZLİ", language: "Dil", eyebrow: "YEREL VİDEO VE SES ÜRETİMİ",
    headline: "Hayal gücünü <span>canlandır.</span>", introCopy: "Mac'inizde MiniMax H3 ile metinden senkronize video ve stereo ses üretin.",
    createLabel: "YARATICI ALAN", newGeneration: "Yeni üretim", describe: "TANIMLA",
    checkingModels: "Yerel modeller denetleniyor…", modelReady: "H3 modeli hazır", modelMissing: "H3 temel model dosyaları eksik",
    modelFoundTransformer: "Yerel 8 bit transformer bulundu: ", modelFoundNone: "~/.omlx/models içinde H3 transformer bulunamadı.",
    modelDownload: "Temel checkpoint'i indir ↗", transformerDownload: "8 bit transformer'ı indir ↗",
    promptLabel: "Görmek istediğiniz sahneyi anlatın", promptHint: "Ayrıntılar sahneyi canlandırır",
    promptPlaceholder: "Yağmur sonrası Tokyo sokağı, ıslak zeminde neon yansımaları. Kâğıt fenerlerin altından yürüyen turuncu bir kedi; sinematik kadraj ve uzaktan hafif yağmur sesi.",
    promptPrivacy: "İstem bu cihazda kalır", duration: "Süre", aspectRatio: "En-boy oranı", quality: "Örnekleme adımları",
    duration5: "5 sn", duration8: "8 sn", duration10: "10 sn", duration15: "15 sn",
    aspectLandscape: "16:9 Yatay", aspectPortrait: "9:16 Dikey", aspectSquare: "1:1 Kare",
    stepsFast: "9 · Hızlı (8 geçiş)", stepsBalanced: "16 · Dengeli (15 geçiş)", stepsDetailed: "25 · Daha ayrıntılı (24 geçiş)",
    seed: "Tohum", modelSettings: "Model yolları", checkpointPath: "H3 temel checkpoint klasörü",
    checkpointPlaceholder: "örn. /Users/siz/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "model_index.json, text_encoder, video_vae ve audio_vae içermelidir.",
    transformerPath: "Transformer (isteğe bağlı, kuantize)", transformerHelp: "Boş bırakılırsa temel checkpoint içindeki transformer kullanılır.",
    computeNote: "H3, 768 px kısa kenarda yoğun hesaplama gerektirir. M3 Ultra'da 5 sn ve 9 adım yaklaşık 1,2 saat sürdü; cihaza göre değişir.",
    generate: "Video + ses üret", generating: "Üretiliyor…", previewLabel: "OLUŞTURDUĞUNUZ", previewTitle: "Önizleme",
    waiting: "HAZIR", previewEmpty: "Yeni dünyanız<br>burada belirecek", previewEmptyHint: "Başlamak için bir istem girin",
    preparing: "Üretim hazırlanıyor…", longRunning: "Üretim zaman alabilir. Sayfadan ayrılabilirsiniz; görev yerel olarak sürer.",
    cancelGeneration: "Üretimi iptal et", generatedLocally: "Bu cihazda üretildi", downloadVideo: "Videoyu indir",
    downloadAudio: "Sesi indir", generationLog: "Üretim günlüğü", footerLocal: "Çıkarım tamamen bu cihazda çalışır",
    queued: "Kuyrukta", running: "Üretiliyor", cancelling: "İptal ediliyor", cancelled: "İptal edildi", completed: "Tamamlandı", failed: "Başarısız",
    errInvalidPrompt: "Bir istem girin (en fazla 4.000 karakter).", errCheckpoint: "Geçerli bir H3 temel checkpoint klasörü belirtin. İndirme bağlantılarına bakın.",
    errTransformer: "Transformer klasörü geçersiz; yapılandırma ve ağırlıkları olan bir H3 transformer seçin.",
    errRunning: "Zaten çalışan bir görev var. Bitmesini bekleyin veya iptal edin.", errInvalid: "İstek geçersiz; süreyi, adımları, oranı ve tohumu denetleyin.",
    errGeneric: "Üretim başlatılamadı. Günlüğü inceleyin.", restored: "Yerel üretim durumu geri yüklendi."
  },
  ar: {
    localOnly: "محلي · خاص", language: "اللغة", eyebrow: "إنشاء الفيديو والصوت محليًا",
    headline: "حوّل الخيال <span>إلى مشهد.</span>", introCopy: "أنشئ فيديو متزامنًا وصوتًا مجسمًا باستخدام MiniMax H3 على جهاز Mac.",
    createLabel: "مساحة الإبداع", newGeneration: "إنشاء جديد", describe: "الوصف",
    checkingModels: "جارٍ فحص النماذج المحلية…", modelReady: "نموذج H3 جاهز", modelMissing: "ملفات نموذج H3 الأساسي غير موجودة",
    modelFoundTransformer: "تم العثور على transformer محلي بدقة 8 بت: ", modelFoundNone: "لم يتم العثور على H3 transformer في ~/.omlx/models.",
    modelDownload: "تنزيل checkpoint الأساسي ↗", transformerDownload: "تنزيل transformer بدقة 8 بت ↗",
    promptLabel: "صِف المشهد الذي تريد رؤيته", promptHint: "التفاصيل تجعل المشهد أكثر حيوية",
    promptPlaceholder: "زقاق في طوكيو بعد المطر، أضواء النيون تنعكس على الرصيف المبتل. قطة برتقالية تمر تحت فوانيس ورقية، لقطة سينمائية وصوت مطر خفيف من بعيد.",
    promptPrivacy: "تتم معالجة الوصف على هذا الجهاز فقط", duration: "المدة", aspectRatio: "نسبة العرض", quality: "خطوات أخذ العينات",
    duration5: "5 ث", duration8: "8 ث", duration10: "10 ث", duration15: "15 ث",
    aspectLandscape: "16:9 أفقي", aspectPortrait: "9:16 عمودي", aspectSquare: "1:1 مربع",
    stepsFast: "9 · أسرع (8 تمريرات)", stepsBalanced: "16 · متوازن (15 تمريرة)", stepsDetailed: "25 · تفاصيل أكثر (24 تمريرة)",
    seed: "البذرة", modelSettings: "مسارات النماذج", checkpointPath: "مجلد checkpoint الأساسي لـ H3",
    checkpointPlaceholder: "مثال: /Users/you/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "يجب أن يحتوي على model_index.json وtext_encoder وvideo_vae وaudio_vae.",
    transformerPath: "Transformer (اختياري، مضغوط)", transformerHelp: "اتركه فارغًا لاستخدام transformer الموجود في checkpoint الأساسي.",
    computeNote: "يتطلب H3 حسابًا مكثفًا عند حافة قصيرة 768px. استغرق 5 ثوانٍ و9 خطوات نحو 1.2 ساعة على M3 Ultra؛ يختلف الوقت حسب الجهاز.",
    generate: "إنشاء الفيديو والصوت", generating: "جارٍ الإنشاء…", previewLabel: "إبداعك", previewTitle: "معاينة",
    waiting: "جاهز", previewEmpty: "سيظهر عالمك<br>التالي هنا", previewEmptyHint: "أدخل وصفًا للبدء",
    preparing: "جارٍ التحضير…", longRunning: "قد يستغرق الإنشاء وقتًا. يمكنك مغادرة الصفحة وسيستمر العمل محليًا.",
    cancelGeneration: "إلغاء الإنشاء", generatedLocally: "تم الإنشاء على هذا الجهاز", downloadVideo: "تنزيل الفيديو",
    downloadAudio: "تنزيل الصوت", generationLog: "سجل الإنشاء", footerLocal: "يعمل الاستدلال بالكامل على جهازك",
    queued: "في قائمة الانتظار", running: "جارٍ الإنشاء", cancelling: "جارٍ الإلغاء", cancelled: "أُلغي", completed: "اكتمل", failed: "فشل الإنشاء",
    errInvalidPrompt: "أدخل وصفًا (حتى 4000 حرف).", errCheckpoint: "يرجى تحديد مجلد checkpoint صالحًا لـ H3. راجع روابط التنزيل أدناه.",
    errTransformer: "مجلد transformer غير صالح؛ اختر H3 transformer يحتوي على الإعدادات والأوزان.",
    errRunning: "هناك مهمة قيد التشغيل. انتظر اكتمالها أو ألغها أولًا.", errInvalid: "الطلب غير صالح؛ تحقق من المدة والخطوات والنسبة والبذرة.",
    errGeneric: "تعذر بدء الإنشاء. تحقق من السجل.", restored: "تمت استعادة حالة الإنشاء المحلي."
  },
  vi: {
    localOnly: "CHẠY CỤC BỘ · RIÊNG TƯ", language: "Ngôn ngữ", eyebrow: "TẠO VIDEO VÀ ÂM THANH CỤC BỘ",
    headline: "Biến trí tưởng tượng <span>thành hình ảnh.</span>", introCopy: "Tạo video đồng bộ và âm thanh stereo bằng MiniMax H3 trên máy Mac.",
    createLabel: "KHÔNG GIAN SÁNG TẠO", newGeneration: "Tạo nội dung mới", describe: "MÔ TẢ",
    checkingModels: "Đang kiểm tra mô hình cục bộ…", modelReady: "Mô hình H3 đã sẵn sàng", modelMissing: "Thiếu tệp mô hình H3 cơ sở",
    modelFoundTransformer: "Đã tìm thấy transformer 8-bit cục bộ: ", modelFoundNone: "Không tìm thấy transformer H3 trong ~/.omlx/models.",
    modelDownload: "Tải checkpoint cơ sở ↗", transformerDownload: "Tải transformer 8-bit ↗",
    promptLabel: "Mô tả cảnh bạn muốn xem", promptHint: "Càng chi tiết, cảnh càng sống động",
    promptPlaceholder: "Con hẻm Tokyo sau cơn mưa, đèn neon phản chiếu trên mặt đường ướt. Một chú mèo cam chậm rãi đi dưới đèn lồng giấy, góc quay điện ảnh, tiếng mưa nhẹ từ xa.",
    promptPrivacy: "Prompt chỉ được xử lý trên thiết bị này", duration: "Thời lượng", aspectRatio: "Tỷ lệ khung hình", quality: "Số bước lấy mẫu",
    duration5: "5 giây", duration8: "8 giây", duration10: "10 giây", duration15: "15 giây",
    aspectLandscape: "16:9 Ngang", aspectPortrait: "9:16 Dọc", aspectSquare: "1:1 Vuông",
    stepsFast: "9 · Nhanh (8 lượt)", stepsBalanced: "16 · Cân bằng (15 lượt)", stepsDetailed: "25 · Chi tiết hơn (24 lượt)",
    seed: "Seed", modelSettings: "Đường dẫn mô hình", checkpointPath: "Thư mục checkpoint H3 cơ sở",
    checkpointPlaceholder: "vd: /Users/ban/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Cần có model_index.json, text_encoder, video_vae và audio_vae.",
    transformerPath: "Transformer (tùy chọn, lượng tử hóa)", transformerHelp: "Để trống để dùng transformer trong checkpoint cơ sở.",
    computeNote: "H3 cần nhiều tài nguyên ở cạnh ngắn 768px. 5 giây, 9 bước mất khoảng 1,2 giờ trên M3 Ultra; thời gian tùy thiết bị.",
    generate: "Tạo video + âm thanh", generating: "Đang tạo…", previewLabel: "TÁC PHẨM CỦA BẠN", previewTitle: "Xem trước",
    waiting: "SẴN SÀNG", previewEmpty: "Thế giới tiếp theo<br>sẽ xuất hiện ở đây", previewEmptyHint: "Nhập prompt để bắt đầu",
    preparing: "Đang chuẩn bị…", longRunning: "Quá trình tạo có thể mất thời gian. Bạn có thể rời trang; tác vụ vẫn chạy cục bộ.",
    cancelGeneration: "Hủy tạo", generatedLocally: "Đã tạo trên thiết bị này", downloadVideo: "Tải video",
    downloadAudio: "Tải âm thanh", generationLog: "Nhật ký tạo", footerLocal: "Suy luận hoàn toàn chạy trên thiết bị của bạn",
    queued: "Đang chờ", running: "Đang tạo", cancelling: "Đang hủy", cancelled: "Đã hủy", completed: "Hoàn tất", failed: "Tạo thất bại",
    errInvalidPrompt: "Nhập prompt (tối đa 4.000 ký tự).", errCheckpoint: "Hãy cung cấp thư mục checkpoint H3 hợp lệ. Xem liên kết tải bên dưới.",
    errTransformer: "Thư mục transformer không hợp lệ; hãy chọn transformer H3 có cấu hình và trọng số.",
    errRunning: "Đã có tác vụ đang chạy. Hãy đợi hoặc hủy tác vụ đó.", errInvalid: "Yêu cầu không hợp lệ; kiểm tra thời lượng, bước, tỷ lệ và seed.",
    errGeneric: "Không thể bắt đầu tạo. Hãy xem nhật ký.", restored: "Đã khôi phục trạng thái tạo cục bộ."
  },
  id: {
    localOnly: "LOKAL · PRIVAT", language: "Bahasa", eyebrow: "PEMBUATAN VIDEO + AUDIO LOKAL",
    headline: "Ubah imajinasi <span>menjadi nyata.</span>", introCopy: "Buat video tersinkronisasi dan audio stereo dengan MiniMax H3 di Mac Anda.",
    createLabel: "RUANG KREATIF", newGeneration: "Generasi baru", describe: "DESKRIPSI",
    checkingModels: "Memeriksa model lokal…", modelReady: "Model H3 siap", modelMissing: "File model dasar H3 tidak ditemukan",
    modelFoundTransformer: "Transformer 8-bit lokal terdeteksi: ", modelFoundNone: "Transformer H3 tidak ditemukan di ~/.omlx/models.",
    modelDownload: "Unduh checkpoint dasar ↗", transformerDownload: "Unduh transformer 8-bit ↗",
    promptLabel: "Deskripsikan adegan yang ingin dilihat", promptHint: "Detail membuat adegan lebih hidup",
    promptPlaceholder: "Gang Tokyo setelah hujan, neon terpantul di jalan basah. Kucing oranye berjalan di bawah lentera kertas, komposisi sinematik dan suara hujan lembut dari kejauhan.",
    promptPrivacy: "Prompt diproses hanya di perangkat ini", duration: "Durasi", aspectRatio: "Rasio aspek", quality: "Langkah sampling",
    duration5: "5 dtk", duration8: "8 dtk", duration10: "10 dtk", duration15: "15 dtk",
    aspectLandscape: "16:9 Lanskap", aspectPortrait: "9:16 Potret", aspectSquare: "1:1 Persegi",
    stepsFast: "9 · Cepat (8 putaran)", stepsBalanced: "16 · Seimbang (15 putaran)", stepsDetailed: "25 · Lebih detail (24 putaran)",
    seed: "Seed", modelSettings: "Lokasi model", checkpointPath: "Folder checkpoint dasar H3",
    checkpointPlaceholder: "mis. /Users/anda/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Harus berisi model_index.json, text_encoder, video_vae, dan audio_vae.",
    transformerPath: "Transformer (opsional, terkuantisasi)", transformerHelp: "Kosongkan untuk memakai transformer dari checkpoint dasar.",
    computeNote: "H3 membutuhkan komputasi besar pada sisi pendek 768px. 5 detik, 9 langkah memerlukan sekitar 1,2 jam di M3 Ultra; waktu berbeda tiap perangkat.",
    generate: "Buat video + audio", generating: "Membuat…", previewLabel: "KREASI ANDA", previewTitle: "Pratinjau",
    waiting: "SIAP", previewEmpty: "Dunia berikutnya<br>akan muncul di sini", previewEmptyHint: "Masukkan prompt untuk memulai",
    preparing: "Menyiapkan generasi…", longRunning: "Proses mungkin lama. Anda dapat meninggalkan halaman; tugas tetap berjalan lokal.",
    cancelGeneration: "Batalkan generasi", generatedLocally: "Dibuat di perangkat ini", downloadVideo: "Unduh video",
    downloadAudio: "Unduh audio", generationLog: "Log generasi", footerLocal: "Inferensi sepenuhnya berjalan di perangkat",
    queued: "Dalam antrean", running: "Membuat", cancelling: "Membatalkan", cancelled: "Dibatalkan", completed: "Selesai", failed: "Gagal",
    errInvalidPrompt: "Masukkan prompt (maksimal 4.000 karakter).", errCheckpoint: "Masukkan folder checkpoint dasar H3 yang valid. Lihat tautan unduhan.",
    errTransformer: "Folder transformer tidak valid; pilih transformer H3 dengan konfigurasi dan bobot.",
    errRunning: "Tugas sedang berjalan. Tunggu atau batalkan terlebih dahulu.", errInvalid: "Permintaan tidak valid; periksa durasi, langkah, rasio, dan seed.",
    errGeneric: "Generasi tidak dapat dimulai. Periksa log.", restored: "Status generasi lokal dipulihkan."
  },
  ru: {
    localOnly: "ЛОКАЛЬНО · ПРИВАТНО", language: "Язык", eyebrow: "ЛОКАЛЬНАЯ ГЕНЕРАЦИЯ ВИДЕО И АУДИО",
    headline: "Превратите фантазию <span>в кадр.</span>", introCopy: "Создавайте синхронизированное видео и стереозвук с MiniMax H3 на Mac.",
    createLabel: "ТВОРЧЕСКАЯ СТУДИЯ", newGeneration: "Новая генерация", describe: "ОПИСАНИЕ",
    checkingModels: "Проверка локальных моделей…", modelReady: "Модель H3 готова", modelMissing: "Не найдены файлы базовой модели H3",
    modelFoundTransformer: "Найден локальный 8-битный transformer: ", modelFoundNone: "В ~/.omlx/models не найден transformer H3.",
    modelDownload: "Скачать базовый checkpoint ↗", transformerDownload: "Скачать 8-битный transformer ↗",
    promptLabel: "Опишите желаемую сцену", promptHint: "Подробности оживляют сцену",
    promptPlaceholder: "Переулок Токио после дождя, неон отражается на мокром асфальте. Рыжий кот медленно проходит под бумажными фонарями; кинематографичный кадр, вдали слышен тихий дождь.",
    promptPrivacy: "Запрос обрабатывается только на этом устройстве", duration: "Длительность", aspectRatio: "Соотношение сторон", quality: "Шаги сэмплирования",
    duration5: "5 сек.", duration8: "8 сек.", duration10: "10 сек.", duration15: "15 сек.",
    aspectLandscape: "16:9 Альбомная", aspectPortrait: "9:16 Книжная", aspectSquare: "1:1 Квадрат",
    stepsFast: "9 · Быстрее (8 проходов)", stepsBalanced: "16 · Баланс (15 проходов)", stepsDetailed: "25 · Детальнее (24 прохода)",
    seed: "Seed", modelSettings: "Пути к моделям", checkpointPath: "Папка базового checkpoint H3",
    checkpointPlaceholder: "Например: /Users/вы/Models/MiniMax-H3/FL2VA",
    checkpointHelp: "Должны быть model_index.json, text_encoder, video_vae и audio_vae.",
    transformerPath: "Transformer (необязательно, квантованный)", transformerHelp: "Оставьте пустым, чтобы использовать transformer из базового checkpoint.",
    computeNote: "H3 требует много вычислений при короткой стороне 768px. 5 секунд и 9 шагов занимают около 1,2 часа на M3 Ultra; время зависит от устройства.",
    generate: "Создать видео и аудио", generating: "Генерация…", previewLabel: "ВАШ РЕЗУЛЬТАТ", previewTitle: "Предпросмотр",
    waiting: "ОЖИДАНИЕ", previewEmpty: "Ваш новый мир<br>появится здесь", previewEmptyHint: "Введите запрос, чтобы начать",
    preparing: "Подготовка генерации…", longRunning: "Генерация может занять время. Можно закрыть страницу — задача продолжится локально.",
    cancelGeneration: "Отменить генерацию", generatedLocally: "Создано на этом устройстве", downloadVideo: "Скачать видео",
    downloadAudio: "Скачать аудио", generationLog: "Журнал генерации", footerLocal: "Вычисления выполняются локально",
    queued: "В очереди", running: "Генерация", cancelling: "Отмена", cancelled: "Отменено", completed: "Готово", failed: "Ошибка",
    errInvalidPrompt: "Введите запрос (не более 4000 символов).", errCheckpoint: "Укажите корректную папку базового checkpoint H3. Ссылки для скачивания ниже.",
    errTransformer: "Папка transformer недействительна; выберите transformer H3 с конфигурацией и весами.",
    errRunning: "Задача уже выполняется. Дождитесь завершения или отмените её.", errInvalid: "Проверьте параметры: длительность, шаги, формат и seed.",
    errGeneric: "Не удалось запустить генерацию. Проверьте журнал.", restored: "Состояние локальной генерации восстановлено."
  }

};

const settingsTranslations = {
  "zh-CN": {
    settingsButton: "设置", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "模型与服务设置",
    settingsPrivacy: "仅支持本机服务地址；不保存 API 密钥。设置保存在项目目录的 settings.json。",
    settingsVideo: "视频生成 · MiniMax H3", settingsImage: "图像生成 · HiDream",
    settingsMusic: "音乐生成 · Music3", settingsText: "提示词优化 · 本地文本模型",
    settingsModelPath: "模型目录", settingsServiceUrl: "本机服务地址",
    settingsModelIdOptional: "模型 ID（可选，留空自动检测）", settingsVideoParams: "额外 API 参数（JSON 对象）",
    settingsLocalRunner: "使用本机 Python 推理程序；此模型通过本地目录加载，不使用 HTTP 服务地址。",
    settingsTextModels: "模型 ID 列表（每行一个；与服务发现列表合并）",
    settingsTextParams: "请求参数（JSON；temperature、top_p、max_tokens）",
    settingsSave: "保存设置", settingsCancel: "取消", settingsSaved: "设置已保存。",
    settingsSaving: "正在保存…", settingsSaveError: "无法保存设置，请检查地址与 JSON 格式。"
  },
  en: {
    settingsButton: "Settings", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Model and service settings",
    settingsPrivacy: "Loopback service URLs only. API keys are not stored. Settings are saved to settings.json in the project folder.",
    settingsVideo: "Video generation · MiniMax H3", settingsImage: "Image generation · HiDream",
    settingsMusic: "Music generation · Music3", settingsText: "Prompt optimization · Local text models",
    settingsModelPath: "Model directory", settingsServiceUrl: "Local service URL",
    settingsModelIdOptional: "Model ID (optional; auto-detect when blank)", settingsVideoParams: "Additional API parameters (JSON object)",
    settingsLocalRunner: "Uses a local Python inference runner; this model loads from a local directory, not an HTTP service.",
    settingsTextModels: "Model IDs (one per line; merged with discovered models)",
    settingsTextParams: "Request parameters (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Save settings", settingsCancel: "Cancel", settingsSaved: "Settings saved.",
    settingsSaving: "Saving…", settingsSaveError: "Could not save settings. Check URLs and JSON."
  },
  "zh-TW": {
    settingsButton: "設定", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "模型與服務設定",
    settingsPrivacy: "僅支援本機服務位址；不會儲存 API 金鑰。設定儲存在專案資料夾的 settings.json。",
    settingsVideo: "影片生成 · MiniMax H3", settingsImage: "圖像生成 · HiDream",
    settingsMusic: "音樂生成 · Music3", settingsText: "提示詞最佳化 · 本機文字模型",
    settingsModelPath: "模型目錄", settingsServiceUrl: "本機服務位址",
    settingsModelIdOptional: "模型 ID（選填，留空則自動偵測）", settingsVideoParams: "額外 API 參數（JSON 物件）",
    settingsLocalRunner: "使用本機 Python 推論程式；此模型從本機目錄載入，不使用 HTTP 服務位址。",
    settingsTextModels: "模型 ID 清單（每行一個；與服務探索清單合併）",
    settingsTextParams: "請求參數（JSON；temperature、top_p、max_tokens）",
    settingsSave: "儲存設定", settingsCancel: "取消", settingsSaved: "設定已儲存。",
    settingsSaving: "正在儲存…", settingsSaveError: "無法儲存設定，請檢查位址與 JSON 格式。"
  },
  fr: {
    settingsButton: "Paramètres", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Modèles et services",
    settingsPrivacy: "Adresses locales uniquement. Aucune clé API n’est enregistrée. Paramètres enregistrés dans settings.json du projet.",
    settingsVideo: "Génération vidéo · MiniMax H3", settingsImage: "Génération d’images · HiDream",
    settingsMusic: "Génération musicale · Music3", settingsText: "Optimisation · Modèles de texte locaux",
    settingsModelPath: "Dossier du modèle", settingsServiceUrl: "Adresse du service local",
    settingsModelIdOptional: "ID du modèle (facultatif ; détection automatique)", settingsVideoParams: "Paramètres API supplémentaires (objet JSON)",
    settingsLocalRunner: "Utilise un moteur Python local ; le modèle est chargé depuis un dossier local, sans service HTTP.",
    settingsTextModels: "ID des modèles (un par ligne ; fusionnés avec les modèles détectés)",
    settingsTextParams: "Paramètres de requête (JSON ; temperature, top_p, max_tokens)",
    settingsSave: "Enregistrer", settingsCancel: "Annuler", settingsSaved: "Paramètres enregistrés.",
    settingsSaving: "Enregistrement…", settingsSaveError: "Échec. Vérifiez les adresses et le JSON."
  },
  de: {
    settingsButton: "Einstellungen", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Modell- und Diensteinstellungen",
    settingsPrivacy: "Nur lokale Dienstadressen. API-Schlüssel werden nicht gespeichert. Einstellungen liegen in settings.json im Projektordner.",
    settingsVideo: "Videogenerierung · MiniMax H3", settingsImage: "Bildgenerierung · HiDream",
    settingsMusic: "Musikgenerierung · Music3", settingsText: "Prompt-Optimierung · Lokale Textmodelle",
    settingsModelPath: "Modellverzeichnis", settingsServiceUrl: "Lokale Dienstadresse",
    settingsModelIdOptional: "Modell-ID (optional; leer = automatisch)", settingsVideoParams: "Zusätzliche API-Parameter (JSON-Objekt)",
    settingsLocalRunner: "Nutzt eine lokale Python-Inferenz; das Modell wird aus einem lokalen Verzeichnis geladen, nicht über HTTP.",
    settingsTextModels: "Modell-IDs (eine pro Zeile; ergänzt erkannte Modelle)",
    settingsTextParams: "Anfrageparameter (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Speichern", settingsCancel: "Abbrechen", settingsSaved: "Einstellungen gespeichert.",
    settingsSaving: "Wird gespeichert…", settingsSaveError: "Speichern fehlgeschlagen. Adressen und JSON prüfen."
  },
  ja: {
    settingsButton: "設定", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "モデルとサービスの設定",
    settingsPrivacy: "ローカルサービスのアドレスのみ対応します。API キーは保存しません。設定はプロジェクト内の settings.json に保存されます。",
    settingsVideo: "動画生成 · MiniMax H3", settingsImage: "画像生成 · HiDream",
    settingsMusic: "音楽生成 · Music3", settingsText: "プロンプト最適化 · ローカルテキストモデル",
    settingsModelPath: "モデルフォルダー", settingsServiceUrl: "ローカルサービスアドレス",
    settingsModelIdOptional: "モデル ID（任意、空欄で自動検出）", settingsVideoParams: "追加 API パラメーター（JSON オブジェクト）",
    settingsLocalRunner: "ローカル Python 推論を使用します。モデルは HTTP サービスではなくローカルフォルダーから読み込みます。",
    settingsTextModels: "モデル ID（1 行に 1 つ。検出されたモデルに追加）",
    settingsTextParams: "リクエストパラメーター（JSON；temperature、top_p、max_tokens）",
    settingsSave: "保存", settingsCancel: "キャンセル", settingsSaved: "設定を保存しました。",
    settingsSaving: "保存中…", settingsSaveError: "保存できません。アドレスと JSON を確認してください。"
  },
  ko: {
    settingsButton: "설정", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "모델 및 서비스 설정",
    settingsPrivacy: "로컬 서비스 주소만 지원합니다. API 키는 저장하지 않습니다. 설정은 프로젝트 폴더의 settings.json에 저장됩니다.",
    settingsVideo: "동영상 생성 · MiniMax H3", settingsImage: "이미지 생성 · HiDream",
    settingsMusic: "음악 생성 · Music3", settingsText: "프롬프트 최적화 · 로컬 텍스트 모델",
    settingsModelPath: "모델 디렉터리", settingsServiceUrl: "로컬 서비스 주소",
    settingsModelIdOptional: "모델 ID (선택 사항, 비우면 자동 감지)", settingsVideoParams: "추가 API 매개변수 (JSON 객체)",
    settingsLocalRunner: "로컬 Python 추론기를 사용합니다. 모델은 HTTP 서비스가 아닌 로컬 디렉터리에서 로드됩니다.",
    settingsTextModels: "모델 ID (한 줄에 하나씩, 검색된 모델과 병합)",
    settingsTextParams: "요청 매개변수 (JSON; temperature, top_p, max_tokens)",
    settingsSave: "설정 저장", settingsCancel: "취소", settingsSaved: "설정을 저장했습니다.",
    settingsSaving: "저장 중…", settingsSaveError: "저장할 수 없습니다. 주소와 JSON을 확인하세요."
  },
  es: {
    settingsButton: "Ajustes", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Ajustes de modelos y servicios",
    settingsPrivacy: "Solo direcciones locales. No se guardan claves API. Se guarda en settings.json dentro del proyecto.",
    settingsVideo: "Generación de vídeo · MiniMax H3", settingsImage: "Generación de imágenes · HiDream",
    settingsMusic: "Generación de música · Music3", settingsText: "Optimización · Modelos de texto locales",
    settingsModelPath: "Carpeta del modelo", settingsServiceUrl: "Dirección del servicio local",
    settingsModelIdOptional: "ID del modelo (opcional; detección automática)", settingsVideoParams: "Parámetros API adicionales (objeto JSON)",
    settingsLocalRunner: "Usa un proceso local de Python; carga el modelo desde una carpeta local, no desde un servicio HTTP.",
    settingsTextModels: "ID de modelos (uno por línea; se combinan con los detectados)",
    settingsTextParams: "Parámetros de solicitud (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Guardar ajustes", settingsCancel: "Cancelar", settingsSaved: "Ajustes guardados.",
    settingsSaving: "Guardando…", settingsSaveError: "No se pudo guardar. Comprueba las direcciones y el JSON."
  },
  pt: {
    settingsButton: "Configurações", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Configurações de modelos e serviços",
    settingsPrivacy: "Somente endereços locais. Chaves de API não são salvas. As configurações ficam em settings.json na pasta do projeto.",
    settingsVideo: "Geração de vídeo · MiniMax H3", settingsImage: "Geração de imagens · HiDream",
    settingsMusic: "Geração de música · Music3", settingsText: "Otimização · Modelos de texto locais",
    settingsModelPath: "Pasta do modelo", settingsServiceUrl: "Endereço do serviço local",
    settingsModelIdOptional: "ID do modelo (opcional; detecção automática)", settingsVideoParams: "Parâmetros extras da API (objeto JSON)",
    settingsLocalRunner: "Usa inferência Python local; o modelo é carregado de uma pasta local, sem serviço HTTP.",
    settingsTextModels: "IDs dos modelos (um por linha; mesclados aos modelos detectados)",
    settingsTextParams: "Parâmetros da solicitação (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Salvar configurações", settingsCancel: "Cancelar", settingsSaved: "Configurações salvas.",
    settingsSaving: "Salvando…", settingsSaveError: "Não foi possível salvar. Confira os endereços e o JSON."
  },
  tr: {
    settingsButton: "Ayarlar", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Model ve hizmet ayarları",
    settingsPrivacy: "Yalnızca yerel hizmet adresleri desteklenir. API anahtarları kaydedilmez. Ayarlar proje klasöründeki settings.json dosyasına yazılır.",
    settingsVideo: "Video üretimi · MiniMax H3", settingsImage: "Görsel üretimi · HiDream",
    settingsMusic: "Müzik üretimi · Music3", settingsText: "İstem iyileştirme · Yerel metin modelleri",
    settingsModelPath: "Model dizini", settingsServiceUrl: "Yerel hizmet adresi",
    settingsModelIdOptional: "Model kimliği (isteğe bağlı; boşsa otomatik)", settingsVideoParams: "Ek API parametreleri (JSON nesnesi)",
    settingsLocalRunner: "Yerel Python çıkarımı kullanır; model HTTP hizmetinden değil yerel dizinden yüklenir.",
    settingsTextModels: "Model kimlikleri (her satıra bir tane; bulunanlarla birleştirilir)",
    settingsTextParams: "İstek parametreleri (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Ayarları kaydet", settingsCancel: "İptal", settingsSaved: "Ayarlar kaydedildi.",
    settingsSaving: "Kaydediliyor…", settingsSaveError: "Kaydedilemedi. Adresleri ve JSON'ı kontrol edin."
  },
  ar: {
    settingsButton: "الإعدادات", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "إعدادات النماذج والخدمات",
    settingsPrivacy: "تُقبل عناوين الخدمات المحلية فقط. لا تُحفظ مفاتيح API. تُحفظ الإعدادات في settings.json داخل المشروع.",
    settingsVideo: "إنشاء الفيديو · MiniMax H3", settingsImage: "إنشاء الصور · HiDream",
    settingsMusic: "إنشاء الموسيقى · Music3", settingsText: "تحسين الوصف · نماذج نصية محلية",
    settingsModelPath: "مجلد النموذج", settingsServiceUrl: "عنوان الخدمة المحلية",
    settingsModelIdOptional: "معرّف النموذج (اختياري؛ يُكتشف تلقائيًا عند تركه فارغًا)", settingsVideoParams: "معلمات API إضافية (كائن JSON)",
    settingsLocalRunner: "يستخدم استدلال Python محليًا؛ يُحمّل النموذج من مجلد محلي وليس عبر خدمة HTTP.",
    settingsTextModels: "معرّفات النماذج (واحد في كل سطر؛ تضاف إلى النماذج المكتشفة)",
    settingsTextParams: "معلمات الطلب (JSON؛ temperature وtop_p وmax_tokens)",
    settingsSave: "حفظ الإعدادات", settingsCancel: "إلغاء", settingsSaved: "تم حفظ الإعدادات.",
    settingsSaving: "جارٍ الحفظ…", settingsSaveError: "تعذر الحفظ. تحقق من العناوين وJSON."
  },
  vi: {
    settingsButton: "Cài đặt", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Cài đặt mô hình và dịch vụ",
    settingsPrivacy: "Chỉ hỗ trợ địa chỉ dịch vụ cục bộ. Không lưu API key. Cài đặt được lưu vào settings.json trong thư mục dự án.",
    settingsVideo: "Tạo video · MiniMax H3", settingsImage: "Tạo ảnh · HiDream",
    settingsMusic: "Tạo nhạc · Music3", settingsText: "Tối ưu prompt · Mô hình văn bản cục bộ",
    settingsModelPath: "Thư mục mô hình", settingsServiceUrl: "Địa chỉ dịch vụ cục bộ",
    settingsModelIdOptional: "ID mô hình (không bắt buộc; để trống để tự phát hiện)", settingsVideoParams: "Tham số API bổ sung (đối tượng JSON)",
    settingsLocalRunner: "Dùng trình suy luận Python cục bộ; mô hình được tải từ thư mục cục bộ, không qua dịch vụ HTTP.",
    settingsTextModels: "ID mô hình (mỗi dòng một ID; gộp với mô hình được phát hiện)",
    settingsTextParams: "Tham số yêu cầu (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Lưu cài đặt", settingsCancel: "Hủy", settingsSaved: "Đã lưu cài đặt.",
    settingsSaving: "Đang lưu…", settingsSaveError: "Không thể lưu. Hãy kiểm tra địa chỉ và JSON."
  },
  id: {
    settingsButton: "Pengaturan", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Pengaturan model dan layanan",
    settingsPrivacy: "Hanya alamat layanan lokal yang didukung. Kunci API tidak disimpan. Pengaturan disimpan ke settings.json di folder proyek.",
    settingsVideo: "Pembuatan video · MiniMax H3", settingsImage: "Pembuatan gambar · HiDream",
    settingsMusic: "Pembuatan musik · Music3", settingsText: "Optimasi prompt · Model teks lokal",
    settingsModelPath: "Direktori model", settingsServiceUrl: "Alamat layanan lokal",
    settingsModelIdOptional: "ID model (opsional; kosongkan untuk deteksi otomatis)", settingsVideoParams: "Parameter API tambahan (objek JSON)",
    settingsLocalRunner: "Menggunakan inferensi Python lokal; model dimuat dari direktori lokal, bukan layanan HTTP.",
    settingsTextModels: "ID model (satu per baris; digabung dengan model yang ditemukan)",
    settingsTextParams: "Parameter permintaan (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Simpan pengaturan", settingsCancel: "Batal", settingsSaved: "Pengaturan disimpan.",
    settingsSaving: "Menyimpan…", settingsSaveError: "Tidak dapat menyimpan. Periksa alamat dan JSON."
  },
  ru: {
    settingsButton: "Настройки", settingsKicker: "MODEL CONFIGURATION", settingsTitle: "Настройки моделей и служб",
    settingsPrivacy: "Поддерживаются только локальные адреса. Ключи API не сохраняются. Настройки записываются в settings.json в папке проекта.",
    settingsVideo: "Генерация видео · MiniMax H3", settingsImage: "Генерация изображений · HiDream",
    settingsMusic: "Генерация музыки · Music3", settingsText: "Оптимизация промпта · Локальные текстовые модели",
    settingsModelPath: "Папка модели", settingsServiceUrl: "Адрес локальной службы",
    settingsModelIdOptional: "ID модели (необязательно; пусто — автоопределение)", settingsVideoParams: "Дополнительные параметры API (JSON-объект)",
    settingsLocalRunner: "Используется локальный Python-инференс; модель загружается из локальной папки, а не по HTTP.",
    settingsTextModels: "ID моделей (по одному в строке; дополняют найденные модели)",
    settingsTextParams: "Параметры запроса (JSON; temperature, top_p, max_tokens)",
    settingsSave: "Сохранить", settingsCancel: "Отмена", settingsSaved: "Настройки сохранены.",
    settingsSaving: "Сохранение…", settingsSaveError: "Не удалось сохранить. Проверьте адреса и JSON."
  }
};

const workflowTranslations = {
  "zh-CN": {
    modelReady: "本地 MiniMax H3 已就绪", modelMissing: "未找到完整 4-bit H3 模型包",
    modelDownloading: "正在下载 4-bit H3 模型", modelNotLoaded: "已找到 4-bit 模型包，但尚未加载", runtimeMissing: "需要安装 MLX-Serve",
    loadModel: "启动 MLX-Serve 并加载模型", runtimeDownload: "下载 MLX-Serve ↗",
    modelDownload: "下载完整 4-bit 模型 ↗", modelSettings: "本地模型",
    transformerNote: "已有的 8-bit transformer 不包含完整生成所需组件 ↗",
    modelPath: "模型目录：", turboLabel: "使用 4-step Turbo LoRA（推荐预览）",
    computeNote: "H3 生成计算量很大。Turbo 模式推荐 4–8 步预览；标准模式从 16 步起。5 秒视频约 125 帧，实际耗时取决于设备与系统负载。",
    quality: "生成步数", stepsFast: "4 · Turbo 预览", stepsBalanced: "6 · Turbo 均衡", stepsDetailed: "8 · Turbo 细节", stepsStandard: "16 · 标准"
  },
  en: {
    modelReady: "Local MiniMax H3 is ready", modelMissing: "Complete 4-bit H3 model pack not found",
    modelDownloading: "Downloading the 4-bit H3 model", modelNotLoaded: "4-bit model pack found, but it is not loaded", runtimeMissing: "MLX-Serve must be installed",
    loadModel: "Start MLX-Serve and load model", runtimeDownload: "Download MLX-Serve ↗",
    modelDownload: "Download complete 4-bit model ↗", modelSettings: "Local model",
    transformerNote: "The existing 8-bit transformer does not include all components required for generation ↗",
    modelPath: "Model directory: ", turboLabel: "Use 4-step Turbo LoRA (recommended for previews)",
    computeNote: "H3 generation is compute-intensive. Turbo previews use 4–8 steps; standard sampling starts at 16. A 5-second video is about 125 frames. Actual time depends on the Mac and system load.",
    quality: "Generation steps", stepsFast: "4 · Turbo preview", stepsBalanced: "6 · Turbo balanced", stepsDetailed: "8 · Turbo detail", stepsStandard: "16 · Standard"
  },
  "zh-TW": {
    modelReady: "本機 MiniMax H3 已就緒", modelMissing: "找不到完整 4-bit H3 模型套件",
    modelDownloading: "正在下載 4-bit H3 模型", modelNotLoaded: "已找到 4-bit 模型套件，但尚未載入", runtimeMissing: "需要安裝 MLX-Serve",
    loadModel: "啟動 MLX-Serve 並載入模型", runtimeDownload: "下載 MLX-Serve ↗",
    modelDownload: "下載完整 4-bit 模型 ↗", modelSettings: "本機模型",
    transformerNote: "現有的 8-bit transformer 未包含生成所需的完整元件 ↗",
    modelPath: "模型目錄：", turboLabel: "使用 4-step Turbo LoRA（推薦預覽）",
    computeNote: "H3 生成需要大量運算。Turbo 預覽建議使用 4–8 步；標準取樣從 16 步起。5 秒影片約 125 幀，實際耗時依裝置與系統負載而異。",
    quality: "生成步數", stepsFast: "4 · Turbo 預覽", stepsBalanced: "6 · Turbo 均衡", stepsDetailed: "8 · Turbo 細節", stepsStandard: "16 · 標準"
  },
  fr: {
    modelReady: "MiniMax H3 local est prêt", modelMissing: "Pack H3 4 bits complet introuvable",
    modelDownloading: "Téléchargement du modèle H3 4 bits", modelNotLoaded: "Pack 4 bits trouvé, mais pas encore chargé", runtimeMissing: "MLX-Serve doit être installé",
    loadModel: "Démarrer MLX-Serve et charger le modèle", runtimeDownload: "Télécharger MLX-Serve ↗",
    modelDownload: "Télécharger le modèle complet 4 bits ↗", modelSettings: "Modèle local",
    transformerNote: "Le transformer 8 bits existant ne contient pas tous les composants nécessaires ↗",
    modelPath: "Dossier du modèle : ", turboLabel: "Utiliser Turbo LoRA 4 étapes (aperçu recommandé)",
    computeNote: "La génération H3 est très intensive. Les aperçus Turbo utilisent 4 à 8 étapes ; l’échantillonnage standard commence à 16. Une vidéo de 5 s compte environ 125 images. La durée dépend du Mac et de sa charge.",
    quality: "Étapes de génération", stepsFast: "4 · Aperçu Turbo", stepsBalanced: "6 · Turbo équilibré", stepsDetailed: "8 · Détails Turbo", stepsStandard: "16 · Standard"
  },
  de: {
    modelReady: "Lokales MiniMax H3 ist bereit", modelMissing: "Vollständiges 4-Bit-H3-Modellpaket nicht gefunden",
    modelDownloading: "4-Bit-H3-Modell wird heruntergeladen", modelNotLoaded: "4-Bit-Modellpaket gefunden, aber noch nicht geladen", runtimeMissing: "MLX-Serve muss installiert werden",
    loadModel: "MLX-Serve starten und Modell laden", runtimeDownload: "MLX-Serve herunterladen ↗",
    modelDownload: "Vollständiges 4-Bit-Modell herunterladen ↗", modelSettings: "Lokales Modell",
    transformerNote: "Der vorhandene 8-Bit-Transformer enthält nicht alle benötigten Komponenten ↗",
    modelPath: "Modellordner: ", turboLabel: "4-Step-Turbo-LoRA verwenden (Vorschau empfohlen)",
    computeNote: "Die H3-Generierung ist rechenintensiv. Turbo-Vorschauen verwenden 4–8 Schritte; Standard-Sampling beginnt bei 16. Ein 5-Sekunden-Video hat etwa 125 Frames. Die Dauer hängt von Mac und Systemlast ab.",
    quality: "Generierungsschritte", stepsFast: "4 · Turbo-Vorschau", stepsBalanced: "6 · Turbo ausgewogen", stepsDetailed: "8 · Turbo-Details", stepsStandard: "16 · Standard"
  },
  ja: {
    modelReady: "ローカル MiniMax H3 の準備完了", modelMissing: "完全な 4-bit H3 モデルパックが見つかりません",
    modelDownloading: "4-bit H3 モデルをダウンロード中", modelNotLoaded: "4-bit モデルパックを検出しましたが、未ロードです", runtimeMissing: "MLX-Serve のインストールが必要です",
    loadModel: "MLX-Serve を起動してモデルをロード", runtimeDownload: "MLX-Serve をダウンロード ↗",
    modelDownload: "完全な 4-bit モデルをダウンロード ↗", modelSettings: "ローカルモデル",
    transformerNote: "既存の 8-bit transformer だけでは生成に必要なコンポーネントが揃いません ↗",
    modelPath: "モデルフォルダー：", turboLabel: "4-step Turbo LoRA を使用（プレビュー推奨）",
    computeNote: "H3 の生成には多くの計算が必要です。Turbo プレビューは 4～8 ステップ、標準サンプリングは 16 ステップからです。5 秒動画は約 125 フレームで、時間は Mac と負荷によって変わります。",
    quality: "生成ステップ", stepsFast: "4 · Turbo プレビュー", stepsBalanced: "6 · Turbo バランス", stepsDetailed: "8 · Turbo 詳細", stepsStandard: "16 · 標準"
  },
  ko: {
    modelReady: "로컬 MiniMax H3 준비 완료", modelMissing: "완전한 4-bit H3 모델 팩을 찾을 수 없습니다",
    modelDownloading: "4-bit H3 모델 다운로드 중", modelNotLoaded: "4-bit 모델 팩을 찾았지만 아직 로드되지 않았습니다", runtimeMissing: "MLX-Serve 설치가 필요합니다",
    loadModel: "MLX-Serve 시작 및 모델 로드", runtimeDownload: "MLX-Serve 다운로드 ↗",
    modelDownload: "완전한 4-bit 모델 다운로드 ↗", modelSettings: "로컬 모델",
    transformerNote: "기존 8-bit transformer에는 생성에 필요한 전체 구성 요소가 포함되어 있지 않습니다 ↗",
    modelPath: "모델 폴더: ", turboLabel: "4-step Turbo LoRA 사용 (미리보기 권장)",
    computeNote: "H3 생성은 계산량이 많습니다. Turbo 미리보기는 4~8단계, 표준 샘플링은 16단계부터 사용합니다. 5초 영상은 약 125프레임이며 실제 시간은 Mac과 시스템 부하에 따라 다릅니다.",
    quality: "생성 단계", stepsFast: "4 · Turbo 미리보기", stepsBalanced: "6 · Turbo 균형", stepsDetailed: "8 · Turbo 디테일", stepsStandard: "16 · 표준"
  },
  es: {
    modelReady: "MiniMax H3 local está listo", modelMissing: "No se encontró el paquete H3 completo de 4 bits",
    modelDownloading: "Descargando el modelo H3 de 4 bits", modelNotLoaded: "Paquete de 4 bits encontrado, pero aún no está cargado", runtimeMissing: "Se debe instalar MLX-Serve",
    loadModel: "Iniciar MLX-Serve y cargar el modelo", runtimeDownload: "Descargar MLX-Serve ↗",
    modelDownload: "Descargar el modelo completo de 4 bits ↗", modelSettings: "Modelo local",
    transformerNote: "El transformer de 8 bits existente no incluye todos los componentes necesarios ↗",
    modelPath: "Carpeta del modelo: ", turboLabel: "Usar Turbo LoRA de 4 pasos (recomendado para vistas previas)",
    computeNote: "La generación H3 requiere mucho cálculo. Las vistas Turbo usan 4–8 pasos; el muestreo estándar empieza en 16. Un vídeo de 5 s tiene unos 125 fotogramas. El tiempo depende del Mac y su carga.",
    quality: "Pasos de generación", stepsFast: "4 · Vista previa Turbo", stepsBalanced: "6 · Turbo equilibrado", stepsDetailed: "8 · Detalle Turbo", stepsStandard: "16 · Estándar"
  },
  pt: {
    modelReady: "MiniMax H3 local está pronto", modelMissing: "Pacote H3 completo de 4 bits não encontrado",
    modelDownloading: "Baixando o modelo H3 de 4 bits", modelNotLoaded: "Pacote de 4 bits encontrado, mas ainda não carregado", runtimeMissing: "É necessário instalar o MLX-Serve",
    loadModel: "Iniciar MLX-Serve e carregar o modelo", runtimeDownload: "Baixar MLX-Serve ↗",
    modelDownload: "Baixar o modelo completo de 4 bits ↗", modelSettings: "Modelo local",
    transformerNote: "O transformer de 8 bits existente não inclui todos os componentes necessários ↗",
    modelPath: "Pasta do modelo: ", turboLabel: "Usar Turbo LoRA de 4 etapas (recomendado para prévias)",
    computeNote: "A geração H3 exige muito processamento. As prévias Turbo usam 4–8 etapas; a amostragem padrão começa em 16. Um vídeo de 5 s tem cerca de 125 quadros. O tempo depende do Mac e da carga do sistema.",
    quality: "Etapas de geração", stepsFast: "4 · Prévia Turbo", stepsBalanced: "6 · Turbo equilibrado", stepsDetailed: "8 · Detalhe Turbo", stepsStandard: "16 · Padrão"
  },
  tr: {
    modelReady: "Yerel MiniMax H3 hazır", modelMissing: "Tam 4 bit H3 model paketi bulunamadı",
    modelDownloading: "4 bit H3 modeli indiriliyor", modelNotLoaded: "4 bit model paketi bulundu ancak yüklenmedi", runtimeMissing: "MLX-Serve kurulmalı",
    loadModel: "MLX-Serve'i başlat ve modeli yükle", runtimeDownload: "MLX-Serve'i indir ↗",
    modelDownload: "Tam 4 bit modeli indir ↗", modelSettings: "Yerel model",
    transformerNote: "Mevcut 8 bit transformer, üretim için gereken tüm bileşenleri içermez ↗",
    modelPath: "Model dizini: ", turboLabel: "4 adımlı Turbo LoRA kullan (önizleme önerilir)",
    computeNote: "H3 üretimi yoğun hesaplama gerektirir. Turbo önizlemeleri 4–8 adım kullanır; standart örnekleme 16 adımdan başlar. 5 saniyelik video yaklaşık 125 kare içerir. Süre Mac'e ve sistem yüküne bağlıdır.",
    quality: "Üretim adımları", stepsFast: "4 · Turbo önizleme", stepsBalanced: "6 · Dengeli Turbo", stepsDetailed: "8 · Turbo ayrıntı", stepsStandard: "16 · Standart"
  },
  ar: {
    modelReady: "MiniMax H3 المحلي جاهز", modelMissing: "لم يتم العثور على حزمة H3 كاملة بدقة 4 بت",
    modelDownloading: "جارٍ تنزيل نموذج H3 بدقة 4 بت", modelNotLoaded: "عُثر على حزمة 4 بت لكنها لم تُحمّل بعد", runtimeMissing: "يلزم تثبيت MLX-Serve",
    loadModel: "بدء MLX-Serve وتحميل النموذج", runtimeDownload: "تنزيل MLX-Serve ↗",
    modelDownload: "تنزيل نموذج 4 بت الكامل ↗", modelSettings: "النموذج المحلي",
    transformerNote: "لا يحتوي transformer الحالي بدقة 8 بت على جميع مكونات التوليد ↗",
    modelPath: "مجلد النموذج: ", turboLabel: "استخدام Turbo LoRA بأربع خطوات (موصى به للمعاينة)",
    computeNote: "يتطلب توليد H3 حسابات كثيفة. تستخدم معاينات Turbo من 4 إلى 8 خطوات، ويبدأ التوليد القياسي من 16 خطوة. يضم فيديو 5 ثوانٍ نحو 125 إطاراً. يعتمد الوقت على الجهاز وحمل النظام.",
    quality: "خطوات التوليد", stepsFast: "4 · معاينة Turbo", stepsBalanced: "6 · Turbo متوازن", stepsDetailed: "8 · تفاصيل Turbo", stepsStandard: "16 · قياسي"
  },
  vi: {
    modelReady: "MiniMax H3 cục bộ đã sẵn sàng", modelMissing: "Không tìm thấy gói H3 4-bit đầy đủ",
    modelDownloading: "Đang tải mô hình H3 4-bit", modelNotLoaded: "Đã tìm thấy gói 4-bit nhưng chưa tải vào bộ nhớ", runtimeMissing: "Cần cài đặt MLX-Serve",
    loadModel: "Khởi động MLX-Serve và tải mô hình", runtimeDownload: "Tải MLX-Serve ↗",
    modelDownload: "Tải mô hình 4-bit đầy đủ ↗", modelSettings: "Mô hình cục bộ",
    transformerNote: "Transformer 8-bit hiện có không bao gồm đầy đủ thành phần để tạo nội dung ↗",
    modelPath: "Thư mục mô hình: ", turboLabel: "Dùng Turbo LoRA 4 bước (khuyên dùng để xem trước)",
    computeNote: "Tạo nội dung H3 cần nhiều tính toán. Bản xem trước Turbo dùng 4–8 bước; chế độ chuẩn bắt đầu từ 16 bước. Video 5 giây có khoảng 125 khung hình. Thời gian tùy Mac và tải hệ thống.",
    quality: "Số bước tạo", stepsFast: "4 · Xem trước Turbo", stepsBalanced: "6 · Turbo cân bằng", stepsDetailed: "8 · Turbo chi tiết", stepsStandard: "16 · Tiêu chuẩn"
  },
  id: {
    modelReady: "MiniMax H3 lokal siap", modelMissing: "Paket model H3 4-bit lengkap tidak ditemukan",
    modelDownloading: "Mengunduh model H3 4-bit", modelNotLoaded: "Paket 4-bit ditemukan, tetapi belum dimuat", runtimeMissing: "MLX-Serve perlu dipasang",
    loadModel: "Jalankan MLX-Serve dan muat model", runtimeDownload: "Unduh MLX-Serve ↗",
    modelDownload: "Unduh model 4-bit lengkap ↗", modelSettings: "Model lokal",
    transformerNote: "Transformer 8-bit yang ada tidak mencakup semua komponen untuk generasi ↗",
    modelPath: "Direktori model: ", turboLabel: "Gunakan Turbo LoRA 4 langkah (disarankan untuk pratinjau)",
    computeNote: "Generasi H3 membutuhkan komputasi besar. Pratinjau Turbo memakai 4–8 langkah; sampling standar dimulai dari 16. Video 5 detik sekitar 125 frame. Waktu bergantung pada Mac dan beban sistem.",
    quality: "Langkah generasi", stepsFast: "4 · Pratinjau Turbo", stepsBalanced: "6 · Turbo seimbang", stepsDetailed: "8 · Detail Turbo", stepsStandard: "16 · Standar"
  },
  ru: {
    modelReady: "Локальная MiniMax H3 готова", modelMissing: "Полный пакет H3 в 4 бит не найден",
    modelDownloading: "Загрузка модели H3 в 4 бит", modelNotLoaded: "Пакет 4 бит найден, но ещё не загружен", runtimeMissing: "Необходимо установить MLX-Serve",
    loadModel: "Запустить MLX-Serve и загрузить модель", runtimeDownload: "Скачать MLX-Serve ↗",
    modelDownload: "Скачать полную модель 4 бит ↗", modelSettings: "Локальная модель",
    transformerNote: "В имеющемся 8-битном transformer нет всех компонентов для генерации ↗",
    modelPath: "Папка модели: ", turboLabel: "Использовать Turbo LoRA на 4 шага (рекомендуется для предпросмотра)",
    computeNote: "Генерация H3 требует больших вычислений. Для предпросмотра Turbo нужно 4–8 шагов, стандартная выборка начинается с 16. В 5-секундном видео около 125 кадров. Время зависит от Mac и нагрузки.",
    quality: "Шаги генерации", stepsFast: "4 · Turbo предпросмотр", stepsBalanced: "6 · Сбалансированный Turbo", stepsDetailed: "8 · Детали Turbo", stepsStandard: "16 · Стандарт"
  }
};

const musicTranslations = {
  "zh-CN": {
    generationMode: "生成模式", modeMusic: "音乐生成", musicChecking: "正在检查 MiniMax Music3…", musicReady: "MiniMax Music3 8-bit 已就绪", musicModelMissing: "未找到完整的 Music3 8-bit 模型", musicRuntimeMissing: "Music3 推理环境不可用", musicModelLink: "查看 Music3 模型卡 ↗",
    musicPromptLabel: "描述你想听到的音乐", musicPromptHint: "描述曲风、速度、乐器、人声与氛围", musicPromptPlaceholder: "例如：温暖的原声流行，96 BPM，亲密柔和的女声，指弹吉他与轻柔弦乐，渐进式副歌。",
    musicModeLabel: "人声模式", musicLyricsMode: "带歌词", musicInstrumentalMode: "纯音乐", musicLyricsLabel: "歌词", musicLyricsPlaceholder: "例如：[verse] 第一段歌词\n[chorus] 副歌歌词", musicLyricsHint: "可用 [verse]、[chorus] 等段落标签组织歌词。",
    musicDuration: "时长上限", musicSteps: "生成步数", musicComputeNote: "Music3 8-bit 模型约 14.2 GB；较长曲目会显著增加生成时间。纯音乐模式会自动使用 [instrumental] 条件。",
    musicGenerate: "生成音乐", musicGenerating: "正在生成音乐…", musicIntro: "在 Mac 本机用 MiniMax Music3 将文字提示生成带歌词歌曲或纯音乐。", musicEyebrow: "本地音乐生成", musicHeadline: "把灵感，<span>谱成音乐。</span>",
    musicPreviewLabel: "音乐结果", musicPreviewTitle: "音频试听", musicEmpty: "你的音乐<br>将在这里出现", musicEmptyHint: "描述曲风，选择歌词或纯音乐", musicLongRunning: "音乐生成会占用较多内存与计算资源，时长越长等待越久；任务在本机运行。", musicDownload: "下载 WAV", musicLyricsRequired: "请输入歌词，或选择纯音乐模式。", musicModelSettings: "MiniMax Music3 本地音乐模型", musicModelSource: "Music3 8-bit 模型卡 ↗"
  },
  en: {
    generationMode: "Generation mode", modeMusic: "Music", musicChecking: "Checking MiniMax Music3…", musicReady: "MiniMax Music3 8-bit is ready", musicModelMissing: "Complete Music3 8-bit weights were not found", musicRuntimeMissing: "Music3 inference runtime is unavailable", musicModelLink: "View the Music3 model card ↗",
    musicPromptLabel: "Describe the music you want to hear", musicPromptHint: "Describe genre, tempo, instruments, vocals, and mood", musicPromptPlaceholder: "Warm acoustic pop, 96 BPM, intimate soft female vocal, fingerpicked guitar and gentle strings, a gradually lifting chorus.",
    musicModeLabel: "Vocal mode", musicLyricsMode: "With lyrics", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Lyrics", musicLyricsPlaceholder: "For example: [verse] First verse\n[chorus] Chorus lyrics", musicLyricsHint: "Use section tags such as [verse] and [chorus] to structure the lyrics.",
    musicDuration: "Duration limit", musicSteps: "Generation steps", musicComputeNote: "The Music3 8-bit model is about 14.2 GB. Longer tracks take significantly more time; instrumental mode automatically uses the [instrumental] condition.",
    musicGenerate: "Generate music", musicGenerating: "Generating music…", musicIntro: "Generate a vocal song or instrumental track locally on your Mac with MiniMax Music3.", musicEyebrow: "LOCAL MUSIC GENERATION", musicHeadline: "Turn inspiration <span>into music.</span>",
    musicPreviewLabel: "MUSIC RESULT", musicPreviewTitle: "Listen to audio", musicEmpty: "Your music<br>will appear here", musicEmptyHint: "Describe a style and choose vocals or instrumental", musicLongRunning: "Music generation uses substantial memory and compute; longer tracks take more time. The job runs locally.", musicDownload: "Download WAV", musicLyricsRequired: "Enter lyrics or choose instrumental mode.", musicModelSettings: "Local MiniMax Music3 model", musicModelSource: "Music3 8-bit model card ↗"
  },
  "zh-TW": {
    generationMode: "生成模式", modeMusic: "音樂生成", musicChecking: "正在檢查 MiniMax Music3…", musicReady: "MiniMax Music3 8-bit 已就緒", musicModelMissing: "找不到完整的 Music3 8-bit 模型", musicRuntimeMissing: "Music3 推理環境無法使用", musicModelLink: "查看 Music3 模型卡 ↗",
    musicPromptLabel: "描述你想聽到的音樂", musicPromptHint: "描述曲風、速度、樂器、人聲與氛圍", musicPromptPlaceholder: "溫暖原聲流行，96 BPM，親密柔和的女聲，指彈吉他與輕柔弦樂，逐漸高昂的副歌。",
    musicModeLabel: "人聲模式", musicLyricsMode: "含歌詞", musicInstrumentalMode: "純音樂", musicLyricsLabel: "歌詞", musicLyricsPlaceholder: "例如：[verse] 第一段歌詞\n[chorus] 副歌歌詞", musicLyricsHint: "可使用 [verse]、[chorus] 等段落標籤編排歌詞。",
    musicDuration: "時長上限", musicSteps: "生成步數", musicComputeNote: "Music3 8-bit 模型約 14.2 GB；較長曲目會大幅增加生成時間。純音樂模式會自動使用 [instrumental] 條件。",
    musicGenerate: "生成音樂", musicGenerating: "正在生成音樂…", musicIntro: "在 Mac 本機使用 MiniMax Music3，依文字提示生成歌曲或純音樂。", musicEyebrow: "本機音樂生成", musicHeadline: "把靈感，<span>譜成音樂。</span>",
    musicPreviewLabel: "音樂結果", musicPreviewTitle: "音訊試聽", musicEmpty: "你的音樂<br>將在這裡出現", musicEmptyHint: "描述曲風，選擇歌詞或純音樂", musicLongRunning: "音樂生成需要較多記憶體與運算；曲目越長，等待越久。工作會在本機執行。", musicDownload: "下載 WAV", musicLyricsRequired: "請輸入歌詞，或選擇純音樂模式。", musicModelSettings: "MiniMax Music3 本機音樂模型", musicModelSource: "Music3 8-bit 模型卡 ↗"
  },
  fr: {
    generationMode: "Mode de génération", modeMusic: "Musique", musicChecking: "Vérification de MiniMax Music3…", musicReady: "MiniMax Music3 8 bits est prêt", musicModelMissing: "Poids complets Music3 8 bits introuvables", musicRuntimeMissing: "Environnement d’inférence Music3 indisponible", musicModelLink: "Voir la fiche du modèle Music3 ↗",
    musicPromptLabel: "Décrivez la musique souhaitée", musicPromptHint: "Précisez le genre, le tempo, les instruments, la voix et l’ambiance", musicPromptPlaceholder: "Pop acoustique chaleureuse, 96 BPM, voix féminine douce et intime, guitare picking et cordes légères, refrain qui s’élève.",
    musicModeLabel: "Mode vocal", musicLyricsMode: "Avec paroles", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Paroles", musicLyricsPlaceholder: "Exemple : [verse] Premier couplet\n[chorus] Refrain", musicLyricsHint: "Structurez le texte avec des balises comme [verse] et [chorus].",
    musicDuration: "Durée maximale", musicSteps: "Étapes de génération", musicComputeNote: "Le modèle Music3 8 bits pèse environ 14,2 Go. Les morceaux longs prennent plus de temps ; le mode instrumental utilise automatiquement la condition [instrumental].",
    musicGenerate: "Générer la musique", musicGenerating: "Génération de la musique…", musicIntro: "Générez localement sur Mac une chanson avec paroles ou un morceau instrumental avec MiniMax Music3.", musicEyebrow: "GÉNÉRATION MUSICALE LOCALE", musicHeadline: "Transformez l’inspiration <span>en musique.</span>",
    musicPreviewLabel: "RÉSULTAT MUSICAL", musicPreviewTitle: "Écouter l’audio", musicEmpty: "Votre musique<br>apparaîtra ici", musicEmptyHint: "Décrivez un style et choisissez voix ou instrumental", musicLongRunning: "La génération musicale demande mémoire et calcul ; les morceaux longs prennent plus de temps. Le traitement reste local.", musicDownload: "Télécharger WAV", musicLyricsRequired: "Saisissez des paroles ou choisissez le mode instrumental.", musicModelSettings: "Modèle MiniMax Music3 local", musicModelSource: "Fiche du modèle Music3 8 bits ↗"
  },
  de: {
    generationMode: "Generierungsmodus", modeMusic: "Musik", musicChecking: "MiniMax Music3 wird geprüft…", musicReady: "MiniMax Music3 8-Bit ist bereit", musicModelMissing: "Vollständige Music3-8-Bit-Gewichte nicht gefunden", musicRuntimeMissing: "Music3-Laufzeitumgebung nicht verfügbar", musicModelLink: "Music3-Modellkarte ansehen ↗",
    musicPromptLabel: "Beschreibe die gewünschte Musik", musicPromptHint: "Genre, Tempo, Instrumente, Gesang und Stimmung angeben", musicPromptPlaceholder: "Warmer Akustik-Pop, 96 BPM, sanfte intime Frauenstimme, gezupfte Gitarre und leichte Streicher, langsam aufsteigender Refrain.",
    musicModeLabel: "Gesangsmodus", musicLyricsMode: "Mit Text", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Liedtext", musicLyricsPlaceholder: "Beispiel: [verse] Erste Strophe\n[chorus] Refrain", musicLyricsHint: "Strukturiere den Text mit Abschnittsmarken wie [verse] und [chorus].",
    musicDuration: "Maximale Dauer", musicSteps: "Generierungsschritte", musicComputeNote: "Das Music3-8-Bit-Modell ist etwa 14,2 GB groß. Längere Stücke brauchen deutlich mehr Zeit; der Instrumentalmodus nutzt automatisch die Bedingung [instrumental].",
    musicGenerate: "Musik generieren", musicGenerating: "Musik wird generiert…", musicIntro: "Erzeuge lokal auf dem Mac mit MiniMax Music3 Songs mit Text oder Instrumentalstücke.", musicEyebrow: "LOKALE MUSIKGENERIERUNG", musicHeadline: "Mach aus Inspiration <span>Musik.</span>",
    musicPreviewLabel: "MUSIKERGEBNIS", musicPreviewTitle: "Audio anhören", musicEmpty: "Deine Musik<br>erscheint hier", musicEmptyHint: "Stil beschreiben und Gesang oder Instrumental wählen", musicLongRunning: "Musikgenerierung benötigt viel Speicher und Rechenleistung; längere Stücke dauern länger. Die Aufgabe läuft lokal.", musicDownload: "WAV herunterladen", musicLyricsRequired: "Gib einen Liedtext ein oder wähle den Instrumentalmodus.", musicModelSettings: "Lokales MiniMax-Music3-Modell", musicModelSource: "Music3-8-Bit-Modellkarte ↗"
  },
  ja: {
    generationMode: "生成モード", modeMusic: "音楽生成", musicChecking: "MiniMax Music3 を確認中…", musicReady: "MiniMax Music3 8-bit の準備完了", musicModelMissing: "Music3 8-bit の完全なモデルが見つかりません", musicRuntimeMissing: "Music3 の推論環境を利用できません", musicModelLink: "Music3 モデルカードを見る ↗",
    musicPromptLabel: "作りたい音楽を説明", musicPromptHint: "ジャンル、テンポ、楽器、ボーカル、雰囲気を指定", musicPromptPlaceholder: "温かなアコースティックポップ、96 BPM、親密で柔らかな女性ボーカル、アルペジオギターと軽い弦楽器、徐々に盛り上がるサビ。",
    musicModeLabel: "ボーカルモード", musicLyricsMode: "歌詞あり", musicInstrumentalMode: "インストゥルメンタル", musicLyricsLabel: "歌詞", musicLyricsPlaceholder: "例：[verse] 1番の歌詞\n[chorus] サビの歌詞", musicLyricsHint: "[verse] や [chorus] などのタグで歌詞を構成できます。",
    musicDuration: "最大再生時間", musicSteps: "生成ステップ数", musicComputeNote: "Music3 8-bit モデルは約14.2 GBです。長い曲ほど生成に時間がかかります。インストゥルメンタルでは [instrumental] 条件を自動指定します。",
    musicGenerate: "音楽を生成", musicGenerating: "音楽を生成中…", musicIntro: "MiniMax Music3 で歌詞付きの曲やインストゥルメンタルを Mac 上で生成します。", musicEyebrow: "ローカル音楽生成", musicHeadline: "ひらめきを、<span>音楽に。</span>",
    musicPreviewLabel: "音楽の結果", musicPreviewTitle: "音声を再生", musicEmpty: "生成した音楽が<br>ここに表示されます", musicEmptyHint: "スタイルと歌詞の有無を選択", musicLongRunning: "音楽生成には多くのメモリと計算資源が必要です。長い曲ほど時間がかかります。処理はローカルで実行されます。", musicDownload: "WAV をダウンロード", musicLyricsRequired: "歌詞を入力するか、インストゥルメンタルを選択してください。", musicModelSettings: "ローカル MiniMax Music3 モデル", musicModelSource: "Music3 8-bit モデルカード ↗"
  },
  ko: {
    generationMode: "생성 모드", modeMusic: "음악 생성", musicChecking: "MiniMax Music3 확인 중…", musicReady: "MiniMax Music3 8-bit 준비 완료", musicModelMissing: "완전한 Music3 8-bit 가중치를 찾을 수 없습니다", musicRuntimeMissing: "Music3 추론 환경을 사용할 수 없습니다", musicModelLink: "Music3 모델 카드 보기 ↗",
    musicPromptLabel: "원하는 음악을 설명하세요", musicPromptHint: "장르, 템포, 악기, 보컬, 분위기를 설명하세요", musicPromptPlaceholder: "따뜻한 어쿠스틱 팝, 96 BPM, 부드럽고 친밀한 여성 보컬, 핑거스타일 기타와 잔잔한 현악기, 점점 고조되는 후렴.",
    musicModeLabel: "보컬 모드", musicLyricsMode: "가사 포함", musicInstrumentalMode: "연주곡", musicLyricsLabel: "가사", musicLyricsPlaceholder: "예: [verse] 첫 번째 절 가사\n[chorus] 후렴 가사", musicLyricsHint: "[verse], [chorus] 같은 구간 태그로 가사를 구성할 수 있습니다.",
    musicDuration: "최대 길이", musicSteps: "생성 단계", musicComputeNote: "Music3 8-bit 모델은 약 14.2GB입니다. 곡이 길수록 생성 시간이 늘어납니다. 연주곡 모드는 [instrumental] 조건을 자동으로 사용합니다.",
    musicGenerate: "음악 생성", musicGenerating: "음악 생성 중…", musicIntro: "MiniMax Music3로 가사가 있는 노래나 연주곡을 Mac에서 로컬로 생성하세요.", musicEyebrow: "로컬 음악 생성", musicHeadline: "영감을 <span>음악으로.</span>",
    musicPreviewLabel: "음악 결과", musicPreviewTitle: "오디오 듣기", musicEmpty: "생성한 음악이<br>여기에 표시됩니다", musicEmptyHint: "스타일과 가사 여부를 선택하세요", musicLongRunning: "음악 생성은 메모리와 연산을 많이 사용합니다. 긴 곡일수록 시간이 더 걸리며 작업은 로컬에서 실행됩니다.", musicDownload: "WAV 다운로드", musicLyricsRequired: "가사를 입력하거나 연주곡 모드를 선택하세요.", musicModelSettings: "로컬 MiniMax Music3 모델", musicModelSource: "Music3 8-bit 모델 카드 ↗"
  },
  es: {
    generationMode: "Modo de generación", modeMusic: "Música", musicChecking: "Comprobando MiniMax Music3…", musicReady: "MiniMax Music3 de 8 bits está listo", musicModelMissing: "No se encontraron todos los pesos de Music3 de 8 bits", musicRuntimeMissing: "El entorno de inferencia Music3 no está disponible", musicModelLink: "Ver la ficha del modelo Music3 ↗",
    musicPromptLabel: "Describe la música que quieres", musicPromptHint: "Indica género, tempo, instrumentos, voz y ambiente", musicPromptPlaceholder: "Pop acústico cálido, 96 BPM, voz femenina suave e íntima, guitarra arpegiada y cuerdas ligeras, estribillo que va creciendo.",
    musicModeLabel: "Modo vocal", musicLyricsMode: "Con letra", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Letra", musicLyricsPlaceholder: "Ejemplo: [verse] Primera estrofa\n[chorus] Estribillo", musicLyricsHint: "Usa etiquetas como [verse] y [chorus] para organizar la letra.",
    musicDuration: "Duración máxima", musicSteps: "Pasos de generación", musicComputeNote: "El modelo Music3 de 8 bits ocupa unos 14,2 GB. Las pistas largas tardan más; el modo instrumental aplica automáticamente la condición [instrumental].",
    musicGenerate: "Generar música", musicGenerating: "Generando música…", musicIntro: "Genera localmente en tu Mac canciones con letra o música instrumental con MiniMax Music3.", musicEyebrow: "GENERACIÓN MUSICAL LOCAL", musicHeadline: "Convierte la inspiración <span>en música.</span>",
    musicPreviewLabel: "RESULTADO MUSICAL", musicPreviewTitle: "Escuchar audio", musicEmpty: "Tu música<br>aparecerá aquí", musicEmptyHint: "Describe el estilo y elige voz o instrumental", musicLongRunning: "La generación musical requiere memoria y cálculo; las pistas largas tardan más. La tarea se ejecuta localmente.", musicDownload: "Descargar WAV", musicLyricsRequired: "Escribe la letra o elige el modo instrumental.", musicModelSettings: "Modelo local MiniMax Music3", musicModelSource: "Ficha del modelo Music3 de 8 bits ↗"
  },
  pt: {
    generationMode: "Modo de geração", modeMusic: "Música", musicChecking: "Verificando o MiniMax Music3…", musicReady: "MiniMax Music3 de 8 bits está pronto", musicModelMissing: "Pesos completos do Music3 de 8 bits não encontrados", musicRuntimeMissing: "Ambiente de inferência do Music3 indisponível", musicModelLink: "Ver o cartão do modelo Music3 ↗",
    musicPromptLabel: "Descreva a música que deseja ouvir", musicPromptHint: "Descreva gênero, ritmo, instrumentos, voz e clima", musicPromptPlaceholder: "Pop acústico acolhedor, 96 BPM, voz feminina suave e intimista, violão dedilhado e cordas leves, refrão crescente.",
    musicModeLabel: "Modo vocal", musicLyricsMode: "Com letra", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Letra", musicLyricsPlaceholder: "Exemplo: [verse] Primeira estrofe\n[chorus] Refrão", musicLyricsHint: "Use tags como [verse] e [chorus] para estruturar a letra.",
    musicDuration: "Duração máxima", musicSteps: "Etapas de geração", musicComputeNote: "O modelo Music3 de 8 bits tem cerca de 14,2 GB. Faixas longas demoram mais; o modo instrumental usa automaticamente a condição [instrumental].",
    musicGenerate: "Gerar música", musicGenerating: "Gerando música…", musicIntro: "Gere localmente no Mac músicas com letra ou faixas instrumentais usando MiniMax Music3.", musicEyebrow: "GERAÇÃO MUSICAL LOCAL", musicHeadline: "Transforme inspiração <span>em música.</span>",
    musicPreviewLabel: "RESULTADO MUSICAL", musicPreviewTitle: "Ouvir áudio", musicEmpty: "Sua música<br>aparecerá aqui", musicEmptyHint: "Descreva o estilo e escolha voz ou instrumental", musicLongRunning: "A geração musical exige memória e processamento; faixas mais longas levam mais tempo. A tarefa é local.", musicDownload: "Baixar WAV", musicLyricsRequired: "Digite a letra ou escolha o modo instrumental.", musicModelSettings: "Modelo local MiniMax Music3", musicModelSource: "Cartão do modelo Music3 de 8 bits ↗"
  },
  tr: {
    generationMode: "Üretim modu", modeMusic: "Müzik", musicChecking: "MiniMax Music3 denetleniyor…", musicReady: "MiniMax Music3 8-bit hazır", musicModelMissing: "Tam Music3 8-bit ağırlıkları bulunamadı", musicRuntimeMissing: "Music3 çıkarım ortamı kullanılamıyor", musicModelLink: "Music3 model kartını görüntüle ↗",
    musicPromptLabel: "Duymak istediğiniz müziği açıklayın", musicPromptHint: "Türü, tempoyu, enstrümanları, vokali ve havayı belirtin", musicPromptPlaceholder: "Sıcak akustik pop, 96 BPM, yumuşak ve samimi kadın vokali, parmakla çalınan gitar ve hafif yaylılar, giderek yükselen nakarat.",
    musicModeLabel: "Vokal modu", musicLyricsMode: "Sözlü", musicInstrumentalMode: "Enstrümantal", musicLyricsLabel: "Şarkı sözleri", musicLyricsPlaceholder: "Örnek: [verse] İlk kıta\n[chorus] Nakarat", musicLyricsHint: "Sözleri [verse] ve [chorus] gibi bölüm etiketleriyle düzenleyin.",
    musicDuration: "En fazla süre", musicSteps: "Üretim adımları", musicComputeNote: "Music3 8-bit model yaklaşık 14,2 GB'tır. Uzun parçalar daha fazla zaman alır; enstrümantal mod [instrumental] koşulunu otomatik kullanır.",
    musicGenerate: "Müzik oluştur", musicGenerating: "Müzik oluşturuluyor…", musicIntro: "MiniMax Music3 ile Mac'inizde sözlü şarkı veya enstrümantal müzik üretin.", musicEyebrow: "YEREL MÜZİK ÜRETİMİ", musicHeadline: "İlhamı <span>müziğe dönüştürün.</span>",
    musicPreviewLabel: "MÜZİK SONUCU", musicPreviewTitle: "Sesi dinle", musicEmpty: "Müziğiniz<br>burada görünecek", musicEmptyHint: "Tarzı açıklayın, vokal veya enstrümantal seçin", musicLongRunning: "Müzik üretimi yoğun bellek ve işlem gücü kullanır; uzun parçalar daha uzun sürer. İşlem yerel olarak yürütülür.", musicDownload: "WAV indir", musicLyricsRequired: "Sözleri girin veya enstrümantal modu seçin.", musicModelSettings: "Yerel MiniMax Music3 modeli", musicModelSource: "Music3 8-bit model kartı ↗"
  },
  ar: {
    generationMode: "وضع الإنشاء", modeMusic: "موسيقى", musicChecking: "جارٍ التحقق من MiniMax Music3…", musicReady: "MiniMax Music3 بدقة 8 بت جاهز", musicModelMissing: "لم يتم العثور على أوزان Music3 الكاملة بدقة 8 بت", musicRuntimeMissing: "بيئة استدلال Music3 غير متاحة", musicModelLink: "عرض بطاقة نموذج Music3 ↗",
    musicPromptLabel: "صف الموسيقى التي تريد سماعها", musicPromptHint: "اذكر النوع والإيقاع والآلات والصوت والأجواء", musicPromptPlaceholder: "بوب صوتي دافئ، 96 BPM، صوت نسائي ناعم وحميم، غيتار بأوتار منتقاة وآلات وترية هادئة، لازمة تتصاعد تدريجيًا.",
    musicModeLabel: "وضع الصوت", musicLyricsMode: "مع كلمات", musicInstrumentalMode: "موسيقى آلية", musicLyricsLabel: "الكلمات", musicLyricsPlaceholder: "مثال: [verse] المقطع الأول\n[chorus] اللازمة", musicLyricsHint: "نظّم الكلمات بعلامات مقاطع مثل [verse] و[chorus].",
    musicDuration: "الحد الأقصى للمدة", musicSteps: "خطوات الإنشاء", musicComputeNote: "يبلغ حجم نموذج Music3 بدقة 8 بت نحو 14.2 غيغابايت. تستغرق المقاطع الطويلة وقتًا أطول؛ يستخدم الوضع الآلي شرط [instrumental] تلقائيًا.",
    musicGenerate: "إنشاء الموسيقى", musicGenerating: "جارٍ إنشاء الموسيقى…", musicIntro: "أنشئ أغنية بكلمات أو موسيقى آلية محليًا على Mac باستخدام MiniMax Music3.", musicEyebrow: "إنشاء موسيقى محليًا", musicHeadline: "حوّل الإلهام <span>إلى موسيقى.</span>",
    musicPreviewLabel: "نتيجة الموسيقى", musicPreviewTitle: "استمع إلى الصوت", musicEmpty: "ستظهر موسيقاك<br>هنا", musicEmptyHint: "صف النمط واختر كلمات أو موسيقى آلية", musicLongRunning: "يتطلب إنشاء الموسيقى ذاكرة وقدرة حسابية كبيرتين؛ تستغرق المقاطع الأطول وقتًا أكثر. تعمل المهمة محليًا.", musicDownload: "تنزيل WAV", musicLyricsRequired: "أدخل الكلمات أو اختر وضع الموسيقى الآلية.", musicModelSettings: "نموذج MiniMax Music3 المحلي", musicModelSource: "بطاقة نموذج Music3 بدقة 8 بت ↗"
  },
  vi: {
    generationMode: "Chế độ tạo", modeMusic: "Âm nhạc", musicChecking: "Đang kiểm tra MiniMax Music3…", musicReady: "MiniMax Music3 8-bit đã sẵn sàng", musicModelMissing: "Không tìm thấy đầy đủ trọng số Music3 8-bit", musicRuntimeMissing: "Môi trường suy luận Music3 không khả dụng", musicModelLink: "Xem thẻ mô hình Music3 ↗",
    musicPromptLabel: "Mô tả âm nhạc bạn muốn nghe", musicPromptHint: "Nêu thể loại, nhịp độ, nhạc cụ, giọng hát và không khí", musicPromptPlaceholder: "Pop acoustic ấm áp, 96 BPM, giọng nữ dịu dàng thân mật, guitar fingerstyle và dây nhẹ, điệp khúc dâng lên từ từ.",
    musicModeLabel: "Chế độ giọng hát", musicLyricsMode: "Có lời", musicInstrumentalMode: "Không lời", musicLyricsLabel: "Lời bài hát", musicLyricsPlaceholder: "Ví dụ: [verse] Lời đoạn một\n[chorus] Lời điệp khúc", musicLyricsHint: "Dùng thẻ như [verse], [chorus] để chia cấu trúc lời.",
    musicDuration: "Thời lượng tối đa", musicSteps: "Số bước tạo", musicComputeNote: "Mô hình Music3 8-bit có dung lượng khoảng 14,2 GB. Bản nhạc dài mất nhiều thời gian hơn; chế độ không lời tự dùng điều kiện [instrumental].",
    musicGenerate: "Tạo nhạc", musicGenerating: "Đang tạo nhạc…", musicIntro: "Tạo bài hát có lời hoặc nhạc không lời cục bộ trên Mac bằng MiniMax Music3.", musicEyebrow: "TẠO NHẠC CỤC BỘ", musicHeadline: "Biến cảm hứng <span>thành âm nhạc.</span>",
    musicPreviewLabel: "KẾT QUẢ ÂM NHẠC", musicPreviewTitle: "Nghe âm thanh", musicEmpty: "Bản nhạc của bạn<br>sẽ xuất hiện ở đây", musicEmptyHint: "Mô tả phong cách và chọn có lời hoặc không lời", musicLongRunning: "Tạo nhạc cần nhiều bộ nhớ và năng lực tính toán; bản nhạc càng dài càng mất thời gian. Tác vụ chạy cục bộ.", musicDownload: "Tải WAV", musicLyricsRequired: "Nhập lời bài hát hoặc chọn chế độ không lời.", musicModelSettings: "Mô hình MiniMax Music3 cục bộ", musicModelSource: "Thẻ mô hình Music3 8-bit ↗"
  },
  id: {
    generationMode: "Mode generasi", modeMusic: "Musik", musicChecking: "Memeriksa MiniMax Music3…", musicReady: "MiniMax Music3 8-bit siap", musicModelMissing: "Bobot lengkap Music3 8-bit tidak ditemukan", musicRuntimeMissing: "Runtime inferensi Music3 tidak tersedia", musicModelLink: "Lihat kartu model Music3 ↗",
    musicPromptLabel: "Jelaskan musik yang ingin didengar", musicPromptHint: "Jelaskan genre, tempo, instrumen, vokal, dan suasana", musicPromptPlaceholder: "Pop akustik hangat, 96 BPM, vokal wanita lembut dan intim, gitar petikan serta string ringan, chorus yang meningkat perlahan.",
    musicModeLabel: "Mode vokal", musicLyricsMode: "Dengan lirik", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Lirik", musicLyricsPlaceholder: "Contoh: [verse] Bait pertama\n[chorus] Lirik chorus", musicLyricsHint: "Gunakan tag seperti [verse] dan [chorus] untuk menyusun lirik.",
    musicDuration: "Batas durasi", musicSteps: "Langkah generasi", musicComputeNote: "Model Music3 8-bit berukuran sekitar 14,2 GB. Lagu yang lebih panjang membutuhkan waktu lebih lama; mode instrumental otomatis memakai kondisi [instrumental].",
    musicGenerate: "Buat musik", musicGenerating: "Membuat musik…", musicIntro: "Buat lagu berlirik atau musik instrumental secara lokal di Mac dengan MiniMax Music3.", musicEyebrow: "GENERASI MUSIK LOKAL", musicHeadline: "Ubah inspirasi <span>menjadi musik.</span>",
    musicPreviewLabel: "HASIL MUSIK", musicPreviewTitle: "Dengarkan audio", musicEmpty: "Musik Anda<br>akan muncul di sini", musicEmptyHint: "Jelaskan gaya dan pilih vokal atau instrumental", musicLongRunning: "Generasi musik membutuhkan banyak memori dan komputasi; lagu panjang membutuhkan waktu lebih lama. Tugas berjalan lokal.", musicDownload: "Unduh WAV", musicLyricsRequired: "Masukkan lirik atau pilih mode instrumental.", musicModelSettings: "Model lokal MiniMax Music3", musicModelSource: "Kartu model Music3 8-bit ↗"
  },
  ru: {
    generationMode: "Режим генерации", modeMusic: "Музыка", musicChecking: "Проверка MiniMax Music3…", musicReady: "MiniMax Music3 8-bit готова", musicModelMissing: "Полные веса Music3 8-bit не найдены", musicRuntimeMissing: "Среда Music3 недоступна", musicModelLink: "Открыть карточку Music3 ↗",
    musicPromptLabel: "Опишите желаемую музыку", musicPromptHint: "Укажите жанр, темп, инструменты, вокал и настроение", musicPromptPlaceholder: "Тёплый акустический поп, 96 BPM, мягкий интимный женский вокал, перебор гитары и лёгкие струнные, постепенно нарастающий припев.",
    musicModeLabel: "Режим вокала", musicLyricsMode: "С текстом", musicInstrumentalMode: "Инструментальная", musicLyricsLabel: "Текст песни", musicLyricsPlaceholder: "Например: [verse] Первый куплет\n[chorus] Припев", musicLyricsHint: "Используйте метки разделов, например [verse] и [chorus].",
    musicDuration: "Максимальная длительность", musicSteps: "Шаги генерации", musicComputeNote: "Модель Music3 8-bit занимает около 14,2 ГБ. Длинные композиции генерируются дольше; инструментальный режим автоматически использует условие [instrumental].",
    musicGenerate: "Создать музыку", musicGenerating: "Создание музыки…", musicIntro: "Создавайте локально на Mac песни с текстом или инструментальную музыку с MiniMax Music3.", musicEyebrow: "ЛОКАЛЬНАЯ ГЕНЕРАЦИЯ МУЗЫКИ", musicHeadline: "Превратите вдохновение <span>в музыку.</span>",
    musicPreviewLabel: "РЕЗУЛЬТАТ", musicPreviewTitle: "Прослушать аудио", musicEmpty: "Ваша музыка<br>появится здесь", musicEmptyHint: "Опишите стиль и выберите вокал или инструментал", musicLongRunning: "Генерация музыки требует много памяти и вычислений; длинные треки создаются дольше. Задача выполняется локально.", musicDownload: "Скачать WAV", musicLyricsRequired: "Введите текст песни или выберите инструментальный режим.", musicModelSettings: "Локальная модель MiniMax Music3", musicModelSource: "Карточка Music3 8-bit ↗"
  }
};

const imageTranslations = {
  "zh-CN": {
    modeVideo: "视频生成", modeImage: "文生图", imageChecking: "正在检查 HiDream 图像模型…",
    imageReady: "HiDream Q6 文生图已就绪", imageModelMissing: "未找到完整的 HiDream Q6 模型",
    imageRuntimeMissing: "HiDream 推理环境尚未安装", imageCodeLink: "下载 HiDream 推理代码 ↗",
    imageModelLink: "下载 HiDream Q6 模型 ↗", imagePromptLabel: "描述你想生成的图像",
    imagePromptHint: "建议描述主体、场景、光线与风格", imagePromptPlaceholder: "例如：雨后京都的小巷，木格窗里透出暖光，石板路映着纸灯笼，胶片摄影，自然细节。",
    imageGenerate: "生成图像", imageGenerating: "正在生成图像…",
    imageComputeNote: "HiDream Q6 使用 2048×2048 方形画布；在 M4 Pro 上生成可能需要数分钟。",
    imageIntro: "在 Mac 本机使用 HiDream-O1 Q6 将文字生成图像。", imageEyebrow: "本地图像生成", imageHeadline: "把想象，<span>变成图像。</span>",
    imagePreviewLabel: "图像结果", imagePreviewTitle: "图像预览", imageEmpty: "你的图像<br>将在这里出现",
    imageEmptyHint: "输入描述词，开始生成", imageLongRunning: "Q6 方形图像生成可能需要数分钟；推理仅在本机运行。",
    imageDownload: "下载图像", imageModelSettings: "HiDream 本地图像模型",
    imageModelSource: "HiDream-O1 Q6 模型卡 ↗", imageSetupHint: "需要安装模型仓库中的推理代码和独立 Python 环境；详见项目 README。"
  },
  en: {
    modeVideo: "Video", modeImage: "Text to image", imageChecking: "Checking the HiDream image model…",
    imageReady: "HiDream Q6 is ready", imageModelMissing: "Complete HiDream Q6 weights were not found",
    imageRuntimeMissing: "HiDream inference environment is not installed", imageCodeLink: "Get HiDream inference code ↗",
    imageModelLink: "Get HiDream Q6 weights ↗", imagePromptLabel: "Describe the image you want",
    imagePromptHint: "Include the subject, setting, lighting, and style", imagePromptPlaceholder: "A Kyoto alley after rain, warm light behind wooden lattice windows, paper lanterns reflected on stone, film photography, natural detail.",
    imageGenerate: "Generate image", imageGenerating: "Generating image…",
    imageComputeNote: "HiDream Q6 generates square 2048×2048 images; generation may take several minutes on an M4 Pro.",
    imageIntro: "Generate images from text locally on your Mac with HiDream-O1 Q6.", imageEyebrow: "LOCAL IMAGE GENERATION", imageHeadline: "Turn imagination <span>into an image.</span>",
    imagePreviewLabel: "IMAGE RESULT", imagePreviewTitle: "Image preview", imageEmpty: "Your image<br>will appear here",
    imageEmptyHint: "Enter a prompt to begin", imageLongRunning: "Q6 square image generation may take several minutes; inference stays on this device.",
    imageDownload: "Download image", imageModelSettings: "Local HiDream image model",
    imageModelSource: "HiDream-O1 Q6 model card ↗", imageSetupHint: "The model's inference code and a separate Python environment are required; see the project README."
  },
  "zh-TW": {
    modeVideo: "影片生成", modeImage: "文字生圖", imageChecking: "正在檢查 HiDream 圖像模型…",
    imageReady: "HiDream Q6 生圖已就緒", imageModelMissing: "找不到完整的 HiDream Q6 模型",
    imageRuntimeMissing: "尚未安裝 HiDream 推理環境", imageCodeLink: "下載 HiDream 推理程式碼 ↗",
    imageModelLink: "下載 HiDream Q6 模型 ↗", imagePromptLabel: "描述你想生成的圖像",
    imagePromptHint: "建議描述主體、場景、光線與風格", imagePromptPlaceholder: "雨後京都的小巷，木格窗透出暖光，石板路映著紙燈籠，底片攝影，自然細節。",
    imageGenerate: "生成圖像", imageGenerating: "正在生成圖像…",
    imageComputeNote: "HiDream Q6 使用 2048×2048 方形畫布；在 M4 Pro 上生成可能需要數分鐘。",
    imageIntro: "在 Mac 本機使用 HiDream-O1 Q6 將文字生成圖像。", imageEyebrow: "本機圖像生成", imageHeadline: "把想像，<span>變成圖像。</span>",
    imagePreviewLabel: "圖像結果", imagePreviewTitle: "圖像預覽", imageEmpty: "你的圖像<br>將在這裡出現",
    imageEmptyHint: "輸入描述詞，開始生成", imageLongRunning: "Q6 方形圖像生成可能需要數分鐘；推理僅在本機執行。",
    imageDownload: "下載圖像", imageModelSettings: "HiDream 本機圖像模型",
    imageModelSource: "HiDream-O1 Q6 模型卡 ↗", imageSetupHint: "需安裝模型倉庫中的推理程式碼與獨立 Python 環境；詳見專案 README。"
  },
  fr: {
    modeVideo: "Vidéo", modeImage: "Texte en image", imageChecking: "Vérification du modèle HiDream…",
    imageReady: "HiDream Q6 est prêt", imageModelMissing: "Les poids HiDream Q6 complets sont introuvables",
    imageRuntimeMissing: "L’environnement d’inférence HiDream n’est pas installé", imageCodeLink: "Récupérer le code d’inférence HiDream ↗",
    imageModelLink: "Récupérer les poids HiDream Q6 ↗", imagePromptLabel: "Décrivez l’image à générer",
    imagePromptHint: "Précisez le sujet, le décor, la lumière et le style", imagePromptPlaceholder: "Une ruelle de Kyoto après la pluie, lumière chaude derrière des fenêtres en treillis, lanternes reflétées sur la pierre, photographie argentique, détails naturels.",
    imageGenerate: "Générer l’image", imageGenerating: "Génération de l’image…",
    imageComputeNote: "HiDream Q6 génère des images carrées de 2048×2048 ; le calcul peut prendre plusieurs minutes sur un M4 Pro.",
    imageIntro: "Générez des images à partir de texte sur votre Mac avec HiDream-O1 Q6.", imageEyebrow: "GÉNÉRATION D’IMAGES LOCALE", imageHeadline: "Transformez vos idées <span>en image.</span>",
    imagePreviewLabel: "RÉSULTAT", imagePreviewTitle: "Aperçu de l’image", imageEmpty: "Votre image<br>apparaîtra ici",
    imageEmptyHint: "Saisissez une description pour commencer", imageLongRunning: "La génération carrée Q6 peut prendre plusieurs minutes ; l’inférence reste locale.",
    imageDownload: "Télécharger l’image", imageModelSettings: "Modèle HiDream local",
    imageModelSource: "Fiche du modèle HiDream-O1 Q6 ↗", imageSetupHint: "Le code d’inférence du dépôt et un environnement Python séparé sont requis ; voir le README du projet."
  },
  de: {
    modeVideo: "Video", modeImage: "Text zu Bild", imageChecking: "HiDream-Bildmodell wird geprüft…",
    imageReady: "HiDream Q6 ist bereit", imageModelMissing: "Vollständige HiDream-Q6-Gewichte nicht gefunden",
    imageRuntimeMissing: "HiDream-Inferenzumgebung ist nicht installiert", imageCodeLink: "HiDream-Inferenzcode abrufen ↗",
    imageModelLink: "HiDream-Q6-Gewichte abrufen ↗", imagePromptLabel: "Beschreibe das gewünschte Bild",
    imagePromptHint: "Motiv, Umgebung, Licht und Stil angeben", imagePromptPlaceholder: "Eine Gasse in Kyoto nach dem Regen, warmes Licht hinter Holzgittern, Papierlaternen spiegeln sich auf Stein, Filmfotografie, natürliche Details.",
    imageGenerate: "Bild generieren", imageGenerating: "Bild wird generiert…",
    imageComputeNote: "HiDream Q6 erzeugt quadratische Bilder mit 2048×2048 Pixeln; auf einem M4 Pro kann das einige Minuten dauern.",
    imageIntro: "Erzeuge Bilder aus Text lokal auf deinem Mac mit HiDream-O1 Q6.", imageEyebrow: "LOKALE BILDERZEUGUNG", imageHeadline: "Mach aus Ideen <span>Bilder.</span>",
    imagePreviewLabel: "BILDERGEBNIS", imagePreviewTitle: "Bildvorschau", imageEmpty: "Dein Bild<br>erscheint hier",
    imageEmptyHint: "Gib eine Beschreibung ein", imageLongRunning: "Die quadratische Q6-Bilderzeugung kann einige Minuten dauern; die Inferenz läuft lokal.",
    imageDownload: "Bild herunterladen", imageModelSettings: "Lokales HiDream-Bildmodell",
    imageModelSource: "HiDream-O1-Q6-Modellkarte ↗", imageSetupHint: "Der Inferenzcode des Modell-Repos und eine separate Python-Umgebung sind erforderlich; siehe Projekt-README."
  },
  ja: {
    modeVideo: "動画生成", modeImage: "テキストから画像", imageChecking: "HiDream画像モデルを確認中…",
    imageReady: "HiDream Q6 の準備ができました", imageModelMissing: "HiDream Q6 のモデル一式が見つかりません",
    imageRuntimeMissing: "HiDream 推論環境がインストールされていません", imageCodeLink: "HiDream 推論コードを取得 ↗",
    imageModelLink: "HiDream Q6 モデルを取得 ↗", imagePromptLabel: "生成したい画像を説明してください",
    imagePromptHint: "被写体、場面、光、スタイルを含めてください", imagePromptPlaceholder: "雨上がりの京都の路地、格子窓から漏れる暖かな光、石畳に映る提灯、フィルム写真、自然な細部。",
    imageGenerate: "画像を生成", imageGenerating: "画像を生成中…",
    imageComputeNote: "HiDream Q6 は 2048×2048 の正方形画像を生成します。M4 Pro では数分かかる場合があります。",
    imageIntro: "HiDream-O1 Q6 で Mac 上に画像をローカル生成します。", imageEyebrow: "ローカル画像生成", imageHeadline: "想像を<span>画像に。</span>",
    imagePreviewLabel: "生成画像", imagePreviewTitle: "画像プレビュー", imageEmpty: "生成した画像が<br>ここに表示されます",
    imageEmptyHint: "説明を入力して生成", imageLongRunning: "Q6 の正方形画像生成には数分かかる場合があります。推論はこの端末内で行われます。",
    imageDownload: "画像をダウンロード", imageModelSettings: "ローカル HiDream 画像モデル",
    imageModelSource: "HiDream-O1 Q6 モデルカード ↗", imageSetupHint: "モデルリポジトリの推論コードと独立した Python 環境が必要です。プロジェクト README を参照してください。"
  },
  ko: {
    modeVideo: "동영상", modeImage: "텍스트→이미지", imageChecking: "HiDream 이미지 모델 확인 중…",
    imageReady: "HiDream Q6 준비 완료", imageModelMissing: "HiDream Q6 전체 가중치를 찾을 수 없습니다",
    imageRuntimeMissing: "HiDream 추론 환경이 설치되지 않았습니다", imageCodeLink: "HiDream 추론 코드 받기 ↗",
    imageModelLink: "HiDream Q6 가중치 받기 ↗", imagePromptLabel: "만들고 싶은 이미지를 설명하세요",
    imagePromptHint: "대상, 배경, 조명, 스타일을 자세히 입력하세요", imagePromptPlaceholder: "비 온 뒤 교토 골목, 격자 창문 너머의 따뜻한 빛, 돌길에 비친 종이 등불, 필름 사진, 자연스러운 디테일.",
    imageGenerate: "이미지 생성", imageGenerating: "이미지 생성 중…",
    imageComputeNote: "HiDream Q6는 2048×2048 정사각형 이미지를 생성합니다. M4 Pro에서 몇 분 걸릴 수 있습니다.",
    imageIntro: "HiDream-O1 Q6로 Mac에서 텍스트를 이미지로 로컬 생성하세요.", imageEyebrow: "로컬 이미지 생성", imageHeadline: "상상을<span>이미지로.</span>",
    imagePreviewLabel: "이미지 결과", imagePreviewTitle: "이미지 미리보기", imageEmpty: "생성한 이미지가<br>여기에 표시됩니다",
    imageEmptyHint: "설명을 입력해 시작하세요", imageLongRunning: "Q6 정사각형 이미지 생성은 몇 분 걸릴 수 있으며 추론은 이 기기에서 실행됩니다.",
    imageDownload: "이미지 다운로드", imageModelSettings: "로컬 HiDream 이미지 모델",
    imageModelSource: "HiDream-O1 Q6 모델 카드 ↗", imageSetupHint: "모델 저장소의 추론 코드와 별도의 Python 환경이 필요합니다. 프로젝트 README를 확인하세요."
  },
  es: {
    modeVideo: "Vídeo", modeImage: "Texto a imagen", imageChecking: "Comprobando el modelo de imagen HiDream…",
    imageReady: "HiDream Q6 está listo", imageModelMissing: "No se encontraron todos los pesos de HiDream Q6",
    imageRuntimeMissing: "El entorno de inferencia HiDream no está instalado", imageCodeLink: "Obtener código de inferencia HiDream ↗",
    imageModelLink: "Obtener pesos HiDream Q6 ↗", imagePromptLabel: "Describe la imagen que quieres crear",
    imagePromptHint: "Incluye sujeto, entorno, iluminación y estilo", imagePromptPlaceholder: "Un callejón de Kioto tras la lluvia, luz cálida tras ventanas de madera, faroles reflejados en piedra, fotografía analógica, detalles naturales.",
    imageGenerate: "Generar imagen", imageGenerating: "Generando imagen…",
    imageComputeNote: "HiDream Q6 genera imágenes cuadradas de 2048×2048; puede tardar varios minutos en un M4 Pro.",
    imageIntro: "Genera imágenes de texto localmente en tu Mac con HiDream-O1 Q6.", imageEyebrow: "GENERACIÓN LOCAL DE IMÁGENES", imageHeadline: "Convierte la imaginación <span>en imágenes.</span>",
    imagePreviewLabel: "RESULTADO", imagePreviewTitle: "Vista previa", imageEmpty: "Tu imagen<br>aparecerá aquí",
    imageEmptyHint: "Escribe una descripción para empezar", imageLongRunning: "La generación cuadrada Q6 puede tardar varios minutos; la inferencia se ejecuta en este dispositivo.",
    imageDownload: "Descargar imagen", imageModelSettings: "Modelo HiDream local",
    imageModelSource: "Ficha del modelo HiDream-O1 Q6 ↗", imageSetupHint: "Se requieren el código de inferencia del repositorio y un entorno Python independiente; consulta el README del proyecto."
  },
  pt: {
    modeVideo: "Vídeo", modeImage: "Texto para imagem", imageChecking: "Verificando o modelo de imagem HiDream…",
    imageReady: "HiDream Q6 está pronto", imageModelMissing: "Os pesos completos do HiDream Q6 não foram encontrados",
    imageRuntimeMissing: "O ambiente de inferência HiDream não está instalado", imageCodeLink: "Obter código de inferência HiDream ↗",
    imageModelLink: "Obter pesos HiDream Q6 ↗", imagePromptLabel: "Descreva a imagem que deseja criar",
    imagePromptHint: "Inclua assunto, cenário, iluminação e estilo", imagePromptPlaceholder: "Um beco de Kyoto após a chuva, luz quente atrás de janelas de madeira, lanternas refletidas na pedra, fotografia analógica, detalhes naturais.",
    imageGenerate: "Gerar imagem", imageGenerating: "Gerando imagem…",
    imageComputeNote: "HiDream Q6 gera imagens quadradas de 2048×2048; pode levar alguns minutos no M4 Pro.",
    imageIntro: "Gere imagens a partir de texto localmente no Mac com HiDream-O1 Q6.", imageEyebrow: "GERAÇÃO LOCAL DE IMAGENS", imageHeadline: "Transforme a imaginação <span>em imagem.</span>",
    imagePreviewLabel: "RESULTADO", imagePreviewTitle: "Pré-visualização", imageEmpty: "Sua imagem<br>aparecerá aqui",
    imageEmptyHint: "Digite uma descrição para começar", imageLongRunning: "A geração quadrada Q6 pode levar alguns minutos; a inferência permanece neste dispositivo.",
    imageDownload: "Baixar imagem", imageModelSettings: "Modelo HiDream local",
    imageModelSource: "Cartão do modelo HiDream-O1 Q6 ↗", imageSetupHint: "O código de inferência do repositório e um ambiente Python separado são necessários; consulte o README do projeto."
  },
  tr: {
    modeVideo: "Video", modeImage: "Metinden görsele", imageChecking: "HiDream görsel modeli denetleniyor…",
    imageReady: "HiDream Q6 hazır", imageModelMissing: "Tam HiDream Q6 ağırlıkları bulunamadı",
    imageRuntimeMissing: "HiDream çıkarım ortamı kurulu değil", imageCodeLink: "HiDream çıkarım kodunu al ↗",
    imageModelLink: "HiDream Q6 ağırlıklarını al ↗", imagePromptLabel: "Oluşturmak istediğiniz görseli açıklayın",
    imagePromptHint: "Konu, ortam, ışık ve stili belirtin", imagePromptPlaceholder: "Yağmur sonrası Kyoto ara sokağı, ahşap kafes pencerelerden sıcak ışık, taşlarda yansıyan kâğıt fenerler, film fotoğrafı, doğal ayrıntılar.",
    imageGenerate: "Görsel oluştur", imageGenerating: "Görsel oluşturuluyor…",
    imageComputeNote: "HiDream Q6, 2048×2048 kare görseller üretir; M4 Pro'da birkaç dakika sürebilir.",
    imageIntro: "HiDream-O1 Q6 ile Mac'inizde yerel olarak metinden görsel oluşturun.", imageEyebrow: "YEREL GÖRSEL ÜRETİMİ", imageHeadline: "Hayal gücünü <span>görsele dönüştür.</span>",
    imagePreviewLabel: "GÖRSEL SONUCU", imagePreviewTitle: "Görsel önizlemesi", imageEmpty: "Görseliniz<br>burada görünecek",
    imageEmptyHint: "Başlamak için bir istem girin", imageLongRunning: "Q6 kare görsel üretimi birkaç dakika sürebilir; çıkarım bu cihazda çalışır.",
    imageDownload: "Görseli indir", imageModelSettings: "Yerel HiDream görsel modeli",
    imageModelSource: "HiDream-O1 Q6 model kartı ↗", imageSetupHint: "Depodaki çıkarım kodu ve ayrı bir Python ortamı gerekir; proje README dosyasına bakın."
  },
  ar: {
    modeVideo: "فيديو", modeImage: "نص إلى صورة", imageChecking: "جارٍ فحص نموذج HiDream للصور…",
    imageReady: "نموذج HiDream Q6 جاهز", imageModelMissing: "لم يتم العثور على أوزان HiDream Q6 كاملة",
    imageRuntimeMissing: "بيئة استدلال HiDream غير مثبتة", imageCodeLink: "الحصول على كود استدلال HiDream ↗",
    imageModelLink: "الحصول على أوزان HiDream Q6 ↗", imagePromptLabel: "صف الصورة التي تريد إنشاءها",
    imagePromptHint: "اذكر العنصر والمشهد والإضاءة والأسلوب", imagePromptPlaceholder: "زقاق في كيوتو بعد المطر، ضوء دافئ خلف نوافذ خشبية، فوانيس ورقية تنعكس على الحجر، تصوير فيلمي وتفاصيل طبيعية.",
    imageGenerate: "إنشاء صورة", imageGenerating: "جارٍ إنشاء الصورة…",
    imageComputeNote: "ينشئ HiDream Q6 صورًا مربعة 2048×2048؛ قد يستغرق ذلك دقائق على M4 Pro.",
    imageIntro: "أنشئ صورًا من النص محليًا على Mac باستخدام HiDream-O1 Q6.", imageEyebrow: "إنشاء الصور محليًا", imageHeadline: "حوّل الخيال <span>إلى صورة.</span>",
    imagePreviewLabel: "نتيجة الصورة", imagePreviewTitle: "معاينة الصورة", imageEmpty: "ستظهر صورتك<br>هنا",
    imageEmptyHint: "أدخل وصفًا للبدء", imageLongRunning: "قد يستغرق إنشاء الصور المربعة Q6 دقائق؛ يعمل الاستدلال على هذا الجهاز.",
    imageDownload: "تنزيل الصورة", imageModelSettings: "نموذج HiDream محلي",
    imageModelSource: "بطاقة نموذج HiDream-O1 Q6 ↗", imageSetupHint: "يلزم تثبيت كود الاستدلال من المستودع وبيئة Python مستقلة؛ راجع README المشروع."
  },
  vi: {
    modeVideo: "Video", modeImage: "Văn bản thành ảnh", imageChecking: "Đang kiểm tra mô hình ảnh HiDream…",
    imageReady: "HiDream Q6 đã sẵn sàng", imageModelMissing: "Không tìm thấy đầy đủ trọng số HiDream Q6",
    imageRuntimeMissing: "Chưa cài môi trường suy luận HiDream", imageCodeLink: "Lấy mã suy luận HiDream ↗",
    imageModelLink: "Lấy trọng số HiDream Q6 ↗", imagePromptLabel: "Mô tả hình ảnh bạn muốn tạo",
    imagePromptHint: "Nêu chủ thể, bối cảnh, ánh sáng và phong cách", imagePromptPlaceholder: "Ngõ Kyoto sau mưa, ánh đèn ấm sau cửa sổ gỗ, đèn lồng phản chiếu trên đá, ảnh phim, chi tiết tự nhiên.",
    imageGenerate: "Tạo hình ảnh", imageGenerating: "Đang tạo hình ảnh…",
    imageComputeNote: "HiDream Q6 tạo ảnh vuông 2048×2048; trên M4 Pro có thể mất vài phút.",
    imageIntro: "Tạo ảnh từ văn bản ngay trên máy Mac bằng HiDream-O1 Q6.", imageEyebrow: "TẠO ẢNH CỤC BỘ", imageHeadline: "Biến trí tưởng tượng <span>thành hình ảnh.</span>",
    imagePreviewLabel: "KẾT QUẢ ẢNH", imagePreviewTitle: "Xem trước hình ảnh", imageEmpty: "Hình ảnh của bạn<br>sẽ xuất hiện ở đây",
    imageEmptyHint: "Nhập mô tả để bắt đầu", imageLongRunning: "Tạo ảnh vuông Q6 có thể mất vài phút; suy luận chạy trên thiết bị này.",
    imageDownload: "Tải hình ảnh", imageModelSettings: "Mô hình ảnh HiDream cục bộ",
    imageModelSource: "Thẻ mô hình HiDream-O1 Q6 ↗", imageSetupHint: "Cần mã suy luận từ kho mô hình và môi trường Python riêng; xem README của dự án."
  },
  id: {
    modeVideo: "Video", modeImage: "Teks ke gambar", imageChecking: "Memeriksa model gambar HiDream…",
    imageReady: "HiDream Q6 siap", imageModelMissing: "Bobot HiDream Q6 lengkap tidak ditemukan",
    imageRuntimeMissing: "Lingkungan inferensi HiDream belum dipasang", imageCodeLink: "Dapatkan kode inferensi HiDream ↗",
    imageModelLink: "Dapatkan bobot HiDream Q6 ↗", imagePromptLabel: "Jelaskan gambar yang ingin dibuat",
    imagePromptHint: "Sertakan subjek, suasana, pencahayaan, dan gaya", imagePromptPlaceholder: "Gang Kyoto setelah hujan, cahaya hangat di balik jendela kayu, lentera kertas terpantul di batu, fotografi film, detail alami.",
    imageGenerate: "Buat gambar", imageGenerating: "Sedang membuat gambar…",
    imageComputeNote: "HiDream Q6 membuat gambar persegi 2048×2048; prosesnya dapat memakan beberapa menit di M4 Pro.",
    imageIntro: "Buat gambar dari teks secara lokal di Mac dengan HiDream-O1 Q6.", imageEyebrow: "PEMBUATAN GAMBAR LOKAL", imageHeadline: "Ubah imajinasi <span>menjadi gambar.</span>",
    imagePreviewLabel: "HASIL GAMBAR", imagePreviewTitle: "Pratinjau gambar", imageEmpty: "Gambar Anda<br>akan muncul di sini",
    imageEmptyHint: "Masukkan prompt untuk memulai", imageLongRunning: "Pembuatan gambar persegi Q6 dapat memakan beberapa menit; inferensi berjalan di perangkat ini.",
    imageDownload: "Unduh gambar", imageModelSettings: "Model gambar HiDream lokal",
    imageModelSource: "Kartu model HiDream-O1 Q6 ↗", imageSetupHint: "Kode inferensi dari repositori model dan lingkungan Python terpisah diperlukan; lihat README proyek."
  },
  ru: {
    modeVideo: "Видео", modeImage: "Текст в изображение", imageChecking: "Проверка модели HiDream…",
    imageReady: "HiDream Q6 готова", imageModelMissing: "Полные веса HiDream Q6 не найдены",
    imageRuntimeMissing: "Среда инференса HiDream не установлена", imageCodeLink: "Получить код инференса HiDream ↗",
    imageModelLink: "Получить веса HiDream Q6 ↗", imagePromptLabel: "Опишите изображение, которое нужно создать",
    imagePromptHint: "Укажите объект, сцену, освещение и стиль", imagePromptPlaceholder: "Переулок Киото после дождя, тёплый свет за деревянными окнами, бумажные фонари отражаются на камне, плёночная фотография, естественные детали.",
    imageGenerate: "Создать изображение", imageGenerating: "Создание изображения…",
    imageComputeNote: "HiDream Q6 создаёт квадратные изображения 2048×2048; на M4 Pro это может занять несколько минут.",
    imageIntro: "Создавайте изображения из текста локально на Mac с HiDream-O1 Q6.", imageEyebrow: "ЛОКАЛЬНАЯ ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ", imageHeadline: "Превратите воображение <span>в изображение.</span>",
    imagePreviewLabel: "РЕЗУЛЬТАТ", imagePreviewTitle: "Предпросмотр изображения", imageEmpty: "Ваше изображение<br>появится здесь",
    imageEmptyHint: "Введите описание, чтобы начать", imageLongRunning: "Создание квадратного изображения Q6 может занять несколько минут; инференс выполняется локально.",
    imageDownload: "Скачать изображение", imageModelSettings: "Локальная модель HiDream",
    imageModelSource: "Карточка модели HiDream-O1 Q6 ↗", imageSetupHint: "Нужны код инференса из репозитория модели и отдельная среда Python; см. README проекта."
  }
};

const promptEnhancerTranslations = {
  "zh-CN": {
    enhancerModelLabel: "本地文本模型", enhancerModelLoading: "正在查找本地文本模型…",
    enhancerNoModels: "未发现可用的本地文本模型", enhancePrompt: "提取关键词并优化",
    enhancingPrompt: "正在用本地模型提取关键词并优化…", enhancerKeywords: "提取的关键词",
    enhancerOptimizedPrompt: "优化后的提示词", enhancerApply: "替换原提示词", enhancerDismiss: "关闭",
    enhanceFailed: "本地提示词优化失败，请确认 OMLX 服务和所选模型可用。",
    enhancerOffline: "无法连接本地文本模型服务；请先启动 OMLX。", enhancerPrivacy: "提示词只发送到本机 OMLX 服务。"
  },
  en: {
    enhancerModelLabel: "Local text model", enhancerModelLoading: "Finding local text models…",
    enhancerNoModels: "No local text models are available", enhancePrompt: "Extract keywords & optimize",
    enhancingPrompt: "Extracting keywords and optimizing locally…", enhancerKeywords: "Extracted keywords",
    enhancerOptimizedPrompt: "Optimized prompt", enhancerApply: "Replace original prompt", enhancerDismiss: "Dismiss",
    enhanceFailed: "Local prompt optimization failed. Check that OMLX and the selected model are available.",
    enhancerOffline: "Could not reach the local text-model service. Start OMLX first.", enhancerPrivacy: "Prompts are sent only to the OMLX service on this device."
  },
  "zh-TW": {
    enhancerModelLabel: "本機文字模型", enhancerModelLoading: "正在尋找本機文字模型…",
    enhancerNoModels: "找不到可用的本機文字模型", enhancePrompt: "擷取關鍵詞並最佳化",
    enhancingPrompt: "正在使用本機模型擷取關鍵詞並最佳化…", enhancerKeywords: "擷取的關鍵詞",
    enhancerOptimizedPrompt: "最佳化後的提示詞", enhancerApply: "取代原提示詞", enhancerDismiss: "關閉",
    enhanceFailed: "本機提示詞最佳化失敗，請確認 OMLX 服務與所選模型可用。",
    enhancerOffline: "無法連線至本機文字模型服務；請先啟動 OMLX。", enhancerPrivacy: "提示詞只會傳送至本機 OMLX 服務。"
  },
  fr: {
    enhancerModelLabel: "Modèle de texte local", enhancerModelLoading: "Recherche des modèles locaux…",
    enhancerNoModels: "Aucun modèle de texte local disponible", enhancePrompt: "Extraire les mots-clés et optimiser",
    enhancingPrompt: "Extraction et optimisation locales en cours…", enhancerKeywords: "Mots-clés extraits",
    enhancerOptimizedPrompt: "Prompt optimisé", enhancerApply: "Remplacer le prompt initial", enhancerDismiss: "Fermer",
    enhanceFailed: "Échec de l’optimisation locale. Vérifiez OMLX et le modèle sélectionné.",
    enhancerOffline: "Service de modèles local inaccessible. Démarrez OMLX.", enhancerPrivacy: "Les prompts sont envoyés uniquement à OMLX sur cet appareil."
  },
  de: {
    enhancerModelLabel: "Lokales Sprachmodell", enhancerModelLoading: "Lokale Sprachmodelle werden gesucht…",
    enhancerNoModels: "Keine lokalen Sprachmodelle verfügbar", enhancePrompt: "Schlüsselwörter extrahieren & optimieren",
    enhancingPrompt: "Schlüsselwörter werden lokal extrahiert und optimiert…", enhancerKeywords: "Extrahierte Schlüsselwörter",
    enhancerOptimizedPrompt: "Optimierter Prompt", enhancerApply: "Ursprünglichen Prompt ersetzen", enhancerDismiss: "Schließen",
    enhanceFailed: "Lokale Prompt-Optimierung fehlgeschlagen. Prüfe OMLX und das gewählte Modell.",
    enhancerOffline: "Lokaler Modelldienst nicht erreichbar. Starte zuerst OMLX.", enhancerPrivacy: "Prompts werden nur an OMLX auf diesem Gerät gesendet."
  },
  ja: {
    enhancerModelLabel: "ローカルテキストモデル", enhancerModelLoading: "ローカルモデルを検索中…",
    enhancerNoModels: "利用可能なローカルテキストモデルがありません", enhancePrompt: "キーワード抽出・最適化",
    enhancingPrompt: "ローカルでキーワードを抽出して最適化中…", enhancerKeywords: "抽出したキーワード",
    enhancerOptimizedPrompt: "最適化したプロンプト", enhancerApply: "元のプロンプトを置き換える", enhancerDismiss: "閉じる",
    enhanceFailed: "ローカル最適化に失敗しました。OMLX と選択モデルを確認してください。",
    enhancerOffline: "ローカルモデルサービスに接続できません。OMLX を起動してください。", enhancerPrivacy: "プロンプトはこの端末上の OMLX にのみ送信されます。"
  },
  ko: {
    enhancerModelLabel: "로컬 텍스트 모델", enhancerModelLoading: "로컬 텍스트 모델 검색 중…",
    enhancerNoModels: "사용 가능한 로컬 텍스트 모델이 없습니다", enhancePrompt: "키워드 추출 및 최적화",
    enhancingPrompt: "로컬에서 키워드를 추출하고 최적화하는 중…", enhancerKeywords: "추출된 키워드",
    enhancerOptimizedPrompt: "최적화된 프롬프트", enhancerApply: "원래 프롬프트 교체", enhancerDismiss: "닫기",
    enhanceFailed: "로컬 최적화에 실패했습니다. OMLX와 선택한 모델을 확인하세요.",
    enhancerOffline: "로컬 텍스트 모델 서비스에 연결할 수 없습니다. OMLX를 시작하세요.", enhancerPrivacy: "프롬프트는 이 기기의 OMLX 서비스로만 전송됩니다."
  },
  es: {
    enhancerModelLabel: "Modelo de texto local", enhancerModelLoading: "Buscando modelos locales…",
    enhancerNoModels: "No hay modelos de texto locales disponibles", enhancePrompt: "Extraer palabras clave y optimizar",
    enhancingPrompt: "Extrayendo palabras clave y optimizando localmente…", enhancerKeywords: "Palabras clave extraídas",
    enhancerOptimizedPrompt: "Prompt optimizado", enhancerApply: "Reemplazar el prompt original", enhancerDismiss: "Cerrar",
    enhanceFailed: "Falló la optimización local. Comprueba OMLX y el modelo seleccionado.",
    enhancerOffline: "No se puede conectar al servicio local. Inicia OMLX.", enhancerPrivacy: "Los prompts solo se envían a OMLX en este dispositivo."
  },
  pt: {
    enhancerModelLabel: "Modelo de texto local", enhancerModelLoading: "Buscando modelos locais…",
    enhancerNoModels: "Nenhum modelo de texto local disponível", enhancePrompt: "Extrair palavras-chave e otimizar",
    enhancingPrompt: "Extraindo palavras-chave e otimizando localmente…", enhancerKeywords: "Palavras-chave extraídas",
    enhancerOptimizedPrompt: "Prompt otimizado", enhancerApply: "Substituir o prompt original", enhancerDismiss: "Fechar",
    enhanceFailed: "Falha na otimização local. Verifique o OMLX e o modelo selecionado.",
    enhancerOffline: "Não foi possível acessar o serviço local. Inicie o OMLX.", enhancerPrivacy: "Os prompts são enviados somente ao OMLX neste dispositivo."
  },
  tr: {
    enhancerModelLabel: "Yerel metin modeli", enhancerModelLoading: "Yerel metin modelleri aranıyor…",
    enhancerNoModels: "Kullanılabilir yerel metin modeli yok", enhancePrompt: "Anahtar kelimeleri çıkar ve iyileştir",
    enhancingPrompt: "Anahtar kelimeler yerel olarak çıkarılıp iyileştiriliyor…", enhancerKeywords: "Çıkarılan anahtar kelimeler",
    enhancerOptimizedPrompt: "İyileştirilmiş istem", enhancerApply: "Özgün istemi değiştir", enhancerDismiss: "Kapat",
    enhanceFailed: "Yerel iyileştirme başarısız. OMLX ve seçilen modeli kontrol edin.",
    enhancerOffline: "Yerel model hizmetine ulaşılamıyor. Önce OMLX'i başlatın.", enhancerPrivacy: "İstemler yalnızca bu cihazdaki OMLX'e gönderilir."
  },
  ar: {
    enhancerModelLabel: "نموذج نصي محلي", enhancerModelLoading: "جارٍ البحث عن نماذج نصية محلية…",
    enhancerNoModels: "لا تتوفر نماذج نصية محلية", enhancePrompt: "استخراج الكلمات المفتاحية وتحسينها",
    enhancingPrompt: "جارٍ استخراج الكلمات المفتاحية والتحسين محليًا…", enhancerKeywords: "الكلمات المفتاحية المستخرجة",
    enhancerOptimizedPrompt: "الوصف المحسّن", enhancerApply: "استبدال الوصف الأصلي", enhancerDismiss: "إغلاق",
    enhanceFailed: "تعذّر التحسين المحلي. تحقق من OMLX والنموذج المحدد.",
    enhancerOffline: "تعذّر الاتصال بخدمة النماذج المحلية. ابدأ OMLX أولًا.", enhancerPrivacy: "تُرسل الأوصاف إلى OMLX على هذا الجهاز فقط."
  },
  vi: {
    enhancerModelLabel: "Mô hình văn bản cục bộ", enhancerModelLoading: "Đang tìm mô hình văn bản cục bộ…",
    enhancerNoModels: "Không có mô hình văn bản cục bộ khả dụng", enhancePrompt: "Trích xuất từ khóa và tối ưu",
    enhancingPrompt: "Đang trích xuất từ khóa và tối ưu cục bộ…", enhancerKeywords: "Từ khóa đã trích xuất",
    enhancerOptimizedPrompt: "Prompt đã tối ưu", enhancerApply: "Thay thế prompt ban đầu", enhancerDismiss: "Đóng",
    enhanceFailed: "Tối ưu cục bộ thất bại. Hãy kiểm tra OMLX và mô hình đã chọn.",
    enhancerOffline: "Không thể kết nối dịch vụ mô hình cục bộ. Hãy khởi động OMLX.", enhancerPrivacy: "Prompt chỉ được gửi đến OMLX trên thiết bị này."
  },
  id: {
    enhancerModelLabel: "Model teks lokal", enhancerModelLoading: "Mencari model teks lokal…",
    enhancerNoModels: "Tidak ada model teks lokal yang tersedia", enhancePrompt: "Ekstrak kata kunci & optimalkan",
    enhancingPrompt: "Mengekstrak kata kunci dan mengoptimalkan secara lokal…", enhancerKeywords: "Kata kunci yang diekstrak",
    enhancerOptimizedPrompt: "Prompt yang dioptimalkan", enhancerApply: "Ganti prompt asli", enhancerDismiss: "Tutup",
    enhanceFailed: "Optimasi lokal gagal. Periksa OMLX dan model yang dipilih.",
    enhancerOffline: "Tidak dapat menghubungi layanan model lokal. Jalankan OMLX terlebih dahulu.", enhancerPrivacy: "Prompt hanya dikirim ke OMLX di perangkat ini."
  },
  ru: {
    enhancerModelLabel: "Локальная языковая модель", enhancerModelLoading: "Поиск локальных моделей…",
    enhancerNoModels: "Локальные языковые модели недоступны", enhancePrompt: "Извлечь ключевые слова и улучшить",
    enhancingPrompt: "Локальное извлечение ключевых слов и улучшение…", enhancerKeywords: "Извлечённые ключевые слова",
    enhancerOptimizedPrompt: "Улучшенный промпт", enhancerApply: "Заменить исходный промпт", enhancerDismiss: "Закрыть",
    enhanceFailed: "Локальное улучшение не удалось. Проверьте OMLX и выбранную модель.",
    enhancerOffline: "Нет связи с локальной службой моделей. Запустите OMLX.", enhancerPrivacy: "Промпты отправляются только в OMLX на этом устройстве."
  }
};

const languageSelect = document.querySelector("#language");
const historyTranslations = {
  "zh-CN": { historyTitle: "历史项目", historyCategory: "历史项目分类", historyAll: "全部", historyVideo: "视频", historyImage: "图像", historyMusic: "音乐", historyEmpty: "暂无此分类的历史项目", historyNoPrompt: "未保存提示词", historyLoadError: "无法读取历史项目", historyCount: "个项目" },
  en: { historyTitle: "Project history", historyCategory: "History category", historyAll: "All", historyVideo: "Video", historyImage: "Image", historyMusic: "Music", historyEmpty: "No projects in this category yet", historyNoPrompt: "Prompt not saved", historyLoadError: "Could not load project history", historyCount: "items" },
  "zh-TW": { historyTitle: "歷史專案", historyCategory: "歷史專案分類", historyAll: "全部", historyVideo: "影片", historyImage: "圖片", historyMusic: "音樂", historyEmpty: "此分類目前沒有歷史專案", historyNoPrompt: "未儲存提示詞", historyLoadError: "無法讀取歷史專案", historyCount: "個專案" },
  fr: { historyTitle: "Historique des créations", historyCategory: "Catégorie de l’historique", historyAll: "Tout", historyVideo: "Vidéo", historyImage: "Image", historyMusic: "Musique", historyEmpty: "Aucune création dans cette catégorie", historyNoPrompt: "Prompt non enregistré", historyLoadError: "Impossible de charger l’historique", historyCount: "éléments" },
  de: { historyTitle: "Projektverlauf", historyCategory: "Verlaufskategorie", historyAll: "Alle", historyVideo: "Video", historyImage: "Bild", historyMusic: "Musik", historyEmpty: "Noch keine Projekte in dieser Kategorie", historyNoPrompt: "Prompt nicht gespeichert", historyLoadError: "Projektverlauf konnte nicht geladen werden", historyCount: "Einträge" },
  ja: { historyTitle: "履歴", historyCategory: "履歴カテゴリ", historyAll: "すべて", historyVideo: "動画", historyImage: "画像", historyMusic: "音楽", historyEmpty: "このカテゴリの履歴はありません", historyNoPrompt: "プロンプトは保存されていません", historyLoadError: "履歴を読み込めませんでした", historyCount: "件" },
  ko: { historyTitle: "프로젝트 기록", historyCategory: "기록 카테고리", historyAll: "전체", historyVideo: "동영상", historyImage: "이미지", historyMusic: "음악", historyEmpty: "이 카테고리에 기록이 없습니다", historyNoPrompt: "프롬프트가 저장되지 않았습니다", historyLoadError: "프로젝트 기록을 불러올 수 없습니다", historyCount: "개 항목" },
  es: { historyTitle: "Historial de proyectos", historyCategory: "Categoría del historial", historyAll: "Todo", historyVideo: "Vídeo", historyImage: "Imagen", historyMusic: "Música", historyEmpty: "Aún no hay proyectos en esta categoría", historyNoPrompt: "Prompt no guardado", historyLoadError: "No se pudo cargar el historial", historyCount: "elementos" },
  pt: { historyTitle: "Histórico de projetos", historyCategory: "Categoria do histórico", historyAll: "Todos", historyVideo: "Vídeo", historyImage: "Imagem", historyMusic: "Música", historyEmpty: "Ainda não há projetos nesta categoria", historyNoPrompt: "Prompt não salvo", historyLoadError: "Não foi possível carregar o histórico", historyCount: "itens" },
  tr: { historyTitle: "Proje geçmişi", historyCategory: "Geçmiş kategorisi", historyAll: "Tümü", historyVideo: "Video", historyImage: "Görsel", historyMusic: "Müzik", historyEmpty: "Bu kategoride henüz proje yok", historyNoPrompt: "İstem kaydedilmedi", historyLoadError: "Proje geçmişi yüklenemedi", historyCount: "öğe" },
  ar: { historyTitle: "سجل المشاريع", historyCategory: "فئة السجل", historyAll: "الكل", historyVideo: "فيديو", historyImage: "صورة", historyMusic: "موسيقى", historyEmpty: "لا توجد مشاريع في هذه الفئة بعد", historyNoPrompt: "لم يُحفظ الوصف", historyLoadError: "تعذر تحميل سجل المشاريع", historyCount: "عناصر" },
  vi: { historyTitle: "Lịch sử dự án", historyCategory: "Danh mục lịch sử", historyAll: "Tất cả", historyVideo: "Video", historyImage: "Hình ảnh", historyMusic: "Âm nhạc", historyEmpty: "Chưa có dự án trong danh mục này", historyNoPrompt: "Chưa lưu câu lệnh", historyLoadError: "Không thể tải lịch sử dự án", historyCount: "mục" },
  id: { historyTitle: "Riwayat proyek", historyCategory: "Kategori riwayat", historyAll: "Semua", historyVideo: "Video", historyImage: "Gambar", historyMusic: "Musik", historyEmpty: "Belum ada proyek dalam kategori ini", historyNoPrompt: "Prompt tidak disimpan", historyLoadError: "Riwayat proyek tidak dapat dimuat", historyCount: "item" },
  ru: { historyTitle: "История проектов", historyCategory: "Категория истории", historyAll: "Все", historyVideo: "Видео", historyImage: "Изображения", historyMusic: "Музыка", historyEmpty: "В этой категории пока нет проектов", historyNoPrompt: "Промпт не сохранён", historyLoadError: "Не удалось загрузить историю проектов", historyCount: "элементов" }
};
const settingsDialog = document.querySelector("#settings-dialog");
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");
const settingsSaveButton = document.querySelector("#settings-save");
const form = document.querySelector("#generation-form");
const promptInput = document.querySelector("#prompt");
const promptEnhancerModel = document.querySelector("#prompt-enhancer-model");
const enhancePromptButton = document.querySelector("#enhance-prompt-button");
const promptEnhancerStatus = document.querySelector("#prompt-enhancer-status");
const promptEnhancerResult = document.querySelector("#prompt-enhancer-result");
const promptEnhancerKeywords = document.querySelector("#prompt-enhancer-keywords");
const promptEnhancerOutput = document.querySelector("#prompt-enhancer-output");
const applyEnhancedPromptButton = document.querySelector("#apply-enhanced-prompt");
const dismissEnhancedPromptButton = document.querySelector("#dismiss-enhanced-prompt");
const generateButton = document.querySelector("#generate-button");
const generateLabel = document.querySelector("#generate-label");
const videoModeButton = document.querySelector("#video-mode-button");
const imageModeButton = document.querySelector("#image-mode-button");
const musicModeButton = document.querySelector("#music-mode-button");
const videoModelSection = document.querySelector("#video-model-section");
const imageModelSection = document.querySelector("#image-model-section");
const musicModelSection = document.querySelector("#music-model-section");
const videoControls = document.querySelector("#video-controls");
const imageControls = document.querySelector("#image-controls");
const musicControls = document.querySelector("#music-controls");
const musicLyricsMode = document.querySelector("#music-lyrics-mode");
const musicLyricsField = document.querySelector("#music-lyrics-field");
const musicLyricsInput = document.querySelector("#music-lyrics");
const musicModelTitle = document.querySelector("#music-model-title");
const musicModelDescription = document.querySelector("#music-model-description");
const musicModelLinks = document.querySelector("#music-model-links");
const musicModelPath = document.querySelector("#music-model-path");
const musicModelNotice = document.querySelector("#music-model-notice");
const modelNotice = document.querySelector("#model-notice");
const modelTitle = document.querySelector("#model-title");
const modelDescription = document.querySelector("#model-description");
const modelLinks = document.querySelector("#model-links");
const modelPath = document.querySelector("#model-path");
const loadModelButton = document.querySelector("#load-model-button");
const turboToggle = document.querySelector("#turbo");
const stepsSelect = document.querySelector("#steps");
const statusChip = document.querySelector("#job-status");
const emptyState = document.querySelector("#empty-state");
const loadingState = document.querySelector("#loading-state");
const loadingTitle = document.querySelector("#loading-title");
const cancelButton = document.querySelector("#cancel-button");
const video = document.querySelector("#video-result");
const image = document.querySelector("#image-result");
const audio = document.querySelector("#audio-result");
const resultFooter = document.querySelector("#result-footer");
const imageModelNotice = document.querySelector("#image-model-notice");
const imageModelTitle = document.querySelector("#image-model-title");
const imageModelDescription = document.querySelector("#image-model-description");
const imageModelLinks = document.querySelector("#image-model-links");
const imageModelPath = document.querySelector("#image-model-path");
const imageDownloadLink = document.querySelector("#download-image");
const logPanel = document.querySelector("#log-panel");
const jobLogs = document.querySelector("#job-logs");
const historyList = document.querySelector("#history-list");
const historyStatus = document.querySelector("#history-status");
const historyCount = document.querySelector("#history-count");
let currentJob = null;
let historyItems = [];
let historyFilter = "all";
let modelInfo = null;
let textModelsAvailable = false;
let promptEnhancementBusy = false;
let promptEnhancerStatusKey = "";
let activeMode = ["image", "music"].includes(localStorage.getItem("h3-mode"))
  ? localStorage.getItem("h3-mode")
  : "video";
let pollTimer = null;
let modelPollTimer = null;

function t(key) {
  const lang = languageSelect.value;
  return historyTranslations[lang]?.[key] || settingsTranslations[lang]?.[key] || promptEnhancerTranslations[lang]?.[key] || musicTranslations[lang]?.[key] ||
    imageTranslations[lang]?.[key] || workflowTranslations[lang]?.[key] ||
    translations[lang]?.[key] || historyTranslations.en[key] || settingsTranslations.en[key] || promptEnhancerTranslations.en[key] || musicTranslations.en[key] || imageTranslations.en[key] ||
    workflowTranslations.en[key] || translations.en[key] || key;
}

function applyLanguage() {
  const lang = languageSelect.value;
  const rtl = lang === "ar";
  document.documentElement.lang = lang;
  document.documentElement.dir = rtl ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const value = t(node.dataset.i18n);
    if (node.tagName === "H1" || node.id === "preview-empty-copy") node.innerHTML = value;
    else node.textContent = value;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = t(node.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("option[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelector(".language-picker select").setAttribute("aria-label", t("language"));
  document.querySelector("#settings-open").setAttribute("aria-label", t("settingsButton"));
  document.querySelector("#settings-close").setAttribute("aria-label", t("settingsCancel"));
  document.querySelector(".mode-switch").setAttribute("aria-label", t("generationMode"));
  document.querySelector(".history-filters").setAttribute("aria-label", t("historyCategory"));
  updateModeUI();
  updateTurboSteps();
  if (promptEnhancerStatusKey) promptEnhancerStatus.textContent = t(promptEnhancerStatusKey);
  enhancePromptButton.textContent = t(promptEnhancementBusy ? "enhancingPrompt" : "enhancePrompt");
  if (modelInfo) renderModelInfo(modelInfo);
  if (currentJob) renderJob(currentJob);
  renderHistory();
}

function showSettingsStatus(message, isError = false) {
  settingsStatus.textContent = message;
  settingsStatus.hidden = !message;
  settingsStatus.classList.toggle("error", isError);
}

function populateSettings(settings) {
  document.querySelector("#settings-video-path").value = settings.video.model_path;
  document.querySelector("#settings-video-url").value = settings.video.service_url;
  document.querySelector("#settings-video-model").value = settings.video.model_id;
  document.querySelector("#settings-video-params").value = JSON.stringify(settings.video.api_params, null, 2);
  document.querySelector("#settings-image-path").value = settings.image.model_path;
  document.querySelector("#settings-music-path").value = settings.music.model_path;
  document.querySelector("#settings-text-url").value = settings.text.service_url;
  document.querySelector("#settings-text-models").value = settings.text.model_ids.join("\n");
  document.querySelector("#settings-text-params").value = JSON.stringify(settings.text.api_params, null, 2);
}

async function openSettings() {
  settingsDialog.showModal();
  showSettingsStatus("");
  try {
    const response = await fetch("/api/settings", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || "settings_unavailable");
    populateSettings(data.settings);
  } catch (error) {
    showSettingsStatus(`${t("settingsSaveError")} ${error.message}`, true);
  }
}

function settingsFormPayload() {
  const parseJsonObject = (selector) => {
    const value = JSON.parse(document.querySelector(selector).value || "{}");
    if (!value || Array.isArray(value) || typeof value !== "object") throw new Error("Expected a JSON object.");
    return value;
  };
  return {
    video: {
      model_path: document.querySelector("#settings-video-path").value.trim(),
      service_url: document.querySelector("#settings-video-url").value.trim(),
      model_id: document.querySelector("#settings-video-model").value.trim(),
      api_params: parseJsonObject("#settings-video-params")
    },
    image: { model_path: document.querySelector("#settings-image-path").value.trim() },
    music: { model_path: document.querySelector("#settings-music-path").value.trim() },
    text: {
      service_url: document.querySelector("#settings-text-url").value.trim(),
      model_ids: document.querySelector("#settings-text-models").value.split(/\r?\n/).map((id) => id.trim()).filter(Boolean),
      api_params: parseJsonObject("#settings-text-params")
    }
  };
}

settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  settingsSaveButton.disabled = true;
  showSettingsStatus(t("settingsSaving"));
  try {
    const response = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settingsFormPayload())
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || "settings_save_failed");
    populateSettings(data.settings);
    showSettingsStatus(t("settingsSaved"));
    await Promise.all([loadModels(), loadTextModels()]);
  } catch (error) {
    showSettingsStatus(`${t("settingsSaveError")} ${error.message}`, true);
  } finally {
    settingsSaveButton.disabled = false;
  }
});

document.querySelector("#settings-open").addEventListener("click", openSettings);
document.querySelector("#settings-close").addEventListener("click", () => settingsDialog.close());
document.querySelector("#settings-cancel").addEventListener("click", () => settingsDialog.close());

function updateModeUI() {
  const isImage = activeMode === "image";
  const isMusic = activeMode === "music";
  const isVideo = !isImage && !isMusic;
  const modeKey = isMusic ? "music" : isImage ? "image" : "video";
  const modeTextKey = (key) => isVideo ? key : `${modeKey}${key[0].toUpperCase()}${key.slice(1)}`;
  const emptyTextKey = isVideo ? "previewEmpty" : `${modeKey}Empty`;
  const emptyHintTextKey = isVideo ? "previewEmptyHint" : `${modeKey}EmptyHint`;
  videoModeButton.classList.toggle("active", isVideo);
  imageModeButton.classList.toggle("active", isImage);
  musicModeButton.classList.toggle("active", isMusic);
  videoModeButton.setAttribute("aria-pressed", String(isVideo));
  imageModeButton.setAttribute("aria-pressed", String(isImage));
  musicModeButton.setAttribute("aria-pressed", String(isMusic));
  videoModelSection.hidden = !isVideo;
  imageModelSection.hidden = !isImage;
  musicModelSection.hidden = !isMusic;
  videoControls.hidden = !isVideo;
  imageControls.hidden = !isImage;
  musicControls.hidden = !isMusic;
  musicLyricsField.hidden = musicLyricsMode.value !== "lyrics";
  musicLyricsInput.required = isMusic && musicLyricsMode.value === "lyrics";

  document.querySelector("#intro-eyebrow").dataset.i18n = modeTextKey("eyebrow");
  document.querySelector("h1").dataset.i18n = modeTextKey("headline");
  document.querySelector(".intro-copy").dataset.i18n = modeTextKey("intro");
  document.querySelector("#prompt-label").dataset.i18n = modeTextKey("promptLabel");
  document.querySelector("#prompt-hint").dataset.i18n = modeTextKey("promptHint");
  promptInput.dataset.i18nPlaceholder = modeTextKey("promptPlaceholder");
  document.querySelector(".result-heading .section-kicker").dataset.i18n = modeTextKey("previewLabel");
  document.querySelector(".result-heading h2").dataset.i18n = modeTextKey("previewTitle");
  document.querySelector("#preview-empty-copy").dataset.i18n = emptyTextKey;
  document.querySelector(".preview-caption").dataset.i18n = emptyHintTextKey;
  document.querySelector("#loading-copy").dataset.i18n =
    currentJob?.kind === "music" || (isMusic && !currentJob) ? "musicLongRunning" :
      currentJob?.kind === "image" || (isImage && !currentJob) ? "imageLongRunning" : "longRunning";
  generateLabel.dataset.i18n = modeTextKey("generate");
  generateLabel.textContent = t(generateLabel.dataset.i18n);
  promptInput.placeholder = t(promptInput.dataset.i18nPlaceholder);
  document.querySelector("#intro-eyebrow").textContent = t(modeTextKey("eyebrow"));
  document.querySelector("h1").innerHTML = t(modeTextKey("headline"));
  document.querySelector(".intro-copy").textContent = t(modeTextKey("intro"));
  document.querySelector("#prompt-label").textContent = t(modeTextKey("promptLabel"));
  document.querySelector("#prompt-hint").textContent = t(modeTextKey("promptHint"));
  document.querySelector(".result-heading .section-kicker").textContent = t(modeTextKey("previewLabel"));
  document.querySelector(".result-heading h2").textContent = t(modeTextKey("previewTitle"));
  document.querySelector("#preview-empty-copy").innerHTML = t(emptyTextKey);
  document.querySelector(".preview-caption").textContent = t(emptyHintTextKey);
  document.querySelector("#loading-copy").textContent = t(document.querySelector("#loading-copy").dataset.i18n);
  updateMusicLyricsMode();
  updateGenerateAvailability();
}

function updateGenerateAvailability() {
  const busy = ["queued", "loading", "running", "cancelling"].includes(currentJob?.status);
  const ready = activeMode === "image"
    ? modelInfo?.hidream?.model_ready && modelInfo?.hidream?.runtime_ready
    : activeMode === "music"
      ? modelInfo?.music?.model_ready && modelInfo?.music?.runtime_ready
      : modelInfo?.model_loaded;
  generateButton.disabled = busy || promptEnhancementBusy || !ready;
  enhancePromptButton.disabled = busy || promptEnhancementBusy || !textModelsAvailable ||
    !promptEnhancerModel.value;
  const modeKey = activeMode === "music" ? "music" : activeMode === "image" ? "image" : "";
  generateLabel.textContent = t(busy ? (modeKey ? `${modeKey}Generating` : "generating") :
    (modeKey ? `${modeKey}Generate` : "generate"));
}

function updateMusicLyricsMode() {
  const showLyrics = musicLyricsMode.value === "lyrics";
  musicLyricsField.hidden = !showLyrics;
  musicLyricsInput.required = activeMode === "music" && showLyrics;
}

function updateTurboSteps() {
  const turboEnabled = turboToggle.checked;
  document.querySelectorAll("[data-turbo-step]").forEach((option) => {
    option.hidden = !turboEnabled;
  });
  document.querySelectorAll("[data-standard-step]").forEach((option) => {
    option.hidden = turboEnabled;
  });
  if (turboEnabled && Number(stepsSelect.value) > 8) stepsSelect.value = "4";
  if (!turboEnabled && Number(stepsSelect.value) < 16) stepsSelect.value = "16";
}

function addModelLink(label, url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  modelLinks.append(link);
}

function renderModelInfo(info) {
  modelInfo = info;
  if (modelPath) modelPath.textContent = `${t("modelPath")}${info.model_path}`;
  modelLinks.replaceChildren();
  loadModelButton.hidden = true;
  loadModelButton.disabled = false;
  if (!info.model_ready) {
    modelTitle.textContent = info.download_in_progress ? t("modelDownloading") : t("modelMissing");
    if (info.download_in_progress) {
      const percent = Math.min(99, Math.floor(info.downloaded_bytes / info.total_bytes * 100));
      const downloaded = (info.downloaded_bytes / 1_000_000_000).toFixed(1);
      const total = (info.total_bytes / 1_000_000_000).toFixed(1);
      modelDescription.textContent = `${percent}% · ${downloaded} / ${total} GB`;
    } else {
      modelDescription.textContent = info.model_path;
      addModelLink(t("modelDownload"), info.model_download_url);
    }
    modelNotice.classList.remove("ready");
  } else if (!info.runtime_ready) {
    modelTitle.textContent = t("runtimeMissing");
    modelDescription.textContent = info.model_path;
    addModelLink(t("runtimeDownload"), info.runtime_download_url);
    modelNotice.classList.remove("ready");
  } else if (!info.model_loaded) {
    modelTitle.textContent = t("modelNotLoaded");
    modelDescription.textContent = info.model_path;
    loadModelButton.hidden = false;
    loadModelButton.disabled = currentJob?.status === "loading" && !currentJob.prompt;
    modelNotice.classList.remove("ready");
  } else {
    modelTitle.textContent = t("modelReady");
    modelDescription.textContent = info.server_models?.[0]?.id || info.model_path;
    modelNotice.classList.add("ready");
  }
  renderImageModelInfo(info.hidream || {});
  renderMusicModelInfo(info.music || {});
  updateGenerateAvailability();
}

function renderImageModelInfo(info) {
  imageModelLinks.replaceChildren();
  imageModelPath.textContent = `${t("modelPath")}${info.model_path || ""}`;
  imageModelNotice.classList.remove("ready");
  if (!info.model_ready) {
    imageModelTitle.textContent = t("imageModelMissing");
    imageModelDescription.textContent = info.model_path || t("modelFoundNone");
    addImageModelLink(t("imageModelLink"), info.model_download_url);
  } else if (!info.runtime_ready) {
    imageModelTitle.textContent = t("imageRuntimeMissing");
    imageModelDescription.textContent = t("imageSetupHint");
    addImageModelLink(t("imageCodeLink"), info.code_download_url);
  } else {
    imageModelTitle.textContent = t("imageReady");
    imageModelDescription.textContent = info.model_path;
    imageModelNotice.classList.add("ready");
  }
}

function addImageModelLink(label, url) {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  imageModelLinks.append(link);
}

function renderMusicModelInfo(info) {
  musicModelLinks.replaceChildren();
  musicModelPath.textContent = `${t("modelPath")}${info.model_path || ""}`;
  musicModelNotice.classList.remove("ready");
  if (!info.model_ready) {
    musicModelTitle.textContent = t("musicModelMissing");
    musicModelDescription.textContent = info.model_path || t("modelFoundNone");
    addMusicModelLink(t("musicModelLink"), info.model_download_url);
  } else if (!info.runtime_ready) {
    musicModelTitle.textContent = t("musicRuntimeMissing");
    musicModelDescription.textContent = info.model_path;
  } else {
    musicModelTitle.textContent = t("musicReady");
    musicModelDescription.textContent = info.model_path;
    musicModelNotice.classList.add("ready");
  }
}

function addMusicModelLink(label, url) {
  if (!url) return;
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  musicModelLinks.append(link);
}

function renderJob(job) {
  currentJob = job;
  const states = {
    queued: ["queued", "active"], loading: ["preparing", "active"], running: ["running", "active"],
    cancelling: ["cancelling", "active"], cancelled: ["cancelled", ""],
    completed: ["completed", "success"], failed: ["failed", "error"]
  };
  const [label, tone] = states[job.status] || ["waiting", ""];
  statusChip.textContent = t(label);
  statusChip.className = `status-chip ${tone}`;
  const inProgress = ["queued", "loading", "running", "cancelling"].includes(job.status);
  const hasResult = !!(job.video_url || job.image_url || job.audio_url);
  emptyState.hidden = inProgress || (job.status === "completed" && hasResult);
  loadingState.hidden = !inProgress;
  video.hidden = job.status !== "completed" || !job.video_url;
  image.hidden = job.status !== "completed" || !job.image_url;
  audio.hidden = job.status !== "completed" || job.kind !== "music" || !job.audio_url;
  if (!video.hidden && video.dataset.url !== job.video_url) {
    video.src = job.video_url;
    video.dataset.url = job.video_url;
  }
  if (!image.hidden && image.dataset.url !== job.image_url) {
    image.src = job.image_url;
    image.dataset.url = job.image_url;
  }
  if (!audio.hidden && audio.dataset.url !== job.audio_url) {
    audio.src = job.audio_url;
    audio.dataset.url = job.audio_url;
  }
  resultFooter.hidden = job.status !== "completed" || !hasResult;
  logPanel.hidden = !job.logs?.length && !job.error;
  jobLogs.textContent = [...(job.logs || []), job.error].filter(Boolean).join("\n");
  jobLogs.scrollTop = jobLogs.scrollHeight;
  cancelButton.hidden = !["queued", "running"].includes(job.status) || !job.prompt;
  loadingTitle.textContent = t(job.status === "queued" ? "queued" : job.status === "cancelling" ? "cancelling" : job.status === "loading" ? "preparing" : job.kind === "music" ? "musicGenerating" : "generating");
  loadModelButton.disabled = inProgress && !job.prompt;
  updateModeUI();
  const jobModeKey = job.kind === "music" ? "music" : job.kind === "image" ? "image" : "";
  const buttonModeKey = inProgress
    ? jobModeKey
    : activeMode === "music" ? "music" : activeMode === "image" ? "image" : "";
  generateLabel.textContent = t(inProgress
    ? (buttonModeKey ? `${buttonModeKey}Generating` : "generating")
    : (buttonModeKey ? `${buttonModeKey}Generate` : "generate"));
  if (job.video_url) {
    const videoLink = document.querySelector("#download-video");
    videoLink.href = job.video_url;
    videoLink.download = "minimax-h3.mp4";
  }
  const audioLink = document.querySelector("#download-audio");
  if (job.audio_url) {
    audioLink.href = job.audio_url;
    audioLink.download = job.kind === "music" ? "minimax-music3.wav" : "minimax-h3.wav";
    audioLink.textContent = t(job.kind === "music" ? "musicDownload" : "downloadAudio");
  }
  audioLink.hidden = !job.audio_url;
  document.querySelector("#download-video").hidden = !job.video_url;
  imageDownloadLink.hidden = !job.image_url;
  if (job.image_url) {
    imageDownloadLink.href = job.image_url;
    imageDownloadLink.download = "hidream-o1.png";
  }
  if (!inProgress && !job.prompt) loadModels();
}

function renderHistory() {
  const items = historyItems.filter((item) => historyFilter === "all" || item.kind === historyFilter);
  historyCount.textContent = `${items.length} ${t("historyCount")}`;
  historyList.replaceChildren();
  historyStatus.hidden = items.length > 0;
  historyStatus.textContent = items.length ? "" : t("historyEmpty");
  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `history-item${currentJob?.id === item.id ? " selected" : ""}`;
    button.setAttribute("aria-pressed", String(currentJob?.id === item.id));

    const thumbnail = document.createElement("span");
    thumbnail.className = "history-thumb";
    if (item.image_url) {
      const imageThumb = document.createElement("img");
      imageThumb.src = item.image_url;
      imageThumb.alt = "";
      thumbnail.append(imageThumb);
    } else {
      thumbnail.textContent = item.kind === "video" ? "▶" : "♫";
      thumbnail.setAttribute("aria-hidden", "true");
    }

    const details = document.createElement("span");
    details.className = "history-details";
    const type = document.createElement("span");
    type.className = "history-type";
    const typeLabel = document.createElement("span");
    typeLabel.textContent = t(`history${item.kind[0].toUpperCase()}${item.kind.slice(1)}`);
    const date = document.createElement("time");
    date.className = "history-date";
    const timestamp = new Date(item.created_at * 1000);
    if (Number.isFinite(timestamp.getTime())) {
      date.dateTime = timestamp.toISOString();
      date.textContent = new Intl.DateTimeFormat(languageSelect.value, {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(timestamp);
    }
    type.append(typeLabel, date);
    const prompt = document.createElement("span");
    prompt.className = "history-prompt";
    prompt.textContent = item.prompt || t("historyNoPrompt");
    details.append(type, prompt);
    button.append(thumbnail, details);
    button.addEventListener("click", () => {
      renderJob({
        ...item,
        status: "completed",
        logs: [],
        error: ""
      });
      renderHistory();
    });
    historyList.append(button);
  }
}

async function loadHistory() {
  try {
    const response = await fetch("/api/history", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || "history_unavailable");
    historyItems = data.items;
    historyStatus.hidden = true;
    renderHistory();
  } catch {
    historyItems = [];
    historyList.replaceChildren();
    historyCount.textContent = "";
    historyStatus.textContent = t("historyLoadError");
    historyStatus.hidden = false;
  }
}

function errorMessage(code) {
  const keys = {
    invalid_prompt: "errInvalidPrompt", h3_model_missing: "modelMissing",
    hidream_model_missing: "imageModelMissing", hidream_runtime_missing: "imageRuntimeMissing",
    music_model_missing: "musicModelMissing", music_runtime_missing: "musicRuntimeMissing",
    invalid_lyrics: "musicLyricsRequired", invalid_music_mode: "errInvalid",
    mlx_serve_missing: "runtimeMissing",
    job_already_running: "errRunning",
    invalid_duration: "errInvalid", invalid_steps: "errInvalid",
    invalid_seed: "errInvalid", invalid_aspect: "errInvalid"
  };
  return t(keys[code] || "errGeneric");
}

function setPromptEnhancerStatus(key) {
  promptEnhancerStatusKey = key;
  promptEnhancerStatus.textContent = key ? t(key) : "";
  promptEnhancerStatus.hidden = !key;
}

async function loadTextModels() {
  try {
    const response = await fetch("/api/text-models", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "local_text_runtime_unavailable");
    const models = Array.isArray(data.models) ? data.models : [];
    promptEnhancerModel.replaceChildren();
    for (const model of models) {
      if (typeof model.id !== "string" || !model.id) continue;
      const option = document.createElement("option");
      option.value = model.id;
      option.textContent = model.name || model.id;
      promptEnhancerModel.append(option);
    }
    textModelsAvailable = promptEnhancerModel.options.length > 0;
    if (textModelsAvailable) {
      const preferred = ["glm-4.7-flash-4bit", "gemma-4-12b", "qwen3.8-27b-uncensored-optiq-4bit", "qwen3.8-27b"];
      const preferredModel = preferred.find((name) =>
        [...promptEnhancerModel.options].some((option) => option.value.toLowerCase().includes(name))
      );
      if (preferredModel) {
        promptEnhancerModel.value = [...promptEnhancerModel.options]
          .find((option) => option.value.toLowerCase().includes(preferredModel)).value;
      }
      promptEnhancerModel.disabled = false;
      setPromptEnhancerStatus("");
    } else {
      promptEnhancerModel.disabled = true;
      const option = document.createElement("option");
      option.textContent = t("enhancerNoModels");
      promptEnhancerModel.replaceChildren(option);
      setPromptEnhancerStatus("enhancerNoModels");
    }
    updateGenerateAvailability();
  } catch {
    textModelsAvailable = false;
    promptEnhancerModel.replaceChildren();
    const option = document.createElement("option");
    option.textContent = t("enhancerOffline");
    promptEnhancerModel.append(option);
    promptEnhancerModel.disabled = true;
    setPromptEnhancerStatus("enhancerOffline");
    updateGenerateAvailability();
    window.setTimeout(loadTextModels, 10000);
  }
}

async function enhancePrompt() {
  if (!textModelsAvailable || promptEnhancementBusy) return;
  if (!promptInput.value.trim()) {
    setPromptEnhancerStatus("errInvalidPrompt");
    return;
  }
  promptEnhancementBusy = true;
  promptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("enhancingPrompt");
  enhancePromptButton.textContent = t("enhancingPrompt");
  updateGenerateAvailability();
  try {
    const response = await fetch("/api/prompt-enhancements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: promptInput.value,
        mode: activeMode,
        model: promptEnhancerModel.value
      })
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.error || "local_text_generation_failed");
      error.code = data.error;
      throw error;
    }
    promptEnhancerKeywords.replaceChildren();
    for (const keyword of data.keywords) {
      const chip = document.createElement("span");
      chip.textContent = keyword;
      promptEnhancerKeywords.append(chip);
    }
    promptEnhancerOutput.value = data.optimized_prompt;
    promptEnhancerResult.hidden = false;
    setPromptEnhancerStatus("");
  } catch (error) {
    setPromptEnhancerStatus(error.code === "local_text_runtime_unavailable"
      ? "enhancerOffline"
      : error.code === "invalid_prompt" ? "errInvalidPrompt" : "enhanceFailed");
  } finally {
    promptEnhancementBusy = false;
    enhancePromptButton.textContent = t("enhancePrompt");
    updateGenerateAvailability();
  }
}

async function refreshCurrentJob() {
  try {
    const response = await fetch("/api/jobs/current", { cache: "no-store" });
    const data = await response.json();
    if (data.job) {
      renderJob(data.job);
      if (data.job.status === "completed" && data.job.prompt) loadHistory();
      if (["queued", "loading", "running", "cancelling"].includes(data.job.status)) {
        pollTimer = window.setTimeout(refreshCurrentJob, 2000);
      } else if (pollTimer) {
        window.clearTimeout(pollTimer);
      }
    }
  } catch {
    if (currentJob && ["queued", "running", "cancelling"].includes(currentJob.status)) {
      pollTimer = window.setTimeout(refreshCurrentJob, 5000);
    }
  }
}

async function loadModels() {
  try {
    const response = await fetch("/api/models", { cache: "no-store" });
    modelInfo = await response.json();
    renderModelInfo(modelInfo);
    if (modelPollTimer) window.clearTimeout(modelPollTimer);
    if (!modelInfo.model_loaded || !modelInfo.hidream?.runtime_ready ||
      !modelInfo.music?.model_ready || !modelInfo.music?.runtime_ready) {
      modelPollTimer = window.setTimeout(loadModels, 10000);
    }
  } catch {
    modelTitle.textContent = t("modelMissing");
    modelDescription.textContent = t("modelFoundNone");
    addModelLink(t("modelDownload"), "https://huggingface.co/ddalcu/MiniMax-H3-FL2VA-MLX-Serve-4bit");
  }
}

languageSelect.value = localStorage.getItem("h3-language") || "zh-CN";
videoModeButton.addEventListener("click", () => {
  activeMode = "video";
  localStorage.setItem("h3-mode", activeMode);
  updateModeUI();
  if (currentJob) renderJob(currentJob);
});
imageModeButton.addEventListener("click", () => {
  activeMode = "image";
  localStorage.setItem("h3-mode", activeMode);
  updateModeUI();
  if (currentJob) renderJob(currentJob);
});
musicModeButton.addEventListener("click", () => {
  activeMode = "music";
  localStorage.setItem("h3-mode", activeMode);
  updateModeUI();
  if (currentJob) renderJob(currentJob);
});
musicLyricsMode.addEventListener("change", updateMusicLyricsMode);
applyLanguage();
languageSelect.addEventListener("change", () => {
  localStorage.setItem("h3-language", languageSelect.value);
  applyLanguage();
});
document.querySelectorAll(".history-filter").forEach((button) => {
  button.addEventListener("click", () => {
    historyFilter = button.dataset.historyFilter;
    document.querySelectorAll(".history-filter").forEach((filterButton) => {
      const active = filterButton === button;
      filterButton.classList.toggle("active", active);
      filterButton.setAttribute("aria-pressed", String(active));
    });
    renderHistory();
  });
});
promptInput.addEventListener("input", () => {
  document.querySelector("#prompt-count").textContent = `${promptInput.value.length} / 4000`;
  if (!promptEnhancementBusy) promptEnhancerResult.hidden = true;
});
enhancePromptButton.addEventListener("click", enhancePrompt);
applyEnhancedPromptButton.addEventListener("click", () => {
  promptInput.value = promptEnhancerOutput.value;
  promptInput.dispatchEvent(new Event("input", { bubbles: true }));
  promptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("");
  promptInput.focus();
});
dismissEnhancedPromptButton.addEventListener("click", () => {
  promptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("");
});
loadModelButton.addEventListener("click", async () => {
  loadModelButton.disabled = true;
  try {
    const response = await fetch("/api/models/load", { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "unknown");
    renderJob(data.job);
    if (pollTimer) window.clearTimeout(pollTimer);
    pollTimer = window.setTimeout(refreshCurrentJob, 1000);
  } catch (error) {
    window.alert(errorMessage(error.message));
    loadModelButton.disabled = false;
  }
});
turboToggle.addEventListener("change", updateTurboSteps);
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (promptEnhancementBusy) return;
  const isImage = activeMode === "image";
  const isMusic = activeMode === "music";
  const payload = isImage
    ? { prompt: promptInput.value, seed: Number(document.querySelector("#image-seed").value) }
    : isMusic
      ? {
        prompt: promptInput.value,
        lyrics_mode: musicLyricsMode.value,
        lyrics: musicLyricsInput.value,
        duration: Number(document.querySelector("#music-duration").value),
        steps: Number(document.querySelector("#music-steps").value),
        seed: Number(document.querySelector("#music-seed").value)
      }
      : {
      prompt: promptInput.value,
      duration: Number(document.querySelector("#duration").value),
      aspect: document.querySelector("#aspect").value,
      steps: Number(document.querySelector("#steps").value),
      seed: Number(document.querySelector("#seed").value),
      turbo: document.querySelector("#turbo").checked
    };
  generateButton.disabled = true;
  try {
    const endpoint = isMusic ? "/api/music-jobs" : isImage ? "/api/image-jobs" : "/api/jobs";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "unknown");
    renderJob(data.job);
    if (pollTimer) window.clearTimeout(pollTimer);
    pollTimer = window.setTimeout(refreshCurrentJob, 1500);
  } catch (error) {
    window.alert(errorMessage(error.message));
    updateGenerateAvailability();
  }
});
cancelButton.addEventListener("click", async () => {
  if (!currentJob) return;
  cancelButton.disabled = true;
  try {
    const response = await fetch(`/api/jobs/${currentJob.id}/cancel`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "unknown");
    renderJob(data.job);
  } catch (error) {
    window.alert(errorMessage(error.message));
  } finally {
    cancelButton.disabled = false;
  }
});
loadModels();
loadTextModels();
loadHistory();
refreshCurrentJob();
