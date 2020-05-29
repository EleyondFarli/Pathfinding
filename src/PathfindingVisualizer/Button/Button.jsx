import React, { Component } from 'react';

import './Button.css';

export default class Button extends Component {
    render() {
        const {
            isGreen,
            isBlue,
            isRed,
            isGray,
            isBlack
        } = this.props;
        const extraClassName = isGreen
            ? 'button1'
            : isBlue
                ? 'button2'
                : isRed
                    ? 'button3'
                    : isGray
                        ? 'button4'
                        : isBlack
                            ?'button5'
                            : '';

        return (
            <div
                className={`button ${extraClassName}`}
                ></div>
        );
    }
}