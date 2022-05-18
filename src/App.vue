<template>
    <div>
        <nav id="nav">
            <router-link to="/">Home</router-link>
            <router-link to="/archive">Archive</router-link>
            <router-link to="/about">About</router-link>  
        </nav>
        <router-view/>
    </div>
</template>

<script>
    import { useStore } from "vuex";

    export default {
        beforeCreate() {
            const store = useStore();
            //initializing our store & checking local storage.
            store.commit('loadStore');
        }
    }
</script>

<style>
    body {
        display: flex;
        justify-content: center;
    }

    #root {
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin: 1rem;
        width: 400px; 
    }

    #nav {
        display: flex;
        justify-content: space-evenly;
    }

    #nav a {
        font-weight: 700;
        font-size: 1.5rem;
        margin: 0 1rem 0 0;
        text-decoration: none;
        background: rgba(238, 238, 238, 0.598);
        border-radius: 10px;
        padding: 0.25rem 0.75rem;
    }

    #nav a:hover {
        background: rgba(134, 134, 134, 0.598);
    }

    input[type="checkbox"] {
        width: auto;
        margin: 0 0.5rem 0 0;
    }

    a.router-link-exact-active {
        color: #0028ff;
    }

    input[type="submit"] {
        background: #0028ff;
        color: white;
        border-radius: 10px;
        padding: 0.5rem 1rem;
        border: none;
        box-shadow: 0 5px 10px #0428ff7a;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.25s ease-out;
        cursor: pointer;
    }

    input[type="submit"]:hover {
        background: #3600ff;
        margin: 0 0.5rem 0 0;
    }

    input {
        border-radius: 10px;
        box-sizing: border-box;
        border: 1px solid #aaa;
        font-size: 1rem;
        width: 100%;
        padding: 0.5rem 1rem;
    }

</style>