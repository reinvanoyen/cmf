"use strict";

export default {
    overlay() {
        // Create overlay
        let overlayEl = document.createElement('div');
        overlayEl.classList.add('overlay');
        document.body.appendChild(overlayEl);
        return overlayEl;
    },
    prompt(opts) {

        // Options
        let title = opts.title || '';
        let text = opts.text || '';
        let defaultValue = opts.defaultValue || '';
        let confirmButtonText = opts.confirmButtonText || 'Confirm';
        let cancelButtonText = opts.cancelButtonText || 'Cancel';
        let confirmCb = opts.confirm;
        let cancelCb = opts.cancel;

        // Build Confirm HTMLElement
        let promptEl = document.createElement('form');
        promptEl.classList.add('prompt');
        promptEl.setAttribute('action', '');

        let promptHeaderEl = document.createElement('div');
        promptHeaderEl.classList.add('prompt__header');
        promptHeaderEl.textContent = title;

        let promptContentEl = document.createElement('div');
        promptContentEl.classList.add('prompt__content');

        if (text) {
            let promptTextEl = document.createElement('div');
            promptTextEl.classList.add('prompt__text');
            promptTextEl.textContent = text;
            promptContentEl.appendChild(promptTextEl);
        }

        let promptInputEl = document.createElement('input');
        promptInputEl.classList.add('prompt__input');
        promptInputEl.setAttribute('input', 'text');
        promptInputEl.setAttribute('value', defaultValue);
        promptContentEl.appendChild(promptInputEl);

        let promptFooterEl = document.createElement('div');
        promptFooterEl.classList.add('prompt__footer');

        let confirm = e => {
            close();
            if (confirmCb) {
                confirmCb(promptInputEl.value);
            }
            e.preventDefault();
        }

        let promptCancelBtnEl = this.button(cancelButtonText, e => {
            close();
            if (cancelCb) {
                cancelCb();
            }
        });

        let promptConfirmBtnEl = this.button(confirmButtonText, confirm);

        promptEl.addEventListener('submit', confirm);

        promptCancelBtnEl.classList.add('button--secondary');

        promptFooterEl.appendChild(promptCancelBtnEl);
        promptFooterEl.appendChild(promptConfirmBtnEl);

        promptEl.appendChild(promptHeaderEl);
        promptEl.appendChild(promptContentEl);
        promptEl.appendChild(promptFooterEl);

        // Overlay
        let overlayEl = this.overlay();
        overlayEl.appendChild(promptEl);

        // Focus the input field
        promptInputEl.focus();

        let close = () => document.body.removeChild(overlayEl);
    },
    confirm(opts) {

        // Options
        let title = opts.title || '';
        let text = opts.text || '';
        let confirmButtonText = opts.confirmButtonText || 'Confirm';
        let cancelButtonText = opts.cancelButtonText || 'Cancel';
        let confirmCb = opts.confirm;
        let cancelCb = opts.cancel;

        // Build Confirm HTMLElement
        let confirmEl = document.createElement('div');
        confirmEl.classList.add('confirm');

        let confirmHeaderEl = document.createElement('div');
        confirmHeaderEl.classList.add('confirm__header');
        confirmHeaderEl.textContent = title;

        let confirmContentEl = document.createElement('div');
        confirmContentEl.classList.add('confirm__content');
        confirmContentEl.textContent = text;

        let confirmFooterEl = document.createElement('div');
        confirmFooterEl.classList.add('confirm__footer');

        let confirmCancelBtnEl = this.button(cancelButtonText, e => {
            close();
            if (cancelCb) {
                cancelCb();
            }
        });

        let confirmConfirmBtnEl = this.button(confirmButtonText, e => {
            close();
            if (confirmCb) {
                confirmCb();
            }
        });

        confirmCancelBtnEl.classList.add('button--secondary');

        confirmFooterEl.appendChild(confirmCancelBtnEl);
        confirmFooterEl.appendChild(confirmConfirmBtnEl);

        confirmEl.appendChild(confirmHeaderEl);
        confirmEl.appendChild(confirmContentEl);
        confirmEl.appendChild(confirmFooterEl);

        // Overlay
        let overlayEl = this.overlay();
        overlayEl.appendChild(confirmEl);

        confirmConfirmBtnEl.focus();

        let close = () => document.body.removeChild(overlayEl);
    },
    button(text, onClick = null) {

        let buttonEl = document.createElement('button');
        buttonEl.setAttribute('type', 'button');
        buttonEl.classList.add('button');
        buttonEl.textContent = text;

        if (onClick) {
            buttonEl.addEventListener('click', onClick);
        }

        return buttonEl;
    },
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
