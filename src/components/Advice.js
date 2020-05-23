import React, {Component} from "react";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

class Advice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
        }
    }

    changeAdvice = () => {
        this.setState({
            content: 'Lorem Ipsum has been the industrys standard dummy text ever since the 1500s'
        })
    };

    render() {
        return (
            <div>
                <Container fixed>
                    <Paper>{this.state.content}</Paper>
                    <Button onClick={this.changeAdvice}>Klikinj</Button>
                </Container>
            </div>
        )
    }
}

export default Advice;