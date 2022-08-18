export const getPathWithoutFile = fullPath => {
    return fullPath && fullPath.split('/').slice(0, -1).join('/');
};

export const getRelativePath = (fullPath, sitePath) => {
    return getPathWithoutFile(fullPath.split(`${sitePath}/`)[1]) || '';
};

export const getSite = fullPath => {
    return fullPath && fullPath
        .split('/')
        .slice(0, 3)
        .join('/');
};

export const getDetailedPathArray = fullPath => {
    return fullPath ?
        fullPath
            .split('/')
            .slice(1)
            .reduce((prev, current, currentIndex) => {
                return [
                    ...prev,
                    prev[currentIndex - 1] ? `${prev[currentIndex - 1]}/${current}` : `/${current}`
                ];
            }, [])
            .slice(2) :
        [];
};

export const set = (target, path, value) => {
    const splitRes = path.split('.');

    let key;
    let current = target;
    while ((splitRes.length > 1) && (key = splitRes.shift())) {
        if (!current[key]) {
            current[key] = {};
        }

        current = current[key];
    }

    current[splitRes.shift()] = value;
};

export const isObject = item => {
    return (item && typeof item === 'object' && !Array.isArray(item));
};

export const mergeDeep = (target, ...sources) => {
    if (!sources.length) {
        return target;
    }

    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, {[key]: {}});
                }

                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }

    return mergeDeep(target, ...sources);
};

export const arrayValue = value => {
    return (typeof value === 'string') ? value.split(',') : value;
};

export const booleanValue = v => typeof v === 'string' ? v === 'true' : Boolean(v);

export const toArray = value => (Array.isArray(value) ? value : [value]);

export const getCanDisplayItemParams = node => {
    const folders = ['jnt:contentFolder', 'jnt:folder'];
    const params = {};

    if (folders.includes(node.primaryNodeType.name)) {
        params.folderNode = node;
    } else {
        params.selectionNode = node;
    }

    return params;
};
