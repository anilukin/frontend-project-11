### Hexlet tests and linter status:

[![Actions Status](https://github.com/anilukin/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/anilukin/frontend-project-11/actions)
[![Maintainability](https://api.codeclimate.com/v1/badges/501ea0e0ade92229588e/maintainability)](https://codeclimate.com/github/anilukin/frontend-project-11/maintainability)

# RSS агрегатор

## Описание

RSS — специализированный формат, предназначенный для описания лент новостей, анонсов статей и других материалов. Это наиболее простой способ для сайтов (обычно, блогов) дать возможность пользователям подписываться на изменения. Для этого используются специальные сервисы, называемые RSS-агрегаторами. Эти сервисы умеют опрашивать RSS-ленты сайтов на наличие новых постов и показывают их в удобном виде, отмечая прочитанное и так далее.

## Использование

[**Rss Reader**](https://frontend-project-11-ruddy-beta.vercel.app/ "Перейти") — сервис для агрегации RSS-потоков, с помощью которых удобно читать разнообразные источники, например, блоги. Он позволяет добавлять неограниченное количество RSS-лент, сам их обновляет и добавляет новые записи в общий поток.

## Рекомендации по установке

1. Убедитесь, что у вас установлены Node.js не ниже версии v18.9.1 и пакетный менеджер npm не ниже версии 9.4.1.
    
    Проверить версию:
    ```
    node -v
    npm -v
    ```
    Если не установлены, введите сделующие команды:
    - *MacOS:*
    ```
    brew install nodejs
    ```
    - *Ubuntu или Ubuntu on Windows*
    ```
    sudo apt-get install curl
    curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    ```

2. Склонируйте репозиторий к себе на компьютер: 
    ```
    git clone git@github.com:anilukin/frontend-project-11.git
    ```
3. Установите программу с помощью команды
    ```
    make install
    ```
4. Запустите 
    ```
    make develop
    ```
    