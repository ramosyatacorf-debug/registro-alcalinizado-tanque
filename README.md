# Registro de Alcalinizado en Tanque

**EXPORTADORA ROMEX S.A. — Planta de Cacao Chincha**  
Código: `P-RAT-R-055` | Edición: 6 | Fecha de emisión: 13-01-2026

Formulario digital **pensado para los operarios de producción**.  
Diseño claro, campos grandes, validación en tiempo real de los parámetros oficiales y listo para imprimir.

---

## Características orientadas a operarios

| Función | Descripción |
|---------|-------------|
| **Pasos numerados** | Flujo claro: 1 Datos → 2 Insumos → 3 Proceso → 4 Controles → 5 Limpieza |
| **Validación en vivo** | pH, humedad, temperatura de solución y vacío se marcan en verde (dentro de rango) o rojo (fuera de rango) |
| **Botones grandes** | Área táctil mínima de 44 px (fácil de usar en tablet o pantalla táctil) |
| **Guardado automático** | El borrador se guarda solo mientras escribes |
| **Parámetros visibles** | Rangos oficiales siempre a la vista junto a cada campo crítico |
| **Impresión limpia** | Optimizado para A4 horizontal (mismo formato del papel original) |

### Parámetros oficiales que se validan

- **pH**: 6.80 – 7.40
- **% Humedad**: 1.5 – 4.0
- **Temperatura de solución**: 50 – 120 °C
- **Vacío**: −0.5 – −0.8 BAR

---

## Cómo usar (operario)

1. Abre `index.html` en Chrome, Edge o Firefox (también funciona en tablet).
2. Completa los campos en orden (pasos 1 al 5).
3. Los valores fuera de rango se marcan automáticamente en rojo.
4. Pulsa **Guardar** si quieres asegurar el borrador (también se guarda solo).
5. Al terminar, pulsa **Imprimir** → elige orientación **Horizontal**.

---

## Comandos para clonar

```bash
git clone https://github.com/ramosyatacorf-debug/registro-alcalinizado-tanque.git
cd registro-alcalinizado-tanque

# Opción rápida – abrir directo
# Windows:
start index.html
# macOS:
open index.html
# Linux:
xdg-open index.html

# O servir localmente:
python -m http.server 8000
# Luego abrir: http://localhost:8000
```

---

## Estructura del proyecto

```
registro-alcalinizado-tanque/
├── index.html          # Formulario principal (fillable)
├── css/
│   └── styles.css      # Material Design 3 + estilos de impresión
├── js/
│   └── app.js          # Validación, guardado, limpia e impresión
├── README.md
├── LICENSE
└── .gitignore
```

---

## Tecnologías

- HTML5 semántico
- CSS3 (Grid + Flexbox + Custom Properties)
- JavaScript vanilla (ES6+)
- Material Design 3 (colores, tipografía, elevación y estados)
- Sin dependencias externas

---

## Licencia

MIT © EXPORTADORA ROMEX S.A. / Desarrollo interno
