document.addEventListener("DOMContentLoaded", function () {
    // event listener on #burger-button to toggle class 'open' on #burger-menu
    document
        .getElementById("burger-button")
        .addEventListener("click", function () {
            document.getElementById("burger-menu").classList.toggle("open");
            document.getElementById("burger-button").classList.toggle("open");
        });

    // :event listener on input #guess add a treaming underscore after each keypress
    document.getElementById("guess").addEventListener("input", function () {
        document.getElementById("input-display").innerHTML = this.value + "_";
    });

    // :event listener on #guess-button to call checkGuess function
    document
        .getElementById("guess-button")
        .addEventListener("click", checkGuess);

    const words = [
        "apple",
        "banana",
        "car",
        "dog",
        "elephant",
        "flower",
        "giraffe",
        "house",
        "ice",
        "jellyfish",
        "kangaroo",
        "lion",
        "monkey",
        "notebook",
        "orange",
        "penguin",
        "queen",
        "rabbit",
        "snake",
        "tiger",
        "umbrella",
        "vase",
        "watermelon",
        "xylophone",
        "yak",
        "zebra",
    ];
    const word = words[Math.floor(Math.random() * words.length)];
    document.getElementById("answer").innerHTML = word.replace(/./g, "_ ");

    function addHintToBoard(hint, similarity) {
        const hints = document.getElementById("hints-board");
        const span = document.createElement("span");
        span.innerHTML = hint + " " + similarity;
        const green = Math.floor(255 * similarity);
        const red = Math.floor(255 * (1 - similarity));
        span.style.color = "rgb(" + red + "," + green + ",0)";
        hints.appendChild(span);
    }

    async function getSimilarity(guess) {
        const url =
            "https://twinword-text-similarity-v1.p.rapidapi.com/similarity/?text1=" +
            word +
            "&text2=" +
            guess;
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Key":
                    "3db6d07c70msh12ec029488c55bep1c5f2djsn1b6fa45b1501",
                "X-RapidAPI-Host": "twinword-text-similarity-v1.p.rapidapi.com",
            },
        };

        try {
            const response = await fetch(url, options);
            const result = await response.text();
            console.log(result);
            const similarity = JSON.parse(result).similarity * 10;
            addHintToBoard(guess, similarity);
        } catch (error) {
            console.error(error);
        }
    }

    async function checkGuess() {
        const guess = document.getElementById("guess").value;
        document.getElementById("guess").value = "";
        document.getElementById("input-display").innerHTML = "_";
        if (guess === word) {
            document.getElementById("answer").innerHTML = word;
            document.getElementById("answer").style.color = "green";
        } else {
            await getSimilarity(guess);
        }
    }
});
