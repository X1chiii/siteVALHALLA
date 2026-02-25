const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const label = toggle.querySelector(".theme-label");
const savedTheme = localStorage.getItem("site-theme");
const revealNodes = document.querySelectorAll("[data-reveal]");
const tiltTargets = document.querySelectorAll(".card, .btn, .theme-toggle");

if (savedTheme === "light" || savedTheme === "dark") {
  root.setAttribute("data-theme", savedTheme);
}

const syncLabel = () => {
  const isDark = root.getAttribute("data-theme") !== "light";
  label.textContent = isDark ? "Светлая тема" : "Тёмная тема";
};

syncLabel();

toggle.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "light" ? "dark" : "light";
  root.setAttribute("data-theme", nextTheme);
  localStorage.setItem("site-theme", nextTheme);
  syncLabel();
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

revealNodes.forEach((node, index) => {
  node.style.transitionDelay = `${Math.min(index * 60, 320)}ms`;
  revealObserver.observe(node);
});

let currentX = window.innerWidth / 2;
let currentY = window.innerHeight / 2;
let targetX = currentX;
let targetY = currentY;

window.addEventListener("pointermove", (event) => {
  targetX = event.clientX;
  targetY = event.clientY;
});

const animatePointerEffects = () => {
  currentX += (targetX - currentX) * 0.08;
  currentY += (targetY - currentY) * 0.08;

  const ratioX = (currentX / window.innerWidth - 0.5) * 2;
  const ratioY = (currentY / window.innerHeight - 0.5) * 2;

  root.style.setProperty("--mx", `${currentX}px`);
  root.style.setProperty("--my", `${currentY}px`);
  root.style.setProperty("--mx-ratio", ratioX.toFixed(4));
  root.style.setProperty("--my-ratio", ratioY.toFixed(4));
  root.style.setProperty("--grid-shift-x", `${ratioX * 12}px`);
  root.style.setProperty("--grid-shift-y", `${ratioY * 12}px`);

  requestAnimationFrame(animatePointerEffects);
};

animatePointerEffects();

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canHover) {
  tiltTargets.forEach((element) => {
    const maxTilt = element.classList.contains("card") ? 8 : 6;

    element.addEventListener("pointermove", (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      const tiltY = (x - 0.5) * (maxTilt * 2);
      const tiltX = (0.5 - y) * (maxTilt * 2);

      element.style.setProperty("--tilt-x", `${tiltX.toFixed(2)}deg`);
      element.style.setProperty("--tilt-y", `${tiltY.toFixed(2)}deg`);
    });

    element.addEventListener("pointerleave", () => {
      element.style.setProperty("--tilt-x", "0deg");
      element.style.setProperty("--tilt-y", "0deg");
    });
  });
}
