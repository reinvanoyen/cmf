"use strict";

import api from "../api/api";
import Manager from "../core/messaging/manager";

let isProcessing = false;
let queue = [];
let id = 0;

export default {
    queueMultiple(files, directoryId, cb = () => {}) {
        let fileEntries = [];
        for (let i = 0 ; i < files.length; i++) {
            let file = files[i];
            id++;
            queue.push([id, file, directoryId, cb]);
            fileEntries.push({
                id: id,
                size: file.size,
                filename: file.name
            });
        }
        Manager.trigger('media.upload.queuedMultiple', {
            files: fileEntries
        });
        if (! isProcessing) {
            this.process();
        }
    },
    queue(file, directoryId, cb = () => {}) {
        id++;
        queue.push([id, file, directoryId, cb]);
        Manager.trigger('media.upload.queued', {
            id: id,
            size: file.size,
            filename: file.name
        });
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

        this.processChunkUpload(item[1], item[2], filename => {

            Manager.trigger('media.upload.start', {
                id: item[0],
                size: item[1].size,
                filename: filename
            });

        }, (progress) => {

            Manager.trigger('media.upload.progress', {
                id: item[0],
                progress
            });

        }, (file) => {

            isProcessing = false;
            queue.shift();
            this.process();

            Manager.trigger('media.upload.success', {
                id: item[0],
                file: file
            });

            item[3](file);

        }, () => {

            Manager.trigger('media.upload.fail', {
                id: item[0]
            });

            isProcessing = false;
            queue.shift();
            this.process();
        });
    },
    isDone() {
        return (queue.length === 0);
    },
    processChunkUpload(file, directoryId, startCb, progressCb, successCb, errorCb) {

        let filePath;
        let chunkSize = 524288;
        let chunkCount = Math.ceil(file.size / chunkSize);
        let currChunk = 0;
        let filename = file.name;

        let start, end;

        let sendChunk = () => {

            start = currChunk * chunkSize;
            if (start > file.size) {
                start = end + 1;
            }
            //end = start + (chunkSize - 1) >= file.size ? file.size : start + (chunkSize - 1);
            end = start + chunkSize >= file.size ? file.size : start + chunkSize;
            let status = currChunk === 0 ? 'start' : (currChunk === chunkCount ? 'end' : 'progress');
            if (status === 'start') {
                startCb(filename);
            }

            api.media.uploadChunk(
                status,
                filename,
                (filePath ? filePath : null),
                file.slice(start, end),
                directoryId
            ).then(response => {

                let data = response.data;

                if (data.status === 'created') {
                    filePath = data.path;
                }

                if (++currChunk <= chunkCount) {
                    let progress = (currChunk / chunkCount) * 100;
                    progressCb(progress);
                    sendChunk();
                } else {
                    successCb(data.data);
                }
            }, error => {
                errorCb();
            });
        };

        sendChunk();
    },
};
