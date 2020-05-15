import React, {Component} from "react";
import {Button} from "react-bootstrap";

class TipContent extends Component {
    tips = ["Porada 1", "Porada 2", "Porada 3", "Porada 4", "Porada 5"];

    constructor(props) {
        super(props);
        this.state = {
            tip: 'Żyj lepiej z tymi poradami'
        }
    }

    drawTheAdvice = () => {
        let randomTipIndex = Math.floor(Math.random() * this.tips.length);
        this.setState({
            tip: this.tips[randomTipIndex]
        })
    };

    render() {

        return (
            <div>
                <h1>{this.state.tip}</h1>
                <Button onClick={this.drawTheAdvice} variant={"primary"}>Losuj poradę</Button>
            </div>)
    }
}

export default TipContent;
