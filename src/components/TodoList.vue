<template>
    <div id="todo-list">
        <div class="list-item" v-for="item in todos" :key="item.id">
            <div class="list-item-holder" v-if="item.location == location" :data-status="item.completed">
                <div class="checkbox-items" :data-status="item.completed">
                    <input type="checkbox" :data-id="item.id" :id="item.id" @click="updateTodo" :checked="item.completed" />
                    <label :data-id="item.id" :for="item.id">
                        {{ item.name }}
                    </label>
                </div>
                <div class="item-options">
                    <div class="delete-item" @click="deleteItem" :data-id="item.id">Delete</div>
                    <div class="archive-item" v-if="item.location !== 'archive'" @click="archiveItem" :data-id="item.id">Archive</div>
                </div>
            </div>
        </div>
        <div id="new-todo-list-item">
            <input type="text" placeholder="Add a new To-Do item.." id="new-todo-list-item-input" @keyup="updateItemText" />
            <input type="submit" id="new-todo-list-item-submit" @click="newItem" value="Add To Do List Item" />
        </div>
    </div>
</template>

<script>
    import { useStore } from "vuex";
    import { v4 as uuidv4 } from 'uuid';
    
    export default {
        name: 'todoList',
        data() {
            return {
                newTodoItem: ''
            }
        },
        props: {
            location: String
        },
        setup() {
            //open the vuex store
            const store = useStore()
            //Using the getter to fetch & return data.
            return {
                todos: store.getters.todos,
            }
        },
        methods: {
            updateItemText: function(text) {
                this.newTodoItem = text.currentTarget.value;
                //if keycode == enter
                if(text.keyCode === 13) {
                    this.newTodoItem();
                }
                return false;
            },
            updateTodo: function(text) {
                //get the new status of our todo list item.
                let newStatus = text.currentTarget.parentElement.getAttribute('data-status') == "true" ? false : true;
                //send this along with the item id to our store and fire the mutation 'updateTodo' in our vuex store.
                this.$store.commit('updateTodo', {
                    id: text.currentTarget.getAttribute('data-id'),
                    completed: newStatus
                });
            },
            deleteItem: function(text) {
                //This will fire our 'deleteTodo' mutation and delete the todo according to the id.
                this.$store.commit('deleteTodo', {
                    id: text.currentTarget.getAttribute('data-id')
                });
            },
            newItem: function() {
                //if newTodoItem has data and enter has been clicked.
                if(this.newTodoItem !== '') {
                    //commit data to create a new Todo using 'addTodo' mutation.
                    this.$store.commit('addTodo', {
                        id: uuidv4(),
                        name: this.newTodoItem,
                        completed: false
                    })
                }
            },
            archiveItem: function(text) {
                //Here we are archiving/moving an item using the 'moveTodoItem' mutation.
                this.$store.commit('moveTodoItem', {
                    id: text.currentTarget.getAttribute('data-id'),
                    location: 'archive'
                });
            }
        }
    }
</script>

<style scoped>
    #todo-list {
        border-radius: 14px;
        max-width: 400px;
        border: 2px solid #ddd;
    }

    .list-item-holder {
        display: flex;
        padding: 1rem 1rem;
        justify-content: space-between;
        border-bottom: 1px solid #ddd;
    }

    .item-option, .item-checkbox {
        display: flex;
    }

    #new-todo-list-item {
        padding: 1rem;
    }

    #new-todo-list-item input[type="text"] {
        margin: 0 0 1rem 0;
    }

    .delete-item {
        font-size: 0.88rem;
        background: #eee;
        margin: 0 0 0 0.5;
        height: 1rem;
        border-radius: 100px;
        transition: all 0.1s ease-out;
        color: rgba(0,0,0,0.5);
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

    [data-status="false"] label {
        color: #0428ff;
        font-weight: 600;
    }

    
    [data-status="true"] label {
        text-decoration: line-through;
    }
</style>