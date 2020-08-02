import Vue from "vue";
import VueI18n from 'vue-i18n';
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

import Ups from "../src/Ups";
import locales from "../src/locales.js";

let locale = 'en';

let dateFormatOpts = locale in locales.date ? locales.date[locale] : locales.date.en;
Vue.use(VueFilterDateFormat, dateFormatOpts);

Vue.use(VueI18n);
const i18n = new VueI18n({
    locale: locale,
    messages: locales.messages,
});

new Vue({
    i18n,
    el: "#ups",
    render: h => h(Ups, {
        props: {
            staticClass: 'block block--bg',
            title: "Line",
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