<template>
    <div>
        <h1>To Do List:</h1>
        <todoList location="home" />
    </div>
</template>

<script>
    import todoList from '../components/TodoList.vue';
    
    export default {
        name: "HomePage",
        components: {
            todoList
        }
    }
</script>