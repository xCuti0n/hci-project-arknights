// Main JS
document.addEventListener("DOMContentLoaded", () => {
  console.log("HCI Project loaded!");

  // Resume woosh sound from previous page
  const wooshStart = sessionStorage.getItem("wooshStartTime");
  if (wooshStart) {
    sessionStorage.removeItem("wooshStartTime");
    const elapsed = (Date.now() - parseInt(wooshStart)) / 1000;
    const wooshResume = new Audio("sounds/wooshui.mp3");
    wooshResume.addEventListener("loadedmetadata", () => {
      if (elapsed < wooshResume.duration) {
        wooshResume.currentTime = elapsed;
        wooshResume.play().catch(() => {});
      }
    });
  }

  // Start screen: click to dismiss (index page only)
  const startScreen = document.getElementById("start-screen");
  if (startScreen) {
    startScreen.style.cursor = "pointer";
    startScreen.addEventListener("click", () => {
      const clickSound = new Audio("sounds/clickwoosh.mp3");
      clickSound.play().catch(() => {});

      // Play home background music (user click)
      try {
        const bgMusic = new Audio("sounds/track1.mp3");
        bgMusic.loop = true;
        bgMusic.volume = 0.6;
        bgMusic.play().catch(() => {});
        // save to window for debugging/control
        window.__bgMusic = bgMusic;
      } catch (e) {}

      // pop the logo
      const logo = startScreen.querySelector(".start-logo");
      if (logo) logo.classList.add("pop");

      // fade out then remove
      setTimeout(() => {
        startScreen.classList.add("fade-out");
        startScreen.addEventListener("transitionend", () => {
          startScreen.remove();
        });
      }, 400);
    });
  }

  // Footer: slide up when visible
  const footer = document.querySelector("footer");
  if (footer) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            footer.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(footer);
  }

  // Banner zoom transition (main page)
  document.querySelectorAll(".nav-card").forEach((card, index) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const href = card.getAttribute("href");
      const soundFile = `sounds/${index + 1}.ogg`;
      const rect = card.getBoundingClientRect();

      // fade out other banners
      document.querySelectorAll(".nav-card").forEach((other) => {
        if (other !== card) other.classList.add("fade-out");
      });

      // play select sound
      const selectSound = new Audio("sounds/clickui.mp3");
      selectSound.play().catch(() => {});

      // create overlay and clone
      const overlay = document.createElement("div");
      overlay.className = "zoom-overlay";

      const clone = document.createElement("div");
      clone.className = "zoom-clone";
      clone.innerHTML = card.innerHTML;
      clone.style.width = rect.width + "px";
      clone.style.height = rect.height + "px";
      clone.style.position = "absolute";
      clone.style.left = rect.left + "px";
      clone.style.top = rect.top + "px";
      clone.style.color = "#fff";
      clone.style.fontSize = "1.5rem";
      clone.style.fontWeight = "700";

      // style cloned image
      const cloneImg = clone.querySelector("img");
      if (cloneImg) {
        cloneImg.style.width = "85%";
        cloneImg.style.height = "auto";
        cloneImg.style.objectFit = "contain";
      }

      overlay.appendChild(clone);
      document.body.appendChild(overlay);

      // hide original card
      card.style.opacity = "0";

      // small zoom then sound
      requestAnimationFrame(() => {
        clone.classList.add("zoom-first");
        const sound = new Audio(soundFile);
        sound.play().catch(() => {});
      });

      // bigger zoom then fade to next page
      setTimeout(() => {
        clone.classList.remove("zoom-first");
        clone.classList.add("zoom-second");

        const wooshSound = new Audio("sounds/wooshui.mp3");
        wooshSound.play().catch(() => {});

        // save time so next page can resume sound
        sessionStorage.setItem("wooshStartTime", Date.now().toString());

        document.body.style.transition = "opacity 0.5s ease";
        document.body.style.opacity = "0";
      }, 1400);

      setTimeout(() => {
        window.location.href = href;
      }, 1900);
    });
  });

  // Slide transition for normal links
  document.querySelectorAll("a[href]").forEach((link) => {
    if (link.classList.contains("nav-card")) return;
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http")) return;

      e.preventDefault();
      // play nav click sound
      const navSound = new Audio("sounds/clickwave.mp3");
      navSound.play().catch(() => {});

      document.body.classList.add("slide-out");
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  // Play figures page music when on figures page
  if (document.body && document.body.classList.contains("page-figures")) {
    try {
      if (window.__bgMusic && typeof window.__bgMusic.pause === "function") {
        window.__bgMusic.pause();
      }
      const figuresMusic = new Audio("sounds/track2.mp3");
      figuresMusic.loop = true;
      figuresMusic.volume = 0.6;
      figuresMusic.play().catch(() => {});
      window.__figuresMusic = figuresMusic;
    } catch (e) {}
  }

  // Play about page music when on about page
  if (document.body && document.body.classList.contains("page-aboutus")) {
    try {
      // stop any existing bg music
      if (window.__bgMusic && typeof window.__bgMusic.pause === "function") {
        window.__bgMusic.pause();
      }
      if (
        window.__figuresMusic &&
        typeof window.__figuresMusic.pause === "function"
      ) {
        window.__figuresMusic.pause();
      }
      const aboutMusic = new Audio("sounds/aboutus.mp3");
      aboutMusic.loop = true;
      aboutMusic.volume = 0.6;
      aboutMusic.play().catch(() => {});
      window.__aboutMusic = aboutMusic;
    } catch (e) {}
  }

  // Play contact page music when on contact page
  if (document.body && document.body.classList.contains("page-contactus")) {
    try {
      if (window.__bgMusic && typeof window.__bgMusic.pause === "function") {
        window.__bgMusic.pause();
      }
      if (
        window.__figuresMusic &&
        typeof window.__figuresMusic.pause === "function"
      ) {
        window.__figuresMusic.pause();
      }
      const contactMusic = new Audio("sounds/contactus.mp3");
      contactMusic.loop = true;
      contactMusic.volume = 0.6;
      contactMusic.play().catch(() => {});
      window.__contactMusic = contactMusic;
    } catch (e) {}
  }

  // Timeline interactions (home page)
  const timeline = document.querySelectorAll(".timeline .node");
  const previewArt = document.querySelector(".preview-art");
  const previewCaption = document.querySelector(".preview-caption");
  const actTitle = document.querySelector(".act-title");
  const actSub = document.querySelector(".act-sub");

  const items = [
    {
      title: "Lappland Saluzzo",
      subtitle: "Siracusa",
      image: "images/char1.png",
      caption: "Siracusa",
      bg: "images/1timeline.png",
    },
    {
      title: "Celinia Texas",
      subtitle: "Penguin Logistics",
      image: "images/char2.png",
      caption: "Penguin Logistics",
      bg: "images/2timeline.png",
    },
    {
      title: "Ch'en Hui-chieh",
      subtitle: "Lungmen Guard Department",
      image: "images/char3.png",
      caption: "Lungmen Guard Department",
      bg: "images/3timeline.png",
    },
    {
      title: "Amiya",
      subtitle: "Rhodes Island",
      image: "images/char4.png",
      caption: "Rhodes Island",
      bg: "images/4timeline.png",
    },
  ];

  let selected = 0;
  let _bgFadeTimer = null;
  // gallery images per character
  const previewGallery = {
    0: [
      "images/previewimages/char1/1394918-8c100.jpg",
      "images/previewimages/char1/4046785.jpeg",
      "images/previewimages/char1/4046786.jpeg",
      "images/previewimages/char1/4046788.jpeg",
      "images/previewimages/char1/4046789.jpeg",
      "images/previewimages/char1/4046790.jpeg",
    ],
    1: [
      "images/previewimages/char2/1235273-33762.jpg",
      "images/previewimages/char2/2766418 (1).jpeg",
      "images/previewimages/char2/2766418.jpeg",
      "images/previewimages/char2/2766419.jpeg",
      "images/previewimages/char2/2766420.jpeg",
      "images/previewimages/char2/2766422.jpeg",
      "images/previewimages/char2/2766423.jpeg",
      "images/previewimages/char2/2766424.jpeg",
    ],
    2: [
      "images/previewimages/char3/1849558-19ed3.jpg",
      "images/previewimages/char3/3566082.jpeg",
      "images/previewimages/char3/3566083.jpeg",
      "images/previewimages/char3/3566084.jpeg",
      "images/previewimages/char3/3566085.jpeg",
      "images/previewimages/char3/3566086.jpeg",
      "images/previewimages/char3/3566087.jpeg",
      "images/previewimages/char3/3566088.jpeg",
      "images/previewimages/char3/3566089.jpeg",
      "images/previewimages/char3/3566090.jpeg",
    ],
    3: [
      "images/previewimages/char4/2475057-be76a.jpg",
      "images/previewimages/char4/4154346.jpeg",
      "images/previewimages/char4/4154347.jpeg",
      "images/previewimages/char4/4154348.jpeg",
      "images/previewimages/char4/4154350.jpeg",
      "images/previewimages/char4/4154352.jpeg",
      "images/previewimages/char4/4154353.jpeg",
      "images/previewimages/char4/4154355.jpeg",
    ],
  };

  // current gallery state
  let galleryList = [];
  let galleryIndex = 0;

  const prevBtn = document.querySelector(".preview-prev");
  const nextBtn = document.querySelector(".preview-next");
  const counterEl = document.querySelector(".preview-counter");

  function updateCounter() {
    if (!counterEl) return;
    counterEl.textContent = `${galleryIndex + 1} / ${galleryList.length}`;
  }

  function showGalleryIndex(i) {
    if (!galleryList || !galleryList.length) return;
    galleryIndex = (i + galleryList.length) % galleryList.length;
    // set image with small fade
    if (previewArt) {
      previewArt.style.opacity = "0";
      setTimeout(() => {
        previewArt.src = galleryList[galleryIndex];
        previewArt.alt = items[selected].title + " artwork";
        requestAnimationFrame(() => {
          previewArt.style.opacity = "1";
        });
      }, 180);
    }
    updateCounter();
  }

  if (prevBtn)
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("preview-prev clicked");
      showGalleryIndex(galleryIndex - 1);
    });
  if (nextBtn)
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("preview-next clicked");
      showGalleryIndex(galleryIndex + 1);
    });

  // keyboard controls for gallery
  document.addEventListener("keydown", (e) => {
    if (!galleryList || !galleryList.length) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      showGalleryIndex(galleryIndex - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      showGalleryIndex(galleryIndex + 1);
    }
  });

  function fadeToBackground(imgPath) {
    if (!imgPath) return;
    const cssUrl = `url('../${imgPath}')`;
    try {
      // set overlay image and start fade
      document.body.style.setProperty("--bg-fade-image", cssUrl);
      document.body.classList.add("bg-fade");
      // clear any pending timer
      if (_bgFadeTimer) clearTimeout(_bgFadeTimer);
      _bgFadeTimer = setTimeout(() => {
        // commit background and clear overlay
        document.body.style.setProperty("--bg-image", cssUrl);
        document.body.classList.remove("bg-fade");
        document.body.style.removeProperty("--bg-fade-image");
        _bgFadeTimer = null;
      }, 650); // slightly longer than CSS transition (600ms)
    } catch (e) {}
  }

  function updatePreview(index) {
    if (!items[index]) return;
    // update active node and aria-current
    timeline.forEach((n) => {
      n.classList.remove("active");
      n.removeAttribute("aria-current");
    });
    const node = timeline[index];
    if (node) {
      node.classList.add("active");
      node.setAttribute("aria-current", "true");
    }

    // animate preview image swap
    if (previewArt) {
      previewArt.style.opacity = "0";
      previewArt.style.transform = "scale(0.98)";
      setTimeout(() => {
        // build gallery list: use previewGallery or fallback to single image
        const folderImgs =
          previewGallery[index] && previewGallery[index].length
            ? previewGallery[index].slice()
            : [];
        galleryList = folderImgs.length
          ? folderImgs.slice()
          : items[index].image
            ? [items[index].image]
            : [];
        galleryIndex = 0;

        // set initial preview image
        if (galleryList.length) previewArt.src = galleryList[0];
        previewArt.alt = items[index].title + " artwork";
        // caption is hidden but kept for accessibility
        actTitle.textContent = items[index].title;
        actSub.textContent = items[index].subtitle || "";
        updateCounter();

        requestAnimationFrame(() => {
          previewArt.style.opacity = "1";
          previewArt.style.transform = "scale(1.06)";
          // fade to the new background image
          try {
            if (items[index].bg) fadeToBackground(items[index].bg);
          } catch (e) {}
        });
      }, 220);
    }
  }

  timeline.forEach((node) => {
    node.addEventListener("click", () => {
      const idx = parseInt(node.dataset.index, 10) || 0;
      selected = idx;
      updatePreview(selected);
      // small sound cue
      const s = new Audio("sounds/clickui.mp3");
      s.play().catch(() => {});
    });

    node.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selected = Math.min(items.length - 1, selected + 1);
        updatePreview(selected);
        timeline[selected].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selected = Math.max(0, selected - 1);
        updatePreview(selected);
        timeline[selected].focus();
      } else if (e.key === "Enter") {
        node.click();
      }
    });
  });

  // init preview if on home
  if (timeline.length && previewArt) {
    updatePreview(selected);
  }

  // Lightbox: open larger image when preview clicked
  if (previewArt) {
    previewArt.style.cursor = "zoom-in";

    function openLightboxForSrc(src) {
      if (!src) return;
      const overlay = document.createElement("div");
      overlay.className = "lightbox-overlay";
      overlay.tabIndex = -1;
      // keep overlay on top
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "0";
      overlay.style.zIndex = "2147483647";

      const img = document.createElement("img");
      img.className = "lightbox-img";
      img.src = src;
      img.alt = previewArt.alt || "";

      overlay.appendChild(img);
      document.body.appendChild(overlay);
      // prevent background scroll
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // force overlay styles so it looks right even without CSS
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.background = "rgba(0,0,0,0.88)";
      overlay.style.opacity = "0";
      // trigger open state for CSS transition (and fade in inline)
      requestAnimationFrame(() => {
        overlay.classList.add("open");
        overlay.style.transition = "opacity 200ms ease";
        overlay.style.opacity = "1";
      });

      function closeLightbox() {
        // fade overlay out
        try {
          overlay.style.opacity = "0";
        } catch (e) {}
        overlay.classList.remove("open");
        // remove overlay after fade or soon after as a fallback
        document.body.style.overflow = prevOverflow;
        let removed = false;
        function doRemove() {
          if (removed) return;
          removed = true;
          try {
            overlay.remove();
          } catch (e) {}
        }
        overlay.addEventListener(
          "transitionend",
          () => {
            doRemove();
          },
          { once: true },
        );
        setTimeout(doRemove, 260);
      }

      // close when clicking outside the image
      overlay.addEventListener("click", (evt) => {
        const clickedInsideImage = !!evt.target.closest(".lightbox-img");
        if (!clickedInsideImage) closeLightbox();
      });

      // close with Escape key

      // close on Escape
      function onKey(e) {
        if (e.key === "Escape") {
          closeLightbox();
          document.removeEventListener("keydown", onKey);
        }
      }
      document.addEventListener("keydown", onKey);
    }

    // open high-res from gallery if available
    previewArt.addEventListener("click", (e) => {
      // stop parent click from also opening the lightbox
      e.stopPropagation();
      const src =
        galleryList && galleryList.length
          ? galleryList[galleryIndex]
          : previewArt.src;
      openLightboxForSrc(src);
    });

    // also allow clicking the frame to open
    const previewFrame = document.querySelector(".preview-frame");
    if (previewFrame) {
      previewFrame.style.cursor = "zoom-in";
      previewFrame.addEventListener("click", (e) => {
        // ignore clicks on nav buttons
        if (e.target.closest(".preview-btn")) return;
        const src =
          galleryList && galleryList.length
            ? galleryList[galleryIndex]
            : previewArt.src;
        openLightboxForSrc(src);
      });
    }
  }

  /* Particles and parallax */
  (function initParticlesAndParallax() {
    const canvas = document.getElementById("particles");
    // support cinematic area on figures/about/contact pages
    const container = document.querySelector(".cinematic, .about-layout, main");
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    let w = (canvas.width = container.clientWidth);
    let h = (canvas.height = container.clientHeight);

    window.addEventListener("resize", () => {
      w = canvas.width = container.clientWidth;
      h = canvas.height = container.clientHeight;
    });

    const particles = [];
    const count = Math.max(24, Math.floor((w * h) / 40000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.2,
        vy: -0.05 - Math.random() * 0.3,
        alpha: 0.2 + Math.random() * 0.5,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        g.addColorStop(0, `rgba(255,255,255,${p.alpha})`);
        g.addColorStop(1, "rgba(255,255,255,0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    // parallax on mouse move
    const preview = document.querySelector(".preview-art");
    const stageInner = document.querySelector(".stage-inner");
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;

      const px = cx * 14; // px translation
      const py = cy * 10;

      if (preview)
        preview.style.transform = `translate(${px}px, ${py}px) scale(1.02)`;
      if (stageInner)
        stageInner.style.transform = `translate(${px * 0.2}px, ${py * 0.6}px)`;
    });

    container.addEventListener("mouseleave", () => {
      if (preview) preview.style.transform = "";
      if (stageInner) stageInner.style.transform = "";
    });
  })();

  // floating circles + parallax for main page
  (function initMainParticlesAndParallax() {
    if (!document.body.classList.contains("page-main")) return;
    const canvas = document.getElementById("main-particles");
    const container = document.querySelector("main");
    const navCards = document.querySelectorAll(".nav-card");
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    function resize() {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const count = Math.max(
      10,
      Math.floor((canvas.width * canvas.height) / 120000),
    );
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 6 + Math.random() * 18,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.02 - Math.random() * 0.2,
        alpha: 0.06 + Math.random() * 0.12,
        phase: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = Date.now() * 0.001;
      for (let p of particles) {
        p.x += p.vx + Math.sin(t + p.phase) * 0.08;
        p.y += p.vy;
        if (p.y < -50) {
          p.y = canvas.height + 50;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255,255,255,${p.alpha})`);
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);

    // nav-cards parallax on mouse move
    container.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      const px = cx * 12; // px translation
      const py = cy * 8;
      navCards.forEach((card, i) => {
        const depth = (i - (navCards.length - 1) / 2) * 0.08; // stagger per-card
        const tx = px * (0.9 - Math.abs(depth));
        const ty = py * (0.9 - Math.abs(depth));
        const rot = depth * 4;
        // set CSS vars for transform
        try {
          card.style.setProperty("--tx", `${tx}px`);
          card.style.setProperty("--ty", `${ty}px`);
          card.style.setProperty("--rot", `${rot}deg`);
        } catch (e) {}
      });
    });
    container.addEventListener("mouseleave", () => {
      navCards.forEach((card) => {
        try {
          card.style.setProperty("--tx", `0px`);
          card.style.setProperty("--ty", `0px`);
          card.style.setProperty("--rot", `0deg`);
        } catch (e) {}
      });
    });
  })();
});
