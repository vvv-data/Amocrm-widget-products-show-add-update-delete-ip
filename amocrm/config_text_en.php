<?php
$config_text['button_save'] = 'Save';
$config_text['button_reset'] = 'Reset';
$config_text['button_add'] = 'Add';
$config_text['button_products'] = 'Products';
$config_text['button_delete'] = 'Delete';
$config_text['button_delete_cancel'] = 'Cancel';
$config_text['button_add_select'] = 'Add';
$config_text['button_add_select_cancel'] = 'Cancel';
$config_text['button_select_catalog'] = 'Select catalog';

$config_text['caption_products'] = 'Products Lead #';
$config_text['caption_add'] = 'Select the add list for Lead #';
$config_text['caption_add_select'] = 'Available products to add to Lead #';

$config_text['th_name'] = 'Name';
$config_text['th_quantity'] = 'Quantity';
$config_text['th_delete'] = 'Delete';
$config_text['th_add'] = 'Add';

$config_text['quantity_delete'] = 'delete';

$config_text['success_saveupdate'] = 'Successful!';
$config_text['success_saveadd'] = 'Successful!';

$config_text['error_saveupdate'] = 'Update error:';
$config_text['error_saveadd'] = 'Add error:';
$config_text['error_add'] = 'Add error:';
$config_text['error_addselect'] = 'Add error:';
$config_text['error_showproducts'] = 'Products error:';

if($_GET['render']){
    header("Access-Control-Allow-Origin: *");
    echo json_encode($config_text);
} 
 
?>
