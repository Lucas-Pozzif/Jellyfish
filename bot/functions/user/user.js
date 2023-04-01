const { doc, getDoc, setDoc } = require("firebase/firestore");
const { db } = require("../../data/firebase");
const { userCache } = require("../..");


async function getUser(userId) {
    if (userCache == {}) return userCache;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (await !userSnap.exists()) {
        const user = {
            money: 100,
        }
        await setDoc(userRef, user);
    }
    return await userSnap.data();
}


async function setUser(userId) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef);

}

module.exports = { getUser, setUser }