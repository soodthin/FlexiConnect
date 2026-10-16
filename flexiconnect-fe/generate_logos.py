import os

logos = {}

# 1. Masan Consumer
logos['masan.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#ffffff"/>
  <circle cx="60" cy="60" r="58.5" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
  <g transform="translate(15, 18)">
    <path d="M45 5 C30 18, 25 35, 45 48 C40 36, 44 22, 45 5 Z" fill="#D71920"/>
    <path d="M45 5 C60 18, 65 35, 45 48 C50 36, 46 22, 45 5 Z" fill="#FFB800"/>
    <circle cx="45" cy="30" r="8" fill="#D71920"/>
    <text x="45" y="65" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="17" fill="#0F2D59" text-anchor="middle" letter-spacing="1">MASAN</text>
    <text x="45" y="77" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="8.5" fill="#D71920" text-anchor="middle" letter-spacing="1.5">CONSUMER</text>
  </g>
</svg>'''

# 2. KiotViet
logos['kiotviet.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#0070BA"/>
  <g transform="translate(20, 18)">
    <path d="M16 15 L28 15 L28 65 L16 65 Z" fill="#ffffff"/>
    <path d="M28 42 L52 16 L68 16 L40 46 L68 65 L52 65 Z" fill="#ffffff"/>
    <circle cx="63" cy="20" r="5" fill="#FFB800"/>
    <text x="40" y="77" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="13" fill="#ffffff" text-anchor="middle">KiotViet</text>
  </g>
</svg>'''

# 3. Viettel
logos['viettel.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#EE0033"/>
  <text x="60" y="68" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">viettel</text>
  <circle cx="89" cy="46" r="3.5" fill="#ffffff"/>
</svg>'''

# 4. MISA
logos['misa.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#ffffff"/>
  <circle cx="60" cy="60" r="58.5" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
  <g transform="translate(35, 18)">
    <path d="M25 5 L5 25 L25 25 Z" fill="#009B4D"/>
    <path d="M25 5 L45 25 L25 25 Z" fill="#FFB600"/>
    <path d="M5 25 L25 45 L25 25 Z" fill="#0082C8"/>
    <path d="M45 25 L25 45 L25 25 Z" fill="#ED1C24"/>
    <text x="25" y="68" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="19" fill="#004F9E" text-anchor="middle" letter-spacing="1">MISA</text>
  </g>
</svg>'''

# 5. Axon Active
logos['axonactive.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#1E2229"/>
  <g transform="translate(25, 22)">
    <path d="M20 10 L5 46 L17 46 L21 35 L33 35 L28 23 L25 15 Z" fill="#E2001A"/>
    <path d="M50 10 L35 46 L47 46 L51 35 L63 35 L58 23 L55 15 Z" fill="#ffffff"/>
    <rect x="30" y="2" width="10" height="3" fill="#E2001A"/>
    <text x="35" y="64" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="11" fill="#ffffff" text-anchor="middle">axon active</text>
  </g>
</svg>'''

# 6. Hoa Sen Group
logos['hoasen.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#990000"/>
  <circle cx="60" cy="48" r="23" fill="none" stroke="#FFD700" stroke-width="2"/>
  <path d="M60 28 C54 37, 54 45, 60 50 C66 45, 66 37, 60 28 Z" fill="#FFD700"/>
  <path d="M60 50 C50 45, 42 45, 40 52 C45 56, 53 56, 60 50 Z" fill="#FFD700"/>
  <path d="M60 50 C70 45, 78 45, 80 52 C75 56, 67 56, 60 50 Z" fill="#FFD700"/>
  <path d="M60 50 C53 52, 47 59, 51 64 C56 64, 60 59, 60 50 Z" fill="#FFD700"/>
  <path d="M60 50 C67 52, 73 59, 69 64 C64 64, 60 59, 60 50 Z" fill="#FFD700"/>
  <text x="60" y="88" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="9" fill="#FFD700" text-anchor="middle" letter-spacing="1.5">HOA SEN GROUP</text>
</svg>'''

# 7. Acecook Việt Nam
logos['acecook.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#E30613"/>
  <circle cx="60" cy="44" r="16" fill="#FFE0BD"/>
  <path d="M44 38 C42 22, 78 22, 76 38 Z" fill="#ffffff"/>
  <ellipse cx="60" cy="37" rx="17" ry="4" fill="#ffffff"/>
  <circle cx="55" cy="44" r="2" fill="#333333"/>
  <path d="M63 43 C65 41, 68 45, 65 46" stroke="#333333" stroke-width="1.5" fill="none"/>
  <path d="M56 50 Q60 54 64 50" stroke="#E30613" stroke-width="1.5" fill="none"/>
  <text x="60" y="82" font-family="'Trebuchet MS', Arial, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle" font-style="italic">Acecook</text>
</svg>'''

# 8. Thế Giới Di Động (MWG)
logos['thegioididong.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#FED100"/>
  <circle cx="60" cy="60" r="44" fill="#000000"/>
  <circle cx="60" cy="40" r="8" fill="#FED100"/>
  <path d="M55 49 L66 49 L72 63 L65 65 L60 55 L57 66 L68 81 L58 81 L50 68 L53 58 L46 54 Z" fill="#FED100"/>
</svg>'''

# 9. Bảo Việt
logos['baoviet.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#004B99"/>
  <circle cx="60" cy="48" r="23" fill="none" stroke="#FFC72C" stroke-width="2.5"/>
  <path d="M60 30 L45 46 L60 62 L75 46 Z" fill="none" stroke="#FFC72C" stroke-width="2"/>
  <circle cx="60" cy="46" r="6" fill="#FFC72C"/>
  <text x="60" y="90" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="13" fill="#FFC72C" text-anchor="middle" letter-spacing="1.5">BAOVIET</text>
</svg>'''

# 10. Vinamilk
logos['vinamilk.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#001489"/>
  <circle cx="60" cy="60" r="46" fill="none" stroke="#ffffff" stroke-width="3"/>
  <text x="60" y="54" font-family="'Georgia', serif" font-weight="900" font-size="19" fill="#ffffff" text-anchor="middle" letter-spacing="2">VINA</text>
  <text x="60" y="78" font-family="'Georgia', serif" font-weight="900" font-size="19" fill="#ffffff" text-anchor="middle" letter-spacing="2">MILK</text>
</svg>'''

# 11. Shopee
logos['shopee.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#EE4D2D"/>
  <g transform="translate(30, 18)">
    <path d="M20 16 C20 8, 40 8, 40 16" fill="none" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <rect x="10" y="16" width="40" height="48" rx="6" fill="#ffffff"/>
    <path d="M33 30 C33 26, 26 26, 26 30 C26 36, 34 35, 34 41 C34 46, 26 46, 26 41" fill="none" stroke="#EE4D2D" stroke-width="3.5" stroke-linecap="round"/>
    <text x="30" y="78" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="12" fill="#ffffff" text-anchor="middle">Shopee</text>
  </g>
</svg>'''

# 12. VNG
logos['vng.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#FF6600"/>
  <text x="60" y="72" font-family="'Impact', Arial, sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle" letter-spacing="2">VNG</text>
</svg>'''

# 13. Giao hàng nhanh (GHN)
logos['ghn.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#003B71"/>
  <path d="M28 35 L52 35 L40 55 L72 55 L60 75 L36 75 Z" fill="#F37024"/>
  <text x="60" y="93" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="middle" letter-spacing="2">GHN</text>
</svg>'''

# 14. FPT
logos['fpt.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#ffffff"/>
  <circle cx="60" cy="60" r="58.5" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
  <g transform="translate(20, 25)">
    <ellipse cx="20" cy="28" rx="16" ry="22" fill="#F37021" transform="rotate(-20, 20, 28)"/>
    <ellipse cx="40" cy="28" rx="16" ry="22" fill="#0054A6" transform="rotate(-20, 40, 28)"/>
    <ellipse cx="60" cy="28" rx="16" ry="22" fill="#009E49" transform="rotate(-20, 60, 28)"/>
    <text x="40" y="58" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="18" fill="#0054A6" text-anchor="middle" letter-spacing="2">FPT</text>
  </g>
</svg>'''

# 15. Tiki
logos['tiki.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#189EFF"/>
  <text x="60" y="68" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="32" fill="#ffffff" text-anchor="middle" letter-spacing="-1">tiki</text>
  <path d="M48 76 Q60 84 72 76" fill="none" stroke="#FFD700" stroke-width="3.5" stroke-linecap="round"/>
</svg>'''

# 16. VinFast
logos['vinfast.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#1C1C1E"/>
  <path d="M22 36 L60 84 L98 36 L82 36 L60 64 L38 36 Z" fill="#E5E5EA"/>
  <path d="M34 46 L60 76 L86 46 L76 46 L60 64 L44 46 Z" fill="#AEAEB2"/>
  <text x="60" y="100" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="9" fill="#ffffff" text-anchor="middle" letter-spacing="3">VINFAST</text>
</svg>'''

# 17. Be Group
logos['be.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#FFDD00"/>
  <text x="60" y="78" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="50" fill="#000000" text-anchor="middle">be</text>
  <rect x="35" y="46" width="16" height="3" fill="#FFDD00"/>
  <rect x="35" y="54" width="16" height="3" fill="#FFDD00"/>
</svg>'''

# 18. Grab
logos['grab.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#00B14F"/>
  <text x="60" y="72" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle" letter-spacing="-0.5">Grab</text>
</svg>'''

# 19. Lazada
logos['lazada.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#ffffff"/>
  <circle cx="60" cy="60" r="58.5" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
  <g transform="translate(25, 20)">
    <path d="M35 10 L60 25 L60 50 L35 35 Z" fill="#ED174C"/>
    <path d="M35 10 L10 25 L10 50 L35 35 Z" fill="#0F146D"/>
    <path d="M35 35 L60 50 L35 62 L10 50 Z" fill="#FF6000"/>
    <text x="35" y="78" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="13" fill="#0F146D" text-anchor="middle">Lazada</text>
  </g>
</svg>'''

# 20. ZaloPay
logos['zalopay.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#008FE5"/>
  <text x="60" y="62" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="20" fill="#ffffff" text-anchor="middle">Zalo</text>
  <text x="60" y="82" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="18" fill="#00E676" text-anchor="middle">Pay</text>
</svg>'''

# 21. An Cường
logos['ancuong.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#1B5E20"/>
  <circle cx="60" cy="45" r="20" fill="none" stroke="#FFD54F" stroke-width="3"/>
  <path d="M60 28 L50 54 L70 54 Z" fill="#FFD54F"/>
  <text x="60" y="84" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="11" fill="#FFD54F" text-anchor="middle" letter-spacing="1">AN CUONG</text>
</svg>'''

# 22. Cơ khí Đại Dương
logos['daiduong.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#0F294A"/>
  <circle cx="60" cy="46" r="18" fill="none" stroke="#38BDF8" stroke-width="4" stroke-dasharray="6 4"/>
  <path d="M44 52 Q60 40 76 52 Q60 62 44 52" fill="#38BDF8"/>
  <text x="60" y="84" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="10" fill="#ffffff" text-anchor="middle" letter-spacing="1">ĐẠI DƯƠNG</text>
</svg>'''

# 23. Cơ điện Việt Nhật
logos['vietnhat.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#ffffff"/>
  <circle cx="60" cy="60" r="58.5" fill="none" stroke="#e5e7eb" stroke-width="1.5"/>
  <circle cx="60" cy="45" r="20" fill="#DC2626"/>
  <path d="M58 32 L53 45 L62 45 L57 58 L67 44 L58 44 Z" fill="#ffffff"/>
  <text x="60" y="84" font-family="'Segoe UI', Arial, sans-serif" font-weight="800" font-size="11" fill="#1E293B" text-anchor="middle" letter-spacing="1">VIỆT NHẬT</text>
</svg>'''

# 24. Green Design Studio
logos['greendesign.svg'] = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" width="120" height="120">
  <circle cx="60" cy="60" r="60" fill="#064E3B"/>
  <path d="M60 22 C42 35 42 58 60 70 C78 58 78 35 60 22 Z" fill="#10B981"/>
  <line x1="60" y1="25" x2="60" y2="68" stroke="#064E3B" stroke-width="2"/>
  <text x="60" y="90" font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="9" fill="#A7F3D0" text-anchor="middle" letter-spacing="1.5">GREEN DESIGN</text>
</svg>'''

base_dir = os.path.join(os.path.dirname(__file__), 'public', 'logos')
os.makedirs(base_dir, exist_ok=True)
for filename, content in logos.items():
    with open(os.path.join(base_dir, filename), 'w', encoding='utf-8') as f:
        f.write(content.strip())
print(f'Successfully wrote {len(logos)} circular logos')
