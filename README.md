# Amocrm-widget-products-show-add-update-delete-ip

Виджет (приватная интеграция) добавляет кнопку в карточке сделки в правой колонке. При клике на эту кнопку в модальном окне выводится список всех товаров этой сделки.

![screen_1](https://user-images.githubusercontent.com/106067946/185739330-e076a6c2-325c-4703-8c62-ed286eaf00ba.jpg)

Получение товаров происходит по API - oAuth, через ваш сторонний сервер.

### Можно редактировать количество товаров

![screen_2](https://user-images.githubusercontent.com/106067946/185739574-0648748a-5a2a-4bff-af33-7a34eacf05d3.jpg)

### Можно удалять товары

![screen_3](https://user-images.githubusercontent.com/106067946/185739662-13a231fc-b268-4daf-92c0-53d5138075d6.jpg)

### Можно добавлять товары

![screen_4](https://user-images.githubusercontent.com/106067946/185739771-007b1ecb-8439-4044-af8c-aa2d92a4524e.jpg)

#### Выберите каталог

![screen_5](https://user-images.githubusercontent.com/106067946/185739901-267da606-8dd8-478a-8ffe-94a49c7a2c9e.jpg)

### Добавте товары

![screen_6](https://user-images.githubusercontent.com/106067946/185739982-6f1483c3-7090-43d5-8dab-8d89a8e9cf7c.jpg)



### Для работы виджета используется официальная библиотека amocrm
https://github.com/amocrm/amocrm-api-php
## Установка
### Установка js виджета
Создайте архив zip из содержимого папки [widget] и назовите его widget.zip

Загрузите в amocrm согласно их инструкции https://www.amocrm.ru/developers/content/integrations/upload

В поле URL редиректа вставте https://yourwebsite.ru/amocrm/login.php, где yourwebsite.ru название вашего сайта

Заполните все Settings поля виджета, "Secret key:" скопируйте во вкладке "Keys and scopes" 
### Установка на ваш сайт


Для установки вам потребуется сайт с поддержкой php 7.1+, например https://yourwebsite.ru/
Загрузите в корень вашего сайта папку со скриптами [amocrm], ее URL: https://yourwebsite.ru/amocrm/

Установите в эту же папку библиотеку https://github.com/amocrm/amocrm-api-php с помощью composer, как у них рекомендуется.

Composer создает папку [vendor], она должна находиться внутри папки [amocrm]
### Должно получится так:
![readmy_2](https://user-images.githubusercontent.com/106067946/183854353-3ae92c2a-0b39-421a-9d8b-c79cbda7e7fe.jpg)

Создайте внутри папки [amocrm] - папку [tmp] и дайте ей права на запись, но закройте ее от внешнего просмотра (например с помощью .htases). В нее будет записываться файл с токеном. 

Должно получится так:

![readmy_1](https://user-images.githubusercontent.com/106067946/183855047-a0450031-83ea-4330-9499-f25545530bc4.jpg)

Заполните файл config.php своими данными
```
/amocrm/config.php
```

## Получите токен
Откройте на вашем сайте страницу https://yourwebsite.ru/amocrm/login.php

Нажмите на кнопку:

![readmy_5](https://user-images.githubusercontent.com/106067946/183863722-b2ae0445-ebc1-4233-9eb1-fcff2b01def7.jpg)

В открывшемся окне выберите ваш аккаунт и нажмите разрешить:
![readmy_6](https://user-images.githubusercontent.com/106067946/183867260-763c9e03-dd27-4979-a75b-135da22a65f5.jpg)

Если все прошло успешно вы увидите Hello {ваше имя}

В папке [tmp] на вашем сайте должен появится файл с токеном.

Если все прошло ок, то в карточке сделки при клике на кнопку виджета, должны вывестись все товары этой сделки.

