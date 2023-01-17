import React from 'react';

class InlineFrame extends React.Component {

    static defaultProps = {
        id: 0,
        path: {},
        data: {},
        source: ''
    };

    constructor(props) {
        super(props);

        this.state = {
            height: 0,
            source: this.props.data[this.props.id+'_inline-frame'] || ''
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data[this.props.id+'_inline-frame'] !== prevProps.data[this.props.id+'_inline-frame']) {
            this.setState({
                source: this.props.data[this.props.id+'_inline-frame']
            });
        }
    }

    handleSubmit(data) {
        // do nothing
    }

    getData(data) {
        // do nothing
    }

    autoHeight(e) {
        this.setState({
            height: e.target.contentWindow.document.documentElement.scrollHeight
        });
    }

    render() {
        return (
            <div className="inline-frame">
                <iframe src={this.state.source} onLoad={this.autoHeight.bind(this)} style={{height: this.state.height+'px'}}></iframe>
            </div>
        );
    }
}

export default InlineFrame;
