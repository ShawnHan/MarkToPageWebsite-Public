import { mkdir, readFile, writeFile } from "node:fs/promises";

const config = JSON.parse(await readFile(new URL("./site.config.json", import.meta.url), "utf8"));
const origin = new URL(config.origin).origin;
const email = config.contactEmail;
if (!/^[\w.+-]+@[\w.-]+\.[a-z]{2,}$/i.test(email)) throw new Error("A public support email is required.");

const output = new URL("./dist/", import.meta.url);
const pagePaths = { home: "", support: "support/", privacy: "privacy/" };
const content = {
  zh: {
    lang: "zh-CN",
    base: "/",
    name: "墨成页",
    skip: "跳至主要内容",
    navigation: "网站导航",
    alternate: "English",
    nav: { home: "产品", support: "技术支持", privacy: "隐私政策" },
    descriptions: {
      home: "在 Mac 上编辑 Markdown，实时预览排版，并导出 A4 或 US Letter 多页 PDF。",
      support: "获取墨成页技术支持，了解如何打开 Markdown 文稿、使用分栏预览和导出 PDF。",
      privacy: "了解墨成页 macOS 应用及官方网站如何处理文档、支持邮件及访问数据。",
    },
    home: {
      title: "在 Mac 上写 Markdown",
      accent: "导出排版好的 PDF",
      intro: "边写边看排版。从技术文档、会议纪要到项目报告，把 Markdown 文稿导出为便于分享和打印的多页 PDF。",
      featuresLink: "查看功能",
      compatibility: "适用于 macOS 14.0 或更高版本",
      editorAlt: "墨成页分栏窗口，左侧是带语法高亮的 Markdown 编辑器，右侧实时显示标题、表格和任务列表。",
      featuresTitle: "编辑、预览和导出",
      features: [
        ["直接编辑 .md 文件", "新建或打开 Markdown 文稿，用语法高亮和行号快速定位标题、列表和代码块。"],
        ["边写边检查排版", "在编辑、分栏和预览视图之间切换，实时检查表格、引用和任务列表的显示效果。"],
        ["选择纸张后导出", "用工具栏或快捷键导出 A4 或 US Letter PDF，保存到你选定的位置。"],
      ],
      pdfTitle: "让长文档自然分页",
      pdfText: "分页时尽量让标题和后续内容留在同一页。表格和代码块在页面空间允许时保持完整，导出后的文字可选中、复制和搜索。",
      pdfAlt: "墨成页实际导出的 A4 PDF 页面，保留标题、表格、任务列表和代码块。",
    },
    support: {
      intro: "了解如何打开文稿、切换预览和导出 PDF。遇到问题时，可以通过邮件联系开发者。",
      startTitle: "从 Markdown 到 PDF",
      steps: [
        "在「文件」菜单中选择「新建」或「打开」，编辑 .md 或 .markdown 文稿。",
        "在工具栏选择「分栏」，查看 Markdown 源文和实时排版。",
        "选择「文件」 › 「导出为 PDF…」，或按 <code>⇧⌘E</code>。选取 A4 或 US Letter，指定保存位置并点击「导出」。",
      ],
      faqTitle: "常见问题",
      questions: [
        ["支持哪些系统？", "墨成页适用于 macOS 14.0 或更高版本。"],
        ["怎样更换 PDF 的纸张大小？", "打开「导出为 PDF…」面板，在「纸张大小」中选取 A4 或 US Letter。"],
        ["为什么标题、表格或代码块会移到下一页？", "导出时会尽量让标题跟随后续内容，并在一页能容纳时保持表格或代码块完整。超过一页长度的内容会继续分页。"],
        ["怎样找到导出的 PDF？", "PDF 保存在你在导出面板选定的位置。导出完成时，也可使用窗口下方的「在访达中显示」或「打开」。"],
      ],
      contactTitle: "联系技术支持",
      contactText: "请在邮件中附上 macOS 版本、应用版本、问题描述和重现步骤。如果需要提供示例文档，请先移除私人或机密信息。",
    },
    privacy: {
      intro: "本政策适用于墨成页 macOS 应用和本网站。",
      updated: "更新日期",
      date: "2026 年 11 月 25 日",
      contactTitle: "隐私联系邮箱",
      contactText: "如需了解、更正或删除你主动提供的个人信息，或撤回相应同意，可以通过以下邮箱联系开发者。",
      sections: [
        ["文档和应用数据", [
          "墨成页在你的 Mac 上编辑、预览 Markdown 并生成 PDF。Markdown 文稿和导出的文件保存在你选择的位置，应用不会将它们上传至开发者服务器。你可以通过 macOS 管理或删除这些文件。",
          "应用无需创建账号。应用未集成广告、使用情况分析或跨应用跟踪服务。布局偏好保存在本机。",
        ]],
        ["链接和外部资源", [
          "文稿中包含网络图片等外部资源时，预览或导出过程可能向资源所在网站发出请求。点击外部链接时，macOS 可在对应应用或浏览器中打开链接。这些网站对请求信息的处理适用各自的隐私政策。",
        ]],
        ["官网访问", [
          "本网站未加入广告或第三方访问统计，也未设置用于跟踪的 Cookie。托管服务商可能为交付网站和维护安全处理 IP 地址、请求时间和浏览器信息。",
        ]],
        ["支持邮件和保存期限", [
          "当你主动发送支持邮件时，开发者会收到你的邮箱、来信内容和你选择提供的附件，并用于答复问题和排查故障。信息在处理请求及依法需要留存的期间保存。你可通过本页邮箱请求访问、更正或删除已提供的信息。",
        ]],
        ["政策更新", [
          "本政策更新时会在此页公布，并修改上方的更新日期。",
        ]],
      ],
    },
  },
  en: {
    lang: "en-US",
    base: "/en/",
    name: "MarkToPage",
    skip: "Skip to content",
    navigation: "Site navigation",
    alternate: "简体中文",
    nav: { home: "Product", support: "Support", privacy: "Privacy" },
    descriptions: {
      home: "Edit Markdown on your Mac, preview the formatting as you write, and export paginated A4 or US Letter PDFs.",
      support: "Get help with MarkToPage for Mac, including opening Markdown files, using Split view, and exporting a PDF.",
      privacy: "Learn how MarkToPage for Mac and this website handle documents, support emails, and website traffic.",
    },
    home: {
      title: "Write in Markdown.",
      accent: "Export as PDF.",
      intro: "See the formatting as you write. Turn technical docs, meeting notes, and project reports into paginated PDFs ready to share or print.",
      featuresLink: "Explore features",
      compatibility: "Requires macOS 14.0 or later",
      editorAlt: "MarkToPage in Split view with highlighted Markdown on the left and a formatted table and task list on the right.",
      featuresTitle: "Edit, preview, and export",
      features: [
        ["Edit .md files", "Create or open a Markdown document and use syntax highlighting and line numbers to find headings, lists, and code blocks."],
        ["Preview as you write", "Switch between Editor, Split, and Preview layouts to check tables, block quotes, and task lists."],
        ["Export to your Mac", "Save an A4 or US Letter PDF to the location you choose, using the toolbar or the keyboard shortcut."],
      ],
      pdfTitle: "Give long documents clean page breaks",
      pdfText: "Pagination keeps headings with the content that follows and preserves tables and code blocks when they fit on a page. Text in the exported PDF stays selectable, copyable, and searchable.",
      pdfAlt: "An A4 PDF exported by MarkToPage showing formatted headings, a table, a task list, and a code block.",
    },
    support: {
      intro: "Get help opening documents, switching preview modes, and exporting PDFs. Email the developer if you run into a problem.",
      startTitle: "From Markdown to PDF",
      steps: [
        "Choose File › New or File › Open to edit a .md or .markdown document.",
        "Select Split in the toolbar to see the Markdown source and formatted preview side by side.",
        "Choose File › Export as PDF… or press <code>Shift-Command-E</code>. Select A4 or US Letter, choose a save location, and click Export.",
      ],
      faqTitle: "Common questions",
      questions: [
        ["Which version of macOS do I need?", "MarkToPage requires macOS 14.0 or later."],
        ["How do I change the PDF paper size?", "Open the Export as PDF panel and select A4 or US Letter from the Paper Size menu."],
        ["Why did a heading, table, or code block move to the next page?", "The exporter keeps headings with the content that follows and keeps tables and code blocks together when they fit on one page. Content longer than a page continues onto the next page."],
        ["Where can I find my exported PDF?", "The PDF is saved to the location you chose in the export panel. When export finishes, you can also use Show in Finder or Open at the bottom of the app window."],
      ],
      contactTitle: "Contact technical support",
      contactText: "Include your macOS version, app version, a description of the problem, and steps to reproduce it. Remove private or confidential information from any sample you share.",
    },
    privacy: {
      intro: "This policy applies to MarkToPage for macOS and this website.",
      updated: "Last updated",
      date: "November 25, 2026",
      contactTitle: "Privacy contact",
      contactText: "Use the email address below to ask about the personal information you provided, request access, correction, or deletion, or withdraw your consent.",
      sections: [
        ["Documents and app data", [
          "MarkToPage edits and previews Markdown and creates PDFs on your Mac. Documents and exported files are saved to the locations you choose. The app does not upload them to the developer's servers. You can manage or delete those files through macOS.",
          "The app does not require an account or include advertising, usage analytics, or cross-app tracking. Layout preferences are stored on your Mac.",
        ]],
        ["Links and external resources", [
          "If a document references external resources such as online images, previewing or exporting that document may send a request to the site hosting the resource. Clicking an external link can open it in a browser or the corresponding app. Those sites handle request information under their own privacy policies.",
        ]],
        ["Website visits", [
          "This website does not add advertising, third-party analytics, or tracking cookies. The hosting provider may process IP addresses, request times, and browser information to deliver the site and maintain its security.",
        ]],
        ["Support email and retention", [
          "If you email support, the developer receives your email address, message, and any attachments you choose to send. The developer uses them to respond and troubleshoot. The information is kept for as long as needed to handle your request or meet applicable recordkeeping requirements. You can use the address on this page to request access, correction, or deletion.",
        ]],
        ["Policy updates", [
          "Changes to this policy will appear here with an updated date.",
        ]],
      ],
    },
  },
};

