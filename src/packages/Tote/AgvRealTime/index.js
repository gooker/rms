import React, { Component } from 'react'

export default class AgvRealTime extends Component {
    componentDidMount() {
        //console.log(this.props.match.params);
        console.log(this.props.history);
    }
    render() {
        console.log(this.props);
        return (
            <div>
                12345
            </div>
        )
    }
}
