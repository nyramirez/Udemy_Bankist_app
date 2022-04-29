// console.log('test');

julia1 = [3, 5, 2, 12, 7]
kate1 = [4, 1, 15, 8, 3]
julia2 = [9, 16, 6, 8, 3]
kate2 = [10, 5, 6, 1, 4]

function checkDogs(dogsJulia, dogsKate) {
    correctedDogsJulia = dogsJulia.slice(1, 3);
    console.log(correctedDogsJulia);

    completeData = correctedDogsJulia.concat(dogsKate);
    console.log(completeData);

    completeData.forEach(adultCheck);
    function adultCheck(val, i) {
        if (val >= 3) {
            console.log(`Dog number ${i + 1} is an adult, and is ${val} years old`);
        } else {
            console.log(`Dog number ${i + 1} is still a puppy`);
        };
    }
};

checkDogs(julia1, kate1);
checkDogs(julia2, kate2);