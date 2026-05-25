const fs = require('fs');
const path = require('path');

const updates = {
    '2026-05-12': 'Десятина: Як навчитися шанувати Бога.',
    '2026-05-13': 'Небезпека прихованого гріха: стережи своє серце.',
    '2026-05-14': 'Коли Бог кличе туди, де страшно.',
    '2026-05-15': 'Сила постійної молитви: приклад Корнилія.',
    '2026-05-16': 'Міста сховища та Божа суверенність.',
    '2026-05-17': 'Як власні упередження заважають бачити дію Бога.',
    '2026-05-18': 'Світло у темряві: Боже втручання в безнадійність.',
    '2026-05-19': 'Покликані бути інакшими.',
    '2026-05-20': 'Божа справедливість не має улюбленців.',
    '2026-05-22': 'Писати «дуже виразно»: чому Слово потребує ясності.'
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
