// console.log("hello world")

// //Types of Variables
// let age = 25
// console.log(age)

// const sal = 1000
// console.log(sal)

// //cannot change the value of const variable

// //Primitive data types: String, number, boolean, undefined, null, BigInt, Symbol
// //Non-Primitive data types: Objects

// const name = "Vishwas"
// const name1 = 'Payal'
// const name2 = `duck`

// console.log(name)
// console.log(name1)
// console.log(name2)

// const total = 0
// const PI = 3.14

// const isPrimarynumber = true
// const isNewUser = false

// //important
// let result
// console.log(result)

// const res = undefined

// const data = null

// //object
// const person ={
//     firstName : 'Payal',
//     lastName : 'Makwana',
//     age : 30
// }

// console.log(person.age)

// //arrays
// const nums = [1,3,5,7,9]
// console.log(nums[0])

//operators: assignment, logical, comparison, arithmetic, string, other

//type conversion
//implicit or coersion
// console.log('2' + 3)
// console.log(true+'3')
// console.log('4' - '2')
// console.log('Bruce'+'wayne')
// console.log('Bruce'-'wayne')
// console.log('5' - false)
// console.log('5' - true)
// console.log('5' - null)
// console.log('5' - undefined)

// //explicit
// console.log(parseFloat('3.14'))
// console.log((500).toString())
// console.log(String(500))
// console.log(String(true))
// console.log(String(null))
// console.log(Boolean(10)) //(null undefined 0 '' NaN) will return false
// console.log(Boolean(null))

// const var1 = '10' //check for null
// const var2 = 10 //undefined

// console.log(var1 == var2)
// console.log(var1 === var2)

//loops : for loop, while loop, do-while loop, for of loop

// const nums = [1,2,3,4]
// for(let i = 0; i < nums.length; i++){
//     console.log(i + ' ');
// }

const add = (a,b) => a+b;

const sum = add(20,30);
console.log(sum)

//Scope: Block scope, Function scope, Global scope
//Block Scope
if(true){
    const myName = 'Payal'
    console.log(myName)
}

//Function Scope
function testfunc(){
    const myName = 'Batman'
    console.log(myName)
}
testfunc()

//Global Scope
