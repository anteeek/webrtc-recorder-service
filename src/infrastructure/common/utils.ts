export function copyObject<T>(obj: T): Readonly<T> {
    return (
        Object.assign({}, obj)
    );
}

export function copySealObject<T>(obj: T): Readonly<T> {
    return (
        Object.seal(
            Object.assign({}, obj)
        )
    );
}



export async function sleep(t: number) {
    return new Promise(r => setTimeout(r, t));
}

export async function waitFor(
    checker: (() => boolean) | (() => Promise<boolean>),
    maxTime: number
) {
    if (await checker())
        return;

    return new Promise<void>((resolve, reject) => {
        let time = 0;

        const i = setInterval(async () => {
            if (await checker()) {
                clearInterval(i);
                return resolve();
            }
            time += 250;
            if (time >= maxTime) {
                clearInterval(i);
                return reject();
            }
        }, 250);
    })
}
