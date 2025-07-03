# README

## 1. Projeyi ZIP Dosyası Olarak İndirme ve Kurulum

1. GitHub sayfasına gidin:
   [https://github.com/can-web3/nextjs-ecommerce](https://github.com/can-web3/nextjs-ecommerce)
2. **Code** (veya **<> Code**) butonuna tıklayın.
3. Açılan menüden **Download ZIP** seçeneğine tıklayın.
4. İndirilen `nextjs-ecommerce-main.zip` dosyasını bilgisayarınızın uygun bir klasörüne kopyalayın.
5. ZIP dosyasına sağ tıklayıp **Extract All** (veya **Tümünü Çıkart**) seçeneğini kullanarak dosyaları açın.
6. Çıkartılan klasörün içine girin:

   ```bash
   cd nextjs-ecommerce-main
   ```

## 2. Node.js Kurulumu (Eğer Zaten Yüklü Değilse)

* Bu proje Node.js gerektirir. Node.js yüklü değilse:

  1. [https://nodejs.org/](https://nodejs.org/) adresine gidin.
  2. LTS sürümünü indirin ve yükleyin.
  3. Terminal veya komut istemcisini açıp versiyonu kontrol edin:

     ```bash
     node -v
     # Bunu çalıştırdığınızda 'v16.x.x' veya üzeri bir sürüm görmelisiniz.
     ```

## 3. Bağımlılıkları Yükleme

Projede ihtiyaç duyulan tüm paketleri indirmek için:

```bash
npm install
# veya eğer yarn kullanıyorsanız
yarn install
```

Bu komut `node_modules` adlı klasöre proje bağımlılıklarını yükler.

## 4. Geliştirme Sunucusunu Başlatma

Aşağıdaki komutla local geliştirme ortamını çalıştırın:

```bash
npm run dev
# veya
# yarn dev
```

Başarılı olursa terminalde şunu görürsünüz:

```
Local:   http://localhost:3000
```

Web tarayıcınızı açın ve adres satırına `http://localhost:3000` yazın. Site çalışıyor olmalı.

> **Not:** Geliştirme ortamında OTP kodu (tek seferlik giriş kodu) hem terminale hem de ekranda gösterilecektir.

## 5. Projede Kullanılan Teknolojiler

* **Next.js 15** (App Router, Metadata API)
* **React** ve **TypeScript**
* **Tailwind CSS**
* **React Hook Form**
* **React Icons**
* **React Toastify**
* **Context API** (Auth, Users, Cart, Favorites, Modal)
* **Intersection Observer API** (Infinite scroll)

## 6. Öne Çıkan Özellikler

* **Responsive Navbar**: Mobilde açılır menü, desktop’ta tam menü.
* **E-posta Tabanlı Login Modal**: OTP kodu, in-memory saklama, terminalde gösterim.
* **Favoriler & Sepet Yönetimi**: LocalStorage ile kullanıcıya özel saklama.
* **Erişilebilirlik**: Klavye ile tüm link ve butonlarda gezinebilme, focus ring.
* **Infinite Scroll**: Ürün listesinde sayfa atlama yok, otomatik yükleme.
* **Dynamic Metadata**: Her sayfa için dinamik başlık.
* **Skeleton Loader**: Veri yüklenirken placeholder.
* **Toast Bildirimleri**: Kullanıcı aksiyonları için anlık uyarı.
* **Dark Mode**: `prefers-color-scheme` desteği.
* **Form Validasyon & Maskeleme**: Kart numarası, kod, e-posta doğrulama.
* **Error Handling**: API hatalarında kullanıcı bilgilendirme.

---

Herhangi bir adımda takılırsanız, GitHub Issues bölümünden yardım istemeyi unutmayın:
[https://github.com/can-web3/nextjs-ecommerce/issues](https://github.com/can-web3/nextjs-ecommerce/issues)
