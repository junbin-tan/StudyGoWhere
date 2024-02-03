export default function getAllLeafKeysDeep(obj) {
    const keysWithParents = [];

    function recurse(obj, parentKey = '') {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const currentKey = parentKey ? `${parentKey}.${key}` : key;

                if (typeof obj[key] === 'object') {
                    recurse(obj[key], currentKey); // Recursively call the function for nested objects
                } else {
                    keysWithParents.push(currentKey);
                }
            }
        }
    }

    recurse(obj);
    return keysWithParents;
}

// EXAMPLE OF HOW IT WOULD WORK
// const myObject = {
//     a: 1,
//     b: {
//         c: 2,
//         d: {
//             e: 3,
//         },
//     },
// };
//
// console.log(getAllKeysDeep(myObject));
// // ["a", "b.c", "b.d.e"]