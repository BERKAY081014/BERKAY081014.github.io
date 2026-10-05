/* =========================================================
   Berkay Bilgin – Portfolyo | main.js
   ========================================================= */

/* ---------------------------------------------------------
   İLETİŞİM FORMU AYARLARI
   mode:
     "formsubmit" -> Kayıt gerektirmez. İlk gönderimde
                     kgberkay10@gmail.com adresine bir aktivasyon
                     maili gelir, "Activate" deyince çalışmaya başlar.
     "php"        -> Hosting PHP destekliyorsa contact.php kullanılır.
     "mailto"     -> Ziyaretçinin kendi e-posta uygulamasını açar.
   Herhangi bir hata olursa otomatik olarak "mailto" yedeğine düşer.
--------------------------------------------------------- */
const CONTACT_CONFIG = {
  mode: "formsubmit",
  email: "kgberkay10@gmail.com",
  phpEndpoint: "contact.php",
};

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Yıl ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- Navbar, scroll progress, back-to-top ---------- */
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("scrollProgress");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle("scrolled", y > 30);
    backToTop.classList.toggle("show", y > 600);
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobil menü ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  const closeMenu = () => {
    navToggle.classList.remove("open");
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeMenu());

  /* ---------- Smooth scroll (tüm # linkler) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- Aktif menü linki ---------- */
  const sections = document.querySelectorAll("main section[id]");
  const navMap = {};
  document.querySelectorAll(".nav-link").forEach((l) => (navMap[l.getAttribute("href").slice(1)] = l));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          Object.values(navMap).forEach((l) => l.classList.remove("active"));
          navMap[entry.target.id]?.classList.add("active");
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // Aynı kapsayıcıdaki öğelere kademeli gecikme
        const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
        el.style.transitionDelay = `${Math.max(0, siblings.indexOf(el)) * 110}ms`;
        el.classList.add("visible");
        revealObserver.unobserve(el);
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Sayaç animasyonu ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const end = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || "";
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(end * eased) + (p === 1 ? suffix : "");
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Proje kartı 3D tilt ---------- */
  if (!prefersReducedMotion && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener("mouseleave", () => (card.style.transform = ""));
    });
  }

  /* ---------- QR görseli kontrolü ---------- */
  const qrImg = document.getElementById("qrImage");
  if (qrImg) {
    const markMissing = () => qrImg.closest(".qr-card__frame")?.classList.add("is-missing");
    qrImg.addEventListener("error", markMissing);
    if (qrImg.complete && qrImg.naturalWidth === 0) markMissing();
  }

  /* ---------- Hassas fare ışığı (Spotlight) ---------- */
  initMouseGlow(prefersReducedMotion);

  /* ---------- İletişim formu ---------- */
  initContactForm();

  /* ---------- Proje Kod Arşivi (Code Hub) ---------- */
  initCodeHub();

  /* ---------- Mühendislik Sözlüğü (kaydırmalı) ---------- */
  initGlossary(prefersReducedMotion);
});

/* =========================================================
   MOUSE GLOW – Doğal, modern ve zarif ortam aydınlatması
   ========================================================= */
function initMouseGlow(reduced) {
  if (reduced || !window.matchMedia("(hover: hover)").matches) return;
  const glow = document.getElementById("mouseGlow");
  if (!glow) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;
  let rafId = null;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(render);
  }, { passive: true });

  function render() {
    currentX += (mouseX - currentX) * 0.12;
    currentY += (mouseY - currentY) * 0.12;
    glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

    if (Math.abs(mouseX - currentX) > 0.5 || Math.abs(mouseY - currentY) > 0.5) {
      rafId = requestAnimationFrame(render);
    } else {
      rafId = null;
    }
  }
}

