import React from "react";

const TipCategory = (props) => {

    return (
        <div>
            Category id: {props.match.params.categoryId}
        </div>
    )
};

export default TipCategory;
