import React, {Component} from "react";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

class AdviceContent extends Component {
    advices = [
        {"id": 1, "content": "Porada 1"},
        {"id": 2, "content": "Porada 2"},
        {"id": 3, "content": "Porada 3"},
        {
            "id": 4,
            "content": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
        },
    ];

    constructor(props) {
        super(props);
        this.state = {
            advice: {content: 'Żyj lepiej z tymi poradami'},
            adviceDrawn: false,
        }
    }

    drawTheAdvice = () => {
        let randomAdviceIndex = Math.floor(Math.random() * this.advices.length);
        this.setState({
            advice: this.advices[randomAdviceIndex],
            adviceDrawn: true,
        })
    };

    render() {
        return (
            <div>
                <h1>{this.state.advice.content}</h1>
                <Button onClick={this.drawTheAdvice} variant={"primary"}>
                    Losuj poradę
                </Button>
                {this.state.adviceDrawn &&
                <Link className="btn btn-success" to={{
                    pathname: '/advices/' + this.state.advice.id
                }}>Szczegóły</Link>
                }
            </div>)
    }
}

export default AdviceContent;
