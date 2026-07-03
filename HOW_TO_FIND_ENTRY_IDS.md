# 📋 Как найти Entry IDs для Google Form

## Шаг 1: Откройте форму в режиме предпросмотра

Вашa форма:
```
https://docs.google.com/forms/d/e/1FAIpQLSectH5TPvd8cEYObOLsFh8s6d0W97EjvGKTgmQump7c1JM38g/viewform
```

Замените `/viewform` на `/viewform?usp=pp_url` или просто откройте форму и нажмите **Send** → **Send (для теста)**

---

## Шаг 2: Откройте инструменты разработчика

- **Chrome**: F12 → Developer Tools
- **Firefox**: F12 → Inspector
- **Mac**: Cmd+Option+I
- **Windows**: Ctrl+Shift+I

---

## Шаг 3: Найдите Entry IDs

В Developer Tools:

1. Нажмите на **Inspector/Elements** (Элементы)
2. Используйте поиск (Ctrl+F)
3. Введите: `entry.`

Вы увидите элементы вида:
```html
<input name="entry.1234567890" ...>
```

---

## Шаг 4: Скопируйте ID для каждого поля

### Для поля "Ваше имя":
Ищите первый input с `name="entry.XXXXXXXX"`
Скопируйте: `entry.1234567890`

### Для поля "Придете?":
Ищите input с `name="entry.YYYYYYYY"`
Скопируйте: `entry.YYYYYYYY`

### Для остальных полей аналогично

---

## Шаг 5: Запишите ID

Скопированные ID:

```
Имя: entry.1234567890
Присутствие: entry.0987654321
Гостей: entry.1122334456
Особенности питания: entry.9988776654
Комментарий: entry.5544332211
```

---

## Шаг 6: Сообщите IDs

Напишите мне ID которые вы нашли, и я обновлю код!

---

## 💡 Альтернатива — более простой способ

Скопируйте этот код и вставьте в консоль браузера (F12 → Console) находясь на странице формы:

```javascript
document.querySelectorAll('[data-item-id]').forEach(el => {
    const label = el.querySelector('[data-item-id]').getAttribute('data-item-id');
    const inputs = el.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.name && input.name.includes('entry.')) {
            console.log('ID:', input.name);
        }
    });
});
```

Это покажет все entry IDs в консоли! 🎯
