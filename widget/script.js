define(['jquery', 'lib/components/base/modal'], function ($, Modal) {
  var CustomWidget = function () {
    var self = this;

    self.getModal = function (data) {
        new Modal({
        class_name: 'modal-window',
        init: function ($modal_body) {
          $modal_body
            .trigger('modal:loaded')
            .html(data)
            .trigger('modal:centrify')
            .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>')
        },
        destroy: function () { }
      });
    }


    this.callbacks = {
      settings: function () {
      },
      dpSettings: function () {
      },
      init: function () {
        return true;
      },
      render: function () {

        if (AMOCRM.getWidgetsArea() == 'leads_card') {

          self.render_template({
            render: self.render({ ref: '/tmpl/controls/button.twig' }, {
              id: 'allprod',
              name: 'buttonproducts',
              text: self.i18n('settings').button_title
            })
          }, { count: 10 });
        }
        return true;
      },
      bind_actions: function () {

        if (AMOCRM.getWidgetsArea() == 'leads_card') {
          $('#allprod').on('click', function (e) {
            $('#allprod').trigger('button:load:start');
            $.ajax({
              // в my_secret= укажите свое значение такое же как в /amocrm/config.php - $my_secret, чтобы закрыть доступ посторонним 
              url: 'https://yourUrl.ru/amocrm/ipdata.php?lead_id=' + AMOCRM.constant('card_id') + '&lang_id=' + AMOCRM.lang_id + '&my_secret=8965ghubb877y9cnghgfh7y5tctgy5tbfcfc87',
              type: 'GET',
              success: function (data) {
                self.getModal(data);
                $('#allprod').trigger('button:load:stop');
              },
              error: function (jqXHR, textStatus, errorThrown) {
                self.getModal('<div>Error status ' + textStatus + '-' + jqXHR.status + '</div>');
                $('#allprod').trigger('button:load:stop');
              }
            });

          });
        }

        return true;
      },
      onSave: function () {
        return true;
      }
    };
    return this;
  };
  return CustomWidget;
});