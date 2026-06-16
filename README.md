# 🌸 Nuestro Jardín

Un jardín web privado para ti y tu pareja. Cada quien puede **plantar una flor**
de un color bonito, con un **mensaje** y su **fecha y hora**. Las flores quedan
guardadas y ambos las ven desde el celular o la computadora. 💛

> Una forma de cultivar cosas bonitas para darse amor.

---

## ✨ ¿Cómo funciona?

- Se entra con una **frase secreta** que solo ustedes dos conocen.
- Cada quien pone su **nombre** la primera vez (así se firman las flores).
- Tocas **🌱 Plantar una flor**, eliges color y forma, escribes tu mensaje y listo.
- Tocas cualquier flor para **leer su mensaje**.
- Funciona en celular y computadora, sin instalar nada.

Hay **dos modos**:

| Modo | Qué pasa | Cuándo |
|---|---|---|
| 🌱 **Demo** | Las flores se guardan solo en *ese* dispositivo | Si no has configurado Supabase |
| 🌷 **Compartido** | Ambos ven las **mismas** flores en tiempo real | Cuando pegas tus datos de Supabase (gratis) |

---

## 🎨 1) Personaliza (archivo `config.js`)

Abre `config.js` y cambia solo el texto entre comillas:

```js
titulo: "Nuestro Jardín",   // el nombre de su jardín
fraseSecreta: "te amo",     // cámbienla por algo que solo ustedes sepan
```

Eso es todo lo mínimo. Si lo dejas así, ya funciona en **modo demo**.

> Puedes probarlo ahora mismo: haz doble clic en `index.html` para abrirlo en tu
> navegador. (En modo demo las flores se guardan solo en tu equipo.)

---

## 🗄️ 2) Base de datos gratis para compartir (Supabase) — ~5 min

Esto es lo que hace que **ambos vean el mismo jardín**.

1. Entra a **https://supabase.com** y crea una cuenta gratis.
2. Clic en **New project**. Ponle un nombre (ej. `jardin`), una contraseña
   cualquiera, elige la región más cercana y crea el proyecto. Espera ~1 minuto.
3. En el menú de la izquierda abre **SQL Editor → New query**.
4. Abre el archivo `supabase-setup.sql` de este proyecto, **copia todo** su
   contenido, pégalo y presiona **Run**. (Debe decir *Success*.)
5. Ve a **Project Settings (⚙️) → API** y copia dos cosas:
   - **Project URL** (algo como `https://abcdefgh.supabase.co`)
   - La clave **anon public**
6. Pégalas en `config.js`:

```js
supabaseUrl: "https://abcdefgh.supabase.co",
supabaseAnonKey: "eyJhbGciOi...la-clave-larga...",
```

Guarda el archivo. ¡Listo, ahora es compartido! 🌼

---

## 🐙 3) Súbelo a GitHub (sin usar la terminal)

1. Entra a **https://github.com** y crea una cuenta (si no tienes).
2. Clic en **+ → New repository**. Ponle un nombre (ej. `nuestro-jardin`),
   déjalo **Private** y crea el repositorio.
3. En la página del repo vacío, clic en **uploading an existing file**.
4. **Arrastra todos los archivos** de esta carpeta (index.html, style.css,
   app.js, flowers.js, config.js, favicon.svg, etc.) y haz **Commit changes**.

> Cada vez que cambies algo (por ejemplo el título o la frase), vuelve a subir
> el archivo a GitHub y Vercel actualizará la página solo.

---

## 🚀 4) Publícalo en Vercel (gratis)

1. Entra a **https://vercel.com** y entra con tu cuenta de **GitHub**.
2. Clic en **Add New… → Project** e **importa** el repositorio `nuestro-jardin`.
3. En *Framework Preset* elige **Other** (no necesita comando de build).
4. Clic en **Deploy**. En unos segundos te dará un enlace como
   `https://nuestro-jardin.vercel.app`.

¡Eso es todo! 🎉

---

## 💌 5) Compártelo con tu pareja

Envíale el **enlace** de Vercel y la **frase secreta**. Cada quien entra, pone su
nombre y empiezan a plantar flores el uno para el otro. 🌹

---

## 🔐 Sobre la privacidad

- El jardín está protegido por la **frase secreta** y por el **enlace privado**
  (que solo ustedes conocen).
- La frase secreta es un **candado suave**: alguien con conocimientos técnicos
  podría verla en el código. Para algo tan íntimo está bien, pero no guardes ahí
  información delicada. La verdadera protección es **no compartir el enlace**.

---

## 🛠️ Problemas comunes

- **Las flores no se comparten entre los dos** → revisa que pegaste *Project URL*
  y *anon public* en `config.js` y que corriste el `supabase-setup.sql`.
- **Pantalla en blanco** → casi siempre es una **comilla borrada** en `config.js`.
  Revisa que cada texto siga entre `"comillas"`.
- **Dice "esa no es" al entrar** → la frase no distingue mayúsculas ni acentos,
  pero sí las letras. Confirma que escribes la misma frase de `config.js`.

Hecho con cariño. 🌷
