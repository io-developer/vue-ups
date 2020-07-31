import Vue from "vue";
import VueI18n from 'vue-i18n';
import Ups from "../src/Ups";
import locales from "../src/locales.js";

Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: 'en',
    messages: locales,
});

new Vue({
    i18n,
    el: "#ups",
    render: h => h(Ups, {
        props: {
            staticClass: 'block block--bg',
        //  mode: 'test',
            modelOptions: {
            //  websocketUri: 'ws://home-nas.iodev:3560/ws',
                websocketUri: 'ws://localhost:8001/ws',
                reinitInterval: 300 * 1000,
                eventLimit: 20,
            },
        },
    }),
});