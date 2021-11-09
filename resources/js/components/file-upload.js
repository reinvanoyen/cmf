import React from 'react';
import dom from "../util/dom";
import api from "../api/api";

class FileUpload extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            busy: [],
            done: []
        };
    }

    handleChange(e) {
        let files = e.target.files;

        for (let i = 0; i < files.length; i++) {
            this.upload(files[i]);
        }
    }

    upload(file, directoryId = null) {

        let busy = this.state.busy;

        busy.push({
            filename: file.name
        });

        this.setState({
            busy: busy
        });

        let formData = new FormData();
        formData.append('file', file);

        // Load the data from the backend (with id as param)
        api.execute.post(this.props.path, this.props.id,'upload', formData).then(response => {

            let file = response;
            this.done(file);
        });
    }

    done(file) {
        let done = this.state.done;

        done.unshift(file);

        this.setState({
            done: done
        });
    }

    renderDone() {
        return (
            <div className={'uploads'}>
                {this.state.done.map((done, i) => {
                    return (
                        <div className={'uploads__thumb'} key={i}>
                            <img src={'storage/'+done.filename} />
                            {done.mime_type}
                        </div>
                    );
                })}
            </div>
        );
    }

    renderBusy() {
        return (
            <div className={'uploads'}>
                {this.state.busy.map((upload, i) => {
                    return (
                        <div className={'uploads__bar'} key={i}>
                            {upload.filename}
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        return (
            <div className={'file-upload'}>
                {this.renderDone()}
                {this.renderBusy()}
                <input
                    type={'file'}
                    id={dom.inputId('file')}
                    name={'file'}
                    multiple={true}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        );
    }
}

export default FileUpload;
