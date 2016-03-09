(function ($) {
    /*******************
     *  Select Plugin  *
     ******************/
    $.fn.material_select = function(callback) {
        $(this).each(function() {
            var $select = $(this);

            if ($select.hasClass('browser-default')) {
                return; // Continue to next (return false breaks out of entire loop)
            }

            var multiple = $select.attr('multiple') ? true : false,
                lastID = $select.data('select-id'), // Tear down structure if Select needs to be rebuilt
                required = $select.attr('required') ? true : false,
                optgroups = $select.find('optgroup').length ? true : false;

            if (lastID) {
                $select.parent().find('span.caret').remove();
                $select.parent().find('input').remove();

                $select.unwrap();
                $('ul#select-options-' + lastID).remove();
            }

            // If destroying the select, remove the selelct-id and reset it to it's uninitialized state.
            if (callback === 'destroy') {
                $select.data('select-id', null).removeClass('initialized');
                return;
            }

            var uniqueID = Materialize.guid();
            $select.data('select-id', uniqueID);
            var wrapper = $('<div class="select-wrapper"></div>');
            wrapper.addClass($select.attr('class'));
            var options = $('<ul id="select-options-' + uniqueID + '" class="dropdown-content select-dropdown ' + (multiple ? 'multiple-select-dropdown' : '') + '"></ul>'),
                selectChildren = optgroups ? $select.find('optgroup, option:not(select > option:not(:disabled))') : $select.find('optgroup, option'),
                optionsValuesSelected = [],
                optionsHover = false;

            if (multiple) {
                if (optgroups) {
                    var optgroupValuesSelected = [];

                    for (var i = 0, optgroupsCount = $select.find('optgroup').length; i < optgroupsCount; i++) {
                        optionsValuesSelected.push([]);
                    }
                }
            }

            // Scan for existing options before an optgroup
            if (optgroups) {
                if ($select.find('> option:not(:disabled)').length) {
                    $select.find('> option:not(:disabled)').each(function() {
                        // Put it in comments
                        $(this).wrap(function() {
                            return '<!-- ' + this.outerHTML + ' -->';
                        });
                        $(this).remove();
                    });
                }
            }

            var label = $select.find('option:selected').html() || $select.find('option:disabled').eq(0).html() || '';

            // Function that renders and appends the element taking into
            // account type and possible image icon.
            var generateOptionsElement = function(element, multiple, optgroup) {
                // Add icons
                var iconUrl = element.data('icon') ? element.data('icon').trim() : '',
                    imageClasses = element.attr('class') ? element.attr('class').trim() : '',
                    disabledClass = (element.is(':disabled')) ? 'disabled' : '',
                    sanitizedText = optgroup ? element.attr('label').trim() : element.html().trim(),
                    dataValue = optgroup ? element.attr('label') : element.val();

                options.append(createElement());

                function createElement() {
                    var element = document.createElement('li'),
                        spanElement = document.createElement('span');

                    if (iconUrl) {
                        var image = document.createElement('img');
                        image.src = iconUrl;
                        image.className = imageClasses;

                        element.appendChild(image);
                    }

                    if (multiple) {
                        var input = document.createElement('input'),
                            labelCheckbox = document.createElement('label');

                        input.type = 'checkbox';

                        spanElement.appendChild(input);
                        spanElement.appendChild(labelCheckbox);
                    }

                    element.className += optgroup ? 'optgroup' + (disabledClass ? ' ' + disabledClass : '') : disabledClass;
                    element.dataset.value = dataValue;

                    spanElement.innerHTML += sanitizedText;
                    element.appendChild(spanElement);

                    return element;
                }
            };

            /* Create dropdown structure. */
            if (selectChildren.length) {
                selectChildren.each(function() {
                    var _this = $(this);

                    if (_this.is('option')) {
                        // generateOptionsElement = function(select, element, multiple, optgroup)
                        if (multiple) {
                            generateOptionsElement(_this, true, false);
                        } else {
                            generateOptionsElement(_this, false, false);
                        }
                    } else if ($(this).is('optgroup')) {
                        if (multiple) {
                            generateOptionsElement(_this, true, true);
                        } else {
                            generateOptionsElement(_this, false, true);
                        }
                    }
                });
            }

            options.find('li:not(.optgroup)').each(function(i) {
                var _this = $(this);

                _this.on('click', function(e) {
                    // Check if option element is disabled
                    if (!_this.hasClass('disabled') && !_this.hasClass('optgroup')) {
                        var indexLi = _this.index();

                        if (multiple) {
                            if (optgroups) {
                                var indexes = returnIndexes(_this);

                                toggleIndexFromArray(indexes.element, indexLi, indexes.optgroup);
                                toggleActivationOptgroupParent(_this);
                            } else {
                                toggleIndexFromArray(indexLi);
                            }

                            options.scrollTo(_this);
                            $('input[type="checkbox"]', _this[0]).prop('checked', function(i, v) {
                                return !v;
                            });
                            $newSelect.trigger('focus');
                        } else {
                            options.find('li.active').removeClass('active');
                            _this.addClass('active');
                            $newSelect.val(_this.text());

                            activateOption(options, _this, 'active');
                            $select.find('option').eq(i).prop('selected', true);
                        }

                        // Trigger onchange() event
                        $select.trigger('change');
                        if (angular.isDefined(callback)) {
                            callback();
                        }
                    }

                    e.stopPropagation();
                });
            });

            options.find('li.optgroup:not(.disabled)').has(':checkbox').each(function() {
                var _this = $(this);

                _this.on('click', function(e) {
                    var status = _this.find(':checkbox').is(':checked') ? true : false;

                    if (!_this.hasClass('disabled')) {
                        var children;

                        if (status) {
                            children = _this.nextUntil(options.find('li.optgroup'), 'li.active:not(.disabled)');
                        } else {
                            children = _this.nextUntil(options.find('li.optgroup'), 'li:not(.active, .disabled)');
                        }

                        children.each(function() {
                            var _this = $(this),
                                indexes = returnIndexes(_this);

                            toggleIndexFromArray(indexes.element, _this.index(), indexes.optgroup);
                            options.scrollTo(_this);
                            $('input[type="checkbox"]', _this[0]).prop('checked', function(i, v) {
                                return !v;
                            });
                        });
                    }

                    _this.toggleClass('active');
                    $('input[type="checkbox"]', _this[0]).prop('checked', function(i, v) {
                        return !v;
                    });
                    $newSelect.trigger('focus');
                    $select.trigger('change');

                    e.stopPropagation();
                });
            });

            // Wrap Elements
            $select.wrap(wrapper);
            // Add Select Display Element
            var dropdownIcon = $('<span class="caret">&#9660;</span>');
            if ($select.is(':disabled')) {
                dropdownIcon.addClass('disabled');
            }
            // escape double quotes
            var sanitizedLabelHtml = label.replace(/"/g, '&quot;').trim();

            var $newSelect = $('<input type="text" class="select-dropdown" readonly="readonly" ' + (($select.is(':disabled')) ? 'disabled' : '') +
                ' data-activates="select-options-' + uniqueID + '" value="' + sanitizedLabelHtml + '" ' + (required ? 'required' : '') + '/>');
            $select.before($newSelect);
            $newSelect.before(dropdownIcon);

            $newSelect.after(options);
            // Check if section element is disabled
            if (!$select.is(':disabled')) {
                $newSelect.dropdown({
                    'hover': false,
                    'closeOnClick': false
                });
            }

            // Copy tabindex
            if ($select.attr('tabindex')) {
                $($newSelect[0]).attr('tabindex', $select.attr('tabindex'));
            }

            $select.addClass('initialized');

            // Select change event - Update the select's values on the fly by passing new values from an array
            $select.on('update', function() {
                var selectedOptions = $select.find('option:selected:not(:disabled)').map(function() {
                    return $(this).parent().is(':disabled') ? null : $(this);
                });

                if (selectedOptions.length) {
                    if (multiple) {
                        resetOptions();

                        selectedOptions.each(function() {
                            var _this = $(this),
                                indexOption = _this.index();

                            if (optgroups) {
                                var indexes = returnIndexes(_this);

                                toggleIndexFromArray(indexOption, indexes.element, indexes.optgroup);
                                options.find('li').eq(indexes.element).find(':checkbox').prop('checked', true);
                                toggleActivationOptgroupParent(_this);
                            } else {
                                toggleIndexFromArray(indexOption);
                                options.find('li').eq(indexOption).find(':checkbox').prop('checked', true);
                            }
                        });
                    } else {
                        var index = $select.find('option:selected:not(:disabled)').index(),
                            newOption = options.find('li').eq(index);

                        options.find('li.active').removeClass('active');
                        newOption.addClass('active');
                        $newSelect.val(newOption.text());

                        activateOption(options, newOption, 'active');
                    }
                } else {
                    if (multiple && optgroups) {
                        resetOptions();
                        setValueToInput(optgroupValuesSelected);
                    }
                }

                $select.trigger('change');
            });

            // Input events
            $newSelect.on({
                'focus': function() {
                    if ($('ul.select-dropdown').not(options[0]).is(':visible')) {
                        $('input.select-dropdown').trigger('close');
                    }

                    if (!options.is(':visible')) {
                        $(this).trigger('open', ['focus']);

                        if (!multiple) {
                            var selectedOption = options.find('li[data-value="' + $select.find('option:not(:disabled):selected').val() + '"]')[0];
                            activateOption(options, selectedOption, 'active');
                        }
                    }
                },
                'click': function(e) {
                    e.stopPropagation();
                },
                'blur': function() {
                    if (!multiple) {
                        $(this).trigger('close');
                        options.find('li.active:not(.disabled)').removeClass('active');
                    }
                }
            });

            options.hover(function() {
                optionsHover = true;
            }, function() {
                optionsHover = false;
            });

            $(window).on({
                'click': function() {
                    multiple && (optionsHover || $newSelect.trigger('close'));
                }
            });

            // Add initial multiple selections
            if (multiple) {
                var selectedOptions = $select.find('option:selected:not(:disabled)').map(function() {
                    return $(this).parent().is(':disabled') ? null : $(this);
                });

                selectedOptions.each(function() {
                    var _this = $(this),
                        indexOption = _this.index();

                    if (optgroups) {
                        var indexes = returnIndexes(_this);

                        toggleIndexFromArray(indexOption, indexes.element, indexes.optgroup);
                        options.find('li').eq(indexes.element).find(':checkbox').prop('checked', true);
                        toggleActivationOptgroupParent(_this);
                    } else {
                        toggleIndexFromArray(indexOption);
                        options.find('li').eq(indexOption).find(':checkbox').prop('checked', true);
                    }

                    options.scrollTo(_this);
                });
            }

            // Make option as active or selected and scroll to its position
            var activateOption = function(collection, newOption, _class) {
                if (newOption) {
                    collection.find('li.' + _class).removeClass(_class);

                    var option = $(newOption);
                    option.addClass(_class);
                    options.scrollTo(option);
                }
            };

            // Resets the dropdown with no options activated
            var resetOptions = function() {
                if (multiple && optgroups) {
                    optgroupValuesSelected.length = 0;

                    for (var i = 0, count = optionsValuesSelected.length; i < count; i++) {
                        optionsValuesSelected[i].length = 0;
                    }
                } else {
                    optionsValuesSelected.length = 0;
                }

                options.find('li.active:not(.disabled)').removeClass('active');
                options.find(':checkbox').prop('checked', false);
            };

            // Allow user to search by typing
            // this array is cleared after 1 second
            var filterQuery = [],
                onKeyDown = function(e) {
                    // TAB - switch to another input
                    if (e.which === 9) {
                        $newSelect.trigger('close');
                        return;
                    }

                    // ARROW DOWN WHEN SELECT IS CLOSED - open select options
                    if (e.which === 40 && !options.is(':visible')) {
                        $newSelect.trigger('open');
                        return;
                    }

                    // ENTER WHEN SELECT IS CLOSED - submit form
                    if (e.which === 13 && !options.is(':visible')) {
                        return;
                    }

                    e.preventDefault();
                    var newOption = null;

                    // CASE WHEN USER TYPE LETTERS
                    var letter = String.fromCharCode(e.which).toLowerCase(),
                        nonLetters = [9, 13, 27, 38, 40];

                    if (letter && (nonLetters.indexOf(e.which) === -1)) {
                        filterQuery.push(letter);

                        var string = filterQuery.join('');
                        newOption = options.find('li').filter(function() {
                            return $(this).text().toLowerCase().indexOf(string) === 0;
                        })[0];

                        if (newOption) {
                            activateOption(options, newOption, 'selected');
                        }
                    }

                    // ENTER - select option and close when select options are opened
                    if (e.which === 13) {
                        var activeOption = options.find('li.selected:not(.disabled)')[0];

                        if (activeOption) {
                            $(activeOption).trigger('click');
                            if (!multiple) {
                                $newSelect.trigger('close');
                            }
                        }
                    }

                    // ARROW DOWN - move to next not disabled option
                    if (e.which === 40) {
                        if (options.find('li.selected').length) {
                            newOption = options.find('li.selected').next('li');
                        } else {
                            newOption = options.find('li:not(.disabled)');
                        }

                        newOption = newOption[0];

                        if (newOption) {
                            activateOption(options, newOption, 'selected');
                        }
                    }

                    // ESC - close options
                    if (e.which === 27) {
                        $newSelect.trigger('close');
                    }

                    // ARROW UP - move to previous not disabled option
                    if (e.which === 38) {
                        newOption = options.find('li.selected').prev('li')[0];

                        if (newOption) {
                            activateOption(options, newOption, 'selected');
                        }
                    }

                    // Automatically clean filter query so user can search again by starting letters
                    setTimeout(function() {
                        filterQuery = [];
                    }, 1000);
                };

            $newSelect.on('keydown', onKeyDown);

            /* Functions */

            // Updates from optionsValuesSelected to match active dropdown items to the selected select options
            function toggleIndexFromArray(indexOption, indexLi, indexOptgroup) {
                var index, notAdded;

                if (multiple && optgroups) {
                    var value = $select.find('optgroup').eq(indexOptgroup).find('option').eq(indexOption).text();

                    index = optionsValuesSelected[indexOptgroup].indexOf(indexOption);
                    notAdded = index === -1;

                    if (notAdded) {
                        optionsValuesSelected[indexOptgroup].push(indexOption);
                        optgroupValuesSelected.push(value);
                    } else {
                        var indexInArray = optgroupValuesSelected.indexOf(value);

                        optionsValuesSelected[indexOptgroup].splice(index, 1);
                        optgroupValuesSelected.splice(indexInArray, 1);
                    }

                    options.find('li').eq(indexLi).toggleClass('active');
                    $select.find('optgroup').eq(indexOptgroup).find('option').eq(indexOption).prop('selected', notAdded);
                    setValueToInput(optgroupValuesSelected);
                } else {
                    index = optionsValuesSelected.indexOf(indexOption);
                    notAdded = index === -1;

                    var value = options.find('li').eq(indexOption).attr('data-value');
                    if(value === 'ALL'){
                        if(notAdded){
                            for (var i = 0, count =  options.find('li').length; i < count; i++) {
                                var indexResult = optionsValuesSelected.indexOf(i);
                                var notPresent = indexResult === -1;
                                if(notPresent){
                                    optionsValuesSelected.push(i);
                                    options.find('li').eq(i).toggleClass('active');
                                    if(i!=0){
                                        options.find(':checkbox').eq(i).prop('checked', true);
                                        $select.find('option').eq(i).prop('selected', true);
                                    }
                                }
                            }
                        }else{
                            for (var i = 0, count =  options.find('li').length; i < count; i++) {
                                if (i != 0) {
                                    options.find(':checkbox').eq(i).prop('checked', false);
                                    $select.find('option').eq(i).prop('selected', false);
                                }
                            }
                            optionsValuesSelected.length = 0;
                            options.find('li.active:not(.disabled)').removeClass('active');
                        }
                    }else{
                        if (notAdded) {
                            optionsValuesSelected.push(indexOption);
                            var firstValue = options.find('li').eq(0).attr('data-value');
                            if(firstValue === 'ALL'){
                                var allPresent = true;
                                for (var i = 1, count =  options.find('li').length; i < count && allPresent; i++) {
                                    var indexResult = optionsValuesSelected.indexOf(i);
                                    allPresent = indexResult != -1;
                                }
                                if(allPresent){
                                    options.find(':checkbox').eq(0).prop('checked', true);
                                    options.find('li').eq(0).toggleClass('active');
                                    optionsValuesSelected.push(0);
                                }
                            }
                        } else {
                            optionsValuesSelected.splice(index, 1);
                            var firstValue = options.find('li').eq(0).attr('data-value');
                            if(firstValue === 'ALL'){
                                var indexResult = optionsValuesSelected.indexOf(0);
                                var present = indexResult != -1;
                                if(present){
                                    options.find(':checkbox').eq(0).prop('checked', false);
                                    options.find('li').eq(0).toggleClass('active');
                                    optionsValuesSelected.splice(optionsValuesSelected.indexOf(0), 1);
                                }
                            }
                        }
                        options.find('li').eq(indexOption).toggleClass('active');
                        $select.find('option').eq(indexOption).prop('selected', notAdded);
                    }

                    generatesValuesArray();
                }
            }

            // Returns indexes used for toggleIndexFromArray
            function returnIndexes(_this) {
                var indexes = {},
                    text = _this.val() || _this.data('value'),
                    selectedElement;

                if (_this.is('li')) {
                    selectedElement = $select.find('option:not(:disabled)[value="' + text + '"]');
                } else {
                    selectedElement = options.find('li:not(.disabled)[data-value="' + text + '"]');
                }

                var indexElement = selectedElement.index(),
                    disabledPrevOptions = $select.find('> option:disabled'),
                    indexOptgroup;

                if (_this.is('li')) {
                    indexOptgroup = selectedElement.parent().index();
                } else {
                    indexOptgroup = _this.parent().index();
                }

                for (var i = 0, count = disabledPrevOptions.length; i < count; i++) {
                    indexOptgroup--;
                }

                indexes.element = indexElement;
                indexes.optgroup = indexOptgroup;

                return indexes;
            }

            // Creates an array with the values to display
            function generatesValuesArray() {
                var arrayValues = [];

                for (var i = 0, count = optionsValuesSelected.length; i < count; i++) {
                    var text = $select.find('option').eq(optionsValuesSelected[i]).text().trim();
                    var value = $select.find('option').eq(optionsValuesSelected[i]).attr('value');
                    if(value !='ALL'){
                        arrayValues.push(text);
                    }
                }

                setValueToInput(arrayValues);
            }

            // Updates the value in the dropdown input (Option 1, Option 2, ...)
            function setValueToInput(array) {
                sortArrayValues(array);
                var value = array.join(', ');

                if (!value) {
                    value = $select.find('option:disabled').eq(0).text() || '';
                }

                $newSelect.val(value);
            }

            // Toggle activation of the optgroup's checkbox parent
            function toggleActivationOptgroupParent(child) {
                var liTagName = child[0].tagName === 'LI',
                    checkForActiveClass = [],
                    children, prevOptgroup, convertElement;

                if (liTagName) {
                    children = child.prevUntil('li.optgroup', 'li:not(.disabled)').add(child.nextUntil('li.optgroup', 'li:not(.disabled)')).add(child);
                    prevOptgroup = child.prevAll('li.optgroup').eq(0);
                } else {
                    children = child.prevUntil('optgroup', 'option:not(:disabled)').add(child.nextUntil('optgroup', 'option:not(:disabled)')).add(child);
                    prevOptgroup = child.parent();
                }

                // For each li in optgroup, check the active class and fill the array
                for (var i = 0, count = children.length; i < count; i++) {
                    var element = $(children[i]);

                    if (liTagName) {
                        if (element.hasClass('active')) {
                            checkForActiveClass.push(true);
                        } else {
                            checkForActiveClass.push(false);
                        }
                    } else {
                        convertElement = options.find('li:not(:disabled)[data-value="' + element.val() + '"]');

                        i === 0 ? prevOptgroup = convertElement.prevAll('li.optgroup').eq(0) : '';

                        if (element.is(':selected') || convertElement.hasClass('active')) {
                            checkForActiveClass.push(true);
                        } else {
                            checkForActiveClass.push(false);
                        }
                    }
                }

                var oneChildIsNotSelected = checkForActiveClass.indexOf(false) > -1;

                if (oneChildIsNotSelected) {
                    prevOptgroup.find(':checkbox').prop('checked', false);
                    prevOptgroup.removeClass('active');
                } else {
                    prevOptgroup.find(':checkbox').prop('checked', true);
                    prevOptgroup.addClass('active');
                }
            }

            // Sorts the values from the array in alphabetical order
            function sortArrayValues(array) {
                array.sort(function(a, b) {
                    var x = a.toLowerCase(),
                        y = b.toLowerCase();

                    return x < y ? -1 : x > y ? 1 : 0;
                });
            }
        });
    };
}( jQuery ));