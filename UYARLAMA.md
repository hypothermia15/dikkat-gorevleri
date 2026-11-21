# Türkçe uyarlama

Bu depo, Anyma-exe'nin [Cognitive Arcade](https://github.com/Anyma-exe/cognitive-arcade) çalışmasının (MIT lisansı) Türkçe uyarlamasıdır. Özgün telif bildirimi `LICENSE` dosyasında aynen durur.

Uyarlayan: Doç. Dr. Miraç Barış Usta (çocuk ve ergen psikiyatrisi).

Hedef kitle: çocuk ve ergen psikiyatrisi asistanları, tıp ve psikoloji öğrencileri. Amaç, üç klasik görevin neyi ölçtüğünü ve sonuçlarının neden tanı koydurmadığını deneyerek göstermek.

## Özgün eserden farklar

Uyarlama çeviriden ibaret değildir; görevlerin işleyişi de değişti.

| Konu | Özgün eser | Bu sürüm |
|---|---|---|
| Dil | İngilizce arayüz | Türkçe |
| Yanıt | Yalnızca klavye | Klavye ve dokunmatik düğmeler |
| Stroop: renkler | Kırmızı, mavi, yeşil | Kırmızı, mavi, sarı (kırmızı-yeşil karışmasın diye) |
| Stroop: tuşlar | Yeşil için tanımlı tuş (G) ile dinlenen tuş (V) farklıydı; yeşil yanıtlanamıyordu | K, M, S; fiziksel tuş koduyla okunur |
| Stroop: denemeler | 20 deneme, sözcük ve renk rastgele | 24 deneme: 12 uyumlu, 12 uyumsuz, karışık sırada |
| Stroop: sonuç | Genel doğruluk ve ortalama süre | Uyumlu ve uyumsuz ayrı; girişim etkisi (fark) |
| N-geri | Yalnızca 1-geri; hedef harf parlayarak belli ediliyordu | 1-geri ve 2-geri; ipucu yok; yanıt denemeyi kısaltmaz |
| Go/No-Go | 30 deneme, her denemede %70 olasılıkla Go | 40 deneme: 30 Go, 10 No-Go; ilk üç deneme Go, No-Go art arda gelmez; denemeler arası süre değişken |
| Sonuç yorumu | Eşiklere göre "mükemmel / ortalama / belirgin" etiketleri | Etiket yok; sayının ne anlama geldiği ve sınırı yazılır |
| Açıklamalar | Yok | Her görev için "Görev hakkında", ana sayfada "Bu sayılar neden tanı koydurmaz?" ve kaynaklar |
| Dosyalar | `page2.html`, `package.json` | Kullanılmadıkları için çıkarıldı |

Özgün eserdeki eşik etiketleri (örneğin "600 ms altı mükemmel") kaldırıldı, çünkü bu eşikleri destekleyen bir norm çalışması gösterilmemişti.

## Kaynaklar

Sayfadaki on kaynaktan dokuzunun künyesi ve başlığı Kasım 2026'da PubMed kayıtlarıyla doğrulandı. Stroop (1935) PubMed'de dizinlenmediği için DOI verilmedi; künyesi yaygın atıf biçimiyle yazıldı ve tam metnin açık erişimli kopyasına bağlantı kondu.

Sayfadaki sayısal aktarımlar (Willcutt 2005: etki büyüklüğü 0,46-0,69, 83 çalışma; Wright 2014: 318 çalışma, 11 bozukluk; Hedge 2018: güvenirlik 0-0,82) ilgili makalelerin PubMed özetlerinden alındı.

## Uyarı

Bu sayfa eğitim amaçlıdır. Görevler kısaltılmıştır, norm verisi yoktur, tepki süreleri tarayıcı ve ekran gecikmesini içerir. Tanı, tarama ya da izlem için kullanılamaz. Hiçbir veri kaydedilmez ya da gönderilmez.
