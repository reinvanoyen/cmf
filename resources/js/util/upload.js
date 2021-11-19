"use strict";

import api from "../api/api";

let isProcessing = false;
let queue = [];

export default {
    queue(file, directoryId, cb = () => {}) {

        queue.push([file, directoryId, cb]);

        if (! isProcessing) {
            this.process();
        }
    },
    process() {

        if (! queue.length) {
            return;
        }

        isProcessing = true;
        let item = queue[0];

        api.media.upload(item[0], item[1]).then(response => {

            isProcessing = false;
            queue.shift();
            this.process();

            let file = response.data.data;
            item[2](file);
        }, error => {

            isProcessing = false;
            queue.shift();
            this.process();
        });
    },
    isDone() {
        return (queue.length === 0);
    }
};
