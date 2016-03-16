(function ($) {

    var defaults = {
        div: '<div class="dropdown bts_dropdown"></div>',
        buttontext: 'Maak een keuze',
        button: '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span></span> <i class="caret"></i></button>',
        ul: '<ul class="dropdown-menu"></ul>',
        li: '<li><label></label></li>',
        isdaylist: false
    };

    $.fn.treeselect = function (options) {
        var $select = $(this);
        var settings = $.extend(defaults, options);

        var $div = $(settings.div);
        var $button = $(settings.button);
        var $ul = $(settings.ul).click(function (e) {
            e.stopPropagation();
        });

        initialize();

        function initialize() {
            $select.after($div);
            $div.append($button);
            $div.append($ul);

            createList();
            updateButtonText();

            $select.remove();
        }

        function createStructure(selector) {
            var options = [];

            $select.children(selector).each(function (i, el) {
                $el = $(el);

                options.push({
                    value: $el.val(),
                    text: $el.text(),
                    checked: $el.attr('selected') ? true : false,
                    children: createStructure('option[data-parent=' + $el.val() + ']')
                });
            });

            return options;
        }

        function createListItem(option) {
            var $li = $(settings.li);
            $label = $li.children('label');
            $label.text(option.text);
            
            if ($select.attr('multiple')) {
                $input = $('<input type="checkbox" data-shortext="'+option.text.substring(0,2)+'" name="' + $select.attr('name').replace('[]','') + '[]" value="' + option.value + '">');
            } else {
                $input = $('<input type="radio" data-shortext="'+option.text.substring(0,2)+'" name="' + $select.attr('name') +'" value="' + option.value + '">');
            }


            if (option.checked)
                $input.attr('checked', 'checked');
            $label.prepend($input);

            $input.change(function () {
                updateButtonText();
            });

            if (option.children.length > 0) {
                $childul = $('<ul></ul>').appendTo($li);

                $(option.children).each(function (i, child) {
                    $childul.append(createListItem(child));
                });
            }

            return $li;
        }

        function createList() {
            $(createStructure('option:not([data-parent])')).each(function (i, option) {
                $li = createListItem(option);
                $ul.append($li);
            });
        }

        function updateButtonText() {
            buttontext = [];

            $div.find('input').each(function (i, el) {
                $checkbox = $(el);
                if ($checkbox.is(':checked')) {
                    if($checkbox.data('shortext')!==undefined && $checkbox.data('shortext')!='')
                    {
                        var shorttext = $checkbox.data('shortext')+'.';
                    }
                    else
                    {
                        var shorttext = $checkbox.parent().text();
                    }
                    buttontext.push(shorttext);
                }
            });
            var dayarray = ['Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.', 'Su.'];
            if(settings.isdaylist)
            {
                if (buttontext.length > 0) {
                    var number = '';
                    for(var i=0; i<buttontext.length;i++)
                    {
                        number = number+$.inArray(buttontext[i], dayarray);
                    }
                    if(number=='01234')
                    {
                        $button.children('span').text('weekdays');
                    }
                    else if(number=='56')
                    {
                        $button.children('span').text('weekend');
                    }
                    else if(number=='012' || number=='0123' || number=='01234' || number=='012345' || number=='0123456' || number=='123' || number=='1234' || number=='12345' || number=='123456' || number=='234' || number=='2345' || number=='23456' || number=='345' || number=='3456' || number=='456')
                    {
                        $button.children('span').text(buttontext[0]+' - '+buttontext[buttontext.length-1]);
                    }
                    else if (number.length = 1)
                    {
                        $button.children('span').text(buttontext);
                    }
                    else if (number.length > 1)
                    {
                        $button.children('span').text(buttontext.join(', '));
                    }
                    else
                    {
                        $button.children('span').text(settings.buttontext);
                    }
                }
                else
                {
                    $button.children('span').text(settings.buttontext);
                }
            }
            else
            {
                if (buttontext.length > 0) {
                    if (buttontext.length < 4) {
                        $button.children('span').text(buttontext.join(', '));
                    } else if ($div.find('input').length == buttontext.length) {
                        $button.children('span').text('Alle items selected');
                    } else {
                        $button.children('span').text(buttontext.length + ' items selected');
                    }
                } else {
                    $button.children('span').text(settings.buttontext);
                }
            }
            
        }
    };
}(jQuery));