/////////////////////////////////////////////////////////////////////
// Авторское право (c) Autodesk, Inc. Все права защищены.
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

const express = require('express');
const {
    DerivativesApi,
    JobPayload,
    JobPayloadInput,
    JobPayloadOutput,
    JobSvfOutputPayload
} = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');

let router = express.Router();

// Промежуточное ПО для получения токена для каждого запроса.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

// POST /api/forge/modelderivative/jobs - отправляет новое задание на перевод для данного объекта URN.
// Тело запроса должно быть корректным JSON в форме {"objectName": "<translated-object-urn>"}.
router.post('/jobs', async (req, res, next) => {
    let job = new JobPayload();
    job.input = new JobPayloadInput();
    job.input.urn = req.body.objectName;
    job.output = new JobPayloadOutput([
        new JobSvfOutputPayload()
    ]);
    job.output.formats[0].type = 'svf';
    job.output.formats[0].views = ['2d', '3d'];
    try {
        // Отправляем задание на перевод, используя [DerivativesApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/DerivativesApi.md#translate).
        await new DerivativesApi().translate(job, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
});

module.exports = router;
