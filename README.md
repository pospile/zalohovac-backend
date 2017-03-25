# zalohovac-backend
zalohovac backendová část v nodejs

tento repozitář je jednou za čas odeslán k buildu na build server, kde je zpracován a nahrán na produkční server (138.68.67.174)
Build server vezme všechny dosavadní commity v branchy master a spustí jejich build, pokud uspěje, vezme znovu tyto commity, nahraje je na produkční server a spustí build i zde. Build server může běžet max 10krář za den a bude lepší, pokud to vzhledem k povaze (produkční!) serveru bude méněkrát a v co nejméně frekventovanou dobu (mezi 3. a 4. hodinou ranní).

## po klonu spustit _install.bat
## po prichodu po delsi dobe _update.bat
## po dokonceni prace _update.bat
