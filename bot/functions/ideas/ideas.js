const { doc, getDoc, setDoc, collection, getCountFromServer } = require("firebase/firestore");

const { db } = require("../../data/firebase");
let ideaCache = require("../../data/cache/ideas.json");

async function getIdea(ideaId) {

	const ideaRef = doc(db, "ideas", ideaId);
	const ideaSnap = await getDoc(ideaRef);

	ideaCache[ideaId] = ideaSnap.data();
}

async function setIdea(idea) {
	const ideaColRef = collection(db, "ideas");
	const ideaColSnap = await getCountFromServer(ideaColRef);
	const ideaId = await ideaColSnap
		.data()
		.count
		.toString();
	const ideaRef = doc(db, 'ideas', ideaId)
	console.log(ideaRef, idea)
	await setDoc(ideaRef, idea);
	return await ideaId
}

module.exports = { getIdea, setIdea };
