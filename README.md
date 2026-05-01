# 🧠 Psicopedagogía Paola Zabala — Sitio Web Profesional

Sitio web completo con backend Node.js para una psicopedagoga profesional. Incluye formulario de contacto funcional, sistema de emails, base de datos SQLite y panel de administración.

## Stack Tecnológico

- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Backend:** Node.js + Express
- **Base de datos:** SQLite (better-sqlite3)
- **Email:** Nodemailer (Gmail / Ethereal en dev)
- **Auth:** JWT (jsonwebtoken)
- **Deploy:** Railway / Render

## Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## Instalación

```bash
# 1. Clonar o abrir la carpeta del proyecto
cd psicopedagogia-paola

# 2. Instalar dependencias
npm install

# 3. Copiar archivo de variables de entorno
cp .env.example .env

# 4. Editar .env con tus credenciales (ver sección Email)

# 5. Inicializar la base de datos
npm run setup

# 6. Iniciar en modo desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:3000`

## Configurar Gmail App Password

1. Ir a [myaccount.google.com](https://myaccount.google.com)
2. Seguridad → Verificación en 2 pasos (activarla si no está)
3. Seguridad → Contraseñas de aplicaciones
4. Seleccionar "Correo" y "Otro (nombre personalizado)"
5. Escribir "Psicopedagogía Web" y generar
6. Copiar la contraseña de 16 caracteres en `EMAIL_PASS` del `.env`
7. Poner tu email de Gmail en `EMAIL_USER`

> En desarrollo: si dejás `EMAIL_USER` vacío, se usa Ethereal automáticamente y te muestra un link de preview en la consola.

## Panel de Administración

Acceder a `http://localhost:3000/admin`

- **Usuario:** `admin` (configurable en .env `ADMIN_USER`)
- **Contraseña:** `cambiame123` (configurable en .env `ADMIN_PASS`)

## Deploy en Railway (gratuito)

1. Crear cuenta en [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Agregar las variables de entorno en Settings → Variables
4. Railway detecta Node.js automáticamente
5. El sitio queda live en una URL `.railway.app`

## Deploy en Render (alternativa gratuita)

1. Crear cuenta en [render.com](https://render.com)
2. New → Web Service → Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Agregar variables de entorno
6. Deploy automático en cada push

## Dominio Personalizado .com.ar

1. Registrar dominio en [nic.ar](https://nic.ar)
2. En Railway/Render: Settings → Custom Domain → agregar tu dominio
3. En NIC.ar: configurar los DNS (CNAME) que te indica la plataforma
4. Esperar propagación DNS (hasta 48hs)

## Solución de Problemas

| Problema | Solución |
|----------|----------|
| `better-sqlite3` no compila | Instalar build tools: `npm install -g windows-build-tools` (Windows) |
| Emails no llegan | Verificar que Gmail App Password esté bien configurada |
| Error CORS | Verificar que `SITE_URL` en .env coincide con tu dominio |
| Puerto en uso | Cambiar `PORT` en .env |