function escape(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
}

function route(locale, page) {
  return locale.base + pagePaths[page];
}

function contactCard(data) {
  return `<aside class="contact">
    <h2>${data.contactTitle}</h2>
    <p>${data.contactText}</p>
    <a class="email" href="mailto:${escape(email)}">${escape(email)}</a>
  </aside>`;
}

function home(localeKey, locale) {
  const data = locale.home;
  return `<section class="hero wrap">
    <div>
      <h1>${data.title}<span>${data.accent}</span></h1>
      <p>${data.intro}</p>
      <div class="actions">
        <a class="button" href="#features">${data.featuresLink}</a>
        <a class="button secondary" href="${route(locale, "support")}">${locale.nav.support}</a>
      </div>
      <p class="compatibility">${data.compatibility}</p>
    </div>
    <figure class="visual">
      <img src="/assets/editor-${localeKey}.jpg" width="1200" height="800" alt="${escape(data.editorAlt)}" fetchpriority="high">
    </figure>
  </section>
  <section class="features" id="features">
    <div class="wrap">
      <h2 class="section-title">${data.featuresTitle}</h2>
      <div class="feature-grid">
        ${data.features.map(([title, text]) => `<article><h3>${title}</h3><p>${text}</p></article>`).join("\n        ")}
      </div>
    </div>
  </section>
  <section class="result wrap">
    <figure class="result-frame">
      <img src="/assets/pdf-${localeKey}.jpg" width="636" height="900" alt="${escape(data.pdfAlt)}" loading="lazy">
    </figure>
    <div>
      <h2 class="section-title">${data.pdfTitle}</h2>
      <p>${data.pdfText}</p>
      <div class="actions"><a href="${route(locale, "support")}">${locale.nav.support}</a></div>
    </div>
  </section>`;
}

