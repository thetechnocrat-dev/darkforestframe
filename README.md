<img width="506" alt="Screenshot 2024-03-24 at 2 48 49 AM" src="https://github.com/thetechnocrat-dev/darkforestframe/assets/9427089/8ce5c1e3-6128-4e9b-b9e7-0320ee092ffa">

“If I destroy you, what business is it of yours?”
― Liu Cixin, The Dark Forest

Rules:
1) Every player starts the game with three planets.
2) Planets build up energy over time (equation 1).
3) A player can send some or all of a planets energy to another planet (equation 3).
4) Depending on the energy of the receiving planet it will either gain or lose energy (equation 4).
5) At the end of the game the player with the most energy summed across their 3 planets wins (equation 5).
6) All of a player's planets start out hidden from other players.
7) At anypoint in the game a player can choose to reveal all of their planets for rest of the game.
8) A planet is also revealed when it sends energy to a planet that is not yours.

Equation 1) 
```
E = ln(t + 1)
```
`E` is the current energy of the planet.
`t` is the number of epochs since game start.
`ln` is the natural log.

Equation 3)
```
E' = E - E"
```
`E'` is the new energy of the planet after sending energy.
`E` is the current enery of the planet.
`E"` is the energy sent.

Equation 4)
```
E' = E (+ or -) E"
B = (1 / j) * integral_0_to_j(ln(t + 1))
```
A planet with energy `E` recieving energy `E"` from another planet gains the energy received if its energy is less than boundary `B` and loses energy if it is more than `B`.
`t` is the current epoch.
`E'` is the new energy.

Equation 5)
```
P = E1 + E2 + E3
```
`P` is the number of points and `E1` is the energy from planet 1 and so on.

"In the cosmos, no matter how fast you are, someone will be faster; no matter how slow you are, someone will be slower."
- Liu Cixin, Death's End

