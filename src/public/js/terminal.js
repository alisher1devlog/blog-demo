// --- 1. ASOSIY HTML ELEMENTLARNI TOPISH ---
const terminalContainer = document.getElementById('terminal-container');
const outputContainer = document.getElementById('output-container');
const inputForm = document.getElementById('input-form');
const inputLine = document.getElementById('input-line');
const promptElement = document.querySelector('.prompt');
const bioContent = document.getElementById('bio-content');
const aboutMeContainer = document.getElementById('about-me-container');
const logContent = document.getElementById('log-content');


// --- 2. YORDAMCHI FUNKSIYALAR ---

/**
 * Terminalga (markaziy panel) matnli qator chiqaradi.
 */
function printToTerminal(text, isCommand = false) {
    const newLine = document.createElement('div');
    newLine.classList.add('output-line');

    if (isCommand) {
        const promptClone = promptElement.cloneNode(true);
        newLine.appendChild(promptClone);
        newLine.appendChild(document.createTextNode(text));
    } else {
        newLine.innerHTML = text; // HTML'ni render qilishga ruxsat beramiz
    }
    outputContainer.appendChild(newLine);
    outputContainer.scrollTop = outputContainer.scrollHeight;
}

/**
 * O'ng paneldagi (System Log) matnni yangilaydi.
 */
function printToLog(text) {
    const logLine = document.createElement('div');
    logLine.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    logContent.appendChild(logLine);
    logContent.scrollTop = logContent.scrollHeight;
}


// --- 3. BUYRUQLARNI QAYTA ISHLASH (ENG MUHIM QISM) ---

/**
 * Kiritilgan buyruq matnini tahlil qiladi va bajaradi.
 * Bu funksiya endi 'async' bo'lishi kerak, chunki biz 'fetch' (API so'rovlari)ni kutamiz.
 * @param {string} command - Foydalanuvchi kiritgan buyruq
 */
async function processCommand(command) {
    // 1. Kiritilgan buyruqni terminalga qayta chiqaramiz
    printToTerminal(command, true);
    
    const parts = command.toLowerCase().split(' ').filter(part => part.length > 0);
    const mainCommand = parts[0];
    const args = parts.slice(1);

    switch (mainCommand) {
        case 'help':
            printToTerminal("Mavjud buyruqlar ro'yxati:");
            printToTerminal("  <span class='command-highlight'>help</span>    - Ushbu yordam ro'yxatini ko'rsatish");
            printToTerminal("  <span class='command-highlight'>about</span>   - Muallif haqida ma'lumot (chap panelda)");
            printToTerminal("  <span class='command-highlight'>clear</span>   - Terminal ekranini tozalash");
            printToTerminal("  <span class'command-highlight'>ls</span>      - Barcha maqolalar ro'yxati");
            printToTerminal("  <span class='command-highlight'>cat [slug]</span> - Maqolani o'qish (masalan: cat birinchi-maqola)");
            break;

        case 'about':
            aboutMeContainer.innerHTML = `
                <h3>Alisher Yondoshaliyev</h3>
                <p>Node.js & Backend Developer.</p>
                <p>O'zbekistonda texnologiyalarni rivojlantirishga qiziqaman.</p>
                <p>---</p>
                <p>Bu matnni 'public/js/terminal.js' faylidan o'zgartirishingiz mumkin.</p>
            `;
            printToTerminal("Muallif haqidagi ma'lumot chap panelda ko'rsatildi.");
            break;

        case 'clear':
            outputContainer.innerHTML = '';
            printToTerminal("Terminal tozalandi.");
            break;

        // --- YANGI QO'SHILGAN BUYRUQLAR ---
        
        case 'ls':
            // "ls" (list) buyrug'i. Maqolalar ro'yxatini olamiz
            await handleLsCommand();
            break;

        case 'cat':
            // "cat" (concatenate) buyrug'i. Bitta maqolani o'qiymiz
            if (args.length === 0) {
                printToTerminal("<span style='color: #ff5555;'>Xato: 'cat' buyrug'i uchun maqola 'slug'ini ko'rsatishingiz kerak.</span>");
                printToTerminal("Masalan: cat birinchi-maqola");
            } else {
                await handleCatCommand(args[0]); // args[0] bu slug (masalan, "birinchi-maqola")
            }
            break;
        // ---------------------------------

        default:
            printToTerminal(`Xato: Buyruq topilmadi: <span style="color: #ff5555;">${command}</span>`);
            printToTerminal("Yordam uchun 'help' yozing.");
            break;
    }
}

