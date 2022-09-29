const container = document.querySelector(".container");
const searchInput = container.querySelector("input");
const infoText = container.querySelector(".info-text");
const synonyms = container.querySelector(".synonyms .list");
let audio;
const volumeIcon = container.querySelector(".word i");
const removeIcon = container.querySelector(".search .fa-times");

searchInput.addEventListener("keyup", (e) => {
  if (e.key == "Enter" && e.target.value) fetchApi(e.target.value);
});

function fetchApi(word) {
  container.classList.remove("active");
  infoText.style.color = "#000";
  infoText.innerHTML = `searching the meaning of <span>"${word}"</span`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word));
}

function data(result, word) {
  if (result.title) {
    infoText.innerHTML = `Can't find the the meaning of <span>"${word}"</span.Please try to search another word`;
  } else {
    console.log(result);
    container.classList.add("active");
    let definitions = result[0].meanings[0].definitions[0];
    let phonetics = `${result[0].meanings[0].partOfSpeech} ${result[0].phonetics[0].text}`;

    document.querySelector(".word p").innerText = result[0].word;

    if (result[0].phonetics[0].text === undefined) {
      phonetics = `${result[0].meanings[0].partOfSpeech}`;
    }
    document.querySelector(".word span").innerText = phonetics;
    document.querySelector(".meaning span").innerText = definitions.definition;

    audio = new Audio(result[0].phonetics[0].audio);

    if (result[0].meanings[0].synonyms[0] === undefined) {
      synonyms.parentElement.style.display = "none";
    } else {
      synonyms.parentElement.style.display = "block";
      synonyms.innerHTML = "";
      for (let i = 0; i < 5; i++) {
        let tag = `<span onclick=search('${result[0].meanings[0].synonyms[i]}')>${result[0].meanings[0].synonyms[i]},</span>`;
        synonyms.insertAdjacentHTML("beforeend", tag);
      }
    }
  }
}

function search(word) {
  container.classList.remove("active");
  searchInput.value = word;
  fetchApi(word);
}
volumeIcon.addEventListener("click", () => {
  audio.play();
});
removeIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  container.classList.remove("active");
  infoText.innerHTML =
    "Type a word and press enter to get meaning,example,pronunction,and synonyms of that typed word";
  infoText.style.color = "#9a9a9a";
});
