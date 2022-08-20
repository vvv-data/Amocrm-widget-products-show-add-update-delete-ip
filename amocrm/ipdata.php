<?php
header("Access-Control-Allow-Origin: *");

include_once 'config.php';

if ($_GET['my_secret'] != $my_secret) die('нет доступа');

if (!$_GET['lang_id'] == 'ru')
    include_once 'config_text_ru.php';
else
    include_once 'config_text_en.php';

use AmoCRM\Collections\LinksCollection;

include_once 'OAuth2.php';

$idcat = 0;
if (isset($_GET['idcat'])) $idcat = (int)$_GET['idcat'];

$lead_id = (int)$_GET['lead_id'];
$lead = $apiClient->leads()->getOne($lead_id);
$links = $apiClient->leads()->getLinks($lead);
$links_array = $links->toArray();

// загрузка товаров сделки первая или по кнопке
if ($_SERVER['REQUEST_METHOD'] === 'GET' && (!$_GET['act']) || $_GET['act'] == 'showprod') {
    // только при первой загрузке
    if (!$_GET['act']) {
        echo "
        <script src=\"https://vvvdata.ru/amocrm/style.js\"></script>
        <div class=\"card-widgets__widget__body js-body-hide\">
        <button type=\"button\" class=\"button-input button-input-disabled\" tabindex=\"\" id=\"save\"><span class=\"button-input-inner \"><span class=\"button-input-inner__text\">" . $config_text['button_save'] . "</span></span></button> 
        <button type=\"button\" class=\"button-input button-input-disabled\" tabindex=\"\" id=\"reset\"><span class=\"button-input-inner \"><span class=\"button-input-inner__text\">" . $config_text['button_reset'] . "</span></span></button>
        <button type=\"button\" class=\"button-input\" tabindex=\"\" id=\"add\"><span class=\"button-input-inner \"><span class=\"button-input-inner__text\">" . $config_text['button_add'] . "</span></span></button>
        <button type=\"button\" class=\"button-input\" tabindex=\"\" id=\"showprod\"><span class=\"button-input-inner \"><span class=\"button-input-inner__text\">" . $config_text['button_products'] . "</span></span></button>
        <span class=\"success\"></span></div>
        <table id=\"tb_base\" data-lead_id=\"" . $lead_id . "\"  data-secret=\"" . $my_secret . "\"  data-url=\"" . $yourUrl . "\"  data-lang_id=\"" . $_GET['lang_id'] . "\">";
    }

    // выводится при обоих загрузках
    echo "<caption id='lead'>" . $config_text['caption_products'] . $lead_id . "</caption>
    <tr class=\"tr_th\">
        <th>".$config_text['th_name']."</th>
        <th>".$config_text['th_quantity']."</th>
        <th>".$config_text['th_delete']."</th>
      </tr>";
    foreach ($links_array as $key => $value) {
        if ($value['to_entity_type'] == 'catalog_elements') {
            $catalogElement = $apiClient->catalogElements($value['metadata']['catalog_id'])->getOne($value['to_entity_id']);
            echo "<tr id=\"tr_" . $value['to_entity_id'] . "\" class=\"product\">";
            echo "<td>" . $catalogElement->toArray()['name'] . "</td>
        <td>x <u class=\"numeric\" id=\"" . $value['to_entity_id'] . "\" contenteditable=\"true\">" . $value['metadata']['quantity'] . "</u></td>
        <td data-trid=\"" . $value['to_entity_id'] . "\">
        <button type=\"button\" class=\"button-input\" tabindex=\"\"><span class=\"button-input-inner \"><span class=\"button-input-inner__text delete\" data-bid=\"" . $value['to_entity_id'] . "\">".$config_text['button_delete']."</span></span></button></td>
         </tr>";
        }
    }

    // только при первой загрузке
    if (!$_GET['act']) {
        echo "</table>
        <script src=\"https://vvvdata.ru/amocrm/my_script.js\"></script>";
    }
    // сохранение редактирования количества или удаление продуктов
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['act'] == 'upd') {

    $data = json_decode($_POST['arr']);

    foreach ($data as $key => $value) {

        $key = (int)$key;
        $elem_delete = $links->getBy('toEntityId', $key);

        if ($value > 0) {
            $catalog_id = $elem_delete->toArray()['metadata']['catalog_id'];
            $elem_update = $apiClient->catalogElements($catalog_id)->getOne($key);
            $elem_update->setQuantity($value);
            $links_update = new LinksCollection();
            $links_update->add($elem_update);

            try {
                $apiClient->leads()->unlink($lead, $elem_delete);
                $apiClient->leads()->link($lead, $links_update);
            } catch (Exception $e) {
                echo "<font color=red>Error - update!</font>";
            }
        } else {
            try {
                $apiClient->leads()->unlink($lead, $elem_delete);
            } catch (Exception $e) {
                echo "<font color=red>Error - delete!</font>";
            }
        }
    }
    // выбор каталога для добавления продуктов   
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['act'] == 'add') {
    echo "<caption id='lead'>".$config_text['caption_add'] . $lead_id . "</caption>";
    $catalogsCollection = $apiClient->catalogs()->get();
    foreach ($catalogsCollection->toArray() as $key => $value) {
        echo "<tr><td><a data-idcat='$value[id]' class='product catalog aside__list-item-link navigate-link-nodecor h-text-overflow js-navigate-link'>$value[name]</a></td></tr> ";
    }
    // выбираем продукты для добавления и устанавливаем количество    
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['act'] == 'add_select') {
    $data_filtr = (array)json_decode($_POST['arr']); // получили из пост запроса массив продуктов уже добавленных в эту сделку

    echo "<caption id='lead'>".$config_text['caption_add_select'] . $lead_id."</caption>
    <tr class=\"tr_th\">
    <th>".$config_text['th_name']."</th>
    <th>".$config_text['th_quantity']."</th>
    <th>".$config_text['th_add']."</th>
    </tr>";
    // получаем элементы выбранного каталога
    $catalogElements = $apiClient->catalogElements($idcat)->get();

    foreach ($catalogElements->toArray() as $key => $value) {

        // проверим может продукт уже добавлен в эту сделку, тогда не выводим
        if (!$data_filtr[$value['id']]) {

            echo "<tr id=\"tr_$value[id]\" class=\"product\">";
            echo "<td>$value[name]</td><td>x <u class=\"numeric\" id=\"$value[id]\" contenteditable=\"false\"></u></td>
    <td data-trid=\"$value[id]\">
    <button type=\"button\" class=\"button-input\" tabindex=\"\"><span class=\"button-input-inner \"><span class=\"button-input-inner__text delete\" data-bid=\"$value[id]\">".$config_text['button_add_select']."</span></span></button></td>
     </tr>";
        }
    }
    // сохранение выбранных продуктов из каталога     
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['act'] == 'add_save') {
    // получили из пост запроса массив продуктов уже добавленных в эту сделку
    $data_select = (array)json_decode($_POST['arr']);
    $catalogElements = $apiClient->catalogElements($idcat);
    $new_links = new LinksCollection();

    foreach ($data_select as $key => $value) {
        $element = $catalogElements->getOne($key);
        $element->setQuantity($value);
        $new_links->add($element);
    }

    try {
        $apiClient->leads()->link($lead, $new_links);
    } catch (Exception $e) {
        echo "<font color=red>Error - add!</font>";
    }
}
