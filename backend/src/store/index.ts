import { Errors, MyError } from "../helpers/errors";
import {open} from "lmdb";

const myDB = open({
    path: 'store',
    compression: true
});

class LMDB {
    async store<T>(key: string, data: T) {
        try {
            await myDB.put(key, data);
        } catch(err) {
            console.log("Error storing =>", err);
            throw new MyError(Errors.LMDB_STORE);
        }
    }

    async read(key: string): Promise<string | undefined> {
        try {
            const text = await myDB.get(key);
            if (text) {
                return text.toString();
            } else {
                return undefined;
            }
        } catch(err) {
            console.log("Error reading from store", err);
            throw new MyError(Errors.LMDB_READ);
        }
    }
}

const lmdb = new LMDB();
export default lmdb;