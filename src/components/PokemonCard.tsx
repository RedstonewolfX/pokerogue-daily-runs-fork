import * as React from "react";
// @ts-ignore
import caughtImage from "../images/caught.png";
// @ts-ignore
import uncaughtImage from "../images/uncaught.png";

function createPoly(
  health: number,
  attack: number,
  defense: number,
  spAtk: number,
  spDef: number,
  speed: number
): string {
  return (
    "polygon(50% " +
    (50 - Math.floor((Math.max(2, health + 2) / 33) * 50)) +
    "%, " +
    (50 + Math.floor((Math.max(2, attack + 2) / 33) * 50)) +
    "% " +
    (50 - Math.floor((Math.max(2, attack + 2) / 33) * 25)) +
    "%, " +
    (50 + Math.floor((Math.max(2, defense + 2) / 33) * 50)) +
    "% " +
    (50 + Math.floor((Math.max(2, defense + 2) / 33) * 25)) +
    "%, 50% " +
    (50 + Math.floor((Math.max(2, speed + 2) / 33) * 50)) +
    "%, " +
    (50 - Math.floor((Math.max(2, spDef + 2) / 33) * 50)) +
    "% " +
    (50 + Math.floor((Math.max(2, spDef + 2) / 33) * 25)) +
    "%, " +
    (50 - Math.floor((Math.max(2, spAtk + 2) / 33) * 50)) +
    "% " +
    (50 - Math.floor((Math.max(2, spAtk + 2) / 33) * 25)) +
    "%)"
  );
}

const PokemonCard: React.FC<{
  //TODO: make partial node type for Pokemon from detailed page
  node: any;
  pokemonIdMap: { [name: string]: string };
}> = ({ node: pokemon, pokemonIdMap }) => {
  const getGenderCircleStyle = (gender: string) => {
    switch (gender) {
      case "♂":
        return { backgroundColor: "#228DF2" };
      case "♀":
        return { backgroundColor: "#EF737E" };
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between">
        <div className="flex-1 flex justify-center">
          <h1 className="bg-white text-black px-2 py-1 rounded-full font-bold">
            {pokemon.name}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          {pokemon.stage ? (
            <div className="bg-gray-200 text-black text-xl font-bold px-3 py-1 rounded-full">
              {pokemon.stage}
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex items-center" style={{ marginTop: "-50px" }}>
        <img
          src={`https://wiki.pokerogue.net/_media/starters:sprites:${
            pokemonIdMap[pokemon.name]
          }.png`}
          alt={pokemon.name}
          style={{ height: "200px" }}
        />
        {(pokemon.gender === "♂" || pokemon.gender === "♀") && (
          <div
            style={{
              ...getGenderCircleStyle(pokemon.gender),
              width: "50px",
              height: "50px",
              borderRadius: "100%",
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "5px",
            }}
          >
            {pokemon.gender}
          </div>
        )}
        <img
          src={pokemon.caught ? caughtImage : uncaughtImage}
          alt={pokemon.caught ? "Caught" : "Uncaught"}
          style={{ height: "50px", marginLeft: "10px" }}
        />
        <div className="hexagon-wrapper">
          <div className="hexagon">
            <div
              className="ivgon"
              style={{
                clipPath: createPoly(
                  pokemon.hp,
                  pokemon.attack,
                  pokemon.defense,
                  pokemon.spAtk,
                  pokemon.spDef,
                  pokemon.speed
                ),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="info-card">
        <div className="grid grid-container mt-4">
          <div className="grid-item-card" style={{ gridArea: "biome" }}>
            <div className="title-card">
              <h2 className="title-text">Biome</h2>
            </div>
            <div className="rounded-lg mt-2">
              {pokemon.biome != "???" ? (
                <img
                  src={`https://wiki.pokerogue.net/_media/en:biomes:en_${pokemon.biome}_bg.png`}
                  alt={pokemon.biome}
                  className="w-full object-cover rounded-lg"
                />
              ) : (
                <p className="text-center">???</p>
              )}
            </div>
          </div>
          <div className="grid-item-card" style={{ gridArea: "ability" }}>
            <div className="title-card">
              <h2 className="title-text">Ability</h2>
            </div>
            <p className="ability-passive-text">
              {pokemon.abilityDropDown
                ? pokemon.abilityDropDown
                    .split("_")
                    .map(
                      (word: any) =>
                        word.charAt(0).toUpperCase() +
                        word.slice(1).toLowerCase()
                    )
                    .join(" ")
                : ""}
            </p>
          </div>
          <div className="grid-item-card" style={{ gridArea: "passive" }}>
            <div className="title-card">
              <h2 className="title-text">Passive</h2>
            </div>
            <p className="ability-passive-text">{pokemon.passive}</p>
          </div>
          <div className="grid-item-card" style={{ gridArea: "nature" }}>
            <div className="title-card">
              <h2 className="title-text">Nature</h2>
            </div>
            {pokemon.nature && (
              <div className="flex items-center">
                <div className="nature-name nature-items">
                  {pokemon.nature.split(/\s+/)[0]}
                </div>
                <div className="nature-modifiers nature-items">
                  <div className="increase-stat">
                    {pokemon.nature.split(/\s+/)[1] +
                      pokemon.nature.split(/\s+/)[2]}
                  </div>
                  <div className="decrease-stat">
                    {pokemon.nature.split(/\s+/)[3] +
                      " " +
                      pokemon.nature.split(/\s+/)[4]}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
