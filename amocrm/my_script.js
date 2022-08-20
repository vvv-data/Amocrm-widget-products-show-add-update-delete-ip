var myGlobal = {}, config_text = {}, quantity_old = {}, quantity_change = {}, quantity_temp = {}, quantity_del = {};
var overlay = $('<div id="overlay"> </div>');

// заполняем глобальные данные при первой загрузке
myGlobal['lead_id'] = $('#tb_base').data('lead_id');
myGlobal['url'] = $('#tb_base').data('url');
myGlobal['secret'] = $('#tb_base').data('secret');
myGlobal['lang_id'] = $('#tb_base').data('lang_id');
if(myGlobal['lang_id'] != 'ru') myGlobal['lang_id'] = 'en';
myGlobal['act'] = 'upd';
myGlobal['idcat'] = '';

// заполняем текстовые данные в config_text при первой загрузке
GetTextConfig();

// заполняем старыми значениями quantity_old
SetQuantityOld();

// Save Request
$('#save').on('click', function (e) {
    if (!$('#save').hasClass('button-input-disabled')) {
        if (myGlobal['act'] == 'upd') {
            myGlobal['idcat'] = '';
            SaveUpdateRequest();
        }
        else if (myGlobal['act'] == 'add_select') {
            myGlobal['act'] = 'add_save';
            SaveAddRequest();
            myGlobal['act'] = 'add_select';
        }
    }
});

// add Request
$('#add').on('click', function (e) {
    if (!$('#add').hasClass('button-input-disabled')) {
        myGlobal['act'] = 'add';
        myGlobal['idcat'] = '';
        AddRequest();
        SaveDisabled();
    }
});

// выбрать список Request
$('#tb_base').on('click', '.catalog', function (e) {
    myGlobal['act'] = 'add_select';
    myGlobal['idcat'] = $(e.target).data('idcat');
    AddSelectRequest();
});

// showproducts Request
$('#showprod').on('click', function (e) {
    myGlobal['act'] = 'showprod';
    myGlobal['idcat'] = '';
    ProductsRequest();
    myGlobal['act'] = 'upd';
    SaveDisabled();
});

// есть изменения?
$('#tb_base').on('blur', '.numeric', function (e) {
    e.stopPropagation();
    var id = $(e.target).attr('id');
    var qt = $('#' + id).text().replace(/[^\d.]/ig, '');
    $('#' + id).text(parseFloat(qt))
    SetDeleteCancel(id);
    GetChanges();
});

// reset
$('#reset').on('click', function (e) {
    if (!$('#add').hasClass('button-input-disabled')) {
        if (myGlobal['act'] != 'add_select') {
            for (var key in quantity_old) {
                $('#' + key).text(quantity_old[key]);
            }
            $('tr').css('color', '');
            $('.numeric').attr('contenteditable', true);
            $('.delete').text(config_text['button_delete']);
        }
        else {
            $('.numeric').text('');
            $('.product').css('color', '#a5a5a5');
            $('.numeric').attr('contenteditable', false);
            $('.delete').text(config_text['button_add_select']);
        }
        SaveDisabled();
    }

});

// удалить или добавить
$('#tb_base').on('click', '.delete', function (e) {
    var quantity_id = $(e.target).data('bid');
    SetDeleteCancel(quantity_id, true);
});

// control
$('#tb_base').on('keypress', '.numeric', function (e) {
    e.stopPropagation();
    if (($(e.target).text().split(".").length - 1 > 0)) {
        if (isNaN(String.fromCharCode(e.which))) e.preventDefault();
    }
    else {
        if (isNaN(String.fromCharCode(e.which)) && String.fromCharCode(e.which) != '.') e.preventDefault();
    }
});

function SetDeleteCancel(quantity_id, btnClick = false) {
    var flag = false;
    if (myGlobal['act'] == 'add_select') flag = true;

    if (btnClick && parseFloat($('#' + quantity_id).text()) > 0) {
        if (!flag)
            SetDelete(quantity_id);
        else
            SetCancelAdd(quantity_id);
    }
    else if (btnClick && !parseFloat($('#' + quantity_id).text()) > 0) {
        if (!flag)
            SetCancel(quantity_id);
        else
            SetAdd(quantity_id);
    }
    else if (!btnClick && !parseFloat($('#' + quantity_id).text()) > 0) {
        if (!flag)
            SetDelete(quantity_id);
        else
            SetCancelAdd(quantity_id);
    }
}

