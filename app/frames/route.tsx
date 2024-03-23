/* eslint-disable react/jsx-key */
// yo its a hackathon, we're not gonna be perfect
// @ts-nocheck
import { createFrames, Button } from "frames.js/next";
import { farcasterHubContext, openframes } from "frames.js/middleware";
import { getXmtpFrameMessage, isXmtpFrameActionPayload } from "frames.js/xmtp";

const planetData = [
  // Example planet data
  { uuid: '1', visualType: 'type1', energyLevel: 100, ownerFid: 1, flared: false, favorited: false },
  { uuid: '2', visualType: 'type2', energyLevel: 80, ownerFid: 2, flared: true, favorited: false },
  { uuid: '3', visualType: 'type3', energyLevel: 100, ownerFid: 1, flared: false, favorited: true },
  // Add more planets as needed
];

const frames = createFrames({
  basePath: "/frames",
  initialState: {
    pageIndex: 0,
  },
  middleware: [
    farcasterHubContext({
      hubHttpUrl: process.env.farcasterhubUrl || "http://localhost:3010/",
    }),
    openframes({
      clientProtocol: {
        id: "xmtp",
        version: "2024-02-09",
      },
      handler: {
        isValidPayload: (body: JSON) => isXmtpFrameActionPayload(body),
        getFrameMessage: async (body: JSON) => {
          if (!isXmtpFrameActionPayload(body)) {
            return undefined;
          }
          const result = await getXmtpFrameMessage(body);
 
          return { ...result };
        },
      },
    }),
  ],
});


const handleRequest = frames(async (ctx) => {
  const pageIndex = Number(ctx.searchParams.pageIndex || 0);
  const fid = Number(ctx.message?.castId?.fid || 1);
  console.log(ctx);
  console.log(`my fid is ${fid}`);
  const appUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
  console.log(appUrl);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (pageIndex === 0) {
    return {
      image: (
        <div tw="relative flex flex-col justify-center items-center w-full h-full bg-black">
          {/* Centered text */}
          <svg viewBox="0 0 382 200" tw="w-full h-full">
            {/* Red border */}
            {/* <rect x="0" y="0" width="382" height="200" fill="none" stroke="red" stroke-width="4" /> */}
            {/* Stars */}
            {Array.from({ length: 50 }).map((_, index) => (
              <circle
                key={index}
                cx={Math.random() * 382} // Random position in x within the viewBox
                cy={Math.random() * 200} // Random position in y within the viewBox
                r={Math.random() * 2 + 1} // Random radius between 1 and 3
                fill="white"
              />
            ))}
            {/* Trees with varied spacing and size */}
            {Array.from({ length: 10 }).map((_, index) => {
              // Randomize the tree size and position
              let baseX = Math.random() * (382 - 20);
              let treeHeight = 20 + Math.random() * 30; // Base height between 20 and 50
              let treeWidth = treeHeight / 2;
              return (
                <polygon
                  key={index}
                  points={`${baseX},${200} ${baseX + treeWidth},${200 - treeHeight} ${baseX + 2 * treeWidth},${200}`}
                  fill="darkgreen"
                />
              );
            })}
          </svg>
          <div tw="absolute inset-0 flex justify-center items-center text-3xl text-gray-500">
            Dark Forest Frames
          </div>
        </div>
      ),
      imageOptions: {
          width: 382, // Width maintaining the aspect ratio 1.91:1
          height: 200, // Height maintaining the aspect ratio 1.91:1
      },
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
          This is {planetOwnerText} planet with uuid of {currentPlanet.uuid}. It has energy {currentPlanet.energyLevel}.
        </div>
      </div>
    ),
    buttons,
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
