import { Filter, ObjectId } from "mongodb";

export function byId<T>(id: string): Filter<T> {
    return { _id: new ObjectId(id) } as unknown as Filter<T>;
}

/**
 * MongoDB always returns `_id` as a real ObjectId, never a string, no matter
 * what the TS type claims. Anything that compares/keys on `_id` in memory
 * (Map/Set lookups, not just JSON responses) needs this normalization first.
 */
export function withStringId<T extends { _id?: unknown }>(doc: T): T {

    return {
        ...doc,
        _id: doc._id !== undefined && doc._id !== null ? String(doc._id) : doc._id
    };

}
