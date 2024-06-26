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

    // :event listener to prevent form submission on enter keypress
    document
        .getElementById("guess-form")
        .addEventListener("submit", function (e) {
            e.preventDefault();
        });

    // :event listener on #guess-button to call checkGuess function
    document
        .getElementById("guess-button")
        .addEventListener("click", checkGuess);

    document.getElementById("guess").addEventListener("focus", function () {
        console.log("keyboard opened");
        document.getElementById("hints-title").style.display = "none";
        const body = document.getElementsByTagName("body")[0];
        body.style.height = window.innerHeight + "px";
    });

    document.getElementById("guess").addEventListener("blur", function () {
        document.getElementById("hints-title").style.display = "block";
        const body = document.getElementsByTagName("body")[0];
        body.style.height = "100vh";
    });

    // :event listener on input:focus hide hints-title et reduce body height
    document.getElementById("guess").addEventListener("focus", function () {
        // prevent default scroll
        window.scrollTo(0, 0);
    });

    // :event listener on input:blur show hints-title et reset body height
    document.getElementById("guess").addEventListener("blur", function () {
        document.getElementById("hints-title").style.display = "block";
        const body = document.getElementsByTagName("body")[0];
        body.style.height = "100vh";
    });

    const words = [
        "apple",
        // "banana",
        "car",
        // "dog",
        // "elephant",
        // "flower",
        // "giraffe",
        // "house",
        // "ice",
        // "jellyfish",
        // "kangaroo",
        // "lion",
        // "monkey",
        // "notebook",
        // "orange",
        // "penguin",
        // "queen",
        // "rabbit",
        // "snake",
        // "tiger",
        // "umbrella",
        // "vase",
        // "watermelon",
        // "xylophone",
        // "yak",
        // "zebra",
    ];
    const word = words[Math.floor(Math.random() * words.length)];
    console.log(word);
    document.getElementById("answer").innerHTML = word.replace(/./g, "_ ");

    function addHintToBoard(hint, similarity) {
        const hints = document.getElementById("hints-board");
        const span = document.createElement("span");
        span.innerHTML = hint;
        const blue = Math.floor(255 * similarity);
        const green = 130;
        const red = green;
        // const red = Math.floor(255 * (1 - similarity));
        span.style.color = "rgb(" + red + "," + green + "," + blue + ")";
        span.classList.add("similarity:" + similarity);
        // add toltip show similarity
        span.addEventListener("mouseover", function () {
            const tooltip = document.createElement("span");
            tooltip.innerHTML = (similarity * 100).toFixed(1) + "%";
            tooltip.style.position = "absolute";
            tooltip.style.backgroundColor = "rgba(0,0,0,0.5)";
            tooltip.style.color = "white";
            tooltip.style.padding = "5px";
            tooltip.style.borderRadius = "5px";
            tooltip.style.zIndex = "1";
            this.appendChild(tooltip);
        });
        span.addEventListener("mouseout", function () {
            this.removeChild(this.children[0]);
        });

        // add hint to board in order of similarity
        let added = false;
        for (let i = 0; i < hints.children.length; i++) {
            if (
                parseFloat(hints.children[i].classList[0].split(":")[1]) <
                similarity
            ) {
                hints.insertBefore(span, hints.children[i]);
                added = true;
                break;
            }
        }
        if (!added) {
            hints.appendChild(span);
        }
    }
    function revealAnswer() {
        window.scrollTo(0, 0);
        document.getElementById("answer").innerHTML = word;
        document.getElementById("answer-banner").classList.add("reveal");
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
            const similarity = JSON.parse(result).similarity;
            const leanedSimilarity = (
                similarity * 5 > 1 ? 0.9 : similarity * 5
            ).toFixed(2);
            addHintToBoard(guess, leanedSimilarity);
        } catch (error) {
            console.error(error);
        }
    }

    async function checkGuess() {
        const guess = document
            .getElementById("guess")
            .value.toLowerCase()
            .trim();
        document.getElementById("guess").value = "";
        document.getElementById("input-display").innerHTML = "_";
        if (guess === word) {
            revealAnswer();
        } else {
            document.getElementById("score-value").innerHTML =
                parseInt(document.getElementById("score-value").innerHTML) - 10;
            await getSimilarity(guess);
        }
    }
});
