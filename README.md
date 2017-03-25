# zalohovac-backend
zalohovac backendová část v nodejs

# Produkční server (138.68.67.174)
Produkční server běží na statické ip adrese (138.68.67.174). Tento server má aktivní firewall, který umožní se připojit pouze na několik portů a to: 

| Port   | Odkud         | Popis         |
| ------ |:-------------:|:-------------:|
| 22     | Everyone (*)  | SSH           |
| 80     | Everyone (*)  | staticka page |
| 3000   | 127.0.0.1     | API           |
| 3306   | 127.0.0.1     | MySQL         |
| 2579   | Everyone (*)  | socket.io     |

tento repozitář je jednou za čas odeslán k buildu na build server, kde je zpracován a nahrán na produkční server (138.68.67.174)
Build server vezme všechny dosavadní commity v branchy master a spustí jejich build, pokud uspěje, vezme znovu tyto commity, nahraje je na produkční server a spustí build i zde. Build server může běžet max 10krář za den a bude lepší, pokud to vzhledem k povaze (produkční!) serveru bude méněkrát a v co nejméně frekventovanou dobu (mezi 3. a 4. hodinou ranní).

## po klonu spustit _install.bat
## po prichodu po delsi dobe _update.bat
## po dokonceni prace _update.bat
