// =================================================================
        // 全域變數
        // =================================================================
        let finalScore = 0; 
        let maxScore = 0;
        let scoreText = "請開始測驗或點擊模擬按鈕"; // 初始文字

        // -----------------------------------------------------------------
        // 步驟一：成績數據接收 (模擬 H5P 消息接收)
        // -----------------------------------------------------------------

        // 監聽來自 H5P 或其他 iframe 的 'message' 事件
        window.addEventListener('message', function (event) {
            // 實際應用中，您應該驗證 event.origin
            // 確保只處理來自可信任來源的數據
            
            const data = event.data;
            
            if (data && data.type === 'H5P_SCORE_RESULT') {
                
                // !!! 關鍵步驟：更新全域變數 !!!
                finalScore = data.score; 
                maxScore = data.maxScore;
                scoreText = `最終成績分數: ${finalScore}/${maxScore}`;
                
                console.log("新的分數已接收:", scoreText); 
                
                // 關鍵步驟 2: 呼叫重新繪製
                if (typeof redraw === 'function') {
                    redraw(); // p5.js 會自動調用 draw()，但明確呼叫更可靠
                }
            }
        }, false);


        // =================================================================
        // 步驟二：使用 p5.js 繪製分數
        // =================================================================

        let p5Instance;

        function setup() { 
            // 創建 canvas，並將其掛載到指定的容器中
            p5Instance = new p5(function(sketch) {
                sketch.setup = function() {
                    // 將 canvas 尺寸設定為適中大小，並掛載到 #p5CanvasContainer
                    let container = sketch.select('#p5CanvasContainer');
                    let w = window.innerWidth > 600 ? 600 : window.innerWidth * 0.9;
                    let h = 450;
                    sketch.createCanvas(w, h).parent('p5CanvasContainer'); 
                    sketch.background(255); 
                    sketch.noLoop(); // 只有在分數改變時才繪圖
                };

                sketch.draw = function() { 
                    sketch.background(255); // 清除背景

                    // 計算百分比
                    let percentage = (maxScore === 0) ? 0 : (finalScore / maxScore) * 100;

                    sketch.textSize(30); 
                    sketch.textAlign(sketch.CENTER);
                    
                    // -----------------------------------------------------------------
                    // A. 根據分數區間改變文本顏色和內容 (畫面反映一)
                    // -----------------------------------------------------------------
                    
                    if (percentage === 100) { // <-- 滿分判斷：觸發煙火文字
                        sketch.textSize(40);
                        sketch.fill(255, 0, 0); // 強烈紅色
                        sketch.text("🎉 恭喜！完美煙火秀！ 🎉", sketch.width / 2, sketch.height / 2 - 60);
                        
                    } else if (percentage >= 90) {
                        sketch.textSize(30);
                        sketch.fill(0, 200, 50); // 綠色
                        sketch.text("恭喜！優異成績！", sketch.width / 2, sketch.height / 2 - 50);
                        
                    } else if (percentage >= 60) {
                        sketch.textSize(30);
                        sketch.fill(255, 181, 35); // 黃色
                        sketch.text("成績良好，請再接再厲。", sketch.width / 2, sketch.height / 2 - 50);
                        
                    } else if (percentage > 0) {
                        sketch.textSize(30);
                        sketch.fill(200, 0, 0); // 紅色
                        sketch.text("需要加強努力！", sketch.width / 2, sketch.height / 2 - 50);
                        
                    } else {
                        sketch.textSize(25);
                        sketch.fill(150);
                        sketch.text(scoreText, sketch.width / 2, sketch.height / 2);
                    }

                    // 顯示具體分數
                    sketch.textSize(25);
                    sketch.fill(50);
                    sketch.text(`得分: ${finalScore}/${maxScore}`, sketch.width / 2, sketch.height / 2 + 30);
                    
                    
                    // -----------------------------------------------------------------
                    // B. 根據分數觸發不同的幾何圖形反映 (畫面反映二) - 煙火特效
                    // -----------------------------------------------------------------
                    
                    if (percentage === 100) { // <-- 滿分判斷：觸發煙火圖形
                        sketch.noStroke();
                        // 模擬煙火爆發效果
                        let baseY = sketch.height / 2 + 120;
                        sketch.fill(255, 165, 0, 200); // 橘色
                        sketch.circle(sketch.width / 2 - 50, baseY, 50);
                        sketch.fill(255, 255, 0, 200); // 黃色
                        sketch.circle(sketch.width / 2 + 50, baseY, 40);
                        sketch.fill(255, 0, 255, 200); // 紫色
                        sketch.circle(sketch.width / 2, baseY + 40, 60);
                        
                    } else if (percentage >= 90) {
                        // 原 90% 效果：大圓圈
                        sketch.fill(0, 200, 50, 150); // 帶透明度
                        sketch.noStroke();
                        sketch.circle(sketch.width / 2, sketch.height / 2 + 120, 150);
                        
                    } else if (percentage >= 60) {
                        // 中等效果：方形
                        sketch.fill(255, 181, 35, 150);
                        sketch.rectMode(sketch.CENTER);
                        sketch.rect(sketch.width / 2, sketch.height / 2 + 120, 150, 150);
                    }
                };
            }, document.getElementById('p5CanvasContainer')); // 將 p5 實例掛載到容器
        }

        // -----------------------------------------------------------------
        // 測試用：模擬成績數據發送
        // -----------------------------------------------------------------
        function simulateScore(score, max) {
            const mockData = {
                type: 'H5P_SCORE_RESULT',
                score: score,
                maxScore: max
            };
            // 創建一個假的事件對象來觸發監聽器
            const mockEvent = { data: mockData };
            window.dispatchEvent(new MessageEvent('message', { data: mockData }));
            console.log(`--- 模擬發送分數: ${score}/${max} ---`);
        }

        // 在 p5 實例初始化後才執行 setup
        window.onload = function() {
            setup();
        };
