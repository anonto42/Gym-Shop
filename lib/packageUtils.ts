
export const convertToPlainObject = (obj: unknown): unknown => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj !== 'object') {
        return obj;
    }

    // Handle Date objects
    if (obj instanceof Date) {
        return obj.toISOString();
    }

    // Handle Mongoose documents
    if ('toJSON' in obj && typeof obj.toJSON === 'function') {
        return obj.toJSON();
    }

    // Handle ObjectId
    if ('_id' in obj && obj._id && typeof obj._id.toString === 'function') {
        const result: Record<string, unknown> = { ...obj };
        result._id = obj._id.toString();
        return result;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => convertToPlainObject(item));
    }

    // Handle regular objects
    const plainObj: Record<string, unknown> = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            plainObj[key] = convertToPlainObject((obj as Record<string, unknown>)[key]);
        }
    }
    return plainObj;
};

export const hasToJSON = (obj: unknown): obj is { toJSON: () => unknown } => {
    return typeof obj === 'object' && obj !== null && 'toJSON' in obj && typeof (obj as Record<string, unknown>).toJSON === 'function';
};