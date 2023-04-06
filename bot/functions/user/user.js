const { doc, getDoc, setDoc } = require("firebase/firestore");

const { db } = require("../../data/firebase");
let userCache = require('../../data/cache/users.json');
const { Client, GatewayIntentBits } = require("discord.js");

const c = new Client({
    intents: [
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ],
})

async function getUser(userId) {
    if (userCache[userId]) return;

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        const user = {
            userId: {
                name: c.users.cache.get(userId).username,
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
    if (!userCache[userId].name) userCache[userId].name = '';
    if (!userCache[userId].money) userCache[userId].money = 100;
    if (!userCache[userId].ideas) userCache[userId].ideas = [];

}

module.exports = { getUser, setUser }