/* =========================================================
   İLETİŞİM FORMU
   ========================================================= */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");
  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    message: form.querySelector("#message"),
  };

  const setError = (key, msg) => {
    const group = fields[key].closest(".form-group");
    group.classList.toggle("invalid", !!msg);
    form.querySelector(`.form-error[data-for="${key}"]`).textContent = msg || "";
  };

  const validate = () => {
    let ok = true;
    const name = fields.name.value.trim();
    const email = fields.email.value.trim();
    const message = fields.message.value.trim();

    if (name.length < 2) { setError("name", "Lütfen adınızı girin."); ok = false; } else setError("name");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { setError("email", "Geçerli bir e-posta adresi girin."); ok = false; } else setError("email");
    if (message.length < 10) { setError("message", "Mesajınız en az 10 karakter olmalı."); ok = false; } else setError("message");
    return ok;
  };

  Object.keys(fields).forEach((k) =>
    fields[k].addEventListener("input", () => fields[k].closest(".form-group").classList.contains("invalid") && validate())
  );

  const setStatus = (msg, type = "") => {
    status.textContent = msg;
    status.className = `form-status ${type}`;
  };

  const openMailto = (data) => {
    const subject = encodeURIComponent(`Portfolyo İletişim – ${data.name}`);
    const body = encodeURIComponent(`Ad: ${data.name}\nE-posta: ${data.email}\n\n${data.message}`);
    window.location.href = `mailto:${CONTACT_CONFIG.email}?subject=${subject}&body=${body}`;
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    setStatus("");
    if (form._honey.value) return; // bot
    if (!validate()) return;

    const data = {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      message: fields.message.value.trim(),
    };

    if (CONTACT_CONFIG.mode === "mailto") {
      openMailto(data);
      setStatus("E-posta uygulamanız açılıyor…", "success");
      return;
    }

    btn.classList.add("loading");
    btn.querySelector(".btn__text").textContent = "Gönderiliyor…";

    try {
      let res;
      if (CONTACT_CONFIG.mode === "php") {
        res = await fetch(CONTACT_CONFIG.phpEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(data),
        });
      } else {
        res = await fetch(`https://formsubmit.co/ajax/${CONTACT_CONFIG.email}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            ...data,
            _subject: `Portfolyo İletişim – ${data.name}`,
            _replyto: data.email,
            _template: "table",
            _captcha: "false",
          }),
        });
      }

      const json = await res.json().catch(() => ({}));
      const success = res.ok && (json.success === true || json.success === "true");
      if (!success) throw new Error(json.message || "Gönderim başarısız");

      setStatus("✓ Mesajınız iletildi! En kısa sürede dönüş yapacağım.", "success");
      form.reset();
    } catch (err) {
      console.warn("Form gönderilemedi, mailto yedeğine geçiliyor:", err);
      setStatus("Sunucuya ulaşılamadı, e-posta uygulamanız açılıyor…", "error");
      setTimeout(() => openMailto(data), 900);
    } finally {
      btn.classList.remove("loading");
      btn.querySelector(".btn__text").textContent = "Mesajı Gönder";
    }
  });
}

/* =========================================================
   CODE-HUB – Proje Kaynak Kodları ve GitHub Entegrasyonu
   ========================================================= */
function initCodeHub() {
  const tabs = document.querySelectorAll(".code-hub__tab");
  const codeDisplayArea = document.getElementById("codeDisplayArea");
  const activeFileName = document.getElementById("activeFileName");
  const activeLanguageBadge = document.getElementById("activeLanguageBadge");
  const activeProjectTitle = document.getElementById("activeProjectTitle");
  const activeProjectSummary = document.getElementById("activeProjectSummary");
  const activeProjectFolder = document.querySelector("#activeProjectFolder span");
  const gitCommandDisplay = document.getElementById("gitCommandDisplay");
  const copyCodeBtn = document.getElementById("copyCodeBtn");
  const copyBtnText = document.getElementById("copyBtnText");
  const copyGitCmdBtn = document.getElementById("copyGitCmdBtn");
  const copyGitCmdText = document.getElementById("copyGitCmdText");
  const openNewRepoBtn = document.getElementById("openNewRepoBtn");

  if (!tabs.length || !codeDisplayArea) return;

  let currentProjectKey = "firin";

  const loadProject = (key) => {
    const data = window.PROJECT_CODES ? window.PROJECT_CODES[key] : null;
    if (!data) return;

    currentProjectKey = key;

    tabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.project === key);
    });

    codeDisplayArea.textContent = data.code;
    if (activeFileName) activeFileName.textContent = data.filename;
    if (activeLanguageBadge) activeLanguageBadge.textContent = data.langLabel;
    if (activeProjectTitle) activeProjectTitle.textContent = data.title;
    if (activeProjectSummary) activeProjectSummary.textContent = data.summary;
    if (activeProjectFolder) activeProjectFolder.textContent = "github-projeleri/" + data.folder;
    if (gitCommandDisplay) gitCommandDisplay.textContent = data.gitCommand;

    if (openNewRepoBtn) {
      openNewRepoBtn.href = `https://github.com/BERKAY081014/${data.repoName}`;
      const span = openNewRepoBtn.querySelector("span");
      if (span) span.textContent = "GitHub Deposuna Git";
    }
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.project;
      if (key && key !== currentProjectKey) {
        loadProject(key);
      }
    });
  });

  // Kodu Kopyala Butonu
  if (copyCodeBtn) {
    copyCodeBtn.addEventListener("click", async () => {
      const data = window.PROJECT_CODES ? window.PROJECT_CODES[currentProjectKey] : null;
      if (!data) return;

      try {
        await navigator.clipboard.writeText(data.code);
        copyCodeBtn.classList.add("copied");
        copyBtnText.textContent = "✓ Kopyalandı!";
        setTimeout(() => {
          copyCodeBtn.classList.remove("copied");
          copyBtnText.textContent = "Kodu Kopyala";
        }, 2200);
      } catch (err) {
        console.warn("Panoya kopyalanamadı:", err);
      }
    });
  }

  // Git Komutunu Kopyala Butonu
  if (copyGitCmdBtn) {
    copyGitCmdBtn.addEventListener("click", async () => {
      const data = window.PROJECT_CODES ? window.PROJECT_CODES[currentProjectKey] : null;
      if (!data) return;

      try {
        await navigator.clipboard.writeText(data.gitCommand);
        copyGitCmdBtn.classList.add("copied");
        copyGitCmdText.textContent = "✓ Komutlar Kopyalandı!";
        setTimeout(() => {
          copyGitCmdBtn.classList.remove("copied");
          copyGitCmdText.textContent = "Komutları Kopyala";
        }, 2200);
      } catch (err) {
        console.warn("Panoya kopyalanamadı:", err);
      }
    });
  }

  // Varsayılan olarak ilk projeyi yükle
  loadProject("firin");
}

