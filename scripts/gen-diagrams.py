#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generate dark-themed diagram SVGs for the BANK OF AI docs site.

Design system follows the process-flow-diagram / architecture-diagram skills:
  background  #020617 (slate-950) + 40px grid
  manual      emerald  #34d399 / rgba(6,78,59,.4)
  automated   violet   #a78bfa / rgba(76,29,149,.4)
  integration amber    #fbbf24 / rgba(120,53,15,.3)
  security    rose     #fb7185 / rgba(136,19,55,.4)
  terminal    cyan     #22d3ee / rgba(8,51,68,.4)
  generic     slate    #94a3b8 / rgba(30,41,59,.5)

Vertical layout is used for process flows so the diagrams stay legible inside
a ~750px Docusaurus content column.
"""

import html
import os
import sys

FONT = ("'JetBrains Mono','SFMono-Regular',Menlo,Consolas,"
        "'PingFang SC','Hiragino Sans GB','Microsoft YaHei',"
        "'Noto Sans CJK SC','Noto Sans SC','Source Han Sans SC',monospace")

THEMES = {
    "dark": {
        "bg": "#020617", "grid": "#1e293b", "border": "#1e293b",
        "mask": "#0f172a", "badge_bg": "#1e293b",
        "ink": "#f8fafc", "ink2": "#e2e8f0", "ink3": "#94a3b8",
        "dot": "#a78bfa", "arrow": "#64748b",
        "note_fill": "rgba(30, 41, 59, 0.35)", "note_stroke": "#475569",
        "boundary_fill": "rgba(167, 139, 250, 0.05)", "boundary": "#a78bfa",
        "kind": {
            "manual":      ("rgba(6, 78, 59, 0.4)",   "#34d399", "emerald"),
            "auto":        ("rgba(76, 29, 149, 0.4)", "#a78bfa", "violet"),
            "integration": ("rgba(120, 53, 15, 0.3)", "#fbbf24", "amber"),
            "security":    ("rgba(136, 19, 55, 0.4)", "#fb7185", "rose"),
            "terminal":    ("rgba(8, 51, 68, 0.4)",   "#22d3ee", "cyan"),
            "generic":     ("rgba(30, 41, 59, 0.5)",  "#94a3b8", "slate"),
        },
        "marker": {"slate": "#64748b", "cyan": "#22d3ee", "emerald": "#34d399",
                   "violet": "#a78bfa", "amber": "#fbbf24", "rose": "#fb7185"},
    },
    "light": {
        "bg": "#ffffff", "grid": "#eef2f7", "border": "#e2e8f0",
        "mask": "#ffffff", "badge_bg": "#ffffff",
        "ink": "#0f172a", "ink2": "#1e293b", "ink3": "#64748b",
        "dot": "#7c3aed", "arrow": "#94a3b8",
        "note_fill": "#f8fafc", "note_stroke": "#cbd5e1",
        "boundary_fill": "rgba(124, 58, 237, 0.04)", "boundary": "#7c3aed",
        "kind": {
            "manual":      ("#ecfdf5", "#059669", "emerald"),
            "auto":        ("#f5f3ff", "#7c3aed", "violet"),
            "integration": ("#fffbeb", "#d97706", "amber"),
            "security":    ("#fff1f2", "#e11d48", "rose"),
            "terminal":    ("#ecfeff", "#0891b2", "cyan"),
            "generic":     ("#f8fafc", "#64748b", "slate"),
        },
        "marker": {"slate": "#94a3b8", "cyan": "#0891b2", "emerald": "#059669",
                   "violet": "#7c3aed", "amber": "#d97706", "rose": "#e11d48"},
    },
}

TH = THEMES["dark"]


def set_theme(name):
    global TH, KIND
    TH = THEMES[name]
    KIND = TH["kind"]


KIND = TH["kind"]

LEGEND_LABEL = {
    "en": {
        "manual": "User / manual step",
        "auto": "AI / automated step",
        "integration": "Network / external API",
        "security": "Local signing (private key)",
        "terminal": "Start / end",
        "generic": "Component",
    },
    "zh": {
        "manual": "用户 / 手动步骤",
        "auto": "AI / 自动步骤",
        "integration": "网络 / 外部接口",
        "security": "本地签名（私钥）",
        "terminal": "起点 / 终点",
        "generic": "组件",
    },
}

E = html.escape


def head(w, h):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" '
        f'width="{w}" height="{h}" font-family="{FONT}" role="img">\n'
        '  <defs>\n'
        '    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">\n'
        f'      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="{TH["grid"]}" stroke-width="0.5"/>\n'
        '    </pattern>\n'
        + "".join(
            f'    <marker id="ah-{name}" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">\n'
            f'      <polygon points="0 0, 10 3.5, 0 7" fill="{col}"/>\n'
            '    </marker>\n'
            for name, col in TH["marker"].items()
        )
        + '  </defs>\n'
        f'  <rect width="{w}" height="{h}" rx="14" fill="{TH["bg"]}"/>\n'
        f'  <rect width="{w}" height="{h}" rx="14" fill="url(#grid)"/>\n'
        f'  <rect x="0.5" y="0.5" width="{w-1}" height="{h-1}" rx="14" fill="none" stroke="{TH["border"]}"/>\n'
    )


def title_block(w, title, subtitle):
    s = (
        f'  <circle cx="28" cy="33" r="6" fill="{TH["dot"]}"/>\n'
        f'  <text x="46" y="39" fill="{TH["ink"]}" font-size="17" font-weight="700">{E(title)}</text>\n'
    )
    if subtitle:
        s += f'  <text x="46" y="60" fill="{TH["ink3"]}" font-size="11">{E(subtitle)}</text>\n'
    return s


def box(x, y, w, h, kind, title, desc=None, badge=None, actor=None, title_size=13):
    fill, stroke, _ = KIND[kind]
    cx = x + w / 2
    s = (
        f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{TH["mask"]}"/>\n'
        f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" '
        f'stroke="{stroke}" stroke-width="1.5"/>\n'
        f'  <text x="{cx}" y="{y + 25}" fill="{TH["ink"]}" font-size="{title_size}" '
        f'font-weight="600" text-anchor="middle">{E(title)}</text>\n'
    )
    for i, line in enumerate(desc or []):
        s += (f'  <text x="{cx}" y="{y + 44 + 15 * i}" fill="{TH["ink3"]}" font-size="10" '
              f'text-anchor="middle">{E(line)}</text>\n')
    if badge is not None:
        bx = x - 20
        s += (f'  <circle cx="{bx}" cy="{y + 20}" r="13" fill="{TH["badge_bg"]}" stroke="{stroke}" stroke-width="1.5"/>\n'
              f'  <text x="{bx}" y="{y + 24}" fill="{TH["ink"]}" font-size="11" font-weight="700" '
              f'text-anchor="middle">{E(str(badge))}</text>\n')
    if actor:
        s += (f'  <text x="{x + w + 14}" y="{y + 24}" fill="{stroke}" font-size="10" '
              f'font-weight="600">{E(actor)}</text>\n')
    return s


def text_w(s, size):
    """Approximate rendered width: CJK glyphs are full-width, latin mono ~0.6em."""
    units = sum(2 if ord(c) > 0x2E80 else 1 for c in s)
    return units * size * 0.6


def pill(x, y, w, h, label, stroke=None, fill=None):
    stroke = stroke or KIND["terminal"][1]
    fill = fill or KIND["terminal"][0]
    return (
        f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="{TH["mask"]}"/>\n'
        f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{h/2}" fill="{fill}" '
        f'stroke="{stroke}" stroke-width="2"/>\n'
        f'  <text x="{x + w/2}" y="{y + h/2 + 4}" fill="{TH["ink"]}" font-size="12" '
        f'font-weight="600" text-anchor="middle">{E(label)}</text>\n'
    )


def varrow(cx, y1, y2, color="slate", label=None, label_x=None, dashed=False):
    col = TH["marker"][color]
    dash = ' stroke-dasharray="5,4"' if dashed else ""
    s = (f'  <line x1="{cx}" y1="{y1}" x2="{cx}" y2="{y2}" stroke="{col}" '
         f'stroke-width="1.5"{dash} marker-end="url(#ah-{color})"/>\n')
    if label:
        lx = label_x if label_x is not None else cx + 12
        s += (f'  <text x="{lx}" y="{(y1 + y2) / 2 + 4}" fill="{TH["ink3"]}" font-size="10">'
              f'{E(label)}</text>\n')
    return s


def harrow(y, x1, x2, color="slate", label=None, dashed=False):
    col = TH["marker"][color]
    dash = ' stroke-dasharray="5,4"' if dashed else ""
    s = (f'  <line x1="{x1}" y1="{y}" x2="{x2}" y2="{y}" stroke="{col}" '
         f'stroke-width="1.5"{dash} marker-end="url(#ah-{color})"/>\n')
    if label:
        s += (f'  <text x="{(x1 + x2) / 2}" y="{y - 9}" fill="{TH["ink3"]}" font-size="10" '
              f'text-anchor="middle">{E(label)}</text>\n')
    return s


def legend(x, y, kinds, lang, per_row=3, col_w=250):
    s = ""
    for i, k in enumerate(kinds):
        fill, stroke, _ = KIND[k]
        cxx = x + (i % per_row) * col_w
        cyy = y + (i // per_row) * 20
        s += (f'  <rect x="{cxx}" y="{cyy}" width="18" height="11" rx="3" fill="{fill}" '
              f'stroke="{stroke}" stroke-width="1"/>\n'
              f'  <text x="{cxx + 26}" y="{cyy + 10}" fill="{TH["ink3"]}" font-size="10">'
              f'{E(LEGEND_LABEL[lang][k])}</text>\n')
    return s


# --------------------------------------------------------------------------
# Vertical process flow
# --------------------------------------------------------------------------

W = 880
BOX_X = 170
BOX_W = 540
CX = BOX_X + BOX_W / 2
GAP = 40


def vflow(spec, lang):
    steps = spec["steps"]
    parts = []
    y = 88 if spec.get("subtitle") else 72

    if spec.get("start"):
        pw = max(150, round(text_w(spec["start"], 12) + 48))
        parts.append(pill(CX - pw / 2, y, pw, 38, spec["start"]))
        prev_bottom, prev_color = y + 38, "cyan"
        y += 38 + GAP
    else:
        prev_bottom, prev_color = None, None

    for i, st in enumerate(steps):
        h = 40 + 15 * len(st.get("desc", [])) if st.get("desc") else 40
        h = max(h, 44)
        if prev_bottom is not None:
            parts.append(varrow(CX, prev_bottom, y - 4, prev_color,
                                label=st.get("via"), label_x=BOX_X + BOX_W - 150))
        parts.append(box(BOX_X, y, BOX_W, h, st["kind"], st["title"],
                         st.get("desc"), badge=st.get("n", i + 1),
                         actor=st.get("actor")))
        prev_bottom, prev_color = y + h, KIND[st["kind"]][2].replace("cyan", "cyan")
        prev_color = {"emerald": "emerald", "violet": "violet", "amber": "amber",
                      "rose": "rose", "cyan": "cyan", "slate": "slate"}[KIND[st["kind"]][2]]
        y += h + GAP

    if spec.get("end"):
        pw = max(150, round(text_w(spec["end"], 12) + 48))
        parts.append(varrow(CX, prev_bottom, y - 4, prev_color, label=spec.get("end_via"),
                            label_x=BOX_X + BOX_W - 150))
        parts.append(pill(CX - pw / 2, y, pw, 38, spec["end"]))
        y += 38

    y += 34
    used = {s["kind"] for s in steps}
    if spec.get("start") or spec.get("end"):
        used.add("terminal")
    kinds = spec.get("legend") or sorted(used, key=lambda k: list(KIND).index(k))
    rows = (len(kinds) + 2) // 3
    parts.append(legend(48, y, kinds, lang))
    h_total = int(y + rows * 20 + 18)

    return (head(W, h_total)
            + title_block(W, spec["title"], spec.get("subtitle"))
            + "".join(parts) + "</svg>\n")


# --------------------------------------------------------------------------
# Diagram specs
# --------------------------------------------------------------------------

T = {
    # ---------------- BANK OF AI execution flow ----------------
    "bank-of-ai-execution-flow": {
        "en": {
            "title": "BANK OF AI — one execution, end to end",
            "subtitle": 'Example: "Swap 100 USDT for TRX, keep slippage under 1%."',
            "start": "You state the goal",
            "steps": [
                {"kind": "auto", "title": "AI interprets the request",
                 "desc": ["Parses intent, amount, network and slippage limit"],
                 "actor": "LLM"},
                {"kind": "auto", "title": "Selects a Skill or calls an MCP Server",
                 "desc": ["Skill = business SOP · MCP Server = on-chain capability"],
                 "actor": "ORCHESTRATION"},
                {"kind": "security", "title": "Agent Wallet signs",
                 "desc": ["Signed locally — the private key never leaves your machine"],
                 "actor": "WALLET"},
                {"kind": "integration", "title": "Transaction broadcast",
                 "desc": ["Signed transaction submitted to a network node"],
                 "actor": "RPC"},
                {"kind": "integration", "title": "Blockchain",
                 "desc": ["Executed and confirmed on chain"],
                 "actor": "CHAIN"},
            ],
            "end": "Result returned to you",
            "note": "Any step that fails — insufficient balance, malformed address — stops the flow immediately. Anything that spends money asks for your confirmation first.",
        },
        "zh": {
            "title": "BANK OF AI — 一次完整执行",
            "subtitle": "示例：把 100 USDT 换成 TRX，滑点不超过 1%。",
            "start": "你说出目标",
            "steps": [
                {"kind": "auto", "title": "AI 理解需求",
                 "desc": ["解析意图、金额、网络与滑点上限"], "actor": "大模型"},
                {"kind": "auto", "title": "选择 Skill 或调用 MCP Server",
                 "desc": ["Skill = 业务流程 · MCP Server = 链上能力"], "actor": "编排层"},
                {"kind": "security", "title": "Agent Wallet 签名",
                 "desc": ["本地签名，私钥不出本机"], "actor": "钱包"},
                {"kind": "integration", "title": "广播交易",
                 "desc": ["已签名交易提交给网络节点"], "actor": "节点"},
                {"kind": "integration", "title": "区块链",
                 "desc": ["链上执行并确认"], "actor": "链"},
            ],
            "end": "结果返回给你",
        },
    },

    # ---------------- x402 payment flow ----------------
    "x402-payment-flow": {
        "en": {
            "title": "x402 payment flow",
            "subtitle": "How a client, a server and the Facilitator settle one paid HTTP request",
            "start": "Client wants a paid resource",
            "steps": [
                {"kind": "manual", "title": "Client initiates request",
                 "desc": ["Plain HTTP request, no payment attached yet"],
                 "actor": "CLIENT"},
                {"kind": "auto", "title": "Server requires payment",
                 "desc": ["402 Payment Required · details in PAYMENT-REQUIRED (Base64)"],
                 "actor": "SERVER", "via": "402"},
                {"kind": "security", "title": "Client submits payment",
                 "desc": ["Signs the payload, resends it in PAYMENT-SIGNATURE"],
                 "actor": "CLIENT", "via": "sign"},
                {"kind": "integration", "title": "Server validates payment",
                 "desc": ["Facilitator /verify — signature and payload integrity"],
                 "actor": "FACILITATOR", "via": "/verify"},
                {"kind": "integration", "title": "Server executes settlement",
                 "desc": ["Facilitator /settle — transaction submitted on chain"],
                 "actor": "FACILITATOR", "via": "/settle"},
                {"kind": "auto", "title": "Server delivers the resource",
                 "desc": ["Response carries the tx hash in PAYMENT-RESPONSE"],
                 "actor": "SERVER"},
            ],
            "end": "Resource delivered",
        },
        "zh": {
            "title": "x402 支付流程",
            "subtitle": "客户端、服务端与 Facilitator 如何结算一次付费 HTTP 请求",
            "start": "客户端请求付费资源",
            "steps": [
                {"kind": "manual", "title": "客户端发起请求",
                 "desc": ["普通 HTTP 请求，尚未携带支付凭证"], "actor": "客户端"},
                {"kind": "auto", "title": "服务端要求付款",
                 "desc": ["返回 402 · 支付详情放在 PAYMENT-REQUIRED（Base64）"],
                 "actor": "服务端", "via": "402"},
                {"kind": "security", "title": "客户端提交支付",
                 "desc": ["生成签名，通过 PAYMENT-SIGNATURE 重发请求"],
                 "actor": "客户端", "via": "签名"},
                {"kind": "integration", "title": "服务端校验支付",
                 "desc": ["调用 Facilitator /verify 校验签名与载荷完整性"],
                 "actor": "FACILITATOR", "via": "/verify"},
                {"kind": "integration", "title": "服务端执行结算",
                 "desc": ["调用 Facilitator /settle，交易提交上链"],
                 "actor": "FACILITATOR", "via": "/settle"},
                {"kind": "auto", "title": "服务端交付资源",
                 "desc": ["响应在 PAYMENT-RESPONSE 中带回交易哈希"], "actor": "服务端"},
            ],
            "end": "资源交付完成",
        },
    },

    # ---------------- Agent Wallet: TRON ----------------
    "agent-wallet-tron-flow": {
        "en": {
            "title": "TRON transfer — where Agent-wallet fits",
            "subtitle": "Agent-wallet only signs. It needs no RPC connection and knows nothing about the business meaning.",
            "steps": [
                {"kind": "integration", "title": "TronGrid — build",
                 "desc": ["createtransaction returns an unsigned tx (txID + raw_data)"],
                 "actor": "NETWORK"},
                {"kind": "security", "title": "Agent-wallet — sign",
                 "desc": ["Fully offline; the private key never leaves the machine"],
                 "actor": "LOCAL", "via": "unsigned tx"},
                {"kind": "integration", "title": "TronGrid — broadcast",
                 "desc": ["broadcasttransaction publishes it on chain"],
                 "actor": "NETWORK", "via": "signed tx"},
            ],
        },
        "zh": {
            "title": "TRON 转账 —— Agent-wallet 在哪一步",
            "subtitle": "Agent-wallet 只负责签名，不需要 RPC 连接，也不感知交易的业务含义。",
            "steps": [
                {"kind": "integration", "title": "TronGrid — 构造",
                 "desc": ["createtransaction 返回未签名交易（txID + raw_data）"],
                 "actor": "网络"},
                {"kind": "security", "title": "Agent-wallet — 签名",
                 "desc": ["完全离线，私钥不出本机"], "actor": "本地", "via": "未签名交易"},
                {"kind": "integration", "title": "TronGrid — 广播",
                 "desc": ["broadcasttransaction 发布上链"], "actor": "网络", "via": "已签名交易"},
            ],
        },
    },

    # ---------------- Agent Wallet: EVM ----------------
    "agent-wallet-evm-flow": {
        "en": {
            "title": "EVM transfer — where Agent-wallet fits",
            "subtitle": "BSC / Ethereum / Polygon / Base — only RPC_URL and CHAIN_ID change.",
            "steps": [
                {"kind": "integration", "title": "RPC — build",
                 "desc": ["Query nonce / gas / chainId and assemble the tx yourself"],
                 "actor": "NETWORK"},
                {"kind": "security", "title": "Agent-wallet — sign",
                 "desc": ["Returns a hex-encoded signed transaction"],
                 "actor": "LOCAL", "via": "unsigned tx"},
                {"kind": "integration", "title": "RPC — sendRawTransaction",
                 "desc": ["Broadcast the signed transaction to the network"],
                 "actor": "NETWORK", "via": "signed tx"},
            ],
        },
        "zh": {
            "title": "EVM 转账 —— Agent-wallet 在哪一步",
            "subtitle": "BSC / Ethereum / Polygon / Base —— 只需替换 RPC_URL 与 CHAIN_ID。",
            "steps": [
                {"kind": "integration", "title": "RPC — 构造",
                 "desc": ["查询 nonce / gas / chainId，自行组装交易对象"], "actor": "网络"},
                {"kind": "security", "title": "Agent-wallet — 签名",
                 "desc": ["返回 hex 编码的已签名交易"], "actor": "本地", "via": "未签名交易"},
                {"kind": "integration", "title": "RPC — sendRawTransaction",
                 "desc": ["将已签名交易广播到网络"], "actor": "网络", "via": "已签名交易"},
            ],
        },
    },

    # ---------------- Agent Wallet: x402 PaymentPermit ----------------
    "agent-wallet-x402-permit-flow": {
        "en": {
            "title": "x402 PaymentPermit signing",
            "subtitle": "Sign first, verify to proceed — the agent never waits for on-chain confirmation.",
            "steps": [
                {"kind": "auto", "title": "Server returns 402",
                 "desc": ["Payment parameters come back with the 402 response"],
                 "actor": "SERVER"},
                {"kind": "auto", "title": "Agent builds PaymentPermit",
                 "desc": ["TransferWithAuthorization struct, EIP-712 format"],
                 "actor": "x402 SDK"},
                {"kind": "security", "title": "Agent-wallet signs",
                 "desc": ["The only step Agent-wallet is responsible for"],
                 "actor": "LOCAL"},
                {"kind": "manual", "title": "Resend request with signature",
                 "desc": ["The signature travels as the payment credential"],
                 "actor": "AGENT"},
                {"kind": "auto", "title": "Server verifies and responds",
                 "desc": ["Content returned only if the signature checks out"],
                 "actor": "SERVER"},
            ],
        },
        "zh": {
            "title": "x402 PaymentPermit 签名",
            "subtitle": "先签名、验证通过再放行 —— Agent 无需等待链上确认。",
            "steps": [
                {"kind": "auto", "title": "服务端返回 402",
                 "desc": ["402 响应中带回支付参数"], "actor": "服务端"},
                {"kind": "auto", "title": "Agent 构造 PaymentPermit",
                 "desc": ["TransferWithAuthorization 结构，EIP-712 格式"], "actor": "x402 SDK"},
                {"kind": "security", "title": "Agent-wallet 签名",
                 "desc": ["Agent-wallet 只负责这一步"], "actor": "本地"},
                {"kind": "manual", "title": "携带签名重发请求",
                 "desc": ["签名作为支付凭证随请求发送"], "actor": "AGENT"},
                {"kind": "auto", "title": "服务端验证并响应",
                 "desc": ["签名有效才返回内容"], "actor": "服务端"},
            ],
        },
    },

    # ---------------- Payment schemes ----------------
    "x402-payment-scheme-flow": {
        "en": {
            "title": "How payment schemes work",
            "subtitle": "exact · upto · batch-settlement · GasFree — same three beats, different settlement call",
            "steps": [
                {"kind": "security", "title": "Authorize",
                 "desc": ["Client signs typed data: an exact amount, or a maximum for upto / batch"],
                 "actor": "CLIENT"},
                {"kind": "auto", "title": "Execute",
                 "desc": ["Server performs the task and, for usage-based schemes, computes actual cost"],
                 "actor": "SERVER"},
                {"kind": "integration", "title": "Settle",
                 "desc": ["transferWithAuthorization · Permit2 permitTransferFrom · batch claim · GasFree relay"],
                 "actor": "FACILITATOR"},
            ],
        },
        "zh": {
            "title": "支付方案如何运作",
            "subtitle": "exact · upto · batch-settlement · GasFree —— 同样三拍，结算调用不同",
            "steps": [
                {"kind": "security", "title": "授权 Authorize",
                 "desc": ["客户端签名 typed data：固定金额，或 upto / batch 的上限"], "actor": "客户端"},
                {"kind": "auto", "title": "执行 Execute",
                 "desc": ["服务端执行任务；按量计费方案还会计算实际费用"], "actor": "服务端"},
                {"kind": "integration", "title": "结算 Settle",
                 "desc": ["transferWithAuthorization · Permit2 · 批量领取 · GasFree 中继"],
                 "actor": "FACILITATOR"},
            ],
        },
    },
}


# --------------------------------------------------------------------------
# Architecture diagrams (explicit layouts)
# --------------------------------------------------------------------------

A = {
    "bank-of-ai-architecture": {
        "en": {
            "title": "BANK OF AI — the whole picture",
            "subtitle": "One platform sitting between your AI and the on-chain world.",
            "nodes": [
                ("terminal", "AI", 240, 58),
                ("auto", "BANK OF AI", 340, 72),
                ("terminal", "Web3", 240, 58),
            ],
        },
        "zh": {
            "title": "BANK OF AI —— 整体架构",
            "subtitle": "夹在 AI 与链上世界之间的一套平台。",
            "nodes": [
                ("terminal", "AI", 240, 58),
                ("auto", "BANK OF AI", 340, 72),
                ("terminal", "Web3", 240, 58),
            ],
        },
    },
}


def stack_svg(spec):
    w = 880
    cx = w / 2
    y = 96
    parts = []
    prev = None
    for kind, label, bw, bh in spec["nodes"]:
        if prev is not None:
            parts.append(f'  <line x1="{cx}" y1="{prev}" x2="{cx}" y2="{y}" '
                         f'stroke="{TH["arrow"]}" stroke-width="1.5"/>\n')
        fill, stroke, _ = KIND[kind]
        size = 18 if bh > 60 else 15
        parts.append(
            f'  <rect x="{cx - bw/2}" y="{y}" width="{bw}" height="{bh}" rx="10" fill="{TH["mask"]}"/>\n'
            f'  <rect x="{cx - bw/2}" y="{y}" width="{bw}" height="{bh}" rx="10" fill="{fill}" '
            f'stroke="{stroke}" stroke-width="2"/>\n'
            f'  <text x="{cx}" y="{y + bh/2 + size/3}" fill="{TH["ink"]}" font-size="{size}" '
            f'font-weight="700" text-anchor="middle" letter-spacing="0.5">{E(label)}</text>\n')
        prev = y + bh
        y = prev + 38
    h = int(prev + 34)
    return head(w, h) + title_block(w, spec["title"], spec["subtitle"]) + "".join(parts) + "</svg>\n"


CATALOG = {
    "en": {
        "title": "API Catalog — from a pull request to three consumers",
        "subtitle": "The catalog keeps no database and holds no upstream secrets. It makes services discoverable; it never touches calls or funds.",
        "cols": ["Provider", "Catalog repo (CI)", "Distribution"],
        "col_kinds": ["manual", "auto", "integration"],
        "col_body": [
            ["catalog.json", "pay.md", "(two public files)"],
            ["field & sensitive-data scan", "build static snapshot dist/"],
            ["/api/catalog.json", "/api/providers/<fqn>.json", "/api/pay/<fqn>.json · .md"],
        ],
        "arrows": ["open PR", "publish"],
        "fan_label": "same data, three ways in",
        "consumers": [
            ("Catalog website", "humans browse & compare"),
            ("x402-cli", "search, inspect, paid calls"),
            ("MCP", "Agents call services by name"),
        ],
    },
    "zh": {
        "title": "API Catalog —— 从一个 PR 到三个消费端",
        "subtitle": "目录本身不存数据库、不接收上游密钥：只负责让服务可被发现，不碰调用也不碰资金。",
        "cols": ["服务提供方", "目录仓库（CI）", "分发"],
        "col_kinds": ["manual", "auto", "integration"],
        "col_body": [
            ["catalog.json", "pay.md", "（两个公开文件）"],
            ["字段与敏感信息扫描", "构建静态快照 dist/"],
            ["/api/catalog.json", "/api/providers/<fqn>.json", "/api/pay/<fqn>.json · .md"],
        ],
        "arrows": ["提交 PR", "校验发布"],
        "fan_label": "同一份数据，三种接入方式",
        "consumers": [
            ("目录网站", "供人浏览与比较"),
            ("x402-cli", "搜索、查看、付费调用"),
            ("MCP", "Agent 按名字直接调用"),
        ],
    },
}


def catalog_svg(spec):
    w = 880
    bw, gap, x0 = 225, 62, 40
    y = 100
    parts = []
    for i, (label, kind, body) in enumerate(zip(spec["cols"], spec["col_kinds"], spec["col_body"])):
        x = x0 + i * (bw + gap)
        fill, stroke, _ = KIND[kind]
        h = 46 + 16 * len(body)
        parts.append(f'  <text x="{x}" y="{y - 12}" fill="{stroke}" font-size="10" '
                     f'font-weight="700">{E(label.upper() if label.isascii() else label)}</text>\n')
        parts.append(f'  <rect x="{x}" y="{y}" width="{bw}" height="{h}" rx="8" fill="{TH["mask"]}"/>\n'
                     f'  <rect x="{x}" y="{y}" width="{bw}" height="{h}" rx="8" fill="{fill}" '
                     f'stroke="{stroke}" stroke-width="1.5"/>\n')
        for j, line in enumerate(body):
            parts.append(f'  <text x="{x + 16}" y="{y + 28 + 16 * j}" fill="{TH["ink2"]}" '
                         f'font-size="10">{E(line)}</text>\n')
        if i < 2:
            parts.append(harrow(y + h / 2, x + bw + 6, x + bw + gap - 6,
                                color=KIND[kind][2], label=spec["arrows"][i]))
    top_h = 46 + 16 * max(len(b) for b in spec["col_body"])
    dist_cx = x0 + 2 * (bw + gap) + bw / 2
    fan_y = y + top_h + 46
    parts.append(varrow(dist_cx, y + top_h + 4, fan_y - 4, "amber"))
    parts.append(f'  <text x="{dist_cx - 12}" y="{fan_y - 22}" fill="{TH["ink3"]}" font-size="10" '
                 f'text-anchor="end">{E(spec["fan_label"])}</text>\n')

    cw, cgap = bw, gap
    cy = fan_y + 44
    parts.append(f'  <line x1="{x0 + cw/2}" y1="{fan_y}" x2="{dist_cx}" y2="{fan_y}" '
                 f'stroke="{TH["arrow"]}" stroke-width="1.5"/>\n')
    for i, (name, desc) in enumerate(spec["consumers"]):
        x = x0 + i * (cw + cgap)
        parts.append(varrow(x + cw / 2, fan_y, cy - 4))
        parts.append(box(x, cy, cw, 58, "generic", name, [desc], badge=None))
    h_total = int(cy + 58 + 30)
    return head(w, h_total) + title_block(w, spec["title"], spec["subtitle"]) + "".join(parts) + "</svg>\n"


GATEWAY = {
    "en": {
        "title": "Gateway — a cashier and relay in front of your API",
        "subtitle": "Technically a reverse proxy. Agents only ever hit the gateway address; your upstream API stays exactly as it is.",
        "nodes": [
            ("manual", "Agent", ["pays on-chain from", "its own wallet"]),
            ("auto", "Gateway", ["quote / verify / settle", "(paid endpoints only)"]),
            ("integration", "Your upstream API", ["unchanged — not one", "line of code"]),
        ],
        "arrows": ["request", "forwards"],
        "notes": [
            ("Never a private key", "Settlement uses a wallet address only. Neither side of the gateway ever touches a private key."),
            ("Upstream keys stay isolated", "Your API key lives only gateway-side — local YAML/env if self-hosted, held by us if official. Callers never see it."),
            ("You price each endpoint", "Priced endpoints take the 402 flow; unpriced (price 0) endpoints are forwarded straight through."),
        ],
    },
    "zh": {
        "title": "Gateway —— 挡在你 API 前面的收银台兼中继",
        "subtitle": "本质是一层反向代理。Agent 只访问网关地址，你的上游 API 保持原样。",
        "nodes": [
            ("manual", "Agent", ["用自己的钱包", "在链上付款"]),
            ("auto", "Gateway", ["报价 / 校验 / 结算", "（仅付费端点）"]),
            ("integration", "你的上游 API", ["完全不改", "一行代码"]),
        ],
        "arrows": ["请求", "转发"],
        "notes": [
            ("永远不碰私钥", "结算只用钱包地址，网关两侧都不接触私钥。"),
            ("上游密钥隔离", "API Key 只存在网关一侧 —— 自建则在本地 YAML/env，官方网关则由我们保管，调用方永远看不到。"),
            ("价格按端点自定", "标价的端点走 402 流程；未标价（价格为 0）的端点直接转发。"),
        ],
    },
}


def gateway_svg(spec):
    w = 880
    bw, gap, x0 = 206, 80, 50
    y = 106
    parts = []
    for i, (kind, name, desc) in enumerate(spec["nodes"]):
        x = x0 + i * (bw + gap)
        parts.append(box(x, y, bw, 74, kind, name, desc, badge=None))
        if i < 2:
            parts.append(harrow(y + 37, x + bw + 8, x + bw + gap - 8,
                                color=KIND[kind][2], label=spec["arrows"][i]))
    ny = y + 74 + 40
    for i, (head_txt, body) in enumerate(spec["notes"]):
        yy = ny + i * 52
        parts.append(f'  <rect x="{x0}" y="{yy}" width="{w - 2 * x0}" height="42" rx="8" '
                     f'fill="{TH["note_fill"]}" stroke="{TH["note_stroke"]}" stroke-width="1" '
                     f'stroke-dasharray="6,4"/>\n')
        parts.append(f'  <text x="{x0 + 16}" y="{yy + 18}" fill="{TH["ink2"]}" font-size="11" '
                     f'font-weight="700">{E(head_txt)}</text>\n')
        parts.append(f'  <text x="{x0 + 16}" y="{yy + 34}" fill="{TH["ink3"]}" font-size="10">'
                     f'{E(body)}</text>\n')
    h_total = int(ny + len(spec["notes"]) * 52 + 14)
    return head(w, h_total) + title_block(w, spec["title"], spec["subtitle"]) + "".join(parts) + "</svg>\n"


def main():
    outdir = sys.argv[1]
    os.makedirs(outdir, exist_ok=True)
    written = []

    def emit(name, lang, theme, svg):
        fn = name + ("" if lang == "en" else ".zh") + ("" if theme == "dark" else ".light") + ".svg"
        with open(os.path.join(outdir, fn), "w", encoding="utf-8") as f:
            f.write(svg)
        written.append(fn)

    for theme in ("dark", "light"):
        set_theme(theme)
        for name, langs in T.items():
            for lang, spec in langs.items():
                emit(name, lang, theme, vflow(spec, lang))
        for lang, spec in A["bank-of-ai-architecture"].items():
            emit("bank-of-ai-architecture", lang, theme, stack_svg(spec))
        for lang, spec in CATALOG.items():
            emit("x402-api-catalog-pipeline", lang, theme, catalog_svg(spec))
        for lang, spec in GATEWAY.items():
            emit("x402-gateway-topology", lang, theme, gateway_svg(spec))

    print(len(written), "files")


if __name__ == "__main__":
    main()
