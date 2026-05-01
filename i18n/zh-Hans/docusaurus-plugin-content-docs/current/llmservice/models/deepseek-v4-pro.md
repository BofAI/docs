# DeepSeek V4 Pro

## 概述

DeepSeek-V4-Pro 是 DeepSeek 于 2026 年 4 月 24 日基于 MIT License 发布的旗舰级开源大语言模型。该模型采用 Mixture-of-Experts（MoE）架构，总参数量达到 1.6T，单次前向激活参数约为 49B，支持 100 万 token 上下文窗口，并以远低于同类闭源模型的成本，提供接近前沿水平的编程、数学与推理能力。

## 核心特性

* **超大规模与高效推理**：总参数量 1.6T，但每次推理仅激活 49B 参数，在保持前沿性能的同时显著降低推理成本，整体价格约为 Claude Opus 4.7 的 1/20。
* **100 万 Token 上下文窗口**：支持最高 100 万输入 token 与 384K 最大输出 token。通过结合 Compressed Sparse Attention（CSA）与 Heavily Compressed Attention（HCA）的混合注意力机制，相比 DeepSeek-V3.2 可将单 token 推理 FLOPs 降至 27%，KV Cache 降至 10%。
* **顶级编程能力**：在 SWE-bench Verified 上达到 80.6%，与 Claude Opus 4.6 仅差 0.2 分；同时在 Terminal-Bench 2.0 上达到 67.9%，在 LiveCodeBench 上达到 93.5%，Codeforces 评分达到 3206。
* **高级工具调用能力**：在 MCPAtlas Public 上得分 73.6，支持最多 128 个并行函数调用，并针对 Claude Code、OpenCode、OpenClaw 与 CodeBuddy 提供了预调优适配器。

## 适用场景

* **软件工程 Agent**：凭借 80.6% 的 SWE-bench Verified 成绩和强工具调用能力，V4-Pro 非常适合需要遍历大型代码库的自主编程 Agent。
* **长文档分析**：100 万 token 上下文窗口使其能够一次性处理整套代码库、法律文档集合或科研论文集。
* **成本敏感的前沿任务**：对于既需要接近前沿的推理与编程能力、又关注成本效率的团队，V4-Pro 提供了极具竞争力的性能价格比。

## 能力与限制

| 能力维度 | 说明 |
| :--- | :--- |
| **推理能力** | 在数学与 STEM 任务上可与顶级闭源模型对标；HMMT 2026 达到 95.2% |
| **编程能力** | SWE-bench Verified 80.6%，LiveCodeBench 93.5%，Codeforces 3206 |
| **多模态能力** | 当前仅支持文本，多模态能力仍在开发中 |
| **响应速度** | 通过 CSA/HCA 混合注意力机制优化长上下文推理效率 |
| **上下文窗口** | 1,000,000 tokens |
| **最大输出** | 384,000 tokens |
| **工具调用** | 支持最多 128 个并行函数调用；MCPAtlas Public 得分 73.6 |
| **多语言能力** | 具备广泛多语言支持，其中英文表现最强 |

### 已知限制

* 当前仅支持文本，不支持图像、音频或视频的理解与生成。
* 在世界知识类基准上，较 GPT-5.4 与 Gemini 3.1 Pro 仍有差距，DeepSeek 估计约相差 3-6 个月研发进度。
* 在创意写作或高度细腻推理任务上，可能弱于顶级闭源模型。

## 积分消耗

| 模型名称 | 输入 (Credits/Token) | 输出 (Credits/Token) | 备注 |
| :--- | --------------------: | -------------------: | :--- |
| **DeepSeek V4 Pro** | `1.74` | `3.48` | 100 万上下文，384K 最大输出 |
