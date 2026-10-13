(() => {
  "use strict";
  const keys = ["heading", "note", "start", "end", "shotSeconds", "plan", "versions", "export", "run"];
  const messages = {
    en: ["Music-driven storyboard", "Save and analyze music first. Select video and text models above. Beat-bound cuts use 24 fps; generated audio is discarded. Review shots before rendering. Replanning creates a separate version.", "Music start (s)", "Music end (s)", "Target shot length (s)", "Plan storyboard", "Saved storyboard versions", "Export with original music", "Generate and export"],
    "zh-CN": ["音乐驱动分镜", "请先保存并分析音乐，在上方选择视频和文本模型。节拍切点使用24fps，舍弃镜头生成音轨。审阅分镜后再生成；重新规划创建独立版本。", "音乐开始（秒）", "音乐结束（秒）", "目标镜头长度（秒）", "规划分镜", "已保存分镜版本", "原音乐合成导出", "生成并导出"],
    "zh-TW": ["音樂驅動分鏡", "請先儲存並分析音樂，在上方選擇影片和文字模型。節拍切點使用24fps，捨棄鏡頭生成音軌。審閱後再生成；重新規劃建立獨立版本。", "音樂開始（秒）", "音樂結束（秒）", "目標鏡頭長度（秒）", "規劃分鏡", "已儲存分鏡版本", "原音樂合成匯出", "生成並匯出"],
    fr: ["Storyboard musical", "Enregistrez et analysez la musique, puis choisissez les modèles ci-dessus. Coupes à 24 fps, sans audio généré. Relisez avant le rendu. Une nouvelle planification crée une version séparée.", "Début musical (s)", "Fin musicale (s)", "Durée cible du plan (s)", "Planifier", "Versions enregistrées", "Exporter avec la musique originale", "Générer et exporter"],
    de: ["Musik-Storyboard", "Musik zuerst speichern und analysieren; Modelle oben wählen. Schnitte mit 24 fps, ohne generierten Ton. Vor dem Rendern prüfen. Neuplanung erstellt eine eigene Version.", "Musikstart (s)", "Musikende (s)", "Ziel-Szenenlänge (s)", "Storyboard planen", "Gespeicherte Versionen", "Mit Originalmusik exportieren", "Generieren und exportieren"],
    ja: ["音楽連動絵コンテ", "音楽を保存・解析し、上でモデルを選択してください。24fpsの拍境界で編集し、生成音声は使いません。生成前に確認してください。再計画は別バージョンです。", "音楽開始（秒）", "音楽終了（秒）", "目標ショット長（秒）", "絵コンテを計画", "保存済みバージョン", "元の音楽で書き出す", "生成して書き出す"],
    ko: ["음악 기반 스토리보드", "음악을 저장·분석한 후 위에서 모델을 선택하세요. 24fps 박자 컷을 사용하며 생성 오디오는 제외됩니다. 생성 전 검토하세요. 다시 계획하면 별도 버전이 생성됩니다.", "음악 시작(초)", "음악 끝(초)", "목표 샷 길이(초)", "스토리보드 계획", "저장된 버전", "원본 음악으로 내보내기", "생성 및 내보내기"],
    es: ["Storyboard musical", "Guarda y analiza la música y elige los modelos arriba. Cortes a 24 fps, sin audio generado. Revisa antes de generar. Replanificar crea otra versión.", "Inicio musical (s)", "Fin musical (s)", "Duración objetivo (s)", "Planificar", "Versiones guardadas", "Exportar con música original", "Generar y exportar"],
    pt: ["Storyboard musical", "Salve e analise a música e escolha os modelos acima. Cortes a 24 fps, sem áudio gerado. Revise antes de gerar. Replanejar cria outra versão.", "Início musical (s)", "Fim musical (s)", "Duração alvo (s)", "Planejar", "Versões salvas", "Exportar com música original", "Gerar e exportar"],
    tr: ["Müzik storyboard'u", "Önce müziği kaydedip analiz edin; modelleri yukarıdan seçin. 24 fps vuruş kesimleri kullanılır, üretilen ses atılır. Oluşturmadan önce inceleyin. Yeniden planlama ayrı sürüm oluşturur.", "Müzik başlangıcı (sn)", "Müzik sonu (sn)", "Hedef çekim süresi (sn)", "Storyboard planla", "Kayıtlı sürümler", "Orijinal müzikle dışa aktar", "Oluştur ve dışa aktar"],
    ar: ["لوحة مشاهد موسيقية", "احفظ الموسيقى وحللها ثم اختر النماذج أعلاه. القص عند الإيقاع بـ24 إطاراً/ثانية دون الصوت المولد. راجع قبل التوليد. إعادة التخطيط تنشئ نسخة مستقلة.", "بداية الموسيقى (ث)", "نهاية الموسيقى (ث)", "مدة اللقطة المستهدفة (ث)", "تخطيط المشاهد", "النسخ المحفوظة", "تصدير بالموسيقى الأصلية", "توليد وتصدير"],
    vi: ["Phân cảnh theo nhạc", "Lưu và phân tích nhạc, chọn mô hình ở trên. Cắt theo nhịp ở 24 fps, bỏ âm thanh được tạo. Xem lại trước khi tạo. Lập lại tạo phiên bản riêng.", "Bắt đầu nhạc (giây)", "Kết thúc nhạc (giây)", "Độ dài cảnh mục tiêu (giây)", "Lập phân cảnh", "Phiên bản đã lưu", "Xuất với nhạc gốc", "Tạo và xuất"],
    id: ["Storyboard musik", "Simpan dan analisis musik, lalu pilih model di atas. Potongan ketukan memakai 24 fps tanpa audio hasil generasi. Tinjau sebelum membuat. Perencanaan ulang membuat versi terpisah.", "Awal musik (dtk)", "Akhir musik (dtk)", "Target durasi adegan (dtk)", "Rencanakan storyboard", "Versi tersimpan", "Ekspor dengan musik asli", "Buat dan ekspor"],
    ru: ["Музыкальная раскадровка", "Сохраните и проанализируйте музыку, выберите модели выше. Склейки по ритму при 24 fps, без сгенерированного звука. Проверьте перед генерацией. Новый план создаёт отдельную версию.", "Начало музыки (с)", "Конец музыки (с)", "Целевая длина кадра (с)", "Планировать", "Сохранённые версии", "Экспорт с исходной музыкой", "Создать и экспортировать"],
  };
  const host = window.MiniMuvMVHost;
  const deleteKeys = ["button", "confirm", "done"];
  const deleteMessages = {
    en: ["Delete all shots", "Delete the selected storyboard version and all its shots? Unsaved edits will be discarded. Original music, the MV project and generated media will be kept. Plan a new storyboard to save again.", "Storyboard deleted. Plan a new storyboard to save again."],
    "zh-CN": ["删除所有分镜", "删除当前分镜版本及全部镜头？未保存的编辑将丢弃。保留原音乐、MV项目和已生成媒体；可重新规划并保存分镜。", "分镜已删除，可重新规划并保存分镜。"],
    "zh-TW": ["刪除所有分鏡", "刪除目前分鏡版本及全部鏡頭？未儲存的編輯將捨棄。保留原音樂、MV專案及已生成媒體；可重新規劃並儲存分鏡。", "分鏡已刪除，可重新規劃並儲存。"],
    fr: ["Supprimer tous les plans", "Supprimer la version sélectionnée et tous ses plans ? Les modifications non enregistrées seront perdues. Musique, projet MV et médias conservés. Replanifiez pour enregistrer à nouveau.", "Storyboard supprimé. Replanifiez pour enregistrer à nouveau."],
    de: ["Alle Szenen löschen", "Ausgewählte Storyboard-Version und alle Szenen löschen? Ungespeicherte Änderungen gehen verloren. Musik, MV-Projekt und Medien bleiben erhalten. Zum erneuten Speichern neu planen.", "Storyboard gelöscht. Zum erneuten Speichern neu planen."],
    ja: ["全ショットを削除", "選択した絵コンテ版と全ショットを削除しますか？未保存の編集は破棄されます。元の音楽、MVプロジェクト、生成済みメディアは保持します。再計画して保存できます。", "絵コンテを削除しました。再計画して保存できます。"],
    ko: ["모든 장면 삭제", "선택한 스토리보드 버전과 모든 장면을 삭제할까요? 저장하지 않은 편집은 사라집니다. 원본 음악, MV 프로젝트와 생성된 미디어는 유지됩니다. 다시 계획하여 저장할 수 있습니다.", "스토리보드를 삭제했습니다. 다시 계획하여 저장하세요."],
    es: ["Eliminar todos los planos", "¿Eliminar la versión seleccionada y todos sus planos? Se perderán los cambios sin guardar. Se conservan música, proyecto MV y medios. Planifica de nuevo para guardar.", "Storyboard eliminado. Planifica de nuevo para guardar."],
    pt: ["Excluir todas as cenas", "Excluir a versão selecionada e todas as cenas? Edições não salvas serão perdidas. Música, projeto MV e mídia serão mantidos. Planeje novamente para salvar.", "Storyboard excluído. Planeje novamente para salvar."],
    tr: ["Tüm sahneleri sil", "Seçili storyboard sürümü ve tüm sahneleri silinsin mi? Kaydedilmemiş düzenlemeler kaybolur. Müzik, MV projesi ve medya korunur. Yeniden kaydetmek için planlayın.", "Storyboard silindi. Yeniden kaydetmek için planlayın."],
    ar: ["حذف جميع اللقطات", "حذف النسخة المحددة وجميع لقطاتها؟ ستُفقد التعديلات غير المحفوظة. تُحفظ الموسيقى ومشروع MV والوسائط المولدة. أعد التخطيط للحفظ مجددًا.", "حُذفت لوحة المشاهد. أعد التخطيط للحفظ مجددًا."],
    vi: ["Xóa tất cả cảnh", "Xóa phiên bản phân cảnh đã chọn và mọi cảnh? Thay đổi chưa lưu sẽ mất. Giữ nhạc gốc, dự án MV và phương tiện đã tạo. Lập lại phân cảnh để lưu.", "Đã xóa phân cảnh. Lập lại để lưu."],
    id: ["Hapus semua adegan", "Hapus versi storyboard terpilih dan semua adegannya? Edit yang belum disimpan akan hilang. Musik, proyek MV dan media tetap disimpan. Rencanakan ulang untuk menyimpan.", "Storyboard dihapus. Rencanakan ulang untuk menyimpan."],
    ru: ["Удалить все кадры", "Удалить выбранную версию раскадровки и все её кадры? Несохранённые изменения будут потеряны. Музыка, проект MV и медиа сохранятся. Создайте новый план для сохранения.", "Раскадровка удалена. Создайте новый план для сохранения."],
  };
  function deleteText(key) {
    return (deleteMessages[host.state().language] || deleteMessages.en)[deleteKeys.indexOf(key)];
  }
  const beatMessages = {
    en: ["Use full audio", "Cuts follow nearby downbeats or beats, not equal-length division. Preview shows clip intervals and generated lengths; planning creates a new version.", "Save and analyze the selected audio first.", "Calculating beat cuts…", "Beat preview ready. Review before planning.", "Beat preview failed"],
    "zh-CN": ["使用完整音频", "切点优先邻近重拍，其次节拍，不按等长整除。预览显示剪辑区间及生成时长；规划创建新版本。", "请先保存并分析所选音频。", "正在计算节拍切点…", "节拍预览已就绪，请审阅后规划。", "节拍预览失败"],
    "zh-TW": ["使用完整音訊", "切點優先鄰近重拍，其次節拍，不按等長整除。預覽顯示剪輯區間及生成時長；規劃建立新版本。", "請先儲存並分析所選音訊。", "正在計算節拍切點…", "節拍預覽已就緒，請審閱後規劃。", "節拍預覽失敗"],
    fr: ["Utiliser tout l’audio", "Coupes sur les temps forts ou les pulsations proches, sans division uniforme. Aperçu des intervalles et durées générées ; planification dans une nouvelle version.", "Enregistrez et analysez l’audio sélectionné.", "Calcul des coupes…", "Aperçu prêt. Vérifiez avant de planifier.", "Échec de l’aperçu"],
    de: ["Gesamtes Audio verwenden", "Schnitte nahe Taktanfängen oder Beats statt gleicher Längen. Vorschau zeigt Schnittbereiche und Generierungsdauer; Planung erstellt eine neue Version.", "Ausgewähltes Audio speichern und analysieren.", "Beat-Schnitte berechnen…", "Vorschau bereit. Vor Planung prüfen.", "Vorschau fehlgeschlagen"],
    ja: ["音声全体を使用", "等分せず近くの強拍・拍で編集します。区間と生成時間を表示し、計画は新しいバージョンになります。", "選択した音声を保存・解析してください。", "拍の編集点を計算中…", "プレビューを確認して計画してください。", "プレビュー失敗"],
    ko: ["전체 오디오 사용", "균등 분할 대신 가까운 강박 또는 박자에서 자릅니다. 구간과 생성 길이를 표시하며 새 버전을 만듭니다.", "선택한 오디오를 저장하고 분석하세요.", "박자 컷 계산 중…", "미리보기를 검토한 후 계획하세요.", "미리보기 실패"],
    es: ["Usar todo el audio", "Cortes cerca de tiempos fuertes o pulsos, sin división uniforme. Muestra intervalos y duración generada; crea otra versión.", "Guarda y analiza el audio elegido.", "Calculando cortes…", "Vista previa lista. Revisa antes de planificar.", "Error de vista previa"],
    pt: ["Usar todo o áudio", "Cortes próximos de tempos fortes ou batidas, sem divisão uniforme. Mostra intervalos e duração gerada; cria nova versão.", "Salve e analise o áudio selecionado.", "Calculando cortes…", "Prévia pronta. Revise antes de planejar.", "Falha na prévia"],
    tr: ["Tüm sesi kullan", "Eşit bölmek yerine yakındaki güçlü vuruşlar kullanılır. Önizleme kesim ve üretim sürelerini gösterir; yeni sürüm oluşturulur.", "Seçilen sesi kaydedip analiz edin.", "Kesimler hesaplanıyor…", "Önizlemeyi planlamadan önce inceleyin.", "Önizleme başarısız"],
    ar: ["استخدام الصوت كاملاً", "القص قرب النبضات القوية أو الإيقاع وليس بأطوال متساوية. تعرض المعاينة الفترات ومدد التوليد؛ التخطيط ينشئ نسخة جديدة.", "احفظ الصوت المختار وحلله أولاً.", "حساب مواضع القص…", "المعاينة جاهزة. راجع قبل التخطيط.", "فشلت المعاينة"],
    vi: ["Dùng toàn bộ âm thanh", "Cắt gần nhịp mạnh hoặc nhịp, không chia đều. Xem khoảng cắt và độ dài tạo; lập kế hoạch tạo phiên bản mới.", "Lưu và phân tích âm thanh đã chọn.", "Đang tính điểm cắt…", "Xem trước sẵn sàng. Kiểm tra trước khi lập cảnh.", "Xem trước thất bại"],
    id: ["Gunakan seluruh audio", "Potong dekat ketukan kuat atau ketukan, bukan durasi sama. Pratinjau interval dan durasi generasi; buat versi baru.", "Simpan dan analisis audio yang dipilih.", "Menghitung potongan…", "Pratinjau siap. Tinjau sebelum merencanakan.", "Pratinjau gagal"],
    ru: ["Использовать всё аудио", "Склейки у сильных долей или ритма, не равными частями. Показаны интервалы и длины генерации; план создаёт новую версию.", "Сохраните и проанализируйте выбранное аудио.", "Расчёт склеек…", "Предпросмотр готов. Проверьте перед планированием.", "Ошибка предпросмотра"],
  };
  const beatText = key => (beatMessages[host.state().language] || beatMessages.en)[
    ["full", "hint", "waiting", "loading", "ready", "failed"].indexOf(key)];
  const node = id => document.querySelector(`#${id}`);
  let workflow = null, versions = [], busy = false, dirty = false, generation = 0, timer = null;
  let beatKey = "", beatVersion = 0, beatTimer = null, beatPlan = null, beatState = "waiting", beatError = "";
  let timingSource = "", timingDuration = null;
  const running = () => ["queued", "running"].includes(workflow?.status);
  const text = key => host.text(key);
  function status(value, error = false) {
    node("mv-generation-status").textContent = value;
    node("mv-generation-status").classList.toggle("error", error);
  }
  async function request(url, payload, method = "POST") {
    const response = await fetch(url, payload === undefined ? {cache: "no-store"} : {
      method, headers: {"Content-Type": "application/json"}, body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || data.error || `HTTP ${response.status}`);
    return data;
  }
  function timingPayload(state) {
    return {revision: state.project.revision, model: state.model,
      start: Number(node("mv-start").value), end: Number(node("mv-end").value),
      shot_seconds: Number(node("mv-shot-seconds").value)};
  }
  function renderTotalDuration() {
    const start = Number(node("mv-start").value), end = Number(node("mv-end").value);
    node("mv-planned-duration").value = timingDuration !== null &&
      Number.isFinite(start) && Number.isFinite(end) && start >= 0 && end > start && end <= timingDuration
      ? (beatPlan ? beatPlan.total_duration : end - start).toFixed(3) : "";
  }
  function renderBeatPreview() {
    node("mv-beat-status").textContent = `${beatText(beatState)}${beatError ? `: ${beatError}` : ""}`;
    node("mv-beat-status").classList.toggle("error", beatState === "failed");
    renderTotalDuration();
    node("mv-planned-count").value = beatPlan?.shot_count || "";
    node("mv-beat-preview").replaceChildren();
    for (const clip of beatPlan?.clips || []) {
      const item = document.createElement("li");
      item.textContent = `${(clip.start_frame / 24).toFixed(3)}–${(clip.end_frame / 24).toFixed(3)} s · ${text("storyboardShotDuration")}: ${clip.duration} s`;
      node("mv-beat-preview").append(item);
    }
  }
  function updateBeatPreview(state) {
    const analysis = state.analysis;
    const ready = state.project && !state.dirty && !state.analysisBusy &&
      analysis?.result && analysis.music_source_id === state.project.music_source_id;
    const payload = ready ? timingPayload(state) : null;
    const key = ready ? JSON.stringify([state.project.id, payload,
      analysis.result.duration, analysis.result.beats, analysis.result.downbeats]) : "";
    if (key === beatKey) return;
    beatKey = key;
    const version = ++beatVersion;
    if (beatTimer) window.clearTimeout(beatTimer);
    beatPlan = null; beatError = ""; beatState = key ? "loading" : "waiting";
    renderBeatPreview();
    if (!key) return;
    beatTimer = window.setTimeout(() => {
      if (version !== beatVersion) return;
      request(`/api/mv-projects/${state.project.id}/beat-plan`, payload).then(data => {
        if (version !== beatVersion) return;
        beatPlan = data.plan; beatState = "ready"; renderBeatPreview(); updateControls();
      }).catch(error => {
        if (version !== beatVersion) return;
        beatState = "failed"; beatError = error.message; renderBeatPreview(); updateControls();
      });
    }, 250);
  }
  function updateControls(updateHost = true) {
    const state = host.state();
    node("mv-log-panel").hidden = node("mv-panel").hidden || !workflow;
    node("mv-log-live").hidden = !running();
    const ltx = state.model.startsWith("ltx-");
    node("mv-shot-seconds").min = ltx ? 1 : 5;
    node("mv-shot-seconds").max = ltx ? 20 : 15;
    for (const id of ["mv-start", "mv-end", "mv-shot-seconds", "mv-video-quality", "mv-full-song", "mv-beat-refresh"]) {
      node(id).disabled = busy || running() || state.externalBusy;
    }
    const source = state.project ? JSON.stringify([state.project.id, state.project.music_source_id]) : "";
    if (source !== timingSource) {
      timingSource = source; timingDuration = null;
      node("mv-start").value = 0;
      node("mv-end").value = "";
      node("mv-end").removeAttribute("max");
    }
    if (state.analysis?.result && state.analysis.music_source_id === state.project?.music_source_id) {
      const end = Math.floor(state.analysis.result.duration * 24) / 24;
      if (timingDuration !== end) {
        timingDuration = end;
        node("mv-start").value = workflow?.mv_timeline ? workflow.mv_timeline.start_frame / 24 : 0;
        node("mv-end").value = workflow?.mv_timeline ? workflow.mv_timeline.end_frame / 24 : end;
      }
      node("mv-end").max = end;
      if (Number(node("mv-end").value) > end) node("mv-end").value = end;
    } else {
      timingDuration = null;
    }
    updateBeatPreview(state);
    renderTotalDuration();
    for (const id of ["mv-full-song", "mv-beat-refresh"]) {
      node(id).disabled = node(id).disabled || !state.project || state.dirty || state.analysisBusy ||
        !state.analysis?.result || state.analysis.music_source_id !== state.project.music_source_id;
    }
    node("mv-plan").disabled = busy || running() || state.busy || state.analysisBusy || state.dirty || state.externalBusy ||
      !beatPlan || !state.project || !state.textModel || !state.analysis?.result ||
      state.analysis.music_source_id !== state.project.music_source_id;
    for (const id of ["mv-shots-save", "mv-shots-delete", "mv-videos", "mv-export", "mv-run"]) {
      node(id).disabled = busy || running() || !workflow || state.externalBusy ||
        (id === "mv-export" && (dirty || workflow.shots.some(shot => shot.status !== "completed")));
    }
    node("mv-generation-cancel").disabled = busy || !running();
    node("mv-workflow-list").disabled = busy || running();
    for (const control of node("mv-form").querySelectorAll("input,textarea,select,button")) {
      if (busy || running()) {
        if (!control.dataset.mvGenerationLocked) {
          control.dataset.mvGenerationLocked = control.disabled ? "disabled" : "enabled";
        }
        control.disabled = true;
      } else if (control.dataset.mvGenerationLocked) {
        control.disabled = control.dataset.mvGenerationLocked === "disabled";
        delete control.dataset.mvGenerationLocked;
      }
    }
    node("mv-shots").querySelectorAll("input,textarea,select,button").forEach(control => {
      control.disabled = busy || running() || state.externalBusy;
    });
    if (updateHost) host.updateAvailability();
  }
  function localize() {
    document.querySelectorAll("[data-mv-delete-i18n]").forEach(element => {
      element.textContent = deleteText(element.dataset.mvDeleteI18n);
    });
    node("mv-generation-logs").setAttribute("aria-label", text("generationLog"));
    const values = messages[host.state().language] || messages.en;
    document.querySelectorAll("[data-mv-generation-i18n]").forEach(element => {
      element.textContent = values[keys.indexOf(element.dataset.mvGenerationI18n)];
    });
    document.querySelectorAll("[data-mv-beat-i18n]").forEach(element => {
      element.textContent = beatText(element.dataset.mvBeatI18n);
    });
    renderBeatPreview();
    node("mv-shots").querySelectorAll("[data-label]").forEach(element => {
      element.textContent = text(element.dataset.label);
    });
    node("mv-shots").querySelectorAll("[data-field]").forEach(element => {
      element.setAttribute("aria-label", text({title: "workflowShotTitle", prompt: "promptLabel", frame: "firstFrameTitle"}[element.dataset.field]));
    });
    node("mv-shots").querySelectorAll("[data-shot-frame-preview]").forEach(element => {
      element.alt = text("firstFrameTitle");
    });
    updateShotMedia();
  }
  function updateShotMedia() {
    for (const [index, shot] of (workflow?.shots || []).entries()) {
      const card = [...node("mv-shots").children].find(item => item.dataset.id === shot.id);
      if (!card) continue;
      const state = card.querySelector("[data-shot-status]");
      const key = shot.status === "pending" ? "workflowStatusQueued" :
        `workflowStatus${shot.status[0].toUpperCase()}${shot.status.slice(1)}`;
      const label = text(key);
      if (state.textContent !== label) state.textContent = label;
      state.className = `status-chip ${
        shot.status === "running" ? "active" : shot.status === "completed" ? "success" :
          ["failed", "interrupted"].includes(shot.status) ? "error" : ""
      }`;
      const error = card.querySelector("[data-shot-error]");
      error.textContent = shot.error || "";
      error.hidden = !shot.error;
      const progress = card.querySelector("[data-shot-progress]");
      const details = card.querySelector("[data-shot-progress-details]");
      const job = shot.status === "running" && running() ? workflow.active_job : null;
      const step = job?.progress;
      progress.hidden = details.hidden = shot.status !== "running";
      progress.setAttribute("aria-label", text("workflowTaskProgress"));
      if (Number.isInteger(step?.step) && Number.isInteger(step?.total) &&
        step.total > 0 && step.step >= 0 && step.step <= step.total) {
        progress.max = step.total;
        progress.value = step.step;
      } else {
        progress.removeAttribute("value");
        progress.removeAttribute("max");
      }
      details.textContent = [
        text(job?.status === "loading" ? "workflowPreparing" : "workflowVideoStage"),
        job?.segment ? `${text("workflowSegment")}: ${job.segment.current}/${job.segment.total}` : "",
        step && Number.isInteger(step.step) && Number.isInteger(step.total) ?
          `${step.step}/${step.total}` : "",
      ].filter(Boolean).join(" · ");
      const video = card.querySelector("[data-shot-video-preview]");
      const url = shot.status === "completed" ? shot.video_url : "";
      video.hidden = !url;
      if ((video.getAttribute("src") || "") !== (url || "")) {
        video.pause();
        if (url) video.setAttribute("src", url);
        else video.removeAttribute("src");
        video.load();
      }
      const poster = shot.generated_first_frame_url || "";
      if (poster) video.setAttribute("poster", poster);
      else video.removeAttribute("poster");
      video.setAttribute("aria-label", `${text("workflowShot")} ${index + 1}: ${shot.title}`);
      const frame = card.querySelector("[data-field=frame]");
      const preview = card.querySelector("[data-shot-frame-preview]");
      const referenceMode = (window.MiniMuvVisualReferences?.shotPayload(card)?.visual || shot.visual)?.frame_mode === "references";
      const frameUrl = referenceMode ? shot.first_frame_url || shot.generated_first_frame_url :
        frame.value === "__previous__" ? workflow.shots[index - 1]?.last_frame_url :
        host.state().images.find(image => image.id === frame.value)?.image_url ||
        (frame.value && frame.value === shot.first_frame_id ? shot.first_frame_url : "");
      preview.hidden = !frameUrl;
      if (frameUrl) preview.setAttribute("src", frameUrl);
      else preview.removeAttribute("src");
    }
  }
  function render(rebuild = true) {
    const container = node("mv-shots");
    if (rebuild) {
      container.replaceChildren();
      for (const [index, shot] of (workflow?.shots || []).entries()) {
        const card = document.createElement("section");
        card.className = "workflow-shot";
        card.dataset.id = shot.id;
        const clip = workflow.mv_timeline.clips[index];
        const interval = document.createElement("p");
        interval.textContent = `${index + 1} · ${(clip.start_frame / 24).toFixed(3)}–${(clip.end_frame / 24).toFixed(3)} s`;
        const shotStatus = document.createElement("span");
        shotStatus.dataset.shotStatus = "";
        shotStatus.setAttribute("role", "status");
        shotStatus.setAttribute("aria-live", "polite");
        const shotError = document.createElement("p");
        shotError.dataset.shotError = "";
        shotError.className = "workflow-message error";
        const shotProgress = document.createElement("progress");
        shotProgress.dataset.shotProgress = "";
        const progressDetails = document.createElement("p");
        progressDetails.dataset.shotProgressDetails = "";
        progressDetails.className = "history-metrics";
        const durationLabel = document.createElement("label");
        const durationText = document.createElement("span");
        durationText.dataset.label = "storyboardShotDuration";
        const duration = document.createElement("input");
        duration.type = "number"; duration.readOnly = true; duration.value = shot.duration;
        durationLabel.append(durationText, duration);
        const title = document.createElement("input");
        title.value = shot.title; title.maxLength = 120; title.dataset.field = "title";
        title.setAttribute("aria-label", text("workflowShotTitle"));
        const prompt = document.createElement("textarea");
        prompt.value = shot.prompt; prompt.maxLength = 4000; prompt.rows = 4; prompt.dataset.field = "prompt";
        prompt.setAttribute("aria-label", text("promptLabel"));
        for (const control of [title, prompt]) control.addEventListener("input", () => {dirty = true; updateControls();});
        const generate = document.createElement("button");
        generate.type = "button"; generate.className = "workflow-secondary"; generate.dataset.label = "workflowGenerateShot";
        generate.addEventListener("click", () => action(`shots/${shot.id}/generate`));
        const frame = document.createElement("select");
        frame.dataset.field = "frame";
        frame.setAttribute("aria-label", text("firstFrameTitle"));
        const noFrame = new Option(text("firstFrameNone"), "");
        noFrame.dataset.label = "firstFrameNone";
        frame.append(noFrame);
        if (index > 0 && workflow.model !== "h3-fasth3-vsa-q8") {
          const previousFrame = new Option(text("firstFrameChained"), "__previous__");
          previousFrame.dataset.label = "firstFrameChained";
          frame.append(previousFrame);
        }
        for (const image of host.state().images) frame.append(new Option(image.name || image.id, image.id));
        if (shot.first_frame_id && ![...frame.options].some(option => option.value === shot.first_frame_id)) {
          frame.append(new Option(text("firstFrameSaved"), shot.first_frame_id));
        }
        frame.value = shot.first_frame_source === "previous" ? "__previous__" : shot.first_frame_id || "";
        const framePreview = document.createElement("img");
        framePreview.dataset.shotFramePreview = "";
        framePreview.alt = text("firstFrameTitle");
        function updateFramePreview() {
          const value = frame.value;
          const url = value === "__previous__" ? workflow.shots[index - 1]?.last_frame_url :
            host.state().images.find(image => image.id === value)?.image_url ||
              (value && value === shot.first_frame_id ? shot.first_frame_url : "");
          framePreview.hidden = !url;
          if (url) framePreview.src = url;
          else framePreview.removeAttribute("src");
        }
        updateFramePreview();
        frame.addEventListener("change", () => {updateFramePreview(); dirty = true; updateControls();});
        if (workflow.model === "h3-fasth3-vsa-q8") frame.hidden = true;
        const titleLabel = document.createElement("label");
        const titleText = document.createElement("span");
        titleText.dataset.label = "workflowShotTitle";
        titleLabel.append(titleText, title);
        const promptLabel = document.createElement("label");
        const promptText = document.createElement("span");
        promptText.dataset.label = "promptLabel";
        promptLabel.append(promptText, prompt);
        const frameLabel = document.createElement("label");
        const frameText = document.createElement("span");
        frameText.dataset.label = "firstFrameTitle";
        frameLabel.append(frameText, frame, framePreview);
        frameLabel.hidden = frame.hidden;
        const video = document.createElement("video");
        video.dataset.shotVideoPreview = "";
        video.controls = true; video.preload = "metadata"; video.hidden = true;
        card.append(interval, shotStatus, shotError, shotProgress, progressDetails,
          titleLabel, promptLabel, durationLabel, frameLabel, generate, video);
        container.append(card);
        window.MiniMuvVisualReferences?.attachShot(card, "mv", shot.visual, workflow.visual_references,
          () => {dirty = true; updateControls();}, workflow.reference_urls);
        window.MiniMuvVideoPrompts?.attachShot(card, shot, workflow.model,
          () => {dirty = true; updateControls();});
      }
    }
    node("mv-generation-logs").textContent = [
      workflow ? `${workflow.model} · ${workflow.status} · ${workflow.progress?.completed || 0}/${workflow.progress?.total || 0}` : "",
      workflow?.error || "", ...(workflow?.logs || []),
    ].join("\n");
    const download = node("mv-download");
    download.hidden = !workflow?.output_url;
    if (workflow?.output_url) {
      download.href = workflow.output_url;
    } else {
      download.removeAttribute("href");
    }
    window.refreshResultPreview?.();
    localize(); updateControls();
  }
  function canLeave() {return !busy && !running() && (!dirty || window.confirm(text("mvDiscard")));}
  function schedule() {
    if (timer) window.clearTimeout(timer);
    const version = generation, id = workflow?.id;
    if (!id || !running()) return;
    timer = window.setTimeout(async () => {
      try {
        const data = await request(`/api/workflows/${id}`);
        if (version !== generation || workflow?.id !== id) return;
        workflow = data.workflow; render(false);
        if (workflow.error) status(workflow.error, true);
      } catch (error) {
        if (version !== generation) return;
        status(`${text("workflowPollRetry")} ${error.message}`, true);
      }
      if (version === generation) schedule();
    }, 1500);
  }
  async function refresh() {
    const version = ++generation;
    if (timer) window.clearTimeout(timer);
    workflow = null; versions = []; dirty = false; render();
    status("");
    const state = host.state();
    node("mv-workflow-list").replaceChildren();
    if (!state.project) return;
    try {
      const data = await request(`/api/mv-projects/${state.project.id}/workflows`);
      if (version !== generation) return;
      versions = data.items;
      node("mv-workflow-list").replaceChildren(...versions.map(item =>
        new Option(`${new Date(item.created_at * 1000).toLocaleString()} · ${item.status}`, item.id)));
      workflow = versions[0] || null;
      node("mv-workflow-list").value = workflow?.id || "";
      if (workflow) host.restoreGeneration?.(workflow);
      render(); schedule();
    } catch (error) {if (version === generation) status(error.message, true);}
  }
  async function save() {
    if (!dirty) return;
    const shots = [...node("mv-shots").children].map(card => ({
      id: card.dataset.id, title: card.querySelector("[data-field=title]").value,
      prompt: card.querySelector("[data-field=prompt]").value,
      first_frame_id: card.querySelector("[data-field=frame]").value === "__previous__" ? "" :
        card.querySelector("[data-field=frame]").value,
      first_frame_source: card.querySelector("[data-field=frame]").value === "__previous__" ? "previous" :
        card.querySelector("[data-field=frame]").value ? "image" : "none",
      ...(window.MiniMuvVisualReferences?.shotPayload(card) || {}),
      ...(window.MiniMuvVideoPrompts?.shotPayload(card) || {}),
    }));
    const data = await request(`/api/workflows/${workflow.id}/mv-update`, {
      revision: workflow.mv_revision, shots,
    });
    workflow = data.workflow; dirty = false; render();
  }
  async function operation(callback) {
    if (busy) return;
    busy = true; updateControls();
    try {await callback();}
    catch (error) {
      node("mv-workflow-list").value = workflow?.id || "";
      status(`${text("mvError")}: ${error.message}`, true);
    }
    finally {busy = false; updateControls();}
  }
  async function action(name) {
    if (!workflow || running()) return;
    await operation(async () => {
      await save();
      const data = await request(`/api/workflows/${workflow.id}/${name}`, {});
      workflow = data.workflow; status(text("workflowStarting")); render(); schedule();
    });
  }
  node("mv-plan").addEventListener("click", () => operation(async () => {
    const state = host.state();
    if (!beatPlan || !state.project || state.dirty || (dirty && !window.confirm(text("mvDiscard")))) return;
    status(text("workflowStarting"));
    const data = await request(`/api/mv-projects/${state.project.id}/storyboard`, {
      revision: state.project.revision, text_model: state.textModel, model: state.model,
      quality: state.quality, start: Number(node("mv-start").value), end: Number(node("mv-end").value),
      shot_seconds: Number(node("mv-shot-seconds").value),
      ...(window.MiniMuvSkills?.selection("mv-prompt") || {}),
    });
    versions.unshift(data.workflow);
    node("mv-workflow-list").prepend(new Option(data.workflow.name, data.workflow.id));
    node("mv-workflow-list").value = data.workflow.id;
    workflow = data.workflow; dirty = false; status(text("workflowSaving")); render();
  }));
  for (const id of ["mv-start", "mv-end", "mv-shot-seconds"]) {
    node(id).addEventListener("input", () => updateControls());
  }
  node("mv-full-song").addEventListener("click", () => {
    const duration = host.state().analysis?.result?.duration;
    if (!duration) return;
    node("mv-start").value = 0;
    node("mv-end").value = Math.floor(duration * 24) / 24;
    updateControls();
  });
  node("mv-beat-refresh").addEventListener("click", () => {beatKey = ""; updateControls();});
  node("mv-shots-save").addEventListener("click", () => operation(save));
  node("mv-shots-delete").addEventListener("click", () => {
    if (busy || running() || !workflow || host.state().externalBusy ||
      !window.confirm(deleteText("confirm"))) return;
    return operation(async () => {
      const id = workflow.id;
      await request(`/api/workflows/${id}`, {delete_media: false}, "DELETE");
      versions = versions.filter(item => item.id !== id);
      workflow = versions[0] || null;
      dirty = false;
      ++generation;
      if (timer) window.clearTimeout(timer);
      node("mv-workflow-list").replaceChildren(...versions.map(item =>
        new Option(`${new Date(item.created_at * 1000).toLocaleString()} · ${item.status}`, item.id)));
      node("mv-workflow-list").value = workflow?.id || "";
      status(deleteText("done")); render(); schedule();
    });
  });
  node("mv-videos").addEventListener("click", () => action("videos"));
  node("mv-export").addEventListener("click", () => action("assemble"));
  node("mv-run").addEventListener("click", () => action("mv-run"));
  node("mv-generation-cancel").addEventListener("click", () => operation(async () => {
    const data = await request(`/api/workflows/${workflow.id}/cancel`, {});
    workflow = data.workflow; render(false); schedule();
  }));
  node("mv-workflow-list").addEventListener("change", async () => {
    if (!canLeave()) {node("mv-workflow-list").value = workflow?.id || ""; return;}
    const id = node("mv-workflow-list").value;
    await operation(async () => {
      const data = await request(`/api/workflows/${id}`);
      workflow = data.workflow; dirty = false;
      host.restoreGeneration?.(workflow);
      timingDuration = null;
      render(); schedule();
    });
  });
  window.addEventListener("beforeunload", event => {
    if (dirty || busy) {event.preventDefault(); event.returnValue = "";}
  });
  window.MiniMuvMVGeneration = {refresh, updateControls, localize, canLeave,
    preview: () => workflow && ({id: workflow.id, status: workflow.status, video_url: workflow.output_url}),
    active: () => busy || running(), messages};
  localize(); refresh();
})();