/* =========================================================
   MÜHENDİSLİK SÖZLÜĞÜ – Kaydırmalı günlük terim kartları
   Veri: js/engineering-terms.js
   ========================================================= */
function initGlossary(reduced) {
  const track = document.getElementById("glossaryTrack");
  const dotsBox = document.getElementById("glossaryDots");
  const counter = document.getElementById("glossaryCounter");
  const dateEl = document.getElementById("glossaryDate");
  const prevBtn = document.getElementById("glossaryPrev");
  const nextBtn = document.getElementById("glossaryNext");
  const todayBtn = document.getElementById("glossaryToday");
  const randomBtn = document.getElementById("glossaryRandom");
  const terms = window.ENGINEERING_TERMS;

  if (!track || !Array.isArray(terms) || !terms.length) return;

  const total = terms.length;
  const pad = (n) => String(n).padStart(2, "0");
  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* Günün terimi: yılın kaçıncı günü olduğuna göre döner, her gün değişir */
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const todayIndex = dayOfYear % total;

  if (dateEl) {
    dateEl.textContent =
      "Bugün: " + now.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }

  const heroDailyTitle = document.getElementById("heroDailyTitle");
  if (heroDailyTitle && terms[todayIndex]) {
    heroDailyTitle.textContent = terms[todayIndex].term;
  }

  /* ---- Kartları oluştur ---- */
  track.innerHTML = terms
    .map((t, i) => {
      const vars = (t.vars || []).map(([s, d]) => `<li><b>${esc(s)}</b><span>${esc(d)}</span></li>`).join("");
      const project = t.project
        ? `<a class="term-card__project" href="${esc(t.project.href)}">↳ Projemde kullandım: ${esc(t.project.label)}</a>`
        : "";
      return `
        <div class="glossary__slide${i === todayIndex ? " is-today" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} / ${total}">
          <article class="term-card">
            <div class="term-card__main">
              <div class="term-card__meta">
                <span class="term-card__cat">${esc(t.category)}</span>
                ${i === todayIndex ? '<span class="term-card__today">★ Günün Terimi</span>' : ""}
              </div>
              <h3 class="term-card__title">${esc(t.term)}</h3>
              <p class="term-card__en mono">${esc(t.en)}</p>
              <p class="term-card__simple">${esc(t.simple)}</p>
              <div class="term-card__real">
                <span class="term-card__label">Gerçek hayatta</span>
                <p>${esc(t.real)}</p>
              </div>
              ${project}
            </div>
            <div class="term-card__formula-panel">
              <span class="term-card__label">Formül</span>
              <pre class="term-card__formula">${esc(t.formula)}</pre>
              <ul class="term-card__vars">${vars}</ul>
              <div class="term-card__example">
                <span class="term-card__label">Örnek hesap</span>
                ${esc(t.example)}
              </div>
            </div>
          </article>
        </div>`;
    })
    .join("");

  /* ---- Noktalar ---- */
  dotsBox.innerHTML = terms
    .map(
      (t, i) =>
        `<button type="button" class="glossary__dot${i === todayIndex ? " today" : ""}" role="tab" data-i="${i}" aria-label="${esc(t.term)}" title="${esc(t.term)}"></button>`
    )
    .join("");
  const dots = dotsBox.querySelectorAll(".glossary__dot");

  let current = todayIndex;

  const render = (i) => {
    current = i;
    counter.textContent = `${pad(i + 1)} / ${pad(total)}`;
    dots.forEach((d, k) => {
      d.classList.toggle("active", k === i);
      d.setAttribute("aria-selected", String(k === i));
    });
  };

  const goTo = (i, smooth = true) => {
    const idx = (i + total) % total; // başa/sona sarma
    track.scrollTo({ left: idx * track.clientWidth, behavior: smooth && !reduced ? "smooth" : "auto" });
    render(idx);
  };

  /* Kaydırma konumundan aktif kartı bul (parmakla kaydırınca da çalışır) */
  let ticking = false;
  track.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const idx = Math.max(0, Math.min(total - 1, Math.round(track.scrollLeft / (track.clientWidth || 1))));
        if (idx !== current) render(idx);
      });
    },
    { passive: true }
  );

  /* ---- Butonlar ---- */
  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));
  todayBtn.addEventListener("click", () => goTo(todayIndex));
  randomBtn.addEventListener("click", () => {
    if (total < 2) return;
    let r;
    do { r = Math.floor(Math.random() * total); } while (r === current);
    goTo(r);
  });
  dots.forEach((d) => d.addEventListener("click", () => goTo(Number(d.dataset.i))));

  /* ---- Klavye ---- */
  track.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(current + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); goTo(current - 1); }
    else if (e.key === "Home") { e.preventDefault(); goTo(0); }
    else if (e.key === "End") { e.preventDefault(); goTo(total - 1); }
  });

  /* ---- Fare ile sürükleme (dokunmatik ekranda tarayıcı kendisi kaydırır) ---- */
  let isDown = false, moved = false, startX = 0, startLeft = 0;

  track.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    isDown = true;
    moved = false;
    startX = e.clientX;
    startLeft = track.scrollLeft;
  });
  window.addEventListener("pointermove", (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 5) {
      moved = true;
      track.classList.add("dragging");
    }
    if (moved) track.scrollLeft = startLeft - dx;
  });
  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove("dragging");
    if (moved) {
      const idx = Math.round(track.scrollLeft / (track.clientWidth || 1));
      goTo(Math.max(0, Math.min(total - 1, idx)));
    }
  };
  window.addEventListener("pointerup", endDrag);
  window.addEventListener("pointercancel", endDrag);
  track.addEventListener("selectstart", (e) => { if (isDown && moved) e.preventDefault(); });
  // Sürükleme sonrası yanlışlıkla link tıklanmasını engelle
  track.addEventListener("click", (e) => {
    if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
  }, true);

  /* Pencere boyutu değişince konumu koru */
  window.addEventListener("resize", () => goTo(current, false));

  /* Açılışta bugünün terimini göster */
  goTo(todayIndex, false);
}

