const { doc, getDoc, setDoc } = require("firebase/firestore");
const fs = require('fs');

const { db } = require("../../data/firebase");
let userCache = require('../../data/user-cache.json')


async function getUser(userId) {
    if (userCache[userId]) return;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (await !userSnap.exists()) {
        const user = {
            userId: {
                money: 100,
            }
        }
        await setDoc(userRef, user.userId);
    }
    userCache[userId] = userSnap.data();
    //await fs.writeFileSync('data/user-cache.json', JSON.stringify(userCache, null, 2))
}


async function setUser(userId) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef,userCache[userId]);
}

module.exports = { getUser, setUser }