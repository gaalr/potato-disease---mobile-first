'use strict';

document.addEventListener('DOMContentLoaded', function () {
	// Hide the diseases section by default
	const diseaseSection = document.querySelector('.diseases');
	const mainImageContainer = document.querySelector('.main-image-container');
	if (diseaseSection) diseaseSection.style.display = 'none';

	const prevButton = document.getElementById('prev');
	const nextButton = document.getElementById('next');

	let index = 0; // Index of the first visible item
	const itemsPerPage = 3; // Show 3 cards at a time

	function showCards() {
		const visibleSection = document.querySelector('.diseases[style*="block"]');
		if (!visibleSection) return;
		const cards = visibleSection.querySelectorAll('.card');

		const visibleCards = [];

		// First hide all cards
		cards.forEach((card) => {
			card.style.display = 'none';
		});

		// Then show the current 3 cards
		for (let i = index; i < index + itemsPerPage && i < cards.length; i++) {
			cards[i].style.display = 'inline-block';
			cards[i].style.verticalAlign = 'top';
			cards[i].style.marginRight = '1rem';
			visibleCards.push(cards[i]);
		}

		// Set the parent element of cards to flexbox if there is at least one card
		if (cards.length > 0 && cards[0].parentElement) {
			const parent = cards[0].parentElement;
			parent.style.display = visibleCards.length > 0 ? 'flex' : '';
			parent.style.flexDirection = visibleCards.length > 0 ? 'row' : '';
			parent.style.alignItems = visibleCards.length > 0 ? 'flex-start' : '';
		}

		// Update visibility of buttons
		const anyVisible = visibleCards.length > 0;
		const hasMultiplePages = cards.length > itemsPerPage;

		prevButton.style.display = anyVisible ? 'inline-block' : 'none';
		nextButton.style.display = anyVisible ? 'inline-block' : 'none';
	}

	// Pagination forward
	nextButton.addEventListener('click', function () {
		const visibleSection = document.querySelector('.diseases[style*="block"]');
		if (!visibleSection) return;
		const cards = visibleSection.querySelectorAll('.card');
		if (index + itemsPerPage < cards.length) {
			index += itemsPerPage;
			showCards();
		}
	});

	// Pagination backward
	prevButton.addEventListener('click', function () {
		if (index - itemsPerPage >= 0) {
			index -= itemsPerPage;
			showCards();
		}
	});

	// Menu item event handling — only the relevant section should be displayed
	document.querySelectorAll('.nav-link').forEach((link) => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const targetId = link.dataset.target;
			document.querySelectorAll('.diseases').forEach((section) => {
				section.style.display = 'none';
			});
			const targetSection = document.getElementById(targetId);
			if (targetSection) {
				targetSection.style.display = 'block';
				if (mainImageContainer) mainImageContainer.style.display = 'none';
				document.body.classList.add('disease-view');
				index = 0;
				showCards();
			}
		});
	});

	// Click event on cards – show large image
	document.querySelectorAll('.card').forEach((card) => {
		card.addEventListener('click', () => {
			const img = card.querySelector('img');
			const caption = card.querySelector('figcaption');
			if (img) {
				const title = caption?.textContent || '';
				const content = `<img src="${img.src}" alt="${img.alt}" style="width: 100%; max-width: 800px; height: auto;">`;
				showModal(title, content);
			}
		});
	});
});

// Language switching handling

/* LANGUAGE SWITCHING */
function changeLanguage(selectElement) {
	const language = selectElement.value; // hu or en
	document.documentElement.lang = language; // Update the lang attribute of the html element

	// Update the text of all elements that have data-hu or data-en attribute
	const elements = document.querySelectorAll('[data-hu], [data-en]');

	elements.forEach((element) => {
		if (language === 'en') {
			// If English is selected, use the 'data-en' attribute
			element.textContent = element.getAttribute('data-en');
		} else {
			// If Hungarian is selected, use the 'data-hu' attribute
			element.textContent = element.getAttribute('data-hu');
		}
	});

	// Label the arrows (buttons)
	const buttons = document.querySelectorAll('button[data-hu], button[data-en]');
	buttons.forEach((button) => {
		if (language === 'en') {
			button.textContent = button.getAttribute('data-en');
		} else {
			button.textContent = button.getAttribute('data-hu');
		}
	});
}

// Set default language when the page loads
document.addEventListener('DOMContentLoaded', () => {
	const defaultLang = 'hu'; // Default language: Hungarian
	document.getElementById('language').value = defaultLang;
	changeLanguage(document.getElementById('language')); // Set default language
});

/* MODAL */
const modal = document.getElementById('modal');
const footer = document.querySelector('.footer');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const overlay = document.querySelector('.overlay');
const closeModal = document.querySelector('.close-modal');
const modalContentContainer = document.querySelector('.modal-content');

