<template>
    <div>
        <h1>Archived Items:</h1>
        <todoList location="archive" />
    </div>
</template>

<script>
    import todoList from '../components/TodoList.vue'
    export default {
        name: "HomePage",
        components: {
            todoList
        }
    }
</script>