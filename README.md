<img width="506" alt="Screenshot 2024-03-24 at 2 48 49 AM" src="https://github.com/thetechnocrat-dev/darkforestframe/assets/9427089/8ce5c1e3-6128-4e9b-b9e7-0320ee092ffa">

“If I destroy you, what business is it of yours?”
― Liu Cixin, The Dark Forest

Ruleset
1) Every player starts the game with three planets hidden from all other players.
2) Planets build up energy over time (equation 1).
3) At anypoint in the game a player can choose to reveal all of their planets for rest of the game.
4) A player can send energy from a planet they own to their other planets or to any other player's revealed planets (equation 2).
5) A planet is also revealed for rest of the game when it sends energy to a planet that is not yours.
6) At the end of the game the player with the most energy summed across their 3 planets wins (equation 3).

Equation 1) 
```
E = ln(t + 1)
```
* `E` is the current energy of the planet.
* `t` is the number of epochs since game start.
* `ln` is the natural log.

Equation 2)

a)
```
B = (1 / j) * integral_0_to_j(ln(t + 1))
```
* `B` is the threshhold variable of the below sigmoid function. 

b) 
```
E_1' = E_1 * σ (E_1 − B)
```
* `E_1'` is the new energy of the planet after sending energy.
* `E_1` is the current energy of the planet sending energy.
* `σ` is the sigmoid function.
* `B` is the the threshold equation.

c) 
```
E_2' = E_2 * σ (E_2 − B)
```
* `E_2'` is the new energy of the planet receiving the energy.
* `E_2` is the current energy of the planet receiving energy.
* `σ` is the sigmoid function.
* `B` is the the threshold equation.

Equation 3)
```
P = E1 + E2 + E3
```
* `P` is the number of points and `E1` is the energy from planet 1 and so on.

<img width="572" alt="Screenshot 2024-03-23 at 9 24 46 AM" src="https://github.com/thetechnocrat-dev/darkforestframe/assets/9427089/f318b3e5-e126-46e4-bfa7-4fb4d642fefa">

"In the cosmos, no matter how fast you are, someone will be faster; no matter how slow you are, someone will be slower."
- Liu Cixin, Death's End

