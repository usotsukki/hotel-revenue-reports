const tourTax = 32.50;
const breakfastPrice = 150.00;

let links = document.querySelectorAll('.link')
links.forEach(link => {
    if (link.children[0].getAttribute('href') == window.location.pathname) {
        link.classList.add('active');
    }
});


function changeDate(el) {
    date = el.input.value;
    console.log(date);
}

var util = {
    qs(sel, ctx) {
        return (ctx || document).querySelector(sel);
    },
    qsa(sel, ctx) {
        return Array.from((ctx || document).querySelectorAll(sel));
    }
};

class DateCarouselMy {
    constructor(el) {
        this.element = el;
        this.prevButton = util.qs(".date-prev", el);
        this.input = util.qs(".date-current", el);
        this.nextButton = util.qs(".date-next", el);
        this.input.valueAsDate = new Date();
        this.prevButton.addEventListener("click", this.prev.bind(this));
        this.nextButton.addEventListener("click", this.next.bind(this));
    }

    prev() {
        this.input.stepDown();
        changeDate(this);


    }

    next() {
        this.input.stepUp();
        changeDate(this);

    }
}
util.qsa('.date-slider').forEach(function(el) { new DateCarouselMy(el) });

let date = document.querySelector('.date-current').value;
console.log(date);



// LOSE FOCUS ON ENTER
let bigInputs = document.querySelectorAll('.input-big');
bigInputs.forEach(input => {
    input.addEventListener('keyup', function(e) {
        if (e.which == 13) this.blur();
    });
});

function changeStatus(room) {
    let row = room.parentNode;
    let status = row.classList.contains('row-active');
    if (!status) {
        row.classList.add('row-active');
    } else {
        row.classList.remove('row-active');
    }
}

function stepper(btn) {

    let myInputs = btn.parentNode.children;
    let myInput = myInputs[1];

    let id = btn.getAttribute("act");
    let min = myInput.getAttribute("min");
    let max = myInput.getAttribute("max");
    let step = myInput.getAttribute("step");
    let val = myInput.getAttribute("value");
    let calcStep = (id == "increment") ? (step * 1) : (step * -1);
    let newValue = parseInt(val) + calcStep;

    if (newValue >= min && newValue <= max) {
        myInput.setAttribute("value", newValue);
    }

}

function updTax(btn) {
    let adults = btn.parentNode.children[1].value;
    btn.parentNode.parentNode.children[5].children[1].setAttribute('value', adults);

}

function updThreeRoomDef(row) {
    while (!row.classList.contains('input-row')) {
        row = row.parentNode;
    }
    let children = row.children;
    let dailyRate = children[3].children[0];
    let adultGuests = parseInt((children[1].children[1].value), 10);
    let chilrenGuests = parseInt((children[2].children[1].value), 10);
    let guestNumber = adultGuests + chilrenGuests;

    if (guestNumber > 3) {
        guestNumber = 3;
    }
    guestCost = guestNumber * 100;
    dailyRate.value = guestCost + 900;
}

function updSuiteRoomDef(row) {
    while (!row.classList.contains('input-row')) {
        row = row.parentNode;
    }
    let children = row.children;
    let dailyRate = children[3].children[0];
    let adultGuests = parseInt((children[1].children[1].value), 10);
    let chilrenGuests = parseInt((children[2].children[1].value), 10);
    let guestNumber = adultGuests + chilrenGuests;

    let guestCost = 0;
    if (guestNumber > 4) {
        guestCost = 1000 * 1;
    } else if (guestNumber > 2) {
        guestCost = 500 * 1
    };

    dailyRate.value = guestCost + 2500 * 1;
}

function total(row) {
    while (!row.classList.contains('input-row')) {
        row = row.parentNode;
    }
    let children = row.children;



    let total = children[6].children[0];
    if (row.classList.contains('row-active')) {


        let dailyRate = children[3].children[0].value * 1;
        let breakfast = children[4].children[1].value * breakfastPrice;
        let tax = children[5].children[1].value * tourTax;
        let sum = dailyRate + breakfast + tax;


        total.innerHTML = sum;
        total.setAttribute('value', sum);
        let value = total.getAttribute('value');

    } else {
        total.setAttribute('value', 0.00);
        total.innerHTML = 0.00;

    }

}

function grandTotalForDay() {
    let bottomLine = document.getElementById('grand-total');
    if (document.querySelector('.row-active')) {
        let activeRooms = document.querySelectorAll('.row-active');
        let roomTotals = [];
        activeRooms.forEach(room => {
            let total = parseFloat(room.children[6].children[0].getAttribute('value'));
            roomTotals.push(total);
        });
        var sum = roomTotals.reduce(function(a, b) {
            return a + b;
        }, 0);

        bottomLine.innerHTML = sum;


    }
}

