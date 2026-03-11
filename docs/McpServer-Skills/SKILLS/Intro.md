# Introduction

## What are Skills?
Simply put, they are "skill packs."

**Agent Skills** is an open format that allows AI to learn new capabilities. You can think of it as a **plugin package** or a **skill folder**.

Each "skill pack" contains everything needed to complete a specific task:
*   **Instructions**: Tells the AI when to use this skill and how to do it.
*   **Toolbox**: Contains automated scripts or code to help the AI perform tasks.
*   **References**: Professional documents or templates that provide a basis for the AI's work.

In this way, you can "load" new capabilities into your AI at any time, and these capabilities are **reusable, shareable, and controllable**.



## What's inside a skill pack?

Opening a skill folder, you will usually see the following:

| Folder/File | Role | Function |
| :--- | :--- | :--- |
| `SKILL.md` | **Core Brain** | **Required!** Contains the skill's name, description, and detailed operating guidelines. |
| `scripts/` | **Automation Tools** | Optional. Contains script code that the AI can directly run to process data. |
| `references/` | **Knowledge Base** | Optional. Contains professional documents, API specifications, and other reference materials. |
| `assets/` | **Asset Library** | Optional. Contains templates, images, or other resources. |


## Core Principle
The "memory" of large models (i.e., the context window) is extremely valuable and expensive. If all detailed descriptions of all skills are fed to the AI at once, it will not only consume a huge amount of tokens (making it expensive) but also lead to AI distraction, slow responses, and even frequent "hallucinations" (making it less intelligent).

To solve this problem, the Skills architecture introduces the **Progressive Disclosure design philosophy** and a **three-tier graded loading mechanism**.

### "Load on demand" like finding a book in a library
This is like looking up information in a library; you wouldn't move hundreds of books to your desk at once. Instead, you follow an efficient retrieval logic:

*   **Level 1: Metadata (Lightweight Card Catalog) – Scanning Shelf Labels**
    *   **Principle**: When the AI starts, the system only exposes the `name` and `description` of all mounted skills to it.
    *   **Advantage**: Since only "cards" are loaded, resource consumption is extremely low. This allows the AI to easily "remember" and manage hundreds or thousands of skills simultaneously, maintaining fast response times.

*   **Level 2: Instruction Document (Practical Guide) – Opening a Specific Directory**
    *   **Principle**: Only when your needs precisely match a certain skill will the AI read the corresponding `SKILL.md` file.
    *   **Advantage**: This exclusive guide provides the AI with the operational logic, boundary constraints, and Standard Operating Procedures (SOPs) for the current task at critical moments, ensuring that execution stays on track.

*   **Level 3: External Resources (Deep Toolchain) – Consulting Appendices and Practical Operations**
    *   **Principle**: When the task enters deep waters (e.g., executing complex Python scripts, pulling large API data), the AI will only call underlying tools at the moment they are needed.
    *   **Advantage**: These tools run silently in the background, ultimately returning only refined core results to the AI. They hardly occupy the AI's valuable thinking space, achieving a perfect balance of performance and depth.


## Calling Logic

The process of AI selecting and executing a Skill can be divided into four precise steps:

<div style={{ textAlign: 'left' }}>
  <img
    src={require('./image/skill_call.jpg').default}
    alt="RangeOrder1"
    width="100%"
    height="30%"
  />
</div>

### Step 1: Intent Recognition
The AI first parses your natural language request, quickly scans the "identity cards" (metadata) of all Skills in its resource library, and precisely locks onto the skill that best matches the current task.

### Step 2: Rule Internalization
After selecting a Skill, the AI immediately retrieves the corresponding "operation manual" (`SKILL.md`) and carefully studies the specific execution steps, rule limitations, and contextual requirements.

### Step 3: Tool Execution
Based on the manual's guidance, the AI begins to plan its path and execute. When it encounters a specific operational node, it accurately invokes the underlying bound tools or scripts to complete the substantive work.

### Step 4: Feedback and Reflection
After the task is completed, the AI organizes the results into an easy-to-read format and reports them to you; if it encounters missing information or execution anomalies, it will promptly ask you for help.


## `SKILL.md` File Format

`SKILL.md` is written in a way that both AI and humans can understand.
At the top of the `SKILL.md` file, the following `Frontmatter` must be included:
* `name`: A short identifier (skill name)
* `description`: Explains when the skill should be used

The body of the Markdown document contains the actual operating instructions and has no specific restrictions on structure or content.

```yaml
---
name: pdf-processing
description: Extract PDF text, fill forms, merge files. Use when handling PDFs.
---

# PDF Processing

## When to use this skill
Use this skill when the user needs to work with PDF files...

## How to extract text
1. Use pdfplumber for text extraction...

## How to fill forms
...
```

### Advantages:
1.  **Easy to Understand**: Humans can read it, making it convenient for you to modify and optimize the AI's behavior at any time.
2.  **Infinitely Expandable**: It can be simple text instructions or complex automated workflows.
3.  **Easy to Transfer**: A skill is just a folder; you can send it to friends or use it universally across different AI tools.
