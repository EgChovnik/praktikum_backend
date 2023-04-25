# Установка зависимостей и сервера (работает только для Ubuntu)
## 1. Устанавливаем все нужные пакеты 
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

# Установка Node.js
## 1. Скачиваем с этого сайта архив под пунктом "Linux Binaries (x64)"
```
https://nodejs.org/en/download
```
## 2. Устанавливаем Node.js (VERSION берём из названия файла!!!!!!!)
```
cd ~/Downloads
VERSION=v18.16.0
DISTRO=linux-x64
sudo mkdir -p /usr/local/lib/nodejs
sudo tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
```
## 3. Вставляем в конец файла ~/.zshrc строчки (VERSION берём из установки)
```
VERSION=v18.16.0
DISTRO=linux-x64
export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH
```
## 4. Перезапускаем терминал

# Запуск проекта
## 1. Скачиваем проект на машину
```bash
cd ~
git clone https://github.com/EgChovnik/praktikum_backend
```

## 2. Устанавливаем клиентские пакеты для сборки (что бы это ни значило)
```
cd ~/praktikum_backend
npm install
```

## 3. Собирается и запускается проект одной командой
```
~/praktikum_backend/bld
```

#### Дальше остается только открыть браузер и перейти по адресу
```
localhost:8080
```
