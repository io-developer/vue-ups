import Vue from "vue";
import Ups from "../src/Ups";
//import store from "./store";

new Vue({
    el: "#ups",
    render: h => h(Ups, {
        props: {
            staticClass: 'block block--bg',
            mode: 'test',
            websocketUri: 'ws://home-nas.iodev:3560/ws',
            reinitInterval: 300 * 1000,
            eventLimit: 17,
            locale: 'ru_RU',
        },
    }),
});