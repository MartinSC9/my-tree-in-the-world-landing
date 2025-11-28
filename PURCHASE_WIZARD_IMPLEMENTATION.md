# Purchase Wizard Implementation Summary

## Overview

Successfully implemented a 4-step onboarding wizard for tree purchases with enhanced UX and support for public/private location types.

## ✅ Completed Features

### Frontend (my-tree-in-the-world-front)

#### 1. PurchaseWizard Component (`src/components/PurchaseWizard.jsx`)

**Step 1: Location Selection**
- Radio button selector for location type:
  - 🌍 **Public location**: Trees appear on global map (parks, forests, community spaces)
  - 🏠 **Private location**: Trees hidden from public map (home gardens, private property)
- Interactive map with click-to-select coordinates
- Geolocation auto-detect on page load
- Address input field for private locations
- Validation: Requires location coordinates and address (if private)

**Step 2: Species Confirmation**
- Large visual display of selected tree with image
- Shows scientific name, species, and nursery information
- Benefits list explaining why this tree is a good choice
- Pre-selected from catalog (no action needed from user)

**Step 3: Name & Message Personalization**
- Tree name input auto-filled with `"{species} de {username}"`
- Message/dedication field (max 500 characters)
- QR code preview showing how info appears when scanned
- Explains that name and message appear on physical tree QR code
- Validation: Requires tree name

**Step 4: Payment Summary**
- Complete purchase summary with tree image
- Shows: tree name, species, location type, nursery, total price
- Lists included benefits:
  - ✓ Digital certificate
  - ✓ Unique QR code
  - ✓ Photo tracking
  - ✓ Progress notifications
  - ✓ 100 EcoPoints
- Final "Pay" button

**Visual Features**:
- Progress indicator with 4 steps (MapPin, Leaf, User, CreditCard icons)
- Completion states: active (green with ring), completed (green checkmark), pending (gray)
- Smooth transitions between steps with validation
- Navigation buttons: "Anterior" and "Siguiente"/"Pagar"

#### 2. AvailableTreeDetailPage Integration

**Before**: Single-page form with all fields visible at once
**After**: Clean wizard experience with progressive disclosure

Changes:
- Simplified page structure: back button → wizard → out-of-stock handling
- Removed redundant state management (delegated to wizard)
- Better loading states and error handling
- Out-of-stock trees show warning and redirect to catalog

#### 3. API Changes (`src/services/availableTreeService.js`)

The `purchaseTree` method now sends:
```javascript
{
  available_tree_id: number,
  name: string,
  latitude: number,
  longitude: number,
  location_type: 'public' | 'private',  // NEW
  address: string | null,                // NEW (only if private)
  country: string,
  message: string | null
}
```

### Backend (my-tree-in-the-world-back)

#### 1. Database Changes

**New Fields in `trees` table**:
- `location_type` ENUM('public', 'private') DEFAULT 'public'
  - Indicates if tree is in public space or private property
- `address` VARCHAR(255) DEFAULT NULL
  - Home address for private locations (encrypted in future)
- Index on `location_type` for efficient filtering

**Migration Files**:
- `database/migrations/add_location_type_address.sql` - SQL migration
- `run-location-migration.js` - Node.js migration runner
- `database/migrations/README.md` - Migration documentation

#### 2. Controller Changes (`src/controllers/treeController.js`)

Updated `createTree` function:
- Accepts `location_type` and `address` from request body
- Defaults `location_type` to 'public' for backward compatibility
- Stores `address` only when `location_type === 'private'`
- Inserts new fields into database alongside existing tree data

#### 3. Schema Updates (`database/schema.sql`)

Updated `trees` table definition to include new fields for fresh database setups.

## 📋 Migration Status

**⚠️ ACTION REQUIRED**: Database migration needs to be run

The Aiven Cloud database was not accessible during implementation. When database access is restored:

### Option 1: MySQL CLI
```bash
cd my-tree-in-the-world-back
mysql -u avnadmin -p -h mi-arbol-qa-db-mi-arbol.b.aivencloud.com -P 21682 defaultdb < database/migrations/add_location_type_address.sql
```

### Option 2: Node.js Script
```bash
cd my-tree-in-the-world-back
node run-location-migration.js
```

## 🎯 User Experience Flow

1. User browses catalog at `/catalogo`
2. Clicks "Ver Detalles" or "Comprar" on a tree
3. Navigates to `/catalogo/:id` (AvailableTreeDetailPage)
4. **Step 1**: Chooses location type and selects coordinates on map
   - If private: enters home address
5. **Step 2**: Reviews tree details and benefits
6. **Step 3**: Personalizes tree name and adds optional message
   - Sees preview of how QR code will display
7. **Step 4**: Reviews complete purchase summary
8. Clicks "Pagar" button
9. Tree is created with `status: 'sin_plantar'`
10. Work order automatically created with `status: 'pendiente_autorizacion'`
11. User earns 100 EcoPoints
12. Redirected to `/usuario/mis-arboles` to see their tree

## 🔄 Backward Compatibility

- Existing trees without `location_type` will default to 'public'
- Old API requests without these fields will still work
- No breaking changes for existing functionality

## 📝 Git Commits

### Frontend Commit: `4beb6a0`
```
Add 4-step purchase wizard for improved tree buying UX
- Create PurchaseWizard component with progressive onboarding flow
- Integrate wizard into AvailableTreeDetailPage
- Add step-by-step validation
- Support location_type field in purchase data
```

### Backend Commit: `3f97624`
```
Add location_type and address support for public/private tree planting
- Add location_type ENUM and address fields to trees table
- Update treeController to accept and store new fields
- Create migration scripts and documentation
```

## 🚀 Future Enhancements

From `PROXIMOS_PASOS.md` Section 8.1:

1. **Location Privacy Encryption**
   - Encrypt coordinates for private locations
   - Only show approximate area on map to public
   - Full coordinates visible only to tree owner

2. **Address Geocoding**
   - Auto-fill coordinates when user enters address
   - Integrate Google Maps Geocoding API or similar
   - Validate address format and completeness

3. **Private Tree Filtering**
   - Filter private trees from global map view
   - Show "🏠 Private tree" badge in user's tree list
   - Analytics on public vs private tree distribution

4. **Enhanced Privacy Controls**
   - User settings for location visibility
   - Option to make tree public after initial private planting
   - Share private tree location with specific users

## 📊 Technical Debt

- [ ] Run database migration when Aiven Cloud is accessible
- [ ] Add automated tests for wizard component
- [ ] Add E2E tests for complete purchase flow
- [ ] Implement coordinate encryption for private locations
- [ ] Add address validation and geocoding
- [ ] Update API documentation with new fields

## 🎉 Benefits Achieved

✅ Improved UX with step-by-step guidance
✅ Reduced cognitive load (progressive disclosure)
✅ Better mobile experience (single-column wizard)
✅ Clear validation messages at each step
✅ Preview of final result (QR code view)
✅ Support for home planting use case
✅ Foundation for location privacy features
✅ Maintained backward compatibility

---

**Implementation Date**: January 2025
**Status**: ✅ Complete (pending database migration)
