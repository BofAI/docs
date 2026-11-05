export default {
  id: "baiVideo",
  label: "B.AI Seedance",
  version: "1.0.0",
  apiUrl: "https://api.b.ai/v1",
  readme: "B.AI text-to-video adapter with task polling and authenticated downloads. Text-to-video only.",
  rules: [
    { type: "input", field: "apiKey", title: "API Key", value: "", props: { type: "password", showPassword: true } },
    { type: "input", field: "baseUrl", title: "Base URL", value: "https://api.b.ai/v1" }
  ],
  models: [{ id: "seedance-2.0-mini", label: "Seedance 2.0 Mini", type: "video", mode: ["text"], audio: "optional", durationResolutionMap: [{ duration: [4, 5, 6, 8, 10], resolution: ["480p", "720p"] }] }],
  async generateVideo(request) {
    const base = String(this.config.baseUrl || "https://api.b.ai/v1").replace(/\/$/, "");
    if (base !== "https://api.b.ai/v1") throw new Error("此适配器仅允许 B.AI 官方地址");
    const headers = { Authorization: `Bearer ${this.config.apiKey}`, "Content-Type": "application/json" };
    let task;
    if (request.other?.resumeTaskId) task = { id: request.other.resumeTaskId };
    else {
      const response = await this.tool.fetch(`${base}/videos`, { method: "POST", headers, body: JSON.stringify({ model: request.model, content: [{ type: "text", text: request.prompt }], duration: request.duration || 4, resolution: request.resolution || "480p", ratio: request.ratio || "16:9", generate_audio: request.generateAudio ?? false, watermark: false }) });
      if (!response.ok) throw new Error(`提交失败 HTTP ${response.status}: ${await response.text()}`);
      task = await response.json();
    }
    if (!task.id) throw new Error("响应缺少任务 ID");
    for (let i = 0; i < 180; i++) {
      this.signal?.throwIfAborted();
      const response = await this.tool.fetch(`${base}/videos/${encodeURIComponent(task.id)}`, { headers });
      if (!response.ok) throw new Error(`查询失败 HTTP ${response.status}，请保留原任务 ID`);
      const state = await response.json();
      if (["failed", "cancelled"].includes(state.status)) throw new Error(JSON.stringify(state.error || state));
      if (state.metadata?.billing_status === "review") throw new Error("任务结算需复核，请保留原任务 ID");
      if (state.status === "completed" && state.metadata?.billing_status === "settled") {
        const media = await this.tool.fetch(`${base}/videos/${encodeURIComponent(task.id)}/content`, { headers });
        if (!media.ok) throw new Error(`下载失败 HTTP ${media.status}`);
        return [{ mediaType: "video", type: "binary", data: new Uint8Array(await media.arrayBuffer()), mimeType: "video/mp4" }];
      }
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    throw new Error(`轮询超时，请恢复原任务 ${task.id}，勿重复提交`);
  }
};
