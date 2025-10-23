// =================================================================
// 步驟一：模擬成績數據接收
// -----------------------------------------------------------------

let finalScore = 0;
let maxScore = 0;
let scoreText = ""; // 用於 p5.js 繪圖的文字

window.addEventListener('message', function (event) {
    // 執行來源驗證...
    // ...
    const data = event.data;

    if (data && data.type === 'H5P_SCORE_RESULT') {
        // 更新全域變數
        finalScore = data.score; // 更新全域變數
        maxScore = data.maxScore;
        scoreText = `最終成績分數: ${finalScore}/${maxScore}`;

        console.log("新的分數已接收:", scoreText);

        // ----------------------------------------
        // 呼叫重新繪製
        // ----------------------------------------

        if (typeof redraw === 'function') {
            redraw();
        }
    }

}, false);


// =================================================================
// 步驟二：使用 p5.js 繪製分數 (在網頁 Canvas 上顯示)
// -----------------------------------------------------------------

let fireworks = []; // 用來存儲煙火物件的陣列

// 用來創建煙火的物件
class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = random(10, 30);
        this.speed = random(5, 10);
        this.angle = random(TWO_PI);
        this.alpha = 255;
        this.life = 255; // 用來控制煙火的生命週期
    }

    // 更新煙火位置
    update() {
        this.x += cos(this.angle) * this.speed;
        this.y += sin(this.angle) * this.speed;
        this.size *= 0.98; // 慢慢縮小
        this.alpha -= 5; // 漸變消失
        this.life -= 5; // 控制煙火的生命週期

        // 如果煙火完全消失，將其移除
        if (this.life <= 0) {
            this.alpha = 0;
        }
    }

    // 繪製煙火
    display() {
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], this.alpha);
        ellipse(this.x, this.y, this.size);
    }
}

function setup() {
    createCanvas(windowWidth / 2, windowHeight / 2);
    background(255);
    noLoop(); // 保持靜止，直到收到新的分數
}

function draw() {
    background(255);

    // 計算百分比
    let percentage = (maxScore === 0) ? 0 : (finalScore / maxScore) * 100;

    textSize(80);
    textAlign(CENTER);

    // A. 根據分數區間改變文本顏色和內容
    if (percentage === 100) {
        // 滿分煙火效果
        fill(255, 0, 0);
        textSize(70);
        text("🎉 完美！煙火慶祝！ 🎉", width / 2, height / 2 - 50);
        
        // 生成煙火效果
        if (frameCount % 10 === 0) {
            fireworks.push(new Firework(width / 2, height / 2, [random(255), random(255), random(255)]));
        }

    } else if (percentage >= 90) {
        fill(0, 200, 50);
        text("恭喜！優異成績！", width / 2, height / 2 - 50);
    } else if (percentage >= 60) {
        fill(255, 181, 35);
        text("成績良好，請再接再厲。", width / 2, height / 2 - 50);
    } else if (percentage > 0) {
        fill(200, 0, 0);
        text("需要加強努力！", width / 2, height / 2 - 50);
    } else {
        fill(150);
        textSize(80);
        text(scoreText || "等待成績...", width / 2, height / 2);
    }

    // 顯示具體分數
    textSize(50);
    fill(50);
    text(`得分: ${finalScore}/${maxScore}`, width / 2, height / 2 + 50);

    // B. 根據分數觸發不同的幾何圖形反映
    if (percentage === 100) {
        // 當滿分時生成煙火
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].update();  // 更新煙火狀態
            fireworks[i].display(); // 顯示煙火
            if (fireworks[i].alpha <= 0) {
                fireworks.splice(i, 1); // 移除已經消失的煙火
            }
        }
    } else if (percentage >= 90) {
        fill(0, 200, 50, 150);
        noStroke();
        circle(width / 2, height / 2 + 150, 150);
    } else if (percentage >= 60) {
        fill(255, 181, 35, 150);
        rectMode(CENTER);
        rect(width / 2, height / 2 + 150, 150, 150);
    }
}
