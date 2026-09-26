const $card = document.querySelector(".head-and-navbar");

// Simey'in matematik yardımcı fonksiyonları
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));
const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const adjust = (value, fromMin, fromMax, toMin, toMax) => {
  return round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
};
function ease(x) {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}
function easedFunc(durationMs, onProgress, onComplete) {
  let startTime = performance.now();
  let canceled = false;
  function loop() {
    if (canceled) return;
    const currentTime = performance.now();
    const progress = (currentTime - startTime) / durationMs;
    const easedProgress = ease(progress);
    onProgress(easedProgress);
    if (progress < 1) {
      requestAnimationFrame(loop);
    } else {
      if (onComplete) onComplete();
    }
  }
  loop();
  return { cancel: () => { canceled = true; } };
}

// Koordinat hatasını çözen ana güncelleme motoru
const cardUpdate = (clientX, clientY) => {
  var dimensions = $card.getBoundingClientRect();
  
  // Çocuk elemanların tuzağına düşmemek için mutlak sayfa koordinat hesabı yapıyoruz kanka
  var l = clientX - dimensions.left;
  var t = clientY - dimensions.top;
  var h = dimensions.height;
  var w = dimensions.width;
  
  var px = clamp(Math.abs((100 / w) * l), 0, 100);
  var py = clamp(Math.abs((100 / h) * t), 0, 100);
  var cx = px - 50;
  var cy = py - 50;

  $card.style.setProperty("--pointer-x", `${px}%`);
  $card.style.setProperty("--pointer-y", `${py}%`);
  $card.style.setProperty("--background-x", `${adjust(px, 0, 100, 35, 65)}%`);
  $card.style.setProperty("--background-y", `${adjust(py, 0, 100, 35, 65)}%`);
  $card.style.setProperty("--pointer-from-center", clamp(Math.sqrt((py - 50) * (py - 50) + (px - 50) * (px - 50)) / 50, 0, 1));
  $card.style.setProperty("--pointer-from-top", py / 100);
  $card.style.setProperty("--pointer-from-left", px / 100);
  
  // Geniş yatay yapıda ekran kırılmasın diye dönüş katsayılarını (5 ve 4'ü) biraz yumuşatabilirsin kanka
  $card.style.setProperty("--rotate-x", `${round(-(cx / 7))}deg`);
  $card.style.setProperty("--rotate-y", `${round(cy / 3)}deg`);
};

if ($card) {
  let easer;
  
  $card.addEventListener("pointerenter", () => {
    if (easer) easer.cancel();
    $card.style.setProperty("--card-opacity", "1");
  });

  $card.addEventListener("pointermove", (e) => {
    $card.style.transition = "none"; // Mouse takip ederken gecikme olmasın
    cardUpdate(e.clientX, e.clientY);
  });

  $card.addEventListener("pointerout", (e) => {
    const rect = $card.getBoundingClientRect();
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    // Mouse ayrılınca pürüzsüzce merkeze sönme motoru
    easer = easedFunc(1000, (p) => {
      let x = adjust(p, 0, 1, currentX, halfW);
      let y = adjust(p, 0, 1, currentY, halfH);
      cardUpdate(rect.left + x, rect.top + y);
    }, () => {
      $card.style.transition = "transform 0.8s ease, box-shadow 0.5s ease";
      $card.style.setProperty("--card-opacity", "0");
      $card.style.setProperty("--rotate-x", "0deg");
      $card.style.setProperty("--rotate-y", "0deg");
    });
  });

  // Sayfa ilk yüklendiğinde Simey'in o meşhur kartı tarayan ışık simülasyonu
  const initRect = $card.getBoundingClientRect();
  cardUpdate(initRect.left + initRect.width - 70, initRect.top + 60);

  setTimeout(() => {
    $card.style.setProperty("--card-opacity", "1");
    easer = easedFunc(3000, (p) => {
      let x = adjust(p, 0, 1, initRect.width - 70, initRect.width / 2);
      let y = adjust(p, 0, 1, 60, initRect.height / 2);
      cardUpdate(initRect.left + x, initRect.top + y);
    }, () => {
      $card.style.setProperty("--card-opacity", "0");
    });
  }, 1000);
}