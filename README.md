# 💒 Свадебное приглашение - Ирина & Дмитрий

Современное интерактивное свадебное приглашение в формате Mobile First Landing Page с премиальным дизайном Luxury Minimalism.

![Wedding Invitation](https://img.shields.io/badge/Status-Production%20Ready-success)
![PWA](https://img.shields.io/badge/PWA-Ready-blue)
![Mobile First](https://img.shields.io/badge/Mobile%20First-Responsive-orange)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Особенности

- 🎨 **Luxury Minimalism дизайн** с золотыми акцентами
- 📱 **Mobile First** - оптимизировано для смартфонов от 320px
- ⚡ **PWA** - устанавливается как приложение на телефон
- ✨ **Плавные анимации** - золотые частицы, scroll-эффекты, transitions
- 🎵 **Фоновая музыка** с управлением
- ⏰ **Обратный отсчёт** до свадьбы
- 📋 **RSVP форма** с валидацией
- 📍 **Интерактивная карта** с построением маршрута
- 💾 **Offline режим** - работает без интернета
- 🔔 **Push уведомления** (опционально)

## 🚀 Быстрый старт

### Установка

```bash
# Клонировать репозиторий
git clone https://github.com/yourusername/wedding-invitation.git
cd wedding-invitation
```

### Запуск локально

Просто откройте `index.html` в браузере или используйте локальный сервер:

```bash
# Python 3
python -m http.server 8000

# Node.js (с установленным http-server)
npx http-server

# PHP
php -S localhost:8000
```

Откройте http://localhost:8000 в браузере.

## 📂 Структура проекта

```
wedding-invitation/
├── index.html              # Основной HTML файл
├── manifest.json           # PWA манифест
├── service-worker.js       # Service Worker для оффлайн режима
├── css/
│   ├── main.css           # Основные стили и переменные
│   ├── animations.css     # Все анимации
│   └── responsive.css    # Медиа-запросы
├── js/
│   ├── utils.js           # Утилиты
│   ├── particles.js       # Золотые частицы
│   ├── animations.js      # Scroll-анимации
│   ├── countdown.js       # Обратный отсчёт
│   ├── music.js           # Фоновая музыка
│   ├── rsvp.js            # RSVP форма
│   └── main.js            # Главный файл приложения
├── assets/
│   ├── fonts/             # Шрифты (если self-hosted)
│   ├── images/            # Изображения
│   ├── icons/             # Иконки SVG
│   └── music/             # Фоновая музыка
└── README.md              # Этот файл
```

## 🎨 Кастомизация

### Изменение данных свадьбы

#### 1. Дата свадьбы

Откройте `js/countdown.js` и измените дату:

```javascript
countdownInstance = new AnimatedCountdown({
    weddingDate: new Date('2026-08-15T16:00:00'), // Ваша дата
    // ...
});
```

Также измените в `index.html`:

```html
<div class="hero__date">
    <p class="hero__day">15</p>          <!-- День -->
    <p class="hero__month">августа</p>    <!-- Месяц -->
    <p class="hero__year">2026</p>        <!-- Год -->
</div>
```

#### 2. Имена пары

В `index.html`:

```html
<div class="hero__names">
    <span class="hero__name">Ирина</span>    <!-- Имя 1 -->
    <span class="hero__ampersand">&</span>
    <span class="hero__name">Дмитрий</span>   <!-- Имя 2 -->
</div>
```

Также измените в футере и финальном разделе:

```html
<div class="final__couple">
    <span class="final__name">Ирина</span>
    <span class="final__ampersand">&</span>
    <span class="final__name">Дмитрий</span>
</div>
```

#### 3. Место проведения

В `index.html`, секция "Когда и где":

```html
<h3 class="location-card__title">Ресторан "Золотой век"</h3>
<p class="location-card__address" id="address">Улица Свадебная, д. 1, Москва</p>
```

Обновите координаты в `js/utils.js`:

```javascript
openMaps(address, lat = 55.7558, lng = 37.6176) { // Ваши координаты
    // ...
}
```

#### 4. Google Maps

Замените iframe src в `index.html` на вашу карту:

```html
<iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1dВАШИ_КОРДИНАТЫ..."
    class="map-iframe"
    allowfullscreen=""
    loading="lazy">
</iframe>
```

### Изменение цветовой схемы

В `css/main.css` измените CSS переменные:

```css
:root {
    /* Основные цвета */
    --color-gold: #D4AF37;        /* Ваш золотой */
    --color-gold-light: #F4E4BC;   /* Светлый золотой */
    --color-gold-dark: #B8860B;    /* Тёмный золотой */

    /* Акценты */
    --accent-gold: #D4AF37;
    --accent-rose: #E8B4B8;        /* Розовый акцент */
}
```

### Добавление фотографий

Замените placeholder URLs в `index.html` на ваши фотографии:

```html
<div class="timeline__photo">
    <img src="your-photo-1.jpg" alt="Описание">
</div>
```

Для дресс-кода:

```html
<div class="outfit-card__image">
    <img src="your-outfit-1.jpg" alt="Описание">
</div>
```

## 🎵 Фоновая музыка

Поместите ваш музыкальный файл в `assets/music/`:

```
assets/
└── music/
    └── wedding-music.mp3
```

Поддерживаемые форматы: MP3, WAV, OGG.

### Управление музыкой

- Кнопка в правом верхнем углу
- Горячая клавиша: `Ctrl/Cmd + M`
- Автоматическое продолжение при навигации

## 📝 RSVP форма

### Интеграция с бэкендом

В `js/rsvp.js` укажите ваш endpoint:

```javascript
rsvpForm = new RSVPForm({
    form: form,
    modal: document.getElementById('successModal'),
    submitUrl: 'https://your-api.com/rsvp',  // Ваш URL
    submitMethod: 'POST',
    onSuccess: (data) => {
        // Обработка успеха
    },
    onError: (error) => {
        // Обработка ошибки
    }
});
```

### Варианты интеграции

#### 1. Google Forms + Apps Script

Создайте Google Form и используйте этот скрипт:

```javascript
// Google Apps Script
function doPost(e) {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([data.name, data.attendance, data.guests, data.message, new Date()]);
    return ContentService.createTextOutput(JSON.stringify({success: true})).setMimeType(ContentService.MimeType.JSON);
}
```

#### 2. Telegram Bot

```javascript
rsvpForm = new RSVPForm({
    submitUrl: 'https://api.telegram.org/botYOUR_BOT_TOKEN/sendMessage',
    submitMethod: 'POST',
    // ... форматирование для Telegram
});
```

#### 3. Google Sheets напрямую

Используйте Google Apps Script как API (см. выше Google Forms).

## 🌐 Деплой на Netlify

### Способ 1: Drag & Drop

1. Откройте [netlify.com](https://netlify.com)
2. Перетащите папку `wedding-invitation` в Netlify
3. Готово!

### Способ 2: Git

```bash
# Инициализировать git
git init
git add .
git commit -m "Initial commit"

# Добавить remote
git remote add origin https://github.com/yourusername/wedding-invitation.git

# Пушить
git push -u origin main
```

Затем в Netlify:
1. New site from Git
2. Выберите репозиторий
3. Build settings: Оставьте пустыми (статический сайт)
4. Deploy!

### Custom Domain

В настройках Netlify:
1. Domain settings → Add custom domain
2. Укажите ваш домен
3. Настройте DNS по инструкциям Netlify

## 🔧 Конфигурация PWA

### Иконки

Создайте иконки следующих размеров:
- 72x72, 96x96, 128x128, 144x144, 152x152
- 192x192 (основная)
- 384x384, 512x512 (maskable)

Поместите в `assets/images/` с названиями:
```
icon-72.png, icon-96.png, icon-96.png, ..., icon-512.png
```

### PWA Manifest

В `manifest.json` обновите:
- `name`, `short_name`
- `description`
- `theme_color`, `background_color`
- Иконки (если используете другие размеры)

## 📱 Установка как приложение

### Android (Chrome)

1. Откройте приглашение в Chrome
2. Нажмите на меню (⋮)
3. "Добавить на главный экран"

### iOS (Safari)

1. Откройте приглашение в Safari
2. Нажмите кнопку "Поделиться" (↑)
3. "На экран Домой"

## 🎯 Горячие клавиши

| Клавиша | Действие |
|---------|----------|
| `Ctrl/Cmd + M` | Включить/выключить музыку |
| `↓` | Следующая секция |
| `↑` | Предыдущая секция |
| `Ctrl/Cmd + Home` | В начало |
| `Ctrl/Cmd + End` | В конец |
| `Escape` | Закрыть модальное окно |

## 📊 Аналитика

Для включения аналитики добавьте в `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

События отслеживаются автоматически:
- `invitation_opened`
- `address_copied`
- `route_opened`
- `invitation_shared`
- `rsvp_submitted`

## 🔐 Безопасность

### HTTPS

Для PWA функционала обязательно нужен HTTPS. Netlify предоставляет бесплатный SSL.

### Content Security Policy

Добавьте в `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.google.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' https: data:;
    connect-src 'self' https://your-api.com;
">
```

## 🐛 Troubleshooting

### Музыка не играет автоматически

Браузеры блокируют autoplay. Решение:
- Музыка начнёт при первом взаимодействии
- Показывается кнопка включения

### Иконки не отображаются

Убедитесь что:
- Файлы иконок существуют в `assets/images/`
- Пути в `manifest.json` правильные
- Иконки нужного размера

### Offline режим не работает

Проверьте:
- Service Worker зарегистрирован (DevTools → Application)
- HTTPS включён (обязательно для Service Worker)
- Файлы закэшированы (Cache Storage)

### RSVP форма не отправляется

Проверьте консоль браузера на ошибки. Убедитесь что:
- `submitUrl` указан правильно
- Бэкенд принимает CORS запросы
- Данные в правильном формате

## 📝 Лицензия

MIT License - свободно используйте для личных проектов.

## 🤝 Участие в разработке

Contributions welcome! Создайте Issue или Pull Request.

## 📧 Контакты

По вопросам обращайтесь к разработчику.

---

**Сделано с 💕 для особенного дня**

Ирина & Дмитрий 💒