// --- 4. API BILAN ISHLAYDIGAN FUNKSIYALAR ---

/**
 * 'ls' buyrug'ini bajaradi: API'dan maqolalar ro'yxatini oladi va chiqaradi.
 */
async function handleLsCommand() {
    printToTerminal("Maqolalar ro'yxatini yuklanmoqda...");
    try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
            throw new Error(`Server xatosi: ${response.statusText}`);
        }
        const articles = await response.json();

        if (articles.length === 0) {
            printToTerminal("Hozircha maqolalar mavjud emas.");
            return;
        }

        printToTerminal("Maqolalar ro'yxati (o'qish uchun 'cat [SLUG]' yozing):");
        // Maqolalarni chiroyli qilib chiqaramiz
        articles.forEach(article => {
            // Masalan:  birinchi-maqola   -   Mening birinchi maqolam
            const line = `  <span style='color: #00FFFF;'>${article.slug.padEnd(20)}</span> -   ${article.title}`;
            printToTerminal(line);
        });

    } catch (error) {
        printToTerminal(`<span style='color: #ff5555;'>Xatolik yuz berdi: ${error.message}</span>`);
    }
}

/**
 * 'cat [slug]' buyrug'ini bajaradi: API'dan bitta maqola oladi va chiqaradi.
 */
async function handleCatCommand(slug) {
    printToTerminal(`'${slug}' maqolasini yuklanmoqda...`);
    try {
        const response = await fetch(`/api/posts/${slug}`);
        
        if (response.status === 404) {
             printToTerminal(`<span style='color: #ff5555;'>Xato: '${slug}' nomli maqola topilmadi.</span>`);
             printToTerminal("Maqolalar ro'yxatini ko'rish uchun 'ls' yozing.");
             return;
        }
        if (!response.ok) {
            throw new Error(`Server xatosi: ${response.statusText}`);
        }
        
        const article = await response.json();

        // Maqolani chiroyli qilib chiqaramiz
        printToTerminal("--- Maqola boshi ---");
        printToTerminal(`\n<h2 style='color: #00FF00;'>${article.title}</h2>`);
        printToTerminal(`<span style='color: #888;'>Nashr qilindi: ${new Date(article.createdAt).toLocaleDateString('uz-UZ')}</span>\n`);
        
        // Maqola matnidagi \n (yangi qator) belgilarni <br> ga almashtiramiz
        const contentWithBreaks = article.content.replace(/\n/g, '<br>');
        printToTerminal(contentWithBreaks);
        
        printToTerminal("\n--- Maqola tugadi ---");

    } catch (error) {
        printToTerminal(`<span style='color: #ff5555;'>Xatolik yuz berdi: ${error.message}</span>`);
    }
}


// --- 5. HODISALARNI "ESHLASH" VA ILK YUKLASH ---

// Forma "submit" bo'lganda (Enter bosilganda)
inputForm.addEventListener('submit', async (e) => { // Endi bu ham 'async'
    e.preventDefault();
    const command = inputLine.value.trim();

    if (command) {
        // Input'ni bloklaymiz (ixtiyoriy, lekin yaxshi effekt)
        inputLine.disabled = true; 
        
        // Buyruqni bajarishni kutamiz
        await processCommand(command); 
        
        // Qayta yoqamiz
        inputLine.disabled = false; 
        inputLine.value = ''; // Tozalaymiz
        inputLine.focus(); // Qayta fokuslaymiz
    }
});

// Terminalning istalgan joyi bosilganda, input maydoni fokusga o'tishi
terminalContainer.addEventListener('click', (e) => {
    if (e.target.id !== 'input-line') {
        inputLine.focus();
    }
});

// O'ng panel uchun "System Log" generatori
setInterval(() => {
    const logs = [
        "Sessiya tekshirilmoqda...", "User 'guest' ulandi.", "Protsessor: 2% yuklanish.",
        "Xotira: 15% foydalanildi.", "Tarmoq: Stabil.", "Ma'lumotlar bazasi bilan aloqa o'rnatildi."
    ];
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    printToLog(randomLog);
}, 3000);

// Sahifa yuklanganda fokusni input'ga o'tkazish
inputLine.focus();