/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Автор Forge Partner Development
//
// Разрешение на использование, копирование, изменение и распространение этого программного обеспечения в
// форма объектного кода для любых целей и без комиссии предоставляется,
// при условии, что указанное выше уведомление об авторских правах присутствует во всех копиях и
// что это уведомление об авторских правах и ограниченная гарантия и
// примечание об ограниченных правах ниже появляется во всех поддерживающих
// документация.
//
// AUTODESK ПРЕДОСТАВЛЯЕТ ДАННУЮ ПРОГРАММУ "КАК ЕСТЬ" И СО ВСЕМИ ОШИБКАМИ.
// AUTODESK ОТКАЗЫВАЕТСЯ ОТ ЛЮБЫХ ПОДРАЗУМЕВАЕМЫХ ГАРАНТИЙ
// КОММЕРЧЕСКАЯ ЦЕННОСТЬ ИЛИ ПРИГОДНОСТЬ ДЛЯ ОПРЕДЕЛЕННОГО ИСПОЛЬЗОВАНИЯ. АВТОДЕСК, ИНК.
// НЕ ГАРАНТИРУЕТ, ЧТО РАБОТА ПРОГРАММЫ БУДЕТ
// БЕСПЕРЕБОЙНЫЙ ИЛИ БЕЗ ОШИБОК.
/////////////////////////////////////////////////////////////////////

const { AuthClientTwoLegged } = require('forge-apis');

const config = require('../../config');

/**
 * Инициализирует клиент Forge для двухсторонней аутентификации.
 * @param {string[]} scopes Список областей доступа к ресурсам.
 * @returns {AuthClientTwoLegged} двухсторонний клиент аутентификации.
 */
function getClient(scopes) {
    const { client_id, client_secret } = config.credentials;
    return new AuthClientTwoLegged(client_id, client_secret, scopes || config.scopes.internal);
}

let cache = {};
async function getToken(scopes) {
    const key = scopes.join('+');
    if (cache[key]) {
        return cache[key];
    }
    const client = getClient(scopes);
    let credentials = await client.authenticate();
    cache[key] = credentials;
    setTimeout(() => { delete cache[key]; }, credentials.expires_in * 1000);
    return credentials;
}

/**
  * Получает двухсторонний токен аутентификации для предварительно настроенных общедоступных областей.
  * @returns Объект токена: {"access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..."}.
 */
async function getPublicToken() {
    return getToken(config.scopes.public);
}

/**
 * Получает двухсторонний маркер аутентификации для предварительно настроенных внутренних областей.
 * @returns Объект токена: {"access_token": "...", "expires_at": "...", "expires_in": "...", "token_type": "..."}.
 */
async function getInternalToken() {
    return getToken(config.scopes.internal);
}

module.exports = {
    getClient,
    getPublicToken,
    getInternalToken
};
