export default class AppError extends Error {

    constructor(
        message: string,
        public readonly options: {
            readonly metadata?: {
                [key: string]: any;
            },
        } = {
            }
    ) {
        super(message);
        this.name = "AppError";
        Object.setPrototypeOf(this, new.target.prototype);
    }

    static areEqual(lhs?: any, rhs?: any): boolean {
        if (typeof lhs === "string" && rhs instanceof AppError)
            return rhs.message === lhs;
        else
            return lhs?.message === rhs;
    }
}