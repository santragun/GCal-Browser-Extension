function enableSuggestions() {
    $("#opportunity").click(function () {
        handleFieldClick($("#opportunity").val(), 'opportunity');
    });
    $("#activity").click(function () {
        handleFieldClick($("#activity").val(), 'activity');
    });
    $("#demo").click(function () {
        handleFieldClick($("#demo").val(), 'demo');
    });


    $("#opportunity").keyup(function () {
        showSuggestionResults($("#opportunity").val(), 'opportunity');
    });
    $("#activity").keyup(function () {
        showSuggestionResults($("#activity").val(), 'activity');
    });
    $("#demo").keyup(function () {
        showSuggestionResults($("#demo").val(), 'demo');
    });

}
function handleFieldClick(val, field) {
    if ($("#" + field + "-suggestion").is(":visible")) {
        $("#" + field + "-suggestion").hide();
    }
    else {
        showSuggestionResults($("#" + field).val(), field);
        // $(element).is(":hidden");
    }



}
function showSuggestionResults(val, field) {
    try {
        let elementsWidth = $("#" + field).width();
        let elementsPosition = $("#" + field + "-suggestion").offset();
        $("#" + field + "-suggestion").show();

        $("#" + field + "-suggestion").width(elementsWidth);
        // $("#" + field + "-suggestion").css({top: elementsPosition.top});
        let list = '';

        let suggestions = autocompleteMatch(suggestionData[field], val);
        if (suggestions.length == 0) {
            list += '<li class="suggestion-list">No ' + field + ' result found!</li>';
        }
        for (i = 0; i < suggestions.length; i++) {
            list += '<li class="suggestion-list">' + suggestions[i] + '</li>';
        }

        $("#" + field + "-suggestion").html('<ul>' + list + '</ul>');
        $('.suggestion-list').width(elementsWidth);

        $(".suggestion-list").unbind('click.suggestionNamespace').bind('click.suggestionNamespace', function (event) {
            if (event.target.innerText != 'No ' + field + ' result found!') {
                $("#" + field).val(event.target.innerText);
            }
            $("#" + field + "-suggestion").hide();
        });

        $("#" + field).unbind('blur.blurNamespace').bind('blur.blurNamespace', function () {
            if (!$("#" + field + "-suggestion").is(":hover")) {
                $("#" + field + "-suggestion").hide();
            }
        });
    } catch (e) {
        // console.log(e)
    }
    finally {
        //code for finally block
    }
}
function injectSalesforceInputFields() {
    waitForElm(createWindowClass).then((createWindow) => {

       
        waitForElm(popupWindowBodyClass).then((popupWindow) => {
            let innerBody = $(popupWindow).children()[2];
            let innerBodyChildren = $(innerBody).children();

            for (let i = 0; i < $(innerBodyChildren).children().length; i++) {
                if ($(innerBodyChildren).children()[i].id == 'tabEvent') {
                    appendButton($(innerBodyChildren).children()[i], 'minimized window');
                    break;
                }
            }
        });

    });
}


function appendButton(element, caller) {
    // console.log('GCAL =>  Append Button to Little Event Creation Window');


    if (caller == 'detailed window') {
        let opportunityHTML = newElement('Add salesforce opportunity', 'opportunity');
        let activityHTML = newElement('Add salesforce activity', 'activity');
        let demoHTML = newElement('Add salesforce demo', 'demo');

        waitForElm('div.j3nyw.GtKErc').then((notificationElement) => {
            let extendedFields = document.createElement('div');
            extendedFields.innerHTML = newElementForDetailedWindow(opportunityHTML, activityHTML, demoHTML).trim();
            notificationElement.appendChild(extendedFields);

            enableSuggestions();
        });
    }
    else if (caller == 'minimized window') {
        let alreadyInjected = false;
        $('#tabEvent').children().filter(function () {
            if (this.innerHTML.includes(opportunityBtn)
                || this.innerHTML.includes(activityBtn)
                || this.innerHTML.includes(demoBtn)) {
                alreadyInjected = true;
            }
        });
        if (!alreadyInjected) {
            let opportunityHTML = newElement('Add esforce pportunity', 'opportunity');
            let activityHTML = newElement('Add salesforce activity', 'activity');
            let demoHTML = newElement('Add salesforce demo', 'demo');

            let opportunityField = document.createElement('div');
            let activityField = document.createElement('div');
            let demoField = document.createElement('div');

            opportunityField.innerHTML = opportunityHTML.trim();
            activityField.innerHTML = activityHTML.trim();
            demoField.innerHTML = demoHTML.trim();

            element.appendChild(opportunityField);
            element.appendChild(activityField);
            element.appendChild(demoField);
            enableSuggestions();
        }
    }
    handleButtonClicks(caller);
}


function handleButtonClicks(caller) {
    if (caller == 'minimized window') {

        waitForElm(popupWindowButtonsClass).then((popupWindowButtons) => {
            let moreOptionsButton = $($(popupWindowButtons).children()).children()[0];
            saveButton = $($(popupWindowButtons).children()).children()[3];

            $(moreOptionsButton).unbind('click.moreOptionsNamespace').bind('click.moreOptionsNamespace', function (event) {
                console.log('GCAL => More options Clicked ');
                waitForElm(detailedWindowClass).then((notificationElement) => {
                    return appendButton(notificationElement, 'detailed window');
                });
            });

            $(saveButton).unbind('click.saveNamespace').bind('click.saveNamespace', function (event) {
                let innerBody = $(popupWindowBodyClass).children()[2];
                let innerBodyChildren = $(innerBody).children();

                if ($(innerBodyChildren).children()[0].className == activeTabClassOne || $(innerBodyChildren).children()[0].className == activeTabClassTwo) {

                    console.log('GCAL => Save Clicked');
                    checkConfirmationWindow('little window');
                }
                else {
                    return injectUI();
                }
            });
        });
    }
    else if (caller == 'detailed window') {
        waitForElm(moreOptionsContainerClass).then((moreOptionsContainer) => {

            let moreOptionsSaveButton = $($(moreOptionsContainer).children()[1]).children()[2];
            $(moreOptionsSaveButton).unbind('click.closeNamespace').bind('click.closeNamespace', function (event) {
                console.log('GCAL => more options save clicked');
                checkConfirmationWindow('detailed window');
            });
        });
    }
}
