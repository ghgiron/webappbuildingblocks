# 🏛️ Arma la Casa de Bogotá — Portal Transaccional

Prototipo interactivo táctil para kiosco vertical de 55 pulgadas (1080 x 1920 px, 9:16) desarrollado para la **Alcaldía Mayor de Bogotá**, enfocado en la pedagogía y divulgación de los **15 Building Blocks (Soluciones Compartidas)** del Portal Transaccional para **la ciudadanía**.

---

## 🚀 Despliegue en Vercel

### Opción 1: Conectar Repositorio GitHub a Vercel (Recomendada)
1. Sube este repositorio a tu cuenta de GitHub (ver sección de Git abajo).
2. Ve a [vercel.com](https://vercel.com) e inicia sesión.
3. Haz clic en **"Add New..."** ➔ **"Project"**.
4. Selecciona tu repositorio de GitHub `Webapp Building Blocks ANDICOM`.
5. Vercel detectará automáticamente el framework **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Haz clic en **"Deploy"**. En ~30 segundos tu aplicación estará publicada y accesible con URL pública HTTPS.

### Opción 2: Despliegue Directo con Vercel CLI
```bash
# Instalar CLI de Vercel (si no lo tienes)
npm i -g vercel

# Iniciar sesión y desplegar
vercel
```

---

## 🛠️ Comandos de Git para Subir a tu Repositorio de GitHub

Si ya creaste tu repositorio vacío en GitHub (ejemplo: `https://github.com/tu-usuario/arma-la-casa-bogota.git`):

```bash
# 1. Agregar el origen remoto (reemplaza con tu URL de GitHub)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 2. Renombrar la rama principal a main
git branch -M main

# 3. Subir todos los cambios
git push -u origin main
```

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción y verificar tipos TypeScript
npm run build
```

---

## 📐 Características Principales
- **Diseño Ergonómico Vertical 9:16**: Optimizado para pantallas táctiles de 55" (1080 x 1920 px) con auto-escalado responsive en cualquier dispositivo.
- **Interacción Táctil Dual**: *Drag & Drop* sin latencia mediante `PointerEvents` + *Tap-to-Place* con guía luminosa dorada (`#FFD100`).
- **Tangram SVG Procedural con Textura LEGO**: 15 polígonos complementarios con cobertura del 100% de la silueta de la Casa de Bogotá.
- **Web Audio API**: Síntesis procedural autónoma para efectos táctiles de encaje (*Snap LEGO*), errores y fanfarria de victoria sin dependencias de archivos de audio.
- **Simulación Interactiva de Trámite Distrital (15/15)**: Animación láser secuencial a través de los bloques demostrando el viaje transaccional de **la ciudadanía**.
