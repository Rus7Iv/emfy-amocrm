# AmoCRM-система

Условия:

1. Создана страница в виде таблицы "Сделки" из созданного аккаунта amoCRM. Для решения проблемы CORS был использован прокси-сервер - это даст возможность выполнять обращение к методам amoCRM. В таблицу выведены названия сделок, бюджеты, даты и время создания/изменения, ответственных и любые другие поля сделок.

2. Скрипт дает возможность пагинации по 2, 5 и 10 сделок на странице. Также должна быть возможность вывести сразу все сделки. В рамках вывода всех сделок выполнено ограничение: за один запрос получать максимум 5 сделок и не отправлять более 2 запросов в секунду.

3. Реализована сортировка по бюджету и названию сделки.

![image](https://github.com/Rus7Iv/emfy-amocrm/assets/73655792/498e6a6b-cad9-44bc-8dcb-bf6843602758)
