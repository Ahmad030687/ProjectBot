const API_URL = "https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json?pageSize=10";
const FB_URL = "https://admin-91a73-default-rtdb.firebaseio.com/history";

async function runSync() {
    try {
        console.log(">>> 🛰️  CONNECTING TO WINGO API...");
        const response = await fetch(`${API_URL}&t=${Date.now()}`);
        
        if (!response.ok) throw new Error(`API Status: ${response.status}`);
        
        const result = await response.json();
        const rounds = result.data.list;

        console.log(`>>> 📂 FOUND ${rounds.length} ROUNDS. SYNCING TO FIREBASE...`);

        for (const round of rounds) {
            const issue = round.issueNumber;
            
            // Firebase PUT request to save data automatically
            const fbResponse = await fetch(`${FB_URL}/${issue}.json`, {
                method: 'PUT',
                body: JSON.stringify(round),
                headers: { 'Content-Type': 'application/json' }
            });

            if (fbResponse.ok) {
                console.log(`>>> ✅ SYNCED: Period ${issue} | Result: ${round.number}`);
            }
        }
        console.log(">>> 🔥 DATABASE UPDATED SUCCESSFULLY.");
    } catch (error) {
        console.error(">>> ❌ CRITICAL ERROR:", error.message);
        process.exit(1);
    }
}

runSync();
