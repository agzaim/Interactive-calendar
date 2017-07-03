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
    
    
    var firstDayOfMnthPosition = 0;
    var positionOfCurrentDay = 0;
    var numberOfDays = 0;

    
    
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    //                     FUNCTIONS
    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

    
    
    // searching the position of the first day of a current month
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





    //building a calendar 
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

        var calendarTable = $(".mnthTable");
        var dayOfMnth = 1;


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
    }



   // pulling current date from API by Ajax and placing current calendar on the website
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