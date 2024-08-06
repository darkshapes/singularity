function charCount(text) {
    let charNum = 0;
    for (let i = 0; i < text.length; i++) {
        charNum++;
    }
    return charNum; // number of total characters
}

const wordCount = (text) => {
    let wordNum = 0;
    const words = text.split(' ');
    wordNum = words.length;
     
    return wordNum; // number of total words
};
