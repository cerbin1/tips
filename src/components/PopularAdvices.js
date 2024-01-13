import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

function PopularAdvices() {
    const mostPopularAdvices = ["Porada 1", "Porada 2", "Porada 3", "Porada 4", "Porada 5"];

    return (
        <div>
            <h4>Najpopularniejsze</h4>
            <ListGroup>
                {mostPopularAdvices.map((advice, index) => {
                    return <ListGroup.Item key={index}>{advice}</ListGroup.Item>
                }
                )}
            </ListGroup>
        </div>)
}

export default PopularAdvices;
