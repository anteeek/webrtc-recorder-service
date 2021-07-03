import config from "../config";

const takenPorts = new Set<number>();

const portManager = {

    getPort(): number {
        do {
            const result = randomInt(config.MEDIA_SERVER.MIN_PORT, config.MEDIA_SERVER.MAX_PORT);

            if (takenPorts.has(result) === false)
                return result;
        } while (true);
    },

    freePort(port: number) {
        takenPorts.delete(port);
    }

};

function randomInt(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default portManager;