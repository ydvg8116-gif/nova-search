// ==========================================
// NOVA SEARCH
// ==========================================

console.log("Nova Search JavaScript Loaded");


const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const voiceBtn =
    document.getElementById("voiceBtn");

const themeBtn =
    document.getElementById("themeBtn");


// ==========================================
// SEARCH HISTORY
// ==========================================

const historyContainer =
    document.getElementById("historyContainer");

const clearHistoryBtn =
    document.getElementById("clearHistoryBtn");


// Get saved history
let searchHistory =
    JSON.parse(
        localStorage.getItem("novaSearchHistory")
    ) || [];


// ==========================================
// DISPLAY HISTORY
// ==========================================

function displayHistory() {

    if (!historyContainer) {
        return;
    }


    if (searchHistory.length === 0) {

        historyContainer.innerHTML = `

            <p class="empty-history">
                No searches yet
            </p>

        `;

        return;
    }


    historyContainer.innerHTML =

        searchHistory.map(
            (item, index) => {

                return `

                    <div class="history-item">

                        <span
                            class="history-query"
                            onclick="searchFromHistory(${index})"
                        >
                            🔍 ${item}
                        </span>


                        <button
                            class="delete-history"
                            onclick="deleteHistory(${index})"
                            title="Delete"
                        >
                            🗑️
                        </button>

                    </div>

                `;

            }
        ).join("");
}


// ==========================================
// ADD SEARCH TO HISTORY
// ==========================================

function addToHistory(query) {

    // Remove duplicate
    searchHistory =
        searchHistory.filter(
            item => item !== query
        );


    // Add latest search at top
    searchHistory.unshift(query);


    // Keep only latest 10
    searchHistory =
        searchHistory.slice(0, 10);


    // Save
    localStorage.setItem(
        "novaSearchHistory",
        JSON.stringify(searchHistory)
    );


    displayHistory();
}


// ==========================================
// DELETE ONE HISTORY
// ==========================================

function deleteHistory(index) {

    searchHistory.splice(index, 1);


    localStorage.setItem(
        "novaSearchHistory",
        JSON.stringify(searchHistory)
    );


    displayHistory();
}


// ==========================================
// SEARCH FROM HISTORY
// ==========================================

function searchFromHistory(index) {

    const query =
        searchHistory[index];


    searchInput.value =
        query;


    performSearch();
}


// ==========================================
// CLEAR ALL HISTORY
// ==========================================

if (clearHistoryBtn) {

    clearHistoryBtn.addEventListener(
        "click",
        function() {

            if (searchHistory.length === 0) {

                return;
            }


            const confirmClear =
                confirm(
                    "Are you sure you want to clear all Nova Search history?"
                );


            if (confirmClear) {

                searchHistory = [];


                localStorage.removeItem(
                    "novaSearchHistory"
                );


                displayHistory();
            }

        }
    );

}


// Display history when website opens
displayHistory();


// ==========================================
// SEARCH
// ==========================================

function performSearch() {

    const query =
        searchInput.value.trim();


    if (query === "") {

        searchInput.focus();

        return;
    }


    // Save query in Nova history
    addToHistory(query);


    const resultsSection =
        document.getElementById(
            "resultsSection"
        );


    const resultsContainer =
        document.getElementById(
            "resultsContainer"
        );


    const resultCount =
        document.getElementById(
            "resultCount"
        );


    resultsSection.style.display =
        "block";


    resultCount.textContent =
        "Demo results";


    resultsContainer.innerHTML = `

        <div class="result-card">

            <h3>

                <a
                    href="https://www.google.com/search?q=${encodeURIComponent(query)}"
                    target="_blank"
                >
                    Search results for "${query}"
                </a>

            </h3>


            <div class="result-url">
                google.com
            </div>


            <p class="result-description">

                Click this result to search
                "${query}" on Google.

            </p>

        </div>


        <div class="result-card">

            <h3>

                <a
                    href="https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}"
                    target="_blank"
                >
                    ${query} — Wikipedia
                </a>

            </h3>


            <div class="result-url">
                wikipedia.org
            </div>


            <p class="result-description">

                Search Wikipedia for information
                related to ${query}.

            </p>

        </div>

    `;


    resultsSection.scrollIntoView({

        behavior: "smooth"

    });

}


// ==========================================
// SEARCH BUTTON
// ==========================================

searchBtn.addEventListener(
    "click",
    performSearch
);


// ==========================================
// ENTER KEY
// ==========================================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            performSearch();

        }

    }
);


// ==========================================
// DARK MODE
// ==========================================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "dark"
        );

    }
);


// ==========================================
// VOICE SEARCH
// ==========================================

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    voiceBtn.addEventListener(
        "click",
        function() {

            recognition.start();

            voiceBtn.innerHTML =
                "🔴";

        }
    );


    recognition.onresult =
        function(event) {

            const result =
                event.results[0][0]
                    .transcript;


            searchInput.value =
                result;


            voiceBtn.innerHTML =
                "🎤";


            performSearch();

        };


    recognition.onerror =
        function(event) {

            console.log(
                "Voice error:",
                event.error
            );


            voiceBtn.innerHTML =
                "🎤";


            alert(
                "Mic error: " +
                event.error
            );

        };


    recognition.onend =
        function() {

            voiceBtn.innerHTML =
                "🎤";

        };

} else {

    voiceBtn.addEventListener(
        "click",
        function() {

            alert(
                "Voice search is not supported here. " +
                "We will run the website on localhost for mic support."
            );

        }
    );

}