let users = [];
const MEN = "male";
const WOMEN = "female";
const DESC = "⌄";
const ASC = "^";
const NONE = "=";
const userList = document.getElementById('list');
const sortGender = document.getElementById('sortGender');
const sortAge = document.getElementById('sortAge');
const searchInput = document.getElementById('search');
const userCounter = document.getElementById('countUsers');

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sort('');
    }
});

async function fetchUsers() {
    const data = await fetch('https://randomuser.me/api/?results=20');
    data.json().then((json) => {
        users = [...json.results, ...users];
        renderUsers(users);
    })
}

function renderUsers(filteredUsers){
    userList.innerHTML = '';
    
    filteredUsers.forEach(user => {
        userList.appendChild(createUserElement(user));
    });
    
    showUserCount(filteredUsers);
}

function createUserElement(user) {
    const tr = document.createElement('tr');
    const photo = document.createElement('td');
    const img = document.createElement('img');
    const name = document.createElement('td');
    const email = document.createElement('td');
    const tel = document.createElement('td');
    const age = document.createElement('td');
    const gender = document.createElement('td');
    
    img.src = user.picture.thumbnail;
    name.textContent = user.name.title + '. ' + user.name.first + ' ' + user.name.last;
    email.textContent = user.email;
    tel.textContent = user.cell;
    age.textContent = user.dob.age;
    gender.textContent = user.gender === MEN ? '👨' : '👩';

    photo.appendChild(img);
    tr.appendChild(photo);
    tr.appendChild(name);
    tr.appendChild(email);
    tr.appendChild(tel);
    tr.appendChild(age);
    tr.appendChild(gender);

    return tr;
}

function sort(filter) {
    updateFilter(filter);
    usersList = [...users];
    usersList = searchName(usersList);
    usersList = sortUserByGender(usersList);
    usersList = sortByAge(usersList);
    renderUsers(usersList);
}

function sortUserByGender(usersList) {
    const actual = sortGender.innerText;
    switch (actual) {
        case ASC :
            return usersList.filter(user => user.gender === MEN);
        case DESC :
            return usersList.filter(user => user.gender === WOMEN);
        default :
            return usersList;
    }
}

function sortByAge(usersList) {
    const actual = sortAge.innerText;
    switch (actual) {
        case ASC :
            return usersList.sort((a, b) => b.dob.age - a.dob.age);
        case DESC :
            return usersList.sort((a, b) => a.dob.age - b.dob.age);
        default :
            return usersList;
    }
}

function searchName() {
    const searchValue = betterNormalize(searchInput.value);
    return usersList.filter(user =>
        betterNormalize(user.name.first).includes(searchValue) ||
        betterNormalize(user.name.last).includes(searchValue)
    );
}

function betterNormalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function showUserCount(usersList) {
    userCounter.innerText = `Show ${usersList.length} users of ${users.length} total`;
}

function updateFilter(filter) {
    const elt = document.getElementById(filter);
    if (!elt) return;
    switch (elt.innerText) {
        case ASC :
            elt.innerText = DESC;
            break;
        case DESC :
            elt.innerText = NONE;
            break;
        default :
            elt.innerText = ASC;
            break;
    }
}
