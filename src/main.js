import { createApp } from 'vue';
import { createStore } from 'vuex';
import App from './App.vue';
import router from './router';

const app = createApp(App);

//Here we create our store.
const store = createStore({
    state() {
        return {
            todos: [
                {
                    id: 'first-element',
                    name: 'My First To Do item',
                    completed: false,
                    location: 'home'
                }
            ]
        }
    },
    getters: {
        todos(state) {
            return state.todos;
        }
    },
    mutations: {
        loadStore() {
            if (localStorage.getItem('store')) {
                try {
                    this.replaceState(JSON.parse(localStorage.getItem('store')));
                } catch (error) {
                    console.log('Could not initialize store', error);
                }
            }
        },
        updateTodo(state, todoItem) {
            let id = todoItem.id;
            let completed = todoItem.completed;
            let name = todoItem.name;
            let findElement = state.todos.find((x) => x.id == id);
            if (findElement != null) {
                if (completed != undefined) findElement.completed = completed;
                if (name != undefined) findElement.name = name;
            } else {
                console.log(`To Do List Item ${id} couldn't be found!`);
            }
        },
        addTodo(state, todoItem) {
            if (todoItem.id !== undefined && typeof todoItem.name == 'string' && typeof todoItem.completed == 'boolean') {
                state.todos.push({
                    id: todoItem.id,
                    name: todoItem.name,
                    complete: todoItem.completed,
                    location: 'home'
                });
            }
        },
        deleteTodo(state, todoItem) {
            let id = todoItem.id;
            let removedElement = state.todos.findIndex((x) => x.id == id);

            if (removedElement !== null) state.todos.splice(removedElement, 1);
        },
        moveTodoItem(state, todoItem) {
            let id = todoItem.id;
            let location = todoItem.location;
            let findElement = state.todos.find((x) => x.id == id);

            if (findElement !== null) {
                findElement.location = location;
            } else {
                console.log(`To Do List Item ${id} count not be found!`);
            }
        }
    }
});

store.subscribe((mutation, state) => {
    // The code inside the curly braces fires anytime a mutation occurs:
    // - When a mutation occurs, we stringify our entire state object that contains our todo list.
    // - We then add it to the users local storage so that the data will persist after refresh.

    localStorage.setItem('store', JSON.stringify(state));
});

app.use(router).use(store).mount('#app');