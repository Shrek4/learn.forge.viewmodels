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

var viewer;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'));
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  var viewables = doc.getRoot().getDefaultGeometry();
  viewer.loadDocumentNode(doc, viewables).then(i => {
    // documented loaded, any action?
  });
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}
