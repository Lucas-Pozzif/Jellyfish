const { doc, getDoc, setDoc, collection, getCountFromServer } = require("firebase/firestore");

const { db } = require("../../data/firebase");
let ideaCache = require("../../data/cache/ideas.json");

async function getIdea(ideaId) {
	if (ideaCache[ideaId]) return;

	const ideaRef = doc(db, "ideas", ideaId);
	const ideaSnap = await getDoc(ideaRef);

	if (!ideaSnap.exists()) return

	ideaCache[ideaId] = ideaSnap.data();
	console.log(ideaCache[ideaId])
}

async function addIdea(idea) {
	const ideaColRef = collection(db, "ideas");
	const ideaColSnap = await getCountFromServer(ideaColRef);
	const ideaId = ideaColSnap
		.data()
		.count
		.toString();
	const ideaRef = doc(db, 'ideas', ideaId)
	await setDoc(ideaRef, idea);
	return ideaId
}

module.exports = { getIdea, addIdea };
