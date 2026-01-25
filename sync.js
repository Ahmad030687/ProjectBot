const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageSize=10";
const FB_URL = "https://admin-91a73-default-rtdb.firebaseio.com/history";

async function runSync() {
    try {
        console.log(">>> 🛰️ FETCHING DATA FROM API...");
        const response = await fetch(`${API_URL}&t=${Date.now()}`);
        const result = await response.json();
        const rounds = result.data.list;

        for (const round of rounds) {
            const issue = round.issueNumber;
            
            // Push to Firebase (PUT avoids duplicates)
            const fbResponse = await fetch(`${FB_URL}/${issue}.json`, {
                method: 'PUT',
                body: JSON.stringify(round),
                headers: { 'Content-Type': 'application/json' }
            });

            if (fbResponse.ok) {
                console.log(`>>> ✅ LOGGED: Period ${issue}`);
            }
        }
        console.log(">>> 🔥 FIREBASE SYNC COMPLETE.");
    } catch (error) {
        console.error(">>> ❌ ERROR:", error.message);
        process.exit(1);
    }
}

runSync();
