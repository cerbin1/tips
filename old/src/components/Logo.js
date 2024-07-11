import { Image } from "react-bootstrap";
import advicesLogo from "../resources/advices.jpg";
import React from "react";

const Logo = () => {

    return (
        <Image className={"img-fluid"} src={advicesLogo}
            fluid />
    )
};
export default Logo;
