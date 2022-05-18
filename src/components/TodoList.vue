<template>
    <section id="todo-list">
        <article class="list-item" v-for="item in todos" :key="item.id">
            <div class="list-item-holder" v-if="item.location == location" :data-status="item.completed">
                <div class="checkbox-items" :data-status="item.completed">
                    <input type="checkbox" :data-id="item.id" :id="item.id" @click="updateTodoStatus" :checked="item.completed" />
                    <label v-show="item.editing === false" :data-id="item.id" :for="item.id" @dblclick="editingStatus">
                        {{ item.name }}
                    </label>
                    <input type="text" id="editing-item" v-show="item.editing === true" :placeholder="item.name" :data-id="item.id" @keyup="editItemText" @blur="doneEdit" @keyup.enter="doneEdit" v-focus/> 
                </div>
                <div class="item-options">
                    <div class="delete-item" :data-id="item.id" :data-location="item.location" @click="deleteItem">Delete</div>
                    <div class="archive-item" :data-id="item.id" v-if="item.location !== 'archive'" @click="archiveItem">Archive</div>
                </div>
            </div>
        </article>
        <section id="new-todo-list-item" v-if="location == 'home'">
            <input type="text" placeholder="Add a new To-Do item.." id="new-todo-list-item-input" @keyup="updateItemText"/>
            <input type="submit" id="new-todo-list-item-submit" @click="newItem" value="Add To-Do Item" />
        </section>
        <article v-if="archivedItems < 1 && location == 'archive'">
            <label id="archive-empty-todos">No Archived Items to Display</label>
        </article>
    </section>
</template>

<script>
    import { useStore } from "vuex";
    import { v4 as uuidv4 } from 'uuid';
    
    export default {
        name: 'todoList',
        data() {
            return {
                newTodoItem: '',
                beforeEditCache: '',
                editedText: '',
                archivedItems: 0
            }
        },
        props: {
            location: String
        },
        setup() {
            //open the vuex store
            const store = useStore();
            let archivedItems = 0;
            //Using the getter to fetch & return data.
            return {
                todos: store.getters.todos,
                archivedItems: archivedItems,
            }
        },
        methods: {
            updateItemText: function(text) {
                this.newTodoItem = text.currentTarget.value;
                //if keycode == enter then add new todo.
                if(text.keyCode === 13) {
                    this.newItem();
                    text.currentTarget.value = '';
                }
                return false;
            },
            editItemText: function(text) {
                this.editedText = text.currentTarget.value;
                if(text.keyCode === 13) {
                    let id = text.currentTarget.getAttribute('data-id');
                    this.editTodo(id);
                }
                return false;
            },
            editingStatus: function(todo) {
                let statusId = todo.currentTarget.getAttribute('data-id');
                let todoToEdit = this.todos.findIndex((x) => x.id == statusId);
                this.todos[todoToEdit].editing = true;
                document.getElementById('editing-item').focus;
            },
            doneEdit: function(todo) {
                let statusId = todo.currentTarget.getAttribute('data-id');
                let todoToEdit = this.todos.findIndex((x) => x.id == statusId);
                this.todos[todoToEdit].editing = false;
            },
            updateTodoStatus: function(text) {
                //get the new status of our todo list item.
                let newStatus = text.currentTarget.parentElement.getAttribute('data-status') == "true" ? false : true;
                //send this along with the item id to our store and fire the mutation 'updateTodoStatus' in our vuex store.
                this.$store.commit('updateTodoStatus', {
                    id: text.currentTarget.getAttribute('data-id'),
                    completed: newStatus
                });
            },
            editTodo: function(id) {
                //This will fire our 'editTodo' mutation and modify the todo according to id.
                this.$store.commit('editTodo', {
                    id: id,
                    name: this.editedText,
                });
            },
            deleteItem: function(todo) {
                console.log(this.archivedItems);
                if (todo.currentTarget.getAttribute('data-location') == 'archive') {
                    this.archivedItems--;
                }
                console.log(this.archivedItems);
                //This will fire our 'deleteTodo' mutation and delete the todo according to the id.
                this.$store.commit('deleteTodo', {
                    id: todo.currentTarget.getAttribute('data-id')
                });
            },
            newItem: function() {
                //if newTodoItem has data and enter has been clicked.
                if(this.newTodoItem !== '') {
                    //commit data to create a new Todo using 'addTodo' mutation.
                    this.$store.commit('addTodo', {
                        id: uuidv4(),
                        name: this.newTodoItem,
                        completed: false,
                    });
                }
                this.newTodoItem = '';
            },
            archiveItem: function(text) {
                console.log(this.archivedItems);
                //Here we are archiving/moving an item using the 'moveTodoItem' mutation.
                this.$store.commit('moveTodoItem', {
                    id: text.currentTarget.getAttribute('data-id'),
                    location: 'archive'
                });
                this.archivedItems++;
                console.log(this.archivedItems);
            }
        },
        directives: {
            focus: {
                inserted: function (el) {
                    el.focus();
                }
            }
        },
        mounted() {
            //Only once everything on the window has loaded do we call our getTodos function. We now only call this once on mounting.
            window.addEventListener('load', () => {
                this.$store.dispatch('getTodos');
            })
        }
    }
</script>

<style scoped>
    #todo-list {
        border-radius: 14px;
        max-width: 400px;
        border: 2px solid #ddd;
        overflow: hidden;
    }

    .list-item-holder {
        display: flex;
        padding: 1rem 1rem;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
    }

    .item-option, .item-checkbox {
        display: flex;
        justify-content: center;
    }

    #new-todo-list-item {
        padding: 1rem;
    }

    #new-todo-list-item input[type="text"] {
        margin: 0 0 0.5rem 0;
    }

    .delete-item, .archive-item {
        font-size: 0.88rem;
        background: #eee;
        margin: 0 0 0.5rem 0.5rem;
        height: 1rem;
        border-radius: 100px;
        transition: all 0.1s ease-out;
        color: rgb(0, 0, 0);
        cursor: pointer;
        padding: 0.25rem 0.75rem;
    }

    .checkbox-items {
        display: flex;
        align-items: center;
    }

    .delete-item:hover, .archive-item:hover {
        background: #ddd;
        color: black;
    }

    #archive-empty-todos {
        font-size: medium;
        font-weight: 600;
        color: #aaa;
        margin-left: 0.5rem;
        margin-bottom: 2rem;
    }
    
    [data-status="true"] label {
        text-decoration: line-through;
    }
</style>