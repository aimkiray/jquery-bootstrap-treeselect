;(function ($) {

    var defaults = {
        div: '<div class="dropdown bts_dropdown"></div>',
        inputbutton: '<input id="treeSelectInput" class="form-control" type="text" placeholder="Search..."/>',
        buttontext: '',
        button: '<button class="btn btn-primary dropdown-toggle" type="button" data-toggle="dropdown"><span></span> <i class="caret"></i></button>',
        ul: '<ul name="treeSelectMenu" class="dropdown-menu"></ul>',
        li: '<li><label></label></li>',
        isdaylist: false,
        searchable: false, // Weather to enable search mode.
        selectable: false,
        source: [],
        level: 1
    };

    $.fn.treeselect = function (options) {
        var $select = $(this);
        var settings = $.extend(defaults, options);

        var $div = $(settings.div);
        var $button = $(settings.button);
        var $inputbutton = $(settings.inputbutton);
        var $ul = $(settings.ul).click(function (e) {
            e.stopPropagation();
        });
        var $searchable = $(settings.searchable);
        var $selectable = $(settings.selectable);
        var $source = $(settings.source);
        var $level = $(settings.level);

        var lastFilter = '';

        initialize();

        function initialize() {

            $select.after($div);

            if ($searchable) {
                $div.append($inputbutton);
            } else {
                $div.append($button);
            }
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

            // Default sub-items
            $label.toggleClass('has-children');

            if ($select.attr('multiple')) {
                $input = $('<input type="checkbox" data-shortext="' + option.text.substring(0, 4) + '" name="' + $select.attr('name').replace('[]', '') + '[]" value="' + option.value + '">');
            } else {
                $input = $('<input type="radio" data-shortext="' + option.text.substring(0, 4) + '" name="' + $select.attr('name') + '" value="' + option.value + '">');
            }

            if (option.checked)
                $input.attr('checked', 'checked');
            $label.prepend($input);

            // insert a thumb if it doesn't already exist
            if ($label.children().filter('.thumb').length == 0) {
                var thumb = $('<span class="thumb"></span>');
                $label.prepend(thumb);
            }

            $input.change(function () {
                updateButtonText();
            });

            if (option.children.length > 0) {
                expandListItem($label);

                // $label.toggleClass('has-children');

                $childul = $('<ul></ul>').appendTo($li);

                $(option.children).each(function (i, child) {
                    $childul.append(createListItem(child));
                });
            }

            return $li;
        }

        function findListItem(el) {
            if (typeof el === 'object') return $(el);
            return $ul.find('[id="' + el + '"]');
        }

        function toggleListItem(listItem) {
            if (!$(listItem).hasClass('expanded')) {
                return expandListItem(listItem);
            }
            else {
                return collapseListItem(listItem);
            }
        }

        function expandListItem(listItem) {
            return setExpanded(listItem, true);
        }

        function collapseListItem(listItem) {
            return setExpanded(listItem, false);
        }

        function setExpanded(listItem, expanded) {
            var $liSet = findListItem(listItem);
            if ($liSet.length > 1) {
                $liSet.each(function () {
                    setExpanded(this, expanded);
                });
                return;
            }
            if (expanded) {
                $liSet = $($liSet).addClass('expanded').removeClass('collapsed');
                $($liSet.data('subList')).css('height', 'auto');
            }
            else {
                $liSet = $($liSet).addClass('collapsed').removeClass('expanded');
                $($liSet.data('subList')).height(0);
            }
            return $liSet;
        }

        function createList() {
            if ($source.length === 0) {
                $(createStructure('option:not([data-parent])')).each(function (i, option) {
                    $li = createListItem(option);

                    $ul.append($li);
                });
            } else {
                $source.each(function (i, option) {
                    $li = createListItem(option);

                    $ul.append($li);
                });
            }

        }

        function isRootList(listItem) {
            return $ul.children() == listItem;
        }

        // Filter the tree keyword.
        function searchList(Obj, keyword) {
            if (!Obj.is('ul')) {
                return false;
            }
            var children = Obj.children();
            var result = false;
            for (var i = 0; i < children.length; i++) {
                var liObj = $(children[i]);
                if (liObj.is('li')) {
                    var display = false;
                    if (liObj.children().length > 0) {
                        for (var j = 0; j < liObj.children().length; j++) {
                            var subDisplay = searchList($(liObj.children()[j]), keyword);
                            display = display || subDisplay;
                        }
                    }
                    if (!display) {
                        var text = liObj.text();
                        display = text.toLowerCase().indexOf(keyword) >= 0;
                    }
                    if (isRootList(liObj)) {
                        // TODO
                    }
                    liObj.css('display', display ? '' : 'none');
                    result = result || display;
                }
            }
            return result;
        }

        function updateButtonText() {
            buttontext = [];

            $div.find('input').each(function (i, el) {
                $checkbox = $(el);
                if ($checkbox.is(':checked')) {
                    if ($checkbox.data('shortext') !== undefined && $checkbox.data('shortext') != '') {
                        var shorttext = $checkbox.data('shortext') + '.';
                    }
                    else {
                        var shorttext = $checkbox.parent().text();
                    }
                    buttontext.push(shorttext);
                }
            });

            var dayarray = ['Mo.', 'Tu.', 'We.', 'Th.', 'Fr.', 'Sa.', 'Su.'];
            if (settings.isdaylist) {
                if (buttontext.length > 0) {
                    var number = '';
                    for (var i = 0; i < buttontext.length; i++) {
                        number = number + $.inArray(buttontext[i], dayarray);
                    }
                    if (number == '01234') {
                        $button.children('span').text('Weekdays');
                    }
                    else if (number == '56') {
                        $button.children('span').text('Weekend');
                    }
                    else if (number == '012' || number == '0123' || number == '01234' || number == '012345' || number == '123' || number == '1234' || number == '12345' || number == '123456' || number == '234' || number == '2345' || number == '23456' || number == '345' || number == '3456' || number == '456') {
                        $button.children('span').text(buttontext[0] + ' - ' + buttontext[buttontext.length - 1]);
                    }
                    else if (number == '0123456') {
                        $button.children('span').text('Daily');
                    }
                    else if (number.length = 1) {
                        $button.children('span').text(buttontext);
                    }
                    else if (number.length > 1) {
                        $button.children('span').text(buttontext.join(', '));
                    }
                    else {
                        $button.children('span').text(settings.buttontext);
                    }
                }
                else {
                    $button.children('span').text(settings.buttontext);
                }
            }
            else {
                if (buttontext.length > 0) {
                    if (buttontext.length < 4) {
                        if ($searchable) {
                            // TODO
                            // $inputbutton.attr('placeholder', buttontext.join(', '));
                        } else {
                            $button.children('span').text(buttontext.join(', '));
                        }
                    } else if ($div.find('input').length == buttontext.length) {
                        if ($searchable) {
                            // $inputbutton.attr('placeholder', 'Alle items selected');
                        } else {
                            $button.children('span').text('Alle items selected');
                        }
                    } else {
                        if ($searchable) {
                            // $inputbutton.attr('placeholder', buttontext.length + ' items selected');
                        } else {
                            $button.children('span').text(buttontext.length + ' items selected');
                        }
                    }
                } else {
                    if ($searchable) {
                        // $inputbutton.attr('placeholder', settings.buttontext);
                    } else {
                        $button.children('span').text(settings.buttontext);
                    }
                }
            }
        }

        $('[name="treeSelectMenu"]').on('click', '.thumb', function (ev) {

            var $labelThumb = $(ev.currentTarget);

            var subLists = $labelThumb.parent('li').filter('ol, ul, label');
            $labelThumb.toggleClass('has-children', subLists.find('label').length > 0);
            // $label.removeClass().addClass('has-children', subLists.find('li').length > 0);
            // if there is a child list
            subLists.each(function () {
                // that's not empty
                if ($('li', this).length == 0) {
                    return;
                }
                // then this el has children
                $labelThumb.data('subList', this);
                // collapse the nested list
                if ($labelThumb.hasClass('expanded')) {
                    self.expandListItem($labelThumb);
                }
                else {
                    self.collapseListItem($labelThumb);
                }
            });

            self.toggleListItem($(ev.currentTarget).closest('label'));
        });

        $inputbutton.change(function () {

            $ul.remove();

            var width = $inputbutton.width() + 20 + 'px';
            var top = $inputbutton.position().top + 35;
            var left = $inputbutton.position().left;

            $ul.css({top: top, left: left, width: width});
            $ul.attr('class', 'tree-select-menu');

            $div.append($ul);

            var keyword = $inputbutton.val().toLowerCase();
            searchList($ul, keyword);
            return false;
        }).keyup(function () {
            if ($inputbutton.val() === lastFilter) return;
            lastFilter = $inputbutton.val();
            $inputbutton.change();
        }).click(function () {
            $inputbutton.change();
        }).blur(function () {

            // Click in the empty area, hide automatically.
            $(document).mouseup(function (e) {
                var _con = $('[name="treeSelectMenu"]');
                if (!_con.is(e.target) && _con.has(e.target).length === 0) {
                    // Clear the input and remove select menu.
                    $inputbutton.val('');
                    $ul.remove();
                }
            });

        });
        return this;
    };

}(jQuery));