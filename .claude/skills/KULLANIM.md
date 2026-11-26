# Skill kaynakları ve kullanım notu

Yüklenen skill'ler resmî/yaygın kaynaklardan alındı; içerikleri yüklemeden önce okundu, komut çalıştıran bir satır bulunmadı.

| Skill | Kaynak | Lisans |
|---|---|---|
| frontend-design | https://github.com/anthropics/skills (skills/frontend-design) | Apache-2.0 |
| impeccable (SKILL.md + seçili reference/ dosyaları) | https://github.com/pbakaus/impeccable | Apache-2.0 |
| gsap-core, gsap-scrolltrigger, gsap-timeline, gsap-performance | https://github.com/greensock/gsap-skills (resmî GSAP) | MIT |
| threejs-fundamentals, -geometry, -lighting, -materials, -textures, -shaders, -animation, -performance | https://github.com/CloudAI-X/threejs-skills | MIT |
| seo-geo-bilingual | bu proje için yazıldı | — |

## Dikkat
- **impeccable**: SKILL.md "launcher" adlı bir ikili dosyayı ilk çalıştırmada indirmeyi söylüyor. İndirilen ikili dosyanın içeriği denetlenemediği için **çalıştırılmadı**; yalnızca metin olarak (reference/ içindeki yönergeler) kullanıldı. SKILL.md'nin kendi "Launcher unavailable" kuralı bu durumu zaten karşılıyor.
- **threejs-\*** skill'leri three.js r186'ya göre yazılmış; sitemiz r128 (CDN) kullanıyor. Kodlarken API farkları (ör. renk yönetimi, `outputEncoding`) elle kontrol edilir.
