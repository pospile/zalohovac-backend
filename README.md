# zalohovac-backend
zalohovac backendová část v nodejs

# instalace
Pro instalaci na localhost se staci drzet tohoto jednoducheho postupu
1. git clone https://github.com/pospile/zalohovac-backend.git
2. prejit v cmd do slozky kam se projekt naklonoval (cd zalohovac-backend)
3. npm install (nainstaluje všechny závislosti projektu)
4. uspesne jste nainstalovaly server na localhost
Nesnazte se prosim umistovat server jinam nez na produkcni/dev server ktere jsou k tomu urcene at se vyhneme bordelu :D

# Produkční server (138.68.67.174)
Produkční server běží na statické ip adrese (138.68.67.174). Tento server má aktivní firewall, který umožní se připojit pouze na několik portů a to: 

| Port   | Odkud         | Popis         |
| ------ |:-------------:|:-------------:|
| 22     | Everyone (*)  | SSH           |
| 80     | Everyone (*)  | staticka page |
| 3000   | 127.0.0.1     | API           |
| 3306   | 127.0.0.1     | MySQL         |
| 2579   | Everyone (*)  | socket.io     |

Není v žádném případě vhodné do serveru zasahovat pomocí ssh, server je nakonfigurován a zazálohován u cloud poskytovatele a není v zájmu nikoho měnit jakkékoli nastevení. Je samozřejmě možné otevřít alternativní porty atp, ale je preferovatelné je nechat uzavřené.
Produkční server musí mít nejvyšší možnou dostupnost a žádná ze služeb nesmí mít výpadek.

tento repozitář je jednou za čas odeslán k buildu na build server, kde je zpracován a nahrán na produkční server (138.68.67.174)
Build server vezme všechny dosavadní commity v branchy master a spustí jejich build, pokud uspěje, vezme znovu tyto commity, nahraje je na produkční server a spustí build i zde. Build server může běžet max 10krát za den a bude lepší, pokud to vzhledem k povaze (produkční!) serveru bude méněkrát a v co nejméně frekventovanou dobu (mezi 3. a 4. hodinou ranní).
