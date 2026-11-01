// Bir renk kanalını (0–255) göz algısına uygun "doğrusal" değere çevirir
function kanal(c) {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Rengin göreli parlaklığı (0 = siyah, 1 = beyaz)
function parlaklik(hex) {
  const [r, g, b] = hex.match(/\w\w/g).map((h) => parseInt(h, 16));
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b);
}

// İki renk arasındaki WCAG kontrast oranı (1 ile 21 arası)
function kontrast(renk1, renk2) {
  const [acik, koyu] = [parlaklik(renk1), parlaklik(renk2)].sort((x, y) => y - x);
  return (acik + 0.05) / (koyu + 0.05);
}

if (typeof module !== "undefined") module.exports = { kontrast };
