const translations = {
  "zh-CN": {
    localOnly: "本地运行 · 私密创作", language: "语言", eyebrow: "本地视频与音频生成",
    headline: "把想象，<span>变成视听。</span>", introCopy: "在你的 Mac 上，使用多种本地模型创作视频、图像与音乐。",
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
    downloadAudio: "下载音频", generationLog: "生成日志", metricElapsed: "耗时", metricTokens: "Token", footerLocal: "模型推理完全在本机运行",
    queued: "排队中", running: "生成中", cancelling: "正在取消", cancelled: "已取消", completed: "已完成", failed: "生成失败",
    errInvalidPrompt: "请输入提示词（最多 4000 个字符）。", errCheckpoint: "请提供包含 H3 基础组件的有效 checkpoint 文件夹。请查看下方模型下载地址。",
    errTransformer: "Transformer 文件夹无效；请选择含 quant_config.json 和权重文件的 H3 transformer。",
    errRunning: "已有任务正在运行。请等待完成或取消后再试。", errInvalid: "请求参数无效，请检查时长、步数、比例和随机种子。",
    errGeneric: "无法启动生成，请查看日志。", restored: "已恢复本机生成任务状态。"
  },
  en: {
    localOnly: "LOCAL · PRIVATE", language: "Language", eyebrow: "LOCAL VIDEO + AUDIO GENERATION",
    headline: "Turn imagination <span>into motion.</span>", introCopy: "Create videos, images, and music with multiple local models on your Mac.",
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
    downloadAudio: "Download audio", generationLog: "Generation log", metricElapsed: "Elapsed", metricTokens: "Tokens", footerLocal: "Inference runs entirely on your device",
    queued: "Queued", running: "Generating", cancelling: "Cancelling", cancelled: "Cancelled", completed: "Complete", failed: "Generation failed",
    errInvalidPrompt: "Enter a prompt (up to 4,000 characters).", errCheckpoint: "Provide a valid H3 base checkpoint folder. See the model links below.",
    errTransformer: "Invalid transformer folder; choose an H3 transformer with quant_config.json and weights.",
    errRunning: "A job is already running. Wait for it to finish or cancel it first.", errInvalid: "Invalid request. Check duration, steps, aspect ratio, and seed.",
    errGeneric: "Could not start generation. Check the log.", restored: "Restored the local generation status."
  },
  "zh-TW": {
    localOnly: "本機執行 · 私密創作", language: "語言", eyebrow: "本機影片與音訊生成",
    headline: "把想像，<span>變成視聽。</span>", introCopy: "在你的 Mac 上，使用多種本機模型創作影片、圖像與音樂。",
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
    downloadAudio: "下載音訊", generationLog: "生成日誌", metricElapsed: "耗時", metricTokens: "Token", footerLocal: "模型推理完全在本機執行",
    queued: "排隊中", running: "生成中", cancelling: "正在取消", cancelled: "已取消", completed: "已完成", failed: "生成失敗",
    errInvalidPrompt: "請輸入提示詞（最多 4000 個字元）。", errCheckpoint: "請提供有效的 H3 基礎 checkpoint 資料夾，請參考下方下載連結。",
    errTransformer: "Transformer 資料夾無效；請選擇包含 quant_config.json 和權重的 H3 transformer。",
    errRunning: "已有任務正在執行，請等待完成或先取消。", errInvalid: "請求參數無效，請檢查時長、步數、比例和隨機種子。",
    errGeneric: "無法啟動生成，請查看日誌。", restored: "已還原本機生成任務狀態。"
  },
  fr: {
    localOnly: "LOCAL · PRIVÉ", language: "Langue", eyebrow: "GÉNÉRATION VIDÉO + AUDIO LOCALE",
    headline: "L’imagination <span>prend vie.</span>", introCopy: "Créez des vidéos, des images et de la musique avec plusieurs modèles locaux sur votre Mac.",
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
    downloadAudio: "Télécharger l’audio", generationLog: "Journal", metricElapsed: "Durée", metricTokens: "Jetons", footerLocal: "L’inférence s’exécute sur votre appareil",
    queued: "En attente", running: "Génération", cancelling: "Annulation", cancelled: "Annulé", completed: "Terminé", failed: "Échec",
    errInvalidPrompt: "Saisissez un prompt (4 000 caractères maximum).", errCheckpoint: "Indiquez un checkpoint H3 valide. Consultez les liens de téléchargement.",
    errTransformer: "Dossier transformer invalide : sélectionnez un transformer H3 avec config et poids.",
    errRunning: "Une tâche est déjà en cours. Attendez ou annulez-la.", errInvalid: "Paramètres invalides : vérifiez durée, étapes, format et graine.",
    errGeneric: "Impossible de lancer la génération. Consultez le journal.", restored: "État de la tâche locale restauré."
  },
  de: {
    localOnly: "LOKAL · PRIVAT", language: "Sprache", eyebrow: "LOKALE VIDEO- UND AUDIOGENERIERUNG",
    headline: "Vorstellungen <span>werden lebendig.</span>", introCopy: "Erstelle Videos, Bilder und Musik mit verschiedenen lokalen Modellen auf deinem Mac.",
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
    downloadAudio: "Audio herunterladen", generationLog: "Generierungsprotokoll", metricElapsed: "Dauer", metricTokens: "Tokens", footerLocal: "Inferenz läuft vollständig lokal",
    queued: "Warteschlange", running: "Generierung", cancelling: "Abbruch läuft", cancelled: "Abgebrochen", completed: "Abgeschlossen", failed: "Fehlgeschlagen",
    errInvalidPrompt: "Prompt eingeben (maximal 4.000 Zeichen).", errCheckpoint: "Gültigen H3-Basis-Checkpoint angeben. Downloadlinks siehe unten.",
    errTransformer: "Ungültiger Transformer-Ordner; H3-Transformer mit Konfiguration und Gewichten wählen.",
    errRunning: "Ein Auftrag läuft bereits. Bitte warten oder abbrechen.", errInvalid: "Ungültige Angaben: Dauer, Schritte, Format und Seed prüfen.",
    errGeneric: "Generierung konnte nicht gestartet werden. Protokoll prüfen.", restored: "Lokaler Generierungsstatus wiederhergestellt."
  },
  ja: {
    localOnly: "ローカル実行 · プライベート", language: "言語", eyebrow: "ローカル動画・音声生成",
    headline: "想像を、<span>映像に。</span>", introCopy: "Mac 上のさまざまなローカルモデルで、動画・画像・音楽を制作します。",
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
    downloadAudio: "音声をダウンロード", generationLog: "生成ログ", metricElapsed: "所要時間", metricTokens: "トークン", footerLocal: "推論はすべてローカルで実行",
    queued: "待機中", running: "生成中", cancelling: "キャンセル中", cancelled: "キャンセル済み", completed: "完了", failed: "失敗",
    errInvalidPrompt: "プロンプトを入力してください（最大 4000 文字）。", errCheckpoint: "有効な H3 基本 checkpoint フォルダーを指定してください。下のリンクを参照。",
    errTransformer: "Transformer フォルダーが無効です。設定ファイルと重みを含む H3 transformer を選択してください。",
    errRunning: "別の処理が実行中です。完了またはキャンセル後に再試行してください。", errInvalid: "設定を確認してください（長さ、ステップ、比率、シード）。",
    errGeneric: "生成を開始できません。ログを確認してください。", restored: "ローカル生成の状態を復元しました。"
  },
  ko: {
    localOnly: "로컬 실행 · 비공개", language: "언어", eyebrow: "로컬 비디오 및 오디오 생성",
    headline: "상상을 <span>영상으로.</span>", introCopy: "Mac에서 다양한 로컬 모델로 동영상, 이미지, 음악을 만드세요.",
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
    downloadAudio: "오디오 다운로드", generationLog: "생성 로그", metricElapsed: "소요 시간", metricTokens: "토큰", footerLocal: "추론은 전적으로 로컬에서 실행됩니다",
    queued: "대기열", running: "생성 중", cancelling: "취소 중", cancelled: "취소됨", completed: "완료", failed: "생성 실패",
    errInvalidPrompt: "프롬프트를 입력하세요 (최대 4,000자).", errCheckpoint: "유효한 H3 기본 checkpoint 폴더를 입력하세요. 아래 다운로드 링크를 확인하세요.",
    errTransformer: "Transformer 폴더가 올바르지 않습니다. 설정과 가중치가 있는 H3 transformer를 선택하세요.",
    errRunning: "이미 작업이 실행 중입니다. 완료 또는 취소 후 다시 시도하세요.", errInvalid: "요청 값이 올바르지 않습니다. 길이, 단계, 비율, 시드를 확인하세요.",
    errGeneric: "생성을 시작할 수 없습니다. 로그를 확인하세요.", restored: "로컬 생성 상태를 복원했습니다."
  },
  es: {
    localOnly: "LOCAL · PRIVADO", language: "Idioma", eyebrow: "GENERACIÓN LOCAL DE VÍDEO Y AUDIO",
    headline: "La imaginación <span>cobra vida.</span>", introCopy: "Crea vídeos, imágenes y música con varios modelos locales en tu Mac.",
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
    downloadAudio: "Descargar audio", generationLog: "Registro de generación", metricElapsed: "Tiempo", metricTokens: "Tokens", footerLocal: "La inferencia se ejecuta íntegramente aquí",
    queued: "En cola", running: "Generando", cancelling: "Cancelando", cancelled: "Cancelado", completed: "Completado", failed: "Error",
    errInvalidPrompt: "Escribe un prompt (máximo 4.000 caracteres).", errCheckpoint: "Indica una carpeta de checkpoint H3 válida. Consulta los enlaces de descarga.",
    errTransformer: "Carpeta de transformer no válida; elige un transformer H3 con configuración y pesos.",
    errRunning: "Ya hay una tarea en curso. Espera o cancélala.", errInvalid: "Solicitud no válida: revisa duración, pasos, proporción y semilla.",
    errGeneric: "No se pudo iniciar la generación. Revisa el registro.", restored: "Estado de generación local restaurado."
  },
  pt: {
    localOnly: "LOCAL · PRIVADO", language: "Idioma", eyebrow: "GERAÇÃO LOCAL DE VÍDEO E ÁUDIO",
    headline: "A imaginação <span>ganha vida.</span>", introCopy: "Crie vídeos, imagens e música com vários modelos locais no seu Mac.",
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
    downloadAudio: "Baixar áudio", generationLog: "Registro de geração", metricElapsed: "Tempo", metricTokens: "Tokens", footerLocal: "A inferência é executada localmente",
    queued: "Na fila", running: "Gerando", cancelling: "Cancelando", cancelled: "Cancelado", completed: "Concluído", failed: "Falha",
    errInvalidPrompt: "Digite um prompt (até 4.000 caracteres).", errCheckpoint: "Informe uma pasta de checkpoint H3 válida. Veja os links de download.",
    errTransformer: "Pasta de transformer inválida; selecione um transformer H3 com configuração e pesos.",
    errRunning: "Já existe uma tarefa em execução. Aguarde ou cancele-a.", errInvalid: "Parâmetros inválidos: confira duração, etapas, proporção e semente.",
    errGeneric: "Não foi possível iniciar a geração. Confira o registro.", restored: "Status da geração local restaurado."
  },
  tr: {
    localOnly: "YEREL · GİZLİ", language: "Dil", eyebrow: "YEREL VİDEO VE SES ÜRETİMİ",
    headline: "Hayal gücünü <span>canlandır.</span>", introCopy: "Mac'inizde çeşitli yerel modellerle video, görsel ve müzik oluşturun.",
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
    downloadAudio: "Sesi indir", generationLog: "Üretim günlüğü", metricElapsed: "Süre", metricTokens: "Token", footerLocal: "Çıkarım tamamen bu cihazda çalışır",
    queued: "Kuyrukta", running: "Üretiliyor", cancelling: "İptal ediliyor", cancelled: "İptal edildi", completed: "Tamamlandı", failed: "Başarısız",
    errInvalidPrompt: "Bir istem girin (en fazla 4.000 karakter).", errCheckpoint: "Geçerli bir H3 temel checkpoint klasörü belirtin. İndirme bağlantılarına bakın.",
    errTransformer: "Transformer klasörü geçersiz; yapılandırma ve ağırlıkları olan bir H3 transformer seçin.",
    errRunning: "Zaten çalışan bir görev var. Bitmesini bekleyin veya iptal edin.", errInvalid: "İstek geçersiz; süreyi, adımları, oranı ve tohumu denetleyin.",
    errGeneric: "Üretim başlatılamadı. Günlüğü inceleyin.", restored: "Yerel üretim durumu geri yüklendi."
  },
  ar: {
    localOnly: "محلي · خاص", language: "اللغة", eyebrow: "إنشاء الفيديو والصوت محليًا",
    headline: "حوّل الخيال <span>إلى مشهد.</span>", introCopy: "أنشئ فيديو وصورًا وموسيقى باستخدام نماذج محلية متعددة على جهاز Mac.",
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
    downloadAudio: "تنزيل الصوت", generationLog: "سجل الإنشاء", metricElapsed: "المدة", metricTokens: "الرموز", footerLocal: "يعمل الاستدلال بالكامل على جهازك",
    queued: "في قائمة الانتظار", running: "جارٍ الإنشاء", cancelling: "جارٍ الإلغاء", cancelled: "أُلغي", completed: "اكتمل", failed: "فشل الإنشاء",
    errInvalidPrompt: "أدخل وصفًا (حتى 4000 حرف).", errCheckpoint: "يرجى تحديد مجلد checkpoint صالحًا لـ H3. راجع روابط التنزيل أدناه.",
    errTransformer: "مجلد transformer غير صالح؛ اختر H3 transformer يحتوي على الإعدادات والأوزان.",
    errRunning: "هناك مهمة قيد التشغيل. انتظر اكتمالها أو ألغها أولًا.", errInvalid: "الطلب غير صالح؛ تحقق من المدة والخطوات والنسبة والبذرة.",
    errGeneric: "تعذر بدء الإنشاء. تحقق من السجل.", restored: "تمت استعادة حالة الإنشاء المحلي."
  },
  vi: {
    localOnly: "CHẠY CỤC BỘ · RIÊNG TƯ", language: "Ngôn ngữ", eyebrow: "TẠO VIDEO VÀ ÂM THANH CỤC BỘ",
    headline: "Biến trí tưởng tượng <span>thành hình ảnh.</span>", introCopy: "Sáng tạo video, hình ảnh và âm nhạc bằng nhiều mô hình cục bộ trên máy Mac.",
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
    downloadAudio: "Tải âm thanh", generationLog: "Nhật ký tạo", metricElapsed: "Thời gian", metricTokens: "Token", footerLocal: "Suy luận hoàn toàn chạy trên thiết bị của bạn",
    queued: "Đang chờ", running: "Đang tạo", cancelling: "Đang hủy", cancelled: "Đã hủy", completed: "Hoàn tất", failed: "Tạo thất bại",
    errInvalidPrompt: "Nhập prompt (tối đa 4.000 ký tự).", errCheckpoint: "Hãy cung cấp thư mục checkpoint H3 hợp lệ. Xem liên kết tải bên dưới.",
    errTransformer: "Thư mục transformer không hợp lệ; hãy chọn transformer H3 có cấu hình và trọng số.",
    errRunning: "Đã có tác vụ đang chạy. Hãy đợi hoặc hủy tác vụ đó.", errInvalid: "Yêu cầu không hợp lệ; kiểm tra thời lượng, bước, tỷ lệ và seed.",
    errGeneric: "Không thể bắt đầu tạo. Hãy xem nhật ký.", restored: "Đã khôi phục trạng thái tạo cục bộ."
  },
  id: {
    localOnly: "LOKAL · PRIVAT", language: "Bahasa", eyebrow: "PEMBUATAN VIDEO + AUDIO LOKAL",
    headline: "Ubah imajinasi <span>menjadi nyata.</span>", introCopy: "Buat video, gambar, dan musik dengan berbagai model lokal di Mac Anda.",
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
    downloadAudio: "Unduh audio", generationLog: "Log generasi", metricElapsed: "Durasi", metricTokens: "Token", footerLocal: "Inferensi sepenuhnya berjalan di perangkat",
    queued: "Dalam antrean", running: "Membuat", cancelling: "Membatalkan", cancelled: "Dibatalkan", completed: "Selesai", failed: "Gagal",
    errInvalidPrompt: "Masukkan prompt (maksimal 4.000 karakter).", errCheckpoint: "Masukkan folder checkpoint dasar H3 yang valid. Lihat tautan unduhan.",
    errTransformer: "Folder transformer tidak valid; pilih transformer H3 dengan konfigurasi dan bobot.",
    errRunning: "Tugas sedang berjalan. Tunggu atau batalkan terlebih dahulu.", errInvalid: "Permintaan tidak valid; periksa durasi, langkah, rasio, dan seed.",
    errGeneric: "Generasi tidak dapat dimulai. Periksa log.", restored: "Status generasi lokal dipulihkan."
  },
  ru: {
    localOnly: "ЛОКАЛЬНО · ПРИВАТНО", language: "Язык", eyebrow: "ЛОКАЛЬНАЯ ГЕНЕРАЦИЯ ВИДЕО И АУДИО",
    headline: "Превратите фантазию <span>в кадр.</span>", introCopy: "Создавайте видео, изображения и музыку с разными локальными моделями на Mac.",
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
    downloadAudio: "Скачать аудио", generationLog: "Журнал генерации", metricElapsed: "Время", metricTokens: "Токены", footerLocal: "Вычисления выполняются локально",
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
    settingsTextModels: "模型 ID 列表（每行一个或分号分隔；留空自动发现）",
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
    settingsTextModels: "Model IDs (newline or semicolon separated; leave blank to discover)",
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
    settingsTextModels: "模型 ID 清單（每行一個或分號分隔；留空自動探索）",
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
    settingsTextModels: "ID des modèles (ligne ou point-virgule ; vide pour détection automatique)",
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
    settingsTextModels: "Modell-IDs (Zeile oder Semikolon; leer für automatische Erkennung)",
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
    settingsTextModels: "モデル ID（改行またはセミコロン区切り。空欄で自動検出）",
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
    settingsTextModels: "모델 ID (줄바꿈 또는 세미콜론 구분; 비우면 자동 검색)",
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
    settingsTextModels: "ID de modelos (línea o punto y coma; vacío para detección automática)",
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
    settingsTextModels: "IDs dos modelos (linha ou ponto e vírgula; vazio para descoberta automática)",
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
    settingsTextModels: "Model kimlikleri (satır veya noktalı virgül; otomatik keşif için boş bırakın)",
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
    settingsTextModels: "معرّفات النماذج (سطر أو فاصلة منقوطة؛ اتركها فارغة للاكتشاف التلقائي)",
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
    settingsTextModels: "ID mô hình (dòng hoặc dấu chấm phẩy; để trống để tự phát hiện)",
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
    settingsTextModels: "ID model (baris atau titik koma; kosongkan untuk deteksi otomatis)",
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
    settingsTextModels: "ID моделей (строка или точка с запятой; пусто для автообнаружения)",
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
    modelPath: "模型目录：", turboLabel: "使用 4-step Turbo LoRA（推荐预览）",
    computeNote: "视频生成需要较多计算资源，实际耗时取决于所选模型、画质、时长与系统负载。",
    quality: "生成步数", stepsFast: "4 · Turbo 预览", stepsBalanced: "6 · Turbo 均衡", stepsDetailed: "8 · Turbo 细节", stepsStandard: "16 · 标准"
  },
  en: {
    modelReady: "Local MiniMax H3 is ready", modelMissing: "Complete 4-bit H3 model pack not found",
    modelDownloading: "Downloading the 4-bit H3 model", modelNotLoaded: "4-bit model pack found, but it is not loaded", runtimeMissing: "MLX-Serve must be installed",
    loadModel: "Start MLX-Serve and load model", runtimeDownload: "Download MLX-Serve ↗",
    modelDownload: "Download complete 4-bit model ↗", modelSettings: "Local model",
    modelPath: "Model directory: ", turboLabel: "Use 4-step Turbo LoRA (recommended for previews)",
    computeNote: "Video generation is compute-intensive. Time depends on the selected model, quality, duration, and system load.",
    quality: "Generation steps", stepsFast: "4 · Turbo preview", stepsBalanced: "6 · Turbo balanced", stepsDetailed: "8 · Turbo detail", stepsStandard: "16 · Standard"
  },
  "zh-TW": {
    modelReady: "本機 MiniMax H3 已就緒", modelMissing: "找不到完整 4-bit H3 模型套件",
    modelDownloading: "正在下載 4-bit H3 模型", modelNotLoaded: "已找到 4-bit 模型套件，但尚未載入", runtimeMissing: "需要安裝 MLX-Serve",
    loadModel: "啟動 MLX-Serve 並載入模型", runtimeDownload: "下載 MLX-Serve ↗",
    modelDownload: "下載完整 4-bit 模型 ↗", modelSettings: "本機模型",
    modelPath: "模型目錄：", turboLabel: "使用 4-step Turbo LoRA（推薦預覽）",
    computeNote: "影片生成需要較多運算資源，實際耗時取決於所選模型、畫質、時長與系統負載。",
    quality: "生成步數", stepsFast: "4 · Turbo 預覽", stepsBalanced: "6 · Turbo 均衡", stepsDetailed: "8 · Turbo 細節", stepsStandard: "16 · 標準"
  },
  fr: {
    modelReady: "MiniMax H3 local est prêt", modelMissing: "Pack H3 4 bits complet introuvable",
    modelDownloading: "Téléchargement du modèle H3 4 bits", modelNotLoaded: "Pack 4 bits trouvé, mais pas encore chargé", runtimeMissing: "MLX-Serve doit être installé",
    loadModel: "Démarrer MLX-Serve et charger le modèle", runtimeDownload: "Télécharger MLX-Serve ↗",
    modelDownload: "Télécharger le modèle complet 4 bits ↗", modelSettings: "Modèle local",
    modelPath: "Dossier du modèle : ", turboLabel: "Utiliser Turbo LoRA 4 étapes (aperçu recommandé)",
    computeNote: "La génération vidéo demande beaucoup de calcul. La durée dépend du modèle, de la qualité, de la longueur et de la charge du système.",
    quality: "Étapes de génération", stepsFast: "4 · Aperçu Turbo", stepsBalanced: "6 · Turbo équilibré", stepsDetailed: "8 · Détails Turbo", stepsStandard: "16 · Standard"
  },
  de: {
    modelReady: "Lokales MiniMax H3 ist bereit", modelMissing: "Vollständiges 4-Bit-H3-Modellpaket nicht gefunden",
    modelDownloading: "4-Bit-H3-Modell wird heruntergeladen", modelNotLoaded: "4-Bit-Modellpaket gefunden, aber noch nicht geladen", runtimeMissing: "MLX-Serve muss installiert werden",
    loadModel: "MLX-Serve starten und Modell laden", runtimeDownload: "MLX-Serve herunterladen ↗",
    modelDownload: "Vollständiges 4-Bit-Modell herunterladen ↗", modelSettings: "Lokales Modell",
    modelPath: "Modellordner: ", turboLabel: "4-Step-Turbo-LoRA verwenden (Vorschau empfohlen)",
    computeNote: "Videogenerierung ist rechenintensiv. Die Zeit hängt von Modell, Qualität, Videolänge und Systemlast ab.",
    quality: "Generierungsschritte", stepsFast: "4 · Turbo-Vorschau", stepsBalanced: "6 · Turbo ausgewogen", stepsDetailed: "8 · Turbo-Details", stepsStandard: "16 · Standard"
  },
  ja: {
    modelReady: "ローカル MiniMax H3 の準備完了", modelMissing: "完全な 4-bit H3 モデルパックが見つかりません",
    modelDownloading: "4-bit H3 モデルをダウンロード中", modelNotLoaded: "4-bit モデルパックを検出しましたが、未ロードです", runtimeMissing: "MLX-Serve のインストールが必要です",
    loadModel: "MLX-Serve を起動してモデルをロード", runtimeDownload: "MLX-Serve をダウンロード ↗",
    modelDownload: "完全な 4-bit モデルをダウンロード ↗", modelSettings: "ローカルモデル",
    modelPath: "モデルフォルダー：", turboLabel: "4-step Turbo LoRA を使用（プレビュー推奨）",
    computeNote: "動画生成には多くの計算資源が必要です。所要時間はモデル、画質、動画の長さ、システム負荷によって変わります。",
    quality: "生成ステップ", stepsFast: "4 · Turbo プレビュー", stepsBalanced: "6 · Turbo バランス", stepsDetailed: "8 · Turbo 詳細", stepsStandard: "16 · 標準"
  },
  ko: {
    modelReady: "로컬 MiniMax H3 준비 완료", modelMissing: "완전한 4-bit H3 모델 팩을 찾을 수 없습니다",
    modelDownloading: "4-bit H3 모델 다운로드 중", modelNotLoaded: "4-bit 모델 팩을 찾았지만 아직 로드되지 않았습니다", runtimeMissing: "MLX-Serve 설치가 필요합니다",
    loadModel: "MLX-Serve 시작 및 모델 로드", runtimeDownload: "MLX-Serve 다운로드 ↗",
    modelDownload: "완전한 4-bit 모델 다운로드 ↗", modelSettings: "로컬 모델",
    modelPath: "모델 폴더: ", turboLabel: "4-step Turbo LoRA 사용 (미리보기 권장)",
    computeNote: "동영상 생성에는 많은 연산이 필요합니다. 시간은 모델, 화질, 영상 길이 및 시스템 부하에 따라 달라집니다.",
    quality: "생성 단계", stepsFast: "4 · Turbo 미리보기", stepsBalanced: "6 · Turbo 균형", stepsDetailed: "8 · Turbo 디테일", stepsStandard: "16 · 표준"
  },
  es: {
    modelReady: "MiniMax H3 local está listo", modelMissing: "No se encontró el paquete H3 completo de 4 bits",
    modelDownloading: "Descargando el modelo H3 de 4 bits", modelNotLoaded: "Paquete de 4 bits encontrado, pero aún no está cargado", runtimeMissing: "Se debe instalar MLX-Serve",
    loadModel: "Iniciar MLX-Serve y cargar el modelo", runtimeDownload: "Descargar MLX-Serve ↗",
    modelDownload: "Descargar el modelo completo de 4 bits ↗", modelSettings: "Modelo local",
    modelPath: "Carpeta del modelo: ", turboLabel: "Usar Turbo LoRA de 4 pasos (recomendado para vistas previas)",
    computeNote: "Generar vídeo requiere mucho cálculo. El tiempo depende del modelo, la calidad, la duración y la carga del sistema.",
    quality: "Pasos de generación", stepsFast: "4 · Vista previa Turbo", stepsBalanced: "6 · Turbo equilibrado", stepsDetailed: "8 · Detalle Turbo", stepsStandard: "16 · Estándar"
  },
  pt: {
    modelReady: "MiniMax H3 local está pronto", modelMissing: "Pacote H3 completo de 4 bits não encontrado",
    modelDownloading: "Baixando o modelo H3 de 4 bits", modelNotLoaded: "Pacote de 4 bits encontrado, mas ainda não carregado", runtimeMissing: "É necessário instalar o MLX-Serve",
    loadModel: "Iniciar MLX-Serve e carregar o modelo", runtimeDownload: "Baixar MLX-Serve ↗",
    modelDownload: "Baixar o modelo completo de 4 bits ↗", modelSettings: "Modelo local",
    modelPath: "Pasta do modelo: ", turboLabel: "Usar Turbo LoRA de 4 etapas (recomendado para prévias)",
    computeNote: "A geração de vídeo exige muito processamento. O tempo depende do modelo, da qualidade, da duração e da carga do sistema.",
    quality: "Etapas de geração", stepsFast: "4 · Prévia Turbo", stepsBalanced: "6 · Turbo equilibrado", stepsDetailed: "8 · Detalhe Turbo", stepsStandard: "16 · Padrão"
  },
  tr: {
    modelReady: "Yerel MiniMax H3 hazır", modelMissing: "Tam 4 bit H3 model paketi bulunamadı",
    modelDownloading: "4 bit H3 modeli indiriliyor", modelNotLoaded: "4 bit model paketi bulundu ancak yüklenmedi", runtimeMissing: "MLX-Serve kurulmalı",
    loadModel: "MLX-Serve'i başlat ve modeli yükle", runtimeDownload: "MLX-Serve'i indir ↗",
    modelDownload: "Tam 4 bit modeli indir ↗", modelSettings: "Yerel model",
    modelPath: "Model dizini: ", turboLabel: "4 adımlı Turbo LoRA kullan (önizleme önerilir)",
    computeNote: "Video üretimi yoğun hesaplama gerektirir. Süre modele, kaliteye, video uzunluğuna ve sistem yüküne bağlıdır.",
    quality: "Üretim adımları", stepsFast: "4 · Turbo önizleme", stepsBalanced: "6 · Dengeli Turbo", stepsDetailed: "8 · Turbo ayrıntı", stepsStandard: "16 · Standart"
  },
  ar: {
    modelReady: "MiniMax H3 المحلي جاهز", modelMissing: "لم يتم العثور على حزمة H3 كاملة بدقة 4 بت",
    modelDownloading: "جارٍ تنزيل نموذج H3 بدقة 4 بت", modelNotLoaded: "عُثر على حزمة 4 بت لكنها لم تُحمّل بعد", runtimeMissing: "يلزم تثبيت MLX-Serve",
    loadModel: "بدء MLX-Serve وتحميل النموذج", runtimeDownload: "تنزيل MLX-Serve ↗",
    modelDownload: "تنزيل نموذج 4 بت الكامل ↗", modelSettings: "النموذج المحلي",
    modelPath: "مجلد النموذج: ", turboLabel: "استخدام Turbo LoRA بأربع خطوات (موصى به للمعاينة)",
    computeNote: "يتطلب توليد الفيديو موارد حسابية كبيرة. يعتمد الوقت على النموذج والجودة ومدة الفيديو وحمل النظام.",
    quality: "خطوات التوليد", stepsFast: "4 · معاينة Turbo", stepsBalanced: "6 · Turbo متوازن", stepsDetailed: "8 · تفاصيل Turbo", stepsStandard: "16 · قياسي"
  },
  vi: {
    modelReady: "MiniMax H3 cục bộ đã sẵn sàng", modelMissing: "Không tìm thấy gói H3 4-bit đầy đủ",
    modelDownloading: "Đang tải mô hình H3 4-bit", modelNotLoaded: "Đã tìm thấy gói 4-bit nhưng chưa tải vào bộ nhớ", runtimeMissing: "Cần cài đặt MLX-Serve",
    loadModel: "Khởi động MLX-Serve và tải mô hình", runtimeDownload: "Tải MLX-Serve ↗",
    modelDownload: "Tải mô hình 4-bit đầy đủ ↗", modelSettings: "Mô hình cục bộ",
    modelPath: "Thư mục mô hình: ", turboLabel: "Dùng Turbo LoRA 4 bước (khuyên dùng để xem trước)",
    computeNote: "Tạo video cần nhiều tài nguyên tính toán. Thời gian phụ thuộc vào mô hình, chất lượng, độ dài video và tải hệ thống.",
    quality: "Số bước tạo", stepsFast: "4 · Xem trước Turbo", stepsBalanced: "6 · Turbo cân bằng", stepsDetailed: "8 · Turbo chi tiết", stepsStandard: "16 · Tiêu chuẩn"
  },
  id: {
    modelReady: "MiniMax H3 lokal siap", modelMissing: "Paket model H3 4-bit lengkap tidak ditemukan",
    modelDownloading: "Mengunduh model H3 4-bit", modelNotLoaded: "Paket 4-bit ditemukan, tetapi belum dimuat", runtimeMissing: "MLX-Serve perlu dipasang",
    loadModel: "Jalankan MLX-Serve dan muat model", runtimeDownload: "Unduh MLX-Serve ↗",
    modelDownload: "Unduh model 4-bit lengkap ↗", modelSettings: "Model lokal",
    modelPath: "Direktori model: ", turboLabel: "Gunakan Turbo LoRA 4 langkah (disarankan untuk pratinjau)",
    computeNote: "Pembuatan video membutuhkan banyak komputasi. Waktu bergantung pada model, kualitas, durasi, dan beban sistem.",
    quality: "Langkah generasi", stepsFast: "4 · Pratinjau Turbo", stepsBalanced: "6 · Turbo seimbang", stepsDetailed: "8 · Detail Turbo", stepsStandard: "16 · Standar"
  },
  ru: {
    modelReady: "Локальная MiniMax H3 готова", modelMissing: "Полный пакет H3 в 4 бит не найден",
    modelDownloading: "Загрузка модели H3 в 4 бит", modelNotLoaded: "Пакет 4 бит найден, но ещё не загружен", runtimeMissing: "Необходимо установить MLX-Serve",
    loadModel: "Запустить MLX-Serve и загрузить модель", runtimeDownload: "Скачать MLX-Serve ↗",
    modelDownload: "Скачать полную модель 4 бит ↗", modelSettings: "Локальная модель",
    modelPath: "Папка модели: ", turboLabel: "Использовать Turbo LoRA на 4 шага (рекомендуется для предпросмотра)",
    computeNote: "Генерация видео требует значительных вычислений. Время зависит от модели, качества, длительности видео и нагрузки системы.",
    quality: "Шаги генерации", stepsFast: "4 · Turbo предпросмотр", stepsBalanced: "6 · Сбалансированный Turbo", stepsDetailed: "8 · Детали Turbo", stepsStandard: "16 · Стандарт"
  }
};

const musicTranslations = {
  "zh-CN": {
    generationMode: "生成模式", modeMusic: "音乐生成", musicChecking: "正在检查 MiniMax Music3…", musicReady: "MiniMax Music3 8-bit 已就绪", musicModelMissing: "未找到完整的 Music3 8-bit 模型", musicRuntimeMissing: "Music3 推理环境不可用", musicModelLink: "查看 Music3 模型卡 ↗",
    musicPromptLabel: "描述你想听到的音乐", musicPromptHint: "描述曲风、速度、乐器、人声与氛围", musicPromptPlaceholder: "例如：温暖的原声流行，96 BPM，亲密柔和的女声，指弹吉他与轻柔弦乐，渐进式副歌。",
    musicModeLabel: "人声模式", musicLyricsMode: "带歌词", musicInstrumentalMode: "纯音乐", musicLyricsLabel: "歌词", musicLyricsPlaceholder: "[intro]：前奏，营造氛围。\n[verse]：主歌，讲故事、铺陈细节。\n[chorus]：副歌，情绪高潮、最抓耳部分。\n[bridge]：桥段，承上启下，加入变化。\n[outro]：尾奏，渐弱收尾。", musicLyricsHint: "可用 [verse]、[chorus] 等段落标签组织歌词。",
    musicDuration: "时长上限", musicSteps: "生成步数", musicComputeNote: "Music3 8-bit 模型约 14.2 GB；较长曲目会显著增加生成时间。纯音乐模式会自动使用 [instrumental] 条件。",
    musicGenerate: "生成音乐", musicGenerating: "正在生成音乐…", musicIntro: "在 Mac 本机用 MiniMax Music3 将文字提示生成带歌词歌曲或纯音乐。", musicEyebrow: "本地音乐生成", musicHeadline: "把灵感，<span>谱成音乐。</span>",
    musicPreviewLabel: "音乐结果", musicPreviewTitle: "音频试听", musicEmpty: "你的音乐<br>将在这里出现", musicEmptyHint: "描述曲风，选择歌词或纯音乐", musicLongRunning: "音乐生成会占用较多内存与计算资源，时长越长等待越久；任务在本机运行。", musicDownload: "下载 WAV", musicLyricsRequired: "请输入歌词，或选择纯音乐模式。", musicModelSettings: "MiniMax Music3 本地音乐模型", musicModelSource: "Music3 8-bit 模型卡 ↗"
  },
  en: {
    generationMode: "Generation mode", modeMusic: "Music", musicChecking: "Checking MiniMax Music3…", musicReady: "MiniMax Music3 8-bit is ready", musicModelMissing: "Complete Music3 8-bit weights were not found", musicRuntimeMissing: "Music3 inference runtime is unavailable", musicModelLink: "View the Music3 model card ↗",
    musicPromptLabel: "Describe the music you want to hear", musicPromptHint: "Describe genre, tempo, instruments, vocals, and mood", musicPromptPlaceholder: "Warm acoustic pop, 96 BPM, intimate soft female vocal, fingerpicked guitar and gentle strings, a gradually lifting chorus.",
    musicModeLabel: "Vocal mode", musicLyricsMode: "With lyrics", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Lyrics", musicLyricsPlaceholder: "[intro]: Introduction, setting the mood.\n[verse]: Verse, telling the story and developing details.\n[chorus]: Chorus, the emotional peak and catchiest part.\n[bridge]: Bridge, connecting sections and adding variation.\n[outro]: Outro, fading out to close.", musicLyricsHint: "Use section tags such as [verse] and [chorus] to structure the lyrics.",
    musicDuration: "Duration limit", musicSteps: "Generation steps", musicComputeNote: "The Music3 8-bit model is about 14.2 GB. Longer tracks take significantly more time; instrumental mode automatically uses the [instrumental] condition.",
    musicGenerate: "Generate music", musicGenerating: "Generating music…", musicIntro: "Generate a vocal song or instrumental track locally on your Mac with MiniMax Music3.", musicEyebrow: "LOCAL MUSIC GENERATION", musicHeadline: "Turn inspiration <span>into music.</span>",
    musicPreviewLabel: "MUSIC RESULT", musicPreviewTitle: "Listen to audio", musicEmpty: "Your music<br>will appear here", musicEmptyHint: "Describe a style and choose vocals or instrumental", musicLongRunning: "Music generation uses substantial memory and compute; longer tracks take more time. The job runs locally.", musicDownload: "Download WAV", musicLyricsRequired: "Enter lyrics or choose instrumental mode.", musicModelSettings: "Local MiniMax Music3 model", musicModelSource: "Music3 8-bit model card ↗"
  },
  "zh-TW": {
    generationMode: "生成模式", modeMusic: "音樂生成", musicChecking: "正在檢查 MiniMax Music3…", musicReady: "MiniMax Music3 8-bit 已就緒", musicModelMissing: "找不到完整的 Music3 8-bit 模型", musicRuntimeMissing: "Music3 推理環境無法使用", musicModelLink: "查看 Music3 模型卡 ↗",
    musicPromptLabel: "描述你想聽到的音樂", musicPromptHint: "描述曲風、速度、樂器、人聲與氛圍", musicPromptPlaceholder: "溫暖原聲流行，96 BPM，親密柔和的女聲，指彈吉他與輕柔弦樂，逐漸高昂的副歌。",
    musicModeLabel: "人聲模式", musicLyricsMode: "含歌詞", musicInstrumentalMode: "純音樂", musicLyricsLabel: "歌詞", musicLyricsPlaceholder: "[intro]：前奏，營造氛圍。\n[verse]：主歌，講故事、鋪陳細節。\n[chorus]：副歌，情緒高潮、最抓耳部分。\n[bridge]：橋段，承上啟下，加入變化。\n[outro]：尾奏，漸弱收尾。", musicLyricsHint: "可使用 [verse]、[chorus] 等段落標籤編排歌詞。",
    musicDuration: "時長上限", musicSteps: "生成步數", musicComputeNote: "Music3 8-bit 模型約 14.2 GB；較長曲目會大幅增加生成時間。純音樂模式會自動使用 [instrumental] 條件。",
    musicGenerate: "生成音樂", musicGenerating: "正在生成音樂…", musicIntro: "在 Mac 本機使用 MiniMax Music3，依文字提示生成歌曲或純音樂。", musicEyebrow: "本機音樂生成", musicHeadline: "把靈感，<span>譜成音樂。</span>",
    musicPreviewLabel: "音樂結果", musicPreviewTitle: "音訊試聽", musicEmpty: "你的音樂<br>將在這裡出現", musicEmptyHint: "描述曲風，選擇歌詞或純音樂", musicLongRunning: "音樂生成需要較多記憶體與運算；曲目越長，等待越久。工作會在本機執行。", musicDownload: "下載 WAV", musicLyricsRequired: "請輸入歌詞，或選擇純音樂模式。", musicModelSettings: "MiniMax Music3 本機音樂模型", musicModelSource: "Music3 8-bit 模型卡 ↗"
  },
  fr: {
    generationMode: "Mode de génération", modeMusic: "Musique", musicChecking: "Vérification de MiniMax Music3…", musicReady: "MiniMax Music3 8 bits est prêt", musicModelMissing: "Poids complets Music3 8 bits introuvables", musicRuntimeMissing: "Environnement d’inférence Music3 indisponible", musicModelLink: "Voir la fiche du modèle Music3 ↗",
    musicPromptLabel: "Décrivez la musique souhaitée", musicPromptHint: "Précisez le genre, le tempo, les instruments, la voix et l’ambiance", musicPromptPlaceholder: "Pop acoustique chaleureuse, 96 BPM, voix féminine douce et intime, guitare picking et cordes légères, refrain qui s’élève.",
    musicModeLabel: "Mode vocal", musicLyricsMode: "Avec paroles", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Paroles", musicLyricsPlaceholder: "[intro] : Introduction, pour installer l’atmosphère.\n[verse] : Couplet, pour raconter l’histoire et développer les détails.\n[chorus] : Refrain, le sommet émotionnel et la partie la plus accrocheuse.\n[bridge] : Pont, pour relier les sections et apporter une variation.\n[outro] : Conclusion, pour terminer en diminuant progressivement.", musicLyricsHint: "Structurez le texte avec des balises comme [verse] et [chorus].",
    musicDuration: "Durée maximale", musicSteps: "Étapes de génération", musicComputeNote: "Le modèle Music3 8 bits pèse environ 14,2 Go. Les morceaux longs prennent plus de temps ; le mode instrumental utilise automatiquement la condition [instrumental].",
    musicGenerate: "Générer la musique", musicGenerating: "Génération de la musique…", musicIntro: "Générez localement sur Mac une chanson avec paroles ou un morceau instrumental avec MiniMax Music3.", musicEyebrow: "GÉNÉRATION MUSICALE LOCALE", musicHeadline: "Transformez l’inspiration <span>en musique.</span>",
    musicPreviewLabel: "RÉSULTAT MUSICAL", musicPreviewTitle: "Écouter l’audio", musicEmpty: "Votre musique<br>apparaîtra ici", musicEmptyHint: "Décrivez un style et choisissez voix ou instrumental", musicLongRunning: "La génération musicale demande mémoire et calcul ; les morceaux longs prennent plus de temps. Le traitement reste local.", musicDownload: "Télécharger WAV", musicLyricsRequired: "Saisissez des paroles ou choisissez le mode instrumental.", musicModelSettings: "Modèle MiniMax Music3 local", musicModelSource: "Fiche du modèle Music3 8 bits ↗"
  },
  de: {
    generationMode: "Generierungsmodus", modeMusic: "Musik", musicChecking: "MiniMax Music3 wird geprüft…", musicReady: "MiniMax Music3 8-Bit ist bereit", musicModelMissing: "Vollständige Music3-8-Bit-Gewichte nicht gefunden", musicRuntimeMissing: "Music3-Laufzeitumgebung nicht verfügbar", musicModelLink: "Music3-Modellkarte ansehen ↗",
    musicPromptLabel: "Beschreibe die gewünschte Musik", musicPromptHint: "Genre, Tempo, Instrumente, Gesang und Stimmung angeben", musicPromptPlaceholder: "Warmer Akustik-Pop, 96 BPM, sanfte intime Frauenstimme, gezupfte Gitarre und leichte Streicher, langsam aufsteigender Refrain.",
    musicModeLabel: "Gesangsmodus", musicLyricsMode: "Mit Text", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Liedtext", musicLyricsPlaceholder: "[intro]: Einleitung, die Atmosphäre schafft.\n[verse]: Strophe, die eine Geschichte erzählt und Details entfaltet.\n[chorus]: Refrain, der emotionale Höhepunkt und eingängigste Teil.\n[bridge]: Überleitung, die Abschnitte verbindet und Abwechslung bringt.\n[outro]: Ausklang, der allmählich leiser wird.", musicLyricsHint: "Strukturiere den Text mit Abschnittsmarken wie [verse] und [chorus].",
    musicDuration: "Maximale Dauer", musicSteps: "Generierungsschritte", musicComputeNote: "Das Music3-8-Bit-Modell ist etwa 14,2 GB groß. Längere Stücke brauchen deutlich mehr Zeit; der Instrumentalmodus nutzt automatisch die Bedingung [instrumental].",
    musicGenerate: "Musik generieren", musicGenerating: "Musik wird generiert…", musicIntro: "Erzeuge lokal auf dem Mac mit MiniMax Music3 Songs mit Text oder Instrumentalstücke.", musicEyebrow: "LOKALE MUSIKGENERIERUNG", musicHeadline: "Mach aus Inspiration <span>Musik.</span>",
    musicPreviewLabel: "MUSIKERGEBNIS", musicPreviewTitle: "Audio anhören", musicEmpty: "Deine Musik<br>erscheint hier", musicEmptyHint: "Stil beschreiben und Gesang oder Instrumental wählen", musicLongRunning: "Musikgenerierung benötigt viel Speicher und Rechenleistung; längere Stücke dauern länger. Die Aufgabe läuft lokal.", musicDownload: "WAV herunterladen", musicLyricsRequired: "Gib einen Liedtext ein oder wähle den Instrumentalmodus.", musicModelSettings: "Lokales MiniMax-Music3-Modell", musicModelSource: "Music3-8-Bit-Modellkarte ↗"
  },
  ja: {
    generationMode: "生成モード", modeMusic: "音楽生成", musicChecking: "MiniMax Music3 を確認中…", musicReady: "MiniMax Music3 8-bit の準備完了", musicModelMissing: "Music3 8-bit の完全なモデルが見つかりません", musicRuntimeMissing: "Music3 の推論環境を利用できません", musicModelLink: "Music3 モデルカードを見る ↗",
    musicPromptLabel: "作りたい音楽を説明", musicPromptHint: "ジャンル、テンポ、楽器、ボーカル、雰囲気を指定", musicPromptPlaceholder: "温かなアコースティックポップ、96 BPM、親密で柔らかな女性ボーカル、アルペジオギターと軽い弦楽器、徐々に盛り上がるサビ。",
    musicModeLabel: "ボーカルモード", musicLyricsMode: "歌詞あり", musicInstrumentalMode: "インストゥルメンタル", musicLyricsLabel: "歌詞", musicLyricsPlaceholder: "[intro]：前奏。雰囲気を作ります。\n[verse]：Aメロ。物語を語り、細部を描きます。\n[chorus]：サビ。感情の頂点で、最も耳に残る部分です。\n[bridge]：ブリッジ。前後をつなぎ、変化を加えます。\n[outro]：後奏。徐々に音を弱めて締めくくります。", musicLyricsHint: "[verse] や [chorus] などのタグで歌詞を構成できます。",
    musicDuration: "最大再生時間", musicSteps: "生成ステップ数", musicComputeNote: "Music3 8-bit モデルは約14.2 GBです。長い曲ほど生成に時間がかかります。インストゥルメンタルでは [instrumental] 条件を自動指定します。",
    musicGenerate: "音楽を生成", musicGenerating: "音楽を生成中…", musicIntro: "MiniMax Music3 で歌詞付きの曲やインストゥルメンタルを Mac 上で生成します。", musicEyebrow: "ローカル音楽生成", musicHeadline: "ひらめきを、<span>音楽に。</span>",
    musicPreviewLabel: "音楽の結果", musicPreviewTitle: "音声を再生", musicEmpty: "生成した音楽が<br>ここに表示されます", musicEmptyHint: "スタイルと歌詞の有無を選択", musicLongRunning: "音楽生成には多くのメモリと計算資源が必要です。長い曲ほど時間がかかります。処理はローカルで実行されます。", musicDownload: "WAV をダウンロード", musicLyricsRequired: "歌詞を入力するか、インストゥルメンタルを選択してください。", musicModelSettings: "ローカル MiniMax Music3 モデル", musicModelSource: "Music3 8-bit モデルカード ↗"
  },
  ko: {
    generationMode: "생성 모드", modeMusic: "음악 생성", musicChecking: "MiniMax Music3 확인 중…", musicReady: "MiniMax Music3 8-bit 준비 완료", musicModelMissing: "완전한 Music3 8-bit 가중치를 찾을 수 없습니다", musicRuntimeMissing: "Music3 추론 환경을 사용할 수 없습니다", musicModelLink: "Music3 모델 카드 보기 ↗",
    musicPromptLabel: "원하는 음악을 설명하세요", musicPromptHint: "장르, 템포, 악기, 보컬, 분위기를 설명하세요", musicPromptPlaceholder: "따뜻한 어쿠스틱 팝, 96 BPM, 부드럽고 친밀한 여성 보컬, 핑거스타일 기타와 잔잔한 현악기, 점점 고조되는 후렴.",
    musicModeLabel: "보컬 모드", musicLyricsMode: "가사 포함", musicInstrumentalMode: "연주곡", musicLyricsLabel: "가사", musicLyricsPlaceholder: "[intro]: 전주, 분위기를 만듭니다.\n[verse]: 절, 이야기를 전하고 세부 내용을 펼칩니다.\n[chorus]: 후렴, 감정의 절정이자 가장 귀에 남는 부분입니다.\n[bridge]: 브리지, 앞뒤를 연결하고 변화를 더합니다.\n[outro]: 후주, 소리를 점차 줄이며 마무리합니다.", musicLyricsHint: "[verse], [chorus] 같은 구간 태그로 가사를 구성할 수 있습니다.",
    musicDuration: "최대 길이", musicSteps: "생성 단계", musicComputeNote: "Music3 8-bit 모델은 약 14.2GB입니다. 곡이 길수록 생성 시간이 늘어납니다. 연주곡 모드는 [instrumental] 조건을 자동으로 사용합니다.",
    musicGenerate: "음악 생성", musicGenerating: "음악 생성 중…", musicIntro: "MiniMax Music3로 가사가 있는 노래나 연주곡을 Mac에서 로컬로 생성하세요.", musicEyebrow: "로컬 음악 생성", musicHeadline: "영감을 <span>음악으로.</span>",
    musicPreviewLabel: "음악 결과", musicPreviewTitle: "오디오 듣기", musicEmpty: "생성한 음악이<br>여기에 표시됩니다", musicEmptyHint: "스타일과 가사 여부를 선택하세요", musicLongRunning: "음악 생성은 메모리와 연산을 많이 사용합니다. 긴 곡일수록 시간이 더 걸리며 작업은 로컬에서 실행됩니다.", musicDownload: "WAV 다운로드", musicLyricsRequired: "가사를 입력하거나 연주곡 모드를 선택하세요.", musicModelSettings: "로컬 MiniMax Music3 모델", musicModelSource: "Music3 8-bit 모델 카드 ↗"
  },
  es: {
    generationMode: "Modo de generación", modeMusic: "Música", musicChecking: "Comprobando MiniMax Music3…", musicReady: "MiniMax Music3 de 8 bits está listo", musicModelMissing: "No se encontraron todos los pesos de Music3 de 8 bits", musicRuntimeMissing: "El entorno de inferencia Music3 no está disponible", musicModelLink: "Ver la ficha del modelo Music3 ↗",
    musicPromptLabel: "Describe la música que quieres", musicPromptHint: "Indica género, tempo, instrumentos, voz y ambiente", musicPromptPlaceholder: "Pop acústico cálido, 96 BPM, voz femenina suave e íntima, guitarra arpegiada y cuerdas ligeras, estribillo que va creciendo.",
    musicModeLabel: "Modo vocal", musicLyricsMode: "Con letra", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Letra", musicLyricsPlaceholder: "[intro]: Introducción, para crear ambiente.\n[verse]: Estrofa, para contar la historia y desarrollar detalles.\n[chorus]: Estribillo, el clímax emocional y la parte más pegadiza.\n[bridge]: Puente, para conectar secciones y añadir variación.\n[outro]: Cierre, con un desvanecimiento gradual.", musicLyricsHint: "Usa etiquetas como [verse] y [chorus] para organizar la letra.",
    musicDuration: "Duración máxima", musicSteps: "Pasos de generación", musicComputeNote: "El modelo Music3 de 8 bits ocupa unos 14,2 GB. Las pistas largas tardan más; el modo instrumental aplica automáticamente la condición [instrumental].",
    musicGenerate: "Generar música", musicGenerating: "Generando música…", musicIntro: "Genera localmente en tu Mac canciones con letra o música instrumental con MiniMax Music3.", musicEyebrow: "GENERACIÓN MUSICAL LOCAL", musicHeadline: "Convierte la inspiración <span>en música.</span>",
    musicPreviewLabel: "RESULTADO MUSICAL", musicPreviewTitle: "Escuchar audio", musicEmpty: "Tu música<br>aparecerá aquí", musicEmptyHint: "Describe el estilo y elige voz o instrumental", musicLongRunning: "La generación musical requiere memoria y cálculo; las pistas largas tardan más. La tarea se ejecuta localmente.", musicDownload: "Descargar WAV", musicLyricsRequired: "Escribe la letra o elige el modo instrumental.", musicModelSettings: "Modelo local MiniMax Music3", musicModelSource: "Ficha del modelo Music3 de 8 bits ↗"
  },
  pt: {
    generationMode: "Modo de geração", modeMusic: "Música", musicChecking: "Verificando o MiniMax Music3…", musicReady: "MiniMax Music3 de 8 bits está pronto", musicModelMissing: "Pesos completos do Music3 de 8 bits não encontrados", musicRuntimeMissing: "Ambiente de inferência do Music3 indisponível", musicModelLink: "Ver o cartão do modelo Music3 ↗",
    musicPromptLabel: "Descreva a música que deseja ouvir", musicPromptHint: "Descreva gênero, ritmo, instrumentos, voz e clima", musicPromptPlaceholder: "Pop acústico acolhedor, 96 BPM, voz feminina suave e intimista, violão dedilhado e cordas leves, refrão crescente.",
    musicModeLabel: "Modo vocal", musicLyricsMode: "Com letra", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Letra", musicLyricsPlaceholder: "[intro]: Introdução, para criar a atmosfera.\n[verse]: Estrofe, para contar a história e desenvolver detalhes.\n[chorus]: Refrão, o auge emocional e a parte mais marcante.\n[bridge]: Ponte, para conectar seções e acrescentar variação.\n[outro]: Encerramento, diminuindo o som gradualmente.", musicLyricsHint: "Use tags como [verse] e [chorus] para estruturar a letra.",
    musicDuration: "Duração máxima", musicSteps: "Etapas de geração", musicComputeNote: "O modelo Music3 de 8 bits tem cerca de 14,2 GB. Faixas longas demoram mais; o modo instrumental usa automaticamente a condição [instrumental].",
    musicGenerate: "Gerar música", musicGenerating: "Gerando música…", musicIntro: "Gere localmente no Mac músicas com letra ou faixas instrumentais usando MiniMax Music3.", musicEyebrow: "GERAÇÃO MUSICAL LOCAL", musicHeadline: "Transforme inspiração <span>em música.</span>",
    musicPreviewLabel: "RESULTADO MUSICAL", musicPreviewTitle: "Ouvir áudio", musicEmpty: "Sua música<br>aparecerá aqui", musicEmptyHint: "Descreva o estilo e escolha voz ou instrumental", musicLongRunning: "A geração musical exige memória e processamento; faixas mais longas levam mais tempo. A tarefa é local.", musicDownload: "Baixar WAV", musicLyricsRequired: "Digite a letra ou escolha o modo instrumental.", musicModelSettings: "Modelo local MiniMax Music3", musicModelSource: "Cartão do modelo Music3 de 8 bits ↗"
  },
  tr: {
    generationMode: "Üretim modu", modeMusic: "Müzik", musicChecking: "MiniMax Music3 denetleniyor…", musicReady: "MiniMax Music3 8-bit hazır", musicModelMissing: "Tam Music3 8-bit ağırlıkları bulunamadı", musicRuntimeMissing: "Music3 çıkarım ortamı kullanılamıyor", musicModelLink: "Music3 model kartını görüntüle ↗",
    musicPromptLabel: "Duymak istediğiniz müziği açıklayın", musicPromptHint: "Türü, tempoyu, enstrümanları, vokali ve havayı belirtin", musicPromptPlaceholder: "Sıcak akustik pop, 96 BPM, yumuşak ve samimi kadın vokali, parmakla çalınan gitar ve hafif yaylılar, giderek yükselen nakarat.",
    musicModeLabel: "Vokal modu", musicLyricsMode: "Sözlü", musicInstrumentalMode: "Enstrümantal", musicLyricsLabel: "Şarkı sözleri", musicLyricsPlaceholder: "[intro]: Giriş, atmosfer oluşturur.\n[verse]: Kıta, hikâyeyi anlatır ve ayrıntıları geliştirir.\n[chorus]: Nakarat, duygusal zirve ve en akılda kalıcı bölüm.\n[bridge]: Köprü, bölümleri bağlar ve çeşitlilik katar.\n[outro]: Bitiş, sesin giderek azalmasıyla kapanır.", musicLyricsHint: "Sözleri [verse] ve [chorus] gibi bölüm etiketleriyle düzenleyin.",
    musicDuration: "En fazla süre", musicSteps: "Üretim adımları", musicComputeNote: "Music3 8-bit model yaklaşık 14,2 GB'tır. Uzun parçalar daha fazla zaman alır; enstrümantal mod [instrumental] koşulunu otomatik kullanır.",
    musicGenerate: "Müzik oluştur", musicGenerating: "Müzik oluşturuluyor…", musicIntro: "MiniMax Music3 ile Mac'inizde sözlü şarkı veya enstrümantal müzik üretin.", musicEyebrow: "YEREL MÜZİK ÜRETİMİ", musicHeadline: "İlhamı <span>müziğe dönüştürün.</span>",
    musicPreviewLabel: "MÜZİK SONUCU", musicPreviewTitle: "Sesi dinle", musicEmpty: "Müziğiniz<br>burada görünecek", musicEmptyHint: "Tarzı açıklayın, vokal veya enstrümantal seçin", musicLongRunning: "Müzik üretimi yoğun bellek ve işlem gücü kullanır; uzun parçalar daha uzun sürer. İşlem yerel olarak yürütülür.", musicDownload: "WAV indir", musicLyricsRequired: "Sözleri girin veya enstrümantal modu seçin.", musicModelSettings: "Yerel MiniMax Music3 modeli", musicModelSource: "Music3 8-bit model kartı ↗"
  },
  ar: {
    generationMode: "وضع الإنشاء", modeMusic: "موسيقى", musicChecking: "جارٍ التحقق من MiniMax Music3…", musicReady: "MiniMax Music3 بدقة 8 بت جاهز", musicModelMissing: "لم يتم العثور على أوزان Music3 الكاملة بدقة 8 بت", musicRuntimeMissing: "بيئة استدلال Music3 غير متاحة", musicModelLink: "عرض بطاقة نموذج Music3 ↗",
    musicPromptLabel: "صف الموسيقى التي تريد سماعها", musicPromptHint: "اذكر النوع والإيقاع والآلات والصوت والأجواء", musicPromptPlaceholder: "بوب صوتي دافئ، 96 BPM، صوت نسائي ناعم وحميم، غيتار بأوتار منتقاة وآلات وترية هادئة، لازمة تتصاعد تدريجيًا.",
    musicModeLabel: "وضع الصوت", musicLyricsMode: "مع كلمات", musicInstrumentalMode: "موسيقى آلية", musicLyricsLabel: "الكلمات", musicLyricsPlaceholder: "[intro]: المقدمة، لتهيئة الأجواء.\n[verse]: المقطع، لسرد القصة وتطوير التفاصيل.\n[chorus]: اللازمة، ذروة المشاعر والجزء الأكثر رسوخًا في الذاكرة.\n[bridge]: الجسر، لربط المقاطع وإضافة التنوع.\n[outro]: الخاتمة، بإنهاء الصوت تدريجيًا.", musicLyricsHint: "نظّم الكلمات بعلامات مقاطع مثل [verse] و[chorus].",
    musicDuration: "الحد الأقصى للمدة", musicSteps: "خطوات الإنشاء", musicComputeNote: "يبلغ حجم نموذج Music3 بدقة 8 بت نحو 14.2 غيغابايت. تستغرق المقاطع الطويلة وقتًا أطول؛ يستخدم الوضع الآلي شرط [instrumental] تلقائيًا.",
    musicGenerate: "إنشاء الموسيقى", musicGenerating: "جارٍ إنشاء الموسيقى…", musicIntro: "أنشئ أغنية بكلمات أو موسيقى آلية محليًا على Mac باستخدام MiniMax Music3.", musicEyebrow: "إنشاء موسيقى محليًا", musicHeadline: "حوّل الإلهام <span>إلى موسيقى.</span>",
    musicPreviewLabel: "نتيجة الموسيقى", musicPreviewTitle: "استمع إلى الصوت", musicEmpty: "ستظهر موسيقاك<br>هنا", musicEmptyHint: "صف النمط واختر كلمات أو موسيقى آلية", musicLongRunning: "يتطلب إنشاء الموسيقى ذاكرة وقدرة حسابية كبيرتين؛ تستغرق المقاطع الأطول وقتًا أكثر. تعمل المهمة محليًا.", musicDownload: "تنزيل WAV", musicLyricsRequired: "أدخل الكلمات أو اختر وضع الموسيقى الآلية.", musicModelSettings: "نموذج MiniMax Music3 المحلي", musicModelSource: "بطاقة نموذج Music3 بدقة 8 بت ↗"
  },
  vi: {
    generationMode: "Chế độ tạo", modeMusic: "Âm nhạc", musicChecking: "Đang kiểm tra MiniMax Music3…", musicReady: "MiniMax Music3 8-bit đã sẵn sàng", musicModelMissing: "Không tìm thấy đầy đủ trọng số Music3 8-bit", musicRuntimeMissing: "Môi trường suy luận Music3 không khả dụng", musicModelLink: "Xem thẻ mô hình Music3 ↗",
    musicPromptLabel: "Mô tả âm nhạc bạn muốn nghe", musicPromptHint: "Nêu thể loại, nhịp độ, nhạc cụ, giọng hát và không khí", musicPromptPlaceholder: "Pop acoustic ấm áp, 96 BPM, giọng nữ dịu dàng thân mật, guitar fingerstyle và dây nhẹ, điệp khúc dâng lên từ từ.",
    musicModeLabel: "Chế độ giọng hát", musicLyricsMode: "Có lời", musicInstrumentalMode: "Không lời", musicLyricsLabel: "Lời bài hát", musicLyricsPlaceholder: "[intro]: Dạo đầu, tạo không khí.\n[verse]: Phiên khúc, kể câu chuyện và triển khai chi tiết.\n[chorus]: Điệp khúc, cao trào cảm xúc và phần bắt tai nhất.\n[bridge]: Đoạn chuyển, kết nối các phần và tạo biến đổi.\n[outro]: Đoạn kết, nhỏ dần để khép lại.", musicLyricsHint: "Dùng thẻ như [verse], [chorus] để chia cấu trúc lời.",
    musicDuration: "Thời lượng tối đa", musicSteps: "Số bước tạo", musicComputeNote: "Mô hình Music3 8-bit có dung lượng khoảng 14,2 GB. Bản nhạc dài mất nhiều thời gian hơn; chế độ không lời tự dùng điều kiện [instrumental].",
    musicGenerate: "Tạo nhạc", musicGenerating: "Đang tạo nhạc…", musicIntro: "Tạo bài hát có lời hoặc nhạc không lời cục bộ trên Mac bằng MiniMax Music3.", musicEyebrow: "TẠO NHẠC CỤC BỘ", musicHeadline: "Biến cảm hứng <span>thành âm nhạc.</span>",
    musicPreviewLabel: "KẾT QUẢ ÂM NHẠC", musicPreviewTitle: "Nghe âm thanh", musicEmpty: "Bản nhạc của bạn<br>sẽ xuất hiện ở đây", musicEmptyHint: "Mô tả phong cách và chọn có lời hoặc không lời", musicLongRunning: "Tạo nhạc cần nhiều bộ nhớ và năng lực tính toán; bản nhạc càng dài càng mất thời gian. Tác vụ chạy cục bộ.", musicDownload: "Tải WAV", musicLyricsRequired: "Nhập lời bài hát hoặc chọn chế độ không lời.", musicModelSettings: "Mô hình MiniMax Music3 cục bộ", musicModelSource: "Thẻ mô hình Music3 8-bit ↗"
  },
  id: {
    generationMode: "Mode generasi", modeMusic: "Musik", musicChecking: "Memeriksa MiniMax Music3…", musicReady: "MiniMax Music3 8-bit siap", musicModelMissing: "Bobot lengkap Music3 8-bit tidak ditemukan", musicRuntimeMissing: "Runtime inferensi Music3 tidak tersedia", musicModelLink: "Lihat kartu model Music3 ↗",
    musicPromptLabel: "Jelaskan musik yang ingin didengar", musicPromptHint: "Jelaskan genre, tempo, instrumen, vokal, dan suasana", musicPromptPlaceholder: "Pop akustik hangat, 96 BPM, vokal wanita lembut dan intim, gitar petikan serta string ringan, chorus yang meningkat perlahan.",
    musicModeLabel: "Mode vokal", musicLyricsMode: "Dengan lirik", musicInstrumentalMode: "Instrumental", musicLyricsLabel: "Lirik", musicLyricsPlaceholder: "[intro]: Pembuka, membangun suasana.\n[verse]: Bait, menceritakan kisah dan mengembangkan detail.\n[chorus]: Refrain, puncak emosi dan bagian paling mudah diingat.\n[bridge]: Jembatan, menghubungkan bagian dan menambah variasi.\n[outro]: Penutup, dengan suara yang perlahan memudar.", musicLyricsHint: "Gunakan tag seperti [verse] dan [chorus] untuk menyusun lirik.",
    musicDuration: "Batas durasi", musicSteps: "Langkah generasi", musicComputeNote: "Model Music3 8-bit berukuran sekitar 14,2 GB. Lagu yang lebih panjang membutuhkan waktu lebih lama; mode instrumental otomatis memakai kondisi [instrumental].",
    musicGenerate: "Buat musik", musicGenerating: "Membuat musik…", musicIntro: "Buat lagu berlirik atau musik instrumental secara lokal di Mac dengan MiniMax Music3.", musicEyebrow: "GENERASI MUSIK LOKAL", musicHeadline: "Ubah inspirasi <span>menjadi musik.</span>",
    musicPreviewLabel: "HASIL MUSIK", musicPreviewTitle: "Dengarkan audio", musicEmpty: "Musik Anda<br>akan muncul di sini", musicEmptyHint: "Jelaskan gaya dan pilih vokal atau instrumental", musicLongRunning: "Generasi musik membutuhkan banyak memori dan komputasi; lagu panjang membutuhkan waktu lebih lama. Tugas berjalan lokal.", musicDownload: "Unduh WAV", musicLyricsRequired: "Masukkan lirik atau pilih mode instrumental.", musicModelSettings: "Model lokal MiniMax Music3", musicModelSource: "Kartu model Music3 8-bit ↗"
  },
  ru: {
    generationMode: "Режим генерации", modeMusic: "Музыка", musicChecking: "Проверка MiniMax Music3…", musicReady: "MiniMax Music3 8-bit готова", musicModelMissing: "Полные веса Music3 8-bit не найдены", musicRuntimeMissing: "Среда Music3 недоступна", musicModelLink: "Открыть карточку Music3 ↗",
    musicPromptLabel: "Опишите желаемую музыку", musicPromptHint: "Укажите жанр, темп, инструменты, вокал и настроение", musicPromptPlaceholder: "Тёплый акустический поп, 96 BPM, мягкий интимный женский вокал, перебор гитары и лёгкие струнные, постепенно нарастающий припев.",
    musicModeLabel: "Режим вокала", musicLyricsMode: "С текстом", musicInstrumentalMode: "Инструментальная", musicLyricsLabel: "Текст песни", musicLyricsPlaceholder: "[intro]: Вступление, создающее атмосферу.\n[verse]: Куплет, раскрывающий историю и детали.\n[chorus]: Припев, эмоциональная вершина и самая запоминающаяся часть.\n[bridge]: Переход, связывающий части и добавляющий разнообразие.\n[outro]: Завершение с постепенным затиханием.", musicLyricsHint: "Используйте метки разделов, например [verse] и [chorus].",
    musicDuration: "Максимальная длительность", musicSteps: "Шаги генерации", musicComputeNote: "Модель Music3 8-bit занимает около 14,2 ГБ. Длинные композиции генерируются дольше; инструментальный режим автоматически использует условие [instrumental].",
    musicGenerate: "Создать музыку", musicGenerating: "Создание музыки…", musicIntro: "Создавайте локально на Mac песни с текстом или инструментальную музыку с MiniMax Music3.", musicEyebrow: "ЛОКАЛЬНАЯ ГЕНЕРАЦИЯ МУЗЫКИ", musicHeadline: "Превратите вдохновение <span>в музыку.</span>",
    musicPreviewLabel: "РЕЗУЛЬТАТ", musicPreviewTitle: "Прослушать аудио", musicEmpty: "Ваша музыка<br>появится здесь", musicEmptyHint: "Опишите стиль и выберите вокал или инструментал", musicLongRunning: "Генерация музыки требует много памяти и вычислений; длинные треки создаются дольше. Задача выполняется локально.", musicDownload: "Скачать WAV", musicLyricsRequired: "Введите текст песни или выберите инструментальный режим.", musicModelSettings: "Локальная модель MiniMax Music3", musicModelSource: "Карточка Music3 8-bit ↗"
  }
};

const imageLongEdgeTranslations = {
  "zh-CN": "图像分辨率（长边像素）", en: "Image resolution (long edge pixels)",
  "zh-TW": "圖片解析度（長邊像素）", fr: "Résolution (pixels du grand côté)",
  de: "Auflösung (Pixel der langen Seite)", ja: "画像解像度（長辺ピクセル）",
  ko: "이미지 해상도 (긴 변 픽셀)", es: "Resolución (píxeles del lado largo)",
  pt: "Resolução (pixels do lado maior)", tr: "Çözünürlük (uzun kenar piksel)",
  ar: "دقة الصورة (بكسلات الضلع الأطول)", vi: "Độ phân giải (pixel cạnh dài)",
  id: "Resolusi (piksel sisi panjang)", ru: "Разрешение (пиксели длинной стороны)"
};
const imageQualityKeys = [
  "imageQuality", "imageQualityPreview", "imageQualityStandard", "imageQualityHigh",
  "imageQualityCustom", "imageCandidates", "imageNativeResolution", "imageCandidate",
  "imageTurnaround", "imageTurnaroundEnable", "imageTurnaroundHint",
  "turnaroundFront", "turnaroundSide", "turnaroundBack"
];
const imageQualityTranslations = {
  "zh-CN": ["图像质量", "快速预览", "标准质量", "高质量", "自定义", "候选图片数量", "模型原生训练分辨率", "候选图", "人物三视图快捷设置", "一次生成正面、侧面和背面三张人物图", "画面描述中只写人物本身，不要写“三视图”或“正面、侧面、背面”；系统会固定生成三张独立全身图，每张只有一个人物，分别为正面、侧面和背面；结果可直接选入视频、长视频和 MV 的人物参考图片。", "正面", "侧面", "背面"],
  en: ["Image quality", "Quick preview", "Standard", "High quality", "Custom", "Candidate images", "Model-native training resolution", "Candidate", "Character turnaround shortcut", "Generate front, side, and back character views at once", "Describe only the character itself; do not ask for \"three views\" or \"front, side, back\". Three separate full-body images are always produced, each showing a single character in the front, side, and back view. The set can be selected directly in video, long-video, and MV character references.", "Front", "Side", "Back"],
  "zh-TW": ["圖像品質", "快速預覽", "標準品質", "高品質", "自訂", "候選圖片數量", "模型原生訓練解析度", "候選圖", "人物三視圖快速設定", "一次生成正面、側面與背面三張人物圖", "畫面描述中只寫人物本身，不要寫「三視圖」或「正面、側面、背面」；系統固定生成三張獨立全身圖，每張只有一個人物，分別為正面、側面與背面；結果可直接用於影片、長影片與 MV 的人物參考。", "正面", "側面", "背面"],
  fr: ["Qualité d’image", "Aperçu rapide", "Standard", "Haute qualité", "Personnalisée", "Images candidates", "Résolution native d’entraînement", "Candidate", "Raccourci de rotation du personnage", "Générer les vues face, profil et dos", "Décrivez uniquement le personnage, sans demander « trois vues » ni « face, profil, dos ». Trois images plein pied distinctes sont toujours créées, chacune avec un seul personnage en vue de face, de profil et de dos, sélectionnables dans les références vidéo, vidéo longue et MV.", "Face", "Profil", "Dos"],
  de: ["Bildqualität", "Schnellvorschau", "Standard", "Hohe Qualität", "Benutzerdefiniert", "Bildvarianten", "Native Trainingsauflösung", "Variante", "Figuren-Dreiansicht", "Vorder-, Seiten- und Rückansicht gemeinsam erzeugen", "Beschreiben Sie nur die Figur selbst, ohne „Dreiansicht“ oder „vorne, seitlich, hinten“. Es entstehen immer drei getrennte Ganzkörperbilder mit jeweils einer einzigen Figur in Vorder-, Seiten- und Rückansicht für Video-, Langvideo- und MV-Referenzen.", "Vorne", "Seite", "Hinten"],
  ja: ["画像品質", "クイックプレビュー", "標準", "高品質", "カスタム", "候補画像数", "モデル本来の学習解像度", "候補", "人物三面図クイック設定", "正面・側面・背面を一括生成", "説明には人物そのものだけを書き、「三面図」や「正面・側面・背面」とは書かないでください。常に全身画像3枚を個別に生成し、各画像には1人だけが正面・側面・背面で描かれ、動画・長編動画・MVの人物参照で直接選択できます。", "正面", "側面", "背面"],
  ko: ["이미지 품질", "빠른 미리보기", "표준", "고품질", "사용자 지정", "후보 이미지 수", "모델 기본 학습 해상도", "후보", "캐릭터 3면도 빠른 설정", "정면·측면·후면 이미지 동시 생성", "설명에는 인물 자체만 적고 \"3면도\"나 \"정면, 측면, 후면\"은 적지 마세요. 항상 전신 이미지 3장을 따로 생성하며 각 이미지에는 한 명만 정면, 측면, 후면으로 나타나고 영상, 장편 영상, MV 인물 참조에서 선택할 수 있습니다.", "정면", "측면", "후면"],
  es: ["Calidad de imagen", "Vista rápida", "Estándar", "Alta calidad", "Personalizada", "Imágenes candidatas", "Resolución nativa de entrenamiento", "Candidata", "Atajo de vistas del personaje", "Generar frente, perfil y espalda", "Describe solo al personaje; no pidas «tres vistas» ni «frente, perfil, espalda». Siempre se crean tres imágenes de cuerpo entero separadas, cada una con un solo personaje de frente, de perfil y de espalda, para referencias de vídeo, vídeo largo y MV.", "Frente", "Perfil", "Espalda"],
  pt: ["Qualidade da imagem", "Prévia rápida", "Padrão", "Alta qualidade", "Personalizada", "Imagens candidatas", "Resolução nativa de treino", "Candidata", "Atalho de vistas do personagem", "Gerar frente, perfil e costas", "Descreva apenas o personagem; não peça «três vistas» nem «frente, perfil, costas». São sempre criadas três imagens de corpo inteiro separadas, cada uma com um único personagem de frente, de perfil e de costas, para referências de vídeo, vídeo longo e MV.", "Frente", "Perfil", "Costas"],
  tr: ["Görüntü kalitesi", "Hızlı önizleme", "Standart", "Yüksek kalite", "Özel", "Aday görseller", "Modelin doğal eğitim çözünürlüğü", "Aday", "Karakter üç görünüm kısayolu", "Ön, yan ve arka görünümü birlikte üret", "Açıklamaya yalnızca karakterin kendisini yazın; «üç görünüm» veya «ön, yan, arka» yazmayın. Her zaman üç ayrı tam boy görsel üretilir ve her görselde tek bir karakter ön, yan ve arka görünümde yer alır; video, uzun video ve MV referanslarında seçilebilir.", "Ön", "Yan", "Arka"],
  ar: ["جودة الصورة", "معاينة سريعة", "قياسية", "جودة عالية", "مخصصة", "الصور المرشحة", "دقة التدريب الأصلية للنموذج", "مرشح", "اختصار مناظر الشخصية الثلاثة", "توليد الأمام والجانب والخلف معًا", "صف الشخصية نفسها فقط، ولا تطلب «ثلاثة مناظر» أو «الأمام والجانب والخلف». تُنشأ دائمًا ثلاث صور منفصلة لكامل الجسم، تحتوي كل منها على شخصية واحدة فقط من الأمام والجانب والخلف، ويمكن اختيارها في مراجع الفيديو والفيديو الطويل وMV.", "الأمام", "الجانب", "الخلف"],
  vi: ["Chất lượng ảnh", "Xem nhanh", "Tiêu chuẩn", "Chất lượng cao", "Tùy chỉnh", "Số ảnh ứng viên", "Độ phân giải huấn luyện gốc", "Ứng viên", "Thiết lập nhanh ba góc nhân vật", "Tạo đồng thời mặt trước, bên và sau", "Chỉ mô tả bản thân nhân vật, đừng yêu cầu «ba góc nhìn» hay «mặt trước, bên, sau». Hệ thống luôn tạo ba ảnh toàn thân riêng biệt, mỗi ảnh chỉ có một nhân vật ở góc trước, bên và sau, dùng cho tham chiếu video, video dài và MV.", "Mặt trước", "Mặt bên", "Mặt sau"],
  id: ["Kualitas gambar", "Pratinjau cepat", "Standar", "Kualitas tinggi", "Kustom", "Gambar kandidat", "Resolusi pelatihan asli model", "Kandidat", "Pintasan tiga tampak karakter", "Buat tampak depan, samping, dan belakang", "Jelaskan hanya karakternya; jangan minta «tiga tampak» atau «depan, samping, belakang». Selalu dibuat tiga gambar seluruh badan terpisah, masing-masing hanya berisi satu karakter dari depan, samping, dan belakang, untuk referensi video, video panjang, dan MV.", "Depan", "Samping", "Belakang"],
  ru: ["Качество изображения", "Быстрый просмотр", "Стандарт", "Высокое качество", "Своя настройка", "Число вариантов", "Исходное обучающее разрешение", "Вариант", "Быстрая трёхвидовая модель персонажа", "Создать вид спереди, сбоку и сзади", "Описывайте только самого персонажа, не указывайте «три вида» или «спереди, сбоку, сзади». Всегда создаются три отдельные полнофигурные картинки, на каждой только один персонаж — спереди, сбоку и сзади — для видео, длинного видео и MV.", "Спереди", "Сбоку", "Сзади"]
};
const storyboardTimingKeys = ["storyboardTotalDuration", "storyboardShotDuration", "storyboardDurationHint", "storyboardTimingInvalid"];
const storyboardTimingTranslations = {
  en: ["Total video duration (seconds)", "Duration per shot (seconds)", "Total must be divisible by shot duration; max 1800 shots. Applies only to newly added shots, excluding existing shots.", "Use whole seconds, divide the total exactly by 5, 8, 10 or 15 seconds per shot, and stay within 1800 shots."],
  "zh-CN": ["视频总长（秒）", "每个分镜时长（秒）", "总长须能整除单镜头时长，最多1800个镜头；仅计算本次新增分镜，不包含已有镜头。", "请输入整数秒，总长须能被每镜头5、8、10或15秒整除，且镜头数不超过1800。"],
  "zh-TW": ["影片總長（秒）", "每個分鏡時長（秒）", "總長須能整除單鏡頭時長，最多1800個鏡頭；僅計算本次新增分鏡，不包含已有鏡頭。", "請輸入整數秒，總長須能被每鏡頭5、8、10或15秒整除，且鏡頭數不超過1800。"],
  fr: ["Durée totale (secondes)", "Durée par plan (secondes)", "Total divisible par la durée d’un plan ; 1800 plans maximum. Uniquement les nouveaux plans.", "Utilisez des secondes entières, un total divisible par 5, 8, 10 ou 15 secondes par plan, et au plus 1800 plans."],
  de: ["Gesamtdauer (Sekunden)", "Dauer pro Szene (Sekunden)", "Gesamtdauer muss durch die Szenendauer teilbar sein; höchstens 1800 neue Szenen, ohne vorhandene.", "Ganze Sekunden und exakt durch 5, 8, 10 oder 15 Sekunden pro Szene teilbar; höchstens 1800 Szenen."],
  ja: ["動画の合計時間（秒）", "各ショットの時間（秒）", "合計時間はショット時間で割り切れる必要があります。最大1800ショット。既存分を除く追加分のみ。", "整数秒で指定し、各ショット5・8・10・15秒で合計を割り切り、1800ショット以内にしてください。"],
  ko: ["영상 총 길이 (초)", "장면당 길이 (초)", "총 길이는 장면 길이로 나누어떨어져야 합니다. 새 장면 최대 1800개, 기존 장면 제외.", "정수 초를 입력하고 장면당 5, 8, 10, 15초로 정확히 나누어 최대 1800개로 설정하세요."],
  es: ["Duración total (segundos)", "Duración por plano (segundos)", "Total divisible por la duración del plano; máximo 1800 planos nuevos, sin los existentes.", "Use segundos enteros y un total divisible por 5, 8, 10 o 15 segundos por plano; máximo 1800 planos."],
  pt: ["Duração total (segundos)", "Duração por cena (segundos)", "Total divisível pela duração da cena; máximo 1800 cenas novas, excluindo as existentes.", "Use segundos inteiros e total divisível por 5, 8, 10 ou 15 segundos por cena; máximo 1800 cenas."],
  tr: ["Toplam video süresi (saniye)", "Sahne başına süre (saniye)", "Toplam sahne süresine tam bölünmeli; mevcutlar hariç en fazla 1800 yeni sahne.", "Tam saniye kullanın; toplamı sahne başına 5, 8, 10 veya 15 saniyeye tam bölün ve 1800 sahneyi aşmayın."],
  ar: ["مدة الفيديو الإجمالية (ثوانٍ)", "مدة كل مشهد (ثوانٍ)", "يجب أن تقبل المدة القسمة على مدة المشهد؛ 1800 مشهدًا جديدًا كحد أقصى، دون المشاهد الحالية.", "استخدم ثوانٍ صحيحة ومجموعًا يقبل القسمة على 5 أو 8 أو 10 أو 15 ثانية للمشهد، وبحد أقصى 1800 مشهدًا."],
  vi: ["Tổng thời lượng video (giây)", "Thời lượng mỗi cảnh (giây)", "Tổng phải chia hết cho thời lượng cảnh; tối đa 1800 cảnh mới, không tính cảnh hiện có.", "Dùng giây nguyên, tổng chia hết cho 5, 8, 10 hoặc 15 giây mỗi cảnh và không quá 1800 cảnh."],
  id: ["Durasi total video (detik)", "Durasi tiap adegan (detik)", "Total harus habis dibagi durasi adegan; maksimal 1800 adegan baru, tidak termasuk yang ada.", "Gunakan detik bulat, total habis dibagi 5, 8, 10 atau 15 detik per adegan dan maksimal 1800 adegan."],
  ru: ["Общая длительность (секунды)", "Длительность сцены (секунды)", "Длительность должна делиться на длину сцены; максимум 1800 новых сцен, без существующих.", "Используйте целые секунды и сумму, кратную 5, 8, 10 или 15 секундам на сцену; максимум 1800 сцен."]
};

const storyboardTranslations = {
  "zh-CN": {
    modeWorkflow: "长视频", workflowKicker: "长视频分段工作流", workflowTitle: "分镜与生成",
    workflowDraft: "未保存", workflowNote: "先保存并确认分镜，再启动本机串行生成。运行期间，独立生成会暂不可用。",
    workflowName: "项目名称", workflowShots: "镜头分镜", workflowAddShot: "添加镜头", workflowRemoveShot: "移除",
    workflowExpandShot: "展开镜头", workflowCollapseShot: "折叠镜头",
    workflowShotTitle: "镜头标题", workflowShotTitlePlaceholder: "例如：晨雾中的列车",
    workflowShotPrompt: "镜头提示词", workflowShotPromptPlaceholder: "描述主体、动作、场景、镜头和光线；每段生成 5–15 秒。",
    workflowShotDuration: "时长（每段 5–15 秒）", workflowSoundtrack: "配乐与混音",
    workflowGenerateMusic: "为每个分镜独立生成配乐", workflowMusicPrompt: "本镜头配乐提示词",
    workflowMusicPromptPlaceholder: "描述本镜头的配乐风格、情绪、乐器与节奏。",
    workflowMusicSource: "配乐来源", workflowMusicSourceNew: "生成新配乐", workflowBurnLyrics: "在视频中嵌入歌词字幕",
    workflowMusicSourceMissing: "所选配乐历史文件已不存在", workflowMusicSourceNotFound: "找不到所选配乐历史项目",
    workflowGlobalMusicPrompt: "整体配乐提示词",
    workflowGlobalMusicPromptPlaceholder: "描述贯穿整部视频的配乐风格、情绪、乐器与节奏。",
    workflowAudioMix: "音轨策略", workflowScoreOnly: "仅使用配乐", workflowMixAudio: "配乐混合镜头原声",
    workflowSave: "保存分镜", workflowStart: "确认并开始", workflowResume: "恢复工作流",
    workflowCancel: "取消工作流", workflowSaved: "已保存的工作流", workflowRefresh: "刷新", workflowNew: "新建",
    workflowSaving: "正在保存…", workflowSaveError: "保存工作流失败", workflowActionError: "无法启动或恢复工作流", workflowStarting: "正在启动…",
    workflowStatusQueued: "排队中", workflowStatusRunning: "生成中", workflowStatusCompleted: "已完成",
    workflowStatusFailed: "失败", workflowStatusCancelled: "已取消", workflowStatusInterrupted: "已中断",
    workflowStatusDraft: "待确认", workflowNoItems: "还没有保存的工作流。", workflowOutput: "下载成片",
    workflowShot: "镜头", workflowMusicSegment: "配乐片段", workflowMusicProgress: "配乐",
    workflowBusy: "工作流运行期间无法启动独立生成。",
    workflowTooManyShots: "最多支持 1800 个镜头。", workflowFailed: "工作流失败：", workflowServerError: "无法读取工作流。"
  },
  en: {
    modeWorkflow: "Long video", workflowKicker: "LONG-FORM VIDEO WORKFLOW", workflowTitle: "Storyboard & generation",
    workflowDraft: "Not saved", workflowNote: "Save and review the storyboard before starting serial local generation. Standalone generation is paused while it runs.",
    workflowName: "Project name", workflowShots: "Storyboard shots", workflowAddShot: "Add shot", workflowRemoveShot: "Remove",
    workflowExpandShot: "Expand shot", workflowCollapseShot: "Collapse shot",
    workflowShotTitle: "Shot title", workflowShotTitlePlaceholder: "e.g. Train through morning mist",
    workflowShotPrompt: "Shot prompt", workflowShotPromptPlaceholder: "Describe subject, action, setting, camera and light; each shot is 5–15 seconds.",
    workflowShotDuration: "Duration (5–15 seconds)", workflowSoundtrack: "Score & audio mix",
    workflowGenerateMusic: "Generate a separate score for each shot", workflowMusicPrompt: "Music prompt for this shot",
    workflowMusicPromptPlaceholder: "Describe this shot's score style, mood, instruments, and tempo.",
    workflowMusicSource: "Soundtrack source", workflowMusicSourceNew: "Generate new soundtrack", workflowBurnLyrics: "Burn lyrics into the video as subtitles",
    workflowMusicSourceMissing: "The selected music history file no longer exists", workflowMusicSourceNotFound: "The selected music history item was not found",
    workflowGlobalMusicPrompt: "Overall soundtrack prompt",
    workflowGlobalMusicPromptPlaceholder: "Describe the music style, mood, instruments, and tempo for the whole video.",
    workflowAudioMix: "Audio strategy", workflowScoreOnly: "Score only", workflowMixAudio: "Mix score with shot audio",
    workflowSave: "Save storyboard", workflowStart: "Review & start", workflowResume: "Resume workflow",
    workflowCancel: "Cancel workflow", workflowSaved: "Saved workflows", workflowRefresh: "Refresh", workflowNew: "New",
    workflowSaving: "Saving…", workflowSaveError: "Could not save workflow", workflowActionError: "Could not start or resume workflow", workflowStarting: "Starting…",
    workflowStatusQueued: "Queued", workflowStatusRunning: "Generating", workflowStatusCompleted: "Complete",
    workflowStatusFailed: "Failed", workflowStatusCancelled: "Cancelled", workflowStatusInterrupted: "Interrupted",
    workflowStatusDraft: "Draft", workflowNoItems: "No saved workflows yet.", workflowOutput: "Download final video",
    workflowShot: "Shot", workflowMusicSegment: "Score segment", workflowMusicProgress: "Music",
    workflowBusy: "Standalone generation is unavailable while a workflow runs.",
    workflowTooManyShots: "A workflow can contain at most 1800 shots.", workflowFailed: "Workflow failed: ", workflowServerError: "Could not load workflows."
  },
  "zh-TW": {
    modeWorkflow: "長影片", workflowKicker: "長影片分段工作流程", workflowTitle: "分鏡與生成",
    workflowDraft: "尚未儲存", workflowNote: "先儲存並確認分鏡，再啟動本機依序生成。執行期間會暫停獨立生成。",
    workflowName: "專案名稱", workflowShots: "鏡頭分鏡", workflowAddShot: "新增鏡頭", workflowRemoveShot: "移除",
    workflowExpandShot: "展開鏡頭", workflowCollapseShot: "摺疊鏡頭",
    workflowShotTitle: "鏡頭標題", workflowShotTitlePlaceholder: "例如：晨霧中的列車",
    workflowShotPrompt: "鏡頭提示詞", workflowShotPromptPlaceholder: "描述主體、動作、場景、鏡頭與光線；每段 5–15 秒。",
    workflowShotDuration: "時長（每段 5–15 秒）", workflowSoundtrack: "配樂與混音",
    workflowGenerateMusic: "為每個分鏡獨立生成配樂", workflowMusicPrompt: "本鏡頭配樂提示詞",
    workflowMusicPromptPlaceholder: "描述本鏡頭配樂的風格、情緒、樂器與節奏。",
    workflowMusicSource: "配樂來源", workflowMusicSourceNew: "生成新配樂", workflowBurnLyrics: "在影片中嵌入歌詞字幕",
    workflowMusicSourceMissing: "所選配樂歷史檔案已不存在", workflowMusicSourceNotFound: "找不到所選配樂歷史項目",
    workflowGlobalMusicPrompt: "整體配樂提示詞",
    workflowGlobalMusicPromptPlaceholder: "描述貫穿整部影片的配樂風格、情緒、樂器與節奏。",
    workflowAudioMix: "音軌策略", workflowScoreOnly: "僅使用配樂", workflowMixAudio: "配樂混合鏡頭原音",
    workflowSave: "儲存分鏡", workflowStart: "確認並開始", workflowResume: "恢復工作流程",
    workflowCancel: "取消工作流程", workflowSaved: "已儲存的工作流程", workflowRefresh: "重新整理", workflowNew: "新增",
    workflowSaving: "正在儲存…", workflowSaveError: "無法儲存工作流程", workflowActionError: "無法啟動或恢復工作流程", workflowStarting: "正在啟動…",
    workflowStatusQueued: "排隊中", workflowStatusRunning: "生成中", workflowStatusCompleted: "已完成",
    workflowStatusFailed: "失敗", workflowStatusCancelled: "已取消", workflowStatusInterrupted: "已中斷",
    workflowStatusDraft: "草稿", workflowNoItems: "尚無已儲存的工作流程。", workflowOutput: "下載成片",
    workflowShot: "鏡頭", workflowMusicSegment: "配樂片段", workflowMusicProgress: "配樂",
    workflowBusy: "工作流程執行期間無法啟動獨立生成。",
    workflowTooManyShots: "最多支援 1800 個鏡頭。", workflowFailed: "工作流程失敗：", workflowServerError: "無法讀取工作流程。"
  },
  fr: {
    modeWorkflow: "Long métrage", workflowKicker: "WORKFLOW VIDÉO LONGUE", workflowTitle: "Storyboard et génération",
    workflowDraft: "Non enregistré", workflowNote: "Enregistrez et vérifiez le storyboard avant de lancer la génération locale séquentielle. Les générations indépendantes sont suspendues pendant l’exécution.",
    workflowName: "Nom du projet", workflowShots: "Plans du storyboard", workflowAddShot: "Ajouter un plan", workflowRemoveShot: "Retirer",
    workflowExpandShot: "Développer le plan", workflowCollapseShot: "Réduire le plan",
    workflowShotTitle: "Titre du plan", workflowShotTitlePlaceholder: "Ex. : Train dans la brume matinale",
    workflowShotPrompt: "Prompt du plan", workflowShotPromptPlaceholder: "Décrivez le sujet, l’action, le lieu, la caméra et la lumière ; chaque plan dure 5 à 15 s.",
    workflowShotDuration: "Durée (5 à 15 s)", workflowSoundtrack: "Musique et mixage",
    workflowGenerateMusic: "Générer une musique distincte pour chaque plan", workflowMusicPrompt: "Musique de ce plan",
    workflowMusicPromptPlaceholder: "Décrivez le style, l’ambiance, les instruments et le tempo de ce plan.",
    workflowMusicSource: "Source de la bande-son", workflowMusicSourceNew: "Générer une nouvelle bande-son", workflowBurnLyrics: "Incruster les paroles en sous-titres",
    workflowMusicSourceMissing: "Le fichier musical sélectionné n’existe plus", workflowMusicSourceNotFound: "Élément musical introuvable dans l’historique",
    workflowGlobalMusicPrompt: "Prompt de la musique générale",
    workflowGlobalMusicPromptPlaceholder: "Décrivez le style, l’ambiance, les instruments et le tempo pour toute la vidéo.",
    workflowAudioMix: "Piste audio", workflowScoreOnly: "Musique seule", workflowMixAudio: "Mélanger musique et son des plans",
    workflowSave: "Enregistrer le storyboard", workflowStart: "Vérifier et démarrer", workflowResume: "Reprendre le workflow",
    workflowCancel: "Annuler le workflow", workflowSaved: "Workflows enregistrés", workflowRefresh: "Actualiser", workflowNew: "Nouveau",
    workflowSaving: "Enregistrement…", workflowSaveError: "Impossible d’enregistrer le workflow", workflowActionError: "Impossible de démarrer ou reprendre le workflow", workflowStarting: "Démarrage…",
    workflowStatusQueued: "En attente", workflowStatusRunning: "Génération", workflowStatusCompleted: "Terminé",
    workflowStatusFailed: "Échec", workflowStatusCancelled: "Annulé", workflowStatusInterrupted: "Interrompu",
    workflowStatusDraft: "Brouillon", workflowNoItems: "Aucun workflow enregistré.", workflowOutput: "Télécharger la vidéo finale",
    workflowShot: "Plan", workflowMusicSegment: "Segment musical", workflowMusicProgress: "Musique",
    workflowBusy: "La génération indépendante est indisponible pendant le workflow.",
    workflowTooManyShots: "1800 plans maximum.", workflowFailed: "Échec du workflow : ", workflowServerError: "Impossible de charger les workflows."
  },
  de: {
    modeWorkflow: "Langvideo", workflowKicker: "LANGVIDEO-WORKFLOW", workflowTitle: "Storyboard und Generierung",
    workflowDraft: "Nicht gespeichert", workflowNote: "Storyboard speichern und prüfen, bevor die lokale serielle Generierung startet. Währenddessen ist die Einzelgenerierung pausiert.",
    workflowName: "Projektname", workflowShots: "Storyboard-Aufnahmen", workflowAddShot: "Aufnahme hinzufügen", workflowRemoveShot: "Entfernen",
    workflowExpandShot: "Aufnahme erweitern", workflowCollapseShot: "Aufnahme einklappen",
    workflowShotTitle: "Aufnahmetitel", workflowShotTitlePlaceholder: "z. B. Zug im Morgennebel",
    workflowShotPrompt: "Prompt der Aufnahme", workflowShotPromptPlaceholder: "Motiv, Aktion, Ort, Kamera und Licht beschreiben; jede Aufnahme dauert 5–15 Sekunden.",
    workflowShotDuration: "Dauer (5–15 Sekunden)", workflowSoundtrack: "Musik und Mischung",
    workflowGenerateMusic: "Für jede Aufnahme eigene Musik erzeugen", workflowMusicPrompt: "Musik-Prompt für diese Aufnahme",
    workflowMusicPromptPlaceholder: "Beschreibe Stil, Stimmung, Instrumente und Tempo der Musik für diese Aufnahme.",
    workflowMusicSource: "Soundtrack-Quelle", workflowMusicSourceNew: "Neuen Soundtrack erzeugen", workflowBurnLyrics: "Liedtext als Untertitel einbrennen",
    workflowMusicSourceMissing: "Die gewählte Musikdatei existiert nicht mehr", workflowMusicSourceNotFound: "Der gewählte Musikverlaufseintrag wurde nicht gefunden",
    workflowGlobalMusicPrompt: "Prompt für die Gesamtmusik",
    workflowGlobalMusicPromptPlaceholder: "Beschreibe Stil, Stimmung, Instrumente und Tempo der Musik für das ganze Video.",
    workflowAudioMix: "Tonspur", workflowScoreOnly: "Nur Musik", workflowMixAudio: "Musik mit Originalton mischen",
    workflowSave: "Storyboard speichern", workflowStart: "Prüfen und starten", workflowResume: "Workflow fortsetzen",
    workflowCancel: "Workflow abbrechen", workflowSaved: "Gespeicherte Workflows", workflowRefresh: "Aktualisieren", workflowNew: "Neu",
    workflowSaving: "Wird gespeichert…", workflowSaveError: "Workflow konnte nicht gespeichert werden", workflowActionError: "Workflow konnte nicht gestartet oder fortgesetzt werden", workflowStarting: "Wird gestartet…",
    workflowStatusQueued: "Warteschlange", workflowStatusRunning: "Generierung", workflowStatusCompleted: "Abgeschlossen",
    workflowStatusFailed: "Fehlgeschlagen", workflowStatusCancelled: "Abgebrochen", workflowStatusInterrupted: "Unterbrochen",
    workflowStatusDraft: "Entwurf", workflowNoItems: "Noch keine gespeicherten Workflows.", workflowOutput: "Finales Video herunterladen",
    workflowShot: "Aufnahme", workflowMusicSegment: "Musikabschnitt", workflowMusicProgress: "Musik",
    workflowBusy: "Einzelgenerierung ist während des Workflows nicht verfügbar.",
    workflowTooManyShots: "Maximal 1800 Aufnahmen.", workflowFailed: "Workflow fehlgeschlagen: ", workflowServerError: "Workflows konnten nicht geladen werden."
  },
  ja: {
    modeWorkflow: "長編動画", workflowKicker: "長編動画ワークフロー", workflowTitle: "絵コンテと生成",
    workflowDraft: "未保存", workflowNote: "絵コンテを保存して確認してから、ローカルで順番に生成します。実行中は個別生成を一時停止します。",
    workflowName: "プロジェクト名", workflowShots: "絵コンテのショット", workflowAddShot: "ショットを追加", workflowRemoveShot: "削除",
    workflowExpandShot: "ショットを展開", workflowCollapseShot: "ショットを折りたたむ",
    workflowShotTitle: "ショット名", workflowShotTitlePlaceholder: "例：朝霧を抜ける列車",
    workflowShotPrompt: "ショットのプロンプト", workflowShotPromptPlaceholder: "被写体、動作、場所、カメラ、光を記述（各ショット5～15秒）。",
    workflowShotDuration: "長さ（5～15秒）", workflowSoundtrack: "音楽とミックス",
    workflowGenerateMusic: "ショットごとに個別の音楽を生成", workflowMusicPrompt: "このショットの音楽プロンプト",
    workflowMusicPromptPlaceholder: "このショットの音楽スタイル、雰囲気、楽器、テンポを説明してください。",
    workflowMusicSource: "サウンドトラックのソース", workflowMusicSourceNew: "新しいサウンドトラックを生成", workflowBurnLyrics: "歌詞を字幕として動画に焼き込む",
    workflowMusicSourceMissing: "選択した音楽履歴ファイルが存在しません", workflowMusicSourceNotFound: "選択した音楽履歴が見つかりません",
    workflowGlobalMusicPrompt: "全体の音楽プロンプト",
    workflowGlobalMusicPromptPlaceholder: "動画全体を通して流れる音楽のスタイル、雰囲気、楽器、テンポを説明してください。",
    workflowAudioMix: "音声トラック", workflowScoreOnly: "音楽のみ", workflowMixAudio: "音楽とショット音声をミックス",
    workflowSave: "絵コンテを保存", workflowStart: "確認して開始", workflowResume: "ワークフローを再開",
    workflowCancel: "ワークフローをキャンセル", workflowSaved: "保存済みワークフロー", workflowRefresh: "更新", workflowNew: "新規",
    workflowSaving: "保存中…", workflowSaveError: "保存できませんでした", workflowActionError: "開始または再開できませんでした", workflowStarting: "開始中…",
    workflowStatusQueued: "待機中", workflowStatusRunning: "生成中", workflowStatusCompleted: "完了",
    workflowStatusFailed: "失敗", workflowStatusCancelled: "キャンセル", workflowStatusInterrupted: "中断",
    workflowStatusDraft: "下書き", workflowNoItems: "保存済みのワークフローはありません。", workflowOutput: "完成動画をダウンロード",
    workflowShot: "ショット", workflowMusicSegment: "音楽セグメント", workflowMusicProgress: "音楽",
    workflowBusy: "ワークフロー実行中は個別生成できません。",
    workflowTooManyShots: "ショットは最大1800個です。", workflowFailed: "ワークフロー失敗：", workflowServerError: "読み込めませんでした。"
  },
  ko: {
    modeWorkflow: "장편 영상", workflowKicker: "장편 영상 워크플로", workflowTitle: "스토리보드 및 생성",
    workflowDraft: "저장 안 됨", workflowNote: "스토리보드를 저장하고 확인한 뒤 로컬 순차 생성을 시작하세요. 실행 중에는 개별 생성이 일시 중지됩니다.",
    workflowName: "프로젝트 이름", workflowShots: "스토리보드 샷", workflowAddShot: "샷 추가", workflowRemoveShot: "삭제",
    workflowExpandShot: "샷 펼치기", workflowCollapseShot: "샷 접기",
    workflowShotTitle: "샷 제목", workflowShotTitlePlaceholder: "예: 아침 안개 속 열차",
    workflowShotPrompt: "샷 프롬프트", workflowShotPromptPlaceholder: "피사체, 동작, 장소, 카메라, 조명을 설명하세요(각 5~15초).",
    workflowShotDuration: "길이(5~15초)", workflowSoundtrack: "음악 및 믹스",
    workflowGenerateMusic: "샷마다 개별 음악 생성", workflowMusicPrompt: "이 샷의 음악 프롬프트",
    workflowMusicPromptPlaceholder: "이 샷의 음악 스타일, 분위기, 악기와 템포를 설명하세요.",
    workflowMusicSource: "사운드트랙 소스", workflowMusicSourceNew: "새 사운드트랙 생성", workflowBurnLyrics: "가사를 자막으로 영상에 삽입",
    workflowMusicSourceMissing: "선택한 음악 기록 파일이 더 이상 없습니다", workflowMusicSourceNotFound: "선택한 음악 기록을 찾을 수 없습니다",
    workflowGlobalMusicPrompt: "전체 배경 음악 프롬프트",
    workflowGlobalMusicPromptPlaceholder: "전체 영상에 이어질 음악의 스타일, 분위기, 악기와 템포를 설명하세요.",
    workflowAudioMix: "오디오 트랙", workflowScoreOnly: "음악만 사용", workflowMixAudio: "음악과 샷 오디오 믹스",
    workflowSave: "스토리보드 저장", workflowStart: "확인 후 시작", workflowResume: "워크플로 재개",
    workflowCancel: "워크플로 취소", workflowSaved: "저장된 워크플로", workflowRefresh: "새로고침", workflowNew: "새로 만들기",
    workflowSaving: "저장 중…", workflowSaveError: "워크플로를 저장할 수 없습니다", workflowActionError: "워크플로를 시작하거나 재개할 수 없습니다", workflowStarting: "시작 중…",
    workflowStatusQueued: "대기 중", workflowStatusRunning: "생성 중", workflowStatusCompleted: "완료",
    workflowStatusFailed: "실패", workflowStatusCancelled: "취소됨", workflowStatusInterrupted: "중단됨",
    workflowStatusDraft: "초안", workflowNoItems: "저장된 워크플로가 없습니다.", workflowOutput: "최종 영상 다운로드",
    workflowShot: "샷", workflowMusicSegment: "음악 구간", workflowMusicProgress: "음악",
    workflowBusy: "워크플로 실행 중에는 개별 생성을 사용할 수 없습니다.",
    workflowTooManyShots: "샷은 최대 1800개까지 가능합니다.", workflowFailed: "워크플로 실패: ", workflowServerError: "워크플로를 불러올 수 없습니다."
  },
  es: {
    modeWorkflow: "Vídeo largo", workflowKicker: "FLUJO DE VÍDEO LARGO", workflowTitle: "Storyboard y generación",
    workflowDraft: "Sin guardar", workflowNote: "Guarda y revisa el storyboard antes de iniciar la generación local secuencial. La generación independiente se pausa mientras se ejecuta.",
    workflowName: "Nombre del proyecto", workflowShots: "Planos del storyboard", workflowAddShot: "Añadir plano", workflowRemoveShot: "Quitar",
    workflowExpandShot: "Expandir plano", workflowCollapseShot: "Contraer plano",
    workflowShotTitle: "Título del plano", workflowShotTitlePlaceholder: "Ej.: Tren entre la niebla matinal",
    workflowShotPrompt: "Prompt del plano", workflowShotPromptPlaceholder: "Describe sujeto, acción, lugar, cámara e iluminación; cada plano dura 5–15 s.",
    workflowShotDuration: "Duración (5–15 s)", workflowSoundtrack: "Música y mezcla",
    workflowGenerateMusic: "Generar música independiente para cada plano", workflowMusicPrompt: "Música de este plano",
    workflowMusicPromptPlaceholder: "Describe el estilo, el ambiente, los instrumentos y el tempo de este plano.",
    workflowMusicSource: "Origen de la banda sonora", workflowMusicSourceNew: "Generar nueva banda sonora", workflowBurnLyrics: "Incrustar la letra como subtítulos",
    workflowMusicSourceMissing: "El archivo de música seleccionado ya no existe", workflowMusicSourceNotFound: "No se encontró el elemento de música seleccionado",
    workflowGlobalMusicPrompt: "Prompt de música general",
    workflowGlobalMusicPromptPlaceholder: "Describe el estilo, el ambiente, los instrumentos y el tempo de la música para todo el vídeo.",
    workflowAudioMix: "Pista de audio", workflowScoreOnly: "Solo música", workflowMixAudio: "Mezclar música con audio de los planos",
    workflowSave: "Guardar storyboard", workflowStart: "Revisar e iniciar", workflowResume: "Reanudar flujo",
    workflowCancel: "Cancelar flujo", workflowSaved: "Flujos guardados", workflowRefresh: "Actualizar", workflowNew: "Nuevo",
    workflowSaving: "Guardando…", workflowSaveError: "No se pudo guardar el flujo", workflowActionError: "No se pudo iniciar o reanudar el flujo", workflowStarting: "Iniciando…",
    workflowStatusQueued: "En cola", workflowStatusRunning: "Generando", workflowStatusCompleted: "Completado",
    workflowStatusFailed: "Error", workflowStatusCancelled: "Cancelado", workflowStatusInterrupted: "Interrumpido",
    workflowStatusDraft: "Borrador", workflowNoItems: "Aún no hay flujos guardados.", workflowOutput: "Descargar vídeo final",
    workflowShot: "Plano", workflowMusicSegment: "Segmento musical", workflowMusicProgress: "Música",
    workflowBusy: "La generación independiente no está disponible durante el flujo.",
    workflowTooManyShots: "Se permiten hasta 1800 planos.", workflowFailed: "Error en el flujo: ", workflowServerError: "No se pudieron cargar los flujos."
  },
  pt: {
    modeWorkflow: "Vídeo longo", workflowKicker: "FLUXO DE VÍDEO LONGO", workflowTitle: "Storyboard e geração",
    workflowDraft: "Não salvo", workflowNote: "Salve e revise o storyboard antes de iniciar a geração local em série. A geração independente fica pausada durante a execução.",
    workflowName: "Nome do projeto", workflowShots: "Cenas do storyboard", workflowAddShot: "Adicionar cena", workflowRemoveShot: "Remover",
    workflowExpandShot: "Expandir cena", workflowCollapseShot: "Recolher cena",
    workflowShotTitle: "Título da cena", workflowShotTitlePlaceholder: "Ex.: Trem na neblina da manhã",
    workflowShotPrompt: "Prompt da cena", workflowShotPromptPlaceholder: "Descreva assunto, ação, local, câmera e luz; cada cena dura 5–15 s.",
    workflowShotDuration: "Duração (5–15 s)", workflowSoundtrack: "Trilha e mixagem",
    workflowGenerateMusic: "Gerar música independente para cada cena", workflowMusicPrompt: "Música desta cena",
    workflowMusicPromptPlaceholder: "Descreva o estilo, o clima, os instrumentos e o ritmo desta cena.",
    workflowMusicSource: "Origem da trilha sonora", workflowMusicSourceNew: "Gerar nova trilha sonora", workflowBurnLyrics: "Incorporar a letra como legendas",
    workflowMusicSourceMissing: "O arquivo de música selecionado não existe mais", workflowMusicSourceNotFound: "O item de música selecionado não foi encontrado",
    workflowGlobalMusicPrompt: "Prompt da trilha sonora geral",
    workflowGlobalMusicPromptPlaceholder: "Descreva o estilo, o clima, os instrumentos e o ritmo da música para todo o vídeo.",
    workflowAudioMix: "Faixa de áudio", workflowScoreOnly: "Somente trilha", workflowMixAudio: "Misturar trilha com áudio das cenas",
    workflowSave: "Salvar storyboard", workflowStart: "Revisar e iniciar", workflowResume: "Retomar fluxo",
    workflowCancel: "Cancelar fluxo", workflowSaved: "Fluxos salvos", workflowRefresh: "Atualizar", workflowNew: "Novo",
    workflowSaving: "Salvando…", workflowSaveError: "Não foi possível salvar o fluxo", workflowActionError: "Não foi possível iniciar ou retomar o fluxo", workflowStarting: "Iniciando…",
    workflowStatusQueued: "Na fila", workflowStatusRunning: "Gerando", workflowStatusCompleted: "Concluído",
    workflowStatusFailed: "Falhou", workflowStatusCancelled: "Cancelado", workflowStatusInterrupted: "Interrompido",
    workflowStatusDraft: "Rascunho", workflowNoItems: "Ainda não há fluxos salvos.", workflowOutput: "Baixar vídeo final",
    workflowShot: "Cena", workflowMusicSegment: "Trecho musical", workflowMusicProgress: "Música",
    workflowBusy: "A geração independente fica indisponível durante o fluxo.",
    workflowTooManyShots: "São permitidas até 1800 cenas.", workflowFailed: "Falha no fluxo: ", workflowServerError: "Não foi possível carregar os fluxos."
  },
  tr: {
    modeWorkflow: "Uzun video", workflowKicker: "UZUN VİDEO İŞ AKIŞI", workflowTitle: "Storyboard ve üretim",
    workflowDraft: "Kaydedilmedi", workflowNote: "Yerel sıralı üretimi başlatmadan önce storyboard'u kaydedip gözden geçirin. Çalışırken bağımsız üretim duraklatılır.",
    workflowName: "Proje adı", workflowShots: "Storyboard sahneleri", workflowAddShot: "Sahne ekle", workflowRemoveShot: "Kaldır",
    workflowExpandShot: "Sahneyi genişlet", workflowCollapseShot: "Sahneyi daralt",
    workflowShotTitle: "Sahne başlığı", workflowShotTitlePlaceholder: "Örn. sabah sisinde tren",
    workflowShotPrompt: "Sahne istemi", workflowShotPromptPlaceholder: "Konu, eylem, mekân, kamera ve ışığı açıklayın; her sahne 5–15 saniyedir.",
    workflowShotDuration: "Süre (5–15 saniye)", workflowSoundtrack: "Müzik ve miks",
    workflowGenerateMusic: "Her sahne için ayrı müzik üret", workflowMusicPrompt: "Bu sahnenin müzik istemi",
    workflowMusicPromptPlaceholder: "Bu sahnenin müzik tarzını, havasını, enstrümanlarını ve temposunu açıklayın.",
    workflowMusicSource: "Film müziği kaynağı", workflowMusicSourceNew: "Yeni film müziği oluştur", workflowBurnLyrics: "Şarkı sözlerini altyazı olarak videoya göm",
    workflowMusicSourceMissing: "Seçilen müzik geçmişi dosyası artık yok", workflowMusicSourceNotFound: "Seçilen müzik geçmişi öğesi bulunamadı",
    workflowGlobalMusicPrompt: "Genel müzik istemi",
    workflowGlobalMusicPromptPlaceholder: "Tüm video boyunca çalacak müziğin tarzını, havasını, enstrümanlarını ve temposunu açıklayın.",
    workflowAudioMix: "Ses kanalı", workflowScoreOnly: "Yalnızca müzik", workflowMixAudio: "Müziği sahne sesiyle karıştır",
    workflowSave: "Storyboard'u kaydet", workflowStart: "İncele ve başlat", workflowResume: "İş akışını sürdür",
    workflowCancel: "İş akışını iptal et", workflowSaved: "Kaydedilen iş akışları", workflowRefresh: "Yenile", workflowNew: "Yeni",
    workflowSaving: "Kaydediliyor…", workflowSaveError: "İş akışı kaydedilemedi", workflowActionError: "İş akışı başlatılamadı veya sürdürülemedi", workflowStarting: "Başlatılıyor…",
    workflowStatusQueued: "Sırada", workflowStatusRunning: "Üretiliyor", workflowStatusCompleted: "Tamamlandı",
    workflowStatusFailed: "Başarısız", workflowStatusCancelled: "İptal edildi", workflowStatusInterrupted: "Kesintiye uğradı",
    workflowStatusDraft: "Taslak", workflowNoItems: "Henüz kaydedilmiş iş akışı yok.", workflowOutput: "Son videoyu indir",
    workflowShot: "Sahne", workflowMusicSegment: "Müzik bölümü", workflowMusicProgress: "Müzik",
    workflowBusy: "İş akışı çalışırken bağımsız üretim kullanılamaz.",
    workflowTooManyShots: "En fazla 1800 sahne desteklenir.", workflowFailed: "İş akışı başarısız: ", workflowServerError: "İş akışları yüklenemedi."
  },
  ar: {
    modeWorkflow: "فيديو طويل", workflowKicker: "سير عمل الفيديو الطويل", workflowTitle: "لوحة المشاهد والتوليد",
    workflowDraft: "غير محفوظ", workflowNote: "احفظ لوحة المشاهد وراجعها قبل بدء التوليد المحلي المتسلسل. يتوقف التوليد المستقل مؤقتًا أثناء التشغيل.",
    workflowName: "اسم المشروع", workflowShots: "لقطات لوحة المشاهد", workflowAddShot: "إضافة لقطة", workflowRemoveShot: "إزالة",
    workflowExpandShot: "توسيع اللقطة", workflowCollapseShot: "طيّ اللقطة",
    workflowShotTitle: "عنوان اللقطة", workflowShotTitlePlaceholder: "مثال: قطار وسط ضباب الصباح",
    workflowShotPrompt: "وصف اللقطة", workflowShotPromptPlaceholder: "صف الموضوع والحركة والمكان والكاميرا والإضاءة؛ مدة كل لقطة 5–15 ثانية.",
    workflowShotDuration: "المدة (5–15 ثانية)", workflowSoundtrack: "الموسيقى والمزج",
    workflowGenerateMusic: "إنشاء موسيقى مستقلة لكل لقطة", workflowMusicPrompt: "وصف موسيقى هذه اللقطة",
    workflowMusicPromptPlaceholder: "صف أسلوب الموسيقى والمزاج والآلات والإيقاع لهذه اللقطة.",
    workflowMusicSource: "مصدر الموسيقى التصويرية", workflowMusicSourceNew: "إنشاء موسيقى تصويرية جديدة", workflowBurnLyrics: "تضمين كلمات الأغنية كترجمة في الفيديو",
    workflowMusicSourceMissing: "ملف الموسيقى المحدد لم يعد موجودًا", workflowMusicSourceNotFound: "تعذر العثور على عنصر الموسيقى المحدد",
    workflowGlobalMusicPrompt: "وصف الموسيقى العامة",
    workflowGlobalMusicPromptPlaceholder: "صف أسلوب الموسيقى ومزاجها وآلاتها وإيقاعها للفيديو بأكمله.",
    workflowAudioMix: "مسار الصوت", workflowScoreOnly: "الموسيقى فقط", workflowMixAudio: "مزج الموسيقى مع صوت اللقطات",
    workflowSave: "حفظ لوحة المشاهد", workflowStart: "مراجعة وبدء", workflowResume: "استئناف سير العمل",
    workflowCancel: "إلغاء سير العمل", workflowSaved: "مسارات العمل المحفوظة", workflowRefresh: "تحديث", workflowNew: "جديد",
    workflowSaving: "جارٍ الحفظ…", workflowSaveError: "تعذر حفظ سير العمل", workflowActionError: "تعذر بدء سير العمل أو استئنافه", workflowStarting: "جارٍ البدء…",
    workflowStatusQueued: "في قائمة الانتظار", workflowStatusRunning: "جارٍ التوليد", workflowStatusCompleted: "مكتمل",
    workflowStatusFailed: "فشل", workflowStatusCancelled: "أُلغي", workflowStatusInterrupted: "متوقف",
    workflowStatusDraft: "مسودة", workflowNoItems: "لا توجد مسارات عمل محفوظة بعد.", workflowOutput: "تنزيل الفيديو النهائي",
    workflowShot: "لقطة", workflowMusicSegment: "مقطع موسيقي", workflowMusicProgress: "الموسيقى",
    workflowBusy: "لا يتوفر التوليد المستقل أثناء سير العمل.",
    workflowTooManyShots: "الحد الأقصى 1800 لقطة.", workflowFailed: "فشل سير العمل: ", workflowServerError: "تعذر تحميل مسارات العمل."
  },
  vi: {
    modeWorkflow: "Video dài", workflowKicker: "QUY TRÌNH VIDEO DÀI", workflowTitle: "Storyboard và tạo video",
    workflowDraft: "Chưa lưu", workflowNote: "Lưu và xem lại storyboard trước khi chạy tạo tuần tự trên máy. Tạo độc lập sẽ tạm dừng khi quy trình chạy.",
    workflowName: "Tên dự án", workflowShots: "Cảnh storyboard", workflowAddShot: "Thêm cảnh", workflowRemoveShot: "Xóa",
    workflowExpandShot: "Mở rộng cảnh", workflowCollapseShot: "Thu gọn cảnh",
    workflowShotTitle: "Tiêu đề cảnh", workflowShotTitlePlaceholder: "Ví dụ: Tàu xuyên màn sương sớm",
    workflowShotPrompt: "Prompt cảnh", workflowShotPromptPlaceholder: "Mô tả chủ thể, hành động, địa điểm, máy quay và ánh sáng; mỗi cảnh dài 5–15 giây.",
    workflowShotDuration: "Thời lượng (5–15 giây)", workflowSoundtrack: "Nhạc nền và phối âm",
    workflowGenerateMusic: "Tạo nhạc riêng cho từng cảnh", workflowMusicPrompt: "Prompt nhạc cho cảnh này",
    workflowMusicPromptPlaceholder: "Mô tả phong cách, cảm xúc, nhạc cụ và nhịp độ nhạc cho cảnh này.",
    workflowMusicSource: "Nguồn nhạc nền", workflowMusicSourceNew: "Tạo nhạc nền mới", workflowBurnLyrics: "Chèn lời bài hát làm phụ đề vào video",
    workflowMusicSourceMissing: "Tệp nhạc đã chọn không còn tồn tại", workflowMusicSourceNotFound: "Không tìm thấy mục nhạc đã chọn",
    workflowGlobalMusicPrompt: "Prompt nhạc nền tổng thể",
    workflowGlobalMusicPromptPlaceholder: "Mô tả phong cách, cảm xúc, nhạc cụ và nhịp độ cho nhạc nền xuyên suốt video.",
    workflowAudioMix: "Chiến lược âm thanh", workflowScoreOnly: "Chỉ nhạc nền", workflowMixAudio: "Trộn nhạc với âm thanh cảnh",
    workflowSave: "Lưu storyboard", workflowStart: "Xem lại và bắt đầu", workflowResume: "Tiếp tục quy trình",
    workflowCancel: "Hủy quy trình", workflowSaved: "Quy trình đã lưu", workflowRefresh: "Làm mới", workflowNew: "Mới",
    workflowSaving: "Đang lưu…", workflowSaveError: "Không thể lưu quy trình", workflowActionError: "Không thể bắt đầu hoặc tiếp tục quy trình", workflowStarting: "Đang bắt đầu…",
    workflowStatusQueued: "Đang chờ", workflowStatusRunning: "Đang tạo", workflowStatusCompleted: "Hoàn tất",
    workflowStatusFailed: "Thất bại", workflowStatusCancelled: "Đã hủy", workflowStatusInterrupted: "Bị gián đoạn",
    workflowStatusDraft: "Bản nháp", workflowNoItems: "Chưa có quy trình nào được lưu.", workflowOutput: "Tải video cuối",
    workflowShot: "Cảnh", workflowMusicSegment: "Đoạn nhạc", workflowMusicProgress: "Nhạc",
    workflowBusy: "Không thể tạo độc lập khi quy trình đang chạy.",
    workflowTooManyShots: "Tối đa 1800 cảnh.", workflowFailed: "Quy trình thất bại: ", workflowServerError: "Không thể tải quy trình."
  },
  id: {
    modeWorkflow: "Video panjang", workflowKicker: "ALUR KERJA VIDEO PANJANG", workflowTitle: "Storyboard dan generasi",
    workflowDraft: "Belum disimpan", workflowNote: "Simpan dan tinjau storyboard sebelum memulai generasi lokal berurutan. Generasi mandiri dijeda saat alur berjalan.",
    workflowName: "Nama proyek", workflowShots: "Adegan storyboard", workflowAddShot: "Tambah adegan", workflowRemoveShot: "Hapus",
    workflowExpandShot: "Perluas adegan", workflowCollapseShot: "Ciutkan adegan",
    workflowShotTitle: "Judul adegan", workflowShotTitlePlaceholder: "Contoh: Kereta menembus kabut pagi",
    workflowShotPrompt: "Prompt adegan", workflowShotPromptPlaceholder: "Jelaskan subjek, aksi, lokasi, kamera, dan cahaya; tiap adegan 5–15 detik.",
    workflowShotDuration: "Durasi (5–15 detik)", workflowSoundtrack: "Musik dan pencampuran",
    workflowGenerateMusic: "Buat musik terpisah untuk setiap adegan", workflowMusicPrompt: "Prompt musik adegan ini",
    workflowMusicPromptPlaceholder: "Jelaskan gaya, suasana, instrumen, dan tempo musik untuk adegan ini.",
    workflowMusicSource: "Sumber soundtrack", workflowMusicSourceNew: "Buat soundtrack baru", workflowBurnLyrics: "Sematkan lirik sebagai subtitle di video",
    workflowMusicSourceMissing: "File musik yang dipilih sudah tidak ada", workflowMusicSourceNotFound: "Item musik yang dipilih tidak ditemukan",
    workflowGlobalMusicPrompt: "Prompt musik keseluruhan",
    workflowGlobalMusicPromptPlaceholder: "Jelaskan gaya, suasana, instrumen, dan tempo musik yang mengiringi seluruh video.",
    workflowAudioMix: "Strategi audio", workflowScoreOnly: "Musik saja", workflowMixAudio: "Campur musik dengan audio adegan",
    workflowSave: "Simpan storyboard", workflowStart: "Tinjau & mulai", workflowResume: "Lanjutkan alur",
    workflowCancel: "Batalkan alur", workflowSaved: "Alur tersimpan", workflowRefresh: "Segarkan", workflowNew: "Baru",
    workflowSaving: "Menyimpan…", workflowSaveError: "Alur tidak dapat disimpan", workflowActionError: "Alur tidak dapat dimulai atau dilanjutkan", workflowStarting: "Memulai…",
    workflowStatusQueued: "Dalam antrean", workflowStatusRunning: "Membuat", workflowStatusCompleted: "Selesai",
    workflowStatusFailed: "Gagal", workflowStatusCancelled: "Dibatalkan", workflowStatusInterrupted: "Terputus",
    workflowStatusDraft: "Draf", workflowNoItems: "Belum ada alur yang disimpan.", workflowOutput: "Unduh video akhir",
    workflowShot: "Adegan", workflowMusicSegment: "Segmen musik", workflowMusicProgress: "Musik",
    workflowBusy: "Generasi mandiri tidak tersedia saat alur berjalan.",
    workflowTooManyShots: "Maksimal 1800 adegan.", workflowFailed: "Alur gagal: ", workflowServerError: "Alur tidak dapat dimuat."
  },
  ru: {
    modeWorkflow: "Длинное видео", workflowKicker: "РАБОЧИЙ ПРОЦЕСС ДЛИННОГО ВИДЕО", workflowTitle: "Раскадровка и генерация",
    workflowDraft: "Не сохранено", workflowNote: "Сохраните и проверьте раскадровку до последовательной локальной генерации. Во время работы отдельная генерация приостанавливается.",
    workflowName: "Название проекта", workflowShots: "Кадры раскадровки", workflowAddShot: "Добавить кадр", workflowRemoveShot: "Удалить",
    workflowExpandShot: "Развернуть кадр", workflowCollapseShot: "Свернуть кадр",
    workflowShotTitle: "Название кадра", workflowShotTitlePlaceholder: "Например: поезд в утреннем тумане",
    workflowShotPrompt: "Промпт кадра", workflowShotPromptPlaceholder: "Опишите объект, действие, место, камеру и свет; длительность кадра — 5–15 секунд.",
    workflowShotDuration: "Длительность (5–15 секунд)", workflowSoundtrack: "Музыка и микширование",
    workflowGenerateMusic: "Создавать отдельную музыку для каждого кадра", workflowMusicPrompt: "Промпт музыки для этого кадра",
    workflowMusicPromptPlaceholder: "Опишите стиль, настроение, инструменты и темп музыки для этого кадра.",
    workflowMusicSource: "Источник саундтрека", workflowMusicSourceNew: "Создать новый саундтрек", workflowBurnLyrics: "Встроить текст песни в видео как субтитры",
    workflowMusicSourceMissing: "Выбранный музыкальный файл больше не существует", workflowMusicSourceNotFound: "Выбранный элемент музыки не найден",
    workflowGlobalMusicPrompt: "Промпт общей музыки",
    workflowGlobalMusicPromptPlaceholder: "Опишите стиль, настроение, инструменты и темп музыки для всего видео.",
    workflowAudioMix: "Аудиодорожка", workflowScoreOnly: "Только музыка", workflowMixAudio: "Смешать музыку со звуком кадров",
    workflowSave: "Сохранить раскадровку", workflowStart: "Проверить и начать", workflowResume: "Возобновить процесс",
    workflowCancel: "Отменить процесс", workflowSaved: "Сохранённые процессы", workflowRefresh: "Обновить", workflowNew: "Создать",
    workflowSaving: "Сохранение…", workflowSaveError: "Не удалось сохранить процесс", workflowActionError: "Не удалось запустить или возобновить процесс", workflowStarting: "Запуск…",
    workflowStatusQueued: "В очереди", workflowStatusRunning: "Генерация", workflowStatusCompleted: "Завершено",
    workflowStatusFailed: "Ошибка", workflowStatusCancelled: "Отменено", workflowStatusInterrupted: "Прервано",
    workflowStatusDraft: "Черновик", workflowNoItems: "Сохранённых процессов пока нет.", workflowOutput: "Скачать итоговое видео",
    workflowShot: "Кадр", workflowMusicSegment: "Музыкальный фрагмент", workflowMusicProgress: "Музыка",
    workflowBusy: "Отдельная генерация недоступна во время рабочего процесса.",
    workflowTooManyShots: "Максимум 1800 кадров.", workflowFailed: "Ошибка процесса: ", workflowServerError: "Не удалось загрузить процессы."
  }
};

for (const [language, [up, down]] of Object.entries({
  "zh-CN": ["上移分镜", "下移分镜"], "zh-TW": ["上移分鏡", "下移分鏡"],
  en: ["Move shot up", "Move shot down"], fr: ["Monter le plan", "Descendre le plan"],
  de: ["Aufnahme nach oben", "Aufnahme nach unten"], ja: ["ショットを上へ", "ショットを下へ"],
  ko: ["샷 위로 이동", "샷 아래로 이동"], es: ["Subir plano", "Bajar plano"],
  pt: ["Mover cena para cima", "Mover cena para baixo"],
  tr: ["Sahneyi yukarı taşı", "Sahneyi aşağı taşı"],
  ar: ["نقل اللقطة لأعلى", "نقل اللقطة لأسفل"], vi: ["Chuyển cảnh lên", "Chuyển cảnh xuống"],
  id: ["Pindahkan adegan ke atas", "Pindahkan adegan ke bawah"],
  ru: ["Переместить кадр вверх", "Переместить кадр вниз"]
})) {
  Object.assign(workflowTranslations[language], {workflowMoveUp: up, workflowMoveDown: down});
}

const workflowStageKeys = ["workflowVideos", "workflowAssemble", "workflowPostScore",
  "workflowGenerateShot", "workflowRegenerateShot", "workflowStagesHint", "workflowNeedShots",
  "workflowNeedAssembly", "workflowNeedGlobal", "workflowAuto"];
for (const [lang, values] of Object.entries({
  "zh-CN": ["仅生成分镜视频", "合并分镜视频", "添加全局配乐", "生成此镜头", "重新生成此镜头", "生成并预览分镜，编辑后单镜重生成，再合成和全局配乐；全自动仍可用。", "请先生成所有分镜视频。", "请先合并分镜视频。", "请关闭逐镜配乐，选择全局配乐。", "全自动：视频、配乐、合成"],
  "zh-TW": ["僅生成分鏡影片", "合併分鏡影片", "加入全局配樂", "生成此鏡頭", "重新生成此鏡頭", "生成並預覽分鏡，編輯後單鏡重生成，再合成和全局配樂；全自動仍可用。", "請先生成所有分鏡影片。", "請先合併分鏡影片。", "請關閉逐鏡配樂，選擇全局配樂。", "全自動：影片、配樂、合成"],
  en: ["Generate shots only", "Assemble shots", "Add global soundtrack", "Generate this shot", "Regenerate this shot", "Preview shots, edit and regenerate individually, then assemble and score. Full automation remains available.", "Generate all shots first.", "Assemble shots first.", "Disable per-shot music and select a global soundtrack.", "Automatic: video, music & assembly"],
  fr: ["Générer les plans seuls", "Assembler les plans", "Ajouter la musique globale", "Générer ce plan", "Régénérer ce plan", "Prévisualisez et modifiez les plans, puis assemblez et ajoutez la musique. Le mode automatique reste disponible.", "Générez tous les plans.", "Assemblez les plans d’abord.", "Désactivez la musique par plan et choisissez la musique globale.", "Automatique : vidéo, musique et montage"],
  de: ["Nur Aufnahmen erzeugen", "Aufnahmen zusammenfügen", "Globale Musik hinzufügen", "Diese Aufnahme erzeugen", "Diese Aufnahme neu erzeugen", "Aufnahmen prüfen, bearbeiten und einzeln neu erzeugen, dann zusammenfügen und vertonen. Automatik bleibt verfügbar.", "Zuerst alle Aufnahmen erzeugen.", "Zuerst Aufnahmen zusammenfügen.", "Musik pro Aufnahme deaktivieren und globale Musik wählen.", "Automatisch: Video, Musik und Montage"],
  ja: ["ショットのみ生成", "ショットを結合", "全体の音楽を追加", "このショットを生成", "このショットを再生成", "ショットを確認・編集・再生成し、結合して音楽を追加。全自動も利用できます。", "先に全ショットを生成してください。", "先にショットを結合してください。", "ショット別の音楽をオフにして全体の音楽を選択してください。", "全自動：動画・音楽・結合"],
  ko: ["샷 영상만 생성", "샷 영상 합치기", "전체 음악 추가", "이 샷 생성", "이 샷 다시 생성", "샷을 미리 보고 편집·재생성한 뒤 합치고 음악을 추가하세요. 전체 자동도 지원합니다.", "먼저 모든 샷을 생성하세요.", "먼저 샷을 합치세요.", "샷별 음악을 끄고 전체 음악을 선택하세요.", "전체 자동: 영상·음악·합성"],
  es: ["Generar solo planos", "Combinar planos", "Añadir música global", "Generar este plano", "Regenerar este plano", "Revisa, edita y regenera cada plano; después combina y añade música. El modo automático sigue disponible.", "Genera todos los planos primero.", "Combina los planos primero.", "Desactiva la música por plano y elige música global.", "Automático: vídeo, música y montaje"],
  pt: ["Gerar apenas cenas", "Combinar cenas", "Adicionar música global", "Gerar esta cena", "Gerar esta cena novamente", "Veja, edite e gere cada cena novamente; depois combine e adicione música. O modo automático continua disponível.", "Gere todas as cenas primeiro.", "Combine as cenas primeiro.", "Desative a música por cena e escolha música global.", "Automático: vídeo, música e montagem"],
  tr: ["Yalnızca sahneleri üret", "Sahneleri birleştir", "Genel müzik ekle", "Bu sahneyi üret", "Bu sahneyi yeniden üret", "Sahneleri önizleyin, düzenleyip yeniden üretin; sonra birleştirip müzik ekleyin. Otomatik mod korunur.", "Önce tüm sahneleri üretin.", "Önce sahneleri birleştirin.", "Sahne müziğini kapatıp genel müzik seçin.", "Otomatik: video, müzik ve birleştirme"],
  ar: ["توليد اللقطات فقط", "دمج اللقطات", "إضافة موسيقى عامة", "توليد هذه اللقطة", "إعادة توليد هذه اللقطة", "عاين اللقطات وعدّلها وأعد توليدها منفردة، ثم ادمجها وأضف الموسيقى. يبقى الوضع التلقائي متاحاً.", "ولّد كل اللقطات أولاً.", "ادمج اللقطات أولاً.", "أوقف موسيقى كل لقطة واختر الموسيقى العامة.", "تلقائي: الفيديو والموسيقى والدمج"],
  vi: ["Chỉ tạo video từng cảnh", "Ghép các cảnh", "Thêm nhạc toàn bộ", "Tạo cảnh này", "Tạo lại cảnh này", "Xem trước, chỉnh sửa và tạo lại từng cảnh, rồi ghép và thêm nhạc. Vẫn có chế độ tự động.", "Hãy tạo tất cả cảnh trước.", "Hãy ghép các cảnh trước.", "Tắt nhạc từng cảnh và chọn nhạc toàn bộ.", "Tự động: video, nhạc và ghép"],
  id: ["Buat video adegan saja", "Gabungkan adegan", "Tambah musik global", "Buat adegan ini", "Buat ulang adegan ini", "Pratinjau, edit dan buat ulang tiap adegan, lalu gabungkan dan tambah musik. Mode otomatis tetap tersedia.", "Buat semua adegan terlebih dahulu.", "Gabungkan adegan terlebih dahulu.", "Matikan musik per adegan dan pilih musik global.", "Otomatis: video, musik dan penggabungan"],
  ru: ["Создать только кадры", "Объединить кадры", "Добавить общую музыку", "Создать этот кадр", "Пересоздать этот кадр", "Проверьте, измените и пересоздайте кадры, затем объедините и добавьте музыку. Автоматический режим сохранён.", "Сначала создайте все кадры.", "Сначала объедините кадры.", "Отключите музыку по кадрам и выберите общую музыку.", "Автоматически: видео, музыка и монтаж"]
})) {
  workflowStageKeys.forEach((key, index) => {workflowTranslations[lang][key] = values[index];});
}

const workflowModeKeys = ["workflowShotMode", "workflowIndependent", "workflowContinuous",
  "workflowModeHint"];
const workflowModeTranslations = {
  "zh-CN": ["镜头生成模式", "独立镜头（推荐）", "连续镜头（尾帧衔接）", "独立镜头使用各自首帧，不继承上一镜尾帧；连续模式保留旧行为。"],
  "zh-TW": ["鏡頭生成模式", "獨立鏡頭（推薦）", "連續鏡頭（尾幀銜接）", "獨立鏡頭使用各自首幀，不繼承上一鏡尾幀；連續模式保留舊行為。"],
  en: ["Shot generation mode", "Independent shots (recommended)", "Continuous shots (tail-frame chaining)", "Independent shots use their own opening images, not the previous tail frame. Continuous mode preserves legacy behavior."],
  fr: ["Mode des plans", "Plans indépendants (recommandé)", "Plans continus (image finale)", "Chaque plan utilise sa propre image initiale. Le mode continu conserve le comportement précédent."],
  de: ["Aufnahmemodus", "Unabhängige Aufnahmen (empfohlen)", "Fortlaufend (letztes Bild)", "Unabhängige Aufnahmen nutzen eigene Startbilder. Fortlaufend erhält das bisherige Verhalten."],
  ja: ["ショット生成モード", "独立ショット（推奨）", "連続ショット（末尾フレーム）", "独立ショットは各自の開始画像を使用します。連続モードは従来の動作を保持します。"],
  ko: ["샷 생성 모드", "독립 샷 (권장)", "연속 샷 (마지막 프레임)", "독립 샷은 자체 시작 이미지를 사용합니다. 연속 모드는 기존 동작을 유지합니다."],
  es: ["Modo de tomas", "Tomas independientes (recomendado)", "Tomas continuas (último fotograma)", "Las tomas independientes usan sus propias imágenes iniciales. El modo continuo mantiene el comportamiento anterior."],
  pt: ["Modo de cenas", "Cenas independentes (recomendado)", "Cenas contínuas (quadro final)", "Cenas independentes usam suas próprias imagens iniciais. O modo contínuo mantém o comportamento anterior."],
  tr: ["Çekim modu", "Bağımsız çekimler (önerilen)", "Sürekli çekimler (son kare)", "Bağımsız çekimler kendi başlangıç görüntülerini kullanır. Sürekli mod eski davranışı korur."],
  ar: ["وضع اللقطات", "لقطات مستقلة (موصى به)", "لقطات متصلة (الإطار الأخير)", "تستخدم اللقطات المستقلة صور البداية الخاصة بها. يحافظ الوضع المتصل على السلوك السابق."],
  vi: ["Chế độ cảnh", "Cảnh độc lập (khuyến nghị)", "Cảnh liên tục (khung cuối)", "Cảnh độc lập dùng ảnh đầu riêng. Chế độ liên tục giữ hành vi cũ."],
  id: ["Mode adegan", "Adegan mandiri (disarankan)", "Adegan berkelanjutan (bingkai akhir)", "Adegan mandiri memakai gambar awal sendiri. Mode berkelanjutan mempertahankan perilaku lama."],
  ru: ["Режим кадров", "Независимые сцены (рекомендуется)", "Непрерывные сцены (последний кадр)", "Независимые сцены используют свои начальные изображения. Непрерывный режим сохраняет прежнее поведение."]
};
for (const [lang, values] of Object.entries(workflowModeTranslations)) {
  workflowModeKeys.forEach((key, index) => { workflowTranslations[lang][key] = values[index]; });
}

const storyboardReplacementTranslations = {
  "zh-CN": ["生成并替换分镜", "已替换分镜，保留第一镜首帧。请检查并保存。", "生成会替换全部分镜，保留第一镜首帧；不会自动生成视频。", "数量为替换后的总镜头数；总长须整除单镜头时长，最多1800镜。 总长最多30分钟（1800秒），分批规划。", "当前模型可能无法完成此规模或格式的分镜。请更换文本模型，或减少分镜数量、缩短故事后重试；原分镜未改动。"],
  "zh-TW": ["生成並替換分鏡", "已替換分鏡，保留第一鏡首幀。請檢查並儲存。", "替換全部分鏡並保留第一鏡首幀；不會自動生成影片。", "數量為替換後總鏡頭數；總長須整除單鏡時長，最多1800鏡。 總長最多30分鐘（1800秒），分批規劃。", "模型可能無法完成此規模或格式。請更換文字模型或減少鏡頭、縮短故事重試；原分鏡未變。"],
  en: ["Generate & replace shots", "Shots replaced; first opening frame retained. Review and save.", "Replaces all shots, retaining the first opening frame. No automatic video generation.", "Count is the final total; duration must divide evenly into at most 1800 shots. Maximum 30 minutes (1800 seconds); planning runs in batches.", "This model may not support this output size or format. Switch text models, reduce shots or shorten the story and retry. Existing shots are unchanged."],
  fr: ["Générer et remplacer", "Plans remplacés, première image conservée. Vérifiez et enregistrez.", "Remplace tous les plans, conserve la première image. Ne génère pas de vidéo.", "Nombre final de plans ; durée divisible, 1800 maximum. Maximum 30 minutes (1800 secondes) ; planification par lots.", "Le modèle ne peut peut-être pas produire ce format ou volume. Changez de modèle ou réduisez les plans ou le récit. Plans inchangés."],
  de: ["Aufnahmen ersetzen", "Aufnahmen ersetzt; erstes Startbild erhalten. Prüfen und speichern.", "Ersetzt alle Aufnahmen, behält erstes Startbild. Kein Videostart.", "Endgültige Anzahl; Dauer muss teilbar sein, maximal 1800. Maximal 30 Minuten (1800 Sekunden); Planung in Gruppen.", "Modell unterstützt Umfang oder Format möglicherweise nicht. Modell wechseln oder Aufnahmen/Geschichte kürzen. Bisherige Aufnahmen unverändert."],
  ja: ["分鏡を生成して置換", "置換完了。最初の開始画像は保持。確認して保存してください。", "全分鏡を置換し最初の開始画像を保持。動画は自動生成しません。", "置換後の総数。総時間は各時間で割り切れ、最大1800。 合計は最大30分（1800秒）。分割して計画します。", "モデルが規模や形式に対応できない可能性があります。モデル変更、分鏡数削減や物語短縮で再試行。既存分鏡は保持。"],
  ko: ["샷 생성 및 교체", "교체 완료. 첫 시작 이미지 유지. 확인 후 저장하세요.", "모든 샷 교체, 첫 시작 이미지 유지. 영상 자동 생성 안 함.", "교체 후 총 샷 수. 총 길이는 나누어 떨어져야 하며 최대 1800. 최대 30분(1800초). 나누어 계획합니다.", "모델이 규모나 형식을 처리하지 못할 수 있습니다. 모델 변경 또는 샷 수/이야기 길이를 줄여 재시도하세요. 기존 샷 유지."],
  es: ["Generar y reemplazar", "Planos reemplazados; primera imagen conservada. Revise y guarde.", "Reemplaza todos los planos conservando la primera imagen. No inicia vídeo.", "Cantidad final; duración divisible, máximo 1800. Máximo 30 minutos (1800 segundos); planificación por lotes.", "El modelo puede no admitir este tamaño o formato. Cambie de modelo o reduzca planos o historia. Planos originales intactos."],
  pt: ["Gerar e substituir", "Cenas substituídas; primeira imagem mantida. Revise e salve.", "Substitui todas as cenas, mantendo a primeira imagem. Não inicia vídeo.", "Quantidade final; duração divisível, máximo 1800. Máximo 30 minutos (1800 segundos); planejamento em lotes.", "O modelo pode não suportar este tamanho ou formato. Troque o modelo ou reduza cenas ou história. Cenas originais preservadas."],
  tr: ["Sahneleri üret ve değiştir", "Sahneler değişti; ilk kare korundu. İnceleyip kaydedin.", "Tüm sahneleri değiştirir, ilk kareyi korur. Video başlatmaz.", "Son sahne sayısı; süre tam bölünmeli, en fazla 1800. En fazla 30 dakika (1800 saniye); gruplar halinde planlanır.", "Model boyut veya biçimi desteklemeyebilir. Modeli değiştirin veya sahne/öyküyü azaltın. Eski sahneler değişmedi."],
  ar: ["إنشاء واستبدال اللقطات", "استُبدلت اللقطات وحُفظت صورة البداية الأولى. راجع واحفظ.", "يستبدل كل اللقطات ويحفظ صورة البداية الأولى. لا يبدأ الفيديو.", "العدد النهائي؛ يجب تقسيم المدة بالتساوي، حتى 1800 لقطة. الحد الأقصى 30 دقيقة (1800 ثانية)؛ تخطيط على دفعات.", "قد لا يدعم النموذج الحجم أو التنسيق. غيّر النموذج أو قلّل اللقطات أو القصة وأعد المحاولة. اللقطات الأصلية محفوظة."],
  vi: ["Tạo và thay thế cảnh", "Đã thay cảnh, giữ ảnh đầu tiên. Kiểm tra và lưu.", "Thay tất cả cảnh, giữ ảnh mở đầu đầu tiên. Không tự tạo video.", "Số cảnh cuối cùng; thời lượng chia hết, tối đa 1800. Tối đa 30 phút (1800 giây); lập kế hoạch theo từng đợt.", "Mô hình có thể không hỗ trợ quy mô hoặc định dạng. Đổi mô hình hoặc giảm cảnh hay câu chuyện. Cảnh cũ không đổi."],
  id: ["Buat dan ganti adegan", "Adegan diganti; gambar awal pertama tetap. Tinjau dan simpan.", "Mengganti semua adegan, mempertahankan gambar awal pertama. Tidak memulai video.", "Jumlah akhir; durasi harus terbagi rata, maksimum 1800. Maksimal 30 menit (1800 detik); perencanaan bertahap.", "Model mungkin tidak mendukung ukuran atau format ini. Ganti model atau kurangi adegan atau cerita. Adegan lama tidak berubah."],
  ru: ["Создать и заменить", "Кадры заменены, первое начальное изображение сохранено. Проверьте и сохраните.", "Заменяет все кадры, сохраняя первое начальное изображение. Видео не запускается.", "Итоговое число; длительность делится поровну, максимум 1800. Максимум 30 минут (1800 секунд); планирование партиями.", "Модель может не поддерживать объём или формат. Смените модель либо сократите кадры или рассказ. Старые кадры сохранены."]
};
for (const [language, values] of Object.entries(storyboardReplacementTranslations)) {
  ["storyboardGenerate", "storyboardAdded", "storyboardHint", "storyboardDurationHint",
    "storyboardModelLimited"].forEach((key, index) => { storyboardTranslations[language][key] = values[index]; });
}

const workflowLiveKeys = ["workflowTaskProgress", "workflowElapsed", "workflowRetrying",
  "workflowPreparing", "workflowAssembling", "workflowVideoStage", "workflowMusicStage",
  "workflowSoundtrackStage", "workflowRepairHint", "workflowRetryHint", "workflowPollRetry",
  "workflowWaiting", "workflowSegment"];
const workflowLiveTranslations = {
  "zh-CN": ["已完成任务（视频/配乐/合片）", "运行耗时", "等待自动重试", "准备模型", "合片与字幕", "生成分镜", "分镜配乐", "全片配乐", "请根据错误检查该分镜参数、首帧、模型路径、内存和磁盘；修复环境后点“继续工作流”（保留已完成结果），需修改分镜则点“恢复并修改”（创建新草稿，重新生成）。", "自动重试已耗尽。检查服务和网络后点“继续工作流”，已完成结果会保留。", "进度连接中断，正在重新连接；不会重新启动生成。", "等待模型输出日志", "生成分段"],
  "zh-TW": ["已完成任務（影片/配樂/合片）", "執行耗時", "等待自動重試", "準備模型", "合片與字幕", "生成分鏡", "分鏡配樂", "全片配樂", "依錯誤檢查分鏡參數、首幀、模型路徑、記憶體及磁碟；修復環境後繼續工作流程以保留結果，修改分鏡請恢復並修改建立新草稿重新生成。", "重試已耗盡。檢查服務及網路後繼續工作流程，保留已完成結果。", "進度連線中斷，正在重新連線；不會重新開始生成。", "等待模型輸出日誌", "生成分段"],
  en: ["Completed tasks (video/music/assembly)", "Elapsed", "Waiting to retry", "Preparing model", "Assembly and subtitles", "Video shot", "Shot music", "Soundtrack", "Check the failed shot settings, first frame, model path, memory and disk. Fix the environment then Resume to keep completed media; Restore and edit creates a new draft that regenerates shots.", "Retries exhausted. Check the service and network, then Resume; completed media is retained.", "Progress connection lost; reconnecting without restarting generation.", "Waiting for model logs", "Generation segment"],
  fr: ["Tâches terminées (vidéo/musique/montage)", "Durée écoulée", "Nouvelle tentative en attente", "Préparation du modèle", "Montage et sous-titres", "Plan vidéo", "Musique du plan", "Bande-son", "Vérifiez les paramètres du plan, l’image initiale, le modèle, la mémoire et le disque. Corrigez puis reprenez pour conserver les résultats ; restaurer et modifier crée un nouveau brouillon à régénérer.", "Tentatives épuisées. Vérifiez le service et le réseau puis reprenez ; les résultats sont conservés.", "Connexion au suivi perdue ; reconnexion sans relancer la génération.", "En attente des journaux du modèle", "Segment de génération"],
  de: ["Erledigte Aufgaben (Video/Musik/Montage)", "Laufzeit", "Warten auf Wiederholung", "Modell vorbereiten", "Montage und Untertitel", "Videoszene", "Szenenmusik", "Filmmusik", "Szenenparameter, Startbild, Modellpfad, Speicher und Datenträger prüfen. Nach Korrektur fortsetzen, um Ergebnisse zu behalten; Wiederherstellen und Bearbeiten erstellt einen neu zu generierenden Entwurf.", "Wiederholungen ausgeschöpft. Dienst und Netzwerk prüfen, dann fortsetzen; Ergebnisse bleiben erhalten.", "Fortschrittsverbindung unterbrochen; Wiederverbindung ohne Generierungsneustart.", "Warten auf Modellprotokolle", "Generierungssegment"],
  ja: ["完了タスク（動画/音楽/結合）", "経過時間", "自動再試行待ち", "モデル準備", "結合と字幕", "映像ショット", "ショット音楽", "サウンドトラック", "失敗したショットの設定、開始画像、モデルパス、メモリ、ディスクを確認してください。環境を修正して再開すると完了結果を保持します。復元して編集すると再生成用の新規下書きを作成します。", "再試行上限に達しました。サービスとネットワークを確認して再開してください。完了結果は保持します。", "進捗接続が切れました。生成を再開始せず再接続します。", "モデルログを待機中", "生成セグメント"],
  ko: ["완료 작업 (영상/음악/조립)", "경과 시간", "자동 재시도 대기", "모델 준비", "조립 및 자막", "영상 장면", "장면 음악", "전체 음악", "실패 장면 설정, 시작 이미지, 모델 경로, 메모리와 디스크를 확인하세요. 환경 수정 후 재개하면 완료 결과를 유지합니다. 복원 및 편집은 재생성할 새 초안을 만듭니다.", "재시도 한도에 도달했습니다. 서비스와 네트워크 확인 후 재개하세요. 완료 결과는 유지됩니다.", "진행 연결이 끊겼습니다. 생성을 다시 시작하지 않고 재연결합니다.", "모델 로그 대기", "생성 구간"],
  es: ["Tareas completadas (vídeo/música/montaje)", "Tiempo transcurrido", "Esperando reintento", "Preparando modelo", "Montaje y subtítulos", "Escena de vídeo", "Música de escena", "Banda sonora", "Revise parámetros, imagen inicial, ruta del modelo, memoria y disco. Corrija el entorno y reanude para conservar resultados; restaurar y editar crea un borrador para regenerar.", "Reintentos agotados. Revise servicio y red y reanude; se conservan los resultados.", "Conexión de progreso perdida; reconectando sin reiniciar la generación.", "Esperando registros del modelo", "Segmento de generación"],
  pt: ["Tarefas concluídas (vídeo/música/montagem)", "Tempo decorrido", "Aguardando nova tentativa", "Preparando modelo", "Montagem e legendas", "Cena de vídeo", "Música da cena", "Trilha sonora", "Verifique parâmetros, imagem inicial, caminho do modelo, memória e disco. Corrija o ambiente e retome para manter resultados; restaurar e editar cria um rascunho para gerar novamente.", "Tentativas esgotadas. Verifique serviço e rede e retome; resultados são mantidos.", "Conexão de progresso perdida; reconectando sem reiniciar a geração.", "Aguardando registros do modelo", "Segmento de geração"],
  tr: ["Tamamlanan görevler (video/müzik/montaj)", "Geçen süre", "Yeniden deneme bekleniyor", "Model hazırlanıyor", "Montaj ve altyazı", "Video sahnesi", "Sahne müziği", "Film müziği", "Sahne ayarları, ilk kare, model yolu, bellek ve diski kontrol edin. Ortamı düzeltip sürdürerek sonuçları koruyun; geri yükle ve düzenle yeniden üretilecek taslak oluşturur.", "Deneme sınırına ulaşıldı. Hizmet ve ağı kontrol edip sürdürün; sonuçlar korunur.", "İlerleme bağlantısı kesildi; üretimi yeniden başlatmadan bağlanılıyor.", "Model günlükleri bekleniyor", "Üretim bölümü"],
  ar: ["المهام المكتملة (فيديو/موسيقى/دمج)", "الوقت المنقضي", "بانتظار إعادة المحاولة", "تحضير النموذج", "الدمج والترجمة", "لقطة فيديو", "موسيقى اللقطة", "الموسيقى التصويرية", "تحقق من إعدادات اللقطة والصورة الأولى ومسار النموذج والذاكرة والقرص. أصلح البيئة ثم استأنف لحفظ النتائج؛ الاستعادة والتعديل ينشئان مسودة لإعادة التوليد.", "نفدت المحاولات. تحقق من الخدمة والشبكة ثم استأنف؛ تبقى النتائج المكتملة محفوظة.", "انقطع اتصال التقدم؛ جارٍ الاتصال دون إعادة التوليد.", "بانتظار سجلات النموذج", "جزء التوليد"],
  vi: ["Tác vụ hoàn tất (video/nhạc/ghép)", "Thời gian chạy", "Đang chờ thử lại", "Chuẩn bị mô hình", "Ghép và phụ đề", "Cảnh video", "Nhạc cảnh", "Nhạc toàn phim", "Kiểm tra tham số cảnh, ảnh đầu, đường dẫn mô hình, bộ nhớ và ổ đĩa. Sửa môi trường rồi tiếp tục để giữ kết quả; khôi phục và sửa tạo bản nháp để tạo lại.", "Đã hết lượt thử lại. Kiểm tra dịch vụ và mạng rồi tiếp tục; kết quả đã xong được giữ.", "Mất kết nối tiến độ; đang kết nối lại, không khởi động tạo lại.", "Đang chờ nhật ký mô hình", "Đoạn tạo"],
  id: ["Tugas selesai (video/musik/perakitan)", "Waktu berjalan", "Menunggu percobaan ulang", "Menyiapkan model", "Perakitan dan subtitel", "Adegan video", "Musik adegan", "Musik film", "Periksa pengaturan adegan, gambar awal, jalur model, memori dan disk. Perbaiki lingkungan lalu lanjutkan untuk menyimpan hasil; pulihkan dan edit membuat draf untuk dibuat ulang.", "Percobaan habis. Periksa layanan dan jaringan lalu lanjutkan; hasil selesai tetap tersimpan.", "Koneksi progres terputus; menyambung kembali tanpa memulai ulang pembuatan.", "Menunggu log model", "Segmen pembuatan"],
  ru: ["Завершённые задачи (видео/музыка/сборка)", "Время работы", "Ожидание повтора", "Подготовка модели", "Сборка и субтитры", "Видеокадр", "Музыка кадра", "Саундтрек", "Проверьте параметры кадра, начальное изображение, путь модели, память и диск. Исправьте среду и продолжите с сохранением результатов; восстановление и редактирование создаёт черновик для повторной генерации.", "Попытки исчерпаны. Проверьте службу и сеть, затем продолжите; результаты сохранены.", "Связь с прогрессом потеряна; переподключение без перезапуска генерации.", "Ожидание журналов модели", "Сегмент генерации"]
};
for (const [lang, values] of Object.entries(workflowLiveTranslations)) {
  Object.assign(workflowTranslations[lang],
    Object.fromEntries(workflowLiveKeys.map((key, index) => [key, values[index]])));
}

const workflowDeleteKeys = ["workflowClearShots", "workflowClearConfirm", "workflowDelete",
  "workflowDeleteAll", "workflowKeepMediaHint", "workflowDeleteMedia",
  "workflowDeleteCancel", "workflowDeleteConfirm", "workflowDeleteActive", "workflowDeleteCount"];
const workflowDeleteTranslations = {
  "zh-CN": ["清空分镜", "清空当前草稿的所有分镜？保存后才会更新已保存草稿。", "删除工作流", "删除全部", "默认保留媒体文件在原输出目录；共享历史首帧和配乐不会删除。", "同时删除这些工作流目录中的媒体及生成记录（不可撤销）", "取消", "确认删除", "请先取消运行中的工作流并等待停止，再删除。", "将删除工作流数量："],
  "zh-TW": ["清空分鏡", "清空目前草稿所有分鏡？儲存後才更新已存草稿。", "刪除工作流程", "刪除全部", "預設保留媒體於原輸出目錄；不刪除共享首幀及配樂。", "同時刪除這些工作流程目錄中的媒體與生成記錄（不可復原）", "取消", "確認刪除", "請先取消執行中的工作流程並等待停止。", "將刪除工作流程數量："],
  en: ["Clear shots", "Clear all shots in this draft? Saved drafts change only after saving.", "Delete workflow", "Delete all", "Media stays in its original output directory by default. Shared history images and music are not deleted.", "Also delete media and generation records in these workflow directories (irreversible)", "Cancel", "Confirm deletion", "Cancel running workflows and wait for them to stop before deleting.", "Workflows to delete:"],
  fr: ["Vider les plans", "Vider les plans du brouillon ? Le brouillon enregistré change après sauvegarde.", "Supprimer le workflow", "Tout supprimer", "Les médias restent dans leur dossier par défaut. Images et musiques partagées conservées.", "Supprimer aussi médias et enregistrements dans ces dossiers (irréversible)", "Annuler", "Confirmer", "Annulez les workflows actifs et attendez leur arrêt.", "Workflows à supprimer :"],
  de: ["Szenen leeren", "Alle Szenen dieses Entwurfs leeren? Änderungen erst nach Speichern.", "Workflow löschen", "Alle löschen", "Medien bleiben standardmäßig im Ausgabeordner. Geteilte Bilder und Musik bleiben erhalten.", "Auch Medien und Generierungsdaten in diesen Ordnern löschen (unwiderruflich)", "Abbrechen", "Löschen bestätigen", "Laufende Workflows abbrechen und auf ihren Stopp warten.", "Zu löschende Workflows:"],
  ja: ["ショットをクリア", "下書きの全ショットをクリアしますか？保存後に保存済み下書きを更新します。", "ワークフロー削除", "すべて削除", "既定では元の出力フォルダーにメディアを保持します。共有画像と音楽は削除しません。", "対象フォルダーのメディアと生成記録も削除（元に戻せません）", "キャンセル", "削除を確認", "実行中のワークフローをキャンセルし停止を待ってください。", "削除するワークフロー数："],
  ko: ["장면 비우기", "초안의 모든 장면을 비울까요? 저장 후에 저장된 초안이 변경됩니다.", "워크플로 삭제", "모두 삭제", "기본적으로 원래 출력 폴더에 미디어를 유지합니다. 공유 이미지와 음악은 삭제하지 않습니다.", "해당 폴더의 미디어와 생성 기록도 삭제 (복구 불가)", "취소", "삭제 확인", "실행 중 워크플로를 취소하고 종료될 때까지 기다리세요.", "삭제할 워크플로 수:"],
  es: ["Vaciar escenas", "¿Vaciar escenas del borrador? El borrador guardado cambia al guardar.", "Eliminar flujo", "Eliminar todos", "Se conservan los medios en su carpeta original. No se borran imágenes ni música compartidas.", "Eliminar también medios y registros en estas carpetas (irreversible)", "Cancelar", "Confirmar", "Cancele los flujos activos y espere a que se detengan.", "Flujos a eliminar:"],
  pt: ["Limpar cenas", "Limpar cenas do rascunho? O rascunho salvo muda ao salvar.", "Excluir fluxo", "Excluir todos", "Mídia mantida na pasta original por padrão. Imagens e músicas compartilhadas não são excluídas.", "Excluir também mídia e registros nestas pastas (irreversível)", "Cancelar", "Confirmar", "Cancele fluxos ativos e aguarde a parada.", "Fluxos a excluir:"],
  tr: ["Sahneleri temizle", "Taslak sahneleri temizlensin mi? Kaydedilen taslak ancak kaydedince değişir.", "İş akışını sil", "Tümünü sil", "Medya varsayılan olarak özgün klasörde kalır. Paylaşılan resim ve müzik silinmez.", "Bu klasörlerdeki medya ve üretim kayıtlarını da sil (geri alınamaz)", "İptal", "Silmeyi onayla", "Çalışan iş akışlarını iptal edip durmalarını bekleyin.", "Silinecek iş akışları:"],
  ar: ["مسح اللقطات", "مسح لقطات المسودة؟ تتغير المسودة المحفوظة بعد الحفظ فقط.", "حذف سير العمل", "حذف الكل", "تبقى الوسائط في المجلد الأصلي افتراضيًا. لا تُحذف الصور والموسيقى المشتركة.", "حذف الوسائط وسجلات التوليد في هذه المجلدات أيضًا (نهائي)", "إلغاء", "تأكيد الحذف", "ألغِ مسارات العمل النشطة وانتظر توقفها.", "مسارات العمل المراد حذفها:"],
  vi: ["Xóa hết cảnh", "Xóa hết cảnh bản nháp? Bản đã lưu chỉ thay đổi sau khi lưu.", "Xóa quy trình", "Xóa tất cả", "Mặc định giữ tệp trong thư mục gốc. Không xóa ảnh và nhạc dùng chung.", "Xóa cả phương tiện và bản ghi trong các thư mục này (không thể hoàn tác)", "Hủy", "Xác nhận xóa", "Hủy quy trình đang chạy và chờ dừng trước khi xóa.", "Số quy trình cần xóa:"],
  id: ["Kosongkan adegan", "Kosongkan adegan draf? Draf tersimpan berubah setelah disimpan.", "Hapus alur kerja", "Hapus semua", "Media tetap di folder asli secara default. Gambar dan musik bersama tidak dihapus.", "Hapus juga media dan catatan pembuatan dalam folder ini (permanen)", "Batal", "Konfirmasi", "Batalkan alur aktif dan tunggu berhenti sebelum menghapus.", "Alur yang akan dihapus:"],
  ru: ["Очистить кадры", "Очистить кадры черновика? Сохранённый черновик изменится после сохранения.", "Удалить процесс", "Удалить все", "Медиа остаются в исходной папке. Общие изображения и музыка не удаляются.", "Также удалить медиа и записи генерации в этих папках (необратимо)", "Отмена", "Подтвердить", "Отмените активные процессы и дождитесь остановки.", "Процессов для удаления:"]
};
for (const [lang, values] of Object.entries(workflowDeleteTranslations)) {
  Object.assign(workflowTranslations[lang],
    Object.fromEntries(workflowDeleteKeys.map((key, index) => [key, values[index]])));
}

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
    enhancerKeywordPrefix: "关键词：",
    enhancerApplied: "提示词已替换，提取的关键词也已追加，可一同影响生成。",
    enhancerPromptTooLong: "优化提示词与关键词合并后超过 4000 个字符。请缩短原提示词后重新优化。",
    enhancerOptimizedPrompt: "优化后的提示词", enhancerApply: "替换原提示词", enhancerDismiss: "关闭",
    enhanceFailed: "本地提示词优化失败，请确认 OMLX 服务和所选模型可用。",
    enhancerOffline: "无法连接本地文本模型服务；请先启动 OMLX。", enhancerPrivacy: "提示词只发送到本机 OMLX 服务。"
  },
  en: {
    enhancerModelLabel: "Local text model", enhancerModelLoading: "Finding local text models…",
    enhancerNoModels: "No local text models are available", enhancePrompt: "Extract keywords & optimize",
    enhancingPrompt: "Extracting keywords and optimizing locally…", enhancerKeywords: "Extracted keywords",
    enhancerKeywordPrefix: "Keywords:",
    enhancerApplied: "Prompt replaced with the extracted keywords appended for generation.",
    enhancerPromptTooLong: "The optimized prompt and keywords exceed 4,000 characters. Shorten the source prompt and optimize again.",
    enhancerOptimizedPrompt: "Optimized prompt", enhancerApply: "Replace original prompt", enhancerDismiss: "Dismiss",
    enhanceFailed: "Local prompt optimization failed. Check that OMLX and the selected model are available.",
    enhancerOffline: "Could not reach the local text-model service. Start OMLX first.", enhancerPrivacy: "Prompts are sent only to the OMLX service on this device."
  },
  "zh-TW": {
    enhancerModelLabel: "本機文字模型", enhancerModelLoading: "正在尋找本機文字模型…",
    enhancerNoModels: "找不到可用的本機文字模型", enhancePrompt: "擷取關鍵詞並最佳化",
    enhancingPrompt: "正在使用本機模型擷取關鍵詞並最佳化…", enhancerKeywords: "擷取的關鍵詞",
    enhancerKeywordPrefix: "關鍵詞：",
    enhancerApplied: "提示詞已取代，擷取的關鍵詞也已附加，會一同影響生成。",
    enhancerPromptTooLong: "最佳化提示詞與關鍵詞合併後超過 4000 個字元。請縮短原提示詞後重新最佳化。",
    enhancerOptimizedPrompt: "最佳化後的提示詞", enhancerApply: "取代原提示詞", enhancerDismiss: "關閉",
    enhanceFailed: "本機提示詞最佳化失敗，請確認 OMLX 服務與所選模型可用。",
    enhancerOffline: "無法連線至本機文字模型服務；請先啟動 OMLX。", enhancerPrivacy: "提示詞只會傳送至本機 OMLX 服務。"
  },
  fr: {
    enhancerModelLabel: "Modèle de texte local", enhancerModelLoading: "Recherche des modèles locaux…",
    enhancerNoModels: "Aucun modèle de texte local disponible", enhancePrompt: "Extraire les mots-clés et optimiser",
    enhancingPrompt: "Extraction et optimisation locales en cours…", enhancerKeywords: "Mots-clés extraits",
    enhancerKeywordPrefix: "Mots-clés :",
    enhancerApplied: "Prompt remplacé avec les mots-clés extraits ajoutés pour guider la génération.",
    enhancerPromptTooLong: "Le prompt optimisé et les mots-clés dépassent 4 000 caractères. Raccourcissez le prompt source et relancez l’optimisation.",
    enhancerOptimizedPrompt: "Prompt optimisé", enhancerApply: "Remplacer le prompt initial", enhancerDismiss: "Fermer",
    enhanceFailed: "Échec de l’optimisation locale. Vérifiez OMLX et le modèle sélectionné.",
    enhancerOffline: "Service de modèles local inaccessible. Démarrez OMLX.", enhancerPrivacy: "Les prompts sont envoyés uniquement à OMLX sur cet appareil."
  },
  de: {
    enhancerModelLabel: "Lokales Sprachmodell", enhancerModelLoading: "Lokale Sprachmodelle werden gesucht…",
    enhancerNoModels: "Keine lokalen Sprachmodelle verfügbar", enhancePrompt: "Schlüsselwörter extrahieren & optimieren",
    enhancingPrompt: "Schlüsselwörter werden lokal extrahiert und optimiert…", enhancerKeywords: "Extrahierte Schlüsselwörter",
    enhancerKeywordPrefix: "Schlüsselwörter:",
    enhancerApplied: "Prompt ersetzt; die extrahierten Schlüsselwörter wurden für die Generierung angehängt.",
    enhancerPromptTooLong: "Der optimierte Prompt mit Schlüsselwörtern überschreitet 4.000 Zeichen. Kürze den Quellprompt und optimiere erneut.",
    enhancerOptimizedPrompt: "Optimierter Prompt", enhancerApply: "Ursprünglichen Prompt ersetzen", enhancerDismiss: "Schließen",
    enhanceFailed: "Lokale Prompt-Optimierung fehlgeschlagen. Prüfe OMLX und das gewählte Modell.",
    enhancerOffline: "Lokaler Modelldienst nicht erreichbar. Starte zuerst OMLX.", enhancerPrivacy: "Prompts werden nur an OMLX auf diesem Gerät gesendet."
  },
  ja: {
    enhancerModelLabel: "ローカルテキストモデル", enhancerModelLoading: "ローカルモデルを検索中…",
    enhancerNoModels: "利用可能なローカルテキストモデルがありません", enhancePrompt: "キーワード抽出・最適化",
    enhancingPrompt: "ローカルでキーワードを抽出して最適化中…", enhancerKeywords: "抽出したキーワード",
    enhancerKeywordPrefix: "キーワード：",
    enhancerApplied: "プロンプトを置き換え、抽出したキーワードも生成に反映されるよう追加しました。",
    enhancerPromptTooLong: "最適化したプロンプトとキーワードの合計が4,000文字を超えています。元のプロンプトを短くして再度最適化してください。",
    enhancerOptimizedPrompt: "最適化したプロンプト", enhancerApply: "元のプロンプトを置き換える", enhancerDismiss: "閉じる",
    enhanceFailed: "ローカル最適化に失敗しました。OMLX と選択モデルを確認してください。",
    enhancerOffline: "ローカルモデルサービスに接続できません。OMLX を起動してください。", enhancerPrivacy: "プロンプトはこの端末上の OMLX にのみ送信されます。"
  },
  ko: {
    enhancerModelLabel: "로컬 텍스트 모델", enhancerModelLoading: "로컬 텍스트 모델 검색 중…",
    enhancerNoModels: "사용 가능한 로컬 텍스트 모델이 없습니다", enhancePrompt: "키워드 추출 및 최적화",
    enhancingPrompt: "로컬에서 키워드를 추출하고 최적화하는 중…", enhancerKeywords: "추출된 키워드",
    enhancerKeywordPrefix: "키워드:",
    enhancerApplied: "프롬프트를 교체하고 추출한 키워드도 생성에 반영되도록 추가했습니다.",
    enhancerPromptTooLong: "최적화된 프롬프트와 키워드가 4,000자를 초과합니다. 원본 프롬프트를 줄인 뒤 다시 최적화하세요.",
    enhancerOptimizedPrompt: "최적화된 프롬프트", enhancerApply: "원래 프롬프트 교체", enhancerDismiss: "닫기",
    enhanceFailed: "로컬 최적화에 실패했습니다. OMLX와 선택한 모델을 확인하세요.",
    enhancerOffline: "로컬 텍스트 모델 서비스에 연결할 수 없습니다. OMLX를 시작하세요.", enhancerPrivacy: "프롬프트는 이 기기의 OMLX 서비스로만 전송됩니다."
  },
  es: {
    enhancerModelLabel: "Modelo de texto local", enhancerModelLoading: "Buscando modelos locales…",
    enhancerNoModels: "No hay modelos de texto locales disponibles", enhancePrompt: "Extraer palabras clave y optimizar",
    enhancingPrompt: "Extrayendo palabras clave y optimizando localmente…", enhancerKeywords: "Palabras clave extraídas",
    enhancerKeywordPrefix: "Palabras clave:",
    enhancerApplied: "Prompt reemplazado con las palabras clave extraídas añadidas para guiar la generación.",
    enhancerPromptTooLong: "El prompt optimizado y las palabras clave superan los 4.000 caracteres. Acorta el prompt original y vuelve a optimizar.",
    enhancerOptimizedPrompt: "Prompt optimizado", enhancerApply: "Reemplazar el prompt original", enhancerDismiss: "Cerrar",
    enhanceFailed: "Falló la optimización local. Comprueba OMLX y el modelo seleccionado.",
    enhancerOffline: "No se puede conectar al servicio local. Inicia OMLX.", enhancerPrivacy: "Los prompts solo se envían a OMLX en este dispositivo."
  },
  pt: {
    enhancerModelLabel: "Modelo de texto local", enhancerModelLoading: "Buscando modelos locais…",
    enhancerNoModels: "Nenhum modelo de texto local disponível", enhancePrompt: "Extrair palavras-chave e otimizar",
    enhancingPrompt: "Extraindo palavras-chave e otimizando localmente…", enhancerKeywords: "Palavras-chave extraídas",
    enhancerKeywordPrefix: "Palavras-chave:",
    enhancerApplied: "Prompt substituído com as palavras-chave extraídas adicionadas para orientar a geração.",
    enhancerPromptTooLong: "O prompt otimizado e as palavras-chave excedem 4.000 caracteres. Encurte o prompt original e otimize novamente.",
    enhancerOptimizedPrompt: "Prompt otimizado", enhancerApply: "Substituir o prompt original", enhancerDismiss: "Fechar",
    enhanceFailed: "Falha na otimização local. Verifique o OMLX e o modelo selecionado.",
    enhancerOffline: "Não foi possível acessar o serviço local. Inicie o OMLX.", enhancerPrivacy: "Os prompts são enviados somente ao OMLX neste dispositivo."
  },
  tr: {
    enhancerModelLabel: "Yerel metin modeli", enhancerModelLoading: "Yerel metin modelleri aranıyor…",
    enhancerNoModels: "Kullanılabilir yerel metin modeli yok", enhancePrompt: "Anahtar kelimeleri çıkar ve iyileştir",
    enhancingPrompt: "Anahtar kelimeler yerel olarak çıkarılıp iyileştiriliyor…", enhancerKeywords: "Çıkarılan anahtar kelimeler",
    enhancerKeywordPrefix: "Anahtar kelimeler:",
    enhancerApplied: "İstem değiştirildi; çıkarılan anahtar kelimeler üretimi etkilemesi için eklendi.",
    enhancerPromptTooLong: "İyileştirilmiş istem ve anahtar kelimeler 4.000 karakteri aşıyor. Kaynak istemi kısaltıp yeniden iyileştirin.",
    enhancerOptimizedPrompt: "İyileştirilmiş istem", enhancerApply: "Özgün istemi değiştir", enhancerDismiss: "Kapat",
    enhanceFailed: "Yerel iyileştirme başarısız. OMLX ve seçilen modeli kontrol edin.",
    enhancerOffline: "Yerel model hizmetine ulaşılamıyor. Önce OMLX'i başlatın.", enhancerPrivacy: "İstemler yalnızca bu cihazdaki OMLX'e gönderilir."
  },
  ar: {
    enhancerModelLabel: "نموذج نصي محلي", enhancerModelLoading: "جارٍ البحث عن نماذج نصية محلية…",
    enhancerNoModels: "لا تتوفر نماذج نصية محلية", enhancePrompt: "استخراج الكلمات المفتاحية وتحسينها",
    enhancingPrompt: "جارٍ استخراج الكلمات المفتاحية والتحسين محليًا…", enhancerKeywords: "الكلمات المفتاحية المستخرجة",
    enhancerKeywordPrefix: "الكلمات المفتاحية:",
    enhancerApplied: "تم استبدال الوصف وإضافة الكلمات المفتاحية المستخرجة لتؤثر في التوليد.",
    enhancerPromptTooLong: "يتجاوز الوصف المحسّن مع الكلمات المفتاحية ٤٠٠٠ حرف. اختصر الوصف الأصلي ثم أعد تحسينه.",
    enhancerOptimizedPrompt: "الوصف المحسّن", enhancerApply: "استبدال الوصف الأصلي", enhancerDismiss: "إغلاق",
    enhanceFailed: "تعذّر التحسين المحلي. تحقق من OMLX والنموذج المحدد.",
    enhancerOffline: "تعذّر الاتصال بخدمة النماذج المحلية. ابدأ OMLX أولًا.", enhancerPrivacy: "تُرسل الأوصاف إلى OMLX على هذا الجهاز فقط."
  },
  vi: {
    enhancerModelLabel: "Mô hình văn bản cục bộ", enhancerModelLoading: "Đang tìm mô hình văn bản cục bộ…",
    enhancerNoModels: "Không có mô hình văn bản cục bộ khả dụng", enhancePrompt: "Trích xuất từ khóa và tối ưu",
    enhancingPrompt: "Đang trích xuất từ khóa và tối ưu cục bộ…", enhancerKeywords: "Từ khóa đã trích xuất",
    enhancerKeywordPrefix: "Từ khóa:",
    enhancerApplied: "Đã thay thế prompt và thêm từ khóa trích xuất để chúng ảnh hưởng đến nội dung tạo.",
    enhancerPromptTooLong: "Prompt tối ưu cùng từ khóa vượt quá 4.000 ký tự. Hãy rút ngắn prompt gốc rồi tối ưu lại.",
    enhancerOptimizedPrompt: "Prompt đã tối ưu", enhancerApply: "Thay thế prompt ban đầu", enhancerDismiss: "Đóng",
    enhanceFailed: "Tối ưu cục bộ thất bại. Hãy kiểm tra OMLX và mô hình đã chọn.",
    enhancerOffline: "Không thể kết nối dịch vụ mô hình cục bộ. Hãy khởi động OMLX.", enhancerPrivacy: "Prompt chỉ được gửi đến OMLX trên thiết bị này."
  },
  id: {
    enhancerModelLabel: "Model teks lokal", enhancerModelLoading: "Mencari model teks lokal…",
    enhancerNoModels: "Tidak ada model teks lokal yang tersedia", enhancePrompt: "Ekstrak kata kunci & optimalkan",
    enhancingPrompt: "Mengekstrak kata kunci dan mengoptimalkan secara lokal…", enhancerKeywords: "Kata kunci yang diekstrak",
    enhancerKeywordPrefix: "Kata kunci:",
    enhancerApplied: "Prompt diganti dan kata kunci hasil ekstraksi ditambahkan agar memengaruhi hasil generasi.",
    enhancerPromptTooLong: "Prompt hasil optimasi dan kata kunci melebihi 4.000 karakter. Persingkat prompt sumber lalu optimalkan lagi.",
    enhancerOptimizedPrompt: "Prompt yang dioptimalkan", enhancerApply: "Ganti prompt asli", enhancerDismiss: "Tutup",
    enhanceFailed: "Optimasi lokal gagal. Periksa OMLX dan model yang dipilih.",
    enhancerOffline: "Tidak dapat menghubungi layanan model lokal. Jalankan OMLX terlebih dahulu.", enhancerPrivacy: "Prompt hanya dikirim ke OMLX di perangkat ini."
  },
  ru: {
    enhancerModelLabel: "Локальная языковая модель", enhancerModelLoading: "Поиск локальных моделей…",
    enhancerNoModels: "Локальные языковые модели недоступны", enhancePrompt: "Извлечь ключевые слова и улучшить",
    enhancingPrompt: "Локальное извлечение ключевых слов и улучшение…", enhancerKeywords: "Извлечённые ключевые слова",
    enhancerKeywordPrefix: "Ключевые слова:",
    enhancerApplied: "Промпт заменён, извлечённые ключевые слова добавлены для влияния на генерацию.",
    enhancerPromptTooLong: "Улучшенный промпт вместе с ключевыми словами превышает 4 000 символов. Сократите исходный промпт и повторите оптимизацию.",
    enhancerOptimizedPrompt: "Улучшенный промпт", enhancerApply: "Заменить исходный промпт", enhancerDismiss: "Закрыть",
    enhanceFailed: "Локальное улучшение не удалось. Проверьте OMLX и выбранную модель.",
    enhancerOffline: "Нет связи с локальной службой моделей. Запустите OMLX.", enhancerPrivacy: "Промпты отправляются только в OMLX на этом устройстве."
  }
};

const firstFrameTranslations = {
  en: ["First-frame image", "None (text-to-video)", "Choose a generated image as the opening frame, not just a style reference.", "Saved image", "Auto: previous shot's last frame"],
  "zh-CN": ["首帧图片", "不使用（文生视频）", "选择文生图历史结果作为镜头起始画面，不只是风格参考。", "已保存图片", "自动：使用上一分镜末帧"],
  "zh-TW": ["首幀圖片", "不使用（文字生成影片）", "選擇生成圖片作為鏡頭起始畫面，不只是風格參考。", "已儲存圖片", "自動：使用上一分鏡末幀"],
  fr: ["Image de départ", "Aucune (texte vers vidéo)", "Choisissez une image générée comme première image, pas seulement comme référence de style.", "Image enregistrée", "Auto : dernière image du plan précédent"],
  de: ["Startbild", "Keines (Text zu Video)", "Ein generiertes Bild als Startbild wählen, nicht nur als Stilreferenz.", "Gespeichertes Bild", "Auto: letztes Bild der vorherigen Einstellung"],
  ja: ["開始フレーム画像", "なし（テキストから動画）", "生成画像をスタイル参考だけでなく、開始フレームとして選択します。", "保存済み画像", "自動：前のショットの最終フレーム"],
  ko: ["첫 프레임 이미지", "없음 (텍스트로 영상)", "생성 이미지를 스타일 참고가 아닌 시작 프레임으로 선택하세요.", "저장된 이미지", "자동: 이전 샷의 마지막 프레임"],
  es: ["Imagen inicial", "Ninguna (texto a vídeo)", "Elige una imagen generada como fotograma inicial, no solo como referencia de estilo.", "Imagen guardada", "Auto: último fotograma de la toma anterior"],
  pt: ["Imagem inicial", "Nenhuma (texto para vídeo)", "Escolha uma imagem gerada como quadro inicial, não apenas referência de estilo.", "Imagem salva", "Auto: último quadro da cena anterior"],
  tr: ["İlk kare görseli", "Yok (metinden video)", "Üretilmiş görseli yalnızca stil referansı değil, ilk kare olarak seçin.", "Kaydedilen görsel", "Otomatik: önceki çekimin son karesi"],
  ar: ["صورة الإطار الأول", "بدون (نص إلى فيديو)", "اختر صورة مولّدة لتكون الإطار الأول وليس مجرد مرجع للأسلوب.", "صورة محفوظة", "تلقائي: الإطار الأخير من اللقطة السابقة"],
  vi: ["Ảnh khung hình đầu", "Không dùng (văn bản thành video)", "Chọn ảnh đã tạo làm khung hình đầu, không chỉ tham khảo phong cách.", "Ảnh đã lưu", "Tự động: khung hình cuối của cảnh trước"],
  id: ["Gambar bingkai pertama", "Tidak ada (teks ke video)", "Pilih gambar hasil generasi sebagai bingkai awal, bukan sekadar referensi gaya.", "Gambar tersimpan", "Otomatis: bingkai terakhir dari shot sebelumnya"],
  ru: ["Начальный кадр", "Нет (видео из текста)", "Выберите созданное изображение как начальный кадр, а не только образец стиля.", "Сохранённое изображение", "Авто: последний кадр предыдущего плана"]
};
const firstFrameKeys = ["firstFrameTitle", "firstFrameNone", "firstFrameHint", "firstFrameSaved", "firstFrameChained"];
const uploadKeys = ["firstFrameUpload", "firstFrameUploadHint", "firstFrameUploading", "firstFrameUploadFailed"];
const uploadTranslations = {
  "zh-CN": ["从本地添加图片", "PNG / JPEG / WebP，最多20MB、1600万像素；仅上传到本机。", "正在上传图片…", "图片上传失败"],
  "zh-TW": ["從本機新增圖片", "PNG / JPEG / WebP，最多20MB、1600萬像素；僅上傳至本機。", "正在上傳圖片…", "圖片上傳失敗"],
  en: ["Add a local image", "PNG / JPEG / WebP; up to 20MB and 16MP. Local upload only.", "Uploading image…", "Image upload failed"],
  fr: ["Ajouter une image locale", "PNG / JPEG / WebP ; 20Mo et 16MP maximum. Envoi local.", "Envoi de l’image…", "Échec de l’envoi"],
  de: ["Lokales Bild hinzufügen", "PNG / JPEG / WebP; maximal 20MB und 16MP. Nur lokal.", "Bild wird hochgeladen…", "Bild-Upload fehlgeschlagen"],
  ja: ["ローカル画像を追加", "PNG / JPEG / WebP、最大20MB・1600万画素。本機のみ。", "画像をアップロード中…", "画像のアップロードに失敗"],
  ko: ["로컬 이미지 추가", "PNG / JPEG / WebP, 최대 20MB 및 1600만 화소. 로컬 전용.", "이미지 업로드 중…", "이미지 업로드 실패"],
  es: ["Añadir imagen local", "PNG / JPEG / WebP; hasta 20MB y 16MP. Solo local.", "Subiendo imagen…", "Error al subir imagen"],
  pt: ["Adicionar imagem local", "PNG / JPEG / WebP; até 20MB e 16MP. Apenas local.", "Enviando imagem…", "Falha ao enviar imagem"],
  tr: ["Yerel görsel ekle", "PNG / JPEG / WebP; en fazla 20MB ve 16MP. Yalnızca yerel.", "Görsel yükleniyor…", "Görsel yüklenemedi"],
  ar: ["إضافة صورة محلية", "PNG / JPEG / WebP؛ حتى 20MB و16MP. رفع محلي فقط.", "جارٍ رفع الصورة…", "فشل رفع الصورة"],
  vi: ["Thêm ảnh cục bộ", "PNG / JPEG / WebP; tối đa 20MB và 16MP. Chỉ tải lên máy này.", "Đang tải ảnh…", "Tải ảnh thất bại"],
  id: ["Tambahkan gambar lokal", "PNG / JPEG / WebP; maksimal 20MB dan 16MP. Hanya lokal.", "Mengunggah gambar…", "Unggah gambar gagal"],
  ru: ["Добавить локальное фото", "PNG / JPEG / WebP; до 20MB и 16MP. Только локально.", "Загрузка изображения…", "Ошибка загрузки изображения"]
};
const historyRestoreKeys = ["historyRestored", "historyLegacy"];
const historyRestoreTranslations = {
  "zh-CN": ["已恢复提示词和生成配置，可修改后重新生成。", "旧记录未保存完整生成配置：仅恢复已有提示词，其他设置保持当前值。"],
  "zh-TW": ["已還原提示詞和生成設定，可修改後重新生成。", "舊記錄未保存完整設定：僅還原已有提示詞，其餘設定維持目前值。"],
  en: ["Prompt and generation settings restored. Edit them to generate again.", "This older record has no complete settings. Only its available prompt was restored; other settings are unchanged."],
  fr: ["Prompt et paramètres restaurés. Modifiez-les pour générer à nouveau.", "Cet ancien résultat n’a pas de paramètres complets. Seul le prompt disponible est restauré ; les autres réglages restent inchangés."],
  de: ["Prompt und Einstellungen wiederhergestellt. Für eine neue Generierung bearbeiten.", "Dieser ältere Eintrag enthält keine vollständigen Einstellungen. Nur der verfügbare Prompt wurde geladen; andere Werte bleiben unverändert."],
  ja: ["プロンプトと生成設定を復元しました。編集して再生成できます。", "古い記録に完全な設定がありません。保存されたプロンプトのみ復元し、他の設定は変更しません。"],
  ko: ["프롬프트와 생성 설정을 복원했습니다. 수정 후 다시 생성하세요.", "이전 기록에는 전체 설정이 없습니다. 저장된 프롬프트만 복원하고 나머지는 유지합니다."],
  es: ["Prompt y ajustes restaurados. Edítalos para generar de nuevo.", "Este registro antiguo no incluye ajustes completos. Solo se restaura el prompt disponible; el resto no cambia."],
  pt: ["Prompt e configurações restaurados. Edite para gerar novamente.", "Este registro antigo não tem configurações completas. Apenas o prompt disponível foi restaurado; os demais valores não mudam."],
  tr: ["İstem ve üretim ayarları geri yüklendi. Düzenleyip yeniden üretin.", "Eski kayıtta tam ayarlar yok. Yalnızca mevcut istem yüklendi; diğer ayarlar değişmedi."],
  ar: ["تمت استعادة النص وإعدادات التوليد. يمكنك تعديلها وإعادة التوليد.", "السجل القديم لا يحتوي على إعدادات كاملة. تمت استعادة النص المتاح فقط وبقيت الإعدادات الأخرى كما هي."],
  vi: ["Đã khôi phục lời nhắc và cấu hình. Có thể sửa rồi tạo lại.", "Bản ghi cũ không có cấu hình đầy đủ. Chỉ khôi phục lời nhắc có sẵn; các cài đặt khác giữ nguyên."],
  id: ["Prompt dan pengaturan dipulihkan. Edit untuk membuat ulang.", "Riwayat lama tidak memiliki pengaturan lengkap. Hanya prompt yang tersedia dipulihkan; pengaturan lain tetap."],
  ru: ["Промпт и параметры восстановлены. Измените их для повторной генерации.", "В старой записи нет полных параметров. Восстановлен только сохранённый промпт; остальные настройки не изменены."]
};

const storyTranslations = {
  "zh-CN": { storyboardTitle: "故事自动分镜", storyboardStory: "故事文本", storyboardPlaceholder: "粘贴完整故事（最多 30,000 字符），包含人物、情节与结尾。", storyboardHint: "本机文本模型生成可编辑镜头并追加到现有分镜；不会自动开始视频生成。", storyboardCount: "生成镜头数", storyboardGenerate: "生成并添加分镜", storyboardGenerating: "正在分析故事并生成分镜…", storyboardAdded: "分镜已添加，请审阅后保存。", storyboardInvalid: "请输入故事（最多 30,000 字符）和有效镜头数，镜头总数不得超过 1800。" },
  en: { storyboardTitle: "Automatic storyboarding", storyboardStory: "Story text", storyboardPlaceholder: "Paste the complete story (up to 30,000 characters), including characters, plot and ending.", storyboardHint: "The local text model appends editable shots; video generation does not start automatically.", storyboardCount: "Number of new shots", storyboardGenerate: "Generate & add shots", storyboardGenerating: "Analyzing story and planning shots…", storyboardAdded: "Shots added. Review and save the storyboard.", storyboardInvalid: "Enter a story (up to 30,000 characters) and a valid shot count; the total cannot exceed 1800." },
  "zh-TW": { storyboardTitle: "故事自動分鏡", storyboardStory: "故事文字", storyboardPlaceholder: "貼上完整故事（最多 30,000 字元），包含人物、情節與結尾。", storyboardHint: "本機文字模型產生可編輯鏡頭並追加至現有分鏡；不會自動開始影片生成。", storyboardCount: "生成鏡頭數", storyboardGenerate: "生成並新增分鏡", storyboardGenerating: "正在分析故事並產生分鏡…", storyboardAdded: "分鏡已新增，請審閱後儲存。", storyboardInvalid: "請輸入故事（最多 30,000 字元）與有效鏡頭數，鏡頭總數不得超過 1800。" },
  fr: { storyboardTitle: "Storyboard automatique", storyboardStory: "Texte du récit", storyboardPlaceholder: "Collez le récit complet (30 000 caractères maximum), personnages, intrigue et fin inclus.", storyboardHint: "Le modèle local ajoute des plans modifiables sans lancer la génération vidéo.", storyboardCount: "Nombre de nouveaux plans", storyboardGenerate: "Créer et ajouter les plans", storyboardGenerating: "Analyse du récit et création des plans…", storyboardAdded: "Plans ajoutés. Vérifiez et enregistrez le storyboard.", storyboardInvalid: "Saisissez un récit (30 000 caractères maximum) et un nombre valide ; 1800 plans au total maximum." },
  de: { storyboardTitle: "Automatisches Storyboard", storyboardStory: "Geschichte", storyboardPlaceholder: "Vollständige Geschichte mit Figuren, Handlung und Ende einfügen (max. 30.000 Zeichen).", storyboardHint: "Das lokale Textmodell fügt bearbeitbare Aufnahmen hinzu, ohne die Videogenerierung zu starten.", storyboardCount: "Anzahl neuer Aufnahmen", storyboardGenerate: "Aufnahmen erstellen und hinzufügen", storyboardGenerating: "Geschichte wird analysiert und geplant…", storyboardAdded: "Aufnahmen hinzugefügt. Storyboard prüfen und speichern.", storyboardInvalid: "Geschichte (max. 30.000 Zeichen) und gültige Anzahl eingeben; insgesamt höchstens 1800 Aufnahmen." },
  ja: { storyboardTitle: "ストーリーの自動絵コンテ", storyboardStory: "ストーリー本文", storyboardPlaceholder: "登場人物、展開、結末を含む全文を入力（最大30,000文字）。", storyboardHint: "ローカルテキストモデルが編集可能なショットを追加します。動画生成は自動開始しません。", storyboardCount: "追加ショット数", storyboardGenerate: "絵コンテを生成して追加", storyboardGenerating: "ストーリーを分析し絵コンテを生成中…", storyboardAdded: "ショットを追加しました。確認して保存してください。", storyboardInvalid: "ストーリー（最大30,000文字）と有効なショット数を入力してください。合計1800以下です。" },
  ko: { storyboardTitle: "스토리 자동 스토리보드", storyboardStory: "스토리 텍스트", storyboardPlaceholder: "인물, 줄거리와 결말을 포함한 전체 스토리(최대 30,000자)를 입력하세요.", storyboardHint: "로컬 텍스트 모델이 편집 가능한 샷을 추가합니다. 영상 생성은 자동 시작하지 않습니다.", storyboardCount: "새 샷 수", storyboardGenerate: "샷 생성 및 추가", storyboardGenerating: "스토리 분석 및 샷 생성 중…", storyboardAdded: "샷이 추가되었습니다. 검토 후 저장하세요.", storyboardInvalid: "스토리(최대 30,000자)와 올바른 샷 수를 입력하세요. 총 1800개 이하입니다." },
  es: { storyboardTitle: "Storyboard automático", storyboardStory: "Texto de la historia", storyboardPlaceholder: "Pega la historia completa (máximo 30.000 caracteres), con personajes, trama y final.", storyboardHint: "El modelo local añade planos editables sin iniciar la generación de vídeo.", storyboardCount: "Número de planos nuevos", storyboardGenerate: "Generar y añadir planos", storyboardGenerating: "Analizando la historia y creando planos…", storyboardAdded: "Planos añadidos. Revisa y guarda el storyboard.", storyboardInvalid: "Introduce una historia (máximo 30.000 caracteres) y una cantidad válida; máximo 1800 planos en total." },
  pt: { storyboardTitle: "Storyboard automático", storyboardStory: "Texto da história", storyboardPlaceholder: "Cole a história completa (até 30.000 caracteres), com personagens, enredo e final.", storyboardHint: "O modelo local adiciona cenas editáveis sem iniciar a geração de vídeo.", storyboardCount: "Número de novas cenas", storyboardGenerate: "Gerar e adicionar cenas", storyboardGenerating: "Analisando a história e criando cenas…", storyboardAdded: "Cenas adicionadas. Revise e salve o storyboard.", storyboardInvalid: "Insira uma história (até 30.000 caracteres) e uma quantidade válida; máximo de 1800 cenas no total." },
  tr: { storyboardTitle: "Otomatik hikâye panosu", storyboardStory: "Hikâye metni", storyboardPlaceholder: "Karakterler, olay örgüsü ve sonuyla tam hikâyeyi yapıştırın (en fazla 30.000 karakter).", storyboardHint: "Yerel metin modeli düzenlenebilir sahneler ekler; video üretimi otomatik başlamaz.", storyboardCount: "Yeni sahne sayısı", storyboardGenerate: "Sahneleri oluştur ve ekle", storyboardGenerating: "Hikâye analiz ediliyor ve sahneler planlanıyor…", storyboardAdded: "Sahneler eklendi. Panoyu inceleyip kaydedin.", storyboardInvalid: "Hikâye (en fazla 30.000 karakter) ve geçerli sayı girin; toplam en fazla 1800 sahne." },
  ar: { storyboardTitle: "تقسيم القصة تلقائيًا", storyboardStory: "نص القصة", storyboardPlaceholder: "ألصق القصة كاملة مع الشخصيات والحبكة والنهاية (حتى 30,000 حرف).", storyboardHint: "يضيف النموذج المحلي لقطات قابلة للتحرير دون بدء إنشاء الفيديو تلقائيًا.", storyboardCount: "عدد اللقطات الجديدة", storyboardGenerate: "إنشاء اللقطات وإضافتها", storyboardGenerating: "جارٍ تحليل القصة وتخطيط اللقطات…", storyboardAdded: "أُضيفت اللقطات. راجع المخطط واحفظه.", storyboardInvalid: "أدخل قصة (حتى 30,000 حرف) وعددًا صحيحًا؛ الحد الإجمالي 1800 لقطة." },
  vi: { storyboardTitle: "Phân cảnh tự động", storyboardStory: "Văn bản câu chuyện", storyboardPlaceholder: "Dán toàn bộ câu chuyện (tối đa 30.000 ký tự), gồm nhân vật, cốt truyện và kết thúc.", storyboardHint: "Mô hình cục bộ thêm các cảnh có thể chỉnh sửa; không tự bắt đầu tạo video.", storyboardCount: "Số cảnh mới", storyboardGenerate: "Tạo và thêm cảnh", storyboardGenerating: "Đang phân tích câu chuyện và tạo cảnh…", storyboardAdded: "Đã thêm cảnh. Hãy kiểm tra và lưu.", storyboardInvalid: "Nhập câu chuyện (tối đa 30.000 ký tự) và số cảnh hợp lệ; tổng không quá 1800." },
  id: { storyboardTitle: "Storyboard otomatis", storyboardStory: "Teks cerita", storyboardPlaceholder: "Tempel cerita lengkap (maksimal 30.000 karakter), termasuk tokoh, alur dan akhir.", storyboardHint: "Model lokal menambahkan adegan yang dapat diedit tanpa memulai generasi video otomatis.", storyboardCount: "Jumlah adegan baru", storyboardGenerate: "Buat dan tambahkan adegan", storyboardGenerating: "Menganalisis cerita dan membuat adegan…", storyboardAdded: "Adegan ditambahkan. Tinjau dan simpan storyboard.", storyboardInvalid: "Masukkan cerita (maksimal 30.000 karakter) dan jumlah yang valid; total maksimal 1800 adegan." },
  ru: { storyboardTitle: "Автоматическая раскадровка", storyboardStory: "Текст истории", storyboardPlaceholder: "Вставьте всю историю (до 30 000 символов), включая героев, сюжет и концовку.", storyboardHint: "Локальная модель добавляет редактируемые кадры, не запуская генерацию видео.", storyboardCount: "Число новых кадров", storyboardGenerate: "Создать и добавить кадры", storyboardGenerating: "Анализ истории и создание кадров…", storyboardAdded: "Кадры добавлены. Проверьте и сохраните раскадровку.", storyboardInvalid: "Введите историю (до 30 000 символов) и допустимое число кадров; максимум 1800 в сумме." },
};

const musicQuickKeys = ["musicQuickTitle", "musicQuickHint", "musicQuickGenres", "musicQuickMoods", "musicQuickVocals", "musicQuickRhythm", "musicQuickPop", "musicQuickRock", "musicQuickHip", "musicQuickTraditional", "musicQuickPositive", "musicQuickSad", "musicQuickEpic", "musicQuickVoice", "musicQuickTechnique", "musicQuickInstruments", "musicQuickTempo", "musicQuickLimit"];
const musicQuickTranslations = {
  "zh-CN": ["音乐快速设置", "点击关键词添加到提示词，再次点击移除。英文关键词用于模型输入；不会更改歌词、人声模式或采样参数。", "音乐风格", "情感与氛围", "人声特征", "乐器与节奏", "流行 / 电子", "摇滚 / 金属", "说唱 / R&B", "中国风 / 传统", "积极 / 治愈", "忧伤 / 深沉", "紧张 / 史诗", "性别与音色", "演唱技巧", "乐器", "速度", "提示词已达长度上限，请先缩短内容。"],
  en: ["Music quick settings", "Click a keyword to add it to the prompt; click again to remove it. English keywords are model inputs; lyrics, vocal mode and sampling settings stay unchanged.", "Genres", "Moods", "Vocals", "Instruments & tempo", "Pop / electronic", "Rock / metal", "Hip-hop / R&B", "Chinese / traditional", "Positive / healing", "Sad / deep", "Tense / epic", "Voice & timbre", "Singing techniques", "Instruments", "Tempo", "The prompt is too long. Shorten it before adding a keyword."],
  "zh-TW": ["音樂快速設定", "點擊關鍵詞加入提示詞，再次點擊移除。英文關鍵詞供模型輸入；不更改歌詞、人聲模式或採樣參數。", "音樂風格", "情感與氛圍", "人聲特徵", "樂器與節奏", "流行 / 電子", "搖滾 / 金屬", "饒舌 / R&B", "中國風 / 傳統", "積極 / 療癒", "憂傷 / 深沉", "緊張 / 史詩", "性別與音色", "演唱技巧", "樂器", "速度", "提示詞已達長度上限，請先縮短內容。"],
  fr: ["Réglages rapides de musique", "Cliquez pour ajouter un mot-clé anglais au prompt, puis pour le retirer. Paroles, mode vocal et paramètres restent inchangés.", "Genres", "Émotions et ambiance", "Voix", "Instruments et tempo", "Pop / électronique", "Rock / métal", "Rap / R&B", "Chinois / traditionnel", "Positif / apaisant", "Triste / profond", "Tendu / épique", "Voix et timbre", "Techniques vocales", "Instruments", "Tempo", "Le prompt est trop long. Raccourcissez-le avant d’ajouter un mot-clé."],
  de: ["Musik-Schnelleinstellungen", "Klicken fügt englische Stichwörter zum Prompt hinzu; erneut klicken entfernt sie. Liedtext, Gesangsmodus und Parameter bleiben unverändert.", "Genres", "Stimmung", "Gesang", "Instrumente und Tempo", "Pop / Elektronik", "Rock / Metal", "Rap / R&B", "Chinesisch / traditionell", "Positiv / beruhigend", "Traurig / tief", "Spannend / episch", "Stimme und Klangfarbe", "Gesangstechniken", "Instrumente", "Tempo", "Der Prompt ist zu lang. Vor dem Hinzufügen kürzen."],
  ja: ["音楽クイック設定", "クリックで英語キーワードをプロンプトに追加、再クリックで削除します。歌詞、ボーカルモード、生成パラメータは変更しません。", "ジャンル", "感情と雰囲気", "ボーカル", "楽器とテンポ", "ポップ / 電子音楽", "ロック / メタル", "ラップ / R&B", "中国風 / 伝統", "前向き / 癒し", "悲しみ / 深み", "緊張 / 壮大", "声と音色", "歌唱技法", "楽器", "テンポ", "プロンプトが長すぎます。短くしてから追加してください。"],
  ko: ["음악 빠른 설정", "클릭하면 영어 키워드를 프롬프트에 추가하고 다시 클릭하면 제거합니다. 가사, 보컬 모드 및 생성 설정은 바뀌지 않습니다.", "장르", "감정과 분위기", "보컬", "악기와 템포", "팝 / 전자음악", "록 / 메탈", "랩 / R&B", "중국풍 / 전통", "긍정 / 치유", "슬픔 / 깊이", "긴장 / 서사", "목소리와 음색", "가창 기법", "악기", "템포", "프롬프트가 너무 깁니다. 키워드 추가 전에 줄이세요."],
  es: ["Ajustes rápidos de música", "Pulsa para añadir palabras clave en inglés al prompt y otra vez para quitarlas. No cambia la letra, el modo vocal ni los parámetros.", "Géneros", "Emociones y ambiente", "Voces", "Instrumentos y tempo", "Pop / electrónica", "Rock / metal", "Rap / R&B", "Chino / tradicional", "Positivo / relajante", "Triste / profundo", "Tenso / épico", "Voz y timbre", "Técnicas vocales", "Instrumentos", "Tempo", "El prompt es demasiado largo. Acórtalo antes de añadir palabras."],
  pt: ["Configuração rápida de música", "Clique para adicionar palavras-chave em inglês ao prompt e novamente para remover. Letras, modo vocal e parâmetros não mudam.", "Gêneros", "Emoções e ambiente", "Vozes", "Instrumentos e tempo", "Pop / eletrônica", "Rock / metal", "Rap / R&B", "Chinês / tradicional", "Positivo / relaxante", "Triste / profundo", "Tenso / épico", "Voz e timbre", "Técnicas vocais", "Instrumentos", "Tempo", "O prompt é longo demais. Reduza-o antes de adicionar palavras."],
  tr: ["Müzik hızlı ayarları", "İngilizce anahtar sözcük eklemek için tıklayın; kaldırmak için yeniden tıklayın. Sözler, vokal modu ve üretim ayarları değişmez.", "Türler", "Duygu ve atmosfer", "Vokaller", "Enstrüman ve tempo", "Pop / elektronik", "Rock / metal", "Rap / R&B", "Çin / geleneksel", "Olumlu / rahatlatıcı", "Hüzünlü / derin", "Gergin / epik", "Ses ve tını", "Şarkı teknikleri", "Enstrümanlar", "Tempo", "İstem çok uzun. Sözcük eklemeden önce kısaltın."],
  ar: ["إعدادات الموسيقى السريعة", "انقر لإضافة كلمة إنجليزية إلى الوصف ثم انقر مجددًا لإزالتها. لا تتغير الكلمات أو وضع الصوت أو إعدادات التوليد.", "الأنواع", "المشاعر والأجواء", "الغناء", "الآلات والإيقاع", "بوب / إلكتروني", "روك / ميتال", "راب / R&B", "صيني / تقليدي", "إيجابي / مريح", "حزين / عميق", "متوتر / ملحمي", "الصوت والنبرة", "تقنيات الغناء", "الآلات", "السرعة", "الوصف طويل جدًا. اختصره قبل إضافة كلمة."],
  vi: ["Thiết lập nhanh âm nhạc", "Nhấn để thêm từ khóa tiếng Anh vào lời nhắc, nhấn lại để xóa. Không đổi lời bài hát, chế độ giọng hát hay tham số tạo.", "Thể loại", "Cảm xúc và không khí", "Giọng hát", "Nhạc cụ và nhịp độ", "Pop / điện tử", "Rock / metal", "Rap / R&B", "Trung Hoa / truyền thống", "Tích cực / chữa lành", "Buồn / sâu lắng", "Căng thẳng / sử thi", "Giọng và âm sắc", "Kỹ thuật hát", "Nhạc cụ", "Nhịp độ", "Lời nhắc quá dài. Hãy rút ngắn trước khi thêm từ khóa."],
  id: ["Pengaturan cepat musik", "Klik untuk menambah kata kunci Inggris ke prompt, klik lagi untuk menghapus. Lirik, mode vokal, dan parameter tidak berubah.", "Genre", "Emosi dan suasana", "Vokal", "Instrumen dan tempo", "Pop / elektronik", "Rock / metal", "Rap / R&B", "Tiongkok / tradisional", "Positif / menenangkan", "Sedih / mendalam", "Tegang / epik", "Suara dan warna nada", "Teknik bernyanyi", "Instrumen", "Tempo", "Prompt terlalu panjang. Pendekkan sebelum menambah kata kunci."],
  ru: ["Быстрые настройки музыки", "Нажмите, чтобы добавить английское ключевое слово в запрос; повторное нажатие удаляет его. Текст песни, вокальный режим и параметры не меняются.", "Жанры", "Эмоции и атмосфера", "Вокал", "Инструменты и темп", "Поп / электроника", "Рок / метал", "Рэп / R&B", "Китайское / традиционное", "Позитив / спокойствие", "Грусть / глубина", "Напряжение / эпос", "Голос и тембр", "Вокальные техники", "Инструменты", "Темп", "Запрос слишком длинный. Сократите его перед добавлением слова."],
};
musicQuickKeys.push("musicQuickVocalTone");
for (const [language, label] of Object.entries({
  "zh-CN": "音色特征",
  "zh-TW": "音色特徵",
  en: "Vocal tone",
  fr: "Timbre vocal",
  de: "Stimmklang",
  ja: "声の音色",
  ko: "보컬 음색",
  es: "Timbre vocal",
  pt: "Timbre vocal",
  tr: "Vokal tınısı",
  ar: "طابع الصوت",
  vi: "Âm sắc giọng hát",
  id: "Warna suara",
  ru: "Тембр голоса"
})) {
  musicQuickTranslations[language].push(label);
}
const musicKeywordCategories = [
  ["musicQuickGenres", [
    ["musicQuickPop", ["Pop", "Synth-pop", "EDM", "House", "Ambient","Rural"]],
    ["musicQuickRock", ["Rock", "Alternative rock", "Punk", "Heavy metal"]],
    ["musicQuickHip", ["Hip-hop", "Trap", "R&B", "Lo-fi hip hop","Blues wailing"]],
    ["musicQuickTraditional", ["Traditional Chinese", "Guzheng", "Erhu", "Gu-feng","Ballad"]],
  ]],
  ["musicQuickMoods", [
    ["musicQuickPositive", ["Uplifting", "Hopeful", "Relaxing", "Warm", "Joyful"]],
    ["musicQuickSad", ["Melancholic", "Sad", "Dark", "Nostalgic", "Emotional"]],
    ["musicQuickEpic", ["Epic", "Aggressive", "Mysterious", "Tense"]],
  ]],
  ["musicQuickVocals", [
    ["musicQuickVoice", ["Male vocals", "Female vocals", "Duet","Soprano","Alto", "Tenor", "Baritone / Bass"]],
    ["musicQuickVocalTone", ["Breathy", "Gravelly / Raspy", "Soulful", "Clear", "Huskier", "Operatic"]],
    ["musicQuickTechnique", ["A cappella", "Falsetto", "Autotune", "Choir"]],
  ]],
  ["musicQuickRhythm", [
    ["musicQuickInstruments", ["Acoustic guitar", "Electric guitar", "Piano", "Cello", "808 bass", "Synth pads"]],
    ["musicQuickTempo", ["Slow tempo", "Fast tempo", "90 BPM", "Upbeat"]],
  ]],
];

function musicKeywordMatch(prompt, keyword) {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(^|[,;\\n])\\s*(${escaped})\\s*(?=$|[,;\\n])`, "i").exec(prompt);
}

function toggleMusicKeyword(prompt, keyword, maxLength) {
  const match = musicKeywordMatch(prompt, keyword);
  if (match) {
    const end = match.index + match[0].length;
    const next = prompt.slice(end);
    return prompt.slice(0, match.index) + (match.index === 0 ? next.replace(/^[,;\n]\s*/, "") : next);
  }
  const separator = !prompt || /[,;\n]\s*$/.test(prompt) ? "" : ", ";
  const value = `${prompt}${separator}${keyword}`;
  if (value.length > maxLength) throw new RangeError("music_keyword_prompt_too_long");
  return value;
}

function syncMusicKeywords() {
  document.querySelectorAll("[data-music-keyword]").forEach(button => {
    button.setAttribute("aria-pressed", String(Boolean(musicKeywordMatch(promptInput.value, button.dataset.musicKeyword))));
  });
}

function renderMusicKeywords() {
  const container = document.querySelector("#music-keyword-groups");
  if (container.childElementCount) {
    syncMusicKeywords();
    return;
  }
  for (const [category, groups] of musicKeywordCategories) {
    const details = document.createElement("details");
    details.className = "music-keyword-category";
    const summary = document.createElement("summary");
    const title = document.createElement("span");
    title.dataset.i18n = category;
    title.textContent = t(category);
    const icon = document.createElement("span");
    icon.className = "music-fold-icon";
    icon.setAttribute("aria-hidden", "true");
    summary.append(title, icon);
    details.append(summary);
    for (const [label, keywords] of groups) {
      const heading = document.createElement("p");
      heading.dataset.i18n = label;
      heading.textContent = t(label);
      const options = document.createElement("div");
      options.className = "music-keyword-options";
      options.setAttribute("role", "group");
      const headingId = `music-keywords-${label}`;
      heading.id = headingId;
      options.setAttribute("aria-labelledby", headingId);
      for (const keyword of keywords) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = keyword;
        button.dataset.musicKeyword = keyword;
        button.addEventListener("click", () => {
          if (button.disabled || activeMode !== "music") return;
          const status = document.querySelector("#music-keyword-status");
          try {
            promptInput.value = toggleMusicKeyword(promptInput.value, keyword, promptInput.maxLength);
          } catch (error) {
            if (!(error instanceof RangeError)) throw error;
            status.dataset.i18n = "musicQuickLimit";
            status.textContent = t("musicQuickLimit");
            status.hidden = false;
            return;
          }
          status.hidden = true;
          promptInput.dispatchEvent(new Event("input", { bubbles: true }));
        });
        options.append(button);
      }
      details.append(heading, options);
    }
    container.append(details);
  }
  syncMusicKeywords();
}

const localModelTranslations = {
  "zh-CN": { generationModel: "生成模型", imageResolution: "图像分辨率", localReady: "本地模型已就绪", localMissing: "模型或推理环境未就绪", distilledNote: "蒸馏 1.1：8 步初稿 + 3 步细化，24 fps，低内存模式。画布最长边 512 像素；帧数按 8n+1 对齐。", localImageNote: "本地 MLX 4-bit 推理。Klein 固定 4 步，Z-Image-Turbo 固定 9 步。", localModelError: "所选模型或本地推理环境尚未就绪，请检查安装。" },
  en: { generationModel: "Generation model", imageResolution: "Image resolution", localReady: "Local model ready", localMissing: "Model or runtime not ready", distilledNote: "Distilled 1.1: 8 draft + 3 refine steps, 24 fps, low-memory mode. Long edge 512 px; frames aligned to 8n+1.", localImageNote: "Local MLX 4-bit inference. Klein uses 4 steps; Z-Image-Turbo uses 9.", localModelError: "The selected model or local runtime is not ready. Check installation." },
  "zh-TW": { generationModel: "生成模型", imageResolution: "圖片解析度", localReady: "本機模型已就緒", localMissing: "模型或推理環境未就緒", distilledNote: "蒸餾 1.1：8 步初稿 + 3 步細化，24 fps，低記憶體模式。長邊 512 像素；影格按 8n+1 對齊。", localImageNote: "本機 MLX 4-bit 推理。Klein 固定 4 步，Z-Image-Turbo 固定 9 步。", localModelError: "所選模型或本機推理環境尚未就緒，請檢查安裝。" },
  fr: { generationModel: "Modèle de génération", imageResolution: "Résolution de l’image", localReady: "Modèle local prêt", localMissing: "Modèle ou moteur indisponible", distilledNote: "Distillé 1.1 : 8 étapes + 3 de finition, 24 fps, mémoire réduite. Grand côté 512 px ; images 8n+1.", localImageNote: "Inférence MLX locale 4 bits. Klein : 4 étapes ; Z-Image-Turbo : 9.", localModelError: "Le modèle ou moteur local n’est pas prêt. Vérifiez l’installation." },
  de: { generationModel: "Generierungsmodell", imageResolution: "Bildauflösung", localReady: "Lokales Modell bereit", localMissing: "Modell oder Laufzeit nicht bereit", distilledNote: "Distilled 1.1: 8 + 3 Verfeinerungsschritte, 24 fps, wenig Speicher. Lange Seite 512 px; Frames 8n+1.", localImageNote: "Lokale MLX-Inferenz mit 4 Bit. Klein: 4 Schritte; Z-Image-Turbo: 9.", localModelError: "Modell oder lokale Laufzeit nicht bereit. Installation prüfen." },
  ja: { generationModel: "生成モデル", imageResolution: "画像解像度", localReady: "ローカルモデル準備完了", localMissing: "モデルまたは実行環境が未準備", distilledNote: "蒸留 1.1：8 ステップ + 仕上げ 3、24 fps、省メモリ。長辺 512 px、フレーム数 8n+1。", localImageNote: "ローカル MLX 4-bit 推論。Klein は 4 ステップ、Z-Image-Turbo は 9。", localModelError: "モデルまたは実行環境が未準備です。インストールを確認してください。" },
  ko: { generationModel: "생성 모델", imageResolution: "이미지 해상도", localReady: "로컬 모델 준비됨", localMissing: "모델 또는 실행 환경 준비 안 됨", distilledNote: "증류 1.1: 초안 8 + 보정 3 단계, 24 fps, 저메모리. 긴 변 512 px, 프레임 8n+1.", localImageNote: "로컬 MLX 4-bit 추론. Klein 4단계, Z-Image-Turbo 9단계.", localModelError: "모델 또는 로컬 실행 환경이 준비되지 않았습니다. 설치를 확인하세요." },
  es: { generationModel: "Modelo de generación", imageResolution: "Resolución de imagen", localReady: "Modelo local listo", localMissing: "Modelo o motor no disponible", distilledNote: "Destilado 1.1: 8 pasos + 3 de refinamiento, 24 fps, memoria reducida. Lado largo 512 px; fotogramas 8n+1.", localImageNote: "Inferencia MLX local de 4 bits. Klein: 4 pasos; Z-Image-Turbo: 9.", localModelError: "El modelo o motor local no está listo. Comprueba la instalación." },
  pt: { generationModel: "Modelo de geração", imageResolution: "Resolução da imagem", localReady: "Modelo local pronto", localMissing: "Modelo ou runtime indisponível", distilledNote: "Destilado 1.1: 8 passos + 3 de refinamento, 24 fps, pouca memória. Lado maior 512 px; quadros 8n+1.", localImageNote: "Inferência MLX local de 4 bits. Klein: 4 passos; Z-Image-Turbo: 9.", localModelError: "O modelo ou runtime local não está pronto. Verifique a instalação." },
  tr: { generationModel: "Üretim modeli", imageResolution: "Görsel çözünürlüğü", localReady: "Yerel model hazır", localMissing: "Model veya çalışma ortamı hazır değil", distilledNote: "Damıtılmış 1.1: 8 + 3 iyileştirme adımı, 24 fps, düşük bellek. Uzun kenar 512 px; kareler 8n+1.", localImageNote: "Yerel MLX 4-bit çıkarım. Klein: 4 adım; Z-Image-Turbo: 9.", localModelError: "Model veya yerel çalışma ortamı hazır değil. Kurulumu kontrol edin." },
  ar: { generationModel: "نموذج التوليد", imageResolution: "دقة الصورة", localReady: "النموذج المحلي جاهز", localMissing: "النموذج أو بيئة التشغيل غير جاهز", distilledNote: "التقطير 1.1: ‏8 خطوات + 3 تحسين، 24 إطارًا/ث، ذاكرة منخفضة. الضلع الأطول 512 بكسل؛ الإطارات 8n+1.", localImageNote: "استدلال MLX محلي 4 بت. Klein: ‏4 خطوات؛ Z-Image-Turbo: ‏9.", localModelError: "النموذج أو بيئة التشغيل غير جاهز. تحقق من التثبيت." },
  vi: { generationModel: "Mô hình tạo", imageResolution: "Độ phân giải ảnh", localReady: "Mô hình cục bộ sẵn sàng", localMissing: "Mô hình hoặc môi trường chưa sẵn sàng", distilledNote: "Chưng cất 1.1: 8 bước + 3 tinh chỉnh, 24 fps, ít bộ nhớ. Cạnh dài 512 px; khung hình 8n+1.", localImageNote: "Suy luận MLX cục bộ 4-bit. Klein: 4 bước; Z-Image-Turbo: 9.", localModelError: "Mô hình hoặc môi trường cục bộ chưa sẵn sàng. Kiểm tra cài đặt." },
  id: { generationModel: "Model generasi", imageResolution: "Resolusi gambar", localReady: "Model lokal siap", localMissing: "Model atau runtime belum siap", distilledNote: "Distilasi 1.1: 8 langkah + 3 penyempurnaan, 24 fps, memori rendah. Sisi panjang 512 px; bingkai 8n+1.", localImageNote: "Inferensi MLX lokal 4-bit. Klein: 4 langkah; Z-Image-Turbo: 9.", localModelError: "Model atau runtime lokal belum siap. Periksa instalasi." },
  ru: { generationModel: "Модель генерации", imageResolution: "Разрешение изображения", localReady: "Локальная модель готова", localMissing: "Модель или среда не готова", distilledNote: "Дистилляция 1.1: 8 + 3 шага уточнения, 24 fps, экономия памяти. Длинная сторона 512 px; кадры 8n+1.", localImageNote: "Локальный MLX, 4 бита. Klein: 4 шага; Z-Image-Turbo: 9.", localModelError: "Модель или локальная среда не готова. Проверьте установку." },
};
const modelPickerTranslations = {
  "zh-CN": "模型选择",
  "zh-TW": "模型選擇",
  en: "Model selection",
  fr: "Sélection des modèles",
  de: "Modellauswahl",
  ja: "モデル選択",
  ko: "모델 선택",
  es: "Selección de modelos",
  pt: "Seleção de modelos",
  tr: "Model seçimi",
  ar: "اختيار النموذج",
  vi: "Chọn mô hình",
  id: "Pemilihan model",
  ru: "Выбор модели",
};
const fastH3Translations = {
  en: "FastH3 VSA Q8: fixed 4 evaluations (5 schedule points), 24 fps, generated audio. Long edge 512/768/1024 px, 32 px grid. Try preview first on 64 GB; higher resolution needs more memory. No extra Turbo LoRA.",
  "zh-CN": "FastH3 VSA Q8：固定4次模型求值（5个调度点），24 fps，原生音轨。长边512/768/1024像素，32像素对齐。64 GB建议先用预览；更高分辨率增加内存。不可额外叠加Turbo LoRA。",
  "zh-TW": "FastH3 VSA Q8：固定4次模型求值（5個調度點），24 fps，原生音軌。長邊512/768/1024像素，32像素對齊。64 GB建議先用預覽；更高解析度增加記憶體。不可額外疊加Turbo LoRA。",
  fr: "FastH3 VSA Q8 : 4 évaluations fixes (5 points), 24 fps, audio généré. Grand côté 512/768/1024 px, grille 32 px. Sur 64 Go, commencer par l’aperçu ; la haute résolution exige plus de mémoire. Sans Turbo LoRA supplémentaire.",
  de: "FastH3 VSA Q8: feste 4 Auswertungen (5 Punkte), 24 fps, generierter Ton. Lange Seite 512/768/1024 px, Raster 32 px. Bei 64 GB zuerst Vorschau; höhere Auflösung benötigt mehr Speicher. Kein zusätzliches Turbo-LoRA.",
  ja: "FastH3 VSA Q8：固定4回の評価（5調度点）、24 fps、音声生成。長辺512/768/1024 px、32 px単位。64 GBではまずプレビュー。高解像度はメモリを増加。Turbo LoRAの追加不可。",
  ko: "FastH3 VSA Q8: 고정 4회 평가(5개 스케줄 지점), 24 fps, 오디오 생성. 긴 변 512/768/1024 px, 32 px 정렬. 64 GB에서는 미리보기부터 시작하세요. 고해상도는 메모리를 더 사용합니다. 추가 Turbo LoRA 금지.",
  es: "FastH3 VSA Q8: 4 evaluaciones fijas (5 puntos), 24 fps, audio generado. Lado largo 512/768/1024 px, cuadrícula 32 px. En 64 GB, empezar con vista previa; más resolución exige memoria. Sin Turbo LoRA adicional.",
  pt: "FastH3 VSA Q8: 4 avaliações fixas (5 pontos), 24 fps, áudio gerado. Lado maior 512/768/1024 px, grade 32 px. Em 64 GB, comece pela prévia; mais resolução exige memória. Sem Turbo LoRA adicional.",
  tr: "FastH3 VSA Q8: sabit 4 değerlendirme (5 nokta), 24 fps, üretilen ses. Uzun kenar 512/768/1024 px, 32 px ızgara. 64 GB için önce önizleme; yüksek çözünürlük daha çok bellek ister. Ek Turbo LoRA yok.",
  ar: "FastH3 VSA Q8: ‏4 تقييمات ثابتة (5 نقاط)، 24 إطارًا/ث، صوت مولّد. الضلع الأطول 512/768/1024 بكسل، شبكة 32 بكسل. على 64 GB ابدأ بالمعاينة؛ الدقة الأعلى تستهلك ذاكرة أكثر. دون Turbo LoRA إضافي.",
  vi: "FastH3 VSA Q8: 4 lần đánh giá cố định (5 điểm), 24 fps, âm thanh tạo sẵn. Cạnh dài 512/768/1024 px, lưới 32 px. Với 64 GB hãy xem trước; độ phân giải cao cần thêm bộ nhớ. Không thêm Turbo LoRA.",
  id: "FastH3 VSA Q8: tetap 4 evaluasi (5 titik), 24 fps, audio dihasilkan. Sisi panjang 512/768/1024 px, kisi 32 px. Pada 64 GB mulai dengan pratinjau; resolusi tinggi perlu lebih banyak memori. Tanpa Turbo LoRA tambahan.",
  ru: "FastH3 VSA Q8: фиксированные 4 оценки (5 точек), 24 fps, генерация звука. Длинная сторона 512/768/1024 px, сетка 32 px. На 64 GB начните с предпросмотра; высокое разрешение требует больше памяти. Без дополнительного Turbo LoRA."
};
const fastH3LimitTranslations = {
  en: "Text-to-video only. Opening images and continuous shots are unsupported. Clear the image selection and choose independent shots, or switch models.",
  "zh-CN": "仅支持文本生成视频，不支持首帧图片和连续镜头。请清除图片选择并选择独立镜头，或更换模型。",
  "zh-TW": "僅支援文字生成影片，不支援首幀圖片及連續鏡頭。請清除圖片選擇並選擇獨立鏡頭，或更換模型。",
  fr: "Texte vers vidéo uniquement. Images initiales et plans continus non pris en charge. Désélectionnez l’image et choisissez des plans indépendants, ou changez de modèle.",
  de: "Nur Text-zu-Video. Startbilder und fortlaufende Szenen werden nicht unterstützt. Bildauswahl entfernen und unabhängige Szenen wählen oder Modell wechseln.",
  ja: "テキスト動画生成のみ。開始画像と連続ショットは非対応。画像選択を解除して独立ショットを選ぶか、モデルを変更してください。",
  ko: "텍스트로 영상 생성만 지원합니다. 시작 이미지와 연속 장면은 지원하지 않습니다. 이미지 선택을 지우고 독립 장면을 선택하거나 모델을 변경하세요.",
  es: "Solo texto a vídeo. No admite imágenes iniciales ni planos continuos. Quita la imagen y elige planos independientes, o cambia de modelo.",
  pt: "Somente texto para vídeo. Não suporta imagens iniciais nem cenas contínuas. Remova a seleção da imagem e escolha cenas independentes, ou mude de modelo.",
  tr: "Yalnızca metinden video. Başlangıç görüntüsü ve devamlı sahneler desteklenmez. Görüntü seçimini kaldırıp bağımsız sahneleri seçin veya modeli değiştirin.",
  ar: "نص إلى فيديو فقط. صور البداية واللقطات المتصلة غير مدعومة. ألغِ اختيار الصورة واختر لقطات مستقلة أو غيّر النموذج.",
  vi: "Chỉ tạo video từ văn bản. Không hỗ trợ ảnh đầu và cảnh liên tục. Bỏ chọn ảnh và chọn cảnh độc lập hoặc đổi mô hình.",
  id: "Hanya teks ke video. Gambar awal dan adegan berkelanjutan tidak didukung. Hapus pilihan gambar dan pilih adegan independen atau ganti model.",
  ru: "Только текст в видео. Начальные изображения и непрерывные сцены не поддерживаются. Уберите изображение и выберите независимые сцены или смените модель."
};
for (const [language, note] of Object.entries(fastH3Translations)) {
  localModelTranslations[language].fastH3Note = `${note} ${fastH3LimitTranslations[language]}`;
  localModelTranslations[language].fastH3Limit = fastH3LimitTranslations[language];
}
const ltxQualityTranslations = {
  en: ["LTX video quality", "Preview · 512", "Standard · 768", "High quality · 1024", "Final long edge 512/768/1024 px, rounded to a 64-pixel grid. 8 draft + 3 refine steps, 24 fps, low-memory mode. Higher resolution costs more time and memory; detail improvement is not guaranteed. Applies to every shot and the final long video."],
  "zh-CN": ["LTX 视频质量", "预览 · 512", "标准 · 768", "高质量 · 1024", "最终长边512/768/1024像素，画布按64像素对齐。8步初稿+3步细化，24 fps，低内存模式。更高分辨率增加耗时和内存，细节改善不作保证。长视频应用到全部镜头及最终合片。"],
  "zh-TW": ["LTX 影片品質", "預覽 · 512", "標準 · 768", "高品質 · 1024", "最終長邊512/768/1024像素，畫布按64像素對齊。8步初稿+3步細化，24 fps，低記憶體模式。更高解析度增加時間與記憶體，不保證細節改善。長影片套用至全部鏡頭及合片。"],
  fr: ["Qualité vidéo LTX", "Aperçu · 512", "Standard · 768", "Haute qualité · 1024", "Grand côté final 512/768/1024 px, grille de 64 px. 8 étapes + 3 finitions, 24 fps, mémoire réduite. Plus de résolution coûte du temps et de la mémoire, sans garantie de détail. Tous les plans et le montage final."],
  de: ["LTX-Videoqualität", "Vorschau · 512", "Standard · 768", "Hohe Qualität · 1024", "Lange Seite 512/768/1024 px, 64-Pixel-Raster. 8 + 3 Schritte, 24 fps, wenig Speicher. Höhere Auflösung kostet mehr Zeit und Speicher; Details nicht garantiert. Alle Szenen und der fertige Langfilm."],
  ja: ["LTX 動画品質", "プレビュー · 512", "標準 · 768", "高品質 · 1024", "最終長辺512/768/1024 px、64 px単位。初稿8＋仕上げ3ステップ、24 fps、省メモリ。高解像度ほど時間とメモリが増加し、詳細改善は保証しません。全ショットと長編の合成に適用。"],
  ko: ["LTX 영상 품질", "미리보기 · 512", "표준 · 768", "고품질 · 1024", "최종 긴 변 512/768/1024 px, 64 px 정렬. 초안 8+보정 3단계, 24 fps, 저메모리. 높은 해상도는 시간과 메모리를 더 쓰며 세부 개선은 보장하지 않습니다. 모든 장면과 최종 긴 영상에 적용."],
  es: ["Calidad de vídeo LTX", "Vista previa · 512", "Estándar · 768", "Alta calidad · 1024", "Lado largo final 512/768/1024 px, cuadrícula de 64 px. 8+3 pasos, 24 fps, poca memoria. Más resolución exige tiempo y memoria; detalle no garantizado. Todos los planos y el montaje final."],
  pt: ["Qualidade de vídeo LTX", "Prévia · 512", "Padrão · 768", "Alta qualidade · 1024", "Lado maior final 512/768/1024 px, grade de 64 px. 8+3 passos, 24 fps, pouca memória. Mais resolução exige tempo e memória, sem garantia de detalhe. Todas as cenas e o vídeo final."],
  tr: ["LTX video kalitesi", "Önizleme · 512", "Standart · 768", "Yüksek kalite · 1024", "Son uzun kenar 512/768/1024 px, 64 px ızgara. 8+3 adım, 24 fps, düşük bellek. Yüksek çözünürlük daha fazla zaman ve bellek ister; ayrıntı garantisi yoktur. Tüm sahneler ve son uzun video."],
  ar: ["جودة فيديو LTX", "معاينة · 512", "قياسي · 768", "جودة عالية · 1024", "الضلع النهائي الأطول 512/768/1024 بكسل، شبكة 64 بكسل. 8+3 خطوات، 24 إطارًا/ث، ذاكرة منخفضة. الدقة الأعلى تتطلب وقتًا وذاكرة أكثر دون ضمان التفاصيل. لجميع اللقطات والفيديو النهائي."],
  vi: ["Chất lượng video LTX", "Xem trước · 512", "Tiêu chuẩn · 768", "Chất lượng cao · 1024", "Cạnh dài cuối 512/768/1024 px, lưới 64 px. 8+3 bước, 24 fps, ít bộ nhớ. Độ phân giải cao tốn thời gian và bộ nhớ, không bảo đảm chi tiết. Áp dụng mọi cảnh và video dài cuối."],
  id: ["Kualitas video LTX", "Pratinjau · 512", "Standar · 768", "Kualitas tinggi · 1024", "Sisi panjang akhir 512/768/1024 px, kisi 64 px. 8+3 langkah, 24 fps, memori rendah. Resolusi tinggi memerlukan waktu dan memori lebih, tanpa jaminan detail. Semua adegan dan video akhir."],
  ru: ["Качество видео LTX", "Предпросмотр · 512", "Стандарт · 768", "Высокое качество · 1024", "Длинная сторона 512/768/1024 px, сетка 64 px. 8+3 шага, 24 fps, экономия памяти. Высокое разрешение требует больше времени и памяти; детали не гарантированы. Все сцены и итоговое длинное видео."]
};
for (const [language, values] of Object.entries(ltxQualityTranslations)) {
  Object.assign(localModelTranslations[language], {
    videoQuality: values[0], videoQualityPreview: values[1], videoQualityStandard: values[2],
    videoQualityHigh: values[3], distilledNote: values[4]
  });
}
const parameterTranslations = {
  en: ["Enter a whole number from {min} to {max}, within the current model/recipe limits.", "Use whole seconds within the selected video model's range. Total duration must divide evenly by shot duration, with at most 1800 shots. Maximum 30 minutes (1800 seconds); planning runs in batches.", "Describe this shot's subject, setting, action, camera, and lighting."],
  "zh-CN": ["可输入 {min}–{max} 范围内任意整数，范围由当前模型／配方决定。", "请在所选视频模型范围内输入整秒数；总长须能整除每镜时长，最多1800个镜头。 总长最多30分钟（1800秒），分批规划。", "描述此镜头的主体、场景、动作、运镜与光线。"],
  "zh-TW": ["可輸入 {min}–{max} 範圍內任意整數，範圍由目前模型／配方決定。", "請在所選影片模型範圍內輸入整秒數；總長須能整除每鏡時長，最多1800個鏡頭。 總長最多30分鐘（1800秒），分批規劃。", "描述此鏡頭的主體、場景、動作、運鏡與光線。"],
  fr: ["Entrez un entier de {min} à {max}, selon le modèle/la recette.", "Utilisez des secondes entières dans la plage du modèle. La durée totale doit être divisible par celle d'un plan, avec au plus 1800 plans. Maximum 30 minutes (1800 secondes) ; planification par lots.", "Décrivez le sujet, le décor, l'action, la caméra et l'éclairage du plan."],
  de: ["Geben Sie eine ganze Zahl von {min} bis {max} für das Modell/Rezept ein.", "Ganze Sekunden im Bereich des Videomodells verwenden. Die Gesamtdauer muss durch die Szenendauer teilbar sein; höchstens 1800 Szenen. Maximal 30 Minuten (1800 Sekunden); Planung in Gruppen.", "Beschreiben Sie Motiv, Umgebung, Handlung, Kamera und Licht der Szene."],
  ja: ["現在のモデル／レシピの範囲内で {min}～{max} の整数を入力できます。", "動画モデルの範囲内で整数秒を入力してください。合計は各ショットの秒数で割り切れ、最大1800ショットです。 合計は最大30分（1800秒）。分割して計画します。", "ショットの被写体、場面、動作、カメラ、照明を記述してください。"],
  ko: ["현재 모델/레시피에 따라 {min}~{max} 범위의 정수를 입력하세요.", "영상 모델 범위의 정수 초를 사용하세요. 총 길이는 장면 길이로 나누어떨어져야 하며 최대 1800장면입니다. 최대 30분(1800초). 나누어 계획합니다.", "장면의 피사체, 배경, 동작, 카메라와 조명을 설명하세요."],
  es: ["Introduzca un entero de {min} a {max}, según el modelo/la receta.", "Use segundos enteros dentro del rango del modelo. La duración total debe ser divisible por la de cada plano, con un máximo de 1800 planos. Máximo 30 minutos (1800 segundos); planificación por lotes.", "Describa el sujeto, entorno, acción, cámara e iluminación del plano."],
  pt: ["Insira um inteiro de {min} a {max}, conforme o modelo/a receita.", "Use segundos inteiros no intervalo do modelo. A duração total deve ser divisível pela de cada cena, com no máximo 1800 cenas. Máximo 30 minutos (1800 segundos); planejamento em lotes.", "Descreva o assunto, cenário, ação, câmera e iluminação da cena."],
  tr: ["Model/tarif sınırları içinde {min}–{max} arasında bir tam sayı girin.", "Video modelinin aralığında tam saniyeler kullanın. Toplam süre sahne süresine tam bölünmeli; en fazla 1800 sahne olabilir. En fazla 30 dakika (1800 saniye); gruplar halinde planlanır.", "Sahnenin konusu, ortamı, hareketi, kamerası ve ışığını anlatın."],
  ar: ["أدخل عدداً صحيحاً من {min} إلى {max} ضمن حدود النموذج/الوصفة الحالية.", "استخدم ثواني صحيحة ضمن نطاق نموذج الفيديو. يجب أن تقبل المدة الكلية القسمة على مدة اللقطة، بحد أقصى 1800 لقطة. الحد الأقصى 30 دقيقة (1800 ثانية)؛ تخطيط على دفعات.", "صف موضوع اللقطة والمكان والحركة والكاميرا والإضاءة."],
  vi: ["Nhập số nguyên từ {min} đến {max} theo giới hạn mô hình/công thức.", "Dùng số giây nguyên trong phạm vi mô hình video. Tổng thời lượng phải chia hết cho thời lượng cảnh, tối đa 1800 cảnh. Tối đa 30 phút (1800 giây); lập kế hoạch theo từng đợt.", "Mô tả chủ thể, bối cảnh, hành động, máy quay và ánh sáng của cảnh."],
  id: ["Masukkan bilangan bulat {min}–{max} sesuai batas model/resep.", "Gunakan detik bulat dalam rentang model video. Durasi total harus habis dibagi durasi adegan, maksimal 1800 adegan. Maksimal 30 menit (1800 detik); perencanaan bertahap.", "Jelaskan subjek, latar, aksi, kamera, dan pencahayaan adegan."],
  ru: ["Введите целое число от {min} до {max} в пределах модели/рецепта.", "Используйте целые секунды в диапазоне видеомодели. Общая длительность должна делиться на длительность сцены; не более 1800 сцен. Максимум 30 минут (1800 секунд); планирование партиями.", "Опишите объект, окружение, действие, камеру и освещение сцены."]
};
for (const [language, [range, timing, prompt]] of Object.entries(parameterTranslations)) {
  localModelTranslations[language].parameterRange = range;
  localModelTranslations[language].workflowShotDuration = translations[language].duration;
  localModelTranslations[language].workflowShotPromptPlaceholder = prompt;
  storyboardTimingTranslations[language][3] = timing;
}
const videoQualityModelTranslations = {
  en: ["Video quality", "H3: preview / standard / high use a 512 / 768 / 1024 px short edge with an area cap and 32 px alignment (16:9 approximately 896×512 / 1344×768 / 1792×1024). Standard preserves the original canvas. High is experimental, slower and uses much more memory; quality is not guaranteed. Applies to shots and final assembly."],
  "zh-CN": ["视频质量", "H3：预览／标准／高质量采用512／768／1024像素短边，限制面积并按32像素对齐（16:9约896×512／1344×768／1792×1024）。标准保持原画布；高质量为实验档，更慢且显著增加内存，不保证效果。应用于全部镜头及合片。"],
  "zh-TW": ["影片品質", "H3：預覽／標準／高品質採用512／768／1024像素短邊，限制面積並按32像素對齊（16:9約896×512／1344×768／1792×1024）。標準保持原畫布；高品質為實驗檔，更慢且增加記憶體，不保證效果。套用全部鏡頭及合片。"],
  fr: ["Qualité vidéo", "H3 : côté court 512/768/1024 px, surface limitée, grille 32 px (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Standard conserve la taille initiale. Haute qualité expérimentale : plus lente, plus de mémoire, résultat non garanti. Plans et montage final."],
  de: ["Videoqualität", "H3: kurze Seite 512/768/1024 px, Flächenlimit, 32-px-Raster (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Standard bleibt unverändert. Hohe Qualität experimentell: langsamer, mehr Speicher, keine Qualitätsgarantie. Szenen und Endfilm."],
  ja: ["動画品質", "H3：短辺512/768/1024 px、面積制限、32 px単位（16:9 ≈ 896×512 / 1344×768 / 1792×1024）。標準は従来の画面サイズ。高品質は実験的で時間とメモリが増え、効果は保証しません。全ショットと合成に適用。"],
  ko: ["영상 품질", "H3: 짧은 변 512/768/1024 px, 면적 제한, 32 px 정렬(16:9 ≈ 896×512 / 1344×768 / 1792×1024). 표준은 기존 크기 유지. 고품질은 실험적이며 느리고 메모리를 더 쓰고 효과는 보장하지 않습니다. 장면과 최종 영상에 적용."],
  es: ["Calidad de vídeo", "H3: lado corto 512/768/1024 px, área limitada, rejilla 32 px (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Estándar conserva el tamaño original. Alta calidad experimental: más lenta y más memoria, sin garantía. Planos y montaje."],
  pt: ["Qualidade de vídeo", "H3: lado curto 512/768/1024 px, área limitada, grade 32 px (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Padrão mantém o tamanho original. Alta qualidade experimental: mais lenta e mais memória, sem garantia. Cenas e vídeo final."],
  tr: ["Video kalitesi", "H3: kısa kenar 512/768/1024 px, alan sınırı, 32 px ızgara (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Standart eski boyutu korur. Yüksek kalite deneysel: daha yavaş ve daha çok bellek, garanti yok. Sahneler ve son video."],
  ar: ["جودة الفيديو", "H3: الضلع القصير 512/768/1024 بكسل، مساحة محدودة، شبكة 32 بكسل (16:9 ≈ 896×512 / 1344×768 / 1792×1024). القياسي يحافظ على الحجم الأصلي. الجودة العالية تجريبية وأبطأ وتستهلك ذاكرة أكثر دون ضمان. اللقطات والفيديو النهائي."],
  vi: ["Chất lượng video", "H3: cạnh ngắn 512/768/1024 px, giới hạn diện tích, lưới 32 px (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Tiêu chuẩn giữ kích thước cũ. Chất lượng cao thử nghiệm: chậm và tốn bộ nhớ, không bảo đảm. Mọi cảnh và video cuối."],
  id: ["Kualitas video", "H3: sisi pendek 512/768/1024 px, batas luas, kisi 32 px (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Standar mempertahankan ukuran lama. Kualitas tinggi eksperimental: lebih lambat, lebih banyak memori, tanpa jaminan. Adegan dan video akhir."],
  ru: ["Качество видео", "H3: короткая сторона 512/768/1024 px, ограничение площади, сетка 32 px (16:9 ≈ 896×512 / 1344×768 / 1792×1024). Стандарт сохраняет прежний размер. Высокое качество экспериментально: медленнее и больше памяти, без гарантии. Сцены и итоговый фильм."]
};
for (const [language, values] of Object.entries(videoQualityModelTranslations)) {
  Object.assign(localModelTranslations[language], {videoQuality: values[0], h3QualityNote: values[1]});
}
const musicYueNoteTranslations = {
  en: "YuE2 decides the song length from the lyric sections; duration and steps do not apply. Output 48 kHz, CC BY-NC 4.0.",
  "zh-CN": "YuE2 根据歌词段落决定歌曲时长，不使用时长与步数设置。输出 48 kHz，许可 CC BY-NC 4.0。",
  "zh-TW": "YuE2 依歌詞段落決定歌曲長度，不使用時長與步數設定。輸出 48 kHz，授權 CC BY-NC 4.0。",
  fr: "YuE2 détermine la durée à partir des sections de paroles ; durée et étapes ne s’appliquent pas. Sortie 48 kHz, CC BY-NC 4.0.",
  de: "YuE2 bestimmt die Länge anhand der Liedtextabschnitte; Dauer und Schritte entfallen. Ausgabe 48 kHz, CC BY-NC 4.0.",
  ja: "YuE2 は歌詞のセクションから曲の長さを決めます。長さとステップ設定は使用されません。出力 48 kHz、CC BY-NC 4.0。",
  ko: "YuE2는 가사 구간으로 곡 길이를 정하며 길이·단계 설정은 사용하지 않습니다. 출력 48 kHz, CC BY-NC 4.0.",
  es: "YuE2 decide la duración según las secciones de la letra; la duración y los pasos no se aplican. Salida 48 kHz, CC BY-NC 4.0.",
  pt: "O YuE2 define a duração pelas seções da letra; duração e passos não se aplicam. Saída 48 kHz, CC BY-NC 4.0.",
  tr: "YuE2 şarkı uzunluğunu söz bölümlerine göre belirler; süre ve adım ayarları kullanılmaz. Çıkış 48 kHz, CC BY-NC 4.0.",
  ar: "يحدد YuE2 طول الأغنية من مقاطع الكلمات؛ لا تُستخدم إعدادات المدة والخطوات. الإخراج 48 كيلوهرتز، الترخيص CC BY-NC 4.0.",
  vi: "YuE2 xác định độ dài bài hát theo các đoạn lời; không dùng thiết lập thời lượng và số bước. Xuất 48 kHz, CC BY-NC 4.0.",
  id: "YuE2 menentukan durasi lagu dari bagian lirik; pengaturan durasi dan langkah tidak dipakai. Keluaran 48 kHz, CC BY-NC 4.0.",
  ru: "YuE2 определяет длительность по разделам текста; длительность и шаги не применяются. Выход 48 кГц, CC BY-NC 4.0.",
};
const musicYueLinkTranslations = {
  en: "View the YuE2 model card ↗", "zh-CN": "查看 YuE2 模型卡 ↗", "zh-TW": "查看 YuE2 模型卡 ↗",
  fr: "Voir la fiche du modèle YuE2 ↗", de: "YuE2-Modellkarte ansehen ↗", ja: "YuE2 モデルカードを見る ↗",
  ko: "YuE2 모델 카드 보기 ↗", es: "Ver la ficha del modelo YuE2 ↗", pt: "Ver o cartão do modelo YuE2 ↗",
  tr: "YuE2 model kartını görüntüle ↗", ar: "عرض بطاقة نموذج YuE2 ↗", vi: "Xem thẻ mô hình YuE2 ↗",
  id: "Lihat kartu model YuE2 ↗", ru: "Открыть карточку модели YuE2 ↗",
};
const turboV4Translations = {
  "zh-CN": ["使用 Turbo LoRA v4（4–8 步）", "H3 Turbo 固定使用 v4-600 EMA，强度 1.0。快速运动建议 6–8 步；不用于 FastH3。"],
  "zh-TW": ["使用 Turbo LoRA v4（4–8 步）", "H3 Turbo 固定使用 v4-600 EMA，強度 1.0。快速運動建議 6–8 步；不適用於 FastH3。"],
  en: ["Use Turbo LoRA v4 (4–8 steps)", "H3 Turbo uses v4-600 EMA at strength 1.0. Use 6–8 steps for fast motion; not applied to FastH3."],
  fr: ["Utiliser Turbo LoRA v4 (4–8 étapes)", "H3 Turbo utilise v4-600 EMA à 1.0. Préférez 6–8 étapes pour les mouvements rapides ; non appliqué à FastH3."],
  de: ["Turbo LoRA v4 nutzen (4–8 Schritte)", "H3 Turbo nutzt v4-600 EMA mit Stärke 1.0. Für schnelle Bewegung 6–8 Schritte; nicht für FastH3."],
  ja: ["Turbo LoRA v4 を使用（4–8ステップ）", "H3 Turbo は強度1.0のv4-600 EMAを使用。速い動きには6–8ステップを推奨。FastH3には適用しません。"],
  ko: ["Turbo LoRA v4 사용 (4–8단계)", "H3 Turbo는 강도 1.0의 v4-600 EMA를 사용합니다. 빠른 움직임은 6–8단계 권장; FastH3에는 적용하지 않습니다."],
  es: ["Usar Turbo LoRA v4 (4–8 pasos)", "H3 Turbo usa v4-600 EMA con intensidad 1.0. Use 6–8 pasos para movimientos rápidos; no se aplica a FastH3."],
  pt: ["Usar Turbo LoRA v4 (4–8 etapas)", "H3 Turbo usa v4-600 EMA com intensidade 1.0. Use 6–8 etapas para movimentos rápidos; não se aplica ao FastH3."],
  tr: ["Turbo LoRA v4 kullan (4–8 adım)", "H3 Turbo, 1.0 güçte v4-600 EMA kullanır. Hızlı hareket için 6–8 adım önerilir; FastH3'e uygulanmaz."],
  ar: ["استخدام Turbo LoRA v4 (4–8 خطوات)", "يستخدم H3 Turbo إصدار v4-600 EMA بقوة 1.0. للحركة السريعة استخدم 6–8 خطوات؛ لا يُطبق على FastH3."],
  vi: ["Dùng Turbo LoRA v4 (4–8 bước)", "H3 Turbo dùng v4-600 EMA với cường độ 1.0. Chuyển động nhanh nên dùng 6–8 bước; không áp dụng cho FastH3."],
  id: ["Gunakan Turbo LoRA v4 (4–8 langkah)", "H3 Turbo memakai v4-600 EMA dengan kekuatan 1.0. Gunakan 6–8 langkah untuk gerakan cepat; tidak untuk FastH3."],
  ru: ["Использовать Turbo LoRA v4 (4–8 шагов)", "H3 Turbo использует v4-600 EMA с силой 1.0. Для быстрых движений 6–8 шагов; не применяется к FastH3."]
};
const modelCategoryKeys = ["settingsCategoryVideo", "settingsCategoryMusic", "settingsCategoryImage",
  "settingsCategoryEncoder", "settingsCategoryText", "settingsCategoryOther"];
const modelCategoryTranslations = {
  en: ["Video models", "Music models", "Text-to-image models", "Encoders", "Text models", "Other models"],
  "zh-CN": ["视频模型", "音乐模型", "文生图模型", "编码器", "文本模型", "其他模型"],
  "zh-TW": ["影片模型", "音樂模型", "文字生圖模型", "編碼器", "文字模型", "其他模型"],
  fr: ["Modèles vidéo", "Modèles musicaux", "Modèles texte-image", "Encodeurs", "Modèles de texte", "Autres modèles"],
  de: ["Videomodelle", "Musikmodelle", "Text-zu-Bild-Modelle", "Encoder", "Textmodelle", "Weitere Modelle"],
  ja: ["動画モデル", "音楽モデル", "テキストから画像モデル", "エンコーダー", "テキストモデル", "その他のモデル"],
  ko: ["영상 모델", "음악 모델", "텍스트 이미지 모델", "인코더", "텍스트 모델", "기타 모델"],
  es: ["Modelos de vídeo", "Modelos de música", "Modelos de texto a imagen", "Codificadores", "Modelos de texto", "Otros modelos"],
  pt: ["Modelos de vídeo", "Modelos de música", "Modelos de texto para imagem", "Codificadores", "Modelos de texto", "Outros modelos"],
  tr: ["Video modelleri", "Müzik modelleri", "Metinden görsel modelleri", "Kodlayıcılar", "Metin modelleri", "Diğer modeller"],
  ar: ["نماذج الفيديو", "نماذج الموسيقى", "نماذج النص إلى صورة", "المشفرات", "نماذج النص", "نماذج أخرى"],
  vi: ["Mô hình video", "Mô hình âm nhạc", "Mô hình văn bản thành ảnh", "Bộ mã hóa", "Mô hình văn bản", "Mô hình khác"],
  id: ["Model video", "Model musik", "Model teks ke gambar", "Encoder", "Model teks", "Model lainnya"],
  ru: ["Видеомодели", "Музыкальные модели", "Модели текста в изображение", "Кодировщики", "Текстовые модели", "Другие модели"]
};
const modelSettingsKeys = ["settingsStorage", "settingsOutputDirectory", "settingsMigrationNote",
  "settingsGemmaPath", "settingsModelEnabled", "settingsModelName"];
const modelSettingsTranslations = {
  en: ["Output & model options", "Output folder", "Changing folders copies and verifies all results and projects, retaining the originals. The new folder must be empty.", "Shared Gemma encoder folder", "Enabled", "Display name"],
  "zh-CN": ["输出与模型选项", "输出保存文件夹", "更改目录会复制并校验现有结果及项目，保留原文件备份。新目录必须为空。", "共用 Gemma 编码器目录", "启用", "显示名称"],
  "zh-TW": ["輸出與模型選項", "輸出儲存資料夾", "更改目錄會複製並驗證現有結果及專案，保留原始檔案備份。新目錄必須為空。", "共用 Gemma 編碼器目錄", "啟用", "顯示名稱"],
  fr: ["Sorties et modèles", "Dossier de sortie", "Le changement copie et vérifie les résultats et projets, en conservant les originaux. Le nouveau dossier doit être vide.", "Dossier de l’encodeur Gemma partagé", "Activé", "Nom affiché"],
  de: ["Ausgabe und Modelle", "Ausgabeordner", "Beim Wechsel werden Ergebnisse und Projekte kopiert und geprüft. Originale bleiben erhalten. Der neue Ordner muss leer sein.", "Ordner des gemeinsamen Gemma-Encoders", "Aktiviert", "Anzeigename"],
  ja: ["出力とモデルの設定", "出力保存フォルダー", "変更時に結果とプロジェクトをコピーして検証し、元のファイルを残します。新しいフォルダーは空である必要があります。", "共有 Gemma エンコーダーフォルダー", "有効", "表示名"],
  ko: ["출력 및 모델 설정", "출력 저장 폴더", "폴더 변경 시 결과와 프로젝트를 복사하고 검증하며 원본을 보존합니다. 새 폴더는 비어 있어야 합니다.", "공유 Gemma 인코더 폴더", "활성화", "표시 이름"],
  es: ["Salida y modelos", "Carpeta de salida", "El cambio copia y verifica resultados y proyectos, conservando los originales. La nueva carpeta debe estar vacía.", "Carpeta del codificador Gemma compartido", "Activado", "Nombre visible"],
  pt: ["Saída e modelos", "Pasta de saída", "A mudança copia e verifica resultados e projetos, mantendo os originais. A nova pasta deve estar vazia.", "Pasta do codificador Gemma compartilhado", "Ativado", "Nome exibido"],
  tr: ["Çıktı ve model seçenekleri", "Çıktı klasörü", "Klasör değişikliği sonuçları ve projeleri kopyalayıp doğrular, orijinalleri korur. Yeni klasör boş olmalıdır.", "Ortak Gemma kodlayıcı klasörü", "Etkin", "Görünen ad"],
  ar: ["خيارات الإخراج والنماذج", "مجلد حفظ الإخراج", "يتم نسخ النتائج والمشاريع والتحقق منها عند تغيير المجلد مع الاحتفاظ بالأصول. يجب أن يكون المجلد الجديد فارغًا.", "مجلد مشفر Gemma المشترك", "مفعّل", "اسم العرض"],
  vi: ["Đầu ra và mô hình", "Thư mục lưu đầu ra", "Đổi thư mục sẽ sao chép và xác minh kết quả cùng dự án, giữ lại bản gốc. Thư mục mới phải trống.", "Thư mục bộ mã hóa Gemma dùng chung", "Bật", "Tên hiển thị"],
  id: ["Keluaran dan model", "Folder keluaran", "Perubahan folder menyalin dan memverifikasi hasil serta proyek, sambil menyimpan aslinya. Folder baru harus kosong.", "Folder encoder Gemma bersama", "Aktif", "Nama tampilan"],
  ru: ["Вывод и модели", "Папка результатов", "При смене папки результаты и проекты копируются и проверяются, оригиналы сохраняются. Новая папка должна быть пустой.", "Папка общего кодировщика Gemma", "Включено", "Отображаемое имя"]
};
const historyDeleteKeys = ["historyDelete", "historyDeleteConfirm", "historyDeleting",
  "historyDeleteError", "historyInUse", "historyDeleted"];
const historyDeleteTranslations = {
  en: ["Delete", "Permanently delete this project and its media, saved settings and first-frame snapshot? This cannot be undone.", "Deleting…", "Could not delete project.", "This project's files are used by a long-video project and cannot be deleted.", "Project and related files deleted."],
  "zh-CN": ["删除", "永久删除此项目及其媒体、保存配置和首帧快照？此操作无法撤销。", "正在删除…", "删除项目失败。", "此项目的文件被长视频项目引用，无法删除。", "已删除项目及相关文件。"],
  "zh-TW": ["刪除", "永久刪除此專案及其媒體、儲存設定和首幀快照？此操作無法復原。", "正在刪除…", "刪除專案失敗。", "此專案的檔案被長影片專案引用，無法刪除。", "已刪除專案及相關檔案。"],
  fr: ["Supprimer", "Supprimer définitivement ce projet, ses médias, paramètres et image initiale ? Cette action est irréversible.", "Suppression…", "Impossible de supprimer le projet.", "Ces fichiers sont utilisés par un projet vidéo long et ne peuvent pas être supprimés.", "Projet et fichiers associés supprimés."],
  de: ["Löschen", "Projekt, Medien, Einstellungen und Startbild dauerhaft löschen? Dies kann nicht rückgängig gemacht werden.", "Wird gelöscht…", "Projekt konnte nicht gelöscht werden.", "Diese Dateien werden von einem Langvideo-Projekt verwendet und können nicht gelöscht werden.", "Projekt und zugehörige Dateien gelöscht."],
  ja: ["削除", "このプロジェクトとメディア、保存設定、最初のフレームを完全に削除しますか？元に戻せません。", "削除中…", "プロジェクトを削除できませんでした。", "長編動画プロジェクトがファイルを使用しているため削除できません。", "プロジェクトと関連ファイルを削除しました。"],
  ko: ["삭제", "프로젝트와 미디어, 저장 설정, 첫 프레임을 영구 삭제할까요? 되돌릴 수 없습니다.", "삭제 중…", "프로젝트를 삭제하지 못했습니다.", "긴 동영상 프로젝트에서 이 파일을 사용하므로 삭제할 수 없습니다.", "프로젝트와 관련 파일을 삭제했습니다."],
  es: ["Eliminar", "¿Eliminar permanentemente el proyecto, sus medios, ajustes y primer fotograma? No se puede deshacer.", "Eliminando…", "No se pudo eliminar el proyecto.", "Un proyecto de vídeo largo usa estos archivos y no se pueden eliminar.", "Proyecto y archivos relacionados eliminados."],
  pt: ["Excluir", "Excluir permanentemente o projeto, mídias, configurações e primeiro quadro? Não é possível desfazer.", "Excluindo…", "Não foi possível excluir o projeto.", "Um projeto de vídeo longo usa estes arquivos e eles não podem ser excluídos.", "Projeto e arquivos relacionados excluídos."],
  tr: ["Sil", "Projeyi, medyayı, kayıtlı ayarları ve ilk kareyi kalıcı olarak silmek istiyor musunuz? Geri alınamaz.", "Siliniyor…", "Proje silinemedi.", "Bu dosyalar uzun video projesinde kullanılıyor ve silinemez.", "Proje ve ilgili dosyalar silindi."],
  ar: ["حذف", "حذف المشروع ووسائطه وإعداداته واللقطة الأولى نهائيًا؟ لا يمكن التراجع.", "جارٍ الحذف…", "تعذّر حذف المشروع.", "تستخدم هذه الملفات في مشروع فيديو طويل ولا يمكن حذفها.", "تم حذف المشروع والملفات المرتبطة."],
  vi: ["Xóa", "Xóa vĩnh viễn dự án cùng tệp, cấu hình và khung hình đầu? Không thể hoàn tác.", "Đang xóa…", "Không thể xóa dự án.", "Dự án video dài đang dùng các tệp này nên không thể xóa.", "Đã xóa dự án và các tệp liên quan."],
  id: ["Hapus", "Hapus permanen proyek, media, pengaturan, dan bingkai pertama? Tidak dapat dibatalkan.", "Menghapus…", "Proyek tidak dapat dihapus.", "File ini digunakan proyek video panjang dan tidak dapat dihapus.", "Proyek dan file terkait dihapus."],
  ru: ["Удалить", "Навсегда удалить проект, медиа, настройки и первый кадр? Это действие необратимо.", "Удаление…", "Не удалось удалить проект.", "Файлы используются проектом длинного видео и не могут быть удалены.", "Проект и связанные файлы удалены."]
};
let historyDeleteBusy = false;

const disabledModelTranslations = {
  en: "This model is disabled. Enable it in Settings before generating.",
  "zh-CN": "此模型已停用，请先在设置中启用后再生成。",
  "zh-TW": "此模型已停用，請先在設定中啟用後再生成。",
  fr: "Ce modèle est désactivé. Activez-le dans les paramètres avant de générer.",
  de: "Dieses Modell ist deaktiviert. Aktivieren Sie es vor der Generierung in den Einstellungen.",
  ja: "このモデルは無効です。生成する前に設定で有効にしてください。",
  ko: "이 모델은 비활성화되어 있습니다. 생성 전에 설정에서 활성화하세요.",
  es: "Este modelo está desactivado. Actívelo en Ajustes antes de generar.",
  pt: "Este modelo está desativado. Ative-o nas configurações antes de gerar.",
  tr: "Bu model devre dışı. Üretmeden önce Ayarlar'da etkinleştirin.",
  ar: "هذا النموذج معطّل. فعّله في الإعدادات قبل التوليد.",
  vi: "Mô hình này đã bị tắt. Hãy bật trong Cài đặt trước khi tạo.",
  id: "Model ini dinonaktifkan. Aktifkan di Pengaturan sebelum membuat.",
  ru: "Эта модель отключена. Включите её в настройках перед генерацией."
};

const downloadStatusTranslations = {
  "zh-CN": ["下载中", "等待下载或已暂停", "尚未下载", "下载完成", "下载失败或状态不可用", "按所需文件统计，每个文件只计一次，不含重复缓存。LTX 总进度包含共用 Gemma 编码器。", "模型状态刷新失败，将自动重试。"],
  "zh-TW": ["下載中", "等待下載或已暫停", "尚未下載", "下載完成", "下載失敗或狀態不可用", "按所需檔案統計，每個檔案僅計一次，不含重複快取。LTX 包含共用 Gemma 編碼器。", "模型狀態更新失敗，將自動重試。"],
  en: ["Downloading", "Waiting or paused", "Not downloaded", "Download complete", "Download failed or status unavailable", "Required files counted once, no duplicate cache. LTX includes the shared Gemma encoder.", "Model status refresh failed; retrying automatically."],
  fr: ["Téléchargement", "En attente ou en pause", "Non téléchargé", "Téléchargement terminé", "Échec ou état indisponible", "Fichiers requis comptés une fois, sans cache en double. LTX inclut l’encodeur Gemma partagé.", "Actualisation impossible ; nouvelle tentative automatique."],
  de: ["Download läuft", "Wartend oder pausiert", "Nicht heruntergeladen", "Download abgeschlossen", "Download fehlgeschlagen oder Status nicht verfügbar", "Benötigte Dateien einmal gezählt, kein doppelter Cache. LTX enthält den gemeinsamen Gemma-Encoder.", "Statusaktualisierung fehlgeschlagen; automatischer Neuversuch."],
  ja: ["ダウンロード中", "待機中または一時停止", "未ダウンロード", "ダウンロード完了", "ダウンロード失敗または状態不明", "必要なファイルを一度だけ集計し、重複キャッシュを除外。LTX は共用 Gemma エンコーダーを含みます。", "状態更新に失敗しました。自動で再試行します。"],
  ko: ["다운로드 중", "대기 또는 일시 중지", "다운로드 안 됨", "다운로드 완료", "다운로드 실패 또는 상태 확인 불가", "필수 파일을 한 번만 집계하며 중복 캐시는 제외합니다. LTX는 공유 Gemma 인코더를 포함합니다.", "상태 갱신 실패; 자동 재시도합니다."],
  es: ["Descargando", "En espera o pausado", "Sin descargar", "Descarga completa", "Descarga fallida o estado no disponible", "Archivos necesarios contados una vez, sin caché duplicada. LTX incluye el codificador Gemma compartido.", "No se pudo actualizar; reintento automático."],
  pt: ["Baixando", "Aguardando ou pausado", "Não baixado", "Download completo", "Falha no download ou estado indisponível", "Arquivos necessários contados uma vez, sem cache duplicado. LTX inclui o codificador Gemma compartilhado.", "Falha na atualização; nova tentativa automática."],
  tr: ["İndiriliyor", "Bekliyor veya duraklatıldı", "İndirilmedi", "İndirme tamamlandı", "İndirme başarısız veya durum alınamadı", "Gerekli dosyalar bir kez sayılır; yinelenen önbellek yok. LTX ortak Gemma kodlayıcısını içerir.", "Durum yenilenemedi; otomatik yeniden denenecek."],
  ar: ["جارٍ التنزيل", "انتظار أو إيقاف مؤقت", "لم يُنزّل", "اكتمل التنزيل", "فشل التنزيل أو الحالة غير متاحة", "تُحسب الملفات المطلوبة مرة واحدة دون ذاكرة مكررة. يشمل LTX مشفّر Gemma المشترك.", "تعذر تحديث الحالة؛ ستتم إعادة المحاولة تلقائيًا."],
  vi: ["Đang tải", "Chờ hoặc tạm dừng", "Chưa tải", "Tải hoàn tất", "Tải thất bại hoặc không có trạng thái", "Tệp cần thiết được tính một lần, không tính bộ nhớ đệm trùng. LTX gồm bộ mã hóa Gemma dùng chung.", "Cập nhật thất bại; tự động thử lại."],
  id: ["Mengunduh", "Menunggu atau dijeda", "Belum diunduh", "Unduhan selesai", "Unduhan gagal atau status tidak tersedia", "Berkas yang diperlukan dihitung sekali, tanpa cache duplikat. LTX mencakup encoder Gemma bersama.", "Pembaruan gagal; mencoba ulang otomatis."],
  ru: ["Загрузка", "Ожидание или пауза", "Не загружено", "Загрузка завершена", "Ошибка загрузки или статус недоступен", "Нужные файлы считаются один раз, без дубликатов кеша. LTX включает общий кодировщик Gemma.", "Не удалось обновить статус; автоматический повтор."],
};
const downloadStatusKeys = ["downloadActive", "downloadPaused", "downloadNotStarted",
  "downloadComplete", "downloadError", "downloadHint", "modelRefreshError"];
const downloadSpeedTranslations = {
  "zh-CN": "速度", "zh-TW": "速度", en: "Speed", fr: "Vitesse", de: "Geschwindigkeit",
  ja: "速度", ko: "속도", es: "Velocidad", pt: "Velocidade", tr: "Hız",
  ar: "السرعة", vi: "Tốc độ", id: "Kecepatan", ru: "Скорость"
};
const downloadControlKeys = ["downloadResume", "downloadPause", "downloadSaveFirst",
  "downloadExternal", "downloadStarted", "downloadPauseRequested"];
const workflowFrameTranslations = {
  en: ["Restore & edit", "First frame", "Last frame"],
  "zh-CN": ["恢复并修改", "首帧", "尾帧"],
  "zh-TW": ["恢復並修改", "首幀", "尾幀"],
  fr: ["Restaurer et modifier", "Première image", "Dernière image"],
  de: ["Wiederherstellen und bearbeiten", "Erstes Bild", "Letztes Bild"],
  ja: ["復元して編集", "最初のフレーム", "最後のフレーム"],
  ko: ["복원 및 수정", "첫 프레임", "마지막 프레임"],
  es: ["Restaurar y editar", "Primer fotograma", "Último fotograma"],
  pt: ["Restaurar e editar", "Primeiro quadro", "Último quadro"],
  tr: ["Geri yükle ve düzenle", "İlk kare", "Son kare"],
  ar: ["استعادة وتعديل", "الإطار الأول", "الإطار الأخير"],
  vi: ["Khôi phục và sửa", "Khung hình đầu", "Khung hình cuối"],
  id: ["Pulihkan dan edit", "Bingkai pertama", "Bingkai terakhir"],
  ru: ["Восстановить и изменить", "Первый кадр", "Последний кадр"]
};
for (const [language, values] of Object.entries(workflowFrameTranslations)) {
  Object.assign(translations[language], {
    workflowRestore: values[0], workflowFirstFrame: values[1], workflowLastFrame: values[2]
  });
}
const mvTranslationKeys = ["modeMV", "mvNote", "mvName", "mvMusic", "mvPrompt", "mvSave",
  "mvNew", "mvUnavailable", "mvDrafts", "mvRefresh", "mvChoose", "mvSaved", "mvError",
  "mvMissing", "mvDiscard", "mvPromptEnhancerNote"];
const mvTranslations = {
  "zh-CN": ["MV生成", "根据音乐制作视频。当前支持选择已有音乐、试听和保存草稿；音乐分析、分镜和视频生成尚未开放。", "项目名称", "选择已有音乐", "画面创作方向", "保存MV草稿", "新建MV", "生成（开发中）", "MV项目草稿", "刷新草稿", "请选择音乐", "草稿已保存", "操作失败", "源音乐已不存在，请重新选择", "放弃尚未保存的MV修改？"],
  "zh-TW": ["MV生成", "依音樂製作影片。目前支援選擇既有音樂、試聽與儲存草稿；音樂分析、分鏡及影片生成尚未開放。", "專案名稱", "選擇既有音樂", "畫面創作方向", "儲存MV草稿", "新增MV", "生成（開發中）", "MV專案草稿", "重新整理草稿", "請選擇音樂", "草稿已儲存", "操作失敗", "來源音樂已不存在，請重新選擇", "放棄尚未儲存的MV修改？"],
  en: ["MV creation", "Create video from music. Select existing music, preview it and save drafts. Music analysis, storyboards and video generation are not available yet.", "Project name", "Select existing music", "Visual direction", "Save MV draft", "New MV", "Generate (in development)", "MV project drafts", "Refresh drafts", "Select music", "Draft saved", "Operation failed", "Source music is missing; select another track", "Discard unsaved MV changes?"],
  fr: ["Création MV", "Créer une vidéo à partir de musique. Sélection, écoute et brouillons disponibles ; analyse, storyboard et génération à venir.", "Nom du projet", "Musique existante", "Direction visuelle", "Enregistrer le brouillon MV", "Nouveau MV", "Générer (en développement)", "Brouillons MV", "Actualiser", "Choisir une musique", "Brouillon enregistré", "Échec de l’opération", "Musique source absente ; choisir une autre piste", "Abandonner les modifications MV non enregistrées ?"],
  de: ["MV-Erstellung", "Video aus Musik erstellen. Musikauswahl, Vorschau und Entwürfe sind verfügbar; Analyse, Storyboards und Generierung folgen.", "Projektname", "Vorhandene Musik", "Visuelle Ausrichtung", "MV-Entwurf speichern", "Neues MV", "Generieren (in Entwicklung)", "MV-Projektentwürfe", "Aktualisieren", "Musik wählen", "Entwurf gespeichert", "Vorgang fehlgeschlagen", "Quellmusik fehlt; anderen Titel wählen", "Ungespeicherte MV-Änderungen verwerfen?"],
  ja: ["MV制作", "音楽から動画を制作します。既存曲の選択・試聴・下書き保存に対応。音楽分析・絵コンテ・動画生成は未実装です。", "プロジェクト名", "既存の音楽を選択", "映像の方向性", "MV下書きを保存", "新規MV", "生成（開発中）", "MV下書き", "更新", "音楽を選択", "下書きを保存しました", "操作に失敗しました", "元の音楽がありません。別の曲を選択してください", "未保存のMV変更を破棄しますか？"],
  ko: ["MV 제작", "음악으로 영상을 만듭니다. 기존 음악 선택, 미리 듣기 및 초안 저장 지원. 분석, 스토리보드 및 영상 생성은 아직 제공되지 않습니다.", "프로젝트 이름", "기존 음악 선택", "영상 방향", "MV 초안 저장", "새 MV", "생성 (개발 중)", "MV 프로젝트 초안", "새로 고침", "음악 선택", "초안 저장됨", "작업 실패", "원본 음악이 없습니다. 다른 곡을 선택하세요", "저장하지 않은 MV 변경을 버릴까요?"],
  es: ["Creación MV", "Crear vídeo desde música. Selección, escucha y borradores disponibles; análisis, guion y generación pendientes.", "Nombre del proyecto", "Música existente", "Dirección visual", "Guardar borrador MV", "Nuevo MV", "Generar (en desarrollo)", "Borradores MV", "Actualizar", "Elegir música", "Borrador guardado", "Error en la operación", "Falta la música original; elija otra pista", "¿Descartar los cambios MV sin guardar?"],
  pt: ["Criação MV", "Criar vídeo a partir de música. Seleção, prévia e rascunhos disponíveis; análise, storyboard e geração ainda indisponíveis.", "Nome do projeto", "Música existente", "Direção visual", "Salvar rascunho MV", "Novo MV", "Gerar (em desenvolvimento)", "Rascunhos MV", "Atualizar", "Selecionar música", "Rascunho salvo", "Falha na operação", "Música original ausente; selecione outra faixa", "Descartar alterações MV não salvas?"],
  tr: ["MV oluşturma", "Müzikten video oluşturun. Müzik seçimi, önizleme ve taslak kaydı hazır; analiz, storyboard ve video üretimi henüz yok.", "Proje adı", "Mevcut müzik", "Görsel yön", "MV taslağını kaydet", "Yeni MV", "Üret (geliştiriliyor)", "MV proje taslakları", "Yenile", "Müzik seç", "Taslak kaydedildi", "İşlem başarısız", "Kaynak müzik eksik; başka parça seçin", "Kaydedilmemiş MV değişiklikleri silinsin mi?"],
  ar: ["إنشاء MV", "إنشاء فيديو من الموسيقى. اختيار الموسيقى والاستماع وحفظ المسودات متاح؛ التحليل والمشاهد وتوليد الفيديو غير متاحة بعد.", "اسم المشروع", "اختيار موسيقى موجودة", "التوجه البصري", "حفظ مسودة MV", "MV جديد", "توليد (قيد التطوير)", "مسودات مشاريع MV", "تحديث", "اختر الموسيقى", "تم حفظ المسودة", "فشلت العملية", "الموسيقى الأصلية مفقودة؛ اختر مقطعًا آخر", "تجاهل تعديلات MV غير المحفوظة؟"],
  vi: ["Tạo MV", "Tạo video từ nhạc. Hỗ trợ chọn nhạc, nghe thử và lưu bản nháp; phân tích, phân cảnh và tạo video chưa có.", "Tên dự án", "Chọn nhạc có sẵn", "Định hướng hình ảnh", "Lưu bản nháp MV", "MV mới", "Tạo (đang phát triển)", "Bản nháp MV", "Làm mới", "Chọn nhạc", "Đã lưu bản nháp", "Thao tác thất bại", "Nhạc nguồn không còn; chọn bài khác", "Bỏ thay đổi MV chưa lưu?"],
  id: ["Pembuatan MV", "Buat video dari musik. Pilihan musik, pratinjau dan draf tersedia; analisis, storyboard dan video belum tersedia.", "Nama proyek", "Pilih musik yang ada", "Arah visual", "Simpan draf MV", "MV baru", "Buat (dalam pengembangan)", "Draf proyek MV", "Muat ulang", "Pilih musik", "Draf disimpan", "Operasi gagal", "Musik sumber hilang; pilih lagu lain", "Buang perubahan MV yang belum disimpan?"],
  ru: ["Создание MV", "Видео по музыке. Доступны выбор музыки, прослушивание и сохранение черновиков; анализ, раскадровка и генерация пока недоступны.", "Название проекта", "Выбрать музыку", "Визуальное направление", "Сохранить черновик MV", "Новый MV", "Генерация (в разработке)", "Черновики MV", "Обновить", "Выберите музыку", "Черновик сохранён", "Ошибка операции", "Исходная музыка отсутствует; выберите другой трек", "Отменить несохранённые изменения MV?"]
};
for (const [language, values] of Object.entries(mvTranslations)) {
  Object.assign(translations[language], Object.fromEntries(mvTranslationKeys.map((key, i) => [key, values[i]])));
}
const mvPromptEnhancerNotes = {
  "zh-CN": "按所选视频模型优化 MV 画面提示词；Skill 选择与其他创作模式相互独立。",
  "zh-TW": "依所選影片模型優化 MV 畫面提示詞；Skill 選擇與其他創作模式分開保存。",
  en: "Optimizes the MV visual prompt for the selected video model; MV Skill selections stay separate from other modes.",
  fr: "Optimise le prompt visuel MV pour le modèle vidéo choisi ; les Skills MV restent séparées des autres modes.",
  de: "Optimiert den visuellen MV-Prompt für das gewählte Videomodell; MV-Skills bleiben separat.",
  ja: "選択した動画モデル向けにMVの映像プロンプトを最適化します。MVのSkill選択は他のモードと別です。",
  ko: "선택한 비디오 모델에 맞춰 MV 화면 프롬프트를 최적화합니다. MV Skill 선택은 다른 모드와 분리됩니다.",
  es: "Optimiza el prompt visual del MV para el modelo de vídeo elegido; sus Skills se mantienen separadas.",
  pt: "Otimiza o prompt visual do MV para o modelo de vídeo escolhido; as Skills do MV ficam separadas.",
  tr: "Seçilen video modeli için MV görsel istemini iyileştirir; MV Skill seçimleri diğer modlardan ayrıdır.",
  ar: "يحسّن وصف مشهد MV لنموذج الفيديو المحدد؛ اختيارات مهارات MV منفصلة عن الأوضاع الأخرى.",
  vi: "Tối ưu prompt hình ảnh MV theo mô hình video đã chọn; lựa chọn Skill của MV tách biệt với chế độ khác.",
  id: "Mengoptimalkan prompt visual MV untuk model video terpilih; pilihan Skill MV terpisah dari mode lain.",
  ru: "Оптимизирует визуальный промпт MV для выбранной видеомодели; набор Skill для MV хранится отдельно."
};
for (const [language, value] of Object.entries(mvPromptEnhancerNotes)) {
  translations[language].mvPromptEnhancerNote = value;
}
const mvNotes = {
  "zh-CN": "保存并分析音乐，规划节拍分镜，审阅后生成镜头并使用原音乐合成。",
  "zh-TW": "儲存並分析音樂，規劃節拍分鏡，審閱後生成鏡頭並使用原音樂合成。",
  en: "Save and analyze music, plan beat-bound shots, then review, render and export with the original music.",
  fr: "Enregistrez et analysez la musique, planifiez les plans rythmiques, puis relisez, générez et exportez avec la musique originale.",
  de: "Musik speichern und analysieren, Beat-Szenen planen, dann prüfen, generieren und mit Originalmusik exportieren.",
  ja: "音楽を保存・解析し、拍に合わせた絵コンテを確認して、動画を生成し元の音楽で書き出します。",
  ko: "음악을 저장·분석하고 박자 기반 장면을 계획한 뒤 검토, 생성 및 원본 음악으로 내보내세요.",
  es: "Guarda y analiza la música, planifica los planos rítmicos, revisa, genera y exporta con la música original.",
  pt: "Salve e analise a música, planeje cenas no ritmo, revise, gere e exporte com a música original.",
  tr: "Müziği kaydedip analiz edin, vuruş sahnelerini planlayın, inceleyip üretin ve orijinal müzikle dışa aktarın.",
  ar: "احفظ الموسيقى وحللها وخطط اللقطات حسب الإيقاع، ثم راجعها وولّد الفيديو وصدّره بالموسيقى الأصلية.",
  vi: "Lưu và phân tích nhạc, lập cảnh theo nhịp, xem lại, tạo và xuất với nhạc gốc.",
  id: "Simpan dan analisis musik, rencanakan adegan sesuai ketukan, tinjau, buat, lalu ekspor dengan musik asli.",
  ru: "Сохраните и проанализируйте музыку, спланируйте кадры по ритму, проверьте, создайте и экспортируйте с исходной музыкой."
};
for (const [language, value] of Object.entries(mvNotes)) translations[language].mvNote = value;
const mvAnalysisKeys = ["mvAnalyze", "mvCancelAnalysis", "mvAnalysisIdle", "mvTimelineHelp",
  "mvAnalysisQueued", "mvAnalysisSignal", "mvAnalysisBeats", "mvAnalysisComplete",
  "mvAnalysisFailed", "mvAnalysisCancelled", "mvTimeline", "mvAnalysisSummary",
  "mvAnalysisNotReady", "mvAnalysisCancelling"];
const mvAnalysisTranslations = {
  "zh-CN": ["分析音乐", "取消分析", "保存项目后可分析来源音乐。", "点击时间轴可定位试听；亮线为节拍，金线为重拍。", "音乐分析排队中…", "正在分析波形与能量…", "正在识别节拍…", "音乐分析完成", "音乐分析失败", "音乐分析已取消", "音乐时间轴", "BPM {bpm} · {beats} 个节拍 · {downbeats} 个重拍", "先保存项目并选择可用音乐。", "正在取消音乐分析…"],
  "zh-TW": ["分析音樂", "取消分析", "儲存專案後可分析來源音樂。", "點擊時間軸可定位試聽；亮線為節拍，金線為重拍。", "音樂分析排隊中…", "正在分析波形與能量…", "正在辨識節拍…", "音樂分析完成", "音樂分析失敗", "音樂分析已取消", "音樂時間軸", "BPM {bpm} · {beats} 個節拍 · {downbeats} 個重拍", "請先儲存專案並選擇可用音樂。", "正在取消音樂分析…"],
  en: ["Analyze music", "Cancel analysis", "Save the project to analyze its source music.", "Click the timeline to seek; bright marks are beats and gold marks are downbeats.", "Music analysis queued…", "Analyzing waveform and energy…", "Detecting beats…", "Music analysis complete", "Music analysis failed", "Music analysis cancelled", "Music timeline", "BPM {bpm} · {beats} beats · {downbeats} downbeats", "Save the project and select available music first.", "Cancelling music analysis…"],
  fr: ["Analyser la musique", "Annuler l’analyse", "Enregistrez le projet pour analyser sa musique source.", "Cliquez sur la timeline pour écouter à cet endroit ; traits clairs : temps, dorés : temps forts.", "Analyse en attente…", "Analyse de la forme d’onde et de l’énergie…", "Détection des temps…", "Analyse musicale terminée", "Échec de l’analyse musicale", "Analyse musicale annulée", "Timeline musicale", "BPM {bpm} · {beats} temps · {downbeats} temps forts", "Enregistrez le projet et choisissez une musique disponible.", "Annulation de l’analyse musicale…"],
  de: ["Musik analysieren", "Analyse abbrechen", "Projekt speichern, um die Quellmusik zu analysieren.", "Timeline anklicken, um dorthin zu springen; helle Markierungen sind Beats, goldene Downbeats.", "Musikanalyse wartet…", "Wellenform und Energie werden analysiert…", "Beats werden erkannt…", "Musikanalyse abgeschlossen", "Musikanalyse fehlgeschlagen", "Musikanalyse abgebrochen", "Musik-Timeline", "BPM {bpm} · {beats} Beats · {downbeats} Downbeats", "Projekt speichern und verfügbare Musik auswählen.", "Musikanalyse wird abgebrochen…"],
  ja: ["音楽を分析", "分析をキャンセル", "プロジェクトを保存すると音源を分析できます。", "タイムラインをクリックして再生位置を移動します。明るい線は拍、金色の線は強拍です。", "音楽分析を待機中…", "波形と音量を分析中…", "拍を検出中…", "音楽分析が完了しました", "音楽分析に失敗しました", "音楽分析をキャンセルしました", "音楽タイムライン", "BPM {bpm} · 拍 {beats} · 強拍 {downbeats}", "プロジェクトを保存し、利用可能な音楽を選択してください。", "音楽分析をキャンセル中…"],
  ko: ["음악 분석", "분석 취소", "프로젝트를 저장하면 원본 음악을 분석할 수 있습니다.", "타임라인을 클릭해 재생 위치를 이동하세요. 밝은 표시는 박자, 금색 표시는 강박입니다.", "음악 분석 대기 중…", "파형과 에너지를 분석하는 중…", "박자를 감지하는 중…", "음악 분석 완료", "음악 분석 실패", "음악 분석 취소됨", "음악 타임라인", "BPM {bpm} · 박자 {beats}개 · 강박 {downbeats}개", "프로젝트를 저장하고 사용 가능한 음악을 선택하세요.", "음악 분석 취소 중…"],
  es: ["Analizar música", "Cancelar análisis", "Guarde el proyecto para analizar su música.", "Haga clic en la línea de tiempo para buscar; las marcas claras son pulsos y las doradas, acentos.", "Análisis en cola…", "Analizando forma de onda y energía…", "Detectando pulsos…", "Análisis musical completado", "Error en el análisis musical", "Análisis musical cancelado", "Línea de tiempo musical", "BPM {bpm} · {beats} pulsos · {downbeats} acentos", "Guarde el proyecto y seleccione música disponible.", "Cancelando el análisis musical…"],
  pt: ["Analisar música", "Cancelar análise", "Salve o projeto para analisar a música de origem.", "Clique na linha do tempo para buscar; marcas claras são batidas e douradas são tempos fortes.", "Análise na fila…", "Analisando forma de onda e energia…", "Detectando batidas…", "Análise musical concluída", "Falha na análise musical", "Análise musical cancelada", "Linha do tempo musical", "BPM {bpm} · {beats} batidas · {downbeats} tempos fortes", "Salve o projeto e selecione uma música disponível.", "Cancelando análise musical…"],
  tr: ["Müziği analiz et", "Analizi iptal et", "Kaynak müziği analiz etmek için projeyi kaydedin.", "Konumu dinlemek için zaman çizelgesine tıklayın; açık çizgiler vuruş, altın çizgiler güçlü vuruştur.", "Müzik analizi sırada…", "Dalga biçimi ve enerji analiz ediliyor…", "Vuruşlar algılanıyor…", "Müzik analizi tamamlandı", "Müzik analizi başarısız", "Müzik analizi iptal edildi", "Müzik zaman çizelgesi", "BPM {bpm} · {beats} vuruş · {downbeats} güçlü vuruş", "Projeyi kaydedin ve kullanılabilir müziği seçin.", "Müzik analizi iptal ediliyor…"],
  ar: ["تحليل الموسيقى", "إلغاء التحليل", "احفظ المشروع لتحليل الموسيقى المصدر.", "انقر على المخطط للانتقال؛ العلامات الفاتحة للإيقاع والذهبية للإيقاع القوي.", "تحليل الموسيقى في قائمة الانتظار…", "جارٍ تحليل الموجة والطاقة…", "جارٍ اكتشاف الإيقاعات…", "اكتمل تحليل الموسيقى", "فشل تحليل الموسيقى", "أُلغي تحليل الموسيقى", "المخطط الزمني للموسيقى", "BPM {bpm} · {beats} إيقاع · {downbeats} إيقاع قوي", "احفظ المشروع واختر موسيقى متاحة أولاً.", "جارٍ إلغاء تحليل الموسيقى…"],
  vi: ["Phân tích nhạc", "Hủy phân tích", "Lưu dự án để phân tích nhạc nguồn.", "Nhấp vào dòng thời gian để tua; vạch sáng là nhịp, vạch vàng là phách mạnh.", "Đang chờ phân tích nhạc…", "Đang phân tích dạng sóng và năng lượng…", "Đang nhận diện nhịp…", "Đã phân tích xong nhạc", "Phân tích nhạc thất bại", "Đã hủy phân tích nhạc", "Dòng thời gian âm nhạc", "BPM {bpm} · {beats} nhịp · {downbeats} phách mạnh", "Hãy lưu dự án và chọn nhạc khả dụng trước.", "Đang hủy phân tích nhạc…"],
  id: ["Analisis musik", "Batalkan analisis", "Simpan proyek untuk menganalisis musik sumber.", "Klik linimasa untuk mencari posisi; tanda terang adalah ketukan dan emas adalah ketukan kuat.", "Analisis musik dalam antrean…", "Menganalisis bentuk gelombang dan energi…", "Mendeteksi ketukan…", "Analisis musik selesai", "Analisis musik gagal", "Analisis musik dibatalkan", "Linimasa musik", "BPM {bpm} · {beats} ketukan · {downbeats} ketukan kuat", "Simpan proyek dan pilih musik yang tersedia terlebih dahulu.", "Membatalkan analisis musik…"],
  ru: ["Анализировать музыку", "Отменить анализ", "Сохраните проект, чтобы анализировать исходную музыку.", "Нажмите на шкалу, чтобы перейти к моменту; светлые метки — доли, золотые — сильные доли.", "Анализ музыки в очереди…", "Анализ формы волны и энергии…", "Поиск долей…", "Анализ музыки завершён", "Не удалось проанализировать музыку", "Анализ музыки отменён", "Шкала музыки", "BPM {bpm} · долей {beats} · сильных долей {downbeats}", "Сначала сохраните проект и выберите доступную музыку.", "Отмена анализа музыки…"]
};
for (const [language, values] of Object.entries(mvAnalysisTranslations)) {
  Object.assign(translations[language], Object.fromEntries(mvAnalysisKeys.map((key, i) => [key, values[i]])));
}
const mvDeleteConfirmTranslations = {
  "zh-CN": "删除此MV项目草稿？来源音乐不会删除。",
  "zh-TW": "刪除此MV專案草稿？來源音樂不會刪除。",
  en: "Delete this MV project draft? The source music will be kept.",
  fr: "Supprimer ce brouillon MV ? La musique source sera conservée.",
  de: "Diesen MV-Projektentwurf löschen? Die Quellmusik bleibt erhalten.",
  ja: "このMV下書きを削除しますか？元の音楽は保持されます。",
  ko: "이 MV 프로젝트 초안을 삭제할까요? 원본 음악은 유지됩니다.",
  es: "¿Eliminar este borrador MV? Se conservará la música original.",
  pt: "Excluir este rascunho MV? A música original será mantida.",
  tr: "Bu MV proje taslağı silinsin mi? Kaynak müzik korunacaktır.",
  ar: "هل تريد حذف مسودة مشروع MV؟ سيتم الاحتفاظ بالموسيقى الأصلية.",
  vi: "Xóa bản nháp MV này? Nhạc nguồn sẽ được giữ lại.",
  id: "Hapus draf proyek MV ini? Musik sumber akan tetap disimpan.",
  ru: "Удалить этот черновик MV? Исходная музыка будет сохранена."
};
for (const [language, value] of Object.entries(mvDeleteConfirmTranslations)) {
  translations[language].mvDeleteConfirm = value;
}
const mvUploadKeys = ["mvMusic", "mvUpload", "mvUploadHint", "mvUploading", "mvUploaded",
  "mvUploadInvalid", "mvUploadLimit", "mvUploadFull", "mvNote", "mvPreviewError"];
const mvUploadTranslations = {
  "zh-CN": ["音乐来源", "上传WAV", "PCM/Float WAV · 单/双声道 · 最长12分钟 · 最大512MB", "正在上传并校验WAV…", "WAV上传成功", "请选择有效的单/双声道WAV文件。", "WAV不能超过12分钟或512MB。", "上传音乐存储已满。", "选择历史音乐或上传WAV，试听并保存MV草稿；音乐分析、分镜和视频生成尚未开放。", "无法试听此音频，请检查WAV格式或浏览器支持。"],
  "zh-TW": ["音樂來源", "上傳WAV", "PCM/Float WAV · 單/雙聲道 · 最長12分鐘 · 最大512MB", "正在上傳並驗證WAV…", "WAV上傳成功", "請選擇有效的單/雙聲道WAV檔案。", "WAV不得超過12分鐘或512MB。", "上傳音樂儲存空間已滿。", "選擇歷史音樂或上傳WAV，試聽並儲存MV草稿；音樂分析、分鏡及影片生成尚未開放。", "無法試聽音訊，請檢查WAV格式或瀏覽器支援。"],
  en: ["Music source", "Upload WAV", "PCM/Float WAV · Mono/stereo · Up to 12 minutes · 512MB maximum", "Uploading and validating WAV…", "WAV uploaded", "Choose a valid mono/stereo WAV file.", "WAV must not exceed 12 minutes or 512MB.", "Uploaded music storage is full.", "Select historical music or upload WAV, preview it and save an MV draft. Analysis, storyboards and video generation are not available yet.", "Audio preview failed; check WAV format and browser support."],
  fr: ["Source musicale", "Importer WAV", "PCM/Float WAV · Mono/stéréo · 12 minutes · 512Mo maximum", "Importation et validation WAV…", "WAV importé", "Choisissez un WAV mono/stéréo valide.", "Le WAV ne doit pas dépasser 12 minutes ou 512Mo.", "Stockage musical plein.", "Choisissez une musique existante ou importez un WAV, écoutez et enregistrez un brouillon MV. Analyse et génération à venir.", "Écoute impossible ; vérifiez le format WAV et le navigateur."],
  de: ["Musikquelle", "WAV hochladen", "PCM/Float WAV · Mono/Stereo · Max. 12 Minuten und 512MB", "WAV wird hochgeladen und geprüft…", "WAV hochgeladen", "Gültige Mono-/Stereo-WAV-Datei wählen.", "WAV darf 12 Minuten oder 512MB nicht überschreiten.", "Musikspeicher ist voll.", "Vorhandene Musik wählen oder WAV hochladen, anhören und MV-Entwurf speichern. Analyse und Generierung folgen.", "Audiovorschau fehlgeschlagen; WAV-Format und Browser prüfen."],
  ja: ["音楽ソース", "WAVをアップロード", "PCM/Float WAV · モノラル/ステレオ · 最大12分・512MB", "WAVをアップロード・検証中…", "WAVをアップロードしました", "有効なモノラル/ステレオWAVを選択してください。", "WAVは12分・512MB以内にしてください。", "音楽保存領域がいっぱいです。", "既存曲またはWAVを選んで試聴し、MV下書きを保存します。分析・絵コンテ・動画生成は未実装です。", "試聴できません。WAV形式とブラウザー対応をご確認ください。"],
  ko: ["음악 소스", "WAV 업로드", "PCM/Float WAV · 모노/스테레오 · 최대 12분 및 512MB", "WAV 업로드 및 검증 중…", "WAV 업로드됨", "유효한 모노/스테레오 WAV 파일을 선택하세요.", "WAV는 12분 또는 512MB를 초과할 수 없습니다.", "음악 저장 공간이 가득 찼습니다.", "기존 음악 또는 WAV를 선택하여 듣고 MV 초안을 저장하세요. 분석, 스토리보드 및 영상 생성은 아직 제공되지 않습니다.", "오디오 미리 듣기 실패; WAV 형식과 브라우저 지원을 확인하세요."],
  es: ["Fuente musical", "Subir WAV", "PCM/Float WAV · Mono/estéreo · Máximo 12 minutos y 512MB", "Subiendo y validando WAV…", "WAV subido", "Elija un WAV mono/estéreo válido.", "WAV no debe superar 12 minutos o 512MB.", "El almacenamiento de música está lleno.", "Elija música existente o suba WAV, escuche y guarde un borrador MV. Análisis y generación pendientes.", "Error de escucha; compruebe el formato WAV y el navegador."],
  pt: ["Fonte musical", "Enviar WAV", "PCM/Float WAV · Mono/estéreo · Máximo 12 minutos e 512MB", "Enviando e validando WAV…", "WAV enviado", "Selecione um WAV mono/estéreo válido.", "WAV não pode exceder 12 minutos ou 512MB.", "Armazenamento de música cheio.", "Escolha música existente ou envie WAV, ouça e salve um rascunho MV. Análise e geração ainda indisponíveis.", "Falha na prévia; confira o formato WAV e o navegador."],
  tr: ["Müzik kaynağı", "WAV yükle", "PCM/Float WAV · Mono/stereo · En fazla 12 dakika ve 512MB", "WAV yükleniyor ve doğrulanıyor…", "WAV yüklendi", "Geçerli bir mono/stereo WAV seçin.", "WAV 12 dakika veya 512MB sınırını aşamaz.", "Müzik depolama alanı dolu.", "Mevcut müzik seçin veya WAV yükleyin, dinleyin ve MV taslağını kaydedin. Analiz ve üretim henüz yok.", "Ses önizlemesi başarısız; WAV biçimini ve tarayıcıyı kontrol edin."],
  ar: ["مصدر الموسيقى", "رفع WAV", "PCM/Float WAV · أحادي/ستيريو · حتى 12 دقيقة و512MB", "رفع WAV والتحقق منه…", "تم رفع WAV", "اختر ملف WAV أحاديًا أو ستيريو صالحًا.", "يجب ألا يتجاوز WAV 12 دقيقة أو512MB.", "مساحة تخزين الموسيقى ممتلئة.", "اختر موسيقى سابقة أو ارفع WAV واستمع واحفظ مسودة MV. التحليل وتوليد الفيديو غير متاحين بعد.", "تعذرت المعاينة؛ تحقق من صيغة WAV ودعم المتصفح."],
  vi: ["Nguồn nhạc", "Tải WAV lên", "PCM/Float WAV · Mono/stereo · Tối đa 12 phút và 512MB", "Đang tải và kiểm tra WAV…", "Đã tải WAV", "Chọn WAV mono/stereo hợp lệ.", "WAV không được vượt quá 12 phút hoặc 512MB.", "Kho nhạc đã đầy.", "Chọn nhạc có sẵn hoặc tải WAV, nghe thử và lưu bản nháp MV. Phân tích và tạo video chưa có.", "Không nghe thử được; kiểm tra định dạng WAV và trình duyệt."],
  id: ["Sumber musik", "Unggah WAV", "PCM/Float WAV · Mono/stereo · Maksimal 12 menit dan 512MB", "Mengunggah dan memvalidasi WAV…", "WAV diunggah", "Pilih WAV mono/stereo yang valid.", "WAV tidak boleh melebihi 12 menit atau 512MB.", "Penyimpanan musik penuh.", "Pilih musik lama atau unggah WAV, dengarkan dan simpan draf MV. Analisis dan pembuatan video belum tersedia.", "Pratinjau audio gagal; periksa format WAV dan browser."],
  ru: ["Источник музыки", "Загрузить WAV", "PCM/Float WAV · Моно/стерео · До 12 минут и 512МБ", "Загрузка и проверка WAV…", "WAV загружен", "Выберите корректный моно/стерео WAV.", "WAV не должен превышать 12 минут или 512МБ.", "Хранилище музыки заполнено.", "Выберите музыку или загрузите WAV, прослушайте и сохраните MV. Анализ и генерация пока недоступны.", "Ошибка прослушивания; проверьте формат WAV и поддержку браузера."]
};
for (const [language, values] of Object.entries(mvUploadTranslations)) {
  Object.assign(translations[language], Object.fromEntries(mvUploadKeys.map((key, i) => [key, values[i]])));
}
const newScoreOnlyTranslations = {
  "zh-CN": "长视频仅生成新配乐。请设置配乐提示词并重新保存分镜后运行。",
  "zh-TW": "長影片僅生成新配樂。請設定配樂提示詞並重新儲存分鏡後執行。",
  en: "Long video only generates new scores. Set a score prompt and save the storyboard before running.",
  fr: "La vidéo longue génère une nouvelle musique. Définissez le prompt et enregistrez le storyboard avant de lancer.",
  de: "Langvideos erzeugen nur neue Musik. Musik-Prompt festlegen und Storyboard vor dem Start speichern.",
  ja: "長編動画は新規音楽のみ生成します。音楽プロンプトを設定し、絵コンテを保存してから実行してください。",
  ko: "긴 영상은 새 음악만 생성합니다. 음악 프롬프트를 설정하고 스토리보드를 저장한 후 실행하세요.",
  es: "El vídeo largo solo genera música nueva. Defina el prompt y guarde el guion antes de ejecutar.",
  pt: "Vídeos longos geram apenas música nova. Defina o prompt e salve o storyboard antes de executar.",
  tr: "Uzun video yalnızca yeni müzik üretir. Müzik istemini ayarlayıp storyboard'u kaydettikten sonra çalıştırın.",
  ar: "الفيديو الطويل يولّد موسيقى جديدة فقط. حدد وصف الموسيقى واحفظ المشاهد قبل التشغيل.",
  vi: "Video dài chỉ tạo nhạc mới. Đặt lời nhắc nhạc và lưu phân cảnh trước khi chạy.",
  id: "Video panjang hanya membuat musik baru. Atur prompt musik dan simpan storyboard sebelum menjalankan.",
  ru: "Длинное видео создаёт только новую музыку. Задайте запрос музыки и сохраните раскадровку перед запуском."
};
for (const [language, value] of Object.entries(newScoreOnlyTranslations)) {
  translations[language].workflowNewScoreOnly = value;
}
let mvProjects = [];
let mvMusicSources = [];
let currentMV = null;
let mvDirty = false;
let mvBusy = false;
let mvFetchVersion = 0;
let mvMusicFetchVersion = 0;
let mvDisabledControls = [];
let mvAnalysisJob = null;
let mvAnalysis = null;
let mvAnalysisPollTimer = null;
let mvAnalysisFetchVersion = 0;
let mvAnalysisStatusKey = "mvAnalysisIdle";
let mvAnalysisStatusDetail = "";

function setMVBusy(busy) {
  mvBusy = busy;
  if (busy) {
    mvDisabledControls = [...document.querySelectorAll("#mv-panel input, #mv-panel textarea, #mv-panel select, #mv-panel button")]
      .map(control => ({control, disabled: control.disabled}));
    mvDisabledControls.forEach(({control}) => {control.disabled = true;});
  } else {
    mvDisabledControls.forEach(({control, disabled}) => {control.disabled = disabled;});
    mvDisabledControls = [];
  }
  updateMVMusicPreview();
  renderMVDrafts();
  renderHistory();
}

function showMVMessage(message, error = false) {
  const node = document.querySelector("#mv-message");
  node.textContent = message;
  node.hidden = !message;
  node.classList.toggle("error", error);
}

function setMVAnalysisStatus(key, detail = "") {
  mvAnalysisStatusKey = key;
  mvAnalysisStatusDetail = detail;
  const node = document.querySelector("#mv-analysis-status");
  node.textContent = `${t(key)}${detail ? ` ${detail}` : ""}`;
}

function updateMVAnalysisControls() {
  const active = ["queued", "running", "cancelling"].includes(mvAnalysisJob?.status);
  const sourceId = document.querySelector("#mv-music").value;
  document.querySelector("#mv-analyze").disabled = mvBusy || active || !currentMV?.id ||
    !sourceId || mvDirty || currentMV.music_source_id !== sourceId;
  document.querySelector("#mv-cancel-analysis").hidden = !active;
  document.querySelector("#mv-cancel-analysis").disabled = mvBusy || !active || mvAnalysisJob.status === "cancelling";
  document.querySelector("#mv-music").disabled = mvBusy || active;
  window.MiniMuvMVGeneration?.updateControls();
}

function renderMVTimeline() {
  const wrap = document.querySelector("#mv-timeline-wrap");
  const canvas = document.querySelector("#mv-timeline");
  const summary = document.querySelector("#mv-analysis-summary");
  const sourceId = document.querySelector("#mv-music").value;
  const result = mvAnalysis?.music_source_id === sourceId ? mvAnalysis.result : null;
  if (!result) {
    wrap.hidden = true;
    summary.hidden = true;
    return;
  }
  wrap.hidden = false;
  summary.hidden = false;
  const bpm = result.bpm === null ? "—" : result.bpm;
  summary.textContent = t("mvAnalysisSummary")
    .replace("{bpm}", String(bpm))
    .replace("{beats}", String(result.beats.length))
    .replace("{downbeats}", String(result.downbeats.length));
  const width = Math.max(320, Math.round(canvas.clientWidth || 640));
  const height = 96;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * ratio);
  canvas.height = Math.round(height * ratio);
  const context = canvas.getContext?.("2d");
  if (!context) return;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, width, height);
  const maxEnergy = Math.max(0.000001, ...result.waveform);
  const binWidth = width / result.waveform.length;
  context.fillStyle = "#82909b";
  result.waveform.forEach((value, index) => {
    const barHeight = Math.max(1, value / maxEnergy * 48);
    context.fillRect(index * binWidth, 58 - barHeight, Math.max(1, binWidth * 0.72), barHeight);
  });
  const downbeats = new Set(result.downbeats);
  result.beats.forEach(beat => {
    const x = beat / result.duration * width;
    context.beginPath();
    context.strokeStyle = downbeats.has(beat) ? "#d2a75c" : "#e6e9eb";
    context.globalAlpha = downbeats.has(beat) ? 0.95 : 0.55;
    context.moveTo(x, 65);
    context.lineTo(x, downbeats.has(beat) ? 93 : 84);
    context.stroke();
  });
  context.globalAlpha = 1;
  const player = document.querySelector("#mv-audio");
  document.querySelector("#mv-playhead").style.left =
    `${Math.max(0, Math.min(100, player.currentTime / result.duration * 100))}%`;
}

function seekMVTimeline(event) {
  const result = mvAnalysis?.music_source_id === document.querySelector("#mv-music").value
    ? mvAnalysis.result : null;
  if (!result) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (bounds.width > 0) {
    document.querySelector("#mv-audio").currentTime =
      Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * result.duration;
  }
}

function handleMVTimelineKeydown(event) {
  const result = mvAnalysis?.music_source_id === document.querySelector("#mv-music").value
    ? mvAnalysis.result : null;
  if (!result) return;
  const player = document.querySelector("#mv-audio");
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    player.currentTime = Math.max(0, Math.min(result.duration,
      player.currentTime + (event.key === "ArrowRight" ? 1 : -1)));
  } else if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    player.currentTime = event.key === "Home" ? 0 : result.duration;
  }
}

function loadMVAnalysis() {
  const project = currentMV;
  const version = ++mvAnalysisFetchVersion;
  mvAnalysis = null;
  if (!project?.id) {
    setMVAnalysisStatus("mvAnalysisIdle");
    renderMVTimeline();
    updateMVAnalysisControls();
    return;
  }
  setMVAnalysisStatus("mvAnalysisQueued");
  fetch(`/api/mv-projects/${project.id}/analysis`, {cache: "no-store"})
    .then(async response => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || data.error || "mv_analysis_unavailable");
      return data;
    })
    .then(data => {
      if (version !== mvAnalysisFetchVersion || currentMV?.id !== project.id) return;
      if (data.music_source_id !== project.music_source_id) throw new Error("mv_analysis_source_mismatch");
      mvAnalysis = data.result ? {music_source_id: data.music_source_id, result: data.result, cached: true} : null;
      setMVAnalysisStatus(mvAnalysis ? "mvAnalysisComplete" : "mvAnalysisIdle");
      renderMVTimeline();
      updateMVAnalysisControls();
    })
    .catch(error => {
      if (version === mvAnalysisFetchVersion && currentMV?.id === project.id) {
        setMVAnalysisStatus("mvAnalysisFailed", error.message);
        renderMVTimeline();
      }
    });
  updateMVAnalysisControls();
}

function scheduleMVAnalysisPoll(jobId) {
  if (mvAnalysisPollTimer) window.clearTimeout(mvAnalysisPollTimer);
  mvAnalysisPollTimer = window.setTimeout(() => pollMVAnalysis(jobId), 1000);
}

async function pollMVAnalysis(jobId) {
  if (mvAnalysisJob?.id !== jobId) return;
  try {
    const response = await fetch(`/api/mv-analysis/${jobId}`, {cache: "no-store"});
    const data = await response.json();
    if (!response.ok || !data.job) throw new Error(data.error || "mv_analysis_unavailable");
    mvAnalysisJob = data.job;
    if (["queued", "running", "cancelling"].includes(data.job.status)) {
      const statusKey = data.job.status === "cancelling" ? "mvAnalysisCancelling" :
        data.job.status === "queued" ? "mvAnalysisQueued" :
          data.job.stage === "signal" ? "mvAnalysisSignal" : "mvAnalysisBeats";
      setMVAnalysisStatus(statusKey);
      scheduleMVAnalysisPoll(jobId);
    } else {
      mvAnalysisJob = null;
      if (data.job.status === "completed" && data.job.result) {
        mvAnalysis = {music_source_id: data.job.music_source_id, result: data.job.result};
        setMVAnalysisStatus("mvAnalysisComplete");
      } else if (data.job.status === "cancelled") {
        setMVAnalysisStatus("mvAnalysisCancelled");
      } else {
        setMVAnalysisStatus("mvAnalysisFailed", data.job.error || "");
      }
      renderMVTimeline();
    }
    updateMVAnalysisControls();
  } catch (error) {
    setMVAnalysisStatus("mvAnalysisFailed", error.message);
    scheduleMVAnalysisPoll(jobId);
  }
}

async function startMVAnalysis() {
  if (mvBusy || mvAnalysisJob || !currentMV?.id) return;
  const project = currentMV;
  updateMVAnalysisControls();
  setMVAnalysisStatus("mvAnalysisQueued");
  try {
    const response = await fetch(`/api/mv-projects/${project.id}/analyze`, {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({revision: project.revision})
    });
    const data = await response.json();
    if (!response.ok || !data.job) throw new Error(data.detail || data.error || "mv_analysis_failed");
    mvAnalysisJob = data.job;
    if (data.job.status === "completed" && data.job.result) {
      mvAnalysis = {music_source_id: data.job.music_source_id, result: data.job.result, cached: true};
      mvAnalysisJob = null;
      setMVAnalysisStatus("mvAnalysisComplete");
      renderMVTimeline();
    } else {
      scheduleMVAnalysisPoll(data.job.id);
    }
    updateMVAnalysisControls();
  } catch (error) {
    setMVAnalysisStatus("mvAnalysisFailed", error.message);
    updateMVAnalysisControls();
  }
}

async function cancelMVAnalysis() {
  const jobId = mvAnalysisJob?.id;
  if (!jobId || mvBusy) return;
  document.querySelector("#mv-cancel-analysis").disabled = true;
  try {
    const response = await fetch(`/api/mv-analysis/${jobId}/cancel`, {
      method: "POST", headers: {"Content-Type": "application/json"}, body: "{}"
    });
    const data = await response.json();
    if (!response.ok || !data.job) throw new Error(data.detail || data.error || "mv_analysis_cancel_failed");
    mvAnalysisJob = data.job;
    setMVAnalysisStatus("mvAnalysisCancelling");
    scheduleMVAnalysisPoll(jobId);
  } catch (error) {
    setMVAnalysisStatus("mvAnalysisFailed", error.message);
    updateMVAnalysisControls();
  }
}

function refreshMVMusicSources() {
  const select = document.querySelector("#mv-music");
  const selected = select.value;
  const options = [new Option(t("mvChoose"), "")];
  historyItems.filter(item => item.kind === "music" && item.audio_url).forEach(item => {
    options.push(new Option(`${item.name || item.prompt?.slice(0, 60) || item.id.slice(0, 8)} · ${item.id.slice(0, 8)}`, item.id));
  });
  mvMusicSources.forEach(item => {
    options.push(new Option(`WAV · ${item.name} · ${item.id.slice(0, 8)}`, item.id));
  });
  if (selected && !options.some(option => option.value === selected)) {
    const missing = new Option(`${t("mvMissing")} · ${selected.slice(0, 8)}`, selected);
    missing.disabled = true;
    options.push(missing);
  }
  select.replaceChildren(...options);
  select.value = selected;
  updateMVMusicPreview();
}

function updateMVMusicPreview() {
  const id = document.querySelector("#mv-music").value;
  const item = historyItems.find(item => item.kind === "music" && item.id === id && item.audio_url)
    || mvMusicSources.find(item => item.id === id && item.audio_url);
  const player = document.querySelector("#mv-audio");
  if (player.dataset.musicId !== id || !item) {
    player.pause();
    player.removeAttribute("src");
    if (item) player.src = item.audio_url;
    player.dataset.musicId = id;
  }
  player.hidden = !item;
  document.querySelector("#mv-save").disabled = mvBusy || !item;
  updateMVAnalysisControls();
}

function openMVProject(project = null) {
  if (mvBusy || window.MiniMuvVisualReferences?.busy() || (mvDirty && !window.confirm(t("mvDiscard")))) return false;
  if (window.MiniMuvMVGeneration && !window.MiniMuvMVGeneration.canLeave()) return false;
  currentMV = project;
  document.querySelector("#mv-name").value = project?.name || "";
  mvPromptInput.value = project?.prompt || "";
  window.MiniMuvVisualReferences?.load("mv", project?.visual_references);
  window.MiniMuvVideoPrompts?.load("mv", project?.negative_prompt || "");
  mvPromptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("", "mv");
  document.querySelector("#mv-aspect").value = project?.aspect || "16:9";
  const select = document.querySelector("#mv-music");
  select.replaceChildren(new Option("", project?.music_source_id || ""));
  select.value = project?.music_source_id || "";
  mvDirty = false;
  refreshMVMusicSources();
  if (!mvAnalysisJob) loadMVAnalysis();
  else updateMVAnalysisControls();
  showMVMessage(project && !project.music_available ? t("mvMissing") : "", Boolean(project && !project.music_available));
  renderMVDrafts();
  renderHistory();
  window.MiniMuvMVGeneration?.refresh();
  return true;
}

function renderMVDrafts() {
  const container = document.querySelector("#mv-drafts");
  if (!container) return;
  container.replaceChildren();
}

async function loadMVProjects() {
  const version = ++mvFetchVersion;
  try {
    const response = await fetch("/api/mv-projects", {cache: "no-store"});
    const data = await response.json();
    if (version !== mvFetchVersion) return;
    if (!response.ok) throw new Error(data.detail || data.error);
    if (!Array.isArray(data.items)) throw new Error("invalid_mv_response");
    mvProjects = data.items;
    renderMVDrafts();
    renderHistory();
    return true;
  } catch (error) {
    if (version === mvFetchVersion) showMVMessage(`${t("mvError")}: ${error.message}`, true);
    return false;
  }
}

async function saveMVProject(event) {
  event.preventDefault();
  if (mvBusy || window.MiniMuvVisualReferences?.busy()) return;
  if (window.MiniMuvMVGeneration && !window.MiniMuvMVGeneration.canLeave()) return;
  setMVBusy(true);
  try {
    const response = await fetch(currentMV ? `/api/mv-projects/${currentMV.id}/update` : "/api/mv-projects", {
      method: "POST", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: document.querySelector("#mv-name").value.trim(),
        prompt: document.querySelector("#mv-prompt").value.trim(),
        aspect: document.querySelector("#mv-aspect").value,
        music_source_id: document.querySelector("#mv-music").value,
        ...(window.MiniMuvVisualReferences ? {
          visual_references: window.MiniMuvVisualReferences.payload("mv")
        } : {}),
        ...(window.MiniMuvVideoPrompts?.payload("mv") || {}),
        ...(currentMV ? {revision: currentMV.revision} : {})
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error);
    currentMV = data.project;
    mvDirty = false;
    if (await loadMVProjects()) showMVMessage(t("mvSaved"));
    loadMVAnalysis();
    window.MiniMuvMVGeneration?.refresh();
  } catch (error) {
    showMVMessage(`${t("mvError")}: ${error.message}`, true);
  } finally {
    setMVBusy(false);
  }
}

async function loadMVMusicSources() {
  const version = ++mvMusicFetchVersion;
  try {
    const response = await fetch("/api/mv-music", {cache: "no-store"});
    const data = await response.json();
    if (version !== mvMusicFetchVersion) return;
    if (!response.ok || !Array.isArray(data.items)) throw new Error(data.detail || data.error || "invalid_mv_response");
    mvMusicSources = data.items;
    refreshMVMusicSources();
    return true;
  } catch (error) {
    if (version === mvMusicFetchVersion) showMVMessage(`${t("mvError")}: ${error.message}`, true);
    return false;
  }
}

async function uploadMVMusic(event) {
  const input = event.target;
  const file = input.files?.[0];
  if (mvBusy || !file) return;
  if (!file.name.toLowerCase().endsWith(".wav") || !file.size || file.size > 512 * 1024 * 1024) {
    showMVMessage(t(file.size > 512 * 1024 * 1024 ? "mvUploadLimit" : "mvUploadInvalid"), true);
    input.value = "";
    return;
  }
  setMVBusy(true);
  showMVMessage(t("mvUploading"));
  try {
    const response = await fetch(`/api/mv-music?name=${encodeURIComponent(file.name)}`, {
      method: "POST", headers: {"Content-Type": "audio/wav"}, body: file
    });
    const data = await response.json();
    if (!response.ok) {
      const keys = {invalid_mv_wav: "mvUploadInvalid", mv_wav_limit: "mvUploadLimit",
        mv_music_storage_full: "mvUploadFull"};
      throw new Error(keys[data.error] ? t(keys[data.error]) : data.detail || data.error || t("mvError"));
    }
    mvMusicFetchVersion += 1;
    mvMusicSources = [data.item, ...mvMusicSources.filter(item => item.id !== data.item.id)];
    const select = document.querySelector("#mv-music");
    select.replaceChildren(new Option(data.item.name, data.item.id));
    select.value = data.item.id;
    mvDirty = true;
    refreshMVMusicSources();
    showMVMessage(t("mvUploaded"));
  } catch (error) {
    showMVMessage(`${t("mvError")}: ${error.message}`, true);
  } finally {
    input.value = "";
    setMVBusy(false);
  }
}

const downloadControlTranslations = {
  "zh-CN": ["下载 / 继续", "暂停下载", "请先保存模型目录和 Gemma 路径。", "外部下载正在运行，不能重复启动或在此暂停。", "后台下载已启动；中断后每 5 分钟重试，最多 12 次。", "正在暂停下载；共用编码器也将暂停，已下载数据保留。"],
  "zh-TW": ["下載 / 繼續", "暫停下載", "請先儲存模型目錄和 Gemma 路徑。", "外部下載正在執行，無法重複啟動或在此暫停。", "背景下載已啟動；中斷後每 5 分鐘重試，最多 12 次。", "正在暫停下載及共用編碼器，已下載資料保留。"],
  en: ["Download / resume", "Pause download", "Save the model directory and Gemma path first.", "An external download is active; it cannot be duplicated or paused here.", "Background download started; interrupted transfers retry every 5 minutes, up to 12 attempts.", "Pausing download and shared encoders; downloaded bytes are retained."],
  fr: ["Télécharger / reprendre", "Mettre en pause", "Enregistrez d’abord les chemins du modèle et de Gemma.", "Un téléchargement externe est actif ; impossible de le dupliquer ou de le suspendre ici.", "Téléchargement lancé ; reprise toutes les 5 minutes, jusqu’à 12 tentatives.", "Pause du modèle et des encodeurs partagés ; données conservées."],
  de: ["Herunterladen / fortsetzen", "Download pausieren", "Zuerst Modellverzeichnis und Gemma-Pfad speichern.", "Ein externer Download läuft; hier weder duplizieren noch pausieren.", "Download gestartet; Wiederholung alle 5 Minuten, bis zu 12 Versuche.", "Modell und gemeinsame Encoder werden pausiert; Daten bleiben erhalten."],
  ja: ["ダウンロード / 再開", "ダウンロードを停止", "先にモデルと Gemma のパスを保存してください。", "外部ダウンロードが実行中のため、ここでは重複開始や停止できません。", "バックグラウンドで開始しました。中断後は5分ごと、最大12回試行します。", "モデルと共用エンコーダーを停止中です。取得済みデータは保持します。"],
  ko: ["다운로드 / 재개", "다운로드 일시 중지", "모델 디렉터리와 Gemma 경로를 먼저 저장하세요.", "외부 다운로드가 실행 중입니다. 여기서 중복 시작하거나 중지할 수 없습니다.", "백그라운드 다운로드 시작; 중단 시 5분마다 최대 12회 시도합니다.", "모델과 공유 인코더 중지 중; 다운로드한 데이터는 유지됩니다."],
  es: ["Descargar / reanudar", "Pausar descarga", "Guarde primero las rutas del modelo y de Gemma.", "Hay una descarga externa activa; no se puede duplicar ni pausar aquí.", "Descarga iniciada; reintentos cada 5 minutos, hasta 12 intentos.", "Pausando modelo y codificadores compartidos; se conservan los datos."],
  pt: ["Baixar / retomar", "Pausar download", "Salve primeiro os caminhos do modelo e do Gemma.", "Há um download externo ativo; não é possível duplicá-lo ou pausá-lo aqui.", "Download iniciado; tentativas a cada 5 minutos, até 12 vezes.", "Pausando modelo e codificadores compartilhados; dados preservados."],
  tr: ["İndir / devam et", "İndirmeyi duraklat", "Önce model dizinini ve Gemma yolunu kaydedin.", "Harici indirme etkin; burada yinelenemez veya duraklatılamaz.", "İndirme başladı; 5 dakikada bir, en fazla 12 deneme.", "Model ve ortak kodlayıcılar duraklatılıyor; indirilen veriler korunur."],
  ar: ["تنزيل / استئناف", "إيقاف التنزيل مؤقتًا", "احفظ مساري النموذج وGemma أولاً.", "يوجد تنزيل خارجي نشط؛ لا يمكن تكراره أو إيقافه هنا.", "بدأ التنزيل؛ إعادة المحاولة كل 5 دقائق حتى 12 محاولة.", "جارٍ إيقاف النموذج والمشفّرات المشتركة؛ تُحفظ البيانات."],
  vi: ["Tải / tiếp tục", "Tạm dừng tải", "Lưu đường dẫn mô hình và Gemma trước.", "Đang có tải bên ngoài; không thể tải trùng hoặc tạm dừng tại đây.", "Đã bắt đầu tải nền; thử lại mỗi 5 phút, tối đa 12 lần.", "Đang tạm dừng mô hình và bộ mã hóa chung; giữ dữ liệu đã tải."],
  id: ["Unduh / lanjutkan", "Jeda unduhan", "Simpan direktori model dan jalur Gemma dahulu.", "Unduhan eksternal aktif; tidak dapat digandakan atau dijeda di sini.", "Unduhan dimulai; mencoba ulang tiap 5 menit, hingga 12 percobaan.", "Menjeda model dan encoder bersama; data unduhan dipertahankan."],
  ru: ["Скачать / продолжить", "Приостановить", "Сначала сохраните пути модели и Gemma.", "Идёт внешняя загрузка; здесь нельзя дублировать или приостановить её.", "Загрузка началась; повтор каждые 5 минут, до 12 попыток.", "Модель и общие кодировщики приостанавливаются; данные сохраняются."],
};
const languageSelect = document.querySelector("#language");
const historyTranslations = {
  "zh-CN": { historyTitle: "历史项目", historyCategory: "历史项目分类", historyAll: "全部", historyVideo: "视频", historyImage: "图像", historyMusic: "音乐", historyEmpty: "暂无此分类的历史项目", historyNoPrompt: "未保存提示词", historyLoadError: "无法读取历史项目", historyCount: "个项目", projectName: '项目名称', projectNamePlaceholder: '可选，例如：片头海浪镜头', workflowNamePlaceholder: '例如：海边日落旅行短片', workflowNameHint: '用于识别长视频项目并显示在历史记录中；留空将使用 “Untitled video”，最多 120 字。' },
  en: { historyTitle: "Project history", historyCategory: "History category", historyAll: "All", historyVideo: "Video", historyImage: "Image", historyMusic: "Music", historyEmpty: "No projects in this category yet", historyNoPrompt: "Prompt not saved", historyLoadError: "Could not load project history", historyCount: "items", projectName: 'Project name', projectNamePlaceholder: 'Optional, e.g. Opening ocean shot', workflowNamePlaceholder: 'e.g. Seaside sunset travel film', workflowNameHint: 'Identifies the long video in history. Leave blank to use “Untitled video”; up to 120 characters.' },
  "zh-TW": { historyTitle: "歷史專案", historyCategory: "歷史專案分類", historyAll: "全部", historyVideo: "影片", historyImage: "圖片", historyMusic: "音樂", historyEmpty: "此分類目前沒有歷史專案", historyNoPrompt: "未儲存提示詞", historyLoadError: "無法讀取歷史專案", historyCount: "個專案", projectName: '專案名稱', projectNamePlaceholder: '選填，例如：片頭海浪鏡頭', workflowNamePlaceholder: '例如：海邊夕陽旅行短片', workflowNameHint: '用於識別長影片專案並顯示在歷史紀錄中；留空將使用「Untitled video」，最多 120 字。' },
  fr: { historyTitle: "Historique des créations", historyCategory: "Catégorie de l’historique", historyAll: "Tout", historyVideo: "Vidéo", historyImage: "Image", historyMusic: "Musique", historyEmpty: "Aucune création dans cette catégorie", historyNoPrompt: "Prompt non enregistré", historyLoadError: "Impossible de charger l’historique", historyCount: "éléments", projectName: 'Nom du projet', projectNamePlaceholder: 'Facultatif, ex. Plan d’ouverture sur l’océan', workflowNamePlaceholder: 'ex. Film de voyage au coucher du soleil', workflowNameHint: 'Identifie la vidéo longue dans l’historique. Laissez vide pour « Untitled video » ; 120 caractères max.' },
  de: { historyTitle: "Projektverlauf", historyCategory: "Verlaufskategorie", historyAll: "Alle", historyVideo: "Video", historyImage: "Bild", historyMusic: "Musik", historyEmpty: "Noch keine Projekte in dieser Kategorie", historyNoPrompt: "Prompt nicht gespeichert", historyLoadError: "Projektverlauf konnte nicht geladen werden", historyCount: "Einträge", projectName: 'Projektname', projectNamePlaceholder: 'Optional, z. B. Eröffnungsszene am Meer', workflowNamePlaceholder: 'z. B. Reisefilm Sonnenuntergang am Meer', workflowNameHint: 'Kennzeichnet das lange Video im Verlauf. Leer lassen für „Untitled video“; max. 120 Zeichen.' },
  ja: { historyTitle: "履歴", historyCategory: "履歴カテゴリ", historyAll: "すべて", historyVideo: "動画", historyImage: "画像", historyMusic: "音楽", historyEmpty: "このカテゴリの履歴はありません", historyNoPrompt: "プロンプトは保存されていません", historyLoadError: "履歴を読み込めませんでした", historyCount: "件", projectName: 'プロジェクト名', projectNamePlaceholder: '任意。例：オープニングの海のショット', workflowNamePlaceholder: '例：海辺の夕日旅行ショートフィルム', workflowNameHint: '長尺動画を履歴で識別するための名前です。空欄の場合は「Untitled video」、最大 120 文字。' },
  ko: { historyTitle: "프로젝트 기록", historyCategory: "기록 카테고리", historyAll: "전체", historyVideo: "동영상", historyImage: "이미지", historyMusic: "음악", historyEmpty: "이 카테고리에 기록이 없습니다", historyNoPrompt: "프롬프트가 저장되지 않았습니다", historyLoadError: "프로젝트 기록을 불러올 수 없습니다", historyCount: "개 항목", projectName: '프로젝트 이름', projectNamePlaceholder: '선택 사항, 예: 오프닝 바다 장면', workflowNamePlaceholder: '예: 해변 노을 여행 영상', workflowNameHint: '긴 영상 프로젝트를 기록에서 구분합니다. 비워 두면 “Untitled video”가 사용되며 최대 120자입니다.' },
  es: { historyTitle: "Historial de proyectos", historyCategory: "Categoría del historial", historyAll: "Todo", historyVideo: "Vídeo", historyImage: "Imagen", historyMusic: "Música", historyEmpty: "Aún no hay proyectos en esta categoría", historyNoPrompt: "Prompt no guardado", historyLoadError: "No se pudo cargar el historial", historyCount: "elementos", projectName: 'Nombre del proyecto', projectNamePlaceholder: 'Opcional, p. ej. Plano inicial del océano', workflowNamePlaceholder: 'p. ej. Viaje al atardecer junto al mar', workflowNameHint: 'Identifica el vídeo largo en el historial. Déjalo vacío para usar «Untitled video»; máx. 120 caracteres.' },
  pt: { historyTitle: "Histórico de projetos", historyCategory: "Categoria do histórico", historyAll: "Todos", historyVideo: "Vídeo", historyImage: "Imagem", historyMusic: "Música", historyEmpty: "Ainda não há projetos nesta categoria", historyNoPrompt: "Prompt não salvo", historyLoadError: "Não foi possível carregar o histórico", historyCount: "itens", projectName: 'Nome do projeto', projectNamePlaceholder: 'Opcional, ex.: Cena de abertura do oceano', workflowNamePlaceholder: 'ex.: Viagem ao pôr do sol na praia', workflowNameHint: 'Identifica o vídeo longo no histórico. Deixe vazio para usar “Untitled video”; até 120 caracteres.' },
  tr: { historyTitle: "Proje geçmişi", historyCategory: "Geçmiş kategorisi", historyAll: "Tümü", historyVideo: "Video", historyImage: "Görsel", historyMusic: "Müzik", historyEmpty: "Bu kategoride henüz proje yok", historyNoPrompt: "İstem kaydedilmedi", historyLoadError: "Proje geçmişi yüklenemedi", historyCount: "öğe", projectName: 'Proje adı', projectNamePlaceholder: 'İsteğe bağlı, ör. Açılış okyanus çekimi', workflowNamePlaceholder: 'ör. Sahilde gün batımı gezi filmi', workflowNameHint: 'Uzun videoyu geçmişte tanımlar. Boş bırakılırsa “Untitled video” kullanılır; en fazla 120 karakter.' },
  ar: { historyTitle: "سجل المشاريع", historyCategory: "فئة السجل", historyAll: "الكل", historyVideo: "فيديو", historyImage: "صورة", historyMusic: "موسيقى", historyEmpty: "لا توجد مشاريع في هذه الفئة بعد", historyNoPrompt: "لم يُحفظ الوصف", historyLoadError: "تعذر تحميل سجل المشاريع", historyCount: "عناصر", projectName: 'اسم المشروع', projectNamePlaceholder: 'اختياري، مثل: لقطة المحيط الافتتاحية', workflowNamePlaceholder: 'مثال: فيلم رحلة غروب الشمس على الشاطئ', workflowNameHint: 'يُستخدم لتمييز الفيديو الطويل في السجل. اتركه فارغًا لاستخدام “Untitled video”؛ بحد أقصى 120 حرفًا.' },
  vi: { historyTitle: "Lịch sử dự án", historyCategory: "Danh mục lịch sử", historyAll: "Tất cả", historyVideo: "Video", historyImage: "Hình ảnh", historyMusic: "Âm nhạc", historyEmpty: "Chưa có dự án trong danh mục này", historyNoPrompt: "Chưa lưu câu lệnh", historyLoadError: "Không thể tải lịch sử dự án", historyCount: "mục", projectName: 'Tên dự án', projectNamePlaceholder: 'Không bắt buộc, ví dụ: Cảnh biển mở đầu', workflowNamePlaceholder: 'ví dụ: Phim du lịch hoàng hôn bên biển', workflowNameHint: 'Dùng để nhận diện video dài trong lịch sử. Để trống sẽ dùng “Untitled video”; tối đa 120 ký tự.' },
  id: { historyTitle: "Riwayat proyek", historyCategory: "Kategori riwayat", historyAll: "Semua", historyVideo: "Video", historyImage: "Gambar", historyMusic: "Musik", historyEmpty: "Belum ada proyek dalam kategori ini", historyNoPrompt: "Prompt tidak disimpan", historyLoadError: "Riwayat proyek tidak dapat dimuat", historyCount: "item", projectName: 'Nama proyek', projectNamePlaceholder: 'Opsional, mis. Adegan pembuka laut', workflowNamePlaceholder: 'mis. Film perjalanan senja di pantai', workflowNameHint: 'Mengidentifikasi video panjang di riwayat. Kosongkan untuk memakai “Untitled video”; maks. 120 karakter.' },
  ru: { historyTitle: "История проектов", historyCategory: "Категория истории", historyAll: "Все", historyVideo: "Видео", historyImage: "Изображения", historyMusic: "Музыка", historyEmpty: "В этой категории пока нет проектов", historyNoPrompt: "Промпт не сохранён", historyLoadError: "Не удалось загрузить историю проектов", historyCount: "элементов", projectName: 'Название проекта', projectNamePlaceholder: 'Необязательно, например: Вступительный кадр океана', workflowNamePlaceholder: 'например: Путешествие на закате у моря', workflowNameHint: 'Помогает найти длинное видео в истории. Если оставить пустым — «Untitled video»; до 120 символов.' }
};
const historyModeTranslations = {
  "zh-CN": "播客制作", en: "Podcast", "zh-TW": "播客製作", fr: "Production de podcast",
  de: "Podcast-Produktion", ja: "ポッドキャスト制作", ko: "팟캐스트 제작", es: "Producción de pódcast",
  pt: "Produção de podcast", tr: "Podcast üretimi", ar: "إنتاج بودكاست", vi: "Sản xuất podcast",
  id: "Produksi podcast", ru: "Производство подкаста"
};
for (const [language, label] of Object.entries(historyModeTranslations)) {
  historyTranslations[language].modePodcast = label;
}
const settingsDialog = document.querySelector("#settings-dialog");
const settingsSections = [
  { key: "models", nav: document.querySelector("#settings-nav-models"), pane: document.querySelector("#settings-pane-models") },
  { key: "prompts", nav: document.querySelector("#prompts-open"), pane: document.querySelector("#prompts-dialog") },
  { key: "skills", nav: document.querySelector("#skills-open"), pane: document.querySelector("#skills-dialog") }
];

function selectSettingsSection(key) {
  for (const section of settingsSections) {
    const active = section.key === key;
    section.pane.hidden = !active;
    section.nav.setAttribute("aria-selected", active ? "true" : "false");
    if (section.key !== "models") section.pane.open = active && settingsDialog.open;
  }
}

function openSettingsSection(key) {
  if (!settingsDialog.open) settingsDialog.showModal();
  selectSettingsSection(key);
}

for (const section of settingsSections) {
  section.nav.addEventListener("click", () => openSettingsSection(section.key));
  if (section.key === "models") continue;
  // The prompt and skill panels keep their own show/close calls after being merged into this dialog.
  section.pane.showModal = () => openSettingsSection(section.key);
  section.pane.close = () => settingsDialog.close();
}
settingsDialog.addEventListener("close", () => selectSettingsSection("models"));
settingsDialog.addEventListener("cancel", event => {
  const active = settingsSections.find(section => section.key !== "models" && !section.pane.hidden);
  if (!active) return;
  if (!active.pane.dispatchEvent(new Event("cancel", { cancelable: true }))) event.preventDefault();
});
const settingsForm = document.querySelector("#settings-form");
const settingsStatus = document.querySelector("#settings-status");
const settingsSaveButton = document.querySelector("#settings-save");
const form = document.querySelector("#generation-form");
const videoModelChoice = document.querySelector("#video-model-choice");
const imageModelChoice = document.querySelector("#image-model-choice");
const musicModelChoice = document.querySelector("#music-model-choice");
const promptInput = document.querySelector("#prompt");
const projectNameInput = document.querySelector("#project-name");
const promptEnhancerModel = document.querySelector("#prompt-enhancer-model");
const enhancePromptButton = document.querySelector("#enhance-prompt-button");
const promptEnhancerStatus = document.querySelector("#prompt-enhancer-status");
const promptEnhancerResult = document.querySelector("#prompt-enhancer-result");
const promptEnhancerKeywords = document.querySelector("#prompt-enhancer-keywords");
const promptEnhancerOutput = document.querySelector("#prompt-enhancer-output");
const applyEnhancedPromptButton = document.querySelector("#apply-enhanced-prompt");
const dismissEnhancedPromptButton = document.querySelector("#dismiss-enhanced-prompt");
const mvPromptInput = document.querySelector("#mv-prompt");
const mvPromptEnhancerModel = document.querySelector("#mv-prompt-enhancer-model");
const mvEnhancePromptButton = document.querySelector("#mv-enhance-prompt-button");
const mvPromptEnhancerStatus = document.querySelector("#mv-prompt-enhancer-status");
const mvPromptEnhancerResult = document.querySelector("#mv-prompt-enhancer-result");
const mvPromptEnhancerKeywords = document.querySelector("#mv-prompt-enhancer-keywords");
const mvPromptEnhancerOutput = document.querySelector("#mv-prompt-enhancer-output");
const mvApplyEnhancedPromptButton = document.querySelector("#mv-apply-enhanced-prompt");
const mvDismissEnhancedPromptButton = document.querySelector("#mv-dismiss-enhanced-prompt");
const generateButton = document.querySelector("#generate-button");
const generateLabel = document.querySelector("#generate-label");
const videoModeButton = document.querySelector("#video-mode-button");
const imageModeButton = document.querySelector("#image-mode-button");
const musicModeButton = document.querySelector("#music-mode-button");
const workflowModeButton = document.querySelector("#workflow-mode-button");
const workflowPanel = document.querySelector("#workflow-panel");
const workflowShots = document.querySelector("#workflow-shots");
const workflowShotTemplate = document.querySelector("#workflow-shot-template");
const workflowMusic = document.querySelector("#workflow-music");
const workflowTextModel = document.querySelector("#workflow-text-model");
const workflowPlanStory = document.querySelector("#workflow-plan-story");
const workflowStoryStatus = document.querySelector("#workflow-story-status");
const workflowGlobalMusicWrapper = document.querySelector("#workflow-global-music-wrapper");
const workflowGlobalMusicPrompt = document.querySelector("#workflow-global-music-prompt");
const workflowGlobalMusicPromptWrapper = document.querySelector("#workflow-global-music-prompt-wrapper");
const mvModeButton = document.querySelector("#mv-mode-button");
const workflowStatus = document.querySelector("#workflow-status");
const workflowMessage = document.querySelector("#workflow-message");
const workflowSaveButton = document.querySelector("#workflow-save");
const workflowStartButton = document.querySelector("#workflow-start");
const workflowResumeButton = document.querySelector("#workflow-resume");
const workflowRestoreButton = document.querySelector("#workflow-restore");
const workflowCancelButton = document.querySelector("#workflow-cancel");
const videoModelSection = document.querySelector("#video-model-section");
const imageModelSection = document.querySelector("#image-model-section");
const musicModelSection = document.querySelector("#music-model-section");
const generationModelPicker = document.querySelector("#generation-model-picker");
const generationModelSummary = document.querySelector("#generation-model-summary");
const videoControls = document.querySelector("#video-controls");
const imageControls = document.querySelector("#image-controls");
const musicControls = document.querySelector("#music-controls");
const musicLyricsMode = document.querySelector("#music-lyrics-mode");
const musicLyricsField = document.querySelector("#music-lyrics-field");
const musicLyricsInput = document.querySelector("#music-lyrics");
const musicModelTitle = document.querySelector("#music-model-title");
const musicModelDescription = document.querySelector("#music-model-description");
const musicModelNotice = document.querySelector("#music-model-notice");
const modelNotice = document.querySelector("#model-notice");
const modelTitle = document.querySelector("#model-title");
const modelDescription = document.querySelector("#model-description");
const modelLinks = document.querySelector("#model-links");
const loadModelButton = document.querySelector("#load-model-button");
const turboToggle = document.querySelector("#turbo");
const stepsSelect = document.querySelector("#steps");
const statusChip = document.querySelector("#job-status");
const jobMetrics = document.querySelector("#job-metrics");
const emptyState = document.querySelector("#empty-state");
const loadingState = document.querySelector("#loading-state");
const loadingTitle = document.querySelector("#loading-title");
const cancelButton = document.querySelector("#cancel-button");
const video = document.querySelector("#video-result");
const image = document.querySelector("#image-result");
const imageCandidates = document.querySelector("#image-candidates");
const audio = document.querySelector("#audio-result");
const resultFooter = document.querySelector("#result-footer");
const imageModelNotice = document.querySelector("#image-model-notice");
const imageModelTitle = document.querySelector("#image-model-title");
const imageModelDescription = document.querySelector("#image-model-description");
const imageModelLinks = document.querySelector("#image-model-links");
const imageDownloadLink = document.querySelector("#download-image");
const logPanel = document.querySelector("#log-panel");
const jobLogs = document.querySelector("#job-logs");
const logCopyTranslations = {
  en: ["Copy all logs", "Logs copied", "Could not copy logs. Check clipboard permissions.", "No logs to copy."],
  "zh-CN": ["复制全部日志", "日志已复制", "复制失败，请检查剪贴板权限。", "暂无日志可复制。"],
  "zh-TW": ["複製全部日誌", "日誌已複製", "複製失敗，請檢查剪貼簿權限。", "暫無日誌可複製。"],
  fr: ["Copier tous les journaux", "Journaux copiés", "Échec de copie. Vérifiez les autorisations du presse-papiers.", "Aucun journal à copier."],
  de: ["Alle Protokolle kopieren", "Protokolle kopiert", "Kopieren fehlgeschlagen. Zwischenablage-Berechtigung prüfen.", "Keine Protokolle zum Kopieren."],
  ja: ["ログをすべてコピー", "ログをコピーしました", "コピーできません。クリップボードの権限を確認してください。", "コピーするログがありません。"],
  ko: ["모든 로그 복사", "로그가 복사되었습니다", "복사하지 못했습니다. 클립보드 권한을 확인하세요.", "복사할 로그가 없습니다."],
  es: ["Copiar todos los registros", "Registros copiados", "No se pudo copiar. Comprueba los permisos del portapapeles.", "No hay registros para copiar."],
  pt: ["Copiar todos os registros", "Registros copiados", "Falha ao copiar. Verifique as permissões da área de transferência.", "Não há registros para copiar."],
  tr: ["Tüm günlükleri kopyala", "Günlükler kopyalandı", "Kopyalanamadı. Pano izinlerini kontrol edin.", "Kopyalanacak günlük yok."],
  ar: ["نسخ جميع السجلات", "تم نسخ السجلات", "تعذر النسخ. تحقق من أذونات الحافظة.", "لا توجد سجلات للنسخ."],
  vi: ["Sao chép toàn bộ nhật ký", "Đã sao chép nhật ký", "Không thể sao chép. Kiểm tra quyền bảng nhớ tạm.", "Không có nhật ký để sao chép."],
  id: ["Salin semua log", "Log disalin", "Gagal menyalin. Periksa izin papan klip.", "Tidak ada log untuk disalin."],
  ru: ["Копировать весь журнал", "Журнал скопирован", "Не удалось скопировать. Проверьте разрешения буфера обмена.", "Нет записей для копирования."]
};
let logCopyStatusIndex = null;
function updateLogCopyLanguage() {
  const labels = logCopyTranslations[languageSelect.value] || logCopyTranslations.en;
  const button = document.querySelector("#copy-logs");
  button.title = labels[0];
  button.setAttribute("aria-label", labels[0]);
  const status = document.querySelector("#copy-logs-status");
  status.hidden = logCopyStatusIndex === null;
  status.textContent = logCopyStatusIndex === null ? "" : labels[logCopyStatusIndex];
}
async function copyJobLogs() {
  const button = document.querySelector("#copy-logs");
  if (button.disabled) return;
  const text = jobLogs.textContent;
  if (!text) {
    logCopyStatusIndex = 3;
    updateLogCopyLanguage();
    return;
  }
  button.disabled = true;
  logCopyStatusIndex = null;
  updateLogCopyLanguage();
  try {
    await navigator.clipboard.writeText(text);
    logCopyStatusIndex = 1;
  } catch (error) {
    console.error("Failed to copy generation logs:", error);
    logCopyStatusIndex = 2;
  } finally {
    button.disabled = false;
    updateLogCopyLanguage();
  }
}
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
let mvPromptEnhancerStatusKey = "";
let activeMode = ["image", "music", "workflow", "mv", "podcast"].includes(localStorage.getItem("h3-mode"))
  ? localStorage.getItem("h3-mode")
  : "video";
let pollTimer = null;
let modelPollTimer = null;
let currentWorkflow = null;
let workflowPollTimer = null;
let workflowFetchVersion = 0;
let workflowItems = [];
const workflowListTranslations = {
  en: ["Workflow steps", "Expand workflow steps", "Collapse workflow steps"],
  "zh-CN": ["工作流清单", "展开工作流清单", "折叠工作流清单"],
  "zh-TW": ["工作流程清單", "展開工作流程清單", "摺疊工作流程清單"],
  fr: ["Étapes du workflow", "Développer les étapes", "Réduire les étapes"],
  de: ["Workflow-Schritte", "Workflow-Schritte erweitern", "Workflow-Schritte einklappen"],
  ja: ["ワークフロー手順", "手順を展開", "手順を折りたたむ"],
  ko: ["워크플로 단계", "단계 펼치기", "단계 접기"],
  es: ["Pasos del flujo", "Expandir pasos", "Contraer pasos"],
  pt: ["Etapas do fluxo", "Expandir etapas", "Recolher etapas"],
  tr: ["İş akışı adımları", "Adımları genişlet", "Adımları daralt"],
  ar: ["خطوات سير العمل", "توسيع الخطوات", "طيّ الخطوات"],
  vi: ["Các bước quy trình", "Mở rộng các bước", "Thu gọn các bước"],
  id: ["Langkah alur kerja", "Perluas langkah", "Ciutkan langkah"],
  ru: ["Шаги рабочего процесса", "Развернуть шаги", "Свернуть шаги"]
};
for (const [lang, values] of Object.entries(workflowListTranslations)) {
  ["workflowSteps", "workflowExpandSteps", "workflowCollapseSteps"].forEach((key, index) => {
    workflowTranslations[lang][key] = values[index];
  });
}
let workflowDeletion = null;
let workflowDeleteLastShot = null;
let workflowStructureBusy = false;

function updateWorkflowProgressToggle() {
  const button = document.querySelector("#workflow-progress-toggle");
  const expanded = button.getAttribute("aria-expanded") === "true";
  button.textContent = expanded ? "−" : "+";
  button.setAttribute("aria-label", t(expanded ? "workflowCollapseSteps" : "workflowExpandSteps"));
  button.title = button.getAttribute("aria-label");
  document.querySelector("#workflow-progress").hidden = !expanded;
}
let workflowShotSequence = 0;
let storyboardBusy = false;
let firstFrameBusy = false;
const DEFAULT_WORKFLOW_MUSIC_PROMPT =
  "Cinematic instrumental score, gentle build, emotional and cohesive";
workflowGlobalMusicPrompt.value = DEFAULT_WORKFLOW_MUSIC_PROMPT;

const themeKeys = ["theme", "themeAmber", "themeOcean", "themeForest", "themeViolet", "themePaper",
  "themeSky", "themeMint", "themeRose"];
const themeTranslations = {
  "zh-CN": ["主题", "琥珀夜色", "深海蓝", "森林绿", "暮光紫", "暖纸白", "晴空蓝", "薄荷绿", "樱花粉"],
  en: ["Theme", "Amber night", "Ocean blue", "Forest green", "Twilight violet", "Warm paper", "Clear sky", "Fresh mint", "Cherry blossom"],
  "zh-TW": ["主題", "琥珀夜色", "深海藍", "森林綠", "暮光紫", "暖紙白", "晴空藍", "薄荷綠", "櫻花粉"],
  fr: ["Thème", "Nuit ambrée", "Bleu océan", "Vert forêt", "Violet crépuscule", "Papier chaleureux", "Ciel clair", "Menthe fraîche", "Fleur de cerisier"],
  de: ["Thema", "Bernsteinnacht", "Ozeanblau", "Waldgrün", "Dämmerungsviolett", "Warmes Papier", "Klarer Himmel", "Frische Minze", "Kirschblüte"],
  ja: ["テーマ", "琥珀の夜", "オーシャンブルー", "フォレストグリーン", "夕暮れの紫", "温かな紙", "晴空ブルー", "ミントグリーン", "桜ピンク"],
  ko: ["테마", "호박빛 밤", "오션 블루", "포레스트 그린", "황혼의 보라", "따뜻한 종이", "맑은 하늘", "민트 그린", "벚꽃 핑크"],
  es: ["Tema", "Noche ámbar", "Azul océano", "Verde bosque", "Violeta crepuscular", "Papel cálido", "Cielo despejado", "Menta fresca", "Flor de cerezo"],
  pt: ["Tema", "Noite âmbar", "Azul oceano", "Verde floresta", "Violeta crepuscular", "Papel acolhedor", "Céu limpo", "Menta fresca", "Flor de cerejeira"],
  tr: ["Tema", "Kehribar gecesi", "Okyanus mavisi", "Orman yeşili", "Alacakaranlık moru", "Sıcak kâğıt", "Açık gökyüzü", "Taze nane", "Kiraz çiçeği"],
  ar: ["السمة", "ليلة كهرمانية", "أزرق المحيط", "أخضر الغابة", "بنفسجي الشفق", "ورق دافئ", "سماء صافية", "نعناع منعش", "زهر الكرز"],
  vi: ["Chủ đề", "Đêm hổ phách", "Xanh đại dương", "Xanh rừng", "Tím hoàng hôn", "Giấy ấm", "Trời xanh", "Bạc hà tươi", "Hoa anh đào"],
  id: ["Tema", "Malam ambar", "Biru samudra", "Hijau hutan", "Ungu senja", "Kertas hangat", "Langit cerah", "Mint segar", "Bunga sakura"],
  ru: ["Тема", "Янтарная ночь", "Синий океан", "Зелёный лес", "Фиолетовые сумерки", "Тёплая бумага", "Ясное небо", "Свежая мята", "Цветущая сакура"]
};
const themeColors = {
  amber: "#101113", ocean: "#0c1422", forest: "#101b17",
  violet: "#181322", paper: "#f5f1e9", sky: "#edf5fc", mint: "#edf7f1", rose: "#fcf0f3"
};

function applyTheme(value, persist = false) {
  const theme = Object.hasOwn(themeColors, value) ? value : "amber";
  document.documentElement.dataset.theme = theme;
  document.querySelector("#theme").value = theme;
  document.querySelector('meta[name="theme-color"]').content = themeColors[theme];
  if (persist) {
    try {
      localStorage.setItem("minimuv-theme", theme);
    } catch (error) {
      console.warn("MiniMuv could not save the theme preference.", error);
    }
  }
}

function initializeTheme() {
  let savedTheme = "amber";
  try {
    savedTheme = localStorage.getItem("minimuv-theme");
  } catch (error) {
    console.warn("MiniMuv could not read the theme preference.", error);
  }
  applyTheme(savedTheme);
  document.querySelector("#theme").addEventListener("change", (event) => {
    applyTheme(event.target.value, true);
  });
  window.addEventListener("storage", (event) => {
    if (event.key === "minimuv-theme" || event.key === null) applyTheme(event.newValue);
  });
}

function t(key) {
  const quickIndex = musicQuickKeys.indexOf(key);
  if (quickIndex !== -1) return (musicQuickTranslations[languageSelect.value] || musicQuickTranslations.en)[quickIndex];
  if (key === "modelSelection") return modelPickerTranslations[languageSelect.value] || modelPickerTranslations.en;
  const restoreIndex = historyRestoreKeys.indexOf(key);
  if (restoreIndex !== -1) return (historyRestoreTranslations[languageSelect.value] || historyRestoreTranslations.en)[restoreIndex];
  const uploadIndex = uploadKeys.indexOf(key);
  if (uploadIndex !== -1) return (uploadTranslations[languageSelect.value] || uploadTranslations.en)[uploadIndex];
  const themeIndex = themeKeys.indexOf(key);
  if (themeIndex !== -1) return (themeTranslations[languageSelect.value] || themeTranslations.en)[themeIndex];
  const frameIndex = firstFrameKeys.indexOf(key);
  if (frameIndex !== -1) return (firstFrameTranslations[languageSelect.value] || firstFrameTranslations.en)[frameIndex];
  const lang = languageSelect.value;
  const deleteKey = historyDeleteKeys.indexOf(key);
  if (deleteKey !== -1) return (historyDeleteTranslations[lang] || historyDeleteTranslations.en)[deleteKey];
  if (key === "musicYueNote") return musicYueNoteTranslations[lang] || musicYueNoteTranslations.en;
  if (key === "musicYueLink") return musicYueLinkTranslations[lang] || musicYueLinkTranslations.en;
  if (key === "errModelDisabled") return disabledModelTranslations[lang] || disabledModelTranslations.en;
  if (key === "turboLabel" || key === "turboV4Note") {
    return (turboV4Translations[lang] || turboV4Translations.en)[key === "turboLabel" ? 0 : 1];
  }
  const categoryKey = modelCategoryKeys.indexOf(key);
  if (categoryKey !== -1) return (modelCategoryTranslations[lang] || modelCategoryTranslations.en)[categoryKey];
  const modelSettingsKey = modelSettingsKeys.indexOf(key);
  if (modelSettingsKey !== -1) return (modelSettingsTranslations[lang] || modelSettingsTranslations.en)[modelSettingsKey];
  const downloadKey = downloadStatusKeys.indexOf(key);
  if (downloadKey !== -1) return (downloadStatusTranslations[lang] || downloadStatusTranslations.en)[downloadKey];
  if (key === "downloadSpeed") return downloadSpeedTranslations[lang] || downloadSpeedTranslations.en;
  const controlKey = downloadControlKeys.indexOf(key);
  if (controlKey !== -1) return (downloadControlTranslations[lang] || downloadControlTranslations.en)[controlKey];
  const timingKey = storyboardTimingKeys.indexOf(key);
  const replacementKey = ["storyboardGenerate", "storyboardAdded", "storyboardHint",
    "storyboardDurationHint", "storyboardModelLimited"].indexOf(key);
  if (replacementKey !== -1) {
    return (storyboardReplacementTranslations[lang] || storyboardReplacementTranslations.en)[replacementKey];
  }
  if (key === "imageResolution") return imageLongEdgeTranslations[lang] || imageLongEdgeTranslations.en;
  const imageQualityKey = imageQualityKeys.indexOf(key);
  if (imageQualityKey !== -1) {
    return (imageQualityTranslations[lang] || imageQualityTranslations.en)[imageQualityKey];
  }
  if (timingKey !== -1) return (storyboardTimingTranslations[lang] || storyboardTimingTranslations.en)[timingKey];
  return localModelTranslations[lang]?.[key] || localModelTranslations.en[key] || storyTranslations[lang]?.[key] || storyTranslations.en[key] || historyTranslations[lang]?.[key] || settingsTranslations[lang]?.[key] || promptEnhancerTranslations[lang]?.[key] || musicTranslations[lang]?.[key] ||
    imageTranslations[lang]?.[key] || storyboardTranslations[lang]?.[key] || workflowTranslations[lang]?.[key] ||
    translations[lang]?.[key] || historyTranslations.en[key] || settingsTranslations.en[key] || promptEnhancerTranslations.en[key] || musicTranslations.en[key] || imageTranslations.en[key] ||
    storyboardTranslations.en[key] || workflowTranslations.en[key] || translations.en[key] || key;
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
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel));
  });
  document.querySelectorAll("option[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-workflow-delete-name]").forEach((node) => {
    node.setAttribute("aria-label", `${t("workflowDelete")}: ${node.dataset.workflowDeleteName}`);
  });
  if (workflowDeletion && workflowDeleteLastShot !== null) {
    document.querySelector("#workflow-delete-title").textContent = t("workflowClearShots");
    document.querySelector("#workflow-delete-confirm").textContent = t("workflowClearShots");
  }
  updateWorkflowProgressToggle();
  updateLogCopyLanguage();
  document.querySelector(".language-picker select").setAttribute("aria-label", t("language"));
  document.querySelector("#theme").setAttribute("aria-label", t("theme"));
  document.querySelector("#settings-open").setAttribute("aria-label", t("settingsButton"));
  document.querySelector("#settings-close").setAttribute("aria-label", t("settingsCancel"));
  document.querySelector(".mode-switch").setAttribute("aria-label", t("generationMode"));
  document.querySelector(".history-filters").setAttribute("aria-label", t("historyCategory"));
  updateModeUI();
  updateTurboSteps();
  if (promptEnhancerStatusKey) promptEnhancerStatus.textContent = t(promptEnhancerStatusKey);
  if (mvPromptEnhancerStatusKey) mvPromptEnhancerStatus.textContent = t(mvPromptEnhancerStatusKey);
  enhancePromptButton.textContent = t(promptEnhancementBusy ? "enhancingPrompt" : "enhancePrompt");
  mvEnhancePromptButton.textContent = t(promptEnhancementBusy ? "enhancingPrompt" : "enhancePrompt");
  if (modelInfo) renderModelInfo(modelInfo);
  if (currentJob) renderJob(currentJob);
  renderHistory();
  refreshWorkflowFirstFrames();
  refreshMVMusicSources();
  renderMVDrafts();
  document.querySelector("#mv-timeline").setAttribute("aria-label", t("mvTimeline"));
  setMVAnalysisStatus(mvAnalysisStatusKey, mvAnalysisStatusDetail);
  renderMVTimeline();
  updateWorkflowShotNumbers();
  window.MiniMuvMVGeneration?.localize();
  window.MiniMuvVisualReferences?.localize();
  window.MiniMuvVideoPrompts?.localize();
  window.MiniMuvPodcast?.localize();
  window.MiniMuvAssistant?.localize();
}

function showSettingsStatus(message, isError = false) {
  settingsStatus.textContent = message;
  settingsStatus.hidden = !message;
  settingsStatus.classList.toggle("error", isError);
}

function populateSettings(settings, modelOptions = modelInfo?.model_options || {}) {
  document.querySelector("#settings-output-directory").value = settings.output_directory;
  document.querySelector("#settings-gemma-path").value = settings.gemma_path;
  const container = document.querySelector("#settings-model-options");
  const h3Service = document.querySelector("#settings-h3-service");
  const hidreamNotice = document.querySelector("#settings-hidream-notice");
  const music3Notice = document.querySelector("#settings-music3-notice");
  const encoders = document.querySelector("#settings-encoders");
  const textService = document.querySelector("#settings-text-service");
  const categoryStates = new Map(Array.from(container.querySelectorAll("[data-model-category]"),
    group => [group.dataset.modelCategory, group.open]));
  const categories = new Map();
  container.replaceChildren();
  const categoryBody = (category) => {
    if (categories.has(category)) return categories.get(category);
    const group = document.createElement("details");
    group.className = "settings-group model-settings-category";
    group.dataset.modelCategory = category;
    group.open = categoryStates.get(category) ?? true;
    const heading = document.createElement("summary");
    const label = document.createElement("span");
    label.dataset.i18n = {
      video: "settingsCategoryVideo", music: "settingsCategoryMusic", image: "settingsCategoryImage",
      encoder: "settingsCategoryEncoder", text: "settingsCategoryText", voice: "modePodcast", other: "settingsCategoryOther"
    }[category];
    label.textContent = t(label.dataset.i18n);
    const count = document.createElement("span");
    count.className = "model-category-count";
    heading.append(label, count);
    const body = document.createElement("div");
    body.className = "model-category-body";
    group.append(heading, body);
    group.addEventListener("invalid", () => { group.open = true; }, true);
    container.append(group);
    categories.set(category, body);
    return body;
  };
  for (const category of ["video", "music", "image", "voice", "encoder", "text"]) categoryBody(category);
  for (const [id, entry] of Object.entries(settings.models)) {
    const category = ["video", "music", "image", "encoder", "text", "voice"].find(
      kind => modelOptions[kind]?.some(model => model.id === id)) || "other";
    const group = document.createElement("details");
    group.className = "settings-group model-settings-card";
    group.dataset.modelId = id;
    group.open = true;
    const heading = document.createElement("summary");
    heading.textContent = id;
    const body = document.createElement("div");
    body.className = "model-settings-body";
    group.append(heading, body);
    group.addEventListener("invalid", () => { group.open = true; }, true);
    for (const [field, key] of [["enabled", "settingsModelEnabled"], ["name", "settingsModelName"],
      ["model_path", "settingsModelPath"]]) {
      const label = document.createElement("label");
      label.htmlFor = `settings-option-${id}-${field}`;
      label.dataset.i18n = key;
      label.textContent = t(key);
      const input = document.createElement("input");
      input.id = label.htmlFor;
      input.dataset.modelField = field;
      input.type = field === "enabled" ? "checkbox" : "text";
      if (field === "enabled") input.checked = entry[field];
      else { input.value = entry[field]; input.required = true; }
      body.append(label, input);
    }
    const actions = document.createElement("div");
    actions.className = "model-download-actions";
    actions.hidden = id === "h3-fasth3-vsa-q8" ||
      modelInfo?.downloads?.[id]?.download_catalog === false;
    for (const [action, key] of [["start", "downloadResume"], ["pause", "downloadPause"]]) {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.i18n = key;
      button.textContent = t(key);
      button.addEventListener("click", () => controlModelDownload(id, action, button));
      actions.append(button);
    }
    const progress = document.createElement("div");
    progress.id = `settings-download-${id}`;
    progress.className = "model-download-info";
    progress.setAttribute("role", "status");
    body.append(actions, progress);
    if (id === "h3") body.append(h3Service);
    if (id === "hidream") body.append(hidreamNotice);
    if (id === "music3") body.append(music3Notice);
    categoryBody(category).append(group);
    if (id !== "h3-fasth3-vsa-q8") renderModelDownload(modelInfo?.downloads?.[id] || {}, progress.id);
  }
  categoryBody("encoder").append(encoders);
  categoryBody("text").append(textService);
  for (const body of categories.values()) {
    body.parentElement.querySelector(".model-category-count").textContent = `(${body.children.length})`;
  }
  document.querySelector("#settings-video-url").value = settings.video.service_url;
  document.querySelector("#settings-video-model").value = settings.video.model_id;
  document.querySelector("#settings-video-params").value = JSON.stringify(settings.video.api_params, null, 2);
  document.querySelector("#settings-text-url").value = settings.text.service_url;
  document.querySelector("#settings-text-models").value = settings.text.model_ids.join("\n");
  document.querySelector("#settings-text-params").value = JSON.stringify(settings.text.api_params, null, 2);
  document.querySelector("#settings-skill-budget").value = settings.text.skill_input_token_budget;
}

async function controlModelDownload(id, action, button) {
  button.disabled = true;
  showSettingsStatus("");
  try {
    const current = await fetch("/api/settings", { cache: "no-store" });
    const saved = await current.json();
    if (!current.ok) throw new Error(saved.detail || saved.error);
    const group = document.querySelector(`[data-model-id="${id}"]`);
    const path = group.querySelector('[data-model-field="model_path"]').value.trim();
    if (path !== saved.settings.models[id].model_path ||
        document.querySelector("#settings-gemma-path").value.trim() !== saved.settings.gemma_path) {
      throw new Error(t("downloadSaveFirst"));
    }
    const response = await fetch(`/api/models/${encodeURIComponent(id)}/download/${action}`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error === "download_external_active" ?
      t("downloadExternal") : data.detail || data.error);
    showSettingsStatus(t(action === "start" ? "downloadStarted" : "downloadPauseRequested"));
    await loadModels();
  } catch (error) {
    showSettingsStatus(`${t("downloadError")} · ${error.message}`, true);
  } finally {
    button.disabled = false;
  }
}

async function openSettings() {
  settingsSaveButton.disabled = true;
  openSettingsSection("models");
  showSettingsStatus("");
  try {
    const [response, registryResponse] = await Promise.all([
      fetch("/api/settings", { cache: "no-store" }),
      fetch("/api/models", { cache: "no-store" })
    ]);
    const data = await response.json();
    const registry = await registryResponse.json();
    if (!response.ok) throw new Error(data.detail || data.error || "settings_unavailable");
    if (!registryResponse.ok) throw new Error(registry.detail || registry.error || "models_unavailable");
    populateSettings(data.settings, registry.model_options);
    settingsSaveButton.disabled = false;
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
  const models = {};
  document.querySelectorAll("#settings-model-options [data-model-id]").forEach(group => {
    models[group.dataset.modelId] = {};
    group.querySelectorAll("[data-model-field]").forEach(input => {
      models[group.dataset.modelId][input.dataset.modelField] =
        input.type === "checkbox" ? input.checked : input.value.trim();
    });
  });
  return {
    output_directory: document.querySelector("#settings-output-directory").value.trim(),
    gemma_path: document.querySelector("#settings-gemma-path").value.trim(),
    models,
    video: {
      model_path: models.h3.model_path,
      service_url: document.querySelector("#settings-video-url").value.trim(),
      model_id: document.querySelector("#settings-video-model").value.trim(),
      api_params: parseJsonObject("#settings-video-params")
    },
    image: { model_path: models.hidream.model_path },
    music: { model_path: models.music3.model_path },
    text: {
      service_url: document.querySelector("#settings-text-url").value.trim(),
      model_ids: [...new Set(document.querySelector("#settings-text-models").value
        .split(/[\r\n;；]+/).map((id) => id.trim()).filter(Boolean))],
      api_params: parseJsonObject("#settings-text-params"),
      skill_input_token_budget: Number(document.querySelector("#settings-skill-budget").value)
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
    await Promise.all([loadModels(), loadTextModels(), loadHistory(), loadWorkflows(), loadMVProjects(), loadMVMusicSources()]);
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
  const isWorkflow = activeMode === "workflow";
  const isMV = activeMode === "mv";
  const isPodcast = activeMode === "podcast";
  document.querySelector("#podcast-log-panel").hidden = !isPodcast;
  logPanel.hidden = logPanel.dataset.hasLogs !== "true" || logPanel.dataset.mode !== activeMode;
  const isVideo = !isImage && !isMusic && !isWorkflow && !isMV && !isPodcast;
  window.MiniMuvVideoPrompts?.setMode(activeMode);
  const modeKey = isMusic ? "music" : isImage ? "image" : "video";
  const modeTextKey = (key) => {
    if (isPodcast) return {eyebrow: "modePodcast", headline: "modePodcast", intro: "podcastNote"}[key] || key;
    if (isMV) return {eyebrow: "modeMV", headline: "modeMV", intro: "mvNote"}[key] || key;
    if (isWorkflow) {
      return {
        eyebrow: "workflowKicker",
        headline: "workflowTitle",
        intro: "workflowNote",
      }[key] || key;
    }
    if (isVideo) return key === "intro" ? "introCopy" : key;
    return `${modeKey}${key[0].toUpperCase()}${key.slice(1)}`;
  };
  const isVideoPreview = isVideo || isWorkflow;
  const emptyTextKey = isPodcast ? "modePodcast" : isMV ? "mvNote" : isVideoPreview ? "previewEmpty" : `${modeKey}Empty`;
  const emptyHintTextKey = isPodcast ? "podcastNote" : isMV ? "mvUnavailable" : isVideoPreview ? "previewEmptyHint" : `${modeKey}EmptyHint`;
  videoModeButton.classList.toggle("active", isVideo);
  imageModeButton.classList.toggle("active", isImage);
  musicModeButton.classList.toggle("active", isMusic);
  workflowModeButton.classList.toggle("active", isWorkflow);
  videoModeButton.setAttribute("aria-pressed", String(isVideo));
  imageModeButton.setAttribute("aria-pressed", String(isImage));
  musicModeButton.setAttribute("aria-pressed", String(isMusic));
  workflowModeButton.setAttribute("aria-pressed", String(isWorkflow));
  mvModeButton.classList.toggle("active", isMV);
  mvModeButton.setAttribute("aria-pressed", String(isMV));
  videoModelSection.hidden = !isVideo && !isWorkflow && !isMV;
  imageModelSection.hidden = !isImage;
  musicModelSection.hidden = !isMusic && !isWorkflow;
  generationModelPicker.hidden = !isVideo && !isImage && !isMusic && !isWorkflow && !isMV;
  videoControls.hidden = !isVideo;
  imageControls.hidden = !isImage;
  musicControls.hidden = !isMusic;
  form.hidden = isWorkflow || isMV || isPodcast;
  workflowPanel.hidden = !isWorkflow;
  document.querySelector("#mv-panel").hidden = !isMV;
  const podcastPanel = document.querySelector("#podcast-panel");
  const podcastButton = document.querySelector("#podcast-mode-button");
  if (podcastPanel) podcastPanel.hidden = !isPodcast;
  if (podcastButton) {
    podcastButton.classList.toggle("active", isPodcast);
    podcastButton.setAttribute("aria-pressed", String(isPodcast));
  }
  if (!isMV) document.querySelector("#mv-audio").pause();
  musicLyricsField.hidden = musicLyricsMode.value !== "lyrics";
  musicLyricsInput.required = isMusic && musicLyricsMode.value === "lyrics";
  updateGenerationModelSummary();

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
  renderMusicKeywords();
  updateLocalModelControls();
  updateGenerateAvailability();
  refreshResultPreview();
}

function imageCanvasSettings() {
  const model = imageModelChoice.value;
  const quality = document.querySelector("#image-quality").value;
  const requestedSize = Number(document.querySelector("#image-size").value);
  const size = quality === "preview" ? 512
    : quality === "standard" ? 1024
    : quality === "high" ? (model === "hidream" ? 2048 : 1024)
    : requestedSize;
  const aspect = document.querySelector("#image-aspect").value;
  const turnaround = document.querySelector("#image-turnaround")?.checked === true;
  const sceneViews = document.querySelector("#image-scene-views")?.checked === true &&
    ["hidream", "flux2-klein-4b"].includes(model);
  const preset = sceneViews ? "scene_views" : turnaround ? "character_turnaround" : "";
  const candidateCount = preset ? 3 : Number(document.querySelector("#image-candidate-count").value);
  if (model === "hidream" && quality === "high") {
    const [width, height] = {
      "1:1": [2048, 2048], "4:3": [2304, 1728], "3:4": [1728, 2304],
      "16:9": [2560, 1440], "9:16": [1440, 2560]
    }[aspect];
    return {model, quality, candidate_count: candidateCount, size, aspect, width, height,
      ...(preset ? {image_preset: preset} : {})};
  }
  const [a, b] = aspect.split(":").map(Number);
  const grid = model === "hidream" ? 32 : 16;
  return {
    model, quality, candidate_count: candidateCount, size, aspect,
    width: a >= b ? size : Math.max(grid, Math.round(size * a / b / grid) * grid),
    height: a >= b ? Math.max(grid, Math.round(size * b / a / grid) * grid) : size,
    ...(preset ? {image_preset: preset} : {})
  };
}

function updateVideoModelNotes() {
  const model = videoModelChoice.value;
  const key = model === "h3-fasth3-vsa-q8" ? "fastH3Note" :
    model === "h3" ? "h3QualityNote" : "distilledNote";
  const description = model === "ltx-2.3-dev-q4"
    ? (window.MiniMuvVideoPrompts?.note() || "") : t(key);
  const name = videoModelChoice.selectedOptions?.[0]?.textContent || model;
  for (const selector of ["#workflow-quality-note", "#video-quality-note", "#video-compute-copy"]) {
    const node = document.querySelector(selector);
    node.removeAttribute("data-i18n");
    node.textContent = description ? `${name}: ${description}` : "";
  }
}

function updateLocalModelControls() {
  window.MiniMuvImageReferences?.render();
  window.MiniMuvSkills?.renderSelectors();
  const fastH3 = videoModelChoice.value === "h3-fasth3-vsa-q8";
  const ltx = videoModelChoice.value.startsWith("ltx-");
  const dev = videoModelChoice.value === "ltx-2.3-dev-q4";
  const continuousOption = document.querySelector('#workflow-shot-mode option[value="continuous"]');
  if (continuousOption) continuousOption.disabled = fastH3;
  document.querySelector("#video-quality-field").hidden = false;
  document.querySelector("#workflow-video-quality-field").hidden = false;
  const localImage = imageModelChoice.value !== "hidream";
  stepsSelect.closest(".field").hidden = (ltx && !dev) || fastH3;
  turboToggle.closest("label").hidden = ltx || fastH3;
  document.querySelector("#local-image-size").hidden = false;
  const imageSize = document.querySelector("#image-size");
  const imageQuality = document.querySelector("#image-quality");
  const turnaround = document.querySelector("#image-turnaround").checked ||
    (document.querySelector("#image-scene-views")?.checked &&
      ["hidream", "flux2-klein-4b"].includes(imageModelChoice.value));
  const candidateSelect = document.querySelector("#image-candidate-count");
  if (turnaround) {
    if (candidateSelect.value !== "3") candidateSelect.dataset.previousValue = candidateSelect.value;
    candidateSelect.value = "3";
  } else if (candidateSelect.value === "3") {
    candidateSelect.value = candidateSelect.dataset.previousValue || "1";
  }
  candidateSelect.disabled = turnaround;
  const largeOption = [...imageSize.options].find(option => option.value === "2048");
  largeOption.hidden = localImage;
  largeOption.disabled = localImage;
  if (imageSize.dataset.model !== imageModelChoice.value) {
    imageQuality.value = localImage ? "standard" : "high";
    imageSize.dataset.model = imageModelChoice.value;
  }
  const presetSize = imageQuality.value === "preview" ? "512"
    : imageQuality.value === "standard" ? "1024"
    : imageQuality.value === "high" ? (localImage ? "1024" : "2048") : null;
  if (presetSize) imageSize.value = presetSize;
  imageSize.disabled = imageQuality.value !== "custom";
  const {width, height, candidate_count: candidateCount} = imageCanvasSettings();
  const qualityName = imageQuality.selectedOptions?.[0]?.textContent || imageQuality.value;
  const nativeNote = !localImage && imageQuality.value === "high" ? ` · ${t("imageNativeResolution")}` : "";
  document.querySelector("#image-compute-copy").textContent =
    `${t("imageQuality")}: ${qualityName} · ${t("imageResolution")}: ${width} × ${height}` +
    ` · ${t("imageCandidates")}: ${candidateCount}${nativeNote}`;
  updateVideoModelNotes();
  const yue = isYueMusicModel();
  document.querySelector("#music-duration").closest(".field").hidden = yue;
  document.querySelector("#music-steps").closest(".field").hidden = yue;
  const musicNote = document.querySelector("#music-compute-copy");
  musicNote.dataset.i18n = yue ? "musicYueNote" : "musicComputeNote";
  musicNote.textContent = t(musicNote.dataset.i18n);
  updateGenerationModelSummary();
  updateSelectedModelLinks();
  updateParameterControls();
}

function updateGenerationModelSummary() {
  const selected = [];
  if (!videoModelSection.hidden) {
    selected.push(videoModelChoice.selectedOptions?.[0]?.textContent || videoModelChoice.value);
  }
  if (!imageModelSection.hidden) {
    selected.push(imageModelChoice.selectedOptions?.[0]?.textContent || imageModelChoice.value);
  }
  if (!musicModelSection.hidden) {
    selected.push(musicModelChoice.selectedOptions?.[0]?.textContent || musicModelChoice.value);
  }
  generationModelSummary.textContent = selected.join(" · ");
}

function applyParameterRange(control, hint, limits) {
  if (!control || !limits || limits.automatic) return;
  control.min = String(limits.min);
  control.max = String(limits.max);
  control.step = "1";
  if (hint) hint.textContent = t("parameterRange")
    .replace("{min}", limits.min).replace("{max}", limits.max);
}

function updateParameterControls() {
  if (!modelInfo) return;
  const busy = storyboardBusy || firstFrameBusy || promptEnhancementBusy || workflowStructureBusy ||
    Boolean(window.MiniMuvImageReferences?.busy()) ||
    ["queued", "running"].includes(currentWorkflow?.status) ||
    ["queued", "loading", "running", "cancelling"].includes(currentJob?.status) ||
    Boolean(window.MiniMuvMVGeneration?.active()) || Boolean(window.MiniMuvVisualReferences?.busy()) ||
    Boolean(window.MiniMuvPodcast?.active());
  window.MiniMuvVideoPrompts?.sync(videoModelChoice.value, busy);
  window.MiniMuvImageReferences?.render();
  const durations = modelInfo.duration_limits;
  const sampling = modelInfo.sampling_limits;
  const videoDuration = durations?.video?.[videoModelChoice.value];
  const videoSampling = sampling?.video?.[videoModelChoice.value];
  const stepRange = videoModelChoice.value === "h3"
    ? videoSampling?.[turboToggle.checked ? "turbo" : "standard"] : videoSampling;
  const musicDuration = durations?.music?.[musicModelChoice.value];
  const musicSteps = sampling?.music?.[musicModelChoice.value];
  for (const [selector, hint, limits, disabled] of [
    ["#duration", "#video-duration-limit", videoDuration, activeMode !== "video"],
    ["#steps", "#video-steps-limit", stepRange, activeMode !== "video" || stepRange?.fixed],
    ["#music-duration", "#music-duration-limit", musicDuration, activeMode !== "music" || musicDuration?.automatic],
    ["#music-steps", "#music-steps-limit", musicSteps, activeMode !== "music" || musicSteps?.automatic],
    ["#workflow-shot-duration", "#storyboard-duration-limit", videoDuration, false]
  ]) {
    const control = document.querySelector(selector);
    applyParameterRange(control, document.querySelector(hint), limits);
    if (control) control.disabled = Boolean(disabled || busy);
  }
  if (videoDuration) {
    const total = document.querySelector("#workflow-total-duration");
    total.min = String(videoDuration.min);
    total.max = "1800";
  }
  for (const card of workflowShots.children) {
    applyParameterRange(card.querySelector("[data-shot-duration]"),
      card.querySelector("[data-shot-duration-hint]"), videoDuration);
    const turbo = card.querySelector("[data-shot-turbo]");
    const shotSteps = videoModelChoice.value === "h3"
      ? videoSampling?.[turbo?.checked !== false ? "turbo" : "standard"] : videoSampling;
    applyParameterRange(card.querySelector("[data-shot-steps]"),
      card.querySelector("[data-shot-steps-hint]"), shotSteps);
    const stepField = card.querySelector("[data-shot-steps-field]");
    if (stepField) stepField.hidden = Boolean(shotSteps?.fixed);
    if (turbo) turbo.disabled = Boolean(shotSteps?.fixed || busy);
  }
  updateStoryboardTiming();
}

function updateSelectedModelLinks() {
  for (const [mode, selector, status] of [
    ["video", videoModelChoice, videoModelChoice.value === "h3" ? modelInfo :
      modelInfo?.video_models?.[videoModelChoice.value]],
    ["image", imageModelChoice, imageModelChoice.value === "hidream" ? modelInfo?.hidream :
      modelInfo?.image_models?.[imageModelChoice.value]],
    ["music", musicModelChoice, selectedMusicStatus()]
  ]) {
    const entry = modelInfo?.model_options?.[mode]?.find(item => item.id === selector.value);
    const name = entry?.name || selector.selectedOptions?.[0]?.textContent || selector.value;
    const source = document.querySelector(`#${mode}-model-source`);
    source.hidden = !status?.model_download_url;
    source.textContent = `${name} ↗`;
    if (status?.model_download_url) source.href = status.model_download_url;
    else source.removeAttribute("href");
  }
}

function isYueMusicModel() {
  return Boolean(musicModelChoice.value) && musicModelChoice.value !== "music3";
}

function selectedMusicStatus(info = modelInfo) {
  return isYueMusicModel() ? info?.music_models?.[musicModelChoice.value] : info?.music;
}

function updateGenerateAvailability() {
  const workflowBusy = ["queued", "running"].includes(currentWorkflow?.status);
  const busy = workflowBusy || ["queued", "loading", "running", "cancelling"].includes(currentJob?.status) ||
    Boolean(window.MiniMuvMVGeneration?.active()) || Boolean(window.MiniMuvVisualReferences?.busy());
  workflowPlanStory.disabled = storyboardBusy || busy || promptEnhancementBusy ||
    !textModelsAvailable || !workflowTextModel.value ||
    Boolean(currentWorkflow && ["queued", "running"].includes(currentWorkflow.status));
  const imageStatus = imageModelChoice.value === "hidream" ? modelInfo?.hidream :
    modelInfo?.image_models?.[imageModelChoice.value];
  const videoStatus = modelInfo?.video_models?.[videoModelChoice.value];
  const ready = activeMode === "image"
    ? imageStatus?.model_ready && imageStatus?.runtime_ready
    : activeMode === "music"
      ? selectedMusicStatus()?.model_ready && selectedMusicStatus()?.runtime_ready
      : videoModelChoice.value === "h3" ? modelInfo?.model_loaded :
        videoStatus?.model_ready && videoStatus?.runtime_ready;
  videoModelChoice.disabled = busy || (activeMode === "workflow" && Boolean(currentWorkflow) && ["queued", "running"].includes(currentWorkflow.status));
  imageModelChoice.disabled = busy;
  musicModelChoice.disabled = busy;
  const selectedMode = activeMode === "image" ? "image" : activeMode === "music" ? "music" : "video";
  const selectedId = activeMode === "image" ? imageModelChoice.value :
    activeMode === "music" ? musicModelChoice.value : videoModelChoice.value;
  const disabledModel = modelInfo?.model_options?.[selectedMode] &&
    !modelInfo.model_options[selectedMode]?.some(entry => entry.id === selectedId && entry.enabled);
  const unsupportedFrame = activeMode === "video" && videoModelChoice.value === "h3-fasth3-vsa-q8" &&
    Boolean(document.querySelector("#video-frame")?.value);
  generateButton.disabled = busy || firstFrameBusy || storyboardBusy || promptEnhancementBusy ||
    !ready || disabledModel || unsupportedFrame;
  document.querySelector("#video-first-frame").querySelectorAll("select, input").forEach(control => {
    control.disabled = busy || firstFrameBusy || storyboardBusy || promptEnhancementBusy;
  });
  enhancePromptButton.disabled = busy || storyboardBusy || promptEnhancementBusy || !textModelsAvailable ||
    !promptEnhancerModel.value;
  mvEnhancePromptButton.disabled = busy || storyboardBusy || promptEnhancementBusy || !textModelsAvailable ||
    !mvPromptEnhancerModel.value;
  const skillControls = document.querySelector("#prompt-skill-controls");
  if (skillControls) skillControls.disabled = busy || storyboardBusy || promptEnhancementBusy;
  const mvSkillControls = document.querySelector("#mv-prompt-skill-controls");
  if (mvSkillControls) mvSkillControls.disabled = busy || storyboardBusy || promptEnhancementBusy;
  document.querySelectorAll("[data-music-keyword]").forEach(button => {
    button.disabled = busy || firstFrameBusy || storyboardBusy || promptEnhancementBusy;
  });
  const modeKey = activeMode === "music" ? "music" : activeMode === "image" ? "image" : "";
  generateLabel.textContent = t(busy ? (modeKey ? `${modeKey}Generating` : "generating") :
    (modeKey ? `${modeKey}Generate` : "generate"));
  window.MiniMuvMVGeneration?.updateControls(false);
  window.MiniMuvPodcast?.updateControls();
}

function updateMusicLyricsMode() {
  const showLyrics = musicLyricsMode.value === "lyrics";
  musicLyricsField.hidden = !showLyrics;
  musicLyricsInput.required = activeMode === "music" && showLyrics;
}

function updateTurboSteps() {
  updateParameterControls();
}

function addModelLink(label, url) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noreferrer";
  link.textContent = label;
  modelLinks.append(link);
}

const modelDownloadSamples = new Map();

function sampleModelDownloadSpeeds(info, now = performance.now()) {
  const options = Object.values(info.model_options || {}).flat();
  const present = new Set();
  for (const [id, download] of Object.entries(info.downloads || {})) {
    present.add(id);
    const path = options.find(option => option.id === id)?.model_path;
    const identity = JSON.stringify([path, download.total_bytes]);
    const previous = modelDownloadSamples.get(id);
    const bytes = download.downloaded_bytes;
    const active = download.download_state === "downloading" && Number.isFinite(bytes) && bytes >= 0;
    const elapsed = previous ? (now - previous.time) / 1000 : 0;
    download.download_speed_bytes_per_second = active && previous?.active &&
      previous.identity === identity && elapsed > 0 && elapsed <= 30 && bytes >= previous.bytes
      ? (bytes - previous.bytes) / elapsed : null;
    modelDownloadSamples.set(id, { identity, bytes, time: now, active });
  }
  for (const id of modelDownloadSamples.keys()) {
    if (!present.has(id)) modelDownloadSamples.delete(id);
  }
}

function formatDownloadSpeed(bytesPerSecond) {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond < 0) return "—";
  if (bytesPerSecond >= 1_000_000_000) return `${(bytesPerSecond / 1_000_000_000).toFixed(2)} GB/s`;
  if (bytesPerSecond >= 1_000_000) return `${(bytesPerSecond / 1_000_000).toFixed(2)} MB/s`;
  if (bytesPerSecond >= 1_000) return `${(bytesPerSecond / 1_000).toFixed(2)} KB/s`;
  return `${bytesPerSecond.toFixed(0)} B/s`;
}

function renderModelDownload(info, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.replaceChildren();
  container.hidden = !info.download_state || info.download_catalog === false;
  if (container.hidden) return;
  const keys = {
    downloading: "downloadActive", paused: "downloadPaused", not_started: "downloadNotStarted",
    completed: "downloadComplete", error: "downloadError"
  };
  const summary = document.createElement("p");
  summary.className = "download-summary";
  const label = t(keys[info.download_state] || "downloadError");
  const percent = info.download_percent;
  const knownPercent = Number.isFinite(percent);
  const known = knownPercent && Number.isFinite(info.downloaded_bytes) &&
    Number.isFinite(info.total_bytes) && info.total_bytes > 0;
  summary.textContent = known
    ? `${label} · ${percent.toFixed(1)}% · ${(info.downloaded_bytes / 1_000_000_000).toFixed(2)} / ${(info.total_bytes / 1_000_000_000).toFixed(2)} GB${info.download_error ? ` · ${info.download_error}` : ""}`
    : `${label}${knownPercent ? ` · ${percent.toFixed(1)}%` : ""}${info.download_error ? ` · ${info.download_error}` : ""}`;
  if (info.download_state === "downloading") {
    summary.textContent += ` · ${t("downloadSpeed")} ${formatDownloadSpeed(info.download_speed_bytes_per_second)}`;
  }
  container.append(summary);
  if (knownPercent) {
    const bar = document.createElement("progress");
    bar.max = 100;
    bar.value = Math.max(0, Math.min(100, percent));
    bar.setAttribute("aria-label", label);
    container.append(bar);
  }
  for (const part of info.download_components || []) {
    const detail = document.createElement("p");
    detail.textContent = `${part.name === "model" ? t("generationModel") : part.name} · ${
      t(keys[part.download_state] || "downloadError")} · ${
      Number.isFinite(part.download_percent) ? `${part.download_percent.toFixed(1)}%` : part.download_error || ""}`;
    container.append(detail);
  }
  if (info.download_catalog) {
    const hint = document.createElement("p");
    hint.textContent = t("downloadHint");
    container.append(hint);
  }
}
window.renderLocalModelDownload = renderModelDownload;

function populateModelSelectors(options) {
  if (!options) return;
  for (const [mode, selector] of [["video", videoModelChoice], ["image", imageModelChoice], ["music", musicModelChoice]]) {
    const entries = [...(options[mode] || [])];
    if (mode === "video") entries.sort((a, b) => Number(a.id === "h3") - Number(b.id === "h3"));
    const selected = selector.value;
    const historyOption = [...selector.options].find(option =>
      option.value === selected && option.dataset.historyOption);
    const signature = JSON.stringify(entries.map(({id, name, enabled}) => ({id, name, enabled})));
    if (selector.dataset.optionsSignature === signature) continue;
    selector.replaceChildren();
    for (const entry of entries) {
      const option = new Option(entry.name, entry.id);
      option.disabled = !entry.enabled;
      selector.add(option);
    }
    if (historyOption && !entries.some(entry => entry.id === selected)) {
      historyOption.disabled = true;
      selector.add(historyOption);
    }
    selector.value = historyOption || entries.some(entry => entry.id === selected) ? selected :
      entries.find(entry => entry.enabled)?.id || "";
    selector.dataset.optionsSignature = signature;
  }
  updateLocalModelControls();
}

function renderModelInfo(info) {
  modelInfo = info;
  const adapterStatus = document.querySelector("#settings-h3-turbo-status");
  if (adapterStatus && info.h3_turbo) {
    adapterStatus.textContent = [
      `Turbo LoRA ${info.h3_turbo.version}`,
      t(info.h3_turbo.model_ready ? "localReady" : "localMissing"),
      `${t("modelPath")}${info.h3_turbo.model_path}`, info.h3_turbo.model_error
    ].filter(Boolean).join(" · ");
  }
  for (const [id, progress] of Object.entries(info.downloads || {})) {
    renderModelDownload(progress, `settings-download-${id}`);
  }
  populateModelSelectors(info.model_options);
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
  if (videoModelChoice.value !== "h3") {
    const selected = info.video_models?.[videoModelChoice.value] || {};
    loadModelButton.hidden = true;
    modelLinks.replaceChildren();
    modelTitle.textContent = t(selected.model_ready && selected.runtime_ready ? "localReady" :
      selected.download_in_progress ? "downloadActive" : "localMissing");
    modelDescription.textContent = [selected.model_path, selected.model_error, selected.runtime_error]
      .filter(Boolean).join(" · ");
    modelNotice.classList.toggle("ready", Boolean(selected.model_ready && selected.runtime_ready));
  }
  const h3Download = {
    download_state: info.model_ready ? "completed" :
      info.download_in_progress ? "downloading" : info.downloaded_bytes ? "paused" : "not_started",
    download_percent: info.model_ready ? 100 : info.total_bytes > 0 ?
      Math.min(99.9, Math.floor(info.downloaded_bytes / info.total_bytes * 1000) / 10) : null,
    downloaded_bytes: info.model_ready ? undefined : info.downloaded_bytes,
    total_bytes: info.model_ready ? undefined : info.total_bytes
  };
  renderModelDownload(info.downloads?.[videoModelChoice.value] || (videoModelChoice.value === "h3" ? h3Download :
    info.video_models?.[videoModelChoice.value] || {}), "model-download-info");
  const imageStatus = imageModelChoice.value === "hidream" ? info.hidream :
    info.image_models?.[imageModelChoice.value];
  renderImageModelInfo(imageStatus || {});
  renderMusicModelInfo(selectedMusicStatus(info) || {});
  updateSelectedModelLinks();
  if (info.model_options?.video.find(entry => entry.id === videoModelChoice.value)?.enabled === false) {
    modelTitle.textContent = t("errModelDisabled");
    modelNotice.classList.remove("ready");
    loadModelButton.hidden = true;
  }
  updateGenerateAvailability();
}

function renderImageModelInfo(info) {
  imageModelLinks.replaceChildren();
  imageModelNotice.classList.remove("ready");
  if (!info.model_ready) {
    imageModelTitle.textContent = t("imageModelMissing");
    imageModelDescription.textContent = info.model_path || t("modelFoundNone");
  } else if (!info.runtime_ready) {
    imageModelTitle.textContent = t("imageRuntimeMissing");
    imageModelDescription.textContent = t("imageSetupHint");
    addImageModelLink(t("imageCodeLink"), info.code_download_url);
  } else {
    imageModelTitle.textContent = t("imageReady");
    imageModelDescription.textContent = info.model_path;
    imageModelNotice.classList.add("ready");
  }
  if (imageModelChoice.value !== "hidream") {
    imageModelTitle.textContent = t(info.model_ready && info.runtime_ready ? "localReady" :
      info.download_in_progress ? "downloadActive" : "localMissing");
    imageModelDescription.textContent = info.model_path || "";
  }
  renderModelDownload(modelInfo?.downloads?.[imageModelChoice.value] ||
    (imageModelChoice.value === "hidream" && info.model_ready ?
    { download_state: "completed", download_percent: 100 } : info), "image-model-download-info");
  if (modelInfo?.model_options?.image.find(entry => entry.id === imageModelChoice.value)?.enabled === false) {
    imageModelTitle.textContent = t("errModelDisabled");
    imageModelNotice.classList.remove("ready");
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
  musicModelNotice.classList.remove("ready");
  if (!info.model_ready) {
    musicModelTitle.textContent = t("musicModelMissing");
    musicModelDescription.textContent = info.model_path || t("modelFoundNone");
  } else if (!info.runtime_ready) {
    musicModelTitle.textContent = t("musicRuntimeMissing");
    musicModelDescription.textContent = info.model_path;
  } else {
    musicModelTitle.textContent = t("musicReady");
    musicModelDescription.textContent = info.model_path;
    musicModelNotice.classList.add("ready");
  }
  if (isYueMusicModel()) {
    musicModelTitle.textContent = t(info.model_ready && info.runtime_ready ? "localReady" :
      info.download_state === "downloading" ? "downloadActive" : "localMissing");
    musicModelDescription.textContent = info.runtime_ready === false && info.runtime_error ?
      info.runtime_error : t("musicYueNote");
    musicModelNotice.classList.toggle("ready", Boolean(info.model_ready && info.runtime_ready));
  }
  renderModelDownload(modelInfo?.downloads?.[musicModelChoice.value] ||
    (!isYueMusicModel() && info.model_ready ?
    { download_state: "completed", download_percent: 100 } : info), "music-model-download-info");
  if (modelInfo?.model_options?.music?.find(entry => entry.id === musicModelChoice.value)?.enabled === false) {
    musicModelTitle.textContent = t("errModelDisabled");
    musicModelNotice.classList.remove("ready");
  }
}

const visualTokenTranslations = {
  en: "Visual sequence tokens (geometry)", "zh-CN": "视觉序列 Token（几何统计）",
  "zh-TW": "視覺序列 Token（幾何統計）", fr: "Jetons visuels (géométrie)",
  de: "Visuelle Tokens (Geometrie)", ja: "視覚系列トークン（形状計算）",
  ko: "시각 시퀀스 토큰 (형상)", es: "Tokens visuales (geometría)",
  pt: "Tokens visuais (geometria)", tr: "Görsel tokenlar (geometri)",
  ar: "رموز التسلسل المرئي (الهندسة)", vi: "Token thị giác (hình học)",
  id: "Token visual (geometri)", ru: "Визуальные токены (геометрия)"
};

function formatGenerationMetrics(item) {
  const seconds = Number(item?.elapsed_seconds);
  const tokens = Number(item?.tokens);
  const number = new Intl.NumberFormat(languageSelect.value);
  const elapsed = Number.isFinite(seconds) && item?.elapsed_seconds !== null
    ? `${number.format(Math.round(seconds * 10) / 10)}s` : "—";
  const tokenText = Number.isInteger(tokens) && tokens >= 0 && typeof item?.tokens === "number"
    ? number.format(tokens) : "—";
  const visual = item?.visual_tokens;
  const visualText = Number.isInteger(visual) && visual >= 0
    ? ` · ${visualTokenTranslations[languageSelect.value] || visualTokenTranslations.en} ${number.format(visual)}`
    : "";
  return `${t("metricElapsed")} ${elapsed} · ${t("metricTokens")} ${tokenText}${visualText}`;
}

function renderImageCandidates(result) {
  const urls = Array.isArray(result?.image_urls) && result.image_urls.length
    ? result.image_urls : result?.image_url ? [result.image_url] : [];
  imageCandidates.hidden = urls.length <= 1;
  if (urls.length <= 1) {
    imageCandidates.replaceChildren();
    delete imageCandidates.dataset.resultId;
    return;
  }
  const resultId = `${languageSelect.value}:${result.id || ""}:${urls.join("|")}`;
  if (imageCandidates.dataset.resultId === resultId) return;
  imageCandidates.dataset.resultId = resultId;
  const viewKeys = result?.image_views?.length === 3 && result.image_views[0] === "front"
    ? ["turnaroundFront", "turnaroundSide", "turnaroundBack"] : [];
  imageCandidates.replaceChildren(...urls.map((url, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "image-candidate";
    const viewLabel = viewKeys[index] ? t(viewKeys[index])
      : window.MiniMuvImageReferences?.viewLabel(result?.image_views?.[index]);
    button.setAttribute("aria-label", viewLabel || `${t("imageCandidate")} ${index + 1}`);
    button.setAttribute("aria-pressed", String(index === 0));
    const thumbnail = document.createElement("img");
    thumbnail.src = url;
    thumbnail.alt = "";
    button.append(thumbnail);
    if (viewLabel) {
      const label = document.createElement("span");
      label.textContent = viewLabel;
      button.append(label);
    }
    button.addEventListener("click", () => {
      image.src = url;
      image.dataset.url = url;
      imageDownloadLink.href = url;
      imageCandidates.querySelectorAll(".image-candidate").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate === button));
      });
    });
    return button;
  }));
}

function refreshResultPreview() {
  const result = activeMode === "mv" ? window.MiniMuvMVGeneration?.preview()
    : activeMode === "podcast" ? window.MiniMuvPodcast?.preview()
    : activeMode === "workflow" ? currentWorkflow && {
      ...currentWorkflow, video_url: currentWorkflow.output_url}
    : currentJob?.kind === activeMode ? currentJob : null;
  const inProgress = ["queued", "loading", "running", "cancelling", "generating", "assembling"].includes(result?.status);
  const completed = result?.status === "completed";
  const urls = [completed && result.video_url, completed && result.image_url,
    completed && ["music", "podcast"].includes(activeMode) && result.audio_url];
  for (const [index, media] of [video, image, audio].entries()) {
    const url = urls[index] || "";
    media.hidden = !url;
    if (media.dataset.url !== url) {
      if (typeof media.pause === "function") media.pause();
      if (url) media.src = url;
      else media.removeAttribute("src");
      media.dataset.url = url;
      if (!url && typeof media.load === "function") media.load();
    }
  }
  const hasResult = urls.some(Boolean);
  renderImageCandidates(completed && activeMode === "image" ? result : null);
  emptyState.hidden = inProgress || hasResult;
  loadingState.hidden = !inProgress;
  resultFooter.hidden = !hasResult;
  const label = inProgress ? result.status === "queued" ? "queued" : "running"
    : completed ? "completed" : result?.status === "failed" ? "failed"
    : result?.status === "cancelled" ? "cancelled" : "waiting";
  statusChip.textContent = t(label);
  statusChip.className = `status-chip${inProgress ? " active" : completed ? " success" : label === "failed" ? " error" : ""}`;
  if (inProgress) loadingTitle.textContent = t(label);
  cancelButton.hidden = !["video", "image", "music"].includes(activeMode) ||
    !["queued", "running"].includes(result?.status) || !result?.prompt;
  for (const [index, link] of [
    document.querySelector("#download-video"), imageDownloadLink,
    document.querySelector("#download-audio")
  ].entries()) {
    link.hidden = !urls[index];
    if (urls[index]) link.href = urls[index];
    else link.removeAttribute("href");
  }
  document.querySelector("#download-video").textContent = t("downloadVideo");
  document.querySelector("#download-audio").textContent = t(activeMode === "music" ? "musicDownload" : "downloadAudio");
  document.querySelector("#download-video").download = activeMode === "mv" ? "minimuv-mv.mp4"
    : activeMode === "workflow" ? "minimuv-long-video.mp4" : "minimax-h3.mp4";
  document.querySelector("#download-audio").download = activeMode === "podcast" ? "minimuv-podcast.wav"
    : activeMode === "music" ? "minimax-music3.wav" : "minimax-h3.wav";
  imageDownloadLink.download = "hidream-o1.png";
  if (completed && result.audio_url) {
    const link = document.querySelector("#download-audio");
    link.href = result.audio_url;
    link.hidden = false;
  }
}

function renderJob(job) {
  currentJob = job;
  if (activeMode === "workflow" && currentWorkflow) {
    renderWorkflow(currentWorkflow);
    return;
  }
  const states = {
    queued: ["queued", "active"], loading: ["preparing", "active"], running: ["running", "active"],
    cancelling: ["cancelling", "active"], cancelled: ["cancelled", ""],
    completed: ["completed", "success"], failed: ["failed", "error"]
  };
  const [label, tone] = states[job.status] || ["waiting", ""];
  statusChip.textContent = t(label);
  statusChip.className = `status-chip ${tone}`;
  const inProgress = ["queued", "loading", "running", "cancelling"].includes(job.status);
  const hasMetrics = Number.isFinite(Number(job.elapsed_seconds)) && job.elapsed_seconds !== null;
  logPanel.dataset.hasLogs = String(Boolean(job.logs?.length || job.error || hasMetrics));
  logPanel.dataset.mode = job.kind;
  logPanel.hidden = logPanel.dataset.hasLogs !== "true" || logPanel.dataset.mode !== activeMode;
  jobMetrics.hidden = !hasMetrics;
  jobMetrics.textContent = hasMetrics ? formatGenerationMetrics(job) : "";
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
  if (!inProgress && !job.prompt) loadModels();
  refreshResultPreview();
}

function restoreHistoryControl(selector, value) {
  if (value === undefined) return;
  const control = document.querySelector(selector);
  if (control.tagName === "SELECT") {
    control.querySelectorAll("[data-history-option]").forEach(option => option.remove());
    const stringValue = String(value);
    if (![...control.options].some(option => option.value === stringValue)) {
      const option = new Option(selector.includes("duration") ? `${stringValue} s` : stringValue, stringValue);
      option.dataset.historyOption = "true";
      if (selector === "#steps") {
        option.dataset[turboToggle.checked ? "turboStep" : "standardStep"] = "";
      }
      control.add(option);
    }
  }
  control.value = String(value);
}

function restoreHistoryItem(item) {
  if (historyDeleteBusy || firstFrameBusy || storyboardBusy || promptEnhancementBusy ||
    window.MiniMuvImageReferences?.busy() ||
    window.MiniMuvPodcast?.active() || window.MiniMuvMVGeneration?.active() ||
    ["queued", "loading", "running", "cancelling"].includes(currentJob?.status) ||
    ["queued", "running"].includes(currentWorkflow?.status)) {
    window.alert(t("errRunning"));
    return;
  }
  if (!["video", "image", "music"].includes(item.kind)) {
    window.alert(t("errInvalid"));
    return;
  }
  if (pollTimer) window.clearTimeout(pollTimer);
  pollTimer = null;
  activeMode = item.kind;
  localStorage.setItem("h3-mode", activeMode);
  if (typeof item.prompt === "string" && item.prompt) promptInput.value = item.prompt;
  projectNameInput.value = typeof item.name === "string" ? item.name : "";
  document.querySelector("#prompt-count").textContent = `${promptInput.value.length} / 4000`;
  promptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("");
  const settings = item.generation;
  if (item.kind === "video") videoModelChoice.value = settings?.model || "h3";
  if (item.kind === "image") imageModelChoice.value = settings?.model || "hidream";
  if (item.kind === "music") musicModelChoice.value = settings?.model || "music3";
  if (settings && typeof settings === "object") {
    if (item.kind === "video") {
      videoModelChoice.value = settings.model || "h3";
      window.MiniMuvVideoPrompts?.load("video", settings.negative_prompt || "");
      restoreHistoryControl("#video-quality", settings.quality || (videoModelChoice.value === "h3" ? "standard" : "preview"));
      if (typeof settings.turbo === "boolean") {
        turboToggle.checked = settings.turbo;
        updateTurboSteps();
      }
      for (const key of ["duration", "aspect", "steps", "seed"]) {
        restoreHistoryControl(`#${key}`, settings[key]);
      }
      if (typeof settings.first_frame_id === "string") {
        const card = document.querySelector("#video-first-frame");
        card.dataset.firstFrameId = settings.first_frame_id;
        card.dataset.savedFirstFrameId = settings.first_frame_id;
        card.dataset.firstFrameUrl = item.first_frame_url || "";
        refreshWorkflowFirstFrames();
      }
    } else if (item.kind === "image") {
      imageModelChoice.value = settings.model || "hidream";
      updateLocalModelControls();
      restoreHistoryControl("#image-quality", settings.quality || "custom");
      restoreHistoryControl("#image-candidate-count", settings.candidate_count || 1);
      const turnaround = document.querySelector("#image-turnaround");
      if (turnaround) turnaround.checked = settings.image_preset === "character_turnaround";
      const sceneViews = document.querySelector("#image-scene-views");
      if (sceneViews) sceneViews.checked = settings.image_preset === "scene_views";
      window.MiniMuvImageReferences?.load(settings.reference_image_ids || []);
      restoreHistoryControl("#image-size", settings.size || settings.width || (settings.model ? 1024 : 2048));
      restoreHistoryControl("#image-aspect", settings.aspect || "1:1");
      restoreHistoryControl("#image-seed", settings.seed);
    } else {
      for (const key of ["duration", "steps", "seed"]) {
        restoreHistoryControl(`#music-${key}`, settings[key]);
      }
      restoreHistoryControl("#music-lyrics-mode", settings.lyrics_mode);
      restoreHistoryControl("#music-lyrics", settings.lyrics);
      updateMusicLyricsMode();
    }
  }
  updateLocalModelControls();
  if (modelInfo) renderModelInfo(modelInfo);
  renderJob({ ...item, status: "completed", logs: [], error: "" });
  syncMusicKeywords();
  renderHistory();
  const status = document.querySelector("#history-restore-status");
  status.dataset.i18n = settings ? "historyRestored" : "historyLegacy";
  status.textContent = t(status.dataset.i18n);
  status.hidden = false;
}

function renderHistory() {
  const items = [...historyItems, ...workflowItems.map(item => ({...item, kind: "workflow"})),
    ...mvProjects.map(item => ({...item, kind: "mv"})),
    ...(window.MiniMuvPodcast?.history() || []).map(item => ({...item, kind: "podcast"}))]
    .filter((item) => historyFilter === "all" || item.kind === historyFilter)
    .sort((a, b) => b.created_at - a.created_at);
  document.querySelector("#workflow-history-actions").hidden = historyFilter !== "workflow";
  historyCount.textContent = `${items.length} ${t("historyCount")}`;
  historyList.replaceChildren();
  historyStatus.hidden = items.length > 0;
  historyStatus.textContent = items.length ? "" : t("historyEmpty");
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "history-row";
    const button = document.createElement("button");
    button.type = "button";
    const selected = item.kind === "workflow" ? currentWorkflow?.id === item.id
      : item.kind === "mv" ? currentMV?.id === item.id
      : item.kind === "podcast" ? window.MiniMuvPodcast?.preview()?.id === item.id : currentJob?.id === item.id;
    button.disabled = item.kind === "mv" && mvBusy;
    button.className = `history-item${selected ? " selected" : ""}`;
    button.setAttribute("aria-pressed", String(selected));

    const thumbnail = document.createElement("span");
    thumbnail.className = "history-thumb";
    if (item.image_url) {
      const imageThumb = document.createElement("img");
      imageThumb.src = item.image_url;
      imageThumb.alt = "";
      thumbnail.append(imageThumb);
    } else {
      thumbnail.textContent = item.kind === "mv" ? "MV"
        : ["video", "workflow"].includes(item.kind) ? "▶" : "♫";
      thumbnail.setAttribute("aria-hidden", "true");
    }

    const details = document.createElement("span");
    details.className = "history-details";
    const type = document.createElement("span");
    type.className = "history-type";
    const typeLabel = document.createElement("span");
    typeLabel.textContent = t(item.kind === "workflow" ? "modeWorkflow" :
      item.kind === "mv" ? "modeMV" : item.kind === "podcast" ? "modePodcast" : `history${item.kind[0].toUpperCase()}${item.kind.slice(1)}`);
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
    const metrics = document.createElement("span");
    metrics.className = "history-metrics";
    metrics.textContent = item.kind === "podcast" ? `${item.segments?.length || 0}`
      : ["workflow", "mv"].includes(item.kind)
      ? t(`workflowStatus${item.status[0].toUpperCase()}${item.status.slice(1)}`)
      : formatGenerationMetrics(item);
    type.append(typeLabel, metrics, date);
    const prompt = document.createElement("span");
    prompt.className = "history-prompt";
    prompt.textContent = item.kind === "workflow" ? `${item.shots?.length || 0} ${t("workflowShot")} · ${item.total_duration}s`
      : item.prompt || t("historyNoPrompt");
    if (item.name) {
      const name = document.createElement("span");
      name.className = "history-name";
      name.textContent = item.name;
      name.title = item.name;
      details.append(type, name, prompt);
    } else {
      details.append(type, prompt);
    }
    button.append(thumbnail, details);
    button.addEventListener("click", () => {
      if (window.MiniMuvPodcast?.active() || window.MiniMuvMVGeneration?.active()) {
        window.alert(t("errRunning"));
        return;
      }
      if (activeMode === "podcast" && item.kind !== "podcast" &&
        !window.MiniMuvPodcast.canLeave()) return;
      if (item.kind === "workflow") {
        workflowModeButton.click();
        fetchWorkflow(item.id);
      } else if (item.kind === "mv") {
        if (openMVProject(item)) mvModeButton.click();
      } else if (item.kind === "podcast") {
        window.MiniMuvPodcast.open(item.id);
      } else restoreHistoryItem(item);
    });
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "history-delete";
    deleteButton.textContent = "❌";
    deleteButton.title = t(item.kind === "workflow" ? "workflowDelete" : "historyDelete");
    deleteButton.setAttribute("aria-label", `${deleteButton.title} · ${item.name || item.prompt || t("historyNoPrompt")}`);
    deleteButton.disabled = historyDeleteBusy || (item.kind === "mv" && mvBusy) || (item.kind === "workflow" &&
      ["queued", "running"].includes(item.status));
    deleteButton.addEventListener("click", () => item.kind === "workflow"
      ? requestWorkflowDeletion([item]) : deleteHistoryItem(item));
    row.append(button);
    if (item.kind !== "podcast") row.append(deleteButton);
    historyList.append(row);
  }
}

async function deleteHistoryItem(item) {
  if (historyDeleteBusy || (item.kind === "mv" && mvBusy)) return;
  if (firstFrameBusy || ["queued", "loading", "running", "cancelling"].includes(currentJob?.status) ||
      ["queued", "running"].includes(currentWorkflow?.status)) {
    window.alert(t("errRunning"));
    return;
  }
  if (!window.confirm(t(item.kind === "mv" ? "mvDeleteConfirm" : "historyDeleteConfirm"))) return;
  historyDeleteBusy = true;
  renderHistory();
  historyStatus.hidden = false;
  historyStatus.textContent = t("historyDeleting");
  try {
    const response = await fetch(item.kind === "mv" ? `/api/mv-projects/${item.id}` : `/api/history/${item.id}`,
      item.kind === "mv" ? {
        method: "DELETE", headers: {"Content-Type": "application/json"},
        body: JSON.stringify({revision: item.revision})
      } : {method: "DELETE"});
    const data = await response.json();
    if (!response.ok) throw new Error(
      data.error === "history_in_use" ? t("historyInUse") : data.detail || data.error || t("historyDeleteError"));
    if (item.kind === "mv") {
      mvProjects = mvProjects.filter(project => project.id !== item.id);
      if (currentMV?.id === item.id) {
        mvDirty = false;
        openMVProject();
      }
      if (!(await loadMVProjects())) throw new Error(t("mvError"));
    } else if (currentJob?.id === item.id) {
      for (const id of ["#video-result", "#image-result", "#audio-result"]) {
        const media = document.querySelector(id);
        if (!media) continue;
        if (typeof media.pause === "function") media.pause();
        media.removeAttribute("src");
        delete media.dataset.url;
        if (typeof media.load === "function") media.load();
      }
      renderJob({kind: item.kind, status: "idle", logs: [], error: ""});
      currentJob = null;
    }
    if (item.kind !== "mv") {
      const frame = document.querySelector("#video-first-frame");
      if (frame.dataset.firstFrameId === item.id) {
        frame.dataset.firstFrameId = "";
        frame.dataset.savedFirstFrameId = "";
        frame.dataset.firstFrameUrl = "";
      }
      document.querySelector("#history-restore-status").hidden = true;
    }
    await loadHistory();
    historyStatus.hidden = false;
    historyStatus.textContent = t("historyDeleted");
  } catch (error) {
    await loadHistory();
    historyStatus.hidden = false;
    historyStatus.textContent = `${t("historyDeleteError")} ${error.message}`;
  } finally {
    historyDeleteBusy = false;
    const message = historyStatus.textContent;
    const messageHidden = historyStatus.hidden;
    renderHistory();
    historyStatus.textContent = message;
    historyStatus.hidden = messageHidden;
  }
}

async function loadHistory() {
  try {
    const response = await fetch("/api/history", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || "history_unavailable");
    historyItems = data.items;
    window.MiniMuvImageReferences?.history(historyItems);
    refreshWorkflowFirstFrames();
    refreshMVMusicSources();
    historyStatus.hidden = true;
    renderHistory();
  } catch {
    historyItems = [];
    renderHistory();
    historyStatus.textContent = t("historyLoadError");
    historyStatus.hidden = false;
  }
}

function errorMessage(code) {
  const nativeError = window.MiniMuvVideoPrompts?.error(code);
  if (nativeError) return nativeError;
  const keys = {
    fasth3_conditioning_unsupported: "fastH3Limit",
    invalid_fasth3_steps: "errInvalid",
    local_model_not_ready: "localModelError", invalid_generation_model: "errInvalid",
    generation_model_disabled: "errModelDisabled",
    invalid_prompt: "errInvalidPrompt", h3_model_missing: "modelMissing",
    hidream_model_missing: "imageModelMissing", hidream_runtime_missing: "imageRuntimeMissing",
    music_model_missing: "musicModelMissing", music_runtime_missing: "musicRuntimeMissing",
    invalid_lyrics: "musicLyricsRequired", invalid_music_mode: "errInvalid",
    mlx_serve_missing: "runtimeMissing",
    job_already_running: "errRunning",
    invalid_duration: "errInvalid", invalid_steps: "errInvalid",
    invalid_seed: "errInvalid", invalid_aspect: "errInvalid", invalid_video_quality: "errInvalid"
  };
  return t(keys[code] || "errGeneric");
}

function setPromptEnhancerStatus(key, mode = "video") {
  const status = mode === "mv" ? mvPromptEnhancerStatus : promptEnhancerStatus;
  if (mode === "mv") mvPromptEnhancerStatusKey = key;
  else promptEnhancerStatusKey = key;
  status.textContent = key ? t(key) : "";
  status.hidden = !key;
}

function syncMVPromptEnhancerModel() {
  const selected = mvPromptEnhancerModel.value;
  mvPromptEnhancerModel.replaceChildren(...[...promptEnhancerModel.options].map(option => option.cloneNode(true)));
  if (selected && [...mvPromptEnhancerModel.options].some(option => option.value === selected)) {
    mvPromptEnhancerModel.value = selected;
  } else {
    mvPromptEnhancerModel.value = promptEnhancerModel.value;
  }
  mvPromptEnhancerModel.disabled = promptEnhancerModel.disabled;
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
    const skillsModelSelect = document.querySelector("#skills-model");
    if (skillsModelSelect && skillsModelSelect.options.length === 0) {
      for (const model of models) {
        if (typeof model.id !== "string" || !model.id) continue;
        skillsModelSelect.append(new Option(model.name || model.id, model.id));
      }
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
      setPromptEnhancerStatus("", "mv");
    } else {
      promptEnhancerModel.disabled = true;
      const option = document.createElement("option");
      option.textContent = t("enhancerNoModels");
      promptEnhancerModel.replaceChildren(option);
      setPromptEnhancerStatus("enhancerNoModels");
      setPromptEnhancerStatus("enhancerNoModels", "mv");
    }
    syncMVPromptEnhancerModel();
    syncWorkflowTextModels();
    updateGenerateAvailability();
  } catch {
    textModelsAvailable = false;
    promptEnhancerModel.replaceChildren();
    const option = document.createElement("option");
    option.textContent = t("enhancerOffline");
    promptEnhancerModel.append(option);
    promptEnhancerModel.disabled = true;
    setPromptEnhancerStatus("enhancerOffline");
    syncMVPromptEnhancerModel();
    setPromptEnhancerStatus("enhancerOffline", "mv");
    syncWorkflowTextModels();
    updateGenerateAvailability();
    window.setTimeout(loadTextModels, 10000);
  }
}

function syncWorkflowTextModels() {
  const selected = workflowTextModel.value;
  workflowTextModel.replaceChildren(
    ...[...promptEnhancerModel.options].map((option) => option.cloneNode(true))
  );
  workflowTextModel.disabled = !textModelsAvailable || storyboardBusy ||
    Boolean(currentWorkflow && ["queued", "running"].includes(currentWorkflow.status));
  if ([...workflowTextModel.options].some((option) => option.value === selected)) {
    workflowTextModel.value = selected;
  } else {
    workflowTextModel.value = promptEnhancerModel.value;
  }
}

function updateStoryboardTiming() {
  const total = Number(document.querySelector("#workflow-total-duration").value);
  const durationInput = document.querySelector("#workflow-shot-duration");
  const duration = Number(durationInput.value);
  const minimum = Number(durationInput.min);
  const maximum = Number(durationInput.max);
  const valid = Number.isInteger(total) && total >= minimum && total <= 1800 &&
    Number.isInteger(duration) && duration >= minimum && duration <= maximum && total % duration === 0 &&
    total / duration <= 1800;
  document.querySelector("#workflow-shot-count").value = valid ? String(total / duration) : "";
  document.querySelector("#workflow-total-duration").setCustomValidity(valid ? "" : t("storyboardTimingInvalid"));
  return valid ? {total, duration, count: total / duration} : null;
}

async function planWorkflowStory() {
  if (workflowPlanStory.disabled || window.MiniMuvVisualReferences?.busy()) return;
  const story = document.querySelector("#workflow-story").value.trim();
  const timing = updateStoryboardTiming();
  if (!timing) {
    workflowStoryStatus.textContent = t("storyboardTimingInvalid");
    workflowStoryStatus.hidden = false;
    workflowStoryStatus.classList.add("error");
    return;
  }
  const {count, total, duration} = timing;
  if (!story || story.length > 30000 || !Number.isInteger(count) ||
    count < 1 || count > 1800) {
    workflowStoryStatus.textContent = t("storyboardInvalid");
    workflowStoryStatus.hidden = false;
    workflowStoryStatus.classList.add("error");
    return;
  }
  storyboardBusy = true;
  const controls = [...workflowPanel.querySelectorAll("input, textarea, select, button")];
  const previousDisabled = controls.map((control) => control.disabled);
  controls.forEach((control) => { control.disabled = true; });
  workflowPlanStory.textContent = t("storyboardGenerating");
  workflowStoryStatus.textContent = t("storyboardGenerating");
  workflowStoryStatus.hidden = false;
  workflowStoryStatus.classList.remove("error");
  const progress = document.querySelector("#workflow-story-progress");
  progress.hidden = false;
  const started = Date.now();
  const progressTimer = window.setInterval(() => {
    workflowStoryStatus.textContent = `${t("storyboardGenerating")} · ${
      t("workflowElapsed")}: ${Math.floor((Date.now() - started) / 1000)}s`;
  }, 1000);
  updateGenerateAvailability();
  try {
    const response = await fetch("/api/storyboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story, shot_count: count, total_duration: total,
        shot_duration: duration, model: workflowTextModel.value,
        ...(window.MiniMuvVisualReferences ? {
          visual_references: window.MiniMuvVisualReferences.payload("workflow")
        } : {}),
        ...(window.MiniMuvVideoPrompts?.payload("workflow") || {}),
        ...(window.MiniMuvSkills?.selection("storyboard") || {}),
        target_model: videoModelChoice.value })
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.detail || data.error || t("enhanceFailed"));
      error.modelLimited = response.status === 502 || data.error === "text_model_unavailable";
      throw error;
    }
    if (!Array.isArray(data.shots) || data.shots.length !== count ||
      data.shots.some((shot) => !shot ||
        [["title", 120], ["prompt", 4000], ["music_prompt", 4000]].some(([key, limit]) =>
          typeof shot[key] !== "string" || !shot[key].trim() || shot[key].length > limit
        ) || shot.duration !== duration)) {
      const error = new Error(t("enhanceFailed"));
      error.modelLimited = true;
      throw error;
    }
    const first = workflowShots.children[0];
    [...workflowShots.children].slice(1).forEach(card => card.remove());
    if (first) {
      const shot = data.shots[0];
      first.querySelector("[data-shot-title]").value = shot.title;
      first.querySelector("[data-shot-prompt]").value = shot.prompt;
      first.querySelector("[data-shot-music-prompt]").value = shot.music_prompt;
      first.querySelector("[data-shot-duration]").value = String(shot.duration);
      first.dataset.skillUsage = JSON.stringify(data.skill_usage || []);
      first.dataset.skillPrompt = shot.prompt;
      first.dataset.skillMusicPrompt = shot.music_prompt;
      window.MiniMuvVisualReferences?.attachShot(first, "workflow", shot.visual);
      window.MiniMuvVideoPrompts?.attachShot(first, shot, videoModelChoice.value);
    }
    data.shots.slice(first ? 1 : 0).forEach((shot) =>
      addWorkflowShot(data.skill_usage ? {...shot, skill_usage: data.skill_usage} : shot));
    workflowStoryStatus.textContent = t("storyboardAdded");
  } catch (error) {
    workflowStoryStatus.textContent = `${t("enhanceFailed")} ${error.message}${
      error.modelLimited ? `\n${t("storyboardModelLimited")}` : ""}`;
    workflowStoryStatus.classList.add("error");
  } finally {
    window.clearInterval(progressTimer);
    progress.hidden = true;
    storyboardBusy = false;
    controls.forEach((control, index) => { control.disabled = previousDisabled[index]; });
    updateWorkflowShotNumbers();
    workflowPlanStory.textContent = t("storyboardGenerate");
    updateGenerateAvailability();
    updateWorkflowMusicPromptVisibility();
  }
}

function promptEnhancementPayload(prompt, mode, model, skillScope) {
  return {
    prompt,
    mode,
    model,
    ...(window.MiniMuvSkills?.selection(skillScope) || {})
  };
}

async function enhancePromptForTarget({target, model, mode, scope, result, keywords, output, button, statusMode}) {
  if (!textModelsAvailable || promptEnhancementBusy) return;
  if (!target.value.trim()) {
    setPromptEnhancerStatus("errInvalidPrompt", statusMode);
    return;
  }
  promptEnhancementBusy = true;
  result.hidden = true;
  setPromptEnhancerStatus("enhancingPrompt", statusMode);
  button.textContent = t("enhancingPrompt");
  updateGenerateAvailability();
  try {
    const response = await fetch("/api/prompt-enhancements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptEnhancementPayload(target.value, mode, model.value, scope))
    });
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.error || "local_text_generation_failed");
      error.code = data.error;
      throw error;
    }
    keywords.replaceChildren();
    for (const keyword of data.keywords) {
      const item = document.createElement("li");
      item.textContent = keyword;
      keywords.append(item);
    }
    output.value = data.optimized_prompt;
    output.dataset.skillUsage = JSON.stringify(data.skill_usage || []);
    result.hidden = false;
    setPromptEnhancerStatus("", statusMode);
  } catch (error) {
    setPromptEnhancerStatus(error.code === "local_text_runtime_unavailable"
      ? "enhancerOffline"
      : error.code === "invalid_prompt" ? "errInvalidPrompt" : "enhanceFailed", statusMode);
    const status = statusMode === "mv" ? mvPromptEnhancerStatus : promptEnhancerStatus;
    status.textContent += ` ${error.message}`;
  } finally {
    promptEnhancementBusy = false;
    button.textContent = t("enhancePrompt");
    updateGenerateAvailability();
  }
}

async function enhancePrompt() {
  return enhancePromptForTarget({
    target: promptInput, model: promptEnhancerModel, mode: activeMode, scope: "prompt",
    result: promptEnhancerResult, keywords: promptEnhancerKeywords, output: promptEnhancerOutput,
    button: enhancePromptButton, statusMode: "video"
  });
}

async function enhanceMVPrompt() {
  return enhancePromptForTarget({
    target: mvPromptInput, model: mvPromptEnhancerModel, mode: "mv", scope: "mv-prompt",
    result: mvPromptEnhancerResult, keywords: mvPromptEnhancerKeywords, output: mvPromptEnhancerOutput,
    button: mvEnhancePromptButton, statusMode: "mv"
  });
}

function applyPromptEnhancement(target, keywordList, output, statusMode, onApplied = () => {}) {
  const keywords = [...keywordList.querySelectorAll("li")]
    .map(item => item.textContent.trim())
    .filter(Boolean);
  const keywordPrompt = keywords.length
    ? `${t("enhancerKeywordPrefix")} ${keywords.join(", ")}`
    : "";
  const combinedPrompt = [output.value.trim(), keywordPrompt].filter(Boolean).join("\n\n");
  if (combinedPrompt.length > target.maxLength) {
    setPromptEnhancerStatus("enhancerPromptTooLong", statusMode);
    return;
  }
  target.value = combinedPrompt;
  target.dataset.skillUsage = output.dataset.skillUsage || "[]";
  target.dataset.skillPrompt = combinedPrompt;
  onApplied();
  setPromptEnhancerStatus("enhancerApplied", statusMode);
  target.focus();
}

function updateWorkflowShotNumbers() {
  const editable = !workflowStructureBusy && !storyboardBusy && !firstFrameBusy &&
    (!currentWorkflow || !["queued", "running"].includes(currentWorkflow.status));
  [...workflowShots.children].forEach((shot, index) => {
    const number = index + 1;
    shot.querySelector("[data-shot-number]").textContent = `${t("workflowShot")} ${number}`;
    const toggleButton = shot.querySelector(".workflow-toggle-shot");
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.textContent = expanded ? "−" : "+";
    toggleButton.setAttribute("aria-label", `${t(expanded ? "workflowCollapseShot" : "workflowExpandShot")} ${number}`);
    const removeButton = shot.querySelector(".workflow-remove-shot");
    removeButton.disabled = !editable;
    removeButton.setAttribute("aria-label", `${t("workflowRemoveShot")} ${number}`);
    for (const [direction, key, boundary] of [
      ["up", "workflowMoveUp", index === 0],
      ["down", "workflowMoveDown", index === workflowShots.children.length - 1]
    ]) {
      const button = shot.querySelector(`[data-shot-move="${direction}"]`);
      button.disabled = !editable || boundary;
      button.setAttribute("aria-label", `${t(key)} ${number}`);
      button.title = t(key);
    }
    const noneOption = shot.querySelector("[data-shot-frame] option[value='']");
    if (noneOption) noneOption.textContent = t(index > 0 &&
      document.querySelector("#workflow-shot-mode").value === "continuous" ? "firstFrameChained" : "firstFrameNone");
  });
}

async function syncWorkflowStructure() {
  if (!currentWorkflow) return;
  workflowStructureBusy = true;
  const controls = [...workflowPanel.querySelectorAll("input, textarea, select, button")]
    .map(control => [control, control.disabled]);
  controls.forEach(([control]) => { control.disabled = true; });
  try {
    await submitWorkflowAction("save");
  } finally {
    workflowStructureBusy = false;
    controls.forEach(([control, disabled]) => { control.disabled = disabled; });
    updateWorkflowShotNumbers();
  }
}

async function moveWorkflowShot(card, direction) {
  if (workflowStructureBusy || workflowStageBusy || workflowDeletion || storyboardBusy || firstFrameBusy ||
      (currentWorkflow && ["queued", "running"].includes(currentWorkflow.status))) return;
  const neighbour = direction === "up" ? card.previousElementSibling : card.nextElementSibling;
  if (!neighbour) return;
  if (direction === "up") workflowShots.insertBefore(card, neighbour);
  else workflowShots.insertBefore(neighbour, card);
  updateWorkflowShotNumbers();
  await syncWorkflowStructure();
}

function addWorkflowShot(shot = {}) {
  if (workflowShots.children.length >= 1800) {
    showWorkflowMessage(t("workflowTooManyShots"), true);
    return;
  }
  const fragment = workflowShotTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".workflow-shot");
  card.dataset.shotId = shot.id || "";
  card.dataset.seed = String(shot.seed || 0);
  card.dataset.steps = String(shot.steps || 4);
  card.dataset.turbo = String(shot.turbo !== false);
  card.querySelector("[data-shot-generate]").addEventListener("click", () => runWorkflowStage("shot", card));
  const preview = card.querySelector("[data-shot-preview]");
  if (shot.video_url) {
    preview.src = shot.video_url;
    preview.dataset.url = shot.video_url;
    preview.hidden = false;
  }
  const shotNumber = ++workflowShotSequence;
  for (const [fieldSelector, labelSelector, idSuffix] of [
    ["[data-shot-title]", "[data-shot-title-label]", "title"],
    ["[data-shot-prompt]", "[data-shot-prompt-label]", "prompt"],
    ["[data-shot-duration]", "[data-shot-duration-label]", "duration"],
    ["[data-shot-steps]", "[data-shot-steps-label]", "steps"],
    ["[data-shot-music-prompt]", "[data-shot-music-label]", "music"],
    ["[data-shot-frame]", "[data-shot-frame-label]", "frame"],
    ["[data-shot-upload]", "[data-shot-upload-label]", "upload"],
    ["[data-shot-seed]", "[data-shot-seed-label]", "seed"]
  ]) {
    const field = card.querySelector(fieldSelector);
    field.id = `workflow-shot-${idSuffix}-${shotNumber}`;
    card.querySelector(labelSelector).htmlFor = field.id;
  }
  for (const parameter of ["duration", "steps"]) {
    const hint = card.querySelector(`[data-shot-${parameter}-hint]`);
    hint.id = `workflow-shot-${parameter}-hint-${shotNumber}`;
    card.querySelector(`[data-shot-${parameter}]`).setAttribute("aria-describedby", hint.id);
  }
  card.querySelector("[data-shot-title]").value = shot.title || "";
  card.querySelector("[data-shot-seed]").value = String(shot.seed || 0);
  card.querySelector("[data-shot-prompt]").value = shot.prompt || "";
  card.dataset.skillUsage = JSON.stringify(shot.skill_usage || []);
  card.dataset.skillPrompt = shot.prompt || "";
  card.dataset.skillMusicPrompt = shot.music_prompt || "";
  card.querySelector("[data-shot-duration]").value = String(shot.duration || 5);
  card.querySelector("[data-shot-steps]").value = String(shot.steps ||
    (videoModelChoice.value === "ltx-2.3-dev-q4" ? 30 :
      videoModelChoice.value === "h3-fasth3-vsa-q8" ? 4 :
      videoModelChoice.value.startsWith("ltx-") ? 8 : 4));
  card.querySelector("[data-shot-turbo]").checked = shot.turbo !== false;
  card.querySelector("[data-shot-turbo]").addEventListener("change", updateParameterControls);
  card.querySelector("[data-shot-music-prompt]").value =
    shot.music_prompt || DEFAULT_WORKFLOW_MUSIC_PROMPT;
  card.dataset.firstFrameId = shot.first_frame_id || "";
  card.dataset.savedFirstFrameId = shot.first_frame_id || "";
  card.dataset.firstFrameUrl = shot.first_frame_url || "";
  card.querySelector("[data-shot-frame]").addEventListener("change", (event) => {
    card.dataset.firstFrameId = event.target.value;
    updateWorkflowFirstFramePreview(card);
  });
  card.querySelector("[data-shot-upload]").addEventListener("change", () => uploadWorkflowFirstFrame(card));
  const toggleButton = card.querySelector(".workflow-toggle-shot");
  toggleButton.addEventListener("click", () => {
    const expanded = toggleButton.getAttribute("aria-expanded") !== "true";
    toggleButton.setAttribute("aria-expanded", String(expanded));
    card.classList.toggle("is-collapsed", !expanded);
    updateWorkflowShotNumbers();
  });
  card.querySelector(".workflow-remove-shot").addEventListener("click", async () => {
    if (workflowStructureBusy || workflowStageBusy || workflowDeletion || storyboardBusy || firstFrameBusy ||
        (currentWorkflow && ["queued", "running"].includes(currentWorkflow.status))) return;
    if (currentWorkflow && workflowShots.children.length === 1) {
      requestWorkflowDeletion([currentWorkflow]);
      if (workflowDeletion) {
        workflowDeleteLastShot = card;
        document.querySelector("#workflow-delete-title").textContent = t("workflowClearShots");
        document.querySelector("#workflow-delete-confirm").textContent = t("workflowClearShots");
      }
      return;
    }
    card.remove();
    updateWorkflowShotNumbers();
    await syncWorkflowStructure();
  });
  card.querySelectorAll("[data-shot-move]").forEach(button => {
    button.addEventListener("click", () => moveWorkflowShot(card, button.dataset.shotMove));
  });
  workflowShots.append(fragment);
  window.MiniMuvVisualReferences?.attachShot(card, "workflow", shot.visual);
  window.MiniMuvVideoPrompts?.attachShot(card, shot, videoModelChoice.value);
  updateWorkflowShotNumbers();
  updateWorkflowMusicPromptVisibility();
  applyLanguage();
}

function updateWorkflowMusicPromptVisibility() {
  workflowGlobalMusicWrapper.hidden = workflowMusic.checked;
  workflowShots.querySelectorAll("[data-shot-music-wrapper]").forEach((wrapper) => {
    wrapper.hidden = !workflowMusic.checked;
  });
}

async function uploadWorkflowFirstFrame(card) {
  const input = card.querySelector("[data-shot-upload]");
  const file = input.files[0];
  const isVideo = card.id === "video-first-frame";
  if (!file || firstFrameBusy || storyboardBusy ||
    (!isVideo && currentWorkflow && ["queued", "running"].includes(currentWorkflow.status))) return;
  const status = card.querySelector("[data-shot-upload-status]");
  const controls = [...(isVideo ? form : workflowPanel).querySelectorAll("input, textarea, select, button"),
    ...document.querySelectorAll(".mode-button")];
  const disabled = controls.map(control => control.disabled);
  firstFrameBusy = true;
  controls.forEach(control => { control.disabled = true; });
  status.hidden = false;
  status.classList.remove("error");
  status.textContent = t("firstFrameUploading");
  try {
    if (!file.size || file.size > 20 * 1024 * 1024) throw new Error(t("firstFrameUploadHint"));
    const response = await fetch("/api/first-frames", {
      method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: file
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "invalid_first_frame");
    if (typeof data.id !== "string" || data.image_url !== `/api/first-frames/${data.id}`) {
      throw new Error("invalid_upload_response");
    }
    card.dataset.uploadedFrameId = data.id;
    card.dataset.uploadedFrameUrl = data.image_url;
    card.dataset.uploadedFrameName = file.name;
    card.dataset.firstFrameId = data.id;
    refreshWorkflowFirstFrames();
    status.textContent = file.name;
  } catch (error) {
    status.classList.add("error");
    status.textContent = `${t("firstFrameUploadFailed")}: ${error.message}`;
  } finally {
    firstFrameBusy = false;
    controls.forEach((control, index) => { control.disabled = disabled[index]; });
    input.value = "";
    updateGenerateAvailability();
  }
}

function updateWorkflowFirstFramePreview(card) {
  const id = card.querySelector("[data-shot-frame]").value;
  const image = historyItems.find((item) => item.kind === "image" && item.id === id);
  const preview = card.querySelector("[data-shot-frame-preview]");
  const url = (id === card.dataset.savedFirstFrameId ? card.dataset.firstFrameUrl : "") ||
    image?.image_url || (id === card.dataset.uploadedFrameId ? card.dataset.uploadedFrameUrl : "");
  preview.hidden = !id || !url;
  preview.alt = t("firstFrameTitle");
  if (!preview.hidden) preview.src = url;
  else preview.removeAttribute("src");
}

function refreshWorkflowFirstFrames() {
  [document.querySelector("#video-first-frame"), ...workflowShots.querySelectorAll(".workflow-shot")].forEach((card, index) => {
    const select = card.querySelector("[data-shot-frame]");
    const selected = card.dataset.firstFrameId || "";
    const options = [new Option(t(index > 1 &&
      document.querySelector("#workflow-shot-mode").value === "continuous" ? "firstFrameChained" : "firstFrameNone"), "")];
    if (card.dataset.uploadedFrameId) {
      options.push(new Option(card.dataset.uploadedFrameName, card.dataset.uploadedFrameId));
    }
    historyItems.filter((item) => item.kind === "image" && item.image_url).forEach((item) => {
      options.push(new Option(`${item.name || item.prompt?.slice(0, 80) || t("firstFrameSaved")} · ${item.id.slice(0, 8)}`, item.id));
    });
    if (selected && !options.some((option) => option.value === selected)) {
      options.push(new Option(`${t("firstFrameSaved")} · ${selected.slice(0, 8)}`, selected));
    }
    select.replaceChildren(...options);
    select.value = selected;
    updateWorkflowFirstFramePreview(card);
  });
}

function showWorkflowMessage(message, isError = false) {
  workflowMessage.textContent = message;
  workflowMessage.hidden = !message;
  workflowMessage.classList.toggle("error", isError);
}

function workflowErrorMessage(action, error) {
  if (error === "fasth3_conditioning_unsupported") return t("fastH3Limit");
  if (error === "long_video_new_soundtrack_only") return t("workflowNewScoreOnly");
  if (error === "job_already_running") return t("workflowBusy");
  if (error === "h3_model_missing") return t("modelMissing");
  if (error === "music_model_missing") return t("musicModelMissing");
  if (error === "music_runtime_missing") return t("musicRuntimeMissing");
  if (error === "music_source_missing") return t("workflowMusicSourceMissing");
  if (error === "music_source_not_found") return t("workflowMusicSourceNotFound");
  const label = action === "save" ? t("workflowSaveError") : t("workflowActionError");
  return `${label}: ${error || "unknown error"}`;
}

function workflowPayload() {
  for (const shot of workflowShots.children) {
    for (const selector of ["[data-shot-duration]", "[data-shot-steps]"]) {
      const control = shot.querySelector(selector);
      if ((selector !== "[data-shot-steps]" ||
          ["h3", "ltx-2.3-dev-q4"].includes(videoModelChoice.value)) &&
          control?.checkValidity?.() === false) {
        control.reportValidity();
        throw new Error(control.validationMessage);
      }
    }
  }
  return {
    name: document.querySelector("#workflow-name").value.trim() || "Untitled video",
    aspect: document.querySelector("#workflow-aspect").value,
    model: videoModelChoice.value,
    quality: document.querySelector("#workflow-video-quality").value,
    shot_mode: document.querySelector("#workflow-shot-mode").value,
    ...(window.MiniMuvVisualReferences ? {
      visual_references: window.MiniMuvVisualReferences.payload("workflow")
    } : {}),
    ...(window.MiniMuvVideoPrompts?.payload("workflow") || {}),
    shots: [...workflowShots.children].map((shot) => ({
      id: shot.dataset.shotId || "",
      title: shot.querySelector("[data-shot-title]").value.trim(),
      prompt: shot.querySelector("[data-shot-prompt]").value.trim(),
      music_prompt: shot.querySelector("[data-shot-music-prompt]").value.trim(),
      ...(shot.querySelector("[data-shot-prompt]").value === shot.dataset.skillPrompt &&
          shot.querySelector("[data-shot-music-prompt]").value === shot.dataset.skillMusicPrompt &&
          shot.dataset.skillUsage ? {skill_usage: JSON.parse(shot.dataset.skillUsage)} : {}),
      first_frame_id: shot.querySelector("[data-shot-frame]").value,
      ...(window.MiniMuvVisualReferences?.shotPayload(shot) || {}),
      ...(window.MiniMuvVideoPrompts?.shotPayload(shot) || {}),
      duration: Number(shot.querySelector("[data-shot-duration]").value),
      steps: ["h3", "ltx-2.3-dev-q4"].includes(videoModelChoice.value) ?
        Number(shot.querySelector("[data-shot-steps]")?.value ?? shot.dataset.steps ??
          (videoModelChoice.value === "ltx-2.3-dev-q4" ? 30 : 4)) :
        videoModelChoice.value === "h3-fasth3-vsa-q8" ? 4 : 8,
      seed: Number(shot.querySelector("[data-shot-seed]").value),
      turbo: videoModelChoice.value !== "h3" ||
        (shot.querySelector("[data-shot-turbo]")?.checked ?? shot.dataset.turbo !== "false")
    })),
    soundtrack: {
      mode: "music3",
      strategy: document.querySelector("#workflow-music").checked ? "per_shot" : "global",
      prompt: workflowGlobalMusicPrompt.value.trim(),
      lyrics_mode: currentWorkflow?.soundtrack.lyrics_mode || "instrumental",
      lyrics: currentWorkflow?.soundtrack.lyrics || "[instrumental]",
      mix: document.querySelector("#workflow-audio-mix").value,
      burn_lyrics: false
    }
  };
}

function setWorkflowForm(manifest) {
  window.MiniMuvVisualReferences?.load("workflow", manifest.visual_references, manifest.reference_urls);
  window.MiniMuvVideoPrompts?.load("workflow", manifest.negative_prompt || "");
  videoModelChoice.value = manifest.model || "h3";
  document.querySelector("#workflow-shot-mode").value = manifest.shot_mode || "continuous";
  document.querySelector("#workflow-video-quality").value = manifest.quality || (videoModelChoice.value === "h3" ? "standard" : "preview");
  updateLocalModelControls();
  if (modelInfo) renderModelInfo(modelInfo);
  document.querySelector("#workflow-name").value = manifest.name;
  document.querySelector("#workflow-aspect").value = manifest.aspect;
  workflowMusic.checked = manifest.soundtrack.mode === "music3" &&
    (manifest.soundtrack.strategy || "per_shot") === "per_shot";
  workflowGlobalMusicPrompt.value = manifest.soundtrack.prompt || DEFAULT_WORKFLOW_MUSIC_PROMPT;
  document.querySelector("#workflow-audio-mix").value = manifest.soundtrack.mix;
  workflowShots.replaceChildren();
  manifest.shots.forEach((shot) => addWorkflowShot({
    ...shot,
    music_prompt: shot.music_prompt || manifest.soundtrack.prompt
  }));
  updateWorkflowShotNumbers();
}

function newWorkflow({preserveShots = false} = {}) {
  workflowFetchVersion += 1;
  if (storyboardBusy || window.MiniMuvVisualReferences?.busy()) return;
  currentWorkflow = null;
  if (!preserveShots) {
    window.MiniMuvVisualReferences?.load("workflow");
    window.MiniMuvVideoPrompts?.load("workflow");
    document.querySelector("#workflow-name").value = "";
    document.querySelector("#workflow-aspect").value = "16:9";
    workflowGlobalMusicPrompt.value = DEFAULT_WORKFLOW_MUSIC_PROMPT;
    document.querySelector("#workflow-audio-mix").value = "score";
    workflowShots.replaceChildren();
    addWorkflowShot();
  } else {
    workflowShots.querySelectorAll(".workflow-shot").forEach(card => {
      card.dataset.shotId = "";
      const preview = card.querySelector("[data-shot-preview]");
      preview.pause();
      preview.removeAttribute("src");
      delete preview.dataset.url;
      preview.hidden = true;
      preview.load();
      card.querySelector("[data-shot-generate]").textContent = t("workflowGenerateShot");
    });
  }
  workflowStatus.textContent = t("workflowDraft");
  workflowStatus.className = "status-chip";
  workflowSaveButton.hidden = false;
  workflowStartButton.hidden = true;
  workflowResumeButton.hidden = true;
  workflowRestoreButton.hidden = true;
  workflowCancelButton.hidden = true;
  document.querySelector("#workflow-clear-shots").disabled = false;
  workflowPanel.querySelectorAll("input, textarea, select, .workflow-remove-shot").forEach((field) => {
    field.disabled = false;
  });
  updateWorkflowMusicPromptVisibility();
  if (!preserveShots) updateStoryboardTiming();
  document.querySelector("#workflow-progress").replaceChildren();
  document.querySelector("#workflow-delete-current").disabled = true;
  showWorkflowMessage("");
  if (workflowPollTimer) window.clearTimeout(workflowPollTimer);
  updateGenerateAvailability();
  updateWorkflowShotNumbers();
  updateLocalModelControls();
  refreshResultPreview();
}

function renderWorkflow(manifest) {
  const previous = workflowItems.find(item => item.id === manifest.id);
  const historyChanged = currentWorkflow?.id !== manifest.id || (previous &&
    (previous.status !== manifest.status || previous.name !== manifest.name ||
      previous.total_duration !== manifest.total_duration || previous.shots?.length !== manifest.shots?.length));
  currentWorkflow = manifest;
  workflowItems = workflowItems.map(item => item.id === manifest.id ? manifest : item);
  if (historyChanged) renderHistory();
  [...workflowShots.children].forEach((card) => {
    const shot = manifest.shots.find(item => item.id === card.dataset.shotId);
    if (!shot) return;
    card.dataset.savedFirstFrameId = shot.first_frame_id || "";
    card.dataset.firstFrameUrl = shot.first_frame_url || "";
    updateWorkflowFirstFramePreview(card);
    const preview = card.querySelector("[data-shot-preview]");
    if (preview) {
      if (shot.video_url && preview.dataset.url !== shot.video_url) {
        preview.src = shot.video_url;
        preview.dataset.url = shot.video_url;
      } else if (!shot.video_url && preview.dataset.url) {
        preview.removeAttribute("src");
        delete preview.dataset.url;
        preview.load();
      }
      preview.hidden = !shot.video_url;
      card.querySelector("[data-shot-generate]").textContent = t(shot.video_url ? "workflowRegenerateShot" : "workflowGenerateShot");
      card.querySelector("[data-shot-generate]").disabled = ["queued", "running"].includes(manifest.status);
    }
  });
  const statusKey = manifest.status === "draft" ? "Draft" :
    manifest.status[0].toUpperCase() + manifest.status.slice(1);
  workflowStatus.textContent = t(`workflowStatus${statusKey}`);
  workflowStatus.className = `status-chip ${
    ["queued", "running"].includes(manifest.status) ? "active" :
      manifest.status === "completed" ? "success" :
        ["failed", "interrupted"].includes(manifest.status) ? "error" : ""
  }`;
  const isDraft = !["queued", "running"].includes(manifest.status);
  const isActive = ["queued", "running"].includes(manifest.status);
  document.querySelector("#workflow-delete-current").disabled = isActive;
  workflowSaveButton.hidden = !isDraft;
  workflowStartButton.hidden = !isDraft;
  workflowResumeButton.hidden = !["failed", "cancelled", "interrupted"].includes(manifest.status);
  workflowRestoreButton.hidden = !["completed", "failed", "cancelled", "interrupted"].includes(manifest.status);
  workflowCancelButton.hidden = !isActive;
  for (const id of ["videos", "assemble", "soundtrack"]) {
    const control = document.querySelector(`#workflow-${id}`);
    if (control) control.disabled = isActive;
  }
  workflowSaveButton.textContent = t("workflowSave");
  workflowStartButton.textContent = t("workflowAuto");
  workflowResumeButton.textContent = t("workflowResume");
  workflowCancelButton.textContent = t("workflowCancel");
  workflowPanel.querySelectorAll("input, textarea, select, .workflow-remove-shot").forEach((field) => {
    if (field.closest("#workflow-delete-dialog")) return;
    field.disabled = !isDraft;
  });
  document.querySelector("#workflow-clear-shots").disabled = !isDraft || storyboardBusy || firstFrameBusy;
  workflowShots.querySelectorAll("[data-shot-music-prompt]").forEach((field) => {
    field.disabled = !isDraft;
  });
  updateWorkflowMusicPromptVisibility();
  updateWorkflowShotNumbers();
  const progress = document.querySelector("#workflow-progress");
  progress.replaceChildren();
  const liveSummary = workflowProgressText(manifest);
  if (manifest.progress?.total) {
    const summary = document.createElement("p");
    summary.className = "history-metrics";
    summary.textContent = liveSummary;
    const meter = document.createElement("progress");
    meter.max = manifest.progress.total;
    meter.value = manifest.progress.completed;
    meter.setAttribute("aria-label", t("workflowTaskProgress"));
    progress.append(summary, meter);
  }
  if (Number.isInteger(manifest.visual_tokens)) {
    const summary = document.createElement("p");
    summary.className = "history-metrics";
    summary.textContent = `${visualTokenTranslations[languageSelect.value] || visualTokenTranslations.en} ${
      new Intl.NumberFormat(languageSelect.value).format(manifest.visual_tokens)}`;
    progress.append(summary);
  }
  for (const [index, shot] of manifest.shots.entries()) {
    const row = document.createElement("div");
    row.className = "workflow-progress-row";
    const title = document.createElement("span");
    title.textContent = `${t("workflowShot")} ${index + 1}: ${shot.title || ""}`;
    const state = document.createElement("span");
    state.className = "workflow-shot-status";
    const shotStatusKey = shot.status === "pending" ? "workflowStatusDraft" :
      `workflowStatus${shot.status[0].toUpperCase()}${shot.status.slice(1)}`;
    const musicStatusKey = shot.music_status === "pending" ? "workflowStatusDraft" :
      `workflowStatus${(shot.music_status || "pending")[0].toUpperCase()}${(shot.music_status || "pending").slice(1)}`;
    state.textContent = manifest.soundtrack.mode === "music3" &&
      (manifest.soundtrack.strategy || "per_shot") === "per_shot"
      ? `${t(shotStatusKey)} · ${t("workflowMusicProgress")}: ${t(musicStatusKey)}`
      : t(shotStatusKey);
    row.append(title, state);
    const error = shot.error || shot.music_error;
    if (error) {
      const detail = document.createElement("span");
      detail.textContent = error;
      row.append(detail);
    }
    if (Number.isInteger(shot.visual_tokens)) {
      const metrics = document.createElement("span");
      metrics.className = "history-metrics";
      metrics.textContent = formatGenerationMetrics(shot);
      row.append(metrics);
    }
    for (const [key, label] of [
      ["generated_first_frame_url", "workflowFirstFrame"],
      ["last_frame_url", "workflowLastFrame"]
    ]) {
      if (!shot[key]) continue;
      const link = document.createElement("a");
      link.href = shot[key];
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = t(label);
      row.append(link);
    }
    progress.append(row);
  }
  for (const [index, segment] of manifest.soundtrack_segments.entries()) {
    const row = document.createElement("div");
    row.className = "workflow-progress-row";
    row.textContent = `${t("workflowMusicSegment")} ${index + 1}: ${t(
      segment.status === "pending" ? "workflowStatusDraft" :
        `workflowStatus${segment.status[0].toUpperCase()}${segment.status.slice(1)}`
    )}`;
    if (segment.error) row.textContent += ` · ${segment.error}`;
    progress.append(row);
  }
  showWorkflowMessage(
    manifest.error ? `${t("workflowFailed")}${manifest.error}\n${t(
      manifest.failure?.retryable ? "workflowRetryHint" : "workflowRepairHint"
    )}` : "",
    Boolean(manifest.error)
  );
  const active = ["queued", "running"].includes(manifest.status);
  if (activeMode === "workflow") {
    statusChip.textContent = workflowStatus.textContent;
    statusChip.className = workflowStatus.className;
    emptyState.hidden = active || manifest.status === "completed";
    loadingState.hidden = !active;
    loadingTitle.textContent = t(
      manifest.status === "queued" ? "workflowStatusQueued" : "workflowStatusRunning"
    );
    document.querySelector("#loading-copy").textContent = liveSummary || t("workflowNote");
    cancelButton.hidden = true;
    video.hidden = manifest.status !== "completed" || !manifest.output_url;
    image.hidden = true;
    audio.hidden = true;
    if (!video.hidden && video.dataset.url !== manifest.output_url) {
      video.src = manifest.output_url;
      video.dataset.url = manifest.output_url;
    }
    resultFooter.hidden = video.hidden;
    document.querySelector("#download-video").hidden = video.hidden;
    document.querySelector("#download-audio").hidden = true;
    imageDownloadLink.hidden = true;
    if (!video.hidden) {
      const link = document.querySelector("#download-video");
      link.href = manifest.output_url;
      link.download = "minimuv-long-video.mp4";
      link.textContent = t("workflowOutput");
    }
    logPanel.dataset.hasLogs = String(Boolean(manifest.logs?.length || manifest.error));
    logPanel.dataset.mode = "workflow";
    logPanel.hidden = logPanel.dataset.hasLogs !== "true" || activeMode !== "workflow";
    const followLogs = jobLogs.scrollTop + jobLogs.clientHeight >= jobLogs.scrollHeight - 20;
    jobLogs.textContent = [...(manifest.logs || []), manifest.error].filter(Boolean).join("\n");
    if (followLogs) jobLogs.scrollTop = jobLogs.scrollHeight;
  }
  updateGenerateAvailability();
  refreshResultPreview();
  if (workflowStructureBusy) {
    workflowPanel.querySelectorAll("input, textarea, select, button").forEach(control => {
      control.disabled = true;
    });
  }
}

async function loadWorkflows() {
  try {
    const response = await fetch("/api/workflows", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || "workflow_list_failed");
    workflowItems = data.items;
    const deleteDisabled = !data.items.length ||
      data.items.some(item => ["queued", "running"].includes(item.status));
    for (const id of ["workflow-delete-all"]) {
      document.querySelector(`#${id}`).disabled = deleteDisabled;
    }
    renderHistory();
    const active = data.items.find((item) => ["queued", "running"].includes(item.status));
    if (active && !currentWorkflow) await fetchWorkflow(active.id);
  } catch (error) {
    historyStatus.textContent = `${t("workflowServerError")} ${error.message}`;
    historyStatus.hidden = false;
  }
}

function workflowProgressText(manifest) {
  const parts = [];
  if (manifest.progress) parts.push(`${t("workflowTaskProgress")}: ${
    manifest.progress.completed}/${manifest.progress.total} (${manifest.progress.percent}%)`);
  const phases = {preparing: "workflowPreparing", video: "workflowVideoStage",
    music: "workflowMusicStage", soundtrack: "workflowSoundtrackStage",
    assembling: "workflowAssembling"};
  if (["queued", "running"].includes(manifest.status)) {
    if (phases[manifest.phase]) parts.push(`${t(phases[manifest.phase])} ${manifest.current_unit || ""}`.trim());
    const job = manifest.active_job;
    if (job?.status === "loading") parts.push(t("workflowPreparing"));
    if (job?.segment) parts.push(`${t("workflowSegment")}: ${job.segment.current}/${job.segment.total}`);
    if (job?.progress) {
      const step = job.progress;
      parts.push(`${step.stage}${Number.isInteger(step.step) && Number.isInteger(step.total)
        ? `: ${step.step}/${step.total}` : ""}`);
    }
    if (job && !job.progress) parts.push(t("workflowWaiting"));
    if (manifest.retry_at) parts.push(`${t("workflowRetrying")}: ${
      Math.max(0, Math.ceil(manifest.retry_at - manifest.observed_at))}s`);
  }
  if (manifest.status !== "draft") parts.push(`${t("workflowElapsed")}: ${
    Math.floor(manifest.elapsed_seconds || 0)}s`);
  return parts.join(" · ");
}

function scheduleWorkflowPoll(workflowId) {
  if (workflowPollTimer) window.clearTimeout(workflowPollTimer);
  workflowPollTimer = window.setTimeout(() => fetchWorkflow(workflowId, true), 2000);
}

function clearWorkflowShots() {
  if (workflowStructureBusy || workflowStageBusy || workflowDeletion || storyboardBusy || firstFrameBusy ||
      (currentWorkflow && ["queued", "running"].includes(currentWorkflow.status))) return;
  if (!workflowShots.children.length) return;
  if (currentWorkflow) {
    requestWorkflowDeletion([currentWorkflow]);
    if (workflowDeletion) {
      workflowDeleteLastShot = "all";
      document.querySelector("#workflow-delete-title").textContent = t("workflowClearShots");
      document.querySelector("#workflow-delete-confirm").textContent = t("workflowClearShots");
    }
    return;
  }
  if (!window.confirm(t("workflowClearConfirm"))) return;
  workflowShots.replaceChildren();
  updateWorkflowShotNumbers();
  updateGenerateAvailability();
}

function requestWorkflowDeletion(items) {
  if (workflowStructureBusy || workflowStageBusy || storyboardBusy || firstFrameBusy || workflowDeletion || !items.length) return;
  if (items.some(item => ["queued", "running"].includes(item.status))) {
    showWorkflowMessage(t("workflowDeleteActive"), true);
    return;
  }
  workflowDeletion = items.map(item => item.id);
  const dialog = document.querySelector("#workflow-delete-dialog");
  document.querySelector("#workflow-delete-title").textContent = t("workflowDelete");
  document.querySelector("#workflow-delete-confirm").textContent = t("workflowDeleteConfirm");
  document.querySelector("#workflow-delete-description").textContent =
    `${t("workflowDeleteCount")} ${items.length}\n${items.map(item => item.name).join(", ")}`;
  const media = document.querySelector("#workflow-delete-media");
  media.checked = false;
  media.disabled = !items.some(item => item.has_media);
  dialog.returnValue = "cancel";
  dialog.showModal();
}

async function finishWorkflowDeletion() {
  const dialog = document.querySelector("#workflow-delete-dialog");
  const ids = workflowDeletion;
  if (!ids) return;
  if (dialog.returnValue !== "delete") {
    workflowDeletion = null;
    workflowDeleteLastShot = null;
    return;
  }
  const clearing = workflowDeleteLastShot !== null;
  try {
    const response = await fetch(clearing ? `/api/workflows/${ids[0]}/clear-shots` :
      ids.length === 1 ? `/api/workflows/${ids[0]}` : "/api/workflows", {
      method: clearing ? "POST" : "DELETE", headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ids, delete_media: document.querySelector("#workflow-delete-media").checked})
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error === "workflow_delete_active"
      ? t("workflowDeleteActive") : `${data.error}${data.detail ? `: ${data.detail}` : ""}`);
    if (ids.includes(currentWorkflow?.id)) {
      if (clearing) {
        workflowShots.replaceChildren();
        renderWorkflow(data.workflow);
      } else {
        newWorkflow({preserveShots: true});
      }
      updateWorkflowShotNumbers();
      logPanel.hidden = true;
      jobLogs.textContent = "";
      video.pause();
      video.removeAttribute("src");
      delete video.dataset.url;
      video.hidden = true;
      resultFooter.hidden = true;
      loadingState.hidden = true;
      emptyState.hidden = false;
    }
    await loadWorkflows();
    await loadHistory();
  } catch (error) {
    showWorkflowMessage(error.message, true);
    await loadWorkflows();
  } finally {
    workflowDeletion = null;
    workflowDeleteLastShot = null;
  }
}

async function fetchWorkflow(workflowId, polling = false) {
  if (polling && currentWorkflow?.id !== workflowId) return;
  const version = ++workflowFetchVersion;
  if (workflowPollTimer) window.clearTimeout(workflowPollTimer);
  if (storyboardBusy) {
    if (polling) scheduleWorkflowPoll(workflowId);
    return;
  }
  try {
    const response = await fetch(`/api/workflows/${workflowId}`, { cache: "no-store" });
    const data = await response.json();
    if (version !== workflowFetchVersion) return;
    if (!response.ok) throw new Error(data.error || "workflow_not_found");
    currentWorkflow = data.workflow;
    if (!polling) setWorkflowForm(currentWorkflow);
    renderWorkflow(currentWorkflow);
    if (["queued", "running"].includes(currentWorkflow.status)) {
      scheduleWorkflowPoll(workflowId);
    }
  } catch (error) {
    if (version !== workflowFetchVersion) return;
    const reconnect = polling && currentWorkflow?.id === workflowId &&
      ["queued", "running"].includes(currentWorkflow.status);
    showWorkflowMessage(`${t(reconnect ? "workflowPollRetry" : "workflowServerError")} ${error.message}`, true);
    if (reconnect) scheduleWorkflowPoll(workflowId);
  }
}

async function submitWorkflowAction(action, body = undefined) {
  if (storyboardBusy || firstFrameBusy || window.MiniMuvVisualReferences?.busy()) return;
  if (action === "save") {
    showWorkflowMessage(t("workflowSaving"));
    workflowSaveButton.disabled = true;
    try {
      const isUpdate = currentWorkflow && !["queued", "running"].includes(currentWorkflow.status);
      const url = isUpdate ? `/api/workflows/${currentWorkflow.id}/update` : "/api/workflows";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || workflowPayload())
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "workflow_save_failed");
      [...workflowShots.children].forEach((card, index) => {
        card.dataset.shotId = data.workflow.shots[index].id;
      });
      renderWorkflow(data.workflow);
      await loadWorkflows();
      return true;
    } catch (error) {
      showWorkflowMessage(workflowErrorMessage("save", error.message), true);
      return false;
    } finally {
      workflowSaveButton.disabled = false;
    }
  }

  if (!currentWorkflow) return;
  const button = action === "start" ? workflowStartButton :
    action === "resume" ? workflowResumeButton :
      action === "restore" ? workflowRestoreButton : workflowCancelButton;
  button.disabled = true;
  showWorkflowMessage(action === "cancel" ? "" : t("workflowStarting"));
  try {
    if (action === "start") {
      const saveResponse = await fetch(`/api/workflows/${currentWorkflow.id}/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflowPayload())
      });
      const saved = await saveResponse.json();
      if (!saveResponse.ok) throw new Error(saved.error || "workflow_save_failed");
      [...workflowShots.children].forEach((card, index) => {
        card.dataset.shotId = saved.workflow.shots[index].id;
      });
      currentWorkflow = saved.workflow;
      renderWorkflow(currentWorkflow);
    }
    const response = await fetch(`/api/workflows/${currentWorkflow.id}/${action}`, { method: "POST" });
    const data = await response.json();
    if (!response.ok) throw new Error(workflowErrorMessage(action, data.error));
    if (action === "restore") setWorkflowForm(data.workflow);
    renderWorkflow(data.workflow);
    await loadWorkflows();
    if (["queued", "running"].includes(data.workflow.status)) {
      scheduleWorkflowPoll(data.workflow.id);
    }
  } catch (error) {
    showWorkflowMessage(error.message, true);
  } finally {
    button.disabled = false;
  }
}

let workflowStageBusy = false;
async function runWorkflowStage(operation, card = null) {
  if (workflowStructureBusy || workflowStageBusy || workflowDeletion || storyboardBusy || firstFrameBusy ||
      ["queued", "running"].includes(currentWorkflow?.status)) return;
  const index = card ? [...workflowShots.children].indexOf(card) : -1;
  workflowStageBusy = true;
  try {
    if (!await submitWorkflowAction("save")) return;
    const action = card ? `shots/${currentWorkflow.shots[index].id}/generate` : operation;
    const response = await fetch(`/api/workflows/${currentWorkflow.id}/${action}`, {method: "POST"});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "workflow_generation_failed");
    renderWorkflow(data.workflow);
    scheduleWorkflowPoll(data.workflow.id);
    await loadWorkflows();
  } catch (error) {
    const key = {
      workflow_shot_media_missing: "workflowNeedShots",
      workflow_assembly_required: "workflowNeedAssembly",
      workflow_global_soundtrack_required: "workflowNeedGlobal"
    }[error.message];
    showWorkflowMessage(key ? t(key) : `${t("workflowServerError")} ${error.message}`, true);
  } finally {
    workflowStageBusy = false;
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
  if (modelPollTimer) window.clearTimeout(modelPollTimer);
  modelPollTimer = null;
  try {
    const response = await fetch("/api/models", { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const info = await response.json();
    sampleModelDownloadSpeeds(info);
    renderModelInfo(info);
  } catch (error) {
    modelDownloadSamples.clear();
    console.warn("Model status refresh failed:", error);
    for (const id of ["model-download-info", "image-model-download-info"]) {
      const container = document.querySelector(`#${id}`);
      if (!container) continue;
      container.replaceChildren();
      container.hidden = false;
      const message = document.createElement("p");
      message.textContent = t("modelRefreshError");
      container.append(message);
    }
  } finally {
    modelPollTimer = window.setTimeout(loadModels, 10000);
  }
}

initializeTheme();
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
workflowModeButton.addEventListener("click", () => {
  activeMode = "workflow";
  localStorage.setItem("h3-mode", activeMode);
  updateModeUI();
  if (currentWorkflow) renderWorkflow(currentWorkflow);
});
mvModeButton.addEventListener("click", () => {
  activeMode = "mv";
  localStorage.setItem("h3-mode", activeMode);
  updateModeUI();
  applyLanguage();
  loadMVProjects();
  loadMVMusicSources();
});
window.MiniMuvMVHost = {
    state: () => ({project: currentMV, dirty: mvDirty, busy: mvBusy,
      model: videoModelChoice.value, quality: document.querySelector("#mv-video-quality").value,
      textModel: mvPromptEnhancerModel.value, language: languageSelect.value, analysis: mvAnalysis,
      externalBusy: Boolean(_mvExternalBusy()),
      images: historyItems.filter(item => item.kind === "image" && item.image_url),
      analysisBusy: ["queued", "running", "cancelling"].includes(mvAnalysisJob?.status)}),
    text: t, updateAvailability: updateGenerateAvailability,
    restoreGeneration: workflow => {
      restoreHistoryControl("#video-model-choice", workflow.model);
      document.querySelector("#mv-video-quality").value = workflow.quality;
      updateLocalModelControls();
    },
  };
function _mvExternalBusy() {
    return Boolean(window.MiniMuvVisualReferences?.busy()) || ["queued", "running"].includes(currentWorkflow?.status) ||
      ["queued", "loading", "running", "cancelling"].includes(currentJob?.status);
}
document.querySelector("#mv-form").addEventListener("submit", saveMVProject);
document.querySelector("#mv-form").addEventListener("input", event => {
  if (event.target.id !== "mv-music-file") {
    mvDirty = true;
    updateMVAnalysisControls();
  }
});
document.querySelector("#mv-upload").addEventListener("click", () => document.querySelector("#mv-music-file").click());
document.querySelector("#mv-music-file").addEventListener("change", uploadMVMusic);
document.querySelector("#mv-audio").addEventListener("error", () => showMVMessage(t("mvPreviewError"), true));
document.querySelector("#mv-music").addEventListener("change", () => {
  mvDirty = true;
  updateMVMusicPreview();
  if (!mvAnalysisJob) setMVAnalysisStatus("mvAnalysisIdle");
  renderMVTimeline();
});
document.querySelector("#mv-analyze").addEventListener("click", startMVAnalysis);
document.querySelector("#mv-cancel-analysis").addEventListener("click", cancelMVAnalysis);
document.querySelector("#mv-audio").addEventListener("timeupdate", renderMVTimeline);
document.querySelector("#mv-timeline").addEventListener("click", seekMVTimeline);
document.querySelector("#mv-timeline").addEventListener("keydown", handleMVTimelineKeydown);
if (typeof window.addEventListener === "function") {
  window.addEventListener("resize", renderMVTimeline);
}
document.querySelector("#mv-new").addEventListener("click", () => openMVProject());
loadMVProjects();
loadMVMusicSources();
document.querySelector("#workflow-add-shot").addEventListener("click", () => addWorkflowShot());
workflowPlanStory.addEventListener("click", planWorkflowStory);
document.querySelector("#workflow-total-duration").addEventListener("input", updateStoryboardTiming);
document.querySelector("#workflow-shot-duration").addEventListener("input", updateStoryboardTiming);
document.querySelector("#image-size").addEventListener("change", updateLocalModelControls);
document.querySelector("#image-aspect").addEventListener("change", updateLocalModelControls);
document.querySelector("#image-quality").addEventListener("change", updateLocalModelControls);
document.querySelector("#image-candidate-count").addEventListener("change", updateLocalModelControls);
document.querySelector("#image-turnaround").addEventListener("change", () => {
  if (document.querySelector("#image-turnaround").checked) document.querySelector("#image-scene-views").checked = false;
  updateLocalModelControls();
});
updateStoryboardTiming();
workflowMusic.addEventListener("change", updateWorkflowMusicPromptVisibility);
workflowSaveButton.addEventListener("click", () => submitWorkflowAction("save"));
document.querySelector("#workflow-videos").addEventListener("click", () => runWorkflowStage("videos"));
document.querySelector("#workflow-assemble").addEventListener("click", () => runWorkflowStage("assemble"));
document.querySelector("#workflow-soundtrack").addEventListener("click", () => runWorkflowStage("soundtrack"));
workflowStartButton.addEventListener("click", () => submitWorkflowAction("start"));
workflowResumeButton.addEventListener("click", () => submitWorkflowAction("resume"));
document.querySelector("#workflow-clear-shots").addEventListener("click", clearWorkflowShots);
document.querySelector("#workflow-delete-all").addEventListener("click", () => requestWorkflowDeletion(workflowItems));
document.querySelector("#copy-logs").addEventListener("click", copyJobLogs);
document.querySelector("#workflow-delete-current").addEventListener("click", () => {
  if (currentWorkflow) requestWorkflowDeletion([currentWorkflow]);
});
document.querySelector("#workflow-progress-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.setAttribute("aria-expanded", String(button.getAttribute("aria-expanded") !== "true"));
  updateWorkflowProgressToggle();
});
document.querySelector("#workflow-delete-dialog").addEventListener("close", finishWorkflowDeletion);
workflowCancelButton.addEventListener("click", () => submitWorkflowAction("cancel"));
document.querySelector("#workflow-refresh").addEventListener("click", loadWorkflows);
workflowRestoreButton.addEventListener("click", () => submitWorkflowAction("restore"));
document.querySelector("#workflow-new").addEventListener("click", newWorkflow);
document.querySelector("#workflow-shot-mode").addEventListener("change", updateWorkflowShotNumbers);
musicLyricsMode.addEventListener("change", updateMusicLyricsMode);
addWorkflowShot();
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
  syncMusicKeywords();
  document.querySelector("#music-keyword-status").hidden = true;
  document.querySelector("#history-restore-status").hidden = true;
  document.querySelector("#prompt-count").textContent = `${promptInput.value.length} / 4000`;
  if (!promptEnhancementBusy) {
    promptEnhancerResult.hidden = true;
    setPromptEnhancerStatus("");
  }
});
enhancePromptButton.addEventListener("click", enhancePrompt);
applyEnhancedPromptButton.addEventListener("click", () => {
  applyPromptEnhancement(promptInput, promptEnhancerKeywords, promptEnhancerOutput, "video", () => {
  document.querySelector("#prompt-count").textContent = `${promptInput.value.length} / 4000`;
  });
});
dismissEnhancedPromptButton.addEventListener("click", () => {
  promptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("");
});
mvPromptInput.addEventListener("input", () => {
  if (!promptEnhancementBusy) {
    mvPromptEnhancerResult.hidden = true;
    setPromptEnhancerStatus("", "mv");
  }
});
mvEnhancePromptButton.addEventListener("click", enhanceMVPrompt);
mvApplyEnhancedPromptButton.addEventListener("click", () => {
  applyPromptEnhancement(mvPromptInput, mvPromptEnhancerKeywords, mvPromptEnhancerOutput, "mv", () => {
    mvDirty = true;
    updateMVAnalysisControls();
  });
});
mvDismissEnhancedPromptButton.addEventListener("click", () => {
  mvPromptEnhancerResult.hidden = true;
  setPromptEnhancerStatus("", "mv");
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
for (const selector of [videoModelChoice, imageModelChoice, musicModelChoice]) {
  selector.addEventListener("change", () => {
    updateLocalModelControls();
    if (modelInfo) renderModelInfo(modelInfo);
  });
}
const videoFirstFrame = document.querySelector("#video-first-frame");
videoFirstFrame.querySelector("[data-shot-frame]").addEventListener("change", (event) => {
  videoFirstFrame.dataset.firstFrameId = event.target.value;
  updateWorkflowFirstFramePreview(videoFirstFrame);
});
videoFirstFrame.querySelector("[data-shot-upload]").addEventListener("change", () => {
  uploadWorkflowFirstFrame(videoFirstFrame);
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (promptEnhancementBusy || firstFrameBusy || storyboardBusy || window.MiniMuvImageReferences?.busy()) return;
  const isImage = activeMode === "image";
  const isMusic = activeMode === "music";
  let referencePayload;
  try {
    referencePayload = isImage ? window.MiniMuvImageReferences?.payload() : {};
  } catch (error) {
    renderJob({status: "failed", error: error.message, logs: []});
    return;
  }
  const payload = isImage
    ? {
      prompt: promptInput.value, name: projectNameInput.value.trim(), seed: Number(document.querySelector("#image-seed").value),
      ...imageCanvasSettings(),
      ...referencePayload
    }
    : isMusic
      ? {
        prompt: promptInput.value,
        name: projectNameInput.value.trim(),
        model: musicModelChoice.value || "music3",
        lyrics_mode: musicLyricsMode.value,
        lyrics: musicLyricsInput.value,
        duration: isYueMusicModel() ? 30 : Number(document.querySelector("#music-duration").value),
        steps: Number(document.querySelector("#music-steps").value),
        seed: Number(document.querySelector("#music-seed").value)
      }
      : {
      prompt: promptInput.value,
      name: projectNameInput.value.trim(),
      model: videoModelChoice.value,
      ...(window.MiniMuvVideoPrompts?.payload("video") || {}),
      quality: document.querySelector("#video-quality").value,
      duration: Number(document.querySelector("#duration").value),
      aspect: document.querySelector("#aspect").value,
      steps: ["h3", "ltx-2.3-dev-q4"].includes(videoModelChoice.value) ? Number(document.querySelector("#steps").value) :
        videoModelChoice.value === "h3-fasth3-vsa-q8" ? 4 : 8,
      seed: Number(document.querySelector("#seed").value),
      turbo: videoModelChoice.value === "h3" ? document.querySelector("#turbo").checked : true,
      first_frame_id: videoFirstFrame.querySelector("[data-shot-frame]").value,
      ...(window.MiniMuvVisualReferences ? {
        visual_references: window.MiniMuvVisualReferences.payload("video"),
        ...window.MiniMuvVisualReferences.shotPayload(document.querySelector("#video-visual-selection"))
      } : {})
    };
  if (promptInput.value === promptInput.dataset?.skillPrompt && promptInput.dataset?.skillUsage) {
    payload.skill_usage = JSON.parse(promptInput.dataset.skillUsage);
  }
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
loadWorkflows();
refreshCurrentJob();