// Closing the modal
const closeModalFunction = () => {
	modal.classList.add('hidden');
	overlay.classList.add('hidden');
	footer.classList.add('show');
};

// Showing the modal
const showModal = (title, content) => {
	modalTitle.textContent = title;
	modalContent.innerHTML = content;
	modal.classList.remove('hidden');
	overlay.classList.remove('hidden');
};

// Event listeners for closing the modal (Esc key, close button, overlay click)
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
		closeModalFunction();
	}
});

[closeModal, overlay].forEach((element) => {
	element.addEventListener('click', closeModalFunction);
});

// Prevent modal from closing when clicking inside the content area
modalContentContainer.addEventListener('click', (event) => {
	event.stopPropagation();
});

/* LINKS */
// Contact link
document.getElementById('contactLink').addEventListener('click', function () {
	const lang = document.documentElement.lang;
	if (lang === 'hu') {
		showModal(
			'Kapcsolat',
			'Ha kérdésed van, írj nekünk: <strong>email@domain.com</strong>'
		);
	} else {
		showModal(
			'Contact',
			'If you have any questions, write to us: <strong>email@domain.com</strong>'
		);
	}
});
document.getElementById('privacyLink').addEventListener('click', function () {
	const lang = document.documentElement.lang;
	if (lang === 'hu') {
		showModal(
			'Adatvédelmi irányelvek',
			`
			<h3>1. Bevezetés</h3>
			<p>Ez az adatvédelmi tájékoztató tájékoztatást nyújt arról, hogy a weboldalunk (a továbbiakban: "Weboldal") milyen adatokat gyűjt és hogyan kezeli azokat.</p>
			<h3>2. Milyen adatokat gyűjtünk?</h3>
			<p>A Weboldal nem gyűjt és nem tárol személyes adatokat a látogatóiról. Az oldal kizárólag információs céllal működik, és nem használ regisztrációs rendszert vagy felhasználói fiókokat.</p>
			<h3>3. Google Fonts használata</h3>
			<p>A Weboldal betűtípusokat tölt be a Google Fonts szolgáltatásból. A Google Fonts a betűtípusokat közvetlenül a Google szervereiről tölti be, amelynek során a látogatók IP-címe továbbításra kerülhet a Google felé.</p>
			<p><a href="https://policies.google.com/privacy" target="_blank">Google adatvédelmi irányelvek</a></p>
			<h3>4. Sütik (Cookies)</h3>
			<p>A Weboldal nem használ sütiket.</p>
			<h3>5. Külső hivatkozások</h3>
			<p>Előfordulhat, hogy a Weboldal külső weboldalakra mutató hivatkozásokat tartalmaz. Ezekre az oldalakra a saját adatvédelmi szabályaik vonatkoznak, ezért javasoljuk, hogy mindig olvassa el az adott oldal adatvédelmi tájékoztatóját.</p>
			<h3>6. Webtárhelyszolgáltató (Hosting)</h3>
			<p>A Weboldal tárhelyszolgáltatója a Netlify, Inc. (székhely: 2325 3rd Street, Suite 215, San Francisco, CA 94107, USA). A Weboldalhoz kapcsolódó technikai infrastruktúrát a Netlify biztosítja, amelynek következtében a látogatók egyes adatai, például IP-címük és böngészőjük technikai adatai a Netlify szerverein kerülhetnek feldolgozásra.</p>
			<p><a href="https://www.netlify.com/privacy/" target="_blank">Netlify adatvédelmi irányelvek</a></p>
			<h3>7. Kapcsolat</h3>
			<p>Ha bármilyen kérdése van az adatvédelemmel kapcsolatban, az alábbi e-mail címen elérhet minket:</p>
			<p>✉ <a href="mailto:SAJATEMAIL@example.com">SAJATEMAIL@example.com</a>`
		);
	} else {
		showModal(
			'Privacy Policy',
			`
			<h3>1. Introduction</h3>
			<p>This Privacy Policy explains what data we collect and how we handle it on our website (the "Website").</p>
			<h3>2. What Data Do We Collect?</h3>
			<p>The Website does not collect or store any personal data from visitors. It operates solely for informational purposes and does not use registration systems or user accounts.</p>
			<h3>3. Use of Google Fonts</h3>
			<p>The Website loads fonts from Google Fonts. Google Fonts fetches the fonts directly from Google's servers, which may result in the transmission of the visitor's IP address to Google.</p>
			<p><a href="https://policies.google.com/privacy" target="_blank">Google Privacy Policy</a></p>
			<h3>4. Cookies</h3>
			<p>The Website does not use cookies.</p>
			<h3>5. External Links</h3>
			<p>The Website may contain links to external websites. These websites have their own privacy policies, so we recommend that you read their privacy notices.</p>
			<h3>6. Web Hosting Provider</h3>
			<p>The Website's hosting provider is Netlify, Inc. (headquartered at 2325 3rd Street, Suite 215, San Francisco, CA 94107, USA). The technical infrastructure for the Website is provided by Netlify, and as a result, some visitor data, such as IP address and browser technical information, may be processed on Netlify's servers.</p>
			<p><a href="https://www.netlify.com/privacy/" target="_blank">Netlify Privacy Policy</a></p>
			<h3>7. Contact</h3>
			<p>If you have any questions regarding privacy, you can reach us at the following email address:</p>
			<p>✉ <a href="mailto:SAJATEMAIL@example.com">SAJATEMAIL@example.com</a>`
		);
	}
});
// Terms link
document.getElementById('termsLink').addEventListener('click', function () {
	const lang = document.documentElement.lang;
	if (lang === 'hu') {
		showModal(
			'Felhasználási feltételek',
			`
        <h3>1. Bevezetés</h3>
        <p>Jelen felhasználási feltételek (a továbbiakban: „Feltételek”) szabályozzák a Burgonyagumó Betegségek weboldal (a továbbiakban: „Weboldal”) látogatóinak jogait és kötelezettségeit. A Weboldal használatával Ön elfogadja a jelen Feltételeket.</p>
        
        <h3>2. A Weboldal célja</h3>
        <p>A Weboldal kizárólag információs céllal működik, és a burgonyabetegségekkel kapcsolatos képeket és információkat tartalmaz. A Weboldalon elérhető tartalmak nem minősülnek szakmai vagy jogi tanácsadásnak.</p>

        <h3>3. Szerzői jogok és tartalomhasználat</h3>
        <p>A Weboldalon található képek jogvédettek, azok másolása, terjesztése vagy bármilyen módon történő felhasználása kizárólag a szerző írásbeli engedélyével történhet. A szöveges tartalmak szintén szerzői jogvédelem alatt állhatnak. Az oldalon található információk saját célra történő felhasználása engedélyezett, de üzleti vagy nyilvános felhasználás esetén előzetes engedély szükséges.</p>

        <h3>4. Külső hivatkozások</h3>
        <p>A Weboldalon külső weboldalakra mutató hivatkozások szerepelhetnek (például: Google Fonts, forrásanyagok). Nem vállalunk felelősséget ezek tartalmáért vagy adatkezelési gyakorlatáért.</p>

        <h3>5. Felelősség kizárása</h3>
        <p>A Weboldalon található információk tájékoztató jellegűek, pontosságukért vagy aktualitásukért felelősséget nem vállalunk. A Weboldal használatából eredő közvetlen vagy közvetett károkért semmilyen felelősséget nem vállalunk.</p>

        <h3>6. A feltételek módosítása</h3>
        <p>Fenntartjuk a jogot, hogy a jelen Feltételeket bármikor módosítsuk. A módosításokat a Weboldalon tesszük közzé, és azok a közzétételt követően azonnal hatályba lépnek.</p>
        <p>✉ <a href="mailto:SAJATEMAIL@example.com">SAJATEMAIL@example.com</a></p>
        `
		);
	} else {
		showModal(
			'Terms of Service',
			`
        <h3>1. Introduction</h3>
		<p>These Terms of Use (hereinafter referred to as the "Terms") govern the rights and obligations of visitors to the Potato Tuber Diseases website (hereinafter referred to as the "Website"). By accessing or using the Website, you acknowledge that you have read, understood, and agreed to be bound by these Terms.</p>

		<h3>2. Purpose of the Website</h3>
		<p>The Website is intended solely for informational purposes and provides images and information related to potato diseases. The content available on the Website does not constitute professional, medical, or legal advice and should not be relied upon as such.</p>
		
		<h3>3. Intellectual Property and Content Usage</h3>
		<p>All images and textual content on the Website are protected by copyright laws. Unauthorized reproduction, distribution, modification, or any other form of use is strictly prohibited without the prior written consent of the copyright owner. Content may be used for personal, non-commercial purposes; however, any commercial or public use requires express prior authorization.</p>
		
		<h3>4. External Links</h3>
		<p>The Website may contain links to third-party websites (e.g., Google Fonts, reference materials). These links are provided for informational purposes only, and we do not assume any responsibility for the content, privacy policies, or practices of such external sites.</p>
		
		<h3>5. Disclaimer of Liability</h3>
		<p>All information provided on the Website is for general informational purposes only. While we endeavor to ensure the accuracy and timeliness of the content, we do not guarantee its completeness or correctness. Under no circumstances shall we be held liable for any direct, indirect, incidental, or consequential damages arising from the use of, or reliance on, the information provided on the Website.</p>
		
		<h3>6. Amendments to the Terms</h3>
		<p>We reserve the right to modify these Terms at any time without prior notice. Any changes will be posted on the Website and will become effective immediately upon publication. Continued use of the Website after such modifications constitutes acceptance of the revised Terms.</p>
		<p>✉ <a href="mailto:SAJATEMAIL@example.com">SAJATEMAIL@example.com</a></p>
        `
		);
	}
});