function SetAdd(quantity_id) {
    var quantity = parseFloat($('#' + quantity_id).text());
    if (!quantity > 0) quantity = 1;
    $('#' + quantity_id).attr('contenteditable', true);
    $('#' + quantity_id).text(quantity);
    $('#tr_' + quantity_id).css('color', '');
    $('[data-bid="' + quantity_id + '"]').text(config_text['button_add_select_cancel']);
    GetChanges();
}

function SetCancelAdd(quantity_id) {
    $('#' + quantity_id).attr('contenteditable', false);
    $('#' + quantity_id).text('');
    $('#tr_' + quantity_id).css('color', '#a5a5a5');
    $('[data-bid="' + quantity_id + '"]').text(config_text['button_add_select']);
    GetChanges();
}

function SetDelete(quantity_id) {
    $('#' + quantity_id).attr('contenteditable', false);
    $('#' + quantity_id).text(config_text['quantity_delete']);
    $('#tr_' + quantity_id).css('color', '#a5a5a5');
    $('[data-bid="' + quantity_id + '"]').text(config_text['button_delete_cancel']);
    GetChanges();
}

function SetCancel(quantity_id) {
    $('#' + quantity_id).attr('contenteditable', true);
    $('#' + quantity_id).text(quantity_old[quantity_id]);
    $('#tr_' + quantity_id).css('color', '');
    $('[data-bid="' + quantity_id + '"]').text(config_text['button_delete']);
    GetChanges();
}

function GetChanges() {
    var flag = false;

    if (myGlobal['act'] != 'add_select') {
        for (var key in quantity_old) {
            if (quantity_old[key] != $('#' + key).text())
                flag = true;
        }
    }
    else {
        for (var key in $('.numeric').text()) {
            if (parseFloat($('.numeric').text()[key]) > 0)
                flag = true;
        }
    }
    if (flag) {
        SaveEnabled();
    }
    else {
        SaveDisabled();
    }
}

function SaveDisabled() {
    if (!$('#save').hasClass('button-input-disabled')) {
        $('#save').trigger('button:save:disable');
        if (!$('#save').hasClass('button:load:start'))
            $('#save').trigger('button:load:stop');
        $('#reset').trigger('button:save:disable');
    }
}

function SaveEnabled() {
    $('.success').text('');
    if ($('#save').hasClass('button-input-disabled')) {
        $('#save').trigger('button:save:enable');
        $('#reset').removeClass('button-input-disabled');
    }
}


// delete
function DeleteSave(arr) {
    for (var key in arr) {
        $('#tr_' + arr[key]).detach();
    }
}

function RequestUrl() {
    return myGlobal['url'] + 'ipdata.php?lead_id=' + myGlobal['lead_id'] + '&act=' + myGlobal['act'] + '&idcat=' + myGlobal['idcat'] + '&lang_id=' + myGlobal['lang_id'] + '&my_secret=' + myGlobal['secret'];
}

function SaveUpdateRequest() {
    // заполняем quantity_change только измененные значения, обновляем quantity_old, задаем массив удалений quantity_del
    var temp_q, i = 0;

    $('.numeric').each(function (index, element) {
        temp_q = parseFloat($(element).text());

        if (quantity_old[$(element).attr("id")] != temp_q) {
            quantity_change[$(element).attr("id")] = temp_q;
        }

        if (temp_q > 0) {
            quantity_temp[$(element).attr("id")] = temp_q;
        }
        else {
            quantity_del[i] = $(element).attr("id");
        }
        i++;
    });

    $('#save').trigger('button:load:start');
    overlay.appendTo('.modal-window');

    $.ajax({
        url: RequestUrl(),
        type: 'POST',
        dataType: 'html',
        data: { arr: JSON.stringify(quantity_change) },
        success: function (data) {
            $('.success').html('<font color="#60cd89"> ' + config_text['success_saveupdate'] + '</font>');
            quantity_old = quantity_temp;
            DeleteSave(quantity_del);
        },
        error: function (r, t, errMsg) {
            $('.success').html('<br><font color="red"> ' + config_text['error_saveupdate'] + ' ' + errMsg + '</font>');
        },
        complete: function (jqXHR, textStatus) {
            SaveDisabled();
            overlay.detach();
            quantity_change = {}; quantity_temp = {}; quantity_del = {};
        }
    });
}

