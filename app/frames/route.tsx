/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";

const planetData = [
  // Example planet data
  { uuid: '1', visualType: 'type1', energyLevel: 100, ownerFid: 1, flared: false, favorited: false },
  { uuid: '2', visualType: 'type2', energyLevel: 80, ownerFid: 2, flared: true, favorited: false },
  { uuid: '3', visualType: 'type3', energyLevel: 100, ownerFid: 1, flared: false, favorited: true },
  // Add more planets as needed
];

export const frames = createFrames({
  basePath: "/frames",
  initialState: {
    pageIndex: 0,
  },
});

const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const fid = Number(ctx.message?.castId?.fid || 1);
  console.log(ctx);
  console.log(`my fid is ${fid}`);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (pageIndex === 0) {
    // Logic for the home frame
    const homeImageUrl = `${baseUrl}/home.png`;

    return {
      image: (
        <div tw="flex flex-col">
          <img width={300} height={200} src={homeImageUrl} alt="Home" />
          <div tw="flex">
            Dark Forest Frames: Hide World
          </div>
        </div>
      ),
      buttons: [
        <Button action="post" target={{ query: { pageIndex: 0 } }}>Search</Button>,
        <Button action="post" target={{ query: { pageIndex: (pageIndex + 1) } }}>→</Button>
      ],
    };
  }

  // Continue with the regular frame logic for other pages
  const sortedPlanets = planetData
    .sort((a, b) => a.uuid.localeCompare(b.uuid))
    .sort((a, b) => b.favorited - a.favorited)
    .sort((a, b) => (a.ownerFid === fid ? -1 : b.ownerFid === fid ? 1 : 0));
  
  const totalPages = sortedPlanets.length + 1; // one page for each planet and one for the home frame

  const planetIndex = (pageIndex - 1) % sortedPlanets.length;  // account for 0 being the home frame
  const currentPlanet = sortedPlanets[planetIndex];
  const imageUrl = `${baseUrl}/planets/${currentPlanet.visualType}.png`;
  const buttons = [];

  if (currentPlanet.ownerFid === fid) {
    buttons.push(
      <Button action="post" target={{ query: { pageIndex: 0 } }}>Home</Button>,
    );
  }

  buttons.push(
    <Button action="post" target={{ query: { pageIndex: pageIndex - 1 } }}>←</Button>,
    <Button action="post" target={{ query: { pageIndex: (pageIndex + 1) % totalPages } }}>→</Button>,
  );

  if (currentPlanet.ownerFid !== fid) {
    buttons.push(
      <Button action="post" target={{ query: { pageIndex: pageIndex } }}>Flare</Button>,
      <Button action="post" target={{ query: { pageIndex: pageIndex } }}>Attack/Defend</Button>,
    );
  } else {
    if (currentPlanet.flared) {
      buttons.push(
        <Button action="post" target={{ query: { pageIndex: (pageIndex) % sortedPlanets.length } }}>View</Button>
      );
    }
  }

  const planetOwnerText = currentPlanet.ownerFid === fid ? "your" : `fid ${currentPlanet.ownerFid}'s`;

  return {
    image: (
      <div tw="flex flex-col">
        <img width={300} height={200} src={imageUrl} alt="Planet Image" />
        <div tw="flex">
          This is {planetOwnerText} planet with uuid of {currentPlanet.uuid}. It's energy is {currentPlanet.energyLevel}.
        </div>
      </div>
    ),
    buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
