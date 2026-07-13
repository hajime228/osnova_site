const SHEET_NAME = 'Статьи';
const MEDIA_FOLDER_NAME = 'Медиа статей — ЦОР ОСНОВА';

function setupAuthorCMS() {
  const ss = SpreadsheetApp.create('Статьи автора — ЦОР ОСНОВА');
  const sheet = ss.getSheets()[0];
  sheet.setName(SHEET_NAME);
  sheet.getRange(1,1,1,12).setValues([[
    'ID','Статус','Дата','Категория','Заголовок','slug','Краткое описание',
    'Текст статьи','Ссылка на обложку','Время чтения','Галерея JSON','Вложения JSON'
  ]]);
  sheet.setFrozenRows(1);
  sheet.getRange('A1:L1').setFontWeight('bold').setBackground('#f2e4e1');
  sheet.setColumnWidths(1,12,150);
  sheet.setColumnWidth(5,260); sheet.setColumnWidth(7,320); sheet.setColumnWidth(8,520);
  const folder = DriveApp.createFolder(MEDIA_FOLDER_NAME);
  PropertiesService.getScriptProperties().setProperties({
    SPREADSHEET_ID:ss.getId(), MEDIA_FOLDER_ID:folder.getId(), ADMIN_KEY:createAdminKey_()
  });
  Logger.log('Таблица: '+ss.getUrl());
  Logger.log('Админ-ключ: '+PropertiesService.getScriptProperties().getProperty('ADMIN_KEY'));
  Logger.log('Папка медиа: '+folder.getUrl());
}

function doGet(e) {
  const p=(e&&e.parameter)||{};
  if(p.api==='1' || p.callback) return articlesApi_(p.callback||'');
  return HtmlService.createTemplateFromFile('Admin').evaluate()
    .setTitle('Редактор статей — ЦОР ОСНОВА')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function articlesApi_(callback){
  const sheet=getSheet_();
  const values=sheet.getDataRange().getDisplayValues();
  const rows=values.slice(1).filter(r=>String(r[1]).trim().toLowerCase()==='опубликовано').map(r=>({
    id:r[0],status:r[1],date:r[2],category:r[3],title:r[4],slug:r[5],excerpt:r[6],
    content:r[7],image:r[8],readTime:r[9],gallery:r[10]||'[]',attachments:r[11]||'[]'
  })).sort((a,b)=>String(b.date).localeCompare(String(a.date)));
  const data={articles:rows};
  const text=JSON.stringify(data);
  return callback
    ? ContentService.createTextOutput(callback+'('+text+')').setMimeType(ContentService.MimeType.JAVASCRIPT)
    : ContentService.createTextOutput(text).setMimeType(ContentService.MimeType.JSON);
}

function checkKey(key){ return String(key||'')===String(PropertiesService.getScriptProperties().getProperty('ADMIN_KEY')||''); }

function listAdminArticles(key){
  requireKey_(key);
  const sheet=getSheet_();
  const values=sheet.getDataRange().getDisplayValues();
  return values.slice(1).filter(r=>r[0]).map(r=>({id:r[0],status:r[1],date:r[2],category:r[3],title:r[4],slug:r[5],excerpt:r[6],content:r[7],image:r[8],readTime:r[9],gallery:r[10]||'[]',attachments:r[11]||'[]'})).reverse();
}

function saveArticle(key,data){
  requireKey_(key);
  const sheet=getSheet_();
  const id=String(data.id||Utilities.getUuid());
  const row=[id,data.status||'Черновик',data.date||formatDate_(new Date()),data.category||'Обучение',data.title||'',slugify_(data.slug||data.title||id),data.excerpt||'',sanitizeHtml_(data.content||''),data.image||'',data.readTime||estimateReadTime_(data.content||''),data.gallery||'[]',data.attachments||'[]'];
  const ids=sheet.getRange(2,1,Math.max(sheet.getLastRow()-1,1),1).getDisplayValues().flat();
  const idx=ids.indexOf(id);
  if(idx>=0) sheet.getRange(idx+2,1,1,row.length).setValues([row]); else sheet.appendRow(row);
  return {ok:true,id:id};
}

function deleteArticle(key,id){
  requireKey_(key);
  const sheet=getSheet_();
  const ids=sheet.getRange(2,1,Math.max(sheet.getLastRow()-1,1),1).getDisplayValues().flat();
  const idx=ids.indexOf(String(id));
  if(idx>=0) sheet.deleteRow(idx+2);
  return {ok:true};
}

function uploadMedia(key,file){
  requireKey_(key);
  if(!file || !file.base64 || !file.name) throw new Error('Файл не получен');
  const bytes=Utilities.base64Decode(file.base64);
  const blob=Utilities.newBlob(bytes,file.type||'application/octet-stream',file.name);
  const folder=DriveApp.getFolderById(PropertiesService.getScriptProperties().getProperty('MEDIA_FOLDER_ID'));
  const saved=folder.createFile(blob);
  saved.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW);
  const id=saved.getId();
  const isImage=String(file.type||'').startsWith('image/');
  const url=isImage ? 'https://drive.google.com/uc?export=view&id='+id : 'https://drive.google.com/file/d/'+id+'/view';
  return {name:saved.getName(),type:file.type||'',url:url,driveUrl:saved.getUrl(),id:id};
}

function getCmsInfo(key){
  requireKey_(key);
  const props=PropertiesService.getScriptProperties();
  return {sheetUrl:SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getUrl(),folderUrl:DriveApp.getFolderById(props.getProperty('MEDIA_FOLDER_ID')).getUrl()};
}

function getSheet_(){
  const id=PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if(!id) throw new Error('Сначала запустите setupAuthorCMS');
  return SpreadsheetApp.openById(id).getSheetByName(SHEET_NAME);
}
function requireKey_(key){ if(!checkKey(key)) throw new Error('Неверный ключ доступа'); }
function createAdminKey_(){ return Utilities.getUuid().replace(/-/g,'').slice(0,16); }
function formatDate_(d){ return Utilities.formatDate(d,Session.getScriptTimeZone()||'Europe/Moscow','yyyy-MM-dd'); }
function estimateReadTime_(html){ const text=String(html).replace(/<[^>]+>/g,' ').trim(); return Math.max(1,Math.ceil(text.split(/\s+/).filter(Boolean).length/180))+' мин'; }
function slugify_(v){ return String(v||'').toLowerCase().trim().replace(/[а-яё]/g,ch=>({а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'c',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'}[ch])).replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,90); }
function sanitizeHtml_(html){
  let s=String(html||'');
  s=s.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/\son\w+\s*=\s*(["']).*?\1/gi,'').replace(/javascript:/gi,'');
  return s;
}
