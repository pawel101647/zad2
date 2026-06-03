# Zad 2
Rozwiązanie do zadania nr 2

# Kroki wykonania zadania
1. Synchronizacja istniejącego katalogu z repo github.
<img width="1102" height="480" alt="Zrzut ekranu 2026-06-03 113732" src="https://github.com/user-attachments/assets/2a971e8a-aa08-4580-8e2b-238e386da03d" />
<br><br>

2. Utworzenie "Secrets" i "Variables" dla repo.
<img width="1062" height="524" alt="image" src="https://github.com/user-attachments/assets/d702902e-39d4-4db2-a65d-ac95a180877b" />
<img width="1076" height="531" alt="image" src="https://github.com/user-attachments/assets/532d8091-7058-4c2c-be9a-6ffbb173e6c0" />
<br><br>

3. Stworzenie pliku docker.yml zawierającego łańcuch:
a) Pobranie kodu źródłowego z repozytorium GitHub za pomocą akcji actions/checkout.
b) Konfiguracja środowiska do budowania obrazów wieloarchitekturowych poprzez uruchomienie QEMU (docker/setup-qemu-action) oraz inicjalizację Buildx (docker/setup-buildx-action) z użyciem sterownika docker-container, co umożliwia budowę obrazów dla architektur linux/amd64 oraz linux/arm64.
c) Logowanie do rejestrów kontenerów: Docker Hub, który jest wykorzystywany jako zewnętrzny backend cache oraz GitHub Container Registry, do którego finalnie publikowany jest zbudowany obraz.
d) Generowanie metadanych obrazu (tagi i etykiety) przy użyciu docker/metadata-action, co automatyzuje proces wersjonowania obrazów na podstawie SHA commita oraz tagów Git (np. v1.0.0).
e) Budowanie tymczasowego obrazu lokalnego bez jego publikacji, który służy wyłącznie do przeprowadzenia analizy bezpieczeństwa i skanowania podatności CVE.
f) Skanowanie obrazu przy użyciu Trivy, gdzie pipeline zostaje przerwany w przypadku wykrycia podatności o poziomie HIGH lub CRITICAL.
g) Po pozytywnym przejściu skanowania budowany jest właściwy obraz wieloarchitekturowy i publikowany do GHCR, z jednoczesnym wykorzystaniem cache BuildKit w trybie registry oraz mode=max.
<br><br>

4. Uruchomienie workflow.
<img width="1418" height="359" alt="image" src="https://github.com/user-attachments/assets/1680c09e-79d7-4e59-a465-49c87e1f4c3b" />
