/**
 * <lorem-ipsum> — classic lorem ipsum placeholder text generator. Zero dependencies.
 * Built & maintained by SGBP — Singapore Build Partners (https://sgbp.tech). MIT.
 */
const LOREM = ("lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum").split(" ");
class LoremIpsum extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: "open" }); this.count = 3; this.unit = "paragraphs"; this.startClassic = true; }
  connectedCallback() { this.render(); }
  _rand(n) { return Math.floor(Math.random() * n); }
  _sentence() {
    const len = 8 + this._rand(8);
    const words = Array.from({ length: len }, () => LOREM[this._rand(LOREM.length)]);
    let s = words.join(" ");
    return s.charAt(0).toUpperCase() + s.slice(1) + ".";
  }
  _paragraph() {
    const n = 3 + this._rand(3);
    return Array.from({ length: n }, () => this._sentence()).join(" ");
  }
  _gen() {
    let out = [];
    if (this.unit === "paragraphs") out = Array.from({ length: this.count }, () => this._paragraph());
    else if (this.unit === "sentences") out = [Array.from({ length: this.count }, () => this._sentence()).join(" ")];
    else out = [Array.from({ length: this.count }, () => LOREM[this._rand(LOREM.length)]).join(" ")];
    let text = out.join("\n\n");
    if (this.startClassic && this.unit !== "words")
      text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + text;
    return text;
  }
  _render() { this.shadowRoot.querySelector("#out").value = this._gen(); }
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        *,*::before,*::after{box-sizing:border-box}
        :host{display:block;width:100%;max-width:560px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
        .card{border:1px solid #e2e2e2;border-radius:12px;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.06);padding:16px}
        .ctrls{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:12px}
        .fld label{display:block;font-size:12px;font-weight:600;color:#555;margin-bottom:5px}
        input[type=number]{width:80px;padding:8px 10px;border:1px solid #ccc;border-radius:8px;font-size:16px}
        select{padding:8px 10px;border:1px solid #ccc;border-radius:8px;font-size:14px;background:#fff}
        .chk{display:flex;align-items:center;gap:6px;font-size:13px;color:#555;padding-bottom:8px}
        textarea{width:100%;min-height:150px;padding:12px;border:1px solid #ccc;border-radius:8px;font-size:14px;line-height:1.6;resize:vertical}
        .btns{display:flex;gap:8px;margin-top:12px}
        button{font:inherit;font-size:12px;font-weight:700;border-radius:8px;padding:9px 14px;cursor:pointer}
        .gen{color:#fff;background:#EB0028;border:0}
        .copy{color:#555;background:#fff;border:1px solid #ccc}
        .reset{color:#555;background:#fff;border:1px solid #ccc}
      </style>
      <div class="card">
        <div class="ctrls">
          <div class="fld"><label>How many</label><input type="number" id="count" min="1" max="50" value="${this.count}"></div>
          <div class="fld"><label>Unit</label><select id="unit">
            <option value="paragraphs">Paragraphs</option><option value="sentences">Sentences</option><option value="words">Words</option>
          </select></div>
          <label class="chk"><input type="checkbox" id="classic" ${this.startClassic ? "checked" : ""}> Start with "Lorem ipsum"</label>
        </div>
        <textarea id="out" readonly></textarea>
        <div class="btns">
          <button class="gen" id="gen">Generate</button>
          <button class="copy" id="copy">Copy</button>
          <button class="reset" id="reset">Reset</button>
        </div>
      </div>`;
    const $ = (s) => this.shadowRoot.querySelector(s);
    $("#count").addEventListener("input", (e) => { this.count = Math.min(50, Math.max(1, +e.target.value || 1)); this._render(); });
    $("#unit").addEventListener("change", (e) => { this.unit = e.target.value; this._render(); });
    $("#classic").addEventListener("change", (e) => { this.startClassic = e.target.checked; this._render(); });
    $("#gen").addEventListener("click", () => this._render());
    $("#copy").addEventListener("click", () => { navigator.clipboard && navigator.clipboard.writeText($("#out").value); const b = $("#copy"), o = b.textContent; b.textContent = "Copied"; setTimeout(() => b.textContent = o, 900); });
    $("#reset").addEventListener("click", () => { this.count = 3; this.unit = "paragraphs"; this.startClassic = true; this.render(); });
    this._render();
  }
}
if (!customElements.get("lorem-ipsum")) customElements.define("lorem-ipsum", LoremIpsum);
