let compliantText = `- One
    - A
    - B
    - C
- Two
    - D
    - E
    - F
- Three
    - G
    - H
    - I
- Four
    - J
    - K
    - L`;

let nonCompliantText = `One`;

let theeLevelText = `- One
    - A
        - 1
        - 2
    - B
    - C
- Two
    - D
    - E
    - F
- Three
    - G
    - H
    - I
- Four
    - J
    - K
    - L`;

let partialMatchText = `### Title
- One
    - A
        - 1
        - 2
    - B
    - C
- Two
    - D
    - E
    - F
- Three
    - G
    - H
    - I
- Four
    - J
    - K
    - L`;

let matchWithMixedLists = `- One
    - A
    - B
    - C
- Two
- Three
    - G
    - H
    - I
- Four
    - J
    - K
    - L`;

console.log("------COMPLIANT------\n" + sortTwoLevelList(compliantText));
console.log("------NON-COMPLIANT------\n" + sortTwoLevelList(nonCompliantText));
console.log("------THREE LEVEL------\n" + sortTwoLevelList(theeLevelText));
console.log("------PARTIAL MATCH------\n" + sortTwoLevelList(partialMatchText));
console.log("------MIXED LISTS------\n" + sortTwoLevelList(matchWithMixedLists));
function sortTwoLevelList(text: string): string {
    const regex = /^-.+\n(\s+-.+\n*)*/gm;

    // Make sure selection contains only a list
    let foundIndex = text.search(regex);
    let textArray = text.match(regex);

    if (foundIndex === 0 && textArray) {
        let trimmed = textArray.map(element => element.trim()).sort();
        return trimmed.join("\n");
    }

    console.log("No match found, only select a list");
    return text;
}
 