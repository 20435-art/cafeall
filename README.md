# Bean Voyage — ร้านขายเมล็ดกาแฟ (Front-end)

เว็บไซต์ Front-end สำหรับร้านจำหน่ายเมล็ดกาแฟจาก 6 แหล่งปลูกทั่วโลก พัฒนาด้วย HTML5 / CSS3 / Vanilla JavaScript ไม่ใช้ Framework

## โครงสร้างไฟล์

```
coffee-shop/
├── index.html      หน้าเดียว ครอบคลุมทุก view (Home, Products, Detail, Cart, Checkout)
├── style.css        สไตล์ทั้งหมด ธีมสี น้ำตาลเข้ม/ครีม/เขียว/ทอง ฟอนต์ Kanit + Prompt
├── script.js        ข้อมูลสินค้า, ระบบตะกร้า (LocalStorage), router, การ render แบบ dynamic
└── README.md
```

## วิธีเปิดใช้งาน

เปิดไฟล์ `index.html` ในเว็บเบราว์เซอร์ได้ทันที ไม่ต้องติดตั้งอะไรเพิ่ม (ต้องเชื่อมต่ออินเทอร์เน็ตเพื่อโหลดฟอนต์ Google Fonts)

## หมายเหตุเรื่องรูปภาพสินค้า

ในข้อมูลสินค้า (`products` array ใน `script.js`) แต่ละรายการมี field `image` เตรียมไว้สำหรับใส่ path รูปจริง (เช่น `images/ethiopia.jpg`) เมื่อเชื่อมต่อฐานข้อมูล/API ในอนาคต แต่ในเวอร์ชันนี้ยังไม่มีไฟล์รูปภาพจริงแนบมา หน้าเว็บจึงแสดง "ภาพเมล็ดกาแฟ" แบบ SVG พร้อมไล่สีตามระดับการคั่ว (Light/Medium/Dark) แทน ซึ่งช่วยสื่อสารระดับการคั่วได้ในตัว และสามารถสลับไปใช้ `<img src="{{product.image}}">` แทนได้ทันทีเมื่อมีรูปจริง

## ฟังก์ชันหลักใน script.js

- `loadProducts()` — โหลดและ render สินค้าแนะนำ (หน้าแรก) และสินค้าทั้งหมด
- `showProductDetail(id)` — นำทางไปหน้ารายละเอียดสินค้า
- `addToCart(id, qty)` — เพิ่มสินค้าลงตะกร้า
- `removeCart(id)` — ลบสินค้าออกจากตะกร้า
- `updateQuantity(id, delta)` — เพิ่ม/ลดจำนวนสินค้าในตะกร้า
- `calculateTotal()` — คำนวณราคารวมทั้งหมด
- `saveCart()` / `loadCart()` — บันทึก/โหลดตะกร้าจาก LocalStorage
- `checkout()` — ยืนยันคำสั่งซื้อ แสดง popup "สั่งซื้อสำเร็จ" แล้วล้างตะกร้า

## การเชื่อมต่อ Backend ในอนาคต

โครงสร้างข้อมูลสินค้าถูกแยกเป็น Array of Object ไว้แล้ว สามารถแทนที่ด้วยการดึงข้อมูลจริงผ่าน `fetch()` จาก REST API (Node.js/PHP) หรือ Firebase ได้โดยแก้เฉพาะจุดที่ประกาศ `const products = [...]` ให้เป็นการเรียก API แบบ async แทน ส่วนระบบตะกร้าที่ใช้ LocalStorage ก็สามารถเปลี่ยนไปผูกกับ session ผู้ใช้จริงและตาราง orders ในฐานข้อมูล (เช่น MySQL) ได้ในลักษณะเดียวกัน
