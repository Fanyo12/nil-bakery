const challengeStore = {};

export function saveChallenge(userId, challenge) {
    challengeStore[userId] = challenge;
}

export function getChallenge(userId) {
    return challengeStore[userId];
}

export function deleteChallenge(userId) {
    delete challengeStore[userId];
}