// Local AI assistant drawer: chat with the configured text model and confirm writes.
(() => {
  "use strict";

  const keys = ["button", "kicker", "title", "privacy", "model", "empty", "you", "assistant",
    "tool", "thinking", "send", "approve", "cancel", "confirmTitle", "placeholder",
    "noModel", "failed", "cancelled", "done", "close", "logTitle", "logEmpty",
    "logSubmitted", "logProcessing", "logAwaitingConfirmation", "logApproved",
    "logCancelled", "logCompleted", "logFailed", "logToolCall", "conversation",
    "logHide", "logShow", "logResize"];

  const messages = {
    en: ["AI assistant", "LOCAL AI ASSISTANT", "AI assistant",
      "Uses only the local text model; settings, prompt and Skill changes ask for your confirmation first.",
      "Text model", "Describe what you want to change, e.g. \"make the video prompt more cinematic\".",
      "You", "Assistant", "Tool", "Working…", "Send", "Confirm", "Cancel",
      "About to perform", "e.g. make the video prompt more cinematic, or install a preset from this GitHub link…",
      "No local text model detected. Start the text service in settings first.",
      "Request failed", "Operation cancelled.", "Operation completed.", "Close",
      "Run log", "Assistant activity will appear here.", "Request submitted",
      "Processing with the local model", "Waiting for your confirmation",
      "Confirmed; running operation", "Operation cancelled", "Run completed",
      "Run failed", "Tool call", "AI assistant conversation",
      "Hide run log", "Show run log", "Resize run log panel"],
    "zh-CN": ["AI 助手", "本地 AI 助手", "AI 助手",
      "仅使用本机文本模型；设置、提示词与 Skill 变更会先请求你确认。",
      "文本模型", "向助手描述你想调整的设置，例如「把视频提示词改得更电影感」。",
      "你", "助手", "工具", "正在处理…", "发送", "确认执行", "取消",
      "即将执行以下操作", "例如：把视频提示词改得更电影感，或根据这个 GitHub 链接安装创作预设…",
      "未检测到本机文本模型，请先在设置中启动文本服务。",
      "请求失败", "已取消该操作。", "操作已完成。", "关闭",
      "运行日志", "助手运行记录会显示在这里。", "已提交请求",
      "正在使用本地模型处理", "等待你确认", "已确认，正在执行操作",
      "已取消操作", "运行完成", "运行失败", "调用工具", "AI 助手对话",
      "隐藏运行日志", "显示运行日志", "调整运行日志宽度"],
    "zh-TW": ["AI 助理", "本機 AI 助理", "AI 助理",
      "僅使用本機文字模型；設定、提示詞與 Skill 變更會先請你確認。",
      "文字模型", "向助理描述你想調整的設定，例如「把影片提示詞改得更電影感」。",
      "你", "助理", "工具", "正在處理…", "傳送", "確認執行", "取消",
      "即將執行以下操作", "例如：把影片提示詞改得更電影感，或依這個 GitHub 連結安裝創作預設…",
      "未偵測到本機文字模型，請先在設定中啟動文字服務。",
      "請求失敗", "已取消該操作。", "操作已完成。", "關閉",
      "執行記錄", "助理執行記錄會顯示在這裡。", "已送出請求",
      "正在使用本機模型處理", "等待你確認", "已確認，正在執行操作",
      "已取消操作", "執行完成", "執行失敗", "呼叫工具", "AI 助理對話",
      "隱藏執行記錄", "顯示執行記錄", "調整執行記錄寬度"],
    fr: ["Assistant IA", "ASSISTANT IA LOCAL", "Assistant IA",
      "Utilise uniquement le modèle de texte local ; les modifications de réglages, de prompts et de Skills demandent d’abord votre confirmation.",
      "Modèle de texte", "Décrivez ce que vous voulez modifier, par ex. « rendre le prompt vidéo plus cinématographique ».",
      "Vous", "Assistant", "Outil", "En cours…", "Envoyer", "Confirmer", "Annuler",
      "Action sur le point d’être effectuée", "par ex. rendre le prompt vidéo plus cinématographique, ou installer un preset depuis ce lien GitHub…",
      "Aucun modèle de texte local détecté. Démarrez d’abord le service de texte dans les réglages.",
      "Échec de la requête", "Opération annulée.", "Opération terminée.", "Fermer",
      "Journal d’exécution", "L’activité de l’assistant apparaîtra ici.", "Requête envoyée",
      "Traitement avec le modèle local", "En attente de votre confirmation",
      "Confirmé ; exécution en cours", "Opération annulée", "Exécution terminée",
      "Échec de l’exécution", "Appel d’outil", "Conversation avec l’assistant IA",
      "Masquer le journal", "Afficher le journal", "Redimensionner le panneau du journal"],
    de: ["KI-Assistent", "LOKALER KI-ASSISTENT", "KI-Assistent",
      "Nutzt nur das lokale Textmodell; Änderungen an Einstellungen, Prompts und Skills erfordern zuerst Ihre Bestätigung.",
      "Textmodell", "Beschreiben Sie, was geändert werden soll, z. B. „den Video-Prompt filmischer machen“.",
      "Sie", "Assistent", "Werkzeug", "Wird ausgeführt…", "Senden", "Bestätigen", "Abbrechen",
      "Folgende Aktion wird ausgeführt", "z. B. den Video-Prompt filmischer machen oder ein Preset über diesen GitHub-Link installieren…",
      "Kein lokales Textmodell gefunden. Starten Sie zuerst den Textdienst in den Einstellungen.",
      "Anfrage fehlgeschlagen", "Vorgang abgebrochen.", "Vorgang abgeschlossen.", "Schließen",
      "Ausführungsprotokoll", "Aktivitäten des Assistenten erscheinen hier.", "Anfrage gesendet",
      "Verarbeitung mit lokalem Modell", "Wartet auf Ihre Bestätigung",
      "Bestätigt; Vorgang wird ausgeführt", "Vorgang abgebrochen", "Ausführung abgeschlossen",
      "Ausführung fehlgeschlagen", "Werkzeugaufruf", "KI-Assistenten-Unterhaltung",
      "Ausführungsprotokoll ausblenden", "Ausführungsprotokoll anzeigen", "Breite des Protokollbereichs ändern"],
    ja: ["AI アシスタント", "ローカル AI アシスタント", "AI アシスタント",
      "ローカルのテキストモデルのみを使用します。設定・プロンプト・Skill の変更は先に確認を求めます。",
      "テキストモデル", "変更したい内容を入力してください。例：「動画プロンプトをより映画的に」。",
      "あなた", "アシスタント", "ツール", "処理中…", "送信", "実行を確認", "キャンセル",
      "次の操作を実行します", "例：動画プロンプトをより映画的にする、またはこの GitHub リンクからプリセットをインストール…",
      "ローカルのテキストモデルが見つかりません。設定でテキストサービスを起動してください。",
      "リクエストに失敗しました", "操作をキャンセルしました。", "操作が完了しました。", "閉じる",
      "実行ログ", "アシスタントの実行履歴がここに表示されます。", "リクエストを送信しました",
      "ローカルモデルで処理中", "確認を待っています", "確認済み・操作を実行中",
      "操作をキャンセルしました", "実行が完了しました", "実行に失敗しました", "ツール呼び出し", "AI アシスタントとの会話",
      "実行ログを隠す", "実行ログを表示", "実行ログパネルの幅を調整"],
    ko: ["AI 어시스턴트", "로컬 AI 어시스턴트", "AI 어시스턴트",
      "로컬 텍스트 모델만 사용합니다. 설정·프롬프트·Skill 변경은 먼저 확인을 요청합니다.",
      "텍스트 모델", "변경할 내용을 설명하세요. 예: \"영상 프롬프트를 더 영화처럼\".",
      "사용자", "어시스턴트", "도구", "처리 중…", "보내기", "실행 확인", "취소",
      "다음 작업을 실행합니다", "예: 영상 프롬프트를 더 영화처럼 만들기, 또는 이 GitHub 링크에서 프리셋 설치…",
      "로컬 텍스트 모델을 찾을 수 없습니다. 먼저 설정에서 텍스트 서비스를 시작하세요.",
      "요청 실패", "작업이 취소되었습니다.", "작업이 완료되었습니다.", "닫기",
      "실행 로그", "어시스턴트 실행 기록이 여기에 표시됩니다.", "요청 전송됨",
      "로컬 모델로 처리 중", "확인을 기다리는 중", "확인됨; 작업 실행 중",
      "작업 취소됨", "실행 완료", "실행 실패", "도구 호출", "AI 어시스턴트 대화",
      "실행 로그 숨기기", "실행 로그 표시", "실행 로그 패널 너비 조정"],
    es: ["Asistente de IA", "ASISTENTE DE IA LOCAL", "Asistente de IA",
      "Usa solo el modelo de texto local; los cambios de ajustes, prompts y Skills piden tu confirmación primero.",
      "Modelo de texto", "Describe qué quieres cambiar, p. ej. «hacer el prompt de vídeo más cinematográfico».",
      "Tú", "Asistente", "Herramienta", "Procesando…", "Enviar", "Confirmar", "Cancelar",
      "Se va a realizar", "p. ej. hacer el prompt de vídeo más cinematográfico, o instalar un preset desde este enlace de GitHub…",
      "No se detectó ningún modelo de texto local. Inicia primero el servicio de texto en los ajustes.",
      "Solicitud fallida", "Operación cancelada.", "Operación completada.", "Cerrar",
      "Registro de ejecución", "La actividad del asistente aparecerá aquí.", "Solicitud enviada",
      "Procesando con el modelo local", "Esperando tu confirmación",
      "Confirmado; ejecutando la operación", "Operación cancelada", "Ejecución completada",
      "Error en la ejecución", "Llamada a herramienta", "Conversación con el asistente de IA",
      "Ocultar registro", "Mostrar registro", "Cambiar el ancho del panel de registro"],
    pt: ["Assistente de IA", "ASSISTENTE DE IA LOCAL", "Assistente de IA",
      "Usa apenas o modelo de texto local; alterações de configurações, prompts e Skills pedem sua confirmação primeiro.",
      "Modelo de texto", "Descreva o que deseja alterar, p. ex. «deixar o prompt de vídeo mais cinematográfico».",
      "Você", "Assistente", "Ferramenta", "Processando…", "Enviar", "Confirmar", "Cancelar",
      "Prestes a executar", "p. ex. deixar o prompt de vídeo mais cinematográfico, ou instalar um preset deste link do GitHub…",
      "Nenhum modelo de texto local detectado. Inicie primeiro o serviço de texto nas configurações.",
      "Falha na solicitação", "Operação cancelada.", "Operação concluída.", "Fechar",
      "Registro de execução", "A atividade do assistente aparecerá aqui.", "Solicitação enviada",
      "Processando com o modelo local", "Aguardando sua confirmação",
      "Confirmado; executando operação", "Operação cancelada", "Execução concluída",
      "Falha na execução", "Chamada de ferramenta", "Conversa com o assistente de IA",
      "Ocultar registro", "Mostrar registro", "Redimensionar painel do registro"],
    tr: ["Yapay zekâ asistanı", "YEREL YAPAY ZEKÂ ASİSTANI", "Yapay zekâ asistanı",
      "Yalnızca yerel metin modelini kullanır; ayar, istem ve Skill değişiklikleri önce onayınızı ister.",
      "Metin modeli", "Ne değiştirmek istediğinizi yazın, örn. \"video istemini daha sinematik yap\".",
      "Siz", "Asistan", "Araç", "İşleniyor…", "Gönder", "Onayla", "İptal",
      "Şu işlem yapılacak", "örn. video istemini daha sinematik yapmak veya bu GitHub bağlantısından bir ön ayar kurmak…",
      "Yerel metin modeli bulunamadı. Önce ayarlardan metin hizmetini başlatın.",
      "İstek başarısız", "İşlem iptal edildi.", "İşlem tamamlandı.", "Kapat",
      "Çalışma günlüğü", "Asistan etkinliği burada görüntülenir.", "İstek gönderildi",
      "Yerel modelle işleniyor", "Onayınız bekleniyor", "Onaylandı; işlem yürütülüyor",
      "İşlem iptal edildi", "Çalışma tamamlandı", "Çalışma başarısız", "Araç çağrısı", "Yapay zekâ asistanı sohbeti",
      "Çalışma günlüğünü gizle", "Çalışma günlüğünü göster", "Günlük panelinin genişliğini ayarla"],
    ar: ["مساعد الذكاء الاصطناعي", "مساعد ذكاء اصطناعي محلي", "مساعد الذكاء الاصطناعي",
      "يستخدم نموذج النص المحلي فقط؛ تغييرات الإعدادات والمطالبات وSkill تطلب تأكيدك أولاً.",
      "نموذج النص", "صف ما تريد تغييره، مثل «اجعل مطالبة الفيديو أكثر سينمائية».",
      "أنت", "المساعد", "أداة", "جارٍ المعالجة…", "إرسال", "تأكيد", "إلغاء",
      "على وشك تنفيذ", "مثل: جعل مطالبة الفيديو أكثر سينمائية، أو تثبيت إعداد مسبق من رابط GitHub هذا…",
      "لم يتم العثور على نموذج نص محلي. ابدأ خدمة النص من الإعدادات أولاً.",
      "فشل الطلب", "تم إلغاء العملية.", "تمت العملية.", "إغلاق",
      "سجل التشغيل", "سيظهر نشاط المساعد هنا.", "تم إرسال الطلب",
      "جارٍ المعالجة باستخدام النموذج المحلي", "بانتظار تأكيدك",
      "تم التأكيد؛ جارٍ تنفيذ العملية", "تم إلغاء العملية", "اكتمل التشغيل",
      "فشل التشغيل", "استدعاء أداة", "محادثة مساعد الذكاء الاصطناعي",
      "إخفاء سجل التشغيل", "إظهار سجل التشغيل", "تغيير عرض لوحة سجل التشغيل"],
    vi: ["Trợ lý AI", "TRỢ LÝ AI CỤC BỘ", "Trợ lý AI",
      "Chỉ dùng mô hình văn bản cục bộ; thay đổi cài đặt, prompt và Skill sẽ hỏi xác nhận trước.",
      "Mô hình văn bản", "Mô tả điều bạn muốn thay đổi, ví dụ \"làm prompt video điện ảnh hơn\".",
      "Bạn", "Trợ lý", "Công cụ", "Đang xử lý…", "Gửi", "Xác nhận", "Hủy",
      "Sắp thực hiện", "ví dụ: làm prompt video điện ảnh hơn, hoặc cài preset từ liên kết GitHub này…",
      "Không tìm thấy mô hình văn bản cục bộ. Hãy khởi động dịch vụ văn bản trong cài đặt trước.",
      "Yêu cầu thất bại", "Đã hủy thao tác.", "Thao tác hoàn tất.", "Đóng",
      "Nhật ký chạy", "Hoạt động của trợ lý sẽ hiển thị ở đây.", "Đã gửi yêu cầu",
      "Đang xử lý bằng mô hình cục bộ", "Đang chờ bạn xác nhận",
      "Đã xác nhận; đang thực hiện thao tác", "Đã hủy thao tác", "Chạy hoàn tất",
      "Chạy thất bại", "Gọi công cụ", "Cuộc trò chuyện với trợ lý AI",
      "Ẩn nhật ký chạy", "Hiện nhật ký chạy", "Điều chỉnh độ rộng bảng nhật ký"],
    id: ["Asisten AI", "ASISTEN AI LOKAL", "Asisten AI",
      "Hanya memakai model teks lokal; perubahan pengaturan, prompt, dan Skill meminta konfirmasi Anda lebih dulu.",
      "Model teks", "Jelaskan apa yang ingin diubah, mis. \"buat prompt video lebih sinematik\".",
      "Anda", "Asisten", "Alat", "Memproses…", "Kirim", "Konfirmasi", "Batal",
      "Akan melakukan", "mis. membuat prompt video lebih sinematik, atau memasang preset dari tautan GitHub ini…",
      "Model teks lokal tidak ditemukan. Mulai layanan teks di pengaturan terlebih dahulu.",
      "Permintaan gagal", "Operasi dibatalkan.", "Operasi selesai.", "Tutup",
      "Log proses", "Aktivitas asisten akan muncul di sini.", "Permintaan dikirim",
      "Memproses dengan model lokal", "Menunggu konfirmasi Anda",
      "Dikonfirmasi; menjalankan operasi", "Operasi dibatalkan", "Proses selesai",
      "Proses gagal", "Pemanggilan alat", "Percakapan dengan asisten AI",
      "Sembunyikan log", "Tampilkan log", "Ubah lebar panel log"],
    ru: ["ИИ-ассистент", "ЛОКАЛЬНЫЙ ИИ-АССИСТЕНТ", "ИИ-ассистент",
      "Использует только локальную текстовую модель; изменения настроек, промптов и Skills сначала запрашивают подтверждение.",
      "Текстовая модель", "Опишите, что нужно изменить, напр. «сделать промпт видео более кинематографичным».",
      "Вы", "Ассистент", "Инструмент", "Обработка…", "Отправить", "Подтвердить", "Отмена",
      "Будет выполнено", "напр. сделать промпт видео более кинематографичным или установить пресет по этой ссылке GitHub…",
      "Локальная текстовая модель не найдена. Сначала запустите текстовую службу в настройках.",
      "Запрос не выполнен", "Операция отменена.", "Операция завершена.", "Закрыть",
      "Журнал выполнения", "Здесь будут отображаться действия ассистента.", "Запрос отправлен",
      "Обработка локальной моделью", "Ожидание подтверждения",
      "Подтверждено; операция выполняется", "Операция отменена", "Выполнение завершено",
      "Ошибка выполнения", "Вызов инструмента", "Диалог с ИИ-ассистентом",
      "Скрыть журнал", "Показать журнал", "Изменить ширину панели журнала"],
  };

  const language = () => window.MiniMuvMVHost?.state().language || document.documentElement.lang || "en";
  const text = (key) => {
    const table = messages[language()] || messages.en;
    const index = keys.indexOf(key);
    return index === -1 ? key : table[index];
  };

  const dialog = document.getElementById("assistant-dialog");
  const openButton = document.getElementById("assistant-open");
  const closeButton = document.getElementById("assistant-close");
  const modelSelect = document.getElementById("assistant-model");
  const messagesBox = document.getElementById("assistant-messages");
  const runLogList = document.getElementById("assistant-run-log-list");
  const form = document.getElementById("assistant-form");
  const input = document.getElementById("assistant-input");
  const sendButton = document.getElementById("assistant-send");
  const confirmBox = document.getElementById("assistant-confirm");
  const confirmBody = document.getElementById("assistant-confirm-body");
  const confirmApprove = document.getElementById("assistant-confirm-approve");
  const confirmCancel = document.getElementById("assistant-confirm-cancel");
  const workspace = document.querySelector(".assistant-workspace");
  const runLog = document.getElementById("assistant-run-log");
  const logToggle = document.getElementById("assistant-log-toggle");
  const logResizer = document.getElementById("assistant-log-resizer");
  if (!dialog || !openButton) return;

  const history = [];
  let pendingId = null;
  let busy = false;
  const savedLogWidth = Number.parseFloat(localStorage.getItem("minimuv-assistant-log-width"));
  let preferredLogWidth = Number.isFinite(savedLogWidth) ? savedLogWidth : 220;
  workspace.classList.toggle("log-hidden", localStorage.getItem("minimuv-assistant-log-hidden") === "true");
  workspace.style.setProperty("--assistant-log-width", `${Math.min(420, Math.max(108, preferredLogWidth))}px`);

  function logWidthLimits() {
    const compact = window.matchMedia("(max-width: 720px)").matches;
    const min = compact ? 108 : 150;
    const conversationMin = compact ? 160 : 220;
    const gapsAndHandle = compact ? 20 : 24;
    const max = Math.max(min, Math.min(420, workspace.clientWidth - conversationMin - gapsAndHandle));
    return { min, max };
  }

  function updateLogWidth(persist = false) {
    const { min, max } = logWidthLimits();
    const width = Math.round(Math.min(max, Math.max(min, preferredLogWidth)));
    workspace.style.setProperty("--assistant-log-width", `${width}px`);
    logResizer.setAttribute("aria-valuemin", String(min));
    logResizer.setAttribute("aria-valuemax", String(max));
    logResizer.setAttribute("aria-valuenow", String(width));
    if (persist) {
      preferredLogWidth = width;
      localStorage.setItem("minimuv-assistant-log-width", String(width));
    }
    return width;
  }

  function syncLogVisibility() {
    const hidden = workspace.classList.contains("log-hidden");
    logToggle.textContent = text(hidden ? "logShow" : "logHide");
    logToggle.setAttribute("aria-expanded", String(!hidden));
    runLog.setAttribute("aria-hidden", String(hidden));
    logResizer.setAttribute("aria-hidden", String(hidden));
    logResizer.tabIndex = hidden ? -1 : 0;
  }

  syncLogVisibility();

  function bubble(role, value) {
    const node = document.createElement("div");
    node.className = `assistant-msg ${role}`;
    node.textContent = value;
    messagesBox.appendChild(node);
    messagesBox.scrollTop = messagesBox.scrollHeight;
    return node;
  }

  function recordRunEvent(key, detail = "", kind = "") {
    const now = new Date();
    const item = document.createElement("li");
    item.className = `assistant-run-event${kind ? ` ${kind}` : ""}`;
    const time = document.createElement("time");
    time.dateTime = now.toISOString();
    time.textContent = now.toLocaleTimeString(language(), {
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
    const description = document.createElement("span");
    description.textContent = detail ? `${text(key)}: ${detail}` : text(key);
    item.append(time, description);
    runLogList.appendChild(item);
    while (runLogList.children.length > 100) runLogList.firstElementChild.remove();
    runLogList.scrollTop = runLogList.scrollHeight;
  }

  function setBusy(value) {
    busy = value;
    sendButton.disabled = value;
    input.disabled = value;
  }

  function describeCalls(calls, details = []) {
    const planned = details.map((item) => [
      `Creation plan: ${item.kind}`,
      JSON.stringify(item.parameters, null, 2),
      `Steps: ${(item.steps || []).join(" → ")}`,
    ].join("\n"));
    const actions = calls.map((call) => `${call.name}(${JSON.stringify(call.arguments)})`);
    return [...planned, ...actions].join("\n\n");
  }

  async function loadModels() {
    try {
      const response = await fetch("/api/assistant/models");
      const data = await response.json();
      if (!response.ok || !Array.isArray(data.models) || !data.models.length) {
        modelSelect.innerHTML = "";
        modelSelect.appendChild(new Option(text("noModel"), ""));
        return;
      }
      modelSelect.innerHTML = "";
      for (const model of data.models) {
        modelSelect.appendChild(new Option(model.name || model.id, model.id));
      }
    } catch (error) {
      modelSelect.innerHTML = "";
      modelSelect.appendChild(new Option(text("noModel"), ""));
    }
  }

  function handleResult(data) {
    if (data.status === "needs_confirmation") {
      for (const call of (Array.isArray(data.tool_calls) ? data.tool_calls : []).slice(0, 12)) {
        if (typeof call.name === "string") recordRunEvent("logToolCall", call.name, "tool");
      }
      recordRunEvent("logAwaitingConfirmation");
      if (data.content) {
        bubble("assistant", data.content);
        history.push({ role: "assistant", content: data.content });
      }
      pendingId = data.pending_id;
      confirmBody.textContent = describeCalls(data.tool_calls, data.confirmation_details);
      confirmBox.hidden = false;
      return;
    }
    if (data.status === "cancelled") {
      recordRunEvent("logCancelled");
      bubble("assistant", text("cancelled"));
      return;
    }
    if (data.status === "done") {
      recordRunEvent("logCompleted");
      bubble("assistant", data.content || text("done"));
      history.push({ role: "assistant", content: data.content || "" });
    }
  }

  async function post(path, payload) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || data.error || text("failed"));
    return data;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (busy) return;
    const value = input.value.trim();
    if (!value) return;
    const model = modelSelect.value;
    if (!model) {
      bubble("error", text("noModel"));
      recordRunEvent("logFailed", text("noModel"), "failed");
      return;
    }
    bubble("user", value);
    recordRunEvent("logSubmitted");
    history.push({ role: "user", content: value });
    input.value = "";
    confirmBox.hidden = true;
    pendingId = null;
    setBusy(true);
    const thinking = bubble("tool", text("thinking"));
    recordRunEvent("logProcessing");
    try {
      const data = await post("/api/assistant/chat", { model, messages: history, locale: language() });
      thinking.remove();
      handleResult(data);
    } catch (error) {
      thinking.remove();
      const message = String(error.message || error);
      bubble("error", message);
      recordRunEvent("logFailed", message.slice(0, 240), "failed");
    } finally {
      setBusy(false);
    }
  });

  confirmApprove.addEventListener("click", async () => {
    if (busy || !pendingId) return;
    const id = pendingId;
    pendingId = null;
    confirmBox.hidden = true;
    setBusy(true);
    const thinking = bubble("tool", text("thinking"));
    recordRunEvent("logApproved");
    recordRunEvent("logProcessing");
    try {
      const data = await post("/api/assistant/confirm", { pending_id: id, approved: true });
      thinking.remove();
      handleResult(data);
    } catch (error) {
      thinking.remove();
      const message = String(error.message || error);
      bubble("error", message);
      recordRunEvent("logFailed", message.slice(0, 240), "failed");
    } finally {
      setBusy(false);
    }
  });

  confirmCancel.addEventListener("click", async () => {
    if (!pendingId) return;
    const id = pendingId;
    pendingId = null;
    confirmBox.hidden = true;
    try {
      await post("/api/assistant/confirm", { pending_id: id, approved: false });
    } catch (error) {
      // Cancelling is best-effort; the pending entry expires with the process.
    }
    recordRunEvent("logCancelled");
    bubble("assistant", text("cancelled"));
  });

  openButton.addEventListener("click", () => {
    dialog.showModal();
    updateLogWidth();
    messagesBox.dataset.empty = text("empty");
    runLogList.dataset.empty = text("logEmpty");
    if (!modelSelect.options.length) loadModels();
    input.focus();
  });
  logToggle.addEventListener("click", () => {
    const hidden = workspace.classList.toggle("log-hidden");
    localStorage.setItem("minimuv-assistant-log-hidden", String(hidden));
    syncLogVisibility();
  });
  logResizer.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    logResizer.setPointerCapture(event.pointerId);
    const startX = event.clientX;
    const startWidth = updateLogWidth();
    const direction = window.getComputedStyle(workspace).direction;
    const sign = direction === "rtl" ? -1 : 1;
    const onMove = (moveEvent) => {
      if (!logResizer.hasPointerCapture(moveEvent.pointerId)) return;
      preferredLogWidth = startWidth + (moveEvent.clientX - startX) * sign;
      updateLogWidth();
    };
    const onUp = (upEvent) => {
      if (logResizer.hasPointerCapture(upEvent.pointerId)) {
        logResizer.releasePointerCapture(upEvent.pointerId);
      }
      updateLogWidth(true);
      logResizer.removeEventListener("pointermove", onMove);
      logResizer.removeEventListener("pointerup", onUp);
      logResizer.removeEventListener("pointercancel", onUp);
    };
    logResizer.addEventListener("pointermove", onMove);
    logResizer.addEventListener("pointerup", onUp);
    logResizer.addEventListener("pointercancel", onUp);
  });
  logResizer.addEventListener("keydown", (event) => {
    const { min, max } = logWidthLimits();
    const direction = window.getComputedStyle(workspace).direction === "rtl" ? -1 : 1;
    const step = event.shiftKey ? 32 : 8;
    let nextWidth;
    if (event.key === "Home") nextWidth = min;
    else if (event.key === "End") nextWidth = max;
    else if (event.key === "ArrowLeft") nextWidth = preferredLogWidth - step * direction;
    else if (event.key === "ArrowRight") nextWidth = preferredLogWidth + step * direction;
    else return;
    event.preventDefault();
    preferredLogWidth = Math.min(max, Math.max(min, nextWidth));
    updateLogWidth(true);
  });
  window.addEventListener("resize", () => {
    if (dialog.open && !workspace.classList.contains("log-hidden")) updateLogWidth();
  });
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    confirmBox.hidden = true;
    pendingId = null;
  });

  function localize() {
    document.querySelectorAll("[data-assistant-label]").forEach((node) => {
      node.textContent = text(node.dataset.assistantLabel);
    });
    document.querySelectorAll("[data-assistant-placeholder]").forEach((node) => {
      node.placeholder = text(node.dataset.assistantPlaceholder);
    });
    document.querySelectorAll("[data-assistant-aria]").forEach((node) => {
      node.setAttribute("aria-label", text(node.dataset.assistantAria));
    });
    syncLogVisibility();
    messagesBox.dataset.empty = text("empty");
    runLogList.dataset.empty = text("logEmpty");
    if (!modelSelect.options.length || modelSelect.value === "") {
      loadModels();
    }
  }

  window.MiniMuvAssistant = { localize, text };
  localize();
})();
