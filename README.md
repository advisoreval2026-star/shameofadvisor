# 导师评议可视化 · Advisor Review Visualization

A static HTML visualization over the public community "Hall of Shame of advisor" Google Doc.

## Files
- `index.html` — viewer shell: search, filter by region/status, cards, modal, rebuttal form
- `data.js` — advisor entries (name / university / region / flags). **Specific allegation text is intentionally omitted** — the modal links back to the source doc for details
- `README.md` — this file

## Usage
Open `index.html` in any modern browser. No server required.

## Design choices
- **Photos**: not embedded. Field `photo` exists on each entry — add a URL manually if desired (and if you are comfortable with the reputational implications).
- **Comments / rebuttals**: the `comments` and `rebuttals` fields on each entry are empty by default; the modal directs readers to the source doc. You can paste content into these fields locally.
- **Local rebuttal form**: submissions are stored in `localStorage` under key `advisor_local_rebuttals_v1`. Use the "Export" toolbar button to download them as JSON. There is no server; nothing is uploaded.
- **Email fallback**: the "📧 Email" button opens the user's mail client with a pre-filled draft.
- **Source-doc deep link**: each modal has a button that opens the original Google Doc for formal rebuttal.

## Disclaimers
This page is a navigation shell over a crowdsourced document. Status flags (`disputed`, `has_rebuttal`) reflect only how the source doc presents the entry. This tool does not verify, publish, or endorse any allegation. If you are an advisor mentioned, please use the rebuttal form or reply in the source doc.
