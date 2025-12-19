export function isAnswerCorrect(userAns, correctAns) {
    if (!userAns || !correctAns) return false;
    const clean = (str) => String(str).toLowerCase().replace(/^[\w\d]+[\)\.]\s*/, '').replace(/[^\w]/g, '').trim();
    const u = clean(userAns);
    const c = clean(correctAns);
    return u === c || u.includes(c) || c.includes(u);
}

export function calculateRewards(mission, finalScore) {
    const total = mission.tasks.length;
    const percentage = total > 0 ? (finalScore / total) : 0;
    
    let stars = 1;
    if (percentage === 1) stars = 3; 
    else if (percentage >= 0.5) stars = 2;
    
    const xpEarned = (mission.xpReward || 10) + (finalScore * 2);
    return { stars, xpEarned };
}

export function generateAiPrompt(task) {
    if (task.type === 'theory') {
        return `I am reading a lesson about: "${task.content}". Can you explain this to me in a fun, simple way?`;
    }
    return `I am stuck on this quiz question: "${task.question}". The options are ${JSON.stringify(task.options)}. Can you give me a helpful hint without giving the answer?`;
}