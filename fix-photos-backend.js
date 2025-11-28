const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'my-tree-in-the-world-back', 'src', 'controllers', 'planterWorkOrderController.js');

console.log('Reading file:', filePath);
let content = fs.readFileSync(filePath, 'utf8');

// First fix: Comment out validation and add validPhotoUrls definition
const oldValidation = `    // 2. Validar mínimo 3 fotos
    if (!photo_urls || photo_urls.length < 3) {
      await connection.rollback();
      return res.status(400).json({
        error: 'Se requieren mínimo 3 fotos',
        message: 'Debes subir al menos 3 fotos: general, detalle y panorámica'
      });
    }

    // 3. Completar orden`;

const newValidation = `    // 2. Validar fotos (TEMPORAL: opcional hasta implementar upload real)
    // TODO: Cuando se implemente upload de imágenes, descomentar esta validación:
    // if (!photo_urls || photo_urls.length < 3) {
    //   await connection.rollback();
    //   return res.status(400).json({
    //     error: 'Se requieren mínimo 3 fotos',
    //     message: 'Debes subir al menos 3 fotos: general, detalle y panorámica'
    //   });
    // }

    // Por ahora: fotos opcionales (puede ser array vacío o null)
    const validPhotoUrls = photo_urls && Array.isArray(photo_urls) ? photo_urls : [];

    // 3. Completar orden`;

if (content.includes(oldValidation)) {
  content = content.replace(oldValidation, newValidation);
  console.log('✓ Validation block commented and validPhotoUrls defined');
} else {
  console.log('⚠ Validation block not found or already modified');
}

// Second fix: Change photo_urls.length to validPhotoUrls.length in the loop
const oldLoop = `    // 4. Guardar fotos en work_order_photos
    for (let i = 0; i < photo_urls.length; i++) {`;

const newLoop = `    // 4. Guardar fotos en work_order_photos (si existen)
    for (let i = 0; i < validPhotoUrls.length; i++) {`;

if (content.includes(oldLoop)) {
  content = content.replace(oldLoop, newLoop);
  console.log('✓ Loop changed to use validPhotoUrls.length');
} else {
  console.log('⚠ Loop already modified or not found');
}

// Write back
fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Backend file updated successfully!');
console.log('\nChanges made:');
console.log('1. Validation for minimum 3 photos is now commented out');
console.log('2. Added validPhotoUrls constant that filters empty/null values');
console.log('3. Changed loop to use validPhotoUrls.length instead of photo_urls.length');
