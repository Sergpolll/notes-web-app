const fs = require('fs');
const path = require('path');

const updates = {
    '2026-03-12': 'Коли Бог каже «стій»: уроки очікування в пустелі.',
    '2026-03-13': 'Пахощі любі для Господа: щоденне посвячення.',
    '2026-03-14': 'Найкраща частка, яка ніколи не відбереться.',
    '2026-03-15': 'Навіть найменший гріх має значення: уроки святості.',
    '2026-03-18': 'Християнство без зусиль: небезпечна ілюзія.',
    '2026-03-19': 'Посвячення після провалу: дивовижне прощення Бога.',
    '2026-03-20': 'Зустріч з величчю: коли слова стають зайвими.',
    '2026-03-21': '«Я освячуся в тих, хто наближається до Мене».',
    '2026-03-31': 'Благодать і зрада за одним столом: парадокси вечері.',
    '2026-04-11': 'Синдром Єгипту: чому Боже благословення стає «прісним».',
    '2026-05-02': 'Чому ми бачимо підступ там, де діє Божа любов.',
    '2026-05-07': 'Безумовна любов і умовні благословення.',
    '2026-05-08': 'Ілюзія власної праведності: хто насправді в центрі?',
    '2026-05-09': 'Головний секрет послуху: просто любити Його.',
    '2026-05-10': 'Радість послуху: коли Божі правила стають своїми.',
    '2026-05-11': 'Чудеса чи Істина: що важливіше для твого серця?'
};

const rootDir = 'D:\\Гугл Диск\\Полякевич\\Нужное\\Obsidian\\1_Morning_Readings\\2026';

for (const [date, newTopic] of Object.entries(updates)) {
    const folderName = `Morning_Reading_${date.replace(/-/g, '_')}`;
    const essayPath = path.join(rootDir, folderName, `Essay_${date.replace(/-/g, '_')}.md`);
    const morningPath = path.join(rootDir, folderName, `${folderName}.md`);
    
    let targetPath = null;
    if (fs.existsSync(essayPath)) targetPath = essayPath;
    else if (fs.existsSync(morningPath)) targetPath = morningPath;
    
    if (targetPath) {
        let content = fs.readFileSync(targetPath, 'utf-8');
        // Replace topic field even if there are no quotes
        content = content.replace(/topic:\s*.*/, `topic: "${newTopic}"`);
        fs.writeFileSync(targetPath, content, 'utf-8');
        console.log(`Updated ${date}`);
    } else {
        console.log(`File not found for ${date}`);
    }
}
