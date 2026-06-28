# 📧 Настройка отправки RSVP анкеты вам на Email

Данные гостей будут приходить в **Google Таблицу** + на **ваш Email**

---

## 🚀 Шаг 1: Создайте Google Таблицу

1. Откройте [sheets.google.com](https://sheets.google.com)
2. Создайте новую таблицу: "Свадьба - RSVP"
3. Назовите столбцы (в первой строке):
   - `Дата`
   - `Имя`
   - `Присутствие`
   - `Гостей`
   - `Питание`
   - `Аллергии`
   - `Комментарий`
   - `IP/UserAgent`

---

## 🔧 Шаг 2: Создайте Google Apps Script

1. В таблице: **Extensions** → **Apps Script**
2. Удалите весь код
3. Вставьте этот код:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Получаем таблицу
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Добавляем данные
    sheet.appendRow([
      new Date(),
      data.name || '',
      data.attendance === 'yes' ? 'Придет' : 'Не придет',
      data.guests || '1',
      (data.diet || []).join(', '),
      data.allergyDetails || '',
      data.message || '',
      data.userAgent || ''
    ]);

    // Отправляем email вам
    sendEmailNotification(data);

    // Ответ
    return ContentService.createTextOutput(
      JSON.stringify({ success: true, message: 'Данные сохранены' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function sendEmailNotification(data) {
  const recipient = 'ваш@email.com'; // ← ВАШ EMAIL
  const subject = '💌 Новое RSVP: ' + data.name;

  const body = `
🎉 Новый ответ на приглашение!

👤 Имя: ${data.name}
✅ Присутствие: ${data.attendance === 'yes' ? 'Придет' : 'Не придет'}
👥 Гостей: ${data.guests}

🍽️ Питание: ${(data.diet || []).join(', ') || 'Без особенностей'}
⚠️ Аллергии: ${data.allergyDetails || 'Нет'}

💬 Комментарий:
${data.message || 'Нет комментария'}

---
Дата: ${new Date().toLocaleString('ru-RU')}
  `.trim();

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body
  });
}
```

4. **Сохраните** (Ctrl+S)
5. **Важный шаг:** Замените `ваш@email.com` на ваш реальный email

---

## 🌐 Шаг 3: Опубликуйте скрипт

1. Нажмите **Deploy** → **New deployment**
2. Тип: **Web app**
3. Settings:
   - Description: "RSVP API"
   - Execute as: **Me** (ваш email)
   - Who has access: **Anyone**
4. Нажмите **Deploy**
5. **Скопируйте URL** (выглядит как: `https://script.google.com/...`)

---

## 🔧 Шаг 4: Обновите проект

Откройте файл `js/rsvp.js` и замените:

```javascript
// Найдите строку 580:
// submitUrl: 'https://your-api.com/rsvp',

// Замените на:
submitUrl: 'https://script.google.com/macros/s/ВАШ_АЙДИ/exec',
```

Где `ВАШ_АЙДИ` — из скопированного URL

---

## 📤 Шаг 5: Загрузите на GitHub

```powershell
cd C:\Users\isudneva\wedding-invitation
git add js/rsvp.js
git commit -m "Настроена отправка RSVP"
git push
```

---

## ✅ Шаг 6: Протестируйте

1. Откройте приглашение
2. Заполните форму
3. Проверьте:
   - Данные в Google Таблице
   - Email на вашем ящике

---

## 🔒 Безопасность

Google Apps Script с настройкой **Anyone** безопасен потому что:
- ✅ Только принимает POST запросы
- ✅ Нет аутентикации пользователей
- ✅ Данные защищены Google
- ✅ Можно ограничить доступ по IP если нужно

---

## 📊 Дополнительно

### Просмотр всех ответов:

1. Откройте Google Таблицу
2. Все данные гостей в одном месте
3. Можно фильтровать, сортировать, экспортировать

### Статистика:

Добавьте в таблицу сводные таблицы для:
- Количества гостей
- Предпочтений по питанию
- Подтвердивших/отказавшихся

---

## ❓ Частые вопросы

**Q: Email не приходит?**
A: Проверьте папку Спам. Первый раз может попасть туда.

**Q: Ошибка при отправке?**
A: Проверьте что URL правильный и доступ стоит "Anyone".

**Q: Можно ли отправлять в Telegram?**
A: Да! Замените функцию `sendEmailNotification` на отправку в Telegram Bot.

---

Готово! Теперь все данные гостей будут приходить вам в таблицу и на email 🎉
