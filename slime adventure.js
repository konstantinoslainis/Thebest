/*
First time? Check out the tutorial game:
https://sprig.hackclub.com/gallery/getting_started

@title: slime adventure
@description: 
@author: 
@tags: ['tag1', 'tag2']
@addedOn: 2025-00-00
*/

const player = "p";
const playerAttack = "a";
const playerHurt = "P";

const slime = "s";
const slimeHurt = "S";
const slimeAttack = "A";
const wall = "w";
const door = "g";
const swordSound = tune`
60: C5~60,
60: G5~60,
60: C6~60,
`;

const slimeHitSound = tune`
80: G3~80,
80: E3~80,
80: C3~80,
`;

const playerHurtSound = tune`
100: C4~100,
100: B3~100,
`;

const gameOverSound = tune`
180: C4~180,
180: B3~180,
180: A3~180,
180: G3~180,
`;



setLegend(
  [ player, bitmap`
......00........
.....0..0.......
....0.L.L0......
....0....0......
.....0.10.......
....00..00......
...0..00..0....L
..00......00..LL
.0.0......007LLL
0..0......0.07L.
...0......0.707.
....000000......
.....0..0.......
.....0..0.......
....00..000.....
................` ],
  
  [ playerAttack, bitmap`
......00........
.....0..0.......
....0.L.L0......
....0....0......
.....0.10.......
....00..00......
...0..00..0.....
..00......00....
.0.0......00....
0..0......0.07..
...0......0.7LLL
....000000...7..
.....0..0.......
.....0..0.......
....00..000.....
................` ],
[ playerHurt, bitmap`
......33........
.....3..3.......
....3.L.L3......
....3....3......
.....3.13.......
....33..33......
...33.33.33....L
..33......33..LL
.3.3......337LLL
3..3......3.37L.
...3......3.737.
....333333......
.....3..3.......
.....3..3.......
....33..333.....
................` ],
  
[ slime, bitmap`
................
................
................
................
................
................
................
................
................
....4444444.....
..44D4D4DD44....
..4D7DDDDD444...
..4DDDDDDDD44...
..4DD00D7D4D44..
..4DDDDDDD444...
..444444444444..
...4............` ],

 [ slimeHurt, bitmap`
................
................
................
................
................
................
................
................
....3333333.....
..3333333333....
..33733333333...
..33333333333...
..333003733333..
..33333333333...
..333333333333..
...3............` ],

  [ slimeAttack, bitmap`
................
................
...444..........
.444444.........
44....4.........
..44..4.........
44.4..44........
..4444444444....
44444D4D4DD44...
.4.4D7DDDDD444..
...4DDDDDDDD44..
4444DD00D7D4D44.
44.4DDDDDDD444..
4..444444444444.
4444..4.........
.4..............` ],
  [ wall, bitmap`
0000000000000000
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0111111111111110
0000000000000000` ],
  [ door, bitmap`
................
................
....66666666....
...66......66...
..66........66..
..6..........6..
..6..........6..
..6..........6..
..6..........6..
..6..........6..
..6..........6..
..6..........6..
..666666666666..
..666666666666..
................
................` ]
  
);


  setSolids([player, playerAttack, playerHurt, slime, slimeHurt, slimeAttack, wall]);

let slimeHealth = 2;
let playerHealth = 4;
let playerJustAttacked = false;
let attackReady = true;
let gameOver = false;
let slimeAttackReady = true;

let level = 0;

const levels = [
  map`
wwwwww
wp...w
w....w
w...sw
wwwwww`,

  map`
wwwwwwww
wp.....w
w..ww..w
w.....sw
wwwwwwww`,

  map`
wwwwwwww
wp..w..w
w...w..w
w......w
w..ww.sw
w......w
wwwwwwww`,

  map`
wwwwwwww
wp.....w
w.www..w
w...w..w
w.w....w
w....s.w
wwwwwwww`,

  map`
wwwwwwwww
wp......w
w.www.w.w
w.....w.w
w.ww....w
w....ww.w
w......sw
wwwwwwwww`,

  map`
wwwwwwwww
wp..w...w
w...w.w.w
w.w...w.w
w.w.www.w
w.......w
w..s....w
wwwwwwwww`
];
  





