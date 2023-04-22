# Установка Ubuntu на виртуальную машину
## 1. Скачивание загрузочного образа
#### Советую качать через торрент, так как образ весит 5ГБ🙃
```url
https://releases.ubuntu.com/22.04/ubuntu-22.04.2-desktop-amd64.iso.torrent
```
## 2. Установка образа
#### Ну тут ничего сложного, единственное стоит выделить 20ГБ жёсткого диска, ~4ГБ оперативы и чем больше процессорных ядер, тем лучше (я выделил 3).

## 3. После установки Ubuntu логинимся в неё, открываем Mozilla Firefox и ручками вбиваем ссылку)
```
github.com/EgChovnik/praktikum_backend
```
## 4. Дальше идём по гайду внизу и просто копируем команды в терминал

# Установка зависимостей (работает только для Ubuntu)
## 1. Устанавливаем пакеты для build-a серверной библиотеки 
```bash
sudo apt install git gcc g++ cmake libjsoncpp-dev uuid-dev openssl libssl-dev zlib1g-dev
```

## 2. Выполняем build библиотеки
```bash
cd ~
git clone https://github.com/drogonframework/drogon
cd drogon
git submodule update --init
mkdir build
cd build
cmake ..
make && sudo make install
cd ../..
rm -rf drogon
```

# Запуск проекта
## 1. Скачиваем проект на машину
```bash
cd ~
git clone https://github.com/EgChovnik/praktikum_backend
```

## 2. Собираем и запускаем сервер
```bash
cd ~/praktikum_backend/build/
cmake ..
make
./praktikum_backend
```

#### Дальше остается только открыть браузер и перейти по адресу
```url
localhost:8080
```
