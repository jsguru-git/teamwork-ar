import { Cords } from "../../../video/types";

const Commands = {
    send: (name: string): void => {
        const command = `${name}`;
    },

    getCommand: (name: string, cords: Cords) => {
        const command = `${name} (${cords.x}, ${cords.y})`
        return command;
    }
}

export default Commands;