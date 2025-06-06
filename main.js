// CDN Vue Import
const { createApp, ref, reactive } = Vue

const app = createApp({
    setup() {
        const computedUsers = ref([]);
        const userCounter = ref('');
        const searchInput = ref('');
        const filtersStatus = reactive({
            sortAge: '=',
            sortGender: '='
        });
        
        let users = [];
        const MEN = "male";
        const WOMEN = "female";
        const DESC = "⌄";
        const ASC = "^";
        const NONE = "=";

        function fetchUsers() {
            fetch('https://randomuser.me/api/?results=20')
            .then(data => data.json()
                .then((json) => {
                    users = [...json.results, ...users];
                    renderUsers(users);
                })
            );
        }

        function renderUsers(filteredUsers){
            computedUsers.value = [];
            
            filteredUsers.forEach(user => {
                computedUsers.value.push(createUserElement(user));
            });
            
            showUserCount(filteredUsers);
        }

        function createUserElement(user) {
            let row = {};

            row.imageSource = user.picture.thumbnail;
            row.name = user.name.title + '. ' + user.name.first + ' ' + user.name.last;
            row.email = user.email;
            row.tel = user.cell;
            row.age = user.dob.age;
            row.gender = user.gender === MEN ? '👨' : '👩';

            return row;
        }

        function sort(filter = null) {
            updateFilter(filter);
            usersList = [...users];
            usersList = searchName(usersList);
            usersList = sortUserByGender(usersList);
            usersList = sortByAge(usersList);
            renderUsers(usersList);
        }

        function updateFilter(filter) {
            if (!filter) return;
            switch (filtersStatus[filter]) {
                case ASC :
                    filtersStatus[filter] = DESC;
                    break;
                case DESC :
                    filtersStatus[filter] = NONE;
                    break;
                default :
                    filtersStatus[filter] = ASC;
                    break;
            }
        }

        function sortUserByGender(usersList) {
            const actual = filtersStatus.sortGender;
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
            const actual = filtersStatus.sortAge;
            switch (actual) {
                case ASC :
                    return usersList.sort((a, b) => b.dob.age - a.dob.age);
                case DESC :
                    return usersList.sort((a, b) => a.dob.age - b.dob.age);
                default :
                    return usersList;
            }
        }

        function searchName(usersList) {
            const searchValue = betterNormalize(searchInput.value);
            console.log(`Searching for: ${searchValue}`);
            
            return usersList.filter(user =>
                betterNormalize(user.name.first).includes(searchValue) ||
                betterNormalize(user.name.last).includes(searchValue)
            );
        }

        function betterNormalize(str) {
            return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        }

        function showUserCount(usersList) {
            userCounter.value = `Show ${usersList.length} users of ${users.length} total`;
        }

        return {
            filtersStatus,
            computedUsers,
            fetchUsers,
            sort,
            searchInput,
            userCounter,
        }
    }
}).mount('#app')
