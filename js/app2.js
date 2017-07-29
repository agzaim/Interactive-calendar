$(function() {



    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //            SUPPORT OBJECTS AND VARIABLES
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


    // the number of days per month
    var monthsAndDays = {
        January: 31,
        February: 28,
        March: 31,
        April: 30,
        May: 31,
        June: 30,
        July: 31,
        August: 31,
        September: 30,
        October: 31,
        November: 30,
        December: 31
    }


    // names of weekdays and theirs position in the week
    var daysNames = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3, 
        Thursday: 4,
        Friday: 5, 
        Saturday: 6, 
        Sunday: 7
    }

    var monthsNamesList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var firstDayOfMnthPosition = 0;
    var positionOfCurrentDay = 0;
    var numberOfDays = 0;



    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //                     FUNCTIONS
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



    if (localStorage.getItem("json") == null) {
        var json = [
        ];
    } else {
        var json = JSON.parse(localStorage.getItem("json"));
    }


    function showingHelpBox () {

        // showing helpBox after clicking on the help icon
        $("#helpIcon").on("click", function () {
            $(".helpBox").addClass("animated").removeClass("backAnimated");
            

            //        if($(".helpBox").hasClass("animated")) {
            //            $(".helpBox").removeClass("animated").addClass("backAnimated");
            //        } else {
            //      $(".helpBox").addClass("animated").removeClass("backAnimated");
            //        }
        });


        
        $(".helpBoxExitBtn").on("mouseenter mouseleave", function() {
            $(this).toggleClass("hoverBtn");
        });


        
        // hiding helpBox after clicking on the exit button
        $(".helpBoxExitBtn").on("click", function() { 
            $(".helpBox").addClass("backAnimated").removeClass("animated");
        });

    }



    showingHelpBox();



    //        $(".helpBox").prepend("<i class='fa fa-times exitBtn' aria-hidden='true''></i>");
    //        if $(".helpBox:animated") 
    //        $(".helpBox p").text("vfdhgfbnhfx fgnjfgbfdz njfxgcbnxfg");
    /*
    $("#helpIcon").on("click", function() {

            $(".helpBoxContainer").show().animate({opacity:1,top:"169px",left:"222px"},500);
    });
    */


    /*   $("#helpIcon").on("click", function() {
        $(".helpBoxContainer").toggle(300, function() {
            $(".helpBox").show(500, {queue: false}); 

            $(".helpBoxContainer").animate({top: "169px", left: "222px"}, 500, {queue: false});
        });
    });
*/




    // **********************************************************
    // searching the POSITION of the FIRST DAY of a current month
    // **********************************************************

    function beginingOfMonth (currentDay, currentDayName) {
        $.each(daysNames, function(key, value) { 
            if (key == currentDayName) {
                positionOfCurrentDay = value;
            }
        });

        var supportValue = positionOfCurrentDay - (currentDay - 1);

        if (positionOfCurrentDay < currentDay) {
            firstDayOfMnthPosition = 7 + supportValue % 7;
        } else {
            firstDayOfMnthPosition = supportValue;
        }
    }


    // **********************************************************
    // BUILDING a calendar 
    // **********************************************************

    function makingCalendar (currentMonth, currentYear) {


        // finding the number of days of a current month
        $.each(monthsAndDays, function(key, value) { 
            if (key == currentMonth) {
                numberOfDays = value;
            }

            // the number of days of February in an leap year
            if (currentMonth == "February") {
                if ((currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0) {
                    numberOfDays = 29;
                }
            }

        });

        // putting month name and the year to the calendar table
        $(".mthsName").text(currentMonth + " " + currentYear);

        var calendarTable = $(".calendarBox");
        var dayOfMnth = 1;

        for (var i = 1; i <= 42; i++) {


            // fill out the cells with the numbers
            if (dayOfMnth <= numberOfDays && i >= firstDayOfMnthPosition) {

                // creating the areas with days' numbers and putting them into the calendar
                var calendarCell = $("#" + i);
                var numberCell = $("<p class='dayNumber'></p>");
                numberCell.text(dayOfMnth).appendTo(calendarCell);
                numberCell.after("<p class='dropArea' id='" + i*100 + "'></p>");


                if (calendarCell.index() == 6) {
                    calendarCell.addClass("sunday");
                }


                // painting the current day's cell
                if (dayOfMnth == day) {
                    if (currentMonth == month) {
                        if (currentYear == year) {
                            calendarCell.addClass("today");
                        }
                    }
                }


                dayOfMnth ++;
            }
        }


        dragAndDrop();  
        archivedActivities();

    }


    // **********************************************************
    // making the icons DRAGGABLE and calendar boxes DROPPABLE
    // **********************************************************

    function dragAndDrop() {

        $(".activitiesContainer div.icon").draggable({
            helper: "clone"
        });

        $(".dayBox").droppable({
            drop: function (event, ui) {
                var activity = $(ui.draggable).data("activity");
                var dropBox = $(this).find(".dropArea").attr("id");
                var iconClone = $('<div class="icon icon-clone" data-activity="' + activity + '"></div>');
                var inputBox = $('<input type="text" placeholder="Add description" maxlength="41"/>');
                var tooltipBox = $('<span class="tooltip"></span>');


                if ($(this).find(".dropArea").children().length < 6) {
                    $("#" + dropBox).append(iconClone);
                    iconClone.append(inputBox).append(tooltipBox);
                    inputBox.focus();
                } 


                inputBox.on("keydown", function(e) {
                    var key = e.which;
                    if(key == 13) {
                        inputBox.css("display", "none");
                        tooltipBox.text(inputBox.val());

                        // setting data to localStorage
                        var event = {
                            eventMonthAndYear: $(".mthsName").text(),
                            boxId: dropBox,
                            description: $(this).val(),
                            eventIcon: activity
                        }

                        json.push(event);
                        localStorage.setItem("json", JSON.stringify(json));   
                    }
                });
            }
        });
    }


    // **********************************************************
    // getting and putting into calendar ARCHIVED activities
    // **********************************************************

    function archivedActivities() {

        //        console.log(JSON.stringify(json));
        $.each(json, function(index, value) {

            if (value.eventMonthAndYear == $(".mthsName").text()) {

                var dropBox = value.boxId;
                var iconClone = $('<div class="icon icon-clone" data-activity="' + value.eventIcon + '"></div>');
                var tooltipBox = $('<span class="tooltip"></span>');
                tooltipBox.text(value.description);

                iconClone.append(tooltipBox);
                $("#" + dropBox).append(iconClone);  
            }
        });
    }


    // **********************************************************
    // showing the INFO BOX
    // **********************************************************

    $(".dayBox").on("click", function () {

        if ($(this).children().length > 0) {
            $(".infoBox").css("display", "block").children().empty();
            $(".infoBox").find("h2").removeClass();
        }

        var pickingDay = $(this).children(".dayNumber").text();
        var pickingDayIndex = $(this).index();
        var pickingDayName = 0;
        var pickingDayId = $(this).attr("id"); 

        $(".infoBox").find("h2").text(pickingDay).data("id", pickingDayId); // for easier finding right  dayBox for editing and deleting activities

        if ($(this).hasClass("today")) {
            $(".infoBox").find("h2").addClass("today");
        } 

        if ($(this).hasClass("sunday")) {
            $(".infoBox").find("h2").addClass("sunday");
        }


        $.each(daysNames, function(key, value) { 
            if (value == pickingDayIndex + 1) {
                pickingDayName = key;
            }
        });

        $(".infoBox").find("h3").text(pickingDayName);

        $(this).children(".dropArea").find(".icon").each(function(index, value){
            var iconActivity = $(this).data("activity");
            var iconDescription = $(this).find("span").text();
            var infoBoxLi = $("<li>");
            infoBoxLi.html('<div class="icon infoBoxIcon" data-activity="' + iconActivity + '"></div><span>' + iconDescription + '</span>');  
            var editIcon = $('<i class="fa fa-pencil editButton" aria-hidden="true"></i>');
            var deleteIcon = $('<i class="fa fa-trash-o deleteButton" aria-hidden="true"></i>');
            infoBoxLi.append(editIcon).append(deleteIcon);
            $(".infoBox").find("ul").append(infoBoxLi);

        });


        editActivity();
        deleteActivity();
    });


    // **********************************************************
    // adding the funcionality to the EDIT BUTTON
    // **********************************************************

    function editActivity () {
        // adding some magic to btn on hover event (css selector doesn't work)
        $(".infoBox ul").find("li").on("mouseenter mouseleave", ".editButton", function() {
            $(this).toggleClass("fa-lg hoverBtn");
        });

        // editing icon description
        $(".infoBox ul").find("li").on("click", ".editButton", function() {
            $(this).toggleClass("editBtnActive");

            if ($(this).hasClass("editBtnActive")) {

                oldDescription = $(this).prev().text();
                $(this).prev().attr("contenteditable", "true").focus();
                $(this).removeClass("fa-pencil").addClass("fa-check");

            } else {

                $(this).prev().attr("contenteditable", "false");
                $(this).removeClass("fa-check").addClass("fa-pencil");

                // changing description in tooltip
                var newDescription = $(this).prev().text();
                var editingIcon = $(this).siblings("div.icon").data("activity");
                var dayBoxId = $(".infoBox").find("h2").data("id"); // in relation to line 228

                $("#" + dayBoxId).find(".dropArea").children(".icon").each(function(index, value) {
                    if ($(this).data("activity") == editingIcon) {
                        if ($(this).find("span").text() == oldDescription) {
                            $(this).find("span").text(newDescription);
                        }
                    }
                });

                var dropBoxId = $("#" + dayBoxId).find(".dropArea").attr("id");

                // updating data in localStorage 
                for (var i = 0; i < json.length; i++) {
                    if (json[i].boxId == dropBoxId) {
                        if  (json[i].eventIcon == editingIcon) {
                            if  (json[i].eventMonthAndYear == $(".mthsName").text()) {
                                if (json[i].description == oldDescription) {
                                    json[i].description = newDescription;
                                    localStorage.setItem("json", JSON.stringify(json)); 
                                    return;
                                }
                            }
                        }
                    }                  
                }
            }
        });
    }


    // **********************************************************
    // adding the funcionalities to the DELETE BUTTON
    // **********************************************************

    function deleteActivity () {

        // adding some magic to btn on hover event (css selector doesn't work)
        $(".infoBox ul").find("li").on("mouseenter mouseleave", ".deleteButton", function() {
            $(this).toggleClass("fa-lg hoverBtn");
        });

        // deleting an icon
        $(".infoBox ul").find("li").on("click", ".deleteButton", function() {

            // deleting an icon from infoBox
            $(this).parent().remove();

            // deleting an icon from dayBox in calendar 
            var deletedActivityDescription = $(this).parent().find("span").text();
            var deletingIcon = $(this).siblings("div.icon").data("activity");
            var dayBoxId = $(".infoBox").find("h2").data("id"); // in relation to line 228
            $("#" + dayBoxId).find(".dropArea").children(".icon").each(function(index, value) {
                if ($(this).data("activity") == deletingIcon) {
                    if ($(this).find("span").text() == deletedActivityDescription) {
                        $(this).remove();
                    }
                }
            });

            // updating data in localStorage 
            var dropBoxId = $("#" + dayBoxId).find(".dropArea").attr("id");

            for (var i = 0; i < json.length; i++) {
                if (json[i].boxId == dropBoxId) {
                    if  (json[i].eventIcon == deletingIcon) {
                        if  (json[i].eventMonthAndYear == $(".mthsName").text()) {
                            if (json[i].description == deletedActivityDescription) {
                                json.splice(i, 1);
                                localStorage.setItem("json", JSON.stringify(json)); 
                                return;
                            }
                        }
                    }
                }                  
            }
        });
    }


    // **********************************************************
    // closing the INFO BOX
    // **********************************************************

    function closingInfoBox () {
        // adding some magic to btn on hover event (css selector doesn't work)
        $(".exitBtn").on("mouseenter mouseleave", function() {
            $(this).toggleClass("hoverBtn");
        });

        // closing infoBox by clicking on "x"
        $(".exitBtn").on("click", function() {
            $(".infoBox").css("display", "none");
        });

        //closing infoBox by clicking somewhere on the page
        $("body").on("click", function(e) {    
            if ($(".infoBox").is(":visible")) {

                // except infoBox
                if($(e.target).hasClass("infoBox") || $(e.target).hasClass("deleteButton")) {
                    return;
                }

                // and except the descendants of calendar and infoBox
                if($(e.target).closest(".calendarBox").length || $(e.target).closest(".infoBox").length) {
                    return; 
                }

                $(".infoBox").css("display", "none");
            }
        })
    }

    closingInfoBox();


    // **********************************************************
    // adding the funcionality to the RIGHT ARROW
    // **********************************************************

    $(".arrow-right").on("click", function () {

        // searching the position of 1st day of next month
        firstDayOfMnthPosition = $("#" + (firstDayOfMnthPosition + numberOfDays)).index() + 1;


        // searching the next month name
        var currentMnth = $(".mthsName").text().split(' ')[0];
        var nextMnth = monthsNamesList[monthsNamesList.indexOf(currentMnth) + 1];


        // searching the year of next month
        var currentYearString = $(".mthsName").text().split(' ')[1];
        var nextMnthYear = parseInt(currentYearString);


        if (currentMnth == "December") {

            nextMnth = monthsNamesList[0];
            nextMnthYear += 1;
        } 


        removingMonth();

        makingCalendar(nextMnth, nextMnthYear);

    });


    // **********************************************************
    // adding the funcionality to the LEFT ARROW
    // **********************************************************

    $(".arrow-left").on("click", function () {

        // searching the previous month name
        var currentMnth = $(".mthsName").text().split(' ')[0];
        var prevMnth = monthsNamesList[monthsNamesList.indexOf(currentMnth) - 1];

        // searching the year of previous month
        var currentYearString = $(".mthsName").text().split(' ')[1];
        var prevMnthYear = parseInt(currentYearString);


        if (currentMnth == "January") {

            prevMnth = monthsNamesList[11];
            prevMnthYear -= 1;
        } 

        // serching the number of days in previous month
        var numberOfDaysInPrevMnth = 0;
        $.each(monthsAndDays, function(key, value) { 
            if (key == prevMnth) {
                numberOfDaysInPrevMnth = value;
            }
        });

        if (prevMnth == "February") {
            if ((prevMnthYear % 4 == 0 && prevMnthYear % 100 != 0) || prevMnthYear % 400 == 0) {
                numberOfDaysInPrevMnth = 29;
            }
        }


        // searching the position and name of last day of previous month
        var lastDayOfPrevMnthPosition = firstDayOfMnthPosition - 1;
        if (firstDayOfMnthPosition == 1) {
            lastDayOfPrevMnthPosition = 7;
        }

        var lastDayOfPrevMnthName = 0;
        $.each(daysNames, function(key, value) { 
            if (value == lastDayOfPrevMnthPosition) {
                lastDayOfPrevMnthName = key;
            }
        });

        removingMonth();

        beginingOfMonth(numberOfDaysInPrevMnth, lastDayOfPrevMnthName);

        makingCalendar(prevMnth, prevMnthYear);

    });


    // **********************************************************
    // REMOVING current month from the calendar
    // **********************************************************

    function removingMonth () {
        $(".mthsName").empty();
        $(".dayBox").empty().removeClass("today");
    }


    // **********************************************************
    // adding the funcionality to the CLEAR BUTTON
    // **********************************************************

    $("#clear").on("click", function() {
        var json = [
        ];
        localStorage.setItem("json", JSON.stringify(json));

        $(".dropArea").empty();
    });


    // *************************************************************
    // getting current date from API by AJAX and placing current calendar on the website
    // *************************************************************

    function loadCalendar() {

        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec?tz=Poland",
            dataType: 'json'

        }).done(function(response){                    
            month = response.monthName;
            day = response.day;
            year = response.year;
            dayName = response.dayofweekName;
            beginingOfMonth(day, dayName);
            makingCalendar(month, year);
        }).fail(function(error) {
            console.log(error);
        });
    }


    loadCalendar();


});



