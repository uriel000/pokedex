const fetchPokemon = async () => {
  var apiUrl = `https://pokeapi.co/api/v2/pokemon?limit=500`;

  try {
    const response = await fetch(apiUrl);
    const results = await response.json();
    cardViewList(results.results);
    searchPoke(results.results);
  } catch (error) {
    console.log("Error:", error);
  }
};
fetchPokemon();

const pokemonDetails = async (url, callback) => {
  try {
    const response = await fetch(url);
    const results = await response.json();
    callback(results);
    // console.log(results);
  } catch (error) {
    console.log("Error:", error);
  }
};

//  Card view list in the homepage
const cardViewList = (pokemon) => {
  const viewList = document.querySelector(".pokemon-list");

  pokemon.forEach((poke) => {
    const pokeName = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
    const card = document.createElement("div");
    card.classList.add("pokemon");
    card.setAttribute("data-number", pokeID(poke.url));
    card.setAttribute("data-name", pokeName);
    card.setAttribute("data-bs-toggle", "modal");
    card.setAttribute("data-bs-target", "#exampleModal");

    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("details");

    const pokePic = document.createElement("img");
    pokemonDetails(poke.url, (imahe) => {
      pokePic.src = imahe.sprites.front_default;
    });

    const id = document.createElement("p");
    id.textContent = pokeID(poke.url);

    const name = document.createElement("p");
    name.textContent = pokeName;
    const pokeType = document.createElement("p");
    pokemonDetails(poke.url, (details) => {
      const types = details.types.map((data) => {
        return data.type.name;
      });
      pokeType.textContent = "Type: " + types.join(", ");
    });

    const url = document.createElement("p");
    url.textContent = poke.url;
    url.style.display = "none";

    card.appendChild(pokePic);
    detailsDiv.appendChild(id);
    detailsDiv.appendChild(name);
    detailsDiv.appendChild(pokeType);
    detailsDiv.appendChild(url);

    card.appendChild(detailsDiv);
    viewList.appendChild(card);
  });

  please();
};

// Search a pokemon
const searchPoke = (pokemon) => {
  const input = document.querySelector("input");

  input.addEventListener("input", () => {
    if (!input.value) {
      clearDisplay();
      cardViewList(pokemon);
    } else if (!isNaN(input.value)) {
      const id = input.value;
      const nUrl = `https://pokeapi.co/api/v2/pokemon/${id}/`;
      const specialPoke = pokemon.filter((poke) => {
        return poke.url.includes(nUrl);
      });
      clearDisplay();
      cardViewList(specialPoke);
    } else {
      const pokeName = input.value.toLowerCase();
      const specialPoke = pokemon.filter((poke) => {
        return poke.name.toLowerCase().includes(pokeName);
      });
      clearDisplay();
      cardViewList(specialPoke);
    }
  });
};

const clearDisplay = () => {
  const container = document.querySelector(".pokemon-list");
  container.innerHTML = "";
};

const pokeID = (url) => {
  const slash = url.split("/");
  return slash[slash.length - 2];
};

const btn = document.querySelector("#sortBtn");
btn.addEventListener("click", () => {
  const list = document.querySelector(".pokemon-list");
  const sortType = document.querySelector('input[name="sortBy"]:checked').value;
  const items = Array.from(list.getElementsByClassName("pokemon"));

  if (sortType === "ID") {
    items.sort(function (a, b) {
      var aValue = parseInt(a.getAttribute("data-number"));
      var bValue = parseInt(b.getAttribute("data-number"));
      return aValue - bValue;
    });
  } else if (sortType === "NAME") {
    items.sort(function (a, b) {
      var aValue = a.getAttribute("data-name");
      var bValue = b.getAttribute("data-name");
      return aValue.localeCompare(bValue);
    });
  }
  items.forEach(function (item) {
    list.appendChild(item);
  });
});

// Pop up modals

const getWeakness = (pokeType) => {
  const pokemonWeaknesses = {
    normal: "Rock, Ghost, Steel",
    fighting: "Flying, Poison, Psychic, Bug, Ghost, Fairy",
    flying: "Rock, Steel, Electric",
    poison: "Poison, Ground, Rock, Ghost, Steel",
    ground: "Flying, Bug, Grass",
    rock: "Fighting, Ground, Steel",
    bug: "Fighting, Flying, Poison, Ghost, Steel, Fire, Fairy",
    ghost: "Normal, Dark",
    steel: "Steel, Fire, Water, Electric",
    fire: "Rock, Fire, Water, Dragon",
    water: "Water, Grass, Dragon",
    grass: "Flying, Poison, Bug, Steel, Fire, Grass, Dragon",
    electric: "Ground, Grass, Electric, Dragon",
    psychic: "Steel, Psychic, Dark",
    ice: "Steel, Fire, Water, Ice",
    dragon: "Steel, Fairy",
    dark: "Fighting, Dark, Fairy",
    fairy: "Poison, Steel, Fire",
  };

  return `<p><b>${pokeType}</b>: ${pokemonWeaknesses[pokeType]}</p>`;
};

const please = () => {
  const pokemonCards = document.querySelectorAll(".pokemon");
  pokemonCards.forEach((card) => {
    card.addEventListener("click", () => {
      const data = card.getAttribute("data-number");
      const url = `https://pokeapi.co/api/v2/pokemon/${data}`;
      pokemonDetails(url, (data) => {
        const pokemon = {
          id: data.id,
          name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
          abilities: data.abilities.map((ability) => ability.ability.name),
          image: data.sprites.front_default,
          types: data.types.map((type) => type.type.name),
          weakness: data.types.map((type) => getWeakness(type.type.name)),
          stats: data.stats,
          height: data.height,
          weight: data.weight,
        };
        modal(pokemon);
      });
    });
  });
};

const modal = (pokemon) => {
  const id = document.querySelector(".modal-header #pokeId");
  const img = document.querySelector(".modal-poke img");
  const name = document.querySelector(".modal-poke #name");
  const type = document.querySelector(".modal-poke #types");
  const ability = document.querySelector(".modal-poke #ability");
  const height = document.querySelector(".modal-poke #height");
  const weight = document.querySelector(".modal-poke #weight");
  const statistics = document.querySelector(".modal-poke .stats");
  const weakness = document.querySelector(".modal-poke .weak");
  const title = document.querySelector(".modal-header #titleName");

  img.src = pokemon.image;
  id.textContent = pokemon.id;

  name.textContent = pokemon.name;
  type.innerHTML = "<b>Type: </b>" + pokemon.types.join(", ");
  ability.innerHTML = "<b>Ability: </b>" + pokemon.abilities.join(", ");
  height.innerHTML = "<b>Height: </b>" + pokemon.height;
  weight.innerHTML = "<b>Weight: </b>" + pokemon.weight;
  weakness.innerHTML = pokemon.weakness.join("");

  document.querySelector(".stats").innerHTML = "";
  pokemon.stats.forEach((stat) => {
    const s = document.createElement("p");
    s.innerHTML = `<b>${stat.stat.name}:</b> ${stat.base_stat}`;
    statistics.appendChild(s);
  });
};
