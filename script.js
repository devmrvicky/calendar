// selected dom element
const timeLine = document.querySelector(".time-line");
const datesElem = document.querySelector(".dates");
const daysElem = document.querySelector(".days");
const eventsElem = document.querySelector(".events");
const ul = eventsElem.querySelector("ul");
const module = document.querySelector(".module");
const addEventBtn = document.querySelector(".add-event-btn");

// global variable
const dateObj = new Date();
let currentMonth;
let currentDay = dateObj.getDay();
let currentDate = dateObj.getDate();
// let selected year, month, day, date
let selectedFullDate, selectedYear, selectedMonth, selectedDay, selectedDate;
let dateTimeObj = {
  eventDate: dateObj.getDate(),
  eventDay: dateObj.getDay(),
  eventMonth: dateObj.getMonth(),
  eventYear: dateObj.getFullYear(),
  eventStartTime: "",
  eventEndTime: "",
  getEventDate: function () {
    if (this.eventMonth < 10) {
      this.eventMonth = "0" + this.eventMonth;
    }
    if (this.eventDate < 10) {
      this.eventDate = "0" + this.eventDate;
    }
    return `${this.eventYear}-${this.eventMonth}-${this.eventDate}`;
  },
};
// all events list
const allEvents = {
  event_7162023: [
    {
      name: "Meeting with boss",
      startTime: "09:00",
      endTime: "12:00",
      body: "Some text here",
    },
  ],
};

// All month's name
const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
// All day's name
const daysList = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

// create day list at the top to cldr prev
const createDayList = () => {
  daysList.forEach((day) => {
    const dayElem = document.createElement("div");
    dayElem.classList.add("day");
    dayElem.textContent = day.toUpperCase();
    daysElem.append(dayElem);
  });
};

// get year (current year and next year)
const getYearElem = (year) => {
  const yearElem = document.createElement("div");
  yearElem.classList.add("year");
  yearElem.textContent = year;
  return yearElem;
};

// get all months list
const getMonthsElem = () => {
  const ul = document.createElement("ul");
  ul.classList.add("months");
  monthsList.forEach((month, index) => {
    const li = document.createElement("li");
    li.classList.add("month");
    li.setAttribute("data-month", month);
    if (index === dateObj.getMonth()) {
      currentMonth = month;
      li.classList.add("active");
    }

    li.textContent = month;
    ul.append(li);
  });
  return ul;
};

// create year and month list
const createMonthsList = () => {
  createDayList();
  // current year
  const currYear = getYearElem(dateObj.getFullYear());
  timeLine.insertAdjacentElement("afterbegin", currYear);
  // months
  const ul = getMonthsElem();
  currYear.insertAdjacentElement("afterend", ul);
  // next year
  const nextYear = getYearElem(dateObj.getFullYear() + 1);
  ul.insertAdjacentElement("afterend", nextYear);
};
createMonthsList();

// get unique event name
const getUniqueEventName = (dateCell) => {
  let uniqueEventName;
  if (dateCell.title) {
    uniqueEventName = "event" + "_" + dateCell.title.split("-").join("");
  } else {
    uniqueEventName =
      "event" +
      "_" +
      (dateObj.getMonth() + 1) +
      dateObj.getDate() +
      dateObj.getFullYear();
  }
  return uniqueEventName;
};
// show no of events on date cell
const showNoEventsOnDateCell = (dateCell) => {
  let uniqueEventName = getUniqueEventName(dateCell);
  for (let eventName in allEvents) {
    if (eventName === uniqueEventName) {
      dateCell.innerHTML += `<span class="event-count">${allEvents[uniqueEventName].length}</span>`;
    }
  }
  // console.log(uniqueEventName);
};

// const fun = (element) => {
//   console.log(element);
// };

