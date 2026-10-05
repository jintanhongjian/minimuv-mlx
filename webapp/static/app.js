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
    downloadAudio: "下载音频", generationLog: "生成日志", metricElapsed: "耗时", metricTokens: "Token", footerLocal: "模型推理完全在本机运行",
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
    downloadAudio: "Download audio", generationLog: "Generation log", metricElapsed: "Elapsed", metricTokens: "Tokens", footerLocal: "Inference runs entirely on your device",
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
    downloadAudio: "下載音訊", generationLog: "生成日誌", metricElapsed: "耗時", metricTokens: "Token", footerLocal: "模型推理完全在本機執行",
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
    downloadAudio: "Télécharger l’audio", generationLog: "Journal", metricElapsed: "Durée", metricTokens: "Jetons", footerLocal: "L’inférence s’exécute sur votre appareil",
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
    downloadAudio: "Audio herunterladen", generationLog: "Generierungsprotokoll", metricElapsed: "Dauer", metricTokens: "Tokens", footerLocal: "Inferenz läuft vollständig lokal",
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
    downloadAudio: "音声をダウンロード", generationLog: "生成ログ", metricElapsed: "所要時間", metricTokens: "トークン", footerLocal: "推論はすべてローカルで実行",
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
    downloadAudio: "오디오 다운로드", generationLog: "생성 로그", metricElapsed: "소요 시간", metricTokens: "토큰", footerLocal: "추론은 전적으로 로컬에서 실행됩니다",
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
    downloadAudio: "Descargar audio", generationLog: "Registro de generación", metricElapsed: "Tiempo", metricTokens: "Tokens", footerLocal: "La inferencia se ejecuta íntegramente aquí",
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
    downloadAudio: "Baixar áudio", generationLog: "Registro de geração", metricElapsed: "Tempo", metricTokens: "Tokens", footerLocal: "A inferência é executada localmente",
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
    downloadAudio: "Sesi indir", generationLog: "Üretim günlüğü", metricElapsed: "Süre", metricTokens: "Token", footerLocal: "Çıkarım tamamen bu cihazda çalışır",
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
    downloadAudio: "تنزيل الصوت", generationLog: "سجل الإنشاء", metricElapsed: "المدة", metricTokens: "الرموز", footerLocal: "يعمل الاستدلال بالكامل على جهازك",
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
    downloadAudio: "Tải âm thanh", generationLog: "Nhật ký tạo", metricElapsed: "Thời gian", metricTokens: "Token", footerLocal: "Suy luận hoàn toàn chạy trên thiết bị của bạn",
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
    downloadAudio: "Unduh audio", generationLog: "Log generasi", metricElapsed: "Durasi", metricTokens: "Token", footerLocal: "Inferensi sepenuhnya berjalan di perangkat",
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
    computeNote: "H3 生成计算量很大。Turbo 模式推荐 4–8 步预览；标准模式从 16 步起。5 秒视频约 125 帧，实际耗时取决于设备与系统负载。",
    quality: "生成步数", stepsFast: "4 · Turbo 预览", stepsBalanced: "6 · Turbo 均衡", stepsDetailed: "8 · Turbo 细节", stepsStandard: "16 · 标准"
  },
  en: {
    modelReady: "Local MiniMax H3 is ready", modelMissing: "Complete 4-bit H3 model pack not found",
    modelDownloading: "Downloading the 4-bit H3 model", modelNotLoaded: "4-bit model pack found, but it is not loaded", runtimeMissing: "MLX-Serve must be installed",
    loadModel: "Start MLX-Serve and load model", runtimeDownload: "Download MLX-Serve ↗",
    modelDownload: "Download complete 4-bit model ↗", modelSettings: "Local model",
    modelPath: "Model directory: ", turboLabel: "Use 4-step Turbo LoRA (recommended for previews)",
    computeNote: "H3 generation is compute-intensive. Turbo previews use 4–8 steps; standard sampling starts at 16. A 5-second video is about 125 frames. Actual time depends on the Mac and system load.",
    quality: "Generation steps", stepsFast: "4 · Turbo preview", stepsBalanced: "6 · Turbo balanced", stepsDetailed: "8 · Turbo detail", stepsStandard: "16 · Standard"
  },
  "zh-TW": {
    modelReady: "本機 MiniMax H3 已就緒", modelMissing: "找不到完整 4-bit H3 模型套件",
    modelDownloading: "正在下載 4-bit H3 模型", modelNotLoaded: "已找到 4-bit 模型套件，但尚未載入", runtimeMissing: "需要安裝 MLX-Serve",
    loadModel: "啟動 MLX-Serve 並載入模型", runtimeDownload: "下載 MLX-Serve ↗",
    modelDownload: "下載完整 4-bit 模型 ↗", modelSettings: "本機模型",
    modelPath: "模型目錄：", turboLabel: "使用 4-step Turbo LoRA（推薦預覽）",
    computeNote: "H3 生成需要大量運算。Turbo 預覽建議使用 4–8 步；標準取樣從 16 步起。5 秒影片約 125 幀，實際耗時依裝置與系統負載而異。",
    quality: "生成步數", stepsFast: "4 · Turbo 預覽", stepsBalanced: "6 · Turbo 均衡", stepsDetailed: "8 · Turbo 細節", stepsStandard: "16 · 標準"
  },
  fr: {
    modelReady: "MiniMax H3 local est prêt", modelMissing: "Pack H3 4 bits complet introuvable",
    modelDownloading: "Téléchargement du modèle H3 4 bits", modelNotLoaded: "Pack 4 bits trouvé, mais pas encore chargé", runtimeMissing: "MLX-Serve doit être installé",
    loadModel: "Démarrer MLX-Serve et charger le modèle", runtimeDownload: "Télécharger MLX-Serve ↗",
    modelDownload: "Télécharger le modèle complet 4 bits ↗", modelSettings: "Modèle local",
    modelPath: "Dossier du modèle : ", turboLabel: "Utiliser Turbo LoRA 4 étapes (aperçu recommandé)",
    computeNote: "La génération H3 est très intensive. Les aperçus Turbo utilisent 4 à 8 étapes ; l’échantillonnage standard commence à 16. Une vidéo de 5 s compte environ 125 images. La durée dépend du Mac et de sa charge.",
    quality: "Étapes de génération", stepsFast: "4 · Aperçu Turbo", stepsBalanced: "6 · Turbo équilibré", stepsDetailed: "8 · Détails Turbo", stepsStandard: "16 · Standard"
  },
  de: {
    modelReady: "Lokales MiniMax H3 ist bereit", modelMissing: "Vollständiges 4-Bit-H3-Modellpaket nicht gefunden",
    modelDownloading: "4-Bit-H3-Modell wird heruntergeladen", modelNotLoaded: "4-Bit-Modellpaket gefunden, aber noch nicht geladen", runtimeMissing: "MLX-Serve muss installiert werden",
    loadModel: "MLX-Serve starten und Modell laden", runtimeDownload: "MLX-Serve herunterladen ↗",
    modelDownload: "Vollständiges 4-Bit-Modell herunterladen ↗", modelSettings: "Lokales Modell",
    modelPath: "Modellordner: ", turboLabel: "4-Step-Turbo-LoRA verwenden (Vorschau empfohlen)",
    computeNote: "Die H3-Generierung ist rechenintensiv. Turbo-Vorschauen verwenden 4–8 Schritte; Standard-Sampling beginnt bei 16. Ein 5-Sekunden-Video hat etwa 125 Frames. Die Dauer hängt von Mac und Systemlast ab.",
    quality: "Generierungsschritte", stepsFast: "4 · Turbo-Vorschau", stepsBalanced: "6 · Turbo ausgewogen", stepsDetailed: "8 · Turbo-Details", stepsStandard: "16 · Standard"
  },
  ja: {
    modelReady: "ローカル MiniMax H3 の準備完了", modelMissing: "完全な 4-bit H3 モデルパックが見つかりません",
    modelDownloading: "4-bit H3 モデルをダウンロード中", modelNotLoaded: "4-bit モデルパックを検出しましたが、未ロードです", runtimeMissing: "MLX-Serve のインストールが必要です",
    loadModel: "MLX-Serve を起動してモデルをロード", runtimeDownload: "MLX-Serve をダウンロード ↗",
    modelDownload: "完全な 4-bit モデルをダウンロード ↗", modelSettings: "ローカルモデル",
    modelPath: "モデルフォルダー：", turboLabel: "4-step Turbo LoRA を使用（プレビュー推奨）",
    computeNote: "H3 の生成には多くの計算が必要です。Turbo プレビューは 4～8 ステップ、標準サンプリングは 16 ステップからです。5 秒動画は約 125 フレームで、時間は Mac と負荷によって変わります。",
    quality: "生成ステップ", stepsFast: "4 · Turbo プレビュー", stepsBalanced: "6 · Turbo バランス", stepsDetailed: "8 · Turbo 詳細", stepsStandard: "16 · 標準"
  },
  ko: {
    modelReady: "로컬 MiniMax H3 준비 완료", modelMissing: "완전한 4-bit H3 모델 팩을 찾을 수 없습니다",
    modelDownloading: "4-bit H3 모델 다운로드 중", modelNotLoaded: "4-bit 모델 팩을 찾았지만 아직 로드되지 않았습니다", runtimeMissing: "MLX-Serve 설치가 필요합니다",
    loadModel: "MLX-Serve 시작 및 모델 로드", runtimeDownload: "MLX-Serve 다운로드 ↗",
    modelDownload: "완전한 4-bit 모델 다운로드 ↗", modelSettings: "로컬 모델",
    modelPath: "모델 폴더: ", turboLabel: "4-step Turbo LoRA 사용 (미리보기 권장)",
    computeNote: "H3 생성은 계산량이 많습니다. Turbo 미리보기는 4~8단계, 표준 샘플링은 16단계부터 사용합니다. 5초 영상은 약 125프레임이며 실제 시간은 Mac과 시스템 부하에 따라 다릅니다.",
    quality: "생성 단계", stepsFast: "4 · Turbo 미리보기", stepsBalanced: "6 · Turbo 균형", stepsDetailed: "8 · Turbo 디테일", stepsStandard: "16 · 표준"
  },
  es: {
    modelReady: "MiniMax H3 local está listo", modelMissing: "No se encontró el paquete H3 completo de 4 bits",
    modelDownloading: "Descargando el modelo H3 de 4 bits", modelNotLoaded: "Paquete de 4 bits encontrado, pero aún no está cargado", runtimeMissing: "Se debe instalar MLX-Serve",
    loadModel: "Iniciar MLX-Serve y cargar el modelo", runtimeDownload: "Descargar MLX-Serve ↗",
    modelDownload: "Descargar el modelo completo de 4 bits ↗", modelSettings: "Modelo local",
    modelPath: "Carpeta del modelo: ", turboLabel: "Usar Turbo LoRA de 4 pasos (recomendado para vistas previas)",
    computeNote: "La generación H3 requiere mucho cálculo. Las vistas Turbo usan 4–8 pasos; el muestreo estándar empieza en 16. Un vídeo de 5 s tiene unos 125 fotogramas. El tiempo depende del Mac y su carga.",
    quality: "Pasos de generación", stepsFast: "4 · Vista previa Turbo", stepsBalanced: "6 · Turbo equilibrado", stepsDetailed: "8 · Detalle Turbo", stepsStandard: "16 · Estándar"
  },
  pt: {
    modelReady: "MiniMax H3 local está pronto", modelMissing: "Pacote H3 completo de 4 bits não encontrado",
    modelDownloading: "Baixando o modelo H3 de 4 bits", modelNotLoaded: "Pacote de 4 bits encontrado, mas ainda não carregado", runtimeMissing: "É necessário instalar o MLX-Serve",
    loadModel: "Iniciar MLX-Serve e carregar o modelo", runtimeDownload: "Baixar MLX-Serve ↗",
    modelDownload: "Baixar o modelo completo de 4 bits ↗", modelSettings: "Modelo local",
    modelPath: "Pasta do modelo: ", turboLabel: "Usar Turbo LoRA de 4 etapas (recomendado para prévias)",
    computeNote: "A geração H3 exige muito processamento. As prévias Turbo usam 4–8 etapas; a amostragem padrão começa em 16. Um vídeo de 5 s tem cerca de 125 quadros. O tempo depende do Mac e da carga do sistema.",
    quality: "Etapas de geração", stepsFast: "4 · Prévia Turbo", stepsBalanced: "6 · Turbo equilibrado", stepsDetailed: "8 · Detalhe Turbo", stepsStandard: "16 · Padrão"
  },
  tr: {
    modelReady: "Yerel MiniMax H3 hazır", modelMissing: "Tam 4 bit H3 model paketi bulunamadı",
    modelDownloading: "4 bit H3 modeli indiriliyor", modelNotLoaded: "4 bit model paketi bulundu ancak yüklenmedi", runtimeMissing: "MLX-Serve kurulmalı",
    loadModel: "MLX-Serve'i başlat ve modeli yükle", runtimeDownload: "MLX-Serve'i indir ↗",
    modelDownload: "Tam 4 bit modeli indir ↗", modelSettings: "Yerel model",
    modelPath: "Model dizini: ", turboLabel: "4 adımlı Turbo LoRA kullan (önizleme önerilir)",
    computeNote: "H3 üretimi yoğun hesaplama gerektirir. Turbo önizlemeleri 4–8 adım kullanır; standart örnekleme 16 adımdan başlar. 5 saniyelik video yaklaşık 125 kare içerir. Süre Mac'e ve sistem yüküne bağlıdır.",
    quality: "Üretim adımları", stepsFast: "4 · Turbo önizleme", stepsBalanced: "6 · Dengeli Turbo", stepsDetailed: "8 · Turbo ayrıntı", stepsStandard: "16 · Standart"
  },
  ar: {
    modelReady: "MiniMax H3 المحلي جاهز", modelMissing: "لم يتم العثور على حزمة H3 كاملة بدقة 4 بت",
    modelDownloading: "جارٍ تنزيل نموذج H3 بدقة 4 بت", modelNotLoaded: "عُثر على حزمة 4 بت لكنها لم تُحمّل بعد", runtimeMissing: "يلزم تثبيت MLX-Serve",
    loadModel: "بدء MLX-Serve وتحميل النموذج", runtimeDownload: "تنزيل MLX-Serve ↗",
    modelDownload: "تنزيل نموذج 4 بت الكامل ↗", modelSettings: "النموذج المحلي",
    modelPath: "مجلد النموذج: ", turboLabel: "استخدام Turbo LoRA بأربع خطوات (موصى به للمعاينة)",
    computeNote: "يتطلب توليد H3 حسابات كثيفة. تستخدم معاينات Turbo من 4 إلى 8 خطوات، ويبدأ التوليد القياسي من 16 خطوة. يضم فيديو 5 ثوانٍ نحو 125 إطاراً. يعتمد الوقت على الجهاز وحمل النظام.",
    quality: "خطوات التوليد", stepsFast: "4 · معاينة Turbo", stepsBalanced: "6 · Turbo متوازن", stepsDetailed: "8 · تفاصيل Turbo", stepsStandard: "16 · قياسي"
  },
  vi: {
    modelReady: "MiniMax H3 cục bộ đã sẵn sàng", modelMissing: "Không tìm thấy gói H3 4-bit đầy đủ",
    modelDownloading: "Đang tải mô hình H3 4-bit", modelNotLoaded: "Đã tìm thấy gói 4-bit nhưng chưa tải vào bộ nhớ", runtimeMissing: "Cần cài đặt MLX-Serve",
    loadModel: "Khởi động MLX-Serve và tải mô hình", runtimeDownload: "Tải MLX-Serve ↗",
    modelDownload: "Tải mô hình 4-bit đầy đủ ↗", modelSettings: "Mô hình cục bộ",
    modelPath: "Thư mục mô hình: ", turboLabel: "Dùng Turbo LoRA 4 bước (khuyên dùng để xem trước)",
    computeNote: "Tạo nội dung H3 cần nhiều tính toán. Bản xem trước Turbo dùng 4–8 bước; chế độ chuẩn bắt đầu từ 16 bước. Video 5 giây có khoảng 125 khung hình. Thời gian tùy Mac và tải hệ thống.",
    quality: "Số bước tạo", stepsFast: "4 · Xem trước Turbo", stepsBalanced: "6 · Turbo cân bằng", stepsDetailed: "8 · Turbo chi tiết", stepsStandard: "16 · Tiêu chuẩn"
  },
  id: {
    modelReady: "MiniMax H3 lokal siap", modelMissing: "Paket model H3 4-bit lengkap tidak ditemukan",
    modelDownloading: "Mengunduh model H3 4-bit", modelNotLoaded: "Paket 4-bit ditemukan, tetapi belum dimuat", runtimeMissing: "MLX-Serve perlu dipasang",
    loadModel: "Jalankan MLX-Serve dan muat model", runtimeDownload: "Unduh MLX-Serve ↗",
    modelDownload: "Unduh model 4-bit lengkap ↗", modelSettings: "Model lokal",
    modelPath: "Direktori model: ", turboLabel: "Gunakan Turbo LoRA 4 langkah (disarankan untuk pratinjau)",
    computeNote: "Generasi H3 membutuhkan komputasi besar. Pratinjau Turbo memakai 4–8 langkah; sampling standar dimulai dari 16. Video 5 detik sekitar 125 frame. Waktu bergantung pada Mac dan beban sistem.",
    quality: "Langkah generasi", stepsFast: "4 · Pratinjau Turbo", stepsBalanced: "6 · Turbo seimbang", stepsDetailed: "8 · Detail Turbo", stepsStandard: "16 · Standar"
  },
  ru: {
    modelReady: "Локальная MiniMax H3 готова", modelMissing: "Полный пакет H3 в 4 бит не найден",
    modelDownloading: "Загрузка модели H3 в 4 бит", modelNotLoaded: "Пакет 4 бит найден, но ещё не загружен", runtimeMissing: "Необходимо установить MLX-Serve",
    loadModel: "Запустить MLX-Serve и загрузить модель", runtimeDownload: "Скачать MLX-Serve ↗",
    modelDownload: "Скачать полную модель 4 бит ↗", modelSettings: "Локальная модель",
    modelPath: "Папка модели: ", turboLabel: "Использовать Turbo LoRA на 4 шага (рекомендуется для предпросмотра)",
    computeNote: "Генерация H3 требует больших вычислений. Для предпросмотра Turbo нужно 4–8 шагов, стандартная выборка начинается с 16. В 5-секундном видео около 125 кадров. Время зависит от Mac и нагрузки.",
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
    workflowTooManyShots: "最多支持 48 个镜头。", workflowFailed: "工作流失败：", workflowServerError: "无法读取工作流。"
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
    workflowTooManyShots: "A workflow can contain at most 48 shots.", workflowFailed: "Workflow failed: ", workflowServerError: "Could not load workflows."
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
    workflowTooManyShots: "最多支援 48 個鏡頭。", workflowFailed: "工作流程失敗：", workflowServerError: "無法讀取工作流程。"
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
    workflowTooManyShots: "48 plans maximum.", workflowFailed: "Échec du workflow : ", workflowServerError: "Impossible de charger les workflows."
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
    workflowTooManyShots: "Maximal 48 Aufnahmen.", workflowFailed: "Workflow fehlgeschlagen: ", workflowServerError: "Workflows konnten nicht geladen werden."
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
    workflowTooManyShots: "ショットは最大48個です。", workflowFailed: "ワークフロー失敗：", workflowServerError: "読み込めませんでした。"
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
    workflowTooManyShots: "샷은 최대 48개까지 가능합니다.", workflowFailed: "워크플로 실패: ", workflowServerError: "워크플로를 불러올 수 없습니다."
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
    workflowTooManyShots: "Se permiten hasta 48 planos.", workflowFailed: "Error en el flujo: ", workflowServerError: "No se pudieron cargar los flujos."
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
    workflowTooManyShots: "São permitidas até 48 cenas.", workflowFailed: "Falha no fluxo: ", workflowServerError: "Não foi possível carregar os fluxos."
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
    workflowTooManyShots: "En fazla 48 sahne desteklenir.", workflowFailed: "İş akışı başarısız: ", workflowServerError: "İş akışları yüklenemedi."
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
    workflowTooManyShots: "الحد الأقصى 48 لقطة.", workflowFailed: "فشل سير العمل: ", workflowServerError: "تعذر تحميل مسارات العمل."
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
    workflowTooManyShots: "Tối đa 48 cảnh.", workflowFailed: "Quy trình thất bại: ", workflowServerError: "Không thể tải quy trình."
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
    workflowTooManyShots: "Maksimal 48 adegan.", workflowFailed: "Alur gagal: ", workflowServerError: "Alur tidak dapat dimuat."
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
    workflowTooManyShots: "Максимум 48 кадров.", workflowFailed: "Ошибка процесса: ", workflowServerError: "Не удалось загрузить процессы."
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
  "zh-CN": { storyboardTitle: "故事自动分镜", storyboardStory: "故事文本", storyboardPlaceholder: "粘贴完整故事（最多 30,000 字符），包含人物、情节与结尾。", storyboardHint: "本机文本模型生成可编辑镜头并追加到现有分镜；不会自动开始视频生成。", storyboardCount: "生成镜头数", storyboardGenerate: "生成并添加分镜", storyboardGenerating: "正在分析故事并生成分镜…", storyboardAdded: "分镜已添加，请审阅后保存。", storyboardInvalid: "请输入故事（最多 30,000 字符）和有效镜头数，镜头总数不得超过 48。" },
  en: { storyboardTitle: "Automatic storyboarding", storyboardStory: "Story text", storyboardPlaceholder: "Paste the complete story (up to 30,000 characters), including characters, plot and ending.", storyboardHint: "The local text model appends editable shots; video generation does not start automatically.", storyboardCount: "Number of new shots", storyboardGenerate: "Generate & add shots", storyboardGenerating: "Analyzing story and planning shots…", storyboardAdded: "Shots added. Review and save the storyboard.", storyboardInvalid: "Enter a story (up to 30,000 characters) and a valid shot count; the total cannot exceed 48." },
  "zh-TW": { storyboardTitle: "故事自動分鏡", storyboardStory: "故事文字", storyboardPlaceholder: "貼上完整故事（最多 30,000 字元），包含人物、情節與結尾。", storyboardHint: "本機文字模型產生可編輯鏡頭並追加至現有分鏡；不會自動開始影片生成。", storyboardCount: "生成鏡頭數", storyboardGenerate: "生成並新增分鏡", storyboardGenerating: "正在分析故事並產生分鏡…", storyboardAdded: "分鏡已新增，請審閱後儲存。", storyboardInvalid: "請輸入故事（最多 30,000 字元）與有效鏡頭數，鏡頭總數不得超過 48。" },
  fr: { storyboardTitle: "Storyboard automatique", storyboardStory: "Texte du récit", storyboardPlaceholder: "Collez le récit complet (30 000 caractères maximum), personnages, intrigue et fin inclus.", storyboardHint: "Le modèle local ajoute des plans modifiables sans lancer la génération vidéo.", storyboardCount: "Nombre de nouveaux plans", storyboardGenerate: "Créer et ajouter les plans", storyboardGenerating: "Analyse du récit et création des plans…", storyboardAdded: "Plans ajoutés. Vérifiez et enregistrez le storyboard.", storyboardInvalid: "Saisissez un récit (30 000 caractères maximum) et un nombre valide ; 48 plans au total maximum." },
  de: { storyboardTitle: "Automatisches Storyboard", storyboardStory: "Geschichte", storyboardPlaceholder: "Vollständige Geschichte mit Figuren, Handlung und Ende einfügen (max. 30.000 Zeichen).", storyboardHint: "Das lokale Textmodell fügt bearbeitbare Aufnahmen hinzu, ohne die Videogenerierung zu starten.", storyboardCount: "Anzahl neuer Aufnahmen", storyboardGenerate: "Aufnahmen erstellen und hinzufügen", storyboardGenerating: "Geschichte wird analysiert und geplant…", storyboardAdded: "Aufnahmen hinzugefügt. Storyboard prüfen und speichern.", storyboardInvalid: "Geschichte (max. 30.000 Zeichen) und gültige Anzahl eingeben; insgesamt höchstens 48 Aufnahmen." },
  ja: { storyboardTitle: "ストーリーの自動絵コンテ", storyboardStory: "ストーリー本文", storyboardPlaceholder: "登場人物、展開、結末を含む全文を入力（最大30,000文字）。", storyboardHint: "ローカルテキストモデルが編集可能なショットを追加します。動画生成は自動開始しません。", storyboardCount: "追加ショット数", storyboardGenerate: "絵コンテを生成して追加", storyboardGenerating: "ストーリーを分析し絵コンテを生成中…", storyboardAdded: "ショットを追加しました。確認して保存してください。", storyboardInvalid: "ストーリー（最大30,000文字）と有効なショット数を入力してください。合計48以下です。" },
  ko: { storyboardTitle: "스토리 자동 스토리보드", storyboardStory: "스토리 텍스트", storyboardPlaceholder: "인물, 줄거리와 결말을 포함한 전체 스토리(최대 30,000자)를 입력하세요.", storyboardHint: "로컬 텍스트 모델이 편집 가능한 샷을 추가합니다. 영상 생성은 자동 시작하지 않습니다.", storyboardCount: "새 샷 수", storyboardGenerate: "샷 생성 및 추가", storyboardGenerating: "스토리 분석 및 샷 생성 중…", storyboardAdded: "샷이 추가되었습니다. 검토 후 저장하세요.", storyboardInvalid: "스토리(최대 30,000자)와 올바른 샷 수를 입력하세요. 총 48개 이하입니다." },
  es: { storyboardTitle: "Storyboard automático", storyboardStory: "Texto de la historia", storyboardPlaceholder: "Pega la historia completa (máximo 30.000 caracteres), con personajes, trama y final.", storyboardHint: "El modelo local añade planos editables sin iniciar la generación de vídeo.", storyboardCount: "Número de planos nuevos", storyboardGenerate: "Generar y añadir planos", storyboardGenerating: "Analizando la historia y creando planos…", storyboardAdded: "Planos añadidos. Revisa y guarda el storyboard.", storyboardInvalid: "Introduce una historia (máximo 30.000 caracteres) y una cantidad válida; máximo 48 planos en total." },
  pt: { storyboardTitle: "Storyboard automático", storyboardStory: "Texto da história", storyboardPlaceholder: "Cole a história completa (até 30.000 caracteres), com personagens, enredo e final.", storyboardHint: "O modelo local adiciona cenas editáveis sem iniciar a geração de vídeo.", storyboardCount: "Número de novas cenas", storyboardGenerate: "Gerar e adicionar cenas", storyboardGenerating: "Analisando a história e criando cenas…", storyboardAdded: "Cenas adicionadas. Revise e salve o storyboard.", storyboardInvalid: "Insira uma história (até 30.000 caracteres) e uma quantidade válida; máximo de 48 cenas no total." },
  tr: { storyboardTitle: "Otomatik hikâye panosu", storyboardStory: "Hikâye metni", storyboardPlaceholder: "Karakterler, olay örgüsü ve sonuyla tam hikâyeyi yapıştırın (en fazla 30.000 karakter).", storyboardHint: "Yerel metin modeli düzenlenebilir sahneler ekler; video üretimi otomatik başlamaz.", storyboardCount: "Yeni sahne sayısı", storyboardGenerate: "Sahneleri oluştur ve ekle", storyboardGenerating: "Hikâye analiz ediliyor ve sahneler planlanıyor…", storyboardAdded: "Sahneler eklendi. Panoyu inceleyip kaydedin.", storyboardInvalid: "Hikâye (en fazla 30.000 karakter) ve geçerli sayı girin; toplam en fazla 48 sahne." },
  ar: { storyboardTitle: "تقسيم القصة تلقائيًا", storyboardStory: "نص القصة", storyboardPlaceholder: "ألصق القصة كاملة مع الشخصيات والحبكة والنهاية (حتى 30,000 حرف).", storyboardHint: "يضيف النموذج المحلي لقطات قابلة للتحرير دون بدء إنشاء الفيديو تلقائيًا.", storyboardCount: "عدد اللقطات الجديدة", storyboardGenerate: "إنشاء اللقطات وإضافتها", storyboardGenerating: "جارٍ تحليل القصة وتخطيط اللقطات…", storyboardAdded: "أُضيفت اللقطات. راجع المخطط واحفظه.", storyboardInvalid: "أدخل قصة (حتى 30,000 حرف) وعددًا صحيحًا؛ الحد الإجمالي 48 لقطة." },
  vi: { storyboardTitle: "Phân cảnh tự động", storyboardStory: "Văn bản câu chuyện", storyboardPlaceholder: "Dán toàn bộ câu chuyện (tối đa 30.000 ký tự), gồm nhân vật, cốt truyện và kết thúc.", storyboardHint: "Mô hình cục bộ thêm các cảnh có thể chỉnh sửa; không tự bắt đầu tạo video.", storyboardCount: "Số cảnh mới", storyboardGenerate: "Tạo và thêm cảnh", storyboardGenerating: "Đang phân tích câu chuyện và tạo cảnh…", storyboardAdded: "Đã thêm cảnh. Hãy kiểm tra và lưu.", storyboardInvalid: "Nhập câu chuyện (tối đa 30.000 ký tự) và số cảnh hợp lệ; tổng không quá 48." },
  id: { storyboardTitle: "Storyboard otomatis", storyboardStory: "Teks cerita", storyboardPlaceholder: "Tempel cerita lengkap (maksimal 30.000 karakter), termasuk tokoh, alur dan akhir.", storyboardHint: "Model lokal menambahkan adegan yang dapat diedit tanpa memulai generasi video otomatis.", storyboardCount: "Jumlah adegan baru", storyboardGenerate: "Buat dan tambahkan adegan", storyboardGenerating: "Menganalisis cerita dan membuat adegan…", storyboardAdded: "Adegan ditambahkan. Tinjau dan simpan storyboard.", storyboardInvalid: "Masukkan cerita (maksimal 30.000 karakter) dan jumlah yang valid; total maksimal 48 adegan." },
  ru: { storyboardTitle: "Автоматическая раскадровка", storyboardStory: "Текст истории", storyboardPlaceholder: "Вставьте всю историю (до 30 000 символов), включая героев, сюжет и концовку.", storyboardHint: "Локальная модель добавляет редактируемые кадры, не запуская генерацию видео.", storyboardCount: "Число новых кадров", storyboardGenerate: "Создать и добавить кадры", storyboardGenerating: "Анализ истории и создание кадров…", storyboardAdded: "Кадры добавлены. Проверьте и сохраните раскадровку.", storyboardInvalid: "Введите историю (до 30 000 символов) и допустимое число кадров; максимум 48 в сумме." },
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
const settingsDialog = document.querySelector("#settings-dialog");
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
const workflowMusicSource = document.querySelector("#workflow-music-source");
const workflowBurnLyrics = document.querySelector("#workflow-burn-lyrics");
const workflowBurnLyricsWrapper = document.querySelector("#workflow-burn-lyrics-wrapper");
const workflowList = document.querySelector("#workflow-list");
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
const videoControls = document.querySelector("#video-controls");
const imageControls = document.querySelector("#image-controls");
const musicControls = document.querySelector("#music-controls");
const musicLyricsMode = document.querySelector("#music-lyrics-mode");
const musicLyricsField = document.querySelector("#music-lyrics-field");
const musicLyricsInput = document.querySelector("#music-lyrics");
const musicModelTitle = document.querySelector("#music-model-title");
const musicModelDescription = document.querySelector("#music-model-description");
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
const jobMetrics = document.querySelector("#job-metrics");
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
let activeMode = ["image", "music", "workflow"].includes(localStorage.getItem("h3-mode"))
  ? localStorage.getItem("h3-mode")
  : "video";
let pollTimer = null;
let modelPollTimer = null;
let currentWorkflow = null;
let workflowPollTimer = null;
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
  const modelSettingsKey = modelSettingsKeys.indexOf(key);
  if (modelSettingsKey !== -1) return (modelSettingsTranslations[lang] || modelSettingsTranslations.en)[modelSettingsKey];
  const downloadKey = downloadStatusKeys.indexOf(key);
  if (downloadKey !== -1) return (downloadStatusTranslations[lang] || downloadStatusTranslations.en)[downloadKey];
  if (key === "downloadSpeed") return downloadSpeedTranslations[lang] || downloadSpeedTranslations.en;
  const controlKey = downloadControlKeys.indexOf(key);
  if (controlKey !== -1) return (downloadControlTranslations[lang] || downloadControlTranslations.en)[controlKey];
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
  document.querySelectorAll("option[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelector(".language-picker select").setAttribute("aria-label", t("language"));
  document.querySelector("#theme").setAttribute("aria-label", t("theme"));
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
  refreshWorkflowFirstFrames();
  refreshWorkflowMusicSources();
}

function showSettingsStatus(message, isError = false) {
  settingsStatus.textContent = message;
  settingsStatus.hidden = !message;
  settingsStatus.classList.toggle("error", isError);
}

function populateSettings(settings) {
  document.querySelector("#settings-output-directory").value = settings.output_directory;
  document.querySelector("#settings-gemma-path").value = settings.gemma_path;
  const container = document.querySelector("#settings-model-options");
  const h3Service = document.querySelector("#settings-h3-service");
  const hidreamNotice = document.querySelector("#settings-hidream-notice");
  const music3Notice = document.querySelector("#settings-music3-notice");
  container.replaceChildren();
  for (const [id, entry] of Object.entries(settings.models)) {
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
    container.append(group);
    renderModelDownload(modelInfo?.downloads?.[id] || {}, progress.id);
  }
  document.querySelector("#settings-video-url").value = settings.video.service_url;
  document.querySelector("#settings-video-model").value = settings.video.model_id;
  document.querySelector("#settings-video-params").value = JSON.stringify(settings.video.api_params, null, 2);
  document.querySelector("#settings-text-url").value = settings.text.service_url;
  document.querySelector("#settings-text-models").value = settings.text.model_ids.join("\n");
  document.querySelector("#settings-text-params").value = JSON.stringify(settings.text.api_params, null, 2);
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
  settingsDialog.showModal();
  showSettingsStatus("");
  try {
    const response = await fetch("/api/settings", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || "settings_unavailable");
    populateSettings(data.settings);
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
    await Promise.all([loadModels(), loadTextModels(), loadHistory(), loadWorkflows()]);
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
  const isVideo = !isImage && !isMusic && !isWorkflow;
  const modeKey = isMusic ? "music" : isImage ? "image" : "video";
  const modeTextKey = (key) => {
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
  const emptyTextKey = isVideoPreview ? "previewEmpty" : `${modeKey}Empty`;
  const emptyHintTextKey = isVideoPreview ? "previewEmptyHint" : `${modeKey}EmptyHint`;
  videoModeButton.classList.toggle("active", isVideo);
  imageModeButton.classList.toggle("active", isImage);
  musicModeButton.classList.toggle("active", isMusic);
  workflowModeButton.classList.toggle("active", isWorkflow);
  videoModeButton.setAttribute("aria-pressed", String(isVideo));
  imageModeButton.setAttribute("aria-pressed", String(isImage));
  musicModeButton.setAttribute("aria-pressed", String(isMusic));
  workflowModeButton.setAttribute("aria-pressed", String(isWorkflow));
  videoModelSection.hidden = !isVideo && !isWorkflow;
  imageModelSection.hidden = !isImage;
  musicModelSection.hidden = !isMusic && !isWorkflow;
  videoControls.hidden = !isVideo;
  imageControls.hidden = !isImage;
  musicControls.hidden = !isMusic;
  form.hidden = isWorkflow;
  workflowPanel.hidden = !isWorkflow;
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
  renderMusicKeywords();
  updateLocalModelControls();
  updateGenerateAvailability();
}

function updateLocalModelControls() {
  const ltx = videoModelChoice.value !== "h3";
  const localImage = imageModelChoice.value !== "hidream";
  stepsSelect.closest(".field").hidden = ltx;
  turboToggle.closest("label").hidden = ltx;
  document.querySelector("#local-image-size").hidden = !localImage;
  const videoNote = document.querySelector("#video-compute-copy");
  videoNote.dataset.i18n = ltx ? "distilledNote" : "computeNote";
  videoNote.textContent = t(videoNote.dataset.i18n);
  const imageNote = document.querySelector("#image-compute-copy");
  imageNote.dataset.i18n = localImage ? "localImageNote" : "imageComputeNote";
  imageNote.textContent = t(imageNote.dataset.i18n);
  const yue = isYueMusicModel();
  document.querySelector("#music-duration").closest(".field").hidden = yue;
  document.querySelector("#music-steps").closest(".field").hidden = yue;
  const musicNote = document.querySelector("#music-compute-copy");
  musicNote.dataset.i18n = yue ? "musicYueNote" : "musicComputeNote";
  musicNote.textContent = t(musicNote.dataset.i18n);
  updateSelectedModelCards();
}

function updateSelectedModelCards() {
  for (const [mode, selector, status] of [
    ["video", videoModelChoice, videoModelChoice.value === "h3" ? modelInfo :
      modelInfo?.video_models?.[videoModelChoice.value]],
    ["image", imageModelChoice, imageModelChoice.value === "hidream" ? modelInfo?.hidream :
      modelInfo?.image_models?.[imageModelChoice.value]],
    ["music", musicModelChoice, selectedMusicStatus()]
  ]) {
    const entry = modelInfo?.model_options?.[mode]?.find(item => item.id === selector.value);
    const name = entry?.name || selector.selectedOptions?.[0]?.textContent || selector.value;
    const cards = mode === "image" ? [mode] : [mode, `workflow-${mode}`];
    for (const card of cards) {
      document.querySelector(`#${card}-model-summary`).textContent = `${t("modelSettings")} · ${name}`;
      document.querySelector(`#${card === "video" ? "model" : `${card}-model`}-path`).textContent =
        `${t("modelPath")}${status?.model_path || ""}`;
      const source = document.querySelector(`#${card}-model-source`);
      source.hidden = !status?.model_download_url;
      source.textContent = `${name} ↗`;
      if (status?.model_download_url) source.href = status.model_download_url;
      else source.removeAttribute("href");
    }
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
  const busy = workflowBusy || ["queued", "loading", "running", "cancelling"].includes(currentJob?.status);
  workflowPlanStory.disabled = storyboardBusy || busy || promptEnhancementBusy ||
    !textModelsAvailable || !workflowTextModel.value ||
    Boolean(currentWorkflow && currentWorkflow.status !== "draft");
  const imageStatus = imageModelChoice.value === "hidream" ? modelInfo?.hidream :
    modelInfo?.image_models?.[imageModelChoice.value];
  const videoStatus = modelInfo?.video_models?.[videoModelChoice.value];
  const ready = activeMode === "image"
    ? imageStatus?.model_ready && imageStatus?.runtime_ready
    : activeMode === "music"
      ? selectedMusicStatus()?.model_ready && selectedMusicStatus()?.runtime_ready
      : videoModelChoice.value === "h3" ? modelInfo?.model_loaded :
        videoStatus?.model_ready && videoStatus?.runtime_ready;
  videoModelChoice.disabled = busy || (activeMode === "workflow" && Boolean(currentWorkflow) && currentWorkflow.status !== "draft");
  imageModelChoice.disabled = busy;
  musicModelChoice.disabled = busy;
  const selectedMode = activeMode === "image" ? "image" : activeMode === "music" ? "music" : "video";
  const selectedId = activeMode === "image" ? imageModelChoice.value :
    activeMode === "music" ? musicModelChoice.value : videoModelChoice.value;
  const disabledModel = modelInfo?.model_options?.[selectedMode] &&
    !modelInfo.model_options[selectedMode]?.some(entry => entry.id === selectedId && entry.enabled);
  generateButton.disabled = busy || firstFrameBusy || storyboardBusy || promptEnhancementBusy || !ready || disabledModel;
  document.querySelector("#video-first-frame").querySelectorAll("select, input").forEach(control => {
    control.disabled = busy || firstFrameBusy || storyboardBusy || promptEnhancementBusy;
  });
  enhancePromptButton.disabled = busy || storyboardBusy || promptEnhancementBusy || !textModelsAvailable ||
    !promptEnhancerModel.value;
  document.querySelectorAll("[data-music-keyword]").forEach(button => {
    button.disabled = busy || firstFrameBusy || storyboardBusy || promptEnhancementBusy;
  });
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
  container.hidden = !info.download_state;
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

function populateModelSelectors(options) {
  if (!options) return;
  for (const [mode, selector] of [["video", videoModelChoice], ["image", imageModelChoice], ["music", musicModelChoice]]) {
    const entries = options[mode] || [];
    const selected = selector.value;
    const signature = JSON.stringify(entries.map(({id, name, enabled}) => ({id, name, enabled})));
    if (selector.dataset.optionsSignature === signature) continue;
    selector.replaceChildren();
    for (const entry of entries) {
      const option = new Option(entry.name, entry.id);
      option.disabled = !entry.enabled;
      selector.add(option);
    }
    selector.value = entries.some(entry => entry.id === selected) ? selected :
      entries.find(entry => entry.enabled)?.id || "";
    selector.dataset.optionsSignature = signature;
  }
  updateLocalModelControls();
}

function renderModelInfo(info) {
  modelInfo = info;
  for (const [id, progress] of Object.entries(info.downloads || {})) {
    renderModelDownload(progress, `settings-download-${id}`);
  }
  populateModelSelectors(info.model_options);
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
    modelDescription.textContent = selected.model_path || "";
    modelNotice.classList.toggle("ready", Boolean(selected.model_ready && selected.runtime_ready));
    if (modelPath) modelPath.textContent = `${t("modelPath")}${selected.model_path || ""}`;
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
  if (info.model_options?.video.find(entry => entry.id === videoModelChoice.value)?.enabled === false) {
    modelTitle.textContent = t("errModelDisabled");
    modelNotice.classList.remove("ready");
    loadModelButton.hidden = true;
  }
  updateGenerateAvailability();
}

function renderImageModelInfo(info) {
  imageModelLinks.replaceChildren();
  imageModelPath.textContent = `${t("modelPath")}${info.model_path || ""}`;
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
  musicModelPath.textContent = `${t("modelPath")}${info.model_path || ""}`;
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

function formatGenerationMetrics(item) {
  const seconds = Number(item?.elapsed_seconds);
  const tokens = Number(item?.tokens);
  const number = new Intl.NumberFormat(languageSelect.value);
  const elapsed = Number.isFinite(seconds) && item?.elapsed_seconds !== null
    ? `${number.format(Math.round(seconds * 10) / 10)}s` : "—";
  const tokenText = Number.isInteger(tokens) && item?.tokens !== null ? number.format(tokens) : "—";
  return `${t("metricElapsed")} ${elapsed} · ${t("metricTokens")} ${tokenText}`;
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
  const hasMetrics = Number.isFinite(Number(job.elapsed_seconds)) && job.elapsed_seconds !== null;
  logPanel.hidden = !job.logs?.length && !job.error && !hasMetrics;
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
      restoreHistoryControl("#image-size", settings.width || 1024);
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
  const items = historyItems.filter((item) => historyFilter === "all" || item.kind === historyFilter);
  historyCount.textContent = `${items.length} ${t("historyCount")}`;
  historyList.replaceChildren();
  historyStatus.hidden = items.length > 0;
  historyStatus.textContent = items.length ? "" : t("historyEmpty");
  for (const item of items) {
    const row = document.createElement("div");
    row.className = "history-row";
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
    const metrics = document.createElement("span");
    metrics.className = "history-metrics";
    metrics.textContent = formatGenerationMetrics(item);
    type.append(typeLabel, metrics, date);
    const prompt = document.createElement("span");
    prompt.className = "history-prompt";
    prompt.textContent = item.prompt || t("historyNoPrompt");
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
    button.addEventListener("click", () => restoreHistoryItem(item));
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "history-delete";
    deleteButton.textContent = "❌";
    deleteButton.title = t("historyDelete");
    deleteButton.setAttribute("aria-label", `${t("historyDelete")} · ${item.name || item.prompt || t("historyNoPrompt")}`);
    deleteButton.disabled = historyDeleteBusy;
    deleteButton.addEventListener("click", () => deleteHistoryItem(item));
    row.append(button, deleteButton);
    historyList.append(row);
  }
}

async function deleteHistoryItem(item) {
  if (historyDeleteBusy) return;
  if (firstFrameBusy || ["queued", "loading", "running", "cancelling"].includes(currentJob?.status) ||
      ["queued", "running"].includes(currentWorkflow?.status)) {
    window.alert(t("errRunning"));
    return;
  }
  if (!window.confirm(t("historyDeleteConfirm"))) return;
  historyDeleteBusy = true;
  renderHistory();
  historyStatus.hidden = false;
  historyStatus.textContent = t("historyDeleting");
  try {
    const response = await fetch(`/api/history/${item.id}`, {method: "DELETE"});
    const data = await response.json();
    if (!response.ok) throw new Error(
      data.error === "history_in_use" ? t("historyInUse") : data.detail || data.error || t("historyDeleteError"));
    if (currentJob?.id === item.id) {
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
    const frame = document.querySelector("#video-first-frame");
    if (frame.dataset.firstFrameId === item.id) {
      frame.dataset.firstFrameId = "";
      frame.dataset.savedFirstFrameId = "";
      frame.dataset.firstFrameUrl = "";
    }
    document.querySelector("#history-restore-status").hidden = true;
    await loadHistory();
    historyStatus.hidden = false;
    historyStatus.textContent = t("historyDeleted");
  } catch (error) {
    await loadHistory();
    historyStatus.hidden = false;
    historyStatus.textContent = `${t("historyDeleteError")} ${error.message}`;
  } finally {
    historyDeleteBusy = false;
    historyList.querySelectorAll(".history-delete").forEach(button => { button.disabled = false; });
  }
}

async function loadHistory() {
  try {
    const response = await fetch("/api/history", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data.items)) throw new Error(data.error || "history_unavailable");
    historyItems = data.items;
    refreshWorkflowFirstFrames();
    refreshWorkflowMusicSources();
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
    local_model_not_ready: "localModelError", invalid_generation_model: "errInvalid",
    generation_model_disabled: "errModelDisabled",
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
    Boolean(currentWorkflow && currentWorkflow.status !== "draft");
  if ([...workflowTextModel.options].some((option) => option.value === selected)) {
    workflowTextModel.value = selected;
  } else {
    workflowTextModel.value = promptEnhancerModel.value;
  }
}

async function planWorkflowStory() {
  if (workflowPlanStory.disabled) return;
  const story = document.querySelector("#workflow-story").value.trim();
  const count = Number(document.querySelector("#workflow-shot-count").value);
  const blankShots = [...workflowShots.children].filter((shot) =>
    !shot.querySelector("[data-shot-title]").value.trim() &&
    !shot.querySelector("[data-shot-prompt]").value.trim() &&
    !shot.querySelector("[data-shot-frame]")?.value
  );
  const existingCount = workflowShots.children.length - blankShots.length;
  if (!story || story.length > 30000 || !Number.isInteger(count) ||
    count < 1 || count + existingCount > 48) {
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
  updateGenerateAvailability();
  try {
    const response = await fetch("/api/storyboards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ story, shot_count: count, model: workflowTextModel.value })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || t("enhanceFailed"));
    if (!Array.isArray(data.shots) || data.shots.length !== count ||
      data.shots.some((shot) => !shot ||
        [["title", 120], ["prompt", 4000], ["music_prompt", 4000]].some(([key, limit]) =>
          typeof shot[key] !== "string" || !shot[key].trim() || shot[key].length > limit
        ) || ![5, 8, 10, 15].includes(shot.duration))) {
      throw new Error(t("enhanceFailed"));
    }
    blankShots.forEach((shot) => shot.remove());
    data.shots.forEach((shot) => addWorkflowShot(shot));
    workflowStoryStatus.textContent = t("storyboardAdded");
  } catch (error) {
    workflowStoryStatus.textContent = `${t("enhanceFailed")} ${error.message}`;
    workflowStoryStatus.classList.add("error");
  } finally {
    storyboardBusy = false;
    controls.forEach((control, index) => { control.disabled = previousDisabled[index]; });
    updateWorkflowShotNumbers();
    workflowPlanStory.textContent = t("storyboardGenerate");
    updateGenerateAvailability();
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
      const item = document.createElement("li");
      item.textContent = keyword;
      promptEnhancerKeywords.append(item);
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

function updateWorkflowShotNumbers() {
  [...workflowShots.children].forEach((shot, index) => {
    const number = index + 1;
    shot.querySelector("[data-shot-number]").textContent = `${t("workflowShot")} ${number}`;
    const toggleButton = shot.querySelector(".workflow-toggle-shot");
    const expanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.textContent = expanded ? "−" : "+";
    toggleButton.setAttribute("aria-label", `${t(expanded ? "workflowCollapseShot" : "workflowExpandShot")} ${number}`);
    const removeButton = shot.querySelector(".workflow-remove-shot");
    removeButton.disabled = workflowShots.children.length <= 1;
    removeButton.setAttribute("aria-label", `${t("workflowRemoveShot")} ${number}`);
    const noneOption = shot.querySelector("[data-shot-frame] option[value='']");
    if (noneOption) noneOption.textContent = t(index > 0 ? "firstFrameChained" : "firstFrameNone");
  });
}

function addWorkflowShot(shot = {}) {
  if (workflowShots.children.length >= 48) {
    showWorkflowMessage(t("workflowTooManyShots"), true);
    return;
  }
  const fragment = workflowShotTemplate.content.cloneNode(true);
  const card = fragment.querySelector(".workflow-shot");
  const shotNumber = ++workflowShotSequence;
  for (const [fieldSelector, labelSelector, idSuffix] of [
    ["[data-shot-title]", "[data-shot-title-label]", "title"],
    ["[data-shot-prompt]", "[data-shot-prompt-label]", "prompt"],
    ["[data-shot-duration]", "[data-shot-duration-label]", "duration"],
    ["[data-shot-music-prompt]", "[data-shot-music-label]", "music"],
    ["[data-shot-frame]", "[data-shot-frame-label]", "frame"],
    ["[data-shot-upload]", "[data-shot-upload-label]", "upload"]
  ]) {
    const field = card.querySelector(fieldSelector);
    field.id = `workflow-shot-${idSuffix}-${shotNumber}`;
    card.querySelector(labelSelector).htmlFor = field.id;
  }
  card.querySelector("[data-shot-title]").value = shot.title || "";
  card.querySelector("[data-shot-prompt]").value = shot.prompt || "";
  card.querySelector("[data-shot-duration]").value = String(shot.duration || 5);
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
  card.querySelector(".workflow-remove-shot").addEventListener("click", () => {
    if (workflowShots.children.length > 1) card.remove();
    updateWorkflowShotNumbers();
  });
  workflowShots.append(fragment);
  updateWorkflowShotNumbers();
  updateWorkflowMusicPromptVisibility();
  applyLanguage();
}

function workflowMusicSourceItem(id) {
  return historyItems.find((item) => item.kind === "music" && item.id === id) || null;
}
function updateWorkflowMusicSourceVisibility() {
  const id = workflowMusicSource.value;
  workflowGlobalMusicPromptWrapper.hidden = Boolean(id);
  const item = id ? workflowMusicSourceItem(id) : null;
  workflowBurnLyricsWrapper.hidden = !(item?.generation?.lyrics_mode === "lyrics");
}
function refreshWorkflowMusicSources(selected = workflowMusicSource.value) {
  const options = [new Option(t("workflowMusicSourceNew"), "")];
  historyItems.filter((item) => item.kind === "music" && item.audio_url).forEach((item) => {
    const duration = item.generation?.duration ? ` · ${item.generation.duration}s` : "";
    const lyrics = item.generation?.lyrics_mode === "lyrics" ? " · ♪" : "";
    options.push(new Option(`${item.name || item.prompt?.slice(0, 60) || item.id.slice(0, 8)}${duration}${lyrics} · ${item.id.slice(0, 8)}`, item.id));
  });
  if (selected && !options.some((option) => option.value === selected)) {
    options.push(new Option(`${t("workflowMusicSource")} · ${selected.slice(0, 8)}`, selected));
  }
  workflowMusicSource.replaceChildren(...options);
  workflowMusicSource.value = selected || "";
  updateWorkflowMusicSourceVisibility();
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
    (!isVideo && currentWorkflow && currentWorkflow.status !== "draft")) return;
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
    const options = [new Option(t(index > 1 ? "firstFrameChained" : "firstFrameNone"), "")];
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
  return {
    name: document.querySelector("#workflow-name").value.trim() || "Untitled video",
    aspect: document.querySelector("#workflow-aspect").value,
    model: videoModelChoice.value,
    shots: [...workflowShots.children].map((shot) => ({
      title: shot.querySelector("[data-shot-title]").value.trim(),
      prompt: shot.querySelector("[data-shot-prompt]").value.trim(),
      music_prompt: shot.querySelector("[data-shot-music-prompt]").value.trim(),
      first_frame_id: shot.querySelector("[data-shot-frame]").value,
      duration: Number(shot.querySelector("[data-shot-duration]").value),
      steps: videoModelChoice.value === "h3" ? 4 : 8,
      seed: 0,
      turbo: true
    })),
    soundtrack: {
      mode: "music3",
      strategy: document.querySelector("#workflow-music").checked ? "per_shot" : "global",
      prompt: workflowGlobalMusicPrompt.value.trim(),
      lyrics_mode: "instrumental",
      lyrics: "[instrumental]",
      mix: document.querySelector("#workflow-audio-mix").value,
      ...(!document.querySelector("#workflow-music").checked && workflowMusicSource.value
        ? { music_source_id: workflowMusicSource.value, burn_lyrics: workflowBurnLyrics.checked }
        : {})
    }
  };
}

function setWorkflowForm(manifest) {
  videoModelChoice.value = manifest.model || "h3";
  updateLocalModelControls();
  if (modelInfo) renderModelInfo(modelInfo);
  document.querySelector("#workflow-name").value = manifest.name;
  document.querySelector("#workflow-aspect").value = manifest.aspect;
  workflowMusic.checked = manifest.soundtrack.mode === "music3" &&
    (manifest.soundtrack.strategy || "per_shot") === "per_shot";
  workflowGlobalMusicPrompt.value = manifest.soundtrack.prompt || DEFAULT_WORKFLOW_MUSIC_PROMPT;
  workflowBurnLyrics.checked = manifest.soundtrack.burn_lyrics !== false;
  refreshWorkflowMusicSources(manifest.soundtrack.music_source_id || "");
  document.querySelector("#workflow-audio-mix").value = manifest.soundtrack.mix;
  workflowShots.replaceChildren();
  manifest.shots.forEach((shot) => addWorkflowShot({
    ...shot,
    music_prompt: shot.music_prompt || manifest.soundtrack.prompt
  }));
  updateWorkflowShotNumbers();
}

function newWorkflow() {
  if (storyboardBusy) return;
  currentWorkflow = null;
  document.querySelector("#workflow-name").value = "";
  document.querySelector("#workflow-aspect").value = "16:9";
  document.querySelector("#workflow-music").checked = true;
  workflowGlobalMusicPrompt.value = DEFAULT_WORKFLOW_MUSIC_PROMPT;
  workflowBurnLyrics.checked = true;
  refreshWorkflowMusicSources("");
  document.querySelector("#workflow-audio-mix").value = "score";
  workflowShots.replaceChildren();
  addWorkflowShot();
  workflowStatus.textContent = t("workflowDraft");
  workflowStatus.className = "status-chip";
  workflowSaveButton.hidden = false;
  workflowStartButton.hidden = true;
  workflowResumeButton.hidden = true;
  workflowRestoreButton.hidden = true;
  workflowCancelButton.hidden = true;
  workflowPanel.querySelectorAll("input, textarea, select, .workflow-remove-shot").forEach((field) => {
    field.disabled = false;
  });
  updateWorkflowMusicPromptVisibility();
  document.querySelector("#workflow-progress").replaceChildren();
  showWorkflowMessage("");
  if (workflowPollTimer) window.clearTimeout(workflowPollTimer);
  updateGenerateAvailability();
}

function renderWorkflow(manifest) {
  currentWorkflow = manifest;
  [...workflowShots.children].forEach((card, index) => {
    const shot = manifest.shots[index];
    if (!shot) return;
    card.dataset.savedFirstFrameId = shot.first_frame_id || "";
    card.dataset.firstFrameUrl = shot.first_frame_url || "";
    updateWorkflowFirstFramePreview(card);
  });
  const statusKey = manifest.status === "draft" ? "Draft" :
    manifest.status[0].toUpperCase() + manifest.status.slice(1);
  workflowStatus.textContent = t(`workflowStatus${statusKey}`);
  workflowStatus.className = `status-chip ${
    ["queued", "running"].includes(manifest.status) ? "active" :
      manifest.status === "completed" ? "success" :
        ["failed", "interrupted"].includes(manifest.status) ? "error" : ""
  }`;
  const isDraft = manifest.status === "draft";
  const isActive = ["queued", "running"].includes(manifest.status);
  workflowSaveButton.hidden = !isDraft;
  workflowStartButton.hidden = !isDraft;
  workflowResumeButton.hidden = !["failed", "cancelled", "interrupted"].includes(manifest.status);
  workflowRestoreButton.hidden = !["completed", "failed", "cancelled", "interrupted"].includes(manifest.status);
  workflowCancelButton.hidden = !isActive;
  workflowSaveButton.textContent = t("workflowSave");
  workflowStartButton.textContent = t("workflowStart");
  workflowResumeButton.textContent = t("workflowResume");
  workflowCancelButton.textContent = t("workflowCancel");
  workflowPanel.querySelectorAll("input, textarea, select, .workflow-remove-shot").forEach((field) => {
    field.disabled = !isDraft;
  });
  workflowShots.querySelectorAll("[data-shot-music-prompt]").forEach((field) => {
    field.disabled = !isDraft;
  });
  updateWorkflowMusicPromptVisibility();
  const progress = document.querySelector("#workflow-progress");
  progress.replaceChildren();
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
    progress.append(row);
  }
  showWorkflowMessage(
    manifest.error ? `${t("workflowFailed")}${manifest.error}` : "",
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
    document.querySelector("#loading-copy").textContent = t("workflowNote");
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
    logPanel.hidden = !manifest.error;
    jobLogs.textContent = manifest.error || "";
  }
  updateGenerateAvailability();
}

async function loadWorkflows() {
  try {
    const response = await fetch("/api/workflows", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "workflow_list_failed");
    workflowList.replaceChildren();
    if (!data.items.length) {
      workflowList.textContent = t("workflowNoItems");
      return;
    }
    for (const item of data.items) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "workflow-list-item";
      const title = document.createElement("strong");
      title.textContent = item.name;
      const state = document.createElement("span");
      const statusKey = item.status === "draft" ? "Draft" :
        item.status[0].toUpperCase() + item.status.slice(1);
      state.textContent = t(`workflowStatus${statusKey}`);
      button.append(title, state);
      button.addEventListener("click", () => fetchWorkflow(item.id));
      workflowList.append(button);
    }
    const active = data.items.find((item) => ["queued", "running"].includes(item.status));
    if (active && !currentWorkflow) await fetchWorkflow(active.id);
  } catch (error) {
    workflowList.textContent = `${t("workflowServerError")} ${error.message}`;
  }
}

async function fetchWorkflow(workflowId) {
  if (storyboardBusy) return;
  try {
    const response = await fetch(`/api/workflows/${workflowId}`, { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "workflow_not_found");
    currentWorkflow = data.workflow;
    setWorkflowForm(currentWorkflow);
    renderWorkflow(currentWorkflow);
    if (["queued", "running"].includes(currentWorkflow.status)) {
      if (workflowPollTimer) window.clearTimeout(workflowPollTimer);
      workflowPollTimer = window.setTimeout(() => fetchWorkflow(workflowId), 2000);
    }
  } catch (error) {
    showWorkflowMessage(`${t("workflowServerError")} ${error.message}`, true);
  }
}

async function submitWorkflowAction(action, body = undefined) {
  if (storyboardBusy || firstFrameBusy) return;
  if (action === "save") {
    showWorkflowMessage(t("workflowSaving"));
    workflowSaveButton.disabled = true;
    try {
      const isUpdate = currentWorkflow?.status === "draft";
      const url = isUpdate ? `/api/workflows/${currentWorkflow.id}/update` : "/api/workflows";
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body || workflowPayload())
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "workflow_save_failed");
      renderWorkflow(data.workflow);
      await loadWorkflows();
    } catch (error) {
      showWorkflowMessage(workflowErrorMessage("save", error.message), true);
    } finally {
      workflowSaveButton.disabled = false;
    }
    return;
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
      if (workflowPollTimer) window.clearTimeout(workflowPollTimer);
      workflowPollTimer = window.setTimeout(() => fetchWorkflow(data.workflow.id), 1500);
    }
  } catch (error) {
    showWorkflowMessage(error.message, true);
  } finally {
    button.disabled = false;
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
document.querySelector("#workflow-add-shot").addEventListener("click", () => addWorkflowShot());
workflowPlanStory.addEventListener("click", planWorkflowStory);
workflowMusic.addEventListener("change", updateWorkflowMusicPromptVisibility);
workflowMusicSource.addEventListener("change", updateWorkflowMusicSourceVisibility);
workflowSaveButton.addEventListener("click", () => submitWorkflowAction("save"));
workflowStartButton.addEventListener("click", () => submitWorkflowAction("start"));
workflowResumeButton.addEventListener("click", () => submitWorkflowAction("resume"));
workflowCancelButton.addEventListener("click", () => submitWorkflowAction("cancel"));
document.querySelector("#workflow-refresh").addEventListener("click", loadWorkflows);
workflowRestoreButton.addEventListener("click", () => submitWorkflowAction("restore"));
document.querySelector("#workflow-new").addEventListener("click", newWorkflow);
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
  const keywords = [...promptEnhancerKeywords.querySelectorAll("li")]
    .map((item) => item.textContent.trim())
    .filter(Boolean);
  const keywordPrompt = keywords.length
    ? `${t("enhancerKeywordPrefix")} ${keywords.join(", ")}`
    : "";
  const combinedPrompt = [promptEnhancerOutput.value.trim(), keywordPrompt]
    .filter(Boolean)
    .join("\n\n");
  if (combinedPrompt.length > promptInput.maxLength) {
    setPromptEnhancerStatus("enhancerPromptTooLong");
    return;
  }
  promptInput.value = combinedPrompt;
  document.querySelector("#prompt-count").textContent = `${promptInput.value.length} / 4000`;
  setPromptEnhancerStatus("enhancerApplied");
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
  if (promptEnhancementBusy || firstFrameBusy || storyboardBusy) return;
  const isImage = activeMode === "image";
  const isMusic = activeMode === "music";
  const payload = isImage
    ? {
      prompt: promptInput.value, name: projectNameInput.value.trim(), seed: Number(document.querySelector("#image-seed").value),
      model: imageModelChoice.value,
      width: Number(document.querySelector("#image-size").value),
      height: Number(document.querySelector("#image-size").value)
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
      duration: Number(document.querySelector("#duration").value),
      aspect: document.querySelector("#aspect").value,
      steps: videoModelChoice.value === "h3" ? Number(document.querySelector("#steps").value) : 8,
      seed: Number(document.querySelector("#seed").value),
      turbo: videoModelChoice.value === "h3" ? document.querySelector("#turbo").checked : true,
      first_frame_id: videoFirstFrame.querySelector("[data-shot-frame]").value
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
loadWorkflows();
refreshCurrentJob();
