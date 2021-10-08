"use strict";

export default {
    notify(text) {

        if (! this.notificationStackEl) {
            this.notificationStackEl = document.createElement('div');
            this.notificationStackEl.classList.add('notification-stack');
            document.body.appendChild(this.notificationStackEl);
        }

        let el = document.createElement('div');
        el.classList.add('notification');
        el.textContent = text;
        this.notificationStackEl.appendChild(el);

        setTimeout(() => {
            el.classList.add('notification--hidden');
            setTimeout(() => this.notificationStackEl.removeChild(el), 250);
        }, 3000);
    },
    copyText(text, cb) {
        let textArea = document.createElement('textarea');
        textArea.value = text;

        // Avoid scrolling to bottom
        textArea.style.top = 0;
        textArea.style.left = 0;
        textArea.style.position = 'fixed';

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {
            let copy = document.execCommand('copy');
            if (copy) {
                cb();
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy text to clipboard', err);
        }

        document.body.removeChild(textArea);
    }
};
