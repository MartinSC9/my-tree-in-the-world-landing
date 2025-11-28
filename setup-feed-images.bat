@echo off
echo ========================================
echo   Setup Feed Images - Quick Start
echo ========================================
echo.

cd my-tree-in-the-world-back

echo [1/2] Aplicando migracion de base de datos...
node apply-image-posts-migration.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: La migracion fallo.
    echo Verifica que:
    echo   - MySQL este corriendo
    echo   - El archivo .env este configurado
    echo   - Tengas permisos para modificar la BD
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Migracion completada exitosamente!
echo ========================================
echo.
echo Ahora recarga la aplicacion para ver:
echo   - 5 posts de ejemplo con imagenes
echo   - Feed ecologico rediseñado
echo   - Likes y comentarios de ejemplo
echo.
pause
