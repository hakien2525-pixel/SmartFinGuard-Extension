import re
with open('D:\\SmartFinGuard-Extension\\smartfin-guard.html', 'r', encoding='utf-8') as f:
    content = f.read()

# view-login
m_login = re.search(r'<section id="view-login" class="view[^"]*">(.*?)</section>', content, re.DOTALL)
if m_login:
    with open('D:\\SmartFinGuard-Extension\\login-part.html', 'w', encoding='utf-8') as f2:
        f2.write(m_login.group(1))

# view-business
m_biz = re.search(r'<section id="view-business" class="view[^"]*">(.*?)</section>', content, re.DOTALL)
if m_biz:
    with open('D:\\SmartFinGuard-Extension\\biz-part.html', 'w', encoding='utf-8') as f2:
        f2.write(m_biz.group(1))

# view-admin
m_admin = re.search(r'<section id="view-admin" class="view[^"]*">(.*?)</section>', content, re.DOTALL)
if m_admin:
    with open('D:\\SmartFinGuard-Extension\\admin-part.html', 'w', encoding='utf-8') as f2:
        f2.write(m_admin.group(1))