function support(locale) {
  const data = locale.support;
  return `<section class="page-intro wrap">
    <h1>${locale.nav.support}</h1>
    <p>${data.intro}</p>
  </section>
  <div class="info-grid wrap">
    <article class="info-content">
      <section>
        <h2>${data.startTitle}</h2>
        <ol>${data.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
      </section>
      <section>
        <h2>${data.faqTitle}</h2>
        ${data.questions.map(([question, answer]) => `<details><summary>${question}</summary><p>${answer}</p></details>`).join("\n        ")}
      </section>
    </article>
    ${contactCard(data)}
  </div>`;
}

function privacy(localeKey, locale) {
  const data = locale.privacy;
  const title = localeKey === "zh" ? "隐私政策" : "Privacy Policy";
  return `<section class="page-intro wrap">
    <h1>${title}</h1>
    <p>${data.intro} ${data.updated} <time datetime="2026-11-25">${data.date}</time>${localeKey === "zh" ? "。" : "."}</p>
  </section>
  <div class="info-grid wrap">
    <article class="info-content">
      ${data.sections.map(([section, paragraphs]) => `<section>
        <h2>${section}</h2>
        ${paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("\n        ")}
      </section>`).join("\n      ")}
    </article>
    ${contactCard(data)}
  </div>`;
}

