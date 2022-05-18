import { createStore } from 'vuex';
import axios from 'axios';

//Here we create our store.
const store = createStore({
    state() {
        return {
            todos: []
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
                    console.log('Could not initialize local store', error);
                }
            }
        },
        setTodo(state, todos) {
            //validate that the todo with 'id' does NOT already exist in our store.todos
            if (!state.todos.find(x => x.id == todos.id))
                state.todos.push(todos);
        },
        updateTodoStatus(state, todoItem) {
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
        editTodo(state, todoItem) {
            if (todoItem.id !== undefined && typeof todoItem.name == 'string') {
                let todoToUpdate = state.todos.findIndex((x) => x.id == todoItem.id);
                state.todos[todoToUpdate].name = todoItem.name;
                state.todos[todoToUpdate].complete = false;
            }
        },
        addTodo(state, todoItem) {
            if (todoItem.id !== undefined && typeof todoItem.name == 'string' && typeof todoItem.completed == 'boolean') {
                state.todos.push({
                    id: todoItem.id,
                    name: todoItem.name,
                    complete: todoItem.completed,
                    editing: false,
                    location: 'home'
                });
            }
        },
        deleteTodo(state, todo) {
            let removedElementIndex = state.todos.findIndex((x) => x.id === todo.id);
            if (removedElementIndex !== null) state.todos.splice(removedElementIndex, 1);
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
    },
    actions: {
        //Using Axios for api calls.
        getTodos( {commit} ) {
            axios.get('http://192.168.8.35:5050/data/sample/todos').then((res) => {
                if (res.data.result.length) {
                    res.data.result.forEach(element => {
                        commit('setTodo', element);
                    });
                }
            }).catch(error => {
                window.alert("A problem occured while retrieving the list of todos.");
                // console.log("A problem occured while retrieving the list of todos.", error);
            })
        }
    }
});

store.subscribe((mutation, state) => {
    // This code fires anytime a mutation occurs:
    // - When a mutation occurs, we stringify our entire state object that contains our todo list.
    // - We then add it to the users local storage so that the data will persist after refresh.
    // - To clear local store, remove comments from line below:
    // localStorage.clear('store');

    localStorage.setItem('store', JSON.stringify(state));
});

export default store;