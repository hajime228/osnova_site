const SHEET_NAME = 'Статьи';

function setupArticlesSheet() {
  const ss = SpreadsheetApp.create('Статьи автора — ЦОР ОСНОВА');
  const sheet = ss.getSheets()[0];
  sheet.setName(SHEET_NAME);
  sheet.getRange(1,1,1,9).setValues([['Статус','Дата','Категория','Заголовок','slug','Краткое описание','Текст статьи','Ссылка на обложку','Время чтения']]);
  sheet.getRange(2,1,1,9).setValues([['Черновик',new Date(),'Обучение','Название новой статьи','nazvanie-stati','Короткое описание для карточки','Текст статьи. Можно использовать HTML: <p>, <h2>, <ul>, <blockquote>.','','5 минут']]);
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1,9);
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID',ss.getId());
  Logger.log('Таблица: '+ss.getUrl());
}

function doGet(e) {
  const callback = (e && e.parameter && e.parameter.callback) || '';
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) return output({error:'Сначала запустите setupArticlesSheet'}, callback);
  const sheet = SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
  const values = sheet.getDataRange().getDisplayValues();
  const rows = values.slice(1).filter(r => String(r[0]).trim().toLowerCase() === 'опубликовано').map(r => ({
    status:r[0], date:r[1], category:r[2], title:r[3], slug:r[4], excerpt:r[5], content:r[6], image:r[7], readTime:r[8]
  })).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  return output({articles:rows},callback);
}

function output(data,callback){
  const json=JSON.stringify(data);
  if(callback){
    return ContentService.createTextOutput(callback+'('+json+')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