function copyToClipboard(text) {
    const elem = document.createElement('textarea');
    elem.value = text;
    document.body.appendChild(elem);
    elem.select();
    document.execCommand('copy');
    document.body.removeChild(elem);
}

function generateTextMessage(input_par) {
    let message = '';

    if (document.querySelectorAll(input_par)) {

        let bottomLine = parseFloat(document.getElementById('grand-total').innerHTML);

        let activeRooms = document.querySelectorAll(input_par);

        let len = activeRooms.length;
        var roomArray = new Array(len)
        for (var i = 0; i < len; i++) {
            roomArray[i] = new Array();
        };
        if (input_par == '.row-active') {
            for (var rowIndex = 0; rowIndex < len; rowIndex++) {
                row = activeRooms[rowIndex];
                let room = parseInt(row.children[0].innerHTML, 10) + ' --';
                let adultGuests = parseInt(row.children[1].children[1].value, 10);
                let childGuests = parseInt(row.children[2].children[1].value, 10);
                let total = parseFloat(row.children[6].children[0].getAttribute('value'));
                roomArray[rowIndex].push(room, adultGuests, childGuests, total);
            };
        } else if (input_par == '.input-row') {
            console.log('trigger')
            for (var rowIndex = 0; rowIndex < len; rowIndex++) {
                console.log(activeRooms)
                row = activeRooms[rowIndex];
                console.log(row)
                let room = parseInt(row.children[0].innerHTML, 10) + ' --';
                console.log(room)
                let adultGuests = parseInt(row.children[1].innerHTML, 10);
                let childGuests = parseInt(row.children[2].innerHTML, 10);
                let total = parseFloat(row.children[3].innerHTML, 10);
                roomArray[rowIndex].push(room, adultGuests, childGuests, total);
            };
        }

        console.log(roomArray);
        for (var i = 0; i < len; i++) {
            message += '\n'
            for (var j = 0; j < 4; j++) {
                message += roomArray[i][j] + '  ';
            }
        }
        message += '\n' + bottomLine + ' UAH';


    };
    copyToClipboard(message);
    document.querySelector('.copy-icon').classList.add('green');
    setTimeout(function() {
        document.querySelector('.copy-icon').classList.remove('green')
    }, 1000);

    console.log(message);
}

function createJSON(submitBtn) {

    if (document.querySelectorAll('.row-active')) {
        let bottomLine = parseInt(document.getElementById('grand-total').innerHTML, 10);
        let activeRooms = document.querySelectorAll('.row-active');
        let len = activeRooms.length;
        var jsonArray = new Array()

        for (var rowIndex = 0; rowIndex < len; rowIndex++) {
            row = activeRooms[rowIndex];

            let dayOfMonth = parseInt(date.split('-')[2]);
            let year = parseInt(date.split('-')[0]);
            let month = parseInt(date.split('-')[1]);
            console.log(dayOfMonth, year, month);

            let room = parseInt(row.children[0].innerHTML, 10);
            let adultGuests = parseInt(row.children[1].children[1].value, 10);
            let childGuests = parseInt(row.children[2].children[1].value, 10);
            let dailyRate = parseFloat(row.children[3].children[0].value)
            let breakfasts = parseInt(row.children[4].children[1].value, 10);
            let total = parseInt(row.children[6].children[0].getAttribute('value'), 10);
            jsonArray.push({
                'year': year,
                'month': month,
                'date': dayOfMonth,
                'room-id': room,
                'adult-guests': adultGuests,
                'child-guests': childGuests,
                'daily-rate': dailyRate,
                'breakfast': breakfasts,
                'room-total': total,
                'day-total': bottomLine
            });
        };

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/add-data', true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({ report: jsonArray });
        xhr.send(data);
        console.log('sent')
    }
}

function autoLogIn() {
    var form = document.createElement("form");
    var element1 = document.createElement("input");
    var element2 = document.createElement("input");
    var element3 = document.createElement("input");
    let dayOfMonth = parseInt(date.split('-')[2]);
    let year = parseInt(date.split('-')[0]);
    let month = parseInt(date.split('-')[1]);

    form.method = "POST";
    form.action = "/";

    element1.value = dayOfMonth;
    element1.name = "day";
    form.appendChild(element1);

    element2.value = year;
    element2.name = "year";
    form.appendChild(element2);

    element3.value = month;
    element3.name = "month";
    form.appendChild(element3);

    document.body.appendChild(form);

    form.submit();
}

function green(el) {
    el.classList.add('greener')
    setTimeout(function() {
        el.classList.remove('greener')
    }, 1500)
}