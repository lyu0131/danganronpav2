// Monokuma Popup - Random appearance from edges
document.addEventListener('DOMContentLoaded', () => {
	const monokumaPopup = document.createElement('div');
	monokumaPopup.id = 'monokuma-popup';
	const popupLink = document.createElement('a');
	const isInCharacterPages = window.location.pathname.includes('character_pages');
	popupLink.href = isInCharacterPages ? '../character_pages/monokuma.html' : 'character_pages/monokuma.html';
	const imgSrc = isInCharacterPages ? '../images/others/nav_kuma.png' : 'images/others/nav_kuma.png';
	popupLink.innerHTML = `<img src="${imgSrc}" alt="Monokuma" class="monokuma-image" />`;
	monokumaPopup.appendChild(popupLink);
	document.body.appendChild(monokumaPopup);

	const style = document.createElement('style');
	style.textContent = `
		#monokuma-popup {
			position: fixed;
			z-index: 9997;
			pointer-events: auto;
		}

		#monokuma-popup.monokuma-peek-in {
			animation: peekIn 3s ease-in-out forwards;
		}

		#monokuma-popup.monokuma-peek-out {
			animation: peekOut 3s ease-in-out forwards;
		}

		.monokuma-image {
			width: 200px;
			height: auto;
			filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4));
			cursor: pointer;
			transition: transform 0.2s ease;
		}

		.monokuma-image:hover {
			transform: scale(1.1);
		}

		@keyframes peekIn {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}

		@keyframes peekOut {
			from {
				opacity: 1;
			}
			to {
				opacity: 0;
			}
		}
	`;
	document.head.appendChild(style);

	function moveMonokumaTo(element, endX, endY) {
		const startX = parseFloat(element.style.left);
		const startY = parseFloat(element.style.top);
		const duration = 3000; // 3 seconds
		const startTime = Date.now();

		function animate() {
			const elapsed = Date.now() - startTime;
			const progress = Math.min(elapsed / duration, 1);
			
			const currentX = startX + (endX - startX) * progress;
			const currentY = startY + (endY - startY) * progress;
			
			element.style.left = currentX + 'px';
			element.style.top = currentY + 'px';
			
			if (progress < 1) {
				requestAnimationFrame(animate);
			}
		}
		animate();
	}

	function hideMonokuma() {
		const imageSize = 200;
		const startX = parseFloat(monokumaPopup.style.left);
		const startY = parseFloat(monokumaPopup.style.top);
		let endX, endY;

		// Determine which edge and slide back out
		if (startY < 0) {
			// From top, slide back up
			endX = startX;
			endY = -imageSize;
		} else if (startX > window.innerWidth - imageSize) {
			// From right, slide back right
			endX = window.innerWidth;
			endY = startY;
		} else if (startY > window.innerHeight - imageSize) {
			// From bottom, slide back down
			endX = startX;
			endY = window.innerHeight;
		} else if (startX < 0) {
			// From left, slide back left
			endX = -imageSize;
			endY = startY;
		}

		monokumaPopup.classList.add('monokuma-peek-out');
		moveMonokumaTo(monokumaPopup, endX, endY);
	}

	function showMonokuma() {
		// Random edge: 0=top, 1=right, 2=bottom, 3=left
		const edge = Math.floor(Math.random() * 4);
		let startX, startY, endX, endY, rotation;
		
		const imageSize = 200;
		const halfSize = imageSize / 2; // 100px
		const wheelSize = 250; // Approximate size of truth bullet wheel
		const wheelCenterX = window.innerWidth / 2;
		const wheelCenterY = window.innerHeight / 2;
		
		// Music player position (bottom-right corner)
		const playerX = window.innerWidth - 18 - 200; // right: 18px, width: ~200px
		const playerY = window.innerHeight - 140 - 150; // bottom: 140px, height: ~150px
		const playerMargin = 250; // Minimum distance to keep from player
		
		function isValidPosition(x, y) {
			// Check wheel collision
			const wheelDist = Math.sqrt(Math.pow(x + imageSize / 2 - wheelCenterX, 2) + Math.pow(y + imageSize / 2 - wheelCenterY, 2));
			if (wheelDist < wheelSize / 2) return false;
			
			// Check player collision
			if (x + imageSize > playerX && x < playerX + 200 &&
				y + imageSize > playerY && y < playerY + 150) {
				return false;
			}
			return true;
		}
		
		switch(edge) {
			case 0: // Top - slide down
				let randomX;
				let attempts = 0;
				do {
					randomX = Math.random() * (window.innerWidth - imageSize);
					attempts++;
				} while (!isValidPosition(randomX, -halfSize) && attempts < 10);
				
				startX = randomX;
				startY = -imageSize;
				endX = startX;
				endY = -halfSize;
				rotation = 180;
				break;
			case 1: // Right - slide left
				startX = window.innerWidth;
				let randomY1;
				let attempts1 = 0;
				do {
					randomY1 = Math.random() * (window.innerHeight - imageSize);
					attempts1++;
				} while (!isValidPosition(window.innerWidth - halfSize, randomY1) && attempts1 < 10);
				
				startY = randomY1;
				endX = window.innerWidth - halfSize;
				endY = startY;
				rotation = 270;
				break;
			case 2: // Bottom - slide up
				let randomX2;
				let attempts2 = 0;
				do {
					randomX2 = Math.random() * (window.innerWidth - imageSize);
					attempts2++;
				} while (!isValidPosition(randomX2, window.innerHeight - halfSize) && attempts2 < 10);
				
				startX = randomX2;
				startY = window.innerHeight;
				endX = startX;
				endY = window.innerHeight - halfSize;
				rotation = 0;
				break;
			case 3: // Left - slide right
				startX = -imageSize;
				let randomY3;
				let attempts3 = 0;
				do {
					randomY3 = Math.random() * (window.innerHeight - imageSize);
					attempts3++;
				} while (!isValidPosition(-halfSize, randomY3) && attempts3 < 10);
				
				startY = randomY3;
				endX = -halfSize;
				endY = startY;
				rotation = 90;
				break;
		}
		
		monokumaPopup.style.left = startX + 'px';
		monokumaPopup.style.top = startY + 'px';
		monokumaPopup.style.transform = `rotate(${rotation}deg)`;
		monokumaPopup.style.display = 'block';
		monokumaPopup.classList.remove('monokuma-peek-out');
		
		// Trigger reflow to ensure animation plays
		void monokumaPopup.offsetWidth;
		
		monokumaPopup.classList.add('monokuma-peek-in');
		
		// Animate movement from edge to final position
		moveMonokumaTo(monokumaPopup, endX, endY);

		// Stay visible for 20 seconds
		setTimeout(() => {
			monokumaPopup.classList.remove('monokuma-peek-in');
			hideMonokuma();
			setTimeout(() => {
				monokumaPopup.style.display = 'none';
				monokumaPopup.style.transform = 'rotate(0deg)';
				scheduleNextAppearance();
			}, 3000); // 3 second hide animation
		}, 20000); // 20 second visible duration
	}

	function scheduleNextAppearance() {
		const delay = 3000 + Math.random() * 7000; // 3-10 seconds between appearances
		setTimeout(showMonokuma, delay);
	}

	// Wait for loading screen to disappear before starting popup
	const loader = document.getElementById('loader');
	if (loader && !loader.classList.contains('hidden')) {
		// Loader is visible, wait for it to be hidden
		const observer = new MutationObserver((mutations) => {
			if (loader.classList.contains('hidden')) {
				observer.disconnect();
				showMonokuma();
			}
		});
		observer.observe(loader, { attributes: true, attributeFilter: ['class'] });
	} else {
		// Loader already hidden or doesn't exist, start immediately
		showMonokuma();
	}
});
