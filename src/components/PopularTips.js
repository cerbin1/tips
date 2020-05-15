import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

function PopularTips() {
    const mostPopularTips = ["Porada 1", "Porada 2", "Porada 3", "Porada 4", "Porada 5"];

    return (
        <div>
            <h4>Najpopularniejsze</h4>
            <ListGroup>
                {mostPopularTips.map((tip, index) => {
                        return <ListGroup.Item key={index}>{tip}</ListGroup.Item>
                    }
                )}
            </ListGroup>
        </div>)
}

export default PopularTips;
