// console.log('test');

let data1 = [5, 2, 4, 1, 15, 8, 3]
let data2 = [16, 6, 10, 5, 6, 1, 4]

function calcAverageHumanAge(ages) {
    // console.log(ages);
    const humanYears = ages.map(dogAge => {
        return dogAge <= 2 ? 2 * dogAge : 16 + (dogAge * 4);
    });
    // console.log(humanYears);

    const adultDogs = humanYears.filter(dogHumanYears => dogHumanYears >= 18);
    console.log(adultDogs);

    const averageHumanAge = adultDogs.reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

    return averageHumanAge
}

console.log(calcAverageHumanAge(data1));
console.log(calcAverageHumanAge(data2));