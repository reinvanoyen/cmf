"use strict";

import util from "./core/ui/util";
import i18n from "./util/i18n";

export default function init() {

    const showConfirm = () => {
        util.confirm({
            title: i18n.get('snippets.offline_title'),
            text: i18n.get('snippets.offline_text'),
            confirmButtonText: i18n.get('snippets.offline_confirm'),
            confirm: () => {
                if (! window.navigator.onLine) {
                    util.i18nNotify('snippets.offline_notification');
                    showConfirm();
                    return;
                }
                util.i18nNotify('snippets.offline_online_notification');
            }
        });
    };

    window.addEventListener('offline', (event) => {
        showConfirm();
    });
}
