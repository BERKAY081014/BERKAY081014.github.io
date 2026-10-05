/* =========================================================
   Berkay Bilgin – Mühendislik Sözlüğü Veritabanı (30 Günlük Tam Döngü)
   Her gün otomatik olarak o günün terimi seçilir ve yayınlanır.
   ========================================================= */

window.ENGINEERING_TERMS = [
  {
    category: "Devre Teorisi",
    term: "Ohm Kanunu",
    en: "Ohm's Law",
    simple:
      "Bir telden ne kadar akım geçeceğini iki şey belirler: onu iten gerilim ve tele karşı koyan direnç. Gerilim artarsa akım artar, direnç artarsa akım azalır.",
    formula: "V = I · R",
    vars: [
      ["V", "Gerilim (Volt)"],
      ["I", "Akım (Amper)"],
      ["R", "Direnç (Ohm, Ω)"],
    ],
    real:
      "LED'in yanına neden direnç takıldığını açıklar. Direnç olmazsa LED fazla akım çeker ve saniyeler içinde yanar. Şarj kablolarının ince olunca ısınmasının nedeni de budur.",
    example:
      "5 V ile beslenen bir devrede 250 Ω direnç varsa akım I = 5 / 250 = 0,02 A, yani 20 mA olur.",
  },
  {
    category: "Devre Teorisi",
    term: "Elektriksel Güç",
    en: "Electrical Power",
    simple:
      "Gücü, bir cihazın her saniye ne kadar enerji harcadığı olarak düşünebilirsin. Gerilim ile akımın çarpımıdır. Elektrik faturandaki kWh değeri bunun zamanla çarpılmış halidir.",
    formula: "P = V · I = I² · R",
    vars: [
      ["P", "Güç (Watt)"],
      ["V", "Gerilim (Volt)"],
      ["I", "Akım (Amper)"],
      ["R", "Direnç (Ω)"],
    ],
    real:
      "Kablo kesitini seçerken kullanılır. Güç ile ısınma akımın karesiyle büyüdüğü için akım iki katına çıkarsa kablodaki ısı kaybı dört katına çıkar. Yüksek gerilimli iletim hatları da bu yüzden vardır.",
    example:
      "2000 W'lık bir su ısıtıcı 230 V şebekede I = 2000 / 230 ≈ 8,7 A çeker. Bu yüzden 10 A'lik bir priz sınırda kalır.",
  },
  {
    category: "Devre Teorisi",
    term: "Kirchhoff Akım Yasası",
    en: "Kirchhoff's Current Law (KCL)",
    simple:
      "Bir düğüm noktasına giren akım, o noktadan çıkan akıma eşittir. Su borusundaki bir ayrım gibi düşün: ayrımdan geçen toplam su kaybolmaz.",
    formula: "Σ I_giren = Σ I_çıkan",
    vars: [
      ["Σ", "Toplam anlamına gelir"],
      ["I_giren", "Düğüme gelen akımlar"],
      ["I_çıkan", "Düğümden giden akımlar"],
    ],
    real:
      "Paralel bağlı kollarda akımın nasıl paylaşıldığını hesaplamak için kullanılır. Bir prizden aynı anda birkaç cihaz çalıştırdığında ana hattan geçen akımın bunların toplamı olması buna dayanır.",
    example:
      "Bir noktaya 5 A giriyor ve bir koldan 2 A çıkıyorsa, diğer koldan 3 A çıkmak zorundadır.",
  },
  {
    category: "Devre Teorisi",
    term: "Kirchhoff Gerilim Yasası",
    en: "Kirchhoff's Voltage Law (KVL)",
    simple:
      "Kapalı bir devre halkasında bataryanın verdiği gerilim, devre elemanlarında harcanan gerilimlerin toplamına eşittir. Bir dağ yolunda yukarı çıkıp başladığın noktaya dönersen toplam yükseklik farkın sıfırdır, burada da öyle.",
    formula: "Σ V = 0   (kapalı bir halka boyunca)",
    vars: [
      ["V", "Halkadaki elemanların gerilimleri"],
      ["Σ", "İşaretli toplam"],
    ],
    real:
      "Gerilim bölücü devrelerin temelidir. Bir sensörün 0–5 V aralığını mikrodenetleyicinin ADC girişine uygun hale getirmek için iki direnç seri bağlanır ve bu yasayla değerleri hesaplanır.",
    example:
      "12 V kaynağa 4 Ω ve 8 Ω seri bağlıysa akım 1 A'dir. Dirençlerin üzerindeki gerilimler 4 V ve 8 V olur, toplamları 12 V eder.",
  },
  {
    category: "Devre Teorisi",
    term: "RC Zaman Sabiti",
    en: "RC Time Constant",
    simple:
      "Bir kondansatör anında dolmaz. Direnç, dolma hızını yavaşlatır. Zaman sabiti, kondansatörün yaklaşık yüzde 63 dolması için geçen süredir.",
    formula: "τ = R · C",
    vars: [
      ["τ (tau)", "Zaman sabiti (saniye)"],
      ["R", "Direnç (Ω)"],
      ["C", "Kapasite (Farad)"],
    ],
    real:
      "Butonlardaki titreşimi (debounce) temizleyen filtrelerde, kamera flaşının dolma süresinde ve ses cihazlarındaki filtrelerde kullanılır. Yaklaşık 5τ sonra kondansatör yüzde 99'un üzerinde dolmuş olur.",
    example:
      "R = 10 kΩ ve C = 100 µF ise τ = 10 000 × 0,0001 = 1 saniyedir. Kondansatör yaklaşık 5 saniyede tamamen dolar.",
  },
  {
    category: "Elektromanyetik",
    term: "Rezonans Frekansı",
    en: "Resonant Frequency",
    simple:
      "Salıncakta tam doğru ritimde itersen sallanma büyür. Bobin ve kondansatörden oluşan bir devrenin de kendine ait bir doğal ritmi vardır. O frekansta devre çok güçlü tepki verir.",
    formula: "f₀ = 1 / (2π · √(L · C))",
    vars: [
      ["f₀", "Rezonans frekansı (Hz)"],
      ["L", "Endüktans (Henry)"],
      ["C", "Kapasite (Farad)"],
    ],
    real:
      "Eski radyoda istasyon seçerken kondansatörü çevirmen devrenin f₀ değerini değiştirir. Kablosuz telefon şarjı ve kart okuyucular da aynı prensiple çalışır.",
    example:
      "L = 100 µH ve C = 1 µF için f₀ = 1 / (2π · √(10⁻¹⁰)) ≈ 15,9 kHz çıkar.",
  },
  {
    category: "Güç Elektroniği",
    term: "PWM ve Görev Oranı",
    en: "PWM & Duty Cycle",
    simple:
      "Bir lambayı çok hızlı açıp kapatırsan göz bunu ortalama bir parlaklık olarak görür. PWM, gücü azaltmak için ısınan dirençler kullanmak yerine anahtarı hızla açıp kapatma yöntemidir. Açık kalma yüzdesine görev oranı denir.",
    formula: "V_ort = D · V_max",
    vars: [
      ["V_ort", "Ortalama gerilim"],
      ["D", "Görev oranı (0 ile 1 arası)"],
      ["V_max", "Besleme gerilimi"],
    ],
    real:
      "LED parlaklığı, fırça motorların hızı, bilgisayar fanı, ısıtıcı elemanlar ve elektrikli araç sürücülerinde kullanılır. Anahtar ya tam açık ya tam kapalı olduğu için çok az enerji ısıya gider.",
    example:
      "12 V besleme ve D = %25 ise ortalama gerilim 12 × 0,25 = 3 V olur. Motor yaklaşık dörtte bir gücüyle döner.",
    project: { label: "Fırın kontrol sistemi", href: "#project1" },
  },
  {
    category: "Güç Elektroniği",
    term: "Boost Konvertör",
    en: "Boost Converter",
    simple:
      "Gerilimi yükselten bir devredir. Bobine enerji depolayıp bunu çıkışa daha yüksek gerilimle bırakır. Bir arabanın yokuş çıkarken vites küçültmesine benzer: kazanılan gerilim akımdan feda edilir.",
    formula: "V_out = V_in / (1 − D)",
    vars: [
      ["V_out", "Çıkış gerilimi"],
      ["V_in", "Giriş gerilimi"],
      ["D", "Görev oranı (0 ile 1 arası)"],
    ],
    real:
      "Powerbank içindeki 3,7 V'luk pili 5 V USB çıkışına çevirir. Güneş paneli şarj kontrolcülerinde ve LED sürücülerde de kullanılır.",
    example:
      "12 V giriş ve D = 0,5 için V_out = 12 / (1 − 0,5) = 24 V. Projedeki 12 V'tan 24 V'a tasarım bu değerlerle yapıldı.",
    project: { label: "MATLAB Boost Konvertör projesi", href: "#project4" },
  },
  {
    category: "Kontrol Sistemleri",
    term: "PID Kontrol",
    en: "PID Control",
    simple:
      "Hedef ile gerçek değer arasındaki farka bakan akıllı bir ayardır. P şimdiki hataya, I geçmişte biriken hataya, D ise hatanın ne kadar hızlı değiştiğine bakar. Üçünün toplamı kontrol çıkışını belirler.",
    formula: "u(t) = Kp·e(t) + Ki·∫e(t)dt + Kd·de(t)/dt",
    vars: [
      ["u(t)", "Kontrol çıkışı"],
      ["e(t)", "Hata (hedef − ölçülen)"],
      ["Kp, Ki, Kd", "Ayar katsayıları"],
    ],
    real:
      "Klimanın odayı hedef sıcaklıkta tutması, arabanın hız sabitleyicisi, dronların havada dengede durması ve fırınlarda sıcaklık kontrolü PID ile yapılır.",
    example:
      "Hedef 180 °C iken fırın 150 °C ise hata 30 °C'dir. Kp = 4 için P kısmı 120 birimlik bir ısıtma komutu üretir.",
    project: { label: "Akıllı fırın projesi", href: "#project1" },
  },
  {
    category: "Sinyal İşleme",
    term: "Nyquist Örnekleme Teoremi",
    en: "Nyquist–Shannon Sampling",
    simple:
      "Bir sinyali dijitale çevirirken, içindeki en yüksek frekansın en az iki katı hızda ölçüm almak gerekir. Daha yavaş örneklersen sinyalin aslı kaybolur ve yanlış bir sinyal görürsün.",
    formula: "fs ≥ 2 · f_max",
    vars: [
      ["fs", "Örnekleme frekansı (Hz)"],
      ["f_max", "Sinyaldeki en yüksek frekans (Hz)"],
    ],
    real:
      "İnsan kulağı yaklaşık 20 kHz'e kadar duyduğu için ses CD'leri 44,1 kHz ile kaydedilir. Mikrodenetleyicilerde bir sensörü okurken ADC hızını seçmek de buna bağlıdır.",
    example:
      "En fazla 5 kHz içeren bir titreşim sensörünü doğru okumak için en az 10 kHz örnekleme gerekir.",
  },
  {
    category: "Güç Sistemleri",
    term: "Güç Faktörü",
    en: "Power Factor",
    simple:
      "Bir cihaza verilen elektriğin ne kadarının gerçekten iş yaptığını gösteren orandır. Motor gibi bobinli cihazlar bir kısım enerjiyi iş yapmadan şebekeye geri gönderir. Bu oran ne kadar 1'e yakınsa o kadar verimlidir.",
    formula: "cos φ = P / S",
    vars: [
      ["cos φ", "Güç faktörü (0 ile 1 arası)"],
      ["P", "Gerçek güç (kW)"],
      ["S", "Görünür güç (kVA)"],
    ],
    real:
      "Fabrikalarda güç faktörü düşük kalırsa elektrik dağıtım şirketi reaktif enerji cezası keser. Bu yüzden panolara kondansatör grupları takılır.",
    example:
      "80 kW gerçek güç çeken bir tesiste görünür güç 100 kVA ise güç faktörü 80 / 100 = 0,8 olur.",
  },
  {
    category: "Yapay Zekâ",
    term: "Evrişim (Convolution)",
    en: "Convolution",
    simple:
      "Küçük bir filtre matrisini görüntünün üzerinde kaydırıp her konumda çarpıp toplama işlemidir. Filtrenin değerlerine göre görüntüde kenarlar, köşeler ya da desenler öne çıkar.",
    formula: "(I ∗ K)(x, y) = Σᵢ Σⱼ I(x−i, y−j) · K(i, j)",
    vars: [
      ["I", "Giriş görüntüsü"],
      ["K", "Filtre (çekirdek)"],
      ["(x, y)", "Piksel konumu"],
    ],
    real:
      "Telefonun yüz tanıması, fotoğraf bulanıklaştırma, tıpta röntgen analizi ve otonom araçların şerit görmesi evrişimli sinir ağlarına dayanır.",
    example:
      "3×3 bir filtre bir pikselin etrafındaki 9 değeri ağırlıklarıyla çarpıp toplayarak tek bir yeni piksel değeri üretir.",
    project: { label: "CNN sınıflandırma projesi", href: "#project5" },
  },
  {
    category: "Navigasyon",
    term: "Haversine Formülü",
    en: "Haversine Formula",
    simple:
      "Dünya yuvarlak olduğu için iki GPS noktası arasındaki mesafe düz bir cetvelle ölçülmez. Bu formül, enlem ve boylamı kullanarak küre yüzeyindeki en kısa yol uzunluğunu verir.",
    formula: "a = sin²(Δφ/2) + cos φ₁ · cos φ₂ · sin²(Δλ/2)\nd = 2R · arcsin(√a)",
    vars: [
      ["φ", "Enlem (radyan)"],
      ["λ", "Boylam (radyan)"],
      ["R", "Dünya yarıçapı ≈ 6371 km"],
      ["d", "İki nokta arası mesafe"],
    ],
    real:
      "Harita uygulamalarında, uçuş mesafesi hesabında ve otonom araçların hedef noktaya ne kadar kaldığını bulmasında kullanılır.",
    example:
      "Araç hedef koordinata 2,5 metreden yakınsa, \"waypoint'e ulaşıldı\" diyip sıradaki hedefe geçer.",
    project: { label: "TEKNOFEST İKA seyrüsefer kodu", href: "#project7" },
  },
  {
    category: "Gömülü Sistemler",
    term: "ADC Çözünürlüğü ve LSB",
    en: "ADC Resolution & LSB",
    simple:
      "Analog bir gerilimi dijital sayılara bölerken en küçük adım büyüklüğüdür. Cetveldeki milimetre çizgisi gibi düşün: adım ne kadar küçükse ölçüm o kadar hassastır.",
    formula: "V_LSB = V_ref / (2^N - 1)",
    vars: [
      ["V_LSB", "En küçük gerilim adımı (Volt)"],
      ["V_ref", "Referans gerilimi (örn: 3.3V)"],
      ["N", "Bit çözünürlüğü (örn: 12-bit)"],
    ],
    real:
      "ESP32 ile sıcaklık veya pil gerilimi okurken 1 birimlik dijital artışın kaç milivolta denk geldiğini bilmek için kullanılır.",
    example:
      "3.3 V referans ve 12-bit (4095 adım) için V_LSB = 3.3 / 4095 ≈ 0.8 mV'tur.",
    project: { label: "Akıllı fırın PT100 okuma devresi", href: "#project1" },
  },
  {
    category: "Devre Koruması",
    term: "Ters EMK ve Flyback Diyot",
    en: "Back-EMF & Flyback Diode",
    simple:
      "Bir röle veya motor bobininden geçen akımı aniden kesersen, bobin akımı sürdürmek için devasa ters bir voltaj patlaması üretir. Flyback diyot bu patlamayı kendi üstünde sönümler.",
    formula: "V_indüklenen = -L · (di / dt)",
    vars: [
      ["L", "Bobin endüktansı"],
      ["di/dt", "Akımın kesilme hızı"],
      ["V_indüklenen", "Ters voltaj tepe değeri"],
    ],
    real:
      "Mikrodenetleyici veya transistörün röleyi kapatırken saniyenin binde birinde yanmasını engellemek için bobine paralel ters diyot takılır.",
    example:
      "12V röle kapatılırken diyot yoksa ters gerilim 100V üzerine fırlayıp sürücü MOSFET'i delebilir.",
    project: { label: "Fırın röle sürücü devresi", href: "#project1" },
  },
  {
    category: "Güç Elektroniği",
    term: "Buck Konvertör",
    en: "Buck Converter",
    simple:
      "Yüksek bir DC gerilimi, ısı kaybı oluşturmadan daha düşük bir DC gerilime indiren anahtarlamalı güç kaynağıdır. Dirençle gerilim bölmenin modern, verimli alternatifidir.",
    formula: "V_out = D · V_in",
    vars: [
      ["V_out", "Düşürülmüş çıkış gerilimi"],
      ["D", "Görev oranı (Duty Cycle)"],
      ["V_in", "Giriş besleme gerilimi"],
    ],
    real:
      "Araç çakmaklığından (12V) telefona 5V şarj üretirken aşırı ısınmayı engelleyen çipler buck mimarisiyle çalışır.",
    example:
      "24V endüstriyel panodan 5V elde etmek için D = 5 / 24 ≈ %20.8 anahtarlama yapılır.",
    project: { label: "Siemens PLC besleme hattı", href: "#project2" },
  },
  {
    category: "Haberleşme",
    term: "I2C ve SPI Veriyolu",
    en: "I2C & SPI Bus",
    simple:
      "Mikrodenetleyicinin sensörler ve ekranlarla konuşma dilidir. I2C sadece 2 kablo ile onlarca cihazı adresler; SPI ise 4 kablo ile çok daha yüksek hızlarda veri aktarır.",
    formula: "f_SCL = 100 kHz - 400 kHz (I2C) | f_SCK > 10 MHz (SPI)",
    vars: [
      ["SDA / SCL", "I2C Veri ve Saat hatları"],
      ["MOSI / MISO", "SPI Çift yönlü veri hatları"],
    ],
    real:
      "Akıllı saatlerde ekranın hızlı çizilmesi için SPI, ortam sıcaklık ve barometre sensörleri için az pin kaplayan I2C tercih edilir.",
    example:
      "OLED ekran ve MAX31865 sensörünün ESP32 ile aynı anda donanımsal hatlarla konuşması buna dayanır.",
    project: { label: "ESP32 donanım mimarisi", href: "#project1" },
  },
  {
    category: "Gömülü Sistemler",
    term: "Watchdog Zamanlayıcı (WDT)",
    en: "Watchdog Timer",
    simple:
      "Mikrodenetleyici içinde sürekli geriye doğru sayan bir bekçi köpeğidir. Yazılım her şey yolundaysa bekçiye 'ben hayattayım' der. Kod sonsuz döngüde kilitlenirse sayaç sıfırlanır ve cihazı otomatik yeniden başlatır.",
    formula: "t_kalan = T_timeout - t_geçen  (t_kalan = 0 -> Reset)",
    vars: [
      ["T_timeout", "Maksimum bekleme süresi (örn: 2 sn)"],
      ["Reset", "Donanımsal yeniden başlatma"],
    ],
    real:
      "Uzay uydularında, tıbbi cihazlarda ve fırın otomasyonunda yazılım çökse bile sistemin kilitlenip yangın çıkarmasını engeller.",
    example:
      "Ana döngü 500 ms içinde bekçiyi beslemezse 2 saniye sonunda kart kendiliğinden güvenli moda geçer.",
    project: { label: "Fırın güvenlik mimarisi", href: "#project1" },
  },
  {
    category: "Termal Mühendislik",
    term: "Termal Direnç ve Isınma",
    en: "Thermal Resistance (θ_JA)",
    simple:
      "Bir yarı iletken çipin içindeki ısının dış havaya ne kadar zorlukla aktarıldığının ölçüsüdür. Elektrikteki Ohm kanununun ısı dünyasındaki ikizidir.",
    formula: "T_J = T_A + (P_kayıp · θ_JA)",
    vars: [
      ["T_J", "Çip iç sıcaklığı (°C)"],
      ["T_A", "Ortam hava sıcaklığı (°C)"],
      ["P_kayıp", "Isıya dönüşen güç (Watt)"],
      ["θ_JA", "Termal direnç (°C/W)"],
    ],
    real:
      "Bilgisayar işlemcisine veya güç MOSFET'ine ne kadar büyük bir alüminyum soğutucu takman gerektiğini hesaplar.",
    example:
      "2W ısı yayan bir çipin θ_JA değeri 40 °C/W ve ortam 25 °C ise iç sıcaklık 25 + (2 × 40) = 105 °C olur.",
  },
  {
    category: "Devre Teorisi",
    term: "Histerezis (Schmitt Trigger)",
    en: "Hysteresis & Schmitt Trigger",
    simple:
      "Bir lambanın eşik değerde sürekli pır pır edip titremesini önleyen kararlı geçiş aralığıdır. Açılma voltajı ile kapanma voltajı birbirinden farklı tutulur.",
    formula: "ΔV_H = V_TH (Yüksek Eşik) - V_TL (Düşük Eşik)",
    vars: [
      ["V_TH", "Açılma eşik voltajı"],
      ["V_TL", "Kapanma eşik voltajı"],
      ["ΔV_H", "Histerezis penceresi"],
    ],
    real:
      "Termostat 22°C'de klimayı açıp 21.9°C'de hemen kapatmaz; 20°C'ye inene kadar bekler. Bu motorun saniyede bir dur-kalk yapıp bozulmasını önler.",
    example:
      "Fırın 180°C hedefine ulaştığında histerezis 2°C ise 178°C altına inmeden rezistansı tekrar yakmaz.",
    project: { label: "Siemens PLC histerezis kontrolü", href: "#project2" },
  },
  {
    category: "Güç Elektroniği",
    term: "H-Köprüsü (H-Bridge)",
    en: "H-Bridge Motor Driver",
    simple:
      "Dört anahtarın H harfi gibi dizilmesiyle DC motorun kutuplarını tersine çevirip hem ileri hem geri döndürebilen devredir.",
    formula: "V_motor = +V_kaynak  (İleri) | V_motor = -V_kaynak (Geri)",
    vars: [
      ["Q1, Q4 Açık", "İleri yön akımı"],
      ["Q2, Q3 Açık", "Ters yön akımı"],
      ["Çapraz Koruma", "Kısa devreyi önleme süresi"],
    ],
    real:
      "Elektrikli arabaların geri vitese takılması ve otonom araçların tekerlek yön kontrolü H-Köprüsü sürücüleriyle yapılır.",
    example:
      "BTS7960 motor sürücüsü ile TEKNOFEST robotunun diferansiyel dönüşleri bu köprüyle sağlanır.",
    project: { label: "TEKNOFEST İKA motor sürücüsü", href: "#project7" },
  },
  {
    category: "Enerji",
    term: "Piezoelektrik Enerji Hasadı",
    en: "Piezoelectric Energy Harvesting",
    simple:
      "Bazı özel kristallere ve seramiklere mekanik baskı veya titreşim uygulandığında iki ucu arasında elektrik voltajı üretmeleridir.",
    formula: "V = (g · F · t) / A",
    vars: [
      ["g", "Piezo gerilim katsayısı"],
      ["F", "Uygulanan mekanik kuvvet (N)"],
      ["t", "Malzeme kalınlığı"],
      ["A", "Yüzey alanı"],
    ],
    real:
      "Yürüyen insanların adımlarından enerji üretip park lambalarını yakan veya köprü titreşimlerinden kendi sensörünü besleyen yeşil enerji sistemleridir.",
    example:
      "Stepergy projesinde kaldırım karolarına basıldığında üretilen mekanik darbe süperkapasitörde depolanır.",
    project: { label: "Stepergy Enerji Hasadı projesi", href: "#project8" },
  },
  {
    category: "Kontrol Sistemleri",
    term: "Durum Uzayı Gösterimi",
    en: "State-Space Representation",
    simple:
      "Karmaşık bir fiziksel sistemin (örn: uçak, robot kolu, konvertör) tüm anlık değişkenlerini tek bir matris denkleminde toplama yöntemidir.",
    formula: "dx/dt = A·x + B·u\ny = C·x + D·u",
    vars: [
      ["x", "Durum vektörü (hız, konum, akım)"],
      ["u", "Giriş sinyali"],
      ["A, B, C, D", "Sistem dinamik matrisleri"],
    ],
    real:
      "Modern otonom sürüş algoritmalarında aracın şerit takibini ve MATLAB'de konvertör kararlılığını simüle etmek için kullanılır.",
    example:
      "DC-DC boost konvertörün bobin akımı ve kondansatör voltajı durum değişkenleri olarak modellenir.",
    project: { label: "MATLAB Boost konvertör tasarımı", href: "#project4" },
  },
  {
    category: "Sensörler",
    term: "RTD PT100 Sıcaklık Sensörü",
    en: "RTD PT100 Sensor",
    simple:
      "Platin telin sıcaklıkla direncinin çok düzenli şekilde artması prensibidir. Adındaki 100, tam 0°C'de direncinin 100 Ohm olmasından gelir.",
    formula: "R(T) = R₀ · (1 + A·T + B·T²)",
    vars: [
      ["R₀", "0°C'deki direnç = 100.0 Ω"],
      ["A, B", "Callendar-Van Dusen katsayıları"],
      ["T", "Ölçülen sıcaklık (°C)"],
    ],
    real:
      "Endüstriyel fırınlarda, kimya tesislerinde ve laboratuvarlarda termokupllara göre çok daha yüksek hassasiyet (±0.1°C) gerektiğinde kullanılır.",
    example:
      "Sıcaklık 100°C olduğunda PT100 direnci yaklaşık 138.5 Ω değerine yükselir.",
    project: { label: "Akıllı fırın MAX31865 devresi", href: "#project1" },
  },
  {
    category: "Optoelektronik",
    term: "Optokuplör Galvanik Yalıtım",
    en: "Optocoupler Galvanic Isolation",
    simple:
      "İki devreyi elektriksel olarak birbirine hiç bağlamadan, aralarında ışık (kızılötesi LED ve fototransistör) ile sinyal aktarma yöntemidir.",
    formula: "CTR = (I_çıkış / I_giriş) · 100%",
    vars: [
      ["CTR", "Akım Transfer Oranı (%)"],
      ["İzolasyon", "5000V gerilim dayanımı"],
    ],
    real:
      "220V şebeke tarafında bir kısa devre olsa bile 3.3V ile çalışan hassas mikrodenetleyicinin yanmasını kesin olarak önler.",
    example:
      "PLC giriş kartlarında sahadan gelen 24V endüstriyel gürültüyü işlemciye geçirmeden temiz okumak için kullanılır.",
    project: { label: "Siemens PLC giriş filtreleri", href: "#project2" },
  },
  {
    category: "Bilgisayarlı Görü",
    term: "Homografi Matrisi",
    en: "Homography Matrix (3x3)",
    simple:
      "Bir nesneye farklı açılardan baktığında oluşan perspektif yamulmasını düzelten ve iki düzlemi üst üste çakıştıran geometrik dönüşüm matrisidir.",
    formula: "s · [x' y' 1]ᵀ = H · [x y 1]ᵀ",
    vars: [
      ["H", "3x3 Homografi dönüşüm matrisi"],
      ["[x y 1]", "Orijinal resimdeki piksel koordinatı"],
      ["[x' y' 1]", "Hedef panoramadaki koordinat"],
    ],
    real:
      "Fotoğrafları yan yana birleştirip kusursuz panoramik manzara oluştururken ve açılı çekilmiş belgeleri düz tarayıcı gibi düzeltirken kullanılır.",
    example:
      "OpenCV projesinde RANSAC algoritmasıyla 4 ortak nokta seçilip H matrisi hesaplanır ve sol resim sağ resmin düzlemine bükülür.",
    project: { label: "OpenCV panoramik stitching", href: "#project6" },
  },
  {
    category: "Yapay Zekâ",
    term: "Dropout ve Aşırı Öğrenme",
    en: "Dropout & Overfitting",
    simple:
      "Yapay zeka modelini eğitirken her adımda rastgele bazı nöronları geçici olarak kapatmaktır. Tıpkı bir basketbol takımının her antrenmanda farklı bir oyuncusunu kenara alarak takımın tek bir yıldıza bağımlı olmasını engellemesi gibidir.",
    formula: "p_kalma = 1 - p_drop  (örn: p_drop = 0.3)",
    vars: [
      ["p_drop", "Kapatılacak nöron yüzdesi"],
      ["Overfitting", "Ezberleme riski"],
    ],
    real:
      "Modelin eğitim verisini ezberlemek yerine yeni gördüğü fotoğraflarda da yüksek doğrulukla sınıflandırma yapmasını sağlar.",
    example:
      "CNN modelimizde her konvolüsyon bloğu sonuna %20 - %40 dropout konularak kedi-köpek sınıflandırmasında test başarısı artırıldı.",
    project: { label: "CNN derin öğrenme eğitimi", href: "#project5" },
  },
  {
    category: "Haberleşme",
    term: "Shannon-Hartley Kanal Kapasitesi",
    en: "Shannon-Hartley Theorem",
    simple:
      "Bir haberleşme hattından (kablo, telsiz, WiFi) gürültüye rağmen saniyede fiziksel olarak en fazla kaç bit bilgi gönderilebileceğinin evrensel sınırıdır.",
    formula: "C = B · log₂(1 + S/N)",
    vars: [
      ["C", "Maksimum kanal kapasitesi (bit/saniye)"],
      ["B", "Bant genişliği (Hz)"],
      ["S/N", "Sinyal-gürültü oranı (SNR)"],
    ],
    real:
      "5G internet hızlarının neden yüksek frekanslı geniş bantlara ihtiyaç duyduğunu ve uzay araçlarıyla iletişimdeki hız sınırını açıklar.",
    example:
      "1 MHz bant genişliğinde ve 1000 kat SNR olan bir hatta teorik olarak en fazla 10 Mbps hız elde edilebilir.",
  },
  {
    category: "Batarya Teknolojisi",
    term: "CC/CV Şarj Döngüsü",
    en: "CC/CV Battery Charging",
    simple:
      "Lityum pilleri güvenli şarj etme yöntemidir. Önce pil dolana kadar sabit akım (CC) verilir; pil dolmaya yakın voltajı sabitlenir (CV) ve akım yavaşça sıfıra düşürülür.",
    formula: "Aşama 1: I = Sabit | Aşama 2: V = 4.2V Sabit, I -> 0",
    vars: [
      ["CC", "Constant Current (Sabit Akım)"],
      ["CV", "Constant Voltage (Sabit Gerilim)"],
    ],
    real:
      "Akıllı telefonunun pilinin ilk %80'e çok hızlı dolup, son %20'sinin pili korumak için daha yavaş dolmasının nedeni bu algoritmadır.",
    example:
      "Stepergy projesinde süperkapasitör ve lityum hücrelerin aşırı şarj olup şişmesini önleyen BMS kontrolü.",
    project: { label: "Stepergy batarya yönetim devresi", href: "#project8" },
  },
  {
    category: "Robotik & Kontrol",
    term: "Diferansiyel Sürüş Kinematiği",
    en: "Differential Drive Kinematics",
    simple:
      "Direksiyon simidi olmadan, sadece sol ve sağ tekerleklerin dönüş hızlarını birbirinden farklı yaparak araca yön verme prensibidir (tıpkı bir tank gibi).",
    formula: "v = (v_sağ + v_sol) / 2\nω = (v_sağ - v_sol) / L",
    vars: [
      ["v", "Aracın ileri hızı"],
      ["ω (omega)", "Aracın dönme açısal hızı"],
      ["L", "İki tekerlek arası mesafe"],
    ],
    real:
      "Robot süpürgelerin ve otonom tarım araçlarının dar alanlarda kendi etrafında 360 derece dönebilmesini sağlar.",
    example:
      "Sol motor 150 PWM, sağ motor 100 PWM hızla döndürüldüğünde araç yumuşak bir kavisle sağa doğru yönelir.",
    project: { label: "TEKNOFEST İKA rota algoritması", href: "#project7" },
  }
];
