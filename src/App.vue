<template>
    <div id="nav">
        <router-link to="/">Home</router-link>
        <router-link to="/archive">Archive</router-link>
        <router-link to="/about">About</router-link>
        <router-view/>
    </div>
</template>

<script>
import { useStore } from "vuex";

export default {
    beforeCreate() {
        const store = useStore();
        store.commit('loadStore');
    }
}
</script>

<style>

</style>
