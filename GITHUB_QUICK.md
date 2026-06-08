# 🚀 Быстрая инструкция: 5 минут до онлайн

**GitHub Pages** — бесплатный хостинг, работает в России без VPN

---

## 📋 Быстрый старт (без лишних слов)

### 1️⃣ Создайте аккаунт на GitHub
> [github.com](https://github.com) → Sign up

### 2️⃣ Установите Git (если нет)
> [git-scm.com/download/win](https://git-scm.com/download/win) → установить

### 3️⃣ Создайте репозиторий
На GitHub:
- `+` → `New repository`
- Name: `wedding-invitation`
- Public
- `Create repository`
- **Скопируйте URL** (ссылку)

### 4️⃣ Загрузите файлы
В PowerShell (поиск → "PowerShell"):

```powershell
# Настройка (один раз)
git config --global user.name "Ваше Имя"
git config --global user.email "ваш@email.com"

# Загрузка приглашения
cd C:\Users\isudneva\wedding-invitation
git init
git add .
git commit -m "Свадьба"
git remote add origin https://github.com/ВАШ_ЛОГИН/wedding-invitation.git
git branch -M main
git push -u origin main
```

> После `git push` откроется браузер → войдите в GitHub

### 5️⃣ Включите GitHub Pages
На GitHub:
- Ваш репозиторий → `Settings` → `Pages`
- Source: `Deploy from a branch`
- Branch: `main` / `/(root)`
- `Save`

🎉 Через 2 минуты: `https://ваш-логин.github.io/wedding-invitation/`

---

## 🔄 Обновление

```powershell
cd C:\Users\isudneva\wedding-invitation
git add .
git commit -m "Обновление"
git push
```

---

**Подробная инструкция:** [GITHUB_GUIDE.md](GITHUB_GUIDE.md)
