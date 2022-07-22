const dogs = [
    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
    { weight: 8, curFood: 200, owners: ['Matilda'] },
    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
    { weight: 32, curFood: 340, owners: ['Michael'] },
];

/*
1. Loop over the 'dogs' array containing dog objects, and for each dog,calculate the recommended food portion and add it to the object as a new property. Do not create a new array, simply loop over the array. 

Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
*/

const recommendedFoodPortion = dogs.forEach(
    dog => {
        dog.recomendedFood = Math.round((dog.weight ** 0.75 * 28) * 100) / 100;
        dog.rationLowerLimit = Math.round((dog.recomendedFood * .90) * 100) / 100;
        dog.rationUpperLimit = Math.round((dog.recomendedFood * 1.1) * 100) / 100;
        // console.log(dog);
    }
);

console.log(dogs);

/*
2. Find Sarah's dog and log to the console whether it's eating too much or too little. Hint: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
*/

const lookForOwner = (ownerName) => dogs.forEach(dog => {
    if (dog.owners.includes(ownerName)) {
        // console.log(dog.owners);
        // console.log(dog.curFood);
        if (dog.curFood > dog.rationUpperLimit) {
            console.log(`Dog is eating too much`);
        } else if (dog.curFood < dog.rationLowerLimit) {
            console.log(`Dog is needs to a larger food ration`);
        } else console.log(`Food ration is GOOD !!!!!`);
    }
});

lookForOwner('Sarah');

/*
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
*/

const ownersEatTooMuch = [];
const ownersEatTooLittle = [];

const seprateOwners = dogs.map(dog => {
    // console.log(dog);
    if (dog.curFood > dog.rationUpperLimit) {
        ownersEatTooMuch.push(dog.owners)
    } else if (dog.curFood < dog.rationLowerLimit) {
        ownersEatTooLittle.push(dog.owners)
    }
});

console.log(ownersEatTooLittle);
console.log(ownersEatTooMuch);

// 4. Log a string to the console for each array created in 3.,like this:"Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

const flatenOwnerEatingTooMuch = ownersEatTooMuch.flat().reduce(
    (accumulator, currentValue) => accumulator.concat(` and ` + currentValue)
);

const flatenOwnerEatingTooLittle = ownersEatTooLittle.flat().reduce(
    (accumulator, currentValue) => accumulator.concat(` and ` + currentValue)
);

console.log(flatenOwnerEatingTooMuch + `'s dogs eat too much!`);
console.log(flatenOwnerEatingTooLittle + `'s dogs eat too little!`);

// 5. Log to the console whether there is any dog eating exactly the amount of food that is recommended (just true or false)

const perfectDog = dogs.some(dog => {
    dog.curFood === dog.recomendedFood;
});
console.log(perfectDog);

// 6. Log to the console whether there is any dog eating an okay amount of food (just true or false)

const okDog = dogs.some(dog =>
    (dog.curFood >= dog.rationLowerLimit) && (dog.curFood <= dog.rationUpperLimit)
);
console.log(okDog);

// 7. Create an array containing the dogs that are eating an okay amount of food(try to reuse the condition used in 6.)

const okDogArray = dogs.filter(dog =>
    (dog.curFood >= dog.rationLowerLimit) && (dog.curFood <= dog.rationUpperLimit)
);
console.log(okDogArray);

// 8. Create a shallow copy of the 'dogs' array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects 😉)

const sortedRecomFood = dogs.slice().sort((a, b) =>
    a.recomendedFood - b.recomendedFood
);

console.log(sortedRecomFood);