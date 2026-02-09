        let player1NameValue = '';
        let player2NameValue = '';
        let currentPlayer = 'X';
        let board = ['', '', '', '', '', '', '', '', ''];
        let gameActive = true;

        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        function startGame() {
            const p1Input = document.getElementById('player1').value.trim();
            const p2Input = document.getElementById('player2').value.trim();

            if (!p1Input || !p2Input) {
                alert('कृपया दोनों players के नाम enter करें! 🎮');
                return;
            }

            player1NameValue = p1Input;
            player2NameValue = p2Input;

            document.getElementById('player1Name').textContent = player1NameValue;
            document.getElementById('player2Name').textContent = player2NameValue;

            switchPage('namePage', 'gamePage');
        }

        function makeMove(index) {
            if (board[index] !== '' || !gameActive) {
                return;
            }

            board[index] = currentPlayer;
            const cells = document.querySelectorAll('.cell');
            cells[index].textContent = currentPlayer;
            cells[index].classList.add(currentPlayer.toLowerCase());
            cells[index].disabled = true;

            // Add particle effect on cell click
            createClickParticles(cells[index]);

            if (checkWinner()) {
                gameActive = false;
                setTimeout(() => {
                    showWinner();
                }, 600);
                return;
            }

            if (board.every(cell => cell !== '')) {
                gameActive = false;
                setTimeout(() => {
                    showDraw();
                }, 600);
                return;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updatePlayerHighlight();
        }

        function createClickParticles(element) {
            const rect = element.getBoundingClientRect();
            const colors = currentPlayer === 'X' ? ['#00d4ff', '#00f0ff'] : ['#ff006e', '#ff00ff'];
            
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                particle.style.left = rect.left + rect.width / 2 + 'px';
                particle.style.top = rect.top + rect.height / 2 + 'px';
                
                const angle = (Math.PI * 2 * i) / 15;
                const velocity = 50 + Math.random() * 50;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                document.body.appendChild(particle);
                
                particle.animate([
                    { transform: 'translate(0, 0) scale(1)', opacity: 1 },
                    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 600 + Math.random() * 400,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                }).onfinish = () => particle.remove();
            }
        }

        function updatePlayerHighlight() {
            const player1Card = document.getElementById('player1Card');
            const player2Card = document.getElementById('player2Card');

            if (currentPlayer === 'X') {
                player1Card.classList.add('active');
                player2Card.classList.remove('active');
            } else {
                player2Card.classList.add('active');
                player1Card.classList.remove('active');
            }
        }

        function checkWinner() {
            return winningConditions.some(condition => {
                return condition.every(index => {
                    return board[index] === currentPlayer;
                });
            });
        }

        function showWinner() {
            const winnerName = currentPlayer === 'X' ? player1NameValue : player2NameValue;
            document.getElementById('winnerName').textContent = winnerName;
            document.querySelector('.winner-title').textContent = '🏆 WINNER 🏆';
            document.querySelector('.winner-emoji').textContent = '🎉';
            
            switchPage('gamePage', 'winnerPage');
            launchRealisticFireworks();
        }

        function showDraw() {
            document.getElementById('winnerName').textContent = 'DRAW!';
            document.querySelector('.winner-title').textContent = '🤝 MATCH DRAW 🤝';
            document.querySelector('.winner-emoji').textContent = '🤝';
            
            switchPage('gamePage', 'winnerPage');
            launchRealisticFireworks();
        }

        function launchRealisticFireworks() {
            const winnerPage = document.getElementById('winnerPage');
            const colors = [
                ['#ff0000', '#ff6b6b'],
                ['#00ff00', '#51cf66'],
                ['#0000ff', '#4dabf7'],
                ['#ffff00', '#ffd43b'],
                ['#ff00ff', '#f783ac'],
                ['#00ffff', '#3bc9db'],
                ['#ffa500', '#ffa94d'],
                ['#ffd700', '#fff3bf']
            ];

            // Launch multiple fireworks from bottom
            let fireworkCount = 0;
            const maxFireworks = 15;
            
            const fireworkInterval = setInterval(() => {
                if (fireworkCount >= maxFireworks) {
                    clearInterval(fireworkInterval);
                    return;
                }

                const startX = 10 + Math.random() * 80;
                const targetX = 20 + Math.random() * 60;
                const targetY = 20 + Math.random() * 40;
                
                launchFirework(winnerPage, startX, targetX, targetY, colors[Math.floor(Math.random() * colors.length)]);
                fireworkCount++;
            }, 200);
        }

        function launchFirework(container, startX, targetX, targetY, colorPair) {
            const launcher = document.createElement('div');
            launcher.style.position = 'absolute';
            launcher.style.left = startX + '%';
            launcher.style.bottom = '0';
            launcher.style.width = '4px';
            launcher.style.height = '4px';
            launcher.style.background = colorPair[0];
            launcher.style.borderRadius = '50%';
            launcher.style.boxShadow = `0 0 10px ${colorPair[0]}`;
            container.appendChild(launcher);

            // Launch animation
            const launchAnim = launcher.animate([
                { transform: 'translateY(0)', opacity: 1 },
                { transform: `translate(${(targetX - startX) * 5}px, ${-targetY * 10}px)`, opacity: 1 }
            ], {
                duration: 800,
                easing: 'cubic-bezier(.17,.67,.35,.96)'
            });

            launchAnim.onfinish = () => {
                launcher.remove();
                explodeFirework(container, targetX, targetY, colorPair);
            };
        }

        function explodeFirework(container, x, y, colorPair) {
            const particles = 60;
            
            for (let i = 0; i < particles; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework';
                particle.style.left = x + '%';
                particle.style.top = y + '%';
                particle.style.background = i % 2 === 0 ? colorPair[0] : colorPair[1];
                
                const angle = (Math.PI * 2 * i) / particles;
                const velocity = 100 + Math.random() * 100;
                const tx = Math.cos(angle) * velocity;
                const ty = Math.sin(angle) * velocity;
                
                container.appendChild(particle);
                
                particle.animate([
                    { 
                        transform: 'translate(0, 0) scale(1)', 
                        opacity: 1,
                        filter: 'blur(0px)'
                    },
                    { 
                        transform: `translate(${tx}px, ${ty}px) scale(0.3)`, 
                        opacity: 0,
                        filter: 'blur(2px)'
                    }
                ], {
                    duration: 1200 + Math.random() * 600,
                    easing: 'cubic-bezier(0, .9, .57, 1)'
                }).onfinish = () => particle.remove();

                // Add trailing particles
                if (i % 3 === 0) {
                    setTimeout(() => {
                        createTrailParticle(container, x, y, tx, ty, colorPair[0]);
                    }, Math.random() * 200);
                }
            }
        }

        function createTrailParticle(container, x, y, tx, ty, color) {
            const trail = document.createElement('div');
            trail.className = 'firework';
            trail.style.left = x + '%';
            trail.style.top = y + '%';
            trail.style.background = color;
            trail.style.width = '3px';
            trail.style.height = '3px';
            
            container.appendChild(trail);
            
            trail.animate([
                { 
                    transform: `translate(${tx * 0.5}px, ${ty * 0.5}px) scale(1)`, 
                    opacity: 0.8 
                },
                { 
                    transform: `translate(${tx * 1.2}px, ${ty * 1.2}px) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 800,
                easing: 'ease-out'
            }).onfinish = () => trail.remove();
        }

        function resetGame() {
            board = ['', '', '', '', '', '', '', '', ''];
            currentPlayer = 'X';
            gameActive = true;

            const cells = document.querySelectorAll('.cell');
            cells.forEach(cell => {
                cell.textContent = '';
                cell.classList.remove('x', 'o');
                cell.disabled = false;
            });

            document.getElementById('player1').value = '';
            document.getElementById('player2').value = '';

            // Clear all firework particles
            document.querySelectorAll('.firework').forEach(fw => fw.remove());

            // Reset player highlight
            document.getElementById('player1Card').classList.add('active');
            document.getElementById('player2Card').classList.remove('active');

            switchPage('winnerPage', 'namePage');
        }

        function switchPage(fromPage, toPage) {
            document.getElementById(fromPage).classList.remove('active');
            setTimeout(() => {
                document.getElementById(toPage).classList.add('active');
            }, 150);
        }

        // Add keyboard support for Enter key on inputs
        document.getElementById('player1').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                document.getElementById('player2').focus();
            }
        });

        document.getElementById('player2').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                startGame();
            }
        });