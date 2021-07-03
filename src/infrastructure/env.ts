enum RequiredEnvKeys {
    OUTPUTS_DIR = "OUTPUTS_DIR",
}

type TEnv = {
    [key in RequiredEnvKeys]: string;
};

export function readEnv(): TEnv {
    let result: Partial<TEnv> = {};

    Object.values(RequiredEnvKeys).forEach((key) => {
        result[key] = process.env[key];

        if (!result[key]) throw new Error(`No ${key} env variable set.`);
    });

    return result as TEnv;
}
