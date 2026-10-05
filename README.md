# Berkay Bilgin – Kişisel Portfolyo

Saf HTML + CSS + JavaScript ile yazılmış, tek sayfalık (SPA) portfolyo sitesi. Build adımı yok, dosyaları sunucuya yüklemeniz yeterli.

## Klasör Yapısı

```
Sitem/
├── index.html          # Tüm bölümler (Hero, Hakkımda, Projeler, İletişim, Footer)
├── css/style.css       # Tema ve responsive kurallar
├── js/main.js          # Animasyonlar ve iletişim formu
├── contact.php         # (Opsiyonel) PHP mail arka ucu
├── robots.txt / sitemap.xml
└── assets/
    ├── favicon.svg
    └── img/
        ├── project-oven.jpg, project-plc.jpg, project-vision.jpg, project-boost.jpg
        └── WhatsApp Image 2026-10-04 at 16.23.51.jpeg   <-- Instagram QR görselinizi buraya koyun
```

## Yapılacaklar (Domain onaylanınca)

1. **QR görseli:** `WhatsApp Image 2026-10-04 at 16.23.51.jpeg` dosyasını `assets/img/` içine kopyalayın.
   Görsel yoksa sitede otomatik olarak "QR kod yakında" kutusu görünür.
2. **Alan adı:** `index.html`, `robots.txt` ve `sitemap.xml` içindeki `ALANADINIZ.com` ifadesini kendi domaininizle değiştirin.
3. **Yükleme:** Klasörün tüm içeriğini hosting'in `public_html` (veya kök) dizinine yükleyin.
4. **İletişim formunu aktifleştirme:** Site yayına girince formdan kendinize bir test mesajı gönderin.
   FormSubmit, `kgberkay10@gmail.com` adresine bir **aktivasyon maili** yollar → "Activate Form" butonuna tıklayın. Sonraki tüm mesajlar doğrudan gelen kutunuza düşer.

## İletişim Formu Modları (`js/main.js` → `CONTACT_CONFIG.mode`)

| Mod | Açıklama |
| --- | --- |
| `formsubmit` (varsayılan) | Kayıt/anahtar gerektirmez, her hosting'de çalışır. |
| `php` | Hosting PHP `mail()` destekliyorsa `contact.php` kullanılır. |
| `mailto` | Ziyaretçinin e-posta uygulamasını açar. |

Herhangi bir hata durumunda form otomatik olarak `mailto` yedeğine düşer, yani mesaj asla kaybolmaz.

## Proje Fotoğraflarını Değiştirme

`index.html` içinde her projenin `<img src="assets/img/...">` satırını kendi fotoğrafınızla değiştirmeniz yeterli (önerilen oran 16:9).

## Yerelde Önizleme

`index.html` dosyasına çift tıklayabilirsiniz. Formun gerçekten mail göndermesini test etmek için bir yerel sunucu kullanın:

```
npx serve .
```
