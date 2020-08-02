import Ups from "./src/Ups";
import locales from "./src/locales.js";
import VueFilterDateFormat from '@vuejs-community/vue-filter-date-format';

export default (function() {
    const create = function(Vue, VueI18n, el, locale = 'en', opts = {}) {
        let dateFormatOpts = locale in locales.date ? locales.date[locale] : locales.date.en;
        Vue.use(VueFilterDateFormat, dateFormatOpts);
        Vue.use(VueI18n);
        
        const i18n = new VueI18n({
            locale: locale,
            messages: locales.messages,
        });
        
        new Vue({
            i18n,
            el,
            render: h => h(Ups, opts),
        });
    };

    // global export
    window.iodev = window.iodev || {};
    window.iodev.VueUps = {
        create: create,
        Component: Ups,
        locales,
    };

    return window.iodev.VueUps;
})();
