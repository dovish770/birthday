// if(document.referrer.includes("blessIndex.html")) {
//     const guest = findByName('guest_name');
//     guest.isComing = localStorage.getItem(guest.name + '_isComing') === 'true';
//     guest.blessing = localStorage.getItem(guest.name + '_blessing');
//     createAcountState(guest);
// } 

import { isGuestComing, setBlessing, setGuest } from "./server";

class Guest {
    constructor(name, verify, answer, options, pictureSrc = []) {
        this.name = name;
        this.verify = verify;
        this.answer = answer;
        this.options = options;
        this.pictureSrc = pictureSrc || 'resources/images/default-pic.jpg';
        this.isComing = false;
        this.blessing = "";
    }

     setPicture(src) {
         this.pictureSrc = src;
    }
}

const guestList = [];

function fillGuestList() {
    let name, question, answer, opts = [], picSrc;

    fetch('resources/data/guests-data.txt')
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return response.text();
        })
        .then(text => {
            const lines = text.split('\n');
            lines.forEach((line, index) => {
                line = line.trim(); 
                if(line === '') return; 

                switch (index%7) {
                    case 0:
                        name = line;
                        break;
                    case 1:
                        question = line;
                        break;
                    case 2:
                        answer = line;
                        break;
                    case 3:
                    case 4:
                    case 5:
                        opts.push(line);
                        break;
                    case 6:
                        picSrc = line.replace(/['"]/g, '');
                        guestList.push(new Guest(name, question, answer, opts, picSrc));
                        opts = []; 
                        break;
                }
            });
            guestList.sort((a, b) => a.name.localeCompare(b.name)); 
        })
        .catch(error => console.error('שגיאה בקריאת הקובץ:', error));
}
window.guestList = guestList;

const ul = document.getElementById("guestList");

function drawList(list) {
    ul.innerHTML = '';
    list.forEach(guest => {
        const li = document.createElement('li');
        li.textContent = guest.name;
        li.addEventListener('click', function() {
            createVerifyState(guest.name);
        });
        ul.appendChild(li);
    });
}

fillGuestList();
drawList([]);

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', function() {
    const filteredGuests = search(guestList, searchInput.value, "include");
    drawList(filteredGuests);
    if(searchInput.value.length === 0)
        drawList([]);
});

const mainDiv = document.getElementById('main-div');

function clear() {
    if (mainDiv) 
        mainDiv.innerHTML = ''; 
}

//create and manage verify situation
function createVerifyState(name) {

    clear();

    const guest = findByName(name);

    if(!guest)
    {
        alert("this name is not a guest's one");
        return;
    }

    mainDiv.style.backgroundImage = "url('resources/images/verify-pic.png')"; 

    //the question
    const hVerify = document.createElement('h2');
    hVerify.textContent = guest.verify;
    hVerify.style.marginTop = "45%";
    mainDiv.appendChild(hVerify);

    const btnDiv = document.createElement('div');
    btnDiv.style.display = 'flex';
    btnDiv.style.flexDirection = 'column';
    btnDiv.style.gap = '2.5vh';
    btnDiv.style.marginTop = '4vh';
    mainDiv.appendChild(btnDiv);

    const r = Math.floor(Math.random() * 4);
    let j = 0;
    for (let i = 0; i < 4; i++) {
        const btn = document.createElement('button');
    
        if (i === r) {
            btn.textContent = guest.answer; 
        } else {
            btn.textContent = guest.options[j++]; 
        }
    
        btnDiv.appendChild(btn);
    
        btn.addEventListener('click', function () {
            if (i === r) {
                createAcountState(guest);
            } else {
                alert("תשובה שגויה, נסה שוב.");
            }
        });
    }    
}



/*
 * create acount situation.
 */
function createAcountState(guest) {

    clear(); 

    mainDiv.style.backgroundImage = "url('resources/images/acount-pic.png')"; 
    
    //profile picture
    const image = document.createElement('img');
    image.src = guest.pictureSrc;
    image.className = 'profilePicture';
    image.style.marginTop = '3.5%';
    mainDiv.appendChild(image);   

    //name of guest
    const hAcount = document.createElement('h2');
    hAcount.textContent = guest.name;
    hAcount.style.marginTop = "0%";
    mainDiv.appendChild(hAcount); 

    //is coming or not.
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.flexDirection = 'row';
    div.style.marginTop = '3.5%';
    div.style.marginRight = '40%';
    mainDiv.appendChild(div); 

    const iconLeft = document.createElement('img');
    iconLeft.className = "icon-finger";
    iconLeft.src = "resources/icons/left-pointer-icon.png";
    iconLeft.style.animation = 'bounceLeft 2s infinite';
    div.appendChild(iconLeft);

   

    const btn = document.createElement('button');
    const savesIsComing = isGuestComing({guest: guest.name + '_isComing'});
    btn.textContent = savesIsComing ? "מגיע.ה" : "לאישור";
    btn.style.width = '10vh';
    btn.style.height = '4vh';
    btn.style.fontSize = '2vh';
    btn.style.border = '0.2vh';
    btn.style.marginTop = '13%';
    btn.addEventListener('click', function() {
        guest.isComing = !guest.isComing;
        setGuest({guest: guest.name + '_isComing', isComing: guest.isComing});
        btn.textContent = guest.isComing ? "מגיע.ה" : "לאישור";
    });
    div.appendChild(btn);

    //blessing
    const blessInput = document.createElement('textarea');
    blessInput.placeholder = 'נסח פה...';
    blessInput.innerText = guest.blessing;
    blessInput.addEventListener('blur', function() {
        guest.blessing = blessInput.value; 
        setBlessing({blesser: guest.name + `_blessing`, blessing: blessInput.value}) 
    });
    mainDiv.appendChild(blessInput);

    const btn1 = document.createElement('button');
    btn1.textContent = "press me";
    btn1.style.width = '10vh';
    btn1.style.height = '6vh';
    btn1.style.fontSize = '2vh';
    btn1.style.border = '0.2vh';
    btn1.style.marginTop = '45.1%';
    btn1.addEventListener('click', function() {
        window.location.href = 'blessIndex.html';
    });
    mainDiv.appendChild(btn1);
}




//help functions

function findByName(name) {
    let index = search(guestList, name, "is");
    if(index >= 0)
        return guestList[index];
    else
        return false;
}

function search(arr, target, type) {

    let low = 0;
    let high = arr.length-1;
    
    if(type.localeCompare("include") == 0) {
        const filteredGuests = [];
        arr.forEach(guest => {
            if(guest.name.includes(target))
                filteredGuests.push(guest);
        });

        return filteredGuests;
    }

    if(type.localeCompare("is") == 0) {
        while (low <= high) {
            const mid = Math.floor((low+high)/2);
            const midValue = arr[mid].name;
    
            if(midValue.localeCompare(target) == 0) {
                return mid;  
            }
            if(midValue.localeCompare(target) > 0) {
                high = mid-1;
            } 
            else {
                low = mid+1;
            }
        }
        return -1;
    }
    
}

