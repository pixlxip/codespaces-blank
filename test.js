let x = 1;
const changeVar = (a, b) => {
    a[0] = b;
}
changeVar([x], 1000000000000000);
console.log(x);