function html(localeKey, page) {
  const locale = content[localeKey];
  const other = content[localeKey === "zh" ? "en" : "zh"];
  const title = page === "home" ? `${locale.name} · ${localeKey === "zh" ? "Markdown 编辑与 PDF 导出" : "Markdown to PDF for Mac"}`
    : `${page === "privacy" && localeKey === "en" ? "Privacy Policy" : locale.nav[page]} · ${locale.name}`;
  const body = page === "home" ? home(localeKey, locale) : page === "support" ? support(locale) : privacy(localeKey, locale);
  const navigation = Object.keys(pagePaths)
    .map((key) => `<a href="${route(locale, key)}"${key === page ? ' aria-current="page"' : ""}>${locale.nav[key]}</a>`)
    .join("\n        ");
  return `<!doctype html>
<html lang="${locale.lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${escape(locale.descriptions[page])}">
  <link rel="canonical" href="${origin}${route(locale, page)}">
  <link rel="alternate" hreflang="zh-Hans" href="${origin}${route(content.zh, page)}">
  <link rel="alternate" hreflang="en" href="${origin}${route(content.en, page)}">
  <link rel="icon" href="/assets/icon.png" type="image/png">
  <link rel="stylesheet" href="/assets/site.css">
</head>
<body>
  <a class="skip" href="#main">${locale.skip}</a>
  <header class="site-header">
    <div class="header-row wrap">
      <a class="brand" href="${locale.base}"><img src="/assets/icon.png" width="35" height="35" alt=""><span>${locale.name}</span></a>
      <nav class="site-nav" aria-label="${locale.navigation}">
        ${navigation}
        <a class="language" lang="${other.lang}" hreflang="${other.lang}" href="${route(other, page)}">${locale.alternate}</a>
      </nav>
    </div>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="footer-row wrap">
      <p>© 2026 ${locale.name}</p>
      <nav aria-label="${localeKey === "zh" ? "页脚导航" : "Footer navigation"}">
        <a href="${route(locale, "support")}">${locale.nav.support}</a>
        <a href="${route(locale, "privacy")}">${locale.nav.privacy}</a>
      </nav>
    </div>
  </footer>
</body>
</html>\n`;
}

for (const [localeKey, locale] of Object.entries(content)) {
  for (const page of Object.keys(pagePaths)) {
    const directory = new URL(`.${route(locale, page)}`, output);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL("index.html", directory), html(localeKey, page));
  }
}
