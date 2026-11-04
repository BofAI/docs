"""Read B.AI Key without echoing it, then start Codex in this folder."""
import getpass
import os
from pathlib import Path
import shutil
import subprocess
import sys

os.chdir(Path(__file__).resolve().parent)
if not shutil.which("codex"):
    sys.exit("找不到 codex 命令，请先按 OpenAI 官方文档安装 Codex CLI。")
key = getpass.getpass("B.AI API Key（隐藏输入）: ").strip()
if not key:
    sys.exit("未输入 Key，已停止。")
env = os.environ.copy()
env["BAI_API_KEY"] = key
sys.exit(subprocess.call(["codex"], env=env))
