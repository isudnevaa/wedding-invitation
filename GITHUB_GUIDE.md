# 📤 Инструкция: Загрузка приглашения на GitHub Pages

**GitHub Pages** — бесплатный хостинг от GitHub, работает в России без VPN. Ваше приглашение будет доступно по ссылке вида: `https://ваш-логин.github.io/wedding-invitation/`

---

## 🎯 Что нужно:

- ✅ Компьютер
- ✅ Папка с приглашением (`C:\Users\isudneva\wedding-invitation`)
- ✅ Аккаунт на GitHub (создадим за 2 минуты)

---

## 📋 Пошаговая инструкция

### Шаг 1: Создайте аккаунт на GitHub (если нет)

1. Перейдите на [github.com](https://github.com)
2. Нажмите **"Sign up"** (Зарегистрироваться)
3. Заполните:
   - Username (логин) — запомните, он будет в ссылке!
   - Email
   - Password
4. Подтвердите email

> **Примечание:** Если у вас уже есть аккаунт — пропускайте этот шаг

---

### Шаг 2: Скачайте и установите Git (если нет)

**Для Windows:**

1. Перейдите на [git-scm.com/download/win](https://git-scm.com/download/win)
2. Скачайте установщик
3. Запустите и нажмите **Next** во всех окнах (настройки по умолчанию)
4. Готово!

**Проверьте установку:**
- Откройте PowerShell (Win + X → Windows PowerShell)
- Введите: `git --version`
- Если увидите версию — всё ок!

> **Примечание:** Если команда не работает, перезапустите PowerShell

---

### Шаг 3: Создайте репозиторий на GitHub

1. Войдите на [github.com](https://github.com)
2. Нажмите **"+"** в верхнем правом углу → **"New repository"**
3. Заполните:
   - **Repository name**: `wedding-invitation` (можно любое)
   - **Description**: `Свадебное приглашение` (необязательно)
   - Выберите **"Public"**
   - ✅ **НЕ** ставьте галочку "Add a README file"
4. Нажмите **"Create repository"**

5. **Скопируйте URL** вашего репозитория (он понадобится)
   - Выглядит так: `https://github.com/ваш-логин/wedding-invitation.git`

---

### Шаг 4: Настройте Git (первый раз)

Откройте PowerShell и выполните:

```powershell
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"
```

> Используйте тот же email, что при регистрации на GitHub!

---

### Шаг 5: Загрузите приглашение

**В PowerShell:**

```powershell
# 1. Перейдите в папку с приглашением
cd C:\Users\isudneva\wedding-invitation

# 2. Инициализируйте git
git init

# 3. Добавьте все файлы
git add .

# 4. Сделайте первый коммит
git commit -m "Мое свадебное приглашение"

# 5. Свяжите с GitHub (замените на ваш URL!)
git remote add origin https://github.com/ваш-логин/wedding-invitation.git

# 6. Загрузите на GitHub
git branch -M main
git push -u origin main
```

**После команды `git push` вам предложат войти:**

1. Появится окно браузера → введите логин и пароль GitHub
2. Вернитесь в PowerShell — дождитесь завершения загрузки
3. Готово! 🎉

---

### Шаг 6: Включите GitHub Pages

1. Откройте ваш репозиторий на GitHub:
   `https://github.com/ваш-логин/wedding-invitation`

2. Нажмите **Settings** (⚙️) вверху

3. В меню слева выберите **Pages**

4. В разделе "Build and deployment":
   - **Source**: выберите **Deploy from a branch**
   - **Branch**: выберите **main** и папку **/(root)**
   - Нажмите **Save**

5. Подождите 1-2 минуты и обновите страницу

6. Появится ваш URL:
   ```
   https://ваш-логин.github.io/wedding-invitation/
   ```

---

## 🎉 Готово!

Ваша ссылка готова — отправляйте её в Telegram!

**Пример:**
```
https://ivanov-ivan.github.io/wedding-invitation/
```

---

## 🔄 Как обновить приглашение?

Если вы изменили файлы и хотите обновить на сайте:

```powershell
cd C:\Users\isudneva\wedding-invitation

# Посмотреть что изменилось
git status

# Добавить изменения
git add .

# Коммит
git commit -m "Обновление"

# Загрузить
git push
```

GitHub Pages автоматически обновится через 1-2 минуты!

---

## ❓ Частые ошибки

### Ошибка 1: "Permission denied (publickey)"
**Решение:** Используйте HTTPS вместо SSH:
```powershell
git remote set-url origin https://github.com/ваш-логин/wedding-invitation.git
```

### Ошибка 2: "failed to push some refs"
**Решение:**
```powershell
git pull origin main --rebase
git push origin main
```

### Ошибка 3: Git не установлен
**Решение:** Вернитесь к Шагу 2 и установите Git

---

## 💡 Полезные команды Git

| Команда | Что делает |
|---------|-------------|
| `git status` | Показывает изменённые файлы |
| `git add .` | Добавляет все изменения |
| `git commit -m "текст"` | Сохраняет изменения с комментарием |
| `git push` | Загружает на GitHub |
| `git pull` | Скачивает изменения с GitHub |

---

## 🎨 Кастомизация ссылки (опционально)

Если хотите красивую ссылку:

1. Купите домен (например, на [reg.ru](https://reg.ru) или [nic.ru](https://nic.ru))
2. В настройках GitHub Pages → Custom domain
3. Добавьте ваш домен
4. Настройте DNS по инструкции GitHub

**Пример:**
- Было: `https://ivanov.github.io/wedding-invitation/`
- Стало: `https://dmitry-irina.wedding/`

---

## 📞 Нужна помощь?

Если что-то не работает:

1. **Проверьте**:
   - Git установлен? (`git --version`)
   - Правильная папка? (`cd C:\Users\isudneva\wedding-invitation`)
   - Правильный URL репозитория?

2. **Посмотрите** официальную документацию:
   - [GitHub Pages](https://docs.github.com/pages)
   - [Git Basics](https://git-scm.com/docs/gittutorial)

3. **Спросите** в чате с поддержкой GitHub

---

## ✅ Чек-лист

- [ ] Аккаунт на GitHub создан
- [ ] Git установлен
- [ ] Репозиторий создан
- [ ] Файлы загружены (`git push`)
- [ ] GitHub Pages включен
- [ ] Ссылка работает

**Когда все готово — отправляйте ссылку в Telegram! 🎉**

---

*Удачи с вашим приглашением! 💍*
