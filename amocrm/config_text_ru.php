<?php
$config_text['button_save'] = 'Сохранить';
$config_text['button_reset'] = 'Сбросить';
$config_text['button_add'] = 'Добавить';
$config_text['button_products'] = 'Товары';
$config_text['button_delete'] = 'Удалить';
$config_text['button_delete_cancel'] = 'Отмена';
$config_text['button_add_select'] = 'Добавить';
$config_text['button_add_select_cancel'] = 'Отмена';
$config_text['button_select_catalog'] = 'Выбор каталога';

$config_text['caption_products'] = 'Товары Сделки #';
$config_text['caption_add'] = 'Выбрать каталог товаров для добавления в Сделку #';
$config_text['caption_add_select'] = 'Добавте товары в Сделку #';

$config_text['th_name'] = 'Название';
$config_text['th_quantity'] = 'Количество';
$config_text['th_delete'] = 'Удалить';
$config_text['th_add'] = 'Удалить';

$config_text['quantity_delete'] = 'удалить';

$config_text['success_saveupdate'] = 'Успешно!';
$config_text['success_saveadd'] = 'Успешно!';

$config_text['error_saveupdate'] = 'Ошибка обновления:';
$config_text['error_saveadd'] = 'Ошибка добавления:';
$config_text['error_add'] = 'Ошибка добавления:';
$config_text['error_addselect'] = 'Ошибка добавления:';
$config_text['error_showproducts'] = 'Ошибка списка товаров:';

if($_GET['render']){
    header("Access-Control-Allow-Origin: *");
    echo json_encode($config_text);
} 
 
?>
