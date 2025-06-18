
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

exports.dailyTaskReset = functions.pubsub.schedule('0 0 * * *')
    .timeZone('Africa/Nairobi')
    .onRun(async () => {
        const packages = ['silver', 'gold', 'diamond', 'ruby', 'emerald'];
        for (const pack of packages) {
            const poolSnap = await db.collection('taskPool').doc(pack).get();
            const allTasks = poolSnap.data().tasks || [];
            const count = {
                silver: 2, gold: 3, diamond: 5, ruby: 7, emerald: 10
            }[pack] || 2;
            const shuffled = allTasks.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);
            await db.collection('packages').doc(pack).set({
                currentTasks: selected
            }, { merge: true });
        }
        return null;
    });
