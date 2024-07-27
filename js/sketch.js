let moles = [];
let score = 0;
let moleSize = 50;
let timeLimit = 60; // 游戏时间限制为60秒
let startTime;
let gameStarted = false;
let startButton;
let osc; // 振荡器，用于生成声音
let hammerImg; // 锤子图像
let grassImg; // 草地背景图像
let hammerSize = 50; // 锤子图标的大小

function preload() {
  hammerImg = loadImage('hammer.png'); // 预加载锤子图像
  grassImg = loadImage('grass.png'); // 预加载草地图像
}

function setup() {
  createCanvas(600, 400);
  noStroke();
  
  for (let i = 0; i < 10; i++) {
    moles.push({
      x: random(width - moleSize),
      y: random(height - moleSize),
      visible: false,
      timer: 0,
      maxTime: random(1, 3), // 初始地鼠的存在时间在1到3秒之间
      hit: false, // 标志地鼠是否被打到
      hitTimer: 0 // 被打到效果显示的计时器
    });
  }
  
  frameRate(30); // 每秒更新30次
  
  // 创建开始按钮
  startButton = createButton('Start');
  startButton.position(width / 2 - 30, height / 2 - 20);
  startButton.size(60, 40);
  startButton.mousePressed(startGame);
  
  // 初始化振荡器
  osc = new p5.Oscillator('sine');
  osc.start();
  osc.amp(0); // 初始振幅为0，即静音
}

function draw() {
  background(grassImg); // 绘制草地背景
  
  if (!gameStarted) {
    textSize(48);
    textAlign(CENTER, CENTER);
    fill(255); // 白色文字
    text('Whack-A-Mole', width / 2, height / 2 - 60);
    return;
  }
  
  let elapsedTime = (millis() - startTime) / 1000;
  let remainingTime = max(timeLimit - elapsedTime, 0);
  
  fill(255); // 白色文字
  textSize(24);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 10, 10);
  text(`Time: ${nf(remainingTime, 2, 1)}`, 10, 40);
  
  if (remainingTime <= 0) {
    textSize(48);
    textAlign(CENTER, CENTER);
    text('Game Over', width / 2, height / 2);
    noLoop(); // 停止绘制
    return;
  }
  
  let maxMoleTime = map(remainingTime, 0, timeLimit, 0.5, 2.5); // 剩余时间越少，地鼠显示时间越短
  
  for (let mole of moles) {
    if (mole.visible) {
      if (mole.hit) {
        drawHitMole(mole.x, mole.y, moleSize);
        mole.hitTimer += deltaTime / 1000;
        if (mole.hitTimer > 0.3) { // 被打到效果显示0.3秒
          mole.hit = false;
          mole.visible = false;
          mole.hitTimer = 0;
        }
      } else {
        drawMole(mole.x, mole.y, moleSize);
        mole.timer += deltaTime / 1000; // 更新地鼠存在的时间
        if (mole.timer >= mole.maxTime) {
          mole.visible = false;
          mole.timer = 0;
        }
      }
    }
  }
  
  if (frameCount % 30 === 0) { // 每秒重新决定哪些地鼠显示
    for (let mole of moles) {
      if (!mole.visible && random() < 0.3) { // 30%的概率显示地鼠
        mole.visible = true;
        mole.timer = 0;
        mole.maxTime = random(0.5, maxMoleTime); // 地鼠显示的时间根据剩余时间动态调整
      }
    }
  }
  
  // 绘制锤子图像在鼠标指针的位置，缩小锤子图标尺寸
  image(hammerImg, mouseX - hammerSize / 2, mouseY - hammerSize / 2, hammerSize, hammerSize);
}

function drawMole(x, y, size) {
  fill(139, 69, 19); // 地鼠的颜色
  ellipse(x + size / 2, y + size / 2, size);
  
  // 画眼睛
  fill(0);
  ellipse(x + size / 3, y + size / 3, size / 10); // 左眼
  ellipse(x + 2 * size / 3, y + size / 3, size / 10); // 右眼
  
  // 画耳朵
  fill(139, 69, 19);
  ellipse(x + size / 4, y + size / 5, size / 5, size / 3); // 左耳
  ellipse(x + 3 * size / 4, y + size / 5, size / 5, size / 3); // 右耳
  
  // 画嘴巴
  fill(255, 182, 193); // 粉色
  ellipse(x + size / 2, y + 2 * size / 3, size / 5, size / 10); // 嘴巴
}

function drawHitMole(x, y, size) {
  fill(255, 0, 0); // 红色，表示被打到的地鼠
  ellipse(x + size / 2, y + size / 2, size);
  
  // 画眼睛
  fill(0);
  ellipse(x + size / 3, y + size / 3, size / 10); // 左眼
  ellipse(x + 2 * size / 3, y + size / 3, size / 10); // 右眼
  
  // 画耳朵
  fill(255, 0, 0);
  ellipse(x + size / 4, y + size / 5, size / 5, size / 3); // 左耳
  ellipse(x + 3 * size / 4, y + size / 5, size / 5, size / 3); // 右耳
  
  // 画嘴巴
  fill(0); // 黑色
  ellipse(x + size / 2, y + 2 * size / 3, size / 5, size / 10); // 嘴巴
}

function mousePressed() {
  if (!gameStarted) return;

  for (let mole of moles) {
    if (mole.visible && !mole.hit && dist(mouseX, mouseY, mole.x + moleSize / 2, mole.y + moleSize / 2) < moleSize / 2) {
      score++;
      mole.hit = true; // 标记地鼠被打到
      mole.hitTimer = 0; //
