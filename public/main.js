import Vue from "vue";
import Ups from "../src/Ups.vue";
//import store from "./store";

new Vue({
    el: "#ups",
    render: h => h(Ups, {
        staticClass: 'block block--bg',
    }),
});