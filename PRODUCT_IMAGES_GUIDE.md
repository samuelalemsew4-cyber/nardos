# 📸 Product Images Guide - Nardos Perfume Store

## How to Update Product Images

Your Nardos e-commerce platform now supports beautiful product images. Here's how to add and update them:

---

## 🖼️ Option 1: Update via Admin API (Direct Database)

### Using PowerShell/Terminal

```powershell
# Step 1: Get Admin Token
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Step 2: Update Product Image
$productId = "PRODUCT_ID_HERE"
$updateData = @{
    image = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/products/$productId" `
    -Method PUT `
    -Headers $headers `
    -Body $updateData `
    -UseBasicParsing
```

---

## 🌟 Premium Product Images (Ready to Use)

Here are premium perfume product images from Unsplash that work great:

### Luxury Fragrances
```
Oud Essence (Luxury / Men):
https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop

Midnight Noir (Luxury / Women):
https://images.unsplash.com/photo-1577720643272-265226e36e6f?w=500&h=500&fit=crop

Luxury Gold (Unisex):
https://images.unsplash.com/photo-1588405748855-c22d91d1b5d7?w=500&h=500&fit=crop
```

### Classic Fragrances
```
Rose Garden (Women):
https://images.unsplash.com/photo-1523293182986-7651a8ad5003?w=500&h=500&fit=crop

Ocean Breeze (Unisex):
https://images.unsplash.com/photo-1600256621198-dff89f6b8e4f?w=500&h=500&fit=crop

Amber Essence (Men):
https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop
```

---

## 🖼️ Option 2: Update via Admin Dashboard UI

### Steps:
1. Go to `http://localhost:5175/admin`
2. Login with admin credentials
   - Email: `admin@nardos.com`
   - Password: `sami@2124`
3. Navigate to **Products** section
4. Click on a product to edit
5. Update the Image URL field
6. Save changes

---

## 🎨 Best Image Practices

### Image Requirements:
- **Format**: JPG, PNG, WebP
- **Size**: 300x300px to 1000x1000px
- **Aspect Ratio**: Square (1:1) preferred
- **File Size**: < 2MB for fast loading

### Recommended Image Sources:
1. **Unsplash** - https://unsplash.com (Free, high quality)
2. **Pexels** - https://pexels.com (Free stock photos)
3. **Pixabay** - https://pixabay.com (Free images)
4. **Your Own Images** - Upload to cloud storage (AWS S3, Cloudinary, etc.)

---

## 📦 Popular Free Perfume Images

### High-Quality Perfume Bottle Images:
```
Professional Perfume Bottles:
https://images.unsplash.com/photo-1597318159211-d8c2911e2b1e?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1529148482759-b7ce63b36b31?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1585708860895-0c1307e0de3d?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1596158048588-e1dcd5e39354?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=500&h=500&fit=crop

Luxury Packaging:
https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1610506850712-30f5b5f3a803?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1567427350515-5651abf51af1?w=500&h=500&fit=crop

Floral & Rose Scents:
https://images.unsplash.com/photo-1523293182986-7651a8ad5003?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1562181286-d3fee0d55364?w=500&h=500&fit=crop
https://images.unsplash.com/photo-1577720643272-265226e36e6f?w=500&h=500&fit=crop
```

---

## 🚀 Quick Update Script

### Add this to update multiple products at once:

**PowerShell Script:**
```powershell
$token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTgyYjk1ODcxZGY3OGMyZWNjNmFjZWEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODY5NTIwMzAsImV4cCI6MTc4NzU1NjgzMH0.lz00CocdKq-Yy_VPl4hn6Yf9XJXbTZHCmIR3k_E4I_w"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Define products to update
$updates = @(
    @{
        productId = "PRODUCT_ID_1"
        newImage = "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop"
        name = "Oud Essence"
    },
    @{
        productId = "PRODUCT_ID_2"
        newImage = "https://images.unsplash.com/photo-1577720643272-265226e36e6f?w=500&h=500&fit=crop"
        name = "Midnight Noir"
    }
)

# Update each product
$updates | ForEach-Object {
    $body = @{ image = $_.newImage } | ConvertTo-Json
    Invoke-WebRequest -Uri "http://localhost:5000/api/products/$($_.productId)" `
        -Method PUT `
        -Headers $headers `
        -Body $body `
        -UseBasicParsing | Out-Null
    Write-Host "✅ Updated: $($_.name)"
}
```

---

## 🎯 Step-by-Step: Update via Admin Dashboard

### For Adding/Updating Products:

1. **Open Admin Panel**
   ```
   http://localhost:5175/admin/products
   ```

2. **Login** (if not already logged in)
   - Email: `admin@nardos.com`
   - Password: `sami@2124`

3. **Add New Product**
   - Click "Add Product" button
   - Fill in product details:
     - Name
     - Brand
     - Category
     - Description
     - Price
     - Stock
   - **Paste Image URL** in "Image" field
   - Click "Add Product"

4. **Edit Existing Product**
   - Click product in grid
   - Update image URL
   - Save changes

---

## 🔗 API Endpoint for Image Update

### Direct API Call:

```bash
# Request
PUT /api/products/:productId
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop"
}

# Response
{
  "message": "Product updated successfully",
  "product": {
    "_id": "...",
    "name": "Oud Essence",
    "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=500&fit=crop",
    ...
  }
}
```

---

## 📸 Current Product Status

### Products with Images:
- ✅ Oud Essence - Luxury perfume
- ✅ Rose Garden - Women's fragrance
- ✅ Ocean Breeze - Unisex scent
- ✅ Midnight Noir - Luxury evening

### To Update Images:
1. Get product IDs from `/api/products`
2. Use image URLs from this guide
3. Call PUT endpoint with new image URL
4. Verify in `/admin/products` dashboard

---

## 💡 Tips for Best Results

1. **Use Square Images** (1:1 ratio) for consistency
2. **Optimize Image Size** - Keep under 500KB
3. **Use HTTPS URLs** - Required for production
4. **Test Images** - Verify they load before production
5. **Update Batch** - Update multiple products at once
6. **Cache Busting** - Add `?v=1` to URL if image updates don't show

---

## 🎨 Advanced: Custom Image Hosting

### Using Cloudinary (Free Tier):
1. Sign up at https://cloudinary.com
2. Upload your images
3. Copy the public URL
4. Use in Nardos admin panel

### Using AWS S3:
1. Create S3 bucket
2. Upload images
3. Make images public
4. Use S3 URL in admin panel

---

## ✅ Verification Checklist

- [ ] Images are square (1:1 ratio)
- [ ] Images load without errors
- [ ] Images are optimized (< 500KB)
- [ ] URLs use HTTPS
- [ ] Images display in product grid
- [ ] Images display in product details
- [ ] Images display in admin dashboard

---

## 🆘 Troubleshooting

### Images not loading?
- ✅ Check URL is accessible (open in browser)
- ✅ Verify image URL is HTTPS
- ✅ Check image file size
- ✅ Clear browser cache (Ctrl+F5)

### API returns error?
- ✅ Verify token is valid
- ✅ Check product ID exists
- ✅ Verify image URL format
- ✅ Check server logs

### Images not showing in admin?
- ✅ Refresh page (Ctrl+R)
- ✅ Clear localStorage
- ✅ Logout and login again
- ✅ Try different browser

---

**Ready to add beautiful product images! 📸**
