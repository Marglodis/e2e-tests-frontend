# 🧪 Suite de Pruebas E2E - Sistema de Productos

Este repositorio contiene una suite de pruebas end-to-end (E2E) automatizadas utilizando **Playwright** y **Cucumber**, para validar la funcionalidad de autenticación y seguridad del sistema.

## ✅ Características

- Pruebas de autenticación con credenciales incorrectas
- Validación de campos obligatorios (email, contraseña)
- Redirección ante acceso no autorizado
- Reporte HTML detallado
- Hooks con captura de pantallazos en caso de fallo
- Compatible con Cucumber BDD

## 🛠️ Tecnologías Utilizadas

- [Playwright](https://playwright.dev/) – Automatización de navegador
- [Cucumber.js](https://github.com/cucumber/cucumber-js) – Framework BDD (Given/When/Then)
- [Node.js](https://nodejs.org/) – Entorno de ejecución
- [cucumber-html-reporter](https://www.npmjs.com/package/cucumber-html-reporter) – Generación de reportes

## 📦 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Git

## 🚀 Instalación y Ejecución

1. **Clona o descarga el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/e2e-products-testing.git
   cd e2e-products-testing
2. **Instala las dependencias**
   ```bash
     npm install
3. **Ejecuta las pruebas**
   ```bash
       - npm run test:auth
       - npm run test:query
4. **Genera el reporte HTML**
   ```bash
       - npm run report
5. **Abre el reporte**
   - reports/cucumber-report.html
     
