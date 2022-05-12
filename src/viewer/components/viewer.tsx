import { ReactElement } from "react";

interface ViewerProps {
    id?: string;
}

function Viewer(props: ViewerProps): ReactElement {

    return (
        <canvas width={window.innerWidth} height={window.innerHeight} style={{
            backgroundImage: 'url("./Galaxy.jpg")', backgroundSize: "cover"
        }} id={props.id ?? "viewer"} ></canvas>
    );

}

export { Viewer };