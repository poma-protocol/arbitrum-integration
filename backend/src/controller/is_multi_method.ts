import { Errors, MyError } from "../helpers/errors";

export default function isMultiLevelFunction(method: string): string[] {
    try {
        return method.split("->");
    } catch(err) {
        throw new MyError(Errors.NOT_CHECK_IF_MULTI_LEVEL);
    }
}