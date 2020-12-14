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

const fs = require('fs');
const express = require('express');
const multer  = require('multer');
const { BucketsApi, ObjectsApi, PostBucketsPayload } = require('forge-apis');

const { getClient, getInternalToken } = require('./common/oauth');
const config = require('../config');

let router = express.Router();

// Промежуточное ПО для получения токена для каждого запроса.
router.use(async (req, res, next) => {
    const token = await getInternalToken();
    req.oauth_token = token;
    req.oauth_client = getClient();
    next();
});

// GET /api/forge/oss/buckets - ожидает параметр запроса id; если параметр равен '#' или пуст,
// возвращает JSON со списком корзин, иначе возвращает JSON со списком объектов в корзине с заданным именем.
router.get('/buckets', async (req, res, next) => {
    const bucket_name = req.query.id;
    if (!bucket_name || bucket_name === '#') {
        try {
            // Получение до 100 корзин из Forge с помощью [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#getBuckets)
            // Примечание: если сегментов больше, вы должны вызывать метод getBucket в цикле, предоставляя разные параметры 'startAt'
            const buckets = await new BucketsApi().getBuckets({ limit: 100 }, req.oauth_client, req.oauth_token);
            res.json(buckets.body.items.map((bucket) => {
                return {
                    id: bucket.bucketKey,
                    // Remove bucket key prefix that was added during bucket creation
                    text: bucket.bucketKey.replace(config.credentials.client_id.toLowerCase() + '-', ''),
                    type: 'bucket',
                    children: true
                };
            }));
        } catch(err) {
            next(err);
        }
    } else {
        try {
            // Получить до 100 объектов из Forge, используя [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#getObjects)
            // Примечание: если в корзине больше объектов, вы должны вызвать метод getObjects в цикле, предоставляя разные параметры 'startAt'
            const objects = await new ObjectsApi().getObjects(bucket_name, { limit: 100 }, req.oauth_client, req.oauth_token);
            res.json(objects.body.items.map((object) => {
                return {
                    id: Buffer.from(object.objectId).toString('base64'),
                    text: object.objectKey,
                    type: 'object',
                    children: false
                };
            }));
        } catch(err) {
            next(err);
        }
    }
});

// POST /api/forge/oss/buckets - создает новое ведро.
// Тело запроса должно быть корректным JSON в форме { "bucketKey": "<new_bucket_name>" }.
router.post('/buckets', async (req, res, next) => {
    let payload = new PostBucketsPayload();
    payload.bucketKey = config.credentials.client_id.toLowerCase() + '-' + req.body.bucketKey;
    payload.policyKey = 'transient'; // истекает через 24 часа
    try {
        // Создаем ведро, используя [BucketsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/BucketsApi.md#createBucket).
        await new BucketsApi().createBucket(payload, {}, req.oauth_client, req.oauth_token);
        res.status(200).end();
    } catch(err) {
        next(err);
    }
});

// POST /api/forge/oss/objects - загружает новый объект в заданное ведро.
// Тело запроса должно быть структурировано как словарь 'form-data'
// с загруженным файлом под ключом fileToUpload и именем сегмента под ключом bucketKey.
router.post('/objects', multer({ dest: 'uploads/' }).single('fileToUpload'), async (req, res, next) => {
    fs.readFile(req.file.path, async (err, data) => {
        if (err) {
            next(err);
        }
        try {
            // Загружаем объект в корзину, используя [ObjectsApi](https://github.com/Autodesk-Forge/forge-api-nodejs-client/blob/master/docs/ObjectsApi.md#uploadObject).
            await new ObjectsApi().uploadObject(req.body.bucketKey, req.file.originalname, data.length, data, {}, req.oauth_client, req.oauth_token);
            res.status(200).end();
        } catch(err) {
            next(err);
        }
    });
});

module.exports = router;
