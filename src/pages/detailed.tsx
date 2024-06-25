import * as React from "react";
import { graphql } from "gatsby";
import Navigation from "../components/Navigation";
import { determineStyle } from "../utils/styleUtils";
import PokemonCard from "../components/PokemonCard";
import TrainerCard from "../components/TrainerCard";

type EdgeNode = {
  node: {
    name?: string;
    stage: string;
    nature?: string;
    biome?: string;
    abilityDropDown?: string;
    passive?: string;
    caught?: boolean;
    trainerId?: string;
    trainerType?: string;
  };
};

const DetailedPage: React.FC<{ data: any }> = ({ data }) => {
  const stageToWaveMap: { [key: string]: string[] } = {};
  const pokemonIdMap: { [name: string]: string } = {};

  data.allGoogleSpreadsheetSprites.edges.forEach((edge: any) => {
    const { name, pokemonId } = edge.node;
    pokemonIdMap[name] = pokemonId;
  });

  data.allGoogleSpreadsheetFollowAlong.edges.forEach((edge: any) => {
    const { wave, waveNumber } = edge.node;
    if (!wave.startsWith("Wave")) {
      if (!stageToWaveMap[waveNumber]) {
        stageToWaveMap[waveNumber] = [];
      }
      stageToWaveMap[waveNumber].push(wave);
    }
  });

  const groupedEdges: EdgeNode[][] = [];
  let currentGroup: EdgeNode[] = [];
  data.allGoogleSpreadsheetDetailed.edges.forEach(
    (edge: any, index: number) => {
      const hasSteps = stageToWaveMap[edge.node.stage]?.length > 0;
      // double battle grouping
      if (edge.node.name && !hasSteps) {
        if (currentGroup.length > 0) {
          currentGroup.push(edge);
        } else {
          groupedEdges.push([edge]);
        }
      } else {
        // single battle
        if (currentGroup.length > 0) {
          groupedEdges.push(currentGroup);
          currentGroup = [];
        }
        currentGroup.push(edge);
      }
    }
  );
  if (currentGroup.length > 0) {
    groupedEdges.push(currentGroup);
  }

  data.allGoogleSpreadsheetTrainers.edges.forEach((edge: EdgeNode) => {
    const index = parseInt(edge.node.stage) - 1;
    groupedEdges.splice(index, 0, [
      {
        node: edge.node,
      },
    ]);
  });

  return (
    <div>
      <Navigation />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <table style={{ width: "80%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                Steps
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                Pokémon
              </th>
            </tr>
          </thead>
          <tbody>
            {groupedEdges.map((group, groupIndex) => {
              if (group[0].node.trainerId && group[0].node.trainerType) {
                return (
                  <tr
                    key={groupIndex}
                    style={{ borderBottom: "1px solid #ccc" }}
                  >
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {group[0].node.stage}
                    </td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {stageToWaveMap[group[0].node.stage]?.map((wave, idx) => (
                        <React.Fragment key={idx}>
                          <span style={determineStyle(wave)}>{wave}</span>
                          <br />
                        </React.Fragment>
                      ))}
                    </td>
                    <td>
                      <TrainerCard
                        trainerId={group[0].node.trainerId}
                        trainerType={group[0].node.trainerType}
                      />
                    </td>
                  </tr>
                );
              }
              if (group.length === 2) {
                // Double battle
                return (
                  <tr
                    key={groupIndex}
                    style={{ borderBottom: "1px solid #ccc" }}
                  >
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {stageToWaveMap[group[0].node.stage]?.map((wave, idx) => (
                        <React.Fragment key={idx}>
                          <span style={determineStyle(wave)}>{wave}</span>
                          <br />
                        </React.Fragment>
                      ))}
                    </td>
                    <td>
                      <PokemonCard
                        node={group[0].node}
                        pokemonIdMap={pokemonIdMap}
                      />
                      <PokemonCard
                        node={group[1].node}
                        pokemonIdMap={pokemonIdMap}
                      />
                    </td>
                  </tr>
                );
              } else {
                return group.map((edge: any, index: number) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ccc" }}>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      {stageToWaveMap[edge.node.stage]?.map((wave) => (
                        <React.Fragment key={wave}>
                          <span style={determineStyle(wave)}>{wave}</span>
                          <br />
                        </React.Fragment>
                      )) || null}
                    </td>
                    <td>
                      <PokemonCard
                        node={edge.node}
                        pokemonIdMap={pokemonIdMap}
                      />
                    </td>
                  </tr>
                ));
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const query = graphql`
  query {
    allGoogleSpreadsheetDetailed {
      edges {
        node {
          name
          stage
          nature
          biome
          abilityDropDown
          caught
          passive
        }
      }
    }
    allGoogleSpreadsheetSprites {
      edges {
        node {
          name
          pokemonId
        }
      }
    }
    allGoogleSpreadsheetFollowAlong {
      edges {
        node {
          wave
          waveNumber
        }
      }
    }
    allGoogleSpreadsheetTrainers {
      edges {
        node {
          stage
          trainerId
          trainerType
        }
      }
    }
  }
`;

export default DetailedPage;
