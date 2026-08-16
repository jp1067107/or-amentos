const P = 350000;
const W = 1000;
const r_annual = 0.08;
const r_m = Math.pow(1 + r_annual, 1/12) - 1;

let balance = P;
let total_interest = 0;
let total_withdrawn = 0;

for (let i=0; i<12; i++) {
    const interest = balance * r_m;
    total_interest += interest;
    balance += interest;
    balance -= W;
    total_withdrawn += W;
}

console.log("Balance:", balance);
console.log("Total Withdrawn:", total_withdrawn);
console.log("Total Interest:", total_interest);

let balance2 = P;
let total_interest2 = 0;
const r_m2 = r_annual / 12;
for (let i=0; i<12; i++) {
    const interest = balance2 * r_m2;
    total_interest2 += interest;
    balance2 += interest;
    balance2 -= W;
}
console.log("Balance2:", balance2);
console.log("Total Interest2:", total_interest2);