setMap(levels[level]);
function playerHitAnimation() {
  const p = getPlayer();
  if (!p) return;

  p.type = playerAttack;

  setTimeout(() => {
    const attackingPlayer = getFirst(playerAttack);
    if (attackingPlayer) {
      attackingPlayer.type = player;
    }
  }, 200);
}
function hurtSlime() {
  const s = getFirst(slime) || getFirst(slimeHurt);
  if (!s) return;

  slimeHealth -= 1;
  s.type = slimeHurt;
    
  setTimeout(() => {
    const hurt = getFirst(slimeHurt);
    if (hurt && slimeHealth > 0) {
      hurt.type = slime;
       }
  }, 1000);

if (slimeHealth <= 0) {
  const deadSlime = getFirst(slimeHurt);
  if (deadSlime) deadSlime.remove();

  addSprite(width() - 2, height() - 2, door);

  addText("Door Open!", {
    x: 4,
    y: 2,
    color: color`4`
  });
}
}
function hurtPlayer() {
  const p = getFirst(player);
  if (!p) return;

  playerHealth -= 1;
  p.type = playerHurt;

  setTimeout(() => {
    const hurt = getFirst(playerHurt);
    if (hurt && playerHealth > 0) {
      hurt.type = player;
    }
  }, 1000);

if (playerHealth <= 0) {
  gameOver = true;
  clearText();
  playTune(gameOverSound);

  addText("Game Over", {
    x: 4,
    y: 2,
    color: color`3`
  });

  addText("Press L", {
    x: 5,
    y: 4,
    color: color`4`
  });
}
}
function restartGame() {
  gameOver = false;
  level = 0;
  slimeHealth = 2;
  playerHealth = 4;
  playerJustAttacked = false;
  attackReady = true;
  clearText();
  setMap(levels[0]);
}
function touchingSlime() {
  const p = getFirst(player);
  const s = getFirst(slime) || getFirst(slimeHurt);

  if (!p || !s) return false;

  return Math.abs(p.x - s.x) + Math.abs(p.y - s.y) === 1;
}
function getPlayer() {
  return getFirst(player) || getFirst(playerAttack) || getFirst(playerHurt);
}
function loadNextLevel() {
  level += 1;

  if (level < levels.length) {
    clearText();
    slimeHealth = 2;
    playerHealth = 4;
    playerJustAttacked = false;

    const randomLevel = Math.floor(Math.random() * (levels.length - 1)) + 1;
    setMap(levels[randomLevel]);
  } else {
    clearText();
    addText("You Win!", {
      x: 5,
      y: 2,
      color: color`4`
    });
  }
}


onInput("w", () => {
if (gameOver) return;
  const p = getPlayer();
  if (p) p.y -= 1;
});

onInput("s", () => {
if (gameOver) return;
  const p = getPlayer();
  if (p) p.y += 1;
});

onInput("a", () => {
if (gameOver) return;
  const p = getPlayer();
  if (p) p.x -= 1;
});

onInput("d", () => {
if (gameOver) return;
  const p = getPlayer();
  if (p) p.x += 1;
});

onInput("l", () => {
  if (gameOver) {
    restartGame();
  }
});


 

onInput("k", () => {
if (gameOver) return;
  if (touchingSlime()) {
    hurtPlayer();
  }
});

setPushables({
  [ player ]: []
})


 afterInput(() => {
  if (gameOver) return;

  if (playerJustAttacked) {
  }

  slimeTurn();

  const doors = tilesWith(player, door);

  if (doors.length > 0) {
  loadNextLevel();
}
});

onInput("j", () => {
if (gameOver) return;
if (!attackReady) return;

attackReady = false;

setTimeout(() => {
  attackReady = true;
}, 700);
 playerJustAttacked = true;
playerHitAnimation();
playTune(swordSound);

 const p = getFirst(playerAttack) || getFirst(player) || getFirst(playerHurt);
  const s = getFirst(slime) || getFirst(slimeHurt);

  if (!p || !s) return;

if (Math.abs(p.x - s.x) + Math.abs(p.y - s.y) === 1) {
  playTune(slimeHitSound);
  hurtSlime();
}
});



function slimeTurn() {
  const p = getFirst(player) || getFirst(playerAttack) || getFirst(playerHurt);
  const s = getFirst(slime) || getFirst(slimeHurt) || getFirst(slimeAttack);

  if (!p || !s) return;

  const touchingPlayer = Math.abs(p.x - s.x) + Math.abs(p.y - s.y) === 1;

 if (touchingPlayer) {
  if (!slimeAttackReady) return;

  slimeAttackReady = false;

  setTimeout(() => {
    slimeAttackReady = true;
  }, 1000);

  playTune(playerHurtSound);
  playerHealth -= 1;

    s.type = slimeAttack;
    p.type = playerHurt;

    setTimeout(() => {
      const attackingSlime = getFirst(slimeAttack);
      if (attackingSlime) {
        attackingSlime.type = slime;
      }
    }, 200);

    setTimeout(() => {
      const hurtPlayer = getFirst(playerHurt);
      if (hurtPlayer && playerHealth > 0) {
        hurtPlayer.type = player;
      }
    }, 1000);

    if (playerHealth <= 0) {
     gameOver = true;
      clearText();
      playTune(gameOverSound);
      addText("Game Over", {
        x: 4,
        y: 2,
        color: color`3`
      });

       addText("Press L", {
    x: 5,
    y: 4,
    color: color`4`
  });
}

    return;
  }

  if (p.x > s.x) {
    s.x += 1;
  } else if (p.x < s.x) {
    s.x -= 1;
  } else if (p.y > s.y) {
    s.y += 1;
  } else if (p.y < s.y) {
    s.y -= 1;
  }
}