function SaveAddRequest() {
    // заполняем quantity_change только измененные значения, задаем массив удалений quantity_del
    var temp_q, i = 0;

    $('.numeric').each(function (index, element) {
        temp_q = parseFloat($(element).text());

        if (temp_q > 0) {
            quantity_change[$(element).attr("id")] = temp_q;
            quantity_del[i] = $(element).attr("id");
        }
        i++;
    });

    $('#save').trigger('button:load:start');
    overlay.appendTo('.modal-window');

    $.ajax({
        url: RequestUrl(),
        type: 'POST',
        dataType: 'html',
        data: { arr: JSON.stringify(quantity_change) },
        success: function (data) {
            $('.success').html('<font color="#60cd89"> ' + config_text['success_saveadd'] + '</font>');
            DeleteSave(quantity_del);
        },
        error: function (r, t, errMsg) {
            $('.success').html('<br><font color="red"> ' + config_text['error_saveadd'] + ' ' + errMsg + '</font>');
        },
        complete: function (jqXHR, textStatus) {
            SaveDisabled();
            overlay.detach();
            quantity_change = {}; quantity_del = {};
        }
    });
}

function AddRequest() {
    $('#add').trigger('button:save:enable');
    $('#add').trigger('button:load:start');
    ShowProdButton(true);
    overlay.appendTo('.modal-window');
    $('.success').text('');
    $.ajax({
        url: RequestUrl(),
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#add').trigger('button:save:disable');
            $('#tb_base').empty();
            $('#tb_base').html(data);
        },
        error: function (r, t, errMsg) {
            $('.success').html('<br><font color="red"> ' + config_text['error_add'] + ' ' + errMsg + '</font>');
        },
        complete: function (jqXHR, textStatus) {
            $('#add').trigger('button:load:stop');
            SaveDisabled();
            overlay.detach();
        }
    });
}

function AddSelectRequest() {
    $('#add').trigger('button:save:enable');
    $('#add').trigger('button:load:start');
    overlay.appendTo('.modal-window');
    $('.success').text('');
    $.ajax({
        url: RequestUrl(),
        type: 'POST',
        dataType: 'html',
        data: { arr: JSON.stringify(quantity_old) },
        success: function (data) {
            $('#tb_base').empty();
            $('#tb_base').html(data);
        },
        error: function (r, t, errMsg) {
            $('.success').html('<br><font color="red"> ' + config_text['error_addselect'] + ' ' + errMsg + '</font>');
        },
        complete: function (jqXHR, textStatus) {
            $('#add').trigger('button:load:stop');
            $('#add').removeClass('button-input_blue');
            $('#add span span').text(config_text['button_select_catalog']);
            SaveDisabled();
            overlay.detach();
            $('.product').css('color', '#a5a5a5');
        }
    });
}

function ProductsRequest() {
    $('#showprod').trigger('button:save:enable');
    $('#showprod').trigger('button:load:start');
    overlay.appendTo('.modal-window');
    $('.success').text('');
    $.ajax({
        url: RequestUrl(),
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            $('#tb_base').empty();
            $('#tb_base').html(data);
            SetQuantityOld();
        },
        error: function (r, t, errMsg) {
            $('.success').html('<br><font color="red"> ' + config_text['error_showproducts'] + ' ' + errMsg + '</font>');
        },
        complete: function (jqXHR, textStatus) {
            $('#add span span').text(config_text['button_add']);
            if ($('#add').hasClass('button-input-disabled')) $('#add').removeClass('button-input-disabled');
            $('#showprod').trigger('button:load:stop');
            $('#showprod').removeClass('button-input_blue');
            ShowProdButton();
            SaveDisabled();
            overlay.detach();
        }
    });
}

function GetTextConfig() {
    $.ajax({
        url: myGlobal['url'] + 'config_text_' + myGlobal['lang_id'] + '.php?render=1',
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            config_text = JSON.parse(data);
        },
        error: function (r, t, errMsg) {
            $('.success').html('<br><font color="red"> Error get text config ' + errMsg + '</font>');
        },
    });
}

function ShowProdButton(flag = false) {
    if (flag)
        $('#showprod').css('visibility', 'visible');
    else
        $('#showprod').css('visibility', 'hidden');
}

function SetQuantityOld() {
    quantity_old = {};
    // заполняем старыми значениями
    $('.numeric').each(function (index, element) {
        quantity_old[$(element).attr("id")] = $(element).text();
    });
}
