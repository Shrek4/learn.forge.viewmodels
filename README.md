# forge.tutorial.viewmodels.nodejs

![Node.js](https://img.shields.io/badge/node-%3E%3D%2010.0.0-brightgreen.svg)
![Platforms](https://img.shields.io/badge/platform-windows%20%7C%20osx%20%7C%20linux-lightgray.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

[![Viewer](https://img.shields.io/badge/Viewer-v7-green.svg)](http://developer.autodesk.com/)
[![oAuth2](https://img.shields.io/badge/oAuth2-v1-green.svg)](http://developer.autodesk.com/)
[![Data-Management](https://img.shields.io/badge/Data%20Management-v1-green.svg)](http://developer.autodesk.com/)
[![OSS](https://img.shields.io/badge/OSS-v2-green.svg)](http://developer.autodesk.com/)
[![Model-Derivative](https://img.shields.io/badge/Model%20Derivative-v2-green.svg)](http://developer.autodesk.com/)

# Описание

Этот пример является частью руководств [Learn Forge](http://learnforge.autodesk.io).

# Установка

Чтобы использовать этот образец, вам потребуются учетные данные разработчика Autodesk. Посетите [Портал разработчиков Forge](https://developer.autodesk.com), зарегистрируйте учетную запись, затем [создайте приложение](https://developer.autodesk.com/myapps/create). Для этого нового приложения используйте **http://localhost:3000/api/forge/callback/oauth** в качестве URL-адреса обратного вызова, хотя он не используется в двухстороннем потоке. Наконец, обратите внимание на **Client ID** и **Client Secret**.

### Локальный запуск

Установите [NodeJS](https://nodejs.org).

Клонируйте этот проект или загрузите его. Рекомендуется установить [GitHub Desktop](https://desktop.github.com/). Чтобы клонировать его через командную строку, используйте следующее (**Terminal** в MacOSX / Linux,  **Git Shell** в Windows):

    git clone https://github.com/autodesk-forge/forge.learning.viewmodels
    git checkout nodejs

Чтобы запустить его, установите необходимые пакеты, установите переменные среды с вашим идентификатором клиента и секретом и, наконец, запустите его. С помощью командной строки перейдите в папку, в которую был клонирован этот репозиторий, и используйте следующие команды:

Mac OSX/Linux (Terminal)

    npm install
    export FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    export FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    npm start

Windows (используйте **Node.js command line** из меню Пуск)

    npm install
    set FORGE_CLIENT_ID=<<YOUR CLIENT ID FROM DEVELOPER PORTAL>>
    set FORGE_CLIENT_SECRET=<<YOUR CLIENT SECRET>>
    npm start

Откройте браузер: [http://localhost:3000](http://localhost:3000).

## Использованные пакеты

Пакеты [Autodesk Forge](https://www.npmjs.com/package/forge-apis) включены по умолчанию. Используются некоторые другие пакеты, не принадлежащие Autodesk, включая [express](https://www.npmjs.com/package/express) и [multer](https://www.npmjs.com/package/multer) для загрузки.

# Советы и приёмы

Для локальной разработки / тестирования рассмотрите возможность использования пакета [nodemon](https://www.npmjs.com/package/nodemon), который автоматически перезапускает ваше приложение узла после любой модификации вашего кода. Для его установки используйте:

    sudo npm install -g nodemon

Затем, вместо **npm run dev**, используйте следующее:

    npm run nodemon

При этом выполняется  **nodemon server.js --ignore www/**, где параметр  **--ignore** указывает, что приложение не должно перезапускаться, если файлы в папке **www** изменены.

## Устранение неполадок

Если после установки GitHub Desktop для Windows в оболочке Git вы видите ошибку ***error setting certificate verify locations***, то используйте следующую команду:

    git config --global http.sslverify "false"

# Лицензия

Этот образец лицензирован в соответствии с условиями [Лицензия MIT](http://opensource.org/licenses/MIT).
Пожалуйста, просмотрите файл [LICENSE](ЛИЦЕНЗИЯ) для получения полной информации.

## Автор

Augusto Goncalves [@augustomaia](https://twitter.com/augustomaia), [Forge Partner Development](http://forge.autodesk.com)
