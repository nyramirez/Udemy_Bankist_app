const Data1 = [5, 2, 4, 1, 15, 8, 3];
const Data2 = [16, 6, 10, 5, 6, 1, 4];

// console.log(Data1);
// console.log(Data2);

// My solution is incorrect
/*
function calcAverageHumanAge(ages) {
    const humanYearsLessThanTwo = ages
        .filter(age => age <= 2)
        .map(age => age * 2);
    // console.log(humanYearsLessThanTwo);

    const humanYearsMoreThanTwo = ages
        .filter(age => age > 2)
        .map(age => 16 + age * 4);
    // console.log(humanYearsMoreThanTwo);

    const mergedArray = [...humanYearsLessThanTwo, ...humanYearsMoreThanTwo]
    // console.log(mergedArray);

    const aveAge = mergedArray.filter(age => age < 18).reduce((acc, curr) => acc + curr, 0) / mergedArray.length;

    return aveAge
}

console.log(calcAverageHumanAge(Data1));
*/

// Instructor Solution is correct
const calcAverageHumanAge = ages =>
    ages.map(dogAge => dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4)
        .filter(dogAge => dogAge >= 18)
        .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

const avg1 = calcAverageHumanAge(Data1);
const avg2 = calcAverageHumanAge(Data2);

console.log("Data 1 AVG = " + avg1, ", Data 2 AVG = " + avg2);
