const { doc, getDoc, setDoc } = require("firebase/firestore");

const { db } = require("../../data/firebase");
let userCache = require('../../data/cache/users.json');

async function getUser(userId) {
    if (userCache[userId]) return;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
        const user = {
            userId: {
                money: 100,
                ideas: []
            }
        }
        await setDoc(userRef, user.userId);
        userCache[userId] = user.userId;
    } else {
        userCache[userId] = userSnap.data();
        userUpdater(userId)
    }
}


async function setUser(userId) {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, userCache[userId]);
}

function userUpdater(userId) {
    if (!userCache[userId].money) userCache[userId].money = 100;
    if (!userCache[userId].ideas) userCache[userId].ideas = [];

}

module.exports = { getUser, setUser }