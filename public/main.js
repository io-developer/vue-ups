import Vue from "vue";
import Ups from "../src/Ups";
//import store from "./store";

new Vue({
    el: "#ups",
    render: h => h(Ups, {
        props: {
            staticClass: 'block block--bg',
            mode: 'prod',
            locale: 'ru_RU',
            modelOptions: {
                websocketUri: 'ws://home-nas.iodev:3560/ws',
                reinitInterval: 300 * 1000,
                eventLimit: 17,
            },
        },
    }),
});