// show all events click on dateCell
// console.log(new Date())
const showEventsOnClick = (dateCell) => {
  ul.innerHTML = "";
  let uniqueEventName = getUniqueEventName(dateCell);
  for (let eventName in allEvents) {
    if (eventName === uniqueEventName) {
      for (let event of allEvents[uniqueEventName]) {
        const li = document.createElement("li");
        li.className = "event";
        li.innerHTML = `
          <div class="event-name">${event.name}</div>
          <div class="event-time">${event.startTime} AM - ${event.endTime} AM</div>
          <button class="event-menu" title="event-menu">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </button>
        `;
        ul.append(li);
      }
    }
  }
};

// create all date list
const createDateList = (currentMonth) => {
  datesElem.innerHTML = "";
  let lastDate;
  if (
    currentMonth === "January" ||
    currentMonth === "March" ||
    currentMonth === "May" ||
    currentMonth === "July" ||
    currentMonth === "August" ||
    currentMonth === "October" ||
    currentMonth === "December"
  ) {
    lastDate = 31;
  } else if (currentMonth === "February") {
    lastDate = 28;
  } else if (
    currentMonth === "April" ||
    currentMonth === "June" ||
    currentMonth === "September" ||
    currentMonth === "November"
  ) {
    lastDate = 30;
  }

  let num = 0;
  let date = 1;
  while (num < lastDate + new Date(`1-${currentMonth}-2023`).getDay()) {
    const dateElem = document.createElement("div");
    if (currentDate + monthsList[dateObj.getMonth()] === date + currentMonth) {
      dateElem.className = "date curr-date active-date";
      dateTimeObj = { ...dateTimeObj, dateElem };
      showEventsOnClick(dateElem);
    } else {
      dateElem.className = "date curr-date";
    }
    if (num >= new Date(`1-${currentMonth}-2023`).getDay()) {
      dateElem.setAttribute(
        "title",
        `${
          monthsList.indexOf(currentMonth) + 1
        }-${date}-${dateObj.getFullYear()}`
      );
      dateElem.innerHTML += `<span>${date}</span>`;
      date++;
      showNoEventsOnDateCell(dateElem);
    }
    datesElem.append(dateElem);
    num++;
    dateElem.onclick = (e) => {
      ul.innerHTML = "";
      showSelectedDate(dateElem);
      selectedFullDate = e.currentTarget.title;
      selectedMonth = selectedFullDate.split("-")[0] - 1;
      selectedDate = selectedFullDate.split("-")[1];
      selectedYear = selectedFullDate.split("-")[2];
      selectedDay = new Date(selectedFullDate).getDay();
      dateTimeObj = {
        ...dateTimeObj,
        eventDate: selectedDate,
        eventDay: selectedDay,
        eventMonth: selectedMonth,
        eventYear: selectedYear,
        dateElem,
      };
      if (e.currentTarget.classList.contains("selected-date")) {
        getFullDate(selectedDate, selectedDay, selectedMonth, selectedYear);
      } else {
        showFullDate(currentDate, currentDay, currentMonth);
      }
      showEventsOnClick(dateElem);
    };
  }
};
createDateList(currentMonth);

// function to show selected date
function showSelectedDate(dateElem) {
  if (!dateElem.classList.contains("active-date")) {
    if (dateElem.classList.contains("selected-date")) {
      dateElem.classList.remove("selected-date");
    } else {
      const dateElems = document.querySelectorAll(".date");
      dateElems.forEach((elem) => {
        elem.classList.remove("selected-date");
      });
      dateElem.classList.toggle("selected-date");
    }
  }
}

