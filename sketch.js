// =================================================================

// 步驟一：模擬成績數據接收

// -----------------------------------------------------------------





// let scoreText = "成績分數: " + finalScore + "/" + maxScore;

// 確保這是全域變數

let finalScore = 0;

let maxScore = 0;

let scoreText = ""; // 用於 p5.js 繪圖的文字





window.addEventListener('message', function (event) {

    // 執行來源驗證...

    // ...

    const data = event.data;

   

    if (data && data.type === 'H5P_SCORE_RESULT') {

       

        // !!! 關鍵步驟：更新全域變數 !!!

        finalScore = data.score; // 更新全域變數

        maxScore = data.maxScore;

        scoreText = `最終成績分數: ${finalScore}/${maxScore}`;

       

        console.log("新的分數已接收:", scoreText);

       

        // ----------------------------------------

        // 關鍵步驟 2: 呼叫重新繪製 (見方案二)

        // ----------------------------------------

        if (typeof redraw === 'function') {

            redraw();

        }

    }

}, false);





// =================================================================

// 步驟二：使用 p5.js 繪製分數 (在網頁 Canvas 上顯示)

// -----------------------------------------------------------------



function setup() {

    // ... (其他設置)

    createCanvas(windowWidth / 2, windowHeight / 2);

    background(255);

    noLoop(); // 如果您希望分數只有在改變時才繪製，保留此行

}



// score_display.js 中的 draw() 函數片段



function draw() {
// score_display.js 中的 draw() 函數片段

function draw() { 
    background(255); // 清除背景

    // 計算百分比
    // 為了避免 maxScore 為 0 時產生錯誤，新增一個簡單的保護
    let percentage = (maxScore === 0) ? 0 : (finalScore / maxScore) * 100;

    textSize(80); 
    textAlign(CENTER);
    
    // -----------------------------------------------------------------
    // A. 根據分數區間改變文本顏色和內容 (畫面反映一) - **加入 100% 滿分特效**
    // -----------------------------------------------------------------
    
    if (percentage === 100) { // <-- 新增：判斷是否剛好 100% 滿分
        // 滿分：增加「煙火特效」文字模擬
        fill(255, 0, 0); // 使用紅色來表示強烈的慶祝感
        textSize(70); // 字體可以放大以增加慶祝感
        text("🎉 完美！煙火慶祝！ 🎉", width / 2, height / 2 - 50);
        
    } else if (percentage >= 90) { // 處理 90% 到 99.9% 的情況
        // 高分：顯示鼓勵文本，使用原來的綠色
        fill(0, 200, 50); // 綠色 [6]
        textSize(80);
        text("恭喜！優異成績！", width / 2, height / 2 - 50);
        
    } else if (percentage >= 60) {
        // 中等分數：顯示一般文本，使用黃色 [6]
        fill(255, 181, 35);
        textSize(80);
        text("成績良好，請再接再厲。", width / 2, height / 2 - 50);
        
    } else if (percentage > 0) {
        // 低分：顯示警示文本，使用紅色 [6]
        fill(200, 0, 0);
        textSize(80);
        text("需要加強努力！", width / 2, height / 2 - 50);
        
    } else {
        // 尚未收到分數或分數為 0
        fill(150);
        textSize(80); // 恢復預設大小
        text(scoreText || "等待成績...", width / 2, height / 2);
    }

    // 顯示具體分數 (這部分不受 A 區塊 textSize 影響)
    textSize(50);
    fill(50);
    text(`得分: ${finalScore}/${maxScore}`, width / 2, height / 2 + 50);
    
    
    // -----------------------------------------------------------------
    // B. 根據分數觸發不同的幾何圖形反映 (畫面反映二) - **加入 100% 煙火圖形**
    // -----------------------------------------------------------------
    
    if (percentage === 100) { // <-- 新增：滿分時繪製煙火圖案
        // 煙火模擬：畫多個不同顏色和大小的圓點/星星
        noStroke();
        let baseY = height / 2 + 150;
        
        fill(255, 165, 0, 200); // 橘色
        circle(width / 2 - 50, baseY, 50);
        fill(255, 255, 0, 200); // 黃色
        circle(width / 2 + 50, baseY, 40);
        fill(255, 0, 255, 200); // 紫色
        circle(width / 2, baseY + 40, 60);
        
    } else if (percentage >= 90) {
        // 原 90% 效果：畫一個大圓圈代表完美 [7]
        fill(0, 200, 50, 150); // 帶透明度
        noStroke();
        circle(width / 2, height / 2 + 150, 150);
        
    } else if (percentage >= 60) {
        // 畫一個方形 [4]
        fill(255, 181, 35, 150);
        rectMode(CENTER);
        rect(width / 2, height / 2 + 150, 150, 150);
    }
    
    // 如果您想要更複雜的視覺效果，還可以根據分數修改線條粗細 (strokeWeight) 
    // 或使用 sin/cos 函數讓圖案的動畫效果有所不同 [8, 9]。
}
}
