# Установка зависимостей (работает только для Ubuntu)
## 1. Устанавливаем пакеты для build-a
```bash
sudo apt install git gcc g++ cmake libjsoncpp-dev uuid-dev openssl libssl-dev zlib1g-dev
```

## 2. Выполняем build
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

## 2. Запускаем сервер
```bash
cd ~/praktikum_backend/build/
./praktikum_backend
```

#### Дальше остается только открыть браузер и перейти по адресу
```url
localhost:8080
```
