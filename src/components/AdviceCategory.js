import React from "react";

class AdviceCategory extends React.Component {
    componentDidMount() {

    }

    render() {


        return (
            <div>
                Category id: {this.props.match.params.categoryId}
            </div>
        )
    }
}

export default AdviceCategory;
