const shallowEqual = (object1, object2) => {
    /* guess(value) , answer(object) */
    console.log("guess: " + object1);
    console.log("answer: " + object2);
    const keys1 = Object.keys(object1);
    console.log("keys1: " + keys1.length);
    const keys2 = Object.keys(object2);
    console.log("keys2: " + keys2.length);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        console.log("object1[key]: " + object1[key]);
        console.log("object2[key]: " + object2[key]);
        console.log("typeof object1[key]: " + typeof object1[key]);
        console.log("typeof object2[key]: " + typeof object2[key]);
        if (object1[key].toLowerCase() !== object2[key].toLowerCase()) {
            console.log("false");
            return false;
        }
    }
    return true;
}
export {shallowEqual};