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

const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});
app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