// check for active date
const months = document.querySelectorAll(".months li");
months.forEach((month) => {
  month.addEventListener("click", (e) => {
    months.forEach((month) => {
      month.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
    createDateList(e.currentTarget.dataset.month);
  });
});

const showFullDate = (date, day, month, year = dateObj.getFullYear()) => {
  if (date < 10) {
    date = "0" + date;
  }
  let monthInNum = monthsList.indexOf(month) + 1;
  if (monthInNum < 10) {
    monthInNum = "0" + monthInNum;
  }
  const selectedDate = eventsElem.querySelector(".selected-date");
  selectedDate.innerHTML = `
  <div class="current-year">${month}</div>
  <div class="current-date">${date}-${monthInNum}-${year}</div>
  <div class="current-day">${daysList[day]}</div>
  `;
};
showFullDate(currentDate, currentDay, currentMonth);

function getFullDate(date, day, month, year) {
  showFullDate(date, day, monthsList[month], year);
  // console.log({ date, day, month, year });
}

const inputs = module.querySelectorAll("input");
// set initial values for all input on clicking add-event-btn
addEventBtn.addEventListener("click", () => {
  module.classList.add("open-module");
  inputs.forEach((input) => {
    if (input.id === "startTime" || input.id === "endTime") {
      input.value = dateTimeObj.eventStartTime;
    } else if (input.id === "eventDate") {
      input.value = dateTimeObj.getEventDate();
    } else if (input.id === "eventName") {
      input.value = "Business meeting";
      dateTimeObj = { ...dateTimeObj, eventName: input.value };
    }
  });
});

// handle submit module form
const handleSubmit = (e) => {
  e.preventDefault();
  inputs.forEach((input) => {
    if (input.id === "startTime") {
      dateTimeObj = { ...dateTimeObj, eventStartTime: input.value };
    } else if (input.id === "endTime") {
      dateTimeObj = { ...dateTimeObj, eventEndTime: input.value };
    } else if (input.id === "eventDate") {
      dateTimeObj = {
        ...dateTimeObj,
        eventDate: parseInt(input.value.split("-")[2]),
        eventMonth: parseInt(input.value.split("-")[1]),
        eventYear: parseInt(input.value.split("-")[0]),
      };
    } else if (input.id === "eventName") {
      dateTimeObj = { ...dateTimeObj, eventName: input.value };
    }
  });
  let uniqueEventName = getUniqueEventName(dateTimeObj.dateElem);
  ul.innerHTML = "";
  let newObj = {
    name: dateTimeObj.eventName,
    startTime: dateTimeObj.eventStartTime,
    endTime: dateTimeObj.eventEndTime,
  };
  if (uniqueEventName in allEvents) {
    allEvents[uniqueEventName].push(newObj);
  } else {
    let newArr = [];
    newArr.push(newObj);
    allEvents[uniqueEventName] = [...newArr];
  }
  showEventsOnClick(dateTimeObj.dateElem);
  showNoEventsOnDateCell(dateTimeObj.dateElem);
  module.classList.remove("open-module");
};

const moduleCtrlBtns = module.querySelectorAll(".ctrl-btns button");
moduleCtrlBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const btnType = e.currentTarget.type;
    if (btnType === "button") {
      module.classList.remove("open-module");
    } else if (btnType === "submit") {
      handleSubmit(e);
    }
  });
});

const clearEvent = (e) => {};

const eventBtn = document.querySelectorAll(".event-menu");
// console.log(eventBtn)
let isAppend = true;
// eventBtn?.addEventListener("click", (e) => {
//   let x;
//   const eventMoreOpt = document.createElement("div");
//   eventMoreOpt.className = "event-more-opt";
//   const clearEventBtn = document.createElement("button");
//   clearEventBtn.className = "clear-event";
//   clearEventBtn.innerHTML = `
//     <span class="cross"></span>
//     <span>Clear event</span>
//   `;
//   clearEventBtn.onclick = e => {
//     clearEvent(e)
//   }
//   eventMoreOpt.insertAdjacentElement("beforeend", clearEventBtn);
//   if (isAppend) {
//     isAppend = false;
//     e.currentTarget.insertAdjacentElement("afterend", eventMoreOpt);
//     // x = setTimeout(() => {
//     //   isAppend = true;
//     //   eventMoreOpt.remove();
//     // }, 3000);
//   } else {
//     // clearTimeout(x)
//     e.currentTarget.nextElementSibling.remove();
//     isAppend = true;
//   }
// });
