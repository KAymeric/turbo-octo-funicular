let users = [];
const MEN = "male";
const WOMEN = "female";
const DESC = "⌄";
const ASC = "^";
const NONE = "=";
const userList = document.getElementById('list');
const sortGender = document.getElementById('sortGender');

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

function sortUserByGender() {
    const actual = sortGender.innerText
    switch (actual) {
        case ASC :
            sortGender.innerText = DESC;
            renderUsers(users.filter(user => user.gender === WOMEN));
            break
        case DESC :
            sortGender.innerText = NONE;
            renderUsers(users);
            break
        default :
            sortGender.innerText = ASC;
            renderUsers(users.filter(user => user.gender === MEN));
            break
    }
}
