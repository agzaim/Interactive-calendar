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



    if(localStorage.getItem('items') == null){
        var json = {
            items:[
                [

                ]
            ]
        };
    } else {
        var json = JSON.parse(localStorage.getItem('items'));
    }



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

    function makingCalendar (currentDay, currentMonth, currentYear) {


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

        /*
        for (var i = 1; i <= 6; i++) {
            // creating weeks and putting them into the calendar
            var newWeek = $("<tr></tr>");
            newWeek.appendTo(calendarTable);

            for (var j = 1; j <= 7; j++) {

                // creating table cells and putting them into the calendar
                var tableCell = $("<td></td>");
                newWeek.append(tableCell);


                //painting the current day cell
                if (dayOfMnth == currentDay) {
                    tableCell.addClass("today");
                }


                // fill out the cells with the numbers
                if (dayOfMnth <= numberOfDays && (j >= firstDayOfMnthPosition || i > 1))  {

                    // creating the areas with days' numbers and putting them into the calendar
                    var newDay = $("<p class='dayNumber'></p>");
                    newDay.text(dayOfMnth).appendTo(tableCell);

                    //creating the dropping areas in every day cell
                    newDay.after("<p class='droppingArea' ondrop='drop(event)' ondragover='allowDrop(event)'></p>");

                    dayOfMnth ++;
                } 
            }
        }
        */

        for (var i = 1; i <= 42; i++) {


            // fill out the cells with the numbers
            if (dayOfMnth <= numberOfDays && i >= firstDayOfMnthPosition) {

                // creating the areas with days' numbers and putting them into the calendar
                var calendarCell = $("#" + i);
                var numberCell = $("<p class='dayNumber'></p>");
                numberCell.text(dayOfMnth).appendTo(calendarCell);

                // creating the dropping areas in every day cell
                //                var dropArea = $("<p class='dropArea'></p>");
                //                dropArea.droppable().insertAfter(numberCell);
                numberCell.after("<p class='dropArea' id='" + i*100 + "'></p>");

                // painting the current day's cell
                if (dayOfMnth == currentDay) {
                    calendarCell.addClass("today");
                }

                dayOfMnth ++;
            }
        }


        dragAndDrop();  

    }


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


        calendarCleaning();

        makingCalendar(0, nextMnth, nextMnthYear);

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

        calendarCleaning();

        beginingOfMonth(numberOfDaysInPrevMnth, lastDayOfPrevMnthName);

        makingCalendar(0, prevMnth, prevMnthYear);

    });


    // **********************************************************
    // REMOVING current month from the calendar
    // **********************************************************

    function calendarCleaning () {
        $(".mthsName").empty();
        $(".dayBox").empty().removeClass("today");
    }
    
    
    // **********************************************************
    // making the icons DRAGGABLE and calendar boxes DROPPABLE
    // **********************************************************

    function dragAndDrop() {

        $("div.icon").draggable({
            helper: "clone"
        });

        $(".dropArea").droppable({
            drop: function (event, ui) {
                var activity = $(ui.draggable).data("activity");
                var dropBox = $(this).attr("id");
                var iconClone = $('<div class="icon icon-clone" data-activity="' + activity + '"></div>');
                var inputBox = $('<input type="text" placeholder="Add description" class="' + activity + '"/>');
                var tooltipBox = $('<span class="tooltip"></span>');


                $("#" + dropBox).append(iconClone);
                iconClone.append(inputBox).append(tooltipBox);
                inputBox.focus();


                inputBox.on("keydown", function(e) {
                    var key = e.which;
                    if(key == 13) {
                        inputBox.css("display", "none");
                        tooltipBox.text(inputBox.val());

                        var event = {
                            boxId: dropBox,
                            eventDay: $(this).parent().parent().prev().text(),
                            eventMonthAndYear: $(".mthsName").text(),
                            dayIndex: $(this).parent().parent().parent().index(),
                            description: $(this).val(),
                            eventIcon: activity
                        }
                        json.items[0].push(event);
                        localStorage.setItem("items", JSON.stringify(json));
                        //                        console.log(JSON.stringify(json));
                    }
                })

            }
        });
    }


    // **********************************************************
    // showing the INFO BOX
    // **********************************************************

    $(".dayBox").on("click", function () {

        $(".infoBox").css("display", "block").children().empty();

        var pickingDay = $(this).children(".dayNumber").text();
        var pickingDayIndex = $(this).index();
        var pickingDayName = 0;
        var pickingDayId = $(this).attr("id"); // for easier finding right  dayBox for deleting and editing activities

        $(".infoBox").find("h2").text(pickingDay).data("id", pickingDayId);
        $.each(daysNames, function(key, value) { 
            if (value == pickingDayIndex + 1) {
                pickingDayName = key;
            }
        });

        $(".infoBox").find("h3").text(pickingDayName);

        $(this).children(".dropArea").find(".icon").each(function(index, value){
            var iconActivity = $(this).data("activity");
            var iconDescription = $(this).find("input").val();
            var infoBoxLi = $("<li>");
            infoBoxLi.html('<div class="icon infoBoxIcon" data-activity="' + iconActivity + '"></div><span>' + iconDescription + '</span>');  
            var editIcon = $('<i class="fa fa-pencil editButton" aria-hidden="true"></i>');
            var deleteIcon = $('<i class="fa fa-trash-o deleteButton" aria-hidden="true"></i>');
            infoBoxLi.append(editIcon).append(deleteIcon);
            $(".infoBox").find("ul").append(infoBoxLi);

        });


        editActivity();
        deleteActivity();
//        closingInfoBox();
    });


    // **********************************************************
    // adding the funcionality to the EDIT BUTTON
    // **********************************************************

    function editActivity () {
        // adding some magic to btn on hover event (css selector doesn't work)
        $(".infoBox ul").find("li").on("mouseenter mouseleave", ".editButton", function() {
            $(this).toggleClass("fa-lg hoverBtn");
        });
        
        
        $(".infoBox ul").find("li").on("click", ".deleteButton", function() {
        
        
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

        // deleting icon
        $(".infoBox ul").find("li").on("click", ".deleteButton", function() {
            // deleting icon from infoBox
            $(this).parent().remove();
            
            // deleting icon from dayBox in calendar (finding by desription instead od data-activity because there could be more than one identical icon)
            var deletedActivityDescription = $(this).parent().find("span").text();
            var dayBoxId = $(".infoBox").find("h2").data("id");
            $("#" + dayBoxId).find(".dropArea").children(".icon").each(function(index, value) {
                if ($(this).find("span").text() == deletedActivityDescription) {
                    $(this).remove();
                }
            });
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
        
         $(".exitBtn").on("click", function() {
             $(".infoBox").css("display", "none");
        });
    }

    closingInfoBox();

    
    // **********************************************************
    // getting current date from API by Ajax and placing current calendar on the website
    // **********************************************************

    function loadCalendar() {

        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbyd5AcbAnWi2Yn0xhFRbyzS4qMq1VucMVgVvhul5XqS9HkAyJY/exec?tz=Poland",
            dataType: 'json'

        }).done(function(response){                    
            var month = response.monthName;
            var day = response.day;
            var year = response.year;
            var dayName = response.dayofweekName;
            beginingOfMonth(day, dayName);
            makingCalendar(day, month, year);
        }).fail(function(error) {
            console.log(error);
        });
    }


    loadCalendar();

});



