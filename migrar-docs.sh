#!/bin/bash

# Script de migración de docs/ a docs-v2/
# Autor: Claude Code
# Fecha: 2025-11-01

echo "======================================"
echo "  MIGRACIÓN DE DOCUMENTACIÓN v1 → v2"
echo "======================================"
echo ""

# Ruta base
BASE_DIR="C:/Users/marti/OneDrive/Escritorio/my-tree-in-the-world/my-tree-in-the-world-front"

# Verificar que docs-v2 existe
if [ ! -d "$BASE_DIR/docs-v2" ]; then
    echo "❌ ERROR: La carpeta docs-v2 no existe"
    exit 1
fi

echo "📂 Carpeta docs-v2 encontrada"
echo ""

# Contar archivos
OLD_COUNT=$(find "$BASE_DIR/docs" -type f -name "*.md" 2>/dev/null | wc -l)
NEW_COUNT=$(find "$BASE_DIR/docs-v2" -type f -name "*.md" | wc -l)

echo "📊 Estadísticas:"
echo "   • Archivos en docs/: $OLD_COUNT"
echo "   • Archivos en docs-v2/: $NEW_COUNT"
echo ""

# Preguntar confirmación
echo "⚠️  ATENCIÓN: Esta operación hará lo siguiente:"
echo "   1. Crear backup de docs/ → docs-backup/"
echo "   2. Eliminar carpeta docs/"
echo "   3. Renombrar docs-v2/ → docs/"
echo ""
read -p "¿Deseas continuar? (s/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operación cancelada por el usuario"
    exit 0
fi

echo ""
echo "🚀 Iniciando migración..."
echo ""

# Paso 1: Backup
echo "1️⃣  Creando backup..."
if [ -d "$BASE_DIR/docs-backup" ]; then
    echo "   ⚠️  docs-backup ya existe, eliminando..."
    rm -rf "$BASE_DIR/docs-backup"
fi

cp -r "$BASE_DIR/docs" "$BASE_DIR/docs-backup"
echo "   ✅ Backup creado en docs-backup/"
echo ""

# Paso 2: Eliminar docs/
echo "2️⃣  Eliminando docs/ antiguo..."
rm -rf "$BASE_DIR/docs"
echo "   ✅ docs/ eliminado"
echo ""

# Paso 3: Renombrar docs-v2/ → docs/
echo "3️⃣  Renombrando docs-v2/ → docs/..."
mv "$BASE_DIR/docs-v2" "$BASE_DIR/docs"
echo "   ✅ docs-v2/ renombrado a docs/"
echo ""

# Verificación final
if [ -d "$BASE_DIR/docs" ]; then
    FINAL_COUNT=$(find "$BASE_DIR/docs" -type f -name "*.md" | wc -l)
    echo "======================================"
    echo "  ✅ MIGRACIÓN COMPLETADA EXITOSAMENTE"
    echo "======================================"
    echo ""
    echo "📊 Resultado:"
    echo "   • Archivos en docs/: $FINAL_COUNT"
    echo "   • Backup en: docs-backup/"
    echo ""
    echo "💡 Próximos pasos:"
    echo "   1. Verifica que docs/ tiene todos los archivos"
    echo "   2. Si todo está bien, puedes eliminar docs-backup/"
    echo "   3. Haz commit de los cambios en git"
    echo ""
else
    echo "❌ ERROR: Algo salió mal en la migración"
    echo "   Restaurando desde backup..."
    mv "$BASE_DIR/docs-backup" "$BASE_DIR/docs"
    echo "   ✅ Backup restaurado"
fi
