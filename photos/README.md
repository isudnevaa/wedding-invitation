# 📸 Папка для фотографий

Добавьте сюда фотографии жениха и невесты:

## Файлы:

1. **groom.jpg** — Фотография жениха
2. **bride.jpg** — Фотография невесты

## Рекомендации:

- ✅ Формат: JPG или PNG
- ✅ Размер: примерно 800×1000 пикселей (вертикальные)
- ✅ Стиль: портретные фото, preferably professional
- ✅ Однообразный стиль для обеих фотографий
- ✅ Оптимизированный размер файла (до 500 КБ каждое)

## После добавления фото:

Раскомментируйте код в файле `../script.js` в функции `loadCouplePhotos()`:

```javascript
function loadCouplePhotos() {
    const groomPhoto = document.getElementById('groomPhoto');
    const bridePhoto = document.getElementById('bridePhoto');

    groomPhoto.innerHTML = '<img src="photos/groom.jpg" alt="Жених Михаил" loading="lazy">';
    bridePhoto.innerHTML = '<img src="photos/bride.jpg" alt="Невеста Анна" loading="lazy">';
}
```

---

Пока фотографии не добавлены, отображаются заглушки с иконками 🤵👰
